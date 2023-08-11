import React, { useState } from "react";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import DataTable from "components/DataTable/DataTable";

/** 기준정보관리-거래처관리-고객사 */
function CustomerMgmt() {
    const [returnKeyWord, setReturnKeyWord] = useState("");

    const columns = [
        { header: "회사명", col: "createDate", cellWidth: "30%" },
        { header: "거래처코드", col: "createDate", cellWidth: "30%" },
        { header: "사업자번호", col: "createDate", cellWidth: "30%" },
        { header: "대표자", col: "createDate", cellWidth: "30%" },
        { header: "회사번호", col: "createDate", cellWidth: "30%" },
        { header: "FAX번호", col: "createDate", cellWidth: "30%" },
        { header: "이메일", col: "createDate", cellWidth: "30%" },
        { header: "입금계좌", col: "createDate", cellWidth: "30%" },
        { header: "주소", col: "createDate", cellWidth: "30%" },
        { header: "업태", col: "createIdBy", cellWidth: "30%" },
    ];

    const conditionList = [
        {
            title: "회사명",
            colName: "pgNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "1",
        },
        {
            title: "대표자",
            colName: "pgCode", //컬럼명
            type: "input",
            value: "",
            searchLevel: "2",
        },
        {
            title: "주소",
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
            detailName: "고객사",
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

export default CustomerMgmt;
