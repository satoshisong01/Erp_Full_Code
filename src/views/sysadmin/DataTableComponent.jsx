import React, { useState, useEffect } from "react";
import axios from "axios";

const DataTableComponent = () => {
    const [data, setData] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchCondition, setSearchCondition] = useState("0");
    const tdStyle = {
        width: "15vw",
        cursor: "pointer",
    };

    const fetchData = async () => {
        try {
            const response = await axios.post(
                "/api/system/code/clCode/list.do",
                {
                    useAt: "Y",
                    searchKeyword,
                    searchCondition,
                }
            );

            console.log(response.data.result.resultData.content);
            setData(response.data.result.resultData.content);
        } catch (error) {
            alert("Connection failed!");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchData();
    };

    return (
        <div className="panel-content">
            <form
                name="searchForm"
                id="searchForm"
                role="form"
                onSubmit={handleSearch}
            >
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

                    <div className="col-2 input-group input-group-sm">
                        <button type="submit" className="btn btn-primary">
                            검색
                        </button>
                    </div>
                </div>
            </form>
            <table>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>
                            {[
                                "clCode",
                                "clCodeNm",
                                "clCodeDc",
                                "createIdBy",
                                "lastModifiedIdBy",
                                "createDate",
                                "lastModifyDate",
                            ].map((key) => (
                                <td style={tdStyle} key={key}>
                                    {item[key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DataTableComponent;
