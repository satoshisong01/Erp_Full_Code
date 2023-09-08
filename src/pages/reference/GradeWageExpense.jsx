import React from "react";
import Location from "components/Location/Location";
import DataTable from "components/DataTable/DataTable";
import DataTableRow from "components/DataTable/DataTableRow";
import { locationPath } from "constants/locationPath";

/** 기준정보관리-원가기준관리-급별단가(경비) */
function GradeWageExpense() {
    const columns = [
        "기준명",
        "임원",
        "특급기술사",
        "고급기술사",
        "중급기술사",
        "초급기술사",
        "고급기능사",
        "중급기능사",
        "초급기능사",
        "부장",
        "차장",
        "과장",
        "대리",
        "주임",
        "사원",
    ];

    const addBtn = [""];
    return (
        <>
            <Location pathList={locationPath.GradeWageExpense} />
            <DataTableRow
                columns={columns}
                suffixUrl="/baseInfrm/product"
                currentPage="gradeunitPrice"
                customerList="type/g"
                addBtn={addBtn}
            />
        </>
    );
}

export default GradeWageExpense;
