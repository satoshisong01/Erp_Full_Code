import React, { useState } from "react";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import DataTable from "components/DataTable/DataTable";

/** 기준정보관리-사업장관리 */
function BusinessMgmt() {
    const [returnKeyWord, setReturnKeyWord] = useState("");

    const columns = [
        { header: "사업장명", col: "createDate", cellWidth: "40%" },
        { header: "사업장코드", col: "createDate", cellWidth: "40%" },
        { header: "구분", col: "createIdBy", cellWidth: "40%" },
    ];

    const conditionList = [
        {
            title: "사업장명",
            colName: "pgNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "1",
        },
        {
            title: "사업장코드",
            colName: "pgCode", //컬럼명
            type: "input",
            value: "",
            searchLevel: "2",
        },
        {
            title: "구분",
            colName: "createIdBy", //컬럼명
            type: "input",
            value: "",
            searchLevel: "3",
        },
    ];

    const tableList = [
        {
            title: "거래처관리",
            middleName: "기준정보 관리",
            detailName: "사업장관리",
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
                suffixUrl=""
                currentPage=""
                addBtn={addBtn}
            />
        </>
    );
}

export default BusinessMgmt;
