import React, { useState } from "react";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import DataTable from "components/DataTable/DataTable";

/** 기준정보관리-원가기준관리-권한그룹정보관리 */
function PermissionGroupMgmt() {
    const [returnKeyWord, setReturnKeyWord] = useState("");

    const columns = [
        {
            header: "그룹ID",
            col: "groupId",
            cellWidth: "30%",
            update: false,
            updating: true,
            write: true,
            require: true,
        },
        {
            header: "그룹명",
            col: "groupNm",
            cellWidth: "30%",
            updating: true,
            write: true,
        },
        {
            header: "그룹코드",
            col: "groupCode",
            cellWidth: "30%",
            updating: true,
            write: true,
        },
        {
            header: "그룹설명",
            col: "groupDc",
            cellWidth: "30%",
            updating: true,
            write: true,
        },
        { header: "가입일자", col: "groupCreatDe", cellWidth: "30%" },
        { header: "작성일", col: "createDate", cellWidth: "30%" },
        { header: "작성자", col: "createIdBy", cellWidth: "30%" },
        { header: "수정일", col: "lastModifyDate", cellWidth: "30%" },
        { header: "수정자", col: "lastModifiedUserName", cellWidth: "30%" },
        {
            header: "조직ID",
            col: "orgId",
            cellWidth: "30%",
            update: false,
            updating: true,
            write: true,
            selectOption: true,
            listItem: "orgId",
            callTable: "orgNzt",
        },
    ];

    const conditionList = [
        {
            title: "ID",
            colName: "groupId", //컬럼명
            type: "input",
            value: "",
            searchLevel: "1",
        },
        {
            title: "그룹명",
            colName: "groupNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "2",
        },
        {
            title: "권한",
            colName: "sbsDt", //컬럼명
            type: "input",
            value: "",
            searchLevel: "3",
        },
    ];

    const tableList = [
        {
            title: "사용자관리",
            middleName: "기준정보 관리",
            detailName: "권한그룹정보관리",
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
                currentPage="authorGroup"
                addBtn={addBtn}
            />
        </>
    );
}

export default PermissionGroupMgmt;
