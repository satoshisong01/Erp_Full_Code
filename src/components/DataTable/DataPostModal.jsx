import React, { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "../../components/modal/ModalSearch.css";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-dt/js/dataTables.dataTables";
//import { v4 as uuidv4 } from "uuid";
//import axios from "axios";

export default function DataPostModal({
    refresh,
    postData,
    columns,
    onClose,
    saveList,
}) {
    const [data, setData] = useState({});
    useEffect(() => {
        const initialData = columns.reduce((acc, column) => {
            if (column.selectOption) {
                acc[column.col] = saveList[0]; // 첫 번째 값 선택
            } else {
                acc[column.col] = "";
            }
            return acc;
        }, {});

        setData(initialData);
    }, [columns, saveList]);

    const inputChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    console.log(saveList, "값나오나");

    const onAdd = async (e) => {
        e.preventDefault();
        postData(data);
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
                                <h4 className="modal-title">프로젝트 목록</h4>
                            </div>
                            <div
                                className="product-modal-close-btn"
                                onClick={onClose}></div>
                        </div>
                        <form className="product-modal-body">
                            <div className="submitProduct">
                                {columns.map((column, index) => {
                                    if (column.add) {
                                        return (
                                            <div
                                                className="postBox"
                                                key={index}>
                                                <label className="postLabel">
                                                    {column.require && (
                                                        <span className="redStar">
                                                            *
                                                        </span>
                                                    )}
                                                    {column.header}:
                                                </label>
                                                {column.selectOption ? (
                                                    <select
                                                        name={column.col}
                                                        className="postInput"
                                                        onChange={inputChange}>
                                                        {saveList.map(
                                                            (item, index) => (
                                                                <option
                                                                    key={index}
                                                                    value={
                                                                        item
                                                                    }>
                                                                    {item}
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                ) : (
                                                    <input
                                                        placeholder={
                                                            column.header
                                                        }
                                                        className="postInput"
                                                        type="text"
                                                        name={column.col}
                                                        value={
                                                            data[column.col] ||
                                                            ""
                                                        }
                                                        onChange={inputChange}
                                                    />
                                                )}
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-default"
                                    data-dismiss="modal"
                                    onClick={onClose}>
                                    Close
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary modal-btn-close"
                                    id="modalSubmitBtn"
                                    onClick={onAdd}>
                                    ADD
                                </button>
                            </div>
                        </form>
                    </div>
                </article>
            </div>
        </div>
    );
}
