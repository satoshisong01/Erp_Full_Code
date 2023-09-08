import React from "react";
import "./ModalSearch.css";
import { useState } from "react";
import ModalPage from "./ModalPage";

export default function ModalSearch({
    listData,
    projectCode,
    handleChangeName,
    mainProjectName,
}) {
    const [modalOpen, setModalOpen] = useState(false);
    const [name, setName] = useState("");

    const columns = [
        { header: "프로젝트 이름", col: "poiNm", cellWidth: "100%" },
    ];

    const handleSelect = (value) => {
        setName(value);
    };

    return (
        <div>
            <input
                onClick={() => setModalOpen(true)}
                type="text"
                placeholder={
                    mainProjectName
                        ? mainProjectName
                        : `프로젝트를 선택해 주세요.`
                }
                value={mainProjectName}
                readOnly
            />
            {modalOpen && (
                <ModalPage
                    onClose={() => {
                        setModalOpen(false);
                    }}
                    listData={listData}
                    handleChangeName={handleChangeName}
                    projectCode={projectCode}
                    onSelect={handleSelect}
                />
            )}
        </div>
    );
}
