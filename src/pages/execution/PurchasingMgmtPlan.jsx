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
    const { setProjectInfo, currentPageName, setCurrentPageName, setNameOfButton, setInnerPageName } = useContext(PageContext);
    const [condition, setCondition] = useState({});
    const [budgetMgmt, setBudgetMgmt] = useState([]);

    useEffect(() => {
        return () => {
            setProjectInfo({});
        };
    }, []);

    const current = "구매계획";

    useEffect(() => {
        if(currentPageName === "구매(재료비)") {
            if(currentPageName !== current) {
                setCurrentPageName(current);
            }
        }
        setInnerPageName("");
    }, [currentPageName]);


    const fetchAllData = async (condition) => {
        const data = await axiosFetch("/api/baseInfrm/product/buyIngInfoExe/totalListAll.do", condition);
        console.log("🎄1.구매:",condition, "data:", data);
        data ? setBudgetMgmt(changeData(data)) : setBudgetMgmt([]);
    };

    const changeData = (data) => {
        const updateData = data.map((data) => ({ ...data, price: data.byUnitPrice * data.byQunty }));
        return updateData;
    };

    const refresh = () => {
        if(condition.poiId) {
            fetchAllData(condition);
        }
    }

    const conditionInfo = (value) => {
        setCondition((prev) => {
            if (prev.poiId !== value.poiId) {
                const newCondition = { poiId: value.poiId, modeCode: "BUDGET" };
                fetchAllData(newCondition);
                return newCondition;
            }
            return prev; 
        });
    }

    return (
        <>
            <Location pathList={locationPath.PurchasingMgmt} />
            {/* <ApprovalFormExe viewPageName={current} returnData={conditionInfo}/> */}
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
                    viewPageName={current}
                    customDatasRefresh={refresh}
                    condition={condition}
                />
            </HideCard>
        </>
    );
}

export default PurchasingMgmtPlan;
