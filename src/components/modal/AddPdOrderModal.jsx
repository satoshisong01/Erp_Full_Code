import React, { useContext, useEffect, useRef, useState } from "react";
import "../../components/modal/ModalSearch.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { PageContext } from "components/PageProvider";
import { axiosPost } from "api/axiosFetch";

export default function AddPdOrderModal({ columns, onClose }) {
    const [data, setData] = useState({});
    const [showAlert, setShowAlert] = useState(false);
    // const [errorOnState, setErrorOnState] = useState(false);
    const {projectInfo,projectCompany,setIsOpenModalCompany,setProjectCompany} = useContext(PageContext);

    useEffect(() => {
        return () => { //컴포넌트 종료시
            setProjectCompany({});//초기화
        }
    }, [])
    useEffect(() => {
        if (projectCompany.companyId !== data.cltId) {
            setData((prevData) => ({
                ...prevData,
                cltId: projectCompany.companyId, //id
                cltNm: projectCompany.esntlId //이름
            }));
        }
    }, [projectCompany, data]);

    useEffect(() => {
        const initialData = {
            poiId: projectInfo.poiId,
            poiVersion: "",
            cltId: "",
            poId: "",
        }
        setData(initialData);
    }, [columns]);


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
        if (hasEmptyRequiredFields) {
            setShowAlert(true); // 알림 메시지 표시
        } else {
            postData(data); // 데이터 추가 함수 호출
        }
    };

    /* 데이터 추가 */
    const postData = async (addData) => {
        if (addData && typeof addData === "object" && !Array.isArray(addData)) {
            const dataToSend = [{
                ...addData,
                lockAt: "Y",
                useAt: "Y",
                deleteAt: "N",
                poiId: projectInfo.poiId,
                poiVersion: projectInfo.poiVersion,
                poId: projectInfo.poId,
            }];

            const resultData = await axiosPost("/api/baseInfrm/product/pdOrdr/addList.do", dataToSend);
            if (!resultData) {
                alert("add error: table");
            } else if (resultData) {
                alert("✅추가 완료");
            }
        }
        onClose(); //모달창 닫기
    };

    return (
        <div className="modal-dialog demo-modal">
            <div className="modal-content">
                <article className="product-modal">
                    <div className="product-modal-bg"></div>

                    <div className="product-modal-inner">
                        <div className="product-modal-header">
                            <div className="modal-header">
                                <h4 className="modal-title">구매종류 추가</h4>
                            </div>
                            <div className="product-modal-close-btn" onClick={onClose}>
                                <FontAwesomeIcon icon={faXmark} className="xBtn" />
                            </div>
                        </div>
                        <form className="product-modal-body">
                            <div className="submitProduct">
                                {columns.map((column, index) => {
                                    if (column.add) {
                                        return (
                                            <div className="postBox" key={index}>
                                                <div className="inputBox">
                                                    <label className="postLabel">
                                                        {column.require && <span className="redStar">*</span>}
                                                        {column.header}:
                                                    </label>
                                                    {column.type === "select" ? (
                                                        <select name={column.col} className="postInput" onChange={inputChange}>
                                                            {column.option.map((op) => (
                                                                <option key={op.value} value={op.value}>
                                                                    {op.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    ) : column.lockAt ? (
                                                        <select name={column.col} className="postInput" onChange={inputChange}>
                                                            <option value="Y">Y</option>
                                                            <option value="N">N</option>
                                                        </select>
                                                    ) : column.itemType && Array.isArray(column.itemType) ? (
                                                        <select className="postInput" name={column.col} value={data[column.col] || ""} onChange={inputChange}>
                                                            <option value={""}>{column.itemType[0]}</option>
                                                            {column.itemType.map(
                                                                (item, index) =>
                                                                    index > 0 && (
                                                                        <option key={index} value={column.itemTypeSymbol[index]}>
                                                                            {item}
                                                                        </option>
                                                                    )
                                                            )}
                                                        </select>
                                                    ) : column.type === "buttonCompany" ? (
                                                        <input
                                                            className="buttonSelect"
                                                            id={column.id}
                                                            name={column.col}
                                                            onClick={() => setIsOpenModalCompany(true)}
                                                            type="text"
                                                            placeholder={`거래처명을 선택해 주세요.`}
                                                            value={data[column.col] || ""}
                                                            readOnly
                                                        />
                                                    ) : (
                                                        <input
                                                            placeholder={column.placeholder || column.header}
                                                            className="postInput"
                                                            type="text"
                                                            name={column.col}
                                                            value={data[column.col] || ""}
                                                            onChange={inputChange}
                                                        />
                                                    )}
                                                </div>
                                                {column.require && showAlert && !data[column.col] && (
                                                    <span className="error-message text-error">필수값이 비어있습니다.</span>
                                                )}
                                            </div>
                                        );
                                    }
                                    return null;
                                })}
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-default" data-dismiss="modal" onClick={() => { onClose();}}>
                                    취소
                                </button>
                                <button className="btn btn-primary modal-btn-close" id="modalSubmitBtn" onClick={onAdd}>
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
