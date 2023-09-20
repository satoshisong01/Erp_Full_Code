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
import DataPutModal from "./DataPutModal";
import DataTableButton from "components/button/DataTableButton";
import DataPostModal from "./DataPostModal";
import DataPutModalRow from "./DataPutModalRow";
import DataPostModalRow from "./DataPostModalRow";

const DataTableRow = (props) => {
    const {
        returnKeyWord,
        columns,
        suffixUrl,
        currentPage,
        addBtn,
        customerList,
        updateColumns,
    } = props;

    const [modalItem, setModalItem] = useState(""); //모달창에 넘겨주는 데이터
    const [modalOpen, setModalOpen] = useState(false); // 클릭 수정 모달창 true, false
    const [postModalOpen, setPostModalOpen] = useState(false); // 클릭 추가 모달창
    const [selectedData, setSelectedData] = useState([]); //체크된 데이터 저장
    const [tableData, setTableData] = useState([]); //데이터 저장
    const dataTableRef = useRef(null); //dataTable Ref 지정

    const [errorOn, setErrorOn] = useState(false);
    const [isLoading, setIsLoading] = useState(false); //로딩화면(true 일때 로딩화면)
    //const [uniqueValues, setUniqueValues] = useState([]); //추출한 col값 저장
    const addData = columns[columns.length - 1].listItem;
    const addListURL = columns[columns.length - 1].addListURL;

    const [saveList, setSaveList] = useState([]);
    const [currentPages, setCurrentPages] = useState(1);

    const [pageLength, setPageLength] = useState(10);

    const [thisData, setThisData] = useState([{}]);

    const [selectedGupDescs, setSelectedGupDescs] = useState([]); // 선택된 gupDesc 값을 배열로 저장

    const [isChecked, setIsChecked] = useState(false); // 전체 선택 체크박스 상태
    const [bodyCheckboxes, setBodyCheckboxes] = useState([]); // 본문(body) 체크박스 상태
    //배열로 저장된 gupDesc를 포함하고있는 데이터중 gupId를 모아서 배열로 다시 저장
    const newGupId = tableData
        .filter((item) => selectedGupDescs.includes(item.gupDesc))
        .map((item) => item.gupId);

    console.log(newGupId);

    //useEffect(() => {
    //    $(dataTableRef.current).DataTable().destroy();
    //    console.log("⭕ check box select: ", selectedData);
    //    console.log("범인찾기");
    //}, [selectedData]);

    //const removeInt = columns[0].col;

    //const changeInt = selectedData.map((item) => item[removeInt]);

    //setChangeInt(selectedData.map((item) => item[removeInt]));

    useEffect(() => {
        fetchAllData(); /* 맨 처음 전체 데이터 불러오기 */
    }, [currentPages]);

    // 페이지 변경 함수
    const changePage = (newPage) => {
        setCurrentPages(newPage);
    };

    //const handleErrorCtrl = (value) => {
    //    setErrorOn(value);
    //    console.log(value, "에러온오프값");
    //    console.log(errorOn, "받은 에러값");
    //};

    const handleSendLoading = (value) => {
        setIsLoading(value);
    };

    //useEffect(() => {
    //    const updateColumnWidth = () => {
    //        if (dataTableRef.current) {
    //            /* 컬럼의 너비를 동적으로 설정 */
    //            const thElements = dataTableRef.current.querySelectorAll(
    //                "th:not(.tableHeaderTh)"
    //            );
    //            const elementsLength = Math.min(
    //                thElements.length,
    //                columns.length
    //            );
    //            for (let i = 0; i < elementsLength; i++) {
    //                thElements[i].style.width = columns[i].cellWidth;
    //            }
    //        }
    //    };
    //    updateColumnWidth();
    //}, [columns]);

    const selectAllData = (e) => {
        const checked = e.target.checked;
        setIsChecked(checked);

        // 본문(body)에 있는 체크박스들의 상태를 업데이트
        const updatedBodyCheckboxes = {};
        const currentPageItems = tableData.slice(
            (currentPages - 1) * pageLength,
            currentPages * pageLength
        );

        if (checked) {
            // 전체 선택 체크박스를 클릭할 때 모든 gupDesc 값을 배열로 저장
            const allGupDescs = uniqueBaseNames.map((baseName) => baseName);
            setSelectedGupDescs(allGupDescs);

            uniqueBaseNames.forEach((baseName) => {
                updatedBodyCheckboxes[baseName] = checked;
            });

            // 현재 페이지에 표시되는 항목만 선택하고 개별 체크박스의 상태를 업데이트
            currentPageItems.forEach((item) => {
                const baseName = item.gupDesc;
                updatedBodyCheckboxes[baseName] = true;
            });
        } else {
            setSelectedGupDescs([]); // 전체 선택 해제 시 배열 초기화
        }

        setBodyCheckboxes(updatedBodyCheckboxes);
    };

    useEffect(() => {
        setIsChecked(false);
        setBodyCheckboxes({});
    }, [tableData]); // tableData가 변경될 때마다 실행

    const ItemCheckboxClick = (e, baseName) => {
        const checked = e.target.checked;
        console.log(checked, "체크된거");
        const row = e.target.closest("tr"); // 체크박스가 속한 행(row)을 찾음
        console.log(row, "체크된거");

        if (row) {
            const gupDescValue =
                row.querySelector("td:nth-child(2)").textContent; // 기준명이 들어 있는 두 번째 열의 값을 가져옴

            if (checked) {
                setSelectedData((prevSelectedData) => [
                    ...prevSelectedData,
                    gupDescValue,
                ]);
                setSelectedGupDescs((prevSelectedGupDescs) => [
                    ...prevSelectedGupDescs,
                    gupDescValue,
                ]);
            } else {
                setSelectedData((prevSelectedData) =>
                    prevSelectedData.filter((data) => data !== gupDescValue)
                );
                setSelectedGupDescs((prevSelectedGupDescs) =>
                    prevSelectedGupDescs.filter((data) => data !== gupDescValue)
                );
            }
        }
        setBodyCheckboxes((prevBodyCheckboxes) => {
            const updatedCheckboxes = { ...prevBodyCheckboxes };
            updatedCheckboxes[baseName] = checked;
            return updatedCheckboxes;
        });
    };
    /* column click */
    const onClick = (e, item) => {
        console.log("⭕ click item: ", item);
    };

    /* 서버에서 전체 데이터 가져오기 */
    const fetchAllData = async () => {
        //setTableData(dummyData);
        //setIsLoading(true); // 로딩 화면 활성화
        try {
            if (suffixUrl === "") return;
            let url = ``;
            if (customerList) {
                url = `/api${suffixUrl}/${customerList}/listAll.do`;
            } else {
                url = `/api${suffixUrl}/listAll.do`;
            }
            const requestData = { lockAt: "Y" };
            $(dataTableRef.current).DataTable().destroy();
            const resultData = await axiosFetch(url, requestData);
            if (updateColumns) {
                console.log(resultData);
            } else if (resultData) {
                console.log(resultData);
                setTableData(resultData);
            }
            setIsLoading(false); // 로딩 화면 비활성화
        } catch {
            $(dataTableRef.current).DataTable().destroy();
        } finally {
            $(dataTableRef.current).DataTable().destroy();
        }
    };

    /* 데이터 업데이트 */
    const updateData = async (updatedData) => {
        console.log(updatedData, "수정된값");
        if (suffixUrl === "") return;
        const url = `/api${suffixUrl}/edit.do`;
        const requestData = { ...updatedData, lockAt: "Y", useAt: "Y" };

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
            fetchAllData();
            alert("값을 변경했습니다💚💚");
        }
    };

    /* 데이터 삭제 */
    const deleteData = async (value) => {
        if (suffixUrl === "") return;
        const url = `/api${suffixUrl}/removeAll.do`;
        const resultData = await axiosDelete(url, {
            data: newGupId,
        });

        if (resultData) {
            setSelectedData([]);
            fetchAllData();
            alert("삭제되었습니다🧹🧹");
        }
    };

    /* 데이터 추가하기 */
    const axiosPostPersonel = async (postData) => {
        setIsLoading(true); // 로딩 화면 활성화

        // 필수 필드가 비어있는지 확인
        const requiredFields = columns.filter((col) => col.require);
        const emptyRequiredFields = requiredFields.filter(
            (col) => !postData[col.col]
        );

        if (emptyRequiredFields.length > 0) {
            setIsLoading(false); // 로딩 화면 비활성화
            return;
        }

        console.log(postData, "받아온데이터");
        if (suffixUrl === "") return;
        const url = `/api${suffixUrl}/add.do`;
        const requestData = { ...postData, lockAt: "Y", userAt: "Y" };

        try {
            // API 호출 등의 로직 실행
            const resultData = await axiosPost(url, requestData);
            console.log(resultData, "결과값");

            if (resultData) {
                fetchAllData();
                setPostModalOpen(false);
            }
        } catch (error) {
            //setPostModalOpen(true);
            //setErrorOn(true);
            setErrorOn(true);
            console.log("에러받았다(에러시) 3번");
        } finally {
            setIsLoading(false); // 로딩 화면 비활성화
        }
    };

    /* 데이터 검색하기 */
    const searchData = async (returnKeyWord) => {
        console.log(returnKeyWord, "받아온데이터");
        if (suffixUrl === "") return;
        let url = ``;
        if (customerList) {
            url = `/api${suffixUrl}/${customerList}/listAll.do`;
        } else {
            url = `/api${suffixUrl}/totalListAll.do`;
        }
        //const url = `/api${suffixUrl}/${currentPage}/totalListAll.do`;
        const requestData = {
            useAt: returnKeyWord.radioOption,
            searchCondition: returnKeyWord.searchCondition,
            searchKeyword: "",
            ...returnKeyWord,
        };
        console.log(requestData, "여기까지찍히나?");
        // API 호출 등의 로직 실행
        try {
            const resultData = await axiosScan(url, requestData);
            console.log(resultData, "결과값을 봐야지");
            setTableData(resultData);
        } catch (error) {
            alert("날짜를 모두 입력해주세요");
            fetchAllData();
        }
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
                lengthMenu: [5, 10, 15, 30, 50, 100],
                autoWidth: true,
                initComplete: function () {
                    // lengthMenu에서 숫자를 선택하면 해당 숫자를 pageLength에 할당
                    $(this.api().table().container())
                        .find(".dataTables_length select")
                        .on("change", function () {
                            const selectedLength = parseInt($(this).val(), 10);
                            setPageLength(selectedLength);
                        });
                    $(this.api().table().container())
                        .find(".paginate_button")
                        .on("click", function () {
                            const newPage = parseInt(
                                $(this).attr("data-dt-idx"),
                                10
                            );
                            changePage(newPage + 1);
                        });
                },
            });
        }
    }, [tableData, pageLength]);

    const handleModalClick = (e, item) => {
        console.log(item);
        console.log(e);
        setModalItem(item);
        setModalOpen(true);
    };

    const deleteClick = () => {
        console.log("삭제버튼 클릭");
        deleteData();
    };

    const addClick = async () => {
        console.log("1번");
        setIsLoading(true); // 로딩 화면 활성화
        setErrorOn(false);
        //이전테이블에서 join된값을 불러오는 기능
        if (addData) {
            let url = `/api${addListURL}/listAll.do`;
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
        if (returnKeyWord) {
            searchData(returnKeyWord);
        }
        // 검색 후 5초 뒤에 setIsLoading(false)로 변경
        const loadingTimeout = setTimeout(() => {
            setIsLoading(false);
        }, 5000);

        return () => {
            // 컴포넌트가 unmount 될 때 타임아웃을 클리어하여 메모리 누수 방지
            clearTimeout(loadingTimeout);
        };
    }, [returnKeyWord]);

    const groupedData = {};
    tableData.forEach((item) => {
        const groupKey = item.guppName; // 직급으로 그룹화
        if (!groupedData[groupKey]) {
            groupedData[groupKey] = [];
        }
        groupedData[groupKey].push(item);
    });

    const uniqueBaseNames = [...new Set(tableData.map((item) => item.gupDesc))];

    const handleClick = (data) => {
        const dataString = Object.entries(data)
            .map(([key, value]) => `${key}: ${value}`)
            .join("\n");
        const newData = Object.assign({}, thisData[0], data);
        setThisData([newData]);
        setModalOpen(true);
    };

    const handleChangeCost = (value) => {
        setThisData(value);
    };

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
                                                    checked={isChecked}
                                                    onChange={selectAllData}
                                                />
                                            </th>
                                            {/* 고정된 값으로 헤더를 생성 */}
                                            <th>기준명</th>
                                            {columns
                                                .slice(1)
                                                .map((header, index) => (
                                                    <th key={index}>
                                                        {header}
                                                    </th>
                                                ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {uniqueBaseNames.map(
                                            (baseName, baseNameIndex) => (
                                                <tr key={baseNameIndex}>
                                                    <td>
                                                        <input
                                                            type="checkbox"
                                                            id={`checkBoxItem-${baseNameIndex}`}
                                                            checked={
                                                                bodyCheckboxes[
                                                                    baseName
                                                                ] || false
                                                            }
                                                            onChange={(e) =>
                                                                ItemCheckboxClick(
                                                                    e,
                                                                    baseName
                                                                )
                                                            }
                                                        />
                                                    </td>
                                                    {/* "기준명" 열에 기준명 값을 직접 출력 */}
                                                    <td>{baseName}</td>
                                                    {columns
                                                        .slice(1)
                                                        .map(
                                                            (
                                                                header,
                                                                colIndex
                                                            ) => (
                                                                <td
                                                                    key={
                                                                        colIndex
                                                                    }>
                                                                    {tableData
                                                                        .filter(
                                                                            (
                                                                                item
                                                                            ) =>
                                                                                item.gupDesc ===
                                                                                    baseName &&
                                                                                item.guppName ===
                                                                                    header
                                                                        )
                                                                        .map(
                                                                            (
                                                                                item,
                                                                                rowIndex
                                                                            ) => (
                                                                                <div
                                                                                    key={
                                                                                        rowIndex
                                                                                    }
                                                                                    onDoubleClick={() =>
                                                                                        handleClick(
                                                                                            item
                                                                                        )
                                                                                    } // 클릭 이벤트 추가
                                                                                    style={{
                                                                                        cursor: "pointer",
                                                                                    }}>
                                                                                    {/* gupPrice 값을 출력 */}
                                                                                    {item.gupPrice.toLocaleString()}
                                                                                </div>
                                                                            )
                                                                        )}
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
                    </div>
                    {modalOpen && (
                        <DataPutModalRow
                            onClose={() => {
                                setModalOpen(false);
                            }}
                            columns={columns}
                            thisData={thisData}
                            handleChangeCost={handleChangeCost}
                            initialData={modalItem}
                            updateData={updateData}
                        />
                    )}
                    {postModalOpen && (
                        <DataPostModalRow
                            postData={axiosPostPersonel}
                            columns={columns}
                            saveList={saveList}
                            fetchAllData={fetchAllData}
                            errorOn={errorOn}
                            handleSendLoading={handleSendLoading}
                            onClose={() => {
                                setPostModalOpen(false);
                            }}
                            onOpen={() => {
                                setPostModalOpen(true);
                            }}
                        />
                    )}
                </div>
            )}
        </>
    );
};
export default DataTableRow;
