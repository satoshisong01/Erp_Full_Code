import React, { useContext, useRef, useState } from "react";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import { locationPath } from "constants/locationPath";
import AddButton from "components/button/AddButton";
import ModButton from "components/button/ModButton";
import DelButton from "components/button/DelButton";
import RefreshButton from "components/button/RefreshButton";
import ReactDataTable from "components/DataTable/ReactDataTable";
import { PageContext } from "components/PageProvider";

/** 기준정보관리-품목관리-품목상세관리 */
function ItemDetailMgmt() {
    const {setNameOfButton} = useContext(PageContext);
    const itemDetailMgmtTable = useRef(null);

    const columns = [
        {
            header: "품목ID",
            col: "pdiId",
            cellWidth: "20%",
            placeholder: "숫자만넣어주세요",
            enable: false,
            modify: true,
            add: true,
            require: true,
        },

        {
            header: "품목명",
            col: "pdiNm",
            cellWidth: "20%",
            modify: true,
            add: true,
            require: true,
        },
        {
            header: "품목번호",
            col: "pdiNum",
            cellWidth: "20%",
            modify: true,
            add: true,
        },
        {
            header: "품목코드",
            col: "pdiCode",
            cellWidth: "20%",
            modify: true,
            add: true,
        },
        { header: "내·외자구분", col: "pdiIotype", cellWidth: "20%" },
        { header: "상태", col: "createDate", cellWidth: "20%" },
        { header: "단위", col: "pdiWght", cellWidth: "20%" },
        { header: "품목규격", col: "pdiStnd", cellWidth: "20%" },
        //{ header: "모델/사양", col: "createDate", cellWidth: "20%" },
        {
            header: "품목그룹ID",
            col: "pgId",
            cellWidth: "20%",
            enable: false,
            type: "select",
            option: [ ///baseInfrm/product/productGroup
            { value: "1", label: "교통비" },
            { value: "2", label: "숙박비" },
            { value: "3", label: "일비/파견비" },
            { value: "4", label: "식비" },
            { value: "5", label: "자재/소모품외" },
            { value: "6", label: "영업비" },
            ],
            modify: true,
            add: true,
            require: true,
        },
    ];

    const conditionList = [
        {
            title: "품목명",
            colName: "pdiNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "1",
        },
        {
            title: "품목번호",
            colName: "pdiNum", //컬럼명
            type: "input",
            value: "",
            searchLevel: "2",
        },
        {
            title: "상태",
            colName: "createIdBy", //컬럼명
            type: "select",
            option: [
                { value: "사용" },
                { value: "임시" },
                { value: "거래중지" },
                { value: "폐기" },
            ],
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
            <Location pathList={locationPath.ItemDetailMgmt} />
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
                tableRef={itemDetailMgmtTable}
                setLengthSelectRow={setLengthSelectRow}
            />
        </>
    );
}

export default ItemDetailMgmt;
