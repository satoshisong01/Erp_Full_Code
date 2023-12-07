import React, { useContext, useEffect, useRef, useState } from "react";
import BuyMgmts from "./BuyMgmt/BuyMgmts";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import DataTable from "components/DataTable/DataTable";
import { locationPath } from "constants/locationPath";
import { PageContext } from "components/PageProvider";
import { axiosFetch } from "api/axiosFetch";
import ReactDataTable from "components/DataTable/ReactDataTable";
import ApprovalForm from "components/form/ApprovalForm";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import ReactDataTableView from "components/DataTable/ReactDataTableView";
import RefreshButton from "components/button/RefreshButton";
import ReactDataTablePdorder from "components/DataTable/ReactDataTablePdorder";
import { columns } from "constants/columns";

/** 실행관리-구매관리 */
function PurchasingMgmtPlan() {
    const {
        currentPageName,
        innerPageName,
        setInnerPageName,
        setCurrentPageName,
        setPrevInnerPageName,
        isSaveFormTable,
        setIsSaveFormTable,
        projectInfo,
        setProjectInfo,
        projectItem,
    } = useContext(PageContext);

    useEffect(() => {
        setInnerPageName("구매 조회관리");
        setCurrentPageName(""); //inner와 pageName은 동시에 사용 X

        return () => {
            setProjectInfo({});
        };
    }, []);

    const orderPlanMgmtTable1 = useRef(null);
    const orderPlanMgmtTable2 = useRef(null);
    const orderPlanMgmtTable3 = useRef(null);
    const orderPlanMgmtTable4 = useRef(null);

    const [isClicked, setIsClicked] = useState(false);
    const [isClicked2, setIsClicked2] = useState(false);
    const [isClicked3, setIsClicked3] = useState(false);
    const [isClicked4, setIsClicked4] = useState(false);

    const [poiIdToSend, setPoiIdToSend] = useState();

    const sendPoiId = (poiId) => {
        setPoiIdToSend(poiId);
    };

    const handleClick1 = () => {
        setIsClicked(!isClicked);
    };

    const handleClick2 = () => {
        setIsClicked2(!isClicked2);
    };

    const handleClick3 = () => {
        setIsClicked3(!isClicked3);
    };
    const handleClick4 = () => {
        setIsClicked4(!isClicked4);
    };

    const refresh = () => {
        fetchData();
    };

    const [returnKeyWord, setReturnKeyWord] = useState("");

    const [inquiryMgmt, setInquiryMgmt] = useState([]); // 구매 조회관리
    const [pgBudgetMgmt, setPgBudgetMgmt] = useState([]); // 구매 수주관리
    const [budgetMgmt, setBudgetMgmt] = useState([]); // 구매 예산관리
    const [runMgmt, setRunMgmt] = useState([]); // 구매 실행관리

    useEffect(() => {
        if (projectInfo.poiId && projectInfo.poId) {
            //구매종류를 선택 했을 때
            fetchData();
        }
        if (projectInfo.poId === undefined || projectInfo.poId === "") {
            //테이블 초기화
            setInquiryMgmt([]);
            setPgBudgetMgmt([]);
            setBudgetMgmt([]);
            setRunMgmt([]);
        }
        if (currentPageName === "구매관리") {
            const activeTab = document.querySelector(".mini_board_4 .tab li a.on");
            const activeTabText = activeTab.textContent;
            setInnerPageName(activeTabText); //마지막으로 활성화 된 탭
        }
    }, [currentPageName, innerPageName, projectInfo]);

    const changeTabs = (task) => {
        if (task !== innerPageName) {
            //다른 페이지의 버튼 변경 막기
            setIsSaveFormTable(true);
        }
        setInnerPageName((prev) => {
            setCurrentPageName("");
            setPrevInnerPageName(prev);
            return task;
        });
    };

    const fetchData = async () => {
        try {
            if (innerPageName === "구매 조회관리") {
                const data = await axiosFetch("/api/baseInfrm/product/buyIngInfo/totalListAll.do", { poiId: poiIdToSend, poId: projectInfo.poId });
                data ? setInquiryMgmt(changeData(data)) : setInquiryMgmt([]);
            } else if (innerPageName === "구매 수주관리") {
                const data = await axiosFetch("/api/baseInfrm/product/buyIngInfo/totalListAll.do", {
                    poiId: projectInfo.poiId,
                    modeCode: "EXDR",
                    poId: projectInfo.poId,
                });
                data ? setPgBudgetMgmt(changeData(data)) : setPgBudgetMgmt([]);
            } else if (innerPageName === "구매 예산관리") {
                const data = await axiosFetch("/api/baseInfrm/product/buyIngInfo/totalListAll.do", {
                    poiId: projectInfo.poiId,
                    modeCode: "EXCP",
                    poId: projectInfo.poId,
                });
                data ? setBudgetMgmt(changeData(data)) : setBudgetMgmt([]);
            } else if (innerPageName === "구매 실행관리") {
                const data = await axiosFetch("/api/baseInfrm/product/buyIngInfo/totalListAll.do", {
                    poiId: projectInfo.poiId,
                    modeCode: "EXCU",
                    poId: projectInfo.poId,
                });
                data ? setRunMgmt(changeData(data)) : setRunMgmt([]);
            }
        } catch (error) {
            console.error("데이터를 가져오는 중에 오류 발생:", error);
        }
    };

    const handleReturn = (value) => {
        setReturnKeyWord(value);
    };

    const changeData = (data) => {
        const updateData = data.map((data) => ({ ...data, price: data.byUnitPrice * data.byQunty }));
        return updateData;
    };

    return (
        <>
            <Location pathList={locationPath.PurchasingMgmt} />
            <div className="common_board_style mini_board_4">
                <ul className="tab">
                    <li onClick={() => changeTabs("구매 조회관리")}>
                        <a href="#구매 조회관리" className="on">
                            구매 조회관리
                        </a>
                    </li>
                    <li onClick={() => changeTabs("구매 수주관리")}>
                        <a href="#구매 수주관리">구매 수주관리</a>
                    </li>
                    <li onClick={() => changeTabs("구매 예산관리")}>
                        <a href="#구매 예산관리">구매 예산관리</a>
                    </li>
                    <li onClick={() => changeTabs("구매 실행관리")}>
                        <a href="#구매 실행관리">구매 실행관리</a>
                    </li>








                </ul>

                <div className="list">
                    <div className="first">
                        <ul>
                            {/* <SearchList conditionList={columns.purchasingMgmt.condition} onSearch={handleReturn} /> */}
                            <div className={`buttonBody  ${isClicked ? "" : "clicked"}`}>
                                <button className="arrowBtnStyle" style={{ zIndex: "999" }} onClick={handleClick1}>
                                    <FontAwesomeIcon className={`arrowBtn ${isClicked ? "" : "clicked"}`} icon={faArrowUp} />
                                </button>
                            </div>
                            <div className={`hideDivRun ${isClicked ? "" : "clicked"}`}>
                                <ReactDataTableView
                                    sendPoiId={sendPoiId}
                                    columns={columns.purchasingMgmt.project}
                                    customDatas={projectItem}
                                    defaultPageSize={5}
                                />
                            </div>
                            <div className="table-buttons">
                                <RefreshButton onClick={refresh} />
                            </div>
                            <ReactDataTable
                                viewPageName="구매 조회관리"
                                columns={columns.purchasingMgmt.inquiry}
                                testTask={true}
                                tableRef={orderPlanMgmtTable1}
                                customDatas={inquiryMgmt}
                                customDatasRefresh={refresh}
                                hideCheckBox={true}
                                editing={false}
                            />
                        </ul>
                    </div>
                    <div className="second">
                        <ul>
                            <ApprovalForm title={innerPageName + " 등록"} />
                            {/* <div className={`buttonBody  ${isClicked2 ? "" : "clicked"}`}>
                                <button className="arrowBtnStyle" style={{ zIndex: "999" }} onClick={handleClick2}>
                                    <FontAwesomeIcon className={`arrowBtn ${isClicked2 ? "" : "clicked"}`} icon={faArrowUp} />
                                </button>
                            </div> */}
                            {/* <div className={`hideDivRun2 ${isClicked2 ? "" : "clicked"}`}>
                                <ReactDataTableView columns={columns.purchasingMgmt.project} customDatas={projectItem} defaultPageSize={5} justColumn={true} />
                            </div> */}
                            <div className="table-buttons">
                                <RefreshButton onClick={refresh} />
                            </div>
                            <ReactDataTablePdorder
                                singleUrl="/baseInfrm/product/buyIngInfo"
                                columns={columns.purchasingMgmt.budget}
                                tableRef={orderPlanMgmtTable2}
                                customDatas={pgBudgetMgmt}
                                viewPageName="구매 수주관리"
                                customDatasRefresh={refresh}
                                hideCheckBox={true}
                            />
                        </ul>
                    </div>
                    <div className="third">
                        <ul>
                            <ApprovalForm title={innerPageName + " 등록"} />
                            {/* <div className={`buttonBody  ${isClicked3 ? "" : "clicked"}`}>
                                <button className="arrowBtnStyle" style={{ zIndex: "999" }} onClick={handleClick3}>
                                    <FontAwesomeIcon className={`arrowBtn ${isClicked3 ? "" : "clicked"}`} icon={faArrowUp} />
                                </button>
                            </div> */}
                            {/* <div className={`hideDivRun3 ${isClicked3 ? "" : "clicked"}`}>
                                <ReactDataTableView columns={columns.purchasingMgmt.project} defaultPageSize={5} justColumn={true} />
                            </div> */}
                            <div className="table-buttons">
                                <RefreshButton onClick={refresh} />
                            </div>
                            <ReactDataTablePdorder
                                singleUrl="/baseInfrm/product/buyIngInfo"
                                columns={columns.purchasingMgmt.budget}
                                tableRef={orderPlanMgmtTable3}
                                customDatas={budgetMgmt}
                                viewPageName="구매 예산관리"
                                customDatasRefresh={refresh}
                                hideCheckBox={true}
                            />
                        </ul>
                    </div>

                    <div className="fourth">
                        <ul>
                            <ApprovalForm title={innerPageName + " 등록"} />
                            {/* <div className={`buttonBody  ${isClicked4 ? "" : "clicked"}`}>
                                <button className="arrowBtnStyle" style={{ zIndex: "999" }} onClick={handleClick4}>
                                    <FontAwesomeIcon className={`arrowBtn ${isClicked4 ? "" : "clicked"}`} icon={faArrowUp} />
                                </button>
                            </div>
                            <div className={`hideDivRun4 ${isClicked4 ? "" : "clicked"}`}>
                                <ReactDataTableView columns={columns.purchasingMgmt.project} defaultPageSize={5} justColumn={true} />
                            </div>
                            <div className="table-buttons">
                                <RefreshButton onClick={refresh} />
                            </div> */}
                            <ReactDataTablePdorder
                                singleUrl="/baseInfrm/product/buyIngInfo"
                                columns={columns.purchasingMgmt.run}
                                tableRef={orderPlanMgmtTable4}
                                customDatas={runMgmt}
                                viewPageName="구매 실행관리"
                                customDatasRefresh={refresh}
                                hideCheckBox={true}
                            />
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}

export default PurchasingMgmtPlan;
