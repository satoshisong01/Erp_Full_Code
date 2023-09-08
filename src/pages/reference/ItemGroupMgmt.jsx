import React, { useState } from "react";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import DataTable from "components/DataTable/DataTable";
import { locationPath } from "constants/locationPath";

/** 기준정보관리-품목관리-품목그룹관리 */
function ItemGroupMgmt() {
    const [returnKeyWord, setReturnKeyWord] = useState("");

    const columns = [
        {
            header: "품목그룹ID",
            col: "pgId",
            cellWidth: "40%",
            enable: false,
            modify: true,
            add: true,
            notView: true,
            require: true,
        },
        {
            header: "품목그룹명",
            col: "pgNm",
            cellWidth: "40%",
            modify: true,
            add: true,
            require: true,
        },
        {
            header: "품목구분코드",
            col: "pgCode",
            cellWidth: "30%",
            modify: true,
            add: true,
            require: true,
        },

        { header: "작성일", col: "createDate", cellWidth: "30%" },
        { header: "작성자", col: "createIdBy", cellWidth: "30%" },
    ];

    const conditionList = [
        {
            title: "품목그룹명",
            colName: "pgNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "1",
        },
        {
            title: "품목구분코드",
            colName: "pgCode", //컬럼명
            type: "input",
            value: "",
            searchLevel: "2",
        },
        {
            title: "작성자",
            colName: "createIdBy", //컬럼명
            type: "input",
            value: "",
            searchLevel: "3",
        },
        {
            title: "작성일",
            colName: "createDate",
            type: "datepicker",
            searchLevel: "1",
        },
    ];

    const handleReturn = (value) => {
        setReturnKeyWord(value);
    };

    const addBtn = [""];

    return (
        <>
            <Location pathList={locationPath.ItemGroupMgmt} />
            <SearchList conditionList={conditionList} onSearch={handleReturn} />
            <DataTable
                returnKeyWord={returnKeyWord}
                columns={columns}
                suffixUrl="/baseInfrm/product"
                currentPage="productGroup"
                addBtn={addBtn}
            />
        </>
    );
}

export default ItemGroupMgmt;
