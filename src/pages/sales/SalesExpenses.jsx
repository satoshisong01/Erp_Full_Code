import React, { useContext, useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import { locationPath } from "constants/locationPath";
import { axiosFetch } from "api/axiosFetch";
import { PageContext } from "components/PageProvider";
import ReactDataTableURL from "components/DataTable/ReactDataTableURL";
import ApprovalFormExe from "components/form/ApprovalFormExe";
import HideCard from "components/HideCard";

/** 영업관리-영업비(정산) */
function SalesExpenses() {
    const { isSaveFormTable, projectInfo, setProjectInfo } = useContext(PageContext);

    useState(() => {
        return(() =>  { //초기화
            // setProjectInfo({});
        })
    }, [])

    const [salesCost, setSalesCost] = useState([]);

    const totalColumns = [
        {
            header: "영업비",
            col: "totalPrice",
            cellWidth: "100%"
        },
    ];

    const columns = [
        {
            header: "영업비 내역",
            col: "poiDesc",
            cellWidth: "70%",
            updating: true,
            write: true,
            type: "input",
        },
        {
            header: "금액",
            col: "pjbgPrice",
            cellWidth: "30%",
            updating: true,
            write: true,
            type: "input",
        },
    ];

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
                modeCode: "SLSP",
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

    return (
        <>
            <Location pathList={locationPath.SalesExpenses} />
            <ApprovalFormExe />
            <HideCard title="합계" color="back-lightyellow" className="mg-b-40">
                <ReactDataTableURL columns={totalColumns} flag={isSaveFormTable} customDatas={salesCost} />
            </HideCard>
            <HideCard title="등록/수정" color="back-lightblue">
                <ReactDataTableURL columns={columns} flag={isSaveFormTable} customDatas={salesCost} />
            </HideCard>
        </>
    );
}

export default SalesExpenses;
