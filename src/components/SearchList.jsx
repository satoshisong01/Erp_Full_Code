import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faMagnifyingGlass,
    faArrowRotateRight,
} from "@fortawesome/free-solid-svg-icons";

/* 데이터 테이블 검색 */
export default function SearchList({ conditionList, onSearch }) {
    const [fieldList, setFieldList] = useState([]);
    const [searchData, setSearchData] = useState({});
    const [radioOption, setRadioOption] = useState("Y");

    useEffect(() => {
        setFieldList(conditionList);
    }, [conditionList]);

    /* radio click */
    const radioClick = (value) => {
        setRadioOption(value);
    };

    /* 초기화구현 */
    const resetClick = () => {
        setSearchData({});
    };

    /* 검색 이벤트 */
    const searchClick = (e) => {
        const keyArr = Object.keys(searchData);
        console.log(keyArr, "이게머얀");
        let searchLevel = "0";

        if (keyArr.length === 1) {
            const fieldName = keyArr[0];
            const field = fieldList.find((item) => item.colName === fieldName);
            if (field) {
                searchLevel = field.searchLevel;
            }
        }

        const dataToSend = {
            searchKeyword: searchData,
            searchCondition: searchLevel,
            radioOption: radioOption,
        };
        console.log(dataToSend, "555555");
        onSearch(dataToSend);
    };

    /* 검색 데이터 */
    const onChange = (e) => {
        const { name, value } = e.target;
        setSearchData((prevData) => {
            const newData = { ...prevData, [name]: value };

            // 빈 값을 가진 객체 제거
            Object.keys(newData).forEach((key) => {
                if (newData[key] === "") {
                    delete newData[key];
                }
            });

            return newData;
        });
    };

    /* 검색 화면구현 */
    const renderField = (param) => {
        if (param.type === "input") {
            return (
                <input
                    type="text"
                    name={param.colName}
                    value={searchData[param.colName] || ""}
                    onChange={onChange}
                    className="form-control flex-item"
                />
            );
        } else if (param.type === "select") {
            return (
                <select
                    name={param.colName}
                    value={searchData[param.colName] || ""}
                    onChange={onChange}
                    className="form-control flex-item"
                    key={searchData[param.colName]}>
                    <option value=""> 선택없음 </option>
                    {param.option.map((op) => (
                        <option key={op.value} value={op.value}>
                            {op.value}
                        </option>
                    ))}
                </select>
            );
        }
        return null;
    };

    return (
        <>
            <div className="flex-between">
                <div className="radio-group">
                    <input
                        type="radio"
                        value="Y"
                        checked={radioOption === "Y"}
                        onChange={() => {
                            radioClick("Y");
                        }}
                    />
                    <label>미삭제 항목</label>
                    <input
                        type="radio"
                        value="N"
                        checked={radioOption === "N"}
                        onChange={() => {
                            radioClick("N");
                        }}
                    />
                    <label>삭제 항목</label>
                </div>

                <div>
                    <button
                        className="btn btn-primary clearIcon"
                        onClick={resetClick}>
                        초기화
                    </button>
                    <button
                        className="btn btn-primary searchIcon"
                        onClick={searchClick}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </button>
                </div>
            </div>

            <div className="line" />

            <div className="flex-container">
                {fieldList.map((param) => (
                    <div key={param.colName} className="flex-group mg-l-15">
                        <div className="flex-label">
                            <label>{param.title}</label>
                        </div>
                        <div className="flex-input">{renderField(param)}</div>
                    </div>
                ))}
            </div>
        </>
    );
}
