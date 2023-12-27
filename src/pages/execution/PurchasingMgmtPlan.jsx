import React, { useContext, useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import { locationPath } from "constants/locationPath";
import { PageContext } from "components/PageProvider";
import { axiosFetch } from "api/axiosFetch";
import RefreshButton from "components/button/RefreshButton";
import ReactDataTablePdorder from "components/DataTable/ReactDataTablePdorder";
import { columns } from "constants/columns";
import ApprovalFormExe from "components/form/ApprovalFormExe";
import HideCard from "components/HideCard";
import SaveButton from "components/button/SaveButton";

/** 실행관리-구매-계획 */
function PurchasingMgmtPlan() {
    const { projectInfo, setProjectInfo, currentPageName, setCurrentPageName, setNameOfButton } = useContext(PageContext);

    useEffect(() => {
        const current = "구매계획";
        if(current === "구매계획" && currentPageName !== "구매계획") {
            setCurrentPageName("구매계획")
        }
        return () => {
            setProjectInfo({});
        };
    }, [currentPageName]);

    const [budgetMgmt, setBudgetMgmt] = useState([]);

    const fetchAllData = async (condition) => {
        const data = await axiosFetch("/api/baseInfrm/product/buyIngInfoExe/totalListAll.do", condition);
        data ? setBudgetMgmt(changeData(data)) : setBudgetMgmt([]);
    };

    const changeData = (data) => {
        const updateData = data.map((data) => ({ ...data, price: data.byUnitPrice * data.byQunty }));
        return updateData;
    };

    const refresh = () => {
        if(projectInfo.poiId) {
            fetchAllData({poiId: projectInfo.poiId, modeCode: "BUDGET"})
        }
    }

    return (
        <>
            <Location pathList={locationPath.PurchasingMgmt} />
            {/* <ApprovalFormExe viewPageName="구매(재료비)" returnData={(condition) => fetchAllData({...condition, modeCode: "BUDGET"})}/> */}
            <ApprovalFormExe viewPageName="구매계획" returnData={(condition) => fetchAllData({...condition, modeCode: "BUDGET"})}/>
            <HideCard title="계획 조회" color="back-gray" className="mg-b-40">
            </HideCard>
            <HideCard title="합계" color="back-lightyellow" className="mg-b-40">
            </HideCard>
            <HideCard title="계획 등록/수정" color="back-lightblue">
                <div className="table-buttons mg-b-m-30">
                    <SaveButton label={"저장"} onClick={() => setNameOfButton("save")} />
                    <RefreshButton onClick={refresh} />
                </div>
                <ReactDataTablePdorder
                    suffixUrl="/baseInfrm/product/buyIngInfoExe"
                    editing={true}
                    columns={columns.purchasingMgmt.budget}
                    customDatas={budgetMgmt}
                    viewPageName="구매계획"
                    customDatasRefresh={refresh}
                />
            </HideCard>
        </>
    );
}

export default PurchasingMgmtPlan;
