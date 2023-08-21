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

const DataTable = (props) => {
    const { returnKeyWord, columns, suffixUrl, currentPage, addBtn } = props;

    const [modalItem, setModalItem] = useState(""); //모달창에 넘겨주는 데이터
    const [modalOpen, setModalOpen] = useState(false); // 클릭 수정 모달창 true, false
    const [postModalOpen, setPostModalOpen] = useState(false); // 클릭 추가 모달창
    const [isCheck, setIsCheck] = useState(false); //체크된 데이터 확인
    const [selectedData, setSelectedData] = useState([]); //체크된 데이터 저장
    const [tableData, setTableData] = useState([]); //데이터 저장
    const dataTableRef = useRef(null); //dataTable Ref 지정

    const [isLoading, setIsLoading] = useState(true); //로딩화면(true 일때 로딩화면)
    //const [uniqueValues, setUniqueValues] = useState([]); //추출한 col값 저장
    const addData = columns[columns.length - 1].listItem;
    const addListURL = columns[columns.length - 1].addListURL;

    const [saveList, setSaveList] = useState([]);

    const [showTooltip, setShowTooltip] = useState(false); //테이블 마우스 커서 설명

    //const [changeInt, setChangeInt] = useState([]);
    //const pageLength = 10;
    const currentPages = 1;

    const [pageLength, setPageLength] = useState(10);

    useEffect(() => {
        console.log("⭕ check box select: ", selectedData);
    }, [selectedData]);

    const removeInt = columns[0].col;

    const changeInt = selectedData.map((item) => item[removeInt]);

    //setChangeInt(selectedData.map((item) => item[removeInt]));

    //useEffect(() => {
    //    fetchAllData(); /* 맨 처음 전체 데이터 불러오기 */
    //}, []);

    useEffect(() => {
        const updateColumnWidth = () => {
            if (dataTableRef.current) {
                /* 컬럼의 너비를 동적으로 설정 */
                const thElements = dataTableRef.current.querySelectorAll(
                    "th:not(.tableHeaderTh)"
                );
                const elementsLength = Math.min(
                    thElements.length,
                    columns.length
                );
                for (let i = 0; i < elementsLength; i++) {
                    thElements[i].style.width = columns[i].cellWidth;
                }
            }
        };
        updateColumnWidth();
    }, [columns]);

    const selectAllData = (e) => {
        const checked = e.target.checked;
        setIsCheck(checked);

        if (checked) {
            // 현재 페이지에 표시되는 항목만 선택
            const currentPageItems = tableData.slice(
                (currentPages - 1) * pageLength,
                currentPages * pageLength
            );
            setSelectedData([...currentPageItems]);
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
        //setTableData(dummyData);
        setIsLoading(true); // 로딩 화면 활성화
        if (suffixUrl === "") return;
        const url = `/api${suffixUrl}/${currentPage}/listAll.do`;
        const requestData = { lockAt: "Y" };

        const resultData = await axiosFetch(url, requestData);
        if (resultData) {
            setTableData(resultData);
        }
        setIsLoading(false); // 로딩 화면 비활성화
    };

    /* 데이터 업데이트 */
    const updateData = async (updatedData) => {
        console.log(updatedData, "수정된값");
        if (suffixUrl === "") return;
        const url = `/api${suffixUrl}/${currentPage}/edit.do`;
        const requestData = { ...updatedData, lockAt: "Y", userAt: "Y" };

        // API 호출 등의 로직 실행
        const resultData = await axiosUpdate(url, requestData);

        //테이블 데이터 업데이트
        const updatedTableData = tableData.map((item) =>
            item[columns[0].col] === updatedData[columns[0].col]
                ? updatedData
                : item
        );
        setTableData(updatedTableData);
        if (resultData) {
            $(dataTableRef.current).DataTable().destroy();
            fetchAllData();
            alert("값을 변경했습니다💚💚");
        }
    };

    /* 데이터 삭제 */
    const deleteData = async () => {
        if (suffixUrl === "") return;
        const url = `/api${suffixUrl}/${currentPage}/removeAll.do`;
        // API 호출 등의 로직 실행
        //const resultData = await axiosDelete(url, {
        //    data: changeInt,
        //});
        const resultData = await axiosDelete(url, {
            data: changeInt,
        });

        if (resultData) {
            setSelectedData([]);
            $(dataTableRef.current).DataTable().destroy();
            fetchAllData();
            alert("삭제되었습니다🧹🧹");
        }
    };

    /* 데이터 추가하기 */
    const postData = async (postData) => {
        setIsLoading(true); // 로딩 화면 활성화
        console.log(postData, "받아온데이터");
        if (suffixUrl === "") return;
        const url = `/api${suffixUrl}/${currentPage}/add.do`;
        const requestData = { ...postData, lockAt: "Y", userAt: "Y" };

        // API 호출 등의 로직 실행
        const resultData = await axiosPost(url, requestData);
        console.log(resultData, "결과값");

        if (resultData) {
            $(dataTableRef.current).DataTable().destroy();
            fetchAllData();
            alert("추가 되었습니다!✅✅✅✅");
        }
        setIsLoading(false); // 로딩 화면 활성화
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
        fetchAllData();
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
        if (tableData.length > 0) {
            if ($.fn.DataTable.isDataTable(dataTableRef.current)) {
                $(dataTableRef.current).DataTable().destroy();
            }
            $(dataTableRef.current).DataTable({
                paging: true,
                ordering: true,
                pageLength: pageLength,
                lengthMenu: [10, 15, 30, 50, 100],
                initComplete: function () {
                    // lengthMenu에서 숫자를 선택하면 해당 숫자를 pageLength에 할당
                    $(this.api().table().container())
                        .find(".dataTables_length select")
                        .on("change", function () {
                            const selectedLength = parseInt($(this).val(), 10);
                            setPageLength(selectedLength);
                        });
                },
            });
        }
    }, [tableData]);

    const handleModalClick = (e, item) => {
        setModalItem(item);
        setModalOpen(true);
    };

    const deleteClick = () => {
        console.log("삭제버튼 클릭");
        deleteData();
    };
    console.log(addData, "값이 자꾸변경되는것같은데");

    const addClick = async () => {
        setIsLoading(true); // 로딩 화면 활성화
        if (addData) {
            let url = `/api${suffixUrl}/${addListURL}/listAll.do`;
            let requestData = { lockAt: "Y" };

            let resultData = await axiosFetch(url, requestData);
            console.log(resultData, "추가버튼시 값을불러와야함");

            console.log(addData);

            let clCodeValues = resultData.map((item) => item[addData]);
            setSaveList(clCodeValues);

            console.log(saveList, "값이안들어가?");
            setPostModalOpen(true);
        }
        setPostModalOpen(true);
        setIsLoading(false); // 로딩 화면 활성화
    };

    const excelClick = () => {};

    const copyClick = () => {
        const headers = columns.map((item) => item.header);
        const fields = columns.map((item) => item.col);

        console.log(headers, "헤더");
        console.log(fields, "필ㄷ");

        const headersString = headers.join("\t\t");
        const dataString = `${headersString}\n${selectedData
            .map((item) => fields.map((field) => item[field]).join("\t"))
            .join("\n")}`;

        navigator.clipboard.writeText(dataString);
        alert("테이블이 복사되었습니다!");
    };
    const printClick = () => {
        console.log("출력!");
    };

    useEffect(() => {
        fetchAllData(); /* 맨 처음 전체 데이터 불러오기 */
    }, []);

    //join된 테이블 값 찾아와서 띄워주기 위한 코드
    //productGroup를 변수로 변경시켜 이전 컴포넌트에서 보내줄것
    function getNestedData(obj, path) {
        const properties = path.split(".");
        let value = obj;

        for (const property of properties) {
            if (value && value.hasOwnProperty(property)) {
                value = value[property];
            } else if (
                value.productGroup &&
                value.productGroup.hasOwnProperty(property)
            ) {
                value = value.productGroup[property];
            } else {
                return null;
            }
        }

        return value;
    }

    console.log(tableData, "가져오는 데이터");

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
                    columns={columns}
                    suffixUrl={suffixUrl}
                    selectedData={selectedData}
                />
            </div>
            {isLoading ? (
                // 로딩 화면을 보여줄 JSX
                <div className="Loading">
                    <div className="spinner"></div>
                    <div> Loading... </div>
                </div>
            ) : (
                // 데이터 테이블을 보여줄 JSX
                <div className="tableBody" id="print-content">
                    <div className="widget-body">
                        <>
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
                                            {columns.map((column, index) => {
                                                if (column.notView) {
                                                    return null; // notView 값이 false인 컬럼의 제목은 출력하지 않음
                                                }
                                                return (
                                                    <th key={index}>
                                                        {column.header}
                                                    </th>
                                                );
                                            })}
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
                                                                    columns[0]
                                                                        .col
                                                                ] ===
                                                                item[
                                                                    columns[0]
                                                                        .col
                                                                ]
                                                        )}
                                                        onChange={(e) =>
                                                            ItemCheckboxClick(
                                                                item,
                                                                e
                                                            )
                                                        }
                                                    />
                                                </td>
                                                {columns.map(
                                                    (column, colIndex) => {
                                                        if (column.notView) {
                                                            return null; // notView 값이 false인 컬럼은 출력하지 않음
                                                        }

                                                        return (
                                                            <td
                                                                onMouseEnter={() =>
                                                                    setShowTooltip(
                                                                        true
                                                                    )
                                                                }
                                                                onMouseLeave={() =>
                                                                    setShowTooltip(
                                                                        false
                                                                    )
                                                                }
                                                                className="tdStyle"
                                                                key={colIndex}
                                                                onDoubleClick={(
                                                                    e
                                                                ) => {
                                                                    handleModalClick(
                                                                        e,
                                                                        item
                                                                    );
                                                                }}>
                                                                {/*<MouseDc
                                                                    showTooltip={
                                                                        showTooltip
                                                                    }
                                                                />
                                                                <Tooltip />*/}
                                                                {/* 변경된코드 */}
                                                                {getNestedData(
                                                                    item,
                                                                    column.col
                                                                ) ||
                                                                    "No data yet."}
                                                                {/* 기존코드 {item[column.col]}*/}
                                                            </td>
                                                        );
                                                    }
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    </div>
                    {modalOpen && (
                        <DataPutModal
                            onClose={() => {
                                setModalOpen(false);
                            }}
                            columns={columns}
                            initialData={modalItem}
                            updateData={updateData}
                            getNestedData={getNestedData}
                        />
                    )}
                    {postModalOpen && (
                        <DataPostModal
                            postData={postData}
                            columns={columns}
                            saveList={saveList}
                            onClose={() => {
                                setPostModalOpen(false);
                            }}
                        />
                    )}
                </div>
            )}
        </>
    );
};

export default DataTable;
