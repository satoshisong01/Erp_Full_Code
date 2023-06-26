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
import PersonnelInfo from "../detailComponents/PersonnelInfo";

const ClientManagement = () => {
    const dataTableRef = useRef(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [data, setData] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [detailData, setDetailData] = useState(null);
    const [selectedData, setSelectedData] = useState([]);
    const [check, setCheck] = useState(false);

    useEffect(() => {
        // DataTable 인스턴스 초기화
        $(dataTableRef.current).DataTable({
            paging: true,
            searching: true,
            ordering: true,
        });

        //// 클릭 이벤트 핸들러 등록
        //$(dataTableRef.current).on("click", "tbody tr", function() {
        //    const rowData = dataTable.row(this).data();
        //    if (rowData) {
        //        setModalOpen(true);
        //        setDetailData(rowData);
        //    }
        //});
    }, []);

    console.log(data);
    console.log(selectedData);
    console.log(selectedData.map((item) => item.dpmCd));
    console.log(parseInt(selectedData.map((item) => item.dpmCd)));

    const keys = data.length > 0 ? Object.keys(data[0]) : [];

    const handleClick = (item, e) => {
        const isChecked = e.target.checked;

        if (isChecked) {
            setCheck(true);
            setSelectedData(data); // 모든 데이터를 선택된 데이터로 설정
        } else {
            setCheck(false);
            setSelectedData([]); // 선택된 데이터 초기화
        }
        setDetailData(item);
    };

    const handleItemCheck = (item, e) => {
        const isChecked = e.target.checked;

        setSelectedData((prevSelectedData) => {
            if (isChecked) {
                // 이미 선택된 데이터인지 확인 후 중복 추가 방지
                if (
                    !prevSelectedData.find(
                        (selectedItem) => selectedItem.dpmCd === item.dpmCd
                    )
                ) {
                    const sortedData = [...prevSelectedData, item].sort(
                        (a, b) => {
                            // dpmCd 속성을 기준으로 데이터 정렬
                            if (a.dpmCd < b.dpmCd) {
                                return -1;
                            }
                            if (a.dpmCd > b.dpmCd) {
                                return 1;
                            }
                            return 0;
                        }
                    );
                    return sortedData;
                }
            } else {
                return prevSelectedData.filter(
                    (selectedItem) => selectedItem.dpmCd !== item.dpmCd
                );
            }
            return prevSelectedData; // 체크가 풀리지 않았거나 중복 데이터인 경우 이전 상태 그대로 반환
        });
    };

    const handleDelete = async () => {
        //const dataTable = $(dataTableRef.current).DataTable();
        //const checkedRows = dataTable
        //    .column(0)
        //    .nodes()
        //    .to$()
        //    .find('input[type="checkbox"]:checked')
        //    .closest("tr");

        //checkedRows.each(function() {
        //    dataTable
        //        .row($(this))
        //        .remove()
        //        .draw(false);
        //});
        try {
            const data = {
                dpmCd: parseInt(selectedData.map((item) => item.dpmCd)),
            };

            const response = await axios.delete(
                "http://192.168.0.113:8080/dummy/remove",
                {
                    data: data,
                }
            );

            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

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
        } finally {
            setIsLoading(false);
            $(dataTableRef.current).DataTable();
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
        selectedData.length > 0
            ? Object.keys(selectedData[0]).map((key) => ({
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
    const body = selectedData.map((item) =>
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
                                        {isLoading ? (
                                            // 로딩 화면 표시
                                            <div>Loading...</div>
                                        ) : (
                                            // 실제 데이터 표시
                                            <>
                                                {/*<table ref={dataTableRef}>
                                                    <thead>
                                                        <tr>
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
                                                </table>*/}

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
                                                                    //onClick={(
                                                                    //    e
                                                                    //) => {
                                                                    //    const isChecked =
                                                                    //        e
                                                                    //            .target
                                                                    //            .checked;
                                                                    //    $(
                                                                    //        dataTableRef.current
                                                                    //    )
                                                                    //        .find(
                                                                    //            'tbody input[type="checkbox"]'
                                                                    //        )
                                                                    //        .prop(
                                                                    //            "checked",
                                                                    //            isChecked
                                                                    //        );
                                                                    //}}
                                                                    checked={
                                                                        check
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleClick(
                                                                            null,
                                                                            e
                                                                        )
                                                                    }
                                                                />
                                                            </th>
                                                            {keys.map(
                                                                (item) => (
                                                                    <th
                                                                        key={
                                                                            item
                                                                        }
                                                                    >
                                                                        {item}
                                                                    </th>
                                                                )
                                                            )}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {data.map(
                                                            (item, index) => (
                                                                <tr key={index}>
                                                                    <td>
                                                                        {/*<input type="checkbox" />*/}
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={selectedData.some(
                                                                                (
                                                                                    selectedItem
                                                                                ) =>
                                                                                    selectedItem.dpmCd ===
                                                                                    item.dpmCd
                                                                            )}
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                handleItemCheck(
                                                                                    item,
                                                                                    e
                                                                                )
                                                                            }
                                                                        />
                                                                    </td>
                                                                    {keys.map(
                                                                        (
                                                                            key
                                                                        ) => (
                                                                            <td
                                                                                onClick={(
                                                                                    e
                                                                                ) =>
                                                                                    handleItemCheck(
                                                                                        item,
                                                                                        e
                                                                                    )
                                                                                }
                                                                                key={
                                                                                    key
                                                                                }
                                                                            >
                                                                                {
                                                                                    item[
                                                                                        key
                                                                                    ]
                                                                                }
                                                                            </td>
                                                                        )
                                                                    )}
                                                                </tr>
                                                            )
                                                        )}
                                                    </tbody>

                                                    <tfoot>
                                                        <tr>
                                                            <th></th>
                                                            <th>
                                                                <button>
                                                                    추가
                                                                </button>
                                                            </th>
                                                            <th>
                                                                <button
                                                                    onClick={
                                                                        handleDelete
                                                                    }
                                                                >
                                                                    삭제
                                                                </button>
                                                            </th>
                                                            <th>
                                                                <button
                                                                    onClick={() => {
                                                                        // STEP 4: Write Excel file to browser (Specify the file name in the second argument)
                                                                        XLSX.writeFile(
                                                                            wb,
                                                                            "table-demo.xlsx"
                                                                        );
                                                                    }}
                                                                >
                                                                    Download
                                                                    Excel
                                                                    (.xlsx)
                                                                </button>
                                                            </th>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </JarvisWidget>
                        </article>
                    </div>
                </WidgetGrid>
            </div>
            {modalOpen && (
                <ModalPage
                    onClose={() => {
                        setModalOpen(false);
                    }}
                />
            )}
            {/*<div>{JSON.stringify(detailData)}</div>*/}
            {detailData && <PersonnelInfo data={detailData} />}
        </>
    );
};

export default ClientManagement;
