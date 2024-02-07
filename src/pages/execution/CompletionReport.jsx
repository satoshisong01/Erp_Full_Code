import React, { useContext, useEffect, useRef, useState } from "react";
import { PageContext } from "components/PageProvider";
import HideCard from "components/HideCard";
import QuillEditor from "components/QuillEditor";
import ApprovalFormExe from "components/form/ApprovalFormExe";

/** 영업관리-수주관리 */
function CompletionReport() {
    const { currentPageName } = useContext(PageContext);
    const [condition, setCondition] = useState({});

    useEffect(() => {
        if (currentPageName.id === "ProjectMgmt") {
        }
    }, [currentPageName]);

    const conditionInfo = (value) => {
        console.log("🎄완료보고 조건:", value);
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
            <ApprovalFormExe returnData={conditionInfo}  />
            <HideCard title="완료보고서 작성" color="back-lightblue" className="mg-b-40">
                <QuillEditor />
            </HideCard>
        </>
    );
}

export default CompletionReport;
