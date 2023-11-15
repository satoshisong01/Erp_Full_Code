import React, { useContext, useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import DataTable from "components/DataTable/DataTable";
import { locationPath } from "constants/locationPath";
import ReactDataTable from "components/DataTable/ReactDataTable";
import { PageContext } from "components/PageProvider";
import { axiosFetch } from "api/axiosFetch";
import ApprovalForm from "components/form/ApprovalForm";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import ReactDataTableView from "components/DataTable/ReactDataTableView";
/** 실행관리-경비관리 */
function ExpenseMgmt() {
    const { isSaveFormTable, setIsSaveFormTable, projectInfo, setProjectInfo, projectItem } = useContext(PageContext);

    // const { showDetailTable } = useContext(PageContext);
    useEffect(() => {
        return () => {
            setProjectInfo({});
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

    const [poiIdToSend, setPoiIdToSend] = useState({ poiId: "" });

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

    const [returnKeyWord, setReturnKeyWord] = useState("");

    const columns = [
        //프로젝트 목록
        { header: "프로젝트 이름", col: "poiNm", cellWidth: "50%" },
        { header: "계획 경비", col: "vendor", cellWidth: "25%" },
        { header: "실행 경비", col: "contactPerson", cellWidth: "25%" },
    ];
    const detailColumns = [
        //프로젝트 경비
        { header: "연월", col: "pjbgDt", cellWidth: "20%", update: false, updating: true, write: true },
        { header: "시작일", col: "pjbgBeginDT", cellWidth: "20%", updating: true, write: true },
        { header: "종료일", col: "pjbgEndDt", cellWidth: "20%" },
        { header: "경비종류", col: "pjbgTypeCode", cellWidth: "20%" },
        { header: "비고", col: "pjbgbDesc", cellWidth: "20%" },
    ];

    const projectColumns = [
        {
            header: "프로젝트명",
            col: "poiNm",
            cellWidth: "50%",
            type: "input",
        },
        {
            header: "계획인건비",
            col: "pmpmmNum1",
            cellWidth: "30%",
            type: "input",
        },
        {
            header: "실행인건비",
            col: "pmpmmNum2",
            cellWidth: "20%",
            type: "input",
        },
    ];

    //{
    //    header: "교통비",
    //    col: "poiNm",
    //    cellWidth: "50%",
    //    type: "input",
    //},
    //{
    //    header: "숙박비",
    //    col: "pmpmmNum1",
    //    cellWidth: "30%",
    //    type: "input",
    //},
    //{
    //    header: "일비/파견비",
    //    col: "pmpmmNum2",
    //    cellWidth: "20%",
    //    type: "input",
    //},
    //{
    //    header: "식비",
    //    col: "pmpmmNum2",
    //    cellWidth: "20%",
    //    type: "input",
    //},
    //{
    //    header: "자재/소모품외",
    //    col: "pmpmmNum2",
    //    cellWidth: "20%",
    //    type: "input",
    //},
    //{
    //    header: "영업비",
    //    col: "pmpmmNum2",
    //    cellWidth: "20%",
    //    type: "input",
    //},

    const ContractColumns = [
        { header: "교통비", col: "EXPNS01", cellWidth: "15%", type: "input" },
        { header: "숙박비", col: "EXPNS02", cellWidth: "15%", type: "input" },
        {
            header: "일비/파견비",
            col: "EXPNS03",
            cellWidth: "20%",
            type: "input",
        },
        {
            header: "식비",
            col: "EXPNS04",
            cellWidth: "15%",
            type: "input",
        },
        {
            header: "자재/소모품외",
            col: "EXPNS05",
            cellWidth: "20%",
            type: "input",
        },
        {
            header: "영업비",
            col: "EXPNS06",
            cellWidth: "15%",
            type: "input",
        },
    ];

    const viewColumns = [
        { header: "교통비", col: "EXPNS01", cellWidth: "15%", type: "input" },
        { header: "숙박비", col: "EXPNS02", cellWidth: "15%", type: "input" },
        {
            header: "일비/파견비",
            col: "EXPNS03",
            cellWidth: "20%",
            type: "input",
        },
        {
            header: "식비",
            col: "EXPNS04",
            cellWidth: "15%",
            type: "input",
        },
        {
            header: "자재/소모품외",
            col: "EXPNS05",
            cellWidth: "20%",
            type: "input",
        },
    ];

    const planCost = [
        { header: "교통비", col: "pmpMonth", cellWidth: "15%", type: "input" },
        { header: "숙박비", col: "total", cellWidth: "15%", type: "input" },
        {
            header: "일비/파견비",
            col: "poiBeginDt1",
            cellWidth: "20%",
            type: "input",
        },
        {
            header: "식비",
            col: "pmpmmNum1",
            cellWidth: "15%",
            type: "input",
        },
        {
            header: "자재/소모품외",
            col: "pmpmmNum2",
            cellWidth: "20%",
            type: "input",
        },
        {
            header: "영업비",
            col: "pmpmmNum3",
            cellWidth: "15%",
            type: "input",
        },
    ];

    const runColumns = [
        {
            header: "품목그룹명",
            col: "pgNm",
            cellWidth: "20%",
            type: "select",
            options: [],
        },
        { header: "월", col: "pmpMonth", cellWidth: "10%", type: "input" },
        { header: "M/M계", col: "total", cellWidth: "10%", type: "input" },
        {
            header: "출장인",
            col: "poiBeginDt1",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "시작일",
            col: "pmpmmNum1",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "종료일",
            col: "pmpmmNum2",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "교통비",
            col: "pmpmmNum3",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "숙박비",
            col: "pmpmmNum4",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "일비/파견비",
            col: "pmpmmNum5",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "식비",
            col: "pmpmmNum6",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "자재/소모품외",
            col: "pmpmmNum61",
            cellWidth: "20%",
            type: "input",
        },
        {
            header: "지출합계",
            col: "pmpmmNum62",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "월합계",
            col: "pmpmmNum63",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "비고",
            col: "pmpmmNum641",
            cellWidth: "10%",
            type: "input",
        },
    ];

    const inquiryColumns = [
        {
            header: "구분코드",
            col: "modeCode",
            cellWidth: "10%",
        },
        {
            header: "품목그룹명",
            col: "pgNm",
            cellWidth: "20%",
            type: "button",
            options: [],
        },
        { header: "연/월", col: "pjbgDt", cellWidth: "10%" },
        {
            header: "출장인",
            col: "pjbgManpower",
            cellWidth: "10%",
        },
        {
            header: "시작일",
            col: "pjbgBeginDt",
            cellWidth: "10%",
        },
        {
            header: "종료일",
            col: "pjbgEndDt",
            cellWidth: "10%",
        },
        {
            header: "교통비",
            col: "pjbgPrice01",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "숙박비",
            col: "pjbgPrice02",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "일비/파견비",
            col: "pjbgPrice03",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "식비",
            col: "pjbgPrice04",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "자재/소모품외",
            col: "pjbgPrice05",
            cellWidth: "20%",
            type: "input",
        },
        {
            header: "지출합계",
            col: "pmpmmNum62",
            cellWidth: "10%",
        },
        {
            header: "월합계",
            col: "pmpmmNum63",
            cellWidth: "10%",
        },
        {
            header: "비고",
            col: "pjbgDesc",
            cellWidth: "10%",
            type: "input",
        },
    ];

    const budgetColumns = [
        {
            header: "품목그룹명",
            col: "pgNm",
            cellWidth: "20%",
            type: "button",
            options: [],
        },
        { header: "연/월", col: "pjbgDt", cellWidth: "10%", type: "costDateStart" },
        {
            header: "출장인",
            col: "pjbgManpower",
            cellWidth: "10%",
        },
        {
            header: "시작일",
            col: "pjbgBeginDt",
            cellWidth: "10%",
            type: "costDateStart",
        },
        {
            header: "종료일",
            col: "pjbgEndDt",
            cellWidth: "10%",
            type: "costDateEnd",
        },
        {
            header: "교통비",
            col: "pjbgPrice01",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "숙박비",
            col: "pjbgPrice02",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "일비/파견비",
            col: "pjbgPrice03",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "식비",
            col: "pjbgPrice04",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "자재/소모품외",
            col: "pjbgPrice05",
            cellWidth: "20%",
            type: "input",
        },
        {
            header: "지출합계",
            col: "pmpmmNum62",
            cellWidth: "10%",
        },
        {
            header: "월합계",
            col: "pmpmmNum63",
            cellWidth: "10%",
        },
        {
            header: "비고",
            col: "pjbgDesc",
            cellWidth: "10%",
            type: "input",
        },
    ];

    const conditionList = [
        {
            title: "프로젝트명",
            colName: "clCode", //컬럼명
            type: "input",
            value: "",
            searchLevel: "1",
        },
        {
            title: "기간검색",
            colName: "selectedDate",
            type: "datepicker",
            searchLevel: "0",
        },
        {
            title: "출장인",
            colName: "clCodeNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "2",
        },
    ];

    const processResultData = (resultData) => {
        const transformedData = resultData.reduce((accumulator, item) => {
            const { pjbgTypeCode, modeCode, pjbgPrice, pjbgBeginDt, pjbgEndDt, pjbgManpower, pjbgDt, pgNm, pjbgDesc } = item;

            if (/^EXPNS\d{2}$/.test(pjbgTypeCode) && ["EXDR", "EXCP", "EXCU"].includes(modeCode)) {
                const key = `${modeCode}_${pjbgBeginDt}_${pjbgEndDt}`;
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
                    };
                }

                accumulator[key].pjbgTypeCodes.push(pjbgTypeCode);
                accumulator[key].pjbgPrices.push(pjbgPrice);

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
            newObj["pjbgDt"] = mergedItem.pjbgDt;
            newObj["pgNm"] = mergedItem.pgNm;
            newObj["pjbgDesc"] = mergedItem.pjbgDesc;

            return newObj;
        });

        return mapPecModeCodeToText(mergedData);
    };

    const [currentTask, setCurrentTask] = useState("경비 조회관리");
    const [inquiryMgmt, setInquiryMgmt] = useState([]); // 경비 조회관리

    const [pgBudgetMgmt, setPgBudgetMgmt] = useState([]); // 경비 수주관리

    const [budgetMgmt, setBudgetMgmt] = useState([]); // 경비 예산관리
    const [budgetMgmtView, setBudgetMgmtView] = useState([]); // 경비 예산관리

    const [runMgmt, setRunMgmt] = useState([]); // 경비 실행관리
    const [runMgmtView, setRunMgmtView] = useState([]); // 경비 실행관리

    const allowedPjbgTypeCodes = ["EXPNS01", "EXPNS02", "EXPNS03", "EXPNS04", "EXPNS05", "EXPNS06"];
    const [saveNum, setSaveNum] = useState([]);
    //const viewItem = ["EXPNS01", "EXPNS02", "EXPNS03", "EXPNS04", "EXPNS05"];
    //const [viewColumn, setViewColumn] = useState([]);
    const [saveTotalPrice, setSaveTotalPrice] = useState([]);

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
                // 다른 경우에 대한 처리를 추가할 수도 있습니다.
            }
        }
        return data;
    };

    const changeTabs = (task) => {
        setCurrentTask(task);
        if (task !== currentTask) {
            //자신 일때 수정 창으로 변동 되지 않기 위한 조건
            setIsSaveFormTable(true);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (currentTask === "경비 조회관리") {
                    const data = await fetchAllData("/baseInfrm/product/pjbudget", currentTask); // 경비 조회관리
                    console.log(data, "불러온 조회관리 값은?");
                    const updatedData = processResultData(data);
                    console.log(updatedData, "updatedData 🔥🔥🔥🔥🔥");
                    setInquiryMgmt(updatedData);
                    //changePrmnPlanData(data);
                } else if (currentTask === "경비 수주관리") {
                    const dataView = await fetchAllDataView("/baseInfrm/product/pjbudget", currentTask); // 경비 수주관리
                    setSaveNum(dataView);
                    const data = await fetchAllData("/baseInfrm/product/pjbudget", currentTask);
                    const updatedData = processResultData(data);
                    console.log(updatedData, "바뀐값도 한번다시보자");
                    setPgBudgetMgmt(updatedData);
                } else if (currentTask === "경비 예산관리") {
                    const dataView = await fetchAllDataView("/baseInfrm/product/pjbudget", currentTask); // 경비 예산관리
                    const viewUpdate = processResultData(dataView);
                    setBudgetMgmtView(viewUpdate);
                    const data = await fetchAllData("/baseInfrm/product/pjbudget", currentTask);
                    const updatedData = processResultData(data);
                    setBudgetMgmt(updatedData);
                } else if (currentTask === "경비 실행관리") {
                    const dataView = await fetchAllDataView("/baseInfrm/product/pjbudget", currentTask); // 경비 실행관리
                    const viewUpdate = processResultData(dataView);
                    setRunMgmtView(viewUpdate);
                    const data = await fetchAllData("/baseInfrm/product/pjbudget", currentTask);
                    const updatedData = processResultData(data);
                    setRunMgmt(updatedData);
                }
            } catch (error) {
                console.error("데이터를 가져오는 중에 오류 발생:", error);
            }
        };

        fetchData(); // fetchData 함수를 호출하여 데이터를 가져옵니다.
    }, [poiIdToSend, projectInfo.poiId, currentTask]);

    const fetchAllDataView = async (tableUrl, currentTask) => {
        const url = `/api${tableUrl}/totalListAll.do`;
        console.log(tableUrl, currentTask, "🌠🌠🌠🌠🌠");
        let requestData = {
            poiId: projectInfo.poiId,
            useAt: "Y",
            modeCode: "SLSP",
        };
        if (currentTask === "경비 수주관리") {
            requestData = {
                poiId: projectInfo.poiId,
                modeCode: "SLSP",
            };
            console.log("타는곳 1번");
        } else if (currentTask === "경비 예산관리") {
            requestData = {
                poiId: projectInfo.poiId,
                modeCode: "EXDR",
                useAt: "Y",
            };
            console.log("타는곳 2번");
        } else if (currentTask === "경비 실행관리") {
            requestData = {
                poiId: projectInfo.poiId,
                modeCode: "EXCP",
                useAt: "Y",
            };
            console.log("타는곳 3번");
        }

        const resultData = await axiosFetch(url, requestData);

        console.log(resultData, "나온값을함보까");
        return resultData;
    };

    const fetchAllData = async (tableUrl, currentTask) => {
        const url = `/api${tableUrl}/totalListAll.do`;
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
            return resultData;
        } else {
            return Array(5).fill({}); // 빈 배열 보내주기
        }
    };

    const handleReturn = (value) => {
        setReturnKeyWord(value);
        console.log(value, "제대로 들어오냐");
    };

    return (
        <>
            <Location pathList={locationPath.ExpenseMgmt} />
            {/* <SearchList conditionList={conditionList} onSearch={handleReturn} /> */}
            <div className="common_board_style mini_board_3">
                <ul className="tab">
                    <li onClick={() => changeTabs("경비 조회관리")}>
                        <a href="#경비 조회관리" className="on">
                            경비 조회관리
                        </a>
                    </li>
                    <li onClick={() => changeTabs("경비 수주관리")}>
                        <a href="#경비 수주관리">경비 수주관리</a>
                    </li>
                    <li onClick={() => changeTabs("경비 예산관리")}>
                        <a href="#경비 예산관리">경비 예산관리</a>
                    </li>
                    <li onClick={() => changeTabs("경비 실행관리")}>
                        <a href="#경비 실행관리">경비 실행관리</a>
                    </li>
                </ul>

                <div className="list">
                    <div className="first">
                        <ul>
                            <SearchList conditionList={conditionList} onSearch={handleReturn} />
                            {/*<ApprovalForm title={" 프로젝트 목록 " + currentTask}>*/}
                            <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", position: "absolute" }}>
                                <button className="arrowBtnStyle" style={{ zIndex: "999" }} onClick={handleClick1}>
                                    <FontAwesomeIcon className={`arrowBtn ${isClicked ? "" : "clicked"}`} icon={faArrowUp} />
                                </button>
                            </div>
                            <div className={`hideDivRun ${isClicked ? "" : "clicked"}`}>
                                <ReactDataTableView
                                    sendPoiId={sendPoiId}
                                    columns={projectColumns}
                                    customDatas={projectItem}
                                    defaultPageSize={5}
                                    justColumn={true}
                                />
                            </div>
                            <ReactDataTable
                                viewPageName="경비 조회관리"
                                columns={inquiryColumns}
                                flag={false}
                                testTask={true}
                                tableRef={orderPlanMgmtTable1}
                                customDatas={inquiryMgmt}
                            />
                            {/*</ApprovalForm>*/}
                        </ul>
                    </div>
                    <div className="second">
                        <ul>
                            <ApprovalForm title={currentTask + " 등록"} />
                            <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", position: "absolute" }}>
                                <button className="arrowBtnStyle" style={{ zIndex: "999" }} onClick={handleClick2}>
                                    <FontAwesomeIcon className={`arrowBtn ${isClicked2 ? "" : "clicked"}`} icon={faArrowUp} />
                                </button>
                            </div>
                            <div className={`hideDivRun2 ${isClicked2 ? "" : "clicked"}`}>
                                <ReactDataTableView columns={ContractColumns} customDatas={saveTotalPrice} defaultPageSize={5} justColumn={true} />
                            </div>
                            <ReactDataTable
                                columns={budgetColumns}
                                flag={currentTask === "경비 수주관리" && isSaveFormTable}
                                tableRef={orderPlanMgmtTable2}
                                customDatas={pgBudgetMgmt}
                            />
                        </ul>
                    </div>
                    <div className="third">
                        <ul>
                            <ApprovalForm title={currentTask + " 등록"} />
                            <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", position: "absolute" }}>
                                <button className="arrowBtnStyle" style={{ zIndex: "999" }} onClick={handleClick3}>
                                    <FontAwesomeIcon className={`arrowBtn ${isClicked3 ? "" : "clicked"}`} icon={faArrowUp} />
                                </button>
                            </div>
                            <div className={`hideDivRun3 ${isClicked3 ? "" : "clicked"}`}>
                                <ReactDataTableView columns={budgetColumns} customDatas={budgetMgmtView} defaultPageSize={5} justColumn={true} />
                            </div>
                            <ReactDataTable
                                columns={budgetColumns}
                                flag={currentTask === "경비 예산관리" && isSaveFormTable}
                                tableRef={orderPlanMgmtTable3}
                                customDatas={budgetMgmt}
                            />
                        </ul>
                    </div>
                    <div className="fourth">
                        <ul>
                            <ApprovalForm title={currentTask + " 등록"} />
                            <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", position: "absolute" }}>
                                <button className="arrowBtnStyle" style={{ zIndex: "999" }} onClick={handleClick4}>
                                    <FontAwesomeIcon className={`arrowBtn ${isClicked4 ? "" : "clicked"}`} icon={faArrowUp} />
                                </button>
                            </div>
                            <div className={`hideDivRun4 ${isClicked4 ? "" : "clicked"}`}>
                                <ReactDataTableView columns={budgetColumns} customDatas={runMgmtView} defaultPageSize={5} justColumn={true} />
                            </div>
                            <ReactDataTable
                                columns={budgetColumns}
                                flag={currentTask === "경비 실행관리" && isSaveFormTable}
                                tableRef={orderPlanMgmtTable4}
                                customDatas={runMgmt}
                            />
                        </ul>
                    </div>
                </div>
            </div>
            {/*<ReactDataTable
                columns={columns}
                suffixUrl="/baseInfrm/product/pjbudget"
                defaultPageSize={5}
            />
            <ReactDataTable
                columns={detailColumns}
                detailUrl="/baseInfrm/product/pjbudget"
                defaultPageSize={10}
            />*/}
        </>
    );
}

export default ExpenseMgmt;
