import React, { useState } from "react";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import DataTable from "components/DataTable/DataTable";
import FormDataTable from "components/DataTable/FormDataTable";

/** 영업관리-수주관리 */
function OrderMgmt() {
    const [returnKeyWord, setReturnKeyWord] = useState("");
    const [newRowData, setNewRowData] = useState({});

    const columns = [
        {
            header: "프로젝트 이름",
            col: "name",
            cellWidth: "20%",
            update: false,
            updating: true,
            write: true,
        },
        {
            header: "프로젝트 코드",
            col: "code",
            cellWidth: "20%",
            updating: true,
            write: true,
        },
        {
            header: "수주일",
            col: "startDate",
            cellWidth: "20%",
            updating: true,
            write: true,
        },
        { header: "통화", col: "currency", cellWidth: "20%" },
        { header: "거래처", col: "vendor", cellWidth: "20%" },
        { header: "담당자", col: "contactPerson", cellWidth: "20%" },
        { header: "납기일", col: "endDate", cellWidth: "20%" },
        { header: "수주금액", col: "orderAmount", cellWidth: "20%" },
        { header: "거래명세서", col: "Invoice", cellWidth: "20%" },
        { header: "상태", col: "status", cellWidth: "20%" },
    ];

    const conditionList = [
        {
            title: "프로젝트 이름",
            colName: "clCode", //컬럼명
            type: "input",
            value: "",
            searchLevel: "1",
        },
        {
            title: "담당자",
            colName: "clCodeNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "2",
        },
    ];

    const tableList = [
        {
            title: "수주(사업)관리",
            middleName: "영업관리",
            detailName: "수주(사업)관리",
        },
    ];

    const handleReturn = (value) => {
        setReturnKeyWord(value);
        console.log(value, "제대로 들어오냐");
    };

    const addBtn = ["planPage", "calPage"];

    const dummyData = [
        {
            name: "PS 하부서편",
            code: "P001",
            startDate: "2022/10/24",
            currency: "원화",
            vendor: "SDS",
            contactPerson: "",
            endDate: "2022/12/30",
            orderAmount: "78,600,000",
            Invoice: "",
            status: "작성중",
        },
        {
            name: "드림클래스 2.0 후속과제 개발",
            code: "P002",
            startDate: "2023/01/05",
            currency: "원화",
            vendor: "미라콤",
            contactPerson: "손영훈 부장",
            endDate: "2023/6/12",
            orderAmount: "194,881,000",
            Invoice: "",
            status: "수주진행중",
        },
    ];

    const formTableColumns = [
        [
            {
                label: "프로젝트 이름",
                key: "name",
                type: "input",
                colSpan: "3",
            },
            {
                label: "프로젝트 코드",
                key: "code",
                type: "input",
                colSpan: "3",
            },
        ],
        // [
        //     { label: '수주부서', key: 'order', type: 'input' },
        //     { label: '매출부서', key: 'salesDepartment', type: 'select', option: ['PA', 'PS', 'FMCS', 'HMI']},
        //     { label: '영업대표', key: 'salesAgent', type: 'input' },
        //     { label: 'PM', key: 'pm', type: 'input' },
        // ],
        // [
        //     { label: '연도', key: 'year', type: 'input' },
        //     { label: '시작일', key: 'startDate', type: 'input' },
        //     { label: '종료일', key: 'endDate', type: 'input' },
        //     { label: '상태', key: 'status' },
        // ],
        // [
        //     { label: '기준 이익률', key: 'margin', type: 'input' },
        // ]
    ];

    const newProject = (rowData) => {
        console.log("⭕ 부모: ", rowData);
        setNewRowData(rowData);
    };

    return (
        <>
            <Location tableList={tableList} />
            <SearchList conditionList={conditionList} onSearch={handleReturn} />
            <DataTable
                returnKeyWord={returnKeyWord}
                columns={columns}
                suffixUrl="/system/code"
                currentPage="clCode"
                addBtn={addBtn}
                dummyData={dummyData}
                newRowData={newRowData}
            />
            <FormDataTable
                formTableColumns={formTableColumns}
                newProject={newProject}
            />
        </>
    );
}

export default OrderMgmt;
