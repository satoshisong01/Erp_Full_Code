import React, { useEffect, useRef, useState } from "react";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-dt/js/dataTables.dataTables";
import {
    axiosDelete,
    axiosFetch,
    axiosPost,
    axiosScan,
    axiosUpdate,
} from "api/axiosFetch";
import $ from "jquery";
import "../../css/componentCss/Code.css";
import DataPutModal from "./DataPutModal";
import DataTableButton from "components/button/DataTableButton";
import DataPostModal from "./DataPostModal";

const TableBody = ({
    tableData,
    selectedData,
    columns,
    ItemCheckboxClick,
    handleModalClick,
    getNestedData,
}) => {
    return (
        <tbody>
            {tableData.map((item, index) => (
                <tr key={index}>
                    <td>
                        <input
                            type="checkbox"
                            id="checkBoxItem"
                            checked={selectedData.some(
                                (selectedItem) =>
                                    selectedItem[columns[0].col] ===
                                    item[columns[0].col]
                            )}
                            onChange={(e) => ItemCheckboxClick(item, e)}
                        />
                    </td>
                    {columns.map((column, colIndex) => (
                        <td
                            //onMouseEnter={() => setShowTooltip(true)}
                            //onMouseLeave={() => setShowTooltip(false)}
                            className="tdStyle"
                            key={colIndex}
                            onDoubleClick={(e) => handleModalClick(e, item)}>
                            {getNestedData(item, column.col) || "No data yet."}
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    );
};

const DataTable = (props) => {
    const { returnKeyWord, columns, suffixUrl, currentPage, addBtn } = props;

    const [modalItem, setModalItem] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [postModalOpen, setPostModalOpen] = useState(false);
    const [isCheck, setIsCheck] = useState(false);
    const [selectedData, setSelectedData] = useState([]);
    const [tableData, setTableData] = useState([]);
    const dataTableRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const addData = columns[columns.length - 1].listItem;
    const addListURL = columns[columns.length - 1].addListURL;
    const [saveList, setSaveList] = useState([]);
    const [showTooltip, setShowTooltip] = useState(false);
    const [currentPages, setCurrentPages] = useState(1);
    const [pageLength, setPageLength] = useState(10);

    useEffect(() => {
        console.log("⭕ check box select: ", selectedData);
    }, [selectedData]);

    useEffect(() => {
        fetchAllData();
    }, [currentPages]);

    useEffect(() => {
        updateColumnWidth();
    }, [columns]);

    useEffect(() => {
        if (returnKeyWord) {
            searchData(returnKeyWord);
        }

        const loadingTimeout = setTimeout(() => {
            setIsLoading(false);
        }, 5000);

        return () => {
            clearTimeout(loadingTimeout);
        };
    }, [returnKeyWord]);

    const removeInt = columns[0].col;
    const changeInt = selectedData.map((item) => item[removeInt]);

    const changePage = (newPage) => {
        setCurrentPages(newPage);
    };

    const updateColumnWidth = () => {
        if (dataTableRef.current) {
            const thElements = dataTableRef.current.querySelectorAll(
                "th:not(.tableHeaderTh)"
            );
            const elementsLength = Math.min(thElements.length, columns.length);
            for (let i = 0; i < elementsLength; i++) {
                thElements[i].style.width = columns[i].cellWidth;
            }
        }
    };

    const selectAllData = (e) => {
        const checked = e.target.checked;
        setIsCheck(checked);

        if (checked) {
            const currentPageItems = tableData.slice(
                (currentPages - 1) * pageLength,
                currentPages * pageLength
            );
            setSelectedData([...currentPageItems]);
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

    const onClick = (e, item) => {
        console.log("⭕ click item: ", item);
    };

    const fetchAllData = async () => {
        setIsLoading(true);
        if (suffixUrl === "") return;

        const url = `/api${suffixUrl}/${currentPage}/listAll.do`;
        const requestData = { lockAt: "Y" };
        const resultData = await axiosFetch(url, requestData);

        if (resultData) {
            $(dataTableRef.current).DataTable().destroy();
            setTableData(resultData);
        }
        setIsLoading(false);
    };

    const updateData = async (updatedData) => {
        console.log(updatedData, "수정된값");
        if (suffixUrl === "") return;

        const url = `/api${suffixUrl}/${currentPage}/edit.do`;
        const requestData = { ...updatedData, lockAt: "Y", userAt: "Y" };
        const resultData = await axiosUpdate(url, requestData);

        const updatedTableData = tableData.map((item) =>
            item[columns[0].col] === updatedData[columns[0].col]
                ? updatedData
                : item
        );
        setTableData(updatedTableData);

        if (resultData) {
            $(dataTableRef.current).DataTable().destroy();
            fetchAllData();
            alert("값을 변경했습니다💚💚");
        }
    };

    // 나머지 코드 (deleteData, postData, searchData 등)

    /* 데이터 삭제 */
    const deleteData = async () => {
        if (suffixUrl === "") return;
        const url = `/api${suffixUrl}/${currentPage}/removeAll.do`;
        // API 호출 등의 로직 실행
        //const resultData = await axiosDelete(url, {
        //    data: changeInt,
        //});
        const resultData = await axiosDelete(url, {
            data: changeInt,
        });

        if (resultData) {
            setSelectedData([]);
            $(dataTableRef.current).DataTable().destroy();
            fetchAllData();
            alert("삭제되었습니다🧹🧹");
        }
    };

    /* 데이터 추가하기 */
    const postData = async (postData) => {
        setIsLoading(true); // 로딩 화면 활성화
        console.log(postData, "받아온데이터");
        if (suffixUrl === "") return;
        const url = `/api${suffixUrl}/${currentPage}/add.do`;
        const requestData = { ...postData, lockAt: "Y", userAt: "Y" };

        if (postData === "") {
            alert("값이 비었습니다");
            return;
        }

        // API 호출 등의 로직 실행
        const resultData = await axiosPost(url, requestData);
        console.log(resultData, "결과값");

        if (resultData) {
            $(dataTableRef.current).DataTable().destroy();
            fetchAllData();
            alert("추가 되었습니다!✅✅✅✅");
        }
        setIsLoading(false); // 로딩 화면 활성화
    };

    /* 데이터 검색하기 */
    const searchData = async (returnKeyWord) => {
        console.log(returnKeyWord, "받아온데이터");

        const sendData = Object.values(returnKeyWord.searchKeyword).map(
            (value) => value
        );
        console.log(sendData, "뽑아둔 데이터");

        const separatedData = sendData.map((item) => `${item}`).join(", ");
        console.log(separatedData, "나눈 데이터");
        console.log(typeof separatedData);

        if (suffixUrl === "") return;
        const url = `/api${suffixUrl}/${currentPage}/listAll.do`;
        const requestData = {
            useAt: returnKeyWord.radioOption,
            searchKeyword: separatedData,
            searchCondition: returnKeyWord.searchCondition,
        };
        console.log(requestData, "여기까지찍히나?");
        // API 호출 등의 로직 실행
        const resultData = await axiosScan(url, requestData);
        console.log(resultData, "결과값을 봐야지");
        fetchAllData();
    };

    const handleModalClick = (e, item) => {
        setModalItem(item);
        setModalOpen(true);
    };

    const deleteClick = () => {
        console.log("삭제버튼 클릭");
        deleteData();
    };

    const addClick = async () => {
        setIsLoading(true);
        if (addData) {
            let url = `/api${suffixUrl}/${addListURL}/listAll.do`;
            let requestData = { lockAt: "Y" };
            let resultData = await axiosFetch(url, requestData);
            console.log(resultData, "추가버튼시 값을불러와야함");

            console.log(addData);
            let clCodeValues = resultData.map((item) => item[addData]);
            setSaveList(clCodeValues);
            console.log(saveList, "값이안들어가?");
            setPostModalOpen(true);
        }
        setPostModalOpen(true);
        setIsLoading(false);
    };

    const excelClick = () => {};

    const copyClick = () => {
        const headers = columns.map((item) => item.header);
        const fields = columns.map((item) => item.col);

        console.log(headers, "헤더");
        console.log(fields, "필ㄷ");

        const headersString = headers.join("\t\t");
        const dataString = `${headersString}\n${selectedData
            .map((item) => fields.map((field) => item[field]).join("\t"))
            .join("\n")}`;

        navigator.clipboard.writeText(dataString);
        alert("테이블이 복사되었습니다!");
    };
    const printClick = () => {
        console.log("출력!");
    };
    // 나머지 코드 (excelClick, copyClick, printClick 등)

    const getNestedData = (obj, path) => {
        const properties = path.split(".");
        let value = obj;

        for (const property of properties) {
            if (value && value.hasOwnProperty(property)) {
                value = value[property];
            } else if (
                value.productGroup &&
                value.productGroup.hasOwnProperty(property)
            ) {
                value = value.productGroup[property];
            } else {
                return null;
            }
        }

        return value;
    };

    return (
        <>
            <div className="buttonBody">
                <DataTableButton
                    deleteClick={deleteClick}
                    excelClick={excelClick}
                    copyClick={copyClick}
                    addClick={addClick}
                    printClick={printClick}
                    dataTableRef={dataTableRef}
                    fetchAllData={fetchAllData}
                    addBtn={addBtn}
                    columns={columns}
                    suffixUrl={suffixUrl}
                    selectedData={selectedData}
                />
            </div>
            {isLoading ? (
                <div className="Loading">
                    <div className="spinner"></div>
                    <div> Loading... </div>
                </div>
            ) : (
                <div className="tableBody" id="print-content">
                    <div className="widget-body">
                        <>
                            <div className="tableBox">
                                <table
                                    ref={dataTableRef}
                                    className="table table-bordered"
                                    id="dataTable">
                                    <thead>
                                        <tr>
                                            <th
                                                className="tableHeaderTh"
                                                id="checkBoxAll">
                                                <input
                                                    id="thCheckBox"
                                                    type="checkbox"
                                                    checked={isCheck}
                                                    onChange={selectAllData}
                                                />
                                            </th>
                                            {columns.map((column, index) => {
                                                if (column.notView) {
                                                    return null;
                                                }
                                                return (
                                                    <th key={index}>
                                                        {column.header}
                                                    </th>
                                                );
                                            })}
                                        </tr>
                                    </thead>
                                    <TableBody
                                        tableData={tableData}
                                        selectedData={selectedData}
                                        columns={columns}
                                        ItemCheckboxClick={ItemCheckboxClick}
                                        handleModalClick={handleModalClick}
                                        getNestedData={getNestedData}
                                    />
                                </table>
                            </div>
                        </>
                    </div>
                    {modalOpen && (
                        <DataPutModal
                            onClose={() => {
                                setModalOpen(false);
                            }}
                            columns={columns}
                            initialData={modalItem}
                            updateData={updateData}
                            getNestedData={getNestedData}
                        />
                    )}
                    {postModalOpen && (
                        <DataPostModal
                            postData={postData}
                            columns={columns}
                            saveList={saveList}
                            onClose={() => {
                                setPostModalOpen(false);
                            }}
                        />
                    )}
                </div>
            )}
        </>
    );
};

export default DataTable;
