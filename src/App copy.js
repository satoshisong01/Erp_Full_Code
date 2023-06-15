import React, { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-dt/js/dataTables.dataTables";
import "./Test.css";
import ModalPage from "./common/tableHeader/ModalPage";

const MyDataTable = () => {
    const tableRef = useRef(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [searchValues, setSearchValues] = useState([]);

    useEffect(() => {
        const table = $(tableRef.current).DataTable();

        // 컬럼별 검색 이벤트 처리
        $(tableRef.current)
            .find('thead input[type="search"]')
            .on("keyup change", function() {
                const columnIndex = $(this)
                    .closest("th")
                    .index();
                setSearchValues((prevSearchValues) => {
                    const newSearchValues = [...prevSearchValues];
                    newSearchValues[columnIndex] = $(this).val();
                    return newSearchValues;
                });
            });

        // 최상단 체크박스 이벤트 처리
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

        // 이전 검색 조건 초기화
        table
            .columns()
            .search("")
            .draw();

        // 각 컬럼에 대한 검색어 설정
        searchValues.forEach((searchValue, columnIndex) => {
            if (searchValue) {
                table.column(columnIndex).search(searchValue);
            }
        });

        // 검색 결과 테이블 다시 그리기
        table.draw();
    };

    return (
        <table id="tableBody" ref={tableRef}>
            {modalOpen && (
                <ModalPage
                    onClose={() => {
                        setModalOpen(false);
                        // refetch();
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
            <tbody onClick={() => setModalOpen(true)}>
                <tr>
                    <td>
                        <input type="checkbox" />
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
                    <th></th>
                </tr>
            </tfoot>
        </table>
    );
};

export default MyDataTable;
