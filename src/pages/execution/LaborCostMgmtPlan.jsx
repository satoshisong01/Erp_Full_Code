import React, { useContext, useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import { locationPath } from "constants/locationPath";
import ReactDataTable from "components/DataTable/ReactDataTable";
import { axiosDelete, axiosFetch, axiosPost, axiosUpdate } from "api/axiosFetch";
import { PageContext } from "components/PageProvider";
import { columns } from "constants/columns";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import RefreshButton from "components/button/RefreshButton";
import ApprovalFormExe from "components/form/ApprovalFormExe";
import HideCard from "components/HideCard";
import SaveButton from "components/button/SaveButton";
import ReactDataTableView from "components/DataTable/ReactDataTableView";
import { ChangePrmnPlanData } from "components/DataTable/function/ReplaceDataFormat";

/** 실행관리-인건비-계획 */
function LaborCostMgmtPlan() {
    const {
        innerPageName,
        setCurrentPageName,
        setInnerPageName,
        projectInfo,
        setProjectInfo,
        // viewSetPoiId,
        unitPriceList,
        currentPageName,
        unitPriceListRenew,
        setNameOfButton,
    } = useContext(PageContext);

    useEffect(() => {
        setInnerPageName("실행인건비계획");
        setCurrentPageName(""); //inner와 pageName은 동시에 사용 X

        return () => {
            setProjectInfo({});
        };
    }, []);

    const orderPlanMgmtTable3 = useRef(null);

    const [isClicked3, setIsClicked3] = useState(false);
    const [poiIdToSend, setPoiIdToSend] = useState();

    useEffect(() => {
        console.log(poiIdToSend, "poiIdToSend");
        fetchData();
    }, [poiIdToSend]);

    const handleClick3 = () => {
        setIsClicked3(!isClicked3);
    };

    const [budgetMgmt, setBudgetMgmt] = useState([]); // 실행인건비계획
    const [budgetMgmtView, setBudgetMgmtView] = useState([]); // 실행인건비계획

    useEffect(() => {
        if (projectInfo.poiId === undefined || projectInfo.poId === "") {
            //테이블 초기화
            setBudgetMgmt([]);
        }
    }, [currentPageName, innerPageName, projectInfo]);

    const refresh = () => {
        fetchData();
    };

    const fetchData = async () => {
        try {
            if (innerPageName === "실행인건비계획") {
                console.log("unitPriceList", unitPriceList);
                console.log("unitPriceListRenew", unitPriceListRenew);
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
            }
        } catch (error) {
            console.error("데이터를 가져오는 중에 오류 발생:", error);
        }
    };

    useEffect(() => {
        setBudgetMgmt([]);
        fetchData();
    }, [innerPageName, projectInfo]);

    const fetchAllData = async () => {
        const requestSearch = {
            poiId: projectInfo.poiId,
            poiNm: projectInfo.poiNm,
            useAt: "Y",
            typeCode: "MM",
            modeCode: "BUDGET",
        };

        const choiceData = {
            poiId: projectInfo.poiId,
            versionId: 91,
        };

        const resultData = await axiosFetch("/api/baseInfrm/product/prstmCost/totalListAll.do", requestSearch);
        const viewResult = await axiosFetch("/api/baseInfrm/product/prmnPlan/totalListAll.do", choiceData);
        setBudgetMgmtView(ChangePrmnPlanData(viewResult));
        if (resultData) {
            console.log("get data success:)");
            return resultData;
        } else {
            console.log("get data fail:(");
            return []; // 빈 배열 보내주기
        }
    };

    const compareData = (originData, updatedData) => {
        const filterData = updatedData.filter((data) => data.poiId); //pgNm 없는 데이터 제외
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
                const typeCode = { typeCode: "MM" };
                const modeCode = { modeCode: "BUDGET" };
                toAdds.push({ ...filterData[i], ...add, ...typeCode, ...modeCode });
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

    return (
        <>
            <Location pathList={locationPath.LaborCostMgmt} />
            <ApprovalFormExe viewPageName="실행인건비계획" returnData={fetchAllData} />
            <HideCard title="계획 조회" color="back-gray" className="mg-b-40">
                <ReactDataTable columns={columns.orderPlanMgmt.labor} customDatas={budgetMgmtView} defaultPageSize={5} hideCheckBox={true} />
            </HideCard>
            <HideCard title="합계" color="back-lightyellow" className="mg-b-40"></HideCard>
            <HideCard title="계획 등록/수정" color="back-lightblue">
                <div className="table-buttons mg-b-m-30">
                    <SaveButton label={"저장"} onClick={() => setNameOfButton("save")} />
                    <RefreshButton onClick={refresh} />
                </div>
                <ReactDataTable
                    editing={true}
                    columns={columns.laborCostMgmt.budget}
                    tableRef={orderPlanMgmtTable3}
                    customDatas={budgetMgmt}
                    viewPageName="실행인건비계획"
                    returnList={compareData}
                    //hideCheckBox={true}
                />
            </HideCard>
        </>
    );
}

export default LaborCostMgmtPlan;
