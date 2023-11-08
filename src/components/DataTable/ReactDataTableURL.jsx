import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { axiosDelete, axiosFetch, axiosPost, axiosScan, axiosUpdate } from "api/axiosFetch";
import { useTable, usePagination, useSortBy, useRowSelect } from "react-table";
import { PageContext } from "components/PageProvider";
import ModalPageCompany from "components/modal/ModalPageCompany";

const ReactDataTableURL = (props) => {
    const { columns, flag, customDatas, defaultPageSize, tableRef, viewPageName, customerList, beforeItem, singleUrl } = props;
    const {
        prevCurrentPageName,
        innerPageName,
        prevInnerPageName,
        setCurrentTable,
        setLengthSelectRow,
        newRowData,
        currentPageName,
        projectInfo,
        isOpenModalCompany,
        setIsOpenModalCompany,
        projectCompany,
        setProjectCompany,
    } = useContext(PageContext);

    const [tableData, setTableData] = useState([]);
    const [originTableData, setOriginTableData] = useState([]);
    const [changeTable, setChangeTable] = useState([]);
    const pageSizeOptions = [5, 10, 15, 20, 30, 50, 100];
    const [isEditing, setIsEditing] = useState(false);
    const [current, setCurrent] = useState(""); //==viewPageName
    const [selectRow, setSelectRow] = useState({}); //마지막으로 선택한 row
    const [rowIndex, setRowIndex] = useState(0);

    /* 최초 실행, 데이터 초기화  */
    useEffect(() => {
        //if (suffixUrl || detailUrl) {
        //    fetchAllData();
        //}
        if (customDatas) {
            setTableData(customDatas);
            setOriginTableData(customDatas);
        }
        if (tableRef) {
            setCurrentTable(tableRef);
        }
        setCurrent(viewPageName);
    }, [customDatas]);

    /* tab에서 컴포넌트 화면 변경 시 초기화  */
    useEffect(() => {
        if (currentPageName !== prevCurrentPageName || innerPageName !== prevInnerPageName) {
            // 현재 페이지와 이전 페이지가 같지 않다면
            toggleAllRowsSelected(false);
        }
    }, [currentPageName, innerPageName]);

    /* 테이블 cell에서 수정하는 경우의 on off */
    useEffect(() => {
        setIsEditing(flag);
        console.log(flag);
        console.log("❤️❤️❤️", "current:", current, "currentPageName:", currentPageName, "innerPageName:", innerPageName, "❤️❤️❤️");
        //if (current === "경비") {
        if (current === currentPageName || (current === innerPageName && !flag)) {
            //현재 페이지 이고, flag가 false일때 배열 이벤트 처리
            console.log("조건에 부합하지 않는가???🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨🚨");
            compareData(originTableData, tableData);
        }
        setOriginTableData(changeTable);
        //}
    }, [flag]);

    /* table의 button 클릭 시 해당하는 함수 실행 */

    useEffect(() => {
        console.log(projectCompany, "기업 이름, 코드");
    }, [projectCompany]);

    const columnsConfig = useMemo(
        () =>
            columns.map((column) => ({
                Header: column.header,
                accessor: column.col,
                sortable: true,
                width: column.cellWidth,
                type: column.type,
                options: column.options,
                notView: column.notView,
            })),
        [columns]
    );

    useEffect(() => {
        //newRowData 변동 시 새로운 행 추가
        if (newRowData && Object.keys(newRowData).length !== 0) {
            onAddRow(newRowData);
            GeneralExpensesOnAddRow(newRowData);
            companyOnAddRow(newRowData);
        }
    }, [newRowData]);

    /* 셀 클릭 */
    const onClickCell = (e, cell) => {};

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

    const [dataBuket, setDataBuket] = useState({});
    const [prevDataBuket, setPrevDataBuket] = useState({});

    useEffect(() => {
        setDataBuket(projectCompany.esntlId);
    }, [projectCompany]);

    const setValueData = (rowIndex) => {
        setIsOpenModalCompany(true);
        setRowIndex(rowIndex);
    };

    //아이템 선택후 중복할당 방지 코드
    useEffect(() => {
        if (!isOpenModalCompany) {
            // isOpenModalCompany false로 변경된 경우에 실행할 코드를 여기에 작성

            // dataBuket 객체 자체의 참조가 변경되었을 때만 코드 실행
            if (dataBuket !== prevDataBuket) {
                const updatedTableData = [...tableData];
                if (dataBuket && updatedTableData[rowIndex]) {
                    updatedTableData[rowIndex].esntlId = dataBuket;
                    setTableData(updatedTableData);
                }

                // dataBuket 값을 업데이트할 때 prevDataBuket도 업데이트
                setPrevDataBuket(dataBuket);
                setProjectCompany("");
            }
        }
    }, [isOpenModalCompany, dataBuket, rowIndex, tableData, prevDataBuket]);

    const handleChange = (e, rowIndex, accessor) => {
        const { value } = e.target;
        console.log(value, "🚨🚨🚨🚨🚨");
        // tableData를 복제하여 수정
        const updatedTableData = [...tableData];
        updatedTableData[rowIndex][accessor] = value;
        // 수정된 데이터로 tableData 업데이트
        setTableData(updatedTableData);
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

    /* table button 활성화 on off */
    useEffect(() => {
        if (current === currentPageName || current === innerPageName) {
            // 현재 보는 페이지라면
            if (selectedFlatRows.length > 0) {
                setLengthSelectRow(selectedFlatRows.length);
                setSelectRow(selectedFlatRows[selectedFlatRows.length - 1].values); // 선택한 rows의 마지막 배열
            } else if (selectedFlatRows.length === 0) {
                setLengthSelectRow(selectedFlatRows.length);
            }
        }
    }, [selectedFlatRows]);

    const onChangeInput = (e, preRow) => {
        const { name, value } = e.target;
        const newTableData = tableData.map((rowData, rowIndex) => {
            if (rowIndex === preRow.index) {
                return { ...rowData, [name]: value };
            }
            return rowData;
        });
        setTableData(newTableData);
        setChangeTable(newTableData);
    };
    useEffect(() => {
        calTotalPrice();
        console.log(tableData, "🐵🐵🐵🐵🐵🐵🐵");
    }, [tableData]);

    /* 새로운 빈 row 추가 */
    const onAddRow = () => {
        const newRow = {};
        columnsConfig.forEach((column) => {
            if (column.accessor === "poiId") {
                newRow[column.accessor] = projectInfo.poiId; // poiId를 항상 선택한놈으로 설정
            } else if (column.accessor === "modeCode") {
                newRow[column.accessor] = "SLSP"; // modeCode 항상 "SLSP"로 설정
            } else if (column.accessor === "pjbgTypeCode") {
                newRow[column.accessor] = "EXPNS01"; // pjbgTypeCode 항상 "EXPNS10"로 설정
            } else if (column.accessor === "useAt") {
                newRow[column.accessor] = "Y"; // useAt 항상 "Y"로 설정
            } else if (column.accessor === "deleteAt") {
                newRow[column.accessor] = "N"; // deleteAt 항상 "N"로 설정
            } else {
                newRow[column.accessor] = null; // 다른 열은 초기화
            }
        });

        setTableData((prevData) => {
            const newData = [...prevData, { ...newRow }];
            return newData;
        });
    };

    const companyOnAddRow = () => {
        const newRow = {};
        columnsConfig.forEach((column) => {
            if (column.accessor === "poiId") {
                newRow[column.accessor] = projectInfo.poiId; // poiId를 항상 선택한놈으로 설정
            } else if (column.accessor === "modeCode") {
                newRow[column.accessor] = "SLSP"; // modeCode 항상 "SLSP"로 설정
            } else if (column.accessor === "pjbgTypeCode") {
                newRow[column.accessor] = "EXPNS10"; // pjbgTypeCode 항상 "EXPNS10"로 설정
            } else if (column.accessor === "useAt") {
                newRow[column.accessor] = "Y"; // useAt 항상 "Y"로 설정
            } else if (column.accessor === "deleteAt") {
                newRow[column.accessor] = "N"; // deleteAt 항상 "N"로 설정
            } else {
                newRow[column.accessor] = null; // 다른 열은 초기화
            }
        });

        setTableData((prevData) => {
            const newData = [...prevData, { ...newRow }];
            return newData;
        });
    };

    const GeneralExpensesOnAddRow = () => {
        const newRow = {};
        columnsConfig.forEach((column) => {
            if (column.accessor === "poiId") {
                newRow[column.accessor] = projectInfo.poiId; // poiId를 항상 선택한놈으로 설정
            } else if (column.accessor === "modeCode") {
                newRow[column.accessor] = "SLSP"; // modeCode 항상 "SLSP"로 설정
            } else if (column.accessor === "pjbgTypeCode") {
                newRow[column.accessor] = "EXPNS07"; // pjbgTypeCode 항상 "EXPNS10"로 설정
            } else if (column.accessor === "useAt") {
                newRow[column.accessor] = "Y"; // useAt 항상 "Y"로 설정
            } else if (column.accessor === "deleteAt") {
                newRow[column.accessor] = "N"; // deleteAt 항상 "N"로 설정
            } else {
                newRow[column.accessor] = null; // 다른 열은 초기화
            }
        });

        setTableData((prevData) => {
            const newData = [...prevData, { ...newRow }];
            return newData;
        });
    };

    const [deleteNumList, setDeleteNumList] = useState([]);
    const onDeleteRow = (row) => {
        const rowId = row.index;
        const deletedPjbgId = tableData[rowId].pjbgId;
        console.log(deletedPjbgId, "🚫🚫🚫🚫"); // 삭제된 행의 pjbgId 값을 출력
        setDeleteNumList((prevIds) => [...prevIds, deletedPjbgId]);
        const updateTableData = tableData.filter((_, index) => index !== rowId);
        setTableData([...updateTableData]);
    };

    const pageSizeChange = (value) => {
        setPageSize(Number(value)); // 페이지 크기 변경
        gotoPage(0); // 첫 페이지로 이동
    };

    //console.log(originTableData, "오리지날 데이터✨✨✨✨");

    //-------------------------------배열 추가, 수정, 삭제

    const addItem = async (addData) => {
        console.log(addData, "🔥🔥🔥🔥🔥");
        const url = `/api${singleUrl}/addList.do`;
        const resultData = await axiosPost(url, addData);
        console.log(resultData, "결과값은~?");
    };

    const updateItem = async (toUpdate) => {
        const url = `/api${singleUrl}/editList.do`;
        const resultData = await axiosUpdate(url, toUpdate);
        console.log(resultData, "🛠️🛠️🛠️🛠️수정 받기🛠️🛠️🛠️🛠️");
    };

    const deleteItem = async (removeItem) => {
        const url = `/api${singleUrl}/removeAll.do`;
        const resultData = await axiosDelete(url, removeItem);
        console.log(resultData, "🧹🧹🧹🧹삭제 받기🧹🧹🧹🧹");
    };

    useEffect(() => {
        console.log(originTableData, "❌🎉");
    }, [originTableData]);
    // 초기 데이터와 수정된 데이터를 비교하는 함수

    const compareData = (originData, updatedData) => {
        if (originData.length > updatedData.length) {
            updateItem(updatedData);
            for (let i = updatedData.length; i < originData.length; i++) {
                deleteItem(deleteNumList);
            }
        } else if (originData.length === updatedData.length) {
            const toUpdates = updatedData.map((item) => {
                return {
                    ...item,
                };
            });
            updateItem(toUpdates);
        } else if (originData.length < updatedData.length) {
            const toAdds = [];
            for (let i = originData.length; i < updatedData.length; i++) {
                const toAdd = { ...updatedData[i] };
                //toAdd.modeCode = "SLSP";
                toAdds.push(toAdd);
                addItem(toAdds);
            }
        }
    };

    //-------총합 나타내기--------
    const [totalPrice, setTotalPrice] = useState(0);
    const calTotalPrice = () => {
        let total = 0;
        tableData.map((item) => {
            total += item.pjbgPrice;
            setTotalPrice(total);
        });
    };
    //------------------------------- 초기값과 비교하는 코드

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
                            {headerGroup.headers.map((column, columnIndex) => {
                                if (column.notView) {
                                    // notView가 true인 경우, 헤더 셀을 출력하지 않음
                                    return null;
                                }

                                return (
                                    <th
                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                        className={columnIndex === 0 ? "first-column" : ""}
                                        style={{ width: column.width }}>
                                        {column.render("Header")}
                                        <span>{column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}</span>
                                    </th>
                                );
                            })}
                            {isEditing && (
                                <th style={{ width: "70px", textAlign: "center" }}>
                                    <button
                                        className="btn-primary"
                                        onClick={current === "개발외주비" ? companyOnAddRow : current === "영업관리비" ? GeneralExpensesOnAddRow : onAddRow}
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
                            <tr {...row.getRowProps()} onClick={(e) => onCLickRow(row)}>
                                {row.cells.map((cell, cellIndex) => {
                                    if (cell.column.notView) {
                                        // notView가 true인 경우, 셀을 출력하지 않음
                                        return null;
                                    }

                                    return (
                                        <td
                                            {...cell.getCellProps()}
                                            className={cellIndex === 0 ? "first-column" : "other-column"}
                                            onClick={(e) => onClickCell(e, cell)}>
                                            {cell.column.id === "selection" ? (
                                                cell.render("Cell")
                                            ) : isEditing ? (
                                                cell.column.type === "input" ? (
                                                    <input
                                                        type="text"
                                                        value={
                                                            tableData[row.index] && tableData[row.index][cell.column.id] !== undefined
                                                                ? tableData[row.index][cell.column.id] || cell.value
                                                                : cell.value
                                                        }
                                                        name={cell.column.id}
                                                        onChange={(e) => onChangeInput(e, row)}
                                                    />
                                                ) : cell.column.type === "select" ? (
                                                    <select
                                                        name={cell.column.id}
                                                        defaultValue={
                                                            tableData[row.index] && tableData[row.index][cell.column.id] !== undefined
                                                                ? tableData[row.index][cell.column.id]
                                                                : cell.column.options[row.index].value || "" // 기본값: 해당 행의 인덱스에 해당하는 옵션의 value 값 또는 빈 문자열
                                                        }
                                                        onChange={(e) => onChangeInput(e, row)}>
                                                        {cell.column.options.map((option, index) => (
                                                            <option key={index} value={option.value} selected={index === 0 ? true : false}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : cell.column.type === "buttonCompany" ? (
                                                    <div>
                                                        <input
                                                            className="buttonSelect"
                                                            id={cell.column.id}
                                                            name={cell.column.id}
                                                            onClick={() => setValueData(rowIndex)}
                                                            type="text"
                                                            placeholder={projectCompany.esntlId ? projectCompany.esntlId : `거래처명을 선택해 주세요.`}
                                                            value={tableData[rowIndex].esntlId}
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
                                    );
                                })}
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
            {isOpenModalCompany && <ModalPageCompany rowIndex={rowIndex} onClose={() => setIsOpenModalCompany(false)} />}
            <div style={{ display: "flex" }}>
                <span style={{ display: "flex", justifyContent: "center", width: "100px", backgroundColor: "#f2f2f2", border: "solid gray 1px" }}>
                    {current} 합계
                </span>
                <span style={{ display: "flex", justifyContent: "center", width: "100px", border: "solid gray 1px" }}>
                    {`${totalPrice.toLocaleString("ko-KR")} 원`}
                </span>
            </div>
        </>
    );
};

export default ReactDataTableURL;
