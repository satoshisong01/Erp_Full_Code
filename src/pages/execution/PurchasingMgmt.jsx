import React, { useState } from "react";
import BuyMgmts from "./BuyMgmt/BuyMgmts";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import DataTable from "components/DataTable/DataTable";
import { locationPath } from "constants/locationPath";

/** 실행관리-구매관리 */
function PurchasingMgmt() {
    const [returnKeyWord, setReturnKeyWord] = useState("");

    const columns = [
        {
            header: "프로젝트명",
            col: "name",
            cellWidth: "20%",
            update: false,
            updating: true,
            write: true,
        },
        {
            header: "작성일",
            col: "code",
            cellWidth: "20%",
            updating: true,
            write: true,
        },
        {
            header: "발주번호",
            col: "startDate",
            cellWidth: "20%",
            updating: true,
            write: true,
        },
        { header: "발주일", col: "currency", cellWidth: "20%" },
        { header: "발주금액", col: "vendor", cellWidth: "20%" },
        { header: "발주부서", col: "contactPerson", cellWidth: "20%" },
        { header: "담당자", col: "endDate", cellWidth: "30%" },
        { header: "구매요청유형", col: "orderAmount", cellWidth: "20%" },
        { header: "진행상태", col: "orderAmount", cellWidth: "30%" },
    ];

    const conditionList = [
        {
            title: "프로젝트명",
            colName: "clCode", //컬럼명
            type: "input",
            value: "",
            searchLevel: "1",
        },
        {
            title: "기간검색",
            colName: "selectedDate",
            type: "datepicker",
            searchLevel: "0",
        },
        {
            title: "품목그룹명",
            colName: "clCodeNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "2",
        },
        {
            title: "품목명",
            colName: "clCodeNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "2",
        },
        {
            title: "구매거래처",
            colName: "clCodeNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "2",
        },
        {
            title: "발주부서",
            colName: "clCodeNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "2",
        },
        {
            title: "발주상태",
            colName: "name",
            type: "select",
            option: [{ value: "발주완료" }, { value: "미발주" }],
            searchLevel: "3",
        },
        {
            title: "입고상태",
            colName: "name",
            type: "select",
            option: [{ value: "입고완료" }, { value: "미입고" }],
            searchLevel: "3",
        },
    ];

    const handleReturn = (value) => {
        setReturnKeyWord(value);
        console.log(value, "제대로 들어오냐");
    };

    const addBtn = ["buyPlanPage", "runBuyPlanPage"];

    return (
        <>
            <Location pathList={locationPath.PurchasingMgmt} />
            <SearchList conditionList={conditionList} onSearch={handleReturn} />
            <h4 style={{ marginBottom: "20px", fontWeight: "bold" }}>
                프로젝트별 구매 내역
            </h4>
            <DataTable
                returnKeyWord={returnKeyWord}
                columns={columns}
                suffixUrl="/system/code"
                currentPage="clCode"
                addBtn={addBtn}
            />
            <BuyMgmts />
        </>
    );
}

export default PurchasingMgmt;
