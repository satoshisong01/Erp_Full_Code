import React, { useEffect, useRef, useState } from "react";
import "../../common/tableHeader/ContentMain.css";
import $ from "jquery";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-dt/js/dataTables.dataTables";
import "./Test.css";
import ContentName from "../../common/tableHeader/ContentName";
import Header from "../../common/tableHeader/Header";
import ModalPage from "../../common/tableHeader/ModalPage";

const ClientManagement = () => {
    const tableRef = useRef(null);

    const [values, setValues] = useState([]);
    const [S_minDates, setS_minDates] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selection, setSelection] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [searchValues, setSearchValues] = useState([]);

    useEffect(() => {
        const table = $(tableRef.current).DataTable();

        $(tableRef.current)
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

        $(tableRef.current)
            .find('thead th:first-child input[type="checkbox"]')
            .on("change", function() {
                const isChecked = $(this).is(":checked");
                table
                    .column(0)
                    .nodes()
                    .to$()
                    .find('input[type="checkbox"]')
                    .prop("checked", isChecked);
            });
    }, []);

    const handleSearch = () => {
        const table = $(tableRef.current).DataTable();

        table
            .columns()
            .search("")
            .draw();

        searchValues.forEach((searchValue, columnIndex) => {
            if (searchValue) {
                table.column(columnIndex).search(searchValue);
            }
        });

        table.draw();
    };

    const handleDelete = () => {
        const table = $(tableRef.current).DataTable();
        const checkedRows = table
            .column(0)
            .nodes()
            .to$()
            .find('input[type="checkbox"]:checked')
            .closest("tr");

        checkedRows.each(function() {
            table
                .row($(this))
                .remove()
                .draw(false);
        });
    };

    return (
        <>
            <div
                className="row"
                style={{
                    margin: "auto",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "0.3rem",
                    }}
                ></div>
            </div>
            <div className="table-responsive">
                <Header iconName="fa fa-table" titleName="거래처 관리" />
                <div
                    style={{
                        display: "flex",
                        borderTop: "solid #DDDDDD 1px",
                        borderBottom: "solid #DDDDDD 1px",
                    }}
                ></div>
                <ContentName tableTitle="거래처 목록" />
                <table id="tableBody" ref={tableRef}>
                    {modalOpen && (
                        <ModalPage
                            onClose={() => {
                                setModalOpen(false);
                            }}
                        />
                    )}
                    <thead>
                        <tr>
                            <th>
                                <input type="checkbox" />
                            </th>
                            <th>
                                <input type="search" placeholder="이름 검색" />
                            </th>
                            <th>
                                <input type="search" placeholder="나이 검색" />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr onClick={() => setModalOpen(true)}>
                            <td>
                                <input
                                    onClick={(e) => e.stopPropagation()}
                                    type="checkbox"
                                />
                            </td>
                            <td>
                                <div>
                                    <p>홍길동</p>
                                </div>
                            </td>
                            <td>
                                <div>25</div>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <input type="checkbox" />
                            </td>
                            <td>김철수</td>
                            <td>30</td>
                        </tr>
                        <tr>
                            <td>
                                <input type="checkbox" />
                            </td>
                            <td>이영희</td>
                            <td>35</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <th>
                                <button onClick={handleSearch}>검색</button>
                            </th>
                            <th></th>
                            <th>
                                <button onClick={handleDelete}>삭제</button>
                            </th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </>
    );
};

export default ClientManagement;
