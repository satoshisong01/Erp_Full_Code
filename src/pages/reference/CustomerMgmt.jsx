import React, { useState } from "react";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import DataTable from "components/DataTable/DataTable";

/** 기준정보관리-거래처관리-고객사 */
function CustomerMgmt() {
    const [returnKeyWord, setReturnKeyWord] = useState("");

    const columns = [
        { header: "거래처타입", col: "cltType", cellWidth: "30%" },
        { header: "거래처명", col: "cltNm", cellWidth: "30%" },
        { header: "거래처ID", col: "cltId", cellWidth: "30%" },
        { header: "기업회원ID", col: "esntlId", cellWidth: "30%" },
        { header: "거래처코드", col: "cltCode", cellWidth: "30%" },
        { header: "사업자번호", col: "cltBussnum", cellWidth: "30%" },
        { header: "대표자", col: "cltOwnrnm", cellWidth: "30%" },
        { header: "회사번호", col: "cltTelno", cellWidth: "30%" },
        { header: "FAX번호", col: "cltFaxnum", cellWidth: "30%" },
        { header: "이메일", col: "cltEmail", cellWidth: "30%" },
        { header: "주소", col: "cltAddr", cellWidth: "30%" },
        { header: "업태", col: "cltBusstype", cellWidth: "30%" },
        {
            header: "품목ID",
            col: "pdiId",
            cellWidth: "20%",
            enable: false,
            modify: true,
            add: true,
            selectOption: true,
            listItem: "pdiId",
            addListURL: "productInfo",
        },
    ];

    const conditionList = [
        {
            title: "거래처명",
            colName: "cltNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "1",
        },
        {
            title: "대표자",
            colName: "cltOwnrnm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "2",
        },
        {
            title: "주소",
            colName: "cltAddr", //컬럼명
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
                suffixUrl="/baseInfrm/client"
                currentPage="client"
                addBtn={addBtn}
            />
        </>
    );
}
export default CustomerMgmt;
