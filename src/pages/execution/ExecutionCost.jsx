import React, { useState } from "react";
import Location from "components/Location/Location";
import DataTable from "components/DataTable/DataTable";
import SearchList from "components/SearchList";

/** 실행관리-실행원가 */
function ExecutionCost() {
    const [returnKeyWord, setReturnKeyWord] = useState("");

    const columns = [
        {
            header: "연도",
            col: "name",
            cellWidth: "20%",
            update: false,
            updating: true,
            write: true,
        },
        {
            header: "프로젝트명",
            col: "code",
            cellWidth: "20%",
            updating: true,
            write: true,
        },
        {
            header: "매출부서",
            col: "startDate",
            cellWidth: "20%",
            updating: true,
            write: true,
        },
        { header: "담당자", col: "currency", cellWidth: "20%" },
        { header: "시작일", col: "vendor", cellWidth: "20%" },
        { header: "종료일", col: "contactPerson", cellWidth: "20%" },
        { header: "비고", col: "endDate", cellWidth: "20%" },
        { header: "수주상태", col: "orderAmount", cellWidth: "20%" },
    ];

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
            title: "담당자",
            colName: "clCodeNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "2",
        },
        {
            title: "수주상태",
            colName: "name",
            type: "select",
            option: [
                { value: "사업진행중" },
                { value: "사업완료" },
                { value: "작성완료" },
            ],
            searchLevel: "3",
        },
    ];

    const tableList = [
        {
            title: "실행원가",
            middleName: "실행관리",
            detailName: "실행 원가 관리",
        },
    ];

    const handleReturn = (value) => {
        setReturnKeyWord(value);
        console.log(value, "제대로 들어오냐");
    };

    const addBtn = ["runCalPage"];

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
            />
        </>
    );
}

export default ExecutionCost;
