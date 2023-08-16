import ReSearchBtn from "components/DataTable/function/ReSearchBtn";
import { axiosDelete, axiosFetch, axiosUpdate } from "api/axiosFetch";
import React, { useEffect, useState } from "react";
import PopupButton from "./PopupButton";
import URL from "constants/url";

export default function DataTableButton({
    excelClick,
    copyClick,
    printClick,
    deleteClick,
    addClick,
    dataTableRef,
    fetchAllData,
    addBtn,
}) {
    const buttons = [
        {
            id: "csvIcon",
            iconClass: "fa fa-file-excel-o utilIcon",
            label: "CSV",
            clickHandler: excelClick,
        },
        {
            id: "copyIcon",
            iconClass: "fa fa-copy utilIcon",
            label: "Copy",
            clickHandler: copyClick,
        },
        {
            id: "printIcon",
            iconClass: "fa fa-print utilIcon",
            label: "Print",
            clickHandler: printClick,
        },
        {
            id: "delIcon",
            iconClass: "fa fa-trash-o utilIcon",
            label: "삭제",
            clickHandler: deleteClick,
        },
        {
            id: "addIcon",
            iconClass: "fa fa-plus utilIcon",
            label: "추가",
            clickHandler: addClick,
        },
    ];

    const buttonPropsMap = {
        costPage: {
            targetUrl: URL.EstimatePopupContainer,
            data: {
                btnName: "견적서",
                title: "견적서",
            },
        },
        calPage: {
            targetUrl: URL.CostStatement,
            data: {
                btnName: "사전원가서",
                title: "사전 원가 계산서",
            },
        },
        runCalPage: {
            targetUrl: URL.CostStatement,
            data: {
                btnName: "실행원가서",
                title: "실행 원가 계산서",
            },
        },
        planPage: {
            targetUrl: URL.ApprovalContainer,
            data: {
                btnName: "수주계획",
                title: "사전 원가 계획",
            },
        },
        runPlanPage: {
            targetUrl: URL.ApprovalContainer,
            data: {
                btnName: "실행계획",
                title: "사전 실행 계획",
            },
        },
        costPlanPage: {
            targetUrl: URL.ApprovalContainer,
            data: {
                btnName: "경비계획",
                title: "경비계획",
            },
        },
        runCostPlanPage: {
            targetUrl: URL.ApprovalContainer,
            data: {
                btnName: "경비실행",
                title: "경비실행",
            },
        },
        buyPlanPage: {
            targetUrl: URL.ApprovalContainer,
            data: {
                btnName: "구매계획",
                title: "구매계획",
            },
        },
        runBuyPlanPage: {
            targetUrl: URL.ApprovalContainer,
            data: {
                btnName: "구매실행",
                title: "구매실행",
            },
        },
    };

    useEffect(() => {
        buttons.forEach((button) => {
            if (typeof button.clickHandler === "function") {
                setShowButton(button.id, true);
            }
        });
    }, []);

    const setShowButton = (buttonId, value) => {
        setButtonState((prevState) => ({ ...prevState, [buttonId]: value }));
    };

    /* reduce: ({값}), {초기값} */
    const [buttonState, setButtonState] = useState(
        buttons.reduce((acc, button) => ({ ...acc, [button.id]: false }), {})
    );

    return (
        <div className="tableBtn">
            <ReSearchBtn
                dataTableRef={dataTableRef}
                fetchAllData={fetchAllData}
            />
            {addBtn.map((btn, index) => {
                const popupButtonProps = buttonPropsMap[btn];
                if (popupButtonProps) {
                    return <PopupButton key={index} {...popupButtonProps} />;
                }
                return null;
            })}
            {buttons.map(
                (button) =>
                    buttonState[button.id] && (
                        <button
                            key={button.id}
                            className={`btn btn-primary ${button.id}`}
                            id="utilBtn"
                            onClick={button.clickHandler}>
                            <i className={button.iconClass} />
                            {button.label}
                        </button>
                    )
            )}
        </div>
    );
}
