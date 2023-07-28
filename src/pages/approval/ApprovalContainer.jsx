import React, { useEffect, useState } from "react";
import ApprovalForm from "components/form/ApprovalForm"; //기본 폼
import BusiCalculateDoc from "pages/sales/Business/BusiCalculateDoc";

/* 전자결재 */
function ApprovalContainer() {
    const [title, setTitle] = useState("");

    useEffect(() => {
        // URL로 넘어온 파라미터 값 파싱
        const urlParams = new URLSearchParams(window.location.search);
        const dataString = urlParams.get("data");
        const data = JSON.parse(decodeURIComponent(dataString));
        setTitle(data.title);
    }, []);

    return (
        <div className="">
            <ApprovalForm title={title}>
                <BusiCalculateDoc />
            </ApprovalForm>
        </div>
    );
}

export default ApprovalContainer;
