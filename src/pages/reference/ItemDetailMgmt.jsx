import React, { useState } from "react";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import DataTable from "components/DataTable/DataTable";

/** 기준정보관리-품목관리-품목상세관리 */
function ItemDetailMgmt() {
    const [returnKeyWord, setReturnKeyWord] = useState("");

    const columns = [
        {
            header: "품목그룹명",
            col: "pgNm",
            cellWidth: "20%",
            update: false,
            updating: true,
            write: true,
        },
        {
            header: "품목명",
            col: "pdiNm",
            cellWidth: "20%",
            updating: true,
            write: true,
        },
        {
            header: "품목번호",
            col: "pdiNum",
            cellWidth: "20%",
            updating: true,
            write: true,
        },
        {
            header: "품목코드",
            col: "pdiCode",
            cellWidth: "20%",
            updating: true,
            write: true,
        },
        { header: "내·외자구분", col: "pdiIotype", cellWidth: "20%" },
        { header: "상태", col: "createDate", cellWidth: "20%" },
        { header: "단위", col: "pdiWght", cellWidth: "20%" },
        { header: "품목규격", col: "pdiStnd", cellWidth: "20%" },
        //{ header: "모델/사양", col: "createDate", cellWidth: "20%" },
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
            title: "품목명",
            colName: "pgCode", //컬럼명
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
    ];

    const tableList = [
        {
            title: "품목관리",
            middleName: "기준정보 관리",
            detailName: "품목 그룹 관리",
        },
    ];

    const handleReturn = (value) => {
        setReturnKeyWord(value);
    };

    const addBtn = [""];
    return (
        <>
            <Location tableList={tableList} />
            <SearchList conditionList={conditionList} onSearch={handleReturn} />
            <DataTable
                returnKeyWord={returnKeyWord}
                columns={columns}
                suffixUrl="/baseInfrm/product"
                currentPage="productInfo"
                addBtn={addBtn}
            />
        </>
    );
}

export default ItemDetailMgmt;
