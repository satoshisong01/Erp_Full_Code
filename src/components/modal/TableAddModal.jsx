import React, { useContext, useState } from "react";
import "../../components/modal/ModalSearch.css";
import { PageContext } from "components/PageProvider";

export default function TableAddModal({ columns }) {
    const { setNewRowData, setIsOpenModal } = useContext(PageContext);

    const [data, setData] = useState({});
    const [showAlert, setShowAlert] = useState(false); // 필수값 알림
    const [errorOnState, setErrorOnState] = useState(false);

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
        const hasEmptyRequiredFields = requiredColumns.some(
            (column) => !data[column.col]
        );

        if (hasEmptyRequiredFields) {
            setShowAlert(true); // 알림 메시지 표시
        } else {
            setNewRowData(data); // 데이터 추가 함수 호출
        }
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
                                onClick={() => setIsOpenModal(false)}></div>
                        </div>
                        <form className="product-modal-body">
                            <div className="submitProduct">
                                {columns.map((column, index) => {
                                    if (column.add) {
                                        return (
                                            <div
                                                className="postBox"
                                                key={index}>
                                                <div className="inputBox">
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
                                                            onChange={
                                                                inputChange
                                                            }>
                                                            {/* {saveList.map(
                                                                (
                                                                    item,
                                                                    index
                                                                ) => (
                                                                    <option
                                                                        key={
                                                                            index
                                                                        }
                                                                        value={
                                                                            item
                                                                        }>
                                                                        {item}
                                                                    </option>
                                                                )
                                                            )} */}
                                                        </select>
                                                    ) : column.lockAt ? (
                                                        <select
                                                            name={column.col}
                                                            className="postInput"
                                                            onChange={
                                                                inputChange
                                                            }>
                                                            <option value="Y">
                                                                Y
                                                            </option>
                                                            <option value="N">
                                                                N
                                                            </option>
                                                        </select>
                                                    ) : column.itemType &&
                                                      Array.isArray(
                                                          column.itemType
                                                      ) ? (
                                                        <select
                                                            className="postInput"
                                                            name={column.col}
                                                            value={
                                                                data[
                                                                    column.col
                                                                ] || ""
                                                            }
                                                            onChange={
                                                                inputChange
                                                            }>
                                                            <option value={""}>
                                                                {
                                                                    column
                                                                        .itemType[0]
                                                                }
                                                            </option>
                                                            {column.itemType.map(
                                                                (item, index) =>
                                                                    index >
                                                                        0 && (
                                                                        <option
                                                                            key={
                                                                                index
                                                                            }
                                                                            value={
                                                                                item
                                                                            }>
                                                                            {
                                                                                item
                                                                            }
                                                                        </option>
                                                                    )
                                                            )}
                                                        </select>
                                                    ) : (
                                                        <input
                                                            placeholder={
                                                                column.placeholder ||
                                                                column.header
                                                            }
                                                            className="postInput"
                                                            type="text"
                                                            name={column.col}
                                                            value={
                                                                data[
                                                                    column.col
                                                                ] || ""
                                                            }
                                                            onChange={
                                                                inputChange
                                                            }
                                                        />
                                                    )}
                                                </div>
                                                {column.require &&
                                                    showAlert &&
                                                    !data[column.col] && (
                                                        <span className="error-message text-error">
                                                            필수값이
                                                            비어있습니다.
                                                        </span>
                                                    )}
                                                {errorOnState && column.pk && (
                                                    <span className="error-message text-error">
                                                        중복된 값입니다.
                                                    </span>
                                                )}
                                                {!errorOnState && column.pk && (
                                                    <span className="error-message text-error">
                                                        {" "}
                                                    </span>
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
                                    onClick={() => {
                                        setIsOpenModal(false);
                                    }}>
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
