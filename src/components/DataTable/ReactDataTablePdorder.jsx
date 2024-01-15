import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { axiosDelete, axiosFetch, axiosPost, axiosScan, axiosUpdate } from "api/axiosFetch";
import { useTable, usePagination, useSortBy, useRowSelect, useBlockLayout, useResizeColumns } from "react-table";
import { PageContext } from "components/PageProvider";
import ModalPagePgNm from "components/modal/ModalPagePgNm";
import ModalPageCompany from "components/modal/ModalPageCompany";
import { v4 as uuidv4 } from "uuid";
import DayPicker from "components/input/DayPicker";
import MonthPicker from "components/input/MonthPicker";
import ProductInfoModal from "components/modal/ProductInfoModal";

/* 구매 테이블 */
const ReactDataTablePdorder = (props) => {
    const {
        columns,
        customDatas,
        defaultPageSize,
        tableRef,
        viewPageName,
        customDatasRefresh,
        returnSelect,
        returnSelectRows,
        hideCheckBox,
        editing,
        viewLoadDatas,
        suffixUrl,
        condition, //poiId와 같은 조회에 필요한 조건
    } = props;
    const {
        loadButton,
        setLoadButton,
        nameOfButton,
        setNameOfButton,
        prevCurrentPageName,
        innerPageName,
        prevInnerPageName,
        setLengthSelectRow,
        setModalLengthSelectRow,
        isModalTable,
        newRowData,
        currentPageName,
        modalPageName,
        isCancelTable,
        setIsCancelTable,
        isOpenModalPgNm,
        setIsOpenModalPgNm,
        projectPdiNm,
        setProjectPdiNm,
        setIsOpenModalCompany,
        isOpenModalCompany,
    } = useContext(PageContext);

    const [tableData, setTableData] = useState([]);
    const [originTableData, setOriginTableData] = useState([]);
    const pageSizeOptions = [5, 10, 15, 20, 30, 50, 100];
    const [isEditing, setIsEditing] = useState(false);
    const [current, setCurrent] = useState(viewPageName); //==viewPageName
    const [rowIndex, setRowIndex] = useState(0);
    const [isOpenModalProductInfo, setIsOpenModalProductInfo] = useState(false); //품목정보목록

    //취소시에 오리지널 테이블로 돌아감
    useEffect(() => {
        if (isCancelTable === true) setTableData(originTableData);
        setIsCancelTable(false);
    }, [isCancelTable]);

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
        if ((current.id !== currentPageName.id && current.id !== innerPageName.id) || (current.name !== modalPageName && current.id !== innerPageName.id)) {
            return;
        }
    }, [current, currentPageName, innerPageName, modalPageName]);

    /* 테이블 cell에서 수정하는 경우의 on off */
    useEffect(() => {
        if (isCurrentPage()) {
            setIsEditing(editing !== undefined ? editing : isEditing); //테이블 상태 //inner tab일 때 테이블 조작
        }
        if (isCurrentPage() && nameOfButton === "save") {
            compareData(originTableData, tableData);
            setNameOfButton(""); //초기화
        }
        if (nameOfButton === "load" && viewLoadDatas) {
            setTableData(viewLoadDatas);
            setNameOfButton(""); //초기화
        }
    }, [innerPageName, currentPageName, editing, nameOfButton]);

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
                require: column.require,
            })),
        [columns]
    );

    useEffect(() => {
        //newRowData 변동 시 새로운 행 추가
        if (isCurrentPage()) {
            if (newRowData && Object.keys(newRowData).length !== 0) {
                addList(newRowData);
            }
        }
    }, [newRowData]);

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
        if (isModalTable && current.name === modalPageName) {
            //모달화면일때
            setModalLengthSelectRow(selectedFlatRows.length);
            if (selectedFlatRows.length > 0) {
                const selects = selectedFlatRows.map((row) => row.values);
                returnSelectRows && returnSelectRows(selects);
                returnSelect && returnSelect(selectedFlatRows[selectedFlatRows.length - 1].values);
            }
        } else if (!isModalTable && (current.id === currentPageName.id || current.id === innerPageName.id)) {
            //모달화면이 아닐때
            if (selectedFlatRows.length > 0) {
                const selects = selectedFlatRows.map((row) => row.values);
                returnSelectRows && returnSelectRows(selects);
                returnSelect && returnSelect(selectedFlatRows[selectedFlatRows.length - 1].values);
            }
            setLengthSelectRow(selectedFlatRows.length);
        }
    }, [selectedFlatRows]);

    /* 새로운 빈 row 추가 */
    const onAddRow = () => {
        const newRow = {};
        columnsConfig.forEach((column) => {
            if (column.accessor === "poiId") {
                newRow[column.accessor] = condition.poiId || ""; // poiId를 항상 SLSP로 설정
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

    const setValueCompany = (rowIndex) => {
        //setRowIndex()
        setIsOpenModalCompany(true);
        setRowIndex(rowIndex);
    };

    //선택된 항목 순서(인덱스)별
    const [countIndex, setCountIndex] = useState(0);

    useEffect(() => {
        if (isCurrentPage() && Object.keys(projectPdiNm).length > 0) {
            setValueDataPdiNm(countIndex, projectPdiNm);
            setProjectPdiNm({});
        }
    }, [projectPdiNm]);

    const goSetting = (rowIndex) => {
        setCountIndex(rowIndex);
    };

    const setValueDataPdiNm = (rowIndex, selectedPdiNm) => {
        // 선택된 품명에 해당하는 데이터 찾기
        if (selectedPdiNm) {
            // 테이블 데이터를 복제
            const updatedTableData = [...tableData];

            // 선택된 품명의 데이터로 해당 행(row)의 데이터 업데이트
            updatedTableData[rowIndex] = {
                ...updatedTableData[rowIndex], // 다른 속성들을 그대로 유지
                ...selectedPdiNm, // projectPdiNm 객체의 데이터로 업데이트
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

        //실행
        if (currentPageName.name === "구매(재료비)") {
            if (row.original.byUnitPrice && row.original.byQunty) {
                const price = row.original.byUnitPrice * row.original.byQunty;
                updatedTableData[index]["price"] = Math.round(price);
            }
        }

        //영업
        if (innerPageName.name === "구매(재료비)") {
            // 원단가, 기준이익율, 소비자가산출률, 수량
            if (accessor === "byUnitPrice" || accessor === "byStandardMargin" || accessor === "byConsumerOutputRate" || accessor === "byQunty") {
                if (row.original.byUnitPrice && row.original.byStandardMargin && row.original.byConsumerOutputRate && row.original.byQunty) {
                    // 1.원가 : 수량 * 원단가
                    const estimatedCost = row.original.byQunty * row.original.byUnitPrice;
                    // 2.단가 : 원가 / (1 - 사전원가기준이익율)
                    // estimatedCost / 1-byStandardMargin/100
                    const unitPrice = division(estimatedCost, 100 - row.original.byStandardMargin) * 100;
                    // 3.금액 : 수량 * 단가ㅔ
                    const planAmount = row.original.byQunty * unitPrice;
                    // 4.소비자단가 : 단가 / 소비자산출율
                    const consumerPrice = division(unitPrice, row.original.byConsumerOutputRate) * 10;
                    // 5.소비자금액 : 수량 * 소비자단가
                    const consumerAmount = row.original.byQunty * consumerPrice;
                    // 6.이익금 : 금액 - 원단가
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
        }
        setTableData(updatedTableData);
    };

    const handleDateClick = (date, colName, index) => {
        const updatedTableData = [...tableData];
        updatedTableData[index][colName] = date;
        setTableData(updatedTableData);
    };

    const division = (value1, value2) => {
        if (!value1 || !value2) {
            return 0;
        }
        // return Math.round(value1 / value2);
        return value1 / value2;
    };

    const addList = async (addNewData) => {
        if (!isCurrentPage() && !suffixUrl && !Array.isArray(addNewData)) return;
        if (!condition || condition.poiId === undefined) {
            console.log("❗프로젝트 정보 없음", currentPageName);
            return;
        }
        if (currentPageName.id === "PurchasingMgmtPlan") {
            //실행-계획구매
            //실행
            addNewData.forEach((data) => {
                data.poiId = condition.poiId || "";
                data.modeCode = "BUDGET";
            });
        } else if (currentPageName.id === "PurchasingMgmtExe") {
            //실행-구매
            //실행
            addNewData.forEach((data) => {
                data.poiId = condition.poiId || "";
                data.modeCode = "EXECUTE";
            });
        } else if (innerPageName.id === "buying") {
            //영업-구메
            //영업
            addNewData.forEach((data) => {
                data.poiId = condition.poiId || "";
                data.versionId = condition.versionId;
            });
        }

        const url = `/api${suffixUrl}/addList.do`;
        const resultData = await axiosPost(url, addNewData);
        customDatasRefresh();
        setOriginTableData([]);
    };

    const updateList = async (toUpdate) => {
        console.log("❤️mod ", toUpdate, "con:", condition);
        console.log("currentPageName:", currentPageName);
        if (!isCurrentPage() && !suffixUrl && !Array.isArray(toUpdate)) return;
        if (!condition || condition.poiId === undefined) {
            console.log("❗프로젝트 정보 없음");
            return;
        }
        if (currentPageName.id === "PurchasingMgmtPlan") {
            //실행-계획구매
            toUpdate.forEach((data) => {
                data.poiId = condition.poiId || "";
                data.modeCode = "BUDGET";
            });
        } else if (currentPageName.id === "PurchasingMgmtExe") {
            //실행-구매
            toUpdate.forEach((data) => {
                data.poiId = condition.poiId || "";
                data.modeCode = "EXECUTE";
            });
        } else if (innerPageName.id === "buying") {
            //영업-구메
            //영업
            toUpdate.forEach((data) => {
                data.poiId = condition.poiId || "";
                data.versionId = condition.versionId;
            });
        }

        const url = `/api${suffixUrl}/editList.do`;
        // console.log(url + "업데이트데이터:", toUpdate);
        const resultData = await axiosUpdate(url, toUpdate);
        console.log("✨2.", resultData, "toUpdate:", toUpdate);
        customDatasRefresh();
        setOriginTableData([]);
    };
    const deleteList = async (removeItem) => {
        console.log("del ", removeItem, "con:", condition);

        if (!isCurrentPage() && !suffixUrl && !Array.isArray(removeItem)) return;
        if (suffixUrl === "/baseInfrm/product/receivingInfo") {
            const changeUrl = "/baseInfrm/product/buyIngInfoExe";
            const url = `/api${changeUrl}/removeAll.do`;
            const resultData = await axiosDelete(url, removeItem);
            console.log("✨3.", resultData, "removeItem:", removeItem);
            customDatasRefresh();
            setOriginTableData([]);
        } else {
            const url = `/api${suffixUrl}/removeAll.do`;
            const resultData = await axiosDelete(url, removeItem);
            console.log("✨3.", resultData, "removeItem:", removeItem);
            customDatasRefresh();
            setOriginTableData([]);
        }
    };

    // 초기 데이터와 수정된 데이터를 비교하는 함수
    const compareData = (originData, updatedData) => {
        console.log("🎄컴페어", originData, "mod:", updatedData);
        const filterData = updatedData.filter((data) => data.pdiId); //필수값 체크

        // console.log("🎄filterData:", filterData);

        const originDataLength = originData ? originData.length : 0;
        const updatedDataLength = filterData ? filterData.length : 0;

        if (originDataLength > updatedDataLength) {
            //이전 id값은 유지하면서 나머지 값만 변경해주는 함수
            const updateDataInOrigin = (originData, filterData) => {
                // 복제하여 새로운 배열 생성
                const updatedArray = [...originData];
                // updatedData의 길이만큼 반복하여 originData 갱신
                for (let i = 0; i < Math.min(filterData.length, originData.length); i++) {
                    const updatedItem = filterData[i];
                    updatedArray[i] = { ...updatedItem, byId: updatedArray[i].byId };
                }
                return updatedArray;
            };

            const firstRowUpdate = updateDataInOrigin(originData, filterData);
            updateList(firstRowUpdate);

            const originAValues = originData.map((item) => item.byId); //삭제할 id 추출
            const extraOriginData = originAValues.slice(updatedDataLength);

            deleteList(extraOriginData);
        } else if (originDataLength === updatedDataLength) {
            updateList(filterData);
        } else if (originDataLength < updatedDataLength) {
            const toAdds = [];
            const toUpdate = [];
            for (let i = 0; i < originDataLength; i++) {
                const temp = { ...filterData[i] };
                toUpdate.push(temp);
            }
            updateList(toUpdate);
            for (let i = originDataLength; i < updatedDataLength; i++) {
                const temp = { ...filterData[i] };
                toAdds.push(temp);
            }
            addList(toAdds);
        }
    };

    const isCurrentPage = () => {
        return (
            current.id !== "" &&
            current.id !== undefined &&
            (current.id === currentPageName.id || current.id === innerPageName.id || current.name === modalPageName)
        );
    };

    const visibleColumnCount = headerGroups[0].headers.filter((column) => !column.notView).length;

    return (
        <>
            <div className="flex-between mg-b-10">
                <div className="page-size">
                    {/* <span className="mg-r-10">페이지 크기 :</span> */}
                    <select className="select" id={uuidv4()} value={pageSize || defaultPageSize} onChange={(e) => pageSizeChange(e.target.value)}>
                        {pageSizeOptions.map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div style={{ position: "relative", overflow: "auto", width: "auto" }}>
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
                                {isEditing && (
                                    <th style={{ width: "43px", textAlign: "center" }}>
                                        <button className="btn-primary" onClick={onAddRow} style={{ margin: 0 }}>
                                            추가
                                        </button>
                                    </th>
                                )}
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
                                                <td
                                                    {...cell.getCellProps()}
                                                    className={cellIndex === 0 ? "first-column" : "other-column"}
                                                    // onClick={(e) => onClickCell(e, cell)}
                                                >
                                                    {cell.column.id === "selection" ? (
                                                        cell.render("Cell")
                                                    ) : isEditing ? (
                                                        cell.column.type === "input" ? (
                                                            <input
                                                                type="text"
                                                                value={tableData[row.index]?.[cell.column.id] || cell.value || ""}
                                                                name={cell.column.id}
                                                                onChange={(e) => handleChange(e, row, cell.column.id)}
                                                                disabled={cell.column.disabled}
                                                            />
                                                        ) : cell.column.type === "select" ? (
                                                            <select
                                                                name={cell.column.id}
                                                                value={tableData[row.index]?.[cell.column.id] || cell.column.options[row.index].value || ""}
                                                                onChange={(e) => handleChange(e, row, cell.column.id)}>
                                                                {cell.column.options.map((option, index) => (
                                                                    <option key={index} value={option.value || ""}>
                                                                        {option.label}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        ) : cell.column.type === "dayPicker" ? (
                                                            <DayPicker
                                                                name={cell.column.id}
                                                                value={tableData[row.index]?.[cell.column.id] || ""}
                                                                onClick={(data) => handleDateClick(data, cell.column.id, row.index)}
                                                            />
                                                        ) : cell.column.type === "monthPicker" ? (
                                                            <div className="box3-1 boxDate">
                                                                <MonthPicker
                                                                    name={cell.column.id}
                                                                    value={tableData[row.index]?.[cell.column.id].substring(0, 7) || ""}
                                                                    onClick={(data) => handleDateClick(data, cell.column.id, row.index)}
                                                                />
                                                            </div>
                                                        ) : cell.column.type === "productInfo" ? (
                                                            <div>
                                                                <input
                                                                    id={cell.column.id}
                                                                    name={cell.column.id}
                                                                    type="text"
                                                                    className="basic-input"
                                                                    onClick={() => {
                                                                        goSetting(rowIndex);
                                                                        setIsOpenModalProductInfo(true);
                                                                    }}
                                                                    placeholder="품명을 선택하세요."
                                                                    value={tableData[rowIndex]?.[cell.column.id] || ""}
                                                                    // onChange={(e) => handleChange(e, row, cell.column.id)}
                                                                    readOnly
                                                                />
                                                            </div>
                                                        ) : cell.column.type === "company" ? (
                                                            <div>
                                                                <input
                                                                    className="buttonSelect"
                                                                    id={cell.column.id}
                                                                    name={cell.column.id}
                                                                    onClick={() => setValueCompany(rowIndex)}
                                                                    type="text"
                                                                    placeholder={`거래처명을 선택해 주세요.`}
                                                                    value={tableData[rowIndex]?.[cell.column.id] || ""}
                                                                    onChange={(e) => handleChange(e, row, cell.column.id)}
                                                                    readOnly
                                                                />
                                                            </div>
                                                        ) : typeof cell.value === "number" ? (
                                                            cell.value && cell.value.toLocaleString()
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
                                            <td style={{ textAlign: "center", width: "43px" }}>
                                                <button className="btnR btn-primary redDelete" onClick={() => onDeleteRow(row)}>
                                                    삭제
                                                </button>
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    ) : (
                        <tbody>
                            <tr>
                                <td
                                    colSpan={visibleColumnCount + 1}
                                    style={{ textAlign: "center", fontSize: "15px", height: "43px" }}
                                    className="back-lightgray">
                                    조회된 데이터가 없습니다.
                                </td>
                            </tr>
                        </tbody>
                    )}
                </table>
            </div>

            <div className="me-pagination">
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
            {isOpenModalCompany && <ModalPageCompany rowIndex={rowIndex} onClose={() => setIsOpenModalCompany(false)} />}
            <ProductInfoModal width={900} height={770} title="품목정보 목록" isOpen={isOpenModalProductInfo} onClose={() => setIsOpenModalProductInfo(false)} />
        </>
    );
};

export default ReactDataTablePdorder;
