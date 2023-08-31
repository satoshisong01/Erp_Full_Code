import React, { useEffect, useRef, useState } from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function ModalPage({ onClose, clickData, refresh, urlName }) {
    const columns = [
        { header: "프로젝트 이름", col: "poiNm", cellWidth: "100%" },
    ]

    // const handleSelect = (name) => {
    //     onSelect(name)
    // }

    return (
        <div
            className="modal-dialog demo-modal"
            style={{ margin: "0", zIndex: "9999" }}
        >
            <div className="modal-content">
                <article className="product-modal">
                    <div className="product-modal-inner">
                        <div className="product-modal-header">
                            <div className="modal-header">
                                <span className="modal-title">프로젝트 목록</span>
                            </div>
                            <button onClick={onClose}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                        <form className="product-modal-body">
                            <div className="submitProduct"
                                style={{ marginTop: "30px" }}
                            >
                                <div className="modal-footer flex-between">
                                    <button
                                        type="button"
                                        className="btn btn-default"
                                        data-dismiss="modal"
                                        onClick={onClose}
                                    >
                                        Close
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary"
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
