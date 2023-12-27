import React, { useContext, useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import { locationPath } from "constants/locationPath";
import { PageContext } from "components/PageProvider";
import { axiosFetch } from "api/axiosFetch";
import { columns } from "constants/columns";
import RefreshButton from "components/button/RefreshButton";
import ReactDataTableURL from "components/DataTable/ReactDataTableURL";
import ApprovalFormExe from "components/form/ApprovalFormExe";
import HideCard from "components/HideCard";
import SaveButton from "components/button/SaveButton";
/** 실행관리-경비-계획 */
function ExpenseMgmtPlan() {
    const { projectInfo, setProjectInfo, currentPageName, setCurrentPageName, setNameOfButton } = useContext(PageContext);

    useEffect(() => {
        const current = "경비계획";
        if(current === "경비계획" && currentPageName !== "경비계획") {
            setCurrentPageName("경비계획")
        }
        return () => {
            setProjectInfo({});
        };
    }, [currentPageName]);

    const [poiIdToSend, setPoiIdToSend] = useState();

    const refresh = () => {
        if(projectInfo.poiId) {
            fetchAllData({poiId: projectInfo.poiId, modeCode: "BUDGET"});
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
                pjbgTypeCode01,
                pjbgTypeCode02,
                pjbgTypeCode03,
                pjbgTypeCode04,
                pjbgTypeCode05,
                pjbgId,
            } = item;

            if (/^EXPNS\d{2}$/.test(pjbgTypeCode) && ["EXDR", "EXCP", "EXCU"].includes(modeCode)) {
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
                        pjbgTypeCode01,
                        pjbgTypeCode02,
                        pjbgTypeCode03,
                        pjbgTypeCode04,
                        pjbgTypeCode05,
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

        const mergedData = Object.values(transformedData).map((mergedItem, index) => {
            const newObj = {};
            mergedItem.pjbgTypeCodes.forEach((code, innerIndex) => {
                newObj[`pjbgTypeCode${code.replace("EXPNS", "")}`] = code;
                newObj[`pjbgPrice${code.replace("EXPNS", "")}`] = mergedItem.pjbgPrices[innerIndex];
            });
            newObj["modeCode"] = mergedItem.modeCode;
            newObj["pjbgBeginDt"] = mergedItem.pjbgBeginDt;
            newObj["pjbgEndDt"] = mergedItem.pjbgEndDt;
            newObj["pjbgManpower"] = mergedItem.pjbgManpower;
            newObj["pjbgDt"] = mergedItem.pjbgBeginDt;
            newObj["pgNm"] = mergedItem.pgNm;
            newObj["pjbgDesc"] = mergedItem.pjbgDesc;
            newObj["pjbgTypeCode01"] = mergedItem.pjbgPrice01;
            newObj["pjbgTypeCode02"] = mergedItem.pjbgPrice02;
            newObj["pjbgTypeCode03"] = mergedItem.pjbgPrice03;
            newObj["pjbgTypeCode04"] = mergedItem.pjbgPrice04;
            newObj["pjbgTypeCode05"] = mergedItem.pjbgPrice05;
            newObj["pjbgId"] = mergedItem.pjbgId;

            return newObj;
        });

        return mapPecModeCodeToText(mergedData);
    };

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
        const resultData = await axiosFetch("/api/baseInfrm/product/pjbudget/totalListAll.do", condition);
        const updatedData = processResultData(resultData);
        setBudgetMgmt(updatedData);
        console.log("경비계획 조회 updatedData:", updatedData);
    };

    return (
        <>
            <Location pathList={locationPath.ExpenseMgmt} />
            <ApprovalFormExe viewPageName="경비계획" returnData={(condition) => fetchAllData({...condition, modeCode: "BUDGET"})} />
            <HideCard title="계획 조회" color="back-gray" className="mg-b-40">
            </HideCard>
            <HideCard title="합계" color="back-lightyellow" className="mg-b-40">
            </HideCard>
            <HideCard title="계획 등록/수정" color="back-lightblue">
                <div className="table-buttons mg-b-m-30">
                    <SaveButton label={"저장"} onClick={() => setNameOfButton("save")} />
                    <RefreshButton onClick={refresh} />
                </div>
                <ReactDataTableURL
                    suffixUrl="/baseInfrm/product/pjbudgetExe"
                    editing={true}
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
