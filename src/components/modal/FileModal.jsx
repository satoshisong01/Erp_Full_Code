import React, { useContext, useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import "../../components/modal/ModalCss.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { axiosFetch, axiosFileUpload } from "api/axiosFetch";
import ReactDataTable from "components/DataTable/ReactDataTable";
import ModalSearchList from "components/ModalCondition";
import { PageContext } from "components/PageProvider";
import FileUpload from "./FileUpload";

Modal.setAppElement("#root"); // Set the root element for accessibility

/* 품목상세정보 목록 모달 */
export default function FileModal(props) {
    const { width, height, isOpen, title, onClose } = props;
    const { setModalPageName, setIsModalTable, setPdiNmList, pdiNmList, projectPdiNm, setProjectPdiNm } = useContext(PageContext);

    const [productInfoList, setProductInfoList] = useState([]);
    const bodyRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setModalPageName("품목정보팝업");
            setIsModalTable(true);
            setPdiNmList([]); //초기화
            setProjectPdiNm({}); //초기화
        }
        return () => {
            setIsModalTable(false);
            setModalPageName("");
        };
    }, [isOpen]);

    const onFileSelect = async (acceptedFiles) => {
        const url = `/file/upload.do`;
        try {
            const result = await axiosFileUpload(url, acceptedFiles[0]);
            if (result) {
                // Handle success
                console.log("File uploaded successfully:", result);
            } else {
                // Handle failure
                console.error("File upload failed.");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    useEffect(() => {
        // me-modal-body의 높이를 동적 계산
        if (bodyRef.current) {
            const headerHeight = document.querySelector(".me-modal-header")?.clientHeight || 0;
            const footerHeight = document.querySelector(".me-modal-footer")?.clientHeight || 0;
            const calculatedHeight = height - headerHeight - footerHeight;
            bodyRef.current.style.height = `${calculatedHeight}px`;
        }
    }, [height]);

    const onClick = () => {
        onClose();
    };

    return (
        <Modal
            appElement={document.getElementById("root")}
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel={title}
            style={{ content: { width, height } }}>
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
                                <FileUpload onFileSelect={onFileSelect} />
                            </div>
                        </div>
                        <div className="me-modal-footer mg-t-10 mg-b-20">
                            <div className="table-buttons" style={{ justifyContent: "center" }}>
                                <button className="table-btn table-btn-default" style={{ width: "100%" }} onClick={onClose}>
                                    취소
                                </button>
                                <button className="table-btn table-btn-primary" style={{ width: "100%" }} onClick={onClick}>
                                    확인
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
