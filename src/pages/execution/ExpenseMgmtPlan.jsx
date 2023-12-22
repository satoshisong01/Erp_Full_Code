import React, { useContext, useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import { locationPath } from "constants/locationPath";
import { PageContext } from "components/PageProvider";
import { axiosFetch } from "api/axiosFetch";
import { columns } from "constants/columns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import RefreshButton from "components/button/RefreshButton";
import ReactDataTableURL from "components/DataTable/ReactDataTableURL";
import ApprovalFormExe from "components/form/ApprovalFormExe";
import HideCard from "components/HideCard";
/** 실행관리-경비-계획 */
function ExpenseMgmtPlan() {
    const {
        currentPageName,
        innerPageName,
        setInnerPageName,
        setCurrentPageName,
        projectInfo,
        setProjectInfo,
    } = useContext(PageContext);

    // const { showDetailTable } = useContext(PageContext);
    useEffect(() => {
        setInnerPageName("경비 조회관리");
        setCurrentPageName(""); //inner와 pageName은 동시에 사용 X

        return () => {
            // 컴포넌트 종료
            setProjectInfo({}); // 초기화
        };
    }, []);


    const orderPlanMgmtTable3 = useRef(null);

    const [isClicked3, setIsClicked3] = useState(false);

    const [poiIdToSend, setPoiIdToSend] = useState();

    const handleClick3 = () => {
        setIsClicked3(!isClicked3);
    };


    const refresh = () => {
        fetchData();
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

    const fetchData = async () => {
        try {
           if (innerPageName === "경비 예산관리") {
                const data = await fetchAllData("/api/baseInfrm/product/pjbudget/totalListAll.do", innerPageName);
                const updatedData = processResultData(data);
                setBudgetMgmt(updatedData);
            }
        } catch (error) {
            console.error("데이터를 가져오는 중에 오류 발생:", error);
        }
    };
    useEffect(() => {
        fetchData(); // fetchData 함수를 호출하여 데이터를 가져옵니다.
    }, [poiIdToSend, projectInfo.poiId, innerPageName]);

    const fetchAllData = async (url, currentTask) => {
        const requestData = { poiId: projectInfo.poiId, modeCode: "EXCP" };

        const resultData = await axiosFetch(url, requestData);
        if (resultData) {
            console.log(resultData, "원래 나오는값");
            return resultData;
        } else {
            return Array(5).fill({}); // 빈 배열 보내주기
        }
    };

    return (
        <>
            <Location pathList={locationPath.ExpenseMgmt} />
            {/* <SearchList conditionList={conditionList} onSearch={handleReturn} /> */}
            <ApprovalFormExe viewPageName="실행경비계획" />
            <HideCard title="계획 조회" color="back-gray" className="mg-b-40">
            </HideCard>
            <HideCard title="합계" color="back-lightyellow" className="mg-b-40">
            </HideCard>
            <HideCard title="계획 등록/수정" color="back-lightblue">
                <div className="table-buttons mg-b-m-30">
                    <RefreshButton onClick={refresh} />
                </div>
                <ReactDataTableURL
                    columns={columns.expenseMgmt.budget}
                    tableRef={orderPlanMgmtTable3}
                    viewPageName="실행경비계획"
                    customDatas={budgetMgmt}
                    customDatasRefresh={refresh}
                    hideCheckBox={true}
                />
            </HideCard>
        </>
    );
}

export default ExpenseMgmtPlan;
