import React from "react";
import Location from "components/Location/Location";
import DataTable from "components/DataTable/DataTable";
import { locationPath } from "constants/locationPath";

/** 기준정보관리-원가기준관리-급별단가(경비) */
function GradeWageExpense() {
    const columns = [
        { header: "기준명", col: "groupId", cellWidth: "30%" },
        { header: "임원", col: "groupNm", cellWidth: "30%" },
        { header: "특급기술사", col: "groupCode", cellWidth: "30%" },
        { header: "고급기술사", col: "groupCreatDe", cellWidth: "30%" },
        { header: "중급기술사", col: "mbTelNm", cellWidth: "30%" },
        { header: "초급기술사", col: "sbsDt", cellWidth: "30%" },
        { header: "고급기능사", col: "createDate", cellWidth: "30%" },
        { header: "중급기능사", col: "createDate", cellWidth: "30%" },
        { header: "부장/차장", col: "createDate", cellWidth: "30%" },
        { header: "과장", col: "createDate", cellWidth: "30%" },
        { header: "대리", col: "createDate", cellWidth: "30%" },
        { header: "주임", col: "createDate", cellWidth: "30%" },
        { header: "사원", col: "createDate", cellWidth: "30%" },
    ];

    const addBtn = [""];
    return (
        <>
            <Location pathList={locationPath.GradeWageExpense} />
            <DataTable
                columns={columns}
                suffixUrl="/baseInfrm/product"
                currentPage="gradeunitPrice"
                addBtn={addBtn}
            />
        </>
    );
}

export default GradeWageExpense;
