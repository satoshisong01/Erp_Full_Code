import React, { useContext, useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import ApprovalForm from "components/form/ApprovalForm";
import ReactDataTable from "components/DataTable/ReactDataTable";
import { PageContext } from "components/PageProvider";
import { locationPath } from "constants/locationPath";
import { axiosFetch } from "api/axiosFetch";

/** 영업관리-수주계획관리 */
function OrderPlanMgmt() {
    const { isSaveFormTable, setIsSaveFormTable, projectInfo } = useContext(PageContext);

    const orderPlanMgmtTable1 = useRef(null);
    const orderPlanMgmtTable2 = useRef(null);
    const orderPlanMgmtTable3 = useRef(null);
    const orderPlanMgmtTable4 = useRef(null);
    const orderPlanMgmtTable5 = useRef(null);
    const orderPlanMgmtTable6 = useRef(null);

    const laborColumns = [ // 인건비
        { header: "품목그룹명", col: "poiTitle", cellWidth: "20%", type: "select", options:[]},
        { header: "연월", col: "poiNm", cellWidth: "10%", type: "input"},
        { header: "M/M계", col: "poiCode", cellWidth: "10%", type: "input"},
        { header: "인건비계", col: "poiBeginDt1", cellWidth: "10%", type: "input"},
        { header: "특급기술사", col: "poiBeginDt2", cellWidth: "10%", type: "input"},
        { header: "고급기술사", col: "poiBeginDt3", cellWidth: "10%", type: "input"},
        { header: "중급기술사", col: "poiBeginDt4", cellWidth: "10%", type: "input"},
        { header: "초급기술사", col: "poiBeginDt5", cellWidth: "10%", type: "input"},
        { header: "중급기술사", col: "poiBeginDt6", cellWidth: "10%", type: "input"},
        { header: "고급기능사", col: "poiBeginDt7", cellWidth: "10%", type: "input"},
    ];
    const expensesColumns = [ // 경비
        {
            header: "경비목록", col: "poiTitle", cellWidth: "25%", type: "select",
            options:[
                {value: 'EXPNS01', label: '교통비'},
                {value: 'EXPNS02', label: '숙박비'},
                {value: 'EXPNS03', label: '일비/파견비'},
                {value: 'EXPNS04', label: '식비'},
                {value: 'EXPNS05', label: '자재/소모품외'},
                {value: 'EXPNS06', label: '영업비'},
            ]   
        },
        { header: "비고", col: "poiTitle2", cellWidth: "50%", type: "input"},
        { header: "금액", col: "poiTitle3", cellWidth: "25%", type: "input"},
    ];
    const purchaseColumns = [
        // 구매비
        {
            header: "품목그룹명",
            col: "poiTitle",
            cellWidth: "20%",
            type: "input",
        },
        { header: "품명", col: "poiTitle1", cellWidth: "20%", type: "input" },
        { header: "규격", col: "poiTitle2", cellWidth: "20%", type: "input" },
        { header: "수량", col: "poiTitle3", cellWidth: "10%", type: "input" },
        { header: "단위", col: "poiTitle4", cellWidth: "10%", type: "input" },
        {
            header: "소비자\n단가",
            col: "poiTitle5",
            cellWidth: "14%",
            type: "input",
        },
        {
            header: "소비자\n금액",
            col: "poiTitle6",
            cellWidth: "14%",
            type: "input",
        },
        { header: "단가", col: "poiTitle7", cellWidth: "10%", type: "input" },
        { header: "금액", col: "poiTitle8", cellWidth: "10%", type: "input" },
        { header: "제조사", col: "poiTitle9", cellWidth: "12%", type: "input" },
        { header: "금액", col: "poiTitle11", cellWidth: "10%", type: "input" },
        {
            header: "제조사",
            col: "poiTitle12",
            cellWidth: "12%",
            type: "input",
        },
        { header: "비고", col: "poiTitle13", cellWidth: "20%", type: "input" },
        {
            header: "원단가",
            col: "poiTitle111",
            cellWidth: "12%",
            type: "input",
        },
        { header: "원가", col: "poiTitle15", cellWidth: "10%", type: "input" },
        {
            header: "이익금",
            col: "poiTitle16",
            cellWidth: "12%",
            type: "input",
        },
        {
            header: "이익률",
            col: "poiTitle17",
            cellWidth: "12%",
            type: "input",
        },
        {
            header: "기준\n이익률",
            col: "poiTitle88",
            cellWidth: "15%",
            type: "input",
        },
        {
            header: "소비자가\n산출률",
            col: "poiTitle99",
            cellWidth: "15%",
            type: "input",
        },
    ];
    const companyProfitColumns = [
        // 기업이윤
        { header: "금액", col: "poiTitle1", cellWidth: "50%", type: "input" },
        { header: "비고", col: "poiTitle2", cellWidth: "50%", type: "input" },
    ];
    const generalExpensesColumns = [
        // 일반관리비
        { header: "금액", col: "poiTitle1", cellWidth: "50%", type: "input" },
        { header: "비고", col: "poiTitle2", cellWidth: "50%", type: "input" },
    ];
    const negoColumns = [
        // 네고
        { header: "금액", col: "poiTitle1", cellWidth: "50%", type: "input" },
        { header: "비고", col: "poiTitle2", cellWidth: "50%", type: "input" },
    ];

    const [currentTask, setCurrentTask] = useState("");
    const [prmnPlanDatas, setPrmnPlanDatas] = useState([]); // 인건비
    const [pjbudgetDatas, setPjbudgetDatas] = useState([]); // 경비
    const [pdOrdrDatas, setPdOrdrDatas] = useState([]); // 구매(재료비)

    const chageTabs = (task) => {
        setCurrentTask(task);
        if (task !== currentTask) {
            //자신 일때 수정 창으로 변동 되지 않기 위한 조건
            setIsSaveFormTable(true);
        }
    };

    useEffect(() => {
        if(currentTask === '인건비') {
            setPrmnPlanDatas(fetchAllData('/cost/costPrmnPlan')); // 인건비
        } else if(currentTask === '경비') {
            setPjbudgetDatas(fetchAllData('/cost/costPjbudget/type')); // 경비
        } else if(currentTask === '구매(재료비)') {
            setPdOrdrDatas(fetchAllData('/cost/costPdOrdr')); // 구매(재료비)
        }
    }, [projectInfo.poiId]);

    const fetchAllData = async (tableUrl) => {
            const url = `/api${tableUrl}/listAll.do`;
            let requestData = {poiId: projectInfo.poiId};

            if(tableUrl === '/cost/costPjbudget/type') { //requestData 값 담기
                requestData = { poiId: projectInfo.poiId, pjbgModeCode: "slsp", };
            }

            const resultData = await axiosFetch(url, requestData);
            if (resultData) {
                return resultData;
            } else {
                return Array(5).fill({}); // 빈 배열 보내주기
            }
    };

    return (
        <>
            <Location pathList={locationPath.OrderPlanMgmt} />
            <div className="common_board_style mini_board_1">
                <ul className="tab">
                    <li onClick={() => chageTabs("인건비")}><a href="#인건비" className="on">인건비</a></li>
                    <li onClick={() => chageTabs("경비")}><a href="#경비">경비</a></li>
                    <li onClick={() => chageTabs("구매(재료비)")}><a href="#구매(재료비)">구매(재료비)</a></li>
                    {/* <li onClick={() => chageTabs("기업이윤")}><a href="#기업이윤">기업이윤</a></li> */}
                    {/* <li onClick={() => chageTabs("일반관리비")}><a href="#일반관리비">일반관리비</a></li>
                    <li onClick={() => chageTabs("네고")}><a href="#네고">네고</a></li> */}
                </ul>

                <div className="list">
                    <div className="first">
                        <ul>
                            <ApprovalForm title={currentTask + " 계획 등록"}>
                                <ReactDataTable
                                    columns={laborColumns}
                                    flag={currentTask === '인건비' && isSaveFormTable}
                                    tableRef={orderPlanMgmtTable1}
                                    customDatas={prmnPlanDatas}
                                />
                            </ApprovalForm>
                        </ul>
                    </div>
                    <div className="second">
                        <ul>
                            <ApprovalForm title={currentTask + " 계획 등록"}>
                                <ReactDataTable
                                    columns={expensesColumns}
                                    flag={currentTask === '경비' && isSaveFormTable}
                                    tableRef={orderPlanMgmtTable2}
                                    customDatas={pjbudgetDatas}
                                />
                            </ApprovalForm>
                        </ul>
                    </div>

                    <div className="third">
                        <ul>
                            <ApprovalForm title={currentTask + " 계획 등록"}>
                                <ReactDataTable
                                    columns={purchaseColumns}
                                    flag={currentTask === '구매(재료비)' && isSaveFormTable}
                                    tableRef={orderPlanMgmtTable3}
                                    customDatas={pdOrdrDatas}
                                />
                            </ApprovalForm>
                        </ul>
                    </div>

                    {/* <div className="fourth">
                        <ul>
                            <ApprovalForm title={currentTask + " 계획 등록"}>
                                <ReactDataTable
                                    columns={companyProfitColumns}
                                    singleUrl="/baseInfrm/product/pjOrdrInfo"
                                    flag={currentTask === '기업이윤' && isSaveFormTable}
                                    tableRef={orderPlanMgmtTable4}
                                />
                            </ApprovalForm>
                        </ul>
                    </div> */}

                    {/* <div className="fifth">
                        <ul>
                            <ApprovalForm title={currentTask + " 계획 등록"}>
                                <ReactDataTable
                                    columns={generalExpensesColumns}
                                    singleUrl="/baseInfrm/product/pjOrdrInfo"
                                    flag={currentTask === '일반관리비' && isSaveFormTable}
                                    tableRef={orderPlanMgmtTable5}
                                />
                            </ApprovalForm>
                        </ul>
                    </div>

                    <div className="sixth">
                        <ul>
                            <ApprovalForm title={currentTask + " 계획 등록"}>
                                <ReactDataTable
                                    columns={negoColumns}
                                    suffixUrl="/baseInfrm/product/pjOrdrInfo"
                                    flag={currentTask === '네고' && isSaveFormTable}
                                    tableRef={orderPlanMgmtTable6}
                                />
                            </ApprovalForm>
                        </ul>
                    </div> */}
                </div>
            </div>
        </>
    );
}

export default OrderPlanMgmt;
