import React, { useState, useEffect, useRef, useContext } from "react";
import "./PopUp.css";
import html2pdf from "html2pdf.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faPrint } from "@fortawesome/free-solid-svg-icons";

/* 영업상세내역 */
const OrderSummaryDoc = () => {
    const [tableData, setTableData] = useState([]);
    const [title, setTitle] = useState("");
    const [count, setCount] = useState(0);

    const pdfContentRef = useRef(null);

    const generatePDF = () => {
        const input = pdfContentRef.current;
        let element = document.getElementById("element-to-print");
        if (input) {
            const options = {
                filename: "견적구매비_요약.pdf", // 출력 파일 이름
                jsPDF: { unit: "in", format: "letter", orientation: "landscape" },
            };

            html2pdf().from(element).set(options).save();

            html2pdf(input, options).save();
        }
    };

    const printFn = () => {
        alert("출력합니다");

        // titleInput 클래스명을 가진 input 요소들의 border 값을 변경
        const inputs = document.querySelectorAll(".titleInput");
        inputs.forEach((input) => {
            input.style.border = "none";
        });
        const printButton = document.getElementById("printButton");
        printButton.style.display = "none"; // 프린트 버튼 숨기기
        window.print();
    };

    const Columns = [
        { header: "Item", col: "pgNm" },
        { header: "Modal", col: "pdiNum" },
        { header: "Description", col: "pdiStnd" },
        { header: "Q'ty", col: "estBuyQunty" },
        { header: "Amount", col: "amount" },
        { header: "Amount2", col: "amount" },
        { header: "Amount3", col: "amount" },
        { header: "Amount4", col: "amount" },
        { header: "Amount5", col: "amount" },
        { header: "Remarks", col: "estBuyDesc" },
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
        console.log(data, "3333");
        const { label } = data;
        setTitle(label);
        const updatedTableData = data.tableData.map((rowData) => {
            let amount = 0;
            let estDesc = "";
            amount = rowData.price;
            estDesc = rowData.estDesc ? rowData.estDesc : "";
            console.log(rowData, "???");
            return { ...rowData, amount, estDesc };
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
                                <th colSpan={2} style={{ textAlign: "center", width: "150px" }}>
                                    Item
                                </th>
                                <th colSpan={1} style={{ textAlign: "center", width: "150px" }}>
                                    Description
                                </th>
                                <th colSpan={1} style={{ textAlign: "center", width: "40px" }}>
                                    Q'ty
                                </th>
                                <th colSpan={1} style={{ textAlign: "center", width: "60px" }}>
                                    Consumer Price
                                </th>
                                <th colSpan={1} style={{ textAlign: "center", width: "90px" }}>
                                    Consumer Amount
                                </th>
                                <th colSpan={1} style={{ textAlign: "center", width: "70px" }}>
                                    Unit Price
                                </th>
                                <th colSpan={1} style={{ textAlign: "center", width: "70px" }}>
                                    Amount
                                </th>
                                <th colSpan={1} style={{ textAlign: "center", width: "70px" }}>
                                    D/C(%)
                                </th>
                                <th colSpan={1} style={{ textAlign: "center", width: "70px" }}>
                                    Remarks (Maker)
                                </th>
                            </tr>
                            <tr>
                                {Columns.map((column, index) => {
                                    if (
                                        column.col === "pgNm" ||
                                        column.col === "pdiNum" ||
                                        column.col === "pdiStnd" ||
                                        column.col === "estBuyQunty" ||
                                        column.col === "amount" ||
                                        column.col === "estBuyDesc"
                                    ) {
                                        return null;
                                    }
                                    return (
                                        <th key={index} className={column.className} style={{ textAlign: "center" }}>
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
                                        const cellValue = rowData[column.col];
                                        const formattedValue = typeof cellValue === "number" ? cellValue.toLocaleString() : cellValue;
                                        return (
                                            <td key={colIndex} className={column.className}>
                                                {formattedValue}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <button id="printButton" onClick={() => printFn()} style={{ position: "fixed", top: "10px", right: "10px" }}>
                <FontAwesomeIcon icon={faPrint} style={{ color: "red" }} />
                (저장)출력
            </button>
        </div>
    );
};

export default OrderSummaryDoc;
