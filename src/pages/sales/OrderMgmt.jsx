import React, { useState } from "react";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import DataTable from "components/DataTable/DataTable";

/** 영업관리-수주관리 */
function OrderMgmt() {
    const [returnKeyWord, setReturnKeyWord] = useState("");

    const columns = [
        {
            header: "분류코드",
            col: "clCode",
            cellWidth: "20%",
            update: false,
            updating: true,
            write: true,
        },
        {
            header: "분류코드명",
            col: "clCodeNm",
            cellWidth: "20%",
            updating: true,
            write: true,
        },
        {
            header: "분류코드설명",
            col: "clCodeDc",
            cellWidth: "50%",
            updating: true,
            write: true,
        },
        { header: "작성자", col: "createIdBy", cellWidth: "20%" },
        { header: "작성일", col: "createDate", cellWidth: "20%" },
        { header: "수정자", col: "lastModifiedIdBy", cellWidth: "20%" },
        { header: "수정일", col: "lastModifyDate", cellWidth: "20%" },
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
            detailName: "수주(사업)관리",
        },
    ];

    const handleReturn = (value) => {
        setReturnKeyWord(value);
        console.log(value, "제대로 들어오냐");
    };

    const addBtn = ["planPage", "calPage"];

    const dummyData = [
        {
            name: "PS 하부서편",
            code: "P001",
            startDate: "2022/10/24",
            currency: "원화",
            vendor: "SDS",
            contactPerson: "",
            endDate: "2022/12/30",
            orderAmount: "78,600,000",
            Invoice: "",
            status: "작성중",
        },
        {
            name: "드림클래스 2.0 후속과제 개발",
            code: "P002",
            startDate: "2023/01/05",
            currency: "원화",
            vendor: "미라콤",
            contactPerson: "손영훈 부장",
            endDate: "2023/6/12",
            orderAmount: "194,881,000",
            Invoice: "",
            status: "수주진행중",
        },
    ];

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
                dummyData={dummyData}
            />
        </>
    );
}

export default OrderMgmt;
