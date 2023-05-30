import React, { useEffect, useRef } from "react";
import $ from "jquery";
//import "jquery-easyui";

function TestTable2() {
    const tableRef = useRef(null);

    //useEffect(() => {
    //    // EasyUI 라이브러리가 로드된 후에만 호출
    //    $(document).ready(() => {
    //        $(tableRef.current).datagrid();
    //    });
    //}, []);

    return (
        <table ref={tableRef}>
            <thead>
                <tr style={{ border: "1px solid black" }}>
                    <th
                        style={{ border: "1px solid black" }}
                        rowspan={2}
                        field="field1"
                    >
                        헤더1번
                    </th>

                    <th
                        colspan={8}
                        field="field2"
                        style={{ border: "1px solid black" }}
                    >
                        헤더2번
                    </th>
                </tr>
                <tr style={{ border: "1px solid black" }}>
                    <th field="field3" style={{ border: "1px solid black" }}>
                        소제목1
                    </th>
                    <th field="field3" style={{ border: "1px solid black" }}>
                        소제목2
                    </th>
                    <th field="field4" style={{ border: "1px solid black" }}>
                        소제목3
                    </th>
                    <th field="field4" style={{ border: "1px solid black" }}>
                        소제목4
                    </th>
                    <th field="field4" style={{ border: "1px solid black" }}>
                        닭제목1
                    </th>
                    <th field="field4" style={{ border: "1px solid black" }}>
                        닭제목2
                    </th>
                    <th field="field4" style={{ border: "1px solid black" }}>
                        닭제목3
                    </th>
                    <th field="field4" style={{ border: "1px solid black" }}>
                        닭제목4
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td style={{ border: "1px solid black" }} field="field1">
                        Row 1, Column 1
                    </td>
                    <td style={{ border: "1px solid black" }} field="field2">
                        Row 1, Column 2
                    </td>
                    <td style={{ border: "1px solid black" }} field="field3">
                        Row 1, Column 3
                    </td>
                </tr>
                <tr style={{ border: "1px solid black" }}>
                    <td
                        style={{ border: "1px solid black" }}
                        rowspan={3}
                        field="field1"
                    >
                        Row 2, Column 1
                    </td>
                    <td style={{ border: "1px solid black" }} field="field2">
                        Row 2, Column 2
                    </td>
                    <td style={{ border: "1px solid black" }} field="field3">
                        Row 2, Column 3
                    </td>
                </tr>
                <tr style={{ border: "1px solid black" }}>
                    <td style={{ border: "1px solid black" }} field="field2">
                        Row 3, Column 2
                    </td>
                    <td style={{ border: "1px solid black" }} field="field3">
                        Row 3, Column 3
                    </td>
                </tr>
                <tr style={{ border: "1px solid black" }}>
                    <td style={{ border: "1px solid black" }} field="field2">
                        Row 3, Column 2
                    </td>
                    <td style={{ border: "1px solid black" }} field="field3">
                        Row 3, Column 3
                    </td>
                </tr>
            </tbody>
        </table>
    );
}

export default TestTable2;
