import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

const TableWithCopyButton = () => {
    const [tableData, setTableData] = useState([
        { id: 1, name: "John", age: 25 },
        { id: 2, name: "Jane", age: 30 },
        { id: 3, name: "Mike", age: 35 },
    ]);
    const [copied, setCopied] = useState(false);

    const copyTableData = () => {
        const headers = Object.keys(tableData[0]).join("\t");
        const dataString = `${headers}\n${tableData
            .map((row) => Object.values(row).join("\t"))
            .join("\n")}`;

        navigator.clipboard.writeText(dataString);
        setCopied(true);
    };

    return (
        <div>
            {/*<table>
                <thead>
                    <tr>
                        {Object.keys(tableData[0]).map((key) => (
                            <th key={key}>{key}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((row) => (
                        <tr key={row.id}>
                            {Object.values(row).map((value, index) => (
                                <td key={index}>{value}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>*/}
            <CopyToClipboard text="Copy Table" onCopy={copyTableData}>
                <button>Copy Table</button>
            </CopyToClipboard>
            {copied ? <span>Copied!</span> : null}
        </div>
    );
};

export default TableWithCopyButton;
