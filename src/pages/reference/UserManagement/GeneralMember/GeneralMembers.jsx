import React, { useEffect, useRef, useState } from "react";
import "../../../../css/ContentMain.css";
import { Tooltip } from "react-tooltip";
import MouseDc from "components/MouseDc";
import $ from "jquery";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-dt/js/dataTables.dataTables";
import GeneralMemberModalPage from "./GeneralMemberModalPage";
import SearchList from "components/SearchList";
import DataTableButton from "components/button/DataTableButton";
import { axiosFetch } from "api/axiosFetch";
import { axiosPut } from "api/axiosPut";
import ReSearchBtn from "components/DataTable/function/ReSearchBtn";

/* 일반회원관리 */
const GeneralMembers = (props) => {
    const { columns, suffixUrl, currentPage } = props;

    const dataTableRef = useRef(null); //dataTable 테이블 명시
    const [modalOpen, setModalOpen] = useState(false); // 클릭 수정 모달창
    const [isCheck, setIsCheck] = useState(false); //체크 확인
    const [modalItem, setModalItem] = useState(""); //모달창에 넘겨주는 데이터
    const [tableData, setTableData] = useState([]); //데이터 저장
    const [isSearching, setIsSearching] = useState(false);
    const [selectedData, setSelectedData] = useState([]); //체크된 데이터
    const [showTooltip, setShowTooltip] = useState(false); //테이블 마우스 커서 설명

    const handleMouseEnter = () => {
        setShowTooltip(true);
    };

    const handleMouseLeave = () => {
        setShowTooltip(false);
    };

    const handleLoading = (value) => {
        setIsSearching(value);
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    useEffect(() => {
        const updateColumnWidth = () => {
            /* 컬럼의 너비를 동적으로 설정 */
            const thElements = dataTableRef.current.querySelectorAll(
                "th:not(.tableHeaderTh)"
            );
            const elementsLength = Math.min(thElements.length, columns.length);
            for (let i = 0; i < elementsLength; i++) {
                thElements[i].style.width = columns[i].cellWidth;
            }
        };
        updateColumnWidth();
    }, [columns]);

    const selectAllData = (e) => {
        const checked = e.target.checked;
        setIsCheck(checked);

        if (checked) {
            setSelectedData([...tableData]);
        } else {
            setSelectedData([]);
        }
    };

    const ItemCheckboxClick = (item, e) => {
        const checked = e.target.checked;
        if (checked) {
            setSelectedData((prevSelectedData) => [...prevSelectedData, item]);
        } else {
            setSelectedData((prevSelectedData) =>
                prevSelectedData.filter(
                    (data) => data[columns[0].col] !== item[columns[0].col]
                )
            );
        }
    };

    /* column click */
    const onClick = (e, item) => {
        console.log("⭕ click item: ", item);
    };

    /* 서버에서 전체 데이터 가져오기 */
    const fetchAllData = async () => {
        if (suffixUrl === "") return;
        const url = `/api${suffixUrl}/${currentPage}/listAll.do`;
        const requestData = { lockAt: "Y" };

        const resultData = await axiosFetch(handleLoading, url, requestData);
        if (resultData) {
            setTableData(resultData);
        }
    };

    /* 데이터 업데이트 */
    const updateData = async () => {
        if (suffixUrl === "") return;
        const url = `/api${suffixUrl}/${currentPage}/edit.do`;
        const requestData = { lockAt: "Y" };

        await axiosPut(handleLoading, url, requestData);
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    useEffect(() => {
        if (!isSearching && tableData.length > 0) {
            if ($.fn.DataTable.isDataTable(dataTableRef.current)) {
                $(dataTableRef.current).DataTable().destroy();
            }
            $(dataTableRef.current).DataTable({
                paging: true,
                searching: true,
                ordering: true,
            });
        }
    }, [tableData, isSearching]);

    // 모달 클릭 핸들러(수정 모달창)
    const handleModalClick = (e, item) => {
        setModalItem(item);
        setModalOpen(true);
    };

    const conditionList = [
        {
            title: "ID",
            colName: "id", //컬럼명
            type: "input",
            value: "",
            searchLevel: "1",
        },
        {
            title: "다른검색어",
            colName: "other", //컬럼명
            type: "input",
            value: "",
            searchLevel: "2",
        },
        {
            title: "이름",
            colName: "name",
            type: "select",
            option: [
                { value: "다섯글자의옵션1" },
                { value: "다섯글자의옵션2" },
            ],
            searchLevel: "3",
        },
    ];

    const excelClick = () => {
        /* 엑셀기능구현 */
    };
    const copyClick = () => {
        /* 복사기능구현 */
    };
    const printClick = () => {
        /* 프린트기능구현 */
    };
    const deleteClick = () => {
        /* 삭제기능구현 */
    };
    const addClick = () => {
        /* 추가기능구현 */
    };

    //검색 키워드값, 검색 레벨, 라디오옵션
    const searchClick = async (dataToSend) => {
        const requestData = {
            searchKeyword: dataToSend.searchKeyword,
            searchCondition: dataToSend.searchCondition,
            useAt: dataToSend.radioOption,
        };
        console.log("⭕ 검색목록: ", requestData);

        const url = `/api/baseInfrm/member/generalMember/listAll.do`;
        const resultData = await axiosFetch(url, requestData);

        setTableData(resultData);
    };

    //체크된 아이템의 uniqId 숫자만 저장
    const changeInt = selectedData.map((item) => item.uniqId);

    //const keys = data.length > 0 ? Object.keys(data[0]) : [];

    return (
        <>
            <div id="content">
                <div className="SearchDiv">
                    <SearchList
                        onSearch={searchClick}
                        conditionList={conditionList}
                    />
                    <DataTableButton
                        deleteClick={deleteClick}
                        addClick={addClick}
                    />
                </div>
                <div className="row">
                    <div className="tableBody">
                        <div className="widget-body">
                            {isSearching && <div>Loading...</div>}
                            {!isSearching && (
                                <>
                                    <ReSearchBtn
                                        dataTableRef={dataTableRef}
                                        fetchAllData={fetchAllData}
                                    />
                                    <div className="tableBox">
                                        <table
                                            ref={dataTableRef}
                                            className="table table-bordered"
                                            id="dataTable">
                                            <thead>
                                                <tr>
                                                    <th className="tableHeaderTh">
                                                        <input
                                                            type="checkbox"
                                                            checked={isCheck}
                                                            onChange={(e) =>
                                                                selectAllData(e)
                                                            }
                                                        />
                                                    </th>
                                                    {columns.map(
                                                        (column, index) => (
                                                            <th
                                                                key={index}
                                                                style={{
                                                                    width: column.cellWidth,
                                                                }}>
                                                                {column.header}
                                                            </th>
                                                        )
                                                    )}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tableData.map(
                                                    (item, index) => (
                                                        <tr key={index}>
                                                            <td>
                                                                <input
                                                                    type="checkbox"
                                                                    checked={selectedData.some(
                                                                        (
                                                                            selectedItem
                                                                        ) =>
                                                                            selectedItem[
                                                                                columns[0]
                                                                                    .col
                                                                            ] ===
                                                                            item[
                                                                                columns[0]
                                                                                    .col
                                                                            ]
                                                                    )}
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        ItemCheckboxClick(
                                                                            item,
                                                                            e
                                                                        )
                                                                    }
                                                                />
                                                            </td>
                                                            {columns.map(
                                                                (
                                                                    column,
                                                                    colIndex
                                                                ) => (
                                                                    <td
                                                                        onMouseEnter={
                                                                            handleMouseEnter
                                                                        }
                                                                        onMouseLeave={
                                                                            handleMouseLeave
                                                                        }
                                                                        className="tdStyle"
                                                                        key={
                                                                            colIndex
                                                                        }
                                                                        onDoubleClick={(
                                                                            e
                                                                        ) => {
                                                                            handleModalClick(
                                                                                e,
                                                                                item[
                                                                                    column
                                                                                        .col
                                                                                ]
                                                                            );
                                                                        }}>
                                                                        <MouseDc
                                                                            showTooltip={
                                                                                showTooltip
                                                                            }
                                                                        />
                                                                        <Tooltip />
                                                                        {
                                                                            item[
                                                                                column
                                                                                    .col
                                                                            ]
                                                                        }
                                                                    </td>
                                                                )
                                                            )}
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div>{/*<UserManagementInfo detailData={detailData} />*/}</div>
            </div>

            {/*{modalOpen && (
                <GeneralMemberModalPage
                    onClose={() => {
                        setModalOpen(false);
                    }}
                    refresh={fetchAllData}
                    clickData={modalItem}
                />
            )}*/}
        </>
    );
};

export default GeneralMembers;
