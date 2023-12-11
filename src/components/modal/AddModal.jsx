import React, { useEffect, useRef, useState } from "react";
import "../../components/modal/ModalCss.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import DayPicker from "components/input/DayPicker";
import ModalPageCompany from "./ModalPageCompany";
import MonthPicker from "components/input/MonthPicker";
import YearPicker from "components/input/YearPicker";
import BasicInput from "components/input/BasicInput";
import BasicTextarea from "components/input/BasicTextarea";
import Percentage from "components/input/Percentage";
import BasicSelect from "components/input/BasicSelect";
import Number from "components/input/Number";

/* 추가 모달 */
export default function AddModal(props) {
    const { width, height, list, onClose, sendData, title } = props;
    const [isOpenModalCompany, setIsOpenModalCompany] = useState(false);
    const [data, setData] = useState({});
    const bodyRef = useRef(null);

    useEffect(() => { // me-modal-body의 높이를 동적 계산
        if (bodyRef.current) {
            const headerHeight = document.querySelector(".me-modal-header")?.clientHeight || 0;
            const footerHeight = document.querySelector(".me-modal-footer")?.clientHeight || 0;
            const calculatedHeight = height - headerHeight - footerHeight;
            bodyRef.current.style.height = `${calculatedHeight}px`;
        }
    }, [height]);

    const inputChange = (e, type) => {
        const { value, name } = e.target;
        if(type === "number") {
            let parsedValue = parseFloat(value.replace(/,/g, '')); // 컴마 제거하고 문자열을 숫자로 변환
            if (isNaN(parsedValue)) {
                console.log("입력된 값이 숫자가 아닙니다.");
            }
            setData((prevData) => ({
                ...prevData,
                [name]: parsedValue,
            }));

        }  else {
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

    const onAdd = async (e) => {
        e.preventDefault();

        // 필수 필드가 비어있는지 확인
        const requiredColumns = list && list.filter((column) => column.require);
        const hasEmptyRequiredFields = requiredColumns.some((column) => !data[column.col]);
        //필수값 확인 후
        sendData(); //데이터 부모로 전송
        onClose();
    };

    const renderInputField = (item, index) => (
        <div className="row-group" key={index}>
            <div className="left">
                {item.require && <span className="red">*</span>}
                <span>{item.header}</span>
            </div>
            <div className="right">
                {item.type === "input" ? (
                    <BasicInput
                        item={item}
                        onChange={inputChange}
                        value={data[item.col] || ""}
                    />
                ) : item.type === "dayPicker" ? (
                    <DayPicker
                        name={item.col}
                        onClick={(e) => dateClick(e, item.col)}
                        value={data[item.col] || ""}
                        placeholder={item.placeholder}
                    />
                ) : item.type === "monthPicker" ? (
                    <MonthPicker
                        name={item.col}
                        onClick={(e) => dateClick(e, item.col)}
                        value={data[item.col] || ""}
                        placeholder={item.placeholder}
                    />
                ) : item.type === "yearPicker" ? (
                    <YearPicker
                        name={item.col}
                        onClick={(e) => dateClick(e, item.col)}
                        value={data[item.col] || ""}
                        placeholder={item.placeholder}
                    />
                ) : item.type === "company" ? (
                    <BasicInput
                        item={item}
                        onClick={() => setIsOpenModalCompany(true)}
                        value={data[item.col] || ""}
                        readOnly
                    />
                ) : item.type === "desc" ? (
                    <BasicTextarea
                        item={item}
                        onChange={inputChange}
                        value={data[item.col] || ""}
                    />
                ) : item.type === "percent" ? (
                    <Percentage
                        item={item}
                        onChange={inputChange}
                        value={data[item.col] || ""}
                    />
                ) : item.type === "number" ? (
                    <Number
                        item={item}
                        onChange={(e) => inputChange(e, "number")}
                        value={data[item.col] && data[item.col].toLocaleString() || ""}
                        disabled={item.disabled}
                    />
                ) : item.type === "select" ? (
                    <BasicSelect
                        item={item}
                        onChange={inputChange}
                        value={data[item.col] || ""}
                    />
                ) : null}
            </div>
        </div>
    );

    return (
        <article className="me-modal">
            <div className="me-modal-container" style={{ width, height }}>
                <div className="me-modal-inner">
                    <div className="me-modal-header">
                        <h4 className="header-title">{title}</h4>
                        <div className="header-close" onClick={onClose}>
                            <FontAwesomeIcon icon={faXmark} className="button" size="lg" />
                        </div>
                    </div>

                    <form className="me-modal-body" ref={bodyRef} style={{ overflowY: 'auto' }}>
                        {list &&
                            list.map((column, index) => (
                                <div className="body-row" key={index}>
                                    {column.items.map((item, itemIndex) => renderInputField(item, itemIndex))}
                                </div>
                            ))}
                    </form>

                    <div className="me-modal-footer mg-b-20">
                        <div className="table-buttons" style={{ justifyContent: "center" }}>
                            <button
                                className="table-btn table-btn-default"
                                data-dismiss="modal"
                                style={{ width: "100%" }}
                                onClick={() => onClose()}
                            >
                                취소
                            </button>
                            <button
                                className="table-btn table-btn-primary"
                                style={{ width: "100%" }}
                                onClick={onAdd}
                            >
                                추가
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isOpenModalCompany && <ModalPageCompany closeLocal={() => setIsOpenModalCompany(false)} />}
        </article>
    );
}
