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

/** 실행관리-인건비관리 */
function LaborCostMgmt() {
    const { isSaveFormTable, setIsSaveFormTable, projectInfo, setProjectInfo } = useContext(PageContext);

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
        {
            header: "품목그룹명",
            col: "pgNm",
            cellWidth: "20%",
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
            header: "특급기술사",
            col: "pmpmmNum1",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "고급기술사",
            col: "pmpmmNum2",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "중급기술사",
            col: "pmpmmNum3",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "초급기술사",
            col: "pmpmmNum4",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "고급기능사",
            col: "pmpmmNum5",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "중급기능사",
            col: "pmpmmNum6",
            cellWidth: "10%",
            type: "input",
        },
    ];

    const subColumnsLevels = [
        {
            header: "품목그룹명",
            col: "pgNm",
            cellWidth: "20%",
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
            header: "품목그룹명",
            col: "pgNm",
            cellWidth: "20%",
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

    const budgetColumns = [
        {
            header: "품목그룹명",
            col: "pgNm",
            cellWidth: "20%",
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

    const runColumns = [
        {
            header: "품목그룹명",
            col: "pgNm",
            cellWidth: "20%",
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
    const [pgBudgetMgmt, setPgBudgetMgmt] = useState([]); // 인건비 수주관리
    const [budgetMgmt, setBudgetMgmt] = useState([]); // 인건비 예산관리
    const [runMgmt, setRunMgmt] = useState([]); // 인건비 실행관리

    const groupedData = {}; //인건비 바꿔서 넣어줄 빈 객체

    const changePrmnPlanData = (data) => {
        // 포지션에 대한 고정된 번호를 매핑하는 객체 생성
        const positionMapping = {
            부장: 1,
            부장: 2,
            차장: 3,
            과장: 4,
            대리: 5,
            주임: 6,
            사원: 7,
        };

        data.forEach((item) => {
            const key = `${item.pgNm}-${item.pmpMonth[0]}-${item.pmpMonth[1]}`;
            if (!groupedData[key]) {
                groupedData[key] = {
                    pgNm: item.pgNm,
                    pmpMonth: `${item.pmpMonth[0]}-${item.pmpMonth[1]}`,
                    total: 0,
                };
            }

            // 포지션에 해당하는 번호를 가져오고, 해당 위치에 pmpmmNum을 저장
            const positionNumber = positionMapping[item.pmpmmPositionCode];
            if (positionNumber) {
                const pmpmmNumKey = `pmpmmNum${positionNumber}`;
                groupedData[key][pmpmmNumKey] = item.pmpmmNum;
                groupedData[key].total += item.pmpmmNum;
            }
        });

        // groupedData 객체를 배열로 변환
        const transformedData = Object.values(groupedData);
        setBudgetMgmt(transformedData);
        console.log(transformedData, "변환되고나서의 값을보여줌");
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
                    const data = await fetchAllData("/cost/costPrmnPlan"); // 인건비 조회관리
                    console.log(data, "불러온 조회관리 값은?");
                    changePrmnPlanData(data);
                } else if (currentTask === "인건비 수주관리") {
                    const data = await fetchAllData("/cost/costPjbudget/type"); // 인건비 수주관리
                    setRunMgmt(data);
                    //.map((item) => ({
                    //    ...item,
                    //    pjbgTypeCode: changepjbudgetData(
                    //        //영업 slsp만 추출
                    //        item.pjbgTypeCode,
                    //        expensesColumns[0].options
                    //    ),
                    //}))
                } else if (currentTask === "인건비 예산관리") {
                    const data = await fetchAllData("/cost/costPjbudget/type"); // 인건비 예산관리
                    setRunMgmt(data);
                    //.map((item) => ({
                    //    ...item,
                    //    pjbgTypeCode: changepjbudgetData(
                    //        //영업 slsp만 추출
                    //        item.pjbgTypeCode,
                    //        expensesColumns[0].options
                    //    ),
                    //}))
                } else if (currentTask === "인건비 실행관리") {
                    const data = await fetchAllData("/cost/costPdOrdr"); // 인건비 실행관리
                    setInquiryMgmt(data);
                }
            } catch (error) {
                console.error("데이터를 가져오는 중에 오류 발생:", error);
            }
        };

        fetchData(); // fetchData 함수를 호출하여 데이터를 가져옵니다.
    }, [projectInfo.poiId, currentTask]);

    const fetchAllData = async (tableUrl) => {
        const url = `/api${tableUrl}/totalListAll.do`;
        let requestData = { poiId: projectInfo.poiId };
        if (tableUrl === "/cost/costPdOrdr") {
            //requestData 값 담기
            requestData = { poiId: projectInfo.poiId, useAt: "Y" };
        } else {
            requestData = {
                poiId: projectInfo.poiId,
                pjbgModeCode: "slsp",
                useAt: "Y",
            };
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
                                <ReactDataTable columns={projectColumns} defaultPageSize={5} justColumn={true} />
                            </div>
                            <ReactDataTable
                                columns={inquiryColumns}
                                flag={currentTask === "인건비 조회관리" && isSaveFormTable}
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
                                <ReactDataTable columns={projectColumns} defaultPageSize={5} justColumn={true} />
                            </div>
                            <ReactDataTable
                                columns={budgetColumns}
                                flag={currentTask === "인건비 수주관리" && isSaveFormTable}
                                tableRef={orderPlanMgmtTable2}
                                customDatas={budgetMgmt}
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
                                <ReactDataTable columns={projectColumns} defaultPageSize={5} justColumn={true} />
                            </div>
                            <ReactDataTable
                                columns={budgetColumns}
                                flag={currentTask === "인건비 예산관리" && isSaveFormTable}
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
