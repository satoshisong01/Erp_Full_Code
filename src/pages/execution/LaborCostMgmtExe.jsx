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
        }
        setInnerPageName("");
    }, [currentPageName]);

    const conditionInfo = (value) => {
        setCondition((prev) => {
            if (prev.poiId !== value.poiId) {
                const newCondition = { poiId: value.poiId, typeCode: "MM", modeCode: "EXECUTE" };
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

    useEffect(() => {
        if (condition.poiId === undefined || condition.poId === "") {
            //테이블 초기화
            setBudgetMgmRun([]);
        }
    }, [currentPageName, innerPageName, condition]);

    const fetchAllData = async (condition) => {
        const requestSearch = {
            poiId: condition.poiId,
            poiNm: condition.poiNm,
            useAt: "Y",
            typeCode: "MM",
            modeCode: "EXECUTE",
        };

        const choiceData = {
            poiId: condition.poiId,
            poiNm: condition.poiNm,
            typeCode: "MM",
            modeCode: "BUDGET",
            useAt: "Y",
        };

        const resultData = await axiosFetch("/api/baseInfrm/product/prstmCost/totalListAll.do", requestSearch);
        const viewResult = await axiosFetch("/api/baseInfrm/product/prstmCost/totalListAll.do", choiceData);
        setBudgetMgmtView(viewResult);
        if (resultData) {
            console.log("get data success:)");
            setBudgetMgmRun(resultData);
            return resultData;
        } else {
            console.log("get data fail:(");
            return []; // 빈 배열 보내주기
        }
    };

    useEffect(() => {
        setBudgetMgmRun([]);
    }, [condition]);

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
            <ApprovalFormExe viewPageName="실행인건비실행" returnData={conditionInfo} />
            <HideCard title="계획 조회" color="back-gray" className="mg-b-40">
                <ReactDataTable columns={columns.laborCostMgmt.budget} customDatas={budgetMgmtView} defaultPageSize={5} hideCheckBox={true} />
            </HideCard>
            <HideCard title="합계" color="back-lightyellow" className="mg-b-40"></HideCard>
            <HideCard title="계획 등록/수정" color="back-lightblue">
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
