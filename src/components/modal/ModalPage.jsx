import React, { useContext, useEffect, useRef, useState } from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PageContext } from "components/PageProvider";
import SearchList from "components/SearchList";

export default function ModalPage() {
    const { projectItem, projectInfo, setProjectInfo, setIsOpenModal } = useContext(PageContext);

    const [returnKeyWord, setReturnKeyWord] = useState("");

    const conditionList = [
        {
            title: "프로젝트명",
            colName: "poiNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "5",
        },
    ];

    const handleReturn = (value) => {
        setReturnKeyWord(value);
        console.log(value, "제대로 들어오냐");
    };

    function handleItemClick(poiId, poiNm, poiCode) {
        setProjectInfo({ poiId, poiNm, poiCode });
        setIsOpenModal(false);
    }

    useEffect(() => {
        console.log(projectId);
        console.log(projectItem, "프로젝트네임 불러온것");
    }, []);

    console.log(returnKeyWord, "검색이되려나@@@@");

    return (
        <>
            <div className="modal-dialog demo-modal" style={{ margin: "0", zIndex: "9999" }}>
                <div className="modal-content">
                    <article className="product-modal">
                        <div className="product-modal-inner">
                            {/*<SearchList conditionList={conditionList} onSearch={handleReturn} />*/}

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
