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

/** 실행관리-구매-계획 */
function PurchasingMgmtPlan() {
    const {
        currentPageName,
        innerPageName,
        setInnerPageName,
        setCurrentPageName,
        setPrevInnerPageName,
        setIsSaveFormTable,
        projectInfo,
        setProjectInfo,
    } = useContext(PageContext);

    useEffect(() => {
        setInnerPageName("구매 조회관리");
        setCurrentPageName(""); //inner와 pageName은 동시에 사용 X

        return () => {
            setProjectInfo({});
        };
    }, []);

    const orderPlanMgmtTable3 = useRef(null);

    const refresh = () => {
        fetchData();
    };

    const [budgetMgmt, setBudgetMgmt] = useState([]); // 구매 예산관리

    useEffect(() => {
        if (projectInfo.poiId && projectInfo.poId) {
            //구매종류를 선택 했을 때
            fetchData();
        }
        if (projectInfo.poId === undefined || projectInfo.poId === "") {
            //테이블 초기화
            setBudgetMgmt([]);
        }
    }, [currentPageName, innerPageName, projectInfo]);

    const fetchData = async () => {
        try {
            const data = await axiosFetch("/api/baseInfrm/product/buyIngInfo/totalListAll.do", {
                poiId: projectInfo.poiId,
                modeCode: "EXCP",
                poId: projectInfo.poId,
            });
            data ? setBudgetMgmt(changeData(data)) : setBudgetMgmt([]);
        } catch (error) {
            console.error("데이터를 가져오는 중에 오류 발생:", error);
        }
    };

    const changeData = (data) => {
        const updateData = data.map((data) => ({ ...data, price: data.byUnitPrice * data.byQunty }));
        return updateData;
    };

    return (
        <>
            <Location pathList={locationPath.PurchasingMgmt} />
            <ApprovalFormExe viewPageName="실행구매" />
            <HideCard title="계획 조회" color="back-gray" className="mg-b-40">
            </HideCard>
            <HideCard title="합계" color="back-lightyellow" className="mg-b-40">
            </HideCard>
            <HideCard title="계획 등록/수정" color="back-lightblue">
                <div className="table-buttons mg-b-m-30">
                    <RefreshButton onClick={refresh} />
                </div>
                <ReactDataTablePdorder
                    singleUrl="/baseInfrm/product/buyIngInfo"
                    columns={columns.purchasingMgmt.budget}
                    tableRef={orderPlanMgmtTable3}
                    customDatas={budgetMgmt}
                    viewPageName="실행구매"
                    customDatasRefresh={refresh}
                    hideCheckBox={true}
                />
            </HideCard>
        </>
    );
}

export default PurchasingMgmtPlan;
