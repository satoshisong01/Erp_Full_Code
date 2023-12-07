import React, { useContext, useRef, useState } from "react";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import ReactDataTable from "components/DataTable/ReactDataTable";
import { PageContext } from "components/PageProvider";
import { locationPath } from "constants/locationPath";
import RefreshButton from "components/button/RefreshButton";
import DelButton from "components/button/DelButton";
import ModButton from "components/button/ModButton";
import AddButton from "components/button/AddButton";
import PopupButton from "components/button/PopupButton";
import URL from "constants/url";
import AddModal from "components/modal/AddModal";

/** 영업관리-수주등록관리 */
function OrderMgmt() {
    const { projectInfo } = useContext(PageContext);
    const orderMgmtTable = useRef(null);
    const [isOpenAdd, setIsOpenAdd] = useState(false);

    const addColumns = [
        { header: "프로젝트이름", col: "poiNm", placeholder: "ㅇㅇ", require: true},
        { header: "고객사", col: "cltNm"},
        { header: "수주부서", col: "poiGroupId"},
        { header: "매출부서", col: "poiSalesGroupId"},
        { header: "영업대표", col: "poiSalmanagerId"},
        { header: "PM", col: "poiManagerId"},
        { header: "통화", col: "poiCurrcy"},
        { header: "계약일", col: "poiBeginDt"},
        { header: "납기시작일", col: "poiDueBeginDt"},
        { header: "납기종료일", col: "poiDueEndDt"},
        { header: "기준이익률", col: "standardMargin"},
        { header: "상태", col: "poiStatus"}
    ]

    const columns = [
        { header: "수주 아이디", col: "poiId", cellWidth: "5%", type: "input", enable: true, modify: false, add: false, require: true, notView: true },
        { header: "프로젝트명", col: "poiNm", cellWidth: "25%", type: "input", enable: true, modify: true, add: true, require: true },
        { header: "고객사", col: "cltNm", cellWidth: "15%", type: "input", enable: true, modify: true, add: false, require: false },
        { header: "수주부서", col: "poiGroupId", cellWidth: "7%", type: "input", enable: true, modify: true, add: true, require: false },
        { header: "매출부서", col: "poiSalesGroupId", cellWidth: "7%", type: "input", enable: true, modify: true, add: true, require: false },
        { header: "영업대표", col: "poiSalmanagerId", cellWidth: "10%", type: "input", enable: true, modify: true, add: true, require: false },
        { header: "PM", col: "poiManagerId", cellWidth: "10%", type: "input", enable: true, modify: true, add: true, require: false },
        { header: "통화", col: "poiCurrcy", cellWidth: "5%", type: "input", enable: true, modify: true, add: true, require: false },
        { header: "계약일", col: "poiBeginDt", cellWidth: "10%", type: "input", enable: true, modify: true, add: true, require: false },
        { header: "납기시작일", col: "poiDueBeginDt", cellWidth: "10%", type: "input", enable: true, modify: true, add: true, require: false },
        { header: "납기종료일", col: "poiDueEndDt", cellWidth: "10%", type: "input", enable: true, modify: true, add: true, require: false },
        { header: "기준이익률", col: "standardMargin", cellWidth: "8%", type: "input", enable: true, modify: true, add: true, require: false },
        { header: "상태", col: "poiStatus", cellWidth: "10%", type: "input", enable: true, modify: true, add: true, require: false },
    ];

    const conditionList = [
        {
            title: "프로젝트명",
            colName: "poiNm",
            type: "input",
            value: "",
        },
        {
            title: "영업대표",
            colName: "poiSalmanagerId",
            type: "input",
            value: "",
        },
        {
            title: "담당자",
            colName: "poiManagerId",
            type: "input",
            value: "",
        },
        {
            title: "상태",
            colName: "poiStatus",
            type: "input",
            value: "",
        },
        {
            title: "계약일",
            colName: "poiBeginDt",
            type: "input",
            value: "",
        },
    ];

    const addToServer = () => {
        //서버에 저장 구현해주세요^^
    }
    const modifyToServer = () => {
        //서버에 수정 구현해주세요^^
    }
    const deleteToServer = () => {
        //서버에 삭제 구현해주세요^^
    }
    const refresh = () => {
        //새로고침 구현해주세요^^
    }

    return (
        <>
            <Location pathList={locationPath.OrderMgmt} />
            <SearchList conditionList={conditionList} />
            <div className="table-buttons">
                <PopupButton targetUrl={URL.LaborPreCostDoc} data={{ label: "사전원가서", projectInfo }} />
                <AddButton label={"추가"} onClick={() => setIsOpenAdd(true)} />
                <ModButton label={"수정"} onClick={modifyToServer} />
                <DelButton label={"삭제"} onClick={deleteToServer} />
                <RefreshButton onClick={refresh} />
            </div>
            <ReactDataTable columns={columns} suffixUrl="/baseInfrm/product/pjOrdrInfo" tableRef={orderMgmtTable} viewPageName="수주등록관리" />
            {
                isOpenAdd && <AddModal width="300" height="500" columns={addColumns} onClose={() => setIsOpenAdd(false)} sendData={addToServer}/>
            }
        </>
    );
}

export default OrderMgmt;
