import React, { useContext, useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import { locationPath } from "constants/locationPath";
import { PageContext } from "components/PageProvider";
import { axiosFetch } from "api/axiosFetch";
import ReactDataTablePdorder from "components/DataTable/ReactDataTablePdorder";
import { columns } from "constants/columns";
import ApprovalFormExe from "components/form/ApprovalFormExe";
import HideCard from "components/HideCard";
import SaveButton from "components/button/SaveButton";
import RefreshButton from "components/button/RefreshButton";
import ReactDataTable from "components/DataTable/ReactDataTable";
import BasicButton from "components/button/BasicButton";
import AddButton from "components/button/AddButton";
import DelButton from "components/button/DelButton";

/** 실행관리-구매관리 */
function PurchasingMgmtExe() {
    const { setNameOfButton } = useContext(PageContext);
    const [condition, setCondition] = useState({});
    const [runMgmt, setRunMgmt] = useState([]); // 구매 실행관리
    const [view, setView] = useState([]); // 계획 조회
    const [buyCall, setBuyCall] = useState([]); //합계

    const fetchAllData = async (condition) => {
        const data = await axiosFetch("/api/baseInfrm/product/receivingInfo/totalListAll.do", condition);
        const viewData = await axiosFetch("/api/baseInfrm/product/buyIngInfoExe/totalListAll.do", { ...condition, modeCode: "BUDGET" });
        // console.log(viewData, "뷰데이트");
        setView(viewData);
        if (data && data.length > 0) {
            const changes = changeData(data);
            setRunMgmt(changes);
            const groupedData = changes.reduce((result, current) => {
                const existingGroup = result.find((group) => group.pdiMenufut === current.pdiMenufut && group.pgNm === current.pgNm);
                if (existingGroup) {
                    existingGroup.rcvPrice += current.rcvPrice;
                } else {
                    result.push({ pgNm: current.pgNm, pdiMenufut: current.pdiMenufut, rcvPrice: current.rcvPrice });
                }
                return result;
            }, []);
            setBuyCall(groupedData);
        } else {
            alert("no data");
            setRunMgmt([]);
            setBuyCall([]);
        }
    };

    const changeData = (data) => {
        const updateData = data.map((data) => ({
            ...data,
            price: data.byUnitPrice * data.byQunty,
            rcvPrice: data.rcvUnitPrice * data.rcvQunty,
            rcvState:
                data.byQunty < data.rcvQunty
                    ? "초과입고"
                    : data.byQunty - data.rcvQunty === 0
                    ? "입고완료"
                    : data.byQunty - data.rcvQunty === data.byQunty
                    ? "미입고"
                    : data.rcvQunty < data.byQunty
                    ? "입고중"
                    : "상태이상",
        }));
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
                const newCondition = { poiId: value.poiId };
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
                <ReactDataTable columns={columns.purchasingMgmt.view} customDatas={view} defaultPageSize={5} hideCheckBox={true} />
            </HideCard>
            <HideCard title="합계" color="back-lightyellow" className="mg-b-40">
                <ReactDataTable columns={columns.purchasingMgmt.buyCal} customDatas={buyCall} defaultPageSize={5} hideCheckBox={true} />
            </HideCard>
            <HideCard title="등록/수정" color="back-lightblue">
                <div className="table-buttons mg-t-10 mg-b-10">
                    <BasicButton label={"가져오기"} onClick={() => setNameOfButton("load")} />
                    <SaveButton label={"저장"} onClick={() => setNameOfButton("save")} />
                    <AddButton label={"추가"} onClick={() => setNameOfButton("addRow")} />
                    <DelButton label={"삭제"} onClick={() => setNameOfButton("deleteRow")} />
                    <RefreshButton onClick={refresh} />
                </div>
                <ReactDataTablePdorder
                    suffixUrl="/baseInfrm/product/receivingInfo"
                    editing={true}
                    columns={columns.purchasingMgmt.run}
                    viewLoadDatas={view}
                    customDatas={runMgmt}
                    viewPageName={{ name: "구매(재료비)", id: "PurchasingMgmtExe" }}
                    customDatasRefresh={refresh}
                    condition={condition}
                />
            </HideCard>
        </>
    );
}

export default PurchasingMgmtExe;
