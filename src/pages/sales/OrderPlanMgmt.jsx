import React, { useContext, useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import ApprovalForm from "components/form/ApprovalForm";
import ReactDataTable from "components/DataTable/ReactDataTable";
import { PageContext } from "components/PageProvider";
import { locationPath } from "constants/locationPath";
import { axiosFetch } from "api/axiosFetch";

/** 영업관리-수주계획관리 */
function OrderPlanMgmt() {
    const { isSaveFormTable, setIsSaveFormTable, projectInfo, setProjectInfo } =
        useContext(PageContext);

    useEffect(() => {
        return () => {
            setProjectInfo({});
        };
    }, []);

    const orderPlanMgmtTable1 = useRef(null);
    const orderPlanMgmtTable2 = useRef(null);
    const orderPlanMgmtTable3 = useRef(null);
    const orderPlanMgmtTable4 = useRef(null);
    const orderPlanMgmtTable5 = useRef(null);
    const orderPlanMgmtTable6 = useRef(null);

    const laborColumns = [
        // 인건비
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
            header: "중급기술사",
            col: "pmpmmNum5",
            cellWidth: "10%",
            type: "input",
        },
        {
            header: "고급기능사",
            col: "pmpmmNum6",
            cellWidth: "10%",
            type: "input",
        },
    ];
    const expensesColumns = [
        // 경비
        {
            header: "경비목록",
            col: "poiTitle",
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
    ];
    const purchaseColumns = [
        // 구매비
        {
            header: "품목그룹명",
            col: "pgNm",
            cellWidth: "20%",
            type: "input",
        },
        { header: "품명", col: "pdiNm", cellWidth: "20%", type: "input" },
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
        { header: "금액", col: "pdiDesc1", cellWidth: "10%", type: "input" },
        {
            header: "제조사",
            col: "poiTitle12",
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

    const [currentTask, setCurrentTask] = useState("인건비");
    const [prmnPlanDatas, setPrmnPlanDatas] = useState([]); // 인건비
    const [pjbudgetDatas, setPjbudgetDatas] = useState([]); // 경비
    const [pdOrdrDatas, setPdOrdrDatas] = useState([]); // 구매(재료비)

    const groupedData = {}; //인건비 바꿔서 넣어줄 빈 객체

    const changePrmnPlanData = (data) => {
        // 포지션에 대한 고정된 번호를 매핑하는 객체 생성
        const positionMapping = {
            특급기술사: 1,
            고급기술사: 2,
            중급기술사: 3,
            초급기술사: 4,
            고급기능사: 5,
            중급기능사: 6,
            부장: 7,
            차장: 8,
            과장: 9,
            대리: 10,
            주임: 11,
            사원: 12,
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
        setPrmnPlanDatas(transformedData);
        console.log(transformedData, "변환되고나서의 값을보여줌");
    };

    //const changepjbudgetData = (value, options) => {
    //    console.log(value, options, "@@@@@@@@@@@@@@@@@@@@@@@#@#@");
    //    const option = options.find((opt) => opt.value === value);
    //    return option ? option.label : value; // 찾은 옵션의 label을 반환하거나 value 그대로 반환
    //};

    const chageTabs = (task) => {
        setCurrentTask(task);
        if (task !== currentTask) {
            //자신 일때 수정 창으로 변동 되지 않기 위한 조건
            setIsSaveFormTable(true);
        }
    };

    console.log(projectInfo.poiId);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (currentTask === "인건비") {
                    const data = await fetchAllData("/cost/costPrmnPlan"); // 인건비
                    console.log(data, "불러온 인건비의 값은?");
                    changePrmnPlanData(data);
                } else if (currentTask === "경비") {
                    const data = await fetchAllData("/cost/costPjbudget/type"); // 경비
                    setPjbudgetDatas(data);
                    //.map((item) => ({
                    //    ...item,
                    //    pjbgTypeCode: changepjbudgetData(
                    //        //영업 slsp만 추출
                    //        item.pjbgTypeCode,
                    //        expensesColumns[0].options
                    //    ),
                    //}))
                } else if (currentTask === "구매(재료비)") {
                    const data = await fetchAllData("/cost/costPdOrdr"); // 구매(재료비)
                    setPdOrdrDatas(data);
                }
            } catch (error) {
                console.error("데이터를 가져오는 중에 오류 발생:", error);
            }
        };

        fetchData(); // fetchData 함수를 호출하여 데이터를 가져옵니다.
    }, [projectInfo.poiId, currentTask]);

    console.log(projectInfo.poiId);

    const fetchAllData = async (tableUrl) => {
        const url = `/api${tableUrl}/listAll.do`;
        let requestData = { poiId: projectInfo.poiId };
        console.log(tableUrl, "받아온주소");
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

    console.log(prmnPlanDatas, "인건비");
    console.log(pjbudgetDatas, "경비");
    console.log(pdOrdrDatas, "구매(재료비");

    return (
        <>
            <Location pathList={locationPath.OrderPlanMgmt} />
            <div className="common_board_style mini_board_1">
                <ul className="tab">
                    <li onClick={() => chageTabs("인건비")}>
                        <a href="#인건비" className="on">
                            인건비
                        </a>
                    </li>
                    <li onClick={() => chageTabs("경비")}>
                        <a href="#경비">경비</a>
                    </li>
                    <li onClick={() => chageTabs("구매(재료비)")}>
                        <a href="#구매(재료비)">구매(재료비)</a>
                    </li>
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
                                    flag={
                                        currentTask === "인건비" &&
                                        isSaveFormTable
                                    }
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
                                    flag={
                                        currentTask === "경비" &&
                                        isSaveFormTable
                                    }
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
                                    flag={
                                        currentTask === "구매(재료비)" &&
                                        isSaveFormTable
                                    }
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
