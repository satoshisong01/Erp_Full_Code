import React, { useEffect, useState } from "react";
import axios from "axios";

function SearchComponent() {
    const [searchResults, setSearchResults] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchOption, setSearchOption] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get(
                "http://192.168.0.113:8080/dummy/list"
            ); // API_ENDPOINT를 실제 API 엔드포인트로 대체해야 합니다.
            setSearchResults(response.data.data);
            console.log(response.data.data);
            console.log(searchResults);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleSearch = async () => {
        try {
            const response = await axios.post(
                "http://192.168.0.113:8080/dummy/detail",
                {
                    params: { searchQuery, searchOption },
                }
            );
            setSearchResults(response.data.data || []); // 검색 결과가 없을 경우에도 빈 배열([]) 할당
        } catch (error) {
            console.error("Error searching data:", error);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            <select
                value={searchOption}
                onChange={(e) => setSearchOption(e.target.value)}
            >
                <option value="">검색 조건을 선택해 주세요</option>
                <option value="dpmNm">dpmNm</option>
                <option value="dpmLv">dpmLv</option>
                <option value="dpmCd">dpmCd</option>
            </select>

            <button onClick={handleSearch}>검색</button>

            <ul>
                {searchResults.map((item) => (
                    <li key={item.dpmCd}>
                        <p>{item.dpmNm}</p>
                        <p>{item.dpmLv}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SearchComponent;
