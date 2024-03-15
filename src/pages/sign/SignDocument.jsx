import ApprovalFormCost from "components/form/ApprovalFormCost";
import ViewModal from "components/modal/ViewModal";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { columns } from "constants/columns";
import ViewButton from "components/button/ViewButton";
import PopupButton from "components/button/PopupButton";
import URL from "constants/url";

export default function SignDocument() {
    const approvalLineData = [
        {empNm: "유지수", posNm: "주임", state: "요청"},
        {empNm: "손영훈", posNm: "PM", state: "승인"},
        {empNm: "김준석", posNm: "팀장", state: "진행"},
    ]
    const projectColumns = [
        { header: "프로젝트명", name: "poiNm", colValue: 3, colspan: 2, style: { textAlign: "left" } },
        { header: "사전원가 버전", name: "versionNum", colValue: 3, colspan: 2, style: { textAlign: "left" } },

        { header: "기안일자", name: "sgnSigndate", colValue: 2, colspan: 1, style: { textAlign: "center" } },
        { header: "기안자", name: "empNm", colValue: 2, colspan: 1, style: { textAlign: "center" } },
        { header: "기안부서", name: "groupNm", colValue: 2, colspan: 1, style: { textAlign: "center" } },

        { header: "고객사", name: "cltNm", colValue: 2, colspan: 1, style: { textAlign: "center" } },
        { header: "영업대표", name: "poiSalmanagerId", colValue: 2, colspan: 1, style: { textAlign: "center" } },
        { header: "담당자", name: "poiManagerId", colValue: 2, colspan: 1, style: { textAlign: "center" } },
        
        { header: "납기시작일", name: "poiDueBeginDt", colValue: 2, colspan: 1, style: { textAlign: "center" } },
        { header: "납기종료일", name: "poiDueEndDt", colValue: 2, colspan: 1, style: { textAlign: "center" } },
        { header: "계약금(천원)", name: "salesTotal", colValue: 2, colspan: 1, style: { textAlign: "center" } },
    ];

    const signColumns = [
        {header: "결재", name: "sttState", style: {width: "10%", textAlign: "center"}},
        {header: "결재자", name: "empNm", style: {width: "10%", textAlign: "center"}},
        {header: "부서", name: "groupNm", style: {width: "10%", textAlign: "center"}},
        {header: "직급", name: "posNm", style: {width: "10%", textAlign: "center"}},
        {header: "결재일시", name: "sttPaymentDate", style: {width: "15%", textAlign: "center"}},
        {header: "비고", name: "sttComent", style: {width: "30%", textAlign: "left"}},
    ];

    const signData = {
        poiId: "",
        poiNm: "삼성전자 천안 C3 전련 FMCS 구축",
        versionId: "",
        versionNum: "VER.1",
        cltId: "",
        cltNm: "세메스",
        poiSalmanagerId: "이수형",
        poiManagerId: "손영훈",
        poiDueBeginDt: "2024-07-27",
        poiDueEndDt: "2024-06-12",
        salesTotal: 5660000,
        sttState: "기안",
        empNm: "유지수",
        posNm: "주임",
        groupNm: "PS팀",
        sgnSigndate: "2024-03-14 14:50",
        sgnDesc: `비고내용<br />비고내용<br />비고내용<br />비고내용`
    };
    
    const approvalData = [
        {sttState: "승인", empNm: "손영훈", posNm: "PM", groupNm: "PA팀", sttPaymentDate: "2024-03-14 17:35", sttComent: "승인 테스트"},
        {sttState: "진행", empNm: "김준석", posNm: "팀장", groupNm: "PA팀", sttPaymentDate: "", sttComent: ""},
    ];


    /* 프로젝트 DOM 구성 */
    function generateProjectTable(columns, data) {
        const tableRows = [];
        let currentRow = [];
        let currentColValueSum = 0;
    
        for (let i = 0; i < columns.length; i++) {
            const column = columns[i];
    
            currentRow.push(
                <th key={uuidv4()}>{column.header}</th>
            );
    
            if (column.colspan) {
                currentRow.push(
                    <td key={uuidv4()} colSpan={column.colspan} style={{ textAlign: column.style.textAlign }}>
                        { column.name !== "salesTotal" ? data[column.name] : data[column.name].toLocaleString()}
                    </td>
                );
            }
    
            currentColValueSum += column.colValue;
    
            if (currentColValueSum === 6 || i === columns.length - 1) {
                tableRows.push(
                    <tr key={uuidv4()}>{currentRow}</tr>
                );
                currentRow = [];
                currentColValueSum = 0;
            }
        }
    
        tableRows.push(
            <tr key={uuidv4()} style={{ textAlign: "left" }}>
                <td colSpan="6">
                    {data.sgnDesc.split('<br />').map((line, index) => (
                        <div key={index}>{line}</div>
                    ))}
                </td>
            </tr>
        );
    
        return (
            <table className="table-styled" style={{ border: "solid 1px #ddd", margin: "auto" }}>
                <tbody>
                    {tableRows}
                </tbody>
            </table>
        );
    }
        
    const [selectedRows, setSelectedRows] = useState([]); //그리드에서 선택된 row 데이터
    const [isOpenView, setIsOpenView] = useState(false);

    /* 결재의견 DOM 구성 */
    function generateApprovalTable(columns, data) {
        return (
            <table className="table-styled" style={{ border: "solid 1px #ddd", margin: "auto" }}>
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th key={index} style={column.style}>{column.header}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index}>
                            {columns.map((column, columnIndex) => (
                                <td key={columnIndex} style={column.style}>{row[column.name]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    const approvalToServer = () => {

    }

    return (
        <>
            <div style={{ width: '90%', margin: 'auto' }}>
                <div className="table-buttons mg-t-10 mg-b-10">
                    <PopupButton
                        targetUrl={URL.PreCostDoc}
                        data={{ label: "견적원가서(보기)", type: "document" }}
                    />
                    <ViewButton label={"결재"} onClick={() => setIsOpenView(true)} />
                </div>
                <div style={{ textAlign: "center", marginBottom: "-65px" }}>
                        <h3>견적서 승인 요청서</h3>
                </div>
                <ApprovalFormCost sendInfo={approvalLineData}>
                    <div style={{ textAlign: "center" }}>
                        {generateProjectTable(projectColumns, signData)}
                    </div>

                    <br />
                    <br />

                    <div style={{ marginBottom: 10 }}>
                        <h4>결재의견</h4>
                    </div>
                    <div style={{ textAlign: "center" }}>
                        {generateApprovalTable(signColumns, approvalData)}
                    </div>
                </ApprovalFormCost>
            </div>
            {isOpenView && (
                <ViewModal
                    width={500}
                    height={250}
                    list={columns.approval.views}
                    initialData={selectedRows}
                    resultData={approvalToServer}
                    onClose={() => setIsOpenView(false)}
                    title="결재처리"
                />
            )}
        </>
    );
}
