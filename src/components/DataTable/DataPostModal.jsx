import React, { useEffect, useRef, useState } from "react";
import $ from "jquery";
import "../../components/modal/ModalSearch.css";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-dt/js/dataTables.dataTables";
//import { v4 as uuidv4 } from "uuid";
//import axios from "axios";

export default function DataPostModal({ refresh, postData, columns, onClose }) {
    //const [clCode, setClCode] = useState("");

    //const initializeState = () => {
    //    const initialState = columns.reduce((acc, curr) => {
    //        acc[curr.col] = "";
    //        return acc;
    //    }, {});
    //    setData(initialState);
    //};

    const [data, setData] = useState({});

    //console.log(clCode);

    const inputChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const onAdd = async (e) => {
        e.preventDefault();

        //const newClCode = clCode;
        //setClCode(newClCode);

        //const newData = {
        //...data,
        //clCode: newClCode,
        //};

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
                                    if (column.write) {
                                        return (
                                            <div key={index}>
                                                <label>{column.header}:</label>
                                                <input
                                                    type="text"
                                                    name={column.col}
                                                    value={
                                                        data && data[column.col]
                                                    }
                                                    onChange={inputChange}
                                                />
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
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
                                        onClick={onAdd}>
                                        ADD
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </article>
            </div>
        </div>
    );
}
