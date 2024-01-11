import React, { useContext, useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import ReactDataTable from "components/DataTable/ReactDataTable";
import { PageContext } from "components/PageProvider";
import { locationPath } from "constants/locationPath";
import { axiosDelete, axiosFetch, axiosPost, axiosUpdate } from "api/axiosFetch";
import ReactDataTableURL from "components/DataTable/ReactDataTableURL";
import { ChangePrmnPlanData, buyIngInfoCalculation, division } from "components/DataTable/function/ReplaceDataFormat";
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
import DeleteModal from "components/modal/DeleteModal";
import SearchList from "components/SearchList";
import ReactDataTableSaleCost from "components/DataTable/ReactDataTableSaleCost";
import PopupButton from "components/button/PopupButton";
import URL from "constants/url";

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
    const [searchDates, setSearchDates] = useState([]); // 원가
    const [prmnPlanDatas, setPrmnPlanDatas] = useState([]); // 인건비
    const [prmnCalDatas, setPrmnCalDatas] = useState([]); // 인건비합계
    const [pjbudgetDatas, setPjbudgetDatas] = useState([]); // 경비
    const [pjbudgetCalDatas, setPjbudgetCalDatas] = useState([]); // 경비합계
    const [pdOrdrDatas, setPdOrdrDatas] = useState([]); // 구매(재료비)
    const [pdOrdrCalDatas, setPdOrdrCalDatas] = useState([]); // 구매합계
    const [outsourcingDatas, setOutsourcingDatas] = useState([]); // 개발외주비
    const [outCalDatas, setOutCalDatas] = useState([]); // 개발외주비합계
    const [generalExpensesDatas, setGeneralExpensesDatas] = useState([]); // 영업관리비
    const [generalCalDatas, setGeneralCalDatas] = useState([]); // 영업관리비합계
    const [selectedRows, setSelectedRows] = useState([]); //그리드에서 선택된 rows
    const [isOpenMod, setIsOpenMod] = useState(false);
    const [isOpenDel, setIsOpenDel] = useState(false);
    const [condition, setCondition] = useState({}); //poiMonth:기준연도

    useEffect(() => {
        setInnerPageName("원가버전조회");
        setCurrentPageName(""); //inner와 pageName은 동시에 사용 X
        fetchAllData();
        return () => {};
    }, []);

    useEffect(() => {
        const activeTab = document.querySelector(".mini_board_1 .tab li a.on");
        const activeTabText = activeTab.textContent; //마지막으로 활성화 된 탭
        setInnerPageName(activeTabText);
        setCurrentPageName("");
        fetchAllData();
    }, [currentPageName]);

    useEffect(() => {
        console.log("innerPageName:", innerPageName, "currentPageName:", currentPageName);
        if (innerPageName === "원가버전조회" || currentPageName === "원가버전조회") {
            fetchAllData();
        }
    }, [innerPageName, currentPageName]);

    const refresh = () => {
        if (condition.poiId && condition.versionId) {
            fetchAllData(condition);
        } else {
            fetchAllData();
        }
    };

    const returnList = (originTableData, tableData) => {
        compareData(originTableData, tableData);
    };

    const changeTabs = (task) => {
        setInnerPageName((prev) => {
            // setCurrentPageName("");
            setPrevInnerPageName(prev);
            return task;
        });
    };

    //인건비용임
    const compareData = (originData, updatedData) => {
        // console.log(originData, "originData");
        // console.log(updatedData, "updatedData");
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
                toAdd.poiId = condition.poiId;
                toAdd.versionId = condition.versionId;

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
        // console.log(addNewData, "추가");
        addNewData.forEach((data) => {
            data.poiId = condition.poiId || "";
        });
        const url = `/api/baseInfrm/product/prmnPlan/addList.do`;
        const resultData = await axiosPost(url, addNewData);
        refresh();
    };
    const updateList = async (toUpdate) => {
        toUpdate.forEach((data) => {
            data.poiId = condition.poiId || "";
        });
        // console.log("❗updateList:", toUpdate);
        const updatedData = toUpdate.map((obj) => {
            const { pmpId, ...rest } = obj;
            return rest;
        });

        // console.log("❗❗❗updateList:", updatedData);
        const url = `/api/baseInfrm/product/prmnPlan/editArrayList.do`;
        const resultData = await axiosUpdate(url, updatedData);
        refresh();
    };

    const deleteList = async (removeItem) => {
        const url = `/api/baseInfrm/product/prmnPlan/removeAll.do`;
        const resultData = await axiosDelete(url, removeItem);
        refresh();
    };

    // 초기 데이터와 수정된 데이터를 비교하는 함수
    //추가 함수
    const upDateChange = (data, originData) => {
        if (data && originData) {
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

    const fetchVersion = async () => {
        const resultData = await axiosFetch("/api/baseInfrm/product/versionControl/totalListAll.do", {
            searchCondition: "",
            searchKeyword: "",
        });
        console.log(resultData, "버전정보");
        setSearchDates(resultData);
    };

    const fetchAllData = async (requestData) => {
        if (requestData) {
            if (innerPageName === "원가버전조회" || currentPageName === "원가버전조회") {
                const resultData = await axiosFetch("/api/baseInfrm/product/versionControl/totalListAll.do", {
                    // ...requestData,
                    searchCondition: "",
                    searchKeyword: "",
                });
                if (resultData && resultData.length > 0) {
                    setSearchDates(resultData);
                    console.log("😈영업-원가버전조회:", requestData, "resultData:", resultData);
                } else {
                    alert("no data");
                    setSearchDates([]);
                }
            } else if (innerPageName === "인건비") {
                const resultData = await axiosFetch("/api/baseInfrm/product/prmnPlan/totalListAll.do", requestData);
                if (resultData && resultData.length > 0) {
                    const changeData = ChangePrmnPlanData(resultData, condition.poiId);
                    let total = 0,
                        mm1 = 0,
                        mm9 = 0,
                        mm10 = 0,
                        mm11 = 0,
                        mm12 = 0,
                        mm13 = 0,
                        mm14 = 0; //임원
                    const matchingAItem = unitPriceListRenew.find((aItem) => aItem.year === requestData.poiMonth);
                    if (matchingAItem) {
                        changeData.forEach((Item) => {
                            mm1 += Item.pmpmmPositionCode1;
                            mm9 += Item.pmpmmPositionCode9;
                            mm10 += Item.pmpmmPositionCode10;
                            mm11 += Item.pmpmmPositionCode11;
                            mm12 += Item.pmpmmPositionCode12;
                            mm13 += Item.pmpmmPositionCode13;
                            mm14 += Item.pmpmmPositionCode14;
                        });
                        total = (mm1 + mm9 + mm10 + mm11 + mm12 + mm13 + mm14).toLocaleString() + "(M/M)";
                        setPrmnCalDatas([
                            {
                                total,
                                pmpmmPositionCode1Total: mm1,
                                pmpmmPositionCode9Total: mm9,
                                pmpmmPositionCode10Total: mm10,
                                pmpmmPositionCode11Total: mm11,
                                pmpmmPositionCode12Total: mm12,
                                pmpmmPositionCode13Total: mm13,
                                pmpmmPositionCode14Total: mm14,
                            },
                            {
                                total:
                                    (
                                        mm1 * matchingAItem.gupPrice1 +
                                        mm9 * matchingAItem.gupPrice9 +
                                        mm10 * matchingAItem.gupPrice10 +
                                        mm11 * matchingAItem.gupPrice11 +
                                        mm12 * matchingAItem.gupPrice12 +
                                        mm13 * matchingAItem.gupPrice13 +
                                        mm14 * matchingAItem.gupPrice14
                                    ).toLocaleString() + "원",
                                pmpmmPositionCode1Total: mm1 * matchingAItem.gupPrice1,
                                pmpmmPositionCode9Total: mm9 * matchingAItem.gupPrice9,
                                pmpmmPositionCode10Total: mm10 * matchingAItem.gupPrice10,
                                pmpmmPositionCode11Total: mm11 * matchingAItem.gupPrice11,
                                pmpmmPositionCode12Total: mm12 * matchingAItem.gupPrice12,
                                pmpmmPositionCode13Total: mm13 * matchingAItem.gupPrice13,
                                pmpmmPositionCode14Total: mm14 * matchingAItem.gupPrice14,
                            },
                        ]);
                        changeData.forEach((Item) => {
                            const yearFromPmpMonth = Item.pmpMonth.slice(0, 4);
                            const matchingAItem = unitPriceListRenew.find((aItem) => aItem.year === yearFromPmpMonth);
                            if (matchingAItem) {
                                let totalPrice = 0;
                                for (let i = 1; i <= 14; i++) {
                                    const gupPriceKey = `gupPrice${i}`;
                                    const pmpmmPositionCodeKey = `pmpmmPositionCode${i}`;
                                    if (matchingAItem[gupPriceKey]) {
                                        totalPrice += matchingAItem[gupPriceKey] * Item[pmpmmPositionCodeKey];
                                    }
                                }
                                Item.totalPrice = totalPrice;
                            }
                        });
                        setPrmnPlanDatas(changeData);
                        console.log("😈영업-인건비:", changeData);
                    }
                } else {
                    alert("no data");
                    setPrmnPlanDatas([]);
                    setPrmnCalDatas([]);
                }
            } else if (innerPageName === "경비") {
                const resultData = await axiosFetch("/api/baseInfrm/product/pjbudget/totalListAll.do", requestData);
                if (resultData && resultData.length > 0) {
                    setPjbudgetDatas(resultData);
                    let pjbgPriceTotal = 0;
                    resultData.forEach((data) => {
                        pjbgPriceTotal += data.pjbgPrice;
                    });
                    setPjbudgetCalDatas([{ pjbgPriceTotal }]);
                    console.log("😈영업-경비:", resultData);
                } else {
                    alert("no data");
                    setPjbudgetDatas([]);
                    setPjbudgetCalDatas([]);
                }
            } else if (innerPageName === "구매(재료비)") {
                console.log("😈구매조회!!", requestData);
                const resultData = await axiosFetch("/api/baseInfrm/product/buyIngInfo/totalListAll.do", requestData);
                if (resultData && resultData.length > 0) {
                    const calData = buyIngInfoCalculation(resultData);
                    console.log("⭐⭐⭐영업-구매비:", requestData, "calData:", calData);
                    setPdOrdrDatas(calData);

                    let consumerAmountTotal = 0; // 소비자금액
                    let planAmountTotal = 0; // 금액
                    let estimatedCostTotal = 0; // 원가
                    let plannedProfitsTotal = 0; // 이익금

                    calData.forEach((data) => {
                        consumerAmountTotal += data.consumerAmount; // 소비자금액
                        planAmountTotal += data.planAmount; // 금액
                        estimatedCostTotal += data.estimatedCost; // 원가
                        plannedProfitsTotal += data.plannedProfits; // 이익금
                    });
                    const nego = division(consumerAmountTotal - planAmountTotal, consumerAmountTotal) * 100 + "%"; // 네고율
                    const plannedProfitMarginTotal = division(plannedProfitsTotal, planAmountTotal) * 100 + "%"; // 이익금/금액
                    setPdOrdrCalDatas([
                        {
                            consumerAmountTotal,
                            planAmountTotal,
                            nego,
                            estimatedCostTotal,
                            plannedProfitsTotal,
                            plannedProfitMarginTotal,
                        },
                    ]);

                    console.log("😈영업-구매비:", requestData, "resultData:", resultData);
                } else {
                    alert("no data");
                    //setPdOrdrDatas([]);
                    //setPdOrdrCalDatas([]);
                }
            } else if (innerPageName === "개발외주비") {
                const resultData = await axiosFetch("/api/baseInfrm/product/devOutCost/totalListAll.do", requestData);
                if (resultData && resultData.length > 0) {
                    setOutsourcingDatas(resultData);
                    let devOutPriceTotal = 0;
                    resultData.forEach((data) => {
                        devOutPriceTotal += data.devOutMm * data.devOutPrice;
                    });
                    setOutCalDatas([{ devOutPriceTotal }]);
                    console.log("😈영업-개발외주비:", requestData, "resultData:", resultData);
                } else {
                    alert("no data");
                    setOutsourcingDatas([]);
                    setOutCalDatas([]);
                }
            } else if (innerPageName === "영업관리비") {
                const resultData = await axiosFetch("/api/baseInfrm/product/slsmnExpns/totalListAll.do", requestData);
                if (resultData && resultData.length > 0) {
                    setGeneralExpensesDatas(resultData);
                    // slsmnEnterpriseProfit 기업이윤, slsmnAdmnsCost 일반관리비, slsmnNego 네고
                    let total = 0; //판관비
                    let negoTotal = 0; //네고
                    resultData.forEach((data) => {
                        total += data.slsmnEnterpriseProfit + data.slsmnAdmnsCost;
                        negoTotal += data.slsmnNego;
                    });
                    setGeneralCalDatas([{ total, negoTotal }]);
                    console.log("😈영업-영업관리비:", requestData, "resultData:", resultData);
                } else {
                    alert("no data");
                    setGeneralExpensesDatas([]);
                    setGeneralCalDatas([]);
                }
            }
        }
    };

    const [isOpenAdd, setIsOpenAdd] = useState(false);

    const addVersionToServer = async (addData) => {
        console.log(">>>>>>>>>", addData);
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
            fetchVersion();
        } else {
            alert("error!");
        }
    };

    const [deleteNames, setDeleteNames] = useState([]); //삭제할 Name 목록

    useEffect(() => {
        if (innerPageName === "원가버전조회") {
            selectedRows && setDeleteNames(selectedRows.map((row) => row.versionNum));
        }
    }, [selectedRows, innerPageName]);

    const deleteToServer = async (value) => {
        if (value === "임시삭제") {
            /* 임시삭제 코드 구현 */
        } else if (value === "영구삭제") {
            const poiNms = selectedRows.map((row) => row.versionId);
            const url = `/api/baseInfrm/product/versionControl/removeAll.do`;
            const resultData = await axiosDelete(url, poiNms);
            if (resultData) {
                alert(`선택한 항목들이 삭제되었습니다.`);
                fetchVersion();
            } else {
                alert("삭제 중 에러가 발생했습니다.");
            }
        }
    };

    const modifyToServer = async (updatedData) => {
        if (updatedData.length === 0) {
            alert("수정할 항목을 선택하세요.");
            return;
        }
        let url = "";
        if (innerPageName === "원가버전조회") {
            url = `/api/baseInfrm/product/versionControl/edit.do`;
        } else {
            url = `/api/baseInfrm/product/pjOrdrInfo/edit.do`;
        }
        // const updated = { ...updatedData, lockAt: "Y", useAt: "Y" };
        const resultData = await axiosUpdate(url, updatedData);
        if (resultData) {
            alert("수정되었습니다");
            fetchVersion();
        } else {
            alert("error!!");
        }
    };

    const onSearch = (condition) => {
        fetchAllData(condition);
    };

    const conditionInfo = (value) => {
        if (Object.keys(value).length === 0) {
            setCondition({});
        } else {
            setCondition((prev) => {
                const newCondition = { poiId: value.poiId, versionId: value.versionId, poiMonth: value.poiMonth };
                fetchAllData(newCondition);
                return newCondition;
            });
        }
    };

    return (
        <>
            {/* <Location pathList={locationPath.OrderPlanMgmt} /> */}
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
                    {/* <li onClick={() => changeTabs("견적용 인건비")}>
                        <a href="#견적용 인건비">견적용 인건비</a>
                    </li>
                    <li onClick={() => changeTabs("견적용 구매비")}>
                        <a href="#견적용 구매비">견적용 구매비</a>
                    </li> */}
                </ul>

                <div className="list">
                    <div className="first">
                        <ul>
                            <SearchList conditionList={columns.orderPlanMgmt.versionCondition} onSearch={onSearch} />
                            <HideCard title="원가 버전 목록" color="back-lightblue" className="mg-b-40">
                                <div className="table-buttons mg-b-m-30">
                                    <PopupButton targetUrl={URL.PreCostDoc} data={{ label: "사전원가서", ...selectedRows[0] }} />
                                    <AddButton label={"추가"} onClick={() => setIsOpenAdd(true)} />
                                    <ModButton label={"수정"} onClick={() => setIsOpenMod(true)} />
                                    <DelButton label={"삭제"} onClick={() => setIsOpenDel(true)} />
                                    <RefreshButton onClick={() => fetchAllData()} />
                                </div>
                                <ReactDataTable
                                    columns={columns.orderPlanMgmt.version}
                                    customDatas={searchDates}
                                    viewPageName="원가버전조회"
                                    customDatasRefresh={refresh}
                                    returnSelectRows={(data) => {
                                        setSelectedRows(data);
                                    }}
                                />
                            </HideCard>
                        </ul>
                    </div>
                    <div className="second">
                        <ul>
                            <ApprovalFormSal viewPageName="인건비" returnData={conditionInfo} />
                            <HideCard title="합계" color="back-lightyellow" className="mg-b-40">
                                <ReactDataTable
                                    columns={columns.orderPlanMgmt.laborCal}
                                    customDatas={prmnCalDatas}
                                    viewPageName="인건비합계"
                                    hideCheckBox={true}
                                />
                            </HideCard>
                            <HideCard title="계획 등록/수정" color="back-lightblue">
                                <div className="table-buttons mg-b-m-30">
                                    <SaveButton label={"저장"} onClick={() => setNameOfButton("save")} />
                                    {/*<ModButton label={"수정"} onClick={() => setIsOpenUpDate(true)} />*/}
                                    {/*<DelButton label={"삭제"} onClick={deleteToServer} />*/}
                                    <RefreshButton onClick={refresh} />
                                </div>
                                <ReactDataTable
                                    editing={true}
                                    columns={columns.orderPlanMgmt.labor}
                                    customDatas={prmnPlanDatas}
                                    returnList={returnList}
                                    viewPageName="인건비"
                                    customDatasRefresh={refresh}
                                    condition={condition}
                                />
                            </HideCard>
                        </ul>
                    </div>
                    <div className="third">
                        <ul>
                            <ApprovalFormSal viewPageName="구매(재료비)" returnData={conditionInfo} />
                            <HideCard title="합계" color="back-lightyellow" className="mg-b-40">
                                <ReactDataTable columns={columns.orderPlanMgmt.purchaseCal} customDatas={pdOrdrCalDatas} hideCheckBox={true} />
                            </HideCard>
                            <HideCard title="계획 등록/수정" color="back-lightblue">
                                <div className="table-buttons mg-b-m-30">
                                    <SaveButton label={"저장"} onClick={() => setNameOfButton("save")} />
                                    <RefreshButton onClick={refresh} />
                                </div>
                                <ReactDataTablePdorder
                                    editing={true}
                                    columns={columns.orderPlanMgmt.purchase}
                                    customDatas={pdOrdrDatas}
                                    viewPageName="구매(재료비)"
                                    suffixUrl="/baseInfrm/product/buyIngInfo"
                                    customDatasRefresh={refresh}
                                    condition={condition}
                                />
                            </HideCard>
                        </ul>
                    </div>
                    <div className="fourth">
                        <ul>
                            <ApprovalFormSal viewPageName="개발외주비" returnData={conditionInfo} />
                            <HideCard title="합계" color="back-lightyellow" className="mg-b-40">
                                <ReactDataTable
                                    columns={columns.orderPlanMgmt.outCal}
                                    customDatas={outCalDatas}
                                    viewPageName="외주비합계"
                                    hideCheckBox={true}
                                    condition={condition}
                                />
                            </HideCard>
                            <HideCard title="계획 등록/수정" color="back-lightblue">
                                <div className="table-buttons mg-b-m-30">
                                    <SaveButton label={"저장"} onClick={() => setNameOfButton("save")} />

                                    <RefreshButton onClick={refresh} />
                                </div>
                                <ReactDataTableDevCost
                                    editing={true}
                                    singleUrl="/baseInfrm/product/devOutCost"
                                    columns={columns.orderPlanMgmt.outsourcing}
                                    customDatas={outsourcingDatas}
                                    viewPageName="개발외주비"
                                    customDatasRefresh={refresh}
                                    condition={condition}
                                />
                            </HideCard>
                        </ul>
                    </div>
                    <div className="fifth">
                        <ul>
                            <ApprovalFormSal viewPageName="경비" returnData={conditionInfo} />
                            <HideCard title="합계" color="back-lightyellow" className="mg-b-40">
                                <ReactDataTable
                                    columns={columns.orderPlanMgmt.expensesCal}
                                    customDatas={pjbudgetCalDatas}
                                    viewPageName="경비합계"
                                    hideCheckBox={true}
                                />
                            </HideCard>
                            <HideCard title="계획 등록/수정" color="back-lightblue">
                                <div className="table-buttons mg-b-m-30">
                                    <SaveButton label={"저장"} onClick={() => setNameOfButton("save")} />
                                    <RefreshButton onClick={refresh} />
                                </div>
                                <ReactDataTableURL
                                    editing={true}
                                    singleUrl="/baseInfrm/product/pjbudget"
                                    columns={columns.orderPlanMgmt.expenses}
                                    customDatas={pjbudgetDatas}
                                    viewPageName="경비"
                                    customDatasRefresh={refresh}
                                    condition={condition}
                                />
                            </HideCard>
                        </ul>
                    </div>
                    <div className="sixth">
                        <ul>
                            <ApprovalFormSal viewPageName="영업관리비" returnData={conditionInfo} />
                            <HideCard title="합계" color="back-lightyellow" className="mg-b-40">
                                <ReactDataTable
                                    columns={columns.orderPlanMgmt.generalCal}
                                    customDatas={generalCalDatas}
                                    viewPageName="영업관리비합계"
                                    hideCheckBox={true}
                                    condition={condition}
                                />
                            </HideCard>
                            <HideCard title="계획 등록/수정" color="back-lightblue">
                                <div className="table-buttons mg-b-m-30">
                                    <SaveButton label={"저장"} onClick={() => setNameOfButton("save")} />
                                    <RefreshButton onClick={refresh} />
                                </div>
                                <ReactDataTableSaleCost
                                    editing={true}
                                    columns={columns.orderPlanMgmt.generalExpenses}
                                    singleUrl="/baseInfrm/product/pjbudget"
                                    customDatas={generalExpensesDatas}
                                    viewPageName="영업관리비"
                                    customDatasRefresh={refresh}
                                    condition={condition}
                                />
                            </HideCard>
                        </ul>
                    </div>
                    <div className="seventh">
                        <ul>
                            <ApprovalFormSal viewPageName="견적용 인건비" returnData={conditionInfo} />
                            <HideCard title="합계" color="back-lightyellow" className="mg-b-40"></HideCard>
                            <HideCard title="계획 등록/수정" color="back-lightblue">
                                <div className="table-buttons mg-b-m-30">
                                    <RefreshButton onClick={refresh} />
                                </div>
                                <ReactDataTableURL
                                    editing={true}
                                    columns={columns.orderPlanMgmt.estimateLabor}
                                    customDatas={generalExpensesDatas}
                                    viewPageName="견적용 인건비"
                                    customDatasRefresh={refresh}
                                    // hideCheckBox={true}
                                    condition={condition}
                                />
                            </HideCard>
                        </ul>
                    </div>
                    <div className="eighth">
                        <ul>
                            <ApprovalFormSal viewPageName="견적용 구매비" returnData={conditionInfo} />
                            <HideCard title="합계" color="back-lightyellow" className="mg-b-40"></HideCard>
                            <HideCard title="계획 등록/수정" color="back-lightblue">
                                <div className="table-buttons mg-b-m-30">
                                    <RefreshButton onClick={refresh} />
                                </div>
                                <ReactDataTableURL
                                    editing={true}
                                    columns={columns.orderPlanMgmt.estimatePurchase}
                                    singleUrl="/baseInfrm/product/pjbudget"
                                    customDatas={generalExpensesDatas}
                                    viewPageName="견적용 구매비"
                                    customDatasRefresh={refresh}
                                    // hideCheckBox={true}
                                    condition={condition}
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
                    list={columns.orderPlanMgmt.versionAdd}
                    resultData={addVersionToServer}
                    onClose={() => setIsOpenAdd(false)}
                    title="버전 추가"
                />
            )}
            {isOpenMod && (
                <AddModModal
                    width={500}
                    height={280}
                    list={columns.orderPlanMgmt.versionMod}
                    initialData={selectedRows}
                    resultData={modifyToServer}
                    onClose={() => setIsOpenMod(false)}
                    title="버전 수정"
                />
            )}
            <DeleteModal initialData={deleteNames} resultData={deleteToServer} onClose={() => setIsOpenDel(false)} isOpen={isOpenDel} />
        </>
    );
}

export default OrderPlanMgmt;
