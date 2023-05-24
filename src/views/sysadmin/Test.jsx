import React from "react";
import {
    Tree,
    Menu,
    MenuItem,
    DataGrid,
    GridColumn,
    CheckBox,
    Tooltip,
    TextBox,
} from "rc-easyui";

import { WidgetGrid, JarvisWidget } from "../../common";
import ContentName from "../../common/tableHeader/ContentName";
import Header from "../../common/tableHeader/Header";
import Search from "../../common/tableHeader/Search";
import UserManagementInfo from "./UserManagementInfo copy";
import MenuUi from "./MenuUi";

const withCheckbox = (WrappedComponent) => {
    class CheckGrid extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                clicked: false,
                //data: this.props.data,
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
                                <></>
                                //<CheckBox
                                //    checked={this.isAllChecked()}
                                //    onChange={(checked) =>
                                //        this.handleAllCheck(checked)
                                //    }
                                //></CheckBox>
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

class Test extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.getData(),
            selection: null,
        };
    }
    getData() {
        return [
            {
                id: 1,
                text: "원가관리 시스템",
                children: [
                    {
                        id: 11,
                        text: "사전원가",
                        state: "closed",
                        children: [
                            {
                                id: 111,
                                text: "프로젝트 등록",
                            },
                            {
                                id: 112,
                                text: "재료비 내역",
                            },
                            {
                                id: 113,
                                text: "월별 인건비 계획",
                            },
                            {
                                id: 114,
                                text: "경비 내역(관리자)",
                            },
                            {
                                id: 115,
                                text: "경비 내역(사용자)",
                            },
                            {
                                id: 116,
                                text: "급별 단가 (경비/인건비) 내역",
                            },
                            {
                                id: 117,
                                text: "사전원가지표",
                            },
                        ],
                    },
                    {
                        id: 12,
                        text: "시스템 관리",
                        children: [
                            {
                                id: 121,
                                text: "거래처 관리",
                            },
                            {
                                id: 122,
                                text: "공통코드 관리1",
                            },
                            {
                                id: 123,
                                text: "공통코드 관리2",
                            },
                            {
                                id: 124,
                                text: "프로그램 관리",
                            },
                            {
                                id: 125,
                                text: "메뉴 관리",
                            },
                            {
                                id: 126,
                                text: "사용자 관리",
                            },
                            {
                                id: 127,
                                text: "에러로그 관리",
                            },
                        ],
                    },
                ],
            },
        ];
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
        const { selection } = this.state;
        return (
            <div>
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
                                                titleName="메뉴 관리"
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
                                                            //marginRight: "10px",
                                                            overflow: "auto",
                                                            backgroundColor:
                                                                "#ECF0F5",
                                                        }}
                                                    >
                                                        <ContentName tableTitle="메뉴 목록" />
                                                        <div
                                                            style={{
                                                                width: "19vw",
                                                                backgroundColor:
                                                                    "white",
                                                                height: "95vh",
                                                            }}
                                                        >
                                                            <Tree
                                                                data={
                                                                    this.state
                                                                        .data
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
                                                                        this
                                                                            .state
                                                                            .selection
                                                                            .text
                                                                    }
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div
                                                        style={{
                                                            width: "80%",
                                                        }}
                                                    >
                                                        <ContentName tableTitle="프로그램 설정" />
                                                        <MenuUi programColor="true" />
                                                        <CheckGrid
                                                            columnResizing
                                                            ref={(ref) =>
                                                                (this.datagrid = ref)
                                                            }
                                                            style={{
                                                                height: "70vh",
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
                                                        >
                                                            <GridColumn
                                                                field="projectName"
                                                                align="center"
                                                                title={
                                                                    <span>
                                                                        권한그룹
                                                                        코드
                                                                    </span>
                                                                }
                                                                editable
                                                                editRules={[
                                                                    "required",
                                                                ]}
                                                                editor={({
                                                                    row,
                                                                    error,
                                                                }) => (
                                                                    <Tooltip
                                                                        content={
                                                                            error
                                                                        }
                                                                        tracking
                                                                    >
                                                                        <TextBox
                                                                            value={
                                                                                row.projectName
                                                                            }
                                                                        ></TextBox>
                                                                    </Tooltip>
                                                                )}
                                                                sortable
                                                            />
                                                            <GridColumn
                                                                field="orderingDepartment"
                                                                align="center"
                                                                title="권한그룹 명"
                                                                editable
                                                                sortable
                                                            />
                                                            <GridColumn
                                                                title="권한적용"
                                                                align="center"
                                                                sortable
                                                                //filterable={false}
                                                                render={() => (
                                                                    <CheckBox
                                                                        multiple
                                                                        onChange={this.handleChange5.bind(
                                                                            this
                                                                        )}
                                                                    />
                                                                )}
                                                            />
                                                            <GridColumn
                                                                title="조회"
                                                                align="center"
                                                                sortable
                                                                //filterable={false}
                                                                render={() => (
                                                                    <CheckBox
                                                                        multiple
                                                                        onChange={this.handleChange5.bind(
                                                                            this
                                                                        )}
                                                                    />
                                                                )}
                                                            />
                                                            <GridColumn
                                                                title="저장"
                                                                align="center"
                                                                sortable
                                                                //filterable={false}
                                                                render={() => (
                                                                    <p
                                                                        className="pdf"
                                                                        style={{
                                                                            height:
                                                                                "100%",
                                                                            margin:
                                                                                "auto",
                                                                            padding:
                                                                                "0px",
                                                                        }}
                                                                    >
                                                                        Y
                                                                    </p>
                                                                )}
                                                            />
                                                            <GridColumn
                                                                title="엑셀"
                                                                align="center"
                                                                sortable
                                                                //filterable={false}
                                                                render={() => (
                                                                    <p
                                                                        className="pdf"
                                                                        style={{
                                                                            height:
                                                                                "100%",
                                                                            margin:
                                                                                "auto",
                                                                            padding:
                                                                                "0px",
                                                                        }}
                                                                    >
                                                                        Y
                                                                    </p>
                                                                )}
                                                            />
                                                            <GridColumn
                                                                title="삭제"
                                                                align="center"
                                                                sortable
                                                                //filterable={false}
                                                                render={() => (
                                                                    <p
                                                                        className="pdf"
                                                                        style={{
                                                                            height:
                                                                                "100%",
                                                                            margin:
                                                                                "auto",
                                                                            padding:
                                                                                "0px",
                                                                        }}
                                                                    >
                                                                        N
                                                                    </p>
                                                                )}
                                                            />
                                                            <GridColumn
                                                                title="FN1"
                                                                align="center"
                                                                sortable
                                                                //filterable={false}
                                                                render={() => (
                                                                    <p
                                                                        className="pdf"
                                                                        style={{
                                                                            height:
                                                                                "100%",
                                                                            margin:
                                                                                "auto",
                                                                            padding:
                                                                                "0px",
                                                                        }}
                                                                    >
                                                                        N
                                                                    </p>
                                                                )}
                                                            />
                                                            <GridColumn
                                                                title="FN2"
                                                                align="center"
                                                                sortable
                                                                //filterable={false}
                                                                render={() => (
                                                                    <p
                                                                        className="pdf"
                                                                        style={{
                                                                            height:
                                                                                "100%",
                                                                            margin:
                                                                                "auto",
                                                                            padding:
                                                                                "0px",
                                                                        }}
                                                                    >
                                                                        N
                                                                    </p>
                                                                )}
                                                            />
                                                            <GridColumn
                                                                title="FN3"
                                                                align="center"
                                                                sortable
                                                                //filterable={false}
                                                                render={() => (
                                                                    <p
                                                                        className="pdf"
                                                                        style={{
                                                                            height:
                                                                                "100%",
                                                                            margin:
                                                                                "auto",
                                                                            padding:
                                                                                "0px",
                                                                        }}
                                                                    >
                                                                        N
                                                                    </p>
                                                                )}
                                                            />
                                                            <GridColumn
                                                                title="FN4"
                                                                align="center"
                                                                sortable
                                                                //filterable={false}
                                                                render={() => (
                                                                    <p
                                                                        className="pdf"
                                                                        style={{
                                                                            height:
                                                                                "100%",
                                                                            margin:
                                                                                "auto",
                                                                            padding:
                                                                                "0px",
                                                                        }}
                                                                    >
                                                                        N
                                                                    </p>
                                                                )}
                                                            />
                                                            <GridColumn
                                                                title="FN5"
                                                                align="center"
                                                                sortable
                                                                //filterable={false}
                                                                render={() => (
                                                                    <p
                                                                        className="pdf"
                                                                        style={{
                                                                            height:
                                                                                "100%",
                                                                            margin:
                                                                                "auto",
                                                                            padding:
                                                                                "0px",
                                                                        }}
                                                                    >
                                                                        N
                                                                    </p>
                                                                )}
                                                            />
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

export default Test;
