import React from "react";

export default function Header(props) {
    //let headerName = props.title;
    let headerName = props.titleName;
    let iconName = props.iconName;
    let btnNon = props.btnNon;
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.3rem",
                alignItems: "center",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    //marginBottom: "1rem",
                }}
            >
                <i
                    className={iconName}
                    style={{
                        fontSize: "3.5rem",
                        padding: "0.8rem",
                        backgroundColor: "#ECF0F5",
                        color: "black",
                        borderRadius: "20%",
                        marginRight: "0.5rem",
                    }}
                />
                <span
                    style={{
                        alignItems: "center",
                        fontSize: "3rem",
                        fontWeight: "600",
                    }}
                >
                    {headerName}
                </span>
            </div>
            {btnNon ? (
                <></>
            ) : (
                <button
                    className="btn sa-btn-primary"
                    style={{
                        display: "flex",
                        background: "#3276B1",
                        height: "40px",
                        color: "white",
                        margin: "5px",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    type="button"
                >
                    <i className="fa fa-search">
                        <span
                            style={{
                                marginLeft: "5px",
                            }}
                        >
                            조회
                        </span>
                    </i>
                </button>
            )}
        </div>
    );
}
