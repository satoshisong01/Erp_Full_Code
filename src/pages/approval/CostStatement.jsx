import CostStatementForm from "components/form/CostStatementForm";
import ExcutionCostsDoc from "pages/execution/excutionCost/ExcutionCostsDoc";
import BusiCalculateDoc from "pages/sales/Business/BusiCalculateDoc";
import React, { useEffect, useState } from "react";

/* 사전 원가 계산서, 실행 원가 계산서 */

function CostStatement() {
    const [title, setTitle] = useState("");

    useEffect(() => {
        // URL로 넘어온 파라미터 값 파싱
        const urlParams = new URLSearchParams(window.location.search);
        const dataString = urlParams.get("data");
        const data = JSON.parse(decodeURIComponent(dataString));
        setTitle(data.title);
    }, []);

    let content;
    if (title === "사전 원가 계산서") {
        content = <BusiCalculateDoc />;
    } else if (title === "실행 원가 계산서") {
        content = <ExcutionCostsDoc />;
    } else {
        content = null; // 'title'이 어떤 조건과도 일치하지 않을 경우 렌더링하지 않음
    }

    return (
        <div className="">
            <CostStatementForm title={title}>{content}</CostStatementForm>
        </div>
    );
}

export default CostStatement;
