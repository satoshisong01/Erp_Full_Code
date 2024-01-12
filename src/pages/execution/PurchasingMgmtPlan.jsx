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
import ReactDataTable from "components/DataTable/ReactDataTable";
import BasicButton from "components/button/BasicButton";

/** 실행관리-구매-계획 */
function PurchasingMgmtPlan() {
    const { setNameOfButton } = useContext(PageContext);
    const [condition, setCondition] = useState({});
    const [budgetMgmt, setBudgetMgmt] = useState([]);
    const [buyCall, setBuyCall] = useState([]);
    const [view, setView] = useState([]);

    const fetchAllData = async (condition) => {
        const data = await axiosFetch("/api/baseInfrm/product/buyIngInfoExe/totalListAll.do", condition);
        const viewResult = await axiosFetch("/api/baseInfrm/product/buyIngInfo/totalListAll.do", { poiId: condition.poiId, costAt: "Y" });
        console.log(viewResult, "뷰데이트");
        setView(viewResult);
        if (data && data.length > 0) {
            const changes = changeData(data);
            setBudgetMgmt(changes);
            const groupedData = changes.reduce((result, current) => {
                //const existingGroup = result.find((group) => group.pgNm === current.pgNm);
                const existingGroup = result.find((group) => group.pdiMenufut === current.pdiMenufut && group.pgNm === current.pgNm);
                if (existingGroup) {
                    existingGroup.price += current.price;
                } else {
                    result.push({ pgNm: current.pgNm, pdiMenufut: current.pdiMenufut, price: current.price });
                }
                return result;
            }, []);
            setBuyCall(groupedData);
        } else {
            alert("no data");
            setBuyCall([]);
            setBudgetMgmt([]);
        }
    };

    const changeData = (data) => {
        const updateData = data.map((data) => ({ ...data, price: data.byUnitPrice * data.byQunty }));
        return updateData;
    };

    const refresh = () => {
        if (condition.poiId) {
            fetchAllData(condition);
        }
    };

    const conditionInfo = (value) => {
        setCondition((prev) => {
            if (prev.poiId !== value.poiId) {
                const newCondition = { poiId: value.poiId, modeCode: "BUDGET" };
                fetchAllData(newCondition);
                return newCondition;
            }
            return prev;
        });
    };

    return (
        <>
            <Location pathList={locationPath.PurchasingMgmt} />
            <ApprovalFormExe returnData={conditionInfo} />
            <HideCard title="계획 조회" color="back-gray" className="mg-b-40">
                <ReactDataTable columns={columns.purchasingMgmt.planView} customDatas={view} defaultPageSize={5} hideCheckBox={true} />
            </HideCard>
            <HideCard title="합계" color="back-lightyellow" className="mg-b-40">
                <ReactDataTable columns={columns.purchasingMgmt.buyCal} customDatas={buyCall} defaultPageSize={5} hideCheckBox={true} />
            </HideCard>
            <HideCard title="등록/수정" color="back-lightblue">
                <div className="table-buttons mg-b-m-30">
                    <BasicButton label={"가져오기"} onClick={() => setNameOfButton("load")} />
                    <SaveButton label={"저장"} onClick={() => setNameOfButton("save")} />
                    <RefreshButton onClick={refresh} />
                </div>
                <ReactDataTablePdorder
                    suffixUrl="/baseInfrm/product/buyIngInfoExe"
                    editing={true}
                    columns={columns.purchasingMgmt.budget}
                    viewLoadDatas={view}
                    customDatas={budgetMgmt}
                    viewPageName={{ name: "구매(재료비)", id: "PurchasingMgmtPlan" }}
                    customDatasRefresh={refresh}
                    condition={condition}
                />
            </HideCard>
        </>
    );
}

export default PurchasingMgmtPlan;
