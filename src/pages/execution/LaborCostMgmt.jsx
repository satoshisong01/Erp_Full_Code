import React, { useState } from "react";
import PersonnelMgmts from "./personnelMgmt/PersonnelMgmts";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import DataTable from "components/DataTable/DataTable";

/** 실행관리-인건비관리 */
function LaborCostMgmt() {
    const [returnKeyWord, setReturnKeyWord] = useState("");

    const columns = [
        {
            header: "프로젝트명",
            col: "code",
            cellWidth: "40%",
            update: false,
            updating: true,
            write: true,
        },
        {
            header: "계획인건비",
            col: "startDate",
            cellWidth: "30%",
            updating: true,
            write: true,
        },
        { header: "실행인건비", col: "currency", cellWidth: "30%" },
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
            title: "연월",
            colName: "clCodeNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "2",
        },
    ];

    const tableList = [
        {
            title: "인건비 관리",
            middleName: "실행관리",
            detailName: "인건비 관리",
        },
    ];

    const handleReturn = (value) => {
        setReturnKeyWord(value);
        console.log(value, "제대로 들어오냐");
    };

    const addBtn = [""];

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
            <PersonnelMgmts />
        </>
    );
}

export default LaborCostMgmt;
