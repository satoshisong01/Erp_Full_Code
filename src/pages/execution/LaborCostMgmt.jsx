import React, { useContext, useEffect, useRef, useState } from "react";
import PersonnelMgmts from "./personnelMgmt/PersonnelMgmts";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import DataTable from "components/DataTable/DataTable";
import { locationPath } from "constants/locationPath";
import ReactDataTable from "components/DataTable/ReactDataTable";
import { axiosFetch } from "api/axiosFetch";
import { PageContext } from "components/PageProvider";
import ApprovalForm from "components/form/ApprovalForm";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import ReactDataTableView from "components/DataTable/ReactDataTableView";
import BasicDataTable from "components/DataTable/BasicDataTable";
import { ChangePrmnPlanData } from "components/DataTable/function/ChangePrmnPlanData";

/** 실행관리-인건비관리 */
function LaborCostMgmt() {
    const { isSaveFormTable, setIsSaveFormTable, projectInfo, setProjectInfo, projectItem, viewSetPoiId } = useContext(PageContext);

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

    const conditionList = [
        {
            title: "프로젝트명",
            colName: "clCode", //컬럼명
            type: "input",
            value: "",
            searchLevel: "1",
        },
        {
            title: "품목그룹명",
            colName: "clCode", //컬럼명
            type: "input",
            value: "",
            searchLevel: "1",
        },
        {
            title: "연월",
            colName: "clCodeNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "2",
        },
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

    const subColumnsGrades = [
        //{
        //    header: "품목그룹명",
        //    col: "pgNm",
        //    cellWidth: "15%",
        //    type: "input",
        //    options: [],
        //},
        { header: "연월", col: "pmpMonth", cellWidth: "10%", type: "datepicker" },
        { header: "M/M계", col: "total", cellWidth: "10%", type: "input" },
        {
            header: "인건비계",
            col: "poiBeginDt1",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "임원",
            col: "pmpmmPositionCode1",
            cellWidth: "10%",
            type: "input",
            notView: "true",
        },
        {
            header: "특급기술사",
            col: "pmpmmPositionCode2",
            cellWidth: "10%",
            type: "input",
            notView: "true",
        },
        {
            header: "고급기술사",
            col: "pmpmmPositionCode3",
            cellWidth: "10%",
            type: "input",
            notView: "true",
        },
        {
            header: "중급기술사",
            col: "pmpmmPositionCode4",
            cellWidth: "10%",
            type: "input",
            notView: "true",
        },
        {
            header: "초급기술사",
            col: "pmpmmPositionCode5",
            cellWidth: "10%",
            type: "input",
            notView: "true",
        },
        {
            header: "고급기능사",
            col: "pmpmmPositionCode6",
            cellWidth: "10%",
            type: "input",
            notView: "true",
        },
        {
            header: "중급기능사",
            col: "pmpmmPositionCode7",
            cellWidth: "10%",
            type: "input",
            notView: "true",
        },
        {
            header: "부장",
            col: "pmpmmPositionCode8",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "차장",
            col: "pmpmmPositionCode9",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "과장",
            col: "pmpmmPositionCode10",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "대리",
            col: "pmpmmPositionCode11",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "주임",
            col: "pmpmmPositionCode12",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "사원",
            col: "pmpmmPositionCode13",
            cellWidth: "10%",
            type: "input",
        },
    ];

    const subColumnsLevels = [
        {
            header: "품목그룹명",
            col: "pgNm",
            cellWidth: "15%",
            type: "select",
            options: [],
        },
        { header: "연월", col: "pmpMonth", cellWidth: "10%", type: "input" },
        { header: "M/M계", col: "total", cellWidth: "10%", type: "input" },
        {
            header: "인건비계",
            col: "poiBeginDt1",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "부장",
            col: "pmpmmNum1",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "차장",
            col: "pmpmmNum2",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "과장",
            col: "pmpmmNum3",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "대리",
            col: "pmpmmNum4",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "주임",
            col: "pmpmmNum5",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "사원",
            col: "pmpmmNum6",
            cellWidth: "10%",
            type: "input",
        },
    ];

    const inquiryColumns = [
        {
            header: "구분코드",
            col: "pecModeCode",
            cellWidth: "10%",
        },
        {
            header: "품목그룹명",
            col: "pgNm",
            cellWidth: "15%",
            //type: "button",
            //options: [],
        },
        {
            header: "인력",
            col: "pecManpower",
            cellWidth: "10%",
        },
        {
            header: "직급",
            col: "pecPosition",
            cellWidth: "10%",
            type: "input",
            notView: "true",
        },
        {
            header: "실행(M/M)",
            col: "pecMm",
            cellWidth: "10%",
        },
        {
            header: "시작일",
            col: "pecStartdate",
            cellWidth: "10%",
            // type: "datepicker"
        },
        {
            header: "종료일",
            col: "pecEnddate",
            cellWidth: "10%",
            // type: "datepicker"
        },
        {
            header: "금액",
            col: "pecUnitPrice111",
            cellWidth: "10%",
        },
        {
            header: "투입률",
            col: "pmpmmPositionCode1",
            cellWidth: "10%",
        },
        {
            header: "누계율",
            col: "pmpmmPositionCode2",
            cellWidth: "10%",
        },
    ];

    const orderPlanColumns = [
        {
            header: "품목그룹명",
            col: "pgNm",
            cellWidth: "25%",
            type: "button",
            options: [],
        },
        { header: "수주수량(M/M)", col: "pecMm", cellWidth: "25%", type: "input" },
        {
            header: "단가",
            col: "pecUnitPrice",
            cellWidth: "25%",
            type: "input",
        },
        {
            header: "금액",
            col: "pmpmmNum1",
            cellWidth: "25%",
            type: "input",
        },
    ];

    const budgetColumns = [
        {
            header: "품목그룹명",
            col: "pgNm",
            cellWidth: "25%",
            type: "button",
            options: [],
        },
        { header: "인력", col: "pecManpower", cellWidth: "25%", type: "input" },
        {
            header: "직급",
            col: "pecPosition",
            cellWidth: "25%",
            type: "select",
            options: [
                { value: "임원", label: "임원" },
                { value: "특급기술사", label: "특급기술사" },
                { value: "고급기술사", label: "고급기술사" },
                { value: "중급기술사", label: "중급기술사" },
                { value: "초급기술사", label: "초급기술사" },
                { value: "고급기능사", label: "고급기능사" },
                { value: "중급기능사", label: "중급기능사" },
                { value: "부장", label: "부장" },
                { value: "차장", label: "차장" },
                { value: "과장", label: "과장" },
                { value: "대리", label: "대리" },
                { value: "주임", label: "주임" },
                { value: "사원", label: "사원" },
            ],
        },
        {
            header: "예산(M/M)",
            col: "pecMm",
            cellWidth: "25%",
            type: "input",
        },
        {
            header: "금액",
            col: "pecUnitPrice222",
            cellWidth: "25%",
            type: "input",
        },
    ];

    const budgetViewColumns = [
        {
            header: "품목그룹명",
            col: "pgNm",
            cellWidth: "25%",
        },
        { header: "수주수량(M/M)", col: "pecMm", cellWidth: "25%" },
        {
            header: "단가",
            col: "pecUnitPrice",
            cellWidth: "25%",
        },
        {
            header: "금액",
            col: "pmpmmNum1",
            cellWidth: "25%",
        },
    ];

    const runColumns = [
        {
            header: "품목그룹명",
            col: "pgNm",
            cellWidth: "15%",
            type: "button",
            options: [],
        },
        { header: "연월", col: "pmpMonth", cellWidth: "10%", type: "input" },
        { header: "M/M계", col: "total", cellWidth: "10%", type: "input" },
        {
            header: "인건비계",
            col: "poiBeginDt1",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "부장",
            col: "pmpmmNum1",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "차장",
            col: "pmpmmNum2",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "과장",
            col: "pmpmmNum3",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "대리",
            col: "pmpmmNum4",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "주임",
            col: "pmpmmNum5",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "사원",
            col: "pmpmmNum6",
            cellWidth: "10%",
            type: "input",
        },
    ];

    const [currentTask, setCurrentTask] = useState("인건비 조회관리");
    const [inquiryMgmt, setInquiryMgmt] = useState([]); // 인건비 조회관리

    const [saleCostView, setSaleCostView] = useState([]); //영업인건비 저장
    const [pgBudgetMgmt, setPgBudgetMgmt] = useState([]); // 인건비 수주관리

    const [budgetMgmt, setBudgetMgmt] = useState([]); // 인건비 예산관리
    const [runMgmt, setRunMgmt] = useState([]); // 인건비 실행관리

    const groupedData = {}; //인건비 바꿔서 넣어줄 빈 객체

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
                if (currentTask === "인건비 조회관리") {
                    const data = await fetchAllData("/baseInfrm/product/prstmCost"); // 인건비 조회관리
                    console.log(data, "불러온 조회관리 값은?");
                    const updatedData = mapPecModeCodeToText(data);
                    console.log(updatedData, "updatedData");
                    setInquiryMgmt(updatedData);
                } else if (currentTask === "인건비 수주관리") {
                    const data = await fetchAllData("/baseInfrm/product/prstmCost/", currentTask); // 인건비 수주관리
                    setPgBudgetMgmt(data);
                    const dataView = await fetchAllDataView("/baseInfrm/product/prmnPlan");
                    setSaleCostView(ChangePrmnPlanData(dataView, projectInfo));
                    console.log(saleCostView, "saleCostView");
                } else if (currentTask === "인건비 예산관리") {
                    const data = await fetchAllData("/baseInfrm/product/prstmCost/"); // 인건비 예산관리
                    setBudgetMgmt(data);
                } else if (currentTask === "인건비 실행관리") {
                    const data = await fetchAllData("/cost/costPdOrdr"); // 인건비 실행관리
                    setInquiryMgmt(data);
                }
            } catch (error) {
                console.error("데이터를 가져오는 중에 오류 발생:", error);
            }
        };

        fetchData(); // fetchData 함수를 호출하여 데이터를 가져옵니다.
    }, [viewSetPoiId, currentTask, projectInfo.poiId]);

    const fetchAllData = async (tableUrl, currentTask) => {
        const url = `/api${tableUrl}/totalListAll.do`;
        console.log(currentTask, "나오낭");
        let requestData = { poiId: viewSetPoiId || projectInfo.poiId, useAt: "Y", pecTypeCode: "MM", pecSlsExcCode: "PEXC" };
        if (tableUrl === "/cost/costPdOrdr") {
            //requestData 값 담기
            requestData = { poiId: viewSetPoiId, useAt: "Y", pecTypeCode: "MM", pecSlsExcCode: "PEXC" };
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
        }

        console.log(requestData, "서버에 넘겨줘볼까");
        const resultData = await axiosFetch(url, requestData);
        if (resultData) {
            return resultData;
        } else {
            return Array(5).fill({}); // 빈 배열 보내주기
        }
    };

    const fetchAllDataView = async (tableUrl, currentTask) => {
        const url = `/api${tableUrl}/totalListAll.do`;
        console.log(currentTask, "나오낭");
        let requestData = { poiId: projectInfo.poiId };
        if (currentTask === "인건비 수주관리") {
            requestData = {
                poiId: projectInfo.poiId,
                modeCode: "SLSP",
                useAt: "Y",
            };
            console.log("여길타야함");
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

    const addBtn = [""];

    return (
        <>
            {/*<Location pathList={locationPath.LaborCostMgmt} />*/}
            {/*<ReactDataTable columns={columns} suffixUrl="/baseInfrm/product/prmn" detailUrl="/" />*/}
            {/* <DataTable
                returnKeyWord={returnKeyWord}
                columns={columns}
                suffixUrl="/system/code"
                currentPage="clCode"
                addBtn={addBtn}
            /> */}
            {/* <PersonnelMgmts /> */}
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
                    {/* <li onClick={() => changeTabs("기업이윤")}><a href="#기업이윤">기업이윤</a></li> */}
                    {/* <li onClick={() => changeTabs("일반관리비")}><a href="#일반관리비">일반관리비</a></li>
                    <li onClick={() => changeTabs("네고")}><a href="#네고">네고</a></li> */}
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
                                <ReactDataTableView columns={projectColumns} customDatas={projectItem} defaultPageSize={5} justColumn={true} />
                                {/*<BasicDataTable columns={projectColumns} customDatas={projectItem} defaultPageSize={5} justColumn={true} />*/}
                            </div>
                            <ReactDataTable
                                columns={inquiryColumns}
                                flag={false}
                                testTask={true}
                                tableRef={orderPlanMgmtTable1}
                                customDatas={inquiryMgmt}
                                viewPageName="인건비 조회관리"
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
                                <ReactDataTableView columns={subColumnsGrades} customDatas={saleCostView} defaultPageSize={5} justColumn={true} />
                            </div>
                            <ReactDataTable
                                columns={orderPlanColumns}
                                flag={currentTask === "인건비 수주관리" && isSaveFormTable}
                                tableRef={orderPlanMgmtTable2}
                                customDatas={pgBudgetMgmt}
                                viewPageName="인건비 수주관리"
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
                                <ReactDataTableView columns={budgetViewColumns} defaultPageSize={5} justColumn={true} />
                            </div>
                            <ReactDataTable
                                columns={budgetColumns}
                                flag={currentTask === "인건비 예산관리" && isSaveFormTable}
                                tableRef={orderPlanMgmtTable3}
                                customDatas={budgetMgmt}
                                viewPageName="인건비 예산관리"
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
                                <ReactDataTable columns={projectColumns} defaultPageSize={5} justColumn={true} />
                            </div>
                            <ReactDataTable
                                columns={runColumns}
                                flag={currentTask === "인건비 실행관리" && isSaveFormTable}
                                tableRef={orderPlanMgmtTable4}
                                customDatas={runMgmt}
                            />
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LaborCostMgmt;
