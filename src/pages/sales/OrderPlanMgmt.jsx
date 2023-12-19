import React, { useContext, useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import ReactDataTable from "components/DataTable/ReactDataTable";
import { PageContext } from "components/PageProvider";
import { locationPath } from "constants/locationPath";
import { axiosDelete, axiosFetch, axiosPost, axiosUpdate } from "api/axiosFetch";
import ReactDataTableURL from "components/DataTable/ReactDataTableURL";
import { ChangePrmnPlanData, buyIngInfoCalculation } from "components/DataTable/function/ReplaceDataFormat";
import RefreshButton from "components/button/RefreshButton";
import { columns } from "constants/columns";
import ReactDataTablePdorder from "components/DataTable/ReactDataTablePdorder";
import ApprovalFormSal from "components/form/ApprovalFormSal";
import HideCard from "components/HideCard";
import ReactDataTableView from "components/DataTable/ReactDataTableView";

/** 영업관리-계획관리 */
function OrderPlanMgmt() {
    const {
        currentPageName,
        innerPageName,
        setPrevInnerPageName,
        setInnerPageName,
        setCurrentPageName,
        projectInfo,
        setProjectInfo,
        versionInfo,
        setVersionInfo
    } = useContext(PageContext);
    const [prmnPlanDatas, setPrmnPlanDatas] = useState([]); // 인건비
    const [pjbudgetDatas, setPjbudgetDatas] = useState([]); // 경비
    const [pdOrdrDatas, setPdOrdrDatas] = useState([]); // 구매(재료비)
    const [outsourcingDatas, setOutsourcingDatas] = useState([]); // 개발외주비
    const [generalExpensesDatas, setGeneralExpensesDatas] = useState([]); // 영업관리비

    useEffect(() => {
        setInnerPageName("원가버전조회");
        setCurrentPageName(""); //inner와 pageName은 동시에 사용 X

        return () => {
            // 컴포넌트 종료 시
            setProjectInfo({}); // 초기화
            setVersionInfo({}); // 초기화
        };
    }, []);

    useEffect(() => {
        if (currentPageName === "계획관리") {
            const activeTab = document.querySelector(".mini_board_1 .tab li a.on");
            const activeTabText = activeTab.textContent;
            setInnerPageName(activeTabText); //마지막으로 활성화 된 탭
        }
    }, [currentPageName, innerPageName]);

    useEffect(() => {
        if (projectInfo.poiId && versionInfo.versionId) {
            fetchAllData(projectInfo.poiId, versionInfo.versionId)
        }
    }, [projectInfo, versionInfo, innerPageName]);

    const refresh = () => {
        if (projectInfo.poiId && versionInfo.versionId) {
            fetchAllData(projectInfo.poiId, versionInfo.versionId)
        }
    };

    const changeTabs = (task) => {
        setInnerPageName((prev) => {
            setCurrentPageName("");
            setPrevInnerPageName(prev);
            return task;
        });
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
                toAdd.poiId = projectInfo.poiId;

                for (let j = 1; j <= 13; j++) {
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
            for (let i = 1; i <= 13; i++) {
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

    const fetchAllData = async (poiId, versionId) => {
        const requestData = {poiId, versionId};
        try {
            if (innerPageName === "인건비") {
                const resultData = await axiosFetch("/api/baseInfrm/product/prmnPlan/totalListAll.do", requestData);
                setPrmnPlanDatas(ChangePrmnPlanData(resultData, requestData.poiId));
                console.log("😈영업-인건비:", requestData, resultData);

            } else if (innerPageName === "경비") {
                const resultData = await axiosFetch("/api/baseInfrm/product/pjbudget/totalListAll.do", requestData);
                setPjbudgetDatas(resultData);
                console.log("😈영업-경비:", resultData);

            } else if (innerPageName === "구매(재료비)") {
                const resultData = await axiosFetch("/api/baseInfrm/product/buyIngInfo/totalListAll.do", requestData);
                const calData = buyIngInfoCalculation(resultData);
                setPdOrdrDatas(calData);
                console.log("😈영업-구매비:", requestData, resultData);

            } else if (innerPageName === "개발외주비") {
                const resultData = await axiosFetch("/api/baseInfrm/product/devOutCost/totalListAll.do", requestData);
                setOutsourcingDatas(resultData);
                console.log("😈영업-개발외주비:", requestData, resultData);

            } else if (innerPageName === "영업관리비") {
                const resultData = await axiosFetch("/api/baseInfrm/product/slsmnExpns/totalListAll.do", requestData);
                setGeneralExpensesDatas(resultData);
                console.log("😈영업-영업관리비:", requestData, resultData);
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
                    <li onClick={() => changeTabs("원가버전조회")}>
                        <a href="#원가버전조회" className="on">원가버전조회</a>
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
                                <RefreshButton onClick={refresh}/>
                            </div>
                            <ReactDataTable
                                columns={columns.orderPlanMgmt.version}
                                customDatas={prmnPlanDatas}
                                viewPageName="원가버전조회"
                                customDatasRefresh={refresh}
                                hideCheckBox={true}
                            />
                        </ul>
                    </div>
                    <div className="second">
                        <ul>
                            <ApprovalFormSal viewPageName="인건비"/>
                            <HideCard title="합계" color="back-lightyellow">
                                {/* <ReactDataTableView /> */}
                            </HideCard>
                            <HideCard title="계획 등록/수정" color="back-lightblue">
                                <div className="table-buttons mg-b-m-30">
                                    <RefreshButton onClick={refresh} />
                                </div>
                                <ReactDataTable
                                    columns={columns.orderPlanMgmt.labor}
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
                            <ApprovalFormSal viewPageName="구매(재료비)"/>
                            <div className="table-buttons">
                                <RefreshButton onClick={refresh} />
                            </div>
                            <HideCard title="합계" color="back-lightyellow">
                                {/* <ReactDataTableView /> */}
                            </HideCard>
                            <HideCard title="계획 등록/수정" color="back-lightblue">
                                <ReactDataTablePdorder
                                    singleUrl="/baseInfrm/product/buyIngInfo"
                                    columns={columns.orderPlanMgmt.purchase}
                                    customDatas={pdOrdrDatas}
                                    viewPageName="구매(재료비)"
                                    customDatasRefresh={refresh}
                                    hideCheckBox={true}
                                />
                            </HideCard>
                        </ul>
                    </div>

                    <div className="fourth">
                        <ul>
                            <ApprovalFormSal viewPageName="개발외주비"/>
                            <div className="table-buttons">
                                <RefreshButton onClick={refresh} />
                            </div>
                            <HideCard title="합계" color="back-lightyellow">
                                {/* <ReactDataTableView /> */}
                            </HideCard>
                            <HideCard title="계획 등록/수정" color="back-lightblue">
                                <ReactDataTableURL
                                    singleUrl="/baseInfrm/product/pjbudget"
                                    columns={columns.orderPlanMgmt.outsourcing}
                                    customDatas={outsourcingDatas}
                                    viewPageName="개발외주비"
                                    customDatasRefresh={refresh}
                                    hideCheckBox={true}
                                />
                            </HideCard>
                        </ul>
                    </div>

                    <div className="fifth">
                        <ul>
                            <ApprovalFormSal viewPageName="경비"/>
                            <div className="table-buttons">
                                <RefreshButton onClick={refresh} />
                            </div>
                            <HideCard title="합계" color="back-lightyellow">
                                {/* <ReactDataTableView /> */}
                            </HideCard>
                            <HideCard title="계획 등록/수정" color="back-lightblue">
                                <ReactDataTableURL
                                    singleUrl="/baseInfrm/product/pjbudget"
                                    columns={columns.orderPlanMgmt.expenses}
                                    customDatas={pjbudgetDatas}
                                    viewPageName="경비"
                                    customDatasRefresh={refresh}
                                    hideCheckBox={true}
                                />
                            </HideCard>
                        </ul>
                    </div>

                    <div className="sixth">
                        <ul>
                            <ApprovalFormSal viewPageName="영업관리비"/>
                            <div className="table-buttons">
                                <RefreshButton onClick={refresh} />
                            </div>
                            <HideCard title="합계" color="back-lightyellow">
                                {/* <ReactDataTableView /> */}
                            </HideCard>
                            <HideCard title="계획 등록/수정" color="back-lightblue">
                                <ReactDataTableURL
                                    columns={columns.orderPlanMgmt.generalExpenses}
                                    singleUrl="/baseInfrm/product/pjbudget"
                                    customDatas={generalExpensesDatas}
                                    viewPageName="영업관리비"
                                    customDatasRefresh={refresh}
                                    hideCheckBox={true}
                                />
                            </HideCard>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}

export default OrderPlanMgmt;
