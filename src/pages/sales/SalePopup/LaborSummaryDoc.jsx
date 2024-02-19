import React, { useState, useEffect, useRef, useContext } from "react";
import "./PopUp.css";
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/* 영업상세내역 */
const LaborSummaryDoc = () => {
    const [tableData, setTableData] = useState([]);
    const [title, setTitle] = useState("");
    const [count, setCount] = useState(0);

    const pdfContentRef = useRef(null);

    //const generatePDF = () => {
    //    const input = pdfContentRef.current;
    //    let element = document.getElementById("element-to-print");
    //    if (input) {
    //        const options = {
    //            filename: "견적인건비_요약.pdf", // 출력 파일 이름
    //            jsPDF: { unit: "in", format: "letter", orientation: "landscape" },
    //        };

    //        const pdfDoc = new jsPDF(options.jsPDF);

    //        // 페이지 1
    //        html2pdf(element).toPdf((pdf) => {
    //            pdfDoc.addPage();
    //            pdfDoc.addImage(pdf.output("datauristring"), 0, 0);
    //        });

    //        // 페이지 2
    //        let element2 = document.getElementById("element-to-print-page2");
    //        html2pdf(element2).toPdf((pdf2) => {
    //            pdfDoc.addPage();
    //            pdfDoc.addImage(pdf2.output("datauristring"), 0, 0);
    //        });

    //        // 최종적으로 저장
    //        pdfDoc.save("견적인건비_요약_2페이지.pdf");
    //    }
    //};

    const generatePDF = () => {
        const input = pdfContentRef.current;
        let element = document.getElementById("element-to-print");
        if (input) {
            const options = {
                filename: "견적인건비_요약.pdf", // 출력 파일 이름
                jsPDF: { unit: "in", format: "letter", orientation: "landscape" },
            };

            html2pdf().from(element).set(options).save();

            html2pdf(input, options).save();
        }
    };

    const Columns = [
        { header: "Description", col: "pgNm" },
        { header: "Position", col: "estPosition" },
        { header: "M", col: "estMm1" },
        { header: "M1", col: "estMm2" },
        { header: "M2", col: "estMm3" },
        { header: "M3", col: "estMm4" },
        { header: "M4", col: "estMm5" },
        { header: "M5", col: "estMm6" },
        { header: "M6", col: "estMm7" },
        { header: "M7", col: "estMm8" },
        { header: "M8", col: "estMm9" },
        { header: "M9", col: "estMm10" },
        { header: "M10", col: "estMm11" },
        { header: "M11", col: "estMm12" },
        { header: "M12", col: "estMm13" },
        { header: "M13", col: "estMm14" },
        { header: "M14", col: "estMm15" },
        { header: "M15", col: "estMm16" },
        { header: "M16", col: "estMm17" },
        { header: "M17", col: "estMm18" },
        { header: "M18", col: "estMm19" },
        { header: "M19", col: "estMm20" },
        { header: "M20", col: "estMm21" },
        { header: "M21", col: "estMm22" },
        { header: "M22", col: "estMm23" },
        { header: "M23", col: "estMm24" },
        { header: "Total", col: "total" },
        { header: "UnitPrice", col: "unitPrice" },
        { header: "Amount", col: "amount" },
        { header: "Remarks", col: "estDesc" },
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
        const { label } = data;
        setTitle(label);
        const updatedTableData = data.tableData.map((rowData) => {
            let total = 0;
            let unitPrice = 0;
            let amount = 0;
            let estDesc = "";
            for (let j = 1; j <= 24; j++) {
                const propName = `estMm${j}`;
                if (rowData[propName] !== null) {
                    total += rowData[propName];
                }
            }
            unitPrice = rowData.estUnitPrice;
            amount = rowData.price;
            estDesc = rowData.estDesc ? rowData.estDesc : "";
            console.log(rowData, "???");
            return { ...rowData, total, unitPrice, amount, estDesc };
        });

        setTableData(updatedTableData);
    }, []);

    useEffect(() => {
        findMaxCount(tableData);
    }, [tableData]);

    //숫자반환
    function findMaxCount(data) {
        let maxCount = 0;

        // Iterate over each array in the data
        for (let i = 0; i < data.length; i++) {
            const currentArray = data[i];
            let count = 0;

            // Iterate over the properties of the current array
            for (let j = 1; j <= 24; j++) {
                const propName = `estMm${j}`;

                // Check if the property exists and has a non-null value
                if (currentArray[propName] !== null && currentArray[propName] !== 0) {
                    count++;
                }
            }

            // Update maxCount if the current count is greater
            if (count > maxCount) {
                maxCount = count;
            }
        }

        console.log(maxCount);
        setCount(maxCount);
        return maxCount;
    }
    return (
        <div className="precost-container">
            <div className="precost-title" style={{ margin: "auto", marginBottom: "20px", fontSize: "25px", textAlign: "center" }}>
                {title}
            </div>
            <div style={{ display: "flex", margin: "10px" }} ref={pdfContentRef}>
                <div className="flex-column mg-t-20 mg-b-20">
                    <table id="example" className="display">
                        <thead>
                            <tr>
                                <th colSpan={2} rowSpan={2} style={{ textAlign: "center", width: "150px", border: "solid 1px gray" }}>
                                    Description
                                </th>
                                <th colSpan={count} style={{ width: `${count * 40}px`, textAlign: "center", border: "solid 1px gray" }}>
                                    M/M
                                </th>
                                <th colSpan={1} rowSpan={2} style={{ textAlign: "center", width: "40px", border: "solid 1px gray" }}>
                                    Total
                                </th>
                                <th colSpan={1} rowSpan={2} style={{ textAlign: "center", width: "60px", border: "solid 1px gray" }}>
                                    Unit Price
                                </th>
                                <th colSpan={1} rowSpan={2} style={{ textAlign: "center", width: "90px", border: "solid 1px gray" }}>
                                    Amount
                                </th>
                                <th colSpan={1} rowSpan={2} style={{ textAlign: "center", width: "70px", border: "solid 1px gray" }}>
                                    Remarks
                                </th>
                            </tr>
                            <tr>
                                {Columns.map((column, index) => {
                                    if (
                                        column.col === "pgNm" ||
                                        column.col === "estPosition" ||
                                        column.col === "unitPrice" ||
                                        column.col === "amount" ||
                                        column.col === "estDesc" ||
                                        column.col === "total" ||
                                        (column.col.startsWith("estMm") && tableData.every((row) => row[column.col] === null || row[column.col] === 0))
                                    ) {
                                        return null;
                                    }
                                    return (
                                        <th key={index} className={column.className} style={{ textAlign: "center", border: "solid 1px gray" }}>
                                            {column.header}
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((rowData, rowIndex) => (
                                <tr key={rowIndex}>
                                    {Columns.map((column, colIndex) => {
                                        if (column.col.startsWith("estMm") && tableData.every((row) => row[column.col] === null || row[column.col] === 0)) {
                                            return null;
                                        }

                                        const cellValue = rowData[column.col];

                                        return (
                                            <td key={colIndex} className={column.className} style={{ border: "solid 1px gray" }}>
                                                {cellValue !== null && cellValue !== 0 ? cellValue.toLocaleString() : null}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <button onClick={generatePDF}>라이브러리PDF</button>
        </div>
    );
};

export default LaborSummaryDoc;
