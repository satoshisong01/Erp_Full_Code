import React, { useState } from "react";

export default function ModButton({ label, onClick }) {
    const [disabled, setDisabled] = useState(false);
    const buttonClassName = `table-btn table-btn-default${disabled ? ' disabled' : ''}`;
    return (
        <button onClick={onClick} className={buttonClassName} disabled={disabled}>
            {label}
        </button>
    );
}