import React, { useContext, useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import { locationPath } from "constants/locationPath";
import { PageContext } from "components/PageProvider";
import { axiosDelete, axiosFetch, axiosPost, axiosUpdate } from "api/axiosFetch";
import { columns } from "constants/columns";
import ReactDataTableURL from "components/DataTable/ReactDataTableURL";
import ApprovalFormExe from "components/form/ApprovalFormExe";
import HideCard from "components/HideCard";
import SaveButton from "components/button/SaveButton";
import RefreshButton from "components/button/RefreshButton";
import ReactDataTable from "components/DataTable/ReactDataTable";
import BasicButton from "components/button/BasicButton";
/** 실행관리-경비관리-실행 */
function ExpenseMgmtExe() {
    const { setNameOfButton } = useContext(PageContext);

    const [condition, setCondition] = useState({});
    const [cal, setCal] = useState([]);

    const refresh = () => {
        if (condition.poiId) {
            fetchAllData(condition);
        }
    };

    const processResultDataView = (resultData, condition) => {
        const transformedData = resultData.reduce((accumulator, item) => {
            const {
                pjbgTypeCode,
                modeCode,
                pjbgPrice,
                pjbgBeginDt,
                pjbgEndDt,
                empNm,
                esntlId,
                pjbgDt,
                pgNm,
                pjbgDesc,
                pjbgTypeCode1,
                pjbgTypeCode2,
                pjbgTypeCode3,
                pjbgTypeCode4,
                pjbgTypeCode5,
                pjbgTypeCode19,
                pjbgTypeCode20,
                pjbgId,
                //posNm,
                //uniqId,
            } = item;

            if (/^EXPNS\d{2}$/.test(pjbgTypeCode) && ["BUDGET"].includes(modeCode)) {
                const key = `${modeCode}_${pjbgBeginDt}_${pjbgEndDt}_${pgNm}_${empNm}`;
                if (!accumulator[key]) {
                    accumulator[key] = {
                        pjbgTypeCodes: [],
                        modeCode,
                        pjbgPrices: [],
                        pjbgBeginDt,
                        pjbgEndDt,
                        empNm,
                        esntlId,
                        pjbgDt,
                        pgNm,
                        pjbgDesc,
                        pjbgTypeCode1,
                        pjbgTypeCode2,
                        pjbgTypeCode3,
                        pjbgTypeCode4,
                        pjbgTypeCode5,
                        pjbgTypeCode19,
                        pjbgTypeCode20,
                        pjbgId: [],
                        //posNm,
                        //uniqId,
                    };
                }

                accumulator[key].pjbgTypeCodes.push(pjbgTypeCode);
                accumulator[key].pjbgPrices.push(pjbgPrice);

                accumulator[key].pjbgId.push(pjbgId);
                accumulator[key].pjbgId.sort((a, b) => a - b);

                return accumulator;
            }

            return accumulator;
        }, {});
        console.log(transformedData, "transformedData");

        const mergedData = Object.values(transformedData).map((mergedItem, index) => {
            const newObj = {};
            console.log(mergedItem, "이거머더라");
            newObj["modeCode"] = mergedItem.modeCode;
            newObj["pjbgBeginDt"] = mergedItem.pjbgBeginDt;
            newObj["pjbgEndDt"] = mergedItem.pjbgEndDt;
            newObj["esntlId"] = mergedItem.esntlId;
            newObj["empNm"] = mergedItem.empNm;
            newObj["pjbgDt"] = mergedItem.pjbgBeginDt;
            newObj["pgNm"] = mergedItem.pgNm;
            newObj["pjbgDesc"] = mergedItem.pjbgDesc;
            newObj["pjbgId"] = mergedItem.pjbgId;
            newObj["pjbgId1"] = mergedItem.pjbgId[0];
            newObj["pjbgId2"] = mergedItem.pjbgId[1];
            newObj["pjbgId3"] = mergedItem.pjbgId[2];
            newObj["pjbgId4"] = mergedItem.pjbgId[3];
            newObj["pjbgId5"] = mergedItem.pjbgId[4];
            newObj["pjbgId19"] = mergedItem.pjbgId[5];
            newObj["pjbgId20"] = mergedItem.pjbgId[6];
            newObj["pjbgTypeCode1"] = mergedItem.pjbgPrices[0];
            newObj["pjbgTypeCode2"] = mergedItem.pjbgPrices[1];
            newObj["pjbgTypeCode3"] = mergedItem.pjbgPrices[2];
            newObj["pjbgTypeCode4"] = mergedItem.pjbgPrices[3];
            newObj["pjbgTypeCode5"] = mergedItem.pjbgPrices[4];
            newObj["pjbgTypeCode19"] = mergedItem.pjbgPrices[5];
            newObj["pjbgTypeCode20"] = mergedItem.pjbgPrices[6];
            newObj["poiId"] = condition.poiId;
            newObj["posNm"] = mergedItem.posNm;
            newObj["uniqId"] = mergedItem.uniqId;

            return newObj;
        });
        console.log(mergedData);
        return mergedData;
    };

    //실행경비에서 (영업비(정산)) 걸러주는함수
    function filterArray(data) {
        const filteredArray = [...data];
        for (let i = 0; i < filteredArray.length; i++) {
            if (filteredArray[i].pjbgBeginDt === null) {
                filteredArray.splice(i, 1);
                i--;
            }
        }

        return filteredArray;
    }

    const processResultData = (resultData, condition) => {
        console.log(resultData, "처음받는값인데");
        console.log(condition, "컨디션받나");
        const transformedData = resultData.reduce((accumulator, item) => {
            const {
                pjbgTypeCode,
                modeCode,
                pjbgPrice,
                pjbgBeginDt,
                pjbgEndDt,
                empNm,
                esntlId,
                pjbgDt,
                pgNm,
                pjbgDesc,
                pjbgTypeCode1,
                pjbgTypeCode2,
                pjbgTypeCode3,
                pjbgTypeCode4,
                pjbgTypeCode5,
                pjbgTypeCode19,
                pjbgTypeCode20,
                pjbgId,
            } = item;

            if (/^EXPNS\d{2}$/.test(pjbgTypeCode) && ["EXECUTE"].includes(modeCode)) {
                const key = `${modeCode}_${pjbgBeginDt}_${pjbgEndDt}_${pgNm}_${empNm}`;
                if (!accumulator[key]) {
                    accumulator[key] = {
                        pjbgTypeCodes: [],
                        modeCode,
                        pjbgPrices: [],
                        pjbgBeginDt,
                        pjbgEndDt,
                        empNm,
                        esntlId,
                        pjbgDt,
                        pgNm,
                        pjbgDesc,
                        pjbgTypeCode1,
                        pjbgTypeCode2,
                        pjbgTypeCode3,
                        pjbgTypeCode4,
                        pjbgTypeCode5,
                        pjbgTypeCode19,
                        pjbgTypeCode20,
                        pjbgId: [],
                    };
                }

                accumulator[key].pjbgTypeCodes.push(pjbgTypeCode);
                accumulator[key].pjbgPrices.push(pjbgPrice);
                accumulator[key].pjbgId.push(pjbgId);
                accumulator[key].pjbgId.sort((a, b) => a - b);

                return accumulator;
            }
            return accumulator;
        }, {});
        console.log(transformedData, "transformedData");

        const mergedData = Object.values(transformedData).map((mergedItem, index) => {
            const newObj = {};
            console.log(mergedItem, "이거머더라");
            newObj["modeCode"] = mergedItem.modeCode;
            newObj["pjbgBeginDt"] = mergedItem.pjbgBeginDt;
            newObj["pjbgEndDt"] = mergedItem.pjbgEndDt;
            newObj["esntlId"] = mergedItem.esntlId;
            newObj["empNm"] = mergedItem.empNm;
            newObj["pjbgDt"] = mergedItem.pjbgBeginDt;
            newObj["pgNm"] = mergedItem.pgNm;
            newObj["pjbgDesc"] = mergedItem.pjbgDesc;
            newObj["pjbgId"] = mergedItem.pjbgId;
            newObj["pjbgId1"] = mergedItem.pjbgId[0];
            newObj["pjbgId2"] = mergedItem.pjbgId[1];
            newObj["pjbgId3"] = mergedItem.pjbgId[2];
            newObj["pjbgId4"] = mergedItem.pjbgId[3];
            newObj["pjbgId5"] = mergedItem.pjbgId[4];
            newObj["pjbgId19"] = mergedItem.pjbgId[5];
            newObj["pjbgId20"] = mergedItem.pjbgId[6];
            newObj["pjbgTypeCode1"] = mergedItem.pjbgPrices[0];
            newObj["pjbgTypeCode2"] = mergedItem.pjbgPrices[1];
            newObj["pjbgTypeCode3"] = mergedItem.pjbgPrices[2];
            newObj["pjbgTypeCode4"] = mergedItem.pjbgPrices[3];
            newObj["pjbgTypeCode5"] = mergedItem.pjbgPrices[4];
            newObj["pjbgTypeCode19"] = mergedItem.pjbgPrices[5];
            newObj["pjbgTypeCode20"] = mergedItem.pjbgPrices[6];
            newObj["poiId"] = condition.poiId;

            return newObj;
        });
        console.log(mergedData);
        return mergedData;
    };

    const returnList = (originTableData, tableData) => {
        console.log(originTableData, tableData);
        compareData(originTableData, tableData);
    };

    const compareData = (originData, updatedData) => {
        console.log("타나");
        const filterData = updatedData.filter((data) => data.poiId); //pmpMonth가 없는 데이터 제외
        const originDataLength = originData ? originData.length : 0;
        const updatedDataLength = filterData ? filterData.length : 0;

        if (originDataLength > updatedDataLength) {
            console.log(originDataLength, "originDataLength");
            console.log(updatedDataLength, "updatedDataLength");

            //이전 id값은 유지하면서 나머지 값만 변경해주는 함수
            const updateDataInOrigin = (originData, updatedData) => {
                const updatedArray = [...originData];

                for (let i = 0; i < Math.min(updatedData.length, originData.length); i++) {
                    const updatedItem = updatedData[i];
                    console.log(updatedItem, "길이가궁금");
                    updatedArray[i] = {
                        ...updatedItem,
                        pjbgId: updatedArray[i].pjbgId,
                        pjbgId1: updatedArray[i].pjbgId1,
                        pjbgId2: updatedArray[i].pjbgId2,
                        pjbgId3: updatedArray[i].pjbgId3,
                        pjbgId4: updatedArray[i].pjbgId4,
                        pjbgId5: updatedArray[i].pjbgId5,
                        pjbgId19: updatedArray[i].pjbgId19,
                        pjbgId20: updatedArray[i].pjbgId20,
                    };
                }

                return updatedArray;
            };

            const firstRowUpdate = updateDataInOrigin(originData, updatedData);
            updateItem(firstRowUpdate); //수정

            const delList = [];
            const delListTest = [];
            for (let i = updatedDataLength; i < originDataLength; i++) {
                delList.push(originData[i].pjbgId);
                delListTest.push(originData[i]);
            }
            deleteItem(delList); //삭제
        } else if (originDataLength === updatedDataLength) {
            updateItem(filterData); //수정
        } else if (originDataLength < updatedDataLength) {
            const updateList = [];

            for (let i = 0; i < originDataLength; i++) {
                updateList.push(filterData[i]);
            }
            updateItem(updateList); //수정

            const addList = [];
            for (let i = originDataLength; i < updatedDataLength; i++) {
                const newItem = filterData[i];

                // Add default value for esntlId if it doesn't exist
                if (!newItem.esntlId) {
                    newItem.esntlId = "";
                }
                for (let j = 1; j <= 5; j++) {
                    const propName = `pjbgTypeCode${j}`;
                    if (newItem[propName] === null || newItem[propName] === undefined) {
                        newItem[propName] = 0;
                    }
                }

                const propName19 = "pjbgTypeCode19";
                if (newItem[propName19] === null || newItem[propName19] === undefined) {
                    newItem[propName19] = 0;
                }
                const propName20 = "pjbgTypeCode20";
                if (newItem[propName20] === null || newItem[propName20] === undefined) {
                    newItem[propName20] = 0;
                }
                addList.push(newItem);
            }
            console.log(addList, "이거나오는거보자");
            addItem(addList); //추가
        }
    };

    //그대로 가져올시 Id를 가져오기떄문에 추가할때는 자동추가를 위해 삭제해줘야함
    const removeSpecificProperties = (data) => {
        // 제거할 속성 목록
        const propertiesToRemove = ["pjbgId", "pjbgId1", "pjbgId2", "pjbgId3", "pjbgId4", "pjbgId5", "pjbgId19", "pjbgId20"];

        // 주어진 데이터의 각 항목에 대해 속성 제거
        const modifiedData = data.map((item) => {
            // 주어진 속성 목록에서 각 속성을 제거
            propertiesToRemove.forEach((property) => {
                delete item[property];
            });

            return item;
        });

        return modifiedData;
    };

    const addItem = async (addData) => {
        console.log(addData, "추가되야함");
        addData.forEach((data) => {
            data.modeCode = "EXECUTE";
            data.poiId = condition.poiId;
        });
        let resultData = "";
        const url = `/api/baseInfrm/product/pjbudgetExe/addArrayList.do`;
        if (addData.length > 0 && addData[0].pjbgId) {
            const modifiedAddData = removeSpecificProperties(addData);
            resultData = await axiosPost(url, modifiedAddData);
        } else {
            resultData = await axiosPost(url, addData);
        }

        if (resultData) {
            refresh && refresh();
        }
    };

    const updateItem = async (toUpdate) => {
        console.log(toUpdate, "업데이트 값은?");
        toUpdate.forEach((data) => {
            data.modeCode = "EXECUTE";
            data.poiId = condition.poiId;
        });
        console.log(toUpdate, "업데이트 변경후");

        const url = `/api/baseInfrm/product/pjbudgetExe/editArrayList.do`;
        const resultData = await axiosUpdate(url, toUpdate);

        if (resultData) {
            refresh && refresh();
        }
    };

    const deleteItem = async (removeItem) => {
        const mergedArray = [].concat(...removeItem);
        console.log(mergedArray, "삭제될놈들");
        const url = `/api/baseInfrm/product/pjbudgetExe/removeAll.do`;
        const resultData = await axiosDelete(url, mergedArray);

        if (resultData) {
            refresh && refresh();
        }
    };

    const [isClicked, setIsClicked] = useState(false);
    const [isClicked2, setIsClicked2] = useState(false);
    const [isClicked3, setIsClicked3] = useState(false);
    const [isClicked4, setIsClicked4] = useState(false);

    const [poiIdToSend, setPoiIdToSend] = useState();

    const sendPoiId = (poiId) => {
        setPoiIdToSend(poiId);
    };

    const handleClick1 = () => {
        setIsClicked(!isClicked);
    };

    const handleClick2 = () => {
        setIsClicked2(!isClicked2);
    };

    const handleClick3 = () => {
        setIsClicked3(!isClicked3);
    };

    const handleClick4 = () => {
        setIsClicked4(!isClicked4);
    };

    const [runExeMgmt, setExeRunMgmt] = useState([]); // 경비 실행관리
    const [runMgmtView, setRunMgmtView] = useState([]); // 경비 계획조회

    const updatePjbgType = (viewData) => {
        const pjbgTypeMap = {
            EXPNS01: "교통비",
            EXPNS02: "숙박비",
            EXPNS03: "일비/파견비",
            EXPNS04: "식비",
            EXPNS05: "자재/소모품외",
            EXPNS06: "국내출장비",
            EXPNS07: "시내교통비",
            EXPNS08: "PJT 파견비",
            EXPNS09: "사무실임대료",
            EXPNS10: "소모품비",
            EXPNS11: "행사비",
            EXPNS12: "요식성경비",
            EXPNS13: "전산소모품비",
            EXPNS14: "도서인쇄비",
            EXPNS15: "통신비",
            EXPNS16: "해외출장비",
            EXPNS17: "배송비",
            EXPNS18: "예비비",
            EXPNS19: "영업비",
            EXPNS20: "기타",
        };

        const updatedViewData = viewData.map((item) => ({
            ...item,
            pjbgTypeCode: pjbgTypeMap[item.pjbgTypeCode] || item.pjbgTypeCode,
        }));

        return updatedViewData;
    };

    const conditionInfo = (value) => {
        setCondition((prev) => {
            if (prev.poiId !== value.poiId) {
                const newCondition = { poiId: value.poiId, modeCode: "EXECUTE" };
                fetchAllData(newCondition);
                return newCondition;
            }
            return prev;
        });
    };

    const fetchAllData = async (condition) => {
        const resultData = await axiosFetch("/api/baseInfrm/product/pjbudgetExe/totalListAll.do", condition);
        const viewData = await axiosFetch("/api/baseInfrm/product/pjbudgetExe/totalListAll.do", { poiId: condition.poiId, modeCode: "BUDGET" });
        const updatedViewData = processResultDataView(viewData, condition);
        console.log(updatedViewData, "이거설마 초기화댐?");
        setRunMgmtView(updatedViewData);
        if (resultData && resultData.length > 0) {
            const updatedData = processResultData(resultData, condition);
            const filteredData = filterArray(updatedData);
            setExeRunMgmt(filteredData);
            let total = 0,
                pjbgTypeCode1 = 0,
                pjbgTypeCode2 = 0,
                pjbgTypeCode3 = 0,
                pjbgTypeCode4 = 0,
                pjbgTypeCode5 = 0,
                pjbgTypeCode20 = 0;
            filteredData.map((data) => {
                pjbgTypeCode1 += data.pjbgTypeCode1; //교통비
                pjbgTypeCode2 += data.pjbgTypeCode2; //숙박비
                pjbgTypeCode3 += data.pjbgTypeCode3; //일비/파견비
                pjbgTypeCode4 += data.pjbgTypeCode4; //식비
                pjbgTypeCode5 += data.pjbgTypeCode5; //자재/소모품외
                pjbgTypeCode20 += data.pjbgTypeCode20; //기타
            });
            total = pjbgTypeCode1 + pjbgTypeCode2 + pjbgTypeCode3 + pjbgTypeCode4 + pjbgTypeCode5 + pjbgTypeCode20;
            setCal([{ total, pjbgTypeCode1, pjbgTypeCode2, pjbgTypeCode3, pjbgTypeCode4, pjbgTypeCode5, pjbgTypeCode20 }]);
        } else {
            alert("no data");
            setExeRunMgmt([]);
        }
    };

    return (
        <>
            <Location pathList={locationPath.ExpenseMgmt} />
            <ApprovalFormExe returnData={conditionInfo} />
            <HideCard title="계획 조회" color="back-gray" className="mg-b-40">
                <ReactDataTable columns={columns.expenseMgmt.budget} customDatas={runMgmtView} defaultPageSize={5} hideCheckBox={true} />
            </HideCard>
            <HideCard title="합계" color="back-lightyellow" className="mg-b-40">
                <ReactDataTable columns={columns.expenseMgmt.cal} customDatas={cal} defaultPageSize={5} hideCheckBox={true} />
            </HideCard>
            <HideCard title="등록/수정" color="back-lightblue">
                <div className="table-buttons mg-b-m-30">
                    <BasicButton label={"가져오기"} onClick={() => setNameOfButton("load")} />
                    <SaveButton label={"저장"} onClick={() => setNameOfButton("save")} />
                    <RefreshButton onClick={refresh} />
                </div>
                <ReactDataTableURL
                    editing={true}
                    columns={columns.expenseMgmt.budget}
                    returnList={returnList}
                    viewLoadDatas={runMgmtView}
                    viewPageName={{ name: "경비", id: "ExpenseMgmtExe" }}
                    customDatas={runExeMgmt}
                    customDatasRefresh={refresh}
                    condition={condition}
                />
            </HideCard>
        </>
    );
}

export default ExpenseMgmtExe;
