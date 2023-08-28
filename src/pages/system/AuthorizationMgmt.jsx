import React, { useState } from "react";
import { Link } from "react-router-dom";
import store from "store/configureStore";
import { selectLnb } from "components/tabs/TabsActions";
import AuthorManages from "./AuthorManage/AuthorManages";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import DataTable from "components/DataTable/DataTable";

/** 시스템관리-권한관리 */
function AuthorizationMgmt() {
    const [returnKeyWord, setReturnKeyWord] = useState("");

    const columns = [
        {
            header: "권한코드",
            col: "name",
            cellWidth: "30%",
            update: false,
            updating: true,
            write: true,
        },
        {
            header: "권한명",
            col: "code",
            cellWidth: "30%",
            updating: true,
            write: true,
        },
        {
            header: "권한설명",
            col: "startDate",
            cellWidth: "30%",
            updating: true,
            write: true,
        },
        { header: "권한생성일", col: "currency", cellWidth: "30%" },
    ];

    const conditionList = [
        {
            title: "권한코드",
            colName: "clCode", //컬럼명
            type: "input",
            value: "",
            searchLevel: "1",
        },
        {
            title: "권한명",
            colName: "clCodeNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "2",
        },
        {
            title: "권한설명",
            colName: "clCodeNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "2",
        },
    ];

    const tableList = [
        {
            title: "권한관리",
            middleName: "실행관리",
            detailName: "권한관리",
        },
    ];

    const handleReturn = (value) => {
        setReturnKeyWord(value);
        console.log(value, "제대로 들어오냐");
    };

    const addBtn = [""];
    return (
        <>
            <Location tableList={tableList} />
            <SearchList conditionList={conditionList} onSearch={handleReturn} />
            <DataTable
                returnKeyWord={returnKeyWord}
                columns={columns}
                suffixUrl="/system/code"
                currentPage="clCode"
                addBtn={addBtn}
            />
        </>
    );
}

export default AuthorizationMgmt;
