import React, { useEffect, useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { v4 as uuidv4 } from "uuid";

export default function DayPicker ({name, value, onClick}) {
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);
    const datePickerRef = useRef(null);

    const handleOutsideClick = (event) => {
        if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
            setIsCalendarVisible(false);
        }
    };

    useEffect(() => { //다른 곳 클릭 시 닫음
        document.addEventListener("click", handleOutsideClick);
        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, []);

    const onClickDay = (data) => {
        onClick(fomatChange(data));
        setIsCalendarVisible(false);
    }

    const fomatChange = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const formatted = `${year}-${month}-${day}`;
        return formatted;
    };

    return (
        <div ref={datePickerRef}>
            <input
                id={uuidv4()}
                type="text"
                name={name}
                value={value || ""}
                onClick={() => setIsCalendarVisible(true)}
                readOnly
                className="basic-input"
                style={{backgroundColor: '#ccc'}}
            />

            {isCalendarVisible && (
                <div
                    id={uuidv4()}
                >
                    <Calendar
                        onClickDay={(data) => onClickDay(data)}
                    />
                </div>
            )}
        </div>
    )
} 