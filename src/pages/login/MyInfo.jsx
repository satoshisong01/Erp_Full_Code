// SignUpForm.jsx

import React, { useState } from "react";
import "./MyInfo.css";
import { Radio } from "antd";

const MyInfo = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        permissionGroup: "PS",
        organization: "메카테크", // Default value
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // 여기에서 폼 데이터를 처리하거나 API 호출 등을 수행할 수 있습니다.
        console.log("Form Data Submitted:", formData);
    };

    return (
        <div className="sign-up-form">
            <h2>나의 회원정보</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username" id="infoLabel">
                    사용자 이름:
                </label>
                <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required />

                <label htmlFor="username" id="infoLabel">
                    조직부서:
                </label>
                <div>
                    <input
                        type="radio"
                        id="organizationMecatech"
                        name="organization"
                        value="메카테크"
                        checked={formData.organization === "메카테크"}
                        onChange={handleChange}
                    />
                    <label htmlFor="organizationMecatech" id="infoLabel">
                        메카테크
                    </label>
                </div>
                <label htmlFor="permissionGroup" id="infoLabel">
                    권한 그룹:
                </label>
                <select id="permissionGroup" name="permissionGroup" value={formData.permissionGroup} onChange={handleChange}>
                    <option value="PS">PS</option>
                    <option value="PA">PA</option>
                </select>
                <label htmlFor="email" id="infoLabel">
                    이메일:
                </label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />

                <label htmlFor="password" id="infoLabel">
                    비밀번호:
                </label>
                <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />

                <label htmlFor="password" id="infoLabel">
                    비밀번호 확인:
                </label>
                <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />

                <button type="submit" className="myInfobutton">
                    수정
                </button>
            </form>
        </div>
    );
};

export default MyInfo;
