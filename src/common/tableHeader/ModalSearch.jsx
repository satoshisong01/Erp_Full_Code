import React from "react";
import "./ModalSearch.css";
import { useState } from "react";
import ModalPage from "./ModalPage";

export default function ModalSearch(props) {
    const [modalOpen, setModalOpen] = useState(false);
    let searchName = props.searchTitle;
    return (
        <div className="col-12 userTable" style={{ height: "100%" }}>
            <div
                className="searchTable"
                style={{
                    display: "flex",
                    alignItems: "center",
                    //borderTop: "solid #DDDDDD 1px",
                    //borderBottom: "solid #DDDDDD 1px",
                    marginLeft: "auto",
                    height: "40px",
                    backgroundColor: "white",
                }}
            >
                <span
                    style={{
                        display: "flex",
                        padding: "7px",
                        width: "100px",
                        height: "40px",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#E3E3E3",
                    }}
                >
                    {searchName}
                </span>
                <input
                    onClick={() => setModalOpen(true)}
                    style={{ height: "26px", marginLeft: "7px" }}
                    type="text"
                    placeholder="검색어를 입력하세요"
                />
                {modalOpen && (
                    <ModalPage
                        onClose={() => {
                            setModalOpen(false);
                            //refetch();
                        }}
                    />
                )}
            </div>
        </div>
    );
}
