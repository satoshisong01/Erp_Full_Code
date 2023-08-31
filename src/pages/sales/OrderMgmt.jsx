import React, { useState } from "react";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import FormDataTable from "components/DataTable/FormDataTable";
import ReactDataTable from "components/DataTable/ReactDataTable";

/** 영업관리-수주등록관리 */
function OrderMgmt() {
    const columns = [
        { header: "프로젝트 이름", col: "poiNm", cellWidth: '50%', type: "input"},
        { header: "프로젝트 코드", col: "poiCode", cellWidth: '25%', type: "input"},
        { header: "수주시작일", col: "poiBeginDt", cellWidth: '25%', type: "select", options: [{value: '1', label: 'op1'}, {value: '2', label: 'op2'}]},
    ];

    const conditionList = [
        {
            title: "프로젝트 이름",
            colName: "poiNm",
            type: "input",
            value: "",
            searchLevel: "1",
        },
        {
            title: "담당자",
            colName: "poiManagerId",
            type: "input",
            value: "",
            searchLevel: "2",
        },
    ];

    const tableList = [
        {
            title: "수주(사업)관리",
            middleName: "영업관리",
            detailName: "수주(사업)관리",
        },
    ];

    const formTableColumns = [
        [
            {
                label: "프로젝트 이름",
                key: "poiNm",
                type: "input",
                colSpan: "3",
                require: true,
            },
            {
                label: "프로젝트 코드",
                key: "poiCode",
                type: "input",
                colSpan: "3",
                require: true,
            },
        ],
        [
            {
                label: "수주부서",
                key: "poiGroupId",
                type: "select",
                option: ["PA", "PS", "FMCS", "HMI"],
                require: true,
            },
            {
                label: "매출부서",
                key: "poiSalesGroupId",
                type: "select",
                option: ["PA", "PS", "FMCS", "HMI"],
                require: true,
            },
            {
                label: "영업대표",
                key: "poiSalmanagerId",
                type: "input",
                require: true,
            },
            { label: "PM", key: "poiManagerId", type: "input", require: true },
        ],
        [
            { label: "수주 시작일", key: "poi_begin_dt", type: "input", require: true },
            { label: "수주 마감일", key: "poi_end_dt", type: "input", require: true },
            {
                label: "사전원가 기준 이익률",
                key: "standardMargin",
                type: "input",
            },
            { label: "상태", key: "poiStatus" },
        ],
    ];

    const [returnKeyWord, setReturnKeyWord] = useState("");
    const [newRowData, setNewRowData] = useState({});

    const handleReturn = (value) => {
        setReturnKeyWord(value);
    };

    const onAddRow = (rowData) => {
        setNewRowData(rowData);
    };

    const addBtn = ["planPage", "calPage"];

    return (
        <>
            <Location tableList={tableList} />
            <SearchList conditionList={conditionList} onSearch={handleReturn} />
            <ReactDataTable
                returnKeyWord={returnKeyWord}
                columns={columns}
                newRowData={newRowData}
                suffixUrl="/baseInfrm/product"
                currentPage="pjOrdrInfo"
                addBtn={addBtn}
            />
            <FormDataTable
                formTableColumns={formTableColumns}
                onAddRow={onAddRow}
                title="프로젝트 신규 등록"
            />
        </>
    );
}

export default OrderMgmt;
