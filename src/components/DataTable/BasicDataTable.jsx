import React from "react";

export default function BasicDataTable({ colums, data, datatableRef, tableStyle, subtitle }) {
    const tableContainerStyle = {
        ...tableStyle,
        overflowY: "auto", // 내용이 넘칠 때 세로 스크롤 생성
    };

    const theadStyle = {
        position: "sticky",
        top: 0,
        backgroundColor: "white",
        zIndex: 1,
    };

    return (
        <>
            <div className="table-sub">
                { subtitle }
            </div>
            <div style={tableContainerStyle}>
                <table className="table-content" ref={datatableRef}>
                    <thead style={theadStyle}>
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
            </div>
        </>
    );
};
