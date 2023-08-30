import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import ReactDataTableRowEdit from "components/DataTable/ReactDataTableRowEdit";

function EgovMain(props) {
    console.group("EgovMain");
    console.log("[Start] EgovMain ------------------------------");
    console.log("EgovMain [props] : ", props);

    const location = useLocation();
    console.log("EgovMain [location] : ", location);

    console.log("------------------------------EgovMain [End]");
    console.groupEnd("EgovMain")

    return (
        <div className="egov-container">
            <div className="c_wrap">
                <div className="logo-center-container">
                    <img src="assets/images/mecca_logo.png" alt="로고" className="logo-main" />
                </div>
            </div>
        </div>
    );
}

export default EgovMain;
