import React from "react";

export default function HeaderDetail(props) {
    //let headerName = props.title;
    let headerName = props.titleName;
    let iconName = props.iconName;
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
                        fontSize: "1.8rem",
                        padding: "0.8rem",
                        backgroundColor: "white",
                        color: "black",
                        borderRadius: "20%",
                        marginRight: "0.5rem",
                    }}
                />
                <span
                    style={{
                        alignItems: "center",
                        fontSize: "1.8rem",
                        fontWeight: "600",
                        backgroundColor: "white",
                    }}
                >
                    {headerName}
                </span>
            </div>
        </div>
    );
}
