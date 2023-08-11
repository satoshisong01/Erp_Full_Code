import React, { useState } from "react";
import { Link } from "react-router-dom";
import store from "store/configureStore";
import { tabActive } from "components/tabs/TabsActions";
import { default as EgovLeftNav } from "components/leftmenu/EgovLeftNavReference";
import EmployMembers from "./UserManagement/Employ_Member/EmployMembers";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import DataTable from "components/DataTable/DataTable";

/** 기준정보관리-원가기준관리-업무회원관리 */
function WorkMemberMgmt() {
    const [returnKeyWord, setReturnKeyWord] = useState("");

    const columns = [
        {
            header: "ID",
            col: "empId",
            cellWidth: "20%",
            update: false,
            updating: true,
            write: true,
        },
        {
            header: "이름",
            col: "empNm",
            cellWidth: "20%",
            update: true,
            updating: true,
            write: true,
        },
        {
            header: "사원번호",
            col: "empNum",
            cellWidth: "25%",
            update: true,
            updating: true,
            write: true,
        },
        {
            header: "성별",
            col: "genderCd",
            cellWidth: "20%",
            update: true,
            updating: true,
            write: true,
        },
        { header: "나이", col: "birthday", cellWidth: "20%" },
        { header: "전화번호", col: "mbTelNm", cellWidth: "25%" },
        { header: "직위", col: "posNm", cellWidth: "20%" },
        { header: "소속기관", col: "aflOrgCd", cellWidth: "25%" },
        { header: "가입일", col: "joinDt", cellWidth: "20%" },
        { header: "입사일", col: "joiningDt", cellWidth: "20%" },
        { header: "잠금여부", col: "lockAt", cellWidth: "25%" },
        { header: "작성일", col: "createDate", cellWidth: "20%" },
        { header: "작성자", col: "createIdBy", cellWidth: "20%" },
        { header: "수정일", col: "lastModifyDate", cellWidth: "20%" },
        { header: "수정자", col: "lastModifiedUserName", cellWidth: "20%" },
    ];

    const conditionList = [
        {
            title: "ID",
            colName: "empId", //컬럼명
            type: "input",
            value: "",
            searchLevel: "1",
        },
        {
            title: "이름",
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
