import React, { useEffect, useRef, useState } from "react";
import "../../../common/tableHeader/ContentMain.css";
import $ from "jquery";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-dt/js/dataTables.dataTables";
import "../../sysadmin/defaultSearchBar.css";
import { BigBreadcrumbs, WidgetGrid, JarvisWidget } from "../../../common";
import axios from "axios";
import "../css/Code.css";
import "react-calendar/dist/Calendar.css";
import Search from "../../../common/tableHeader/Search";
import AuthorModalPage from "./AuthorModalPage";
import AuthorUtilBtn from "./AuthorUtilBtn";
import AuthorTableSearchBar from "./AuthorTableSearchBar";

const AuthorManage = () => {
    const dataTableRef = useRef(null); //dataTable 테이블 명시
    const [modalOpen, setModalOpen] = useState(false); // 클릭 수정 모달창
    //const [postModalOpen, setPostModalOpen] = useState(false); // 클릭 추가 모달창
    const [data, setData] = useState([]); //데이터 저장
    const [isLoading, setIsLoading] = useState(true); //로딩화면
    const [selectedData, setSelectedData] = useState([]); //체크된 데이터
    const [check, setCheck] = useState(false); //체크 확인
    //const [isCalendarVisible, setCalendarVisible] = useState(false);
    const [modalItem, setModalItem] = useState(""); //모달창에 넘겨주는 데이터
    const [searchKeyword, setSearchKeyword] = useState(""); //검색을 위한 키워드 저장
    const [searchCondition, setSearchCondition] = useState("0"); //검색 종류명시 int값
    const [selectedOption, setSelectedOption] = useState("option2"); //삭제된 항목 & 삭제되지 않은 항목(디폴트)

    const urlName = "author";

    //키워드값 받아오기
    const handleSearch = (value) => {
        setSearchKeyword(value);
    };
    //검색 레벨 받아오기
    const handleSearchLv = (value) => {
        setSearchCondition(value);
    };
    //옵션 받아오기
    const handleOption = (value) => {
        setSelectedOption(value);
    };

    //새로고침 클릭 핸들러
    const handleRefreshClick = async () => {
        console.log(urlName);
        setSearchKeyword("");
        setSearchCondition("");
        if (dataTableRef.current) {
            $(dataTableRef.current)
                .DataTable()
                .destroy();
        }
        setIsLoading(true); // 로딩 상태 활성화
        await fetchData(urlName);
    };

    const headers = {
        Authorization:
            "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJHTlIvd2VibWFzdGVyIiwiZXhwIjoxNjg4OTUyMDM2LCJpYXQiOjE2ODg5NDg0MzZ9.RFaVqad8G9-50peZ1oXGTxfganDaZpJDMfF6xW9NWEdmFlgIaop3qowUXd6meLBnAM6eumCOkaqUV7b8oKiJmA",
    };
    console.log(searchCondition, searchKeyword);

    const fetchData = async () => {
        try {
            const options = {
                headers: headers,
            };

            const response = await axios.post(
                `http://192.168.0.113:8080/api/system/code/${urlName}/listAll.do`,
                {
                    useAt: "Y",
                    searchKeyword,
                    searchCondition,
                },
                options
            );
            console.log(response);
            console.log(response.data.result.resultData.data);
            setData(response.data.result.resultData.data);
        } catch (error) {
            console.error("에럽니다", error);
            alert("서버와 연결할 수 없습니다");
        } finally {
            setIsLoading(false); // 로딩 상태 비활성화
        }
    };

    useEffect(() => {
        //테이블 기능 명시된것 불러오기 (정렬, 페이징 기능사용하기위함)
        initializeDataTable();
        fetchData();
    }, []);

    useEffect(() => {
        // 데이터 업데이트 후 DataTables 초기화
        if (data.length > 0) {
            if (dataTableRef.current) {
                $(dataTableRef.current)
                    .DataTable()
                    .destroy();
            }
            initializeDataTable();
        }
    }, []);

    useEffect(() => {
        //데이터가 있을때만 테이블 초기화
        if (!isLoading) {
            if (dataTableRef.current) {
                $(dataTableRef.current)
                    .DataTable()
                    .destroy();
            }
            initializeDataTable();
        }
    }, [isLoading]);

    //console.log(searchKeyword);
    //console.log(searchCondition);
    //console.log(selectedOption);

    //테이블 초기화 및 기능 명시
    const initializeDataTable = () => {
        if (dataTableRef.current) {
            $(dataTableRef.current).DataTable({
                paging: true,
                searching: true,
                ordering: true,
            });
        }
    };

    const tdStyle = {
        width: "15vw",
        cursor: "pointer",
    };

    //체크된 아이템의 AuthorManage 숫자만 저장
    const changeInt = selectedData.map((item) => item.AuthorManage);

    //const keys = data.length > 0 ? Object.keys(data[0]) : [];

    // 전체 선택/해제 핸들러
    const handleClick = (e) => {
        const isChecked = e.target.checked;

        if (isChecked) {
            setCheck(true);
            setSelectedData(data); // 모든 데이터를 선택된 데이터로 설정
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
                        (selectedItem) =>
                            selectedItem.AuthorManage === item.AuthorManage
                    )
                ) {
                    const sortedData = [...prevSelectedData, item].sort(
                        (a, b) => {
                            // AuthorManage 속성을 기준으로 데이터 정렬
                            if (a.AuthorManage < b.AuthorManage) {
                                return -1;
                            }
                            if (a.AuthorManage > b.AuthorManage) {
                                return 1;
                            }
                            return 0;
                        }
                    );
                    return sortedData;
                }
            } else {
                return prevSelectedData.filter(
                    (selectedItem) =>
                        selectedItem.AuthorManage !== item.AuthorManage
                );
            }
            return prevSelectedData; // 체크가 풀리지 않았거나 중복 데이터인 경우 이전 상태 그대로 반환
        });
    };

    // 모달 클릭 핸들러(수정 모달창)
    const handleModalClick = (e, item) => {
        console.log(e);
        console.log(item);
        setModalItem(item);
        setModalOpen(true);
    };

    return (
        <>
            <div id="content">
                <div className="row">
                    <BigBreadcrumbs
                        items={["시스템 관리", "권한 관리"]}
                        icon="fa fa-fw fa-table"
                        className="col-xs-12 col-sm-7 col-md-7 col-lg-4"
                    />
                </div>
                <div
                    style={{
                        backgroundColor: "#fff",
                        borderRadius: "5px",
                        marginBottom: "50px",
                        height: "12vh",
                    }}
                >
                    <Search searchTitle="프로젝트명" />
                    <AuthorTableSearchBar
                        fetchData={fetchData}
                        onSearch={handleSearch}
                        onSearchLv={handleSearchLv}
                        onOption={handleOption}
                        refresh={handleRefreshClick}
                        urlName={urlName}
                    />
                </div>
                <WidgetGrid>
                    <div className="row">
                        <article className="col-sm-12">
                            <JarvisWidget
                                id="wid-id-0"
                                editbutton={true}
                                color="blueDark"
                            >
                                <header>
                                    <span className="widget-icon">
                                        <i className="fa fa-table" />
                                    </span>
                                </header>
                                <AuthorUtilBtn
                                    initialData={data}
                                    refresh={fetchData}
                                    changeInt={changeInt}
                                    selectedData={selectedData}
                                    urlName={urlName}
                                    headers={headers}
                                />
                                <div className="tableBody">
                                    <div className="widget-body">
                                        {isLoading ? (
                                            // 로딩 화면 표시
                                            <div>Loading...</div>
                                        ) : (
                                            // 실제 데이터 표시
                                            <>
                                                <div className="tableBox">
                                                    <table
                                                        ref={dataTableRef}
                                                        className="table table-bordered"
                                                        id="dataTable"
                                                        style={{
                                                            backgroundColor:
                                                                "#fff",
                                                        }}
                                                    >
                                                        <thead>
                                                            <tr>
                                                                <th
                                                                    style={{
                                                                        display:
                                                                            "flex",
                                                                        justifyContent:
                                                                            "center",
                                                                        alignItems:
                                                                            "center",
                                                                    }}
                                                                >
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={
                                                                            check
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleClick(
                                                                                e
                                                                            )
                                                                        }
                                                                    />
                                                                    <p
                                                                        style={{
                                                                            margin: 0,
                                                                        }}
                                                                    >
                                                                        All
                                                                    </p>
                                                                </th>
                                                                <th>
                                                                    분류코드
                                                                </th>
                                                                <th>
                                                                    분류코드명
                                                                </th>
                                                                <th>
                                                                    분류코드
                                                                    설명
                                                                </th>
                                                                <th>작성자</th>
                                                                <th>작성일</th>
                                                                <th>수정자</th>
                                                                <th>수정일</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {data.map(
                                                                (
                                                                    item,
                                                                    index
                                                                ) => (
                                                                    <tr
                                                                        key={
                                                                            index
                                                                        }
                                                                    >
                                                                        <td>
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={selectedData.some(
                                                                                    (
                                                                                        selectedItem
                                                                                    ) =>
                                                                                        selectedItem.AuthorManage ===
                                                                                        item.AuthorManage
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
                                                                        ].map(
                                                                            (
                                                                                key
                                                                            ) => (
                                                                                <td
                                                                                    className="tableWidth"
                                                                                    style={
                                                                                        tdStyle
                                                                                    }
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
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        item[
                                                                                            key
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
                            </JarvisWidget>
                        </article>
                    </div>
                </WidgetGrid>
            </div>
            {modalOpen && (
                <AuthorModalPage
                    onClose={() => {
                        setModalOpen(false);
                    }}
                    refresh={fetchData}
                    clickData={modalItem}
                    urlName={urlName}
                    headers={headers}
                />
            )}
        </>
    );
};

export default AuthorManage;
