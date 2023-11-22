import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { axiosDelete, axiosFetch, axiosPost, axiosScan, axiosUpdate } from "api/axiosFetch";
import { useTable, usePagination, useSortBy, useRowSelect } from "react-table";
import { PageContext } from "components/PageProvider";
import DataPutModal from "./DataPutModal";
import DataPostModal2 from "./DataPostModal2";
import DeleteModal from "components/modal/DeleteModal";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ko from "date-fns/locale/ko"; // 한국어 로케일 설정
import ModalPagePgNm from "components/modal/ModalPagePgNm";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { v4 as uuidv4 } from "uuid";
import DayPicker from "components/input/DayPicker";
import MonthPicker from "components/input/MonthPicker";
const ReactDataTable = (props) => {
    const {
        columns,
        suffixUrl,
        customDatas,
        defaultPageSize,
        tableRef,
        viewPageName,
        customDatasRefresh,
        singleUrl,
        sendToParentTables,
        sendSelected,
        hideCheckBox,
        editing,
    } = props;
    const {
        nameOfButton,
        setNameOfButton,
        searchData,
        setSearchData,
        prevCurrentPageName,
        innerPageName,
        prevInnerPageName,
        setCurrentTable,
        setLengthSelectRow,
        setModalLengthSelectRow,
        isModalTable,
        newRowData,
        currentPageName,
        modalPageName,
        isCancelTable,
        setIsCancelTable,
        projectInfo,
        isOpenModalPgNm,
        setIsOpenModalPgNm,
        projectPgNm,
        setProjectPgNm,
        setProjectInfo,
        isSaveFormTable,
        unitPriceList,
    } = useContext(PageContext);

    const [tableData, setTableData] = useState([]);
    const [originTableData, setOriginTableData] = useState([]);
    const pageSizeOptions = [5, 10, 15, 20, 30, 50, 100];
    const [openModalMod, setOpenModalMod] = useState(false);
    const [openModalAdd, setOpenModalAdd] = useState(false);
    const [modalViewDatas, setModalViewDatas] = useState([]); //modal에 띄어줄 목록
    const [current, setCurrent] = useState(viewPageName); //==viewPageName
    const [selectRow, setSelectRow] = useState({}); //마지막으로 선택한 row
    const [rowIndex, setRowIndex] = useState(0);

    const handleDateClick = (date, colName, index) => {
        const updatedTableData = [...tableData];
        updatedTableData[index][colName] = date;
        setTableData(updatedTableData);
    };

    const [isEditing, setIsEditing] = useState(false);

    //------------------------------------------------ 달력부분
    const inputRef = useRef(null); //날짜
    const calendarRef = useRef(null);

    //취소시에 오리지널 테이블로 돌아감
    useEffect(() => {
        if (isCancelTable === true) setTableData(originTableData);
        setIsCancelTable(false); //초기화
    }, [isCancelTable]);

    const handleDateChange = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const formatted = `${year}-${month}-${day}`;
        //setSaveDay(formatted);
        console.log(formatted);
        return formatted;
    };

    const toggleCalendarVisible = (index) => {
        const updatedTableData = [...tableData];
        updatedTableData[index].calendarVisible = !tableData[index].calendarVisible;
        setTableData(updatedTableData);
    };

    useEffect(() => {
        fetchAllData();
        // 문서의 다른 부분을 클릭했을 때 창을 닫기 위한 이벤트 핸들러 추가
        const handleDocumentClick = (e) => {
            if (calendarRef.current && !calendarRef.current.contains(e.target)) {
                // 달력 요소 밖을 클릭한 경우
                const updatedTableData = tableData.map((item) => ({ ...item, calendarVisible: false }));
                setTableData(updatedTableData);
            }
        };

        // 이벤트 핸들러 등록
        document.addEventListener("mousedown", handleDocumentClick);

        setCurrent(viewPageName); //현재페이지
        setCurrentTable(tableRef); //현재테이블

        if (suffixUrl) {
            fetchAllData();
        }

        return () => {
            // 컴포넌트 언마운트 시에 이벤트 핸들러 제거
            document.removeEventListener("mousedown", handleDocumentClick);
        };
    }, []);

    //------------------------------------------------

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
        if (current === innerPageName) {
            setIsEditing(editing !== undefined ? editing : isSaveFormTable); //테이블 상태 //inner tab일 때 테이블 조작
        }
        if (current === innerPageName && !isSaveFormTable) {
            //inner tab에서 저장을 눌렀을 때
            if (innerPageName === "인건비 수주관리" || innerPageName === "인건비 예산관리" || innerPageName === "인건비 실행관리") {
                sendToParentTables(originTableData, tableData);
            } else {
                compareData(originTableData, tableData);
            }
        }
        if (current !== innerPageName) {
            setTableData([]); //초기화
        }
    }, [innerPageName, isSaveFormTable]);

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
        //컬럼 초기 상태
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
                require: column.require,
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
        if (!suffixUrl) return;
        const url = `/api${suffixUrl}/totalListAll.do`;
        const resultData = await axiosFetch(url, { useAt: "Y" });
        if (resultData) {
            setTableData([...resultData]);
        } else if (!resultData) {
            setTableData(Array(defaultPageSize || 10).fill({})); // 빈 배열 추가
        }
    };

    /* 데이터 수정 */
    const modifyClick = async (updatedData) => {
        if (!updatedData) {
            setOpenModalMod(true);
        } else {
            // 수정데이터가 있다면
            const url = `/api${suffixUrl}/edit.do`;
            const requestData = { ...updatedData, lockAt: "Y", useAt: "Y" };
            const resultData = await axiosUpdate(url, requestData);
            if (resultData) {
                alert("값을 변경했습니다💚💚");
                if (customDatas) {
                    customDatasRefresh(); //부모로 반환
                } else {
                    fetchAllData();
                }
            } else if (!resultData) {
                alert("modify error: table");
            }
            setOpenModalMod(false);
        }
    };

    /* 데이터 삭제 */
    const deleteClick = async (btnLabel) => {
        if (!suffixUrl && !singleUrl) return;
        const deleteRows = selectedFlatRows && selectedFlatRows.map((row) => row.values);
        if (!btnLabel) {
            // 최초, 파라미터가 없을 때
            setModalViewDatas(deleteRows);
        } else if (btnLabel === "확인") {
            const pkColumn = columns[0].col;
            const deletePkArr = deleteRows.map((item) => item[pkColumn]); //값만 가져오는데...
            const url = `/api${suffixUrl || singleUrl}/removeAll.do`;
            const resultData = await axiosDelete(url, deletePkArr);
            if (resultData) {
                if (customDatas) {
                    customDatasRefresh(); //부모로 반환
                } else {
                    fetchAllData();
                }
                alert("삭제되었습니다🧹🧹");
            } else if (!resultData) {
                alert("delete error: table");
            }
        }
    };

    /* 새로고침 */
    const refreshClick = () => {
        fetchAllData();
    };

    /* 데이터 추가 */
    const addClick = async (addData) => {
        setOpenModalAdd(false);
        if (!suffixUrl && !singleUrl) return;
        if (addData && typeof addData === "object" && !Array.isArray(addData)) {
            const url = `/api${suffixUrl}/add.do`;
            const dataToSend = {
                ...addData,
                lockAt: "Y",
                useAt: "Y",
                deleteAt: "N",
                poiId: projectInfo.poiId,
                poiVersion: projectInfo.poiVersion,
                poId: projectInfo.poId,
            };
            const resultData = await axiosPost(url, dataToSend);
            if (!resultData) {
                alert("add error: table");
            } else if (resultData) {
                fetchAllData();
                alert("✅추가 완료");
            }
            setOpenModalAdd(false);
        } else if (!addData) {
            //파라미터로 넘어온 데이터가 없다면, 팝업으로 추가
            setOpenModalAdd(true);
        }
    };

    /* 데이터 검색 */
    const searchClick = async () => {
        if (!suffixUrl || !singleUrl) return;
        if (searchData) {
            const url = `/api${suffixUrl || singleUrl}/totalListAll.do`;
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
        if (row.original.poiId) {
            setProjectInfo((prev) => ({ ...prev, poiId: row.original.poiId }));
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

    /* current- 현재 보는페이지, table button 활성화 on off */
    useEffect(() => {
        if (isModalTable && current === modalPageName) {
            //모달화면일때
            setModalLengthSelectRow(selectedFlatRows.length);
            if (selectedFlatRows.length > 0) {
                setSelectRow(selectedFlatRows[selectedFlatRows.length - 1].values);
                // projectInfo.poId = selectedFlatRows[selectedFlatRows.length - 1].original.poId; //품목수주
                // projectInfo.poDesc = selectedFlatRows[selectedFlatRows.length - 1].original.poDesc;
                sendSelected && sendSelected(selectedFlatRows[selectedFlatRows.length - 1].values);
            }
        } else if (!isModalTable && (current === currentPageName || current === innerPageName)) {
            //모달화면이 아닐때
            setLengthSelectRow(selectedFlatRows.length);
            selectedFlatRows.length > 0 && setSelectRow(selectedFlatRows[selectedFlatRows.length - 1].values);
            // selectedFlatRows.length > 0 && sendSelected && sendSelected(selectedFlatRows[selectedFlatRows.length - 1].values);
        }
    }, [selectedFlatRows]);

    const [dataBuket, setDataBuket] = useState({});
    const [prevDataBuket, setPrevDataBuket] = useState({});

    /* table button 활성화 on off */

    useEffect(() => {
        setSavePgNm(projectPgNm);
        setDataBuket(projectPgNm.pgNm, projectPgNm.pgId);
    }, [projectPgNm]);

    const [savePgNm, setSavePgNm] = useState([projectPgNm]);
    //품목그룹 선택
    const setValueData = (rowIndex) => {
        //setRowIndex()
        setIsOpenModalPgNm(true);
        setRowIndex(rowIndex);
    };

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

    /* 데이터 테이블 UI에서 ROW 삭제 */
    const onDeleteRow = (row) => {
        const rowId = row.index;
        const updateTableData = tableData.filter((_, index) => index !== rowId);
        setTableData([...updateTableData]);
    };

    const pageSizeChange = (value) => {
        setPageSize(Number(value)); // 페이지 크기 변경
        gotoPage(0); // 첫 페이지로 이동
    };

    const handleChange = (e, row, accessor) => {
        const { value } = e.target;
        const index = row.index;
        console.log(value);
        const updatedTableData = [...tableData];
        updatedTableData[row.index][accessor] = value;

        if (innerPageName === "인건비 수주관리") {
            if (row.original.pecUnitPrice && row.original.pecMm) {
                const price = row.original.pecUnitPrice * row.original.pecMm;
                updatedTableData[index]["price"] = price;
            }
        } else if (innerPageName === "인건비 예산관리" || innerPageName === "인건비 실행관리") {
            if (unitPriceList && row.original.pecPosition && row.original.pecMm) {
                const unit = unitPriceList.find((unit) => row.original.pecPosition === unit.guppName && unit.gupBaseDate[0] === new Date().getFullYear());
                const price = unit ? row.original.pecMm * unit.gupPrice : 0; // 적절한 기본값 사용
                updatedTableData[index]["price"] = price;
                updatedTableData[index]["positionPrice"] = unit.gupPrice;
            }
        }

        //구매
        if (accessor === "byUnitPrice" || accessor === "standardMargin" || accessor === "consumerOpRate" || accessor === "byQunty") {
            if (row.original.byUnitPrice && row.original.standardMargin && row.original.consumerOpRate && row.original.byQunty) {
                // 1.원가(견적가) : 수량 * 원단가
                const estimatedCost = row.original.byQunty * row.original.byUnitPrice;
                // 2.단가 : 원가(견적가) / (1 - 사전원가기준이익율)
                const unitPrice = division(estimatedCost, 1 - row.original.standardMargin / 100);
                // 3.금액 : 수량 * 단가
                const planAmount = row.original.byQunty * unitPrice;
                // 4.소비자단가 : 단가 / 소비자산출율
                const consumerPrice = division(unitPrice, row.original.consumerOpRate);
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
        // 수정된 데이터로 tableData 업데이트
        console.log(updatedTableData, "추가된거맞냐고");
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
        const url = `/api/baseInfrm/product/prmnPlan/addList.do`;
        const resultData = await axiosPost(url, addNewData);
        if (resultData) {
            customDatasRefresh && customDatasRefresh();
        }
    };
    const updateList = async (toUpdate) => {
        const url = `/api/baseInfrm/product/prmnPlan/editList.do`;
        const resultData = await axiosUpdate(url, toUpdate);
        if (resultData) {
            customDatasRefresh && customDatasRefresh();
        }
    };

    const deleteList = async (removeItem) => {
        const url = `/api/baseInfrm/product/prmnPlan/removeAll.do`;
        const resultData = await axiosDelete(url, removeItem);
        if (resultData) {
            customDatasRefresh && customDatasRefresh();
        }
    };

    // 초기 데이터와 수정된 데이터를 비교하는 함수
    //추가 함수
    const upDateChange = (data) => {
        for (let index = 0; index < data.length; index++) {
            const item = data[index];

            // null 값을 0으로 변경
            for (let i = 1; i <= 13; i++) {
                const key = `pmpmmPositionCode${i}`;
                if (item[key] === null) {
                    item[key] = 0;
                }
            }

            // useAt이 없다면 "Y"로 설정
            if (!item.hasOwnProperty("useAt")) {
                item.useAt = "Y";
            }

            if (!item.hasOwnProperty("poiId")) {
                item.poiId = projectInfo.poiId;
            }

            // deleteAt이 없다면 "N"로 설정
            if (!item.hasOwnProperty("deleteAt")) {
                item.deleteAt = "N";
            }

            // pmpMonth2가 없다면 값을 pmpMonth에서 가져옴
            if (!item.hasOwnProperty("pmpMonth2")) {
                item.pmpMonth2 = item.pmpMonth;
                item.pmpMonth = originTableData[index].pmpMonth;
            }
        }
    };

    //인건비용임
    const compareData = (originData, updatedData) => {
        const filterData = updatedData.filter((data) => data.pmpMonth); //pmpMonth가 없는 데이터 제외
        const originDataLength = originData ? originData.length : 0;
        const updatedDataLength = filterData ? filterData.length : 0;

        if (originDataLength > updatedDataLength) {
            upDateChange(filterData);
            updateList(filterData);

            const originAValues = originData.map((item) => item.pmpId);
            const extraOriginData = originAValues.slice(updatedDataLength);
            const combinedAValues = extraOriginData.reduce((acc, current) => acc.concat(current), []);

            deleteList(combinedAValues);
        } else if (originDataLength === updatedDataLength) {
            upDateChange(filterData);
            updateList(filterData);
        } else if (originDataLength < updatedDataLength) {
            const toAdds = [];
            const addUpdate = [];
            for (let i = 0; i < originDataLength; i++) {
                addUpdate.push(filterData[i]);
            }
            updateList(addUpdate);

            for (let i = originDataLength; i < updatedDataLength; i++) {
                const toAdd = { ...filterData[i] };
                delete toAdd.total;
                delete toAdd.poiBeginDt1;
                toAdd.useAt = "Y";
                toAdd.deleteAt = "N";
                toAdd.poiId = projectInfo.poiId;

                for (let j = 1; j <= 13; j++) {
                    if (toAdd[`pmpmmPositionCode${j}`] === null) {
                        toAdd[`pmpmmPositionCode${j}`] = 0;
                    }
                }

                toAdds.push(toAdd);
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
                    <select className="select" id={uuidv4()} value={pageSize} onChange={(e) => pageSizeChange(e.target.value)}>
                        {pageSizeOptions.map((size, index) => (
                            <option key={size + index} value={size}>
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
                                        id={`header-${column.id}`}
                                        className={columnIndex === 0 ? "first-column" : ""}
                                        style={{ width: column.width }}>
                                        {column.render("Header")}
                                        <span style={{ color: "red", margin: 0 }}>{column.require === true ? "*" : ""}</span>
                                        <span style={{ overflow: "auto" }}>{column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}</span>
                                    </th>
                                );
                            })}
                            {isEditing && (
                                <th style={{ width: "70px", textAlign: "center" }}>
                                    <button className="btn-primary" onClick={onAddRow} style={{ margin: 0, overflow: "auto" }}>
                                        추가
                                    </button>
                                </th>
                            )}
                        </tr>
                    ))}
                </thead>
                {/* {tableData.length <= 0 && (
                    <div style={{ display: "flex", width: "1000px", margin: "auto", alignItems: "center", justifyContent: "center" }}>
                        <div style={{}}>no data</div>
                    </div>
                )} */}
                <tbody {...getTableBodyProps()}>
                    {page.map((row, rowIndex) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()} onDoubleClick={(e) => onCLickRow(row)}>
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
                                                        key={cell.column.id + row.index}
                                                        type="text"
                                                        value={
                                                            tableData[row.index] && tableData[row.index][cell.column.id] !== undefined
                                                                ? tableData[row.index][cell.column.id] || cell.value
                                                                : cell.value
                                                        }
                                                        name={cell.column.id}
                                                        onChange={(e) => handleChange(e, row, cell.column.id)}
                                                    />
                                                ) : cell.column.type === "datepicker" ? (
                                                    <div className="box3-1 boxDate">
                                                        <DatePicker
                                                            key={cell.column.id + row.index}
                                                            name={cell.column.id}
                                                            className="form-control flex-item"
                                                            type="text"
                                                            value={
                                                                tableData[row.index].pmpMonth2
                                                                    ? tableData[row.index].pmpMonth2.substring(0, 7)
                                                                    : tableData[row.index].pmpMonth
                                                                    ? tableData[row.index].pmpMonth.substring(0, 7)
                                                                    : ""
                                                            }
                                                            ref={inputRef}
                                                            dateFormat="yyyy-MM"
                                                            showMonthYearPicker
                                                            locale={ko} // 한국어로 설정
                                                            onClick={() => toggleCalendarVisible(row.index)}
                                                            onChange={(date) => {
                                                                const formatted = handleDateChange(date);
                                                                const updatedTableData = [...tableData];
                                                                updatedTableData[row.index].pmpMonth
                                                                    ? (updatedTableData[row.index].pmpMonth2 = formatted)
                                                                    : (updatedTableData[row.index].pmpMonth = formatted);
                                                                setTableData(updatedTableData);
                                                            }}
                                                        />
                                                    </div>
                                                ) : cell.column.type === "daypicker" ? (
                                                    <DayPicker
                                                        name={cell.column.id}
                                                        value={tableData[row.index][cell.column.id] ? tableData[row.index][cell.column.id] : ""}
                                                        onClick={(data) => handleDateClick(data, cell.column.id, row.index)}
                                                    />
                                                ) : cell.column.type === "monthpicker" ? (
                                                    <div className="box3-1 boxDate">
                                                        <MonthPicker
                                                            name={cell.column.id}
                                                            value={
                                                                tableData[row.index][cell.column.id] ? tableData[row.index][cell.column.id].substring(0, 7) : ""
                                                            }
                                                            onClick={(data) => handleDateClick(data, cell.column.id, row.index)}
                                                        />
                                                    </div>
                                                ) : cell.column.type === "select" ? (
                                                    <select
                                                        key={cell.column.id + row.index}
                                                        name={cell.column.id}
                                                        defaultValue={
                                                            tableData[row.index] && tableData[row.index][cell.column.id] !== undefined
                                                                ? tableData[row.index][cell.column.id]
                                                                : cell.column.options[row.index].value || "" // 기본값: 해당 행의 인덱스에 해당하는 옵션의 value 값 또는 빈 문자열
                                                        }
                                                        onChange={(e) => handleChange(e, row, cell.column.id)}>
                                                        {cell.column.options.map((option, index) => (
                                                            <option
                                                                key={cell.column.id + index}
                                                                value={option.value}
                                                                selected={index === 0} //첫 번째 옵션 선택
                                                            >
                                                                {option.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : cell.column.type === "button" ? (
                                                    <div>
                                                        <input
                                                            className="buttonSelect"
                                                            id={cell.column.id}
                                                            name={cell.column.id}
                                                            key={cell.column.id + row.index}
                                                            onClick={() => setValueData(rowIndex)}
                                                            type="text"
                                                            placeholder={`품목그룹명을 선택해 주세요.`}
                                                            value={tableData[rowIndex].pgNm || ""}
                                                            onChange={(e) => handleChange(e, row, cell.column.id)}
                                                            readOnly
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

            {Object.keys(selectRow).length > 0 && openModalMod && (
                // 수정
                <DataPutModal
                    columns={columns}
                    initialData={selectRow}
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
            {isOpenModalPgNm && <ModalPagePgNm rowIndex={rowIndex} onClose={() => setIsOpenModalPgNm(false)} />}
        </>
    );
};

export default ReactDataTable;
