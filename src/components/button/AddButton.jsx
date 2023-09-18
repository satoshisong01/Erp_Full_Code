import { PageContext } from "components/PageProvider";
import React, { useContext, useEffect, useState } from "react";

export default function AddButton({ label, onClick }) {
    const { lengthSelectRow } = useContext(PageContext)
    const [disabled, setDisabled] = useState(true);

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