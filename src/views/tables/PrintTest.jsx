import React, { useEffect, useRef } from "react";
import $ from "jquery";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-dt/js/dataTables.dataTables";

const PrintTest = () => {
    const tableRef = useRef(null);

    useEffect(() => {
        $(tableRef.current).DataTable();
    }, []);

    const handlePrint = () => {
        window.print();
    };

    return (
        <div>
            <table ref={tableRef}>
                <th>
                    <td>123</td>
                </th>
                <tbody>
                    <td>456</td>
                </tbody>
            </table>
            <button onClick={handlePrint}>Print</button>
        </div>
    );
};

export default PrintTest;
