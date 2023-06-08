import React from "react";
import { v4 as uuidv4 } from "uuid";
import "../../common/tableHeader/ContentMain.css";
import $ from "jquery";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-dt/js/dataTables.dataTables";
import "./Test.css";
import {
    DataGrid,
    GridColumn,
    NumberBox,
    CheckBox,
    TextBox,
    Tooltip,
    LinkButton,
    DateBox,
    //SearchBox,
} from "rc-easyui";

import { Stats, BigBreadcrumbs, WidgetGrid, JarvisWidget } from "../../common";
import ContentName from "../../common/tableHeader/ContentName";
import Header from "../../common/tableHeader/Header";
import Search from "../../common/tableHeader/Search";
import ModalPage from "../../common/tableHeader/ModalPage";

const withCheckbox = (WrappedComponent) => {
    class CheckGrid extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                clicked: false,
                data: this.props.data,
                selectedRows: [],
            };
        }
        componentDidMount() {
            this.setState({ selectedRows: this.props.selection || [] });
        }
        componentDidUpdate(prevProps) {
            if (this.props.selection !== prevProps.selection) {
                this.setState({ selectedRows: this.props.selection });
            }
            if (this.props.data !== prevProps.data) {
                this.setState({ data: this.props.data });
            }
        }
        //체크부분
        isChecked(row) {
            if (this.props.idField) {
                const index = this.state.selectedRows.findIndex(
                    (s) => s[this.props.idField] === row[this.props.idField]
                );
                if (index >= 0) {
                    return true;
                }
            } else {
                const index = this.state.selectedRows.indexOf(row);
                if (index >= 0) {
                    return true;
                }
            }
            return false;
        }
        isAllChecked() {
            const { selectedRows, data } = this.state;
            if (selectedRows.length && selectedRows.length === data.length) {
                return true;
            }
            return false;
        }
        handleRowCheck(row, checked) {
            if (this.state.clicked) {
                return;
            }
            const index = this.state.data.indexOf(row);
            console.log("선택된 번호는:", index);

            const data = this.state.data.slice();
            data.splice(index, 1, Object.assign({}, row));
            this.setState({ data: data });
            if (checked) {
                this.setState({
                    selectedRows: [...this.state.selectedRows, data[index]],
                });
                console.log("선택된 값은?:", this.state.selectedRows);
            } else {
                const selection = this.state.selectedRows.filter((r) => {
                    if (this.props.idField) {
                        if (r[this.props.idField] !== row[this.props.idField]) {
                            return true;
                        }
                    } else {
                        if (r !== row) {
                            return true;
                        }
                    }
                    return false;
                });
                this.setState({
                    selectedRows: selection,
                });
            }
            this.setState({ clicked: true }, () => {
                setTimeout(() => this.setState({ clicked: false }));
                if (this.props.onSelectionChange) {
                    this.props.onSelectionChange(this.state.selectedRows);
                }
            });
        }
        handleAllCheck(checked) {
            if (this.state.clicked) {
                return;
            }
            const data = this.state.data.map((row) => Object.assign({}, row));
            this.setState(
                {
                    data: data,
                    selectedRows: checked ? data : [],
                    clicked: true,
                },
                () => {
                    setTimeout(() => this.setState({ clicked: false }));
                    if (this.props.onSelectionChange) {
                        this.props.onSelectionChange(this.state.selectedRows);
                    }
                }
            );
        }

        render() {
            return (
                <>
                    <WrappedComponent
                        {...this.props}
                        data={this.state.data}
                        ref={(el) => (this.datagrid = el)}
                    >
                        <GridColumn
                            key="ck_column_key"
                            width={50}
                            align="center"
                            field="ck"
                            render={({ row }) => (
                                <CheckBox
                                    checked={this.isChecked(row)}
                                    onChange={(checked) =>
                                        this.handleRowCheck(row, checked)
                                    }
                                ></CheckBox>
                            )}
                            header={() => (
                                <CheckBox
                                    checked={this.isAllChecked()}
                                    onChange={(checked) =>
                                        this.handleAllCheck(checked)
                                    }
                                ></CheckBox>
                            )}
                            filter={() => <span></span>}
                        />
                        {this.props.children}
                    </WrappedComponent>
                </>
            );
        }
    }
    return CheckGrid;
};
const CheckGrid = withCheckbox(DataGrid);

