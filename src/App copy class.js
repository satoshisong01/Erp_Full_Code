import React, { Component } from "react";
import $ from "jquery";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-dt/js/dataTables.dataTables";
import "./Test.css";
import ModalPage from "./common/tableHeader/ModalPage";

class MyDataTable extends Component {
    constructor(props) {
        super(props);
        this.tableRef = React.createRef();
        this.state = {
            modalOpen: false,
            searchValues: [],
        };
    }

    componentDidMount() {
        const table = $(this.tableRef.current).DataTable();

        // 컬럼별 검색 이벤트 처리
        $(this.tableRef.current)
            .find('thead input[type="search"]')
            .on("keyup change", function() {
                const columnIndex = $(this)
                    .closest("th")
                    .index();
                this.setState((prevState) => {
                    const newSearchValues = [...prevState.searchValues];
                    newSearchValues[columnIndex] = $(this).val();
                    return { searchValues: newSearchValues };
                });
            });

        // 최상단 체크박스 이벤트 처리
        $(this.tableRef.current)
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
    }

    handleSearch = () => {
        const table = $(this.tableRef.current).DataTable();

        // 이전 검색 조건 초기화
        table
            .columns()
            .search("")
            .draw();

        // 각 컬럼에 대한 검색어 설정
        this.state.searchValues.forEach((searchValue, columnIndex) => {
            if (searchValue) {
                table.column(columnIndex).search(searchValue);
            }
        });

        // 검색 결과 테이블 다시 그리기
        table.draw();
    };

    handleDelete = () => {
        const table = $(this.tableRef.current).DataTable();
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

    render() {
        const { modalOpen } = this.state;

        return (
            <table id="tableBody" ref={this.tableRef}>
                {modalOpen && (
                    <ModalPage
                        onClose={() => {
                            this.setState({ modalOpen: false });
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
                <tbody onClick={() => this.setState({ modalOpen: true })}>
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
                            <button onClick={this.handleSearch}>검색</button>
                        </th>
                        <th></th>
                        <th>
                            <button onClick={this.handleDelete}>삭제</button>
                        </th>
                    </tr>
                </tfoot>
            </table>
        );
    }
}

export default MyDataTable;
