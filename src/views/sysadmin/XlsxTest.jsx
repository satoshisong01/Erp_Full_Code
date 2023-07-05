import React, { useEffect, useState } from "react";
import XLSX from "xlsx-js-style";
import axios from "axios";

export default function XlsxTest() {
    const [data, setData] = useState([]);
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(
                "http://192.168.0.113:8080/dummy/list"
            );
            console.log(response.data.data);
            setData(response.data.data);
        } catch (error) {
            console.error("에럽니다 삐융삐융", error);
        }
    };

    const addData = async () => {
        try {
            const inputData = JSON.parse(inputValue);
            const response = await axios.post(
                "http://192.168.0.113:8080/dummy/add",
                inputData
            );
            console.log(response.data);
            fetchData();
            setInputValue("");
        } catch (error) {
            console.error("에럽니다 삐융삐융", error);
        }
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleRefresh = () => {
        fetchData();
    };

    // STEP 1: 새로운 workbook을 만든다
    const wb = XLSX.utils.book_new();

    // STEP 2: 데이터 rows에 대한 value와 style을 지정해준다.
    const header =
        data.length > 0
            ? Object.keys(data[0]).map((key) => ({
                  v: key,
                  t: "s",
                  s: {
                      font: {
                          sz: "15",
                      },
                      border: {
                          top: {
                              //  style: "thin",
                              color: { rgb: "000000" }, // 검은색
                          },
                          bottom: {
                              //  style: "thin",
                              color: { rgb: "000000" }, // 검은색
                          },
                          left: {
                              //  style: "thin",
                              color: { rgb: "000000" }, // 검은색
                          },
                          right: {
                              //  style: "thin",
                              color: { rgb: "000000" }, // 검은색
                          },
                      },
                  },
              }))
            : [];

    // STEP 3: 바디 생성
    const body = data.map((item) =>
        Object.values(item).map((value) => ({
            v: value,
            t: "s",
            s: { font: { color: { rgb: "188038" } } },
        }))
    );

    // STEP 3: header와 body로 worksheet를 생성한다.
    const ws = XLSX.utils.aoa_to_sheet([header, ...body]);

    // 열의 너비를 조정
    const columnWidths = header.map((col) => ({ wch: 30 }));
    ws["!cols"] = columnWidths;

    // worksheet를 workbook에 추가한다.
    XLSX.utils.book_append_sheet(wb, ws, "readme demo");

    return (
        <div>
            <h1>xlsx-js-style</h1>
            <button
                onClick={() => {
                    // STEP 4: Write Excel file to browser (2번째 인자에는 파일명을 지정)
                    XLSX.writeFile(wb, "table-demo.xlsx");
                }}
            >
                Download Excel File(.xlsx)
            </button>
            <h1>데이터를 가지고옵시다</h1>
            <div>
                {data.length > 0 ? (
                    data.map((item) => <div>{item.dpmCd}</div>)
                ) : (
                    <div>No data available</div>
                )}
            </div>
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="데이터 입력"
            />
            <button onClick={addData}>데이터 추가</button>
            <button onClick={handleRefresh}>새로고침</button>
        </div>
    );
}
