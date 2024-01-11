import React, { useContext, useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import "../../components/modal/ModalCss.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { PageContext } from "components/PageProvider";
import SearchList from "components/SearchList";
import MakeItemField from "utils/MakeItemField copy";

Modal.setAppElement("#root"); // Set the root element for accessibility

/* 검색 모달 */
export default function SearchModal(props) {
    const { width, height, isOpen, title, onClose, returnData } = props;
    const { setModalPageName, setIsModalTable } = useContext(PageContext);
    const { condition, setCondition } = useState({});
    const [searchData, setSearchData] = useState({});
    const bodyRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setModalPageName("검색팝업")
            setIsModalTable(true);
        }
        return () => {
            setIsModalTable(false)
            setModalPageName("")
        };
    }, [isOpen]);

    const conditionList = [
        { title: "회사타입", col: "cltType", type: "radio", option: [
            {label: "협력사", value: "P"},
            {label: "고객사", value: "C"},
        ] },
        { title: "거래처명", col: "cltNm", type: "input" },
        { title: "픔목그룹명", col: "pgNm", type: "input" }
    ]

    useEffect(() => {
        // me-modal-body의 높이를 동적 계산
        if (bodyRef.current) {
            const headerHeight = document.querySelector(".me-modal-header")?.clientHeight || 0;
            // const footerHeight = document.querySelector(".me-modal-footer")?.clientHeight || 0;
            // const calculatedHeight = height - headerHeight - footerHeight;
            const calculatedHeight = height - headerHeight;
            bodyRef.current.style.height = `${calculatedHeight}px`;
        }
    }, [height]);

    const onChange = (value) => {
        setSearchData((prevData) => {
            return { ...prevData, ...value };
        });
    };

    const searchClick = () => {
        Object.keys(searchData).forEach((key) => {
            if (searchData[key] === "") {
                delete searchData[key]; //빈값 제외
            }
        });
        returnData && returnData(searchData)
    };

    // const onClick = (e) => {
    //     e.preventDefault();
    //     Object.keys(condition).length > 0 && returnData(condition)
    //     onClose();
    // }

    // const onSearch = (value) => {
    //     setCondition({...value});
    // }

    return (
        <Modal
            appElement={document.getElementById("root")}
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel={title}
        >
            <div className="me-modal">
                <div className="me-modal-container" style={{ width, height }}>
                    <div className="me-modal-inner">
                        <div className="me-modal-header">
                            <h4 className="header-title">{title}</h4>
                            <div className="header-close" onClick={onClose}>
                                <FontAwesomeIcon icon={faTimes} className="button" size="lg" />
                            </div>
                        </div>

                        <div className="me-modal-body" ref={bodyRef}>
                            <div className="body-area" style={{ gap: 0 }}>
                                <div className="flex-container" style={{justifyContent: "center"}}>
                                    {conditionList.map((param, idx) => (
                                        <div key={idx} className="flex-group mg-b-10">
                                            <div className="flex-label">
                                                <label>{param.title}</label>
                                            </div>
                                            <div className="flex-input">
                                                <MakeItemField item={param} resultData={onChange} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div style={{ textAlign: "right" }}>
                                    <button className="table-btn search-btn" onClick={searchClick}>
                                        검색
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* <div className="me-modal-footer mg-t-10 mg-b-20">
                            <div className="table-buttons" style={{ justifyContent: "center" }}>
                                <button className="table-btn table-btn-default" style={{ width: "100%" }} onClick={onClose}>
                                    취소
                                </button>
                                <button className="table-btn table-btn-primary" style={{ width: "100%" }} onClick={onClick}>
                                    확인
                                </button>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </Modal>
    );
}
