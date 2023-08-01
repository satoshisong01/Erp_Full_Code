import React, { useState, useRef, useEffect } from "react";
//import  ReactDOM from "react-dom/client";
import "../../../css/componentCss/PersonnelPopup.css";
import $ from "jquery";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-dt/js/dataTables.dataTables";

import ExcutionCostUtilBtn from "./ExcutionCostUtilBtn";
//import PopupTesting from "./PopupTesting";
//import PopupWindow from "./PopupTesting";

const ExcutionCostsDoc = () => {
    const dataTableRef3 = useRef(null); //dataTable 테이블 명시
    const dataTableRef = useRef(null); //dataTable 테이블 명시
    const dataTableRef2 = useRef(null); //dataTable 테이블 명시
    const [data, setData] = useState([
        { id: 1, name: "John", age: 25 },
        { id: 2, name: "Jane", age: 30 },
        { id: 3, name: "Bob", age: 35 },
    ]);

    useEffect(() => {
        if ($.fn.DataTable.isDataTable(dataTableRef.current)) {
            $(dataTableRef.current).DataTable().destroy();
        }
        if ($.fn.DataTable.isDataTable(dataTableRef2.current)) {
            $(dataTableRef2.current).DataTable().destroy();
        }
        if ($.fn.DataTable.isDataTable(dataTableRef3.current)) {
            $(dataTableRef3.current).DataTable().destroy();
        }
        $(dataTableRef.current).DataTable({
            paging: true,
            searching: true,
            ordering: true,
        });
        $(dataTableRef2.current).DataTable({
            paging: true,
            searching: true,
            ordering: true,
        });
        $(dataTableRef3.current).DataTable({
            paging: true,
            searching: true,
            ordering: true,
        });
    });

    const [isClicked, setIsClicked] = useState(false);
    const [isClicked2, setIsClicked2] = useState(false);
    const [isClicked3, setIsClicked3] = useState(false);
    const [isClicked4, setIsClicked4] = useState(false);
    const [isClicked5, setIsClicked5] = useState(false);

    const [selectedData, setSelectedData] = useState([]); //체크된 데이터
    const [check, setCheck] = useState(false); //체크 확인
    const [searchedData, setSearchedData] = useState([]);

    const initialTableRows = [
        {
            id: 1,
            품목그룹명: "PANEL",
            연월: "2023/05",
            M_M계: "333",
            인건비계: "1515", // 임시로 데이터를 넣어주세요
            임원: "3", // 임시로 데이터를 넣어주세요
            특급기술사: "1", // 임시로 데이터를 넣어주세요
            고급기술사: "1", // 임시로 데이터를 넣어주세요
            중급기술사: "2", // 임시로 데이터를 넣어주세요
            초급기술사: "1", // 임시로 데이터를 넣어주세요
            중급기능사: "2", // 임시로 데이터를 넣어주세요
            고급기능사: "1", // 임시로 데이터를 넣어주세요
            부장: "99", // 임시로 데이터를 넣어주세요
            차장: "20", // 임시로 데이터를 넣어주세요
            과장: "15", // 임시로 데이터를 넣어주세요
            대리: "12", // 임시로 데이터를 넣어주세요
            주임: "10", // 임시로 데이터를 넣어주세요
            사원: "22", // 임시로 데이터를 넣어주세요
        },
        {
            id: 2,
            품목그룹명: "개별외주비",
            연월: "2023/05",
            M_M계: "444", // 임시로 데이터를 넣어주세요
            인건비계: "8989", // 임시로 데이터를 넣어주세요
            임원: "3", // 임시로 데이터를 넣어주세요
            특급기술사: "1", // 임시로 데이터를 넣어주세요
            고급기술사: "1", // 임시로 데이터를 넣어주세요
            중급기술사: "2", // 임시로 데이터를 넣어주세요
            초급기술사: "1", // 임시로 데이터를 넣어주세요
            중급기능사: "2", // 임시로 데이터를 넣어주세요
            고급기능사: "1", // 임시로 데이터를 넣어주세요
            부장: "99", // 임시로 데이터를 넣어주세요
            차장: "20", // 임시로 데이터를 넣어주세요
            과장: "15", // 임시로 데이터를 넣어주세요
            대리: "12", // 임시로 데이터를 넣어주세요
            주임: "10", // 임시로 데이터를 넣어주세요
            사원: "22", // 임시로 데이터를 넣어주세요
            // 나머지 데이터들도 추가하세요...
        },
    ];

    const [tableRows, setTableRows] = useState(initialTableRows);

    //체크된 아이템의 uniqId 숫자만 저장
    const changeInt = selectedData.map((item) => item.uniqId);

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
                        (selectedItem) => selectedItem.uniqId === item.uniqId
                    )
                ) {
                    const sortedData = [...prevSelectedData, item].sort(
                        (a, b) => {
                            // uniqId 속성을 기준으로 데이터 정렬
                            if (a.uniqId < b.uniqId) {
                                return -1;
                            }
                            if (a.uniqId > b.uniqId) {
                                return 1;
                            }
                            return 0;
                        }
                    );
                    return sortedData;
                }
            } else {
                return prevSelectedData.filter(
                    (selectedItem) => selectedItem.uniqId !== item.uniqId
                );
            }
            return prevSelectedData; // 체크가 풀리지 않았거나 중복 데이터인 경우 이전 상태 그대로 반환
        });
    };

    // "추가" 버튼을 클릭했을 때 실행될 함수
    const handleAddRow = () => {
        // 새로운 행을 만들고, 현재의 tableRows 상태에 추가합니다.
        const newRow = {
            id: tableRows.length + 1,
            품목그룹명: "", // 여기에 새로운 열의 초기 값들을 지정하세요...
            연월: "", // 예시로 빈 문자열로 초기화 했습니다.
            M_M계: "", // 다른 속성들도 추가하세요...
            인건비계: "", // 임시로 데이터를 넣어주세요
            임원: "", // 임시로 데이터를 넣어주세요
            특급기술사: "", // 임시로 데이터를 넣어주세요
            고급기술사: "", // 임시로 데이터를 넣어주세요
            중급기술사: "", // 임시로 데이터를 넣어주세요
            초급기술사: "", // 임시로 데이터를 넣어주세요
            중급기능사: "", // 임시로 데이터를 넣어주세요
            고급기능사: "", // 임시로 데이터를 넣어주세요
            부장: "", // 임시로 데이터를 넣어주세요
            차장: "", // 임시로 데이터를 넣어주세요
            과장: "", // 임시로 데이터를 넣어주세요
            대리: "", // 임시로 데이터를 넣어주세요
            주임: "", // 임시로 데이터를 넣어주세요
            사원: "", // 임시로 데이터를 넣어주세요
        };
        setTableRows([...tableRows, newRow]);
    };
    //const handleClick = () => {
    //    setIsClicked((prevState) => !prevState);
    //};
    //const handleClick2 = () => {
    //    setIsClicked2((prevState) => !prevState);
    //};
    //const handleClick3 = () => {
    //    setIsClicked3((prevState) => !prevState);
    //};
    //const handleClick4 = () => {
    //    setIsClicked4((prevState) => !prevState);
    //};
    //const handleClick5 = () => {
    //    setIsClicked5((prevState) => !prevState);
    //};

    return (
        <div className="popUpHomeBody">
            <div className="TableBucket">
                <table className="tableMain">
                    <div className="tbodyDiv">
                        <h3 className="contentTitle">1.손익계산서</h3>
                    </div>
                    <tbody className="tableBody">
                        <tr className="tableTr">
                            <td className="table4-3">구분</td>
                            <td className="table4-3">전체</td>
                            <td className="table4-3">자체용역</td>
                            <td className="tableRedPercent">%</td>
                            <td className="table4-3">외주</td>
                            <td className="tableRedPercent">%</td>
                            <td className="table4-3">H/W 및 S/W</td>
                            <td className="tableRedPercent">%</td>
                            <td className="table4-3">판관비</td>
                            <td className="table4-3">NEGO</td>
                        </tr>
                        <tr className="tableTr">
                            <td className="table4-3">수주액</td>
                            <td className="table4-3White">560,000,000</td>
                            <td className="table4-3White">0</td>
                            <td className="tableRedPercentW"></td>
                            <td className="table4-3White"></td>
                            <td className="tableRedPercentW"></td>
                            <td className="table4-3White">560,000,000</td>
                            <td className="tableRedPercentW"></td>
                            <td className="table4-3White"></td>
                            <td className="table4-3White"></td>
                        </tr>
                        <tr className="tableTr">
                            <td className="table4-3">재료비</td>
                            <td className="table4-3White">365,654,110</td>
                            <td className="table4-3White"></td>
                            <td className="tableRedPercentW"></td>
                            <td className="table4-3White"></td>
                            <td className="tableRedPercentW"></td>
                            <td className="table4-3White">365,654,110</td>
                            <td className="tableRedPercentW"></td>
                            <td className="table4-3White"></td>
                            <td className="table4-3White"></td>
                        </tr>
                        <tr className="tableTr">
                            <td className="table4-3">인건비</td>
                            <td className="table4-3White">2,390,000</td>
                            <td className="table4-3White">2,390,000</td>
                            <td className="tableRedPercentW"></td>
                            <td className="table4-3White">0</td>
                            <td className="tableRedPercentW"></td>
                            <td className="table4-3White"></td>
                            <td className="tableRedPercentW"></td>
                            <td className="table4-3White"></td>
                            <td className="table4-3White"></td>
                        </tr>
                        <tr className="tableTr">
                            <td className="table4-3">경 비</td>
                            <td className="table4-3White">2,390,000</td>
                            <td className="table4-3White">2,390,000</td>
                            <td className="tableRedPercentW"></td>
                            <td className="table4-3White"></td>
                            <td className="tableRedPercentW"></td>
                            <td className="table4-3White"></td>
                            <td className="tableRedPercentW"></td>
                            <td className="table4-3White"></td>
                            <td className="table4-3White"></td>
                        </tr>
                        <tr className="tableTr">
                            <td className="table4-3">직접원가</td>
                            <td className="table4-3">370,769,510</td>
                            <td className="table4-3">5,115,400</td>
                            <td className="tableRedPercent"></td>
                            <td className="table4-3">0</td>
                            <td className="tableRedPercent"></td>
                            <td className="table4-3">365,654,110</td>
                            <td className="tableRedPercent"></td>
                            <td className="table4-3">0</td>
                            <td className="table4-3">0</td>
                        </tr>
                        <tr className="tableTr">
                            <td className="table4-3White">실한계이익</td>
                            <td className="table4-3White">189,230,490</td>
                            <td className="table4-3White">-5,115,400</td>
                            <td className="tableRedPercentW"></td>
                            <td className="table4-3White">0</td>
                            <td className="tableRedPercentW"></td>
                            <td className="table4-3White">194,345,890</td>
                            <td className="tableRedPercentW"></td>
                            <td className="table4-3White">0</td>
                            <td className="table4-3White">0</td>
                        </tr>
                        <tr className="tableTr">
                            <td className="table4-3White">(실한계이익율)</td>
                            <td className="table4-3White">33.8%</td>
                            <td className="table4-3White">-%</td>
                            <td className="tableRedPercentW"></td>
                            <td className="table4-3White">-%</td>
                            <td className="tableRedPercentW"></td>
                            <td className="table4-3White">34.7%</td>
                            <td className="tableRedPercentW"></td>
                            <td className="table4-3White">-%</td>
                            <td className="table4-3White">-%</td>
                        </tr>
                        <tr className="tableTr">
                            <td className="table4-3">사내재료비</td>
                            <td className="table4-3">0</td>
                            <td className="table4-3"></td>
                            <td className="tableRedPercent"></td>
                            <td className="table4-3"></td>
                            <td className="tableRedPercent"></td>
                            <td className="table4-3"></td>
                            <td className="tableRedPercent"></td>
                            <td className="table4-3">0</td>
                            <td className="table4-3"></td>
                        </tr>
                        <tr className="tableTr">
                            <td className="table4-3White">한계이익</td>
                            <td className="table4-3White">189,230,490</td>
                            <td className="table4-3White">-5,115,400</td>
                            <td className="tableRedPercentW"></td>
                            <td className="table4-3White">0</td>
                            <td className="tableRedPercentW"></td>
                            <td className="table4-3White">194,345,890</td>
                            <td className="tableRedPercentW"></td>
                            <td className="table4-3White">0</td>
                            <td className="table4-3White">0</td>
                        </tr>
                        <tr className="tableTr">
                            <td className="table4-3White">(한계이익율)</td>
                            <td className="table4-3White">33.8%</td>
                            <td className="table4-3White">-%</td>
                            <td className="tableRedPercentW"></td>
                            <td className="table4-3White">-%</td>
                            <td className="tableRedPercentW"></td>
                            <td className="table4-3White">34.7%</td>
                            <td className="tableRedPercentW"></td>
                            <td className="table4-3White">-%</td>
                            <td className="table4-3White">-%</td>
                        </tr>
                        <tr className="tableTr">
                            <td className="table4-3">간접원가</td>
                            <td className="table4-3">73,608,822</td>
                            <td className="table4-3">478,000</td>
                            <td className="tableRedPercent">20%</td>
                            <td className="table4-3">0</td>
                            <td className="tableRedPercent">20%</td>
                            <td className="table4-3">73,130,822</td>
                            <td className="tableRedPercent">20%</td>
                            <td className="table4-3"></td>
                            <td className="table4-3"></td>
                        </tr>
                        <tr className="tableTr">
                            <td className="table4-3White">매출이익</td>
                            <td className="table4-3White">115,621,668</td>
                            <td className="table4-3White">-5,593,400</td>
                            <td className="tableRedPercentW"></td>
                            <td className="table4-3White">0</td>
                            <td className="tableRedPercentW"></td>
                            <td className="table4-3White">121,215,068</td>
                            <td className="tableRedPercentW"></td>
                            <td className="table4-3White">0</td>
                            <td className="table4-3White">0</td>
                        </tr>
                        <tr className="tableTr">
                            <td className="table4-3White">(매출이익율)</td>
                            <td className="table4-3White">20.6%</td>
                            <td className="table4-3White">-%</td>
                            <td className="tableRedPercentW"></td>
                            <td className="table4-3White">-%</td>
                            <td className="tableRedPercentW"></td>
                            <td className="table4-3White">21.6%</td>
                            <td className="tableRedPercentW"></td>
                            <td className="table4-3White">-%</td>
                            <td className="table4-3White">-%</td>
                        </tr>
                        <tr className="tableTr">
                            <td className="table4-3">판 매 비</td>
                            <td className="table4-3">119,500</td>
                            <td className="table4-3">119,500</td>
                            <td className="tableRedPercent">5%</td>
                            <td className="table4-3"></td>
                            <td className="tableRedPercent">5%</td>
                            <td className="table4-3"></td>
                            <td className="tableRedPercent">5%</td>
                            <td className="table4-3"></td>
                            <td className="table4-3"></td>
                        </tr>
                        <tr className="tableTr">
                            <td className="table4-3">사내본사비</td>
                            <td className="table4-3">191,200</td>
                            <td className="table4-3">191,200</td>
                            <td className="tableRedPercent">8%</td>
                            <td className="table4-3"></td>
                            <td className="tableRedPercent">8%</td>
                            <td className="table4-3"></td>
                            <td className="tableRedPercent">8%</td>
                            <td className="table4-3"></td>
                            <td className="table4-3"></td>
                        </tr>
                        <tr className="tableTr">
                            <td className="table4-3">일반관리비</td>
                            <td className="table4-3">29,443,529</td>
                            <td className="table4-3">191,200</td>
                            <td className="tableRedPercent">8%</td>
                            <td className="table4-3">0</td>
                            <td className="tableRedPercent">8%</td>
                            <td className="table4-3">29,252,329</td>
                            <td className="tableRedPercent">8%</td>
                            <td className="table4-3"></td>
                            <td className="table4-3"></td>
                        </tr>
                        <tr className="tableTr">
                            <td className="table4-3White">영업이익</td>
                            <td className="table4-3White">85,867,439</td>
                            <td className="table4-3White">-6,095,300</td>
                            <td className="tableRedPercentW"></td>
                            <td className="table4-3White">0</td>
                            <td className="tableRedPercentW"></td>
                            <td className="table4-3White">91,962,739</td>
                            <td className="tableRedPercentW"></td>
                            <td className="table4-3White">0</td>
                            <td className="table4-3White">0</td>
                        </tr>
                        <tr className="tableTr">
                            <td className="table4-3White">(영업이익율)</td>
                            <td className="table4-3White">15.3%</td>
                            <td className="table4-3White">-%</td>
                            <td className="tableRedPercentW"></td>
                            <td className="table4-3White">-%</td>
                            <td className="tableRedPercentW"></td>
                            <td className="table4-3White">16.4%</td>
                            <td className="tableRedPercentW"></td>
                            <td className="table4-3White">-%</td>
                            <td className="table4-3White">-%</td>
                        </tr>
                        <tr className="tableTr">
                            <td className="table4-3">영업외수지</td>
                            <td className="table4-3">71,700</td>
                            <td className="table4-3">71,700</td>
                            <td className="tableRedPercent">3%</td>
                            <td className="table4-3"></td>
                            <td className="tableRedPercent"></td>
                            <td className="table4-3"></td>
                            <td className="tableRedPercent"></td>
                            <td className="table4-3"></td>
                            <td className="table4-3"></td>
                        </tr>
                        <tr className="tableTr">
                            <td className="table4-3White">경상이익</td>
                            <td className="table4-3White">85,795,738</td>
                            <td className="table4-3White">-6,167,700</td>
                            <td className="tableRedPercentW"></td>
                            <td className="table4-3White">0</td>
                            <td className="tableRedPercentW"></td>
                            <td className="table4-3White">91,962,739</td>
                            <td className="tableRedPercentW"></td>
                            <td className="table4-3White">0</td>
                            <td className="table4-3White">0</td>
                        </tr>
                        <tr className="tableTr">
                            <td className="table4-3White">(경상이익율)</td>
                            <td className="table4-3White">15.3%</td>
                            <td className="table4-3White">-%</td>
                            <td className="tableRedPercentW"></td>
                            <td className="table4-3White">-%</td>
                            <td className="tableRedPercentW"></td>
                            <td className="table4-3White">16.4%</td>
                            <td className="tableRedPercentW"></td>
                            <td className="table4-3White">-%</td>
                            <td className="table4-3White">-%</td>
                        </tr>
                        <tr className="tableTr">
                            <td className="table4-3">M/M단가</td>
                            <td className="table4-3">-803,953</td>
                            <td className="table4-3">-803,953</td>
                            <td className="tableRedPercent"></td>
                            <td className="table4-3"></td>
                            <td className="tableRedPercent"></td>
                            <td className="table4-3"></td>
                            <td className="tableRedPercent"></td>
                            <td className="table4-3"></td>
                            <td className="table4-3"></td>
                        </tr>
                    </tbody>
                </table>

                <table className="tableMain">
                    <div className="tbodyDiv">
                        <h3 className="contentTitle">2.직접원가 내역</h3>
                    </div>
                    <tbody className="tableBody">
                        <div className="detailCost">
                            <div className="halfContent">
                                <div className="contentForm">
                                    <h6>[재료비]</h6>
                                    <tr className="tableTrDetail">
                                        <td className="table4-3">품목</td>
                                        <td className="table4-3">일반/도입</td>
                                        <td className="table4-3">금액</td>
                                    </tr>
                                    <tr className="tableTrDetail">
                                        <td className="table4-3White">PANEL</td>
                                        <td className="table4-3White">일반</td>
                                        <td className="table4-3White">
                                            365,654,110
                                        </td>
                                    </tr>
                                    <tr className="tableTrDetail">
                                        <td className="table4-3White"></td>
                                        <td className="table4-3White">일반</td>
                                        <td className="table4-3White"></td>
                                    </tr>
                                    <tr className="tableTrDetail">
                                        <td className="table4-3White"></td>
                                        <td className="table4-3White">일반</td>
                                        <td className="table4-3White"></td>
                                    </tr>
                                    <tr className="tableTrDetail">
                                        <td className="table4-3White"></td>
                                        <td className="table4-3White">일반</td>
                                        <td className="table4-3White"></td>
                                    </tr>
                                    <tr className="tableTrDetail">
                                        <td className="table4-3White"></td>
                                        <td className="table4-3White">일반</td>
                                        <td className="table4-3White"></td>
                                    </tr>
                                    <tr className="tableTrDetail">
                                        <td className="table4-3White">합계</td>
                                        <td className="table4-3White"></td>
                                        <td className="table4-3WhiteBlue">
                                            365,654,110
                                        </td>
                                    </tr>
                                </div>
                                <div style={{ width: "100%" }}>
                                    <h6>[개발외주비]</h6>
                                    <tr className="tableTrDetail">
                                        <td className="table4-3">회사</td>
                                        <td className="table4-3">턴키/MM</td>
                                        <td className="table4-3">금액</td>
                                    </tr>
                                    <tr className="tableTrDetail">
                                        <td className="table4-3White">A회사</td>
                                        <td className="table4-3White">MM</td>
                                        <td className="table4-3White">0</td>
                                    </tr>
                                    <tr className="tableTrDetail">
                                        <td className="table4-3White">　</td>
                                        <td className="table4-3White">　</td>
                                        <td className="table4-3White">　</td>
                                    </tr>
                                    <tr className="tableTrDetail">
                                        <td className="table4-3White">　</td>
                                        <td className="table4-3White">　</td>
                                        <td className="table4-3White">　</td>
                                    </tr>
                                    <tr className="tableTrDetail">
                                        <td className="table4-3White">합계</td>
                                        <td className="table4-3White"></td>
                                        <td className="table4-3WhiteBlue">0</td>
                                    </tr>
                                </div>
                                <div style={{ width: "100%" }}>
                                    <h6>[인건비]</h6>
                                    <tr className="tableTrDetail">
                                        <td className="table4-3">MM</td>
                                        <td className="table4-3">금액</td>
                                    </tr>
                                    <tr className="tableTrDetail">
                                        <td className="table4-3WhiteBlue">
                                            3.4
                                        </td>
                                        <td className="table4-3WhiteBlue">
                                            2,390,000
                                        </td>
                                    </tr>
                                </div>
                            </div>
                            <div style={{ width: "48%" }}>
                                <div style={{ width: "100%" }}>
                                    <h6>[경비]</h6>
                                    <tr className="tableTrDetail">
                                        <td className="table4-3F">계정명</td>
                                        <td className="table4-3F">산출근거</td>
                                        <td className="table4-3F">금액</td>
                                    </tr>
                                    <tr className="tableTrDetail">
                                        <td className="table4-3WhiteF">
                                            인건비성복후비
                                        </td>
                                        <td className="table4-3WhiteF2">
                                            자동계산(사용경비가 아님)
                                        </td>

                                        <td className="table4-3WhiteF">
                                            1,434,000
                                        </td>
                                    </tr>
                                    <tr className="tableTrDetail">
                                        <td className="table4-3White"></td>
                                        <td className="table4-3White">일반</td>
                                        <td className="table4-3White"></td>
                                    </tr>
                                    <tr className="tableTrDetail">
                                        <td className="table4-3White"></td>
                                        <td className="table4-3White">일반</td>
                                        <td className="table4-3White"></td>
                                    </tr>
                                    <tr className="tableTrDetail">
                                        <td className="table4-3White"></td>
                                        <td className="table4-3White">일반</td>
                                        <td className="table4-3White"></td>
                                    </tr>
                                    <tr className="tableTrDetail">
                                        <td className="table4-3White"></td>
                                        <td className="table4-3White">일반</td>
                                        <td className="table4-3White"></td>
                                    </tr>
                                    <tr className="tableTrDetail">
                                        <td className="table4-3White">합계</td>
                                        <td className="table4-3White"></td>
                                        <td className="table4-3WhiteBlue">
                                            365,654,110
                                        </td>
                                    </tr>
                                </div>
                            </div>
                        </div>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ExcutionCostsDoc;
