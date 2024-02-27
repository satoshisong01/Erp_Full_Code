import React, { useContext, useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import "../../components/modal/ModalCss.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { axiosFetch } from "api/axiosFetch";
import ReactDataTable from "components/DataTable/ReactDataTable";
import ModalSearchList from "components/ModalCondition";
import { PageContext } from "components/PageProvider";

Modal.setAppElement("#root"); // Set the root element for accessibility

/* 회사목록 목록 모달 */
export default function CompanyModal(props) {
    const { width, height, isOpen, title, onClose, colName } = props;
    const { setCompanyInfo, setProjectPdiNm, setModalPageName, setIsModalTable } = useContext(PageContext);

    const [companyList, setCompanyList] = useState([]);
    const [selectInfo, setSelectInfo] = useState({});
    const bodyRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            getCompanyList();
            setModalPageName("거래처팝업");
            setIsModalTable(true);
            setCompanyInfo({}); //초기화
        }
        return () => {
            setIsModalTable(false);
            setModalPageName("");
        };
    }, [isOpen]);

    const getCompanyList = async (requestData) => {
        const resultData = await axiosFetch("/api/baseInfrm/client/client/totalListAll.do", requestData || {});
        const changeData = resultData.map((item) => {
            const pgNms = Object.keys(item)
                .filter((key) => key.startsWith("pgNm") && item[key] !== null && item[key] !== "")
                .map((key) => item[key]);

            return {
                cltId: item.cltId,
                cltNm: item.cltNm,
                [colName]: item.cltNm,
                pgNms: pgNms.join(", "), // 배열을 문자열로 변환
                cltBusstype: item.cltBusstype,
            };
        });
        setCompanyList(changeData);
    };

    const columns = [
        { header: "거래처아이디", col: "cltId", cellWidth: "0", notView: true },
        { header: "거래처명", col: colName || "cltNm", cellWidth: "150" },
        { header: "품목그룹명", col: "pgNms", cellWidth: "170" },
        { header: "업체유형", col: "cltBusstype", cellWidth: "180" },
    ];

    const conditionList = [
        {
            title: "회사타입",
            col: "cltType",
            type: "radio",
            option: [
                { label: "협력사", value: "P" },
                { label: "고객사", value: "C" },
            ],
        },
        { title: "거래처명", col: colName || "cltNm", type: "input" },
        { title: "픔목그룹명", col: "pgNm", type: "input" },
    ];

    useEffect(() => {
        // me-modal-body의 높이를 동적 계산
        if (bodyRef.current) {
            const headerHeight = document.querySelector(".me-modal-header")?.clientHeight || 0;
            const footerHeight = document.querySelector(".me-modal-footer")?.clientHeight || 0;
            const calculatedHeight = height - headerHeight - footerHeight;
            bodyRef.current.style.height = `${calculatedHeight + 10}px`;
        }
    }, [height]);

    const onSearch = (value) => {
        getCompanyList(value);
    };

    const onClick = (e) => {
        e.preventDefault();
        console.log(selectInfo, "선택된값?");
        setCompanyInfo({ ...selectInfo });
        onClose();
    };

    const returnSelect = (value) => {
        setSelectInfo((prev) => (prev.cltId !== value.cltId ? value : prev));
    };

    return (
        <Modal
            appElement={document.getElementById("root")}
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel={title}
            // style={{ content: { width, height, },}}
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
                                <ModalSearchList conditionList={conditionList} onSearch={onSearch} refresh={() => getCompanyList()} />
                                <ReactDataTable
                                    columns={columns}
                                    customDatas={companyList}
                                    returnSelect={returnSelect}
                                    viewPageName={{ name: "거래처팝업", id: "거래처팝업" }}
                                />
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
