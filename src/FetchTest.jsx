import React, { useEffect, useState } from "react";

export default function FetchTest() {
    const [data, setData] = useState([]);
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch(
                "http://192.168.0.113:8080/api/system/list/codeCl.do"
            );
            const jsonData = await response.json();
            setData(jsonData.clCodes);
        } catch (error) {
            console.error("에럽니다 삐융삐융", error);
        }
    };

    const addData = async () => {
        try {
            const response = await fetch(
                "http://192.168.0.113:8080/api/system/add/codeCl.do",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: inputValue, // 입력한 값을 추가할 데이터로 사용
                    }),
                }
            );
            const jsonData = await response.json();
            console.log(jsonData);
            // 데이터를 추가한 후에 다시 데이터를 불러옵니다.
            fetchData();
            setInputValue(""); // 입력값 초기화
        } catch (error) {
            console.error("에럽니다 삐융삐융", error);
        }
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    return (
        <>
            <h1>데이터를 가지고옵시다</h1>
            <div>
                {data.map((item) => (
                    <div key={item.id}>{item}</div>
                ))}
            </div>
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="데이터 입력"
            />
            <button onClick={addData}>데이터 추가</button>
        </>
    );
}
