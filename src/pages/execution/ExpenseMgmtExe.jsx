import React, { useContext, useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import { locationPath } from "constants/locationPath";
import { PageContext } from "components/PageProvider";
import { axiosFetch } from "api/axiosFetch";
import { columns } from "constants/columns";
import ReactDataTableURL from "components/DataTable/ReactDataTableURL";
import ApprovalFormExe from "components/form/ApprovalFormExe";
import HideCard from "components/HideCard";
/** 실행관리-경비관리-실행 */
function ExpenseMgmtExe() {
    const {
        currentPageName,
        innerPageName,
        setInnerPageName,
        setCurrentPageName,
        setPrevInnerPageName,
        isSaveFormTable,
        setIsSaveFormTable,
        projectInfo,
        setProjectInfo,
        projectItem,
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


    const orderPlanMgmtTable1 = useRef(null);
    const orderPlanMgmtTable2 = useRef(null);
    const orderPlanMgmtTable3 = useRef(null);
    const orderPlanMgmtTable4 = useRef(null);

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

    const refresh = () => {
        fetchData();
    };

    const [returnKeyWord, setReturnKeyWord] = useState("");

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

        console.log(transformedData, "transformedData");

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

    const [inquiryMgmt, setInquiryMgmt] = useState([]); // 경비 조회관리

    const [pgBudgetMgmt, setPgBudgetMgmt] = useState([]); // 경비 수주관리
    const [pgBudgetMgmtView, setPgBudgetMgmtView] = useState([]); // 경비 수주관리

    const [budgetMgmt, setBudgetMgmt] = useState([]); // 경비 예산관리
    const [budgetMgmtView, setBudgetMgmtView] = useState([]); // 경비 예산관리

    const [runMgmt, setRunMgmt] = useState([]); // 경비 실행관리
    const [runMgmtView, setRunMgmtView] = useState([]); // 경비 실행관리

    const allowedPjbgTypeCodes = ["EXPNS01", "EXPNS02", "EXPNS03", "EXPNS04", "EXPNS05", "EXPNS06"];
    const [saveNum, setSaveNum] = useState([]);
    //const viewItem = ["EXPNS01", "EXPNS02", "EXPNS03", "EXPNS04", "EXPNS05"];
    //const [viewColumn, setViewColumn] = useState([]);
    const [saveTotalPrice, setSaveTotalPrice] = useState([]);

    console.log(pgBudgetMgmtView, "pgBudgetMgmtView");

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
        setSaveTotalPrice([resultObject]);
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

    function calculateTotalPrices(arr) {
        const result = {};

        arr.forEach((obj) => {
            const { pjbgTypeCode, pjbgPrice } = obj;

            if (!result[pjbgTypeCode]) {
                result[pjbgTypeCode] = pjbgPrice;
            } else {
                result[pjbgTypeCode] += pjbgPrice;
            }
        });
        console.log(result, "나와라잇");
        return result;
    }

    const fetchData = async () => {
        try {
            if (innerPageName === "경비 조회관리") {
                const data = await fetchAllData("/api/baseInfrm/product/pjbudget/totalListAll.do", innerPageName); // 경비 조회관리
                // console.log(data, "불러온 조회관리 값은?");
                const updatedData = processResultData(data);
                console.log(updatedData, "updatedData 🔥🔥🔥🔥🔥");
                setInquiryMgmt(updatedData);
                //changePrmnPlanData(data);
            } else if (innerPageName === "경비 수주관리") {
                const dataView = await fetchAllDataView("/api/baseInfrm/product/pjbudget/totalListAll.do", innerPageName); // 경비 수주관리
                console.log(dataView, "이게안나올리가없는데");
                const filteredData = dataView.filter((data) => {
                    return ["EXPNS01", "EXPNS02", "EXPNS03", "EXPNS04", "EXPNS05", "EXPNS06"].includes(data.pjbgTypeCode);
                });
                console.log(filteredData, "filteredData");
                //calculateTotalPrices(dataView);
                setPgBudgetMgmtView([calculateTotalPrices(dataView)]);
                //setPgBudgetMgmtView(filteredData);
                const data = await fetchAllData("/api/baseInfrm/product/pjbudget/totalListAll.do", innerPageName);
                const updatedData = processResultData(data);
                console.log(updatedData, "바뀐값도 한번다시보자");
                setPgBudgetMgmt(updatedData);
            } else if (innerPageName === "경비 예산관리") {
                const dataView = await fetchAllDataView("/api/baseInfrm/product/pjbudget/totalListAll.do", innerPageName); // 경비 예산관리
                const viewUpdate = processResultData(dataView);
                setBudgetMgmtView(viewUpdate);
                const data = await fetchAllData("/api/baseInfrm/product/pjbudget/totalListAll.do", innerPageName);
                const updatedData = processResultData(data);
                setBudgetMgmt(updatedData);
            } else if (innerPageName === "경비 실행관리") {
                const dataView = await fetchAllDataView("/api/baseInfrm/product/pjbudget/totalListAll.do", innerPageName); // 경비 실행관리
                const viewUpdate = processResultData(dataView);
                setRunMgmtView(viewUpdate);
                const data = await fetchAllData("/api/baseInfrm/product/pjbudget/totalListAll.do", innerPageName);
                const updatedData = processResultData(data);
                setRunMgmt(updatedData);
            }
        } catch (error) {
            console.error("데이터를 가져오는 중에 오류 발생:", error);
        }
    };
    useEffect(() => {
        fetchData(); // fetchData 함수를 호출하여 데이터를 가져옵니다.
    }, [poiIdToSend, projectInfo.poiId, innerPageName]);

    const fetchAllDataView = async (url, innerPageName) => {
        console.log(url, innerPageName, "🌠🌠🌠🌠");
        let requestData = {
            poiId: projectInfo.poiId,
            useAt: "Y",
            modeCode: "SLSP",
        };
        if (innerPageName === "경비 수주관리") {
            requestData = {
                poiId: projectInfo.poiId,
                modeCode: "SLSP",
                useAt: "Y",
            };
            console.log("타는곳 1번");
        } else if (innerPageName === "경비 예산관리") {
            requestData = {
                poiId: projectInfo.poiId,
                modeCode: "EXDR",
                useAt: "Y",
            };
            console.log("타는곳 2번");
        } else if (innerPageName === "경비 실행관리") {
            requestData = {
                poiId: projectInfo.poiId,
                modeCode: "EXCP",
                useAt: "Y",
            };
            console.log("타는곳 3번");
        }

        const resultData = await axiosFetch(url, requestData);

        console.log(resultData, "나온값을함보까", requestData);
        return resultData;
    };

    const fetchAllData = async (url, currentTask) => {
        let requestData = { poiId: poiIdToSend || projectInfo.poiId };
        if (currentTask === "경비 조회관리") {
            //requestData 값 담기
            requestData = { poiId: poiIdToSend || projectInfo.poiId };
        } else if (currentTask === "경비 수주관리") {
            requestData = { poiId: projectInfo.poiId, modeCode: "EXDR" };
        } else if (currentTask === "경비 예산관리") {
            requestData = { poiId: projectInfo.poiId, modeCode: "EXCP" };
        } else if (currentTask === "경비 실행관리") {
            requestData = { poiId: projectInfo.poiId, modeCode: "EXCU" };
        } else {
            requestData = {
                poiId: poiIdToSend || projectInfo.poiId,
            };
            console.log("여긴타면안댐");
        }

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
            <ApprovalFormExe viewPageName="실행경비" />
            <HideCard title="계획 조회" color="back-gray" className="mg-b-40">
            </HideCard>
            <HideCard title="합계" color="back-lightyellow" className="mg-b-40">
            </HideCard>
            <HideCard title="계획 등록/수정" color="back-lightblue">
                <ReactDataTableURL
                    columns={columns.expenseMgmt.budget}
                    tableRef={orderPlanMgmtTable4}
                    viewPageName="실행경비"
                    customDatas={runMgmt}
                    customDatasRefresh={refresh}
                    hideCheckBox={true}
                />
            </HideCard>
        </>
    );
}

export default ExpenseMgmtExe;
