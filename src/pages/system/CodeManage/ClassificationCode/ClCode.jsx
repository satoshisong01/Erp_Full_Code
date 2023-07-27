import React, { useEffect, useRef, useState } from "react";
import "../../../../smartadmin/tableHeader/ContentMain.css";
import $ from "jquery";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-dt/js/dataTables.dataTables";
import "../../../../smartadmin/css/defaultSearchBar.css";
import axios from "axios";
import "../../../../css/componentCss/Code.css";
//import "react-calendar/dist/Calendar.css";
import ClCodeModalPage from "./ClCodeModalPage";
import ClCodeUtilBtn from "./ClCodeUtilBtn";
import ClCodeTableSearchBar from "./ClCodeTableSearchBar";

const ClCode = () => {
    const dataTableRef = useRef(null); //dataTable 테이블 명시
    const [modalOpen, setModalOpen] = useState(false); // 클릭 수정 모달창
    //const [postModalOpen, setPostModalOpen] = useState(false); // 클릭 추가 모달창
    const [isSearching, setIsSearching] = useState(false);
    const [selectedData, setSelectedData] = useState([]); //체크된 데이터
    const [check, setCheck] = useState(false); //체크 확인
    //const [isCalendarVisible, setCalendarVisible] = useState(false);
    const [searchedData, setSearchedData] = useState([]);
    const [modalItem, setModalItem] = useState(""); //모달창에 넘겨주는 데이터
    const [searchKeyword, setSearchKeyword] = useState(""); //검색을 위한 키워드 저장
    const [searchCondition, setSearchCondition] = useState("0"); //검색 종류명시 int값
    const [selectedOption, setSelectedOption] = useState("option2"); //삭제된 항목 & 삭제되지 않은 항목(디폴트)

    const urlName = "clCode";

    //키워드값 받아오기
    const handleSearch = (value) => {
        setSearchKeyword(value);
        console.log(value, "키워드값 출력");
    };
    //검색 레벨 받아오기
    const handleSearchLv = (value) => {
        setSearchCondition(value);
        console.log(searchCondition, "검색 레벨받아오기");
    };
    //옵션 받아오기
    const handleOption = (value) => {
        setSelectedOption(value);
        console.log(selectedOption, "삭제 미삭제 받아오기");
    };

    //새로고침 클릭 핸들러
    const handleRefreshClick = async () => {
        console.log(urlName);
        setSearchKeyword("");
        setSearchCondition("");
        if (
            dataTableRef.current &&
            $.fn.DataTable.isDataTable(dataTableRef.current)
        ) {
            $(dataTableRef.current).DataTable().destroy();
        }
        setIsSearching(!isSearching); // 로딩 상태 활성화
        await fetchAllData(urlName);
    };

    const headers = {
        Authorization: process.env.REACT_APP_POST,
    };

    const fetchAllData = async () => {
        try {
            setIsSearching(true);
            const options = {
                headers: headers,
            };
            const requestData = {
                useAt: "Y",
            };

            console.log(searchKeyword, searchCondition);
            const response = await axios.post(
                `http://192.168.0.113:8080/api/system/code/${urlName}/listAll.do`,

                //`http://localhost:8080/api/system/code/${urlName}/listAll.do`,
                requestData,
                options
            );
            console.log(response);
            console.log(response.data.result.resultData, "데이터 결과");
            setSearchedData(response.data.result.resultData);
        } catch (error) {
            console.error("에러입니다", error);
            alert("서버와 연결할 수 없습니다");
        } finally {
            setIsSearching(false); // 로딩 상태 비활성화
        }
    };

    const handleSearchData = async () => {
        try {
            setIsSearching(true);

            const options = {
                headers: headers,
            };

            const requestData = {
                useAt: "Y",
                searchKeyword: searchKeyword,
                searchCondition: searchCondition,
            };

            const response = await axios.post(
                `http://192.168.0.113:8080/api/system/code/${urlName}/listAll.do`,
                //`http://localhost:8080/api/system/code/${urlName}/listAll.do`,
                requestData,
                options
            );
            console.log(response, "검색후값이 나올까");
            setSearchedData(response.data.result.resultData);
        } catch (error) {
            console.error("Error searching data:", error);
        } finally {
            setIsSearching(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

    useEffect(() => {
        if (!isSearching && searchedData.length > 0) {
            if ($.fn.DataTable.isDataTable(dataTableRef.current)) {
                $(dataTableRef.current).DataTable().destroy();
            }
            $(dataTableRef.current).DataTable({
                paging: true,
                searching: true,
                ordering: true,
            });
        }
    }, [searchedData, isSearching]);

    //테이블 초기화 및 기능 명시

    //체크된 아이템의 clCode 숫자만 저장
    const changeInt = selectedData.map((item) => item.clCode);

    console.log(selectedData, "체크데이터");
    console.log(changeInt, "받아오자값");
    //const keys = data.length > 0 ? Object.keys(data[0]) : [];

    // 전체 선택/해제 핸들러
    const handleClick = (e) => {
        const isChecked = e.target.checked;

        if (isChecked) {
            setCheck(true);
            setSelectedData(searchedData); // 모든 데이터를 선택된 데이터로 설정
        } else {
            setCheck(false);
            setSelectedData([]); // 선택된 데이터 초기화
        }
    };

    // 개별 아이템 체크 핸들러
    const handleItemCheck = (item, e) => {
        const isChecked = e.target.checked;

        setSelectedData((prevSelectedData) => {
            if (isChecked) {
                // 이미 선택된 데이터인지 확인 후 중복 추가 방지
                if (
                    !prevSelectedData.find(
                        (selectedItem) => selectedItem.clCode === item.clCode
                    )
                ) {
                    const sortedData = [...prevSelectedData, item].sort(
                        (a, b) => {
                            // clCode 속성을 기준으로 데이터 정렬
                            if (a.clCode < b.clCode) {
                                return -1;
                            }
                            if (a.clCode > b.clCode) {
                                return 1;
                            }
                            return 0;
                        }
                    );
                    return sortedData;
                }
            } else {
                return prevSelectedData.filter(
                    (selectedItem) => selectedItem.clCode !== item.clCode
                );
            }
            return prevSelectedData; // 체크가 풀리지 않았거나 중복 데이터인 경우 이전 상태 그대로 반환
        });
    };

    // 모달 클릭 핸들러(수정 모달창)
    const handleModalClick = (e, item) => {
        console.log("클릭이되고있습니까");
        console.log(e);
        console.log(item);
        setModalItem(item);
        setModalOpen(true);
    };

    return (
        <>
            <div className="divBodySet">
                <div id="content">
                    <div className="SearchDiv">
                        <ClCodeTableSearchBar
                            onSearch={handleSearch}
                            onSearchLv={handleSearchLv}
                            onOption={handleOption}
                            refresh={handleRefreshClick}
                            urlName={urlName}
                            searchBtn={handleSearchData}
                        />
                        <ClCodeUtilBtn
                            initialData={searchedData}
                            refresh={fetchAllData}
                            changeInt={changeInt}
                            selectedData={selectedData}
                            urlName={urlName}
                            headers={headers}
                        />
                    </div>
                    <div className="row">
                        <div className="tableBody">
                            <div className="widget-body">
                                {isSearching && <div>Loading...</div>}
                                {!isSearching && (
                                    <>
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
                                                                checked={check}
                                                                onChange={(e) =>
                                                                    handleClick(
                                                                        e
                                                                    )
                                                                }
                                                            />
                                                        </th>
                                                        {[
                                                            "분류코드",
                                                            "분류코드명",
                                                            "분류코드설명",
                                                            "작성자",
                                                            "작성일",
                                                            "수정자",
                                                            "수정일",
                                                        ].map((item, index) => (
                                                            <th key={index}>
                                                                {item}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {searchedData.map(
                                                        (item, index) => (
                                                            <tr key={index}>
                                                                <td>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedData.some(
                                                                            (
                                                                                selectedItem
                                                                            ) =>
                                                                                selectedItem.clCode ===
                                                                                item.clCode
                                                                        )}
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleItemCheck(
                                                                                item,
                                                                                e
                                                                            )
                                                                        }
                                                                    />
                                                                </td>
                                                                {[
                                                                    "clCode",
                                                                    "clCodeNm",
                                                                    "clCodeDc",
                                                                    "createIdBy",
                                                                    "createDate",
                                                                    "lastModifiedIdBy",
                                                                    "lastModifyDate",
                                                                ].map((key) => (
                                                                    <td
                                                                        className="tableWidth tdStyle"
                                                                        onClick={(
                                                                            e
                                                                        ) =>
                                                                            handleModalClick(
                                                                                e,
                                                                                item
                                                                            )
                                                                        }
                                                                        key={
                                                                            key
                                                                        }>
                                                                        {
                                                                            item[
                                                                                key
                                                                            ]
                                                                        }
                                                                    </td>
                                                                ))}
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
                </div>
            </div>
            {modalOpen && (
                <ClCodeModalPage
                    onClose={() => {
                        setModalOpen(false);
                    }}
                    refresh={fetchAllData}
                    clickData={modalItem}
                    urlName={urlName}
                    headers={headers}
                />
            )}
        </>
    );
};

export default ClCode;