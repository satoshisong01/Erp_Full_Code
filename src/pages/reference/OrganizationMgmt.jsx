import React, { useState } from "react";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import DataTable from "components/DataTable/DataTable";

/** 기준정보관리-원가기준관리-조직부서정보관리 */
function OrganizationMgmt() {
    const [returnKeyWord, setReturnKeyWord] = useState("");

    const columns = [
        {
            header: "조직ID",
            col: "orgId",
            cellWidth: "30%",
            update: false,
            updating: true,
            write: true,
            require: true,
        },
        {
            header: "조직이름",
            updating: true,
            write: true,
            require: true,
            col: "orgNm",
            cellWidth: "30%",
        },
        {
            header: "조직코드",
            updating: true,
            write: true,
            require: true,
            col: "orgCd",
            cellWidth: "30%",
        },
        {
            header: "조직설명",
            updating: true,
            write: true,
            require: true,
            col: "orgDc",
            cellWidth: "30%",
        },
        { header: "작성일", col: "createDate", cellWidth: "30%" },
        { header: "작성자", col: "createIdBy", cellWidth: "30%" },
        { header: "수정일", col: "lastModifyDate", cellWidth: "30%" },
        { header: "수정자", col: "lastModifiedUserName", cellWidth: "30%" },
    ];

    const conditionList = [
        {
            title: "ID",
            colName: "orgId", //컬럼명
            type: "input",
            value: "",
            searchLevel: "1",
        },
        {
            title: "조직이름",
            colName: "orgNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "2",
        },
    ];

    const tableList = [
        {
            title: "사용자관리",
            middleName: "기준정보 관리",
            detailName: "조직부서정보관리",
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
                currentPage="orgNzt"
                addBtn={addBtn}
            />
        </>
    );
}

export default OrganizationMgmt;
