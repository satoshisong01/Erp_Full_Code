import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import FormDataTable from "components/DataTable/FormDataTable";
import ReactDataTable from "components/DataTable/ReactDataTable";
import { PageContext } from "components/PageProvider";
import { locationPath } from "constants/locationPath";
import TableAddModal from "components/modal/TableAddModal";
//import EventButtonDefault from "components/button/EventButtonDefault";
import RefreshButton from "components/button/RefreshButton";
import EventButtonPrimary from "components/button/EventButtonPrimary";
//import EventButtonWarning from "components/button/EventButtonWarning";
import DelButton from "components/button/DelButton";
import ModButton from "components/button/ModButton";
import PopupButton from "components/button/PopupButton";
import URL from "constants/url";

/** 영업관리-수주등록관리 */
function OrderMgmt() {
    const { isOpenModal, setNameOfButton } = useContext(PageContext);
    const orderMgmtTable = useRef(null);

    const columns = [
        {
            header: "프로젝트 이름",
            col: "poiNm",
            cellWidth: "50%",
            type: "input",
            enable: false,
            modify: true,
            add: true,
            notView: true,
            require: true,
        },
        {
            header: "프로젝트 코드",
            col: "poiCode",
            cellWidth: "25%",
            type: "input",
        },
        {
            header: "수주시작일",
            col: "poiBeginDt",
            cellWidth: "25%",
            type: "select",
            options: [
                { value: "1", label: "op1" },
                { value: "2", label: "op2" },
            ],
        },
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
                colSpan: "3",
                require: true,
            },
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
            {
                label: "수주 시작일",
                key: "poiBeginDt",
                type: "input",
                require: true,
            },
            {
                label: "수주 마감일",
                key: "poiEndDt",
                type: "input",
                require: true,
            },
            {
                label: "사전원가 기준 이익률",
                key: "standardMargin",
                type: "input",
                require: true,
            },
            { label: "상태", key: "poiStatus" },
        ],
    ];

    const onClick = () => {};

    return (
        <>
            <Location pathList={locationPath.OrderMgmt} />
            <SearchList conditionList={conditionList} />
            <div className="table-buttons">
                <EventButtonPrimary label={"사전원가서"} onClick={onClick} />
                {/*<EventButtonDefault label={'수정'} onClick={() => setNameOfButton('add')} />*/}
                {/*<EventButtonWarning label={'삭제'} onClick={() => setNameOfButton('delete')} />*/}
                <RefreshButton onClick={onClick} />
                <PopupButton targetUrl={URL.BusiCalculateDoc} data={{ label: "사전원가서", poiCode: "" }} />
                <ModButton label={"수정"} onClick={() => setNameOfButton("modify")} />
                <DelButton label={"삭제"} onClick={() => setNameOfButton("delete")} />
                <RefreshButton onClick={() => setNameOfButton("refresh")} />
            </div>
            {/* <ReactTableButton showButton={['orderModify', 'preCost', 'refresh', 'delete']}/> */}
            <ReactDataTable columns={columns} suffixUrl="/baseInfrm/product/pjOrdrInfo" tableRef={orderMgmtTable} viewPageName="수주등록관리" />
            <FormDataTable formTableColumns={formTableColumns} title="프로젝트 신규 등록" useStatus={true} />
            {isOpenModal && <TableAddModal columns={columns} />}
        </>
    );
}

export default OrderMgmt;
