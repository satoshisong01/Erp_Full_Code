import React, { useContext, useEffect, useRef, useState } from "react";
import BuyMgmts from "./BuyMgmt/BuyMgmts";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import DataTable from "components/DataTable/DataTable";
import { locationPath } from "constants/locationPath";
import { PageContext } from "components/PageProvider";
import { axiosFetch } from "api/axiosFetch";
import ReactDataTable from "components/DataTable/ReactDataTable";
import ApprovalForm from "components/form/ApprovalForm";

/** 실행관리-구매관리 */
function PurchasingMgmt() {
    const { isSaveFormTable, setIsSaveFormTable, projectInfo, setProjectInfo } = useContext(PageContext);

    useEffect(() => {
        return () => {
            setProjectInfo({});
        };
    }, []);

    const orderPlanMgmtTable1 = useRef(null);
    const orderPlanMgmtTable2 = useRef(null);
    const orderPlanMgmtTable3 = useRef(null);

    const [returnKeyWord, setReturnKeyWord] = useState("");

    const projectColumns = [
        {
            header: "프로젝트명",
            col: "poiNm",
            cellWidth: "20%",
            type: "input",
        },
        {
            header: "발주번호",
            col: "pmpmmNum1",
            cellWidth: "20%",
            type: "input",
        },
        {
            header: "발주일",
            col: "pmpmmNum2",
            cellWidth: "20%",
            type: "input",
        },
        {
            header: "발주금액",
            col: "pmpmmNum23",
            cellWidth: "20%",
            type: "input",
        },
        {
            header: "발주부서",
            col: "pmpmmNum24",
            cellWidth: "20%",
            type: "input",
        },
        {
            header: "담당자",
            col: "pmpmmNum25",
            cellWidth: "20%",
            type: "input",
        },
        {
            header: "구매요청유형",
            col: "pmpmmNum26",
            cellWidth: "30%",
            type: "input",
        },
        {
            header: "진행상태",
            col: "pmpmmNum27",
            cellWidth: "20%",
            type: "input",
        },
    ];

    const contractPlan = [
        { header: "품목그룹명", col: "pmpMonth", cellWidth: "15%", type: "input" },
        { header: "품명", col: "total", cellWidth: "15%", type: "input" },
        {
            header: "규격",
            col: "poiBeginDt1",
            cellWidth: "20%",
            type: "input",
        },
        {
            header: "수량",
            col: "pmpmmNum1",
            cellWidth: "15%",
            type: "input",
        },
        {
            header: "단위",
            col: "pmpmmNum2",
            cellWidth: "20%",
            type: "input",
        },
        {
            header: "소비자단가",
            col: "pmpmmNum3",
            cellWidth: "15%",
            type: "input",
        },
        {
            header: "소비자금액",
            col: "pmpmmNum31",
            cellWidth: "15%",
            type: "input",
        },
        {
            header: "단가",
            col: "pmpmmNum32",
            cellWidth: "15%",
            type: "input",
        },
        {
            header: "금액",
            col: "pmpmmNum33",
            cellWidth: "15%",
            type: "input",
        },
        {
            header: "제조사",
            col: "pmpmmNum34",
            cellWidth: "15%",
            type: "input",
        },
        {
            header: "원단가",
            col: "pmpmmNum35",
            cellWidth: "15%",
            type: "input",
        },
        {
            header: "원가(견적가)",
            col: "pmpmmNum36",
            cellWidth: "15%",
            type: "input",
        },
        {
            header: "이익금",
            col: "pmpmmNum37",
            cellWidth: "15%",
            type: "input",
        },
        {
            header: "이익률",
            col: "pmpmmNum38",
            cellWidth: "15%",
            type: "input",
        },
        {
            header: "기준이익률",
            col: "pmpmmNum39",
            cellWidth: "15%",
            type: "input",
        },
        {
            header: "소비자가산출률",
            col: "pmpmmNum310",
            cellWidth: "15%",
            type: "input",
        },
        {
            header: "비고",
            col: "pmpmmNum311",
            cellWidth: "15%",
            type: "input",
        },
    ];

    const runCost = [
        {
            header: "품목그룹명",
            col: "poiNm",
            cellWidth: "20%",
            type: "input",
        },
        {
            header: "품명",
            col: "pmpmmNum1",
            cellWidth: "20%",
            type: "input",
        },
        {
            header: "규격",
            col: "pmpmmNum2",
            cellWidth: "20%",
            type: "input",
        },
        {
            header: "수량",
            col: "pmpmmNum23",
            cellWidth: "20%",
            type: "input",
        },
        {
            header: "단가",
            col: "pmpmmNum24",
            cellWidth: "20%",
            type: "input",
        },
        {
            header: "금액",
            col: "pmpmmNum25",
            cellWidth: "20%",
            type: "input",
        },
        {
            header: "구매예상일",
            col: "pmpmmNum26",
            cellWidth: "30%",
            type: "input",
        },
        {
            header: "비고",
            col: "pmpmmNum27",
            cellWidth: "20%",
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
        { header: "품목명", col: "pmpMonth", cellWidth: "10%", type: "input" },
        { header: "규격", col: "total", cellWidth: "10%", type: "input" },
        {
            header: "수량",
            col: "poiBeginDt1",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "미입고",
            col: "pmpmmNum1",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "입고",
            col: "pmpmmNum2",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "단위",
            col: "pmpmmNum3",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "단가",
            col: "pmpmmNum4",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "금액",
            col: "pmpmmNum5",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "구매거래처",
            col: "pmpmmNum6",
            cellWidth: "20%",
            type: "input",
        },
        {
            header: "발주일",
            col: "pmpmmNum61",
            cellWidth: "20%",
            type: "input",
        },
        {
            header: "제조사",
            col: "pmpmmNum62",
            cellWidth: "20%",
            type: "input",
        },
        {
            header: "요청납기일",
            col: "pmpmmNum63",
            cellWidth: "20%",
            type: "input",
        },
        {
            header: "입고일",
            col: "pmpmmNum64",
            cellWidth: "20%",
            type: "input",
        },
        {
            header: "발주상태",
            col: "pmpmmNum65",
            cellWidth: "20%",
            type: "input",
        },
        {
            header: "입고상태",
            col: "pmpmmNum66",
            cellWidth: "20%",
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
        { header: "품명", col: "pmpMonth", cellWidth: "10%", type: "button" },
        { header: "규격", col: "total", cellWidth: "10%", type: "input" },
        {
            header: "수량",
            col: "poiBeginDt1",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "단가",
            col: "pmpmmNum1",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "금액",
            col: "pmpmmNum2",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "구매예상일",
            col: "pmpmmNum3",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "비고",
            col: "pmpmmNum4",
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
        { header: "품명", col: "pmpMonth", cellWidth: "10%", type: "input" },
        { header: "규격", col: "total", cellWidth: "10%", type: "input" },
        {
            header: "수량",
            col: "poiBeginDt1",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "단가",
            col: "pmpmmNum1",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "금액",
            col: "pmpmmNum2",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "구매거래처",
            col: "pmpmmNum3",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "발주일",
            col: "pmpmmNum4",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "제조사",
            col: "pmpmmNum5",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "요청납기일",
            col: "pmpmmNum6",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "입고일",
            col: "pmpmmNum7",
            cellWidth: "10%",
            type: "input",
        },
    ];

    const [currentTask, setCurrentTask] = useState("구매 조회관리");
    const [budgetMgmt, setBudgetMgmt] = useState([]); // 구매 예산관리
    const [runMgmt, setRunMgmt] = useState([]); // 구매 실행관리
    const [inquiryMgmt, setInquiryMgmt] = useState([]); // 구매 조회관리

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
                if (currentTask === "구매 조회관리") {
                    const data = await fetchAllData("/cost/costPrmnPlan"); // 구매 조회관리
                    console.log(data, "불러온 조회관리 값은?");
                    changePrmnPlanData(data);
                } else if (currentTask === "구매 예산관리") {
                    const data = await fetchAllData("/cost/costPjbudget/type"); // 구매 예산관리
                    setRunMgmt(data);
                    //.map((item) => ({
                    //    ...item,
                    //    pjbgTypeCode: changepjbudgetData(
                    //        //영업 slsp만 추출
                    //        item.pjbgTypeCode,
                    //        expensesColumns[0].options
                    //    ),
                    //}))
                } else if (currentTask === "구매 실행관리") {
                    const data = await fetchAllData("/cost/costPdOrdr"); // 실행관리
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

    //const columns = [
    //    {
    //        header: "프로젝트명",
    //        col: "name",
    //        cellWidth: "20%",
    //        update: false,
    //        updating: true,
    //        write: true,
    //    },
    //    {
    //        header: "작성일",
    //        col: "code",
    //        cellWidth: "20%",
    //        updating: true,
    //        write: true,
    //    },
    //    {
    //        header: "발주번호",
    //        col: "startDate",
    //        cellWidth: "20%",
    //        updating: true,
    //        write: true,
    //    },
    //    { header: "발주일", col: "currency", cellWidth: "20%" },
    //    { header: "발주금액", col: "vendor", cellWidth: "20%" },
    //    { header: "발주부서", col: "contactPerson", cellWidth: "20%" },
    //    { header: "담당자", col: "endDate", cellWidth: "30%" },
    //    { header: "구매요청유형", col: "orderAmount", cellWidth: "20%" },
    //    { header: "진행상태", col: "orderAmount", cellWidth: "30%" },
    //];

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
            title: "품목그룹명",
            colName: "clCodeNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "2",
        },
        {
            title: "품목명",
            colName: "clCodeNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "2",
        },
        {
            title: "구매거래처",
            colName: "clCodeNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "2",
        },
        {
            title: "발주부서",
            colName: "clCodeNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "2",
        },
        {
            title: "발주상태",
            colName: "name",
            type: "select",
            option: [{ value: "발주완료" }, { value: "미발주" }],
            searchLevel: "3",
        },
        {
            title: "입고상태",
            colName: "name",
            type: "select",
            option: [{ value: "입고완료" }, { value: "미입고" }],
            searchLevel: "3",
        },
    ];

    const handleReturn = (value) => {
        setReturnKeyWord(value);
        console.log(value, "제대로 들어오냐");
    };

    const addBtn = ["buyPlanPage", "runBuyPlanPage"];

    return (
        <>
            <Location pathList={locationPath.PurchasingMgmt} />
            <div className="common_board_style mini_board_4">
                <ul className="tab">
                    <li onClick={() => changeTabs("구매 조회관리")}>
                        <a href="#구매 조회관리" className="on">
                            구매 조회관리
                        </a>
                    </li>
                    <li onClick={() => changeTabs("구매 예산관리")}>
                        <a href="#구매 예산관리">구매 예산관리</a>
                    </li>
                    <li onClick={() => changeTabs("구매 실행관리")}>
                        <a href="#구매 실행관리">구매 실행관리</a>
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
                            <ReactDataTable columns={projectColumns} defaultPageSize={5} justColumn={true} />
                            <ReactDataTable
                                columns={inquiryColumns}
                                flag={currentTask === "구매 조회관리" && isSaveFormTable}
                                testTask={true}
                                tableRef={orderPlanMgmtTable1}
                                customDatas={inquiryMgmt}
                            />
                            {/*</ApprovalForm>*/}
                        </ul>
                    </div>
                    <div className="second">
                        <ul>
                            <ApprovalForm title={currentTask + " 계획 등록"}>
                                <ReactDataTable columns={contractPlan} defaultPageSize={5} justColumn={true} />
                                <ReactDataTable
                                    columns={budgetColumns}
                                    flag={currentTask === "구매 예산관리" && isSaveFormTable}
                                    tableRef={orderPlanMgmtTable2}
                                    customDatas={budgetMgmt}
                                />
                            </ApprovalForm>
                        </ul>
                    </div>

                    <div className="third">
                        <ul>
                            <ApprovalForm title={currentTask + " 계획 등록"}>
                                <ReactDataTable columns={runCost} defaultPageSize={5} justColumn={true} />
                                <ReactDataTable
                                    columns={runColumns}
                                    flag={currentTask === "구매 실행관리" && isSaveFormTable}
                                    tableRef={orderPlanMgmtTable3}
                                    customDatas={runMgmt}
                                />
                            </ApprovalForm>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PurchasingMgmt;
