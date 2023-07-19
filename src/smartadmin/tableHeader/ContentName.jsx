import React from "react";

export default function ContentName(props) {
    let contentName = props.tableTitle;
    return (
        <>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "20px 0 20px 15px",
                    backgroundColor: "#ECF0F5",
                    //height: "10vh",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        fontSize: "18px",
                    }}
                >
                    <i className="fa fa-list" />
                    <div style={{ marginLeft: "5px" }}>{contentName}</div>
                </div>
                {/*<div>
                    <button style={{ marginRight: "5px" }}>
                        <i className="fa fa-plus-circle" /> 추가
                    </button>
                    <button style={{ marginRight: "5px" }}>
                        <i className="fa fa-minus-circle" /> 삭제
                    </button>
                </div>*/}
            </div>
        </>
    );
}
