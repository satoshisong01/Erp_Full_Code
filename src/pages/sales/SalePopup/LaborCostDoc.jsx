import React, { useState, useEffect, useRef, useContext } from "react";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-dt/js/dataTables.dataTables";
import meccaImg from "../EstimateMgmt/img/meccaImg.png";
import sign from "../EstimateMgmt/img/CEOsign.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilePdf, faPrint } from "@fortawesome/free-solid-svg-icons";
import { axiosFetch } from "api/axiosFetch";
/* 갑지 */
const LaborCostDoc = () => {
    /* ⭐ 데이터 없을 시 초기화 필요 */
    const [title, setTitle] = useState("");
    const [projectTitle, setProjectTitle] = useState("");
    const [totalAmount, setTotalAmount] = useState(0);
    const [tableDatas, setTableDatas] = useState([]);

    const [managementNumber, setManagementNumber] = useState("QT20221020 - 32 천안 SEC"); // 추가: 관리번호 상태
    const [writingDate, setWritingDate] = useState("2024.10.01"); // 추가: 작성일자 상태
    const [recipient, setRecipient] = useState("삼성 SDS"); // 추가: 수신 상태
    const [reference, setReference] = useState("C"); // 추가: 참조 상태
    const [sender, setSender] = useState("이 주 현"); // 추가: 발신 상태
    const [contact, setContact] = useState("010-4227-2370"); // 추가: 연락처 상태
    const [condition, setCondition] = useState("고객사 지급기준에 준함"); // 추가: 연락처 상태
    const [deadline, setDeadline] = useState("계약 후 5개월"); // 추가: 연락처 상태
    const [none, setNone] = useState("none");
    const [textDec, setTextDec] = useState(`1. 견적유효기간 : 2024년 7월31일
2. 견적 범위 : 자재 납품 / 시험조건 중 시험조건 (설치장소 : 세메스 화성 사업장)`); // 추가: 연락처 상태

    console.log(tableDatas, "tableDatas");

    useEffect(() => {
        const dataParameter = getQueryParameterByName("data");
        const data = JSON.parse(dataParameter);
        setProjectTitle(data.tableData[0].poiNm);
        setTableDatas(restructureData(data.tableData));
        const { label, poiId, versionId, managementNumber, writingDate, recipient, reference, sender, contact } = data;
        setTitle(label);
        setManagementNumber(managementNumber);
        setWritingDate(writingDate);
        setRecipient(recipient);
        setReference(reference);
        setSender(sender);
        setContact(contact);
        setCondition(condition);
        setDeadline(deadline);
        setTextDec(textDec);
        if (poiId && versionId) {
            getInitData(poiId, versionId);
        }
    }, []);

    const printFn = () => {
        // titleInput 클래스명을 가진 input 요소들의 border 값을 변경
        const inputs = document.querySelectorAll(".titleInput");
        inputs.forEach((input) => {
            input.style.border = "none";
        });
        const printButton = document.getElementById("printButton");
        printButton.style.display = "none"; // 프린트 버튼 숨기기
        window.print();
    };

    useEffect(() => {
        const printButton = document.getElementById("printButton");
        printButton.style.display = "block"; // 컴포넌트가 마운트될 때 프린트 버튼 보이기

        // 프린트가 완료된 후 실행될 함수
        const afterPrint = () => {
            // titleInput 클래스명을 가진 input 요소들의 border 값을 다시 설정
            const inputs = document.querySelectorAll(".titleInput");
            inputs.forEach((input) => {
                input.style.border = ""; // 빈 문자열로 설정하여 기본 스타일로 돌아감
            });
            // 프린트 버튼 다시 보이기
            printButton.style.display = "block";
        };

        // 프린트 이벤트 리스너 등록
        window.addEventListener("afterprint", afterPrint);

        // cleanup 함수: 컴포넌트가 언마운트될 때 이벤트 리스너 제거
        return () => {
            window.removeEventListener("afterprint", afterPrint);
        };
    }, []); // 빈 배열을 넣어 한 번만 실행되도록 설정

    function restructureData(data) {
        const result = [];

        // 데이터를 순회하면서 pdiNm을 기준으로 객체들을 그룹화
        const groupedData = {};
        data.forEach((item) => {
            if (!groupedData[item.pdiNm]) {
                groupedData[item.pdiNm] = [];
            }
            groupedData[item.pdiNm].push(item);
        });

        // 그룹화된 데이터를 원하는 형태로 재구성
        for (const pdiNm in groupedData) {
            const estItem = groupedData[pdiNm].map((item) => ({
                estMmTotal: item.total,
                estPosition: item.estPosition,
                price: item.estUnitPrice,
                total: item.total,
                estDesc: item.estDesc,
                pdiUnit: item.pdiUnit,
            }));

            result.push({
                pdiNm: pdiNm,
                estItem: estItem,
            });
        }

        return result;
    }

    // URL에서 쿼리 문자열 파라미터를 읽는 함수
    function getQueryParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
        const results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return "";
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    const getInitData = async (poiId, versionId) => {
        const url = "/api/calculate/cost/totalListAll.do";
        const resultData = await axiosFetch(url, { poiId, versionId });
        const { laborTotalPrice } = resultData || {};
        setTotalAmount(laborTotalPrice);
    };

    const firstItemTotal =
        tableDatas.length > 0
            ? tableDatas.reduce((acc, data) => {
                  return acc + data.estItem.reduce((total, item) => total + item.price * item.total, 0);
              }, 0)
            : 0;

    // 숫자를 한자로 변환하는 함수
    function convertToChinese(number) {
        const digits = ["零", "一", "二", "三", "四", "五", "六", "柒", "八", "九"];
        const units = ["", "十", "百", "千"];
        const bigUnits = ["", "萬", "億", "兆", "京", "垓", "秭", "穰", "溝", "澗", "正", "載", "極", "恒河沙", "阿僧祇", "那由他", "不可思議", "無量大数"];

        const digitsArray = String(number).split("").map(Number);
        const len = digitsArray.length;
        let result = "";

        for (let i = 0; i < len; i++) {
            const digit = digitsArray[i];
            const unit = len - i - 1;
            if (digit !== 0) {
                result += digits[digit] + units[unit % 4];
            }
            if (unit % 4 === 0 && i !== len - 1) {
                result += bigUnits[Math.floor(unit / 4)];
            }
        }

        return result;
    }

    const firstItemChineseTotal = convertToChinese(firstItemTotal);

    return (
        <>
            <div>
                <header>
                    <h1 className="EstimateHeader">{title}</h1>
                </header>
                <body className="EstimateBody">
                    <div className="titleTotal">
                        <div className="titleLeft">
                            <div className="leftBox">
                                <div className="boxHome">
                                    <span className="boxTitle">관</span>
                                    <span className="boxTitle">리</span>
                                    <span className="boxTitle">번</span>
                                    <span className="boxTitle lastTitle">호:</span>
                                </div>
                                <input className="titleInput" type="text" value={managementNumber} onChange={(e) => setManagementNumber(e.target.value)} />
                            </div>
                            <div className="leftBox">
                                <div className="boxHome">
                                    <span className="boxTitle">작</span>
                                    <span className="boxTitle">성</span>
                                    <span className="boxTitle">일</span>
                                    <span className="boxTitle lastTitle">자:</span>
                                </div>
                                <input className="titleInput" type="text" value={writingDate} onChange={(e) => setWritingDate(e.target.value)} />
                            </div>
                            <div className="leftBox">
                                <div className="boxHome">
                                    <span className="boxTitle">수</span>
                                    <span className="boxTitle lastTitle">신:</span>
                                </div>
                                <input className="titleInput" type="text" value={recipient} onChange={(e) => setRecipient(e.target.value)} />
                            </div>
                            <div className="leftBox">
                                <div className="boxHome">
                                    <span className="boxTitle">참</span>
                                    <span className="boxTitle lastTitle">조:</span>
                                </div>
                                <input className="titleInput" type="text" value={reference} onChange={(e) => setReference(e.target.value)} />
                            </div>
                            <div className="leftBox">
                                <div className="boxHome">
                                    <span className="boxTitle">발</span>
                                    <span className="boxTitle lastTitle">신:</span>
                                </div>
                                <input className="titleInput" type="text" value={sender} onChange={(e) => setSender(e.target.value)} />
                            </div>
                            <div className="leftBox">
                                <div className="boxHome">
                                    <span className="boxTitle">연</span>
                                    <span className="boxTitle">락</span>
                                    <span className="boxTitle lastTitle">처:</span>
                                </div>
                                <input className="titleInput" type="text" value={contact} onChange={(e) => setContact(e.target.value)} />
                            </div>
                            <p style={{ fontSize: "16px", fontWeight: "700" }}>아래와 같이 견적합니다</p>
                        </div>
                        <div className="spanBody3">
                            <img className="mecca" src={meccaImg} alt="" />
                        </div>
                        <div className="titleRight">
                            <div className="spanBody">
                                <span className="bodySpan">
                                    경기도 화성시 동탄대로
                                    <br /> 636-3(영천동)
                                </span>
                            </div>
                            <div className="spanBody">
                                <span className="bodySpan">메가비즈타워 C동 13층</span>
                            </div>
                            <div className="spanBody">
                                <span className="bodySpan">Tel)031-376-7567(대표)</span>
                            </div>
                            <div className="spanBody">
                                <span className="bodySpan">Fax)031-376-7565</span>
                            </div>
                            <div className="spanBodyFooter">
                                <div className="h2Body">
                                    <p className="footerTitle">메카테크놀러지(주)</p>
                                    <p className="footerTitle">대 표 이 사&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;김 용 일</p>
                                    {/*<p className="footerTitle">김&nbsp;&nbsp;용&nbsp;&nbsp;일</p>*/}
                                </div>
                                <img className="signImg" src={sign} alt="" />
                            </div>
                        </div>
                    </div>
                    <h1 className="SumCount">
                        一金 : {firstItemChineseTotal}원整(₩{firstItemTotal.toLocaleString()} - VAT 별도)
                    </h1>
                    <div className="condition">
                        <div className="conditionSpan">
                            <div className="rightBox">
                                <div className="boxHome2">
                                    <span className="boxTitle">대</span>
                                    <span className="boxTitle">급</span>
                                    <span className="boxTitle">지</span>
                                    <span className="boxTitle">급</span>
                                    <span className="boxTitle">조</span>
                                    <span className="boxTitle lastTitle">건:</span>
                                </div>
                                <input className="titleInput" type="text" value={condition} onChange={(e) => setCondition(e.target.value)} />
                            </div>
                            <div className="rightBox">
                                <div className="boxHome2">
                                    <span className="boxTitle">납</span>
                                    <span className="boxTitle lastTitle">기:</span>
                                </div>
                                <input className="titleInput" type="text" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
                            </div>
                        </div>
                    </div>
                    <h3 className="projectName">{projectTitle}</h3>
                    <div className="tableParent">
                        <table className="width90">
                            <tbody className="tableBody">
                                <div className="width90"></div>
                                <tr className="tableTr">
                                    <td className="tableRedPercent">no</td>
                                    <td className="tableItem">Item Name</td>
                                    <td className="tableRedPercent">Q'ty</td>
                                    <td className="tableRedPercent">Unit</td>
                                    <td className="table4-3">Unit Price</td>
                                    <td className="table4-3">Amount</td>
                                </tr>
                                {tableDatas.map((data, index) => (
                                    <React.Fragment key={index}>
                                        <tr className="tableTr">
                                            <td className="tableRedPercentW">{index + 1}</td>
                                            <td className="tableWhiteItem">{data.pdiNm}</td>
                                            <td className="tableRedPercentW">{data.estItem.reduce((acc, curr) => acc + curr.total, 0)}</td>
                                            <td className="tableRedPercentW">Lot</td>
                                            <td className="table4-3White"></td>
                                            <td className="table4-3White">
                                                {data.estItem.reduce((acc, curr) => acc + curr.price * curr.total, 0).toLocaleString()}
                                            </td>
                                        </tr>
                                        {data.estItem.map((item, itemIndex) => (
                                            <tr key={itemIndex} className="tableTr">
                                                <td className="tableRedPercentW"></td>
                                                <td className="tableWhiteItem">{item.estPosition}</td>
                                                <td className="tableRedPercentW">{item.total}</td>
                                                <td className="tableRedPercentW">M/M</td>
                                                <td className="table4-3White">{item.price.toLocaleString()}</td>
                                                <td className="table4-3White">{(item.total * item.price).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </React.Fragment>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <h3 className="projectName">특이사항</h3>
                    <div className="etcBox">
                        <div className="etcItems">
                            <textarea className="textareaStyle" type="text" value={textDec} onChange={(e) => setTextDec(e.target.value)} />
                        </div>
                    </div>
                </body>
                <button id="printButton" onClick={() => printFn()} style={{ position: "fixed", top: "10px", right: "10px" }}>
                    <FontAwesomeIcon icon={faPrint} style={{ color: "red" }} />
                    PDF출력
                </button>
            </div>
        </>
    );
};

export default LaborCostDoc;
