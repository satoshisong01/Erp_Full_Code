import ApprovalFormCost from "components/form/ApprovalFormCost";
import ViewModal from "components/modal/ViewModal";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { columns } from "constants/columns";
import ViewButton from "components/button/ViewButton";
import PopupButton from "components/button/PopupButton";
import URL from "constants/url";
import { axiosFetch, axiosUpdate } from "api/axiosFetch";
import SignStateLine from "components/SignStateLine";

export default function SignDocument() {
    const sessionUser = sessionStorage.getItem("loginUser");
    const sessionUserId = JSON.parse(sessionUser)?.id;
    const sessionUserName = JSON.parse(sessionUser)?.name;
    const sessionUserSe = JSON.parse(sessionUser)?.userSe;
    const authorCode = JSON.parse(sessionUser)?.authorCode;
    const sessionUserUniqId = JSON.parse(sessionUser)?.uniqId;

    function getQueryParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
        const results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return "";
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    useEffect(() => {
        // URL에서 "data" 파라미터 읽기
        const dataParameter = getQueryParameterByName("data");
        const data = JSON.parse(dataParameter); //프로젝트정보있음
        console.log("⭐data:", data);
        setProjectInfo({...data});
        // setProjectInfo({
        //     sgnId: data.sgnId,
        //     poiId: data.poiId,
        //     poiNm: data.poiNm,
        //     versionId: data.versionId,
        //     versionNum: data.versionNum,
        //     cltNm: data.cltNm,
        //     poiSalmanagerId: data.poiSalmanagerId,
        //     poiManagerId: data.poiManagerId,
        //     poiDueBeginDt: data.poiDueBeginDt,
        //     poiDueEndDt: data.poiDueEndDt,
        //     orderTotal: data.orderTotal,
        // });

        if(data.sgnType === "견적품의서") {
            setTitle("견적서 승인 요청서");
        } else if(data.sgnType === "수주보고서") {
            setTitle("수주/계약 보고서");
        } else if(data.sgnType === "완료보고서") {
            setTitle("완료보고서");
        }
        // 사인상태 불러오기
        getSignData({sgnId: data.sgnId});
        getSignStateData({sgnId: data.sgnId});
        
    }, []);

    const [isMyTurn, setIsMyTurn] = useState(false);

    /* 결재정보 */
    const getSignData = async (requestData) => {
        const resultData = await axiosFetch("/api/system/sign/totalListAll.do", requestData || {});
        if (resultData) {
            console.log("싸인>>>>>>", resultData);
            setSignData({...resultData});
        }
    }

    /* 결재상태정보 */
    const getSignStateData = async (requestData) => {
        const resultData = await axiosFetch("/api/system/signState/totalListAll.do", requestData || {});
        if (resultData) {
            const arr = resultData.map(item => ({
                sttId: item.sttId, //결재ID
                sttApproverId: item.sttApproverId, //승인자ID
                sttApproverNm: item.sttApproverNm, //승인자명
                sttApproverPosNm: item.sttApproverPosNm, //직급
                sttApproverGroupNm: item.sttApproverGroupNm, //부서
                sttApproverAt: item.sttApproverAt, //상태
                sttComent: item.sttComent, //코멘트
                sttPaymentDate: item.sngSignData, //결재일
            }));

            const signInfo = [{
                sttApproverNm: projectInfo.sgnSenderNm,
                sttApproverPosNm: projectInfo.sgnSenderPosNm,
                sttApproverAt: "요청",
                sttApproverGroupNm: projectInfo.sgnSenderGroupNm,
                sttPaymentDate: projectInfo.sgnSigndate,
            }]
            const merge = [
                ...signInfo,
                ...arr
            ]
            setApprovalData(merge);
            const myData = resultData.find(item => item.sttApproverAt === "진행" && item.sttApproverId === sessionUserUniqId);
            myData ? setIsMyTurn(true) : setIsMyTurn(false);
        }
    }

    const [title, setTitle] = useState("");
    const [projectInfo, setProjectInfo] = useState({}); //프로젝트정보
    const [approvalData, setApprovalData] = useState([]); //승인자목록
    const [signData, setSignData] = useState({}); //요청자

    // const approvalLineData = [
    //     {empNm: "유지수", posNm: "주임", state: "요청"},
    //     {empNm: "손영훈", posNm: "PM", state: "승인"},
    //     {empNm: "김준석", posNm: "팀장", state: "진행"},
    // ]
    const projectColumns = [
        { header: "프로젝트명", name: "poiNm", colValue: 3, colspan: 2, style: { textAlign: "left" } },
        { header: "사전원가 버전", name: "versionNum", colValue: 3, colspan: 2, style: { textAlign: "left" } },

        { header: "기안일자", name: "sgnSigndate", colValue: 2, colspan: 1, style: { textAlign: "center" } },
        { header: "기안자", name: "sgnSenderNm", colValue: 2, colspan: 1, style: { textAlign: "center" } },
        { header: "기안부서", name: "sgnSenderGroupNm", colValue: 2, colspan: 1, style: { textAlign: "center" } },

        { header: "고객사", name: "cltNm", colValue: 2, colspan: 1, style: { textAlign: "center" } },
        { header: "영업대표", name: "poiSalmanagerId", colValue: 2, colspan: 1, style: { textAlign: "center" } },
        { header: "담당자", name: "poiManagerId", colValue: 2, colspan: 1, style: { textAlign: "center" } },
        
        { header: "납기시작일", name: "poiDueBeginDt", colValue: 2, colspan: 1, style: { textAlign: "center" } },
        { header: "납기종료일", name: "poiDueEndDt", colValue: 2, colspan: 1, style: { textAlign: "center" } },
        { header: "계약금(천원)", name: "salesTotal", colValue: 2, colspan: 1, style: { textAlign: "center" } },
    ];

    const signStateColumns = [ //승인자목록
        // {header: "결재상태", name: "sttState", style: {width: "10%", textAlign: "center"}},
        {header: "결재상태", name: "sttApproverAt", style: {width: "10%", textAlign: "center"}},
        {header: "결재자", name: "sttApproverNm", style: {width: "10%", textAlign: "center"}},
        {header: "부서", name: "sttApproverGroupNm", style: {width: "10%", textAlign: "center"}},
        {header: "직급", name: "sttApproverPosNm", style: {width: "10%", textAlign: "center"}},
        {header: "결재일시", name: "sttPaymentDate", style: {width: "15%", textAlign: "center"}},
        {header: "코멘트", name: "sttComent", style: {width: "30%", textAlign: "left"}},
    ];


    
    // const approvalData = [
    //     {sttState: "승인", empNm: "손영훈", posNm: "PM", groupNm: "PA팀", sttPaymentDate: "2024-03-14 17:35", sttComent: "승인 테스트"},
    //     {sttState: "진행", empNm: "김준석", posNm: "팀장", groupNm: "PA팀", sttPaymentDate: "", sttComent: ""},
    // ];


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
                        {/* { column.name !== "salesTotal" ? data[column.name] : data[column.name].toLocaleString()} */}
                        { column.name !== "salesTotal" ? data[column.name] : data[column.name]}
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
                <td colSpan="6" dangerouslySetInnerHTML={{ __html: data.sgnDesc }} />
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
        const newArray = data.slice(1); // 또는 const newArray = [...array.slice(1)];
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
                    {newArray.map((row, index) => (
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

    const approvalToServer = async (value) => {
        // const sameInfo = approvalData.find(app => app.sttApproverNm === sessionUserName); //승인자목록==로그인유저
        const sameInfo = approvalData.find(app => app.sttApproverId === sessionUserUniqId); //승인자목록==로그인유저

        // {
        //     "sttId":"121",
        //     "sttState":"반려",
        //     "sttComent":"반려테스트"
        //     }
        const requestData = {
            sttResult: value.sttResult,
            sttComent: value.sttComent,
            sttId: sameInfo.sttId
        }

        const resultData = await axiosUpdate("/api/system/signState/edit.do", requestData || {});
        if(resultData) {
            console.log("resultData:", resultData);
        }
    }

    return (
        <>
            <div style={{ width: '90%', margin: 'auto' }}>
                <div className="table-buttons mg-t-10 mg-b-10">
                    <PopupButton
                        targetUrl={URL.PreCostDoc}
                        data={{ label: "견적원가서(보기)", type: "document" }}
                    />
                    {isMyTurn && <ViewButton label={"결재"} onClick={() => setIsOpenView(true)} />}
                </div>
                <div style={{ textAlign: "center", marginBottom: "-65px" }}>
                        <h3>{title}</h3>
                </div>
                <SignStateLine signStateData={approvalData}>
                    <div style={{ textAlign: "center" }}>
                        {generateProjectTable(projectColumns, projectInfo)}
                    </div>

                    <br />
                    <br />

                    <div style={{ marginBottom: 10 }}>
                        <h4>결재의견</h4>
                    </div>
                    <div style={{ textAlign: "center" }} className="mg-b-30">
                        {generateApprovalTable(signStateColumns, approvalData)}
                    </div>
                </SignStateLine>
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
