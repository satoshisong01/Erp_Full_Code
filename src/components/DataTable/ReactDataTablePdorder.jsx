import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { axiosDelete, axiosFetch, axiosPost, axiosScan, axiosUpdate } from "api/axiosFetch";
import { useTable, usePagination, useSortBy, useRowSelect } from "react-table";
import { PageContext } from "components/PageProvider";
import ModalPagePgNm from "components/modal/ModalPagePgNm";

import ModalPagePdiNm from "components/modal/ModalPagePdiNm";
import ModalPageCompany from "components/modal/ModalPageCompany";

const ReactDataTablePdorder = (props) => {
    const {
        columns,
        suffixUrl,
        flag,
        detailUrl,
        customDatas,
        defaultPageSize,
        tableRef,
        viewPageName,
        customerList,
        sendSelected,
        singleUrl,
        customDatasRefresh,
    } = props;
    const {
        nameOfButton,
        setNameOfButton,
        isOpenModalPgNm,
        setIsOpenModalPgNm,
        projectPgNm,
        setProjectPgNm,
        searchData,
        setSearchData,
        prevCurrentPageName,
        innerPageName,
        prevInnerPageName,
        setCurrentTable,
        setLengthSelectRow,
        newRowData,
        currentPageName,
        isCancelTable,
        setIsCancelTable,
        projectInfo,
        projectPdiNm,
        setIsOpenModalPdiNm,
        isOpenModalPdiNm,
        setProjectPdiNm,
        companyInfo,
        isOpenModalCompany,
        setIsOpenModalCompany,
        isModalTable,
        modalPageName,
        setModalLengthSelectRow,
        isSaveFormTable,
    } = useContext(PageContext);

    const [tableData, setTableData] = useState([]);
    const [originTableData, setOriginTableData] = useState([]);
    const pageSizeOptions = [5, 10, 15, 20, 30, 50, 100];
    const [isEditing, setIsEditing] = useState(false);
    const [current, setCurrent] = useState(""); //==viewPageName
    const [selectRow, setSelectRow] = useState({}); //마지막으로 선택한 row
    const [rowIndex, setRowIndex] = useState(0);

    //취소시에 오리지널 테이블로 돌아감
    useEffect(() => {
        if (isCancelTable === true) setTableData(originTableData);
        setIsCancelTable(false);
    }, [isCancelTable]);

    //------------------------------------------------

    /* 최초 실행, 데이터 초기화  */
    useEffect(() => {
        if (suffixUrl || detailUrl) {
            fetchAllData();
        }
        if (tableRef) {
            setCurrentTable(tableRef);
        }
        setCurrent(viewPageName);
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
        if (currentPageName !== prevCurrentPageName || innerPageName !== prevInnerPageName) {
            // 현재 페이지와 이전 페이지가 같지 않다면
            toggleAllRowsSelected(false);
        }
        // 현재 보는 페이지(current)가 클릭한 페이지와 같은게 없다면 return
        if ((current !== currentPageName && current !== innerPageName) || (current !== modalPageName && current !== innerPageName)) {
            return;
        }
    }, [current, currentPageName, innerPageName, modalPageName]);

    /* 테이블 cell에서 수정하는 경우의 on off */
    useEffect(() => {
        setIsEditing(flag);
        if (current === currentPageName || (current === innerPageName && !isSaveFormTable)) {
            compareData(originTableData, tableData);
        }
    }, [flag, isSaveFormTable]);

    /* table의 button 클릭 시 해당하는 함수 실행 */
    useEffect(() => {
        if (current === currentPageName || current === innerPageName) {
            if (nameOfButton === "refresh") {
                refreshClick();
            } else if (nameOfButton === "csv") {
            } else if (nameOfButton === "copy") {
            } else if (nameOfButton === "print") {
            } else if (nameOfButton === "search") {
                searchClick();
            }
            setNameOfButton(""); //초기화
        }
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
                notView: column.notView,
                disabled: column.disabled,
            })),
        [columns]
    );

    useEffect(() => {
        //newRowData 변동 시 새로운 행 추가
        if (newRowData && Object.keys(newRowData).length !== 0) {
            addList(newRowData);
        }
    }, [newRowData]);

    /* 서버에서 전체 데이터 호출 */
    const fetchAllData = async () => {
        if (!suffixUrl) return;
        const url = `/api${suffixUrl}/totalListAll.do`;
        const resultData = await axiosFetch(url, { useAt: "Y" });
        if (resultData) {
            setTableData([...resultData]);
        } else if (!resultData) {
            setTableData(Array(defaultPageSize || 10).fill({})); // 빈 배열 추가
        }
    };

    /* 새로고침 */
    const refreshClick = () => {
        fetchAllData();
    };

    /* 데이터 검색 */
    const searchClick = async () => {
        if (!suffixUrl && !detailUrl) return;
        let url = ``;
        if (searchData) {
            if (customerList) {
                url = `/api${suffixUrl}/${customerList}/totalListAll.do`;
            } else {
                url = `/api${suffixUrl || detailUrl}/totalListAll.do`;
            }
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
    const onClickCell = (e, cell) => {};

    /* 로우 클릭 */
    const onCLickRow = (row) => {
        toggleRowSelected(row.id);
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
        if (isModalTable && current === modalPageName) {
            //모달화면일때
            setModalLengthSelectRow(selectedFlatRows.length);
            if (selectedFlatRows.length > 0) {
                setSelectRow(selectedFlatRows[selectedFlatRows.length - 1].values);
                projectInfo.poId = selectedFlatRows[selectedFlatRows.length - 1].original.poId; //품목수주
                projectInfo.poDesc = selectedFlatRows[selectedFlatRows.length - 1].original.poDesc;
                sendSelected && sendSelected(selectedFlatRows[selectedFlatRows.length - 1].values);
            }
        } else if (!isModalTable && (current === currentPageName || current === innerPageName)) {
            //모달화면이 아닐때
            setLengthSelectRow(selectedFlatRows.length);
            selectedFlatRows.length > 0 && setSelectRow(selectedFlatRows[selectedFlatRows.length - 1].values);
            selectedFlatRows.length > 0 && sendSelected && sendSelected(selectedFlatRows[selectedFlatRows.length - 1].values);
        }
    }, [selectedFlatRows]);

    /* 새로운 빈 row 추가 */
    const onAddRow = () => {
        const newRow = {};
        columnsConfig.forEach((column) => {
            if (column.accessor === "poiId") {
                newRow[column.accessor] = projectInfo.poiId; // poiId를 항상 SLSP로 설정
            } else {
                newRow[column.accessor] = null; // 다른 열은 초기화
            }
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
    const [companyBuket, setCompanyBuket] = useState({});
    const [preCompanyBuket, setPreCompanyBuket] = useState({});
    const [dataBuketPdiNm, setDataBuketPdiNm] = useState({});
    const [prevDataBuket, setPrevDataBuket] = useState({});
    const [prevDataBuketPdiNm, setPrevDataBuketPdiNm] = useState({});

    useEffect(() => {
        setDataBuket(projectPgNm.pgNm);
        setCompanyBuket(companyInfo.esntlId);
        setDataBuketPdiNm(projectPdiNm.pdiId, projectPdiNm.pdiNm, projectPdiNm.pgNm, projectPdiNm.pdiWght, projectPdiNm.pdiStnd, projectPdiNm.pdiMenufut);
    }, [projectPgNm, companyInfo]);

    const [saveProjectPdiNm, setSaveProjectPdiNm] = useState([projectPdiNm]);
    useEffect(() => {
        setSaveProjectPdiNm(projectPdiNm);
    }, [projectPdiNm]);

    const setValueData = (rowIndex) => {
        setIsOpenModalPgNm(true);
        setRowIndex(rowIndex);
    };

    const setValueCompany = (rowIndex) => {
        //setRowIndex()
        setIsOpenModalCompany(true);
        setRowIndex(rowIndex);
    };

    //아이템 선택후 중복할당 방지 코드
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

        if (!isOpenModalPdiNm) {
            // dataBuket 객체 자체의 참조가 변경되었을 때만 코드 실행
            if (saveProjectPdiNm) {
                if (dataBuketPdiNm !== prevDataBuketPdiNm) {
                    const updatedTableData = [...tableData];
                    if (dataBuketPdiNm && updatedTableData[rowIndex]) {
                        updatedTableData[rowIndex].pdiNm = dataBuketPdiNm.pdiNm;
                        updatedTableData[rowIndex].pgNm = dataBuketPdiNm.pgNm;
                        updatedTableData[rowIndex].pdiWght = dataBuketPdiNm.pdiWght;
                        updatedTableData[rowIndex].pdiStnd = dataBuketPdiNm.pdiStnd;
                        updatedTableData[rowIndex].pdiMenufut = dataBuketPdiNm.pdiMenufut;
                        updatedTableData[rowIndex].pdiId = dataBuketPdiNm.pdiId;
                        setTableData(updatedTableData);
                    }

                    // dataBuketPdiNm 값을 업데이트할 때 prevDataBuket도 업데이트
                    setPrevDataBuketPdiNm(dataBuketPdiNm);
                    setProjectPdiNm("");
                }
            }
        }

        if (!isOpenModalCompany) {
            // dataBuket 객체 자체의 참조가 변경되었을 때만 코드 실행
            if (companyBuket !== preCompanyBuket) {
                const updatedTableData = [...tableData];
                if (companyBuket && updatedTableData[rowIndex]) {
                    updatedTableData[rowIndex].esntlId = companyBuket;
                    setTableData(updatedTableData);
                }

                // companyBuket 값을 업데이트할 때 prevDataBuket도 업데이트
                setPreCompanyBuket(companyBuket);
                //setCompanyInfo("");
            }
        }
    }, [
        isOpenModalCompany,
        isOpenModalPgNm,
        isOpenModalPdiNm,
        dataBuket,
        dataBuketPdiNm,
        companyBuket,
        rowIndex,
        tableData,
        prevDataBuket,
        prevDataBuketPdiNm,
        preCompanyBuket,
    ]);

    //선택된 항목 순서(인덱스)별
    const [countIndex, setCountIndex] = useState(0);

    useEffect(() => {
        setValueDataPdiNm(countIndex, saveProjectPdiNm);
        if (saveProjectPdiNm) {
            setValueDataPdiNm(countIndex, saveProjectPdiNm);
        }
    }, [saveProjectPdiNm]);

    const goSetting = (rowIndex) => {
        setCountIndex(rowIndex);
        setIsOpenModalPdiNm(true);
    };

    const setValueDataPdiNm = (rowIndex, selectedPdiNm) => {
        // 선택된 품명에 해당하는 데이터 찾기
        const selectedPdiData = selectedPdiNm;

        if (selectedPdiData) {
            // 테이블 데이터를 복제
            const updatedTableData = [...tableData];

            // 선택된 품명의 데이터로 해당 행(row)의 데이터 업데이트
            updatedTableData[rowIndex] = {
                ...updatedTableData[rowIndex], // 다른 속성들을 그대로 유지
                ...selectedPdiData, // projectPdiNm 객체의 데이터로 업데이트
            };

            // 업데이트된 데이터로 tableData 업데이트
            setTableData(updatedTableData);
        } else {
            console.log(`선택된 품명(${selectedPdiNm})에 대한 데이터를 찾을 수 없습니다.`);
        }
    };

    const handleChange = (e, row, accessor) => {
        const { value } = e.target;
        const index = row.index;
        const updatedTableData = [...tableData];
        updatedTableData[row.index][accessor] = value;
        // 수정된 데이터로 tableData 업데이트
        if (accessor === "byUnitPrice" || accessor === "byStandardMargin" || accessor === "byConsumerOutputRate" || accessor === "byQunty") {
            if (row.original.byUnitPrice && row.original.byStandardMargin && row.original.byConsumerOutputRate && row.original.byQunty) {
                // 1.원가(견적가) : 수량 * 원단가
                const estimatedCost = row.original.byQunty * row.original.byUnitPrice;
                // 2.단가 : 원가(견적가) / (1 - 사전원가기준이익율)
                const unitPrice = division(estimatedCost, 1 - row.original.byStandardMargin / 100);
                // 3.금액 : 수량 * 단가
                const planAmount = row.original.byQunty * unitPrice;
                // 4.소비자단가 : 단가 / 소비자산출율
                const consumerPrice = division(unitPrice, row.original.byConsumerOutputRate);
                // 5.소비자금액 : 수량 * 소비자단가
                const consumerAmount = row.original.byQunty * consumerPrice;
                // 6.이익금 : 금액 - 원가(견적가)
                const plannedProfits = planAmount - estimatedCost;
                // 7.이익률 : 이익금 / 금액
                const plannedProfitMargin = division(plannedProfits, planAmount);

                updatedTableData[index]["estimatedCost"] = Math.round(estimatedCost);
                updatedTableData[index]["unitPrice"] = Math.round(unitPrice);
                updatedTableData[index]["planAmount"] = Math.round(planAmount);
                updatedTableData[index]["consumerPrice"] = Math.round(consumerPrice * 100);
                updatedTableData[index]["consumerAmount"] = Math.round(consumerAmount * 100);
                updatedTableData[index]["plannedProfits"] = Math.round(plannedProfits);
                updatedTableData[index]["plannedProfitMargin"] = Math.round(plannedProfitMargin * 100);
            }
        }
        setTableData(updatedTableData);
    };

    const division = (value1, value2) => {
        if (!value1 || !value2) {
            return 0;
        }
        return Math.round(value1 / value2);
    };

    //-------------------------------배열 추가, 수정, 삭제
    const addList = async (addNewData) => {
        if (!singleUrl) return;
        const url = `/api${singleUrl}/addList.do`;
        const resultData = await axiosPost(url, addNewData);
        if (resultData && resultData.length > 0) {
            console.log("추가완료");
            customDatasRefresh();
        } else {
            console.log("추가실패");
        }
    };
    const updateList = async (toUpdate) => {
        if (!singleUrl) return;
        const url = `/api${singleUrl}/editList.do`;
        const resultData = await axiosUpdate(url, toUpdate);
        if (resultData && resultData.length > 0) {
            console.log("수정완료");
            customDatasRefresh();
        } else {
            console.log("수정실패");
        }
    };

    const deleteList = async (removeItem) => {
        if (!singleUrl) return;
        const url = `/api${singleUrl}/removeAll.do`;
        const resultData = await axiosDelete(url, removeItem);
        if (resultData && resultData.length > 0) {
            customDatasRefresh();
        } else {
            console.log("삭제실패");
        }
    };

    // 초기 데이터와 수정된 데이터를 비교하는 함수

    //구매용
    const compareData = (originData, updatedData) => {
        // const filterData = updatedData.filter((data) => data.pmpMonth); //필수값 체크
        const originDataLength = originData ? originData.length : 0;
        const updatedDataLength = updatedData ? updatedData.length : 0;
        if (originDataLength > updatedDataLength) {
            updatedData.forEach((data) => {
                data.poId = projectInfo.poId;
                data.modeCode = "SLSP";
            });
            updateList(updatedData);

            const originAValues = originData.map((item) => item.byId); //삭제할 id 추출
            const extraOriginData = originAValues.slice(updatedDataLength);

            deleteList(extraOriginData);
        } else if (originDataLength === updatedDataLength) {
            updatedData.forEach((data) => {
                data.poId = projectInfo.poId;
                data.modeCode = "SLSP";
            });
            updateList(updatedData);
        } else if (originDataLength < updatedDataLength) {
            const toAdds = [];
            const addUpdate = [];
            for (let i = 0; i < originDataLength; i++) {
                const temp = { ...updatedData[i] };
                temp.poId = projectInfo.poId;
                temp.modeCode = "SLSP";
                addUpdate.push(temp);
            }
            updateList(addUpdate);

            for (let i = originDataLength; i < updatedDataLength; i++) {
                const temp = { ...updatedData[i] };
                temp.poId = projectInfo.poId;
                temp.modeCode = "SLSP";
                toAdds.push(temp);
            }
            addList(toAdds);
        }
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
                                                        name={cell.column.col}
                                                        onChange={(e) => handleChange(e, row, cell.column.id)}
                                                        disabled={cell.column.disabled}
                                                    />
                                                ) : cell.column.type === "select" ? (
                                                    <select
                                                        name={cell.column.col}
                                                        defaultValue={
                                                            tableData[row.index] && tableData[row.index][cell.column.id] !== undefined
                                                                ? tableData[row.index][cell.column.id]
                                                                : cell.column.options[row.index].value || "" // 기본값: 해당 행의 인덱스에 해당하는 옵션의 value 값 또는 빈 문자열
                                                        }
                                                        onChange={(e) => handleChange(e, row, cell.column.id)}>
                                                        {cell.column.options.map((option, index) => (
                                                            <option key={index} value={option.value}>
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : // : cell.column.type === "button" ? (
                                                //    <div>
                                                //        <input
                                                //            className="buttonSelect"
                                                //            id={cell.column.id}
                                                //            name={cell.column.id}
                                                //            onClick={() => setValueData(rowIndex)}
                                                //            type="text"
                                                //            placeholder={projectPgNm.pgNm ? projectPgNm.pgNm : `품목그룹명을 선택해 주세요.`}
                                                //            value={tableData[rowIndex].pgNm || ""}
                                                //            onChange={(e) => handleChange(e, rowIndex, cell.column.id)}
                                                //            readOnly
                                                //        />
                                                //    </div>
                                                //)
                                                cell.column.type === "buttonPdiNm" ? (
                                                    <div>
                                                        <input
                                                            className="buttonSelect"
                                                            id={cell.column.id}
                                                            name={cell.column.col}
                                                            onClick={() => goSetting(rowIndex)}
                                                            type="text"
                                                            placeholder={`품명을 선택해 주세요.`}
                                                            value={tableData[rowIndex].pdiNm || ""}
                                                            onChange={(e) => handleChange(e, row, cell.column.id)}
                                                            readOnly
                                                        />
                                                    </div>
                                                ) : cell.column.type === "buttonCompany" ? (
                                                    <div>
                                                        <input
                                                            className="buttonSelect"
                                                            id={cell.column.id}
                                                            name={cell.column.col}
                                                            onClick={() => setValueCompany(rowIndex)}
                                                            type="text"
                                                            placeholder={`거래처명을 선택해 주세요.`}
                                                            value={tableData[rowIndex].esntlId || ""}
                                                            onChange={(e) => handleChange(e, row, cell.column.id)}
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

            {isOpenModalPgNm && <ModalPagePgNm rowIndex={rowIndex} onClose={() => setIsOpenModalPgNm(false)} />}
            {isOpenModalPdiNm && <ModalPagePdiNm rowIndex={rowIndex} onClose={() => setIsOpenModalPdiNm(false)} />}
            {isOpenModalCompany && <ModalPageCompany rowIndex={rowIndex} onClose={() => setIsOpenModalCompany(false)} />}
        </>
    );
};

export default ReactDataTablePdorder;
