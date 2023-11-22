import React, { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-calendar/dist/Calendar.css";
import "react-datepicker/dist/react-datepicker.css";
import ko from "date-fns/locale/ko"; // 한국어 로케일 설정
import { v4 as uuidv4 } from "uuid";

export default function MonthPicker({ name, value, onClick }) {
    const [isVisible, setIsVisible] = useState(true);
    // const datePickerRef = useRef(null);

    useEffect(() => { //다른 곳 클릭 시 닫음
        const handleOutsideClick = (event) => {
            const datePickerContainer = document.querySelector(".react-datepicker__container");
            if (datePickerContainer && !datePickerContainer.contains(event.target)) {
                setIsVisible(true);
            }
        };
        document.addEventListener("click", handleOutsideClick);
        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, []);


    const dateChange = (data) => {
        onClick(formatChange(data));
        setIsVisible(true);
    };

    const formatChange = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const formatted = `${year}-${month}-${day}`;
        return formatted;
    };

    return (
        <DatePicker
            className="form-control flex-item"
            type="text"
            name={name}
            id={uuidv4()}
            value={value}
            locale={ko}
            dateFormat="yyyy-MM"
            onClick={() => setIsVisible(false)}
            onChange={dateChange}
            showMonthYearPicker
            calendarVisible={isVisible}
            // ref={datePickerRef}
        />
    );
}
