import React, { useEffect, useRef } from "react";
import $ from "jquery";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net";

const MyDataTable = () => {
    const tableRef = useRef(null);

    useEffect(() => {
        const table = $(tableRef.current).DataTable({
            // 검색 기능을 활성화합니다.
            searching: true,
        });

        // 커스텀 검색 필터를 추가합니다.
        $("#searchInput").on("keyup", function() {
            table.search(this.value).draw();
        });
    }, []);

    return (
        <div>
            <input id="searchInput" type="text" placeholder="검색" />
            <table ref={tableRef}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>이름</th>
                        <th>나이</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>John Doe</td>
                        <td>30</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Jane Smith</td>
                        <td>25</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>Mike Johnson</td>
                        <td>35</td>
                    </tr>
                    {/* 추가 데이터 행 */}
                </tbody>
            </table>
        </div>
    );
};

export default MyDataTable;
