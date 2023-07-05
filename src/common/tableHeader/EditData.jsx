import React, { useState, useEffect } from "react";
import axios from "axios";

const UpdateValueForm = ({ data11 }) => {
    const [dpmCd, setDpmCd] = useState("");
    const [dpmNm, setDpmNm] = useState("");
    const [dpmLv, setDpmLv] = useState("");
    const [data, setData] = useState([]);
    const data1s = data11;

    console.log(data1s, "받은값");
    useEffect(() => {
        // 초기값 가져오기
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "http://192.168.0.113:8080/dummy/list"
                );
                const data = response.data.data;
                if (data.length > 0) {
                    const initialData = data[0]; // 첫 번째 데이터를 사용
                    setDpmCd(initialData.dpmCd);
                    setDpmNm(initialData.dpmNm);
                    setDpmLv(initialData.dpmLv);
                }
                setData(data);
                console.log(data);
            } catch (error) {
                console.error(error);
                // 에러 처리 작업 수행
            }
        };

        fetchData();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === "dpmNm") {
            setDpmNm(value);
        } else if (name === "dpmLv") {
            setDpmLv(value);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // 서버 엔드포인트 URL 설정
        const url = "http://192.168.0.113:8080/dummy/edit";

        // PUT 요청 보내기
        axios
            .put(url, {
                dpmCd,
                dpmNm,
                dpmLv,
            })
            .then((response) => {
                console.log(response.data); // 성공 시 응답 데이터 출력
                // 성공 시 추가 작업 수행
            })
            .catch((error) => {
                console.error(error); // 에러 시 에러 메시지 출력
                // 에러 처리 작업 수행
            });
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                dpmNm:
                <input
                    type="text"
                    name="dpmNm"
                    value={dpmNm}
                    onChange={handleChange}
                />
            </label>
            <label>
                dpmLv:
                <input
                    type="text"
                    name="dpmLv"
                    value={dpmLv}
                    onChange={handleChange}
                />
            </label>
            <button type="submit">수정</button>

            {/* 기존 데이터 표시 */}
            {data.length > 0 && (
                <div>
                    <h3>기존 데이터:</h3>
                    <ul>
                        {data.map((item) => (
                            <li key={item.dpmCd}>
                                <div>
                                    <span>dpmCd: {item.dpmCd} ----</span>
                                    <span>dpmNm: {item.dpmNm} ----</span>
                                    <span>dpmLv: {item.dpmLv} ----</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </form>
    );
};

export default UpdateValueForm;
