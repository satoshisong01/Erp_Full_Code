import { PageContext } from "components/PageProvider";
import React, { useContext, useEffect, useState } from "react";

export default function DelButton({ label, onClick }) {
    const [disabled, setDisabled] = useState(true);
    const {lengthSelectRow} = useContext(PageContext);

    useEffect(() => {
        if(lengthSelectRow && lengthSelectRow >= 1) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
    }, [lengthSelectRow]);

    const buttonClassName = `table-btn table-btn-warning${disabled ? ' disabled' : ''}`;

    return (
        <button onClick={onClick} className={buttonClassName} disabled={disabled}>
            {label}
        </button>
    );
}