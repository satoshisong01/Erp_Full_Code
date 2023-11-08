import { PageContext } from "components/PageProvider";
import Status from "components/button/Status";
import React, { useContext, useEffect, useRef, useState } from "react";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function FormDataTable({ formTableColumns, onAddRow, title, useStatus }) {
    const [fieldList, setFieldList] = useState([]);

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedDate2, setSelectedDate2] = useState(new Date());
    const [formattedDate, setFormattedDate] = useState("");
    const [formattedDate2, setFormattedDate2] = useState("");
    const [isCalendarVisible, setCalendarVisible] = useState(false);
    const [isCalendarVisible2, setCalendarVisible2] = useState(false);

    useEffect(() => {
        console.log(formattedDate, "앞에 날짜");
        console.log(formattedDate2, "날짜받기");
    }, [formattedDate, formattedDate2]);

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
        setSelectedDate(date);
        setFormattedDate(handleDateChange(date));
        setCalendarVisible(false);
    };

    const handleDateClick2 = (date) => {
        setSelectedDate2(date);
        setFormattedDate2(handleDateChange(date));
        setCalendarVisible2(false);
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
        document.addEventListener("click", handleOutsideClick);
        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, []);

    useEffect(() => {
        document.addEventListener("click", handleOutsideClick2);
        return () => {
            document.removeEventListener("click", handleOutsideClick2);
        };
    }, []);

    useEffect(() => {
        setFieldList(formTableColumns);
    }, [formTableColumns]);

    const { setNewRowData } = useContext(PageContext);

    const initialFormData = {}; // 폼 초기 데이터

    formTableColumns.forEach((row) => {
        row.forEach(({ key }) => {
            initialFormData[key] = "";
        });
    });

    useEffect(() => {
        // 버튼 사용 여부
        setIsUse(useStatus);
    }, [useStatus]);

    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [isUse, setIsUse] = useState(useStatus);

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

    useEffect(() => {
        console.log(formData, "❤️❤️❤️❤️");
    }, [formData]);

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
            const updatedFormData = { ...formData, poiStatus: "작성완료" }; // state 속성 변경
            setNewRowData(updatedFormData);
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
                                                            type="text"
                                                            value={formData[key]}
                                                            onChange={(e) => inputChange(key, e.target.value)}
                                                            // placeholder={key}
                                                        />
                                                        {errors[key] && <div className="text-error-color">{errors[key]}</div>}
                                                    </td>
                                                ) : type === "select" ? (
                                                    <td colSpan={colSpan || "1"}>
                                                        <select
                                                            value={formData[key]}
                                                            onChange={(e) => inputChange(key, e.target.value)}
                                                            // placeholder={errors[key]}
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
                                                    //<div className="box3-0">
                                                    <td className="box3-1 boxDate">
                                                        <input
                                                            className="form-control flex-item"
                                                            type="text"
                                                            id="searchKeyword"
                                                            value={formattedDate}
                                                            onClick={handleInputClick}
                                                            readOnly
                                                            ref={inputRef}
                                                            onChange={() => {
                                                                const formatted = handleDateChange(selectedDate);
                                                                setFormattedDate(formatted);
                                                                inputChange(key, formattedDate);
                                                            }}
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
                                                            onChange={() => {
                                                                const formatted = handleDateChange(selectedDate2);
                                                                setFormattedDate2(formatted);
                                                            }}
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
                                                            <Status status="작성중" />
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
