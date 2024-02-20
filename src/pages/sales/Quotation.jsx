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
import ReactDataTablePdorder from "components/DataTable/ReactDataTablePdorder";
import PopupButton from "components/button/PopupButton";
import URL from "constants/url";

/** 영업관리-견적서관리 */
function Quotation() {
    const { currentPageName, innerPageName, setPrevInnerPageName, setInnerPageName, setCurrentPageName, setNameOfButton } = useContext(PageContext);
    const [infoList, setInfoList] = useState([
        { name: "견적용 인건비", id: "estimateLabor" },
        { name: "견적용 구매비", id: "orderBuying" },
    ]);
    const [condition, setCondition] = useState({});
    const [isOpenSearch, setIsOpenSearch] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]); //그리드에서 선택된 row 데이터

    const [estimate, setEstimate] = useState([]);
    const [buyIngInfo, setBuyIngInfo] = useState([]);

    const [estimateBool, setestimateBool] = useState(false);
    const [buyIngBool, setBuyIngBool] = useState(false);

    console.log(estimateBool, buyIngBool);

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
                fetchAllData();
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
        console.log("리프래쉬 왜안함");
        if (condition.poiId && condition.versionId) {
            fetchAllData(condition);
        } else {
            fetchAllData();
        }
    };

    function mergeObjects(data) {
        data.sort((a, b) => a.estId - b.estId);
        // 객체의 키를 모아둘 Set
        let keysSet = new Set();

        // 객체들의 키를 확인하면서 중복된 키는 저장하지 않음
        data.forEach((obj) => {
            Object.keys(obj).forEach((key) => {
                if (key !== "estId") {
                    keysSet.add(key);
                }

                // estMm1, estMm2, estMm3 값 중복 확인
                if (key.startsWith("estMm") && !window["unique" + key]) {
                    window["unique" + key] = obj[key];
                }
            });
        });

        // 중복되지 않는 키들을 가진 객체를 생성
        let result = {};
        keysSet.forEach((key) => {
            result[key] = data[0][key];
        });

        // 중복되지 않는 estMm 속성들을 저장
        for (let i = 1; i <= 24; i++) {
            let key = "estMm" + i;
            if (window["unique" + key]) {
                result[key] = window["unique" + key];
            }
        }

        // estId 값을 배열로 저장
        result["estIdList"] = data.map((obj) => obj["estId"]);

        // 최종 결과를 배열로 감싸서 반환
        return [result];
    }

    //const processResultData = (resultData) => {
    //    const newData = resultData.map((item, index) => {
    //        // 새로운 객체를 만들어서 기존 객체의 속성들을 복사
    //        const newItem = { ...item };

    //        // estMm 뒤에 index를 붙여서 새로운 속성을 추가
    //        newItem[`estMm${index + 1}`] = item.estMm;
    //        delete newItem.estMm;
    //        delete newItem.estMonth;

    //        return newItem;
    //    });
    //    return newData;
    //};

    //estMonth(월 숫자를 잘라다가 새롭게 estMm을 만듦)
    const updateEstMmProperty = (data) => {
        data.forEach((item) => {
            const estMonth = item.estMonth;
            if (estMonth) {
                //const paddedMonth = estMonth;
                item[`estMm${estMonth}`] = item.estMm;
            }
        });
        return data;
    };

    const processResultData = (resultData, condition) => {
        console.log(resultData, "처음받는값인데");
        const changeDD = updateEstMmProperty(resultData);
        console.log(changeDD, "바뀔까?");
        const transformedData = changeDD.reduce((accumulator, item) => {
            const {
                estId,
                estMm,
                estPosition,
                estUnitPrice,
                pgId,
                pgNm,
                pdiId,
                poiNm,
                pdiNm,
                pdiUnit,
                estDesc,
                estMm1,
                estMm2,
                estMm3,
                estMm4,
                estMm5,
                estMm6,
                estMm7,
                estMm8,
                estMm9,
                estMm10,
                estMm11,
                estMm12,
                estMm13,
                estMm14,
                estMm15,
                estMm16,
                estMm17,
                estMm18,
                estMm19,
                estMm20,
                estMm21,
                estMm22,
                estMm23,
                estMm24,
            } = item;

            const key = `${pdiNm}_${estPosition}`;
            if (!accumulator[key]) {
                accumulator[key] = {
                    estMm,
                    estPosition,
                    estUnitPrice,
                    pgId,
                    pdiId,
                    poiNm,
                    pdiNm,
                    pgNm,
                    pdiUnit,
                    estDesc,
                    estMm1,
                    estMm2,
                    estMm3,
                    estMm4,
                    estMm5,
                    estMm6,
                    estMm7,
                    estMm8,
                    estMm9,
                    estMm10,
                    estMm11,
                    estMm12,
                    estMm13,
                    estMm14,
                    estMm15,
                    estMm16,
                    estMm17,
                    estMm18,
                    estMm19,
                    estMm20,
                    estMm21,
                    estMm22,
                    estMm23,
                    estMm24,
                    estId: [],
                };
            }

            accumulator[key].estId.push(estId);
            accumulator[key].estId.sort((a, b) => a - b);

            for (let i = 1; i <= 24; i++) {
                const estMmKey = `estMm${i}`;
                if (item[estMmKey] !== undefined) {
                    accumulator[key][estMmKey] = item[estMmKey];
                }
            }

            return accumulator;
        }, []);
        console.log(transformedData, "transformedData");
        //여기까지가통합

        // mergedData 에서 다시 tableData에쓸 배열로 재정의
        const mergedData = Object.values(transformedData).map((mergedItem, index) => {
            const newObj = {};
            console.log(mergedItem, "이거머더라");
            newObj["estIdList"] = mergedItem.estId;
            newObj["estMm"] = mergedItem.estMm;
            newObj["estPosition"] = mergedItem.estPosition;
            newObj["estUnitPrice"] = mergedItem.estUnitPrice;
            newObj["pgId"] = mergedItem.pgId;
            newObj["pdiId"] = mergedItem.pdiId;
            newObj["pdiNm"] = mergedItem.pdiNm;
            newObj["pjbgDt"] = mergedItem.pjbgBeginDt;
            newObj["pgNm"] = mergedItem.pgNm;
            newObj["pdiUnit"] = mergedItem.pdiUnit;
            newObj["poiNm"] = mergedItem.poiNm;
            newObj["estDesc"] = mergedItem.estDesc;
            newObj["estMm1"] = mergedItem.estMm1;
            newObj["estMm2"] = mergedItem.estMm2;
            newObj["estMm3"] = mergedItem.estMm3;
            newObj["estMm4"] = mergedItem.estMm4;
            newObj["estMm5"] = mergedItem.estMm5;
            newObj["estMm6"] = mergedItem.estMm6;
            newObj["estMm7"] = mergedItem.estMm7;
            newObj["estMm8"] = mergedItem.estMm8;
            newObj["estMm9"] = mergedItem.estMm9;
            newObj["estMm10"] = mergedItem.estMm10;
            newObj["estMm11"] = mergedItem.estMm11;
            newObj["estMm12"] = mergedItem.estMm12;
            newObj["estMm13"] = mergedItem.estMm13;
            newObj["estMm14"] = mergedItem.estMm14;
            newObj["estMm15"] = mergedItem.estMm15;
            newObj["estMm16"] = mergedItem.estMm16;
            newObj["estMm17"] = mergedItem.estMm17;
            newObj["estMm18"] = mergedItem.estMm18;
            newObj["estMm19"] = mergedItem.estMm19;
            newObj["estMm20"] = mergedItem.estMm20;
            newObj["estMm21"] = mergedItem.estMm21;
            newObj["estMm22"] = mergedItem.estMm22;
            newObj["estMm23"] = mergedItem.estMm23;
            newObj["estMm24"] = mergedItem.estMm24;
            newObj["poiId"] = condition.poiId;
            newObj["versionId"] = condition.versionId;
            let total = 0;
            for (let j = 1; j <= 24; j++) {
                const propName = `estMm${j}`;
                if (mergedItem[propName] !== null) {
                    total += mergedItem[propName];
                }
            }

            newObj["total"] = total;
            newObj["price"] = total * mergedItem.estUnitPrice;

            return newObj;
        });
        console.log(mergedData);
        return mergedData;
    };

    const fetchAllData = async (condition) => {
        //const requestSearch = {
        //    poiId: condition.poiId,
        //    useAt: "Y",
        //};
        if (innerPageName.name === "견적용 인건비") {
            const resultData = await axiosFetch("/api/estimate/personnel/estimateCostMM/totalListAll.do", condition || {});
            console.log(resultData, "퓨어 데이터");
            setEstimate([]);
            setestimateBool(false);
            if (resultData.length !== 0) {
                const result = processResultData(resultData, condition);
                console.log(result, "함수거치고 난거");
                //const formatData = mergeObjects(result);
                setEstimate(result);
                setestimateBool(true);
            }
        } else if (innerPageName.name === "견적용 구매비") {
            console.log("여기타는지 봐야해");
            setBuyIngInfo([]);
            setBuyIngBool(false);
            const resultData = await axiosFetch("/api/estimate/buy/estCostBuy/totalListAll.do", condition || {});
            if (resultData.length !== 0) {
                console.log(resultData, "견적용 구매비");
                setBuyIngInfo(resultData);
                setBuyIngBool(true);
            }
        }
        //const resultDa2 = await axiosFetch("/api/estimate/personnel/estimateCostMM/totalListAll.do", requestSearch);
        //const filteredData = filterData(updatedData);
    };

    const returnList = (originTableData, tableData) => {
        if (innerPageName.name === "견적용 인건비") {
            compareData(originTableData, tableData);
        } else if (innerPageName.name === "견적용 구매비") {
            console.log("이거안타나바");
            compareData2(originTableData, tableData);
        }
    };

    const compareData = (originData, updatedData) => {
        console.log("개발용 originData", originData);
        console.log("개발용 updatedData", updatedData);

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
                    updatedArray[i] = { ...updatedItem, estIdList: updatedArray[i].estIdList };
                }
                return updatedArray;
            };

            const firstRowUpdate = updateDataInOrigin(originData, updatedData);
            updateItem(firstRowUpdate); //수정

            const originAValues = originData.map((item) => item.estIdList); //삭제할 id 추출
            console.log(originAValues);
            const extraOriginData = originAValues.slice(updatedDataLength);
            console.log(extraOriginData);

            const flatArray = extraOriginData.flat(); //중첩배열 고르게만듦

            const delList = [];
            const delListTest = [];
            for (let i = updatedDataLength; i < originDataLength; i++) {
                delList.push(originData[i].estIdList);
                delListTest.push(originData[i]);
            }
            console.log(flatArray);
            console.log(delList);
            console.log(delListTest);

            deleteItem(flatArray); //삭제
        } else if (originDataLength === updatedDataLength) {
            console.log(filterData, "이걸로해야혀는디");
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

    const compareData2 = (originData, updatedData) => {
        console.log("🎄견적용 구매비", originData, "mod:", updatedData);
        const filterData = updatedData.filter((data) => data.pdiId); //필수값 체크

        // console.log("🎄filterData:", filterData);

        const originDataLength = originData ? originData.length : 0;
        const updatedDataLength = filterData ? filterData.length : 0;

        if (originDataLength > updatedDataLength) {
            //이전 id값은 유지하면서 나머지 값만 변경해주는 함수
            const updateDataInOrigin = (originData, filterData) => {
                // 복제하여 새로운 배열 생성
                const updatedArray = [...originData];
                // updatedData의 길이만큼 반복하여 originData 갱신
                for (let i = 0; i < Math.min(filterData.length, originData.length); i++) {
                    const updatedItem = filterData[i];
                    updatedArray[i] = { ...updatedItem, estBuyId: updatedArray[i].estBuyId };
                }
                return updatedArray;
            };

            const firstRowUpdate = updateDataInOrigin(originData, filterData);
            updateItem2(firstRowUpdate);

            const originAValues = originData.map((item) => item.estBuyId); //삭제할 id 추출
            const extraOriginData = originAValues.slice(updatedDataLength);

            deleteItem2(extraOriginData);
        } else if (originDataLength === updatedDataLength) {
            updateItem2(filterData);
        } else if (originDataLength < updatedDataLength) {
            const toUpdate = [];
            for (let i = 0; i < originDataLength; i++) {
                const temp = { ...filterData[i] };
                toUpdate.push(temp);
            }
            updateItem2(toUpdate);
            const addLists = [];

            for (let i = originDataLength; i < updatedDataLength; i++) {
                const addList = { ...filterData[i] };
                addList.poiId = condition.poiId;
                addList.versionId = condition.versionId;
                addLists.push(addList);
            }
            addItem2(addLists); //추가
        }
    };

    const addItem2 = async (addData) => {
        console.log(addData, "견적 구매 추가데이터");
        const url = `api/estimate/buy/estCostBuy/addList.do`;
        const resultData = await axiosPost(url, addData);
        console.log(resultData, "💜추가된거 확인addItem");
        if (resultData) {
            refresh();
        }
    };

    const updateItem2 = async (toUpdate) => {
        console.log(toUpdate, "업데이트 견적구매 데이터좀보자!");
        const url = `/api/estimate/buy/estCostBuy/editList.do`;
        console.log(toUpdate, "💜updateItem");
        const resultData = await axiosUpdate(url, toUpdate);
        console.log(resultData, "변경된거 맞음?");

        if (resultData) {
            refresh();
        }
    };

    const deleteItem2 = async (removeItem) => {
        console.log(removeItem, "견적 구매 삭제할놈들");
        const url = `/api/estimate/buy/estCostBuy/removeAll.do`;
        const resultData = await axiosDelete(url, removeItem);
        console.log(resultData, "지워진거맞음?");

        if (resultData) {
            refresh();
        }
    };

    const addItem = async (addData) => {
        console.log(addData, "견적 영업 추가데이터");
        const url = `/api/estimate/personnel/estimateCostMM/addArrayList.do`;
        const resultData = await axiosPost(url, addData);
        console.log(resultData, "💜추가된거 확인addItem");
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
        console.log(removeItem, "삭제할놈들");
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
                            {/*<HideCard title="합계" color="back-lightyellow" className="mg-b-40"></HideCard>*/}
                            <HideCard title="계획 등록/수정" color="back-lightblue">
                                <div className="table-buttons mg-t-10 mg-b-10">
                                    <PopupButton
                                        clickBtn={estimateBool}
                                        targetUrl={URL.LaborCostDoc}
                                        data={{ label: "견 적 서", poiId: condition.poiId, versionId: condition.versionId, tableData: estimate }}
                                    />
                                    <PopupButton
                                        clickBtn={estimateBool}
                                        targetUrl={URL.LaborSummaryDoc}
                                        data={{ label: "영업상세내역", poiId: condition.poiId, versionId: condition.versionId, tableData: estimate }}
                                    />
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
                                    returnSelectRows={(data) => {
                                        setSelectedRows(data);
                                    }}
                                    customDatasRefresh={refresh}
                                    condition={condition}
                                />
                            </HideCard>
                        </ul>
                    </div>
                    <div className="second">
                        <ul>
                            <ApprovalFormSal returnData={conditionInfo} initial={condition} />
                            {/*<HideCard title="합계" color="back-lightyellow" className="mg-b-40"></HideCard>*/}
                            <HideCard title="계획 등록/수정" color="back-lightblue">
                                <div className="table-buttons mg-t-10 mg-b-10">
                                    <PopupButton
                                        clickBtn={buyIngBool}
                                        targetUrl={URL.OrderBuyDoc}
                                        data={{ label: "견 적 서", poiId: condition.poiId, versionId: condition.versionId, tableData: buyIngInfo }}
                                    />
                                    <PopupButton
                                        clickBtn={buyIngBool}
                                        targetUrl={URL.OrderSummaryDoc}
                                        data={{ label: "구매상세내역", poiId: condition.poiId, versionId: condition.versionId, tableData: buyIngInfo }}
                                    />
                                    <SaveButton label={"저장"} onClick={() => setNameOfButton("save")} />
                                    <AddButton label={"추가"} onClick={() => setNameOfButton("addRow")} />
                                    <DelButton label={"삭제"} onClick={() => setNameOfButton("deleteRow")} />
                                    <RefreshButton onClick={refresh} />
                                </div>
                                <ReactDataTablePdorder
                                    editing={true}
                                    columns={columns.orderPlanMgmt.estimatePurchase}
                                    customDatas={buyIngInfo}
                                    returnList={returnList}
                                    viewPageName={{ name: "견적용 구매비", id: "orderBuying" }}
                                    returnSelectRows={(data) => {
                                        setSelectedRows(data);
                                    }}
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
