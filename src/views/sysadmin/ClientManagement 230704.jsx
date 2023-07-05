import React, { useEffect, useRef, useState } from "react";
import "../../common/tableHeader/ContentMain.css";
import $ from "jquery";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-dt/js/dataTables.dataTables";
import "./defaultSearchBar.css";
import ModalPage from "../../common/tableHeader/ModalPage";
import { BigBreadcrumbs, WidgetGrid, JarvisWidget } from "../../common";
import axios from "axios";
import "./sysadminCss/ClientManagement.css";
import "react-calendar/dist/Calendar.css";
import UtilBtn from "../utils/UtilBtn";
import Search from "../../common/tableHeader/Search";
import TableSearchBar from "./TableSearchBar";

const ClientManagement = () => {
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

    //const [searchValue, setSearchKeyword] = useState("");

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

    console.log(searchKeyword);
    console.log(searchCondition);
    console.log(selectedOption);

    //새로고침 클릭 핸들러
    const handleRefreshClick = () => {
        setSearchKeyword("");
        setSearchCondition("");
        fetchData();
    };

    useEffect(() => {
        // DataTable 인스턴스 초기화
        const dataTable = $(dataTableRef.current).DataTable({
            paging: true,
            pageLength: 20, // 한 페이지에 표시할 데이터 개수를 20으로 설정
            searching: true,
            ordering: true,
        });
        fetchData();
        return () => {
            dataTable.destroy();
        };
    }, []);

    const tdStyle = {
        width: "15vw",
        cursor: "pointer",
    };

    //체크된 아이템의 clCode 숫자만 저장
    const changeInt = selectedData.map((item) => item.clCode);

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
        console.log(e);
        console.log(item);
        setModalItem(item);
        setModalOpen(true);
    };
    const fetchData = async () => {
        try {
            const response = await axios.post(
                "http://192.168.0.113:8080/api/system/code/clCode/list.do",
                { useAt: "Y", searchKeyword, searchCondition }
            );
            console.log(response);
            console.log(response.data.result.resultData.content);
            setData(response.data.result.resultData.content);
        } catch (error) {
            console.error("에럽니다", error);
            alert("서버와 연결할 수 없습니다");
        } finally {
            setIsLoading(false);
            $(dataTableRef.current).DataTable({
                paging: true,
                searching: true,
                ordering: true,
            });
        }
    };

    return (
        <>
            <div id="content">
                <div className="row">
                    <BigBreadcrumbs
                        items={["Tables", "Normal Tables"]}
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
                    <TableSearchBar
                        fetchData={fetchData}
                        onSearch={handleSearch}
                        onSearchLv={handleSearchLv}
                        onOption={handleOption}
                        refresh={handleRefreshClick}
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
                                <UtilBtn
                                    initialData={data}
                                    refresh={fetchData}
                                    changeInt={changeInt}
                                    selectedData={selectedData}
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
                                                                <th>코드</th>
                                                                <th>코드명</th>
                                                                <th>
                                                                    코드 설명
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
                                                                            "lastModifiedIdBy",
                                                                            "createDate",
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
                <ModalPage
                    onClose={() => {
                        setModalOpen(false);
                    }}
                    refresh={fetchData}
                    clickData={modalItem}
                />
            )}
        </>
    );
};

export default ClientManagement;
