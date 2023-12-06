import React, { useContext, useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import { locationPath } from "constants/locationPath";
import ReactDataTable from "components/DataTable/ReactDataTable";
import { axiosDelete, axiosFetch, axiosPost, axiosUpdate } from "api/axiosFetch";
import { PageContext } from "components/PageProvider";
import ApprovalForm from "components/form/ApprovalForm";
import { columns } from "constants/columns";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import ReactDataTableView from "components/DataTable/ReactDataTableView";
import { ChangePrmnPlanData } from "components/DataTable/function/ChangePrmnPlanData";
import RefreshButton from "components/button/RefreshButton";

/** 실행관리-인건비관리 */
function LaborCostMgmt() {
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

    useEffect(() => {
        setInnerPageName("인건비 조회관리");
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

    useEffect(() => {
        console.log(poiIdToSend, "poiIdToSend");
        fetchData();
    }, [poiIdToSend]);

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

    // const [returnKeyWord, setReturnKeyWord] = useState("");

    const [inquiryMgmt, setInquiryMgmt] = useState([]); // 인건비 조회관리
    const [saleCostView, setSaleCostView] = useState([]); //영업 인건비 띄우기
    const [pgBudgetMgmt, setPgBudgetMgmt] = useState([]); // 인건비 수주관리
    const [pgBudgetView, setPgBudgetView] = useState([]); //(실행) 수주띄우기
    const [budgetMgmt, setBudgetMgmt] = useState([]); // 인건비 예산관리
    const [budgetView, setBudgetView] = useState([]); //(실행) 예산띄우기
    const [runMgmt, setRunMgmt] = useState([]); // 인건비 실행관리

    useEffect(() => {
        if (projectInfo.poiId === undefined || projectInfo.poId === "") {
            //테이블 초기화
            setInquiryMgmt([]);
            setPgBudgetMgmt([]);
            setBudgetMgmt([]);
            setRunMgmt([]);
        }
        if (currentPageName === "인건비관리") {
            const activeTab = document.querySelector(".mini_board_5 .tab li a.on");
            const activeTabText = activeTab.textContent;
            setInnerPageName(activeTabText); //마지막으로 활성화 된 탭
        }
    }, [currentPageName, innerPageName, projectInfo]);

    const refresh = () => {
        fetchData();
    };

    //인건비 수주, 예산, 실행 표기
    const mapPecModeCodeToText = (data) => {
        for (let i = 0; i < data.length; i++) {
            switch (data[i].pecModeCode) {
                case "PDVSN01":
                    data[i].pecModeCode = "수주";
                    break;
                case "PDVSN02":
                    data[i].pecModeCode = "예산";
                    break;
                case "PDVSN03":
                    data[i].pecModeCode = "실행";
                    break;
                default:
                    return;
            }
        }
        return data;
    };

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
            if (innerPageName === "인건비 조회관리") {
                const datas = await fetchAllData("/api/baseInfrm/product/prstmCost/totalListAll.do", innerPageName); // 인건비 조회관리
                const updatedData = mapPecModeCodeToText(datas);
                setInquiryMgmt(updatedData);
            } else if (innerPageName === "인건비 수주관리") {
                const datas = await fetchAllData("/api/baseInfrm/product/prstmCost/totalListAll.do", innerPageName); // 인건비 수주관리
                const updatedDatas = datas.map((data) => {
                    const price = data.pecMm * data.pecUnitPrice;
                    return { ...data, price: price };
                });
                setPgBudgetMgmt(updatedDatas);
                const dataView = await fetchAllDataView("/api/baseInfrm/product/prmnPlan/totalListAll.do", innerPageName);
                setSaleCostView(ChangePrmnPlanData(dataView, projectInfo));
            } else if (innerPageName === "인건비 예산관리") {
                const datas = await fetchAllData("/api/baseInfrm/product/prstmCost/totalListAll.do", innerPageName); // 인건비 예산관리
                if (unitPriceList && datas) {
                    const updatedDatas = datas.map((data) => {
                        const unit = unitPriceList.find((unit) => data.pecPosition === unit.guppName && unit.gupDesc === new Date().getFullYear());
                        if (unit) {
                            const price = unit ? data.pecMm * unit.gupPrice : 0; // 적절한 기본값 사용
                            return { ...data, price: price, positionPrice: unit.gupPrice };
                        } else {
                            return { ...data, price: 0, positionPrice: 0 };
                        }
                    });
                    setBudgetMgmt(updatedDatas);
                }
                const dataView = await fetchAllDataView("/api/baseInfrm/product/prstmCost/totalListAll.do", innerPageName);
                setPgBudgetView(dataView);
            } else if (innerPageName === "인건비 실행관리") {
                const datas = await fetchAllData("/api/baseInfrm/product/prstmCost/totalListAll.do", innerPageName); // 인건비 실행관리
                if (unitPriceList && datas) {
                    const updatedDatas = datas.map((data) => {
                        const unit = unitPriceList.find((unit) => data.pecPosition === unit.guppName && unit.gupDesc === new Date().getFullYear());
                        if (unit) {
                            const price = unit ? data.pecMm * unit.gupPrice : 0; // 적절한 기본값 사용
                            return { ...data, price: price, positionPrice: unit.gupPrice };
                        } else {
                            return { ...data, price: 0, positionPrice: 0 };
                        }
                    });
                    setRunMgmt(updatedDatas);
                }
                const dataView = await fetchAllDataView("/api/baseInfrm/product/prstmCost/totalListAll.do", innerPageName);
                setBudgetView(dataView);
            }
        } catch (error) {
            console.error("데이터를 가져오는 중에 오류 발생:", error);
        }
    };

    useEffect(() => {
        setInquiryMgmt([]); //초기화
        setSaleCostView([]);
        setPgBudgetMgmt([]);
        setPgBudgetView([]);
        setBudgetMgmt([]);
        setBudgetView([]);
        setRunMgmt([]);

        fetchData();
    }, [innerPageName, projectInfo]);

    const fetchAllData = async (url, currentTask) => {
        let requestData = { poiId: poiIdToSend || projectInfo.poiId, useAt: "Y", pecTypeCode: "MM", pecSlsExcCode: "PEXC" };
        if (currentTask === "인건비 조회관리") {
            requestData = { poiId: poiIdToSend || projectInfo.poiId, useAt: "Y", pecTypeCode: "MM", pecSlsExcCode: "PEXC" };
        } else if (currentTask === "인건비 수주관리") {
            requestData = {
                poiId: projectInfo.poiId,
                pecSlsExcCode: "PEXC",
                pecTypeCode: "MM",
                useAt: "Y",
                pecModeCode: "PDVSN01",
            };
        } else if (currentTask === "인건비 예산관리") {
            requestData = {
                poiId: projectInfo.poiId,
                pecSlsExcCode: "PEXC",
                pecTypeCode: "MM",
                useAt: "Y",
                pecModeCode: "PDVSN02",
            };
        } else if (currentTask === "인건비 실행관리") {
            requestData = {
                poiId: projectInfo.poiId,
                pecSlsExcCode: "PEXC",
                pecTypeCode: "MM",
                useAt: "Y",
                pecModeCode: "PDVSN03",
            };
        }

        const resultData = await axiosFetch(url, requestData);
        console.log(resultData, "resultData나오나");
        if (resultData) {
            console.log("get data success:)");
            return resultData;
        } else {
            console.log("get data fail:(");
            return []; // 빈 배열 보내주기
        }
    };

    const fetchAllDataView = async (url, currentTask) => {
        let requestData = { poiId: projectInfo.poiId };

        if (currentTask === "인건비 수주관리") {
            requestData = {
                poiId: projectInfo.poiId,
                modeCode: "SLSP",
                useAt: "Y",
            };
            //예산관리에서 수주관리 뷰 띄우기
        } else if (currentTask === "인건비 예산관리") {
            requestData = {
                poiId: projectInfo.poiId,
                pecSlsExcCode: "PEXC",
                pecTypeCode: "MM",
                useAt: "Y",
                pecModeCode: "PDVSN01",
            };
            //실행에서 예산 뷰 띄우가
        } else if (currentTask === "인건비 실행관리") {
            requestData = {
                poiId: projectInfo.poiId,
                pecSlsExcCode: "PEXC",
                pecTypeCode: "MM",
                useAt: "Y",
                pecModeCode: "PDVSN02",
            };
        } else {
            return;
        }

        const resultData = await axiosFetch(url, requestData);
        if (resultData) {
            return resultData;
        } else {
            return [];
        }
    };

    const handleReturn = (value) => {
        // setReturnKeyWord(value);
    };

    const compareData = (originData, updatedData) => {
        const filterData = updatedData.filter((data) => data.pgNm); //pgNm 없는 데이터 제외
        const originDataLength = originData ? originData.length : 0;
        const updatedDataLength = filterData ? filterData.length : 0;

        if (originDataLength > updatedDataLength) {
            const updateDataInOrigin = (originData, updatedData) => {
                // 복제하여 새로운 배열 생성
                const updatedArray = [...originData];
                // updatedData의 길이만큼 반복하여 originData 갱신
                for (let i = 0; i < Math.min(updatedData.length, originData.length); i++) {
                    const updatedItem = updatedData[i];
                    updatedArray[i] = { ...updatedItem, pecId: updatedArray[i].pecId };
                }
                return updatedArray;
            };

            const firstRowUpdate = updateDataInOrigin(originData, updatedData);
            updateList(firstRowUpdate);

            const toDelete = [];
            for (let i = updatedDataLength; i < originDataLength; i++) {
                toDelete.push(originData[i].pecId);
            }
            deleteList(toDelete);
        } else if (originDataLength === updatedDataLength) {
            updateList(filterData);
        } else if (originDataLength < updatedDataLength) {
            const toAdds = [];
            const addUpdate = [];
            for (let i = 0; i < originDataLength; i++) {
                addUpdate.push(filterData[i]);
            }
            updateList(addUpdate);

            for (let i = originDataLength; i < updatedDataLength; i++) {
                const add = { poiId: poiIdToSend || projectInfo.poiId };
                const addType = { pecTypeCode: "MM" };
                const addMode = { pecSlsExcCode: "PEXC" };
                let addExCode = { pecModeCode: "PDVSN01" };
                if (innerPageName === "인건비 수주관리") {
                    addExCode = { pecModeCode: "PDVSN01" };
                } else if (innerPageName === "인건비 예산관리") {
                    addExCode = { pecModeCode: "PDVSN02" };
                } else if (innerPageName === "인건비 실행관리") {
                    addExCode = { pecModeCode: "PDVSN03" };
                }
                toAdds.push({ ...filterData[i], ...add, ...addType, ...addMode, ...addExCode });
            }
            addList(toAdds);
        }
    };

    const addList = async (addNewData) => {
        console.log("❗addList:", addNewData);
        const url = `/api/baseInfrm/product/prstmCost/addList.do`;
        const resultData = await axiosPost(url, addNewData);
        refresh();
    };
    const updateList = async (toUpdate) => {
        console.log("❗updateList:", toUpdate);
        const updatedFilterData = toUpdate.map((data) => ({
            ...data,
            useAt: "Y",
            deleteAt: "N",
        }));
        const url = `/api/baseInfrm/product/prstmCost/editList.do`;
        const resultData = await axiosUpdate(url, updatedFilterData);
        refresh();
    };

    const deleteList = async (removeItem) => {
        console.log("❗deleteList:", removeItem);
        const url = `/api/baseInfrm/product/prstmCost/removeAll.do`;
        const resultData = await axiosDelete(url, removeItem);
        refresh();
    };

    console.log(runMgmt, "runMgmt");

    return (
        <>
            <Location pathList={locationPath.LaborCostMgmt} />
            <div className="common_board_style mini_board_5">
                <ul className="tab">
                    <li onClick={() => changeTabs("인건비 조회관리")}>
                        <a href="#인건비 조회관리" className="on">
                            인건비 조회관리
                        </a>
                    </li>
                    <li onClick={() => changeTabs("인건비 수주관리")}>
                        <a href="#인건비 수주관리">인건비 수주관리</a>
                    </li>
                    <li onClick={() => changeTabs("인건비 예산관리")}>
                        <a href="#인건비 예산관리">인건비 예산관리</a>
                    </li>
                    <li onClick={() => changeTabs("인건비 실행관리")}>
                        <a href="#인건비 실행관리">인건비 실행관리</a>
                    </li>
                </ul>

                <div className="list">
                    <div className="first">
                        <ul>
                            <SearchList conditionList={columns.laborCostMgmt.condition} onSearch={handleReturn} />
                            <div className={`buttonBody ${isClicked ? "" : "clicked"}`}>
                                <button className="arrowBtnStyle" style={{ zIndex: "999" }} onClick={handleClick1}>
                                    <FontAwesomeIcon className={`arrowBtn ${isClicked ? "" : "clicked"}`} icon={faArrowUp} />
                                </button>
                            </div>
                            <div className={`hideDivRun ${isClicked ? "" : "clicked"}`}>
                                <ReactDataTableView
                                    sendPoiId={sendPoiId}
                                    columns={columns.laborCostMgmt.project}
                                    customDatas={projectItem}
                                    defaultPageSize={5}
                                    justColumn={true}
                                />
                            </div>
                            <div className="table-buttons">
                                <RefreshButton onClick={refresh} />
                            </div>
                            <ReactDataTable
                                columns={columns.laborCostMgmt.inquiry}
                                testTask={true}
                                tableRef={orderPlanMgmtTable1}
                                customDatas={inquiryMgmt}
                                viewPageName="인건비 조회관리"
                                customDatasRefresh={refresh}
                                hideCheckBox={true}
                                editing={false}
                            />
                        </ul>
                    </div>
                    <div className="second">
                        <ul>
                            <ApprovalForm title={innerPageName + " 등록"}>
                                <div className={`buttonBody ${isClicked2 ? "" : "clicked"}`}>
                                    <button className="arrowBtnStyle" style={{ zIndex: "999" }} onClick={handleClick2}>
                                        <FontAwesomeIcon className={`arrowBtn ${isClicked2 ? "" : "clicked"}`} icon={faArrowUp} />
                                    </button>
                                </div>
                                <div className={`hideDivRun2 ${isClicked2 ? "" : "clicked"}`}>
                                    <ReactDataTableView columns={columns.laborCostMgmt.sub} customDatas={saleCostView} defaultPageSize={5} />
                                </div>
                                <div className="table-buttons">
                                    <RefreshButton onClick={refresh} />
                                </div>
                                <ReactDataTable
                                    columns={columns.laborCostMgmt.orderPlan}
                                    singleUrl="/baseInfrm/product/prstmCost"
                                    tableRef={orderPlanMgmtTable2}
                                    customDatas={pgBudgetMgmt}
                                    viewPageName="인건비 수주관리"
                                    sendToParentTables={compareData}
                                    hideCheckBox={true}
                                />
                            </ApprovalForm>
                        </ul>
                    </div>
                    <div className="third">
                        <ul>
                            <ApprovalForm title={innerPageName + " 등록"}>
                                <div className={`buttonBody ${isClicked3 ? "" : "clicked"}`}>
                                    <button className="arrowBtnStyle" style={{ zIndex: "999" }} onClick={handleClick3}>
                                        <FontAwesomeIcon className={`arrowBtn ${isClicked3 ? "" : "clicked"}`} icon={faArrowUp} />
                                    </button>
                                </div>
                                <div className={`hideDivRun3 ${isClicked3 ? "" : "clicked"}`}>
                                    <ReactDataTableView columns={columns.laborCostMgmt.budgetView} customDatas={pgBudgetView} defaultPageSize={5} />
                                </div>
                                <div className="table-buttons">
                                    <RefreshButton onClick={refresh} />
                                </div>
                                <ReactDataTable
                                    columns={columns.laborCostMgmt.budget}
                                    tableRef={orderPlanMgmtTable3}
                                    customDatas={budgetMgmt}
                                    viewPageName="인건비 예산관리"
                                    sendToParentTables={compareData}
                                    hideCheckBox={true}
                                />
                            </ApprovalForm>
                        </ul>
                    </div>
                    <div className="fourth">
                        <ul>
                            <ApprovalForm title={innerPageName + " 등록"}>
                                <div className={`buttonBody ${isClicked4 ? "" : "clicked"}`}>
                                    <button className="arrowBtnStyle" style={{ zIndex: "999" }} onClick={handleClick4}>
                                        <FontAwesomeIcon className={`arrowBtn ${isClicked4 ? "" : "clicked"}`} icon={faArrowUp} />
                                    </button>
                                </div>
                                <div className={`hideDivRun4 ${isClicked4 ? "" : "clicked"}`}>
                                    <ReactDataTableView columns={columns.laborCostMgmt.budget} customDatas={budgetView} defaultPageSize={5} />
                                </div>
                                <div className="table-buttons">
                                    <RefreshButton onClick={refresh} />
                                </div>
                                <ReactDataTable
                                    columns={columns.laborCostMgmt.run}
                                    tableRef={orderPlanMgmtTable4}
                                    customDatas={runMgmt}
                                    viewPageName="인건비 실행관리"
                                    sendToParentTables={compareData}
                                    hideCheckBox={true}
                                />
                            </ApprovalForm>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LaborCostMgmt;
