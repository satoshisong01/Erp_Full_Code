import React, { useState } from "react";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import DataTable from "components/DataTable/DataTable";
import { locationPath } from "constants/locationPath";

/** 기준정보관리-품목관리-품목상세관리 */
function ItemDetailMgmt() {
    const [returnKeyWord, setReturnKeyWord] = useState("");

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
            selectOption: true,
            modify: true,
            add: true,
            listItem: "pgId",
            addListURL: "/baseInfrm/product/productGroup",
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

    const handleReturn = (value) => {
        setReturnKeyWord(value);
    };

    const addBtn = [""];

    return (
        <>
            <Location pathList={locationPath.ItemDetailMgmt} />
            <SearchList conditionList={conditionList} onSearch={handleReturn} />
            <DataTable
                returnKeyWord={returnKeyWord}
                columns={columns}
                suffixUrl="/baseInfrm/product/productInfo"
                addBtn={addBtn}
            />
        </>
    );
}

export default ItemDetailMgmt;
