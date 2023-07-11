import React, { useRef, useState } from "react";
import "../../../../common/tableHeader/ModalSearch.css";
import $ from "jquery";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-dt/js/dataTables.dataTables";
//import { v4 as uuidv4 } from "uuid";
import axios from "axios";

export default function GroupCodeModalPagePost({
    onClose,
    refresh,
    countCodeIdCode,
    urlName,
    headers,
}) {
    const dataTableRef = useRef(null); //dataTable 테이블 명시
    const [GroupCode, setGroupCode] = useState(countCodeIdCode);
    const [data, setData] = useState({
        codeId: "",
        codeIdNm: "",
        codeIdDc: "",
        clCode: "",
    });

    console.log(countCodeIdCode);

    const inputChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const onAdd = async (e) => {
        e.preventDefault();

        const newGroupCode = countCodeIdCode + 1;
        setGroupCode(newGroupCode);

        const newData = {
            ...data,
            codeId: newGroupCode,
        };

        console.log(GroupCode);

        try {
            const options = {
                headers: headers,
            };
            const response = await axios.post(
                `http://192.168.0.113:8080/api/system/code/${urlName}/add.do`,
                newData,
                options
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
                                <>
                                    분류코드 명:
                                    <input
                                        type="text"
                                        name="clCodeNm"
                                        value={data.clCode}
                                        onChange={inputChange}
                                    />
                                    그룹코드:
                                    <input
                                        type="text"
                                        name="codeId"
                                        value={data.codeId}
                                        onChange={inputChange}
                                    />
                                    그룹코드 명:
                                    <input
                                        type="text"
                                        name="codeIdNm"
                                        value={data.codeIdNm}
                                        onChange={inputChange}
                                    />
                                    그룹코드 설명:
                                    <input
                                        type="text"
                                        name="codeIdDc"
                                        value={data.codeIdDc}
                                        onChange={inputChange}
                                    />
                                </>
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
