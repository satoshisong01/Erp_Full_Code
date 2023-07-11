import React, { useState } from "react";
import "./UserManagementInfo.css";

let borderCss = "3px solid #CCCCCC";
let userBackgroundColor = "#ECF0F5";

export default function UserManagementInfo({ detailData }) {
    const [phoneNumber, setPhoneNumber] = useState("");

    console.log(detailData, "뭐가나올까");

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
            <div className="InfoBody">
                <h2 style={{ marginTop: "0" }}>업무 회원 정보</h2>
                <div className="TopInfoBox">
                    <div className="TopItemLine">
                        <div className="TopItem">
                            <span className="InfoName">이름</span>
                            <input
                                className="InfoInput"
                                type="text"
                                value={detailData.empNm}
                            />
                        </div>
                        <div className="TopItem">
                            <span className="InfoName">업무회원 아이디</span>
                            <input
                                className="InfoInput"
                                type="text"
                                value={detailData.empId}
                            />
                        </div>
                    </div>
                    <div style={{ display: "flex" }}>
                        <div className="TopItemLine">
                            <div className="TopItem">
                                <span className="InfoName">비밀번호</span>
                                <input
                                    className="InfoInput"
                                    type="password"
                                    value={detailData.password}
                                />
                            </div>
                            <div className="TopItem">
                                <span className="InfoName">비밀번호 확인</span>
                                <input className="InfoInput" type="password" />
                            </div>
                        </div>
                        <button
                            className="btn btn-primary"
                            style={{ margin: "0 0 0 10px" }}
                        >
                            변경
                        </button>
                    </div>
                    <div className="TopItemLine">
                        <div className="TopItem">
                            <span className="InfoName">이메일</span>
                            <input
                                className="InfoInput"
                                type="email"
                                value={detailData.emailAdr}
                            />
                        </div>
                        <div className="TopItem">
                            <span className="InfoName">휴대폰 번호</span>
                            <input
                                className="InfoInput"
                                type="tel"
                                value={detailData.mbTelNm}
                                onChange={handlePhoneNumberChange}
                                placeholder="휴대전화 번호를 입력하세요"
                            />
                        </div>
                    </div>
                    <div className="TopItemLine">
                        <div style={{ display: "flex", width: "16.3%" }}>
                            <span className="InfoName InfoAddress">주소</span>
                        </div>
                        <input
                            className="InfoInput AddressInput"
                            type="text"
                            value={detailData.address}
                        />
                    </div>
                    <div className="TopItemLine">
                        <div className="TopItem">
                            <span className="InfoName">성별</span>
                            <select className="InfoInput" name="male">
                                <option value="locked">남</option>
                                <option value="active">여</option>
                            </select>
                        </div>
                        <div className="TopItem">
                            <span className="InfoName">나이</span>
                            <input
                                className="InfoInput"
                                type="number"
                                value={detailData.birthday}
                            />
                        </div>
                    </div>
                    <div className="TopItemLine">
                        <div className="TopItem">
                            <span className="InfoName">소속기관</span>
                            <input
                                className="InfoInput"
                                type="text"
                                value={detailData.aflOrgCd}
                            />
                        </div>
                        <div className="TopItem">
                            <span className="InfoName">직위</span>
                            <input
                                className="InfoInput"
                                type="text"
                                value={detailData.posNm}
                            />
                        </div>
                    </div>
                </div>
                <div className="BottomInfoBox">
                    <div className="TopItemLine">
                        <div className="TopItem">
                            <span className="InfoName">가입일</span>
                            <input
                                className="InfoInput"
                                type="text"
                                value={detailData.joinDt}
                            />
                        </div>
                        <div className="TopItem">
                            <span className="InfoName">권한</span>
                            <input className="InfoInput" type="text" />
                        </div>
                    </div>
                    <div className="TopItemLine">
                        <div className="TopItem">
                            <span className="InfoName">입사일</span>
                            <input
                                className="InfoInput"
                                type="text"
                                value={detailData.joiningDt}
                            />
                        </div>
                        <div className="TopItem">
                            <span className="InfoName">잠금여부</span>
                            <input
                                className="InfoInput"
                                type="text"
                                value={detailData.lockAt}
                            />
                        </div>
                    </div>
                    <div className="TopItemLine">
                        <div className="TopItem">
                            <span className="InfoName">작성일</span>
                            <input className="InfoInput" type="text" />
                        </div>
                        <div className="TopItem">
                            <span className="InfoName">작성자</span>
                            <input className="InfoInput" type="text" />
                        </div>
                    </div>
                    <div className="TopItemLine">
                        <div className="TopItem">
                            <span className="InfoName">수정일</span>
                            <input className="InfoInput" type="text" />
                        </div>
                        <div className="TopItem">
                            <span className="InfoName">수정자</span>
                            <input className="InfoInput" type="text" />
                        </div>
                    </div>
                </div>
                <h2>권한 설정</h2>
                <div className="TopItemLine">
                    <div className="TopItem2">
                        <span className="InfoName">권한 그룹</span>
                        <select className="InfoInput" name="male">
                            <option value="locked">관리자</option>
                            <option value="active">사용자</option>
                        </select>
                    </div>
                </div>
            </div>
        </>
    );
}
