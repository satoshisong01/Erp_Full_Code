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
        versionInfo,
    } = useContext(PageContext);

    const [condition, setCondition] = useState({});

    const current = "인건비";

    useEffect(() => {
        if (currentPageName === "인건비" && current === "인건비계획") {
            setCurrentPageName(current);
        }
        setInnerPageName("");
    }, [currentPageName]);

    //useEffect(() => {
    //    if (currentPageName === "인건비") {
    //        fetchAllData();
    //    } else {
    //        setBudgetMgmt([]);
    //        setBudgetMgmtView([]);
    //        setCondition({});
    //    }
    //}, [currentPageName]);

    //useEffect(() => {
    //    if (current === "실행인건비계획" && currentPageName !== current) {
    //        setCurrentPageName(current);
    //    }
    //}, [currentPageName]);

    const [isClicked3, setIsClicked3] = useState(false);

    const conditionInfo = (value) => {
        setCondition((prev) => {
            if (prev.poiId !== value.poiId) {
                const newCondition = { poiId: value.poiId, typeCode: "MM", modeCode: "BUDGET" };
                fetchAllData(newCondition);
                return newCondition;
            }
            return prev;
        });
    };

    const handleClick3 = () => {
        setIsClicked3(!isClicked3);
    };

    const [budgetMgmt, setBudgetMgmt] = useState([]); // 실행인건비계획
    const [budgetMgmtView, setBudgetMgmtView] = useState([]); // 실행인건비계획

    useEffect(() => {
        if (condition.poiId === undefined || condition.poId === "") {
            //테이블 초기화
            setBudgetMgmt([]);
        }
    }, [currentPageName, innerPageName, condition]);

    const refresh = () => {
        if (condition.poiId) {
            fetchAllData(condition);
        }
    };

    //const fetchData = async () => {
    //    try {
    //        if (current === "실행인건비계획") {
    //            console.log("unitPriceList", unitPriceList);
    //            console.log("unitPriceListRenew", unitPriceListRenew);
    //            const datas = await fetchAllData("/api/baseInfrm/product/prstmCost/totalListAll.do", {
    //                poiId: condition.poiId,
    //                typeCode: "MM",
    //                modeCode: "BUDGET",
    //            }); // 인건비 예산관리
    //            if (unitPriceList && datas) {
    //                const updatedDatas = datas.map((data) => {
    //                    const unit = unitPriceList.find((unit) => data.pecPosition === unit.guppName && unit.gupDesc === new Date().getFullYear());
    //                    if (unit) {
    //                        const price = unit ? data.pecMm * unit.gupPrice : 0; // 적절한 기본값 사용
    //                        return { ...data, price: price, positionPrice: unit.gupPrice };
    //                    } else {
    //                        return { ...data, price: 0, positionPrice: 0 };
    //                    }
    //                });
    //                setBudgetMgmt(updatedDatas);
    //            }
    //        }
    //    } catch (error) {
    //        console.error("데이터를 가져오는 중에 오류 발생:", error);
    //    }
    //};

    useEffect(() => {
        setBudgetMgmt([]);
    }, [condition]);

    const fetchAllData = async (condition) => {
        const requestSearch = {
            poiId: projectInfo.poiId,
            poiNm: projectInfo.poiNm,
            useAt: "Y",
            typeCode: "MM",
            modeCode: "BUDGET",
        };

        const choiceData = {
            poiId: condition.poiId,
            poiNm: condition.poiNm,
            modeCode: "BUDGET",
            versionId: condition.versionId,
        };

        const resultData = await axiosFetch("/api/baseInfrm/product/prstmCost/totalListAll.do", condition);
        const viewResult = await axiosFetch("/api/baseInfrm/product/prmnPlan/totalListAll.do", choiceData);
        const changeData = ChangePrmnPlanData(viewResult);
        changeData.forEach((Item) => {
            const yearFromPmpMonth = Item.pmpMonth.slice(0, 4);
            const matchingAItem = unitPriceListRenew.find((aItem) => aItem.year === yearFromPmpMonth);

            console.log(matchingAItem, "변견된값?");

            if (matchingAItem) {
                let totalPrice = 0;

                // Iterate over gupPrice and pmpmmPositionCode arrays
                for (let i = 1; i <= 14; i++) {
                    const gupPriceKey = `gupPrice${i}`;
                    const pmpmmPositionCodeKey = `pmpmmPositionCode${i}`;
                    // Multiply corresponding values and add to totalPrice
                    if (matchingAItem[gupPriceKey]) {
                        totalPrice += matchingAItem[gupPriceKey] * Item[pmpmmPositionCodeKey];
                    }
                    console.log(totalPrice);
                }
                console.log(totalPrice);
                // Add totalPrice to bItem
                Item.totalPrice = totalPrice;
                console.log(totalPrice);
            }
            console.log(changeData, "changeData이거왜 안나오지 💥💥💥");
        });
        setBudgetMgmtView(changeData);
        if (resultData) {
            if (unitPriceList && resultData) {
                const updatedDatas = resultData.map((data) => {
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
            console.log("get data success:)");
            return resultData;
        } else {
            console.log("get data fail:(");
            return []; // 빈 배열 보내주기
        }
    };

    const compareData = (originData, updatedData) => {
        console.log("이거안타나");
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
                const add = { poiId: condition.poiId };
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
            <ApprovalFormExe viewPageName={current} returnData={conditionInfo} />
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
                    customDatas={budgetMgmt}
                    viewPageName={current}
                    returnList={compareData}
                    condition={condition}

                    //hideCheckBox={true}
                />
            </HideCard>
        </>
    );
}

export default LaborCostMgmtPlan;
