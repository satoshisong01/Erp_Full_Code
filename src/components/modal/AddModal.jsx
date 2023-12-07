import React, { useEffect, useRef, useState } from "react";
import "../../components/modal/ModalSearch.css";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-dt/js/dataTables.dataTables";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuidv4 } from "uuid";

/* 추가 모달 */
export default function AddModal(props) {
    const {width, height, columns, onClose, sendData} = props;
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
        const requiredColumns = columns.filter((column) => column.require);
        const hasEmptyRequiredFields = requiredColumns.some((column) => !data[column.col]);
        //필수값 확인 후
        sendData(); //데이터 부모로 전송
        onClose();
    };

    return (
        <div className="modal-dialog demo-modal">
            <div className="modal-content">
                <article className="product-modal">
                    <div className="product-modal-bg"></div>

                    <div className="product-modal-inner">
                        <div className="product-modal-header">
                            <div className="modal-header">
                                <h4 className="modal-title">프로젝트 추가</h4>
                            </div>
                            <div className="product-modal-close-btn" onClick={onClose}>
                                <FontAwesomeIcon icon={faXmark} className="xBtn" />
                            </div>
                        </div>
                        <form className="product-modal-body">
                            <div className="submitProduct">
                                {columns && columns.map((column, index) => {
                                    return (
                                        <div className="postBox" key={index}>
                                            <div className="inputBox">
                                                <label className="postLabel">
                                                    {column.require && <span className="redStar">*</span>}
                                                    {column.header}:
                                                </label>
                                                {column.type === "select" ? (
                                                    <select
                                                        key={uuidv4()}
                                                        name={column.col}
                                                        className="postInput"
                                                        onChange={inputChange}
                                                    >
                                                        {column.option.map((op) => (
                                                            <option key={uuidv4()} value={op.value}>
                                                                {op.label}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <input
                                                        key={uuidv4()}
                                                        placeholder={column.placeholder || column.header}
                                                        className="postInput"
                                                        type="text"
                                                        name={column.col}
                                                        value={data[column.col] || ""}
                                                        onChange={inputChange}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-default"
                                    data-dismiss="modal"
                                    onClick={() => { onClose(); }}>
                                    취소
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary modal-btn-close"
                                    id="modalSubmitBtn"
                                    onClick={onAdd}>
                                    추가
                                </button>
                            </div>
                        </form>
                    </div>
                </article>
            </div>
        </div>
    );
}
