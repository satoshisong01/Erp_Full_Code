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
    } = useContext(PageContext);

    useEffect(() => {
        setInnerPageName("인건비 조회관리");
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

    const [budgetMgmt, setBudgetMgmt] = useState([]); // 인건비 예산관리

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
            if (innerPageName === "인건비 예산관리") {
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

    const fetchAllData = async (url, currentTask) => {
        const requestData = {
            poiId: projectInfo.poiId,
            pecSlsExcCode: "PEXC",
            pecTypeCode: "MM",
            useAt: "Y",
            pecModeCode: "PDVSN02",
        };

        const resultData = await axiosFetch(url, requestData);
        if (resultData) {
            console.log("get data success:)");
            return resultData;
        } else {
            console.log("get data fail:(");
            return []; // 빈 배열 보내주기
        }
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

    return (
        <>
            <Location pathList={locationPath.LaborCostMgmt} />

            <div className={`buttonBody ${isClicked3 ? "" : "clicked"}`}>
                <button className="arrowBtnStyle" style={{ zIndex: "999" }} onClick={handleClick3}>
                    <FontAwesomeIcon className={`arrowBtn ${isClicked3 ? "" : "clicked"}`} icon={faArrowUp} />
                </button>
            </div>

            <div className="table-buttons">
                <RefreshButton onClick={refresh} />
            </div>

            <ReactDataTable
                columns={columns.laborCostMgmt.budget}
                tableRef={orderPlanMgmtTable3}
                customDatas={budgetMgmt}
                viewPageName="인건비"
                sendToParentTables={compareData}
                hideCheckBox={true}
            />
        </>
    );
}

export default LaborCostMgmtPlan;
