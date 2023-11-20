import React, { useContext, useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import DataTable from "components/DataTable/DataTable";
import { locationPath } from "constants/locationPath";
import ReactDataTable from "components/DataTable/ReactDataTable";
import { PageContext } from "components/PageProvider";
import { axiosFetch } from "api/axiosFetch";
import ApprovalForm from "components/form/ApprovalForm";
import { columns } from "constants/columns";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import ReactDataTableView from "components/DataTable/ReactDataTableView";
import RefreshButton from "components/button/RefreshButton";
/** 실행관리-경비관리 */
function ExpenseMgmt() {
    const { innerPageName, setInnerPageName, setCurrentPageName, setPrevInnerPageName, isSaveFormTable, setIsSaveFormTable, projectInfo, setProjectInfo, projectItem } = useContext(PageContext);

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
                default:
                    return;
            }
        }
        return data;
    };

    const changeTabs = (task) => {
        if (task !== innerPageName) { //다른 페이지의 버튼 변경 막기
            setIsSaveFormTable(true);
        }
        setInnerPageName((prev) => {
            setCurrentPageName("");
            setPrevInnerPageName(prev);
            return task;
        });
    };

    const fetchData = async () => {
        try {
            if (currentTask === "경비 조회관리") {
                const data = await fetchAllData("/baseInfrm/product/pjbudget", currentTask); // 경비 조회관리
                // console.log(data, "불러온 조회관리 값은?");
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
    useEffect(() => {
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
                            <SearchList conditionList={columns.expenseMgmt.condition} onSearch={handleReturn} />
                            {/*<ApprovalForm title={" 프로젝트 목록 " + currentTask}>*/}
                            <div className={`buttonBody ${isClicked ? "" : "clicked"}`}>
                                <button className="arrowBtnStyle" style={{ zIndex: "999" }} onClick={handleClick1}>
                                    <FontAwesomeIcon className={`arrowBtn ${isClicked ? "" : "clicked"}`} icon={faArrowUp} />
                                </button>
                            </div>
                            <div className={`hideDivRun${isClicked ? "" : "clicked"}`}>
                                <ReactDataTableView
                                    sendPoiId={sendPoiId}
                                    columns={columns.expenseMgmt.projectView}
                                    customDatas={projectItem}
                                    defaultPageSize={5}
                                    justColumn={true}
                                />
                            </div>
                            <div className="table-buttons">
                                <RefreshButton onClick={refresh} />
                            </div>
                            <ReactDataTable
                                viewPageName="경비 조회관리"
                                columns={columns.expenseMgmt.inquiry}
                                testTask={true}
                                tableRef={orderPlanMgmtTable1}
                                customDatas={inquiryMgmt}
                                customDatasRefresh={refresh}
                                hideCheckBox={true}
                                editing={false}
                            />
                            {/*</ApprovalForm>*/}
                        </ul>
                    </div>
                    <div className="second">
                        <ul>
                            <ApprovalForm title={currentTask + " 등록"} />
                            <div className={`buttonBody  ${isClicked2 ? "" : "clicked"}`}>
                                <button className="arrowBtnStyle" style={{ zIndex: "999" }} onClick={handleClick2}>
                                    <FontAwesomeIcon className={`arrowBtn ${isClicked2 ? "" : "clicked"}`} icon={faArrowUp} />
                                </button>
                            </div>
                            <div className={`hideDivRun2 ${isClicked2 ? "" : "clicked"}`}>
                                <ReactDataTableView columns={columns.expenseMgmt.contract} customDatas={saveTotalPrice} defaultPageSize={5} justColumn={true} />
                            </div>
                            <div className="table-buttons">
                                <RefreshButton onClick={refresh} />
                            </div>
                            <ReactDataTable
                                columns={columns.expenseMgmt.budget}
                                tableRef={orderPlanMgmtTable2}
                                viewPageName="경비 수주관리"
                                customDatas={pgBudgetMgmt}
                                customDatasRefresh={refresh}
                                hideCheckBox={true}
                            />
                        </ul>
                    </div>
                    <div className="third">
                        <ul>
                            <ApprovalForm title={currentTask + " 등록"} />
                            <div className={`buttonBody  ${isClicked3 ? "" : "clicked"}`}>
                                <button className="arrowBtnStyle" style={{ zIndex: "999" }} onClick={handleClick3}>
                                    <FontAwesomeIcon className={`arrowBtn ${isClicked3 ? "" : "clicked"}`} icon={faArrowUp} />
                                </button>
                            </div>
                            <div className={`hideDivRun3 ${isClicked3 ? "" : "clicked"}`}>
                                <ReactDataTableView columns={columns.expenseMgmt.budget} customDatas={budgetMgmtView} defaultPageSize={5} justColumn={true} />
                            </div>
                            <div className="table-buttons">
                                <RefreshButton onClick={refresh} />
                            </div>
                            <ReactDataTable
                                columns={columns.expenseMgmt.budget}
                                tableRef={orderPlanMgmtTable3}
                                viewPageName="경비 예산관리"
                                customDatas={budgetMgmt}
                                customDatasRefresh={refresh}
                                hideCheckBox={true}
                            />
                        </ul>
                    </div>
                    <div className="fourth">
                        <ul>
                            <ApprovalForm title={currentTask + " 등록"} />
                            <div className={`buttonBody  ${isClicked4 ? "" : "clicked"}`}>
                                <button className="arrowBtnStyle" style={{ zIndex: "999" }} onClick={handleClick4}>
                                    <FontAwesomeIcon className={`arrowBtn ${isClicked4 ? "" : "clicked"}`} icon={faArrowUp} />
                                </button>
                            </div>
                            <div className={`hideDivRun4 ${isClicked4 ? "" : "clicked"}`}>
                                <ReactDataTableView columns={columns.expenseMgmt.budget} customDatas={runMgmtView} defaultPageSize={5} justColumn={true} />
                            </div>
                            <div className="table-buttons">
                                <RefreshButton onClick={refresh} />
                            </div>
                            <ReactDataTable
                                columns={columns.expenseMgmt.budget}
                                tableRef={orderPlanMgmtTable4}
                                viewPageName="경비 실행관리"
                                customDatas={runMgmt}
                                customDatasRefresh={refresh}
                                hideCheckBox={true}
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
