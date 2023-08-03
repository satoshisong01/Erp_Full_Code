import React, { useEffect, useRef, useState } from "react";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-dt/js/dataTables.dataTables";
import { axiosFetch, axiosUpdate } from "api/axiosFetch";
import $ from "jquery";
import ReSearchBtn from "./function/ReSearchBtn";
import "../../css/componentCss/Code.css";
import MouseDc from "components/MouseDc";
import { Tooltip } from "react-tooltip";

const DataTable = (props) => {
    const { columns, suffixUrl, currentPage } = props;

    const [modalItem, setModalItem] = useState(""); //모달창에 넘겨주는 데이터
    const [modalOpen, setModalOpen] = useState(false); // 클릭 수정 모달창 true, false
    const [isSearching, setIsSearching] = useState(false); //로딩화면(true 일때 로딩화면)
    const [isCheck, setIsCheck] = useState(false); //체크된 데이터 확인
    const [selectedData, setSelectedData] = useState([]); //체크된 데이터 저장
    const [tableData, setTableData] = useState([]); //데이터 저장
    const dataTableRef = useRef(null); //dataTable Ref 지정

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
        console.log("⭕ check box select: ", selectedData);
    }, [selectedData]);

    useEffect(() => {
        fetchAllData(); /* 맨 처음 전체 데이터 불러오기 */
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

        await axiosUpdate(handleLoading, url, requestData);
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

    const handleModalClick = (e, item) => {
        setModalItem(item);
        setModalOpen(true);
    };

    //const [isReSearchVisible, setIsReSearchVisible] = useState(false);

    //const handleButtonClick = () => {
    //    setIsReSearchVisible(true);
    //};

    return (
        <div className="tableBody">
            <div className="widget-body">
                {isSearching && <div>Loading...</div>}
                {!isSearching && (
                    <>
                        {/*<button onClick={handleButtonClick}>
                            {console.log("눌려지긴하나")}
                            {isReSearchVisible && (*/}
                        <ReSearchBtn
                            dataTableRef={dataTableRef}
                            fetchAllData={fetchAllData}
                        />
                        {/*)}*/}
                        {/*</button>*/}
                        <div className="tableBox">
                            <table
                                ref={dataTableRef}
                                className="table table-bordered"
                                id="dataTable">
                                <thead>
                                    <tr>
                                        <th
                                            className="tableHeaderTh"
                                            style={{ width: "25px" }}>
                                            <input
                                                type="checkbox"
                                                checked={isCheck}
                                                onChange={selectAllData}
                                            />
                                        </th>
                                        {columns.map((column, index) => (
                                            <th
                                                key={index}
                                                style={{
                                                    width: column.cellWidth,
                                                }}>
                                                {column.header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData.map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedData.some(
                                                        (selectedItem) =>
                                                            selectedItem[
                                                                columns[0].col
                                                            ] ===
                                                            item[columns[0].col]
                                                    )}
                                                    onChange={(e) =>
                                                        ItemCheckboxClick(
                                                            item,
                                                            e
                                                        )
                                                    }
                                                />
                                            </td>
                                            {columns.map((column, colIndex) => (
                                                <td
                                                    onMouseEnter={
                                                        handleMouseEnter
                                                    }
                                                    onMouseLeave={
                                                        handleMouseLeave
                                                    }
                                                    className="tdStyle"
                                                    key={colIndex}
                                                    onDoubleClick={(e) => {
                                                        handleModalClick(
                                                            e,
                                                            item[column.col]
                                                        );
                                                    }}>
                                                    <MouseDc
                                                        showTooltip={
                                                            showTooltip
                                                        }
                                                    />
                                                    <Tooltip />
                                                    {item[column.col]}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
            {/*{modalOpen && }*/}
        </div>
    );
};

export default DataTable;
