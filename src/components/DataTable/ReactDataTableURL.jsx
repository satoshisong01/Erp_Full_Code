import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { axiosDelete, axiosFetch, axiosPost, axiosScan, axiosUpdate } from "api/axiosFetch";
import { useTable, usePagination, useSortBy, useRowSelect } from "react-table";
import { PageContext } from "components/PageProvider";
import ModalPageCompany from "components/modal/ModalPageCompany";
import { v4 as uuidv4 } from "uuid";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ko from "date-fns/locale/ko"; // 한국어 로케일 설정
import ModalPagePgNm from "components/modal/ModalPagePgNm";

const ReactDataTableURL = (props) => {
    const { columns, customDatas, defaultPageSize, tableRef, viewPageName, customDatasRefresh, singleUrl, editing, hideCheckBox } = props;
    const {
        prevCurrentPageName,
        innerPageName,
        prevInnerPageName,
        setCurrentTable,
        setLengthSelectRow,
        newRowData,
        currentPageName,
        projectInfo,
        isSaveFormTable,
        companyInfo,
        setIsOpenModalCompany,
        isOpenModalCompany,
        setCompanyInfo,
        isOpenModalPgNm,
        projectPgNm,
        setProjectPgNm,
        setIsOpenModalPgNm,
    } = useContext(PageContext);

    const [tableData, setTableData] = useState([]);
    const [originTableData, setOriginTableData] = useState([]);
    // const [changeTable, setChangeTable] = useState([]);
    const pageSizeOptions = [5, 10, 15, 20, 30, 50, 100];
    const [isEditing, setIsEditing] = useState(false);
    const [current, setCurrent] = useState(viewPageName); //==viewPageName
    //const [selectRow, setSelectRow] = useState({}); //마지막으로 선택한 row
    const [rowIndex, setRowIndex] = useState(0);

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
        console.log("customDatas:", customDatas);
    }, [customDatas]);

    /* tab에서 컴포넌트 화면 변경 시 초기화  */
    useEffect(() => {
        if (currentPageName !== prevCurrentPageName || innerPageName !== prevInnerPageName) {
            // 현재 페이지와 이전 페이지가 같지 않다면
            toggleAllRowsSelected(false);
        }
        // 현재 보는 페이지(current)가 클릭한 페이지와 같은게 없다면 return
        if (current !== currentPageName && current !== innerPageName) {
            return;
        }
    }, [currentPageName, innerPageName]);

    /* 테이블 cell에서 수정하는 경우의 on off */
    useEffect(() => {
        if (current === innerPageName) {
            setIsEditing(editing !== undefined ? editing : isSaveFormTable); //테이블 상태 //inner tab일 때 테이블 조작
        }
        if (current === innerPageName && !isSaveFormTable) {
            if (current === "경비") {
                compareData(originTableData, tableData);
            }
            if (current === "경비 수주관리" || current === "경비 예산관리" || current === "경비 실행관리") {
                compareDataRun(originTableData, tableData);
            }
        }
    }, [innerPageName, isSaveFormTable]);

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
            GeneralExpensesOnAddRow(newRowData);
            companyOnAddRow(newRowData);
        }
    }, [newRowData]);

    /* 로우 클릭 */
    const onCLickRow = (row) => {
        toggleRowSelected(row.id);
    };

    const setValueData = (rowIndex) => {
        setIsOpenModalPgNm(true);
        setRowIndex(rowIndex);
    };

    const setValueDataCompany = (rowIndex) => {
        setIsOpenModalCompany(true);
        setRowIndex(rowIndex);
    };

    useEffect(() => {
        if (current === innerPageName && Object.keys(companyInfo).length > 0) {
            const updatedTableData = [...tableData];
            if (!updatedTableData[rowIndex]) {
                updatedTableData[rowIndex] = {}; // 해당 인덱스가 없으면 빈 객체 생성
            }
            if (updatedTableData[rowIndex].esntlId !== companyInfo.cltNm) {
                //중복할당 방지 코드
                updatedTableData[rowIndex].esntlId = companyInfo.cltNm;
                updatedTableData[rowIndex].cltId = companyInfo.cltId;
                setTableData(updatedTableData);
            }
            setCompanyInfo({}); // 초기화
        }
    }, [companyInfo, rowIndex, tableData]);

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
            initialState: { pageIndex: 0, pageSize: defaultPageSize || 10 }, // 초기값
        },
        useSortBy,
        usePagination,
        useRowSelect,
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

    const handleDateChange = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const formatted = `${year}-${month}-${day}`;
        //setSaveDay(formatted);
        console.log(formatted);
        return formatted;
    };

    const inputRef = useRef(null); //날짜

    const toggleCalendarVisible = (index) => {
        const updatedTableData = [...tableData];
        updatedTableData[index].calendarVisible = !tableData[index].calendarVisible;
        setTableData(updatedTableData);
    };

    /* table button 활성화 on off */
    useEffect(() => {
        if (current === currentPageName || current === innerPageName) {
            // 현재 보는 페이지라면
            if (selectedFlatRows.length > 0) {
                setLengthSelectRow(selectedFlatRows.length);
                //setSelectRow(selectedFlatRows[selectedFlatRows.length - 1].values); // 선택한 rows의 마지막 배열
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
        // setChangeTable(newTableData);
    };
    useEffect(() => {
        calTotalPrice();
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

    const [dataBuket, setDataBuket] = useState({});
    const [prevDataBuket, setPrevDataBuket] = useState({});

    useEffect(() => {
        console.log("tableData:", tableData);
    }, [tableData]);

    useEffect(() => {
        setSavePgNm(projectPgNm);
        setDataBuket(projectPgNm.pgNm, projectPgNm.pgId);
    }, [projectPgNm]);

    const [savePgNm, setSavePgNm] = useState([projectPgNm]);

    useEffect(() => {
        if (!isOpenModalPgNm) {
            // isOpenModalPgNm이 false로 변경된 경우에 실행할 코드를 여기에 작성
            if (savePgNm) {
                const updatedTableData = [...tableData];
                if (dataBuket !== prevDataBuket) {
                    if (dataBuket && updatedTableData[rowIndex]) {
                        console.log(rowIndex, "rowIndex");
                        updatedTableData[rowIndex].pgNm = savePgNm.pgNm;
                        updatedTableData[rowIndex].pgId = savePgNm.pgId;
                        setTableData(updatedTableData);
                    }

                    setPrevDataBuket(dataBuket);
                    setProjectPgNm("");
                }
            }
        }
    }, [isOpenModalPgNm, savePgNm, dataBuket, rowIndex, tableData, prevDataBuket]);

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

    // const [deleteNumList, setDeleteNumList] = useState([]);
    const onDeleteRow = (row) => {
        const rowId = row.index;
        // const deletedPjbgId = tableData[rowId].pjbgId;
        // setDeleteNumList((prevIds) => [...prevIds, deletedPjbgId]);
        const updateTableData = tableData.filter((_, index) => index !== rowId);
        setTableData([...updateTableData]);
    };

    const pageSizeChange = (value) => {
        setPageSize(Number(value)); // 페이지 크기 변경
        gotoPage(0); // 첫 페이지로 이동
    };

    //-------------------------------배열 추가, 수정, 삭제

    const addItem = async (addData) => {
        const url = `/api/baseInfrm/product/pjbudget/addList.do`;
        const resultData = await axiosPost(url, addData);
        console.log(resultData, "더해진거맞음?");
        if (resultData) {
            customDatasRefresh && customDatasRefresh();
        }
    };

    const addItemArray = async (addData) => {
        const url = `/api/baseInfrm/product/pjbudget/addArrayList.do`;
        const resultData = await axiosPost(url, addData);
        console.log(resultData, "더해진 배열 맞음?");
        if (resultData) {
            customDatasRefresh && customDatasRefresh();
        }
    };

    const updateItem = async (toUpdate) => {
        const url = `/api/baseInfrm/product/pjbudget/editList.do`;
        console.log(toUpdate, "변경되는 값?");
        const resultData = await axiosUpdate(url, toUpdate);
        console.log(resultData, "변경된거 맞음?");

        if (resultData) {
            customDatasRefresh && customDatasRefresh();
        }
    };

    const updateItemArray = async (toUpdate) => {
        const dataArray = generateUpdateObjects(toUpdate);
        const url = `/api/baseInfrm/product/pjbudget/editList.do`;
        console.log(toUpdate, "변경되는 값?");
        const resultData = await axiosUpdate(url, dataArray);
        console.log(resultData, "변경된거 맞음?");

        if (resultData) {
            customDatasRefresh && customDatasRefresh();
        }
    };

    const deleteItem = async (removeItem) => {
        const url = `/api/baseInfrm/product/pjbudget/removeAll.do`;
        const resultData = await axiosDelete(url, removeItem);
        console.log(resultData, "지워진거맞음?");

        if (resultData) {
            customDatasRefresh && customDatasRefresh();
        }
    };

    const generateUpdateObjects = (updatedData) => {
        let updates = [];

        updatedData.forEach((upItem) => {
            const { pjbgId } = upItem; // id 배열
            const colNames = Object.keys(upItem).filter((key) => key.startsWith("pjbgPrice")); // 경비종류 배열
            console.log(pjbgId, colNames);
            if (pjbgId && colNames && pjbgId.length > 0 && colNames.length > 0 && pjbgId.length === colNames.length) {
                colNames.forEach((name, index) => {
                    const dataSet = {
                        modeCode: upItem.modeCode,
                        pgNm: upItem.pgNm,
                        pgId: upItem.pgId,
                        pjbgBeginDt: upItem.pjbgBeginDt,
                        pjbgDesc: upItem.pjbgDesc,
                        pjbgDt: upItem.pjbgDt,
                        pjbgManpower: upItem.pjbgManpower,
                        pjbgEndDt: upItem.pjbgEndDt,
                        poiId: projectInfo.poiId,
                        pjbgId: pjbgId[index],
                        pjbgPrice: upItem[name],
                    };

                    updates.push(dataSet);
                });
            }
        });

        return updates;
    };

    // 초기 데이터와 수정된 데이터를 비교하는 함수

    const compareDataRun = (originData, updatedData) => {
        //pjbgTypeCode
        console.log(originData);
        console.log(updatedData);

        const filterData = updatedData.filter((data) => data.pgNm); //pgNm 없는 데이터 제외
        const originDataLength = originData ? originData.length : 0;
        const updatedDataLength = filterData ? filterData.length : 0;

        if (originDataLength > updatedDataLength) {
            updateItemArray(filterData); //수정

            const delList = [];
            const delListTest = [];
            for (let i = updatedDataLength; i < originDataLength; i++) {
                delList.push(...originData[i].pjbgId);
                delListTest.push(originData[i]);
            }
            console.log(delList, "삭제리스트 제대로 뽑나");
            deleteItem(delList); //삭제
        } else if (originDataLength === updatedDataLength) {
            updateItemArray(filterData); //수정
        } else if (originDataLength < updatedDataLength) {
            const updateList = [];

            for (let i = 0; i < originDataLength; i++) {
                updateList.push(filterData[i]);
            }
            updateItemArray(filterData); //수정

            const addList = [];
            for (let i = originDataLength; i < updatedDataLength; i++) {
                const newItem = {
                    ...filterData[i],
                    poiId: projectInfo.poiId,
                    pjbgDt: filterData[i].pjbgBeginDt,
                    modeCode: current === "경비 예산관리" ? "EXCP" : current === "경비 실행관리" ? "EXCU" : "EXDR",
                    pjbgTypeCode1: filterData[i].pjbgPrice01,
                    pjbgTypeCode2: filterData[i].pjbgPrice02,
                    pjbgTypeCode3: filterData[i].pjbgPrice03,
                    pjbgTypeCode4: filterData[i].pjbgPrice04,
                    pjbgTypeCode5: filterData[i].pjbgPrice05,
                };
                addList.push(newItem);
            }
            console.log(addList, "addList 멀까2");
            addItemArray(addList); //추가
        }
    };

    const compareData = (originData, updatedData) => {
        const filterData = updatedData.filter((data) => data.pjbgTypeCode); //pmpMonth가 없는 데이터 제외
        const originDataLength = originData ? originData.length : 0;
        const updatedDataLength = filterData ? filterData.length : 0;
        console.log("여기탐?");
        if (originDataLength > updatedDataLength) {
            updateItem(filterData); //수정

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
                    <select className="select" id={uuidv4()} value={pageSize || defaultPageSize} onChange={(e) => pageSizeChange(e.target.value)}>
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
                                        <span style={{ color: "red", margin: 0 }}>{column.require === true ? "*" : ""}</span>
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
                {tableData.length <= 0 && (
                    <div style={{ display: "flex", width: "1200px", margin: "auto", alignItems: "center", justifyContent: "center" }}>
                        <div style={{ fontSize: 15 }}>no data</div>
                    </div>
                )}
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
                                        <td {...cell.getCellProps()} className={cellIndex === 0 ? "first-column" : "other-column"}>
                                            {cell.column.id === "selection" ? (
                                                cell.render("Cell")
                                            ) : isEditing ? (
                                                cell.column.type === "input" ? (
                                                    <input
                                                        type="text"
                                                        value={
                                                            tableData[row.index] && tableData[row.index][cell.column.id] !== undefined
                                                                ? tableData[row.index][cell.column.id] || cell.value
                                                                : cell.value || ""
                                                        }
                                                        name={cell.column.id}
                                                        onChange={(e) => onChangeInput(e, row)}
                                                    />
                                                ) : cell.column.type === "button" ? (
                                                    <div>
                                                        <input
                                                            className="buttonSelect"
                                                            id={cell.column.id}
                                                            name={cell.column.col}
                                                            key={cell.column.id + row.index}
                                                            onClick={() => setValueData(rowIndex)}
                                                            type="text"
                                                            placeholder={`품목그룹명을 선택해 주세요.`}
                                                            value={tableData[rowIndex].pgNm || ""}
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
                                                ) : cell.column.type === "buttonCompany" ? (
                                                    <div>
                                                        <input
                                                            className="buttonSelect"
                                                            id={cell.column.id}
                                                            name={cell.column.id}
                                                            onClick={() => setValueDataCompany(rowIndex)}
                                                            type="text"
                                                            placeholder={`거래처명을 선택해 주세요.`}
                                                            value={tableData[rowIndex][cell.column.id] || ""}
                                                            onChange={(e) => handleChange(e, rowIndex, cell.column.id)}
                                                            readOnly
                                                        />
                                                    </div>
                                                ) : cell.column.type === "costDateStart" ? (
                                                    <div className="box3-1 boxDate">
                                                        <DatePicker
                                                            key={cell.column.id + row.index}
                                                            name={cell.column.col}
                                                            className="form-control flex-item"
                                                            type="text"
                                                            value={tableData[row.index].pjbgBeginDt ? tableData[row.index].pjbgBeginDt.substring(0, 7) : ""}
                                                            ref={inputRef}
                                                            dateFormat="yyyy-MM"
                                                            showMonthYearPicker
                                                            locale={ko} // 한국어로 설정
                                                            onClick={() => toggleCalendarVisible(row.index)}
                                                            onChange={(date) => {
                                                                const formatted = handleDateChange(date);
                                                                const updatedTableData = [...tableData];
                                                                updatedTableData[row.index].pjbgBeginDt
                                                                    ? (updatedTableData[row.index].pjbgBeginDt = formatted)
                                                                    : (updatedTableData[row.index].pjbgBeginDt = formatted);
                                                                setTableData(updatedTableData);
                                                            }}
                                                        />
                                                    </div>
                                                ) : cell.column.type === "costDateEnd" ? (
                                                    <div className="box3-1 boxDate">
                                                        <DatePicker
                                                            key={cell.column.id + row.index}
                                                            name={cell.column.col}
                                                            className="form-control flex-item"
                                                            type="text"
                                                            value={tableData[row.index].pjbgEndDt ? tableData[row.index].pjbgEndDt.substring(0, 7) : ""}
                                                            ref={inputRef}
                                                            dateFormat="yyyy-MM"
                                                            showMonthYearPicker
                                                            locale={ko} // 한국어로 설정
                                                            onClick={() => toggleCalendarVisible(row.index)}
                                                            onChange={(date) => {
                                                                const formatted = handleDateChange(date);
                                                                const updatedTableData = [...tableData];
                                                                updatedTableData[row.index].pjbgEndDt
                                                                    ? (updatedTableData[row.index].pjbgEndDt = formatted)
                                                                    : (updatedTableData[row.index].pjbgEndDt = formatted);
                                                                setTableData(updatedTableData);
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    cell.render("Cell")
                                                )
                                            ) : cell.column.Header === "연월" && cell.value ? (
                                                cell.value.substring(0, 7)
                                            ) : (
                                                cell.render("Cell") || ""
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
            {isOpenModalCompany && <ModalPageCompany rowIndex={rowIndex} closeLocal={() => setIsOpenModalCompany(false)} />}
            {isOpenModalPgNm && <ModalPagePgNm rowIndex={rowIndex} onClose={() => setIsOpenModalPgNm(false)} />}
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
