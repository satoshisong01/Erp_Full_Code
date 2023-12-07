import React, { useState } from "react";
import "../../components/modal/ModalCss.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import DayPicker from "components/input/DayPicker";
import ModalPageCompany from "./ModalPageCompany";

/* 추가 모달 */
export default function AddModal(props) {
    const {width, height, list, onClose, sendData, title} = props;
    const [isOpenModalCompany, setIsOpenModalCompany] = useState(false);
    const [data, setData] = useState({});

    const inputChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // 데이터 추가 버튼을 눌렀을 때 실행되는 함수
    const onAdd = async (e) => {
        e.preventDefault();

        // 필수 필드가 비어있는지 확인
        const requiredColumns = list && list.filter((column) => column.require);
        const hasEmptyRequiredFields = requiredColumns.some((column) => !data[column.col]);
        //필수값 확인 후
        sendData(); //데이터 부모로 전송
        onClose();
    };

    const dateClick = (date, col) => {
        setData((prevData) => ({
            ...prevData,
            [col]: date,
        }));
    };

    return (
        <article className="me-modal">
            <div className="me-modal-container" style={{ width, height }}>
                <div className="me-modal-inner">
                    <div className="me-modal-header mg-t-20">
                        <h4 className="header-title">{title}</h4>
                        <div className="header-close" onClick={onClose}>
                            <FontAwesomeIcon icon={faXmark} className="button" size="lg"/>
                        </div>
                    </div>

                    <div className="line mg-t-10 mg-b-20" />

                    <form className="me-modal-body">
                        {list && list.map((column, index) => {
                            if (column.items.length === 1) {
                                return (
                                    <div className="body-row" key={index}>
                                        <div className="row-group" >
                                            <div className="left">
                                                {column.items[0].require && <span className="red">*</span>}
                                                <span>{column.items[0].header}</span>
                                            </div>
                                            <div className="right">
                                                {column.items[0].type === "input" ? (
                                                    <input
                                                        id={index}
                                                        name={column.items[0].col}
                                                        className="input"
                                                        onChange={inputChange}
                                                        value={data[column.items[0].col] || ""}
                                                        placeholder={column.items[0].placeholder}
                                                    /> 
                                                    ) : column.items[0].type === "daypicker" ? (
                                                        <DayPicker
                                                            id={index}
                                                            name={column.items[0].col}
                                                            onClick={e => dateClick(e, column.items[0].col)}
                                                            value={data[column.items[0].col] || ""}
                                                            placeholder={column.items[0].placeholder}
                                                        />
                                                        ) : column.items[0].type === "buttonCompany" ? (
                                                            <input
                                                                key={index}
                                                                className="buttonSelect"
                                                                name={column.items[0].col}
                                                                onClick={() => setIsOpenModalCompany(true)}
                                                                type="text"
                                                                value={data[column.items[0].col] || ""}
                                                                placeholder={column.items[0].placeholder}
                                                                readOnly
                                                            />
                                                        ) : null}
                                            </div>
                                        </div>
                                    </div>
                                )
                            } else if(column.items.length === 2) {
                                return (
                                    <div className="body-row" key={index}>
                                        <div className="row-group" >
                                            <div className="left">
                                                {column.items[0].require && <span className="red">*</span>}
                                                <span>{column.items[0].header}</span>
                                            </div>
                                            <div className="right">
                                                {column.items[0].type === "input" ? (
                                                    <input
                                                        id={index}
                                                        name={column.items[0].col}
                                                        className="input"
                                                        onChange={inputChange}
                                                        value={data[column.items[0].col] || ""}
                                                        placeholder={column.items[0].placeholder}
                                                    /> 
                                                ) : column.items[0].type === "daypicker" ? (
                                                    <DayPicker
                                                        id={index}
                                                        name={column.items[0].col}
                                                        onClick={e => dateClick(e, column.items[0].col)}
                                                        value={data[column.items[0].col] || ""}
                                                        placeholder={column.items[0].placeholder}
                                                    />
                                                    ) : column.items[0].type === "buttonCompany" ? (
                                                        <input
                                                            key={index}
                                                            className="buttonSelect"
                                                            name={column.items[0].col}
                                                            onClick={() => setIsOpenModalCompany(true)}
                                                            type="text"
                                                            value={data[column.items[0].col] || ""}
                                                            placeholder={column.items[0].placeholder}
                                                            readOnly
                                                        />
                                                    ) : null}
                                            </div>
                                        </div>
                                        <div className="row-group" >
                                            <div className="left">
                                                {column.items[1].require && <span className="red">*</span>}
                                                <span>{column.items[1].header}</span>
                                            </div>
                                            <div className="right">
                                                {column.items[1].type === "input" ? (
                                                    <input
                                                        id={index}
                                                        name={column.items[1].col}
                                                        className="input"
                                                        onChange={inputChange}
                                                        value={data[column.items[1].col] || ""}
                                                        placeholder={column.items[1].placeholder}
                                                    /> 
                                                    ) : column.items[1].type === "daypicker" ? (
                                                        <DayPicker
                                                            id={index}
                                                            name={column.items[1].col}
                                                            onClick={e => dateClick(e, column.items[1].col)}
                                                            value={data[column.items[1].col] || ""}
                                                            placeholder={column.items[1].placeholder}
                                                        />
                                                        ) : column.items[1].type === "buttonCompany" ? (
                                                            <input
                                                                key={index}
                                                                className="buttonSelect"
                                                                name={column.items[1].col}
                                                                onClick={() => setIsOpenModalCompany(true)}
                                                                type="text"
                                                                value={data[column.items[1].col] || ""}
                                                                placeholder={column.items[1].placeholder}
                                                                readOnly
                                                            />
                                                        ) : null}
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        })}
                    </form>

                    <div className="me-modal-footer mg-t-20">
                        <div className="table-buttons" style={{justifyContent: "center"}}>
                            <button
                                type="button"
                                className="table-btn table-btn-default"
                                data-dismiss="modal"
                                style={{width: '100%'}}
                                onClick={() => {onClose()}}
                            >
                                취소
                            </button>
                            <button
                                type="button"
                                className="table-btn table-btn-primary"
                                style={{width: '100%'}}
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