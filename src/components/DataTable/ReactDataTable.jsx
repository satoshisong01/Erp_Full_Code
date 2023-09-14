import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { axiosFetch, axiosPost, axiosScan } from "api/axiosFetch";
import { useTable, usePagination, useSortBy, useRowSelect } from "react-table";
import { PageContext } from "components/PageProvider";

const ReactDataTable = (props) => {

    // 컴포넌트가 닫힐때 초기화 해야함
    const { columns, suffixUrl, flag, detailUrl, defaultPageSize, tableRef } = props;
    const {
        nameOfButton, setNameOfButton, newRowData, setNewRowData, searchData, currentTable,
        setSearchData, setIsOpenModal, codeForProject, setCurrentTable
    } = useContext(PageContext);

    const [tableData, setTableData] = useState([]);
    const pageSizeOptions = [5, 10, 15, 20, 30, 50, 100];
    const [isEditing, setIsEditing] = useState(false);

    /* 최초 실행, 데이터 초기화  */
    useEffect(() => {
        fetchAllData();

        if(tableRef) {
            setCurrentTable(tableRef)
            console.log("❤️ DOM: ", tableRef);
        }
    }, []);


    useEffect(() => {
        setIsEditing(flag);
    }, [flag]);

    useEffect(() => {
    }, [tableData]);

    useEffect(() => {
        if(nameOfButton === 'refresh') {
            refreshClick();
        } else if(nameOfButton === 'csv') {
            
        } else if(nameOfButton === 'copy') {
            
        } else if(nameOfButton === 'print') {
            
        } else if(nameOfButton === 'delete') {
            deleteClick();
        } else if(nameOfButton === 'add') {
            addClick();
        } else if(nameOfButton === 'search') {
            searchClick();
        }
        setNameOfButton(''); //초기화
    }, [nameOfButton])

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
        let url = '';

        if(suffixUrl !== "" && suffixUrl !== undefined) { // 기본 조회
            url = `/api${suffixUrl}/listAll.do`;
        } else if(detailUrl !== "" &&  detailUrl !== undefined && codeForProject) { // 상세내역 조회
            url = `/api${detailUrl}/listAll.do`;
        } else return;

        const requestData = { useAt: "Y" };
        const resultData = await axiosFetch(url, requestData);

        // console.log(" ⭐resultData: " , resultData);
        // console.log(" resultData.length > 0: " , resultData.length > 0);
        
        if (resultData) { //⭐ length로 보는거 맞는지 확인
            /* column과 서버 데이터의 column이 일치하는지 확인, 불일치시 삭제 에러 해결을 위한 코드(임시) */
            if( resultData.length > 0) {
                // const keys = Object.keys(resultData[0])
                // const col = columns.map((arr) => arr.col);
                // col.forEach((col) => { // 임시로 사용 중
                //     if (!keys.includes(col)) {
                //         console.log("⚠️Column not found:", col);
                //         resultData.forEach((data) => {
                //             data[col] = null;
                //         })
                //     }
                // })
                setTableData([...resultData]);
            }
        } else {
            setTableData(Array(defaultPageSize).fill({}));
        }
    };

    /* 데이터 수정 */
    const modifyClick = async () => {
        if (suffixUrl === "") return;
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
    const addClick = async (newData) => {
        if (suffixUrl === "") return;
        if(newData) { // row 추가
            const url = `/api${suffixUrl}/add.do`;
            const dataToSend = { ...newData };
            const resultData = await axiosPost(url, dataToSend);

            if (resultData) {
                fetchAllData(); //새로고침
                setNewRowData({}); //초기화
            }

        } else if(!newData) { //파라미터로 넘어온 데이터가 없다면, 팝업으로 추가
            setIsOpenModal(true);
        }
    };

    /* 데이터 검색 */
    const searchClick = async () => {
        if (suffixUrl === "") return;
        if(searchData) {
            const url = `/api${suffixUrl}/listAll.do`;
            const requestData = {
                useAt: searchData.radioOption,
                searchKeyword: searchData.searchKeyword,
                searchCondition: searchData.searchCondition,
            };

            const resultData = await axiosScan(url, requestData);
            console.log("❤️ 서치데이터 결과: ", resultData);

            setSearchData({}); //초기화
        }
    };

    /* 셀 클릭 */
    const onClickCell = (e, cell) => {
        // console.log("⭐ cell click: ", e.target, cell);
    }

    /* 로우 클릭 */
    const onCLickRow = (index, rowData) => {
        // console.log("⭐ row click - index: ", index, ", data:", rowData);
        if(rowData.poiNm) { //프로젝트에 해당하는 상세 테이블
            /* 서버 통신 */
            // const url = `/api${detailUrl}/listAll.do`;
            // const requestData = { useAt: "Y" };
            // const resultData = await axiosFetch(url, requestData);
    
            // console.log("⭐ 리액트테이블 resultData: ", resultData);
            
            // if (resultData && resultData.length > 0) {} //⭐ length로 보는거 맞는지 확인
        }
    }

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
    } = useTable(
        {
            columns: columnsConfig,
            data: tableData,
            initialState: { pageIndex: 0, pageSize: defaultPageSize || 10, selectedRowIds: {} }, // 초기값
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
        console.log("❤️ selectedFlatRows: ", selectedFlatRows);
    }, [selectedFlatRows]);

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

    const tableOnClick = () => {
        setCurrentTable(tableRef);
    }

    const pageSizeChange = (value) => {
        setPageSize(Number(value)); // 페이지 크기 변경
        gotoPage(0); // 첫 페이지로 이동
    }

    return (
        <>
            <div className="flex-between mg-b-20 mg-t-20">
                <div className="page-size">
                    <span className="mg-r-10">페이지 크기 :</span>
                    <select
                        className="select"
                        value={pageSize}
                        onChange={(e) => pageSizeChange(e.target.value)}
                    >
                        {pageSizeOptions.map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            
            <table {...getTableProps()} className="table-styled" onClick={tableOnClick}>
                <thead>
                    {headerGroups.map((headerGroup, headerGroupIndex) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column, columnIndex) => (
                                <th
                                    {...column.getHeaderProps(column.getSortByToggleProps())}
                                    className={columnIndex === 0 ? "first-column" : ""}
                                    style={{ width: column.width }}
                                >
                                    {column.render("Header")}
                                    <span>{column.isSorted ? column.isSortedDesc ? " 🔽" : " 🔼" : ""}</span>
                                </th>
                            ))}
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
                                onClick={(e) => onCLickRow(row.index, row.original)}
                            >
                                {row.cells.map((cell, cellIndex) => (
                                    <td
                                        {...cell.getCellProps()}
                                        className={cellIndex === 0 ? "first-column"  : "other-column"}
                                        onClick={(e) => onClickCell(e, cell)}
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
                                            onClick={() => onDeleteRow(row)}
                                        >
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
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}> 처음 </button>
                <button  onClick={() => previousPage()} disabled={!canPreviousPage}> 이전 </button>
                <span> 페이지 {pageIndex + 1} / {pageOptions.length} </span>
                <button onClick={() => nextPage()} disabled={!canNextPage}> 다음 </button>
                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}> 마지막 </button>
            </div>
        </>
    );
};

export default ReactDataTable;
