import React, { useContext, useEffect, useRef, useState } from "react";
import { PageContext } from "components/PageProvider";
import HideCard from "components/HideCard";
import QuillEditor from "components/QuillEditor";
import ApprovalFormSal from "components/form/ApprovalFormSal";
import { axiosFetch } from "api/axiosFetch";

/** 영업관리-수주관리 */
function OrderMgmt() {
    const { currentPageName } = useContext(PageContext);
    const [tableData, setTableData] = useState([]);
    const [condition, setCondition] = useState({});

    useEffect(() => {
        if (currentPageName.id === "ProjectMgmt") {
        }
    }, [currentPageName]);

    const conditionInfo = (value) => {
        console.log("🎄수주관리 조건:", value);
        setCondition((prev) => {
            if (prev.poiId !== value.poiId) {
                const newCondition = { ...value };
                fetchAllData(newCondition);
                return newCondition;
            } else {
                // fetchAllData({ ...prev });
                return prev;
            }
        });
    };

    const fetchAllData = async (requestData) => {
        console.log(requestData);
        const resultData = await axiosFetch("/api/system/signState/totalListAll.do", requestData);
        console.log(resultData, "이것이말이다 결재를 불러온단말이다", requestData);
        setTableData(resultData);
    };

    return (
        <>
            <ApprovalFormSal returnData={conditionInfo} />
            {/* <ApprovalFormSal /> */}
            <HideCard title="수주보고서 작성" color="back-lightblue" className="mg-b-40">
                <QuillEditor tableData={tableData} />
            </HideCard>
        </>
    );
}

export default OrderMgmt;
