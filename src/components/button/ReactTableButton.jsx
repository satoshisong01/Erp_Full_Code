import React, { useContext, useEffect, useMemo, useState } from "react";
import { faArrowRotateRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PageContext } from "components/PageProvider";

export default function ReactTableButton({ showButton }) {
    const { setNameOfButton } = useContext(PageContext);

    const buttons = useMemo(() => [
        {
            id: "refresh",
            btnClass: "refreshIcon",
            label: <FontAwesomeIcon icon={faArrowRotateRight} className="refreshI" />,
        },
        {
            id: "csv",
            btnClass: "csvIcon",
            iconClass: "fa fa-file-excel-o utilIcon",
            label: "CSV",
        },
        {
            id: "copy",
            btnClass: "copyIcon",
            iconClass: "fa fa-copy utilIcon",
            label: "Copy",
        },
        {
            id: "print",
            btnClass: "printIcon",
            iconClass: "fa fa-print utilIcon",
            label: "Print",
        },
        {
            id: "delete",
            btnClass: "delIcon",
            label: "삭제",
        },
        {
            id: "add",
            btnClass: "addIcon",
            label: "추가",
        },
    ], [showButton]);

    useEffect(() => {
        buttons.forEach((button) => {
            if (showButton.includes(button.id)) {
                setShowButton(button.id, true);
            }
        });
    }, [showButton]);

    const setShowButton = (buttonId, value) => {
        setButtonState((prevState) => ({ ...prevState, [buttonId]: value }));
    };

    /* 초가값 false */
    const [buttonState, setButtonState] = useState(
        buttons.reduce((acc, button) => ({ ...acc, [button.id]: false }), {})
    );

    return (
        <div className="table-buttons">
            {buttons.map(
                (button) =>
                    buttonState[button.id] && (
                        <button
                            key={button.id}
                            className={`btn btn-primary ${button.btnClass}`}
                            onClick={() => setNameOfButton(button.id)}
                            id="utilBtn"
                        >
                                <i className={button.iconClass} />
                                {button.label}
                        </button>
                    )
            )}
        </div>
    );
}
