import React, { useContext, useEffect, useState } from "react";
import Location from "components/Location/Location";
import { locationPath } from "constants/locationPath";
import ReactDataTable from "components/DataTable/ReactDataTable";
import { PageContext } from "components/PageProvider";
import { columns } from "constants/columns";
import RefreshButton from "components/button/RefreshButton";
import ApprovalFormExe from "components/form/ApprovalFormExe";
import HideCard from "components/HideCard";
import { axiosDelete, axiosFetch, axiosPost, axiosUpdate } from "api/axiosFetch";
import SaveButton from "components/button/SaveButton";
import { ChangePrmnPlanData } from "components/DataTable/function/ReplaceDataFormat";

/** 실행관리-인건비-실행 */
function LaborCostMgmtExe() {
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
        setNameOfButton,
        unitPriceListRenew,
    } = useContext(PageContext);

    const [condition, setCondition] = useState({});

    const current = "인건비실행";

    useEffect(() => {
        if (currentPageName === "인건비" && current === "인건비실행") {
            setCurrentPageName(current);
            setInnerPageName("");
        }
    }, [currentPageName]);

    const conditionInfo = (value) => {
        setCondition((prev) => {
            if (prev.poiId !== value.poiId) {
                const newCondition = { poiId: value.poiId, poiMonth: value.poiMonth, typeCode: "MM", modeCode: "EXECUTE" };
                fetchAllData(newCondition);
                return newCondition;
            }
            return prev;
        });
    };

    const refresh = () => {
        if (condition.poiId) {
            fetchAllData(condition);
        }
    };

    const [budgetMgmtRun, setBudgetMgmRun] = useState([]); // 실행인건비실행
    const [budgetMgmtView, setBudgetMgmtView] = useState([]); // 실행인건비실행
    const [budgetCal, setBudgetCal] = useState([]); // 합계

    useEffect(() => {
        if (condition.poiId === undefined || condition.poId === "") {
            //테이블 초기화
            setBudgetMgmRun([]);
        }
    }, [currentPageName, innerPageName, condition]);

    const fetchAllData = async (condition) => {
        const resultData = await axiosFetch("/api/baseInfrm/product/prstmCost/totalListAll.do", condition);
        const viewResult = await axiosFetch("/api/baseInfrm/product/prstmCost/totalListAll.do", {...condition, modeCode: "BUDGET"});
        const viewUpdatedDatas = calculation(unitPriceList, viewResult, condition.poiMonth);
        setBudgetMgmtView(viewUpdatedDatas);
        if (resultData && resultData.length > 0) {
            if(unitPriceList && unitPriceList.length > 0) {
                const updatedDatas = calculation(unitPriceList, resultData, condition.poiMonth);
                setBudgetMgmRun(updatedDatas);
                let mmTotal = 0;
                let priceTotal = 0;
                let price9 = 0;
                let price10 = 0;
                let price11 = 0;
                let price12 = 0;
                let price13 = 0;
                let price14 = 0;
                let mm9=0, mm10=0, mm11=0, mm12=0, mm13=0, mm14=0; 
                updatedDatas.map((data) => { //합계 계산
                    mmTotal += data.pecMm;
                    priceTotal += data.price;
                    if(data.pecPosition === "부장") {
                        mm9 += data.pecMm;
                        price9 += data.price;
                    } else if(data.pecPosition === "차장") {
                        mm10 += data.pecMm;
                        price10 += data.price;
                    } else if(data.pecPosition === "과장") {
                        mm11 += data.pecMm;
                        price11 += data.price;
                    } else if(data.pecPosition === "대리") {
                        mm12 += data.pecMm;
                        price12 += data.price;
                    } else if(data.pecPosition === "주임") {
                        mm13 += data.pecMm;
                        price13 += data.price;
                    } else if(data.pecPosition === "사원") {
                        mm14 += data.pecMm;
                        price14 += data.price;
                    }
                })
                setBudgetCal([{mmTotal: mmTotal+"(M/M)",price9,price10,price11,price12,price13,price14}]);
            }
        } else {
            alert('no data');
            setBudgetMgmRun([]);
        }
    };

    const calculation = (unitPriceList, resultData, month) => {
        const updatedDatas = resultData.map((data) => {
            const unit = unitPriceList.find((unit) => data.pecPosition === unit.guppName && unit.gupBaseDate === month);
            if (unit) {
                const price = unit ? data.pecMm * unit.gupPrice : 0; // 적절한 기본값 사용
                return { ...data, price: price, positionPrice: unit.gupPrice };
            } else {
                return { ...data, price: 0, positionPrice: 0 };
            }
        });
        return updatedDatas;
    }

    const compareData = (originData, updatedData) => {
        const filterData = updatedData.filter((data) => data.pgNm); //pgNm 없는 데이터 제외
        console.log("filterData:", filterData);
        const originDataLength = originData ? originData.length : 0;
        const updatedDataLength = filterData ? filterData.length : 0;

        if (originDataLength > updatedDataLength) {
            const updateDataInOrigin = (originData, filterData) => {
                // 복제하여 새로운 배열 생성
                const updatedArray = [...originData];
                // updatedData의 길이만큼 반복하여 originData 갱신
                for (let i = 0; i < Math.min(filterData.length, originData.length); i++) {
                    const updatedItem = filterData[i];
                    updatedArray[i] = { ...updatedItem, pecId: updatedArray[i].pecId };
                }
                return updatedArray;
            };

            const firstRowUpdate = updateDataInOrigin(originData, filterData);
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
                const add = { poiId: condition.poiId };
                const typeCode = { typeCode: "MM" };
                const modeCode = { modeCode: "EXECUTE" };
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
            <ApprovalFormExe viewPageName="인건비실행" returnData={conditionInfo} />
            <HideCard title="계획 조회" color="back-gray" className="mg-b-40">
                <ReactDataTable columns={columns.laborCostMgmt.budget} customDatas={budgetMgmtView} defaultPageSize={5} hideCheckBox={true} />
            </HideCard>
            <HideCard title="합계" color="back-lightyellow" className="mg-b-40">
                <ReactDataTable columns={columns.laborCostMgmt.budgetView} customDatas={budgetCal} defaultPageSize={5} hideCheckBox={true} />
            </HideCard>
            <HideCard title="등록/수정" color="back-lightblue">
                <div className="table-buttons mg-b-m-30">
                    <SaveButton label={"저장"} onClick={() => setNameOfButton("save")} />
                    <RefreshButton onClick={refresh} />
                </div>
                <ReactDataTable
                    editing={true}
                    columns={columns.laborCostMgmt.run}
                    customDatas={budgetMgmtRun}
                    viewPageName={current}
                    returnList={compareData}
                    condition={condition}
                />
            </HideCard>
        </>
    );
}

export default LaborCostMgmtExe;
