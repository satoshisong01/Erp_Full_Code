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
import AddButton from "components/button/AddButton";
import ModButton from "components/button/ModButton";
import DelButton from "components/button/DelButton";
import AddModModal from "components/modal/AddModModal";
import SaveButton from "components/button/SaveButton";
import ReactDataTableDevCost from "components/DataTable/ReactDataTableDevCost";

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
        setVersionInfo,
        unitPriceListRenew,
        setNameOfButton,
    } = useContext(PageContext);
    const [searchDates, setSearchDates] = useState([]); // 인건비
    const [prmnPlanDatas, setPrmnPlanDatas] = useState([]); // 인건비
    const [pjbudgetDatas, setPjbudgetDatas] = useState([]); // 경비
    const [pdOrdrDatas, setPdOrdrDatas] = useState([]); // 구매(재료비)
    const [outsourcingDatas, setOutsourcingDatas] = useState([]); // 개발외주비
    const [generalExpensesDatas, setGeneralExpensesDatas] = useState([]); // 영업관리비

    const [selectedRows, setSelectedRows] = useState([]); //그리드에서 선택된 row 데이터

    useEffect(() => {
        console.log(prmnPlanDatas, "prmnPlanDatas");
    }, [prmnPlanDatas]);

    useEffect(() => {
        setInnerPageName("원가버전조회");
        setCurrentPageName(""); //inner와 pageName은 동시에 사용 X
        fetchAllData();
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
        if (innerPageName === "원가버전조회") {
            fetchAllData();
        }
        if (projectInfo.poiId && versionInfo.versionId) {
            fetchAllData(projectInfo.poiId, versionInfo.versionId);
        }
    }, [projectInfo, versionInfo, innerPageName]);

    const refresh = () => {
        if (projectInfo.poiId && versionInfo.versionId) {
            fetchAllData(projectInfo.poiId, versionInfo.versionId);
        }
    };

    const returnList = (originTableData, tableData) => {
        console.log(originTableData, tableData);
        console.log("projectInfo:", projectInfo, projectInfo.poiId);
        compareData(originTableData, tableData);
    };

    const changeTabs = (task) => {
        setInnerPageName((prev) => {
            setCurrentPageName("");
            setPrevInnerPageName(prev);
            return task;
        });
    };

    useEffect(() => {
        console.log(projectInfo);
        console.log(projectInfo.poiId);
    }, [projectInfo]);

    //인건비용임
    const compareData = (originData, updatedData) => {
        console.log(originData, "originData");
        console.log(updatedData, "updatedData");
        const filterData = updatedData.filter((data) => data.pmpMonth); //pmpMonth가 없는 데이터 제외
        const originDataLength = originData ? originData.length : 0;
        const updatedDataLength = filterData ? filterData.length : 0;

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
                toAdd.versionId = versionInfo.versionId;

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
        console.log(addNewData, "추가되는새기덜");
        const url = `/api/baseInfrm/product/prmnPlan/addList.do`;
        const resultData = await axiosPost(url, addNewData);
        if (resultData) {
            refresh();
        }
    };
    const updateList = async (toUpdate) => {
        console.log("❗updateList:", toUpdate);

        const updatedData = toUpdate.map((obj) => {
            const { pmpId, ...rest } = obj;
            return rest;
        });

        console.log("❗❗❗updateList:", updatedData);

        const url = `/api/baseInfrm/product/prmnPlan/editArrayList.do`;
        const resultData = await axiosUpdate(url, updatedData);
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
        if (data && originData) {
            console.log("안탐");
            return;
        }
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
                item.pmpMonth = originData && originData[index].pmpMonth;
            }
        }
    };

    const fetchAllData = async (poiId, versionId) => {
        const requestData = { poiId, versionId };
        const requestSearch = {
            searchCondition: "",
            searchKeyword: "",
        };
        try {
            if (innerPageName === "원가버전조회") {
                const resultData = await axiosFetch("/api/baseInfrm/product/versionControl/totalListAll.do", requestSearch);
                console.log(resultData, "원가버전조회 데이터");
                setSearchDates(resultData);
            } else if (innerPageName === "인건비") {
                console.log("인건비값!!!", requestData);
                const resultData = await axiosFetch("/api/baseInfrm/product/prmnPlan/totalListAll.do", requestData);
                const changeData = ChangePrmnPlanData(resultData, projectInfo.poiId);
                console.log("인건비 조회 완:", changeData);
                //setPrmnPlanDatas(ChangePrmnPlanData(resultData, projectInfo));
                changeData.forEach((Item) => {
                    const yearFromPmpMonth = Item.pmpMonth.slice(0, 4);
                    const matchingAItem = unitPriceListRenew.find((aItem) => aItem.year === yearFromPmpMonth);

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
                    console.log(changeData, "changeData이거왜 안나오지 💥💥💥");
                });
                setPrmnPlanDatas(changeData);
            } else if (innerPageName === "경비") {
                const resultData = await axiosFetch("/api/baseInfrm/product/pjbudget/totalListAll.do", requestData);
                setPjbudgetDatas(resultData);
                console.log("😈영업-경비:", resultData);
            } else if (innerPageName === "구매(재료비)") {
                const resultData = await axiosFetch("/api/baseInfrm/product/buyIngInfo/totalListAll.do", requestData);
                const calData = buyIngInfoCalculation(resultData);
                console.log("calData", calData);
                console.log("😈영업-구매비:💥💥💥💥", requestData, resultData);
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

    const [isOpenAdd, setIsOpenAdd] = useState(false);
    //const [isOpenSave, setIsOpenSave] = useState(false);

    const [isOpenUpDate, setIsOpenUpDate] = useState(false);

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

    //const deleteToServer = async () => {
    //    // 확인 대화상자 표시
    //    const shouldDelete = window.confirm(`🔥프로젝트 : [${poiNm}]🔥(❗번호:${poiId}) 프로젝트를 정말로 삭제하시겠습니까?`);
    //    if (shouldDelete) {
    //        // 사용자가 "확인"을 클릭하면 삭제 진행
    //        const url = `/api/baseInfrm/product/pjOrdrInfo/removeAll.do`;
    //        const resultData = await axiosDelete(url, poiId);

    //        // 필요한 경우 결과 처리
    //        if (resultData) {
    //            alert(`프로젝트[${poiNm}]이(가) 삭제되었습니다.`);
    //            // 성공적인 삭제 후 추가 작업 수행
    //            refresh();
    //        } else {
    //            alert(`프로젝트[${poiNm}] 삭제 중 오류가 발생했습니다.`);
    //        }
    //    } else {
    //        // 사용자가 "취소"를 클릭하면 아무 작업도 수행하지 않음
    //        alert(`프로젝트[${poiNm}] 삭제가 취소되었습니다.`);
    //    }
    //};

    return (
        <>
            <Location pathList={locationPath.OrderPlanMgmt} />
            <div className="common_board_style mini_board_1">
                <ul className="tab">
                    <li
                        onClick={() => {
                            changeTabs("원가버전조회");
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
                    <li onClick={() => changeTabs("견적용 인건비")}>
                        <a href="#견적용 인건비">견적용 인건비</a>
                    </li>
                    <li onClick={() => changeTabs("견적용 구매(재료비)")}>
                        <a href="#견적용 구매(재료비)">견적용 구매(재료비)</a>
                    </li>
                </ul>

                <div className="list">
                    <div className="first">
                        <ul>
                            <HideCard title="원가 버전 목록" color="back-lightblue" className="mg-b-40">
                                <div className="table-buttons">
                                    <AddButton label={"추가"} onClick={() => setIsOpenAdd(true)} />
                                    <ModButton label={"수정"} onClick={() => setIsOpenUpDate(true)} />
                                    {/*<DelButton label={"삭제"} onClick={deleteToServer} />*/}
                                    <RefreshButton onClick={() => fetchAllData()} />
                                </div>
                                <ReactDataTable
                                    columns={columns.orderPlanMgmt.version}
                                    customDatas={searchDates}
                                    viewPageName="원가버전조회"
                                    customDatasRefresh={refresh}
                                    hideCheckBox={true}
                                    returnSelect={(data) => {
                                        setSelectedRows(data);
                                    }}
                                />
                            </HideCard>
                        </ul>
                    </div>
                    <div className="second">
                        <ul>
                            <ApprovalFormSal viewPageName="인건비" />
                            <HideCard title="합계" color="back-lightyellow" className="mg-b-40"></HideCard>
                            <HideCard title="계획 등록/수정" color="back-lightblue">
                                <div className="table-buttons mg-b-m-30">
                                    <SaveButton label={"저장"} onClick={() => setNameOfButton("save")} />
                                    {/*<ModButton label={"수정"} onClick={() => setIsOpenUpDate(true)} />*/}
                                    {/*<DelButton label={"삭제"} onClick={deleteToServer} />*/}
                                    <RefreshButton onClick={refresh} />
                                </div>
                                <ReactDataTable
                                    columns={columns.orderPlanMgmt.labor}
                                    customDatas={prmnPlanDatas}
                                    returnList={returnList}
                                    viewPageName="인건비"
                                    customDatasRefresh={refresh}
                                    hideCheckBox={true}
                                />
                            </HideCard>
                        </ul>
                    </div>
                    <div className="third">
                        <ul>
                            <ApprovalFormSal viewPageName="구매(재료비)" />
                            <HideCard title="합계" color="back-lightyellow" className="mg-b-40">
                                {/* <ReactDataTableView /> */}
                            </HideCard>
                            <HideCard title="계획 등록/수정" color="back-lightblue">
                                <div className="table-buttons mg-b-m-30">
                                    <SaveButton label={"저장"} onClick={() => setNameOfButton("save")} />
                                    <RefreshButton onClick={refresh} />
                                </div>
                                <ReactDataTablePdorder
                                    singleUrl="/baseInfrm/product/buyIngInfo"
                                    columns={columns.orderPlanMgmt.purchase}
                                    customDatas={pdOrdrDatas}
                                    //returnList={returnList}
                                    viewPageName="구매(재료비)"
                                    customDatasRefresh={refresh}
                                    hideCheckBox={true}
                                />
                            </HideCard>
                        </ul>
                    </div>
                    <div className="fourth">
                        <ul>
                            <ApprovalFormSal viewPageName="개발외주비" />
                            <HideCard title="합계" color="back-lightyellow" className="mg-b-40">
                                {/* <ReactDataTableView /> */}
                            </HideCard>
                            <HideCard title="계획 등록/수정" color="back-lightblue">
                                <div className="table-buttons mg-b-m-30">
                                    <SaveButton label={"저장"} onClick={() => setNameOfButton("save")} />

                                    <RefreshButton onClick={refresh} />
                                </div>
                                <ReactDataTableDevCost
                                    singleUrl="/baseInfrm/product/devOutCost"
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
                            <ApprovalFormSal viewPageName="경비" />
                            <HideCard title="합계" color="back-lightyellow" className="mg-b-40">
                                {/* <ReactDataTableView /> */}
                            </HideCard>
                            <HideCard title="계획 등록/수정" color="back-lightblue">
                                <div className="table-buttons mg-b-m-30">
                                    <SaveButton label={"저장"} onClick={() => setNameOfButton("save")} />

                                    <RefreshButton onClick={refresh} />
                                </div>
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
                            <ApprovalFormSal viewPageName="영업관리비" />
                            <HideCard title="합계" color="back-lightyellow" className="mg-b-40">
                                {/* <ReactDataTableView /> */}
                            </HideCard>
                            <HideCard title="계획 등록/수정" color="back-lightblue">
                                <div className="table-buttons mg-b-m-30">
                                    <RefreshButton onClick={refresh} />
                                </div>
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
                    <div className="seventh">
                        <ul>
                            <ApprovalFormSal viewPageName="견적용 인건비" />
                            <HideCard title="합계" color="back-lightyellow" className="mg-b-40">
                                {/* <ReactDataTableView /> */}
                            </HideCard>
                            <HideCard title="계획 등록/수정" color="back-lightblue">
                                <div className="table-buttons mg-b-m-30">
                                    <RefreshButton onClick={refresh} />
                                </div>
                                <ReactDataTableURL
                                    columns={columns.orderPlanMgmt.estimateLabor}
                                    customDatas={generalExpensesDatas}
                                    viewPageName="견적용 인건비"
                                    customDatasRefresh={refresh}
                                    hideCheckBox={true}
                                />
                            </HideCard>
                        </ul>
                    </div>
                    <div className="eighth">
                        <ul>
                            <ApprovalFormSal viewPageName="견적용 구매비" />
                            <HideCard title="합계" color="back-lightyellow" className="mg-b-40">
                                {/* <ReactDataTableView /> */}
                            </HideCard>
                            <HideCard title="계획 등록/수정" color="back-lightblue">
                                <div className="table-buttons mg-b-m-30">
                                    <RefreshButton onClick={refresh} />
                                </div>
                                <ReactDataTableURL
                                    columns={columns.orderPlanMgmt.estimatePurchase}
                                    singleUrl="/baseInfrm/product/pjbudget"
                                    customDatas={generalExpensesDatas}
                                    viewPageName="견적용 구매비"
                                    customDatasRefresh={refresh}
                                    hideCheckBox={true}
                                />
                            </HideCard>
                        </ul>
                    </div>
                </div>
            </div>
            {isOpenAdd && (
                <AddModModal
                    width={500}
                    height={250}
                    list={columns.orderPlanMgmt.addMod}
                    resultData={addVersionToServer}
                    onClose={() => setIsOpenAdd(false)}
                    title="버전 추가"
                />
            )}
        </>
    );
}

export default OrderPlanMgmt;
