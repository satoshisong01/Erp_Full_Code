import React, { useState, useEffect, useRef, useContext } from "react";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-dt/js/dataTables.dataTables";
import "./PopUp.css";

/* 영업상세내역 */
const LaborSummaryDoc = () => {
    const [tableData, setTableData] = useState([]);

    const Columns = [
        { header: "Description", col: "pgNm", className: "flex-col-2" },
        { header: "Position", col: "estPosition", className: "flex-col-2" },
        { header: "M", col: "estMm1", className: "flex-col-2" },
        { header: "M+1", col: "estMm2", className: "flex-col-2" },
        { header: "M+2", col: "estMm3", className: "flex-col-2" },
        { header: "M+3", col: "estMm4", className: "flex-col-2" },
        { header: "M+4", col: "estMm5", className: "flex-col-2" },
        { header: "M+5", col: "estMm6", className: "flex-col-2" },
        { header: "M+6", col: "estMm7", className: "flex-col-2" },
        { header: "M+7", col: "estMm8", className: "flex-col-2" },
        { header: "M+8", col: "estMm9", className: "flex-col-2" },
        { header: "M+9", col: "estMm10", className: "flex-col-2" },
        { header: "M+10", col: "estMm11", className: "flex-col-2" },
        { header: "M+11", col: "estMm12", className: "flex-col-2" },
        { header: "M+12", col: "estMm13", className: "flex-col-2" },
        { header: "M+13", col: "estMm14", className: "flex-col-2" },
        { header: "M+14", col: "estMm15", className: "flex-col-2" },
        { header: "M+15", col: "estMm16", className: "flex-col-2" },
        { header: "M+16", col: "estMm17", className: "flex-col-2" },
        { header: "M+17", col: "estMm18", className: "flex-col-2" },
        { header: "M+18", col: "estMm19", className: "flex-col-2" },
        { header: "M+19", col: "estMm20", className: "flex-col-2" },
        { header: "M+20", col: "estMm21", className: "flex-col-2" },
        { header: "M+21", col: "estMm22", className: "flex-col-2" },
        { header: "M+22", col: "estMm23", className: "flex-col-2" },
        { header: "M+23", col: "estMm24", className: "flex-col-2" },
        { header: "Total", col: "total", className: "flex-col-2" },
        { header: "UnitPrice", col: "unitPrice", className: "flex-col-2" },
        { header: "Amount", col: "amount", className: "flex-col-2" },
        { header: "Remarks", col: "estDesc", className: "flex-col-2" },
    ];

    // URL에서 쿼리 문자열 파라미터를 읽는 함수
    function getQueryParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
        const results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return "";
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    console.log(tableData, "tableData");

    useEffect(() => {
        // URL에서 "data" 파라미터 읽기
        const dataParameter = getQueryParameterByName("data");
        const data = JSON.parse(dataParameter);
        setTableData(data.tableData);
    }, []);

    return (
        <div className="precost-container">
            <div className="flex-column mg-t-20 mg-b-20">
                <table id="example" className="display">
                    <thead>
                        <tr>
                            {Columns.map((column, index) =>
                                // Check if all values for the column are null
                                column.col.startsWith("estMm") && tableData.every((row) => row[column.col] === null) ? null : (
                                    <th key={index} className={column.className}>
                                        {column.header}
                                    </th>
                                )
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((rowData, rowIndex) => (
                            <tr key={rowIndex}>
                                {Columns.map((column, colIndex) =>
                                    // Check if all values for the column are null
                                    column.col.startsWith("estMm") && rowData[column.col] === null ? null : (
                                        <td key={colIndex} className={column.className}>
                                            {rowData[column.col]}
                                        </td>
                                    )
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LaborSummaryDoc;
