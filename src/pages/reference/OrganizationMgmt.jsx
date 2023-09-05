import React, { useState } from "react";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import DataTable from "components/DataTable/DataTable";
import { locationPath } from "constants/locationPath";

/** 기준정보관리-원가기준관리-조직부서정보관리 */
function OrganizationMgmt() {
    const [returnKeyWord, setReturnKeyWord] = useState("");

    const columns = [
        {
            header: "조직ID",
            col: "orgId",
            cellWidth: "30%",
            enable: false,
            modify: true,
            add: true,
            require: true,
        },
        {
            header: "조직이름",
            col: "orgNm",
            cellWidth: "30%",
            modify: true,
            add: true,
            require: true,
        },
        {
            header: "조직코드",
            col: "orgCd",
            cellWidth: "30%",
            modify: true,
            add: true,
            require: true,
        },
        {
            header: "조직설명",
            col: "orgDc",
            cellWidth: "30%",
            modify: true,
            add: true,
            require: true,
        },
        { header: "작성일", col: "createDate", cellWidth: "30%" },
        { header: "작성자", col: "createIdBy", cellWidth: "30%" },
        { header: "수정일", col: "lastModifyDate", cellWidth: "30%" },
        { header: "수정자", col: "lastModifiedUserName", cellWidth: "30%" },
    ];

    const conditionList = [
        {
            title: "조직ID",
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
        {
            title: "작성일",
            colName: "createDate",
            type: "datepicker",
            searchLevel: "1",
        },
    ];

    const handleReturn = (value) => {
        setReturnKeyWord(value);
    };

    const addBtn = [""];
    return (
        <>
            <Location pathList={locationPath.OrganizationMgmt} />
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
