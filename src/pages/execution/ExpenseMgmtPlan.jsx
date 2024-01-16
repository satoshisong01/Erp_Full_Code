import React, { useContext, useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import { locationPath } from "constants/locationPath";
import { PageContext } from "components/PageProvider";
import { axiosDelete, axiosFetch, axiosPost, axiosUpdate } from "api/axiosFetch";
import { columns } from "constants/columns";
import RefreshButton from "components/button/RefreshButton";
import ReactDataTableURL from "components/DataTable/ReactDataTableURL";
import ApprovalFormExe from "components/form/ApprovalFormExe";
import HideCard from "components/HideCard";
import SaveButton from "components/button/SaveButton";
import ReactDataTable from "components/DataTable/ReactDataTable";
/** 실행관리-경비-계획 */
function ExpenseMgmtPlan() {
    const { setNameOfButton } = useContext(PageContext);
    const [pjbudgetDatasView, setPjbudgetDatasView] = useState([]); // 경비
    const [pjbudgetCalDatas, setPjbudgetCalDatas] = useState([]); // 경비
    const [condition, setCondition] = useState({});

    const refresh = () => {
        if (condition.poiId) {
            fetchAllData(condition);
        }
    };

    const columnExpensesView = [
        // 경비
        {
            header: "경비목록",
            col: "pjbgTypeCode",
            cellWidth: "300",
            type: "select",
            options: [
                { value: "", label: "선택" },
                { value: "EXPNS01", label: "교통비" },
                { value: "EXPNS02", label: "숙박비" },
                { value: "EXPNS03", label: "일비/파견비" },
                { value: "EXPNS04", label: "식비" },
                { value: "EXPNS05", label: "자재/소모품외" },
                { value: "EXPNS06", label: "국내출장비" },
                { value: "EXPNS07", label: "시내교통비" },
                { value: "EXPNS08", label: "PJT 파견비" },
                { value: "EXPNS09", label: "사무실임대료" },
                { value: "EXPNS10", label: "소모품비" },
                { value: "EXPNS11", label: "행사비" },
                { value: "EXPNS12", label: "요식성경비" },
                { value: "EXPNS13", label: "전산소모품비" },
                { value: "EXPNS14", label: "도서인쇄비" },
                { value: "EXPNS15", label: "통신비" },
                { value: "EXPNS16", label: "해외출장비" },
                { value: "EXPNS17", label: "배송비" },
                { value: "EXPNS18", label: "예비비" },
                { value: "EXPNS19", label: "영업비" },
                { value: "EXPNS20", label: "기타" },
            ],
            require: true,
        },
        { header: "내용", col: "pjbgDesc", cellWidth: "780", type: "desc" },
        { header: "금액", col: "pjbgPrice", cellWidth: "300", type: "input", require: true },
        { header: "프로젝트ID", col: "poiId", notView: true, cellWidth: "0" },
        // { header: "영업타입", col: "modeCode", notView: true },
        { header: "사용여부", col: "deleteAt", notView: true, cellWidth: "0" },
        { header: "삭제여부", col: "useAt", notView: true, cellWidth: "0" },
        { header: "버전", col: "versionId", notView: true, cellWidth: "0" },
    ];

    const processResultData = (resultData, condition) => {
        console.log(resultData, "처음받는값인데");
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

    const [budgetMgmt, setBudgetMgmt] = useState([]); // 경비 예산관리
    const allowedPjbgTypeCodes = ["EXPNS01", "EXPNS02", "EXPNS03", "EXPNS04", "EXPNS05", "EXPNS06"];
    const [saveNum, setSaveNum] = useState([]);
    const [cal, setCal] = useState([]);

    // pjbgTypeCode를 기반으로 그룹화된 데이터 객체 생성
    // view에 계산된 Total값 출력구문
    useEffect(() => {
        const groupedData =
            saveNum && saveNum.length > 0
                ? saveNum.reduce((result, item) => {
                      const { pjbgTypeCode, pjbgPrice } = item;

                      // 허용된 pjbgTypeCode만 고려
                      if (allowedPjbgTypeCodes.includes(pjbgTypeCode)) {
                          if (!result[pjbgTypeCode]) {
                              result[pjbgTypeCode] = 0;
                          }
                          result[pjbgTypeCode] += pjbgPrice;
                      }

                      return result;
                  }, {})
                : {};

        // 모든 허용된 pjbgTypeCode에 대해 확인하여 누락된 경우 0 값 객체 추가
        allowedPjbgTypeCodes.forEach((code) => {
            if (!groupedData[code]) {
                groupedData[code] = 0;
            }
        });

        // 결과를 배열로 변환
        const resultObject = Object.keys(groupedData).reduce((acc, code) => {
            acc[code] = groupedData[code];
            return acc;
        }, {});

        console.log(resultObject, "경비수주 경비더한 토탈값");
    }, [saveNum]);

    const returnList = (originTableData, tableData) => {
        console.log(originTableData, tableData);
        compareData(originTableData, tableData);
    };

    const compareData = (originData, updatedData) => {
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

    //function transformData(inputData) {
    //    // Iterate over each item in the array
    //    for (let i = 0; i < inputData.length; i++) {
    //        const item = inputData[i];

    //        // Extract the pjbgId array and iterate over its values
    //        const pjbgIdArray = item.pjbgId;
    //        for (let j = 0; j < pjbgIdArray.length; j++) {
    //            // Create new property with modified name and value
    //            item[`pjbgId${j + 1}`] = pjbgIdArray[j];
    //        }

    //        // Rename the last property to pjbgId20
    //        const lastIdx = pjbgIdArray.length;
    //        item.pjbgId20 = item[`pjbgId${lastIdx}`];
    //        delete item[`pjbgId${lastIdx}`];

    //        // Remove the original pjbgId property
    //        delete item.pjbgId;
    //    }
    //    return inputData;
    //}

    const addItem = async (addData) => {
        console.log(addData, "추가되야함");
        const url = `/api/baseInfrm/product/pjbudgetExe/addArrayList.do`;
        const resultData = await axiosPost(url, addData);

        if (resultData) {
            refresh && refresh();
        }
    };

    const updateItem = async (toUpdate) => {
        //toUpdate.forEach((item) => {
        //    if (item.pjbgDt) {
        //        item.pjbgDt = `${item.pjbgDt}-01`;
        //    }
        //});
        console.log(toUpdate, "업데이트 값은?");
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

    const conditionInfo = (value) => {
        setCondition((prev) => {
            if (prev.poiId !== value.poiId) {
                const newCondition = { poiId: value.poiId, modeCode: "BUDGET" };
                fetchAllData(newCondition);
                return newCondition;
            }
            return prev;
        });
    };

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

    const fetchAllData = async (condition) => {
        console.log("경비계획 조회 컨디션:", condition);
        const resultData = await axiosFetch("/api/baseInfrm/product/pjbudgetExe/totalListAll.do", condition);
        const viewData = await axiosFetch("/api/baseInfrm/product/pjbudget/totalListAll.do", condition);
        const updatedViewData = updatePjbgType(viewData);
        setPjbudgetDatasView(updatedViewData || []);
        if (resultData && resultData.length > 0) {
            console.log(resultData, "경비데이터에 직급불러오는지보자");
            const updatedData = processResultData(resultData, condition);
            setBudgetMgmt(updatedData);
            console.log("✨✨경비계획 조회 updatedData:", updatedData);
            let total = 0,
                pjbgTypeCode1 = 0,
                pjbgTypeCode2 = 0,
                pjbgTypeCode3 = 0,
                pjbgTypeCode4 = 0,
                pjbgTypeCode5 = 0,
                pjbgTypeCode20 = 0;
            updatedData.map((data) => {
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
            setBudgetMgmt([]);
        }
    };

    return (
        <>
            <Location pathList={locationPath.ExpenseMgmt} />
            <ApprovalFormExe returnData={conditionInfo} />
            <HideCard title="계획 조회" color="back-gray" className="mg-b-40">
                <ReactDataTable columns={columnExpensesView} customDatas={pjbudgetDatasView} defaultPageSize={5} hideCheckBox={true} />
            </HideCard>
            <HideCard title="합계" color="back-lightyellow" className="mg-b-40">
                <ReactDataTable columns={columns.expenseMgmt.cal} customDatas={cal} defaultPageSize={5} hideCheckBox={true} />
            </HideCard>
            <HideCard title="등록/수정" color="back-lightblue">
                <div className="table-buttons mg-b-m-30">
                    <SaveButton label={"저장"} onClick={() => setNameOfButton("save")} />
                    <RefreshButton onClick={refresh} />
                </div>
                <ReactDataTableURL
                    editing={true}
                    returnList={returnList}
                    columns={columns.expenseMgmt.budget}
                    customDatas={budgetMgmt}
                    viewPageName={{ name: "경비", id: "ExpenseMgmtPlan" }}
                    customDatasRefresh={refresh}
                    condition={condition}
                />
            </HideCard>
        </>
    );
}

export default ExpenseMgmtPlan;
