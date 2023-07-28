import React from "react";
import "../css/componentCss/CodeUtilBtn.css";

/* url와 title을 받아서 새창에 넘겨주는 버튼 */
function PopupButton({ targetUrl, title }) {
    const openPopup = () => {
        const dataToSend = title; //새창에 타이틀 전달
        const url = `${targetUrl}?data=${encodeURIComponent(dataToSend)}`;
        const width = 1200;
        const height = 700;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        const windowFeatures = `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,location=no,status=no,resizable=yes,scrollbars=yes`;
        window.open(url, "newWindow", windowFeatures);
    };

    return (
        <button id="utilBtn2" className="btn btn-primary" onClick={openPopup}>
            {title}
        </button>
    );
}

export default PopupButton;
