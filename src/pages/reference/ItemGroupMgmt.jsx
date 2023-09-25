import React, { useContext, useRef, useState } from "react";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import { locationPath } from "constants/locationPath";
import ReactDataTable from "components/DataTable/ReactDataTable";
import PopupButton from "components/button/PopupButton";
import AddButton from "components/button/AddButton";
import ModButton from "components/button/ModButton";
import DelButton from "components/button/DelButton";
import RefreshButton from "components/button/RefreshButton";
import { PageContext } from "components/PageProvider";

/** 기준정보관리-품목관리-품목그룹관리 */
function ItemGroupMgmt() {
    const {setNameOfButton} = useContext(PageContext);
    const itemGroupMgmtTable = useRef(null);

    const columns = [
        {
            header: "품목그룹ID",
            col: "pgId",
            cellWidth: "40%",
            //enable: false,
            //modify: true,
            //add: false,
            notView: true,
            //require: true,
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
            header: "품목그룹코드",
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

    const [length, setLength] = useState(0)
    const setLengthSelectRow = (length) => {
        setLength(length);
    }


    return (
        <>
            <Location pathList={locationPath.ItemGroupMgmt} />
            <SearchList conditionList={conditionList} />
            <div className="table-buttons">
                <AddButton label={'추가'} onClick={() => setNameOfButton('add')} />
                <ModButton label={'수정'} length={length} onClick={() => setNameOfButton('modify')} />
                <DelButton label={'삭제'} length={length} onClick={() => setNameOfButton('delete')} />
                <RefreshButton onClick={() => setNameOfButton('refresh')} />
            </div>
            <ReactDataTable
                columns={columns}
                suffixUrl="/baseInfrm/product/productGroup"
                tableRef={itemGroupMgmtTable}
                setLengthSelectRow={setLengthSelectRow}
            />
        </>
    );
}

export default ItemGroupMgmt;
