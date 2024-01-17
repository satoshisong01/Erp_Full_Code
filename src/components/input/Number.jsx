import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

/* 숫자 입력시 컴마 표현 */
export default function Number({ item, onChange, onClick, value, readOnly }) {
    return (
        <input
            // type="number"
            id={uuidv4()}
            className="basic-input"
            name={item && item.col || ""}
            onChange={onChange}
            value={value || ""}
            placeholder={item && item.placeholder || ""}
            disabled={item.disabled || false}
        />
    );
}

