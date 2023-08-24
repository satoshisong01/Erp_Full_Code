import React, { useEffect, useMemo, useState } from "react";
import DataTableButton from "components/button/DataTableButton";
import { axiosFetch, axiosPost } from "api/axiosFetch";
import { useTable, usePagination, useSortBy, useRowSelect } from "react-table";

const ReactDataTable = (props) => {
    const { returnKeyWord, columns, suffixUrl, currentPage, dummyData, newRowData, btnClick, addBtn } = props;

    const [tableData, setTableData] = useState([]);
    const [changPageSize, setChangPageSize] = useState(10); // 초기 페이지 크기
    const pageSizeOptions = [10, 20, 50]; // 페이지 크기 옵션
    const data = useMemo(() => tableData, [tableData]);
    const [selectDatas, setSelectDatas] = useState([])
    
    /* 최초 실행, 데이터 초기화  */
    useEffect(() => {
        fetchAllData();
    }, []);

    useEffect(() => {
        console.log("⭕ selectDatas: ", selectDatas);
    }, [selectDatas]);

    const columnsConfig = useMemo(() => columns.map(column => ({
        Header: column.header,
        accessor: column.col,
        sortable: true,
        width: column.cellWidth,
    })), [columns]);

    /* newRowData 변동 시 새로운 행 추가 */
    useEffect(() => {
        console.log("⭕ tableData> newRowData: ", newRowData);
        if (newRowData && Object.keys(newRowData).length !== 0) {
            const updatedTableData = [ { ...newRowData }, ...tableData];
            addClick(newRowData);
            // setTableData(updatedTableData);
        }
    }, [newRowData]);

    // useEffect(() => {
    //     console.log("⭕ tableData: ", tableData);
    // }, [tableData]);

    /* returnKeyWord 변동 시 데이터 검색 실행 */
    useEffect(() => {
        if (returnKeyWord) {
            searchData(returnKeyWord);
        }
    }, [returnKeyWord]);

    useEffect(() => {
        fetchAllData();
    }, [changPageSize]);

    useEffect(() => {
        if (btnClick.includes('add')) {
            // addClick(selectData)
        } else if (btnClick.includes('delete')) {
            // deleteClick(selectData)
        }
    }, [btnClick]);

    /* 서버에서 전체 데이터 호출 */
    const fetchAllData = async () => {
        if (suffixUrl === "") return;
        // http://192.168.0.113:8080/api/baseInfrm/product/pjOrdrInfo/listAll.do
        const url = `/api${suffixUrl}/${currentPage}/listAll.do`;
        const requestData = { useAt: "Y" };

        const resultData = await axiosFetch(url, requestData);
        if (resultData) {
            // console.log("⭕ resultData: ", resultData);
            setTableData(resultData);
        }
        // if (dummyData) {
        //     setTableData(dummyData);
        // }
    };

    /* 데이터 수정 */
    const modifyClick = async () => {
        if (suffixUrl === "") return;
    };

    /* 데이터 삭제 */
    const deleteClick = async () => {
        if (suffixUrl === "") return;
    };

    /* 데이터 추가 */
    const addClick = async (addData) => {
        // http://192.168.0.113:8080/api/baseInfrm/product/pjOrdrInfo/add.do
        if (suffixUrl === "") return;
        // const url = `/api${suffixUrl}/${currentPage}/add.do`;
        const url = `/api/baseInfrm/product/pjOrdrInfo/add.do`;
        const dataToSend = {...addData};

        const resultData = await axiosPost(url, dataToSend);
        if (resultData) {
            console.log("⭕ 추가 완: ", resultData);
            fetchAllData();
        }
    };

    /* 데이터 검색, returnKeyWord: 검색 */
    const searchData = async (returnKeyWord) => {
        console.log("⭕ returnKeyWord: ", returnKeyWord);
    };

    const refreshClick = () => {
        
    }

    const onSelectAll = (e) => {
        const isSelected = e.target.checked; 
        alert(isSelected)
        if (isSelected) {
            setSelectDatas(tableData);
        } else {
            setSelectDatas([]);
        }
    }

    const onSelectRow = (e, row) => {
        const data = row.original;
        const isSelected = e.target.checked; 

        console.log("⭕ data: ", data);
        console.log("⭕ selectDatas: ", selectDatas);
        console.log("⭕ includes: ", selectDatas.includes(data));

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
        state: { pageIndex, selectedRowIds },
        previousPage,
        nextPage,
        canPreviousPage,
        canNextPage,
    } = useTable(
        {
            columns: columnsConfig,
            data,
            initialState: { pageIndex: 0, pageSize: changPageSize  }, // 초기값
        },
        useSortBy,
        usePagination,
        useRowSelect,
        hooks => {
            hooks.visibleColumns.push(columns => [
                // 선택 체크박스 컬럼 추가
                {
                    id: 'selection',
                    Header: ({ getToggleAllPageRowsSelectedProps }) => (
                        <div>
                            <input
                                type="checkbox" {...getToggleAllPageRowsSelectedProps()}
                                onClick={onSelectAll}
                                className="table-checkbox"
                             />
                        </div>
                    ),
                    Cell: ({ row }) => (
                        <div>
                            <input
                                type="checkbox" {...row.getToggleRowSelectedProps()}
                                onClick={(e) => onSelectRow(e, row)}
                                className="table-checkbox"
                            />
                        </div>
                    ),
                    width: 35, // 체크박스 컬럼의 너비 조절
                },
                ...columns,
            ]);
        }
        
    );


    return (
        <>
            {/* <DataTableButton
                    deleteClick={deleteClick}
                    refreshClick={refreshClick}
                    addBtn={addBtn}
                    columns={columns}
                    suffixUrl={suffixUrl}
                    selectedData={[]}
            /> */}
            <div>
                <span className="mg-r-5">Show</span>
                <select value={changPageSize} onChange={e => setChangPageSize(Number(e.target.value))} className="select">
                    {pageSizeOptions.map(option => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>
            <table {...getTableProps()} className="table table-bordered" id="dataTable">
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())} className="tableHeaderTh" style={{ width: column.width }}>
                                    <div className="icon-container">
                                        <span >{column.render("Header")}</span>
                                        <span className="sort-icon">
                                            {column.isSorted ? (column.isSortedDesc ? " ▼" : " ▲") : ""}
                                        </span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map(row => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return (
                                        <td {...cell.getCellProps()} className="tdStyle">
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
                <span>
                    Page{" "}<strong className="mg-r-5"> {pageIndex + 1} of {page.length}</strong>{" "}
                </span>
                <button onClick={() => previousPage()} disabled={!canPreviousPage} className="mg-r-5">
                    ◀
                </button>
                <button onClick={() => nextPage()} disabled={!canNextPage} >
                    ▶
                </button>
            </div>
        </>
    );
};

export default ReactDataTable;
