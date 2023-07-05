import React, { useEffect, useRef } from "react";
import $ from "jquery";
import "datatables.net-dt";

const DataTable = () => {
    const tableRef = useRef(null);

    useEffect(() => {
        // DataTables 초기화
        $(tableRef.current).DataTable();
    }, []);

    return (
        <table ref={tableRef}>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Position</th>
                    <th>Office</th>
                    <th>Age</th>
                    <th>Start date</th>
                    <th>Salary</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Tiger Nixon</td>
                    <td>System Architect</td>
                    <td>Edinburgh</td>
                    <td>61</td>
                    <td>2011/04/25</td>
                    <td>$320,800</td>
                </tr>
                <tr>
                    <td>Garrett Winters</td>
                    <td>Accountant</td>
                    <td>Tokyo</td>
                    <td>63</td>
                    <td>2011/07/25</td>
                    <td>$170,750</td>
                </tr>
                {/* 나머지 데이터 행들 */}
            </tbody>
        </table>
    );
};

export default DataTable;
