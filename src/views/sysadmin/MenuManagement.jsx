import React from "react";
import { v4 as uuidv4 } from "uuid";
import "../../common/tableHeader/ContentMain.css";
import {
    DataGrid,
    GridColumn,
    CheckBox,
    Tree,
    Menu,
    MenuItem,
} from "rc-easyui";

import { Stats, BigBreadcrumbs, WidgetGrid, JarvisWidget } from "../../common";
import ContentName from "../../common/tableHeader/ContentName";
import Header from "../../common/tableHeader/Header";
import Search from "../../common/tableHeader/Search";
import UserManagementInfo from "./UserManagementInfo";

const withCheckbox = (WrappedComponent) => {
    class CheckGrid extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                clicked: false,
                data: this.getData(),
                selectedRows: [],
                selection: null,
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
        handleSelectionChange(selection) {
            this.setState({ selection: selection });
        }
        handleContextMenu({ node, originalEvent }) {
            originalEvent.preventDefault();
            this.setState({ selection: node });
            this.menu.showContextMenu(originalEvent.pageX, originalEvent.pageY);
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

export default class MenuManagement extends React.Component {
    constructor(props) {
        super(props);
        const data = this.getData();
        this.state = {
            data: data,
            dateValue: new Date(), //오늘날짜가들어감
            values: [], // 체크된값
            S_minDates: "",
            startDate: "",
            endDate: "",
            selection: null,
        };
    }

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
        this.setState({
            S_minDates: filteredDates.map((item) => this.formatDate(item)),
        });
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
    }

    handleChange = (value) => {
        this.setState({ dateValue: value }); //클릭한 값으로 변경됨

        console.log(this.state.dateValue);
    };

    handleChange2 = (value) => {
        this.setState({ endDate: value }); //클릭한 값으로 변경됨
        this.filterRange(this.state.startDate, this.state.endDate);
    };

    getData() {
        return [
            {
                id: 1,
                text: "My Documents",
                children: [
                    {
                        id: 11,
                        text: "Photos",
                        state: "closed",
                        children: [
                            {
                                id: 111,
                                text: "Friend",
                            },
                            {
                                id: 112,
                                text: "Wife",
                            },
                            {
                                id: 113,
                                text: "Company",
                            },
                        ],
                    },
                    {
                        id: 12,
                        text: "Program Files",
                        children: [
                            {
                                id: 121,
                                text: "Intel",
                            },
                            {
                                id: 122,
                                text: "Java",
                            },
                            {
                                id: 123,
                                text: "Microsoft Office",
                            },
                            {
                                id: 124,
                                text: "Games",
                            },
                        ],
                    },
                    {
                        id: 13,
                        text: "index.html",
                    },
                    {
                        id: 14,
                        text: "about.html",
                    },
                    {
                        id: 15,
                        text: "welcome.html",
                    },
                ],
            },
        ];
    }
    render() {
        const { selection } = this.state;
        return (
            <div id="content">
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
                                                titleName="사용자 관리"
                                            />
                                            <Search searchTitle="검색" />
                                            <CheckGrid>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            marginRight: "10px",
                                                            overflow: "auto",
                                                        }}
                                                    >
                                                        <ContentName tableTitle="메뉴 목록" />
                                                        <Tree
                                                            data={
                                                                this.state.data
                                                            }
                                                            selection={
                                                                this.state
                                                                    .selection
                                                            }
                                                            onSelectionChange={this.handleSelectionChange.bind(
                                                                this
                                                            )}
                                                            onNodeContextMenu={this.handleContextMenu.bind(
                                                                this
                                                            )}
                                                        />
                                                        <Menu
                                                            ref={(ref) =>
                                                                (this.menu = ref)
                                                            }
                                                        >
                                                            <MenuItem text="Append"></MenuItem>
                                                            <MenuItem text="Remove"></MenuItem>
                                                            <MenuItem text="Expand"></MenuItem>
                                                            <MenuItem text="Collapse"></MenuItem>
                                                        </Menu>
                                                        {this.state
                                                            .selection && (
                                                            <p>
                                                                Selected:{" "}
                                                                {
                                                                    this.state
                                                                        .selection
                                                                        .text
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div
                                                        style={{
                                                            width: "51%",
                                                        }}
                                                    >
                                                        <ContentName tableTitle="사용자 정보" />
                                                        <UserManagementInfo />
                                                        <CheckGrid
                                                            columnResizing
                                                            ref={(ref) =>
                                                                (this.datagrid = ref)
                                                            }
                                                            style={{
                                                                height:
                                                                    "36.5vh",
                                                            }}
                                                            selection={
                                                                this.state
                                                                    .selection
                                                            }
                                                            onSelectionChange={(
                                                                selection
                                                            ) =>
                                                                this.setState({
                                                                    selection,
                                                                })
                                                            }
                                                            data={
                                                                this.state.data
                                                            }
                                                            clickToEdit
                                                            fitColumns={true}
                                                            editMode="row"
                                                            onEditEnd={this.handleRowEditEnd.bind(
                                                                this
                                                            )}
                                                            onEditCancel={this.handleRowEditCancel.bind(
                                                                this
                                                            )}
                                                        >
                                                            <GridColumn
                                                                width="10vw"
                                                                field="orderingDepartment"
                                                                align="center"
                                                                title="역할 코드"
                                                                sortable
                                                            />
                                                            <GridColumn
                                                                width="10vw"
                                                                field="salesDepartment"
                                                                align="center"
                                                                title="역할 명"
                                                                sortable
                                                            />
                                                            <GridColumn width="20vw" />
                                                        </CheckGrid>
                                                    </div>
                                                </div>
                                            </CheckGrid>
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
