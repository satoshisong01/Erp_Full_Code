import React, { useEffect, useRef, useState } from "react";
import "../../common/tableHeader/ContentMain.css";
import $ from "jquery";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-dt/js/dataTables.dataTables";
import "./defaultSearchBar.css";
import ModalPage from "../../common/tableHeader/ModalPage";
import { BigBreadcrumbs, WidgetGrid, JarvisWidget } from "../../common";
import XLSX from "xlsx-js-style";
import axios from "axios";
import { CopyToClipboard } from "react-copy-to-clipboard";
import "./sysadminCss/ClientManagement.css";
//import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import ModalPagePost from "../../common/tableHeader/ModalPagePost";
//import UpdateValueForm from "../../common/tableHeader/EditData";
//import PersonnelInfo from "../detailComponents/PersonnelInfo";
import copyImg from "../img/copy_img.png";
import excelImg from "../img/excel_img.png";
import printImg from "../img/print_img.png";
import deleteImg from "../img/delete_img.png";
import plusImg from "../img/plus_img.png";
import refreshImg from "../img/refresh_img.png";
import UtilBtn from "../utils/UtilBtn";

const ClientManagement = () => {
    const dataTableRef = useRef(null); //dataTable 테이블 명시
    const [modalOpen, setModalOpen] = useState(false); // 클릭 수정 모달창
    const [postModalOpen, setPostModalOpen] = useState(false); // 클릭 추가 모달창
    const [data, setData] = useState([]); //데이터 저장
    const [isLoading, setIsLoading] = useState(true); //로딩화면
    const [selectedData, setSelectedData] = useState([]); //체크된 데이터
    const [check, setCheck] = useState(false); //체크 확인
    //const [selectedDate, setSelectedDate] = useState(null);
    //const [formattedDate, setFormattedDate] = useState("");
    const [isCalendarVisible, setCalendarVisible] = useState(false);
    const inputRef = useRef(null);
    const [clCode, setClCode] = useState(1); //키 값 넘버자동 1씩추가

    const [modalItem, setModalItem] = useState(""); //모달창에 넘겨주는 데이터
    const [selectedOption, setSelectedOption] = useState("option2"); //삭제된 항목 & 삭제되지 않은 항목(디폴트)

    //const [searchValue, setSearchValue] = useState("");

    const [searchKeyword, setSearchKeyword] = useState(""); //검색을 위한 키워드 저장
    const [searchCondition, setSearchCondition] = useState("0"); //검색 종류명시 int값

    //const handleInputChange = (e) => {
    //    setSearchValue(e.target.value);
    //};

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
    };

    const handleResetClick = (e) => {
        e.preventDefault();
        setSearchKeyword("");
    };

    useEffect(() => {
        // DataTable 인스턴스 초기화
        $(dataTableRef.current).DataTable({
            paging: true,
            searching: true,
            ordering: true,
        });
    }, []);

    const tdStyle = {
        width: "15vw",
        cursor: "pointer",
    };

    console.log(data);
    console.log(selectedData);

    const changeInt = selectedData.map((item) => item.clCode);
    console.log(changeInt);

    //const keys = data.length > 0 ? Object.keys(data[0]) : [];

    const handleClick = (item, e) => {
        const isChecked = e.target.checked;

        if (isChecked) {
            setCheck(true);
            setSelectedData(data); // 모든 데이터를 선택된 데이터로 설정
        } else {
            setCheck(false);
            setSelectedData([]); // 선택된 데이터 초기화
        }
        //setDetailData(item);
    };

    const handleOutsideClick = (event) => {
        if (inputRef.current && !inputRef.current.contains(event.target)) {
            setCalendarVisible(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleOutsideClick);
        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, []);

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

    const handleModalClick = (e, item) => {
        console.log(e);
        console.log(item);
        setModalItem(item);
        setModalOpen(true);
        //return <UpdateValueForm data11={item} />;
    };

    const handleModalPostClick = (e) => {
        console.log(e);
        //console.log(item);
        //setModalItem(item);
        setClCode(clCode + 1);
        setPostModalOpen(true);
    };

    const handleRefreshClick = () => {
        setSearchKeyword("");
        setSearchCondition("");
        fetchData();
    };

    //const handlePrint2 = () => {
    //    window.print();
    //};

    const handlePrint = () => {
        const table = $(dataTableRef.current).DataTable();
        table
            .rows()
            .data()
            .toArray();

        const printWindow = window.open("", "_blank");
        printWindow.document.open();
        printWindow.document.write(`
          <html>
            <head>
              <title>Print Table</title>
              <style>
                /* 원하는 스타일을 지정하세요 */
              </style>
            </head>
            <body>
              <table>
                <thead>
                  <tr>
                    안녕하세요
                  </tr>
                </thead>
                <tbody>
                  <td>
                    안녕
                  </td>
                </tbody>
              </table>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    const tableCopyBtn = () => {
        const headers = [
            "코드",
            "코드명",
            "코드 설명",
            "작성자",
            "작성일",
            "수정자",
            "수정일",
        ].join("\t");
        const dataString = `${headers}\n${data
            .map((item) =>
                [
                    "clCode",
                    "clCodeNm",
                    "clCodeDc",
                    "createIdBy",
                    "lastModifiedIdBy",
                    "createDate",
                    "lastModifyDate",
                ]
                    .map((key) => item[key])
                    .join("\t")
            )
            .join("\n")}`;

        navigator.clipboard.writeText(dataString);
        alert("테이블이 복사되었습니다!");
    };

    const handleDelete = async () => {
        try {
            //const data = changeInt.map((value) => {
            //    return { clCode: value };
            //});

            const response = await axios.delete(
                "http://192.168.0.113:8080/api/system/code/clCode/removeAll.do",
                {
                    data: changeInt,
                }
            );
            console.log(response.data);
        } catch (error) {
            console.error(error);
        } finally {
            fetchData();
            alert("데이터가 삭제 되었습니다!");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

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
            $(dataTableRef.current).DataTable();
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchData();
    };

    // STEP 1: 새로운 workbook을 만든다
    const wb = XLSX.utils.book_new();

    // STEP 2: 데이터 rows에 대한 value와 style을 지정해준다.
    const header =
        selectedData.length > 0
            ? [
                  { v: "코드", t: "s" },
                  { v: "코드명", t: "s" },
                  { v: "코드 설명", t: "s" },
                  { v: "작성자", t: "s" },
                  { v: "작성일", t: "s" },
                  { v: "수정자", t: "s" },
                  { v: "수정일", t: "s" },
              ].map((column) => ({
                  ...column,
                  s: {
                      font: { sz: "15" },
                      border: {
                          top: { color: { rgb: "000000" } },
                          bottom: { color: { rgb: "000000" } },
                          left: { color: { rgb: "000000" } },
                          right: { color: { rgb: "000000" } },
                      },
                  },
              }))
            : [];

    // STEP 3: 바디 생성
    const body = selectedData.map((item) =>
        [
            { v: item.clCode, t: "s" },
            { v: item.clCodeNm, t: "s" },
            { v: item.clCodeDc, t: "s" },
            { v: item.createIdBy, t: "s" },
            { v: item.createDate, t: "s" },
            { v: item.lastModifiedIdBy, t: "s" },
            { v: item.lastModifyDate, t: "s" },
        ].map((cell) => ({
            ...cell,
            s: { font: { color: { rgb: "188038" } } },
        }))
    );

    // STEP 3: header와 body로 worksheet를 생성한다.
    const ws = XLSX.utils.aoa_to_sheet([header, ...body]);

    // 열의 너비를 조정
    const columnWidths = header.map((col) => ({ wch: 30 }));
    ws["!cols"] = columnWidths;

    // worksheet를 workbook에 추가한다.
    XLSX.utils.book_append_sheet(wb, ws, "readme demo");

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
                <WidgetGrid>
                    <div className="row">
                        <article className="col-sm-12">
                            <JarvisWidget
                                id="wid-id-0"
                                editbutton={false}
                                color="blueDark"
                            >
                                <header>
                                    <span className="widget-icon">
                                        <i className="fa fa-table" />
                                    </span>
                                    <h2>분류 코드 관리</h2>
                                </header>
                                <div className="tableBody">
                                    <div className="widget-body">
                                        {isLoading ? (
                                            // 로딩 화면 표시
                                            <div>Loading...</div>
                                        ) : (
                                            // 실제 데이터 표시
                                            <>
                                                <div className="searchMain">
                                                    <form
                                                        name="searchForm"
                                                        id="searchForm"
                                                        role="form"
                                                        onSubmit={handleSearch}
                                                    >
                                                        <div className="boxTop">
                                                            <p className="searchTitle">
                                                                분류코드 관리
                                                            </p>
                                                            <div className="topMenuBtn">
                                                                <button
                                                                    className="btn btn-primary"
                                                                    onClick={
                                                                        handleResetClick
                                                                    }
                                                                >
                                                                    초기화
                                                                </button>
                                                                <button
                                                                    className="btn btn-primary"
                                                                    onClick={
                                                                        handleRefreshClick
                                                                    }
                                                                >
                                                                    <img
                                                                        className="btnImg"
                                                                        style={{
                                                                            margin:
                                                                                "0",
                                                                        }}
                                                                        src={
                                                                            refreshImg
                                                                        }
                                                                    />
                                                                </button>
                                                                <button
                                                                    type="submit"
                                                                    className="btn btn-primary"
                                                                >
                                                                    검색
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="searchLine" />
                                                        <div className="box">
                                                            <div className="box1">
                                                                <label
                                                                    htmlFor="searchKeyword"
                                                                    className="box_search"
                                                                >
                                                                    검색어
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    name="searchKeyword"
                                                                    id="searchKeyword"
                                                                    value={
                                                                        searchKeyword
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setSearchKeyword(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                            <div className="box2">
                                                                <label
                                                                    htmlFor="searchCondition"
                                                                    className="box_search"
                                                                >
                                                                    검색조건
                                                                </label>
                                                                <select
                                                                    id="searchCondition"
                                                                    name="searchCondition"
                                                                    className="form-control"
                                                                    value={
                                                                        searchCondition
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setSearchCondition(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                >
                                                                    <option value="0">
                                                                        전체
                                                                    </option>
                                                                    <option value="1">
                                                                        분류코드
                                                                    </option>
                                                                    <option value="2">
                                                                        분류코드명
                                                                    </option>
                                                                    <option value="코드 3">
                                                                        분류코드
                                                                        설명
                                                                    </option>
                                                                </select>
                                                                <div className="box">
                                                                    <div className="radioBtn">
                                                                        <label className="radioLabel">
                                                                            <input
                                                                                className="inputRadio"
                                                                                type="radio"
                                                                                value="option1"
                                                                                checked={
                                                                                    selectedOption ===
                                                                                    "option1"
                                                                                }
                                                                                onChange={
                                                                                    handleOptionChange
                                                                                }
                                                                            />
                                                                            삭제된
                                                                            항목
                                                                        </label>
                                                                        <label className="radioLabel">
                                                                            <input
                                                                                className="inputRadio"
                                                                                type="radio"
                                                                                value="option2"
                                                                                checked={
                                                                                    selectedOption ===
                                                                                    "option2"
                                                                                }
                                                                                onChange={
                                                                                    handleOptionChange
                                                                                }
                                                                            />
                                                                            삭제되지
                                                                            않은
                                                                            항목
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                </div>
                                                <div className="tableBox">
                                                    <div className="tableBtn">
                                                        <button
                                                            className="btn btn-primary"
                                                            id="utilBtn"
                                                            onClick={() => {
                                                                // STEP 4: Write Excel file to browser (Specify the file name in the second argument)
                                                                XLSX.writeFile(
                                                                    wb,
                                                                    "table-demo.xlsx"
                                                                );
                                                            }}
                                                        >
                                                            <img
                                                                className="btnImg"
                                                                src={excelImg}
                                                            />
                                                            CSV
                                                        </button>
                                                        <CopyToClipboard
                                                            text="Copy Table"
                                                            onCopy={
                                                                tableCopyBtn
                                                            }
                                                        >
                                                            <button
                                                                className="btn btn-primary"
                                                                id="utilBtn"
                                                            >
                                                                <img
                                                                    className="btnImg"
                                                                    src={
                                                                        copyImg
                                                                    }
                                                                />
                                                                Copy
                                                            </button>
                                                        </CopyToClipboard>
                                                        <button
                                                            className="btn btn-primary"
                                                            id="utilBtn"
                                                            onClick={
                                                                handlePrint
                                                            }
                                                        >
                                                            <img
                                                                className="btnImg"
                                                                src={printImg}
                                                            />
                                                            Print
                                                        </button>
                                                        <button
                                                            className="btn btn-primary"
                                                            id="utilBtn"
                                                            onClick={
                                                                handleDelete
                                                            }
                                                        >
                                                            <img
                                                                className="btnImg"
                                                                src={deleteImg}
                                                            />
                                                            삭제
                                                        </button>
                                                        <button
                                                            className="btn btn-primary"
                                                            id="utilBtn"
                                                            onClick={(e) =>
                                                                handleModalPostClick(
                                                                    e
                                                                )
                                                            }
                                                        >
                                                            <img
                                                                className="btnImg"
                                                                src={plusImg}
                                                            />
                                                            추가
                                                        </button>
                                                    </div>

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
                                                                                null,
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
                <UtilBtn
                    initialData={data}
                    refresh={fetchData}
                    changeInt={changeInt}
                    selectedData={selectedData}
                />
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
            {postModalOpen && (
                <ModalPagePost
                    onClose={() => {
                        setPostModalOpen(false);
                    }}
                    refresh={fetchData}
                    countClCode={clCode}
                />
            )}
        </>
    );
};

export default ClientManagement;
