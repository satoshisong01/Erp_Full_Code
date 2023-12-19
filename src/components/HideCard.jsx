import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

export default function HideCard({ children, title, color, style }) {

    const handleClick1 = () => {
        setIsClicked(!isClicked);
    };

    // #rc-tabs-0-panel-OrderPlanMgmt > div.common_board_style.mini_board_1 > div > div.second > ul > div:nth-child(1)

    const [isClicked, setIsClicked] = useState(false);

    return (
        <div className="hide-card" style={style}>
            <div className={`hide-header flex-between ${color}`}>
                <div className="hide-title">{title}</div>
                <div className={`buttonBody ${isClicked ? "" : "clicked"}`}>
                    <button className="arrowBtnStyle" style={{ zIndex: "100" }} onClick={handleClick1}>
                        <FontAwesomeIcon className={`arrowBtn ${isClicked ? "" : "clicked"}`} icon={faArrowUp} />
                    </button>
                </div>
            </div>
            <div className="hide-content mg-b-50">
                <div className={`hideDivRun ${isClicked ? "" : "clicked"}`}>
                    { children }
                </div>
            </div>
        </div>
    )
}