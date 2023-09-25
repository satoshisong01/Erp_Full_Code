import React, { useEffect, useState } from "react";

/* 1개의 item에 대한 수정 버튼 */
export default function ModButton({ label, length, onClick }) {
    const [disabled, setDisabled] = useState(true);

    useEffect(() => {
        if(length && length === 1) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
    }, [length]);
    

    const buttonClassName = `table-btn table-btn-default${disabled ? ' disabled' : ''}`;
    return (
        <button onClick={onClick} className={buttonClassName} disabled={disabled}>
            {label}
        </button>
    );
}