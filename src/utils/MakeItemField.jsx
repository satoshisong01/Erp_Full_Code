import React, { useEffect, useRef, useState } from "react";
import DayPicker from "components/input/DayPicker";
import MonthPicker from "components/input/MonthPicker";
import YearPicker from "components/input/YearPicker";
import BasicInput from "components/input/BasicInput";
import BasicTextarea from "components/input/BasicTextarea";
import Percentage from "components/input/Percentage";
import BasicSelect from "components/input/BasicSelect";
import Number from "components/input/Number";
import ModalPageCompany from "components/modal/ModalPageCompany";
import { v4 as uuidv4 } from "uuid";
import BasicRadio from "components/input/BasicRadio";
import CompanyModal from "components/modal/CompanyModal";


export default function MakeItemField({ item, resultData, initialData }) {
    const [isOpenModalCompany, setIsOpenModalCompany] = useState(false);
    const [data, setData] = useState({});
    
    useEffect(() => {
        setData(initialData);
    }, [initialData])

    useEffect(() => {
        resultData && resultData(data);
    }, [data])
    
    const inputChange = (e) => {
        const { value, name } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    
    const dateClick = (date, col) => {
        setData((prevData) => ({
            ...prevData,
            [col]: date,
        }));
    };

    const renderField = (item) => (
        item.type === "input" ? (
            <BasicInput item={item} onChange={inputChange} value={data?.[item.col] ?? ""} />
        ) : item.type === "dayPicker" ? (
            <DayPicker name={item.col} onClick={(e) => dateClick(e, item.col)} value={data?.[item.col] ?? ""} placeholder={item.placeholder} />
        ) : item.type === "monthPicker" ? (
            <MonthPicker name={item.col} onClick={(e) => dateClick(e, item.col)} value={data?.[item.col] ?? ""} placeholder={item.placeholder} />
        ) : item.type === "yearPicker" ? (
            <YearPicker name={item.col} onClick={(e) => dateClick(e, item.col)} value={data?.[item.col] ?? ""} placeholder={item.placeholder} />
        ) : item.type === "company" ? (
            <BasicInput item={item} onClick={() => setIsOpenModalCompany(true)} value={data?.[item.col] ?? ""} readOnly />
        ) : item.type === "desc" ? (
            <BasicTextarea item={item} onChange={inputChange} value={data?.[item.col] ?? ""} />
        ) : item.type === "percent" ? (
            <Percentage item={item} onChange={inputChange} value={data?.[item.col] ?? ""} />
        ) : item.type === "number" ? (
            <Number
                item={item}
                onChange={(e) => inputChange(e)}
                value={data?.[item.col] ? data[item.col].toLocaleString() : ""}
                disabled={item.disabled}
            />
        ) : item.type === "select" ? (
            <BasicSelect item={item} onChange={inputChange} value={data?.[item.col] ?? ""} />
        ) : item.type === "radio" ? (
            item.option && item.option.length > 0  &&
                <div className="radio-container">
                    {item.option.map((op) => (
                        <div key={uuidv4()} className="radio-group">
                            <input
                                id={uuidv4()}
                                type="radio"
                                name={item.col}
                                value={op.value}
                                checked={data?.[item.col] === op.value}
                                onChange={inputChange}
                            />
                            <label htmlFor={op.value}>{op.label}</label>
                        </div>
                    ))}
                </div>
        ) : null
    )
    
    return (
        <>
            {renderField(item)}
            {isOpenModalCompany && <CompanyModal width={500} height={550} title="회사 목록" onClose={() => setIsOpenModalCompany(false)} />}
        </>
    )
}