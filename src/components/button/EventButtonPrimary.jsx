import { PageContext } from "components/PageProvider";
import React, { useContext, useEffect, useState } from "react";

export default function EventButtonPrimary({ label, onClick }) {
    const { selectDatas } = useContext(PageContext)
    const [disabled, setDisabled] = useState(true);

    useEffect(() => {
        if(selectDatas.length > 0) {
            setDisabled(false)
        } else if (selectDatas.length === 0) {
            setDisabled(true)
        }
    }, [selectDatas]);

    const buttonClassName = `table-btn table-btn-primary${disabled ? ' disabled' : ''}`;

    return (
        <button onClick={onClick} className={buttonClassName} disabled={disabled}>
            {label}
        </button>
    );
}