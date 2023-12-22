import React, { useContext } from "react";
import Location from "components/Location/Location";
import { locationPath } from "constants/locationPath";
import ReactDataTable from "components/DataTable/ReactDataTable";
import { PageContext } from "components/PageProvider";
import { columns } from "constants/columns";
import RefreshButton from "components/button/RefreshButton";
import ApprovalFormExe from "components/form/ApprovalFormExe";
import HideCard from "components/HideCard";

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
            <ApprovalFormExe viewPageName="실행인건비" />
            <HideCard title="계획 조회" color="back-gray" className="mg-b-40">
            </HideCard>
            <HideCard title="합계" color="back-lightyellow" className="mg-b-40">
            </HideCard>
            <HideCard title="계획 등록/수정" color="back-lightblue">
                <div className="table-buttons mg-b-m-30">
                    <RefreshButton onClick={refresh} />
                </div>
                <ReactDataTable
                    columns={columns.laborCostMgmt.budget}
                    // tableRef={orderPlanMgmtTable3}
                    // customDatas={budgetMgmt}
                    viewPageName="실행인건비"
                    // sendToParentTables={compareData}
                />
            </HideCard>
        </>
    );
}

export default LaborCostMgmtExe;
