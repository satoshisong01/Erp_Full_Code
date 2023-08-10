import React, { useState } from "react";
import DataTable from "components/DataTable/DataTable";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";

/** 시스템관리-코드관리-분류코드관리 */
function CategoryCode() {
    const [returnKeyWord, setReturnKeyWord] = useState("");

    const columns = [
        {
            header: "분류코드",
            col: "clCode",
            cellWidth: "20%",
            update: false,
            updating: true,
            write: true,
        },
        {
            header: "분류코드명",
            col: "clCodeNm",
            cellWidth: "20%",
            updating: true,
            write: true,
        },
        {
            header: "분류코드설명",
            col: "clCodeDc",
            cellWidth: "20%",
            updating: true,
            write: true,
        },
        { header: "작성자", col: "createIdBy", cellWidth: "20%" },
        { header: "작성일", col: "createDate", cellWidth: "20%" },
        { header: "수정자", col: "lastModifiedIdBy", cellWidth: "20%" },
        { header: "수정일", col: "lastModifyDate", cellWidth: "20%" },
    ];

    const conditionList = [
        {
            title: "분류코드",
            colName: "clCode", //컬럼명
            type: "input",
            value: "",
            searchLevel: "1",
        },
        {
            title: "분류코드명",
            colName: "clCodeNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "2",
        },
        {
            title: "분류코드설명",
            colName: "clCodeDc", //컬럼명
            type: "input",
            value: "",
            searchLevel: "3",
        },
        {
            title: "이름",
            colName: "name",
            type: "select",
            option: [
                { value: "다섯글자의옵션1" },
                { value: "다섯글자의옵션2" },
            ],
            searchLevel: "3",
        },
        {
            title: "날짜선택",
            colName: "selectedDate",
            type: "datepicker",
            searchLevel: "0",
        },
    ];

    const tableList = [
        {
            title: "권한관리",
            middleName: "시스템관리",
            detailName: "분류코드관리",
        },
    ];

    const handleReturn = (value) => {
        setReturnKeyWord(value);
        console.log(value, "제대로 들어오냐");
    };

    const addBtn = [""];

    return (
        <>
            <Location tableList={tableList} />
            <SearchList conditionList={conditionList} onSearch={handleReturn} />
            <DataTable
                returnKeyWord={returnKeyWord}
                columns={columns}
                suffixUrl="/system/code"
                currentPage="clCode"
                addBtn={addBtn}
            />
        </>
    );
}

export default CategoryCode;
