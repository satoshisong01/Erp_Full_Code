import React, { useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import { locationPath } from "constants/locationPath";
import { axiosFetch } from "api/axiosFetch";
import ReactDataTable from "components/DataTable/ReactDataTable";
import { ReorganizeData } from "components/DataTable/function/ReorganizeData";

/** 기준정보관리-원가기준관리-급별단가(경비) */
function GradeWageExpense() {
    const [tableData, setTableData] = useState([]);
    const gradeWageExpenseTable = useRef(null);

    const columns = [
        { header: "단가ID", col: "gupId", cellWidth: "0", type: "input", notView: true },
        { header: "기준명", col: "gupDesc", cellWidth: "100", type: "input" },
        { header: "임원", col: "gupPrice1", cellWidth: "100", type: "input" },
        { header: "특급기술사", col: "gupPrice2", cellWidth: "100", type: "input" },
        { header: "고급기술사", col: "gupPrice3", cellWidth: "100", type: "input" },
        { header: "중급기술사", col: "gupPrice4", cellWidth: "100", type: "input" },
        { header: "초급기술사", col: "gupPrice5", cellWidth: "100", type: "input" },
        { header: "고급기능사", col: "gupPrice6", cellWidth: "100", type: "input" },
        { header: "중급기능사", col: "gupPrice7", cellWidth: "100", type: "input" },
        { header: "초급기능사", col: "gupPrice8", cellWidth: "100", type: "input" },
        { header: "부장", col: "gupPrice9", cellWidth: "100", type: "input" },
        { header: "차장", col: "gupPrice10", cellWidth: "100", type: "input" },
        { header: "과장", col: "gupPrice11", cellWidth: "100", type: "input" },
        { header: "대리", col: "gupPrice12", cellWidth: "100", type: "input" },
        { header: "주임", col: "gupPrice13", cellWidth: "100", type: "input" },
        { header: "사원", col: "gupPrice14", cellWidth: "100", type: "input" },
    ];

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        const url = `/api/baseInfrm/product/gradeunitPrice/type/g/listAll.do`;
        const requestData = { useAt: "Y" };
        const resultData = await axiosFetch(url, requestData);
        console.log(resultData, "resultData");
        setTableData(ReorganizeData(resultData));
    };

    useEffect(() => {
        console.log(tableData, "tableData");
    }, [tableData]);

    return (
        <>
            <Location pathList={locationPath.GradeWageExpense} />
            <ReactDataTable
                columns={columns}
                customDatas={tableData}
                //suffixUrl="/api/baseInfrm/product/gradeunitPrice/type/g"
                tableRef={gradeWageExpenseTable}
                //setLengthSelectRow={setLengthSelectRow}
                viewPageName={{ name: "급별단가(경비)", id: "GradeWageExpense" }}
            />
        </>
    );
}

export default GradeWageExpense;
