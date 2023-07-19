import React, { useEffect, useRef, useState } from "react";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-dt/js/dataTables.dataTables";
import $ from "jquery";
import "./ModalSearch.css";
import axios from "axios";
//import Header from "./Header";

export default function ModalPage({ onClose, clickData, refresh, urlName }) {
    const dataTableRef = useRef(null); //dataTable 테이블 명시
    const [data, setData] = useState({
        clCode: "",
        clCodeNm: "",
        clCodeDc: "",
        createIdBy: "",
        createDate: "",
        lastModifiedIdBy: "",
        lastModifyDate: "",
    });

    console.log(data, "기본으로 받은 값");

    useEffect(() => {
        setData(clickData);
    }, [clickData]);

    const inputChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
        console.log(data, "변경 후 값");
    };

    const onModify = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put(
                `http://192.168.0.113:8080/api/system/code/${urlName}/edit.do`,
                data
            );
            console.log(response, "보낸 값?");
            refresh();
        } catch (error) {
            console.log(error, "수정 에러입니다");
        } finally {
            alert("수정되었습니다");
            $(dataTableRef.current).DataTable({
                paging: true,
                searching: true,
                ordering: true,
            });
        }
    };

    let codeInput, idInput, nameInput, descInput;

    if (urlName === "clCode") {
        codeInput = (
            <div>
                분류코드:
                <input
                    type="text"
                    name="clCode"
                    value={data.clCode}
                    onChange={inputChange}
                />
            </div>
        );
        idInput = (
            <div>
                그룹코드ID:
                <input
                    type="text"
                    name="groupId"
                    value={data.groupId}
                    onChange={inputChange}
                />
            </div>
        );
        nameInput = (
            <div>
                그룹코드명:
                <input
                    type="text"
                    name="groupName"
                    value={data.groupName}
                    onChange={inputChange}
                />
            </div>
        );
        descInput = (
            <div>
                그룹코드설명:
                <input
                    type="text"
                    name="groupDesc"
                    value={data.groupDesc}
                    onChange={inputChange}
                />
            </div>
        );
    } else if (urlName === "groupCode") {
        codeInput = (
            <div>
                그룹코드:
                <input
                    type="text"
                    name="groupCode"
                    value={data.groupCode}
                    onChange={inputChange}
                />
            </div>
        );
        idInput = (
            <div>
                상세코드ID:
                <input
                    type="text"
                    name="clCode"
                    value={data.clCode}
                    onChange={inputChange}
                />
            </div>
        );
        nameInput = (
            <div>
                상세코드명:
                <input
                    type="text"
                    name="clCodeNm"
                    value={data.clCodeNm}
                    onChange={inputChange}
                />
            </div>
        );
        descInput = (
            <div>
                상세코드설명:
                <input
                    type="text"
                    name="clCodeDc"
                    value={data.clCodeDc}
                    onChange={inputChange}
                />
            </div>
        );
    } else if (urlName === "detailCode") {
        codeInput = (
            <div>
                그룹코드:
                <input
                    type="text"
                    name="groupCode"
                    value={data.groupCode}
                    onChange={inputChange}
                />
            </div>
        );
        idInput = (
            <div>
                상세코드ID:
                <input
                    type="text"
                    name="clCode"
                    value={data.clCode}
                    onChange={inputChange}
                />
            </div>
        );
        nameInput = (
            <div>
                상세코드명:
                <input
                    type="text"
                    name="clCodeNm"
                    value={data.clCodeNm}
                    onChange={inputChange}
                />
            </div>
        );
        descInput = (
            <div>
                상세코드설명:
                <input
                    type="text"
                    name="clCodeDc"
                    value={data.clCodeDc}
                    onChange={inputChange}
                />
            </div>
        );
    }

    return (
        <div
            className="modal-dialog demo-modal"
            style={{ margin: "0", zIndex: "9999" }}
        >
            <div className="modal-content" style={{ border: "0" }}>
                <article className="product-modal">
                    <div className="product-modal-bg"></div>

                    <div className="product-modal-inner">
                        <div className="product-modal-header">
                            <div
                                className="modal-header"
                                style={{ border: "none" }}
                            >
                                <h4 className="modal-title">프로젝트 목록</h4>
                            </div>
                            <div
                                className="product-modal-close-btn"
                                onClick={onClose}
                            >
                                <i
                                    style={{
                                        fontSize: "2rem",
                                        //padding: "0.5rem",
                                        color: "#CCCCCC",
                                        borderRadius: "15%",
                                    }}
                                    className="fa fa-times"
                                />
                            </div>
                        </div>
                        <form className="product-modal-body">
                            <div
                                className="submitProduct"
                                style={{ marginTop: "30px" }}
                            >
                                {codeInput}
                                {idInput}
                                {nameInput}
                                {descInput}
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-default"
                                        data-dismiss="modal"
                                        onClick={onClose}
                                    >
                                        Close
                                    </button>
                                    <button
                                        style={{
                                            margin: "0",
                                            marginLeft: "10px",
                                        }}
                                        type="button"
                                        className="btn btn-primary modal-btn-close"
                                        onClick={onModify}
                                    >
                                        Save changes
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
