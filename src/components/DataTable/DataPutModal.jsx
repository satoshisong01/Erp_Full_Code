import React, { useEffect, useState } from "react";
import "../../css/ModalSearch.css";

export default function DataPutModal({
    onClose,
    initialData,
    columns,
    updateData,
    getNestedData,
}) {
    const initializeState = () => {
        const initialState = columns.reduce((acc, curr) => {
            acc[curr.col] = "";
            return acc;
        }, {});
        setData(initialState);
    };

    const [data, setData] = useState(initialData);

    useEffect(() => {
        initializeState(); // 모달이 열릴 때 상태를 초기화합니다.
    }, [initialData]);

    useEffect(() => {
        setData(initialData);
    }, [initialData]);

    const inputChange = (e) => {
        const { name, value } = e.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
        console.log(data, "변경후값");
    };

    const handleSaveChanges = () => {
        updateData(data); // 수정된 데이터와 함께 updateData 함수를 호출
        onClose(); // 변경사항 저장 후 모달을 닫습니다.
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
                                    if (column.updating) {
                                        return (
                                            <div key={index}>
                                                <label>{column.header}:</label>
                                                <input
                                                    type="text"
                                                    name={column.col}
                                                    value={data[column.col]}
                                                    //value={getNestedData(data, column.col) || ""}
                                                    onChange={inputChange}
                                                    disabled={
                                                        column.update === false
                                                    }
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
                                        onClick={handleSaveChanges}>
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
