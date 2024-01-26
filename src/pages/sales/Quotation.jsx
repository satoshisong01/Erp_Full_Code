import React, { useContext, useEffect, useState } from "react";
import Location from "components/Location/Location";
import { locationPath } from "constants/locationPath";
import { PageContext } from "components/PageProvider";
import ApprovalFormSal from "components/form/ApprovalFormSal";
import HideCard from "components/HideCard";
import RefreshButton from "components/button/RefreshButton";
import ReactDataTableURL from "components/DataTable/ReactDataTableURL";
import { columns } from "constants/columns";
import SaveButton from "components/button/SaveButton";
import AddButton from "components/button/AddButton";
import DelButton from "components/button/DelButton";
import ReactDataTable from "components/DataTable/ReactDataTable";
import { axiosDelete, axiosFetch, axiosPost, axiosUpdate } from "api/axiosFetch";
import SearchModal from "components/modal/SearchModal";

/** 영업관리-견적서관리 */
function Quotation() {
    const { currentPageName, innerPageName, setPrevInnerPageName, setInnerPageName, setCurrentPageName, setNameOfButton } = useContext(PageContext);
    const [infoList, setInfoList] = useState([
        { name: "견적용 인건비", id: "estimateLabor" },
        { name: "견적용 구매비", id: "orderBuying" },
    ]);
    const [condition, setCondition] = useState({});
    const [isOpenSearch, setIsOpenSearch] = useState(false);

    const [estimate, setEstimate] = useState([]);

    useEffect(() => {
        setInnerPageName({ name: "견적용 인건비", id: "estimateLabor" });
        setCurrentPageName({}); //inner와 pageName은 동시에 사용 X
        fetchAllData();
        return () => {};
    }, []);

    useEffect(() => {
        if (currentPageName.id === "Quotation") {
            const activeTab = document.querySelector(".mini_board_3 .tab li a.on"); //마지막으로 활성화 된 탭
            if (activeTab) {
                const activeTabInfo = infoList.find((data) => data.name === activeTab.textContent);
                setInnerPageName({ ...activeTabInfo });
                setCurrentPageName({});
                // fetchAllData();
            }
        }
    }, [currentPageName]);

    useEffect(() => {
        // console.log("🎄innerPageName:",innerPageName.id, ",", innerPageName.name);
        if (innerPageName.id === "estimateLabor") {
            fetchAllData();
        }
    }, [innerPageName]);

    const changeTabs = (name, id) => {
        setInnerPageName((prev) => {
            setPrevInnerPageName({ ...prev });
            return { name, id };
        });
        setCurrentPageName({});
    };

    const refresh = () => {
        if (condition.poiId && condition.versionId) {
            fetchAllData(condition);
        } else {
            fetchAllData();
        }
    };

    function combineEstMmAndEstMonthKeys(data) {
        return data.map((item) => {
            const estMonthWithoutLeadingZero = item.estMonth.replace(/^0+/, "");
            const estMmKey = `estMm${estMonthWithoutLeadingZero}`;
            const combinedValue = { ...item, [estMmKey]: item.estMm };

            // estMm 키를 삭제하려면 주석을 해제하세요.
            delete combinedValue.estMm;
            delete combinedValue.estMonth;

            return combinedValue;
        });
    }

    //function mergeAndCollectEstIds(data) {
    //    let mergedObjects = {};

    //    // 주어진 데이터 배열을 순회하면서 객체를 병합 및 estId 수집
    //    data.forEach((obj) => {
    //        // 객체의 todayTm, powerLv를 기준으로 중복 여부 확인
    //        let key = `${obj.trashData}_${obj.trashData2}`;

    //        // 중복된 key가 없으면 새로운 객체 생성
    //        if (!mergedObjects[key]) {
    //            mergedObjects[key] = { ...obj, estIdList: [obj.estId] };
    //        } else {
    //            // 중복된 key가 있으면 기존 객체와 현재 객체를 병합
    //            mergedObjects[key] = {
    //                ...mergedObjects[key],
    //                ...obj,
    //                estIdList: [...mergedObjects[key].estIdList, obj.estId],

    //            };
    //        }
    //    });

    //    // 병합된 객체들을 배열로 변환
    //    let result = Object.values(mergedObjects);

    //    return result;
    //}

    function mergeAndCollectEstIds(data) {
        let mergedObjects = {};

        // 주어진 데이터 배열을 순회하면서 객체를 병합 및 estId 수집
        data.forEach((obj) => {
            // 객체의 키와 값을 문자열로 변환하여 중복 여부 확인
            let key = `${obj.trashData}_${obj.trashData2}`;

            // 중복된 key가 없으면 새로운 객체 생성
            if (!mergedObjects[key]) {
                // 객체에서 estId를 추출하고 해당 속성을 삭제
                const { estId, ...newObj } = obj;
                mergedObjects[key] = { ...newObj, estIdList: [estId] };
            } else {
                // 중복된 key가 있으면 기존 객체와 현재 객체를 병합
                mergedObjects[key] = {
                    ...mergedObjects[key],
                    ...obj,
                    estIdList: [...mergedObjects[key].estIdList, obj.estId],
                };
                delete mergedObjects[key].estId;
            }
        });

        // 병합된 객체들을 배열로 변환
        let result = Object.values(mergedObjects);

        return result;
    }

    //function mergeDuplicateObjects(data) {
    //    let mergedObjects = {};

    //    // 주어진 데이터 배열을 순회하면서 객체를 병합
    //    data.forEach((obj) => {
    //        // 객체의 키와 값을 문자열로 변환하여 중복 여부 확인
    //        let key = JSON.stringify(obj);

    //        // 중복된 key가 없으면 새로운 객체 생성
    //        if (!mergedObjects[key]) {
    //            mergedObjects[key] = { ...obj };
    //        } else {
    //            // 중복된 key가 있으면 기존 객체와 현재 객체를 병합
    //            mergedObjects[key] = { ...mergedObjects[key], ...obj };
    //        }
    //    });

    //    // 병합된 객체들을 배열로 변환
    //    let result = Object.values(mergedObjects);

    //    return result;
    //}

    const fetchAllData = async (requestData) => {
        console.log(requestData, "???");

        //const requestSearch = {
        //    poiId: condition.poiId,
        //    useAt: "Y",
        //};

        const resultData = await axiosFetch("/api/estimate/personnel/estimateCostMM/totalListAll.do", {
            // ...requestData,
            searchCondition: "",
            searchKeyword: "",
        });
        console.log(resultData, "시발ㅈ같네");

        const result = combineEstMmAndEstMonthKeys(resultData);
        let uniqueArray = mergeAndCollectEstIds(result);
        console.log(uniqueArray, "이거제대로나와야해");
        setEstimate(uniqueArray);
        //const resultDa2 = await axiosFetch("/api/estimate/personnel/estimateCostMM/totalListAll.do", requestSearch);
        //const filteredData = filterData(updatedData);
    };

    const returnList = (originTableData, tableData) => {
        compareData(originTableData, tableData);
    };

    const compareData = (originData, updatedData) => {
        console.log("개발용 compare", originData, updatedData);
        const filterData = updatedData.filter((data) => data.poiId); //pmpMonth가 없는 데이터 제외
        const originDataLength = originData ? originData.length : 0;
        const updatedDataLength = filterData ? filterData.length : 0;
        console.log("여기탐 개발외주 수정?", updatedData);
        console.log("updatedDataLength?", updatedDataLength);

        if (originDataLength > updatedDataLength) {
            //이전 id값은 유지하면서 나머지 값만 변경해주는 함수
            const updateDataInOrigin = (originData, updatedData) => {
                // 복제하여 새로운 배열 생성
                const updatedArray = [...originData];
                // updatedData의 길이만큼 반복하여 originData 갱신
                for (let i = 0; i < Math.min(updatedData.length, originData.length); i++) {
                    const updatedItem = updatedData[i];
                    updatedArray[i] = { ...updatedItem, estId: updatedArray[i].estId };
                }
                return updatedArray;
            };

            const firstRowUpdate = updateDataInOrigin(originData, updatedData);
            console.log("여긴가?1");
            updateItem(firstRowUpdate); //수정

            const delList = [];
            const delListTest = [];
            for (let i = updatedDataLength; i < originDataLength; i++) {
                delList.push(originData[i].estId);
                delListTest.push(originData[i]);
            }
            deleteItem(delList); //삭제
        } else if (originDataLength === updatedDataLength) {
            console.log("여긴가?2");
            console.log(originDataLength);
            console.log(updatedDataLength);
            updateItem(filterData); //수정
        } else if (originDataLength < updatedDataLength) {
            const updateList = [];

            for (let i = 0; i < originDataLength; i++) {
                updateList.push(filterData[i]);
            }
            console.log("여긴가?3");
            updateItem(updateList); //수정

            const addLists = [];

            for (let i = originDataLength; i < updatedDataLength; i++) {
                const addList = { ...filterData[i] };
                addList.poiId = condition.poiId;
                addList.versionId = condition.versionId;
                addLists.push(addList);
            }
            addItem(addLists); //추가
        }
    };

    const addItem = async (addData) => {
        console.log(addData, "견적 영업");
        const url = `/api/estimate/personnel/estimateCostMM/addArrayList.do`;
        const resultData = await axiosPost(url, addData);
        console.log(resultData, "💜addItem");
        if (resultData) {
            refresh();
        }
    };

    const updateItem = async (toUpdate) => {
        console.log(toUpdate, "업데이트 데이터좀보자!");
        const url = `/api/estimate/personnel/estimateCostMM/editArrayList.do`;
        console.log(toUpdate, "💜updateItem");
        const resultData = await axiosUpdate(url, toUpdate);
        console.log(resultData, "변경된거 맞음?");

        if (resultData) {
            refresh();
        }
    };

    const deleteItem = async (removeItem) => {
        const url = `/api/estimate/personnel/estimateCostMM/removeAll.do`;
        const resultData = await axiosDelete(url, removeItem);
        console.log(resultData, "지워진거맞음?");

        if (resultData) {
            refresh();
        }
    };

    const conditionInfo = (value) => {
        // console.log("🎄컨디션:", value);
        setCondition((prev) => {
            if (prev.poiId !== value.poiId) {
                const newCondition = { ...value };
                fetchAllData(newCondition);
                return newCondition;
            } else {
                fetchAllData({ ...prev });
                return prev;
            }
        });
    };

    return (
        <>
            <Location pathList={locationPath.Quotation} />
            <div className="common_board_style mini_board_3">
                <ul className="tab">
                    <li onClick={() => changeTabs("견적용 인건비", "estimateLabor")}>
                        <a href="#견적용 인건비" className="on">
                            견적용 인건비
                        </a>
                    </li>
                    <li onClick={() => changeTabs("견적용 구매비", "orderBuying")}>
                        <a href="#견적용 구매비">견적용 구매비</a>
                    </li>
                </ul>
                <div className="list">
                    <div className="first">
                        <ul>
                            <ApprovalFormSal returnData={conditionInfo} initial={condition} />
                            <HideCard title="합계" color="back-lightyellow" className="mg-b-40"></HideCard>
                            <HideCard title="계획 등록/수정" color="back-lightblue">
                                <div className="table-buttons mg-t-10 mg-b-10">
                                    <SaveButton label={"저장"} onClick={() => setNameOfButton("save")} />
                                    <AddButton label={"추가"} onClick={() => setNameOfButton("addRow")} />
                                    <DelButton label={"삭제"} onClick={() => setNameOfButton("deleteRow")} />
                                    <RefreshButton onClick={refresh} />
                                </div>
                                <ReactDataTableURL
                                    editing={true}
                                    columns={columns.orderPlanMgmt.estimateLabor}
                                    returnList={returnList}
                                    customDatas={estimate}
                                    viewPageName={{ name: "견적용 인건비", id: "estimateLabor" }}
                                    customDatasRefresh={refresh}
                                    condition={condition}
                                />
                            </HideCard>
                        </ul>
                    </div>
                    <div className="second">
                        <ul>
                            <ApprovalFormSal returnData={conditionInfo} initial={condition} />
                            <HideCard title="합계" color="back-lightyellow" className="mg-b-40"></HideCard>
                            <HideCard title="계획 등록/수정" color="back-lightblue">
                                <div className="table-buttons mg-t-10 mg-b-10">
                                    <RefreshButton onClick={refresh} />
                                </div>
                                <ReactDataTableURL
                                    editing={true}
                                    columns={columns.orderPlanMgmt.estimatePurchase}
                                    suffixUrl="/baseInfrm/product/pjbudget"
                                    // customDatas={generalExpensesDatas}
                                    viewPageName={{ name: "견적용 구매비", id: "orderBuying" }}
                                    customDatasRefresh={refresh}
                                    condition={condition}
                                />
                            </HideCard>
                        </ul>
                    </div>
                </div>
            </div>
            <SearchModal returnData={(condition) => fetchAllData(condition)} onClose={() => setIsOpenSearch(false)} isOpen={isOpenSearch} />
        </>
    );
}

export default Quotation;
