import React, { useState } from "react";
import "./ModalSearch.css";
import Header from "./Header";
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
        <article className="product-modal" style={{}}>
            <div className="product-modal-bg"></div>

            <div className="product-modal-inner">
                <div className="product-modal-header">
                    <span className="product-modal-title">
                        {/*{data
                            ? "Product 수정하기"
                            : "새로운 Product 추가하기"}*/}
                    </span>
                    {/*<img
                        className="product-modal-close-btn"
                        src={Icons.png.close}
                        alt="modal close btn"
                    />*/}
                    <div className="product-modal-close-btn" onClick={onClose}>
                        <i
                            style={{
                                fontSize: "3rem",
                                padding: "0.5rem",
                                backgroundColor: "gray",
                                borderRadius: "15%",
                            }}
                            className="fa fa-times"
                        />
                    </div>
                </div>
                <form className="product-modal-body">
                    <Header
                        iconName="fa fa-cog"
                        titleName="프로젝트 목록"
                        btnNon="none"
                    />
                    <Search searchTitle="검색어 입력" />
                    <div className="submitProduct">
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
                        <button className="submitBtn" type="submit">
                            <span className="btnText">등 록</span>
                        </button>
                    </div>
                </form>
            </div>
        </article>
    );
}
