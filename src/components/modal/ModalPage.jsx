import React, { useContext, useEffect, useRef, useState } from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PageContext } from "components/PageProvider";

export default function ModalPage() {
    const { projectItem, setProjectInfo, setIsOpenModal } = useContext(PageContext);

    function handleItemClick(poiId, poiNm, poiCode) {
        setProjectInfo({ poiId, poiNm, poiCode });
        setIsOpenModal(false);
    }

    return (
        <>
            <div className="modal-dialog demo-modal" style={{ margin: "0", zIndex: "9999" }}>
                <div className="modal-content">
                    <article className="product-modal">
                        <div className="product-modal-inner">
                            <div className="product-modal-header">
                                <div className="modal-header">
                                    <span className="modal-title">프로젝트 목록</span>
                                </div>
                                <button onClick={() => setIsOpenModal(false)}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>
                            <div className="modalBody">
                                <div className="modalContent">
                                    {projectItem.map((item, index) => (
                                        <div className="listItems" key={index} onClick={() => handleItemClick(item.poiId, item.poiNm, item.poiCode)}>
                                            <p className="listItem">{item.poiNm}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <form className="product-modal-body">
                                <div className="submitProduct">
                                    <div className="modal-footer flex-between">
                                        <button type="button" className="btn btn-default" data-dismiss="modal" onClick={() => setIsOpenModal(false)}>
                                            Close
                                        </button>
                                        <button type="button" className="btn btn-primary" style={{ margin: "0" }}>
                                            Save changes
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </article>
                </div>
            </div>
        </>
    );
}
