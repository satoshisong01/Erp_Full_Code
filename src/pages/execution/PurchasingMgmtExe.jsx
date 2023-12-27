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

/** 실행관리-구매관리 */
function PurchasingMgmtExe() {
    const { currentPageName, setCurrentPageName, projectInfo, setProjectInfo, setNameOfButton } = useContext(PageContext);
    const [condition, setCondition] = useState({});
    const [runMgmt, setRunMgmt] = useState([]); // 구매 실행관리

    useEffect(() => {
        return () => {
            setProjectInfo({});
        };
    }, []);

    const current = "구매실행";

    useEffect(() => {
        if(current === "구매실행" && currentPageName !== current) {
            setCurrentPageName(current)
        }
    }, [currentPageName]);
    

    // useEffect(() => {
    //         setRunMgmt([]); //테이블 초기화
    // }, [projectInfo]);

    const fetchAllData = async (condition) => {
        const data = await axiosFetch("/api/baseInfrm/product/buyIngInfoExe/totalListAll.do", condition);
        console.log("구매data:", data, "condition:", condition);
        data ? setRunMgmt(changeData(data)) : setRunMgmt([]);
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
                const newCondition = { poiId: value.poiId, modeCode: "EXECUTE" };
                fetchAllData(newCondition);
                return newCondition;
            }
            return prev; 
        });
    }

    return (
        <>
            <Location pathList={locationPath.PurchasingMgmt} />
            <ApprovalFormExe viewPageName={current} returnData={conditionInfo}/>
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
                    columns={columns.purchasingMgmt.run}
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
