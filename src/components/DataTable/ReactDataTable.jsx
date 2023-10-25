import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { axiosDelete, axiosFetch, axiosPost, axiosScan, axiosUpdate } from "api/axiosFetch";
import { useTable, usePagination, useSortBy, useRowSelect } from "react-table";
import { PageContext } from "components/PageProvider";
import DataPutModal from "./DataPutModal";
import DataPostModal2 from "./DataPostModal2";
import DeleteModal from "components/modal/DeleteModal";
import ModalPagePgNm from "components/modal/ModalPagePgNm";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ko from "date-fns/locale/ko"; // 한국어 로케일 설정
import ModalPagePdiNm from "components/modal/ModalPagePdiNm";

const ReactDataTable = (props) => {
    const { columns, suffixUrl, flag, detailUrl, customDatas, defaultPageSize, tableRef, viewPageName, customerList, beforeItem, tableName } = props;
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
        isSaveFormTable,
        projectPdiNm,
        setIsOpenModalPdiNm,
        isOpenModalPdiNm,
        setProjectPdiNm,
    } = useContext(PageContext);

    const [tableData, setTableData] = useState([]);
    const [originTableData, setOriginTableData] = useState([]);
    const pageSizeOptions = [5, 10, 15, 20, 30, 50, 100];
    const [isEditing, setIsEditing] = useState(false);
    const [openModalMod, setOpenModalMod] = useState(false);
    const [openModalAdd, setOpenModalAdd] = useState(false);
    const [modalViewDatas, setModalViewDatas] = useState([]); //modal에 띄어줄 목록
    const [current, setCurrent] = useState(""); //==viewPageName
    const [selectRow, setSelectRow] = useState({}); //마지막으로 선택한 row
    const [rowIndex, setRowIndex] = useState(0);

    //------------------------------------------------ 달력부분

    const [formattedDate, setFormattedDate] = useState(""); //날짜저장
    const [selectedDate, setSelectedDate] = useState(new Date());
    //const [sendDate, setSendDate] = useState("");
    const inputRef = useRef(null); //날짜
    const calendarRef = useRef(null);

    useEffect(() => {
        if (isCancelTable === true) setTableData(originTableData);
        setIsCancelTable(false);
    }, [isCancelTable]);

    const handleDateChange = (date) => {
        console.log(date, "🎀🎀🎀🎀🎀🎀🎀🎀🎀🎀🎀🎀🎀🎀🎀🎀🎀");
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");

        const formatted = `${year}-${month}-${day}`;
        //setSendDate(`${year}-${month}-${day}`);
        return formatted;
    };

    //const handleDateClick = (date, index) => {
    //    console.log(date, index, "💥💥💥💥");
    //    const formatted = handleDateChange(date);
    //    setSelectedDate(formatted);
    //    const updatedTableData = [...tableData];
    //    updatedTableData[index].pmpMonth2 = formatted;
    //    updatedTableData[index].calendarVisible = !tableData[index].calendarVisible; //달력닫음

    //    setTableData(updatedTableData);
    //};

    const toggleCalendarVisible = (index) => {
        const updatedTableData = [...tableData];
        updatedTableData[index].calendarVisible = !tableData[index].calendarVisible;
        setTableData(updatedTableData);
    };

    useEffect(() => {
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

        return () => {
            // 컴포넌트 언마운트 시에 이벤트 핸들러 제거
            document.removeEventListener("mousedown", handleDocumentClick);
        };
    }, []);

    //------------------------------------------------

    /* 최초 실행, 데이터 초기화  */
    useEffect(() => {
        if (suffixUrl || detailUrl) {
            fetchAllData();
        }
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
    }, [flag]);

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
            addClick(newRowData);
        }
    }, [newRowData]);

    /* 서버에서 전체 데이터 호출 */
    const fetchAllData = async () => {
        if (!suffixUrl && !detailUrl) return;
        let url = ``;
        if (customerList) {
            url = `/api${suffixUrl}/${customerList}/listAll.do`;
        } else {
            url = `/api${suffixUrl || detailUrl}/totalListAll.do`;
        }
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
            const url = `/api${suffixUrl || detailUrl}/edit.do`;
            const requestData = { ...updatedData, lockAt: "Y", useAt: "Y" };
            const resultData = await axiosUpdate(url, requestData);
            if (resultData) {
                setTableData([resultData]);
                alert("값을 변경했습니다💚💚");
                fetchAllData();
            } else if (!resultData) {
                alert("modify error: table");
            }
        }
    };

    /* 데이터 삭제 */
    const deleteClick = async (btnLabel) => {
        if (!suffixUrl && !detailUrl) return;
        const deleteRows = selectedFlatRows && selectedFlatRows.map((row) => row.values);
        if (!btnLabel) {
            // 최초, 파라미터가 없을 때
            setModalViewDatas(deleteRows);
        } else if (btnLabel === "확인") {
            const pkColumn = columns[0].col;
            const deletePkArr = deleteRows.map((item) => item[pkColumn]); //값만 가져오는데...
            const url = `/api${suffixUrl || detailUrl}/removeAll.do`;
            const resultData = await axiosDelete(url, deletePkArr);
            if (resultData) {
                fetchAllData();
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
        if (!suffixUrl && !detailUrl) return;
        if (addData && typeof addData === "object" && !Array.isArray(addData)) {
            const url = `/api${suffixUrl || detailUrl}/add.do`;
            const dataToSend = { ...addData, lockAt: "Y", useAt: "Y" };
            const resultData = await axiosPost(url, dataToSend);
            if (!resultData) {
                alert("add error: table");
            } else if (resultData) {
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
        if (row.poiNm) {
            //프로젝트에 해당하는 상세 테이블
            /* 서버 통신 */
            // const url = `/api${detailUrl}/listAll.do`;
            // const requestData = { useAt: "Y" };
            // const resultData = await axiosFetch(url, requestData);
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

    /* 변경된 value 값을 column과 같은 이름의 변수에 담아서 테이블에 넣어줌 */
    //const onChange = (e, preRow) => {
    //    const { name, value } = e.target;
    //    console.log(name, value, "💚💚🔺🔺");
    //    const newTableData = tableData.map((rowData, rowIndex) => {
    //        console.log(rowData, rowIndex, "💜💜🔺🔺");
    //        if (rowIndex === preRow.index) {
    //            return { ...rowData, [name]: value };
    //        }
    //        return rowData;
    //    });
    //    console.log(newTableData, "💥💥💥💥");
    //    setTableData(newTableData);
    //};
    //const onChange = (e, preRow) => {
    //    const { name, value } = e.target;
    //    console.log(name, value, "💚💚🔺🔺");
    //    setTableData(newTableData);
    //};

    // 상위 컴포넌트에서 pmpMonth 상태를 생성하고 관리

    //const [newData, setNewData] = useState([]);

    const onChangeInput = (e, preRow) => {
        const { name, value } = e.target;
        const newTableData = tableData.map((rowData, rowIndex) => {
            if (rowIndex === preRow.index) {
                return { ...rowData, [name]: value };
            }
            return rowData;
        });
        setTableData(newTableData);
        //setNewData(newTableData);
    };
    //setTableData(newTableData);
    useEffect(() => {
        console.log(tableData, "🐵🐵🐵🐵🐵🐵🐵");
    }, [tableData]);

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

    //const onAddRow = () => {
    //    setTableData((prevData) => {
    //        const newItemIndex = prevData.length; // 새로운 항목의 인덱스
    //        const previousItemIndex = newItemIndex - 1; // 이전 항목의 인덱스

    //        const newRow = { ...prevData[previousItemIndex] }; // 이전 항목을 복제
    //        columnsConfig.forEach((column) => {
    //            newRow[column.accessor] = ""; // 빈 문자열로 초기화
    //        });

    //        const newData = [...prevData, newRow];
    //        return newData;
    //    });
    //};

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
    const [dataBuketPdiNm, setDataBuketPdiNm] = useState({});
    const [prevDataBuket, setPrevDataBuket] = useState({});
    const [prevDataBuketPdiNm, setPrevDataBuketPdiNm] = useState({});

    useEffect(() => {
        setDataBuket(projectPgNm.pgNm);
        setDataBuketPdiNm(projectPdiNm.pdiNm);
        //setTableData()
    }, [projectPgNm, projectPdiNm]);

    const setValueData = (rowIndex) => {
        //setRowIndex()
        setIsOpenModalPgNm(true);
        setRowIndex(rowIndex);
    };

    const setValueDataPdiNm = (rowIndex) => {
        //setRowIndex()
        setIsOpenModalPdiNm(true);
        setRowIndex(rowIndex);
    };

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
            if (dataBuketPdiNm !== prevDataBuketPdiNm) {
                const updatedTableData = [...tableData];
                if (dataBuketPdiNm && updatedTableData[rowIndex]) {
                    updatedTableData[rowIndex].pdiNm = dataBuketPdiNm;
                    setTableData(updatedTableData);
                }

                // dataBuketPdiNm 값을 업데이트할 때 prevDataBuket도 업데이트
                setPrevDataBuketPdiNm(dataBuketPdiNm);
                setProjectPdiNm("");
            }
        }
    }, [isOpenModalPgNm, dataBuket, rowIndex, tableData, prevDataBuket, prevDataBuketPdiNm, isOpenModalPdiNm, dataBuketPdiNm]);

    const handleChange = (e, rowIndex, accessor) => {
        const { value } = e.target;
        // tableData를 복제하여 수정
        const updatedTableData = [...tableData];
        updatedTableData[rowIndex][accessor] = value;
        // 수정된 데이터로 tableData 업데이트
        setTableData(updatedTableData);
    };

    //----------------------------데이터 추가시 보낼 데이터
    //const newData = tableData.map((item) => {
    //    // 현재 객체의 복사본 생성
    //    const newItem = { ...item };
    //    // calendarVisible와 total 필드 제거
    //    delete newItem.calendarVisible;
    //    delete newItem.total;
    //    return newItem;
    //});

    //console.log(newData, "🆗🆗🆗🆗");
    //----------------------------데이터 추가시 보낼 데이터

    console.log(originTableData, "오리지날 데이터✨✨✨✨");

    //------------------------------- 초기값과 비교하는 코드
    const [toUpdate, setToUpdate] = useState([]);
    const [removeItem, setRemoveItem] = useState([]);
    const [addNewData, setAddNewData] = useState([]);

    //-------------------------------배열 추가, 수정, 삭제

    const addList = async (addNewData) => {
        const url = `/api/baseInfrm/product/prmnPlan/addList.do`;
        const resultData = await axiosPost(url, addNewData);
        console.log(resultData, "🆗🆗🆗🆗잘 넘겨줍니다🆗🆗🆗🆗");
    };
    const updateList = async (toUpdate) => {
        const url = `/api/baseInfrm/product/prmnPlan/editList.do`;
        const resultData = await axiosUpdate(url, toUpdate);
        console.log(resultData, "🔥🔥🔥🔥수정 받기🔥🔥🔥🔥");
    };

    const deleteList = async (removeItem) => {
        const url = `/api/baseInfrm/product/prmnPlan/removeAll.do`;
        const resultData = await axiosDelete(url, removeItem);
        console.log(resultData, "🧹🧹🧹🧹삭제 받기🧹🧹🧹🧹");
    };

    useEffect(() => {
        compareData(originTableData, tableData);
    }, [tableData]);

    useEffect(() => {
        console.log(originTableData, "❌🎉");
    }, [originTableData]);
    // 초기 데이터와 수정된 데이터를 비교하는 함수

    //인건비용임
    const compareData = (originData, updatedData) => {
        if (originData.length > updatedData.length) {
            setToUpdate(updatedData);
            for (let i = updatedData.length; i < originData.length; i++) {
                setRemoveItem((prevRemoveItem) => [...prevRemoveItem, ...originData[i].pmpId]);
            }
        } else if (originData.length === updatedData.length) {
            //const toUpdates = updatedData.map((item) => {
            //    return {
            //        ...item,
            //    };
            //});
            //console.log(toUpdates, formattedDate, "머지진짜🚨🚨🚨🚨🚨");
            //setToUpdate(toUpdates);
            setToUpdate(updatedData);
        } else if (originData.length < updatedData.length) {
            const toAdds = [];

            for (let i = originData.length; i < updatedData.length; i++) {
                const toAdd = { ...updatedData[i] };
                console.log(updatedData, "🧐🧐🧐🧐🧐🧐🧐🧐🧐🧐🧐");
                delete toAdd.total;
                delete toAdd.poiBeginDt1;
                toAdd.useAt = "Y";
                toAdd.deleteAt = "N";
                toAdd.pmpMonth = tableData[i].pmpMonth;
                toAdd.pmpMonth2 = formattedDate;
                toAdd.poiId = projectInfo.poiId;

                for (let j = 1; j <= 13; j++) {
                    if (toAdd[`pmpmmPositionCode${j}`] === null) {
                        toAdd[`pmpmmPositionCode${j}`] = 0;
                    }
                }

                toAdds.push(toAdd);
            }
            setAddNewData(toAdds);
        }
    };

    useEffect(() => {
        if (isSaveFormTable === false) {
            console.log(addNewData, "추가되어야할 배열들@@@@");
            console.log(toUpdate, "변경되어야할 ######");
            console.log(removeItem, "삭제되어야할 **&^&*^*&^");
            addList(addNewData);
            updateList(toUpdate);
            deleteList(removeItem);
        }
    }, [addNewData, toUpdate, removeItem]);

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
                                                        name={cell.column.id}
                                                        onChange={(e) => onChangeInput(e, row)}
                                                    />
                                                ) : cell.column.type === "datepicker" ? (
                                                    <div className="box3-1 boxDate">
                                                        <DatePicker
                                                            className="form-control flex-item"
                                                            type="text"
                                                            value={tableData[row.index].pmpMonth2 ? tableData[row.index].pmpMonth2.substring(0, 7) : ""}
                                                            ref={inputRef}
                                                            dateFormat="yyyy-MM"
                                                            showMonthYearPicker
                                                            locale={ko} // 한국어로 설정
                                                            onClick={() => toggleCalendarVisible(row.index)}
                                                            onChange={(date) => {
                                                                //handleDateClick(date, row.index);
                                                                //const formatted = handleDateChange(selectedDate);
                                                                //setFormattedDate(formatted); // 이 부분은 formattedDate 대신 pmpMonth를 업데이트하는 코드로 변경해야 함
                                                                const formatted = handleDateChange(date);
                                                                const updatedTableData = [...tableData];
                                                                updatedTableData[row.index].pmpMonth2 = formatted;
                                                                console.log(updatedTableData, "🚨🚫🚫🚫🚫🚫");
                                                                setTableData(updatedTableData);
                                                            }}
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
                                                            <option key={index} value={option.value}>
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
                                                            onClick={() => setValueData(rowIndex)}
                                                            type="text"
                                                            placeholder={projectPgNm.pgNm ? projectPgNm.pgNm : `품목그룹명을 선택해 주세요.`}
                                                            value={tableData[rowIndex].pgNm || ""}
                                                            onChange={(e) => handleChange(e, rowIndex, cell.column.id)}
                                                            readOnly
                                                        />
                                                    </div>
                                                ) : cell.column.type === "buttonPdiNm" ? (
                                                    <div>
                                                        <input
                                                            className="buttonSelect"
                                                            id={cell.column.id}
                                                            name={cell.column.id}
                                                            onClick={() => setValueDataPdiNm(rowIndex)}
                                                            type="text"
                                                            placeholder={projectPdiNm.pdiNm ? projectPdiNm.pdiNm : `품명을 선택해 주세요.`}
                                                            value={tableData[rowIndex].pdiNm || ""}
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

            {openModalMod && (
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
            {isOpenModalPdiNm && <ModalPagePdiNm rowIndex={rowIndex} onClose={() => setIsOpenModalPdiNm(false)} />}
        </>
    );
};

export default ReactDataTable;
