import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

/* 숫자 입력시 컴마 표현 */
export default function Number({ item, onChange, onClick, value, readOnly }) {
    /*
     *  부모 예시
     *  const [inputValue, setInputValue] = useState("");
     *  const onChange = (value) => {
     *      setInputValue(value.toLocaleString());
     *  };
     */

    const changeType = (e, number) => {
        const value = e.target.value;
        const removedCommaValue = value.replaceAll(",", "");
        if (removedCommaValue) {
            const intValue = parseInt(removedCommaValue, 10);
            onChange && onChange(intValue);
        } else {
            onChange && onChange(0);
        }
    };
    return (
        <input
            type="text"
            id={uuidv4()}
            className="basic-input"
            name={(item && item.col) || ""}
            // onChange={onChange}
            onChange={changeType}
            value={value || ""}
            placeholder={(item && item.placeholder) || ""}
            disabled={(item && item.disabled) || false}
        />
    );
}
