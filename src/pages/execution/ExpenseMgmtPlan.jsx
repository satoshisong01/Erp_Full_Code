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
/** 실행관리-경비-계획 */
function ExpenseMgmtPlan() {
    const { projectInfo, setProjectInfo, currentPageName, setCurrentPageName, setNameOfButton, setInnerPageName } = useContext(PageContext);

    useEffect(() => {
        setInnerPageName("경비계획");
        setCurrentPageName(""); //inner와 pageName은 동시에 사용 X

        return () => {
            setProjectInfo({});
        };
    }, [currentPageName]);

    const [poiIdToSend, setPoiIdToSend] = useState();

    const refresh = () => {
        if (projectInfo.poiId) {
            fetchAllData({ poiId: projectInfo.poiId, modeCode: "BUDGET" });
        }
    };

    const processResultData = (resultData) => {
        console.log(resultData, "처음받는값인데");
        const transformedData = resultData.reduce((accumulator, item) => {
            const {
                pjbgTypeCode,
                modeCode,
                pjbgPrice,
                pjbgBeginDt,
                pjbgEndDt,
                pjbgManpower,
                pjbgDt,
                pgNm,
                pjbgDesc,
                pjbgTypeCode1,
                pjbgTypeCode2,
                pjbgTypeCode3,
                pjbgTypeCode4,
                pjbgTypeCode5,
                pjbgTypeCode20,
                pjbgId,
            } = item;

            if (/^EXPNS\d{2}$/.test(pjbgTypeCode) && ["BUDGET"].includes(modeCode)) {
                const key = `${modeCode}_${pjbgBeginDt}_${pjbgEndDt}_${pgNm}_${pjbgManpower}_${pjbgDesc}`;
                if (!accumulator[key]) {
                    accumulator[key] = {
                        pjbgTypeCodes: [],
                        modeCode,
                        pjbgPrices: [],
                        pjbgBeginDt,
                        pjbgEndDt,
                        pjbgManpower,
                        pjbgDt,
                        pgNm,
                        pjbgDesc,
                        pjbgTypeCode1,
                        pjbgTypeCode2,
                        pjbgTypeCode3,
                        pjbgTypeCode4,
                        pjbgTypeCode5,
                        pjbgTypeCode20,
                        pjbgId: [],
                    };
                }

                accumulator[key].pjbgTypeCodes.push(pjbgTypeCode);
                accumulator[key].pjbgPrices.push(pjbgPrice);
                accumulator[key].pjbgId.push(pjbgId);

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
            newObj["pjbgManpower"] = mergedItem.pjbgManpower;
            newObj["pjbgDt"] = mergedItem.pjbgBeginDt;
            newObj["pgNm"] = mergedItem.pgNm;
            newObj["pjbgDesc"] = mergedItem.pjbgDesc;
            //newObj["pjbgTypeCode1"] = mergedItem.pjbgPrice01;
            //newObj["pjbgTypeCode2"] = mergedItem.pjbgPrice02;
            //newObj["pjbgTypeCode3"] = mergedItem.pjbgPrice03;
            //newObj["pjbgTypeCode4"] = mergedItem.pjbgPrice04;
            //newObj["pjbgTypeCode5"] = mergedItem.pjbgPrice05;
            //newObj["pjbgTypeCode20"] = mergedItem.pjbgPrice20;
            newObj["pjbgId"] = mergedItem.pjbgId;

            // 수정된 부분 시작
            mergedItem.pjbgTypeCodes.forEach((code, innerIndex) => {
                newObj[`pjbgTypeCode${code.replace("EXPNS", "")}`] = {
                    code: code,
                    price: mergedItem.pjbgPrices[innerIndex],
                };
            });
            // 수정된 부분 끝

            newObj["pjbgId"] = mergedItem.pjbgId;

            return newObj;
        });
        console.log(mergedData);
    };
    //return mapPecModeCodeToText(mergedData);

    const [budgetMgmt, setBudgetMgmt] = useState([]); // 경비 예산관리
    const allowedPjbgTypeCodes = ["EXPNS01", "EXPNS02", "EXPNS03", "EXPNS04", "EXPNS05", "EXPNS06"];
    const [saveNum, setSaveNum] = useState([]);

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

    //useEffect(() => {
    //    const filteredData = saveNum && saveNum.length > 0 ? saveNum.filter((item) => allowedPjbgTypeCodes.includes(item.pjbgTypeCode)) : [];

    //    const groupedData = filteredData.reduce((result, item) => {
    //        const { pjbgTypeCode, pjbgPrice } = item;
    //        if (!result[pjbgTypeCode]) {
    //            result[pjbgTypeCode] = 0;
    //        }
    //        result[pjbgTypeCode] += pjbgPrice;
    //        return result;
    //    }, {});
    //    allowedPjbgTypeCodes.forEach((code) => {
    //        if (!groupedData[code]) {
    //            groupedData[code] = 0;
    //        }
    //    });
    //    const resultObject = Object.keys(groupedData).reduce((acc, code) => {
    //        acc[code] = groupedData[code];
    //        return acc;
    //    }, {});
    //    console.log(resultObject, "경비수주 경비더한 토탈값");
    //}, [saveNum]);

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
            //이전 id값은 유지하면서 나머지 값만 변경해주는 함수
            const updateDataInOrigin = (originData, updatedData) => {
                // 복제하여 새로운 배열 생성
                const updatedArray = [...originData];
                // updatedData의 길이만큼 반복하여 originData 갱신
                for (let i = 0; i < Math.min(updatedData.length, originData.length); i++) {
                    const updatedItem = updatedData[i];
                    updatedArray[i] = { ...updatedItem, pjbgId: updatedArray[i].pjbgId };
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
                addList.push(filterData[i]);
            }
            addItem(addList); //추가
        }
    };

    const addItem = async (addData) => {
        addData.forEach((item) => {
            if (item.pjbgDt) {
                item.pjbgDt = `${item.pjbgDt}-01`;
            }
        });
        console.log(addData, "추가되야함");
        const url = `/api/baseInfrm/product/pjbudgetExe/addArrayList.do`;
        const resultData = await axiosPost(url, addData);

        if (resultData) {
            refresh && refresh();
        }
    };

    const updateItem = async (toUpdate) => {
        const url = `/api/baseInfrm/product/pjbudgetExe/editArrayList.do`;
        const resultData = await axiosUpdate(url, toUpdate);

        if (resultData) {
            refresh && refresh();
        }
    };

    const deleteItem = async (removeItem) => {
        const url = `/api/baseInfrm/product/pjbudgetExe/removeAll.do`;
        const resultData = await axiosDelete(url, removeItem);

        if (resultData) {
            refresh && refresh();
        }
    };

    const mapPecModeCodeToText = (data) => {
        for (let i = 0; i < data.length; i++) {
            switch (data[i].modeCode) {
                case "EXDR":
                    data[i].modeCode = "수주";
                    break;
                case "EXCP":
                    data[i].modeCode = "예산";
                    break;
                case "EXCU":
                    data[i].modeCode = "실행";
                    break;
                default:
                    return;
            }
        }
        return data;
    };

    const fetchAllData = async (condition) => {
        console.log("경비계획 조회 컨디션:", condition);
        const resultData = await axiosFetch("/api/baseInfrm/product/pjbudgetExe/totalListAll.do", condition);
        const updatedData = processResultData(resultData);
        setBudgetMgmt(updatedData);
        console.log("경비계획 조회 updatedData:", updatedData);
    };

    return (
        <>
            <Location pathList={locationPath.ExpenseMgmt} />
            <ApprovalFormExe viewPageName="경비계획" returnData={(condition) => fetchAllData({ ...condition, modeCode: "BUDGET" })} />
            <HideCard title="계획 조회" color="back-gray" className="mg-b-40"></HideCard>
            <HideCard title="합계" color="back-lightyellow" className="mg-b-40"></HideCard>
            <HideCard title="계획 등록/수정" color="back-lightblue">
                <div className="table-buttons mg-b-m-30">
                    <SaveButton label={"저장"} onClick={() => setNameOfButton("save")} />
                    <RefreshButton onClick={refresh} />
                </div>
                <ReactDataTableURL
                    editing={true}
                    returnList={returnList}
                    columns={columns.expenseMgmt.budget}
                    customDatas={budgetMgmt}
                    viewPageName="경비계획"
                    customDatasRefresh={refresh}
                />
            </HideCard>
        </>
    );
}

export default ExpenseMgmtPlan;
