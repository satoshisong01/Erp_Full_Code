import React, { useContext, useEffect, useState } from "react";
import "../../css/componentCss/CodeUtilBtn.css";
import { PageContext } from "components/PageProvider";

/* URl에 해당하는 화면을 새창으로 띄어주고 data를 넘겨주는 버튼 */
function PopupButton({ targetUrl, data }) {
    const openPopup = () => {
        const url = `${targetUrl}?data=${encodeURIComponent(
            JSON.stringify(data)
        )}`;
        const width = 1400;
        const height = 700;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        const windowFeatures = `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,location=no,status=no,resizable=yes,scrollbars=yes`;
        window.open(url, "newWindow", windowFeatures);
    };

    const { lengthSelectRow } = useContext(PageContext)
    const [disabled, setDisabled] = useState(true);

    useEffect(() => {
        if(lengthSelectRow && lengthSelectRow === 1) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
    }, [lengthSelectRow]);

    const buttonClassName = `table-btn table-btn-primary${disabled ? ' disabled' : ''}`;

    return (
        <button onClick={openPopup} className={buttonClassName} disabled={disabled}>
            {data.label}
        </button>
    );
}

export default PopupButton;
