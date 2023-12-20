import React, { useContext, useEffect, useRef, useState } from "react";
import DayPicker from "components/input/DayPicker";
import MonthPicker from "components/input/MonthPicker";
import YearPicker from "components/input/YearPicker";
import BasicInput from "components/input/BasicInput";
import BasicTextarea from "components/input/BasicTextarea";
import Percentage from "components/input/Percentage";
import BasicSelect from "components/input/BasicSelect";
import Number from "components/input/Number";
import CompanyModal from "components/modal/CompanyModal";
import { axiosFetch } from "api/axiosFetch";
import { v4 as uuidv4 } from "uuid";
import ProjectModal from "components/modal/ProjectModal";
import { PageContext } from "components/PageProvider";

export default function MakeModalField({ list, onChange, initialData }) {
    const [isOpenModalCompany, setIsOpenModalCompany] = useState(false);
    const [isOpenModalProject, setIsOpenModalProject] = useState(false);
    const [data, setData] = useState({});
    const { companyInfo, projectInfo } = useContext(PageContext);

    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    useEffect(() => {
        onChange && onChange(data);
        console.log(data, "??!@?");
    }, [data]);

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

    useEffect(() => {
        if (companyInfo.cltId) {
            setData((prevData) => ({ ...prevData, ...companyInfo }));
        }
    }, [companyInfo]);

    useEffect(() => {
        if (projectInfo.poiId) {
            setData((prevData) => ({ ...prevData, ...projectInfo }));
        }
    }, [projectInfo]);

    //const projectClick = () => {
    //    setData((prevData) => ({
    //        ...prevData,
    //        cltNm: projectInfo.poiNm,
    //    }));
    //};

    const companyClick = () => {
        setData((prevData) => ({
            ...prevData,
            cltNm: companyInfo.cltNm,
        }));
    };

    const dateClick = (date, col) => {
        setData((prevData) => ({
            ...prevData,
            [col]: date,
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
                    <BasicInput
                        item={item}
                        onClick={() => {
                            companyClick();
                            setIsOpenModalCompany(true);
                        }}
                        value={data?.[item.col] ?? ""}
                        readOnly
                    />
                ) : item.type === "project" ? (
                    <BasicInput
                        item={item}
                        onClick={() => {
                            //projectClick();
                            setIsOpenModalProject(true);
                        }}
                        value={data?.[item.col] ?? ""}
                        readOnly
                    />
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
                    item.option &&
                    item.option.length > 0 && (
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
                    )
                ) : null}
            </div>
        </div>
    );

    return (
        <>
            {list.map((item, itemIndex) => renderField(item, itemIndex, data))}
            {isOpenModalCompany && <CompanyModal width={500} height={550} title="회사 목록" onClose={() => setIsOpenModalCompany(false)} />}
            {isOpenModalProject && <ProjectModal width={550} height={770} title="프로젝트 목록" onClose={() => setIsOpenModalProject(false)} />}
        </>
    );
}
