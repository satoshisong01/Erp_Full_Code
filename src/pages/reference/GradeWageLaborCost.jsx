import React from "react";
import Location from "components/Location/Location";
import DataTable from "components/DataTable/DataTable";
import { locationPath } from "constants/locationPath";

/** 기준정보관리-원가기준관리-급별단가(인건비) */
function GradeWageLaborCost() {
    const columns = [
        { header: "기준명", col: "groupId", cellWidth: "30%" },
        { header: "임원", col: "guppId", cellWidth: "30%" },
        { header: "특급기술사", col: "guppId", cellWidth: "30%" },
        { header: "고급기술사", col: "guppId", cellWidth: "30%" },
        { header: "중급기술사", col: "guppId", cellWidth: "30%" },
        { header: "초급기술사", col: "guppId", cellWidth: "30%" },
        { header: "고급기능사", col: "guppId", cellWidth: "30%" },
        { header: "중급기능사", col: "guppId", cellWidth: "30%" },
        { header: "부장/차장", col: "guppId", cellWidth: "30%" },
        { header: "과장", col: "guppId", cellWidth: "30%" },
        { header: "대리", col: "guppId", cellWidth: "30%" },
        { header: "주임", col: "guppId", cellWidth: "30%" },
        { header: "사원", col: "guppId", cellWidth: "30%" },
    ];


    const addBtn = [""];

    return (
        <>
            <Location pathList={locationPath.GradeWageLaborCost} />
            <DataTable
                columns={columns}
                suffixUrl="/baseInfrm/product"
                currentPage="gradeunitPrice"
                addBtn={addBtn}
            />
        </>
    );
}

export default GradeWageLaborCost;
