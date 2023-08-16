import React, { useState } from "react";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import DataTable from "components/DataTable/DataTable";
/** 실행관리-경비관리 */
function ExpenseMgmt() {
    const [returnKeyWord, setReturnKeyWord] = useState("");

    const columns = [
        {
            header: "월",
            col: "name",
            cellWidth: "20%",
            update: false,
            updating: true,
            write: true,
        },
        {
            header: "출장인",
            col: "code",
            cellWidth: "20%",
            updating: true,
            write: true,
        },
        {
            header: "시작일",
            col: "startDate",
            cellWidth: "20%",
            updating: true,
            write: true,
        },
        { header: "종료일", col: "currency", cellWidth: "20%" },
        { header: "교통비", col: "vendor", cellWidth: "20%" },
        { header: "숙박비", col: "contactPerson", cellWidth: "20%" },
        { header: "일비/파견비", col: "endDate", cellWidth: "30%" },
        { header: "식비", col: "orderAmount", cellWidth: "20%" },
        { header: "자재/소모품외", col: "orderAmount", cellWidth: "30%" },
        { header: "지출합계", col: "orderAmount", cellWidth: "20%" },
        { header: "월합계", col: "orderAmount", cellWidth: "20%" },
        { header: "비고", col: "orderAmount", cellWidth: "20%" },
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
            title: "출장인",
            colName: "clCodeNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "2",
        },
    ];

    const tableList = [
        {
            title: "경비관리",
            middleName: "실행관리",
            detailName: "경비관리",
        },
    ];

    const handleReturn = (value) => {
        setReturnKeyWord(value);
        console.log(value, "제대로 들어오냐");
    };

    const addBtn = ["costPlanPage", "runCostPlanPage"];

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

export default ExpenseMgmt;