export default class ClientManagement extends React.Component {
    constructor(props) {
        super(props);
        this.tableRef = React.createRef();
        const data = this.getData();
        this.state = {
            data: data,
            dateValue: new Date(), //오늘날짜가들어감
            values: [], // 체크된값
            S_minDates: "",
            startDate: "",
            endDate: "",
            selection: [],
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

    handleChange5() {
        this.setState({ values: [...this.state.values] });
    }

    handleChange3 = (value) => {
        this.setState({
            startDate: value,
        });
        console.log("(핸들 체인지)스타트 ->>>>>", this.state.startDate);
    };

    handleChange4 = (value) => {
        this.setState({
            endDate: value,
        });
        console.log("(핸들 체인지4)스타트 ->>>>>>", this.state.endDate);
    };

    filterRange(startDate, endDate) {
        const filteredDates = this.state.data
            .map((item) => item.minDates)
            .filter((date) => date >= startDate && date <= endDate);

        //console.log(filteredDates.map((item) => this.formatDate(item)));
        this.setState({
            S_minDates: filteredDates.map((item) => this.formatDate(item)),
        });
        //return filteredDates.map((item) => this.formatDate(item));
    }

    formatDate(date) {
        if (date == null || "" || undefined) {
            return;
        } else {
            let y = date.getFullYear();
            let m = date.getMonth() + 1;
            let d = date.getDate();

            const formatMonth = m < 10 ? `0${m}` : m;
            const formatDay = d < 10 ? `0${d}` : d;

            return `${y}-${formatMonth}-${formatDay}`;
        }
        //return `${y}년${m}월${d}일`;
    }

    handleChange = (value) => {
        this.setState({ dateValue: value }); //클릭한 값으로 변경됨
        //this.filterRange(this.state.startDate, this.state.endDate);
        console.log(this.state.dateValue);
        //console.log("dateValue ->", this.state.dateValue);
        //console.log("이값은? value", value);
        //console.log(this.state.data);
    };

    handleChange2 = (value) => {
        this.setState({ endDate: value }); //클릭한 값으로 변경됨
        this.filterRange(this.state.startDate, this.state.endDate);
        //console.log("dateValue ->", this.state.dateValue);
        //console.log("이값은? value", value);
        //console.log(this.state.data);
    };

    getData() {
        //목데이터
        return [
            {
                //timeTable: {
                //    dates: new Date(),
                //    //dateString: this.formatDate,
                //},
                dates: new Date(),
                code: "NI-NI-01",
                name: "Koi",
                businessname: "삼성SDS",
                littlename: "SDS",
                clinentnumber: "11-2222-33",
                businessclassification: "반도체",
                ceoname: "이재용",
                companyname: "삼성",
                postnumber: "21351-51511-5253",
                address: "기흥동 머시기 203-2",
                detailaddress: "B동 421호실",
                unitcost: 10.0,
                status: false,
                listprice: 36.5,
                attr: "Large",
                itemid: "EST-1",
            },
            {
                dates: new Date(),
                code: "NI-NI-01",
                name: "Koi",
                businessname: "엘지SDS",
                littlename: "SDS",
                clinentnumber: "11-2222-33",
                businessclassification: "반도체",
                ceoname: "구본무",
                companyname: "엘지",
                postnumber: "21351-51511-5253",
                address: "기흥동 머시기 203-2",
                detailaddress: "B동 421호실",
                unitcost: 10.0,
                status: false,
                listprice: 36.5,
                attr: "Large",
                itemid: "EST-1",
            },
            {
                //timeTable: {
                //    dates: new Date(),
                //    //dateString: this.formatDate,
                //},
                dates: new Date(),
                code: "NI-NI-01",
                name: "Koi",
                businessname: "현대SDS",
                littlename: "SDS",
                clinentnumber: "11-2222-33",
                businessclassification: "반도체",
                ceoname: "정몽주",
                companyname: "현대",
                postnumber: "21351-51511-5253",
                address: "기흥동 머시기 203-2",
                detailaddress: "B동 421호실",
                unitcost: 10.0,
                status: false,
                listprice: 36.5,
                attr: "Large",
                itemid: "EST-1",
            },
        ];
    }
    handleAdd() {
        console.log(this.state.data);

        if (!this.datagrid.datagrid.endEdit()) {
            return;
        }
        let data = this.state.data.slice();
        data.unshift({
            minDates: this.state.value,
            maxDates: this.state.value,
            minDatesString: this.formatDate(this.state.value),
            maxDatesString: this.formatDate(this.state.value),
            status: false,
            _new: true,
            id: uuidv4(),
        });
        this.setState({ data: data }, () => {
            this.datagrid.datagrid.beginEdit(data[0]);
        });
        console.log(this.state.data);
    }
    handleRowEditEnd(event) {
        if (event.row._new) {
            event.row._new = undefined;
            const data = this.state.data.slice();
            this.setState({ data: data });
        }
    }
    handleRowEditCancel(event) {
        if (event.row._new) {
            console.log(event);
            console.log(event.row);
            console.log(event.row._new);
            const data = this.state.data.filter((row) => row !== event.row);
            this.setState({ data: data });
        }
    }
    deleteRow() {
        const selectId = [];
        let abc = this.state.data[0].maxDates < this.state.data.minDates;
        console.log(this.state.data[0].maxDates);
        console.log(this.state.data[0].minDates);
        console.log(abc);
        //selectId = this.state.selection.map((s) => s.id).join(", ");
        selectId.push(this.state.selection.map((s) => s.id));
        console.log(selectId);
        console.log(selectId[0]);
        console.log(this.state.selection);
        this.setState({
            data: this.state.data.filter(
                (item) => !selectId[0].includes(item.id)
            ),
        });
        this.selectId = [];
    }
    handleClick() {
        console.log("클릭");
        console.log(22);
    }
    render() {
        const { modalOpen } = this.state;
        return (
            <div id="content" style={{ padding: "0" }}>
                <WidgetGrid>
                    <div className="row">
                        <article className="col-sm-12">
                            <JarvisWidget
                                id="wid-id-0"
                                editbutton={false}
                                color="blueDark"
                            >
                                <header />
                                <div>
                                    <div className="widget-body">
                                        <div
                                            className="row"
                                            style={{
                                                margin: "auto",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    marginBottom: "0.3rem",
                                                }}
                                            ></div>
                                        </div>
                                        <div className="table-responsive">
                                            <Header
                                                iconName="fa fa-table"
                                                titleName="거래처 관리"
                                            />
                                            <div
                                                style={{
                                                    display: "flex",
                                                    borderTop:
                                                        "solid #DDDDDD 1px",
                                                    borderBottom:
                                                        "solid #DDDDDD 1px",
                                                }}
                                            >
                                                <Search searchTitle="거래처명" />
                                                <Search searchTitle="사업자등록번호" />
                                            </div>
                                            <ContentName tableTitle="거래처 목록" />
                                            <table
                                                id="tableBody"
                                                ref={this.tableRef}
                                            >
                                                {modalOpen && (
                                                    <ModalPage
                                                        onClose={() => {
                                                            this.setState({
                                                                modalOpen: false,
                                                            });
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
                                                            <input
                                                                type="search"
                                                                placeholder="이름 검색"
                                                            />
                                                        </th>
                                                        <th>
                                                            <input
                                                                type="search"
                                                                placeholder="나이 검색"
                                                            />
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr
                                                        onClick={() =>
                                                            this.setState({
                                                                modalOpen: true,
                                                            })
                                                        }
                                                    >
                                                        <td>
                                                            <input
                                                                onClick={(e) =>
                                                                    e.stopPropagation()
                                                                }
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
                                                            <button
                                                                onClick={
                                                                    this
                                                                        .handleSearch
                                                                }
                                                            >
                                                                검색
                                                            </button>
                                                        </th>
                                                        <th></th>
                                                        <th>
                                                            <button
                                                                onClick={
                                                                    this
                                                                        .handleDelete
                                                                }
                                                            >
                                                                삭제
                                                            </button>
                                                        </th>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </JarvisWidget>
                        </article>
                    </div>
                    <div className="row"></div>
                </WidgetGrid>
            </div>
        );
    }
}
