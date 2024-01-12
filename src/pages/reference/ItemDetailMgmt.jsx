import React, { useContext, useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import { locationPath } from "constants/locationPath";
import AddButton from "components/button/AddButton";
import ModButton from "components/button/ModButton";
import DelButton from "components/button/DelButton";
import RefreshButton from "components/button/RefreshButton";
import ReactDataTable from "components/DataTable/ReactDataTable";
import { PageContext } from "components/PageProvider";
import { axiosFetch } from "api/axiosFetch";
import { columns } from "constants/columns";

/** 기준정보관리-품목관리-품목상세관리 */
function ItemDetailMgmt() {
    const { setNameOfButton } = useContext(PageContext);
    const itemDetailMgmtTable = useRef(null);

    const conditionList = [
        {
            title: "품목그룹명",
            colName: "pgNm",
            type: "input",
            value: "",
            searchLevel: "1",
        },
        {
            title: "품목명",
            colName: "pdiNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "2",
        },
        {
            title: "제조사",
            colName: "pdiMenufut", //컬럼명
            type: "input",
            value: "",
            searchLevel: "3",
        },
        {
            title: "판매사",
            colName: "pdiSeller", //컬럼명
            type: "input",
            value: "",
            searchLevel: "3",
        },
    ];

    const [length, setLength] = useState(0);
    const setLengthSelectRow = (length) => {
        setLength(length);
    };
    return (
        <>
            <Location pathList={locationPath.ItemDetailMgmt} />
            <SearchList conditionList={conditionList} />
            <div className="table-buttons">
                <AddButton label={"추가"} onClick={() => setNameOfButton("add")} />
                <ModButton label={"수정"} length={length} onClick={() => setNameOfButton("modify")} />
                <DelButton label={"삭제"} length={length} onClick={() => setNameOfButton("delete")} />
                <RefreshButton onClick={() => setNameOfButton("refresh")} />
            </div>
            <ReactDataTable
                //beforeItem={pdIdArray}
                columns={columns.reference.itemDetailMgmt}
                suffixUrl="/baseInfrm/product/productInfo"
                tableRef={itemDetailMgmtTable}
                setLengthSelectRow={setLengthSelectRow}
                viewPageName={{ name: "품목상세관리", id: "ItemDetailMgmt" }}
            />
        </>
    );
}

export default ItemDetailMgmt;
