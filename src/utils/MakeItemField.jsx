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


export default function MakeItemField({ item, resultData, initialData }) {
    const [isOpenModalCompany, setIsOpenModalCompany] = useState(false);
    const [data, setData] = useState({});

    useEffect(() => {
        setData(initialData);
    }, [initialData])

    useEffect(() => {
        resultData && resultData(data);
    }, [data])
    
    const inputChange = (e, type) => {
        const { value, name } = e.target;
        if (type === "number") {
            let parsedValue = parseFloat(value.replace(/,/g, "")); // 컴마 제거하고 문자열을 숫자로 변환
            if (isNaN(parsedValue)) {
                console.log("입력된 값이 숫자가 아닙니다.");
            }
            setData((prevData) => ({
                ...prevData,
                [name]: parsedValue,
            }));
        } else {
            setData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };
    
    const dateClick = (date, col) => {
        setData((prevData) => ({
            ...prevData,
            [col]: date,
        }));
    };

    const returnInfo = (item) => {
        //선택한 정보
        console.log(item, "item");
        setIsOpenModalCompany(false);
        setData((prevData) => ({
            ...prevData,
            cltNm: item.cltNm,
            cltId: item.cltId,
        }));
    };

    const radioClick = (value) => {
        console.log("라디오클릭!!!!!!!", value);
    }
    
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
                onChange={(e) => inputChange(e, "number")}
                value={data?.[item.col] ? data[item.col].toLocaleString() : ""}
                disabled={item.disabled}
            />
        ) : item.type === "select" ? (
            <BasicSelect item={item} onChange={inputChange} value={data?.[item.col] ?? ""} />
        ) : item.type === "radio" ? (
            item.option && item.option.length > 0  &&
                <div className="flex-between">
                    {item.option.map((op) => (
                        <div key={uuidv4()} className="radio-option">
                            <input
                                id={op.value} //id추가
                                type="radio"
                                value={op.value}
                                checked={op.value === item.option[0].value}
                                onChange={() => radioClick(op.value)}
                                // className="radio"
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
            {isOpenModalCompany && <ModalPageCompany returnInfo={returnInfo} closeLocal={() => setIsOpenModalCompany(false)} />}
        </>
    )
}