import React, { useContext, useRef, useState } from "react";
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

/** 실행관리-실행원가관리 */
function ExecutionCost() {
    const { setNameOfButton, projectInfo } = useContext(PageContext);
    const [returnKeyWord, setReturnKeyWord] = useState("");
    const orderMgmtTable = useRef(null);

    const handleReturn = (value) => {
        setReturnKeyWord(value);
        console.log(value, "제대로 들어오냐");
    };

    const save = () => {
        
    }

    return (
        <>
            <Location pathList={locationPath.ExecutionCost} />
            <SearchList conditionList={columns.executionCost.condition} onSearch={handleReturn} />
            <HideCard title="계획 등록/수정" color="back-lightblue">
                <div className="table-buttons mg-b-m-30">
                    <PopupButton targetUrl={URL.ExcutionCostsDoc} data={{ label: "실행원가서", projectInfo }} />
                    <PopupButton targetUrl={URL.ExcutionCostsDoc} data={{ label: "정산서", projectInfo }} />
                    <ModButton label={"저장"} onClick={save} />
                    <RefreshButton onClick={() => setNameOfButton("refresh")} />
                </div>
                <ReactDataTable columns={columns.executionCost.project} suffixUrl="/baseInfrm/product/pjOrdrInfo" tableRef={orderMgmtTable} viewPageName="실행원가관리" />
            </HideCard>
        </>
    );
}

export default ExecutionCost;
