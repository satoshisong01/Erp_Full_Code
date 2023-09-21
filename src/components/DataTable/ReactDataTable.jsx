import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { axiosFetch, axiosPost, axiosScan, axiosUpdate } from "api/axiosFetch";
import { useTable, usePagination, useSortBy, useRowSelect } from "react-table";
import { PageContext } from "components/PageProvider";
import DataPutModal from "./DataPutModal";
import DataPostModal2 from "./DataPostModal2";

const ReactDataTable = (props) => {
    // 컴포넌트가 닫힐때 초기화 해야함
    const {
        columns,
        suffixUrl,
        flag,
        detailUrl,
        customDatas,
        defaultPageSize,
        tableRef,
        selectList,
    } = props;
    const {
        nameOfButton,
        setNameOfButton,
        newRowData,
        searchData,
        setSearchData,
        setCurrentTable,
        projectInfo,
        setLengthSelectRow,
    } = useContext(PageContext);

    const [tableData, setTableData] = useState([]);
    const pageSizeOptions = [5, 10, 15, 20, 30, 50, 100];
    const [isEditing, setIsEditing] = useState(false);
    const [openModalMod, setOpenModalMod] = useState(false);
    const [openModalAdd, setOpenModalAdd] = useState(false);

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

    useEffect(() => {
        fetchAllData(projectInfo.poiId);
    }, [projectInfo.poiId]);

    useEffect(() => {
        setIsEditing(flag);
    }, [flag]);

    useEffect(() => {}, [tableData]);

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

    /* newRowData 변동 시 새로운 행 추가 */
    useEffect(() => {
        if (newRowData && Object.keys(newRowData).length !== 0) {
            addClick(newRowData);
        }
    }, [newRowData]);

    /* 서버에서 전체 데이터 호출 */
    const fetchAllData = async () => {
        let url = "";
        if (suffixUrl) {
            // 기본 조회
            url = `/api${suffixUrl}/listAll.do`;
        } else if (detailUrl) {
            // 상세내역 조회
            url = `/api${detailUrl}/listAll.do`;
        } else return;
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
            if (suffixUrl === "" || suffixUrl === undefined) return;
            const url = `/api${suffixUrl}/edit.do`;
            const requestData = { ...updatedData, lockAt: "Y", useAt: "Y" };

            const resultData = await axiosUpdate(url, requestData);

            if (resultData) {
                setTableData(resultData);
                console.log(tableData, "바뀌고 난값");
                alert("값을 변경했습니다💚💚");
            }
        }
    };

    /* 데이터 삭제 */
    const deleteClick = async () => {
        if (suffixUrl === "") return;
        if (selectedFlatRows.length > 0) {
            /* 데이터 삭제 로직 추가 해야 함 */
        }
    };

    /* 새로고침 */
    const refreshClick = () => {
        fetchAllData(); // 임시
    };

    /* 데이터 추가 */
    const addClick = async (addData) => {
        if (suffixUrl === "") return;
        if (addData && typeof addData === "object" && !Array.isArray(addData)) {
            // 객체 row 추가
            const url = `/api${suffixUrl}/add.do`;
            const dataToSend = { ...addData, lockAt: "Y", useAt: "Y" };
            const resultData = await axiosPost(url, dataToSend);
            if (resultData) {
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
        if (suffixUrl === "") return;
        if (searchData) {
            const url = `/api${suffixUrl}/listAll.do`;
            const requestData = {
                useAt: searchData.radioOption,
                searchKeyword: searchData.searchKeyword,
                searchCondition: searchData.searchCondition,
            };

            const resultData = await axiosScan(url, requestData);
            // console.log("❤️ 서치데이터 결과: ", resultData);

            setSearchData({}); //초기화
        }
    };

    /* 셀 클릭 */
    const onClickCell = (e, cell) => {
        // console.log("⭐ cell click: ", e.target, cell);
    };

    /* 로우 클릭 */
    const onCLickRow = (row) => {
        toggleRowSelected(row.id);
        // console.log("⭐ row click - index: ", index, ", data:", rowData);
        if (row.poiNm) {
            //프로젝트에 해당하는 상세 테이블
            /* 서버 통신 */
            // const url = `/api${detailUrl}/listAll.do`;
            // const requestData = { useAt: "Y" };
            // const resultData = await axiosFetch(url, requestData);
            // console.log("⭐ 상세 테이블: ", row.poiNm);
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
        selectedFlatRows, //선택된 행 데이터
        toggleRowSelected,
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
                            <input
                                type="checkbox"
                                {...getToggleAllPageRowsSelectedProps()}
                                className="table-checkbox"
                                indeterminate="false"
                            />
                        </div>
                    ),
                    Cell: ({ row }) => (
                        <div>
                            <input
                                type="checkbox"
                                {...row.getToggleRowSelectedProps()}
                                className="table-checkbox"
                                indeterminate="false"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    ),
                    width: 35,
                },
                ...columns,
            ]);
        }
    );

    useEffect(() => {
        if (selectedFlatRows) {
            setLengthSelectRow(selectedFlatRows.length); // button 활성화
        }
    }, [selectedFlatRows]);

    const onChange = (e, preRow) => {
        console.log(e, "나오나 타겟값");
        const { name, value } = e.target;
        const newTableData = tableData.map((rowData, rowIndex) => {
            if (rowIndex === preRow.index) {
                return { ...rowData, [name]: value };
            }
            return rowData;
        });
        setTableData(newTableData);
    };

    const onChangeSelect = (a, b, c) => {
        let testCount = "";
        c.forEach((item) => {
            if (item.value === a.target.value) {
                testCount = item.value;
            }
        });
        // b.index번 배열의 pjbgTypeCode 값을 testCount로 대체
        const updatedTableData = [...tableData];
        updatedTableData[b.index].pjbgTypeCode = testCount;

        // 대체된 tableData를 state로 설정
        setTableData(updatedTableData);

        console.log(testCount);
        console.log(tableData, "변경한값은??@@@@!@!@");
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

    const tableOnClick = () => {
        setCurrentTable(tableRef);
    };

    const pageSizeChange = (value) => {
        setPageSize(Number(value)); // 페이지 크기 변경
        gotoPage(0); // 첫 페이지로 이동
    };

    console.log(tableData, "받아와서 뿌리는게 뭘까");

    return (
        <>
            <div className="flex-between mg-b-20 mg-t-20">
                <div className="page-size">
                    <span className="mg-r-10">페이지 크기 :</span>
                    <select
                        className="select"
                        value={pageSize}
                        onChange={(e) => pageSizeChange(e.target.value)}>
                        {pageSizeOptions.map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <table
                {...getTableProps()}
                className="table-styled"
                onClick={tableOnClick}>
                <thead>
                    {headerGroups.map((headerGroup, headerGroupIndex) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column, columnIndex) => (
                                <th
                                    {...column.getHeaderProps(
                                        column.getSortByToggleProps()
                                    )}
                                    className={
                                        columnIndex === 0 ? "first-column" : ""
                                    }
                                    style={{ width: column.width }}>
                                    {column.render("Header")}
                                    <span>
                                        {column.isSorted
                                            ? column.isSortedDesc
                                                ? " 🔽"
                                                : " 🔼"
                                            : ""}
                                    </span>
                                </th>
                            ))}
                            {isEditing && (
                                <th
                                    style={{
                                        width: "70px",
                                        textAlign: "center",
                                    }}>
                                    <button
                                        className="btn-primary"
                                        onClick={onAddRow}
                                        style={{ margin: 0 }}>
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
                            <tr
                                {...row.getRowProps()}
                                onClick={(e) => onCLickRow(row)}>
                                {row.cells.map((cell, cellIndex) => (
                                    <td
                                        {...cell.getCellProps()}
                                        className={
                                            cellIndex === 0
                                                ? "first-column"
                                                : "other-column"
                                        }
                                        onClick={(e) => onClickCell(e, cell)}>
                                        {cell.column.id === "selection" ? (
                                            cell.render("Cell")
                                        ) : isEditing ? (
                                            cell.column.type === "input" ? (
                                                <input
                                                    type="text"
                                                    value={
                                                        tableData[row.index] &&
                                                        tableData[row.index][
                                                            cell.column.id
                                                        ] !== undefined
                                                            ? tableData[
                                                                  row.index
                                                              ][
                                                                  cell.column.id
                                                              ] || cell.value
                                                            : cell.value
                                                    }
                                                    name={cell.column.id}
                                                    onChange={(e) =>
                                                        onChange(e, row)
                                                    }
                                                />
                                            ) : cell.column.type ===
                                              "select" ? (
                                                <select
                                                    name={cell.column.id}
                                                    defaultValue={
                                                        tableData[row.index] &&
                                                        tableData[row.index][
                                                            cell.column.id
                                                        ] !== undefined
                                                            ? tableData[
                                                                  row.index
                                                              ][cell.column.id]
                                                            : cell.column
                                                                  .options[
                                                                  row.index
                                                              ].value || "" // 기본값: 해당 행의 인덱스에 해당하는 옵션의 value 값 또는 빈 문자열
                                                    }
                                                    onChange={(e) =>
                                                        onChangeSelect(
                                                            e,
                                                            row,
                                                            cell.column.options
                                                        )
                                                    }>
                                                    {cell.column.options.map(
                                                        (option, index) => (
                                                            <option
                                                                key={index}
                                                                value={
                                                                    option.value
                                                                }>
                                                                {option.label}
                                                            </option>
                                                        )
                                                    )}
                                                </select>
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
                                        <button
                                            className="btnR btn-primary redDelete"
                                            onClick={() => onDeleteRow(row)}>
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
                <button
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}>
                    {" "}
                    이전{" "}
                </button>
                <span>
                    {" "}
                    페이지 {pageIndex + 1} / {pageOptions.length}{" "}
                </span>
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    {" "}
                    다음{" "}
                </button>
                <button
                    onClick={() => gotoPage(pageCount - 1)}
                    disabled={!canNextPage}>
                    {" "}
                    마지막{" "}
                </button>
            </div>

            {/*{openModalMod && (
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
                    selectList={selectList}
                    fetchAllData={fetchAllData}
                    // errorOn={errorOn}
                    // handleSendLoading={handleSendLoading}
                    onClose={() => {
                        setOpenModalAdd(false);
                    }}
                />
            )}*/}
        </>
    );
};

export default ReactDataTable;
