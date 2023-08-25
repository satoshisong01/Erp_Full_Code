import React, { useState } from "react";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import DataTable from "components/DataTable/DataTable";

/** 기준정보관리-원가기준관리-협력사 */
function PartnerMgmt() {
    const [returnKeyWord, setReturnKeyWord] = useState("");

    const columns = [
        {
            header: "거래처타입",
            col: "cltType",
            cellWidth: "30%",
            enable: false,
            modify: true,
            add: true,
            require: true,
            notView: true,
        },
        {
            header: "거래처ID",
            col: "cltId",
            cellWidth: "30%",
            modify: true,
            add: true,
            notView: true,
        },
        {
            header: "거래처명",
            col: "cltNm",
            cellWidth: "30%",
            modify: true,
            add: true,
        },
        {
            header: "거래처코드",
            col: "cltCode",
            cellWidth: "30%",
            modify: true,
            add: true,
        },
        //{
        //    header: "기업회원ID",
        //    col: "esntlId",
        //    cellWidth: "30%",
        //    modify: true,
        //    add: true,
        //    notView: true,
        //},
        //{
        //    header: "사업자번호",
        //    col: "cltBussnum",
        //    cellWidth: "30%",
        //    modify: true,
        //    add: true,
        //},
        {
            header: "대표자",
            col: "cltOwnrnm",
            cellWidth: "30%",
            modify: true,
            add: true,
        },
        //{
        //    header: "법인번호",
        //    col: "cltCprtnum",
        //    cellWidth: "30%",
        //    modify: true,
        //    add: true,
        //},
        //{
        //    header: "우편번호",
        //    col: "cltZip",
        //    cellWidth: "30%",
        //    modify: true,
        //    add: true,
        //},
        {
            header: "주소",
            col: "cltAddr",
            cellWidth: "30%",
            modify: true,
            add: true,
        },
        {
            header: "상세주소",
            col: "cltDetailAddr",
            cellWidth: "30%",
            modify: true,
            add: true,
        },
        {
            header: "회사번호",
            col: "cltTelno",
            cellWidth: "30%",
            modify: true,
            add: true,
        },
        {
            header: "FAX번호",
            col: "cltFaxnum",
            cellWidth: "30%",
            modify: true,
            add: true,
        },
        {
            header: "이메일",
            col: "cltEmail",
            cellWidth: "30%",
            modify: true,
            add: true,
        },
        //{
        //    header: "업태",
        //    col: "cltBusstype",
        //    cellWidth: "30%",
        //    modify: true,
        //    add: true,
        //},
        {
            header: "품목ID",
            col: "pdiId",
            cellWidth: "20%",
            enable: false,
            modify: true,
            add: true,
            selectOption: true,
            listItem: "pdiId",
            addListURL: "/baseInfrm/product/productInfo",
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
            detailName: "협력사",
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

export default PartnerMgmt;
