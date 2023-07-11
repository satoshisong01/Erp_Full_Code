import React, { useEffect, useRef, useState } from "react";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-dt/js/dataTables.dataTables";
import $ from "jquery";
import "../../../../common/tableHeader/ModalSearch.css";
import axios from "axios";
//import Header from "./Header";

export default function GroupCodeModalPage({
    onClose,
    clickData,
    refresh,
    urlName,
    headers,
}) {
    //const [data] = useState(getData());
    const dataTableRef = useRef(null); //dataTable 테이블 명시
    const [data, setData] = useState({
        codeId: "",
        codeIdNm: "",
        codeIdDc: "",
        clCode: clickData.clCode,
        clCodeNm: "",
        cmmnClCode: {
            clCode: clickData.cmmnClCode.clCode,
            clCodeNm: clickData.cmmnClCode.clCodeNm,
        },
    });

    //const [abc, setAbc] = useState({
    //    codeId: "",
    //    codeIdNm: "",
    //    codeIdDc: "",
    //    cmmnClCode: {
    //        clCode: "",
    //    },
    //    createIdBy: "",
    //    createDate: "",
    //    lastModifiedIdBy: "",
    //    lastModifyDate: "",
    //});

    console.log(data, "기본으로 받은값");

    useEffect(() => {
        if (clickData) {
            setData(clickData);
        }
    }, [clickData]);

    const inputChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value, "입력받은 이름과 데이터");
        setData((prevData) => ({ ...prevData, [name]: value }));
        console.log(data, "변경후값 저장된 값");
    };

    //const inputChange2 = (e) => {
    //    const { name, value } = e.target;
    //    setData((prevData) => ({
    //        ...prevData,
    //        cmmnClCode: { ...prevData.cmmnClCode, [name]: value },
    //    }));
    //    console.log(data, "변경후값22222");
    //};

    const onModify = async (e) => {
        e.preventDefault();

        try {
            const options = {
                headers: headers,
            };

            const modifiedData = { ...data }; // 수정된 데이터를 복제
            console.log(modifiedData, "바뀐걸 요청하는게 맞아?");
            console.log(data, "마지막확인");

            const response = await axios.put(
                //`http://192.168.0.113:8080/api/system/code/${urlName}/edit.do`,

                `http://localhost:8080/api/system/code/${urlName}/edit.do`,
                modifiedData, // 수정된 복제 데이터를 전송
                options
            );
            console.log(response, "보낸값");
            refresh();
        } catch (error) {
            console.log(error, "수정 에러입니다");
        } finally {
            alert("수정 되었습니다");
            $(dataTableRef.current).DataTable({
                paging: true,
                searching: true,
                ordering: true,
            });
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
                                    분류코드:
                                    <input
                                        type="text"
                                        name="clCode"
                                        value={clickData.cmmnClCode.clCode}
                                        onChange={inputChange}
                                    />
                                    그룹코드:
                                    <input
                                        type="text"
                                        name="codeId"
                                        value={data.codeId}
                                        onChange={inputChange}
                                    />
                                    그룹코드명:
                                    <input
                                        type="text"
                                        name="codeIdNm"
                                        value={data.codeIdNm}
                                        onChange={inputChange}
                                    />
                                    그룹코드설명:
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
