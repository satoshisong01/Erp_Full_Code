import React, { useState, useEffect, useRef } from "react";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-dt/js/dataTables.dataTables";
import { axiosPostFetch } from "api/axiosFetch";
import BasicDataTable from "components/DataTable/BasicDataTable";

const BusiCalculateDoc = () => {
    const coreTable = useRef(null); // 손익계산서 테이블
    const purchasingTable = useRef(null); // 구매재료비 테이블
    const chargeTable = useRef(null); // 경비테이블
    const outsourcingTable = useRef(null); // 외주 테이블
    const laborTable = useRef(null); // 인건비 테이블

    const [coreTableData, setCoreTableData] = useState([{ data: [], className: [] }]); //손익계산서 데이터
    const [purchasingTableData, setPurchasingTableData] = useState([{ data: [], className: [] }]); //구매재료비
    const [chargeTableData, setChargeTableData] = useState([{ data: [], className: [] }]); //경비
    const [outTableData, setOutTableData] = useState([{ data: [], className: [] }]); //외주 데이터
    const [laborTableData, setLaborTableData] = useState([{ data: [], className: [] }]); //인건비

    const purStyle = { marginBottom: 20, maxHeight: 250 }
    const chargeStyle = { maxHeight: 860 }

    useEffect(() => {
        getInitData(); // 종합집계표 데이터 가져오기
    }, []);

    const coreColumns = [
        { header: "구분", col: "item", className: "flex-col-2" },
        { header: "전체", col: "total", className: "flex-col-2" },
        { header: "자체용역", col: "inHouse", className: "flex-col-2" },
        { header: "%", col: "inHousePercent", className: "flex-col-1" },
        { header: "외주", col: "outSourcing", className: "flex-col-2" },
        { header: "%", col: "outSourcingPercent", className: "flex-col-1" },
        { header: "H/W 및 S/W", col: "purchasing", className: "flex-col-2" },
        { header: "%", col: "purchasingPercent", className: "flex-col-1" },
        { header: "판관비", col: "overhead", className: "flex-col-2" },
        { header: "NEGO", col: "nego", className: "flex-col-2" },
    ];

    const purchasingColumns = [
        { header: "품목", col: "item", className: "flex-col-2" },
        { header: "일반/도입", col: "type", className: "flex-col-2" },
        { header: "금액", col: "amount", className: "flex-col-2" },
    ];
    const outsourcingColumns = [
        { header: "회사", col: "company", className: "flex-col-2" },
        { header: "턴키/MM", col: "mm", className: "flex-col-2" },
        { header: "금액", col: "amount", className: "flex-col-2" },
    ];
    const laborColumns = [
        { header: "M/M", col: "mm", className: "flex-col-2" },
        { header: "금액", col: "amount", className: "flex-col-2" },
    ];
    const chargeColumns = [
        { header: "구분", col: "item", className: "flex-col-2" },
        { header: "산출근거", col: "remarks", className: "flex-col-4" },
        { header: "금액", col: "amount", className: "flex-col-2" },
    ];

    const getInitData = async () => {
        // const url = "";
        // const requestData = {};
        // const resultData = await axiosPostFetch(url, requestData);
        // const {
        //     salesBudgetLabor,
        //     salesBudgetOut,
        //     salesBudgetPurchase,
        //     sellingMarketings,
        //     nego,
        //     excOutPurchase,
        //     excOutLabor,
        //     purchaseList,
        //     outsourcingList,
        //     labor,
        //     chargeList,
        //     costIndicator,
        // } = resultData;

        /* 더미데이터 */
        const salesBudgetIn = 110260622; // 수주액>자체용역
        const salesBudgetOut = 300000; // 수주액>외주
        const salesBudgetHS = 25452010; // 수주액>H/W및S/W
        const sellingMarketings = 21035458; // 수주액>판관비
        const nego = 4700000; // 수주액>네고
        const excOutPurchase = 100000; // 재료비>외주
        const excOutLabor = 650000; // 인건비>외주
        const costIndicator = [ //사전원가지표: 원가(CB_PER), 원가명(CB_NAME), 분류코드(CB_TYPE_CODE)
            { CB_TYPE_CODE: '간접원가', CB_PER: 20.0, CB_NAME: '자체용역' },
            { CB_TYPE_CODE: '간접원가', CB_PER: 20.0, CB_NAME: '외주' },
            { CB_TYPE_CODE: '간접원가', CB_PER: 20.0, CB_NAME: 'H/W및S/W' },
            { CB_TYPE_CODE: '판매비', CB_PER: 5.0, CB_NAME: '자체용역' },
            { CB_TYPE_CODE: '판매비', CB_PER: 5.0, CB_NAME: '외주' },
            { CB_TYPE_CODE: '판매비', CB_PER: 5.0, CB_NAME: 'H/W및S/W' },
            { CB_TYPE_CODE: '사내본사비', CB_PER: 8.0, CB_NAME: '자체용역' },
            { CB_TYPE_CODE: '사내본사비', CB_PER: 8.0, CB_NAME: '외주' },
            { CB_TYPE_CODE: '사내본사비', CB_PER: 8.0, CB_NAME: 'H/W및S/W' },
            { CB_TYPE_CODE: '일반관리비', CB_PER: 8.0, CB_NAME: '자체용역' },
            { CB_TYPE_CODE: '일반관리비', CB_PER: 8.0, CB_NAME: '외주' },
            { CB_TYPE_CODE: '일반관리비', CB_PER: 8.0, CB_NAME: 'H/W및S/W' },
            { CB_TYPE_CODE: '영업외수지', CB_PER: 3.0, CB_NAME: '자체용역' },
            { CB_TYPE_CODE: '영업외수지', CB_PER: 3.0, CB_NAME: '외주' },
            { CB_TYPE_CODE: '영업외수지', CB_PER: 3.0, CB_NAME: 'H/W및S/W' },
        ];

        const purchaseList = [{ item: '구매자재', type: '일반', amount: 9063540 }]; // 구매내역 리스트
        const outsourcingList = [{ company: 'A회사', mm: '', amount: 0 }]; // 외주내역 리스트
        const labor = { mm: '5.0', amount: 4410000 }; // 인건비내역 오브젝트
        const chargeList = [ // 경비내역 리스트
            { item: '인건비성복후비', remarks: '자동계산 (사용경비가 아님)', amount: 14340 },
            { item: '국내출장비', remarks: '일비+잔업비', amount: 3234000 },
            { item: '시내교통비', remarks: '주유비+주차비+톨비+마일리지', amount: 61600 },
            { item: 'PJT 파견비', remarks: '', amount: 0 },
            { item: '사무실임대료', remarks: '', amount: 6447900 },
            { item: '소모품비', remarks: '', amount: 174853 },
            { item: '행사비', remarks: '', amount: 0 },
            { item: '요식성경비', remarks: '', amount: 261900 },
            { item: '전산소모품비', remarks: '', amount: 0 },
            { item: '도서인쇄비', remarks: '', amount: 0 },
            { item: '통신비', remarks: '', amount: 0 },
            { item: '해외출장비', remarks: '', amount: 0 },
        ];

        let purchaseListAmount = 0;
        let outListAmount = 0;
        let chargeListAmount = 0;

        /* 구매재료비 테이블 데이터 */
        const updatedPurchasingData = purchaseList.map(item => {
            purchaseListAmount += item.amount;
            return {
                data: [item.item, item.type, item.amount],
                className: ['', '', '']
            };
        });
        const purTotalRow = {
            data: ['합계', '', purchaseListAmount],
            className: ['point line-t', 'line-t', 'line-t']
        };
        setPurchasingTableData([...updatedPurchasingData, purTotalRow]);

        /* 경비 테이블 데이터 */
        const updatedChargeData = chargeList.map(item => {
            chargeListAmount += item.amount;
            return {
                data: [item.item, item.remarks, item.amount],
                className: ['', '', '']
            };
        });
        const charTotalRow = {
            data: ['합계', '', chargeListAmount],
            className: ['point line-t', 'line-t', 'line-t']
        };
        setChargeTableData([...updatedChargeData, charTotalRow]);

        /* 외주비 테이블 데이터 */
        const updatedOutData = outsourcingList.map(item => {
            outListAmount += item.amount;
            return {
                data: [item.company, item.mm, item.amount],
                className: ['', '', '']
            };
        });
        const outTotalRow = {
            data: ['합계', '', outListAmount],
            className: ['point line-t', 'line-t', 'line-t']
        };
        setOutTableData([...updatedOutData, outTotalRow]);

        /* 인건비 테이블 데이터 */
        setLaborTableData([{
            data: [labor.mm, labor.amount],
            className: ['', '']
        }])

        /* 원가지표 */
        let idInPer = 0; // 간접원가>자체용역 %
        let idOutPer = 0; // 간접원가>외주 %
        let idHSPer = 0; // 간접원가>H/W및S/W %

        let genInPer = 0; // 일반관리비>자체용역 %
        let genOutPer = 0; // 일반관리비>외주 %
        let genHSPer = 0; // 일반관리비>H/W및S/W %

        let selInPer = 0; // 판매비>자체용역 %
        let corpInPer = 0; // 사내본사비>자체용역 %
        let nonInPer = 0; // 영업외수지>자체용역 %

        costIndicator.map((item) => {
            if (item.CB_TYPE_CODE === '간접원가') {
                if (item.CB_NAME === '자체용역') {
                    idInPer = item.CB_PER;
                } else if (item.CB_NAME === '외주') {
                    idOutPer = item.CB_PER;
                } else if (item.CB_NAME === 'H/W및S/W') {
                    idHSPer = item.CB_PER;
                }
            }
            if (item.CB_TYPE_CODE === '일반관리비') {
                if (item.CB_NAME === '자체용역') {
                    genInPer = item.CB_PER;
                } else if (item.CB_NAME === '외주') {
                    genOutPer = item.CB_PER;
                } else if (item.CB_NAME === 'H/W및S/W') {
                    genHSPer = item.CB_PER;
                }
            }
            if (item.CB_NAME === '자체용역') {
                if (item.CB_TYPE_CODE === '판매비') {
                    selInPer = item.CB_PER;
                } else if (item.CB_TYPE_CODE === '사내본사비') {
                    corpInPer = item.CB_PER;
                } else if (item.CB_TYPE_CODE === '영업외수지') {
                    nonInPer = item.CB_PER;
                }
            }

        })

        const salesOrderTotal = (salesBudgetIn + salesBudgetOut + salesBudgetHS + sellingMarketings) - nego; // 수주액 row 합
        const purchaseTotal = excOutPurchase + purchaseListAmount; // 재료비 row 합합
        const laborTotal = labor.amount + excOutLabor; // 인건비 row 합
        const chargeTotal = chargeListAmount; // 경비 row 합
        const exeInCost = labor.amount + chargeListAmount; // 직접원가>자체용역
        const exeOutCost = excOutPurchase + excOutLabor; // 직접원가>외주 //exeOutCost와 outListAmount의 결과값이 같아야 함
        const exePurCost = purchaseListAmount; // 직접원가>H/W및S/W
        const exeCostTotal = purchaseTotal + laborTotal + chargeTotal; // 직접원가>전체
        const exeMarginalIn = salesBudgetIn - exeInCost; // 실한계이익>자체용역
        const exeMarginalOut = salesBudgetOut - exeOutCost; // 실한계이익>외주
        const exeMarginalHS = salesBudgetHS - exePurCost;// 실한계이익>H/W및S/W
        const exeMarginalTotal = salesOrderTotal - exeCostTotal; // 실한계이익>전체
        const materialCostIn = 0;// 사내재료비>자체용역
        const materialCostOut = 0;// 사내재료비>외주
        const materialCostHS = 0;// 사내재료비>H/W및S/W
        const materialCostTotal = 0;// 사내재료비>전체
        const marginalIn = exeMarginalIn - materialCostIn; // 한계이익>자체용역
        const marginalOut = exeMarginalOut - materialCostOut; // 한계이익>외주
        const marginalHS = exeMarginalHS - materialCostHS; // 한계이익>H/W및S/W
        const marginalTotal = exeMarginalTotal - materialCostTotal; // 한계이익>전체
        const indirectIn = labor.amount * idInPer/100; // 간접원가>자체용역
        const indirectOut = excOutLabor * idOutPer/100; // 간접원가>외주
        const indirectHS = purchaseListAmount * idHSPer/100; // 간접원가>H/W및S/W
        const indirectCost = indirectIn + indirectOut + indirectHS; // 간접원가>전체
        const grossProfitIn = marginalIn - indirectIn; // 매출이익>자체용역
        const grossProfitOut = marginalOut - indirectOut; // 매출이익>외주
        const grossProfitHS = marginalHS - indirectHS; // 매출이익>H/W및S/W
        const grossProfitTotal = marginalTotal - indirectCost; // 매출이익>전체
        const sellingIn = labor.amount * selInPer/100; // 판매비>자체용역
        const sellingTotal = sellingIn; // 판매비>전체
        const corpIn = labor.amount * corpInPer/100; // 사내본사비>자체용역
        const corpHQTotal = corpIn; // 사내본사비>전체
        const genAdminIn = labor.amount * genInPer/100; // 일반관리비>자체용역
        const genOut = excOutLabor * genOutPer/100; // 일반관리비>외주
        const genHS = purchaseListAmount * genHSPer/100; // 일반관리비>H/W및S/W
        const genAdminTotal = genAdminIn + genOut + genHS; // 일반관리비>전체
        const operProfitIn = grossProfitIn - (sellingIn + corpIn + genAdminIn); // 영업이익>자체용역
        const operProfitOut = grossProfitOut - genOut; // 영업이익>외주
        const operProfitHS = grossProfitHS-genHS; // 영업이익>H/W및S/W
        const operProfitTotal = grossProfitTotal - (sellingTotal + corpHQTotal + genAdminTotal); // 영업이익>전체
        const nonIn = labor.amount * nonInPer/100; //영업외수지>자체용역
        const nonOperIncTotal = nonIn; //영업외수지>전체
        const ordIncIn = (operProfitIn-nonIn); // 경상이익>자체용역
        const ordIncOut = operProfitOut; // 경상이익>외주
        const ordIncHS = operProfitHS; // 경상이익>H/W및S/W
        const ordIncTotal = operProfitTotal - nonOperIncTotal; // 경상이익>전체
        const mmUnitPriceIn = (salesBudgetIn-chargeListAmount)/labor.mm; // MM단가>자체용역
        const mmUnitPriceTotal = mmUnitPriceIn; // MM단가>전체

        const dataItems = [
            {
                variable: 'salesOrderTotal',
                operation: (a, b, c, d) => (a + b + c + d)-nego,
                values: [salesBudgetIn, salesBudgetOut, salesBudgetHS, sellingMarketings],
            },
            {
                variable: 'purchaseTotal',
                operation: (a, b) => (a + b),
                values: [excOutPurchase, purchaseListAmount],
            },
            {
                variable: 'laborTotal',
                operation: (a, b) => (a + b),
                values: [labor.amount, excOutLabor],
            },
            {
                variable: 'chargeTotal',
                operation: (a) => a,
                values: [chargeListAmount],
            },
            {
                variable: 'exeInCost',
                operation: (a, b) => (a + b),
                values: [labor.amount, chargeListAmount],
            },
            {
                variable: 'exeOutCost',
                operation: (a, b) => (a + b),
                values: [excOutPurchase, excOutLabor],
            },
            {
                variable: 'exePurCost',
                operation: (a) => a,
                values: [purchaseListAmount],
            },
            {
                variable: 'exeCostTotal',
                operation: (a, b, c) => (a + b + c),
                values: [purchaseTotal, laborTotal, chargeTotal],
            },
            {
                variable: 'exeMarginalIn',
                operation: (a, b) => (a - b),
                values: [salesBudgetIn, exeInCost],
            },
            {
                variable: 'exeMarginalOut',
                operation: (a, b) => (a - b),
                values: [salesBudgetOut, exeOutCost],
            },
            {
                variable: 'exeMarginalHS',
                operation: (a, b) => (a - b),
                values: [salesBudgetHS, exePurCost],
            },
            {
                variable: 'exeMarginalTotal',
                operation: (a, b) => (a - b),
                values: [salesOrderTotal, exeCostTotal],
            },
            {
                variable: 'materialCostIn',
                operation: (a) => a,
                values: [0],
            },
            {
                variable: 'materialCostOut',
                operation: (a) => a,
                values: [0],
            },
            {
                variable: 'materialCostHS',
                operation: (a) => a,
                values: [0],
            },
            {
                variable: 'materialCostTotal',
                operation: (a) => a,
                values: [0],
            },
            {
                variable: 'marginalIn',
                operation: (a, b) => (a - b),
                values: [exeMarginalIn, materialCostIn],
            },
            {
                variable: 'marginalOut',
                operation: (a, b) => (a - b),
                values: [exeMarginalOut, materialCostOut],
            },
            {
                variable: 'marginalHS',
                operation: (a, b) => (a - b),
                values: [exeMarginalHS, materialCostHS],
            },
            {
                variable: 'marginalTotal',
                operation: (a, b) => (a - b),
                values: [exeMarginalTotal, materialCostTotal],
            },
            {
                variable: 'indirectIn',
                operation: (a, b) => (a * (b / 100)),
                values: [labor.amount, idInPer],
            },
            {
                variable: 'indirectOut',
                operation: (a, b) => (a * (b / 100)),
                values: [excOutLabor, idOutPer],
            },
            {
                variable: 'indirectHS',
                operation: (a, b) => (a * (b / 100)),
                values: [purchaseListAmount, idHSPer],
            },
            {
                variable: 'indirectCost',
                operation: (a, b, c) => (a + b + c),
                values: [indirectIn, indirectOut, indirectHS],
            },
            {
                variable: 'grossProfitIn',
                operation: (a, b) => (a - b),
                values: [marginalIn, indirectIn],
            },
            {
                variable: 'grossProfitOut',
                operation: (a, b) => (a - b),
                values: [marginalOut, indirectOut],
            },
            {
                variable: 'grossProfitHS',
                operation: (a, b) => (a - b),
                values: [marginalHS, indirectHS],
            },
            {
                variable: 'grossProfitTotal',
                operation: (a, b) => (a - b),
                values: [marginalTotal, indirectCost],
            },
            {
                variable: 'sellingIn',
                operation: (a, b) => (a * (b / 100)),
                values: [labor.amount, selInPer],
            },
            {
                variable: 'sellingTotal',
                operation: (a) => a,
                values: [sellingIn],
            },
            {
                variable: 'corpIn',
                operation: (a, b) => (a * (b / 100)),
                values: [labor.amount, corpInPer],
            },
            {
                variable: 'corpHQTotal',
                operation: (a) => a,
                values: [corpIn],
            },
            {
                variable: 'genAdminIn',
                operation: (a, b) => (a * (b / 100)),
                values: [labor.amount, genInPer],
            },
            {
                variable: 'genOut',
                operation: (a, b) => (a * (b / 100)),
                values: [excOutLabor, genOutPer],
            },
            {
                variable: 'genHS',
                operation: (a, b) => (a * (b / 100)),
                values: [purchaseListAmount, genHSPer],
            },
            {
                variable: 'genAdminTotal',
                operation: (a, b, c) => (a + b + c),
                values: [genAdminIn, genOut, genHS],
            },
            {
                variable: 'operProfitIn',
                operation: (a, b, c) => (a - (b + c)),
                values: [grossProfitIn, sellingIn, corpIn, genAdminIn],
            },
            {
                variable: 'operProfitOut',
                operation: (a, b) => (a - b),
                values: [grossProfitOut, genOut],
            },
            {
                variable: 'operProfitHS',
                operation: (a, b) => (a - b),
                values: [grossProfitHS, genHS],
            },
            {
                variable: 'operProfitTotal',
                operation: (a, b, c, d) => (a - (b + c + d)),
                values: [grossProfitTotal, sellingTotal, corpHQTotal, genAdminTotal]
            },
            {
                variable: 'nonIn',
                operation: (a, b) => (a * (b / 100)),
                values: [labor.amount, nonInPer],
            },
            {
                variable: 'nonOperIncTotal',
                operation: (a) => a,
                values: [nonIn],
            },
            {
                variable: 'ordIncIn',
                operation: (a, b) => (a - b),
                values: [operProfitIn, nonIn],
            },
            {
                variable: 'ordIncOut',
                operation: (a) => a,
                values: [operProfitOut],
            },
            {
                variable: 'ordIncHS',
                operation: (a) => a,
                values: [operProfitHS],
            },
            {
                variable: 'ordIncTotal',
                operation: (a, b) => (a - b),
                values: [operProfitTotal, nonOperIncTotal],
            },
            {
                variable: 'mmUnitPriceIn',
                operation: (a, b) => ((a - b) / labor.mm ),
                values: [salesBudgetIn, chargeListAmount],
            },
            {
                variable: 'mmUnitPriceTotal',
                operation: (a) => a,
                values: [mmUnitPriceIn],
            },
        ]
        
        const formattedValue = {};

        dataItems.forEach(item => {
            const { variable, operation, values } = item;
            let result = values[0];
            if (operation && values) {
                    result = operation(...values); // 이전 결과값과 현재 value로 operation 실행
                    const results = result.toLocaleString(undefined, { maximumFractionDigits: 0 });
                    formattedValue[variable] = results;
            }
        });

        console.log("⭕ results: ", formattedValue);


        /* 손익계산서 테이블 데이터 */
        setCoreTableData([
            {
                data: ['수주액', formattedValue.salesOrderTotal, salesBudgetIn, '', salesBudgetOut, '', salesBudgetHS, '', sellingMarketings, nego],
                className: ['point', 'b-highlight', '', 'b-gray', '', 'b-gray', '', 'b-gray', '', ''],
            },
            {
                data: ['재료비', formattedValue.purchaseTotal, '', '', excOutPurchase, '', purchaseListAmount, '', '', ''],
                className: ['point', 'b-highlight', 'b-gray', 'b-gray', '', 'b-gray', '', 'b-gray', 'b-gray', 'b-gray'],
            },
            {
                data: ['인건비', formattedValue.laborTotal, labor.amount, '', excOutLabor, '', '', '', '', ''],
                className: ['point', 'b-highlight', '', 'b-gray', '', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray'],
            },
            {
                data: ['경비', formattedValue.chargeTotal, chargeListAmount, '', '', '', '', '', '', ''],
                className: ['point', 'b-highlight', '', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray'],
            },
            {
                data: ['직접원가', formattedValue.exeCostTotal, formattedValue.exeInCost, '', formattedValue.exeOutCost, '', formattedValue.exePurCost, '', '', ''],
                className: ['col-header', 'col-header', 'col-header', 'col-header', 'col-header', 'col-header', 'col-header', 'col-header', 'col-header', 'col-header'],
            },
            {
                data: ['실한계이익', exeMarginalTotal, exeMarginalIn, '', exeMarginalOut, '', exeMarginalHS, '', '', ''],
                className: ['point', ' ', ' ', 'b-gray', '', 'b-gray', '', 'b-gray', 'b-gray', 'b-gray'],
            },
            {
                data: ['(실한계이익률)', ((exeMarginalTotal / salesOrderTotal) * 100).toFixed(1) + '%', ((exeMarginalIn / salesBudgetIn) * 100).toFixed(1) + '%', '', ((exeMarginalOut / salesBudgetOut) * 100).toFixed(1) + '%', '', ((exeMarginalHS / salesBudgetHS) * 100).toFixed(1) + '%', '', '', ''],
                className: ['point', '', '', 'b-gray', '', 'b-gray', '', 'b-gray', 'b-gray', 'b-gray'],
            },
            {
                data: ['사내재료비', materialCostTotal, '', '', '', '', '', '', '', ''],
                className: ['b-lightblue text-primary point', 'b-highlight', '', 'b-gray', '', 'b-gray', '', 'b-gray', 'b-gray', 'b-gray'],
            },
            {
                data: ['한계이익', marginalTotal, marginalIn, '', marginalOut, '', marginalHS, '', '', ''],
                className: ['point', '', '', 'b-gray', '', 'b-gray', '', 'b-gray', 'b-gray', 'b-gray'],
            },
            {
                data: ['(한계이익률)', ((marginalTotal / salesOrderTotal) * 100).toFixed(1) + '%', ((marginalIn / salesBudgetIn) * 100).toFixed(1) + '%', '', ((marginalOut / salesBudgetOut) * 100).toFixed(1) + '%', '', ((marginalHS / salesBudgetHS) * 100).toFixed(1) + '%', '', '', ''],
                className: ['point', '', '', 'b-gray', '', 'b-gray', '', 'b-gray', 'b-gray', 'b-gray'],
            },
            {
                data: ['간접원가', indirectCost, indirectIn, idInPer+'%', indirectOut, idOutPer+'%', indirectHS, idHSPer+'%', '', ''],
                className: ['b-lightblue point', 'b-highlight', '', '', '', '', '', '', 'b-gray', 'b-gray'],
            },
            {
                data: ['매출이익', grossProfitTotal, grossProfitIn, '', grossProfitOut, '', grossProfitHS, '', '', ''],
                className: ['point', '', '', 'b-gray', '', 'b-gray', '', 'b-gray', 'b-gray', 'b-gray'],
            },
            {
                data: ['(매출이익률)', ((grossProfitTotal / salesOrderTotal)*100).toFixed(1) + '%', ((grossProfitIn / salesBudgetIn)*100).toFixed(1)+'%', '', ((grossProfitOut / salesBudgetOut)*100).toFixed(1)+'%', '', ((grossProfitHS / salesBudgetHS)*100).toFixed(1)+'%', '', '', ''],
                className: ['point', '', '', 'b-gray', '', 'b-gray', '', 'b-gray', 'b-gray', 'b-gray'],
            },
            {
                data: ['판매비', sellingTotal, sellingIn, selInPer+'%', '', '', '', '', '', ''],
                className: ['b-lightblue text-danger point', 'b-highlight', '', '', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray'],
            },
            {
                data: ['사내본사비', corpHQTotal, corpIn, corpInPer+'%', '', '', '', '', '', ''],
                className: ['b-lightblue text-danger point', 'b-highlight', '', '', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray'],
            },
            {
                data: ['일반관리비', genAdminTotal, genAdminIn, genInPer+'%', genOut, genOutPer+'%', genHS, genHSPer+'%', '', ''],
                className: ['b-lightblue text-danger point', 'b-highlight', '', '', '', '', '', '', 'b-gray', 'b-gray'],
            },
            {
                data: ['영업이익', operProfitTotal, operProfitIn, '', operProfitOut, '', operProfitHS, '', '', ''],
                className: ['point', '', '', 'b-gray', '', 'b-gray', '', 'b-gray', 'b-gray', 'b-gray'],
            },
            {
                data: ['(영업이익률)', ((operProfitTotal/salesOrderTotal)*100).toFixed(1) + '%', ((operProfitIn/salesBudgetIn)*100).toFixed(1) + '%', '', ((operProfitOut/salesBudgetOut)*100).toFixed(1) + '%', '', ((operProfitHS/salesBudgetHS)*100).toFixed(1) + '%', '', '', ''],
                className: ['point', '', '', 'b-gray', '', 'b-gray', '', 'b-gray', 'b-gray', 'b-gray'],
            },
            {
                data: ['영업외수지', nonOperIncTotal, nonIn, nonInPer+'%', '', '', '', '', '', ''],
                className: ['b-lightblue text-primary point', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray'],
            },
            {
                data: ['경상이익', ordIncTotal, ordIncIn, '', ordIncOut, '', ordIncHS, '', '', ''],
                className: ['point ', '', '', 'b-gray', '', 'b-gray', '', 'b-gray', 'b-gray', 'b-gray'],
            },
            {
                data: ['(경상이익률)', ((ordIncTotal/salesOrderTotal)*100).toFixed(1)+'%', ((ordIncIn/salesBudgetIn)*100).toFixed(1)+'%', '', ((ordIncOut/salesBudgetOut)*100).toFixed(1)+'%', '', ((ordIncHS/salesBudgetHS)*100).toFixed(1)+'%', '', '', ''],
                className: ['point ', '', '', 'b-gray', '', 'b-gray', '', 'b-gray', 'b-gray', 'b-gray'],
            },
            {
                data: ['M/M단가', mmUnitPriceTotal, mmUnitPriceIn, '', '', '', '', '', '', ''],
                className: ['b-lightblue point', 'b-highlight', '', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray', 'b-gray'],
            },
        ]);
    };

    return (
        <div className="popup-container">
            <div className="flex-column">
                <div className="table-title">1.손익계산서</div>
                <BasicDataTable colums={coreColumns} data={coreTableData} datatableRef={coreTable} />

                <div className="empty" />

                <div className="table-title">2.직접원가 내역</div>
                <div className="wrap">
                    <div style={{ flex: 4 }}>
                        <BasicDataTable colums={purchasingColumns} data={purchasingTableData} datatableRef={purchasingTable} tableStyle={purStyle} subtitle='재료비' />
                        <BasicDataTable colums={outsourcingColumns} data={outTableData} datatableRef={outsourcingTable} tableStyle={purStyle} subtitle='개발외주비' />
                        <BasicDataTable colums={laborColumns} data={laborTableData} datatableRef={laborTable} subtitle='인건비' />
                    </div>
                    <div style={{ flex: 0.5 }} />
                    <div style={{ flex: 5.5 }}>
                        <BasicDataTable colums={chargeColumns} data={chargeTableData} datatableRef={chargeTable} tableStyle={chargeStyle} subtitle='경비' />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BusiCalculateDoc;
