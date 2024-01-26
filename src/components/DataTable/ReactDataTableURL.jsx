import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { axiosDelete, axiosFetch, axiosPost, axiosScan, axiosUpdate } from "api/axiosFetch";
import { useTable, usePagination, useSortBy, useRowSelect, useBlockLayout, useResizeColumns } from "react-table";
import { PageContext } from "components/PageProvider";
import { v4 as uuidv4 } from "uuid";
import "react-datepicker/dist/react-datepicker.css";
import CompanyModal from "components/modal/CompanyModal";
import ProductInfoModal from "components/modal/ProductInfoModal";
import ProductGroupModal from "components/modal/ProductGroupModal";
import DayPicker from "components/input/DayPicker";
import EmployerInfoModal from "components/modal/EmployerInfoModal";
import BasicInput from "components/input/BasicInput";

/* 경비 테이블 */
const ReactDataTableURL = (props) => {
    const {
        columns,
        customDatas,
        defaultPageSize,
        tableRef,
        viewPageName,
        customDatasRefresh,
        editing,
        hideCheckBox,
        returnSelect,
        returnSelectRows,
        modalPageName,
        viewLoadDatas,
        returnList,
        condition,
        isPageNation,
    } = props;
    const {
        prevCurrentPageName,
        innerPageName,
        prevInnerPageName,
        setCurrentTable,
        setLengthSelectRow,
        newRowData,
        currentPageName,
        projectPgNm,
        setProjectPgNm,
        nameOfButton,
        isModalTable,
        setNameOfButton,
        setModalLengthSelectRow,
        emUserInfo,
        setEmUserInfo,
    } = useContext(PageContext);

    const [tableData, setTableData] = useState([]);
    const [originTableData, setOriginTableData] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [current, setCurrent] = useState(viewPageName); //==viewPageName
    const [rowIndex, setRowIndex] = useState(0);
    const [isOpenModalProductInfo, setIsOpenModalProductInfo] = useState(false); //품목정보목록
    const [isOpenModalCompany, setIsOpenModalCompany] = useState(false); //거래처정보목록
    const [isOpenModalProductGroup, setIsOpenModalProductGroup] = useState(false); //품목그룹
    const [isOpenModalEmployerInfo, setIsOpenModalEmployerInfo] = useState(false); //업무회원목록
    const [colName, setColName] = useState("");

    /* 최초 실행, 데이터 초기화  */
    useEffect(() => {
        setCurrent(viewPageName);
        if (tableRef) {
            setCurrentTable(tableRef);
        }
    }, []);

    useEffect(() => {
        if (customDatas && customDatas.length > 0) {
            setTableData([...customDatas]);
            setOriginTableData([...customDatas]);
        } else {
            setTableData([]);
            setOriginTableData([]);
        }
    }, [customDatas]);

    /* tab에서 컴포넌트 화면 변경 시 초기화  */
    useEffect(() => {
        if (currentPageName.id !== prevCurrentPageName.id || innerPageName.id !== prevInnerPageName.id) {
            // 현재 페이지와 이전 페이지가 같지 않다면
            toggleAllRowsSelected(false);
        }
        // 현재 보는 페이지(current)가 클릭한 페이지와 같은게 없다면 return
        if (current.id !== currentPageName.id && current.id !== innerPageName.id) {
            return;
        }
    }, [currentPageName, innerPageName, nameOfButton]);

    useEffect(() => {
        // console.log("경비 current:", current.name, "inner:", innerPageName.name, "current:",currentPageName.name);
        if (isCurrentPage()) {
            setIsEditing(editing !== undefined ? editing : isEditing); //테이블 상태 //inner tab일 때 테이블 조작

            if (nameOfButton === "save") {
                if (returnList) {
                    returnList(originTableData, tableData);
                } else {
                    compareData(originTableData, tableData);
                }
            } else if (nameOfButton === "load" && viewLoadDatas) {
                loadOnAddRow(viewLoadDatas);
            }  else if (nameOfButton === "deleteRow") {
                onDeleteRow();
            } else if (nameOfButton === "addRow") {
                onAddRow();
            }
            setNameOfButton("");
        }
    }, [innerPageName, currentPageName, editing, nameOfButton]);

    useEffect(() => {
        if (isCurrentPage()) {
            //업무회원
            if (Object.keys(emUserInfo).length > 0) {
                const updatedTableData = [...tableData];
                updatedTableData[rowIndex] = {
                    ...updatedTableData[rowIndex], // 다른 속성들을 그대로 유지
                    ...emUserInfo,
                    esntlId: emUserInfo.uniqId,
                };
                setTableData(updatedTableData);
                setEmUserInfo({})
            }
        }
    }, [emUserInfo]);

    /* table의 button 클릭 시 해당하는 함수 실행 */

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
                require: column.require,
            })),
        [columns]
    );

    useEffect(() => {
        //newRowData 변동 시 새로운 행 추가
        if (newRowData && Object.keys(newRowData).length !== 0) {
            onAddRow(newRowData);
            //GeneralExpensesOnAddRow(newRowData);
            //companyOnAddRow(newRowData);
        }
    }, [newRowData]);

    /* 로우 클릭 */
    const onCLickRow = (row) => {
        toggleRowSelected(row.id);
    };

    const setValueData = (rowIndex) => {
        setIsOpenModalProductGroup(true);
        setRowIndex(rowIndex);
    };

    const setValueDataCompany = (rowIndex) => {
        setIsOpenModalCompany(true);
        setRowIndex(rowIndex);
    };

    useEffect(() => {
        if (isCurrentPage() && Object.keys(projectPgNm).length > 0) {
            setValueDataPgInfo(rowIndex, projectPgNm);
            setProjectPgNm({});
        }
    }, [projectPgNm]);

    const setValueDataPgInfo = (rowIndex, pgInfo) => {
        const updatedTableData = [...tableData];
        updatedTableData[rowIndex] = {
            ...updatedTableData[rowIndex], // 다른 속성들을 그대로 유지
            ...pgInfo,
        };
        setTableData(updatedTableData);
        setProjectPgNm({});
    };

    const handleChange = (e, rowIndex, accessor) => {
        const { value } = e.target;
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
            initialState: { pageIndex: 0, pageSize: isPageNation ? (defaultPageSize || 10) : tableData && tableData.length || 200 }, // 초기값
        },
        useSortBy,
        usePagination,
        useRowSelect,
        useBlockLayout,
        useResizeColumns,
        (hooks) => {
            hooks.visibleColumns.push((columns) => [
                ...(hideCheckBox !== undefined && hideCheckBox
                    ? []
                    : [
                          {
                              id: "selection",
                              Header: ({ getToggleAllPageRowsSelectedProps }) => (
                                  <div>
                                      <input
                                          id={uuidv4()}
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
                                          id={uuidv4()}
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
                      ]),
                ...columns,
            ]);
        }
    );

    /* table button 활성화 on off */
    useEffect(() => {
        if (isCurrentPage()) {
            if (isModalTable) {
                //모달화면일때
                setModalLengthSelectRow(selectedFlatRows.length);
                if (selectedFlatRows.length > 0) {
                    const selects = selectedFlatRows.map((row) => row.values);
                    returnSelectRows && returnSelectRows(selects);
                    returnSelect && returnSelect(selectedFlatRows[selectedFlatRows.length - 1].values);
                }
            } else if (!isModalTable) {
                if (selectedFlatRows.length > 0) {
                    const selects = selectedFlatRows.map((row) => row.values);
                    returnSelectRows && returnSelectRows(selects);
                    returnSelect && returnSelect(selectedFlatRows[selectedFlatRows.length - 1].values);
                }
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
        // setChangeTable(newTableData);
    };
    // useEffect(() => {
    //     calTotalPrice();
    // }, [tableData]);

    const loadOnAddRow = (viewLoadDatas) => {
        setTableData(() => {
            return [...viewLoadDatas];
        });
    };

    /* 새로운 빈 row 추가 */
    const onAddRow = () => {
        const newRow = {};
        columnsConfig.forEach((column) => {
            if (column.accessor === "poiId") {
                newRow[column.accessor] = condition.poiId || ""; // poiId를 항상 선택한놈으로 설정
            } else if (column.accessor === "versionId") {
                newRow[column.accessor] = condition.versionId; // pjbgTypeCode 항상 "EXPNS10"로 설정
            } else if (column.accessor === "esntlId") {
                //임시 업무회원 삭제해야함
                newRow[column.accessor] = emUserInfo.uniqId; // pjbgTypeCode 항상 "EXPNS10"로 설정
            } else if (column.accessor === "pjbgTypeCode19") {
                newRow[column.accessor] = 0; // pjbgTypeCode 항상 "EXPNS10"로 설정
            } else if (column.accessor === "useAt") {
                newRow[column.accessor] = "Y"; // useAt 항상 "Y"로 설정
            } else if (column.accessor === "modeCode") {
                newRow[column.accessor] = "BUDGET"; // useAt 항상 "Y"로 설정
            } else if (column.accessor === "deleteAt") {
                newRow[column.accessor] = "N"; // deleteAt 항상 "N"로 설정
            } else {
                newRow[column.accessor] = null; // 다른 열은 초기화
            }
            if (viewPageName === "경비실행") {
                if (column.accessor === "modeCode") {
                    newRow[column.accessor] = "EXECUTE"; // useAt 항상 "Y"로 설정
                } else if (column.accessor === "pjbgTypeCode19") {
                    newRow[column.accessor] = 0; // pjbgTypeCode 항상 "EXPNS10"로 설정
                }
            }
            if (viewPageName === "영업비(정산)") {
                if (column.accessor === "modeCode") {
                    newRow[column.accessor] = "EXECUTE"; // useAt 항상 "Y"로 설정
                } else if (column.accessor === "pjbgTypeCode1") {
                    newRow[column.accessor] = 0; // pjbgTypeCode 항상 "EXPNS10"로 설정
                } else if (column.accessor === "pjbgTypeCode2") {
                    newRow[column.accessor] = 0; // pjbgTypeCode 항상 "EXPNS10"로 설정
                } else if (column.accessor === "pjbgTypeCode3") {
                    newRow[column.accessor] = 0; // pjbgTypeCode 항상 "EXPNS10"로 설정
                } else if (column.accessor === "pjbgTypeCode4") {
                    newRow[column.accessor] = 0; // pjbgTypeCode 항상 "EXPNS10"로 설정
                } else if (column.accessor === "pjbgTypeCode5") {
                    newRow[column.accessor] = 0; // pjbgTypeCode 항상 "EXPNS10"로 설정
                } else if (column.accessor === "pjbgTypeCode19") {
                    newRow[column.accessor] = 0; // pjbgTypeCode 항상 "EXPNS10"로 설정
                } else if (column.accessor === "pjbgTypeCode20") {
                    newRow[column.accessor] = 0; // pjbgTypeCode 항상 "EXPNS10"로 설정
                }
            }
        });

        setTableData((prevData) => {
            const newData = [...prevData, { ...newRow }];
            return newData;
        });
    };

    const onDeleteRow = () => {
        if (!selectedFlatRows || selectedFlatRows.length === 0) { return; }
        const values = selectedFlatRows.map((item) => item.index);
        setTableData((prevTableData) => {
            const updateTableData = prevTableData.filter((_, index) => !values.includes(index));
            return [...updateTableData];
        });
    };

    const addItem = async (addData) => {
        const url = `/api/baseInfrm/product/pjbudget/addList.do`;
        const resultData = await axiosPost(url, addData);
        if (resultData) {
            customDatasRefresh && customDatasRefresh();
        }
    };

    const updateItem = async (toUpdate) => {
        const url = `/api/baseInfrm/product/pjbudget/editList.do`;
        const resultData = await axiosUpdate(url, toUpdate);

        if (resultData) {
            customDatasRefresh && customDatasRefresh();
        }
    };

    const deleteItem = async (removeItem) => {
        const url = `/api/baseInfrm/product/pjbudget/removeAll.do`;
        const resultData = await axiosDelete(url, removeItem);

        if (resultData) {
            customDatasRefresh && customDatasRefresh();
        }
    };

    const handleDateClick = (date, colName, index) => {
        const updatedTableData = [...tableData];
        updatedTableData[index][colName] = date;
        const month = date.substring(0, 10);
        updatedTableData[index]["pjbgDt"] = month; //연월
        setTableData(updatedTableData);
    };

    const compareData = (originData, updatedData) => {
        const filterData = updatedData.filter((data) => data.pjbgTypeCode); //pmpMonth가 없는 데이터 제외
        const originDataLength = originData ? originData.length : 0;
        const updatedDataLength = filterData ? filterData.length : 0;

        if (originDataLength > updatedDataLength) {
            //이전 id값은 유지하면서 나머지 값만 변경해주는 함수
            const updateDataInOrigin = (originData, updatedData) => {
                // 복제하여 새로운 배열 생성
                const updatedArray = [...originData];
                // updatedData의 길이만큼 반복하여 originData 갱신
                for (let i = 0; i < Math.min(updatedData.length, originData.length); i++) {
                    const updatedItem = updatedData[i];
                    updatedArray[i] = { ...updatedItem, pjbgId: updatedArray[i].pjbgId };
                }
                return updatedArray;
            };

            const firstRowUpdate = updateDataInOrigin(originData, updatedData);
            updateItem(firstRowUpdate); //수정

            const delList = [];
            const delListTest = [];
            for (let i = updatedDataLength; i < originDataLength; i++) {
                delList.push(originData[i].pjbgId);
                delListTest.push(originData[i]);
            }
            deleteItem(delList); //삭제
        } else if (originDataLength === updatedDataLength) {
            updateItem(filterData); //수정
        } else if (originDataLength < updatedDataLength) {
            const updateList = [];

            for (let i = 0; i < originDataLength; i++) {
                updateList.push(filterData[i]);
            }
            updateItem(updateList); //수정

            const addList = [];
            for (let i = originDataLength; i < updatedDataLength; i++) {
                addList.push(filterData[i]);
            }
            addItem(addList); //추가
        }
    };

    // const [totalPrice, setTotalPrice] = useState(0);
    // const calTotalPrice = () => {
    //     let total = 0;
    //     tableData.map((item) => {
    //         total += item.pjbgPrice;
    //         setTotalPrice(total);
    //     });
    // };

    const changeEmployerInfo = (colName, rowIndex) => {
        setRowIndex(rowIndex);
        setColName(colName);
        setIsOpenModalEmployerInfo(true);
    };

    const isCurrentPage = () => {
        return (
            current.id !== "" &&
            current.id !== undefined &&
            (current.id === currentPageName.id || current.id === innerPageName.id || current.name === modalPageName)
        );
    };
    //------------------------------- 초기값과 비교하는 코드
    const visibleColumnCount = headerGroups[0].headers.filter((column) => !column.notView).length;

    return (
        <div className={isPageNation ? "x-scroll" : "table-scroll"}>
            {/* <div style={{ position: "relative", overflow: "auto", width: "auto" }}> */}
                <table {...getTableProps()} className="table-styled" ref={tableRef} style={{ tableLayout: "auto" }}>
                    <thead>
                        {headerGroups.map((headerGroup, headerGroupIndex) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column, columnIndex) => {
                                    if (column.notView) {
                                        // notView가 true인 경우, 헤더 셀을 출력하지 않음
                                        return null;
                                    }

                                    return (
                                        <th {...column.getHeaderProps(column.getSortByToggleProps())} className={columnIndex === 0 ? "first-column" : ""}>
                                            {column.render("Header")}
                                            <div {...column.getResizerProps()} className={`resizer ${column.isResizing ? "isResizing" : ""}`} />
                                            <span style={{ color: "red", margin: 0 }}>{column.require === true ? "*" : ""}</span>
                                            <span>{column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}</span>
                                        </th>
                                    );
                                })}
                            </tr>
                        ))}
                    </thead>
                    {tableData.length > 0 ? (
                        <tbody {...getTableBodyProps()}>
                            {page.map((row, rowIndex) => {
                                prepareRow(row);
                                return (
                                    // <tr {...row.getRowProps()} onClick={(e) => onCLickRow(row)}>
                                    <tr {...row.getRowProps()}>
                                        {row.cells.map((cell, cellIndex) => {
                                            if (cell.column.notView) {
                                                // notView가 true인 경우, 셀을 출력하지 않음
                                                return null;
                                            }

                                            return (
                                                <td {...cell.getCellProps()} className={cellIndex === 0 ? "first-column" : "other-column"} id="otherCol">
                                                    {cell.column.id === "selection" ? (
                                                        cell.render("Cell")
                                                    ) : isEditing ? (
                                                        cell.column.type === "input" ? (
                                                            <input
                                                                type="text"
                                                                value={
                                                                    tableData[row.index] && tableData[row.index][cell.column.id] !== undefined
                                                                        ? tableData[row.index][cell.column.id]
                                                                        : cell.value || ""
                                                                }
                                                                name={cell.column.id}
                                                                onChange={(e) => onChangeInput(e, row)}
                                                            />
                                                        ) : cell.column.type === "desc" ? (
                                                            <input
                                                                type="text"
                                                                value={
                                                                    tableData[row.index] && tableData[row.index][cell.column.id] !== undefined
                                                                        ? tableData[row.index][cell.column.id]
                                                                        : ""
                                                                }
                                                                name={cell.column.id}
                                                                onChange={(e) => onChangeInput(e, row)}
                                                                style={{
                                                                    backgroundColor: cell.value ? "white" : "lightgray",
                                                                }}
                                                                title={
                                                                    tableData[row.index] && tableData[row.index][cell.column.id] !== undefined
                                                                        ? tableData[row.index][cell.column.id]
                                                                        : ""
                                                                }
                                                            />
                                                        ) : cell.column.type === "productGroup" ? (
                                                            <div>
                                                                <input
                                                                    className="buttonSelect"
                                                                    id={cell.column.id}
                                                                    name={cell.column.col}
                                                                    key={cell.column.id + row.index}
                                                                    onClick={() => setValueData(row.index)}
                                                                    type="text"
                                                                    placeholder={`품목그룹명을 선택해 주세요.`}
                                                                    value={tableData[row.index].pgNm || ""}
                                                                    onChange={(e) => handleChange(e, row, cell.column.id)}
                                                                    readOnly
                                                                />
                                                            </div>
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
                                                                    <option key={index} value={option.value || ""} selected={index === 0 ? true : false}>
                                                                        {option.label}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        ) : cell.column.type === "company" ? (
                                                            <div>
                                                                <input
                                                                    className="buttonSelect"
                                                                    id={cell.column.id}
                                                                    name={cell.column.id}
                                                                    onClick={() => setValueDataCompany(row.index)}
                                                                    type="text"
                                                                    placeholder={`거래처명을 선택해 주세요.`}
                                                                    value={tableData[row.index][cell.column.id] || ""}
                                                                    onChange={(e) => handleChange(e, row.index, cell.column.id)}
                                                                    readOnly
                                                                />
                                                            </div>
                                                        ) : cell.column.type === "employerInfo" ? (
                                                            <BasicInput
                                                                item={cell.column}
                                                                onClick={() => changeEmployerInfo(cell.column.id, row.index)}
                                                                value={tableData[row.index][cell.column.id] ?? ""}
                                                                readOnly
                                                            />
                                                        ) : cell.column.type === "dayPicker" ? (
                                                            <DayPicker
                                                                name={cell.column.id}
                                                                value={tableData[row.index][cell.column.id] ? tableData[row.index][cell.column.id] : ""}
                                                                onClick={(data) => handleDateClick(data, cell.column.id, row.index)}
                                                            />
                                                        ) : cell.column.Header === "연월" && cell.value ? (
                                                            cell.value.substring(0, 7)
                                                        ) : cell.column.col === "pjbgDt" ? (
                                                            cell.value.substring(0, 7)
                                                        ) : typeof cell.value === "number" ? (
                                                            cell.value && cell.value.toLocaleString()
                                                        ) : (
                                                            cell.render("Cell") || ""
                                                        )
                                                    ) : cell.column.Header === "연월" && cell.value ? (
                                                        cell.value.substring(0, 7)
                                                    ) : cell.column.col === "pjbgDt" ? (
                                                        cell.value.substring(0, 7)
                                                    ) : typeof cell.value === "number" ? (
                                                        cell.value && cell.value.toLocaleString()
                                                    ) : (
                                                        cell.render("Cell") || ""
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                        </tbody>
                    ) : (
                        <tbody>
                            <tr>
                                <td
                                    colSpan={visibleColumnCount + 1}
                                    style={{ textAlign: "center", fontSize: "15px", height: "80px" }}
                                    className="back-lightgray">
                                    조회된 데이터가 없습니다.
                                </td>
                            </tr>
                        </tbody>
                    )}
                </table>
            {/* </div> */}
            <div className="me-pagenation">
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
            <CompanyModal width={600} height={720} title="거래처 목록" isOpen={isOpenModalCompany} onClose={() => setIsOpenModalCompany(false)} />
            <ProductInfoModal width={600} height={770} title="품목정보 목록" isOpen={isOpenModalProductInfo} onClose={() => setIsOpenModalProductInfo(false)} />
            <ProductGroupModal
                width={600}
                height={720}
                title="품목그룹 목록"
                isOpen={isOpenModalProductGroup}
                onClose={() => setIsOpenModalProductGroup(false)}
            />
            <EmployerInfoModal
                width={600}
                height={770}
                title="업무회원 목록"
                isOpen={isOpenModalEmployerInfo}
                onClose={() => setIsOpenModalEmployerInfo(false)}
                colName={colName}
            />
        </div>
    );
};

export default ReactDataTableURL;
