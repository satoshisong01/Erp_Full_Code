import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AxiosTest() {
    const [inputValue, setInputValue] = useState("");

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    console.log(inputValue);

    const deleteItem = async () => {
        try {
            const data = {
                dpmCd: inputValue,
            };

            const response = await axios.delete(
                "http://192.168.0.113:8080/dummy/remove",
                {
                    data: data,
                }
            );

            console.log(response.data);
            setInputValue("");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <h1>데이터 삭제</h1>
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="dpmCd 값을 입력하세요"
            />
            <button onClick={deleteItem}>삭제</button>
        </>
    );
}
