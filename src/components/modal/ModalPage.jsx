import React, { useContext } from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PageContext } from "components/PageProvider";

export default function ModalPage({onClose}) {
    const { projectItem, setProjectInfo } = useContext(PageContext);
    function handleItemClick(poiId, poiNm, poiCode, poiVersion, poId) {
        setProjectInfo({ poiId, poiNm, poiCode, poiVersion, poId });
        onClose();
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
                                <button onClick={() => onClose()}>
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>
                            <div className="modalBody">
                                <div className="modalContent">
                                    {projectItem.map((item, index) => (
                                        <div className="listItems" key={index} onClick={() => handleItemClick(item.poiId, item.poiNm, item.poiCode, item.poiVersion, item.poId)}>
                                            <p className="listItem" style={{width: '50%'}}>{item.poiNm}</p>
                                            <p className="listItem" style={{width: '50%'}}>{item.poiVersion}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <form className="product-modal-body">
                                <div className="submitProduct">
                                    <div className="modal-footer flex-between">
                                        <button type="button" className="btn btn-default" data-dismiss="modal" onClick={() => onClose()}>
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
