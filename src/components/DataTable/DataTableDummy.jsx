import React, { useEffect, useRef, useState } from "react";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-dt/js/dataTables.dataTables";
import {
    axiosDelete,
    axiosFetch,
    axiosPost,
    axiosScan,
    axiosUpdate,
} from "api/axiosFetch";
import $ from "jquery";
import "../../css/componentCss/Code.css";
import MouseDc from "components/MouseDc";
import { Tooltip } from "react-tooltip";
import DataPutModal from "./DataPutModal";
import DataTableButton from "components/button/DataTableButton";
import DataPostModal from "./DataPostModal";

const DataTableDummy = (props) => {
    const {
        returnKeyWord,
        columns,
        suffixUrl,
        currentPage,
        addBtn,
        dummyData,
    } = props;

    const [modalItem, setModalItem] = useState(""); //모달창에 넘겨주는 데이터
    const [modalOpen, setModalOpen] = useState(false); // 클릭 수정 모달창 true, false
    const [postModalOpen, setPostModalOpen] = useState(false); // 클릭 추가 모달창
    const [isSearching, setIsSearching] = useState(false); //로딩화면(true 일때 로딩화면)
    const [isCheck, setIsCheck] = useState(false); //체크된 데이터 확인
    const [selectedData, setSelectedData] = useState([]); //체크된 데이터 저장
    const [tableData, setTableData] = useState([]); //데이터 저장
    const dataTableRef = useRef(null); //dataTable Ref 지정

    const [showTooltip, setShowTooltip] = useState(false); //테이블 마우스 커서 설명

    console.log(returnKeyWord, "잘 넘겨받았느냐");

    //const handleMouseEnter = () => {
    //    setShowTooltip(true);
    //};

    //const handleMouseLeave = () => {
    //    setShowTooltip(false);
    //};

    //const handleLoading = (value) => {
    //    setIsSearching(value);
    //};

    useEffect(() => {
        console.log("⭕ check box select: ", selectedData);
    }, [selectedData]);

    const removeInt = columns[0].col;

    const changeInt = selectedData.map((item) => item[removeInt]);

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
        setTableData(dummyData);

        // if (suffixUrl === "") return;
        // const url = `/api${suffixUrl}/${currentPage}/listAll.do`;
        // const requestData = { lockAt: "Y" };

        // const resultData = await axiosFetch(url, requestData);
        // if (resultData) {

        //     setTableData(resultData);
        // }
    };

    /* 데이터 업데이트 */
    const updateData = async (updatedData) => {
        console.log(updatedData, "수정된값");
        if (suffixUrl === "") return;
        const url = `/api${suffixUrl}/${currentPage}/edit.do`;
        const requestData = { ...updatedData, lockAt: "Y", userAt: "Y" };

        // API 호출 등의 로직 실행
        await axiosUpdate(url, requestData);

        //테이블 데이터 업데이트
        const updatedTableData = tableData.map((item) =>
            item[columns[0].col] === updatedData[columns[0].col]
                ? updatedData
                : item
        );
        setTableData(updatedTableData);
    };

    /* 데이터 삭제 */
    const deleteData = async () => {
        if (suffixUrl === "") return;
        const url = `/api${suffixUrl}/${currentPage}/removeAll.do`;
        // API 호출 등의 로직 실행
        const resultData = await axiosDelete(url, {
            data: changeInt,
        });
        if (resultData) {
            setSelectedData([]);
            fetchAllData();
        }
    };

    /* 데이터 추가하기 */
    const postData = async (postData) => {
        console.log(postData, "받아온데이터");
        if (suffixUrl === "") return;
        const url = `/api${suffixUrl}/${currentPage}/add.do`;
        const requestData = { ...postData, lockAt: "Y", userAt: "Y" };

        // API 호출 등의 로직 실행
        const resultData = await axiosPost(url, requestData);
        if (resultData) {
            fetchAllData();
        }
    };

    /* 데이터 검색하기 */
    const searchData = async (returnKeyWord) => {
        console.log(returnKeyWord, "받아온데이터");

        const sendData = Object.values(returnKeyWord.searchKeyword).map(
            (value) => value
        );
        console.log(sendData, "뽑아둔 데이터");

        const separatedData = sendData.map((item) => `${item}`).join(", ");
        console.log(separatedData, "나눈 데이터");
        console.log(typeof separatedData);

        if (suffixUrl === "") return;
        const url = `/api${suffixUrl}/${currentPage}/listAll.do`;
        const requestData = {
            useAt: returnKeyWord.radioOption,
            searchKeyword: separatedData,
            searchCondition: returnKeyWord.searchCondition,
        };
        console.log(requestData, "여기까지찍히나?");
        // API 호출 등의 로직 실행
        const resultData = await axiosScan(url, requestData);
        console.log(resultData, "결과값을 봐야지");
        //if (resultData) {
        //    fetchAllData();
        //}
    };

    useEffect(() => {
        if (returnKeyWord) {
            searchData(returnKeyWord);
        }
    }, [returnKeyWord]);

    useEffect(() => {
        if (!isSearching && tableData.length > 0) {
            if ($.fn.DataTable.isDataTable(dataTableRef.current)) {
                $(dataTableRef.current).DataTable().destroy();
            }
            $(dataTableRef.current).DataTable({
                paging: true,
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

    const deleteClick = () => {
        console.log("삭제버튼 클릭");
        deleteData();
    };

    const addClick = () => {
        setPostModalOpen(true);
    };

    const excelClick = () => {};
    const copyClick = () => {};
    const printClick = () => {};

    useEffect(() => {
        fetchAllData(); /* 맨 처음 전체 데이터 불러오기 */
    }, []);

    return (
        <>
            <div className="buttonBody">
                <DataTableButton
                    deleteClick={deleteClick}
                    excelClick={excelClick}
                    copyClick={copyClick}
                    addClick={addClick}
                    printClick={printClick}
                    dataTableRef={dataTableRef}
                    fetchAllData={fetchAllData}
                    addBtn={addBtn}
                />
            </div>
            <div className="tableBody">
                <div className="widget-body">
                    {/*{isSearching && (
                        <div>
                            Loading...
                            {setTimeout(() => {
                                setIsSearching(false);
                            }, 1000)}{" "}*/}
                    {/* 1초 후에 isSearching 값을 false로 변경 */}
                    {/*</div>*/}
                    {/*)}*/}
                    {/*{!isSearching && (*/}
                    <>
                        {/*<button onClick={handleButtonClick}>
                            {console.log("눌려지긴하나")}
                            {isReSearchVisible && (*/}
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
                                            id="checkBoxAll">
                                            <input
                                                id="thCheckBox"
                                                type="checkbox"
                                                checked={isCheck}
                                                onChange={selectAllData}
                                            />
                                        </th>
                                        {columns.map((column, index) => (
                                            <th key={index}>{column.header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableData.map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    id="checkBoxItem"
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
                                                    onMouseEnter={() =>
                                                        setShowTooltip(true)
                                                    }
                                                    onMouseLeave={() =>
                                                        setShowTooltip(false)
                                                    }
                                                    className="tdStyle"
                                                    key={colIndex}
                                                    onDoubleClick={(e) => {
                                                        handleModalClick(
                                                            e,
                                                            item
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
                    {/*)}*/}
                </div>
                {modalOpen && (
                    <DataPutModal
                        onClose={() => {
                            setModalOpen(false);
                        }}
                        columns={columns}
                        initialData={modalItem}
                        updateData={updateData}
                    />
                )}
                {postModalOpen && (
                    <DataPostModal
                        postData={postData}
                        columns={columns}
                        onClose={() => {
                            setPostModalOpen(false);
                        }}
                    />
                )}
            </div>
        </>
    );
};

export default DataTableDummy;
