import React, { useContext, useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import FormDataTable from "components/DataTable/FormDataTable";
import ReactDataTable from "components/DataTable/ReactDataTable";
import { PageContext } from "components/PageProvider";
import { locationPath } from "constants/locationPath";
import RefreshButton from "components/button/RefreshButton";
import DelButton from "components/button/DelButton";
import ModButton from "components/button/ModButton";
import PopupButton from "components/button/PopupButton";
import URL from "constants/url";

/** 영업관리-수주등록관리 */
function OrderMgmt() {
    const { setNameOfButton, projectInfo } = useContext(PageContext);
    const orderMgmtTable = useRef(null);

    const columns = [
        { header: "수주 아이디", col: "poiId", cellWidth: "20%", type: "input", enable: true, modify: false, add: false, require: true, notView: true },
        { header: "프로젝트 이름", col: "poiNm", cellWidth: "20%", type: "input", enable: true, modify: true, add: true, require: true },
        { header: "프로젝트 코드", col: "poiCode", cellWidth: "15%", type: "input", enable: false, modify: false, add: true, require: true },
        // { header: "거래처명", col: "cltNm", cellWidth: "15%", type: "buttonCompany", modify: true, add: false, require: true },
        { header: "수주부서", col: "poiGroupId", cellWidth: "10%", type: "input", enable: true, modify: true, add: true, require: false },
        { header: "매출부서", col: "poiSalesGroupId", cellWidth: "10%", type: "input", enable: true, modify: true, add: true, require: false },
        { header: "영업대표", col: "poiSalmanagerId", cellWidth: "10%", type: "input", enable: true, modify: true, add: true, require: false },
        { header: "PM", col: "poiManagerId", cellWidth: "10%", type: "input", enable: true, modify: true, add: true, require: false },
        { header: "통화", col: "poiCurrcy", cellWidth: "10%", type: "input", enable: true, modify: true, add: true, require: false },
        { header: "기준이익률", col: "standardMargin", cellWidth: "10%", type: "input", enable: true, modify: true, add: true, require: false },
        { header: "상태", col: "poiStatus", cellWidth: "10%", type: "input", enable: true, modify: true, add: true, require: false },
        { header: "시작일", col: "poiBeginDt", cellWidth: "15%", type: "input", enable: true, modify: true, add: true, require: false },
        { header: "종료일", col: "poiEndDt", cellWidth: "15%", type: "input", enable: true, modify: true, add: true, require: false },
        { header: "납기시작일", col: "poiDueBeginDt", cellWidth: "10%", type: "input", enable: true, modify: true, add: true, require: false },
        { header: "납기종료일", col: "poiDueEndDt", cellWidth: "10%", type: "input", enable: true, modify: true, add: true, require: false },
        { header: "버전", col: "poiDesc", cellWidth: "10%", type: "input", enable: true, modify: true, add: true, require: false },
    ];

    const conditionList = [
        {
            title: "프로젝트 이름",
            colName: "poiNm",
            type: "input",
            value: "",
            searchLevel: "1",
        },
        {
            title: "담당자",
            colName: "poiManagerId",
            type: "input",
            value: "",
            searchLevel: "2",
        },
    ];

    const formTableColumns = [
        [
            {
                label: "프로젝트 이름",
                key: "poiNm",
                type: "input",
                colSpan: "3",
                require: true,
            },
            {
                label: "프로젝트 코드",
                key: "poiCode",
                type: "input",
                require: true,
            },
            {
                label: "프로젝트 버전",
                key: "poiDesc",
                type: "input",
                require: true,
            },
            // {
            //     label: "거래처",
            //     key: "cltId", //CLT_ID
            //     type: "buttonCompany",
            //     require: true,
            // },
        ],
        [
            {
                label: "수주부서",
                key: "poiGroupId",
                type: "select",
                option: ["PA", "PS", "FMCS", "HMI"],
                require: true,
            },
            {
                label: "매출부서",
                key: "poiSalesGroupId",
                type: "select",
                option: ["PA", "PS", "FMCS", "HMI"],
                require: true,
            },
            {
                label: "영업대표",
                key: "poiSalmanagerId",
                type: "input",
                require: true,
            },
            { label: "PM", key: "poiManagerId", type: "input", require: true },
        ],
        [
            { label: "수주 시작일", key: "poiBeginDt", type: "daypicker", require: true },
            { label: "수주 마감일", key: "poiEndDt", type: "daypicker", require: true },
            {
                label: "사전원가 기준 이익률",
                key: "standardMargin",
                type: "input",
                require: true,
            },
            { label: "상태", key: "poiStatus", require: false },
        ],
    ];

    return (
        <>
            <Location pathList={locationPath.OrderMgmt} />
            {/* <SearchList conditionList={conditionList} /> */}
            <div className="table-buttons">
                <PopupButton targetUrl={URL.LaborPreCostDoc} data={{ label: "사전원가서", projectInfo }} />
                <ModButton label={"수정"} onClick={() => setNameOfButton("modify")} />
                <DelButton label={"삭제"} onClick={() => setNameOfButton("delete")} />
                <RefreshButton onClick={() => setNameOfButton("refresh")} />
            </div>
            <ReactDataTable columns={columns} suffixUrl="/baseInfrm/product/pjOrdrInfo" tableRef={orderMgmtTable} viewPageName="수주등록관리" />
            <FormDataTable formTableColumns={formTableColumns} title="프로젝트 신규 등록" useStatus={true} />
        </>
    );
}

export default OrderMgmt;
