import React, { useState } from "react";

let borderCss = "3px solid #CCCCCC";
let userBackgroundColor = "#ECF0F5";

export default function UserManagementInfo(props) {
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
                            {/*<span
                            style={{
                                display: "flex",
                                width: "160px",
                                height: "40px",
                                backgroundColor: "#F7F7F7",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            사용자 명
                        </span>*/}
                            <input
                                style={{
                                    padding: "5px",
                                    border: `${borderCss}`,
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
                        >
                            <span
                                style={{
                                    display: "flex",
                                    width: "160px",
                                    height: "40px",
                                    border: "1px solid #D8D8D8",
                                    marginRight: "3px",
                                    marginLeft: "3px",
                                    backgroundColor: "#F7F7F7",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                아이디
                            </span>
                            <input
                                style={{
                                    padding: "5px",
                                    border: `${borderCss}`,
                                }}
                                type="text"
                            ></input>
                        </div>
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
                                비밀번호
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
                        >
                            <span
                                style={{
                                    display: "flex",
                                    width: "160px",
                                    height: "40px",
                                    border: "1px solid #D8D8D8",
                                    marginRight: "3px",
                                    marginLeft: "3px",
                                    backgroundColor: "#F7F7F7",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                비밀번호 확인
                            </span>
                            <input
                                style={{
                                    padding: "5px",
                                    border: `${borderCss}`,
                                }}
                                type="password"
                            ></input>
                        </div>
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
                                이메일
                            </span>
                            <input
                                style={{
                                    padding: "5px",
                                    border: `${borderCss}`,
                                }}
                                type="email"
                            ></input>
                        </div>
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
                                    marginLeft: "3px",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                휴대폰 번호
                            </span>
                            <input
                                style={{
                                    padding: "5px",
                                    border: `${borderCss}`,
                                }}
                                type="tel"
                                value={phoneNumber}
                                onChange={handlePhoneNumberChange}
                                placeholder="휴대전화 번호를 입력하세요"
                            ></input>
                        </div>
                    </div>
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
                            언어
                        </span>
                        <select
                            style={{
                                width: "188px",
                                padding: "5px",
                                border: `${borderCss}`,
                            }}
                            name="languages"
                        >
                            <option value="korean">한국어</option>
                            <option value="english">영어</option>
                        </select>
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
                                    backgroundColor: "#F7F7F7",
                                    border: "1px solid #D8D8D8",
                                    marginRight: "3px",

                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                사용여부
                            </span>
                            <select
                                style={{
                                    width: "188px",
                                    padding: "5px",
                                    border: `${borderCss}`,
                                }}
                                name="languages"
                            >
                                <option value="use">사용</option>
                                <option value="notUse">사용안함</option>
                            </select>
                        </div>
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
                                    marginLeft: "3px",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                계정상태
                            </span>
                            <select
                                style={{
                                    width: "188px",
                                    padding: "5px",
                                    border: `${borderCss}`,
                                }}
                                name="languages"
                            >
                                <option value="active">활성</option>
                                <option value="locked">잠김</option>
                            </select>
                        </div>
                    </div>
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
                                justifyContent: "center",
                                alignItems: "center",
                                border: "1px solid #D8D8D8",
                                marginRight: "3px",
                            }}
                        >
                            비고
                        </span>
                        <input
                            style={{
                                width: "70%",
                                padding: "5px",
                                border: `${borderCss}`,
                            }}
                            type="email"
                        ></input>
                    </div>
                </div>
                <p
                    style={{
                        fontSize: "1.5em",
                        padding: "1em",
                        background: "#ECF0F5",
                        width: "100%",
                    }}
                >
                    메뉴 그룹 설정
                </p>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            width: "100%",
                            backgroundColor: "#F9F9F9",
                            padding: "5px 0 5px 0",
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
                            메뉴 그룹
                        </span>
                        <select
                            style={{
                                padding: "5px",
                                border: `${borderCss}`,
                            }}
                            name="languages"
                        >
                            <option value="locked">사용자 그룹</option>
                            <option value="active">시스템 관리자 그룹</option>
                        </select>
                    </div>
                </div>
                <p
                    style={{
                        fontSize: "1.5em",
                        padding: "1em",
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
