import React, { useContext, useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import ApprovalForm from "components/form/ApprovalForm";
import ReactDataTable from "components/DataTable/ReactDataTable";
import { PageContext } from "components/PageProvider";
import { locationPath } from "constants/locationPath";
import { axiosDelete, axiosFetch, axiosPost, axiosUpdate } from "api/axiosFetch";
import ReactDataTableURL from "components/DataTable/ReactDataTableURL";
import { ChangePrmnPlanData } from "components/DataTable/function/ChangePrmnPlanData";
import RefreshButton from "components/button/RefreshButton";
import { columns } from "constants/columns";
import ReactDataTablePdorder from "components/DataTable/ReactDataTablePdorder";
import ApprovalFormSal from "components/form/ApprovalFormSal";
import SearchList from "components/SearchList";
import HideCard from "components/HideCard";
import AddModModal from "components/modal/AddModModal";

/** 영업관리-수주계획관리 */
function OrderPlanMgmt() {
    const {
        isSaveFormTable,
        setIsSaveFormTable,
        currentPageName,
        innerPageName,
        setPrevInnerPageName,
        setInnerPageName,
        setCurrentPageName,
        unitPriceList,
        unitPriceListRenew,
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

    const [conditionInfo, setConditionInfo] = useState({
        version: "",
        poiId: "",
    }); //프로젝트와 버전 정보

    useEffect(() => {
        setInnerPageName("원가버전조회");
        setCurrentPageName(""); //inner와 pageName은 동시에 사용 X

        return () => {
            // 컴포넌트 종료
            // setProjectInfo({}); // 초기화
            //사전원가정보 초기화
        };
    }, []);

    useEffect(() => {
        if (currentPageName === "수주계획관리") {
            const activeTab = document.querySelector(".mini_board_1 .tab li a.on");
            const activeTabText = activeTab.textContent;
            setInnerPageName(activeTabText); //마지막으로 활성화 된 탭
        }
    }, [currentPageName, innerPageName]);

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

    //인건비용임
    const compareData = (originData, updatedData) => {
        const filterData = updatedData.filter((data) => data.pmpMonth); //pmpMonth가 없는 데이터 제외
        const originDataLength = originData ? originData.length : 0;
        const updatedDataLength = filterData ? filterData.length : 0;
        console.log(originData, "originData");
        console.log(updatedData, "updatedData");

        if (originDataLength > updatedDataLength) {
            //이전 id값은 유지하면서 나머지 값만 변경해주는 함수
            const updateDataInOrigin = (originData, updatedData) => {
                // 복제하여 새로운 배열 생성
                const updatedArray = [...originData];
                // updatedData의 길이만큼 반복하여 originData 갱신
                for (let i = 0; i < Math.min(updatedData.length, originData.length); i++) {
                    const updatedItem = updatedData[i];
                    updatedArray[i] = { ...updatedItem, pmpMonth: updatedArray[i].pmpMonth, pmpMonth2: updatedArray[i].pmpMonth2 };
                }
                return updatedArray;
            };

            const firstRowUpdate = updateDataInOrigin(originData, updatedData);
            console.log(firstRowUpdate, "firstRowUpdate🔥🔥");
            upDateChange(firstRowUpdate);
            updateList(firstRowUpdate);

            const originAValues = originData.map((item) => item.pmpId);
            const extraOriginData = originAValues.slice(updatedDataLength);
            const combinedAValues = extraOriginData.reduce((acc, current) => acc.concat(current), []);

            deleteList(combinedAValues);
        } else if (originDataLength === updatedDataLength) {
            upDateChange(filterData);
            updateList(filterData);
        } else if (originDataLength < updatedDataLength) {
            const toAdds = [];
            const addUpdate = [];
            for (let i = 0; i < originDataLength; i++) {
                addUpdate.push(filterData[i]);
            }
            updateList(addUpdate);

            for (let i = originDataLength; i < updatedDataLength; i++) {
                const toAdd = { ...filterData[i] };
                delete toAdd.total;
                delete toAdd.poiBeginDt1;
                toAdd.useAt = "Y";
                toAdd.deleteAt = "N";
                toAdd.poiId = conditionInfo.poiId;

                for (let j = 1; j <= 14; j++) {
                    if (toAdd[`pmpmmPositionCode${j}`] === null) {
                        toAdd[`pmpmmPositionCode${j}`] = 0;
                    }
                }

                toAdds.push(toAdd);
            }
            addList(toAdds);
        }
    };

    const addList = async (addNewData) => {
        const url = `/api/baseInfrm/product/prmnPlan/addList.do`;
        const resultData = await axiosPost(url, addNewData);
        if (resultData) {
            refresh();
        }
    };
    const updateList = async (toUpdate) => {
        console.log("❗updateList:", toUpdate);
        const url = `/api/baseInfrm/product/prmnPlan/editList.do`;
        const resultData = await axiosUpdate(url, toUpdate);
        if (resultData) {
            refresh();
        }
    };

    const deleteList = async (removeItem) => {
        const url = `/api/baseInfrm/product/prmnPlan/removeAll.do`;
        const resultData = await axiosDelete(url, removeItem);
        if (resultData) {
            refresh();
        }
    };

    // 초기 데이터와 수정된 데이터를 비교하는 함수
    //추가 함수
    const upDateChange = (data, originData) => {
        for (let index = 0; index < data.length; index++) {
            const item = data[index];

            // null 값을 0으로 변경
            for (let i = 1; i <= 14; i++) {
                const key = `pmpmmPositionCode${i}`;
                if (item[key] === null) {
                    item[key] = 0;
                }
            }

            // useAt이 없다면 "Y"로 설정
            if (!item.hasOwnProperty("useAt")) {
                item.useAt = "Y";
            }

            if (!item.hasOwnProperty("poiId")) {
                // item.poiId = projectInfo.poiId;
            }

            // deleteAt이 없다면 "N"로 설정
            if (!item.hasOwnProperty("deleteAt")) {
                item.deleteAt = "N";
            }

            // pmpMonth2가 없다면 값을 pmpMonth에서 가져옴
            if (!item.hasOwnProperty("pmpMonth2")) {
                item.pmpMonth2 = item.pmpMonth;
                item.pmpMonth = originData[index].pmpMonth;
            }
        }
    };

    const fetchAllData = async () => {
        try {
            let requestData = { poiId: conditionInfo.poiId, useAt: "Y" };
            if (innerPageName === "인건비") {
                const resultData = await axiosFetch("/api/baseInfrm/product/prmnPlan/totalListAll.do", requestData);
                const changeData = ChangePrmnPlanData(resultData, projectInfo);
                //console.log(resultData, "인건비값");
                //setPrmnPlanDatas(ChangePrmnPlanData(resultData, projectInfo));
                changeData.forEach((Item) => {
                    const yearFromPmpMonth = Item.pmpMonth.slice(0, 4);
                    const matchingAItem = unitPriceListRenew.find((aItem) => aItem.gupDesc === yearFromPmpMonth);

                    if (matchingAItem) {
                        let totalPrice = 0;

                        // Iterate over gupPrice and pmpmmPositionCode arrays
                        for (let i = 1; i <= 14; i++) {
                            const gupPriceKey = `gupPrice${i}`;
                            const pmpmmPositionCodeKey = `pmpmmPositionCode${i}`;

                            // Multiply corresponding values and add to totalPrice
                            totalPrice += matchingAItem[gupPriceKey] * Item[pmpmmPositionCodeKey];
                        }

                        // Add totalPrice to bItem
                        Item.totalPrice = totalPrice;
                    }
                    return setPrmnPlanDatas(changeData);
                });
            } else if (innerPageName === "경비") {
                const resultData = await axiosFetch("/api/baseInfrm/product/pjbudget/totalListAll.do", requestData);
                console.log(resultData, "resultData 이건나오잖아");
                const filteredData = resultData.filter((data) => {
                    return ["EXPNS01", "EXPNS02", "EXPNS03", "EXPNS04", "EXPNS05", "EXPNS06"].includes(data.pjbgTypeCode);
                });
                console.log(filteredData, "filteredData");
                setPjbudgetDatas(filteredData);
            } else if (innerPageName === "구매(재료비)") {
                if (conditionInfo.poiId) {
                    requestData = { searchCondition: "", searchKeyword: "", poiId: conditionInfo.poiId, modeCode: "SLSP" };
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
                requestData = { poiId: conditionInfo.poiId, modeCode: "SLSP", pjbgTypeCode: "EXPNS10", useAt: "Y" };
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

    const [isOpenAdd, setIsOpenAdd] = useState(false);
    const addVersionToServer = async (addData) => {
        console.log(addData);
        const url = `/api/baseInfrm/product/versionControl/add.do`;
        const dataToSend = {
            ...addData,
            lockAt: "Y",
            useAt: "Y",
            deleteAt: "N",
            //poiId: projectInfo.poiId,
        };

        console.log(dataToSend, "나오는값");
        const resultData = await axiosPost(url, dataToSend);
        console.log(resultData);
        if (resultData) {
            alert("추가되었습니다");
            refresh();
        } else {
            alert("error!");
        }
    };

    return (
        <>
            <Location pathList={locationPath.OrderPlanMgmt} />
            <div className="common_board_style mini_board_1">
                <ul className="tab">
                    <li
                        onClick={() => {
                            changeTabs("원가버전조회");
                            setIsOpenAdd(true);
                        }}>
                        <a href="#원가버전조회" className="on">
                            원가버전조회
                        </a>
                    </li>
                    <li onClick={() => changeTabs("인건비")}>
                        <a href="#인건비">인건비</a>
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
                            <div className="table-buttons">
                                <RefreshButton onClick={refresh} />
                            </div>
                            <ReactDataTable
                                columns={columns.orderPlanMgmt.version}
                                flag={innerPageName === "원가버전조회" && isSaveFormTable}
                                tableRef={orderPlanMgmtTable1}
                                customDatas={prmnPlanDatas}
                                viewPageName="원가버전조회"
                                customDatasRefresh={refresh}
                                hideCheckBox={true}
                            />
                            {isOpenAdd && (
                                <AddModModal
                                    width={500}
                                    height={250}
                                    list={columns.orderPlanMgmt.addMod}
                                    sendData={addVersionToServer}
                                    onClose={() => setIsOpenAdd(false)}
                                    title="버전 추가"
                                />
                            )}
                        </ul>
                    </div>
                    <div className="second">
                        <ul>
                            <ApprovalFormSal returnInfo={returnInfo} />
                            <HideCard title="합계" color="back-lightyellow" className="mg-b-40"></HideCard>
                            <HideCard title="계획 등록/수정" color="back-lightblue" className="mg-b-40">
                                <div className="table-buttons mg-b-m-30">
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
                            </HideCard>
                        </ul>
                    </div>
                    <div className="third">
                        <ul>
                            <ApprovalFormSal />
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
                        </ul>
                    </div>

                    <div className="fourth">
                        <ul>
                            <ApprovalFormSal />
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
                        </ul>
                    </div>

                    <div className="fifth">
                        <ul>
                            <ApprovalFormSal />
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
                        </ul>
                    </div>

                    <div className="sixth">
                        <ul>
                            <ApprovalFormSal />
                            <div>합계</div>

                            <div>계획 등록/수정</div>
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
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}

export default OrderPlanMgmt;
