import React from "react";
import Location from "components/Location/Location";
import DataTable from "components/DataTable/DataTable";
import { locationPath } from "constants/locationPath";

/** 기준정보관리-원가기준관리-사전원가지표 */
function CostIndex() {
    const columns = [
        { header: "분류", col: "cbTypeCode", cellWidth: "30%" },
        { header: "간접원가", col: "cbPer", cellWidth: "30%" },
        { header: "원가명", col: "cbName", cellWidth: "30%" },
        { header: "판매비", col: "groupCode", cellWidth: "30%" },
        { header: "사내본사비", col: "groupCreatDe", cellWidth: "30%" },
        { header: "일반관리비", col: "mbTelNm", cellWidth: "30%" },
        { header: "영업외수지", col: "sbsDt", cellWidth: "30%" },
    ];

    const addBtn = [""];

    return (
        <>
            <Location pathList={locationPath.CostIndex} />
            <DataTable
                columns={columns}
                suffixUrl="/baseInfrm/product/costBase"
                addBtn={addBtn}
            />
        </>
    );
}

export default CostIndex;
