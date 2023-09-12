import React, { useContext, useState } from "react";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import DataTable from "components/DataTable/DataTable";
import { locationPath } from "constants/locationPath";
import ReactDataTable from "components/DataTable/ReactDataTable";
import { PageContext } from "components/PageProvider";
/** 실행관리-경비관리 */
function ExpenseMgmt() {

    // const { showDetailTable } = useContext(PageContext);

    const columns = [ //프로젝트 목록
        { header: "프로젝트 이름", col: "poiNm", cellWidth: "50%" },
        { header: "계획 경비", col: "vendor", cellWidth: "25%" },
        { header: "실행 경비", col: "contactPerson", cellWidth: "25%" },
    ];
    const detailColumns = [ //프로젝트 경비
        { header: "연월", col: "pjbgDt", cellWidth: "20%",  update: false, updating: true, write: true, },
        { header: "시작일", col: "pjbgBeginDT", cellWidth: "20%", updating: true, write: true, },
        { header: "종료일", col: "pjbgEndDt", cellWidth: "20%" },
        { header: "경비종류", col: "pjbgTypeCode", cellWidth: "20%" },
        { header: "비고", col: "pjbgbDesc", cellWidth: "20%" },
    ];

    const conditionList = [ 
        {
            title: "프로젝트명",
            colName: "clCode", //컬럼명
            type: "input",
            value: "",
            searchLevel: "1",
        },
        {
            title: "기간검색",
            colName: "selectedDate",
            type: "datepicker",
            searchLevel: "0",
        },
        {
            title: "출장인",
            colName: "clCodeNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "2",
        },
    ];

    return (
        <>
            <Location pathList={locationPath.ExpenseMgmt} />
            {/* <SearchList conditionList={conditionList} onSearch={handleReturn} /> */}
            <ReactDataTable
                columns={columns}
                suffixUrl="/baseInfrm/product/pjbudget"
                defaultPageSize={5}
            />
            <ReactDataTable
                columns={detailColumns}
                detailUrl="/baseInfrm/product/pjbudget"
                defaultPageSize={10}
            />
        </>
    );
}

export default ExpenseMgmt;
