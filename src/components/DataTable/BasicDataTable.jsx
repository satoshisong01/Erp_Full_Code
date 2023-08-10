import React from "react";

export default function BasicDataTable({ colums, data, datatableRef }) {
    return (
        <table className="table-content" ref={datatableRef}>
            <thead>
                <tr className="table-row table-header">
                    {colums.map((column, index) => (
                        <th key={index} className={column.className}>
                            {column.header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="flex-column">
                {data.map((rowData, rowIndex) => (
                    <tr key={rowIndex} className="table-row">
                        {rowData.data.map((cellData, colIndex) => (
                            <td key={colIndex} className={`${colums[colIndex].className} ${rowData.className[colIndex]}`}>
                                {cellData}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};