import React, { useEffect, useRef, useState } from "react";
import "../../components/modal/ModalCss.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import MakeListField from "utils/MakeModalField";
/* 추가, 수정 모달 */
export default function AddModModal(props) {
    const { width, height, list, onClose, resultData, title, initialData, sendData } = props;
    const [data, setData] = useState({});
    const bodyRef = useRef(null);

    console.log(data, "data");

    useEffect(() => {
        // me-modal-body의 높이를 동적 계산
        if (bodyRef.current) {
            const headerHeight = document.querySelector(".me-modal-header")?.clientHeight || 0;
            const footerHeight = document.querySelector(".me-modal-footer")?.clientHeight || 0;
            const calculatedHeight = height - headerHeight - footerHeight;
            bodyRef.current.style.height = `${calculatedHeight}px`;
        }
    }, [height]);

    // 데이터 추가 버튼을 눌렀을 때 실행되는 함수
    const onClick = async (e) => {
        e.preventDefault();

        // 필수 필드가 비어있는지 확인
        const requiredColumns = list && list.filter((column) => column.require);
        const hasEmptyRequiredFields = requiredColumns.some((column) => !data[column.col]);
        //필수값 확인 후
        //resultData(data); //데이터 부모로 전송
        console.log(data, "입력받은값");
        sendData(data);
        onClose();
    };

    const onChange = (newValues) => {
        setData((prevData) => {
            return { ...prevData, ...newValues };
        });
    };

    return (
        <article className="me-modal">
            <div className="me-modal-container" style={{ width, height }}>
                <div className="me-modal-inner">
                    <div className="me-modal-header">
                        <h4 className="header-title">{title}</h4>
                        <div className="header-close" onClick={onClose}>
                            <FontAwesomeIcon icon={faXmark} className="button" size="lg" />
                        </div>
                    </div>

                    <form className="me-modal-body" ref={bodyRef}>
                        <div className="body-area">
                            {list &&
                                list.map((column, index) => (
                                    <div className="body-row" key={index}>
                                        <MakeListField list={column.items} onChange={onChange} initialData={initialData} />
                                    </div>
                                ))}
                        </div>
                    </form>

                    <div className="me-modal-footer mg-b-20">
                        <div className="table-buttons" style={{ justifyContent: "center" }}>
                            <button className="table-btn table-btn-default" data-dismiss="modal" style={{ width: "100%" }} onClick={() => onClose()}>
                                취소
                            </button>
                            {title.includes("추가") ? (
                                <button className="table-btn table-btn-primary" style={{ width: "100%" }} onClick={onClick}>
                                    추가
                                </button>
                            ) : (
                                <button className="table-btn table-btn-primary" style={{ width: "100%" }} onClick={onClick}>
                                    수정
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </article>
    );
}
