import { PageContext } from "components/PageProvider";
import React, { useContext, useEffect, useState } from "react";

/* 1개의 item에 대한 수정 버튼 */
export default function ModButton({ label, onClick }) {
    const [disabled, setDisabled] = useState(true);
    const {lengthSelectRow} = useContext(PageContext);

    useEffect(() => {
        if(lengthSelectRow && lengthSelectRow === 1) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
    }, [lengthSelectRow]);
    

    const buttonClassName = `table-btn table-btn-default${disabled ? ' disabled' : ''}`;
    return (
        <button onClick={onClick} className={buttonClassName} disabled={disabled}>
            {label}
        </button>
    );
}