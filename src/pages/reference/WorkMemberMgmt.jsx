import React, { useState } from "react";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import DataTable from "components/DataTable/DataTable";

/** 기준정보관리-원가기준관리-업무회원관리 */
function WorkMemberMgmt() {
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
            header: "업무회원ID",
            col: "empId",
            cellWidth: "30%",
            enable: false,
            modify: true,
            add: true,
            require: true,
        },
        {
            header: "사용자명",
            col: "empNm",
            cellWidth: "25%",
            modify: true,
            add: true,
            require: true,
        },
        {
            header: "사원번호",
            col: "empNum",
            cellWidth: "25%",
            modify: true,
            add: true,
            require: true,
        },
        {
            header: "비밀번호",
            col: "password",
            cellWidth: "25%",
            modify: true,
            add: true,
            require: true,
        },
        {
            header: "상태",
            col: "usrSttCd",
            cellWidth: "15%",
            modify: true,
            add: true,
            require: true,
        },
        { header: "나이", col: "birthday", cellWidth: "20%" },
        { header: "전화번호", col: "mbTelNm", cellWidth: "25%" },
        { header: "직위", col: "posNm", cellWidth: "20%" },
        { header: "소속기관", col: "aflOrgCd", cellWidth: "25%" },
        { header: "입사일", col: "joiningDt", cellWidth: "20%" },
        { header: "잠금여부", col: "lockAt", cellWidth: "25%" },
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
            title: "업무회원ID",
            colName: "empId", //컬럼명
            type: "input",
            value: "",
            searchLevel: "1",
        },
        {
            title: "사용자명",
            colName: "empNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "2",
        },
        {
            title: "소속기관",
            colName: "aflOrgCd", //컬럼명
            type: "input",
            value: "",
            searchLevel: "3",
        },
        {
            title: "작성일",
            colName: "createDate",
            type: "datepicker",
            searchLevel: "1",
        },
    ];

    const tableList = [
        {
            title: "사용자관리",
            middleName: "기준정보 관리",
            detailName: "업무회원관리",
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
                currentPage="employMember"
                addBtn={addBtn}
            />
        </>
    );
}

export default WorkMemberMgmt;
