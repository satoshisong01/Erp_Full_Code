import React, { useState } from "react";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import DataTable from "components/DataTable/DataTable";

/** 기준정보관리-원가기준관리-권한그룹정보관리 */
function PermissionGroupMgmt() {
    const [returnKeyWord, setReturnKeyWord] = useState("");

    const columns = [
        { header: "ID", col: "groupId", cellWidth: "30%" },
        { header: "그룹명", col: "groupNm", cellWidth: "30%" },
        { header: "그룹코드", col: "groupCode", cellWidth: "30%" },
        { header: "가입일자", col: "groupCreatDe", cellWidth: "30%" },
        { header: "전화번호", col: "mbTelNm", cellWidth: "30%" },
        { header: "권한", col: "sbsDt", cellWidth: "30%" },
        { header: "작성일", col: "createDate", cellWidth: "30%" },
        { header: "작성자", col: "createIdBy", cellWidth: "30%" },
        { header: "수정일", col: "lastModifyDate", cellWidth: "30%" },
        { header: "수정자", col: "lastModifiedUserName", cellWidth: "30%" },
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
