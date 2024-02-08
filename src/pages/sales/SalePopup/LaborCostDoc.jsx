import React, { useState, useEffect, useRef, useContext } from "react";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-dt/js/dataTables.dataTables";
import meccaImg from "../EstimateMgmt/img/meccaImg.png";
import sign from "../EstimateMgmt/img/CEOsign.png";
import { axiosFetch } from "api/axiosFetch";

/* 사전 원가 계산서 */
const LaborCostDoc = () => {
    /* ⭐ 데이터 없을 시 초기화 필요 */
    const [title, setTitle] = useState("");

    useEffect(() => {
        // URL에서 "data" 파라미터 읽기
        const dataParameter = getQueryParameterByName("data");
        const data = JSON.parse(dataParameter);
        console.log(restructureData(data.tableData));
        const { label, poiId, poiNm, versionId, versionNum, versionDesc } = data;
        console.log(poiId);
        setTitle(label);
        if (poiId && versionId) {
            getInitData(poiId, versionId); //서버에서 데이터 호출
        }
    }, []);

    function restructureData(data) {
        const result = [];

        // 데이터를 순회하면서 pgNm을 기준으로 객체들을 그룹화
        const groupedData = {};
        data.forEach((item) => {
            if (!groupedData[item.pgNm]) {
                groupedData[item.pgNm] = [];
            }
            groupedData[item.pgNm].push(item);
        });

        // 그룹화된 데이터를 원하는 형태로 재구성
        for (const pgNm in groupedData) {
            const estItem = groupedData[pgNm].map((item) => ({
                estMmTotal: item.total,
                estPosition: item.estPosition,
                price: item.price,
                total: item.total,
            }));

            result.push({
                pgNm: pgNm,
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
        // const requestData = { poiId };
        console.log("조회하기~~~~~~~~~", poiId, versionId);
        const resultData = await axiosFetch(url, { poiId, versionId });
        console.log("resultData::::", resultData);
        console.log("💜 사전원가서 resultData:", resultData, "url:", url);
        const {
            projectInfoToServer, //수주정보
            salesBudgetIn, //수주액>자체용역
            laborTotalMM, //인건비 총 mm
            salesBudgetHS, //수주액>구매

            laborTotalPrice, //인건비 총 합
            insuranceTotalPrice, //인건비성복후비
            budgetList, //경비목록
            budgetTotalPrice, //경비 총 합
            outLaborList, //개발외주비 목록
            outLaborTotalMM, //개발외주비  총 mm
            outLaborTotalPrice, //개발외주비 총 합

            //구매데이터..
            buyingList, //구매리스트
            buyingTotalPrice, //구매총합

            negoTotalPrice, //네고 합
            legalTotalPrice, //판관비 합
        } = resultData || {};

        /* 인건비 테이블 데이터 */
    };

    return (
        <>
            <div>
                <header>
                    <h1 className="EstimateHeader">{title}</h1>
                </header>
                <body className="EstimateBody">
                    <div className="titleTotal">
                        <div className="titleLeft">
                            <div className="spanBody">
                                <div>
                                    <span className="bodySpan">관&nbsp;&nbsp;리&nbsp;&nbsp;번&nbsp;&nbsp;호&nbsp;:</span>
                                </div>
                                <div>
                                    <p className="bodySpan bodySpan2">QT20221020 - 32 천안 SEC</p>
                                </div>
                            </div>
                            <div className="spanBody">
                                <span className="bodySpan">작&nbsp;&nbsp;성&nbsp;&nbsp;일&nbsp;&nbsp;자 :</span>
                                <span className="bodySpan bodySpan2">2022.10.20</span>
                            </div>
                            <div className="spanBody">
                                <span className="bodySpan">수&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;신 :</span>
                                <span className="bodySpan bodySpan2">삼성 SDS</span>
                            </div>
                            <div className="spanBody">
                                <span className="bodySpan">참&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;조 :</span>
                                <span className="bodySpan bodySpan2">C</span>
                            </div>
                            <div className="spanBody">
                                <span className="bodySpan">발&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;신 :</span>
                                <span className="bodySpan bodySpan2">이 주 현</span>
                            </div>
                            <div className="spanBody">
                                <span className="bodySpan">연&nbsp;&nbsp;&nbsp;&nbsp; 락&nbsp;&nbsp;&nbsp;&nbsp;처 :</span>
                                <span className="bodySpan bodySpan2">010-4227-2370</span>
                            </div>
                        </div>
                        <div className="spanBody3">
                            <img className=" mecca" src={meccaImg} alt="" />
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
                                    <h2 className="footerTitle">메카테크놀러지(주)</h2>
                                    <h2 className="footerTitle">대 표 이 사</h2>
                                    <h2 className="footerTitle">김&nbsp;&nbsp;용&nbsp;&nbsp;일</h2>
                                </div>
                                <img className="signImg" src={sign} alt="" />
                            </div>
                        </div>
                    </div>
                    <h1 className="SumCount">一金 : 零원整(₩0 - VAT 별도)</h1>
                    <div className="condition">
                        <div className="conditionSpan">
                            <span>대 금 지 급 조 건 : 고객사 지급기준에 준함</span>
                            <span>납&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;기 : 계약 후 5 개월</span>
                        </div>
                    </div>
                    <h3 className="projectName">삼성전자 천안 C3 전력 FMCS 구축</h3>
                    <div className="tableParent">
                        <table className="width90">
                            <tbody className="tableBody">
                                <div className="width90"></div>
                                <tr className="tableTr">
                                    <td className="tableRedPercent">no</td>
                                    <td className="table4-3">Item Name</td>
                                    <td className="tableRedPercent">Q'ty</td>
                                    <td className="tableRedPercent">Unit</td>
                                    <td className="table4-3">Unit Price</td>
                                    <td className="table4-3">Amount</td>
                                </tr>
                                <tr className="tableTr">
                                    <td className="tableRedPercentW">I</td>
                                    <td className="table4-3White">인건비</td>
                                    <td className="tableRedPercentW">1</td>
                                    <td className="tableRedPercentW">Lot</td>
                                    <td className="table4-3White"></td>
                                    <td className="table4-3White">17</td>
                                </tr>
                                <tr className="tableTr">
                                    <td className="tableRedPercentW"></td>
                                    <td className="table4-3White">특급1 기술자</td>
                                    <td className="tableRedPercentW">8.0</td>
                                    <td className="tableRedPercentW">M/M</td>
                                    <td className="table4-3White">1</td>
                                    <td className="table4-3White">8</td>
                                </tr>
                                <tr className="tableTr">
                                    <td className="tableRedPercentW"></td>
                                    <td className="table4-3White">고급2 기술자</td>
                                    <td className="tableRedPercentW">1.0</td>
                                    <td className="tableRedPercentW">M/M</td>
                                    <td className="table4-3White">1</td>
                                    <td className="table4-3White">1</td>
                                </tr>
                                <tr className="tableTr">
                                    <td className="tableRedPercentW"></td>
                                    <td className="table4-3White">고급2 기술자</td>
                                    <td className="tableRedPercentW">1.0</td>
                                    <td className="tableRedPercentW">M/M</td>
                                    <td className="table4-3White">1</td>
                                    <td className="table4-3White">1</td>
                                </tr>
                                <tr className="tableTr">
                                    <td className="tableRedPercentW"></td>
                                    <td className="table4-3White">고급2 기술자</td>
                                    <td className="tableRedPercentW">1.0</td>
                                    <td className="tableRedPercentW">M/M</td>
                                    <td className="table4-3White">1</td>
                                    <td className="table4-3White">1</td>
                                </tr>
                                <tr className="tableTr">
                                    <td className="tableRedPercentW"></td>
                                    <td className="table4-3White">견적가 / 부가세 별도</td>
                                    <td className="tableRedPercentW"> </td>
                                    <td className="tableRedPercentW"> </td>

                                    <td className="table4-3White">만 단위 절삭</td>
                                    <td className="table4-3White">-</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <h3 className="projectName">특이사항</h3>
                    <div className="etcBox">
                        <div className="etcItems">
                            <span className="etcItem">1.견적유효기간 : 2022년 07월31일</span>
                            <span className="etcItem">2. 견적 범위 : 자재 납품 / 시험조건 중 시험조건 ( 설치장소 : 세메스 화성 사업장 )</span>
                        </div>
                    </div>
                </body>
            </div>
        </>
    );
};

export default LaborCostDoc;
