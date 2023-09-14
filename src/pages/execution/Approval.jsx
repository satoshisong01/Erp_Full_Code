import React, { useState } from "react";
import { Link } from "react-router-dom";
import store from "store/configureStore";
import { selectLnb } from "components/tabs/TabsActions";
import PaymentReceiveds from "./ElectroPayment/PaymentReceived/PaymentReceiveds";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import DataTable from "components/DataTable/DataTable";
import { locationPath } from "constants/locationPath";

/** 시스템관리-전자결재 */
function Approval() {
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
            header: "발신자",
            col: "code",
            cellWidth: "20%",
            updating: true,
            write: true,
        },
        {
            header: "발신일",
            col: "startDate",
            cellWidth: "20%",
            updating: true,
            write: true,
        },
        { header: "수신자", col: "currency", cellWidth: "20%" },
        { header: "수신일", col: "vendor", cellWidth: "20%" },
        { header: "결재상태", col: "contactPerson", cellWidth: "20%" },
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
            title: "결재상태",
            colName: "name",
            type: "select",
            option: [{ value: "전체" }, { value: "대기중" }, { value: "반려" }],
            searchLevel: "3",
        },
        {
            title: "발신자",
            colName: "clCodeNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "2",
        },
    ];

    const handleReturn = (value) => {
        setReturnKeyWord(value);
        console.log(value, "제대로 들어오냐");
    };

    const addBtn = [""];
    return (
        <>
            <Location pathList={locationPath.Approval} />
            <SearchList conditionList={conditionList} onSearch={handleReturn} />
            <DataTable
                returnKeyWord={returnKeyWord}
                columns={columns}
                suffixUrl="/system/code/clCode"
                addBtn={addBtn}
            />
        </>
    );
}

export default Approval;
