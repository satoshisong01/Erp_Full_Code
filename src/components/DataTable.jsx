import React, { useEffect, useRef, useState } from "react";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-dt/js/dataTables.dataTables";
import { axiosFetch } from "api/axiosFetch";

const DataTable = (props) => {
    const { isSearching, columns, suffixUrl, currentPage } = props;

    const [isCheck, setIsCheck] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [selectedData, setSelectedData] = useState([]);
    const dataTableRef = useRef(null);

    useEffect(() => {
        console.log("⭕ check box select: ", selectedData);
    }, [selectedData]);

    useEffect(() => {
        fetchAllData(); /* 맨 처음 전체 데이터 불러오기 */
    }, []);

    useEffect(() => {
        const updateColumnWidth = () => {
            /* 컬럼의 너비를 동적으로 설정 */
            const thElements = dataTableRef.current.querySelectorAll("th:not(.tableHeaderTh)");
            const tdElements = dataTableRef.current.querySelectorAll("td");
            const elementsLength = Math.min(thElements.length, tdElements.length, columns.length);
            for (let i = 0; i < elementsLength; i++) {
                thElements[i].style.width = columns[i].cellWidth;
                tdElements[i].style.width = columns[i].cellWidth;
            }
        };
        updateColumnWidth();
    }, [columns]);

    const selectAllData = (e) => {
        const checked = e.target.checked;
        setIsCheck(checked);

        if (checked) {
            setSelectedData([...tableData]);
        } else {
            setSelectedData([]);
        }
    };

    const ItemCheckboxClick = (item, e) => {
        const checked = e.target.checked;
        if (checked) {
            setSelectedData((prevSelectedData) => [...prevSelectedData, item]);
        } else {
            setSelectedData((prevSelectedData) =>
                prevSelectedData.filter(
                    (data) => data[columns[0].col] !== item[columns[0].col]
                )
            );
        }
    };

    /* column click */
    const onClick = (e, item) => {
        console.log("⭕ click item: ", item);
    };

    /* 서버에서 전체 데이터 가져오기 */
    const fetchAllData = async () => {
        if (suffixUrl === "") return;
        const url = `/api${suffixUrl}/${currentPage}/listAll.do`;
        const requestData = { lockAt: "Y" };

        const resultData = await axiosFetch(url, requestData);
        setTableData(resultData);
    };

    return (
        <div className="tableBody">
            <div className="widget-body">
                {isSearching && <div>Loading...</div>}
                {!isSearching && (
                    <>
                        <div className="tableBox">
                            <table
                                ref={dataTableRef}
                                className="table table-bordered"
                                id="dataTable"
                            >
                                <thead>
                                    <tr>
                                        <th className="tableHeaderTh" style={{ width: "25px" }}>
                                            <input
                                                type="checkbox"
                                                checked={isCheck}
                                                onChange={selectAllData}
                                            />
                                        </th>
                                        {columns.map((column, index) => (
                                            <th key={index}  style={{ width: column.cellWidth }}>
                                                {column.header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData.map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedData.some(
                                                        (selectedItem) => selectedItem[columns[0].col] === item[columns[0].col]
                                                    )}
                                                    onChange={(e) => ItemCheckboxClick(item, e)}
                                                />
                                            </td>
                                            {columns.map((column, colIndex) => (
                                                <td
                                                    key={colIndex}
                                                    onClick={(e) => {onClick(e, item[column.col]);}}
                                                >
                                                    {item[column.col]}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default DataTable;
