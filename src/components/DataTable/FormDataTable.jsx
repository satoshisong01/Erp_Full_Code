import { PageContext } from "components/PageProvider";
import Status from "components/button/Status";
import React, { useContext, useEffect, useRef, useState } from "react";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function FormDataTable({ formTableColumns, onAddRow, title, useStatus }) {
    const { setNewRowData } = useContext(PageContext);
    
    const [formattedDate, setFormattedDate] = useState("");
    const [formattedDate2, setFormattedDate2] = useState("");
    const [isCalendarVisible, setCalendarVisible] = useState(false);
    const [isCalendarVisible2, setCalendarVisible2] = useState(false);
    const [initialFormData, setInitialFormData] = useState({})
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [isUse, setIsUse] = useState(useStatus);

    const inputRef = useRef(null);
    const inputRef2 = useRef(null);

    const handleInputClick = () => {
        setCalendarVisible(true);
    };

    const handleInputClick2 = () => {
        setCalendarVisible2(true);
    };

    const handleDateChange = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const formatted = `${year}-${month}-${day}`;

        return formatted;
    };

    const handleDateClick = (date) => {
        //날짜 선택 후 저장하기
        const tmp = handleDateChange(date);
        setFormattedDate(tmp);
        setCalendarVisible(false);

        setFormData((prevData) => ({
            ...prevData,
            poiBeginDt: tmp,
        }));
        setErrors((prevErrors) => ({
            //에러 초기화
            ...prevErrors,
            poiBeginDt: "",
        }));
    };

    const handleDateClick2 = (date) => {
        //날짜 선택 후 저장하기
        const tmp = handleDateChange(date);
        setFormattedDate2(tmp);
        setCalendarVisible2(false);

        setFormData((prevData) => ({
            ...prevData,
            poiEndDt: tmp,
        }));
        setErrors((prevErrors) => ({
            //에러 초기화
            ...prevErrors,
            poiEndDt: "",
        }));
    };

    const handleOutsideClick = (event) => {
        if (
            inputRef.current &&
            !inputRef.current.contains(event.target) &&
            !event.target.classList.contains("react-calendar") &&
            !event.target.closest(".boxCalendar")
        ) {
            setCalendarVisible(false);
        }
    };

    const handleOutsideClick2 = (event) => {
        if (
            inputRef2.current &&
            !inputRef2.current.contains(event.target) &&
            !event.target.classList.contains("react-calendar") &&
            !event.target.closest(".boxCalendar")
        ) {
            setCalendarVisible2(false);
        }
    };

    useEffect(() => {
        formTableColumns.forEach((row) => {
            row.forEach(({ key }) => {
                setInitialFormData(prevData => {
                    return {
                        ...prevData,
                        [key]: ""
                    };
                });
            });
        });
        setFormData({...initialFormData});

        document.addEventListener("click", handleOutsideClick);
        document.addEventListener("click", handleOutsideClick2);

        return () => {
            document.removeEventListener("click", handleOutsideClick);
            document.removeEventListener("click", handleOutsideClick2);
        };
    }, []);


    useEffect(() => {
        // 버튼 사용 여부
        setIsUse(useStatus);
    }, [useStatus]);

    const inputChange = (fieldName, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [fieldName]: value,
        }));
        setErrors((prevErrors) => ({
            //에러 초기화
            ...prevErrors,
            [fieldName]: "",
        }));
    };


    const validateForm = () => {
        const newErrors = {};
        let isValid = true;

        formTableColumns.forEach((row) => {
            row.forEach(({ key, require }) => {
                if (require && !formData[key]) {
                    newErrors[key] = "This field is required.";
                    isValid = false;
                }
            });
        });

        setErrors(newErrors);
        return isValid;
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            if(title) {
                const updatedFormData = { ...formData, poiStatus: "작성완료" }; // state 속성 변경
                setNewRowData(updatedFormData);
            } else {
                setNewRowData(...formData);
            }
            setFormData(initialFormData); // 초기화
        }
    };

    const onReset = () => {
        setFormData(initialFormData); // 초기화
        setErrors({});
    };

    return (
        <>
            {isUse && (
                <div className="flex-between mg-b-10">
                    <span className="table-title">{title}</span>
                    <span>
                        <button onClick={onReset} className="btn-outline mg-r-10" type="submit">
                            초기화
                        </button>
                        <button onClick={onSubmit} className="btn-outline" type="submit">
                            등록
                        </button>
                    </span>
                </div>
            )}
            <div className="table-Container">
                <form onSubmit={onSubmit}>
                    <table className="table-styled">
                        <tbody>
                            {formTableColumns.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {row.map(({ label, key, type, colSpan, option, require, value }, colIndex) => {
                                        return (
                                            <React.Fragment key={colIndex}>
                                                <th>
                                                    <span>{label}</span>
                                                    {require && <span className="text-danger mg-l-5">*</span>}
                                                </th>
                                                {type === "input" ? (
                                                    <td colSpan={colSpan || "1"}>
                                                        <input
                                                            id={key}
                                                            type="text"
                                                            value={formData[key]}
                                                            onChange={(e) => inputChange(key, e.target.value)}
                                                        />
                                                        {errors[key] && <div className="text-error-color">{errors[key]}</div>}
                                                    </td>
                                                ) : type === "select" ? (
                                                    <td colSpan={colSpan || "1"}>
                                                        <select
                                                            id={key}
                                                            value={formData[key]}
                                                            onChange={(e) => inputChange(key, e.target.value)}
                                                        >
                                                            <option value="">선택</option>
                                                            {option.map((op) => (
                                                                <option key={op} value={op}>
                                                                    {op}
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {errors[key] && <div className="text-error-color">{errors[key]}</div>}
                                                    </td>
                                                ) : type === "datepicker" ? (
                                                    <td className="box3-1 boxDate">
                                                        <input
                                                            className="form-control flex-item"
                                                            type="text"
                                                            id="searchKeyword"
                                                            value={formattedDate}
                                                            onClick={handleInputClick}
                                                            readOnly
                                                            ref={inputRef}
                                                        />
                                                        {isCalendarVisible && (
                                                            <div className="boxCalendar">
                                                                <Calendar onClickDay={handleDateClick} />
                                                            </div>
                                                        )}
                                                    </td>
                                                ) : type === "datepicker2" ? (
                                                    <td className="box3-1 boxDate">
                                                        <input
                                                            className="form-control flex-item"
                                                            type="text"
                                                            id="searchKeyword"
                                                            value={formattedDate2}
                                                            onClick={handleInputClick2}
                                                            readOnly
                                                            ref={inputRef2}
                                                        />
                                                        {isCalendarVisible2 && (
                                                            <div className="boxCalendar">
                                                                <Calendar onClickDay={handleDateClick2} />
                                                            </div>
                                                        )}
                                                    </td>
                                                ) : //</div>
                                                label === "상태" ? (
                                                    <td colSpan={colSpan || "1"}>
                                                        <span>
                                                            <Status status={formData[key]="작성중"} />
                                                        </span>
                                                    </td>
                                                ) : type === "data" ? (
                                                    <td colSpan={colSpan || "1"}>
                                                        <span>{value}</span>
                                                    </td>
                                                ) : null}
                                            </React.Fragment>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </form>
            </div>
        </>
    );
}
