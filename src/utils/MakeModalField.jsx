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
import CompanyModal from "components/modal/CompanyModal";
import { axiosFetch } from "api/axiosFetch";


export default function MakeModalField({ list, onChange, initialData }) {
    const [isOpenModalCompany, setIsOpenModalCompany] = useState(false);
    const [data, setData] = useState({});

    useEffect(() => {
        setData(initialData);
    }, [initialData])

    useEffect(() => {
        onChange && onChange(data);
    }, [data])
;
    
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
    
    const renderField = (item, index, data) => (
        <div className="row-group" key={index}>
            <div className="left">
                {item.require && <span className="burgundy">*</span>}
                <span>{item.header}</span>
            </div>
            <div className="right">
                {item.type === "input" ? (
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
                ) : null}
            </div>
        </div>
    );
    
    return (
        <>
            {list.map((item, itemIndex) => renderField(item, itemIndex, data))}
            {/* {isOpenModalCompany && <ModalPageCompany returnInfo={returnInfo} closeLocal={() => setIsOpenModalCompany(false)} />} */}
            {isOpenModalCompany && <CompanyModal width={500} height={550} title="회사 목록" returnInfo={returnInfo} onClose={() => setIsOpenModalCompany(false)} />}
        </>
    )
}