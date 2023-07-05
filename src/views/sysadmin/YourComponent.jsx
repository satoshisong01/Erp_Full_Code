import React, { useState } from "react";

const YourComponent = () => {
    const [selectedData, setSelectedData] = useState([]);
    const [check, setCheck] = useState(false);

    const data = [
        {
            dpmCd: "1",
            dpmNm: "우하하하",
            dpmLv: "99",
        },
        {
            dpmCd: "2",
            dpmNm: "name2",
            dpmLv: "2lv",
        },
        {
            dpmCd: "3",
            dpmNm: "name3",
            dpmLv: "3lv",
        },
    ];

    const keys = Object.keys(data[0]);

    const handleClick = (item, e) => {
        const isChecked = e.target.checked;

        if (isChecked) {
            setCheck(true);
            setSelectedData(data); // 모든 데이터를 선택된 데이터로 설정
        } else {
            setCheck(false);
            setSelectedData([]); // 선택된 데이터 초기화
        }
    };

    const handleItemCheck = (item, e) => {
        const isChecked = e.target.checked;

        setSelectedData((prevSelectedData) => {
            if (isChecked) {
                // 이미 선택된 데이터인지 확인 후 중복 추가 방지
                if (
                    !prevSelectedData.find(
                        (selectedItem) => selectedItem.dpmCd === item.dpmCd
                    )
                ) {
                    const sortedData = [...prevSelectedData, item].sort(
                        (a, b) => {
                            // dpmCd 속성을 기준으로 데이터 정렬
                            if (a.dpmCd < b.dpmCd) {
                                return -1;
                            }
                            if (a.dpmCd > b.dpmCd) {
                                return 1;
                            }
                            return 0;
                        }
                    );
                    return sortedData;
                }
            } else {
                return prevSelectedData.filter(
                    (selectedItem) => selectedItem.dpmCd !== item.dpmCd
                );
            }
            return prevSelectedData; // 체크가 풀리지 않았거나 중복 데이터인 경우 이전 상태 그대로 반환
        });
    };

    return (
        <div>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <input
                                type="checkbox"
                                checked={check}
                                onChange={(e) => handleClick(null, e)}
                            />
                        </td>
                        {keys.map((key) => (
                            <td key={key}></td>
                        ))}
                    </tr>
                    {data.map((item, index) => (
                        <tr key={index}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedData.some(
                                        (selectedItem) =>
                                            selectedItem.dpmCd === item.dpmCd
                                    )}
                                    onChange={(e) => handleItemCheck(item, e)}
                                />
                            </td>
                            {keys.map((key) => (
                                <td
                                    onClick={() => handleItemCheck(item, {})}
                                    key={key}
                                >
                                    {item[key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedData.length > 0 && (
                <div>
                    <h3>Selected Data:</h3>
                    {selectedData.map((selectedItem, index) => (
                        <div key={index}>
                            <p>dpmCd: {selectedItem.dpmCd}</p>
                            <p>dpmNm: {selectedItem.dpmNm}</p>
                            <p>dpmLv: {selectedItem.dpmLv}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default YourComponent;
