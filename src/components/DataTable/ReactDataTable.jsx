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
    } = props;

    const [tableData, setTableData] = useState([]);
    const [changPageSize, setChangPageSize] = useState(10); // 초기 페이지 크기
    const data = useMemo(() => tableData, [tableData]);
    const [selectDatas, setSelectDatas] = useState([]);

    /* 최초 실행, 데이터 초기화  */
    useEffect(() => {
        fetchAllData();
    }, []);

    // useEffect(() => {
    //     console.log("테이블데이터: ", tableData);
    // }, [tableData])

    // useEffect(() => {
    //     console.log("셀렉트데이터: ", selectDatas);
    // }, [selectDatas]);

    const columnsConfig = useMemo(
        () =>
            columns.map((column) => ({
                Header: column.header,
                accessor: column.col,
                sortable: true,
                width: column.cellWidth,
            })),
        [columns]
    );

    /* newRowData 변동 시 새로운 행 추가 */
    useEffect(() => {
        if (newRowData && Object.keys(newRowData).length !== 0) {
            addClick(newRowData);
        }
    }, [newRowData]);

    // useEffect(() => {
    //     if (returnKeyWord) {
    //         searchData(returnKeyWord);
    //     }
    // }, [returnKeyWord]);

    /* 선택된 값에 따라 페이징 */
    // useEffect(() => {
    //     fetchAllData();
    // }, [changPageSize]);

    /* 서버에서 전체 데이터 호출 */
    const fetchAllData = async () => {
        if (suffixUrl === "") return;
        const url = `/api${suffixUrl}/${currentPage}/listAll.do`;
        const requestData = { useAt: "Y" };

        const resultData = await axiosFetch(url, requestData);
        if (resultData) {
            setTableData(resultData);
        }
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
            data,
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

    const pageSizeOptions = [5, 10, 15, 20, 30, 50, 100];

    return (
        <>
            <DataTableButton
                deleteClick={deleteClick}
                refreshClick={refreshClick}
                addBtn={addBtn}
                columns={columns}
                suffixUrl={suffixUrl}
                selectedData={selectDatas}
            />
            <div>
                <span className="mg-r-5">Show</span>
                <select
                    value={changPageSize}
                    onChange={(e) => setChangPageSize(Number(e.target.value))}
                    className="select">
                    {pageSizeOptions.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>
            <table
                {...getTableProps()}
                className="table table-bordered"
                id="dataTable">
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th
                                    {...column.getHeaderProps(
                                        column.getSortByToggleProps()
                                    )}
                                    className="tableHeaderTh"
                                    style={{ width: column.width }}>
                                    <div className="icon-container">
                                        <span>{column.render("Header")}</span>
                                        <span className="sort-icon">
                                            {column.isSorted
                                                ? column.isSortedDesc
                                                    ? " 🔽"
                                                    : " 🔼"
                                                : ""}
                                        </span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map((row) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell) => {
                                    return (
                                        <td
                                            {...cell.getCellProps()}
                                            className="tdStyle">
                                            {cell.render("Cell")}
                                        </td>
                                    );
                                })}
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
            <div className="page-size">
                페이지 크기:
                <select
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
        </>
    );
};

export default ReactDataTable;
