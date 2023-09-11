import React, { useContext } from "react";
import "./ModalSearch.css";
import ModalPage from "./ModalPage";
import { PageContext } from "components/PageProvider";

export default function ModalSearch({}) {
    const { projectId, setIsOpenModal, isOpenModal } = useContext(PageContext);

    return (
        <div>
            <input
                onClick={() => setIsOpenModal(true)}
                type="text"
                placeholder={
                    projectId.poiNm
                        ? projectId.poiNm
                        : `프로젝트를 선택해 주세요.`
                }
                value={projectId.poiNm}
                readOnly
            />
            {isOpenModal && (
                <ModalPage
                    onClose={() => {
                        setIsOpenModal(false);
                    }}
                />
            )}
        </div>
    );
}
