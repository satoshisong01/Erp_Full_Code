import React, { useEffect, useState } from "react";

export default function DataTableButton({excelClick, copyClick, printClick, deleteClick, addClick}) {
    const buttons = [
        { id: "csvIcon", iconClass: "fa fa-file-excel-o utilIcon", label: "CSV", clickHandler: excelClick },
        { id: "copyIcon", iconClass: "fa fa-copy utilIcon", label: "Copy", clickHandler: copyClick },
        { id: "printIcon", iconClass: "fa fa-print utilIcon", label: "Print", clickHandler: printClick },
        { id: "delIcon", iconClass: "fa fa-trash-o utilIcon", label: "삭제", clickHandler: deleteClick },
        { id: "addIcon", iconClass: "fa fa-plus utilIcon", label: "추가", clickHandler: addClick }
    ];
  
    useEffect(() => {
        buttons.forEach(button => {
            if (typeof button.clickHandler === "function") {
                setShowButton(button.id, true);
            }
        });
    }, []);
  
    const setShowButton = (buttonId, value) => {
        setButtonState(prevState => ({...prevState, [buttonId]: value}));
    };
  
    /* reduce: ({값}), {초기값} */
    const [buttonState, setButtonState] = useState(
        buttons.reduce((acc, button) => ({ ...acc, [button.id]: false }), {})
    );
  
    return (
        <div className="tableBtn">
            {buttons.map(button => (
                buttonState[button.id] && (
                    <button
                        key={button.id}
                        className={`btn btn-primary ${button.id}`}
                        id="utilBtn"
                        onClick={button.clickHandler}
                    >
                        <i className={button.iconClass} />
                        {button.label}
                    </button>
                )
            ))}
        </div>
    );
}
