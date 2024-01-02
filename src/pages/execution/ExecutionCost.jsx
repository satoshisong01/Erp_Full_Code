import React, { useContext, useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import DataTable from "components/DataTable/DataTable";
import SearchList from "components/SearchList";
import { locationPath } from "constants/locationPath";
import PopupButton from "components/button/PopupButton";
import ModButton from "components/button/ModButton";
import DelButton from "components/button/DelButton";
import RefreshButton from "components/button/RefreshButton";
import ReactDataTable from "components/DataTable/ReactDataTable";
import { PageContext } from "components/PageProvider";
import URL from "constants/url";
import { columns } from "constants/columns";
import HideCard from "components/HideCard";
import SaveButton from "components/button/SaveButton";
import AddModModal from "components/modal/AddModModal";
import { axiosFetch, axiosUpdate } from "api/axiosFetch";

/** 실행관리-실행원가관리 */
function ExecutionCost() {
    const { setNameOfButton, projectInfo, currentPageName } = useContext(PageContext);
    const [isOpenMod, setIsOpenMod] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]); //그리드에서 선택된 row 데이터
    const [tableData, setTableData] = useState([]);

    //const orderMgmtTable = useRef(null);

    // useEffect(() => {
    //     console.log("selectedRows:", selectedRows);
    // }, [selectedRows]);

    useEffect(() => {
        if (currentPageName === "원가조회") {
            fetchAllData({poiStatusExecute : "ALL"}); //맨처음에 부르기..
        }
    }, [currentPageName]);

    const fetchAllData = async (condition) => {
        const resultData = await axiosFetch("/api/baseInfrm/product/pjOrdrInfo/totalListAll.do", {
            ...condition,
            // searchCondition: "",
            // searchKeyword: "",
        });
        setTableData(resultData);
    };

    const handleReturn = (value) => {
        fetchAllData(value);
    };

    const modifyToServer = async (updatedData) => {
        console.log("💜 modifyToServer:", updatedData);
        if (updatedData.length === 0) {
            alert("수정할 항목을 선택하세요.");
            return;
        }
        const url = `/api/baseInfrm/product/pjOrdrInfo/edit.do`;
        const updated = { ...updatedData, lockAt: "Y", useAt: "Y" };
        const resultData = await axiosUpdate(url, updated);
        if (resultData) {
            alert("수정되었습니다");
            fetchAllData({poiStatusExecute : "ALL"});
        } else {
            alert("error!!");
        }
    };

    return (
        <>
            <Location pathList={locationPath.ExecutionCost} />
            <SearchList conditionList={columns.executionCost.condition} onSearch={handleReturn} />
            <HideCard title="계획 등록/수정" color="back-lightblue">
                <div className="table-buttons mg-b-m-30">
                    <PopupButton targetUrl={URL.ExecutionCostsDoc} data={{ label: "실행원가서", ...selectedRows[0] }} />
                    <PopupButton targetUrl={URL.PostCostsDoc} data={{ label: "정산서", ...selectedRows[0] }} />
                    {/* <SaveButton label={"저장"} onClick={() => setNameOfButton("save")} /> */}
                    <ModButton label={"수정"} onClick={() => setIsOpenMod(true)} />
                    {/* <RefreshButton onClick={() => setNameOfButton("refresh")} /> */}
                    <RefreshButton onClick={() => fetchAllData({poiStatusExecute : "ALL"})} />
                </div>
                <ReactDataTable
                    columns={columns.orderMgmt.project}
                    customDatas={tableData}
                    suffixUrl="/baseInfrm/product/pjOrdrInfo"
                    viewPageName="원가조회"
                    returnSelectRows={(data) => {
                        setSelectedRows(data);
                    }}
                />
            </HideCard>
            {isOpenMod && (
                <AddModModal
                    width={500}
                    height={150}
                    list={columns.executionCost.addMod}
                    initialData={selectedRows}
                    resultData={modifyToServer}
                    onClose={() => setIsOpenMod(false)}
                    title="프로젝트 상태 수정"
                />
            )}
        </>
    );
}

export default ExecutionCost;
