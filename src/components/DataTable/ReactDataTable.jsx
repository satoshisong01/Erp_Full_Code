import React, { useEffect, useMemo, useState } from "react";
import DataTableButton from "components/button/DataTableButton";
import { axiosFetch, axiosPost } from "api/axiosFetch";
import { useTable, usePagination, useSortBy, useRowSelect } from "react-table";

const ReactDataTable = (props) => {
    const {
        returnKeyWord,
        columns,
        suffixUrl,
        currentPage,
        dummyData,
        newRowData,
        addBtn,
        flag,
        currentTask,
    } = props;

    const [tableData, setTableData] = useState([]);
    const [selectDatas, setSelectDatas] = useState([]);
    const pageSizeOptions = [5, 10, 15, 20, 30, 50, 100];
    const [isEditing, setIsEditing] = useState(flag);

    /* 최초 실행, 데이터 초기화  */
    useEffect(() => {
        fetchAllData();
    }, []);
    
    useEffect(() => {
        setIsEditing(flag);
    }, [flag]);

    useEffect(() => {
        
        if(!isEditing) {
            //저장할떄 데이터가 바뀌었는지 확인하고 저장
            console.log("react-table 계획 저장> ", currentTask, ": ", tableData);
        }
    }, [isEditing]);


    // useEffect(() => {
    //     console.log("테이블데이터: ", tableData);
    // }, [tableData])

    // useEffect(() => {
    //     console.log("셀렉트데이터: ", selectDatas);
    // }, [selectDatas]);

    // useEffect(() => {
    //     console.log("columns: ", columns);
    // }, [columns])

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

    /* 검색 */
    // useEffect(() => {
    //     if (returnKeyWord) {
    //         searchData(returnKeyWord);
    //     }
    // }, [returnKeyWord]);

    /* 서버에서 전체 데이터 호출 */
    const fetchAllData = async () => {
        // if (suffixUrl === "") return;
        // const url = `/api${suffixUrl}/${currentPage}/listAll.do`;
        // const requestData = { useAt: "Y" };
        // const resultData = await axiosFetch(url, requestData);
        
        /* column과 서버 데이터의 column이 일치하는지 확인, 불일치시 삭제 error */
        // const keys = Object.keys(resultData[0])
        // const col = columns.map((arr) => arr.col);
        // col.forEach((col) => { //비권장
        //     if (!keys.includes(col)) {
        //         console.log("⚠️Column not found:", col);
        //         resultData.forEach((data) => {
        //             data[col] = null;
        //         })
        //     }
        // })

        // if (resultData) {
        //     setTableData([resultData]);
        // }
        setTableData([]);
    };

    /* 데이터 수정 */
    const modifyClick = async () => {
        if (suffixUrl === "") return;
    };

    /* 데이터 삭제 */
    const deleteClick = async () => {
        if (suffixUrl === "") return;
    };

    /* 새로고침 */
    const refreshClick = () => {
        fetchAllData(); // 임시
    };

    /* 데이터 추가 */
    const addClick = async (addData) => {
        if (suffixUrl === "") return;
        const url = `/api${suffixUrl}/${currentPage}/add.do`;
        const dataToSend = { ...addData };

        const resultData = await axiosPost(url, dataToSend);
        if (resultData) {
            //새로고침
            fetchAllData();
        }
    };

    /* 데이터 검색 */
    const searchData = async (returnKeyWord) => {
        if (suffixUrl === "") return;
        // const url = `/api${suffixUrl}/${currentPage}/listAll.do`;
        // const requestData = {
        //     useAt: returnKeyWord.radioOption,
        //     searchKeyword: returnKeyWord.searchKeyword,
        //     searchCondition: returnKeyWord.searchCondition,
        // };
        // const resultData = await axiosScan(url, requestData);
    };

    /* 전체 선택 시 selectDatas에 저장 또는 삭제 */
    const onSelectAll = (e) => {
        const isSelected = e.target.checked;

        if (isSelected && tableData) {
            setTableData((resultData) => {
                setSelectDatas(resultData);
                return resultData;
            });
        } else {
            setSelectDatas([]);
        }
    };

    /* 선택된 행 selectDatas에 저장 또는 삭제 */
    const onSelectRow = (e, row) => {
        const data = row.original;
        const isSelected = e.target.checked;

        if (isSelected) {
            if (!selectDatas.includes(data)) {
                setSelectDatas((prevSelectDatas) => [...prevSelectDatas, data]);
            }
        } else {
            setSelectDatas((prevSelectDatas) =>
                prevSelectDatas.filter((item) => item !== data)
            );
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
    } = useTable(
        {
            columns: columnsConfig,
            data: tableData,
            initialState: { pageIndex: 0, pageSize: 10 }, // 초기값
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
                                onClick={onSelectAll}
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
                                onClick={(e) => onSelectRow(e, row)}
                                className="table-checkbox"
                                indeterminate="false"
                            />
                        </div>
                    ),
                    width: 35,
                },
                ...columns,
            ]);
        }
    );

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
        columns.forEach((column) => {
            newRow[column.col] = null; //초기화
        });

        setTableData((prevData) => [newRow, ...prevData]);
    };

    const onDeleteRow = (row) => {
        const rowId = row.index;
        const updateTableData = tableData.filter((_, index) => index !== rowId)
        setTableData([...updateTableData])
    };

    return (
        <>
            <div className="flex-between mg-b-20 mg-t-20">
                <div className="page-size">
                    <span className="mg-r-10">페이지 크기 :</span>
                    <select
                        className="select"
                        value={pageSize}
                        onChange={(e) => {
                            const newSize = Number(e.target.value);
                            setPageSize(newSize); // 페이지 크기 변경
                            gotoPage(0); // 첫 페이지로 이동
                        }}>
                        {pageSizeOptions.map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>
                <DataTableButton
                    deleteClick={deleteClick}
                    refreshClick={refreshClick}
                    addBtn={addBtn ? addBtn : []}
                    columns={columns}
                    suffixUrl={suffixUrl}
                    selectedData={selectDatas}
                />
            </div>
            
            <table {...getTableProps()} className="table-styled">
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
                                    style={{ width: column.width }}
                                    >
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
                            {/* 수정 중일 때는 "Save" 버튼을, 아닐 때는 "Edit All" 버튼을 표시 */}
                            {isEditing && (
                                <th style={{ width: '70px', textAlign: 'center' }}>
                                    <button className="btn-primary" onClick={onAddRow} style={{margin: 0}}>추가</button>
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
                                style={{ borderBottom: "1px solid #ddd" }} // 아이템 사이에 선 추가
                            >
                                {row.cells.map((cell, cellIndex) => (
                                    <td
                                        {...cell.getCellProps()}
                                        className={cellIndex === 0 ? "first-column"  : "other-column"}
                                    >
                                        {cell.column.id === "selection" ? (
                                            cell.render("Cell")
                                        ) : isEditing ? (
                                            cell.column.type === "input" ? (
                                                <input
                                                    type="text"
                                                    value={
                                                        tableData[row.index] && tableData[row.index][cell.column.id] !== undefined
                                                            ? tableData[row.index][cell.column.id] || ""
                                                            : cell.value
                                                    }
                                                    name={cell.column.id}
                                                    onChange={(e) => onChange(e, row)}
                                                />
                                            ) : cell.column.type === "select" ? (
                                                <select
                                                    value={
                                                        tableData[row.index] && tableData[row.index][cell.column.id] !== undefined
                                                            ? tableData[row.index][cell.column.id] || ""
                                                            : cell.value
                                                    }
                                                    onChange={(e) => onChange(
                                                        row.index, cell.column.id, e.target.value
                                                    )}
                                                >
                                                    {cell.column.options.map((option) => (
                                                        <option key={option.value} value={option.value}>
                                                            {option.label}
                                                        </option>
                                                    ))}
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
                                    <td style={{ textAlign: 'center' }}>
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
                    처음
                </button>
                <button
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}>
                    이전
                </button>
                <span>
                    페이지 {pageIndex + 1} / {pageOptions.length}
                </span>
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    다음
                </button>
                <button
                    onClick={() => gotoPage(pageCount - 1)}
                    disabled={!canNextPage}>
                    마지막
                </button>
            </div>
        </>
    );
};

export default ReactDataTable;
