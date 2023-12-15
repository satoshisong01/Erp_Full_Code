import { PageContext } from "components/PageProvider";
import React, { useContext, useEffect, useState } from "react";

/* 저장 버튼 */
export default function SaveButton({ label, onClick }) {
    const [disabled, setDisabled] = useState(true);

    const buttonClassName = `table-btn table-btn-default${disabled ? ' disabled' : ''}`;
    return (
        <button onClick={onClick} className={buttonClassName} disabled={disabled}>
            {label}
        </button>
    );
}