import React, { useContext, useEffect, useState } from "react";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import { locationPath } from "constants/locationPath";
import { axiosFetch, axiosUpdate } from "api/axiosFetch";
import ReactDataTable from "components/DataTable/ReactDataTable";
import HideCard from "components/HideCard";
import { PageContext } from "components/PageProvider";
import RefreshButton from "components/button/RefreshButton";
import ModButton from "components/button/ModButton";
import { columns } from "constants/columns";
import URL from "constants/url";
import ViewButton from "components/button/ViewButton";
import ViewModal from "components/modal/ViewModal";

/** 전자결재-결재대기함(승인자기준) */
function PendingBox() {
    const { currentPageName, setInnerPageName } = useContext(PageContext);

    const sessionUser = sessionStorage.getItem("loginUser");
    const sessionUserId = JSON.parse(sessionUser)?.id;
    const sessionUserName = JSON.parse(sessionUser)?.name;
    const sessionUserSe = JSON.parse(sessionUser)?.userSe;
    const authorCode = JSON.parse(sessionUser)?.authorCode;

    const [tableData, setTableData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]); //그리드에서 선택된 row 데이터
    const [isOpenView, setIsOpenView] = useState(false);

    const columnsList = [
        { header: "프로젝트아이디", col: "poiId", notView: true },
        { header: "버전아이디", col: "versionId", notView: true },
        { header: "수주아이디", col: "poId", notView: true },
        { header: "결재아이디", col: "sttId", notView: true },
        { header: "발신자아이디", col: "sgnSenderId", notView: true }, // == empId
        { header: "수신자아이디", col: "sgnReceiverId", notView: true }, // == empId2
        { header: "프로젝트명", col: "poiNm", cellWidth: "350" },
        { header: "결재종류", col: "sgnType", cellWidth: "200" },
        { header: "기안자", col: "sgnSenderNm", cellWidth: "100" },
        { header: "기안일", col: "sgnSigndate", cellWidth: "100" },
        // { header: "수신자", col: "empNm2", cellWidth: "100" },
        // { header: "수신일", col: "sgnReceivedate", cellWidth: "100" },
        // { header: "결재단계", col: "sgnStep", cellWidth: "100" },
        // { header: "결재결과", col: "sgnResult", cellWidth: "100" },
        { header: "코멘트", col: "sgnComent", cellWidth: "589" },
        // { header: "비고", col: "sgnDesc", cellWidth: "170" },
    ];

    const conditionList = [
        { title: "프로젝트명", colName: "clCode", type: "input" },
        {
            title: "결재종류",
            colName: "empNm",
            type: "select",
            option: [
                { value: "", label: "전체" },
                { value: "사전원가서", label: "사전원가서" },
                { value: "실행예산서", label: "실행예산서" },
                { value: "사후정산서", label: "사후정산서" },
                { value: "수주보고서", label: "수주보고서" },
                { value: "완료보고서", label: "완료보고서" },
            ],
        },
        {
            title: "결재상태",
            colName: "sgnResult",
            type: "select",
            option: [
                { value: "전체", label: "전체" },
                { value: "발신", label: "발신" },
                { value: "수신", label: "수신" },
                { value: "반려", label: "반려" },
                { value: "완료", label: "완료" },
                { value: "회수", label: "회수" },
            ],
        },
        { title: "기안자", colName: "empNm", type: "input" },
        { title: "기안일", colName: "sgnSigndate", type: "dayPicker" },
    ];

    useEffect(() => {
        fetchAllData({ sttApproverId: localStorage.uniqId, sttApproverAt: "진행" });
        // fetchAllData({});
    }, [currentPageName]);

    const fetchAllData = async (condition) => {
        console.log(condition, "???");
        // const resultData = await axiosFetch("/api/system/sign/detail.do", condition || {});
        //http://192.168.0.113:8080/api/system/sign/totalListAll.do
        const resultData = await axiosFetch("/api/system/signState/totalListAll.do", condition || {});
        console.log(resultData, "안나오는게 맞음");
        if (resultData) {
            setTableData(resultData);
            console.log("⭐결재", resultData);
        }
    };

    const refresh = () => {
        fetchAllData({ sttApproverId: localStorage.uniqId, sttApproverAt: "진행" });
    };

    const approvalToServer = async (data) => {
        console.log(data);
        const resultData = await axiosUpdate("/api/system/signState/edit.do", data);
        if (resultData) {
            alert("변경되었습니다.");
        }
    };

    //const onClick = () => {
    //    if (selectedRows.sgnType === "수주보고서") {
    //        openPopup(URL.PreCostDoc, { ...selectedRows, label: "수주보고서" });
    //    } else if (selectedRows.sgnType === "실행예산서") {
    //    } else if (selectedRows.sgnType === "사후정산서") {
    //    }
    //};

    //const openPopup = (targetUrl, data) => {
    //    console.log(data);
    //    const url = `${targetUrl}?data=${encodeURIComponent(JSON.stringify(data))}`;
    //    const width = 1400;
    //    const height = 700;
    //    const left = window.screen.width / 2 - width / 2;
    //    const top = window.screen.height / 2 - height / 2;
    //    const windowFeatures = `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,location=no,status=no,resizable=yes,scrollbars=yes`;
    //    window.open(url, "newWindow", windowFeatures);
    //};

    const returnData = (row) => {
        if (row[0].sttId && selectedRows.sttId !== row[0].sttId) {
            setSelectedRows(row[0]);
        }
    };

    return (
        <>
            <Location pathList={locationPath.Approval} />
            <SearchList conditionList={conditionList} />
            <HideCard title="결재대기 목록" color="back-lightblue" className="mg-b-40">
                <div className="table-buttons mg-t-10 mg-b-10">
                    <ViewButton label={"보기"} onClick={() => setIsOpenView(true)} />
                    {/*<ModButton label={"보기"} onClick={onClick} />*/}
                    <RefreshButton onClick={refresh} />
                </div>
                <ReactDataTable
                    columns={columnsList}
                    customDatas={tableData}
                    viewPageName={{ name: "결재대기함", id: "PendingBox" }}
                    returnSelectRows={returnData}
                />
            </HideCard>
            {isOpenView && (
                <ViewModal
                    width={500}
                    height={250}
                    list={columns.approval.views}
                    initialData={selectedRows}
                    resultData={approvalToServer}
                    onClose={() => setIsOpenView(false)}
                    title="접수자 승인"
                />
            )}
        </>
    );
}

export default PendingBox;
