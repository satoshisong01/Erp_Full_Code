import React, { useContext, useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import ApprovalForm from "components/form/ApprovalForm";
import ReactDataTable from "components/DataTable/ReactDataTable";
import { PageContext } from "components/PageProvider";
import { locationPath } from "constants/locationPath";
import { axiosFetch } from "api/axiosFetch";
import ReactDataTableURL from "components/DataTable/ReactDataTableURL";

/** 영업관리-수주계획관리 */
function OrderPlanMgmt() {
    const { isSaveFormTable, setIsSaveFormTable, projectInfo, setProjectInfo, innerPageName, setPrevInnerPageName, setInnerPageName } = useContext(PageContext);

    useEffect(() => {
        setInnerPageName("인건비");
        return () => {
            // 컴포넌트 종료
            setProjectInfo({}); // 초기화
        };
    }, []);

    const orderPlanMgmtTable1 = useRef(null);
    const orderPlanMgmtTable2 = useRef(null);
    const orderPlanMgmtTable3 = useRef(null);
    const orderPlanMgmtTable4 = useRef(null);
    const orderPlanMgmtTable5 = useRef(null);
    const orderPlanMgmtTable6 = useRef(null);
    const orderPlanMgmtTable7 = useRef(null);

    const laborColumns = [
        // 인건비
        //{
        //    header: "품목그룹명",
        //    col: "pgNm",
        //    cellWidth: "20%",
        //    type: "button",
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
    const expensesColumns = [
        // 경비
        {
            header: "경비목록",
            col: "pjbgTypeCode",
            cellWidth: "25%",
            type: "select",
            options: [
                { value: "EXPNS01", label: "교통비" },
                { value: "EXPNS02", label: "숙박비" },
                { value: "EXPNS03", label: "일비/파견비" },
                { value: "EXPNS04", label: "식비" },
                { value: "EXPNS05", label: "자재/소모품외" },
                { value: "EXPNS06", label: "영업비" },
            ],
        },
        { header: "비고", col: "pjbgDesc", cellWidth: "50%", type: "input" },
        { header: "금액", col: "pjbgPrice", cellWidth: "25%", type: "input" },
        { header: "프로젝트ID", col: "poiId", cellWidth: "50%", type: "input", notView: "true" },
        { header: "영업타입", col: "pjbgModeCode", cellWidth: "50%", type: "input", notView: "true" },
        { header: "사용여부", col: "deleteAt", cellWidth: "50%", type: "input", notView: "true" },
        { header: "삭제여부", col: "useAt", cellWidth: "50%", type: "input", notView: "true" },
    ];
    const outsourcingColumns = [
        // 개발외주비
        {
            header: "회사목록",
            col: "esntlId",
            cellWidth: "20%",
            type: "button",
            options: [],
        },
        { header: "금액", col: "pjbgPrice", cellWidth: "25%", type: "input" },
        { header: "비고", col: "pjbgDesc", cellWidth: "50%", type: "input" },
        { header: "프로젝트ID", col: "poiId", cellWidth: "50%", type: "input", notView: "true" },
        { header: "영업타입", col: "pjbgModeCode", cellWidth: "50%", type: "input", notView: "true" },
        { header: "경비타입", col: "pjbgTypeCode", cellWidth: "50%", type: "input", notView: "true" },
        { header: "사용여부", col: "deleteAt", cellWidth: "50%", type: "input", notView: "true" },
        { header: "삭제여부", col: "useAt", cellWidth: "50%", type: "input", notView: "true" },
    ];

    const generalExpensesColumns = [
        // 영업관리비
        {
            header: "영업관리비 목록",
            col: "pjbgTypeCode",
            cellWidth: "25%",
            type: "select",
            options: [
                { value: "EXPNS07", label: "기업이윤" },
                { value: "EXPNS08", label: "일반관리비" },
                { value: "EXPNS09", label: "네고" },
            ],
        },
        { header: "비고", col: "pjbgDesc", cellWidth: "50%", type: "input" },
        { header: "금액", col: "pjbgPrice", cellWidth: "25%", type: "input" },
        { header: "프로젝트ID", col: "poiId", cellWidth: "50%", type: "input", notView: "true" },
        { header: "영업타입", col: "pjbgModeCode", cellWidth: "50%", type: "input", notView: "true" },
        { header: "사용여부", col: "deleteAt", cellWidth: "50%", type: "input", notView: "true" },
        { header: "삭제여부", col: "useAt", cellWidth: "50%", type: "input", notView: "true" },
    ];

    const purchaseColumns = [
        // 구매비
        {
            header: "품목그룹명",
            col: "pgNm",
            cellWidth: "20%",
            type: "button",
            options: [],
        },
        { header: "품명", col: "pdiNm", cellWidth: "20%", type: "buttonPdiNm", options: [] },
        { header: "규격", col: "pdiStnd", cellWidth: "20%", type: "input" },
        { header: "수량", col: "byQunty", cellWidth: "10%", type: "input" },
        { header: "단위", col: "pdiUnit", cellWidth: "10%", type: "input" },
        {
            header: "소비자\n단가",
            col: "consumerPrice",
            cellWidth: "14%",
            type: "input",
        },
        {
            header: "소비자\n금액",
            col: "consumerAmount",
            cellWidth: "14%",
            type: "input",
        },
        { header: "단가", col: "unitPrice", cellWidth: "10%", type: "input" },
        { header: "금액", col: "planAmount", cellWidth: "10%", type: "input" },
        {
            header: "제조사",
            col: "pdiMenufut",
            cellWidth: "12%",
            type: "input",
        },
        { header: "비고", col: "pdiDesc", cellWidth: "20%", type: "input" },
        {
            header: "원단가",
            col: "byUnitPrice",
            cellWidth: "12%",
            type: "input",
        },
        {
            header: "원가",
            col: "estimatedCost",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "이익금",
            col: "plannedProfits",
            cellWidth: "12%",
            type: "input",
        },
        {
            header: "이익률",
            col: "plannedProfitMargin",
            cellWidth: "12%",
            type: "input",
        },
        {
            header: "기준\n이익률",
            col: "standardMargin",
            cellWidth: "15%",
            type: "input",
        },
        {
            header: "소비자가\n산출률",
            col: "consumerOpRate",
            cellWidth: "15%",
            type: "input",
        },
    ];

    const negoColumns = [
        // 네고
        { header: "금액", col: "poiTitle1", cellWidth: "50%", type: "input" },
        { header: "비고", col: "poiTitle2", cellWidth: "50%", type: "input" },
    ];

    const outColumns = [
        // 개발외주비
        { header: "회사", col: "poiTitle1", cellWidth: "50%", type: "input" },
        { header: "M/M", col: "poiTitle2", cellWidth: "50%", type: "input" },
        { header: "금액", col: "poiTitle3", cellWidth: "50%", type: "input" },
    ];

    const [currentTask, setCurrentTask] = useState("인건비");
    const [prmnPlanDatas, setPrmnPlanDatas] = useState([]); // 인건비
    const [pjbudgetDatas, setPjbudgetDatas] = useState([]); // 경비
    const [pdOrdrDatas, setPdOrdrDatas] = useState([]); // 구매(재료비)
    const [outsourcingDatas, setOutsourcingDatas] = useState([]); // 개발외주비
    const [generalExpensesDatas, setGeneralExpensesDatas] = useState([]); // 개발외주비

    const groupedData = {}; //인건비 바꿔서 넣어줄 빈 객체

    const changePrmnPlanData = (data) => {
        // 포지션에 대한 고정된 번호를 매핑하는 객체 생성
        const positionMapping = {
            임원: 1,
            특급기술사: 2,
            고급기술사: 3,
            중급기술사: 4,
            초급기술사: 5,
            고급기능사: 6,
            중급기능사: 7,
            부장: 8,
            차장: 9,
            과장: 10,
            대리: 11,
            주임: 12,
            사원: 13,
        };

        //날짜포맷
        data.forEach((item) => {
            //console.log(item, "아이템@@#@#@#");
            const key = `${item.pmpMonth}`;
            console.log(key, "🔥🔥🔥key");
            if (!groupedData[key]) {
                groupedData[key] = {
                    //pgNm: item.pgNm,
                    pmpId: [],
                    poiId: projectInfo.poiId,
                    useAt: "Y",
                    deleteAt: "N",
                    calendarVisible: false,
                    pmpmmPositionCode1: 0,
                    pmpmmPositionCode2: 0,
                    pmpmmPositionCode3: 0,
                    pmpmmPositionCode4: 0,
                    pmpmmPositionCode5: 0,
                    pmpmmPositionCode6: 0,
                    pmpmmPositionCode7: 0,
                    pmpmmPositionCode8: 0,
                    pmpmmPositionCode9: 0,
                    pmpmmPositionCode10: 0,
                    pmpmmPositionCode11: 0,
                    pmpmmPositionCode12: 0,
                    pmpmmPositionCode13: 0,
                    pmpMonth2: `${item.pmpMonth}`,
                    pmpMonth: `${item.pmpMonth}`,
                    total: 0,
                };
            }

            groupedData[key].pmpId.push(item.pmpId);

            // 포지션에 해당하는 번호를 가져오고, 해당 위치에 pmpmmNum을 저장
            const positionNumber = positionMapping[item.pmpmmPositionCode];
            //console.log(positionNumber, "🥱🥱🥱🥱");
            //console.log(item.pmpmmPositionCode, "🆗🆗🆗🆗");

            if (positionNumber) {
                const pmpmmNumKey = `pmpmmPositionCode${positionNumber}`;
                groupedData[key][pmpmmNumKey] = item.pmpmmNum;

                //console.log(groupedData[key][pmpmmNumKey], "💚💚💚💚💚");

                groupedData[key].total += item.pmpmmNum;
            }
        });

        // groupedData 객체를 배열로 변환
        const transformedData = Object.values(groupedData);
        setPrmnPlanDatas(transformedData);
    };

    //const changepjbudgetData = (value, options) => {
    //    console.log(value, options, "@@@@@@@@@@@@@@@@@@@@@@@#@#@");
    //    const option = options.find((opt) => opt.value === value);
    //    return option ? option.label : value; // 찾은 옵션의 label을 반환하거나 value 그대로 반환
    //};

    const changeTabs = (task) => {
        // setCurrentTask(task);
        if (task !== innerPageName) {
            //자신 일때 수정 창으로 변동 되지 않기 위한 조건
            setIsSaveFormTable(true);
        }
        setInnerPageName((prev) => {
            setPrevInnerPageName(prev);
            return task;
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (innerPageName === "인건비") {
                    const data = await fetchAllData("/baseInfrm/product/prmnPlan"); // 인건비
                    console.log(data, "불러온 인건비의 값은?");
                    changePrmnPlanData(data);
                } else if (innerPageName === "경비") {
                    const data = await fetchAllData("/baseInfrm/product/pjbudget"); // 경비
                    setPjbudgetDatas(data);
                    //.map((item) => ({
                    //    ...item,
                    //    pjbgTypeCode: changepjbudgetData(
                    //        //영업 slsp만 추출
                    //        item.pjbgTypeCode,
                    //        expensesColumns[0].options
                    //    ),
                    //}))
                    ///baseInfrm/product/pdOrdr
                } else if (innerPageName === "구매(재료비)") {
                    const data = await fetchAllData("/cost/costPdOrdr"); // 구매(재료비)
                    setPdOrdrDatas(data);
                } else if (innerPageName === "개발외주비") {
                    const data = await fetchOutsourcingData("/baseInfrm/product/pjbudget");
                    setOutsourcingDatas(data);
                } else if (innerPageName === "영업관리비") {
                    const data = await fetchAllData("/baseInfrm/product/pjbudget");
                    setGeneralExpensesDatas(data);
                }
            } catch (error) {
                console.error("데이터를 가져오는 중에 오류 발생:", error);
            }
        };

        fetchData(); // fetchData 함수를 호출하여 데이터를 가져옵니다.
    }, [projectInfo.poiId, innerPageName, isSaveFormTable]);

    const fetchAllData = async (tableUrl) => {
        const url = `/api${tableUrl}/totalListAll.do`;
        let requestData = { poiId: projectInfo.poiId };
        if (tableUrl === "/cost/costPdOrdr") {
            //requestData 값 담기
            requestData = { poiId: projectInfo.poiId, useAt: "Y" };
        } else {
            requestData = {
                poiId: projectInfo.poiId,
                pjbgModeCode: "SLSP",
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

    const fetchOutsourcingData = async (tableUrl) => {
        const url = `/api${tableUrl}/totalListAll.do`;
        let requestData = { poiId: projectInfo.poiId };
        //if (tableUrl === "/baseInfrm/product/pjbudget") {
        requestData = {
            poiId: projectInfo.poiId,
            pjbgModeCode: "SLSP",
            pjbgTypeCode: "EXPNS10",
            useAt: "Y",
            //};
        };

        const resultData = await axiosFetch(url, requestData);
        if (resultData) {
            return resultData;
        } else {
            return Array(5).fill({}); // 빈 배열 보내주기
        }
    };

    const allowedPjbgTypeCodes = ["EXPNS01", "EXPNS02", "EXPNS03", "EXPNS04", "EXPNS05", "EXPNS06"];

    const allowedPjbgTypeCodes2 = ["EXPNS07", "EXPNS08", "EXPNS09"];
    const [filteredPjbudgetDatas, setFilteredPjbudgetDatas] = useState([]);
    const [filteredPjbudgetDatas2, setFilteredPjbudgetDatas2] = useState([]);

    useEffect(() => {
        const filteredData = pjbudgetDatas.filter((data) => {
            const pjbgTypeCode = data.pjbgTypeCode;
            return allowedPjbgTypeCodes.includes(pjbgTypeCode);
        });
        setFilteredPjbudgetDatas(filteredData);

        const filteredData2 = generalExpensesDatas.filter((data) => {
            const pjbgTypeCode = data.pjbgTypeCode;
            return allowedPjbgTypeCodes2.includes(pjbgTypeCode);
        });
        setFilteredPjbudgetDatas2(filteredData2);
    }, [pjbudgetDatas, generalExpensesDatas]);

    //console.log(prmnPlanDatas, "인건비");
    //console.log(pjbudgetDatas, "경비");
    //console.log(filteredPjbudgetDatas, "수정된 경비");
    //console.log(pdOrdrDatas, "구매(재료비");
    //console.log(outsourcingDatas, "개발외주비");
    //console.log(filteredPjbudgetDatas2, "영업관리비");

    return (
        <>
            <Location pathList={locationPath.OrderPlanMgmt} />
            <div className="common_board_style mini_board_1">
                <ul className="tab">
                    <li onClick={() => changeTabs("인건비")}>
                        <a href="#인건비" className="on">
                            인건비
                        </a>
                    </li>
                    <li onClick={() => changeTabs("구매(재료비)")}>
                        <a href="#구매(재료비)">구매(재료비)</a>
                    </li>
                    <li onClick={() => changeTabs("개발외주비")}>
                        <a href="#개발외주비">개발외주비</a>
                    </li>
                    <li onClick={() => changeTabs("경비")}>
                        <a href="#경비">경비</a>
                    </li>
                    <li onClick={() => changeTabs("영업관리비")}>
                        <a href="#영업관리비">영업관리비</a>
                    </li>
                </ul>

                <div className="list">
                    <div className="first">
                        <ul>
                            <ApprovalForm title={innerPageName + " 계획 등록"}>
                                <ReactDataTable
                                    columns={laborColumns}
                                    flag={innerPageName === "인건비" && isSaveFormTable}
                                    testTask={true}
                                    tableRef={orderPlanMgmtTable1}
                                    customDatas={prmnPlanDatas}
                                    viewPageName="인건비"
                                />
                            </ApprovalForm>
                        </ul>
                    </div>
                    <div className="second">
                        <ul>
                            <ApprovalForm title={innerPageName + " 계획 등록"}>
                                <ReactDataTable
                                    singleUrl="/baseInfrm/product/pdOrdr"
                                    columns={purchaseColumns}
                                    flag={innerPageName === "구매(재료비)" && isSaveFormTable}
                                    tableRef={orderPlanMgmtTable3}
                                    customDatas={pdOrdrDatas}
                                    viewPageName="구매(재료비)"
                                />
                            </ApprovalForm>
                        </ul>
                    </div>

                    <div className="third">
                        <ul>
                            <ApprovalForm title={innerPageName + " 계획 등록"}>
                                <ReactDataTableURL
                                    singleUrl="/baseInfrm/product/pjbudget"
                                    columns={outsourcingColumns}
                                    flag={innerPageName === "개발외주비" && isSaveFormTable}
                                    tableRef={orderPlanMgmtTable4}
                                    customDatas={outsourcingDatas}
                                    viewPageName="개발외주비"
                                />
                            </ApprovalForm>
                        </ul>
                    </div>

                    <div className="fourth">
                        <ul>
                            <ApprovalForm title={innerPageName + " 계획 등록"}>
                                <ReactDataTableURL
                                    singleUrl="/baseInfrm/product/pjbudget"
                                    columns={expensesColumns}
                                    flag={innerPageName === "경비" && isSaveFormTable}
                                    tableRef={orderPlanMgmtTable2}
                                    customDatas={filteredPjbudgetDatas}
                                    viewPageName="경비"
                                />
                            </ApprovalForm>
                        </ul>
                    </div>

                    <div className="fifth">
                        <ul>
                            <ApprovalForm title={innerPageName + " 계획 등록"}>
                                <ReactDataTableURL
                                    columns={generalExpensesColumns}
                                    singleUrl="/baseInfrm/product/pjbudget"
                                    flag={innerPageName === "영업관리비" && isSaveFormTable}
                                    tableRef={orderPlanMgmtTable5}
                                    customDatas={filteredPjbudgetDatas2}
                                    viewPageName="영업관리비"
                                />
                            </ApprovalForm>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}

export default OrderPlanMgmt;
