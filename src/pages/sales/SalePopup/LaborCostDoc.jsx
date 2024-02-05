import React, { useState, useEffect, useRef, useContext } from "react";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-dt/js/dataTables.dataTables";
import { axiosFetch } from "api/axiosFetch";

/* 사전 원가 계산서 */
const LaborCostDoc = () => {
    /* ⭐ 데이터 없을 시 초기화 필요 */
    const [title, setTitle] = useState("");

    useEffect(() => {
        // URL에서 "data" 파라미터 읽기
        const dataParameter = getQueryParameterByName("data");
        const data = JSON.parse(dataParameter);
        console.log(data);
        const { label, poiId, poiNm, versionId, versionNum, versionDesc } = data;
        console.log(poiId);
        setTitle(label);
        if (poiId && versionId) {
            getInitData(poiId, versionId); //서버에서 데이터 호출
        }
    }, []);

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
            {/*<div className="precost-container">
                <button onClick={handlePrintButtonClick} className="pdfBtn">
                    PDF로 다운로드
                </button>
                <div className="flex-column mg-t-20 mg-b-20">
                    <div className="precost-title" style={{ margin: "auto", marginBottom: "20px", fontSize: "23px" }}>
                        {title}
                    </div>
                    <FormDataTable formTableColumns={infoColumns} useStatus={false} />
                    <div className="precost-title">1.손익계산서</div>
                    <BasicDataTable columns={coreColumns} data={coreTableData} datatableRef={coreTable} />

                    <div className="empty" />

                    <div className="precost-title">2.직접원가 내역</div>
                    <div className="wrap">
                        <div style={{ flex: 4 }}>
                            <BasicDataTable
                                columns={purchasingColumns}
                                data={purchasingTableData}
                                datatableRef={purchasingTable}
                                tableSize={purStyle}
                                subtitle="재료비"
                            />
                            <BasicDataTable
                                columns={outsourcingColumns}
                                data={outTableData}
                                datatableRef={outsourcingTable}
                                tableSize={purStyle}
                                subtitle="개발외주비"
                            />
                            <BasicDataTable columns={laborColumns} data={laborTableData} datatableRef={laborTable} subtitle="인건비" />
                        </div>
                        <div style={{ flex: 0.5 }} />
                        <div style={{ flex: 5.5 }}>
                            <BasicDataTable columns={chargeColumns} data={chargeTableData} datatableRef={chargeTable} tableSize={chargeStyle} subtitle="경비" />
                        </div>
                    </div>
                </div>
            </div>*/}
            <div>123</div>
        </>
    );
};

export default LaborCostDoc;
