import React, { useContext, useRef, useState } from "react";
import Location from "components/Location/Location";
import DataTable from "components/DataTable/DataTable";
import SearchList from "components/SearchList";
import { locationPath } from "constants/locationPath";
import PopupButton from "components/button/PopupButton";
import ModButton from "components/button/ModButton";
import DelButton from "components/button/DelButton";
import RefreshButton from "components/button/RefreshButton";
import ReactDataTable from "components/DataTable/ReactDataTable";
import { PageContext } from "components/PageProvider";

/** 실행관리-실행원가관리 */
function ExecutionCost() {
    const { setNameOfButton } = useContext(PageContext);
    const [returnKeyWord, setReturnKeyWord] = useState("");
    const orderMgmtTable = useRef(null);

    const columns = [
        { header: "프로젝트ID", col: "poiId", cellWidth: "12%", type: "input", enable: false, modify: true, add: true, notView: true, require: true },
        { header: "프로젝트 이름", col: "poiNm", cellWidth: "20%", type: "input", enable: true, modify: true, add: true, notView: true, require: true },
        { header: "프로젝트 코드", col: "poiCode", cellWidth: "15%", type: "input", enable: false, modify: false, add: true, notView: true, require: true },
        { header: "프로젝트 타이틀", col: "poiTitle", cellWidth: "25%", type: "input", enable: true, modify: true, add: true, notView: true, require: false },
        { header: "거래처ID", col: "cltId", cellWidth: "15%", type: "input", enable: false, modify: true, add: false, notView: true, require: true },
        { header: "거래처명", col: "cltNm", cellWidth: "15%", type: "input", enable: false, modify: true, add: false, notView: true, require: true },
        { header: "수주부서", col: "poiGroupId", cellWidth: "10%", type: "input", enable: true, modify: true, add: true, notView: true, require: false },
        { header: "매출부서", col: "poiSalesGroupId", cellWidth: "10%", type: "input", enable: true, modify: true, add: true, notView: true, require: false },
        { header: "영업대표", col: "poiSalmanagerId", cellWidth: "10%", type: "input", enable: true, modify: true, add: true, notView: true, require: false },
        { header: "PM", col: "poiManagerId", cellWidth: "10%", type: "input", enable: true, modify: true, add: true, notView: true, require: false },
        { header: "통화", col: "poiCurrcy", cellWidth: "10%", type: "input", enable: true, modify: true, add: true, notView: true, require: false },
        { header: "기준이익률", col: "standardMargin", cellWidth: "10%", type: "input", enable: true, modify: true, add: true, notView: true, require: false },
        { header: "상태", col: "poiStatus", cellWidth: "10%", type: "input", enable: true, modify: true, add: true, notView: true, require: false },
        { header: "시작일", col: "poiBeginDt", cellWidth: "15%", type: "input", enable: true, modify: true, add: true, notView: true, require: false },
        { header: "종료일", col: "poiEndDt", cellWidth: "15%", type: "input", enable: true, modify: true, add: true, notView: true, require: false },
        { header: "납기시작일", col: "poiDueBeginDt", cellWidth: "10%", type: "input", enable: true, modify: true, add: true, notView: true, require: false },
        { header: "납기종료일", col: "poiDueEndDt", cellWidth: "10%", type: "input", enable: true, modify: true, add: true, notView: true, require: false },
        { header: "비고", col: "poiDesc", cellWidth: "10%", type: "input", enable: true, modify: true, add: true, notView: true, require: false },
        { header: "첨부파일", col: "poFileId", cellWidth: "10%", type: "input", enable: true, modify: true, add: true, notView: true, require: false },
    ];

    const conditionList = [
        {
            title: "프로젝트명",
            colName: "clCode", //컬럼명
            type: "input",
            value: "",
            searchLevel: "1",
        },
        {
            title: "수주상태",
            colName: "name",
            type: "select",
            option: [{ value: "사업진행중" }, { value: "사업완료" }, { value: "작성완료" }],
            searchLevel: "3",
        },
        {
            title: "담당자",
            colName: "clCode", //컬럼명
            type: "input",
            value: "",
            searchLevel: "1",
        },
        {
            title: "영업대표",
            colName: "clCode", //컬럼명
            type: "input",
            value: "",
            searchLevel: "1",
        },
        {
            title: "프로젝트기간",
            colName: "selectedDate",
            type: "datepicker",
            searchLevel: "0",
        },
        {
            title: "납기기간",
            colName: "selectedDate",
            type: "datepicker",
            searchLevel: "0",
        },
        {
            title: "거래처",
            colName: "clCodeNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "2",
        },
        {
            title: "비고",
            colName: "clCodeNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "2",
        },
    ];

    const handleReturn = (value) => {
        setReturnKeyWord(value);
        console.log(value, "제대로 들어오냐");
    };

    const addBtn = ["runCalPage"];

    return (
        <>
            <Location pathList={locationPath.ExecutionCost} />
            <SearchList conditionList={conditionList} onSearch={handleReturn} />
            <div className="table-buttons">
                <PopupButton targetUrl={URL.BusiCalculateDoc} data={{ label: "실행원가서", poiCode: "" }} />
                <ModButton label={"수정"} onClick={() => setNameOfButton("modify")} />
                <DelButton label={"삭제"} onClick={() => setNameOfButton("delete")} />
                <RefreshButton onClick={() => setNameOfButton("refresh")} />
            </div>
            <ReactDataTable columns={columns} suffixUrl="/baseInfrm/product/pjOrdrInfo" tableRef={orderMgmtTable} viewPageName="실행원가관리" />
            {/*<DataTable returnKeyWord={returnKeyWord} columns={columns} suffixUrl="/system/code/clCode" addBtn={addBtn} />*/}
        </>
    );
}

export default ExecutionCost;
