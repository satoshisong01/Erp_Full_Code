import React from "react";
import "../css/componentCss/CodeUtilBtn.css";

/* data를 새창에 넘겨주는 버튼 */
function PopupButton({ targetUrl, data }) {
    const openPopup = () => {
        const url = `${targetUrl}?data=${encodeURIComponent(
            JSON.stringify(data)
        )}`;
        const width = 1200;
        const height = 700;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        const windowFeatures = `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,location=no,status=no,resizable=yes,scrollbars=yes`;
        window.open(url, "newWindow", windowFeatures);
    };

    return (
        <button id="utilBtn2" className="btn btn-primary" onClick={openPopup}>
            {data.btnName}
        </button>
    );
}

export default PopupButton;
