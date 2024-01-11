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
import CompanyModal from "components/modal/CompanyModal";
import ProductInfoModal from "components/modal/ProductInfoModal";
import ProductGroupModal from "components/modal/ProductGroupModal";
import EmployerInfoModal from "components/modal/EmployerInfoModal";

const ReactDataTableDevCost = (props) => {
    const {
        columns,
        customDatas,
        defaultPageSize,
        tableRef,
        viewPageName,
        customDatasRefresh,
        singleUrl,
        editing,
        hideCheckBox,
        returnSelect,
        returnSelectRows,
        condition,
    } = props;
    const {
        prevCurrentPageName,
        innerPageName,
        prevInnerPageName,
        setCurrentTable,
        setLengthSelectRow,
        newRowData,
        currentPageName,
        // projectInfo,
        companyInfo,
        setModalLengthSelectRow,
        // setIsOpenModalCompany,
        // isOpenModalCompany,
        setCompanyInfo,
        // isOpenModalPgNm,
        projectPgNm,
        setProjectPgNm,
        // setIsOpenModalPgNm,
        isModalTable,
        nameOfButton,
        versionInfo,
        setNameOfButton,
        modalPageName,
    } = useContext(PageContext);

    const [tableData, setTableData] = useState([]);
    const [originTableData, setOriginTableData] = useState([]);
    // const [changeTable, setChangeTable] = useState([]);
    const pageSizeOptions = [5, 10, 15, 20, 30, 50, 100];
    const [isEditing, setIsEditing] = useState(false);
    const [current, setCurrent] = useState(viewPageName); //==viewPageName
    //const [selectRow, setSelectRow] = useState({}); //마지막으로 선택한 row
    const [rowIndex, setRowIndex] = useState(0);
    const [isOpenModalCompany, setIsOpenModalCompany] = useState(false); //거래처정보목록
    const [isOpenModalProductInfo, setIsOpenModalProductInfo] = useState(false); //품목정보목록
    const [isOpenModalProductGroup, setIsOpenModalProductGroup] = useState(false); //품목그룹목록
    const [isOpenModalEmployerInfo, setIsOpenModalEmployerInfo] = useState(false); //업무회원목록

    /* 최초 실행, 데이터 초기화  */
    useEffect(() => {
        setCurrent(viewPageName);
        if (tableRef) {
            setCurrentTable(tableRef);
        }
    }, []);

    const isCurrentPage = () => {
        return current.id !== "" && (current.id === currentPageName.id || current.id === innerPageName.id || current.name === modalPageName);
    };

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
    }, [currentPageName, innerPageName]);

    /* 테이블 cell에서 수정하는 경우의 on off */
    useEffect(() => {
        // console.log("개발외주비 current:", current.name, "inner:", innerPageName.name, "current:",currentPageName.name);
        if (isCurrentPage()) {
            setIsEditing(editing !== undefined ? editing : isEditing); //테이블 상태 //inner tab일 때 테이블 조작
        }
        if (current.id === innerPageName.id && nameOfButton === "save") {
            compareData(originTableData, tableData);
            setNameOfButton("");
        }
    }, [innerPageName, editing, nameOfButton]);

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
            console.log("❗❗❗❗❗ newRowData");
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

    useEffect(() => {
        if (isCurrentPage() && Object.keys(companyInfo).length > 0) {
            setValueDataCmInfo(rowIndex, companyInfo);
            setCompanyInfo({})
            console.log(".......회사목록 초기화.......");
        }
    }, [companyInfo]);

    const setValueDataCmInfo = (rowIndex, cmInfo) => {
        console.log(cmInfo, "cmInfocmInfo");
        let updatedTableData = [];
        if (current === "개발외주비") {
            updatedTableData = [...tableData];
            updatedTableData[rowIndex] = {
                ...updatedTableData[rowIndex], // 다른 속성들을 그대로 유지
                cltNm: cmInfo.cltNm,
                cltId: cmInfo.cltId,
            };
        } else {
            updatedTableData = [...tableData];
            updatedTableData[rowIndex] = {
                ...updatedTableData[rowIndex], // 다른 속성들을 그대로 유지
                ...cmInfo,
            };
        }
        setTableData(updatedTableData);
        setCompanyInfo({});
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
                newRow[column.accessor] = condition.poiId || ""; // poiId를 항상 선택한놈으로 설정
            } else if (column.accessor === "versionId") {
                newRow[column.accessor] = condition.versionId; // pjbgTypeCode 항상 "EXPNS10"로 설정
            } else if (column.accessor === "esntlId") {
                //임시 업무회원 삭제해야함
                newRow[column.accessor] = ""; // pjbgTypeCode 항상 "EXPNS10"로 설정
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

    const onDeleteRow = (row) => {
        const rowId = row.index;
        // const deletedPjbgId = tableData[rowId].devOutId;
        // setDeleteNumList((prevIds) => [...prevIds, deletedPjbgId]);
        const updateTableData = tableData.filter((_, index) => index !== rowId);
        console.log("💜💜💜onDeleteRow:", updateTableData);
        setTableData([...updateTableData]);
    };

    const pageSizeChange = (value) => {
        setPageSize(Number(value)); // 페이지 크기 변경
        gotoPage(0); // 첫 페이지로 이동
    };

    //-------------------------------배열 추가, 수정, 삭제

    const addItem = async (addData) => {
        console.log(addData, "개발외주비");
        const url = `/api/baseInfrm/product/devOutCost/addList.do`;
        const resultData = await axiosPost(url, addData);
        console.log(resultData, "💜addItem");
        if (resultData) {
            customDatasRefresh && customDatasRefresh();
        }
    };

    const addItemArray = async (addData) => {
        const url = `/api/baseInfrm/product/devOutCost/addArrayList.do`;
        const resultData = await axiosPost(url, addData);
        console.log(resultData, "💜addItemArray");
        if (resultData) {
            customDatasRefresh && customDatasRefresh();
        }
    };

    const updateItem = async (toUpdate) => {
        const url = `/api/baseInfrm/product/devOutCost/editList.do`;
        console.log(toUpdate, "💜updateItem");
        const resultData = await axiosUpdate(url, toUpdate);
        console.log(resultData, "변경된거 맞음?");

        if (resultData) {
            customDatasRefresh && customDatasRefresh();
        }
    };

    const updateItemArray = async (toUpdate) => {
        const dataArray = generateUpdateObjects(toUpdate);
        const url = `/api/baseInfrm/product/devOutCost/editList.do`;
        console.log(toUpdate, "변경되는 값?");
        const resultData = await axiosUpdate(url, dataArray);
        console.log(resultData, "변경된거 맞음?");

        if (resultData) {
            customDatasRefresh && customDatasRefresh();
        }
    };

    const deleteItem = async (removeItem) => {
        const url = `/api/baseInfrm/product/devOutCost/removeAll.do`;
        const resultData = await axiosDelete(url, removeItem);
        console.log(resultData, "지워진거맞음?");

        if (resultData) {
            customDatasRefresh && customDatasRefresh();
        }
    };

    const generateUpdateObjects = (updatedData) => {
        let updates = [];

        updatedData.forEach((upItem) => {
            const { devOutId } = upItem; // id 배열
            const colNames = Object.keys(upItem).filter((key) => key.startsWith("pjbgPrice")); // 경비종류 배열
            if (devOutId && colNames && devOutId.length > 0 && colNames.length > 0 && devOutId.length === colNames.length) {
                colNames.forEach((name, index) => {
                    const dataSet = {
                        versionId: condition.versionId,
                        pgNm: upItem.pgNm,
                        pgId: upItem.pgId,
                        pjbgBeginDt: upItem.pjbgBeginDt,
                        pjbgDesc: upItem.pjbgDesc,
                        pjbgDt: upItem.pjbgDt,
                        pjbgManpower: upItem.pjbgManpower,
                        pjbgEndDt: upItem.pjbgEndDt,
                        poiId: condition.poiId || "",
                        devOutId: devOutId[index],
                        pjbgPrice: upItem[name],
                        cltNm: companyInfo.cltNm,
                        cltId: companyInfo.cltId,
                    };

                    updates.push(dataSet);
                });
            }
        });

        return updates;
    };

    // 초기 데이터와 수정된 데이터를 비교하는 함수

    const compareData = (originData, updatedData) => {
        console.log("개발외주비 compare");
        const filterData = updatedData.filter((data) => data.poiId); //pmpMonth가 없는 데이터 제외
        const originDataLength = originData ? originData.length : 0;
        const updatedDataLength = filterData ? filterData.length : 0;
        console.log("여기탐 개발외주 수정?", updatedData);
        console.log("updatedDataLength?", updatedDataLength);

        if (originDataLength > updatedDataLength) {
            //이전 id값은 유지하면서 나머지 값만 변경해주는 함수
            const updateDataInOrigin = (originData, updatedData) => {
                // 복제하여 새로운 배열 생성
                const updatedArray = [...originData];
                // updatedData의 길이만큼 반복하여 originData 갱신
                for (let i = 0; i < Math.min(updatedData.length, originData.length); i++) {
                    const updatedItem = updatedData[i];
                    updatedArray[i] = { ...updatedItem, devOutId: updatedArray[i].devOutId };
                }
                return updatedArray;
            };

            const firstRowUpdate = updateDataInOrigin(originData, updatedData);
            updateItem(firstRowUpdate); //수정

            const delList = [];
            const delListTest = [];
            for (let i = updatedDataLength; i < originDataLength; i++) {
                delList.push(originData[i].devOutId);
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

    useEffect(() => {
        console.log(tableData);
    }, [tableData]);

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
                                                    ) : cell.column.type === "company" ? (
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
                ) : (
                    <tbody>
                        <tr>
                            <td colSpan={visibleColumnCount + 1} style={{ textAlign: "center", fontSize: "15px", height: "80px" }} className="back-lightgray">
                                조회된 데이터가 없습니다.
                            </td>
                        </tr>
                    </tbody>
                )}
            </table>

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
            />
            {/*<div style={{ display: "flex" }}>
                <span style={{ display: "flex", justifyContent: "center", width: "100px", backgroundColor: "#f2f2f2", border: "solid gray 1px" }}>
                    {current} 합계
                </span>
                <span style={{ display: "flex", justifyContent: "center", width: "100px", border: "solid gray 1px" }}>
                    {`${totalPrice.toLocaleString("ko-KR")} 원`}
                </span>
            </div>*/}
        </>
    );
};

export default ReactDataTableDevCost;
