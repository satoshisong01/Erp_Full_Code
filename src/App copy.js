import React, { Component } from "react";
import $ from "jquery";
import "datatables.net";
import "datatables.net-dt";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-select";
import "./DataTable.css";

class App extends Component {
    constructor(props) {
        super(props);
        this.tableRef = React.createRef();
        this.selectedRows = []; // 선택된 행의 정보를 저장할 배열
        this.activeRow = null; // 활성화된 행을 추적하기 위한 변수
    }

    componentDidMount() {
        const table = $(this.tableRef.current).DataTable({
            select: {
                style: "multi",
            },
            columnDefs: [
                {
                    orderable: false,
                    className: "dt-body-center",
                    targets: 0,
                    render: function(data, type, full, meta) {
                        if (type === "display") {
                            return '<input type="checkbox" class="row-select">';
                        }
                        return data;
                    },
                },
            ],
        });

        const self = this;

        // 전체 선택 체크박스 이벤트 처리
        $(document).on("change", "#selectAll", function() {
            const isChecked = this.checked;
            $("input.row-select").prop("checked", isChecked);
            table.rows().select();

            if (!isChecked) {
                table.rows().deselect();
            }

            self.updateSelectedRows(table);
        });

        // 개별 선택 체크박스 이벤트 처리
        table.on("change", "input.row-select", function() {
            const isChecked = this.checked;

            if (!isChecked) {
                $("#selectAll").prop("checked", false);
            }

            self.updateSelectedRows(table);
        });

        // 셀 클릭 시 편집 가능한 input 요소로 변경
        table.on("click", "td:not(:first-child)", function() {
            const cell = table.cell(this);
            const columnIndex = cell.index().column;
            const columnIndexWithoutSelect = columnIndex - 1; // 첫 번째 열은 체크박스이므로 인덱스 조정

            if (columnIndexWithoutSelect >= 0) {
                $(this).html(
                    '<input type="text" class="edit-input" value="' +
                        cell.data() +
                        '">'
                );
                $(".edit-input")
                    .focus()
                    .blur(function() {
                        const newValue = $(this).val();
                        table.cell(this.parentNode).data(newValue);
                    });
            }
        });

        // 저장 버튼 클릭 시 수정된 데이터 저장
        $("#saveButton").on("click", function() {
            self.saveModifiedData(table);
        });
    }

    // 선택된 행 정보 업데이트
    updateSelectedRows(table) {
        this.selectedRows = table
            .rows({ selected: true })
            .data()
            .toArray();
        console.log(this.selectedRows);
    }

    // 수정된 데이터 저장
    saveModifiedData(table) {
        table.rows().every(function() {
            const rowData = this.data();
            // rowData를 서버로 보내어 저장하는 로직을 구현하세요.
            console.log("Save data:", rowData);
            return null; // 값을 반환하도록 수정
        });
    }

    render() {
        return (
            <div>
                <table ref={this.tableRef}>
                    <thead>
                        <tr id="table-border111">
                            <th> </th>
                            <th>Name</th>
                            <th style={{ borderBottom: "none" }}>Position</th>
                            <th>Office</th>
                            <th>Age</th>
                            <th>Start date</th>
                            <th>Salary</th>
                        </tr>
                        <tr>
                            <th>
                                <input type="checkbox" id="selectAll" />
                            </th>
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
                            <td>
                                <input type="checkbox" className="row-select" />
                            </td>
                            <td>Tiger Nixon</td>
                            <td>System Architect</td>
                            <td>Edinburgh</td>
                            <td>61</td>
                            <td>2011/04/25</td>
                            <td>$320,800</td>
                        </tr>
                        <tr>
                            <td>
                                <input type="checkbox" className="row-select" />
                            </td>
                            <td>Tiger Nixon</td>
                            <td>System Architect</td>
                            <td>Edinburgh</td>
                            <td>61</td>
                            <td>2011/04/25</td>
                            <td>$320,800</td>
                        </tr>
                        {/* 나머지 행들 */}
                    </tbody>
                </table>
                <button id="saveButton">Save</button>
            </div>
        );
    }
}

export default App;
