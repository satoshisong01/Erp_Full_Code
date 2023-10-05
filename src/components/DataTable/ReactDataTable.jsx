import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { axiosDelete, axiosFetch, axiosPost, axiosScan, axiosUpdate } from "api/axiosFetch";
import { useTable, usePagination, useSortBy, useRowSelect } from "react-table";
import { PageContext } from "components/PageProvider";
import DataPutModal from "./DataPutModal";
import DataPostModal2 from "./DataPostModal2";
import DeleteModal from "components/modal/DeleteModal";
import ModalSearchPgNm from "components/modal/ModalSearchPgNm";
import ModalPagePgNm from "components/modal/ModalPagePgNm";

const ReactDataTable = (props) => {
    const { columns, suffixUrl, flag, detailUrl, customDatas, defaultPageSize, tableRef, setLengthSelectRow } = props;
    const { nameOfButton, setNameOfButton, newRowData, searchData, setSearchData, setCurrentTable, setIsOpenModal, currentPageName, prevPageName } = useContext(PageContext);

    const [tableData, setTableData] = useState([]);
    const pageSizeOptions = [5, 10, 15, 20, 30, 50, 100];
    const [isEditing, setIsEditing] = useState(false);
    const [openModalMod, setOpenModalMod] = useState(false);
    const [openModalAdd, setOpenModalAdd] = useState(false);
    const [modalViewDatas, setModalViewDatas] = useState([]); //modal에 띄어줄 목록

    const [rowIndex, setRowIndex] = useState(0);

    /* 최초 실행, 데이터 초기화  */
    useEffect(() => {
        if (suffixUrl || detailUrl) {
            fetchAllData();
        }
        if (customDatas) {
            setTableData(customDatas);
        }
        if (tableRef) {
            setCurrentTable(tableRef);
        }
    }, [customDatas]);

    /* tab에서 컴포넌트 화면 변경 시 초기화  */
    useEffect(() => {
        if (currentPageName !== prevPageName) {
            toggleAllRowsSelected(false);
        }
    }, [currentPageName, prevPageName]);

    /* 테이블 cell에서 수정하는 경우의 on off */
    useEffect(() => {
        setIsEditing(flag);
    }, [flag]);

    /* table의 button 클릭 시 해당하는 함수 실행 */
    useEffect(() => {
        if (nameOfButton === "refresh") {
            refreshClick();
        } else if (nameOfButton === "csv") {
        } else if (nameOfButton === "copy") {
        } else if (nameOfButton === "print") {
        } else if (nameOfButton === "delete") {
            deleteClick();
        } else if (nameOfButton === "add") {
            addClick();
        } else if (nameOfButton === "modify") {
            modifyClick();
        } else if (nameOfButton === "search") {
            searchClick();
        }
        setNameOfButton(""); //초기화
    }, [nameOfButton]);

    const columnsConfig = useMemo(
        () =>
            columns.map((column) => ({
                Header: column.header,
                accessor: column.col,
                sortable: true,
                width: column.cellWidth,
                type: column.type,
                options: column.options,
            })),
        [columns]
    );

    useEffect(() => {
        //newRowData 변동 시 새로운 행 추가
        if (newRowData && Object.keys(newRowData).length !== 0) {
            addClick(newRowData);
        }
    }, [newRowData]);

    /* 서버에서 전체 데이터 호출 */
    const fetchAllData = async () => {
        if (!suffixUrl && !detailUrl) return;
        const url = `/api${suffixUrl || detailUrl}/listAll.do`;
        const resultData = await axiosFetch(url, { useAt: "Y" });
        if (resultData) {
            setTableData([...resultData]);
        } else {
            setTableData(Array(defaultPageSize).fill({})); // 빈 배열 추가
        }
    };

    /* 데이터 수정 */
    const modifyClick = async (updatedData) => {
        if (!updatedData) {
            setOpenModalMod(true);
        } else {
            // 수정데이터가 있다면
            const url = `/api${suffixUrl || detailUrl}/edit.do`;
            const requestData = { ...updatedData, lockAt: "Y", useAt: "Y" };
            const resultData = await axiosUpdate(url, requestData);
            if (resultData) {
                setTableData([resultData]);
                alert("값을 변경했습니다💚💚");
            }
        }
    };

    /* 데이터 삭제 */
    const deleteClick = async (flag) => {
        if (!suffixUrl && !detailUrl) return;
        const deleteRows = selectedFlatRows && selectedFlatRows.map((row) => row.original);

        if (!flag) {
            // 최초, 파라미터가 없을 때
            setModalViewDatas(deleteRows);
            setIsOpenModal(true);
        } else if (flag === "확인") {
            const pkColumn = columns[0].col;
            const deletePkArr = deleteRows.map((item) => item[pkColumn]);
            const url = `/api${suffixUrl || detailUrl}/removeAll.do`;
            const resultData = await axiosDelete(url, {
                data: deletePkArr,
            });
            if (resultData) {
                fetchAllData();
                alert("삭제되었습니다🧹🧹");
            }
        } else {
            setIsOpenModal(false);
        }
    };

    /* 새로고침 */
    const refreshClick = () => {
        fetchAllData();
    };

    /* 데이터 추가 */
    const addClick = async (addData) => {
        setOpenModalAdd(false);
        if (!suffixUrl && !detailUrl) return;
        if (addData && typeof addData === "object" && !Array.isArray(addData)) {
            const url = `/api${suffixUrl || detailUrl}/add.do`;
            const dataToSend = { ...addData, lockAt: "Y", useAt: "Y" };
            const resultData = await axiosPost(url, dataToSend);
            if (typeof resultData === "number") {
                alert(resultData + "error");
            } else if (resultData) {
                fetchAllData();
                alert("✅추가 완료");
            }
        } else if (!addData) {
            //파라미터로 넘어온 데이터가 없다면, 팝업으로 추가
            setOpenModalAdd(true);
        }
    };

    /* 데이터 검색 */
    const searchClick = async () => {
        if (!suffixUrl && !detailUrl) return;
        if (searchData) {
            const url = `/api${suffixUrl || detailUrl}/listAll.do`;
            const requestData = {
                useAt: searchData.radioOption,
                searchKeyword: searchData.searchKeyword,
                searchCondition: searchData.searchCondition,
            };

            const resultData = await axiosScan(url, requestData);

            setSearchData({}); //초기화
        }
    };

    /* 셀 클릭 */
    const onClickCell = (e, cell) => {
        console.log(cell.column.id, "😁😁😁😁😁😁😁");
    };

    /* 로우 클릭 */
    const onCLickRow = (row) => {
        toggleRowSelected(row.id);
        if (row.poiNm) {
            //프로젝트에 해당하는 상세 테이블
            /* 서버 통신 */
            // const url = `/api${detailUrl}/listAll.do`;
            // const requestData = { useAt: "Y" };
            // const resultData = await axiosFetch(url, requestData);
        }
    };

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        state: { pageIndex, pageSize },
        previousPage,
        nextPage,
        canPreviousPage,
        canNextPage,
        pageOptions,
        gotoPage,
        setPageSize,
        pageCount,
        selectedFlatRows, // 선택된 행 데이터
        toggleRowSelected, // 선택된 체크 박스
        toggleAllRowsSelected, // 전체선택 on off
    } = useTable(
        {
            columns: columnsConfig,
            data: tableData,
            initialState: { pageIndex: 0, pageSize: defaultPageSize || 10 }, // 초기값
        },
        useSortBy,
        usePagination,
        useRowSelect,
        (hooks) => {
            hooks.visibleColumns.push((columns) => [
                {
                    id: "selection",
                    Header: ({ getToggleAllPageRowsSelectedProps }) => (
                        <div>
                            <input type="checkbox" {...getToggleAllPageRowsSelectedProps()} className="table-checkbox" indeterminate="false" />
                        </div>
                    ),
                    Cell: ({ row }) => (
                        <div>
                            <input type="checkbox" {...row.getToggleRowSelectedProps()} className="table-checkbox" indeterminate="false" onClick={(e) => e.stopPropagation()} />
                        </div>
                    ),
                    width: 35,
                },
                ...columns,
            ]);
        }
    );

    useEffect(() => {
        if (setLengthSelectRow) {
            setLengthSelectRow(selectedFlatRows.length); // button 활성화
        }
    }, [selectedFlatRows]);

    /* 변경된 value 값을 column과 같은 이름의 변수에 담아서 테이블에 넣어줌 */
    const onChange = (e, preRow) => {
        const { name, value } = e.target;
        const newTableData = tableData.map((rowData, rowIndex) => {
            if (rowIndex === preRow.index) {
                return { ...rowData, [name]: value };
            }
            return rowData;
        });
        setTableData(newTableData);
    };

    /* 새로운 빈 row 추가 */
    const onAddRow = () => {
        const newRow = {};
        columnsConfig.forEach((column) => {
            newRow[column.accessor] = null; // 초기화
        });

        setTableData((prevData) => {
            const newData = [...prevData, { ...newRow }];
            return newData;
        });
    };

    const onDeleteRow = (row) => {
        const rowId = row.index;
        const updateTableData = tableData.filter((_, index) => index !== rowId);
        setTableData([...updateTableData]);
    };

    const pageSizeChange = (value) => {
        setPageSize(Number(value)); // 페이지 크기 변경
        gotoPage(0); // 첫 페이지로 이동
    };

    const [dataBuket, setDataBuket] = useState({});
    const [prevDataBuket, setPrevDataBuket] = useState({});

    useEffect(() => {
        setDataBuket(projectPgNm.pgNm);
        console.log(projectPgNm.pgNm, "@@@@@@@");
        //setTableData()
    }, [projectPgNm]);

    const setValueData = (rowIndex) => {
        //setRowIndex()
        setIsOpenModalPgNm(true);
        setRowIndex(rowIndex);
    };

    useEffect(() => {
        if (!isOpenModalPgNm) {
            // isOpenModalPgNm이 false로 변경된 경우에 실행할 코드를 여기에 작성

            // dataBuket 객체 자체의 참조가 변경되었을 때만 코드 실행
            if (dataBuket !== prevDataBuket) {
                const updatedTableData = [...tableData];
                if (dataBuket && updatedTableData[rowIndex]) {
                    updatedTableData[rowIndex].pgNm = dataBuket;
                    setTableData(updatedTableData);
                }

                // dataBuket 값을 업데이트할 때 prevDataBuket도 업데이트
                setPrevDataBuket(dataBuket);
                setProjectPgNm("");
            }
        }
    }, [isOpenModalPgNm, dataBuket, rowIndex, tableData, prevDataBuket]);

    console.log(tableData, "받아와서 뿌리는게 뭘까");

    useEffect(() => {
        console.log(dataBuket, "55555555555555555555");
    }, [dataBuket]);

    const handleChange = (e, rowIndex, accessor) => {
        const { value } = e.target;
        // tableData를 복제하여 수정
        const updatedTableData = [...tableData];
        updatedTableData[rowIndex][accessor] = value;
        // 수정된 데이터로 tableData 업데이트
        setTableData(updatedTableData);
    };

    return (
        <>
            <div className="flex-between mg-b-20 mg-t-20">
                <div className="page-size">
                    <span className="mg-r-10">페이지 크기 :</span>
                    <select className="select" value={pageSize} onChange={(e) => pageSizeChange(e.target.value)}>
                        {pageSizeOptions.map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <table {...getTableProps()} className="table-styled" ref={tableRef}>
                <thead>
                    {headerGroups.map((headerGroup, headerGroupIndex) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column, columnIndex) => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())} className={columnIndex === 0 ? "first-column" : ""} style={{ width: column.width }}>
                                    {column.render("Header")}
                                    <span>{column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}</span>
                                </th>
                            ))}
                            {isEditing && (
                                <th style={{ width: "70px", textAlign: "center" }}>
                                    <button className="btn-primary" onClick={onAddRow} style={{ margin: 0 }}>
                                        추가
                                    </button>
                                </th>
                            )}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row, rowIndex) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()} onClick={(e) => onCLickRow(row)}>
                                {row.cells.map((cell, cellIndex) => (
                                    <td {...cell.getCellProps()} className={cellIndex === 0 ? "first-column" : "other-column"} onClick={(e) => onClickCell(e, cell)}>
                                        {cell.column.id === "selection" ? (
                                            cell.render("Cell")
                                        ) : isEditing ? (
                                            cell.column.type === "input" ? (
                                                <input
                                                    type="text"
                                                    value={tableData[row.index] && tableData[row.index][cell.column.id] !== undefined ? tableData[row.index][cell.column.id] || cell.value : cell.value}
                                                    name={cell.column.id}
                                                    onChange={(e) => onChange(e, row)}
                                                />
                                            ) : cell.column.type === "select" ? (
                                                <select
                                                    name={cell.column.id}
                                                    defaultValue={
                                                        tableData[row.index] && tableData[row.index][cell.column.id] !== undefined
                                                            ? tableData[row.index][cell.column.id]
                                                            : cell.column.options[row.index].value || "" // 기본값: 해당 행의 인덱스에 해당하는 옵션의 value 값 또는 빈 문자열
                                                    }
                                                    onChange={(e) => onChange(e, row)}>
                                                    {cell.column.options.map((option, index) => (
                                                        <option key={index} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : cell.column.type === "button" ? (
                                                <div>
                                                    <input
                                                        id={cell.column.id}
                                                        name={cell.column.id}
                                                        onClick={() => setValueData(rowIndex)}
                                                        type="text"
                                                        placeholder={projectPgNm.pgNm ? projectPgNm.pgNm : `품목그룹명을 선택해 주세요.`}
                                                        value={tableData[rowIndex].pgNm || ""}
                                                        onChange={(e) => handleChange(e, rowIndex, cell.column.id)}
                                                        readOnly
                                                    />
                                                </div>
                                            ) : (
                                                cell.render("Cell")
                                            )
                                        ) : (
                                            cell.render("Cell")
                                        )}
                                    </td>
                                ))}
                                {isEditing && (
                                    <td style={{ textAlign: "center" }}>
                                        <button className="btnR btn-primary redDelete" onClick={() => onDeleteRow(row)}>
                                            삭제
                                        </button>
                                    </td>
                                )}
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div className="pagination">
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {" "}
                    처음{" "}
                </button>
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                    {" "}
                    이전{" "}
                </button>
                <span>
                    {" "}
                    페이지 {pageIndex + 1} / {pageOptions && pageOptions.length}{" "}
                </span>
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    {" "}
                    다음{" "}
                </button>
                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    {" "}
                    마지막{" "}
                </button>
            </div>

            {openModalMod && (
                <DataPutModal
                    columns={columns}
                    initialData={selectedFlatRows[0]}
                    updateData={modifyClick}
                    onClose={() => {
                        setOpenModalMod(false);
                    }}
                />
            )}
            {openModalAdd && (
                <DataPostModal2
                    columns={columns}
                    postData={addClick}
                    fetchAllData={fetchAllData}
                    // errorOn={errorOn}
                    // handleSendLoading={handleSendLoading}
                    onClose={() => {
                        setOpenModalAdd(false);
                    }}
                />
            )}

            <DeleteModal viewData={modalViewDatas} onConfirm={deleteClick} />
        </>
    );
};

export default ReactDataTable;
