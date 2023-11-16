import React, { useContext, useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import { locationPath } from "constants/locationPath";
import ReactDataTable from "components/DataTable/ReactDataTable";
import { axiosDelete, axiosFetch, axiosPost, axiosUpdate } from "api/axiosFetch";
import { PageContext } from "components/PageProvider";
import ApprovalForm from "components/form/ApprovalForm";
import { columns } from "constants/columns";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import ReactDataTableView from "components/DataTable/ReactDataTableView";
import { ChangePrmnPlanData } from "components/DataTable/function/ChangePrmnPlanData";
import RefreshButton from "components/button/RefreshButton";
import RefreshButton from "components/button/RefreshButton";

/** 실행관리-인건비관리 */
function LaborCostMgmt() {
    const {
        innerPageName,
        setCurrentPageName,
        setPrevInnerPageName,
        setInnerPageName,
        isSaveFormTable,
        setIsSaveFormTable,
        projectInfo,
        setProjectInfo,
        projectItem,
        viewSetPoiId,
    } = useContext(PageContext);

    useEffect(() => {
        setInnerPageName("인건비 조회관리");
        setCurrentPageName(""); //inner와 pageName은 동시에 사용 X

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

    const [returnKeyWord, setReturnKeyWord] = useState("");

    const [inquiryMgmt, setInquiryMgmt] = useState([]); // 인건비 조회관리
    //
    const [saleCostView, setSaleCostView] = useState([]); //영업 인건비 띄우기
    const [pgBudgetMgmt, setPgBudgetMgmt] = useState([]); // 인건비 수주관리
    //
    const [pgBudgetView, setPgBudgetView] = useState([]); //(실행) 수주띄우기
    const [budgetMgmt, setBudgetMgmt] = useState([]); // 인건비 예산관리
    //
    const [budgetView, setBudgetView] = useState([]); //(실행) 예산띄우기
    const [runMgmt, setRunMgmt] = useState([]); // 인건비 실행관리

    //useEffect(() => {
    //    console.log(pgBudgetMgmt, "pgBudgetMgmt");
    //    console.log(pgBudgetView, "pgBudgetView");
    //}, [pgBudgetView, pgBudgetMgmt]);

    const refresh = () => {
        fetchData();
    };

    //인건비 수주, 예산, 실행 표기
    const mapPecModeCodeToText = (data) => {
        for (let i = 0; i < data.length; i++) {
            switch (data[i].pecModeCode) {
                case "PDVSN01":
                    data[i].pecModeCode = "수주";
                    break;
                case "PDVSN02":
                    data[i].pecModeCode = "예산";
                    break;
                case "PDVSN03":
                    data[i].pecModeCode = "실행";
                    break;
                default:
                    return;
            }
        }
        return data;
    };

    const changeTabs = (task) => {
        if (task !== innerPageName) {
            //다른 페이지의 버튼 변경 막기
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
            if (innerPageName === "인건비 조회관리") {
                const data = await fetchAllData("/api/baseInfrm/product/prstmCost/totalListAll.do", innerPageName); // 인건비 조회관리
                const updatedData = mapPecModeCodeToText(data);
                setInquiryMgmt(updatedData);
                //
            } else if (innerPageName === "인건비 수주관리") {
                const data = await fetchAllData("/api/baseInfrm/product/prstmCost/totalListAll.do", innerPageName); // 인건비 수주관리
                setPgBudgetMgmt(data);
                const dataView = await fetchAllDataView("/api/baseInfrm/product/prmnPlan/totalListAll.do", innerPageName);
                setSaleCostView(ChangePrmnPlanData(dataView, projectInfo));
                console.log(saleCostView, "saleCostView");
                //
            } else if (innerPageName === "인건비 예산관리") {
                const data = await fetchAllData("/api/baseInfrm/product/prstmCost/totalListAll.do", innerPageName); // 인건비 예산관리
                setBudgetMgmt(data);
                const dataView = await fetchAllDataView("/api/baseInfrm/product/prstmCost/totalListAll.do", innerPageName);
                setPgBudgetView(dataView);
                //
            } else if (innerPageName === "인건비 실행관리") {
                const data = await fetchAllData("/api/baseInfrm/product/prstmCost/totalListAll.do", innerPageName); // 인건비 실행관리
                setRunMgmt(data);
                const dataView = await fetchAllDataView("/api/baseInfrm/product/prstmCost/totalListAll.do", innerPageName);
                setBudgetView(dataView);
            }
        } catch (error) {
            console.error("데이터를 가져오는 중에 오류 발생:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [innerPageName]);

    const fetchAllData = async (url, currentTask) => {
        let requestData = { poiId: poiIdToSend || projectInfo.poiId, useAt: "Y", pecTypeCode: "MM", pecSlsExcCode: "PEXC" };
        if (currentTask === "인건비 조회관리") {
            requestData = { poiId: poiIdToSend, useAt: "Y", pecTypeCode: "MM", pecSlsExcCode: "PEXC" };
        } else if (currentTask === "인건비 수주관리") {
            requestData = {
                poiId: projectInfo.poiId,
                pecSlsExcCode: "PEXC",
                pecTypeCode: "MM",
                useAt: "Y",
                pecModeCode: "PDVSN01",
            };
        } else if (currentTask === "인건비 예산관리") {
            requestData = {
                poiId: projectInfo.poiId,
                pecSlsExcCode: "PEXC",
                pecTypeCode: "MM",
                useAt: "Y",
                pecModeCode: "PDVSN02",
            };
        } else if (currentTask === "인건비 실행관리") {
            requestData = {
                poiId: projectInfo.poiId,
                pecSlsExcCode: "PEXC",
                pecTypeCode: "MM",
                useAt: "Y",
                pecModeCode: "PDVSN03",
            };
        }

        const resultData = await axiosFetch(url, requestData);
        if (resultData) {
            return resultData;
        } else {
            return Array(5).fill({}); // 빈 배열 보내주기
        }
    };

    const fetchAllDataView = async (tableUrl, currentTask) => {
        const url = `/api${tableUrl}/totalListAll.do`;
        let requestData = { poiId: projectInfo.poiId };

        if (currentTask === "인건비 수주관리") {
            requestData = {
                poiId: projectInfo.poiId,
                modeCode: "SLSP",
                useAt: "Y",
            };
            //예산관리에서 수주관리 뷰 띄우기
        } else if (currentTask === "인건비 예산관리") {
            requestData = {
                poiId: projectInfo.poiId,
                pecSlsExcCode: "PEXC",
                pecTypeCode: "MM",
                useAt: "Y",
                pecModeCode: "PDVSN01",
            };
            //실행에서 예산 뷰 띄우가
        } else if (currentTask === "인건비 실행관리") {
            requestData = {
                poiId: projectInfo.poiId,
                pecSlsExcCode: "PEXC",
                pecTypeCode: "MM",
                useAt: "Y",
                pecModeCode: "PDVSN02",
            };
        } else {
            return;
        }

        console.log(requestData, "서버에 넘겨줘볼까");
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

    const refresh = () => {
        fetchData();
    }

    const compareData = (originData, updatedData) => {
        const filterData = updatedData.filter((data) => data.pgNm); //pgNm 없는 데이터 제외
        const originDataLength = originData ? originData.length : 0;
        const updatedDataLength = filterData ? filterData.length : 0;

        if (originDataLength > updatedDataLength) {
            updateList(filterData);

            const toDelete = [];
            for (let i = updatedDataLength; i < originDataLength; i++) {
                toDelete.push(originData[i].pecId);
            }
            deleteList(toDelete);

        } else if (originDataLength === updatedDataLength) {
            updateList(filterData);

        } else if (originDataLength < updatedDataLength) {
            const toAdds = [];
            const addUpdate = [];
            for (let i = 0; i < originDataLength; i++) {
                addUpdate.push(filterData[i]);
            }
            updateList(addUpdate);

            for (let i = originDataLength; i < updatedDataLength; i++) {
                const add = { poiId: poiIdToSend || projectInfo.poiId }
                toAdds.push({ ...filterData[i], ...add });
            }
            addList(toAdds);
        }
    };

    const addList = async (addNewData) => {
        console.log("❗addList:", addNewData);
        // http://192.168.0.113:8080/api/baseInfrm/product/prstmCost/addList.do
        const url = `/api/baseInfrm/product/prstmCost/addList.do`;
        const resultData = await axiosPost(url, addNewData);
        if (resultData) {
            refresh();
        }
    };
    const updateList = async (toUpdate) => {
        console.log("❗updateList:", toUpdate);
        // http://192.168.0.113:8080/api/baseInfrm/product/prstmCost/editList.do
        const url = `/api/baseInfrm/product/prstmCost/editList.do`;
        const resultData = await axiosUpdate(url, toUpdate);
        if (resultData) {
            refresh();
        }
    };

    const deleteList = async (removeItem) => {
        console.log("❗deleteList:", removeItem);
        // http://192.168.0.113:8080/api/baseInfrm/product/prstmCost/removeAll.do
        const url = `/api/baseInfrm/product/prstmCost/removeAll.do`;
        const resultData = await axiosDelete(url, removeItem);
        if (resultData) {
            refresh();
        }
    };

    return (
        <>
            <Location pathList={locationPath.LaborCostMgmt} />
            <div className="common_board_style mini_board_2">
                <ul className="tab">
                    <li onClick={() => changeTabs("인건비 조회관리")}>
                        <a href="#인건비 조회관리" className="on">
                            인건비 조회관리
                        </a>
                    </li>
                    <li onClick={() => changeTabs("인건비 수주관리")}>
                        <a href="#인건비 수주관리">인건비 수주관리</a>
                    </li>
                    <li onClick={() => changeTabs("인건비 예산관리")}>
                        <a href="#인건비 예산관리">인건비 예산관리</a>
                    </li>
                    <li onClick={() => changeTabs("인건비 실행관리")}>
                        <a href="#인건비 실행관리">인건비 실행관리</a>
                    </li>
                </ul>

                <div className="list">
                    <div className="first">
                        <ul>
                            <SearchList conditionList={columns.laborCostMgmt.condition} onSearch={handleReturn} />
                            <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", position: "absolute" }}>
                                <button className="arrowBtnStyle" style={{ zIndex: "999" }} onClick={handleClick1}>
                                    <FontAwesomeIcon className={`arrowBtn ${isClicked ? "" : "clicked"}`} icon={faArrowUp} />
                                </button>
                            </div>
                            <div className={`hideDivRun ${isClicked ? "" : "clicked"}`}>
                                <ReactDataTableView
                                    sendPoiId={sendPoiId}
                                    columns={columns.laborCostMgmt.project}
                                    customDatas={projectItem}
                                    defaultPageSize={5}
                                    justColumn={true}
                                />
                            </div>
                            <div className="table-buttons">
                                    <RefreshButton onClick={refresh} />
                            </div>
                            <ReactDataTable
                                columns={columns.laborCostMgmt.inquiry}
                                flag={false}
                                testTask={true}
                                tableRef={orderPlanMgmtTable1}
                                customDatas={inquiryMgmt}
                                viewPageName="인건비 조회관리"
                                customDatasRefresh={refresh}
                            />
                        </ul>
                    </div>
                    <div className="second">
                        <ul>
                            <ApprovalForm title={innerPageName + " 등록"} >
                                <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", position: "absolute" }}>
                                    <button className="arrowBtnStyle" style={{ zIndex: "999" }} onClick={handleClick2}>
                                        <FontAwesomeIcon className={`arrowBtn ${isClicked2 ? "" : "clicked"}`} icon={faArrowUp} />
                                    </button>
                                </div>
                                <div className={`hideDivRun2 ${isClicked2 ? "" : "clicked"}`}>
                                    <ReactDataTableView columns={columns.laborCostMgmt.sub} customDatas={saleCostView} defaultPageSize={5} />
                                </div>
                                <div className="table-buttons">
                                    <RefreshButton onClick={refresh} />
                                </div>
                                <ReactDataTable
                                    columns={columns.laborCostMgmt.orderPlan}
                                    singleUrl="/baseInfrm/product/prstmCost"
                                    flag={innerPageName === "인건비 수주관리" && isSaveFormTable}
                                    tableRef={orderPlanMgmtTable2}
                                    customDatas={pgBudgetMgmt}
                                    viewPageName="인건비 수주관리"
                                    sendToParentTables={compareData}
                                />
                            </ApprovalForm>
                        </ul>
                    </div>
                    <div className="third">
                        <ul>
                            <ApprovalForm title={innerPageName + " 등록"} >
                                <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", position: "absolute" }}>
                                    <button className="arrowBtnStyle" style={{ zIndex: "999" }} onClick={handleClick3}>
                                        <FontAwesomeIcon className={`arrowBtn ${isClicked3 ? "" : "clicked"}`} icon={faArrowUp} />
                                    </button>
                                </div>
                                <div className={`hideDivRun3 ${isClicked3 ? "" : "clicked"}`}>
                                    <ReactDataTableView columns={columns.laborCostMgmt.budgetView} customDatas={pgBudgetView} defaultPageSize={5} />
                                </div>
                                <div className="table-buttons">
                                    <RefreshButton onClick={refresh} />
                                </div>
                                <ReactDataTable
                                    columns={columns.laborCostMgmt.budget}
                                    flag={innerPageName === "인건비 예산관리" && isSaveFormTable}
                                    tableRef={orderPlanMgmtTable3}
                                    customDatas={budgetMgmt}
                                    viewPageName="인건비 예산관리"
                                />
                            </ApprovalForm>
                        </ul>
                    </div>

                    <div className="fourth">
                        <ul>
                            <ApprovalForm title={innerPageName + " 등록"} >
                                <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", position: "absolute" }}>
                                    <button className="arrowBtnStyle" style={{ zIndex: "999" }} onClick={handleClick4}>
                                        <FontAwesomeIcon className={`arrowBtn ${isClicked4 ? "" : "clicked"}`} icon={faArrowUp} />
                                    </button>
                                </div>
                                <div className={`hideDivRun4 ${isClicked4 ? "" : "clicked"}`}>
                                    <ReactDataTableView columns={columns.laborCostMgmt.budget} customDatas={budgetView} defaultPageSize={5} />
                                </div>
                                <div className="table-buttons">
                                    <RefreshButton onClick={refresh} />
                                </div>
                                <ReactDataTable
                                    columns={columns.laborCostMgmt.run}
                                    flag={innerPageName === "인건비 실행관리" && isSaveFormTable}
                                    tableRef={orderPlanMgmtTable4}
                                    customDatas={runMgmt}
                                    viewPageName="인건비 실행관리"
                                />
                            </ApprovalForm>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LaborCostMgmt;