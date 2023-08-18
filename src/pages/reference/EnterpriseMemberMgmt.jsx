import React, { useState } from "react";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import DataTable from "components/DataTable/DataTable";

/** 기준정보관리-원가기준관리-기업회원관리 */
function EnterpriseMemberMgmt() {
    const [returnKeyWord, setReturnKeyWord] = useState("");

    const columns = [
        {
            header: "고유ID",
            col: "uniqId",
            cellWidth: "20%",
            update: false,
            updating: true,
            write: true,
            require: true,
        },
        {
            header: "기업회원ID",
            col: "entMbId",
            cellWidth: "20%",
            update: false,
            updating: true,
            write: true,
            //require: true,
        },
        {
            header: "기업명",
            col: "entMbNm",
            cellWidth: "20%",
            update: true,
            updating: true,
            write: true,
        },
        {
            header: "기업구분코드",
            col: "entSeCd",
            cellWidth: "20%",
            update: false,
            updating: true,
            write: true,
        },
        {
            header: "비밀번호",
            col: "entMbPw",
            cellWidth: "20%",
            update: true,
            updating: true,
            write: true,
        },
        {
            header: "주소",
            col: "address",
            cellWidth: "20%",
            update: true,
            updating: true,
            write: true,
        },
        { header: "휴대폰", col: "mbTelNm", cellWidth: "20%" },
        { header: "회사번호", col: "telNm", cellWidth: "20%" },
        { header: "가입일", col: "sbsDt", cellWidth: "20%" },
        { header: "작성일", col: "createDate", cellWidth: "20%" },
        { header: "작성자", col: "createIdBy", cellWidth: "20%" },
        { header: "수정일", col: "lastModifyDate", cellWidth: "20%" },
        { header: "수정자", col: "lastModifiedUserName", cellWidth: "20%" },
        {
            header: "그룹ID",
            col: "groupId",
            cellWidth: "20%",
            update: false,
            selectOption: true,
            updating: true,
            write: true,
            listItem: "groupId",
            callTable: "authorGroup",
        },
    ];

    const conditionList = [
        {
            title: "기업ID",
            colName: "uniqId", //컬럼명
            type: "input",
            value: "",
            searchLevel: "1",
        },
        {
            title: "기업명",
            colName: "entMbNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "2",
        },
        {
            title: "권한",
            colName: "sbsDt", //컬럼명
            type: "input",
            value: "",
            searchLevel: "2",
        },
    ];

    const tableList = [
        {
            title: "사용자관리",
            middleName: "기준정보 관리",
            detailName: "기업회원관리",
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
                suffixUrl="/baseInfrm/member"
                currentPage="entrprsMember"
                addBtn={addBtn}
            />
        </>
    );
}

export default EnterpriseMemberMgmt;
