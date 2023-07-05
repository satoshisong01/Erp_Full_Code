import React, { useState } from "react";

const InputTest = () => {
    const [searchQueries, setSearchQueries] = useState([
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
    ]);

    const handleChange = (event, index) => {
        const { value } = event.target;
        setSearchQueries((prevQueries) => {
            const newQueries = [...prevQueries];
            newQueries[index] = value;
            return newQueries;
        });
    };

    const handleSend = () => {
        // 각 검색어 데이터를 변수에 저장하는 로직을 추가하세요.
        console.log(searchQueries);
    };

    return (
        <div>
            <div className="searchDivParent">
                {searchQueries.slice(0, 6).map((query, index) => (
                    <div className="searchDiv" key={index}>
                        <div>검색어</div>
                        <input
                            type="text"
                            value={query}
                            onChange={(event) => handleChange(event, index)}
                        />
                    </div>
                ))}
            </div>
            <div className="searchDivParent">
                {searchQueries.slice(6).map((query, index) => (
                    <div className="searchDiv" key={index + 6}>
                        <div>검색어</div>
                        <input
                            type="text"
                            value={query}
                            onChange={(event) => handleChange(event, index + 6)}
                        />
                    </div>
                ))}
            </div>
            <button onClick={handleSend}>보내기</button>
        </div>
    );
};

export default InputTest;
