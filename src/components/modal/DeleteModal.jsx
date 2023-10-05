import React, { useEffect, useState } from "react";
import Modal from "react-modal";

export default function DeleteModal({ viewData, onConfirm }) {
    const [modalData, setModalData] = useState([]);
    const [isOpenModal, setIsOpenModal] = useState(false)


    const handleConfirm = () => {
        onConfirm('확인');
        setIsOpenModal(false);
    };

    const handleCancel = () => {
        onConfirm('취소');
        setIsOpenModal(false);
    };

    useEffect(() => {
        if (viewData && viewData.length > 0) {
            setIsOpenModal(true); // 모달 열기
            setModalData(viewData);
        }
      }, [viewData]);

    return (
        <Modal isOpen={isOpenModal} onRequestClose={handleCancel} style={{overflow: 'visible'}}>
            <div className="flex-column">
                <div className="">
                    <p style={{fontSize: '17px', fontWeight: 500}}>삭제 하시겠습니까? 총 {modalData ? modalData.length : 0}개의 데이터</p>
                    <p className="mg-t-10 scrollable">
                        [
                        {modalData.map((item, index, array) => (
                            Object.keys(item).map((key, innerIndex) => (
                                innerIndex === 0 ? (
                                    (array.length > 1 && index < array.length - 1) ? `${key}: ${item[key]}, ` : `${key}: ${item[key]}`
                                ) : null
                            ))
                        ))}
                        ]
                    </p>
                </div>
                <div className="flex-between">
                    <button
                        type="button"
                        onClick={handleConfirm}
                        className="btn btn-primary btn-block">
                        확인
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="btn btn-secondary btn-block">
                        취소
                    </button>
                </div>
            </div>
        </Modal>
    );
};
