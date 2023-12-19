import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faArrowRotateRight } from "@fortawesome/free-solid-svg-icons";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import "react-calendar/dist/Calendar.css";
import MakeItemField from "utils/MakeItemField";
import BasicButton from "./button/BasicButton";
import HideCard from "./HideCard";

/* 데이터 테이블 검색 */
export default function SearchList({ conditionList, onSearch }) {
    const [searchData, setSearchData] = useState({});

    /* 검색 이벤트 */
    const searchClick = () => {
        Object.keys(searchData).forEach((key) => {
            if (searchData[key] === "") { 
                delete searchData[key]; //빈값 제외
            }
        });
        onSearch && onSearch(searchData);
    };

    /* 검색 데이터 */
    const onChange = (value) => {
        setSearchData((prevData) => {
            return { ...prevData, ...value };
        });
    };

    const handleClick1 = () => {
        setIsClicked(!isClicked);
    };

    const [isClicked, setIsClicked] = useState(false);

    return (
        <>
            <HideCard title="검색 조건" color="back-lightgreen" className="mg-b-40">
                <div className="flex-container">
                    {
                        conditionList.map((param, idx) => (
                            <div key={idx} className="flex-group mg-b-10">
                                <div className="flex-label">
                                    <label>{param.title}</label>
                                </div>
                                <div className="flex-input">
                                    <MakeItemField item={param} resultData={onChange}/>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div style={{ textAlign: "right" }}>
                    <button className="table-btn search-btn" onClick={searchClick}>
                        검색
                    </button>
                </div>
            </HideCard>
        </>
    );
}
