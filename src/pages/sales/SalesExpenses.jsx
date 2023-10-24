import React, { useContext, useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import DataTable from "components/DataTable/DataTable";
import { locationPath } from "constants/locationPath";
import { axiosFetch } from "api/axiosFetch";
import ApprovalForm from "components/form/ApprovalForm";
import ReactDataTable from "components/DataTable/ReactDataTable";
import { PageContext } from "components/PageProvider";

/** 영업관리-영업비용 */
function SalesExpenses() {
    const { isSaveFormTable, setIsSaveFormTable, projectInfo, setProjectInfo } = useContext(PageContext);

    const [returnKeyWord, setReturnKeyWord] = useState("");
    const [salesCost, setSalesCost] = useState([]);

    const columns = [
        {
            header: "경비목록",
            col: "esntlId",
            cellWidth: "20%",
            update: false,
            updating: true,
            write: true,
            type: "input",
        },
        {
            header: "비고",
            col: "poiDesc",
            cellWidth: "20%",
            updating: true,
            write: true,
            type: "input",
        },
        {
            header: "금액",
            col: "pjbgPrice",
            cellWidth: "50%",
            updating: true,
            write: true,
            type: "input",
        },
    ];

    //const conditionList = [
    //    {
    //        title: "분류코드",
    //        colName: "clCode", //컬럼명
    //        type: "input",
    //        value: "",
    //        searchLevel: "1",
    //    },
    //    {
    //        title: "분류코드명",
    //        colName: "clCodeNm", //컬럼명
    //        type: "input",
    //        value: "",
    //        searchLevel: "2",
    //    },
    //    {
    //        title: "분류코드설명",
    //        colName: "clCodeDc", //컬럼명
    //        type: "input",
    //        value: "",
    //        searchLevel: "3",
    //    },
    //    {
    //        title: "이름",
    //        colName: "name",
    //        type: "select",
    //        option: [{ value: "다섯글자의옵션1" }, { value: "다섯글자의옵션2" }],
    //        searchLevel: "3",
    //    },
    //];

    //const handleReturn = (value) => {
    //    setReturnKeyWord(value);
    //    console.log(value, "제대로 들어오냐");
    //};

    const [currentTask, setCurrentTask] = useState("영업비용");

    const addBtn = [""];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchAllData("/cost/costPrmnPlan"); // 인건비
                setSalesCost(formatDate(data));
                console.log(data, "불러온 영업비용 값은?");
            } catch (error) {
                console.error("데이터를 가져오는 중에 오류 발생:", error);
            }
        };

        fetchData(); // fetchData 함수를 호출하여 데이터를 가져옵니다.
    }, [projectInfo.poiId]);

    const fetchAllData = async () => {
        try {
            const url = `/api/baseInfrm/product/pjbudget/totalListAll.do`;

            const requestData = {
                useAt: "Y",
                deleteAt: "N",
                searchCondition: "0",
                searchKeyword: "",
                poiId: projectInfo.poiId,
                pjbgModeCode: "SLSP",
                pjbgTypeCode: "EXPNS06",
            };
            const resultData = await axiosFetch(url, requestData);
            console.log(resultData, "불러온값💥💥💥💥💥💥");
            if (resultData) {
                return resultData;
            }
        } catch {
        } finally {
        }
    };
    function formatDate(dataArray) {
        if (Array.isArray(dataArray)) {
            return dataArray.map((data) => {
                // 해당 객체의 sgnReceivedate 및 sgnSigndate 값을 변경
                if (data.pjbgBeginDt && data.pjbgBeginDt.length >= 3) {
                    const year = data.pjbgBeginDt[0];
                    const month = data.pjbgBeginDt[1];
                    const day = data.pjbgBeginDt[2];
                    data.pjbgBeginDt = `${year}-${month}-${day}`;
                } else {
                    data.pjbgBeginDt = ""; // 유효하지 않은 데이터 처리
                }

                return data;
            });
        } else {
            return dataArray;
        }
    }

    //setIsSaveFormTable(true);

    return (
        <>
            <Location pathList={locationPath.SalesExpenses} />
            <ApprovalForm title={currentTask + " 실행 등록"}>
                <ReactDataTable columns={columns} flag={isSaveFormTable} customDatas={salesCost} />
            </ApprovalForm>
            <div style={{ display: "flex" }}>
                <span style={{ display: "flex", justifyContent: "center", width: "100px", backgroundColor: "#f2f2f2", border: "solid gray 1px" }}>
                    경비 합계
                </span>
                <span style={{ display: "flex", justifyContent: "center", width: "100px", border: "solid gray 1px" }}>0</span>
            </div>
        </>
    );
}

export default SalesExpenses;
