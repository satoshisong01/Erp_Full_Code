import React from "react";
import LaborCostDoc from "./LaborCostDoc";
import LaborSummaryDoc from "./LaborSummaryDoc";
import OrderSummaryDoc from "./OrderSummaryDoc";
import DetailDoc from "./DetailDoc";

export default function TotalDoc() {
    return (
        <div>
            <LaborCostDoc />
            <LaborSummaryDoc />
            <OrderSummaryDoc />
            <DetailDoc />
        </div>
    );
}
