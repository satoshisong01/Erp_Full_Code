import React, { useRef, useState } from "react";
import "./ModalSearch.css";
import $ from "jquery";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-dt/js/dataTables.dataTables";
import axios from "axios";

export default function ModalPagePost({
    onClose,
    refresh,
    countClCode,
    urlName,
}) {
    const dataTableRef = useRef(null); //dataTable 테이블 명시
    const [clCode, setClCode] = useState(countClCode);
    const [data, setData] = useState(getInitialData());

    console.log(countClCode);

    function getInitialData() {
        if (urlName === "clCode") {
            return {
                clCode: "",
                clCodeNm: "",
                clCodeDc: "",
            };
        } else if (urlName === "groupCode") {
            return {
                clCodeNm: "",
                groupCode: "",
                groupCodeNm: "",
                groupCodeDc: "",
            };
        } else if (urlName === "detailCode") {
            return {
                groupCode: "",
                detailCode: "",
                detailCodeNm: "",
                detailCodeDc: "",
            };
        }
    }

    const inputChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const onAdd = async (e) => {
        e.preventDefault();

        const newClCode = countClCode + 1;
        setClCode(newClCode);

        const newData = {
            ...data,
            clCode: newClCode,
        };

        console.log(clCode);

        try {
            const response = await axios.post(
                `http://192.168.0.113:8080/api/system/code/${urlName}/add.do`,
                newData
            );
            console.log(response, "추가한 값");
            refresh();
            onClose();
        } catch (error) {
            console.log(error, "추가 에러입니다");
        } finally {
            $(dataTableRef.current).DataTable({
                paging: true,
                searching: true,
                ordering: true,
            });
            alert("추가 되었습니다");
        }
    };

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
                                {urlName === "clCode" && (
                                    <>
                                        분류코드 명:
                                        <input
                                            type="text"
                                            name="clCodeNm"
                                            value={data.clCodeNm}
                                            onChange={inputChange}
                                        />
                                        분류코드 설명:
                                        <input
                                            type="text"
                                            name="clCodeDc"
                                            value={data.clCodeDc}
                                            onChange={inputChange}
                                        />
                                    </>
                                )}
                                {urlName === "groupCode" && (
                                    <>
                                        분류코드:
                                        <input
                                            type="text"
                                            name="groupCode"
                                            value={data.groupCode}
                                            onChange={inputChange}
                                        />
                                        그룹코드:
                                        <input
                                            type="text"
                                            name="groupCode"
                                            value={data.groupCode}
                                            onChange={inputChange}
                                        />
                                        그룹코드 명:
                                        <input
                                            type="text"
                                            name="groupCodeNm"
                                            value={data.groupCodeNm}
                                            onChange={inputChange}
                                        />
                                        그룹코드 설명:
                                        <input
                                            type="text"
                                            name="groupCodeDc"
                                            value={data.groupCodeDc}
                                            onChange={inputChange}
                                        />
                                    </>
                                )}
                                {urlName === "detailCode" && (
                                    <>
                                        그룹코드:
                                        <input
                                            type="text"
                                            name="groupCode"
                                            value={data.groupCode}
                                            onChange={inputChange}
                                        />
                                        상세코드:
                                        <input
                                            type="text"
                                            name="detailCode"
                                            value={data.detailCode}
                                            onChange={inputChange}
                                        />
                                        상세코드 명:
                                        <input
                                            type="text"
                                            name="detailCodeNm"
                                            value={data.detailCodeNm}
                                            onChange={inputChange}
                                        />
                                        상세코드 설명:
                                        <input
                                            type="text"
                                            name="detailCodeDc"
                                            value={data.detailCodeDc}
                                            onChange={inputChange}
                                        />
                                    </>
                                )}
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
                                        onClick={onAdd}
                                    >
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
