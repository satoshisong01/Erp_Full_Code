import React, { useState, useEffect } from "react";

const DataTableComponent2Mook = () => {
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchCondition, setSearchCondition] = useState("0");
    const [data, setData] = useState([]);

    const getData = [
        {
            clCode: "777",
            clCodeNm: "NI-NI-01",
            clCodeDc: "Koi",
            createIdBy: "555hrhr",
            lastModifiedIdBy: "559999",
            createDate: "rrrr1111",
            lastModifyDate: "aaaa5555",
        },
        {
            clCode: "888",
            clCodeNm: "NI-NI-02",
            clCodeDc: "Fish",
            createIdBy: "999hhhh",
            lastModifiedIdBy: "111222",
            createDate: "gggg4444",
            lastModifyDate: "bbbb6666",
        },
    ];

    const handleSearch = () => {
        let filteredData = [...getData]; // 더미 데이터를 초기화된 배열로 설정합니다.

        if (searchCondition === "1") {
            filteredData = filteredData.filter(
                (item) => item.clCode === searchKeyword
            );
        } else if (searchCondition === "2") {
            filteredData = filteredData.filter(
                (item) => item.clCodeNm === searchKeyword
            );
        } else if (searchCondition === "3") {
            filteredData = filteredData.filter(
                (item) => item.clCodeDc === searchKeyword
            );
        }

        setData(filteredData);
    };

    useEffect(() => {
        // 초기 데이터 설정
        setData([getData]);
    }, []);

    return (
        <div className="panel-content">
            <div className="form-row">
                <label
                    htmlFor="searchKeyword"
                    className="col-form-label col-1 form-label text-lg-right"
                >
                    Search Keyword
                </label>
                <div className="col-2 input-group input-group-sm">
                    <input
                        type="text"
                        className="form-control"
                        name="searchKeyword"
                        id="searchKeyword"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                </div>

                <label
                    htmlFor="searchCondition"
                    className="col-form-label col-1 form-label text-lg-right"
                >
                    Condition
                </label>
                <div className="col-2 input-group input-group-sm">
                    <select
                        id="searchCondition"
                        name="searchCondition"
                        className="form-control"
                        value={searchCondition}
                        onChange={(e) => setSearchCondition(e.target.value)}
                    >
                        <option value="0">전체</option>
                        <option value="1">분류코드 ID</option>
                        <option value="2">분류코드명</option>
                        <option value="3">분류코드 설명</option>
                    </select>
                </div>
                <button className="menuBtn" onClick={handleSearch}>
                    검색
                </button>
            </div>

            <div className="panel-content">
                {/* 여기에 검색 결과 데이터를 표시하는 로직을 추가할 수 있습니다 */}
                {data.map((item, index) => (
                    <div key={index}>
                        <p>clCode: {item.clCode}</p>
                        <p>clCodeNm: {item.clCodeNm}</p>
                        <p>clCodeDc: {item.clCodeDc}</p>
                        <p>createIdBy: {item.createIdBy}</p>
                        <p>lastModifiedIdBy: {item.lastModifiedIdBy}</p>
                        <p>createDate: {item.createDate}</p>
                        <p>lastModifyDate: {item.lastModifyDate}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DataTableComponent2Mook;
