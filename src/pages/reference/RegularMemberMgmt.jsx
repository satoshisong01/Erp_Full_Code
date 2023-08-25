import React, { useState } from "react";
import DataTable from "components/DataTable/DataTable";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";

/** 기준정보관리-원가기준관리-일반회원관리 */
function RegularMemberMgmt() {
    const [returnKeyWord, setReturnKeyWord] = useState("");

    const columns = [
        {
            header: "고유ID",
            col: "uniqId",
            cellWidth: "20%",
            enable: false,
            modify: true,
            add: true,
            require: true,
        },
        {
            header: "회원ID",
            col: "mbId",
            cellWidth: "20%",
            enable: false,
            modify: true,
            add: true,
            require: true,
        },
        {
            header: "회원명",
            col: "mbNm",
            cellWidth: "20%",
            modify: true,
            add: true,
            require: true,
        },
        {
            header: "비밀번호",
            col: "password",
            cellWidth: "20%",
            modify: true,
            add: true,
        },
        {
            header: "회원상태코드",
            col: "mbStuCd",
            cellWidth: "35%",
            modify: true,
            add: true,
        },
        {
            header: "잠금여부",
            col: "lockAt",
            lockAt: true,
            cellWidth: "20%",
            modify: true,
            add: true,
        },
        {
            header: "이메일",
            col: "mbEmAdr",
            cellWidth: "20%",
            modify: true,
            add: true,
        },
        { header: "전화번호", col: "mbTelNm", cellWidth: "20%" },
        { header: "작성일", col: "createDate", cellWidth: "20%" },
        { header: "작성자", col: "createIdBy", cellWidth: "20%" },
        { header: "수정일", col: "lastModifyDate", cellWidth: "20%" },
        { header: "수정자", col: "lastModifiedUserName", cellWidth: "20%" },
        {
            header: "그룹ID",
            col: "groupId",
            cellWidth: "20%",
            enable: false,
            selectOption: true,
            modify: true,
            add: true,
            listItem: "groupId",
            addListURL: "/baseInfrm/member/authorGroup",
            require: true,
        },
    ];

    const conditionList = [
        {
            title: "ID",
            colName: "mbId", //컬럼명
            type: "input",
            value: "",
            searchLevel: "1",
        },
        {
            title: "이름",
            colName: "mbNm", //컬럼명
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
            detailName: "일반회원관리",
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
                currentPage="generalMember"
                addBtn={addBtn}
            />
        </>
    );
}

export default RegularMemberMgmt;
