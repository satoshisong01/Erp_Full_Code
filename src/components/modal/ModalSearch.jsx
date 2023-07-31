import React from "react";
import "./ModalSearch.css";
import { useState } from "react";
import ModalPage from "./ModalPage";

export default function ModalSearch(props) {
    const [modalOpen, setModalOpen] = useState(false);
    return (
        <div className="col-12 userTable" style={{ height: "100%" }}>
            <div
                className="searchTable"
                style={{
                    display: "flex",
                    alignItems: "center",
                    //borderTop: "solid #DDDDDD 1px",
                    //borderBottom: "solid #DDDDDD 1px",
                    marginLeft: "20px",
                    height: "40px",
                    backgroundColor: "white",
                }}>
                <input
                    onClick={() => setModalOpen(true)}
                    //style={{ height: "26px", marginLeft: "7px" }}
                    type="text"
                    placeholder="프로젝트를 선택해 주세요"
                />
                {modalOpen && (
                    <ModalPage
                        onClose={() => {
                            setModalOpen(false);
                            //refetch();
                        }}
                        datas={123}
                    />
                )}
            </div>
        </div>
    );
}
