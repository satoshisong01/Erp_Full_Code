import React, { useState } from "react";
import { Link } from "react-router-dom";
import store from "store/configureStore";
import { tabActive } from "components/tabs/TabsActions";
import { default as EgovLeftNav } from "components/leftmenu/EgovLeftNavSales";
import EstimateMgmts from "./EstimateMgmt/EstimateMgmts";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import DataTable from "components/DataTable/DataTable";
import DataTableDummy from "components/DataTable/DataTableDummy";

/** 영업관리-견적서관리 */
function Quotation() {
    const [returnKeyWord, setReturnKeyWord] = useState("");

    const columns = [
        {
            header: "프로젝트명",
            col: "projectName",
            cellWidth: "20%",
            update: false,
            updating: true,
            write: true,
        },
        {
            header: "지출일",
            col: "byeDay",
            cellWidth: "20%",
            updating: true,
            write: true,
        },
        {
            header: "금액",
            col: "won",
            cellWidth: "50%",
            updating: true,
            write: true,
        },
        { header: "비고", col: "beeGo", cellWidth: "20%" },
        { header: "구분", col: "gooBoom", cellWidth: "20%" },
    ];

    const conditionList = [
        {
            title: "분류코드",
            colName: "clCode", //컬럼명
            type: "input",
            value: "",
            searchLevel: "1",
        },
        {
            title: "분류코드명",
            colName: "clCodeNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "2",
        },
        {
            title: "분류코드설명",
            colName: "clCodeDc", //컬럼명
            type: "input",
            value: "",
            searchLevel: "3",
        },
        {
            title: "이름",
            colName: "name",
            type: "select",
            option: [
                { value: "다섯글자의옵션1" },
                { value: "다섯글자의옵션2" },
            ],
            searchLevel: "3",
        },
    ];

    const tableList = [
        {
            title: "수주(사업)관리",
            middleName: "영업관리",
            detailName: "견적서관리",
        },
    ];

    const handleReturn = (value) => {
        setReturnKeyWord(value);
        console.log(value, "제대로 들어오냐");
    };

    const addBtn = ["costPage"];

    const dummyData = [
        {
            projectName: "PS 하부서편",
            byeDay: "2월31일",
            won: "5,000,000",
            beeGo: "beeGo",
            gooBoom: "계획",
        },
        {
            projectName: "PS 하부서편",
            byeDay: "2월31일",
            won: "5,000,000",
            beeGo: "beeGo",
            gooBoom: "계획",
        },
    ];

    return (
        <>
            <Location tableList={tableList} />
            <SearchList conditionList={conditionList} onSearch={handleReturn} />
            <DataTableDummy
                returnKeyWord={returnKeyWord}
                columns={columns}
                suffixUrl="/system/code"
                currentPage="clCode"
                addBtn={addBtn}
                dummyData={dummyData}
            />
        </>
    );
}

export default Quotation;
