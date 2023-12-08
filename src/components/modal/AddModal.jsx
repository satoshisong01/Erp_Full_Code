import React, { useContext, useEffect, useRef, useState } from "react";
import "../../components/modal/ModalSearch.css";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-dt/js/dataTables.dataTables";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { v4 as uuidv4 } from "uuid";
import DayPicker from "components/input/DayPicker";
import { PageContext } from "components/PageProvider";
import ModalPageCompany from "./ModalPageCompany";

/* 추가 모달 */
export default function AddModal(props) {
    const { width, height, columns, onClose, sendData, errorOn } = props;
    const [showAlert, setShowAlert] = useState(false);
    const [errorOnState, setErrorOnState] = useState(false);
    const { isOpenModalCompany, setIsOpenModalCompany } = useContext(PageContext);

    const [data, setData] = useState({});

    const handleDateClick = (date, colName, index) => {
        console.log(date, colName, index);
        setData((prevData) => ({
            ...prevData,
            [colName]: date,
        }));
    };

    const handleCompany = (date) => {
        setData((prevData) => ({
            ...prevData,
            //[colName]: date,
        }));
    };

    useEffect(() => {
        console.log(data);
    }, [data]);

    const inputChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    //useEffect(() => {
    //    setErrorOnState(errorOn); // Update errorOnState when errorOn changes
    //}, [errorOn]);

    // 데이터 추가 버튼을 눌렀을 때 실행되는 함수
    const onAdd = async (e) => {
        e.preventDefault();
        console.log("문제없으면 통과");
        sendData(data);
        // 필수 필드가 비어있는지 확인
        //const requiredColumns = columns.filter((column) => column.require);
        //const hasEmptyRequiredFields = requiredColumns.some((column) => !data[column.col]);
        ////필수값 확인 후
        //if (hasEmptyRequiredFields) {
        //    setShowAlert(true); // 알림 메시지 표시
        //} else {
        //    sendData(data); // 데이터 추가 함수 호출
        //}
        onClose();
    };

    const setValueCompany = () => {
        //setRowIndex()
        setIsOpenModalCompany(true);
        //setRowIndex(rowIndex);
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
                            {columns.map((column, index) => {
                                if (column.add) {
                                    return (
                                        <div className="submitProduct" key={index}>
                                            {/* 첫 번째 postBox */}
                                            <div className="postBox">
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
                                                    ) : column.type === "datepicker" ? (
                                                        <DayPicker
                                                            name={column.col}
                                                            value={data[column.col] || ""}
                                                            onClick={(data) => handleDateClick(data, column.col, index)}
                                                        />
                                                    ) : column.type === "buttonCompany" ? (
                                                        <div>
                                                            <input
                                                                className="buttonSelect"
                                                                id={column.col}
                                                                name={column.col}
                                                                onClick={() => setValueCompany()}
                                                                type="text"
                                                                placeholder={`거래처명을 선택해 주세요.`}
                                                                value={data[column.col] || ""}
                                                                //onChange={(data) => handleCompany(data)}
                                                                readOnly
                                                            />
                                                        </div>
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
                                                {/*{errorOnState && column.pk && <span className="error-message text-error">중복된 값입니다.</span>}
                                                {!errorOnState && column.pk && <span className="error-message text-error"> </span>}*/}
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </form>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-default"
                                data-dismiss="modal"
                                onClick={() => {
                                    //fetchAllData();
                                    onClose();
                                    //handleSendLoading(true);
                                }}>
                                취소
                            </button>
                            <button type="button" className="btn btn-primary modal-btn-close" id="modalSubmitBtn" onClick={onAdd}>
                                추가
                            </button>
                        </div>
                    </div>
                </article>
            </div>
            {isOpenModalCompany && <ModalPageCompany onClose={() => setIsOpenModalCompany(false)} />}
        </div>
    );
}
