import React, { useContext, useEffect, useRef, useState } from "react";
import { PageContext } from "components/PageProvider";
import HideCard from "components/HideCard";
import QuillEditor from "components/QuillEditor";
import ApprovalFormSal from "components/form/ApprovalFormSal";

/** 영업관리-수주관리 */
function OrderMgmt() {
    const { currentPageName } = useContext(PageContext);
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
                // fetchAllData(newCondition);
                return newCondition;
            } else {
                // fetchAllData({ ...prev });
                return prev;
            }
        });
    };

    return (
        <>
            <ApprovalFormSal returnData={conditionInfo}  />
            {/* <ApprovalFormSal /> */}
            <HideCard title="수주보고서 작성" color="back-lightblue" className="mg-b-40">
                <QuillEditor />
            </HideCard>
        </>
    );
}

export default OrderMgmt;
