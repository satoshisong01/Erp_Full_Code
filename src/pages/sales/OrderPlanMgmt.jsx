import React, { useContext, useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import ApprovalForm from "components/form/ApprovalForm";
import ReactDataTable from "components/DataTable/ReactDataTable";
import { PageContext } from "components/PageProvider";
import { locationPath } from "constants/locationPath";
import { axiosFetch, axiosPost } from "api/axiosFetch";
import ReactDataTableURL from "components/DataTable/ReactDataTableURL";
import { ChangePrmnPlanData } from "components/DataTable/function/ChangePrmnPlanData";
import RefreshButton from "components/button/RefreshButton";
import { columns } from "constants/columns";
import ReactDataTablePdorder from "components/DataTable/ReactDataTablePdorder";

/** 영업관리-수주계획관리 */
function OrderPlanMgmt() {
    const {
        isSaveFormTable,
        setIsSaveFormTable,
        currentPageName,
        projectInfo,
        setProjectInfo,
        innerPageName,
        setPrevInnerPageName,
        setInnerPageName,
        setCurrentPageName,
    } = useContext(PageContext);
    const orderPlanMgmtTable1 = useRef(null);
    const orderPlanMgmtTable2 = useRef(null);
    const orderPlanMgmtTable3 = useRef(null);
    const orderPlanMgmtTable4 = useRef(null);
    const orderPlanMgmtTable5 = useRef(null);
    const [prmnPlanDatas, setPrmnPlanDatas] = useState([]); // 인건비
    const [pjbudgetDatas, setPjbudgetDatas] = useState([]); // 경비
    const [pdOrdrDatas, setPdOrdrDatas] = useState([]); // 구매(재료비)
    const [outsourcingDatas, setOutsourcingDatas] = useState([]); // 개발외주비
    const [generalExpensesDatas, setGeneralExpensesDatas] = useState([]); // 영업관리비

    useEffect(() => {
        setInnerPageName("인건비");
        setCurrentPageName(""); //inner와 pageName은 동시에 사용 X

        return () => {
            // 컴포넌트 종료
            setProjectInfo({}); // 초기화
        };
    }, []);

    useEffect(() => {
        if (projectInfo.poiId) {
            fetchAllData();
        }
        if (currentPageName === "수주계획관리") {
            const activeTab = document.querySelector(".mini_board_1 .tab li a.on");
            const activeTabText = activeTab.textContent;
            setInnerPageName(activeTabText); //마지막으로 활성화 된 탭
        }
    }, [currentPageName, innerPageName, projectInfo]);

    const changeTabs = (task) => {
        if (task !== innerPageName) {
            //다른 페이지의 버튼 변경 막기
            setIsSaveFormTable(true);
        }
        setInnerPageName((prev) => {
            setCurrentPageName("");
            setPrevInnerPageName(prev);
            return task;
        });
    };

    const division = (value1, value2) => {
        if (!value1 || !value2) {
            return 0;
        }
        return Math.round(value1 / value2);
    };

    const refresh = () => {
        fetchAllData();
    };

    const fetchAllData = async () => {
        try {
            // console.log("❗❗❗❗fetchAllData");
            let requestData = { poiId: projectInfo.poiId, useAt: "Y" };
            if (innerPageName === "인건비") {
                const resultData = await axiosFetch("/api/baseInfrm/product/prmnPlan/totalListAll.do", requestData);
                setPrmnPlanDatas(ChangePrmnPlanData(resultData, projectInfo));
            } else if (innerPageName === "경비") {
                const resultData = await axiosFetch("/api/baseInfrm/product/pjbudget/totalListAll.do", requestData);
                console.log(resultData, "resultData 이건나오잖아");
                const filteredData = resultData.filter((data) => {
                    return ["EXPNS01", "EXPNS02", "EXPNS03", "EXPNS04", "EXPNS05", "EXPNS06"].includes(data.pjbgTypeCode);
                });
                console.log(filteredData, "filteredData");
                setPjbudgetDatas(filteredData);
            } else if (innerPageName === "구매(재료비)") {
                if (projectInfo.poiId && projectInfo.poId) {
                    requestData = { searchCondition: "", searchKeyword: "", poiId: projectInfo.poiId, modeCode: "SLSP", poId: projectInfo.poId };
                    const resultData = await axiosFetch("/api/baseInfrm/product/buyIngInfo/totalListAll.do", requestData);
                    const updatedData = resultData.map((row) => {
                        const {
                            byQunty, // 수량
                            consumerPrice, // 소비자단가
                            consumerAmount, // 소비자금액
                            unitPrice, // 단가
                            planAmount, // 금액
                            byUnitPrice, // 원단가
                            estimatedCost, // 원가
                            plannedProfits, // 이익금
                            plannedProfitMargin, // 이익률
                            byStandardMargin, // 구매-기준이익률
                            byConsumerOutputRate, // 구매-소비자가산출률
                        } = {
                            ...row,
                            consumerPrice: row.consumerPrice ? row.consumerPrice : 0,
                            byStandardMargin: row.byStandardMargin ? row.byStandardMargin : 0,
                            byConsumerOutputRate: row.byConsumerOutputRate ? row.byConsumerOutputRate : 0,
                        };
                        // 1.원가(견적가) : 수량 * 원단가
                        const updatedEstimatedCost = estimatedCost ? estimatedCost : byQunty * byUnitPrice;
                        // 2.단가 : 원가(견적가) / (1 - 사전원가기준이익율)
                        const updatedUnitPrice = unitPrice ? unitPrice : division(updatedEstimatedCost, 1 - byStandardMargin / 100);
                        // 3.금액 : 수량 * 단가
                        const updatedPlanAmount = planAmount ? planAmount : byQunty * updatedUnitPrice;
                        // 4.소비자단가 : 단가 / 소비자산출율
                        const updatedConsumerPrice = consumerPrice ? consumerPrice : division(updatedUnitPrice, byConsumerOutputRate);
                        // 5.소비자금액 : 수량 * 소비자단가
                        const updatedConsumerAmount = consumerAmount ? consumerAmount : byQunty * updatedConsumerPrice;
                        // 6.이익금 : 금액 - 원가(견적가)
                        const updatedPlannedProfits = plannedProfits ? plannedProfits : updatedPlanAmount - updatedEstimatedCost;
                        // 7.이익률 : 이익금 / 금액
                        const updatedPlannedProfitMargin = plannedProfitMargin ? plannedProfitMargin : division(updatedPlannedProfits, updatedPlanAmount);

                        return {
                            ...row,
                            estimatedCost: Math.round(updatedEstimatedCost),
                            unitPrice: Math.round(updatedUnitPrice),
                            planAmount: Math.round(updatedPlanAmount),
                            consumerPrice: Math.round(updatedConsumerPrice * 100),
                            consumerAmount: Math.round(updatedConsumerAmount * 100),
                            plannedProfits: Math.round(updatedPlannedProfits),
                            plannedProfitMargin: Math.round(updatedPlannedProfitMargin * 100),
                            byStandardMargin: Math.round(byStandardMargin),
                            byConsumerOutputRate: Math.round(byConsumerOutputRate),
                        };
                    });
                    setPdOrdrDatas(updatedData);
                } else {
                    setPdOrdrDatas([]);
                }
            } else if (innerPageName === "개발외주비") {
                requestData = { poiId: projectInfo.poiId, modeCode: "SLSP", pjbgTypeCode: "EXPNS10", useAt: "Y" };
                const resultData = await axiosFetch("/api/baseInfrm/product/pjbudget/totalListAll.do", requestData);
                setOutsourcingDatas(resultData);
            } else if (innerPageName === "영업관리비") {
                const resultData = await axiosFetch("/api/baseInfrm/product/pjbudget/totalListAll.do", requestData);
                const filteredData = resultData.filter((data) => {
                    return ["EXPNS07", "EXPNS08", "EXPNS09"].includes(data.pjbgTypeCode);
                });
                setGeneralExpensesDatas(filteredData);
            }
        } catch (error) {
            console.error("데이터를 가져오는 중에 오류 발생:", error);
        }
    };

    return (
        <>
            <Location pathList={locationPath.OrderPlanMgmt} />
            <div className="common_board_style mini_board_1">
                <ul className="tab">
                    <li onClick={() => changeTabs("인건비")}>
                        <a href="#인건비" className="on">
                            인건비
                        </a>
                    </li>
                    <li onClick={() => changeTabs("구매(재료비)")}>
                        <a href="#구매(재료비)">구매(재료비)</a>
                    </li>
                    <li onClick={() => changeTabs("개발외주비")}>
                        <a href="#개발외주비">개발외주비</a>
                    </li>
                    <li onClick={() => changeTabs("경비")}>
                        <a href="#경비">경비</a>
                    </li>
                    <li onClick={() => changeTabs("영업관리비")}>
                        <a href="#영업관리비">영업관리비</a>
                    </li>
                </ul>

                <div className="list">
                    <div className="first">
                        <ul>
                            <ApprovalForm title={innerPageName + " 계획 등록"}>
                                <div className="table-buttons">
                                    <RefreshButton onClick={refresh} />
                                </div>
                                <ReactDataTable
                                    columns={columns.orderPlanMgmt.labor}
                                    flag={innerPageName === "인건비" && isSaveFormTable}
                                    tableRef={orderPlanMgmtTable1}
                                    customDatas={prmnPlanDatas}
                                    viewPageName="인건비"
                                    customDatasRefresh={refresh}
                                    hideCheckBox={true}
                                />
                            </ApprovalForm>
                        </ul>
                    </div>
                    <div className="second">
                        <ul>
                            <ApprovalForm title={innerPageName + " 계획 등록"}>
                                <div className="table-buttons">
                                    <RefreshButton onClick={refresh} />
                                </div>
                                <ReactDataTablePdorder
                                    singleUrl="/baseInfrm/product/buyIngInfo"
                                    columns={columns.orderPlanMgmt.purchase}
                                    tableRef={orderPlanMgmtTable2}
                                    customDatas={pdOrdrDatas}
                                    viewPageName="구매(재료비)"
                                    customDatasRefresh={refresh}
                                    hideCheckBox={true}
                                />
                            </ApprovalForm>
                        </ul>
                    </div>

                    <div className="third">
                        <ul>
                            <ApprovalForm title={innerPageName + " 계획 등록"}>
                                <div className="table-buttons">
                                    <RefreshButton onClick={refresh} />
                                </div>
                                <ReactDataTableURL
                                    singleUrl="/baseInfrm/product/pjbudget"
                                    columns={columns.orderPlanMgmt.outsourcing}
                                    tableRef={orderPlanMgmtTable3}
                                    customDatas={outsourcingDatas}
                                    viewPageName="개발외주비"
                                    customDatasRefresh={refresh}
                                    hideCheckBox={true}
                                />
                            </ApprovalForm>
                        </ul>
                    </div>

                    <div className="fourth">
                        <ul>
                            <ApprovalForm title={innerPageName + " 계획 등록"}>
                                <div className="table-buttons">
                                    <RefreshButton onClick={refresh} />
                                </div>
                                <ReactDataTableURL
                                    singleUrl="/baseInfrm/product/pjbudget"
                                    columns={columns.orderPlanMgmt.expenses}
                                    tableRef={orderPlanMgmtTable4}
                                    customDatas={pjbudgetDatas}
                                    viewPageName="경비"
                                    customDatasRefresh={refresh}
                                    hideCheckBox={true}
                                />
                            </ApprovalForm>
                        </ul>
                    </div>

                    <div className="fifth">
                        <ul>
                            <ApprovalForm title={innerPageName + " 계획 등록"}>
                                <div className="table-buttons">
                                    <RefreshButton onClick={refresh} />
                                </div>
                                <ReactDataTableURL
                                    columns={columns.orderPlanMgmt.generalExpenses}
                                    singleUrl="/baseInfrm/product/pjbudget"
                                    tableRef={orderPlanMgmtTable5}
                                    customDatas={generalExpensesDatas}
                                    viewPageName="영업관리비"
                                    customDatasRefresh={refresh}
                                    hideCheckBox={true}
                                />
                            </ApprovalForm>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}

export default OrderPlanMgmt;
