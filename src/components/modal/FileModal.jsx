import React, { useContext, useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import "../../components/modal/ModalCss.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faFileLines, faXmark } from "@fortawesome/free-solid-svg-icons";
import { axiosDelete, axiosDownLoad, axiosFetch, axiosFileAddUpload, axiosFileUpload } from "api/axiosFetch";
import ReactDataTable from "components/DataTable/ReactDataTable";
import ModalSearchList from "components/ModalCondition";
import { PageContext } from "components/PageProvider";
import FileUpload from "./FileUpload";

Modal.setAppElement("#root"); // Set the root element for accessibility

/* 파일업로드 모달 */
export default function FileModal(props) {
    const { width, height, isOpen, title, onClose, fileIdData } = props;
    const { setModalPageName, setIsModalTable, filePageName, setFilePageName, atchFileId, setAtchFileId, innerPageName } = useContext(PageContext);
    const [fileData, setFileData] = useState([]);

    const [fileList, setFileList] = useState([]);
    const [filedown, setFileDown] = useState("");

    const bodyRef = useRef(null);

    useEffect(() => {
        if (innerPageName.name !== "원가버전조회" && innerPageName.name !== undefined) {
            if (fileIdData && fileIdData.length > 0) {
                fetchAllData();
            } else {
                setFileList([]);
            }
        } else {
        }
    }, [isOpen, fileIdData]);

    const fetchAllData = async () => {
        console.log(fileIdData, "??? 값이없을텐데");
        const url = `/file/totalListAll.do`;
        const resultData = await axiosFetch(url, { atchFileId: fileIdData });
        if (resultData) {
            console.log(resultData, "???리스트나와야하는디");
            const originTitle = resultData.map((item) => item.originalFileNm);
            const fileId = resultData.map((item) => item.fileId);
            setFileList(originTitle);
            setFileDown(fileId);
        } else if (!resultData) {
            return;
        }
    };

    useEffect(() => {
        if (isOpen) {
            setFilePageName("첨부파일팝업");
            setIsModalTable(true);
            setAtchFileId(""); //초기화
        }
        return () => {
            setIsModalTable(false);
            setModalPageName("");
        };
    }, [isOpen]);

    useEffect(() => {
        // me-modal-body의 높이를 동적 계산
        if (bodyRef.current) {
            const headerHeight = document.querySelector(".me-modal-header")?.clientHeight || 0;
            const footerHeight = document.querySelector(".me-modal-footer")?.clientHeight || 0;
            const calculatedHeight = height - headerHeight - footerHeight;
            bodyRef.current.style.height = `${calculatedHeight}px`;
        }
    }, [height]);

    const onFileSelect = (acceptedFiles) => {
        console.log("Accepted Files:", acceptedFiles);
        console.log("Type of Accepted Files:", typeof acceptedFiles);
        setFileData(acceptedFiles);
        console.log(typeof fileData, "타입좀보자");
    };

    const onClickSubmit = async () => {
        // 확인 버튼을 눌렀을 때에만 서버에 요청
        if (fileIdData && fileIdData !== undefined) {
            console.log(fileData, "배열로 들어와서 변경해줘야함");
            console.log(fileIdData, "Id값들어오는걸보자");

            const url = `/file/upload.do`;
            try {
                const result = await axiosFileAddUpload(url, fileData, fileIdData);
                if (result) {
                    // Handle success
                    console.log("File uploaded successfully:", result);
                    setAtchFileId(result[0].atchFileId);
                } else {
                    // Handle failure
                    console.error("File upload failed.");
                }
            } catch (error) {
                console.error("Error uploading file:", error);
            }
            setFileList([]);
            onClose();
        } else {
            console.log("Id가없으면 이쪽으로 들어옴");
            const url = `/file/upload.do`;
            try {
                const result = await axiosFileUpload(url, fileData);
                if (result) {
                    // Handle success
                    console.log("File uploaded successfully:", result);
                    setAtchFileId(result[0].atchFileId);
                } else {
                    // Handle failure
                    console.error("File upload failed.");
                }
            } catch (error) {
                console.error("Error uploading file:", error);
            }
            setFileList([]);
            onClose();
        }
    };

    const clickDownLoad = async (item, index, filedown) => {
        const url = `/file/download.do`;
        try {
            const result = await axiosDownLoad(url, { fileId: filedown[index] });
            if (result) {
                alert(`${item}파일이 다운로드 되었습니다`);
            }
        } catch (error) {
            console.error("Error");
        }
    };

    const clickDelete = async (item, index, filedown) => {
        const url = `/file/removeCompletely.do`;
        console.log(filedown);
        try {
            const result = await axiosDelete(url, { fileId: filedown[index] });
            if (result) {
                alert(`${item}파일이 삭제 되었습니다`);
                fetchAllData();
            }
        } catch (error) {
            console.error("Error");
        }
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
                                <FileUpload fileList={fileList} onFileSelect={onFileSelect} />
                            </div>
                            <div>
                                {fileList.map((item, index) => (
                                    <div style={{ display: "flex" }}>
                                        <button
                                            className="fileBtn"
                                            onClick={() => {
                                                clickDownLoad(item, index, filedown);
                                            }}
                                            key={index}>
                                            <FontAwesomeIcon icon={faFileLines} style={{ fontSize: "23px", marginRight: "20px" }} />
                                            {item}
                                        </button>
                                        <button
                                            className="xBtn"
                                            onClick={() => {
                                                clickDelete(item, index, filedown);
                                            }}
                                            key={index}>
                                            <FontAwesomeIcon icon={faXmark} style={{ fontSize: "23px" }} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="me-modal-footer mg-t-10 mg-b-20">
                            <div className="table-buttons" style={{ justifyContent: "center" }}>
                                <button className="table-btn table-btn-default" style={{ width: "100%" }} onClick={onClose}>
                                    취소
                                </button>
                                <button
                                    className="table-btn table-btn-primary"
                                    style={{ width: "100%" }}
                                    onClick={() => {
                                        onClickSubmit();
                                    }}>
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
