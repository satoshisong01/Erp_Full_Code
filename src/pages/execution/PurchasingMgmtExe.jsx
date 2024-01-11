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
import LoadButton from "components/button/LoadButton";
import BasicButton from "components/button/BasicButton";

/** 실행관리-구매관리 */
function PurchasingMgmtExe() {
    const { currentPageName, setCurrentPageName, projectInfo, setProjectInfo, setNameOfButton, setLoadButton, setInnerPageName } = useContext(PageContext);
    const [condition, setCondition] = useState({});
    const [runMgmt, setRunMgmt] = useState([]); // 구매 실행관리
    const [view, setView] = useState([]); // 계획 조회
    const [buyCall, setBuyCall] = useState([]); //합계

    useEffect(() => {
        return () => {
            setProjectInfo({});
        };
    }, []);

    const current = "구매실행";

    const fetchAllData = async (condition) => {
        //rcvStatus 입고상태 ...
        // const data = await axiosFetch("/api/baseInfrm/product/buyIngInfoExe/totalListAll.do", condition);
        const data = await axiosFetch("/api/baseInfrm/product/receivingInfo/totalListAll.do", condition);
        const viewData = await axiosFetch("/api/baseInfrm/product/buyIngInfoExe/totalListAll.do", { ...condition, modeCode: "BUDGET" });
        console.log(viewData, "뷰데이트");
        setView(viewData);
        if (data && data.length > 0) {
            const changes = changeData(data);
            setRunMgmt(changes);
            const groupedData = changes.reduce((result, current) => {
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
            setRunMgmt([]);
            setBuyCall([]);
        }
    };

    const changeData = (data) => {
        const updateData = data.map((data) => ({
            ...data,
            price: data.byUnitPrice * data.byQunty,
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
            <ApprovalFormExe viewPageName={current} returnData={conditionInfo} />
            <HideCard title="계획 조회" color="back-gray" className="mg-b-40">
                <ReactDataTable columns={columns.purchasingMgmt.view} customDatas={view} defaultPageSize={5} hideCheckBox={true} />
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
                    suffixUrl="/baseInfrm/product/receivingInfo"
                    editing={true}
                    columns={columns.purchasingMgmt.run}
                    viewLoadDatas={view}
                    customDatas={runMgmt}
                    viewPageName={current}
                    customDatasRefresh={refresh}
                    condition={condition}
                />
            </HideCard>
        </>
    );
}

export default PurchasingMgmtExe;
