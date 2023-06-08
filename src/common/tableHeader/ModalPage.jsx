import React, { useState } from "react";
import "./ModalSearch.css";
//import Header from "./Header";
import Search from "./Search";
import { DataGrid, GridColumn } from "rc-easyui";

export default function ModalPage({ onClose, changeColor }) {
    const [data] = useState(getData());

    function getData() {
        return [
            { projectcode: "FI-SW-01", projectname: "Koi" },
            { projectcode: "K9-DL-01", projectname: "Dalmation" },
            { projectcode: "RP-SN-01", projectname: "Rattlesnake" },
            { projectcode: "RP-SN-01", projectname: "Rattlesnake" },
            { projectcode: "RP-LI-02", projectname: "Iguana" },
            { projectcode: "FL-DSH-01", projectname: "Manx" },
            { projectcode: "FL-DSH-01", projectname: "Manx" },
            { projectcode: "FL-DLH-02", projectname: "Persian" },
            { projectcode: "FL-DLH-02", projectname: "Persian" },
            { projectcode: "AV-CB-01", projectname: "Amazon Parrot" },
        ];
    }

    return (
        <div className="modal-dialog demo-modal" style={{ margin: "0" }}>
            <div className="modal-content" style={{ border: "0" }}>
                <article className="product-modal">
                    <div className="product-modal-bg"></div>

                    <div className="product-modal-inner">
                        <div className="product-modal-header">
                            <div
                                className="modal-header"
                                style={{ border: "none" }}
                            >
                                <h4 className="modal-title">프로젝트 목록</h4>
                            </div>
                            <div
                                className="product-modal-close-btn"
                                onClick={onClose}
                            >
                                <i
                                    style={{
                                        fontSize: "2rem",
                                        //padding: "0.5rem",
                                        color: "#CCCCCC",
                                        borderRadius: "15%",
                                    }}
                                    className="fa fa-times"
                                />
                            </div>
                        </div>
                        <form className="product-modal-body">
                            <Search searchTitle="검색어 입력" />
                            <div
                                className="submitProduct"
                                style={{ marginTop: "30px" }}
                            >
                                <DataGrid data={data} style={{ width: "100%" }}>
                                    <GridColumn
                                        field="projectcode"
                                        title="프로젝트 코드"
                                        align="center"
                                    />
                                    <GridColumn
                                        field="projectname"
                                        title="프로젝트명"
                                        align="center"
                                    />
                                </DataGrid>

                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-default"
                                        data-dismiss="modal"
                                        onClick={onClose}
                                    >
                                        Close
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-primary modal-btn-close"
                                    >
                                        Save changes
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </article>
            </div>
        </div>
    );
}
