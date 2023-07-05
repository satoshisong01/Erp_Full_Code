import React, { useEffect, useRef, useState } from "react";
import "../../common/tableHeader/ContentMain.css";
import $ from "jquery";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-dt/js/dataTables.dataTables";
import "./Test22.css";
import ModalPage from "../../common/tableHeader/ModalPage";
import { BigBreadcrumbs, WidgetGrid, JarvisWidget } from "../../common";
import XLSX from "xlsx-js-style";
import axios from "axios";

const ClientManagement = () => {
    const searchTableRef = useRef(null);
    const dataTableRef = useRef(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [searchValues, setSearchValues] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [csvData, setCsvData] = useState([]);
    const [selectedColumns, setSelectedColumns] = useState([]);
    const [data, setData] = useState([]);
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(
                "http://192.168.0.113:8080/dummy/list"
            );
            console.log(response.data.data);
            setData(response.data.data);
        } catch (error) {
            console.error("에럽니다 삐융삐융", error);
        }
    };

    const addData = async () => {
        try {
            const inputData = JSON.parse(inputValue);
            const response = await axios.post(
                "http://192.168.0.113:8080/dummy/add",
                inputData
            );
            console.log(response.data);
            fetchData();
            setInputValue("");
        } catch (error) {
            console.error("에럽니다 삐융삐융", error);
        }
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleRefresh = () => {
        fetchData();
    };

    // STEP 1: 새로운 workbook을 만든다
    const wb = XLSX.utils.book_new();

    // STEP 2: 데이터 rows에 대한 value와 style을 지정해준다.
    const header =
        data.length > 0
            ? Object.keys(data[0]).map((key) => ({
                  v: key,
                  t: "s",
                  s: {
                      font: {
                          sz: "15",
                      },
                      border: {
                          top: {
                              //  style: "thin",
                              color: { rgb: "000000" }, // 검은색
                          },
                          bottom: {
                              //  style: "thin",
                              color: { rgb: "000000" }, // 검은색
                          },
                          left: {
                              //  style: "thin",
                              color: { rgb: "000000" }, // 검은색
                          },
                          right: {
                              //  style: "thin",
                              color: { rgb: "000000" }, // 검은색
                          },
                      },
                  },
              }))
            : [];

    // STEP 3: 바디 생성
    const body = data.map((item) =>
        Object.values(item).map((value) => ({
            v: value,
            t: "s",
            s: { font: { color: { rgb: "188038" } } },
        }))
    );

    // STEP 3: header와 body로 worksheet를 생성한다.
    const ws = XLSX.utils.aoa_to_sheet([header, ...body]);

    // 열의 너비를 조정
    const columnWidths = header.map((col) => ({ wch: 30 }));
    ws["!cols"] = columnWidths;

    // worksheet를 workbook에 추가한다.
    XLSX.utils.book_append_sheet(wb, ws, "readme demo");

    useEffect(() => {
        const searchTable = $(searchTableRef.current).DataTable({
            searching: false,
            paging: false,
            ordering: false,
            info: false,
        });
        const dataTable = $(dataTableRef.current).DataTable({
            info: false,
            paging: false,
            ordering: false,
        });

        $(searchTableRef.current)
            .find('thead input[type="search"]')
            .on("keyup change", function() {
                const columnIndex = $(this)
                    .closest("th")
                    .index();
                setSearchValues((prevState) => {
                    const newSearchValues = [...prevState];
                    newSearchValues[columnIndex] = $(this).val();
                    return newSearchValues;
                });
            });

        $(searchTableRef.current)
            .find('thead th:first-child input[type="checkbox"]')
            .on("change", function() {
                const isChecked = $(this).is(":checked");
                $(dataTableRef.current)
                    .find('tbody input[type="checkbox"]')
                    .prop("checked", isChecked);
            });

        $(dataTableRef.current).on("click", "tbody tr", function() {
            const rowData = dataTable.row(this).data();
            if (rowData) {
                setModalOpen(true);
            }
        });
    }, []);

    const handleSearch = () => {
        const dataTable = $(dataTableRef.current).DataTable();
        dataTable.draw();

        searchValues.forEach((searchValue, columnIndex) => {
            if (searchValue) {
                dataTable.column(columnIndex).search(searchValue);
            } else {
                dataTable.column(columnIndex).search(""); // 빈 값인 경우 검색 해제
            }
        });

        dataTable.draw();
    };

    const handleDelete = () => {
        const dataTable = $(dataTableRef.current).DataTable();
        const checkedRows = dataTable
            .rows()
            .nodes()
            .to$()
            .find('input[type="checkbox"]:checked')
            .closest("tr");

        checkedRows.each(function() {
            dataTable
                .row($(this))
                .remove()
                .draw(false);
        });
    };

    const getSelectedRowsData = () => {
        const dataTable = $(dataTableRef.current).DataTable();
        const selectedRowsData = dataTable
            .rows(".selected")
            .data()
            .toArray();

        setSelectedRows(selectedRowsData.map((row) => [row[1], row[2]]));
    };

    return (
        <>
            <div id="content">
                <div className="row">
                    <BigBreadcrumbs
                        items={["Tables", "Normal Tables"]}
                        icon="fa fa-fw fa-table"
                        className="col-xs-12 col-sm-7 col-md-7 col-lg-4"
                    />
                </div>
                <WidgetGrid>
                    <div className="row">
                        <article className="col-sm-12">
                            <JarvisWidget
                                id="wid-id-0"
                                editbutton={false}
                                color="blueDark"
                            >
                                <header>
                                    <span className="widget-icon">
                                        <i className="fa fa-table" />
                                    </span>

                                    <h2>거래처 목록</h2>
                                </header>
                                <div>
                                    <div className="widget-body">
                                        <table
                                            ref={searchTableRef}
                                            className="table table-bordered"
                                            id="searchTable"
                                        >
                                            <thead>
                                                <tr>
                                                    <th></th>
                                                    <th>
                                                        <input
                                                            type="search"
                                                            defaultValue=""
                                                            placeholder="dpmCd 검색"
                                                        />
                                                    </th>
                                                    <th>
                                                        <input
                                                            type="search"
                                                            defaultValue=""
                                                            placeholder="dpmNm 검색"
                                                        />
                                                    </th>
                                                    <th>
                                                        <input
                                                            type="search"
                                                            defaultValue=""
                                                            placeholder="dpmLv 검색"
                                                        />
                                                    </th>
                                                </tr>
                                            </thead>
                                        </table>
                                        <table
                                            ref={dataTableRef}
                                            className="table table-bordered"
                                            id="dataTable"
                                        >
                                            <thead>
                                                <tr>
                                                    <th>
                                                        <input
                                                            type="checkbox"
                                                            onClick={(e) => {
                                                                const isChecked =
                                                                    e.target
                                                                        .checked;
                                                                $(
                                                                    dataTableRef.current
                                                                )
                                                                    .find(
                                                                        'tbody input[type="checkbox"]'
                                                                    )
                                                                    .prop(
                                                                        "checked",
                                                                        isChecked
                                                                    );
                                                                getSelectedRowsData();
                                                            }}
                                                        />
                                                    </th>
                                                    {data.length > 0 &&
                                                        Object.keys(
                                                            data[0]
                                                        ).map((key, index) => (
                                                            <th key={index}>
                                                                {key}
                                                            </th>
                                                        ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>
                                                            <input type="checkbox" />
                                                        </td>
                                                        {Object.values(
                                                            item
                                                        ).map(
                                                            (value, index) => (
                                                                <td key={index}>
                                                                    {value}
                                                                </td>
                                                            )
                                                        )}
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <th>
                                                        <button
                                                            onClick={
                                                                handleSearch
                                                            }
                                                        >
                                                            검색
                                                        </button>
                                                    </th>
                                                    <th></th>
                                                    <th>
                                                        <button
                                                            onClick={
                                                                handleDelete
                                                            }
                                                        >
                                                            삭제
                                                        </button>
                                                    </th>
                                                    <th></th>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>
                            </JarvisWidget>
                        </article>
                    </div>
                </WidgetGrid>
                <button
                    onClick={() => {
                        // STEP 4: Write Excel file to browser (2번째 인자에는 파일명을 지정)
                        XLSX.writeFile(wb, "table-demo.xlsx");
                    }}
                >
                    Download Excel File(.xlsx)
                </button>
                <h1>데이터를 가지고옵시다</h1>
                <div>
                    {data.length > 0 ? (
                        data.map((item) => <div>{item.dpmCd}</div>)
                    ) : (
                        <div>No data available</div>
                    )}
                </div>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="데이터 입력"
                />
                <button onClick={addData}>데이터 추가</button>
                <button onClick={handleRefresh}>새로고침</button>
            </div>
            {modalOpen && (
                <ModalPage
                    onClose={() => {
                        setModalOpen(false);
                    }}
                />
            )}
        </>
    );
};

export default ClientManagement;
