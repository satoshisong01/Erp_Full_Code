import React, { useContext, useEffect, useState } from "react";
import Location from "components/Location/Location";
import { locationPath } from "constants/locationPath";
import { PageContext } from "components/PageProvider";
import ApprovalFormSal from "components/form/ApprovalFormSal";
import HideCard from "components/HideCard";
import RefreshButton from "components/button/RefreshButton";
import ReactDataTableURL from "components/DataTable/ReactDataTableURL";
import { columns } from "constants/columns";

/** 영업관리-견적서관리 */
function Quotation() {
    const { currentPageName, innerPageName, setPrevInnerPageName, setInnerPageName, setCurrentPageName, setNameOfButton } = useContext(PageContext);
    const [infoList, setInfoList] = useState([{ name: "수주인건비", id: "orderLabor" }, { name: "수주구매비", id: "orderBuying" }]);
    const [condition, setCondition] = useState({});

    useEffect(() => {
        if (currentPageName.id === "OrderPlanMgmt") {
            const activeTab = document.querySelector(".mini_board_3 .tab li a.on"); //마지막으로 활성화 된 탭
            if (activeTab) {
                const activeTabInfo = infoList.find((data) => data.name === activeTab.textContent);
                setInnerPageName({ ...activeTabInfo });
                setCurrentPageName({});
                // fetchAllData();
            }
        }
    }, [currentPageName]);

    const changeTabs = (name, id) => {
        setInnerPageName((prev) => {
            setPrevInnerPageName({ ...prev });
            return { name, id };
        });
        setCurrentPageName({});
    };

    const conditionInfo = (value) => {
        // console.log("🎄컨디션:", value);
        // setCondition((prev) => {
        //     if (prev.poiId !== value.poiId) {
        //         const newCondition = { ...value };
        //         fetchAllData(newCondition);
        //         return newCondition;
        //     } else {
        //         fetchAllData({ ...prev });
        //         return prev;
        //     }
        // });
    };

    const refresh = () => {
        // if (condition.poiId && condition.versionId) {
        //     fetchAllData(condition);
        // } else {
        //     fetchAllData();
        // }
    };

    return (
        <>
            <Location pathList={locationPath.Quotation} />
            <div className="common_board_style mini_board_3">
                <ul className="tab">
                    <li onClick={() => changeTabs("수주인건비", "orderLabor")}>
                        <a href="#견적용 인건비" className="on">견적용 인건비</a>
                    </li>
                    <li onClick={() => changeTabs("수주구매비", "orderBuying")}>
                        <a href="#견적용 구매비">견적용 구매비</a>
                    </li>
                </ul>
                <div className="list">
                        <div className="first">
                            <ul>
                                <ApprovalFormSal returnData={conditionInfo} initial={condition} />
                                <HideCard title="합계" color="back-lightblue" className="mg-b-40">
                                </HideCard>
                                <HideCard title="계획 등록/수정" color="back-lightblue">
                                    <div className="table-buttons mg-t-10 mg-b-10">
                                        <RefreshButton onClick={refresh} />
                                    </div>
                                    <ReactDataTableURL
                                        editing={true}
                                        columns={columns.orderPlanMgmt.estimateLabor}
                                        // customDatas={generalExpensesDatas}
                                        viewPageName={{ name: "수주인건비", id: "orderLabor" }}
                                        customDatasRefresh={refresh}
                                        condition={condition}
                                    />
                                </HideCard>
                            </ul>
                        </div>
                        <div className="second">
                            <ul>
                                <ApprovalFormSal returnData={conditionInfo} initial={condition} />
                                <HideCard title="합계" color="back-lightblue" className="mg-b-40">
                                </HideCard>
                                <HideCard title="계획 등록/수정" color="back-lightblue">
                                    <div className="table-buttons mg-t-10 mg-b-10">
                                        <RefreshButton onClick={refresh} />
                                    </div>
                                    <ReactDataTableURL
                                        editing={true}
                                        columns={columns.orderPlanMgmt.estimatePurchase}
                                        suffixUrl="/baseInfrm/product/pjbudget"
                                        // customDatas={generalExpensesDatas}
                                        viewPageName={{ name: "수주구매비", id: "orderBuying" }}
                                        customDatasRefresh={refresh}
                                        condition={condition}
                                    />
                                </HideCard>
                            </ul>
                        </div>
                </div>
            </div>

        </>
    );
}

export default Quotation;
