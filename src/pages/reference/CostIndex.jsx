import React, { useContext, useRef } from "react";
import Location from "components/Location/Location";
import DataTable from "components/DataTable/DataTable";
import { locationPath } from "constants/locationPath";
import { PageContext } from "components/PageProvider";
import ReactDataTable from "components/DataTable/ReactDataTable";
import AddButton from "components/button/AddButton";
import ModButton from "components/button/ModButton";
import DelButton from "components/button/DelButton";
import RefreshButton from "components/button/RefreshButton";

/** 기준정보관리-원가기준관리-사전원가지표 */
function CostIndex() {
    const { setNameOfButton } = useContext(PageContext);
    const costIndexMgmtTable = useRef(null);
    const columns = [
        { header: "분류", col: "cbTypeCode", cellWidth: "30%" },
        { header: "간접원가", col: "cbPer", cellWidth: "30%" },
        { header: "원가명", col: "cbName", cellWidth: "30%" },
        { header: "판매비", col: "groupCode", cellWidth: "30%" },
        { header: "사내본사비", col: "groupCreatDe", cellWidth: "30%" },
        { header: "일반관리비", col: "mbTelNm", cellWidth: "30%" },
        { header: "영업외수지", col: "sbsDt", cellWidth: "30%" },
    ];

    return (
        <>
            <Location pathList={locationPath.CostIndex} />
            <div className="table-buttons">
                <AddButton label={"추가"} onClick={() => setNameOfButton("add")} />
                <ModButton label={"수정"} onClick={() => setNameOfButton("modify")} />
                <DelButton label={"삭제"} onClick={() => setNameOfButton("delete")} />
                <RefreshButton onClick={() => setNameOfButton("refresh")} />
            </div>
            <ReactDataTable columns={columns} suffixUrl="/baseInfrm/product/costBase" tableRef={costIndexMgmtTable} viewPageName="사전원가지표" />
        </>
    );
}

export default CostIndex;
