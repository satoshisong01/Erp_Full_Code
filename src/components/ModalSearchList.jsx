import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faArrowRotateRight } from "@fortawesome/free-solid-svg-icons";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import "react-calendar/dist/Calendar.css";
import MakeItemField from "utils/MakeItemField";
import BasicButton from "./button/BasicButton";
import HideCard from "./HideCard";

/* 모달의 테이블 검색 */
export default function ModalSearchList({ conditionList, onSearch }) {
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

    const onChange = (value) => {
        console.log("💜ModalSearchList의 value: ", value);
        // setSearchData((prevData) => {
        //     return { ...prevData, ...value };
        // });
    };

    const handleClick1 = () => {
        setIsClicked(!isClicked);
    };

    const [isClicked, setIsClicked] = useState(false);

    return (
        <>
            <table border="1" style={{ borderCollapse: "collapse", width: "100%", margin: 0}}>
                <tbody>
                    {conditionList.map((row, rowIndex) => (
                    <tr key={rowIndex} style={{ border: "1px solid #dddddd" }} >
                        <td style={{ width: "35%", padding: "5px", textAlign: "center", fontWeight: "bold", backgroundColor: "#f2f2f2"}}>
                        {row.title}
                        </td>
                        <td style={{ padding: "5px", textAlign: "center" }}>
                            <MakeItemField item={row} resultData={onChange}/>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
