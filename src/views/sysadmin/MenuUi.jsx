import React, { useState } from "react";

let borderCss = "3px solid #CCCCCC";
let userBackgroundColor = "#ECF0F5";

export default function MenuUi(props) {
    const [phoneNumber, setPhoneNumber] = useState("");
    const colors = props.programColor;

    const formatPhoneNumber = (value) => {
        // 입력된 값에서 숫자만 추출
        const digits = value.replace(/[^0-9]/g, "");

        // 전화번호 형식에 맞게 "-" 추가
        let formattedNumber = "";
        if (digits.length > 2) {
            formattedNumber += digits.substring(0, 3) + "-";
            if (digits.length > 5) {
                formattedNumber += digits.substring(3, 7) + "-";
                formattedNumber += digits.substring(7, 11);
            } else {
                formattedNumber += digits.substring(3);
            }
        } else {
            formattedNumber = digits;
        }

        return formattedNumber;
    };

    const handlePhoneNumberChange = (event) => {
        const value = event.target.value;
        const formattedNumber = formatPhoneNumber(value);
        setPhoneNumber(formattedNumber);
    };

    return (
        <>
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    boxSizing: "border-box",
                    padding: "1.5rem",
                    flexDirection: "column",
                    backgroundColor: `${userBackgroundColor}`,
                }}
            >
                <div style={{ width: "100%", backgroundColor: "#F9F9F9" }}>
                    <div
                        style={{
                            display: "flex",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                width: "100%",
                            }}
                        >
                            {colors ? (
                                <span
                                    className=""
                                    style={{
                                        display: "flex",
                                        width: "160px",
                                        height: "40px",
                                        backgroundColor: "#F9F9F9",
                                        border: "1px solid #D8D8D8",
                                        marginRight: "3px",

                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    프로그램 코드
                                </span>
                            ) : (
                                <span
                                    style={{
                                        display: "flex",
                                        width: "160px",
                                        height: "40px",
                                        backgroundColor: "#F7F7F7",
                                        marginRight: "3px",
                                        marginLeft: "3px",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    사용자 명
                                </span>
                            )}
                            <input
                                style={{
                                    padding: "5px",
                                    border: `${borderCss}`,
                                    width: "80%",
                                    //borderBottom: "none",
                                }}
                                type="text"
                            ></input>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                            }}
                        ></div>
                    </div>
                    <div
                        style={{
                            display: "flex",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            <span
                                style={{
                                    display: "flex",
                                    width: "160px",
                                    height: "40px",
                                    border: "1px solid #D8D8D8",
                                    marginRight: "3px",

                                    backgroundColor: "#F7F7F7",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                다국어 설정
                            </span>
                            <span
                                style={{
                                    color: "gray",
                                    padding: "10px",
                                }}
                            >
                                한국어
                            </span>
                            <input
                                style={{
                                    padding: "5px",
                                    border: `${borderCss}`,
                                }}
                                type="password"
                            ></input>
                            <span
                                style={{
                                    color: "gray",
                                    padding: "10px",
                                }}
                            >
                                English
                            </span>
                            <input
                                style={{
                                    padding: "5px",
                                    border: `${borderCss}`,
                                }}
                                type="password"
                            ></input>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                            }}
                        ></div>
                    </div>
                    <div
                        style={{
                            display: "flex",
                        }}
                    ></div>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <span
                            style={{
                                display: "flex",
                                width: "160px",
                                height: "40px",
                                backgroundColor: "#F7F7F7",
                                border: "1px solid #D8D8D8",
                                marginRight: "3px",

                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            프로그램 명
                        </span>
                        <select
                            style={{
                                width: "188px",
                                padding: "5px",
                                border: `${borderCss}`,
                            }}
                            name="languages"
                        >
                            <option value="korean">
                                02_생산진행(prodProcess)
                            </option>
                            <option value="english">
                                03_재고현황(stockInfo)
                            </option>
                        </select>
                    </div>
                </div>
                <p
                    style={{
                        fontSize: "1.5em",
                        padding: "1em 0 0 1em",
                        background: "#ECF0F5",
                        width: "100%",
                    }}
                >
                    역할 설정
                </p>
            </div>
        </>
    );
}
