import React, { useContext, useRef, useState } from "react";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import { locationPath } from "constants/locationPath";
import ReactDataTable from "components/DataTable/ReactDataTable";
import AddButton from "components/button/AddButton";
import ModButton from "components/button/ModButton";
import DelButton from "components/button/DelButton";
import RefreshButton from "components/button/RefreshButton";
import { PageContext } from "components/PageProvider";
import { columns } from "constants/columns";

/** 기준정보관리-품목관리-품목그룹관리 */
function ItemGroupMgmt() {
    const { setNameOfButton } = useContext(PageContext);
    const itemGroupMgmtTable = useRef(null);

    const conditionList = [
        {
            title: "품목그룹명",
            colName: "pgNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "1",
        },
        {
            title: "작성자",
            colName: "createIdBy", //컬럼명
            type: "input",
            value: "",
            searchLevel: "3",
        },
    ];

    return (
        <>
            <Location pathList={locationPath.ItemGroupMgmt} />
            <SearchList conditionList={conditionList} />
            <div className="table-buttons">
                <AddButton label={"추가"} onClick={() => setNameOfButton("add")} />
                <ModButton label={"수정"} onClick={() => setNameOfButton("modify")} />
                <DelButton label={"삭제"} onClick={() => setNameOfButton("delete")} />
                <RefreshButton onClick={() => setNameOfButton("refresh")} />
            </div>
            <ReactDataTable
                columns={columns.reference.itemGroupMgmt}
                suffixUrl="/baseInfrm/product/productGroup"
                tableRef={itemGroupMgmtTable}
                viewPageName="품목그룹관리"
            />
        </>
    );
}

export default ItemGroupMgmt;
