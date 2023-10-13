import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import store from "store/configureStore";
import { selectLnb } from "components/tabs/TabsActions";
import PaymentReceiveds from "./ElectroPayment/PaymentReceived/PaymentReceiveds";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import DataTable from "components/DataTable/DataTable";
import { locationPath } from "constants/locationPath";
import { axiosFetch } from "api/axiosFetch";

/** 시스템관리-전자결재 */
function Approval() {
    const [returnKeyWord, setReturnKeyWord] = useState("");
    const [changeData, setChangeData] = useState("");

    const columns = [
        {
            header: "프로젝트명",
            col: "sgnComent",
            cellWidth: "20%",
            update: false,
            updating: true,
            write: true,
        },
        {
            header: "발신자",
            col: "pdexcdrId",
            cellWidth: "20%",
            updating: true,
            write: true,
        },
        {
            header: "발신일",
            col: "sgnSigndate",
            cellWidth: "20%",
            updating: true,
            write: true,
        },
        { header: "수신자", col: "sgnUniqid", cellWidth: "20%" },
        { header: "수신일", col: "sgnReceivedate", cellWidth: "20%" },
        { header: "결재상태", col: "sgnResult", cellWidth: "20%" },
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchAllData("/baseInfrm/product/sign");
                setChangeData(formatDate(data));

                console.log(data, "결과는???????");
            } catch (error) {
                console.log(error, "에러뜨나");
            }
        };
        fetchData();
    }, []);

    const fetchAllData = async (urlAddress) => {
        const url = `api${urlAddress}/totalListAll.do`;
        const requestData = {
            searchCondition: 1,
            searchKeyword: 13,
            useAt: "Y",
            lockAt: "Y",
        };

        const resultData = await axiosFetch(url, requestData);
        if (resultData) {
            console.log(resultData, "결재에서 불러온값");
            return resultData;
        }
    };

    function formatDate(dataArray) {
        if (Array.isArray(dataArray)) {
            return dataArray.map((data) => {
                // 해당 객체의 sgnReceivedate 및 sgnSigndate 값을 변경
                if (data.sgnReceivedate && data.sgnReceivedate.length >= 3) {
                    const year = data.sgnReceivedate[0];
                    const month = data.sgnReceivedate[1];
                    const day = data.sgnReceivedate[2];
                    data.sgnReceivedate = `${year}-${month}-${day}`;
                } else {
                    data.sgnReceivedate = ""; // 유효하지 않은 데이터 처리
                }

                if (data.sgnSigndate && data.sgnSigndate.length >= 3) {
                    const year = data.sgnSigndate[0];
                    const month = data.sgnSigndate[1];
                    const day = data.sgnSigndate[2];
                    data.sgnSigndate = `${year}-${month}-${day}`;
                } else {
                    data.sgnSigndate = ""; // 유효하지 않은 데이터 처리
                }

                return data;
            });
        } else {
            return dataArray;
        }
    }

    console.log(changeData, "나오는것은? ⭐⭐⭐⭐⭐");

    const addBtn = [""];
    return (
        <>
            <Location pathList={locationPath.Approval} />
            <SearchList conditionList={conditionList} onSearch={handleReturn} />
            <DataTable returnKeyWord={returnKeyWord} columns={columns} suffixUrl="/baseInfrm/product/sign" addBtn={addBtn} dataTest={changeData} />
        </>
    );
}

export default Approval;
