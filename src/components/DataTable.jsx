import React, { useEffect, useRef, useState } from 'react';
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-dt/js/dataTables.dataTables";
import axios from 'axios';

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
        fetchAllData();
    }, []);


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
                prevSelectedData.filter((data) => data[columns[0].col] !== item[columns[0].col])
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

        try {
            const options = {
                headers: {
                    Authorization: process.env.REACT_APP_POST
                }
            };

            const requestData = {useAt: "Y"};

            const response = await axios.post(
                `http://192.168.0.113:8080/api${suffixUrl}/${currentPage}/listAll.do`,
                requestData, options
            );

            setTableData(response.data.result.resultData);

        } catch (error) {
            console.error("fetchAllData() error:", error);
        }
    };

    return (
        <div className="tableBody">
            <div className="widget-body">
                {isSearching && <div>Loading...</div>}
                {!isSearching && (
                    <>
                        <div className="tableBox">
                            <table ref={dataTableRef} className="table table-bordered" id="dataTable">
                                <thead>
                                    <tr>
                                        <th className="tableHeaderTh">
                                            <input
                                                type="checkbox"
                                                checked={isCheck}
                                                onChange={selectAllData}
                                            />
                                        </th>
                                        {columns.map((column, index) => (
                                            <th key={index}>{column.header}</th>
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
                                                    onClick={(e) => {
                                                        onClick(e, item[column.col])
                                                    }}
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
