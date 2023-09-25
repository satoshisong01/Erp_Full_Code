import React, { useEffect, useState } from "react";

export default function DelButton({ label, length, onClick }) {
    const [disabled, setDisabled] = useState(true);

    useEffect(() => {
        if(length && length >= 1) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
    }, [length]);

    const buttonClassName = `table-btn table-btn-warning${disabled ? ' disabled' : ''}`;

    return (
        <button onClick={onClick} className={buttonClassName} disabled={disabled}>
            {label}
        </button>
    );
}