import React, { useContext, useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import { locationPath } from "constants/locationPath";
import ReactDataTable from "components/DataTable/ReactDataTable";
import { axiosDelete, axiosFetch, axiosPost, axiosUpdate } from "api/axiosFetch";
import { PageContext } from "components/PageProvider";
import ApprovalForm from "components/form/ApprovalForm";
import { columns } from "constants/columns";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import ReactDataTableView from "components/DataTable/ReactDataTableView";
import { ChangePrmnPlanData } from "components/DataTable/function/ReplaceDataFormat";
import RefreshButton from "components/button/RefreshButton";

/** 실행관리-인건비-실행 */
function LaborCostMgmtExe() {
    const {
        innerPageName,
        setCurrentPageName,
        setPrevInnerPageName,
        setInnerPageName,
        isSaveFormTable,
        setIsSaveFormTable,
        projectInfo,
        setProjectInfo,
        projectItem,
        // viewSetPoiId,
        unitPriceList,
        currentPageName,
    } = useContext(PageContext);

    const refresh = () => {

    }
    return (
        <>
            <Location pathList={locationPath.LaborCostMgmt} />
            <ApprovalForm title={innerPageName + " 등록"} />
            <div className="table-buttons">
                <RefreshButton onClick={refresh} />
            </div>
            <ReactDataTable
                columns={columns.laborCostMgmt.budget}
                // tableRef={orderPlanMgmtTable3}
                // customDatas={budgetMgmt}
                viewPageName="인건비"
                // sendToParentTables={compareData}
            />
        </>
    );
}

export default LaborCostMgmtExe;
