import React, { useContext, useEffect, useState } from "react";
import "./ModalSearch.css";
import { PageContext } from "components/PageProvider";
import ModalPageCompany from "./ModalPageCompany";

export default function ModalSearchCompany({ stableData, tableData }) {
    const { saveCompany, setIsOpenModalPgNm, isOpenModalPgNm, setSaveCompany } = useContext(PageContext);

    console.log(tableData, "받아온데이터뭉치⭐⭐⭐⭐⭐⭐⭐");
    const [newData, setNewData] = useState([]);
    const [saveCount, setSaveCount] = useState([]);

    useEffect(() => {
        setSaveCompany({});
    }, []);

    useEffect(() => {
        if (stableData > -1) {
            setSaveCount(stableData);
            console.log(saveCount, "넘겨온 선택값 ❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️❤️😁😁😁");
        }
    }, [stableData]);

    useEffect(() => {
        // tableData가 빈 값이 아닌 경우에만 newData를 업데이트합니다.
        if (tableData.length > 0) {
            const updatedData = Array.from({ length: tableData.length }, (_, index) => ({
                [index]: "aaa",
            }));
            setNewData(updatedData);
        }
    }, [tableData]);

    console.log(newData, "새로운 데이터💚💚💚💚💚💚💚");

    console.log(newData.length, "새로운 데이터 갯수🎉🎉🎉🎉🎉🎉🎉🎉🎉");

    return (
        <div>
            <input
                onClick={() => setIsOpenModalPgNm(true)}
                type="text"
                placeholder={saveCompany.esntlId ? saveCompany.esntlId : `협력사명을 선택해 주세요.`}
                value={saveCompany.esntlId}
                readOnly
            />
            {isOpenModalPgNm && (
                <ModalPageCompany
                    onClose={() => {
                        setIsOpenModalPgNm(false);
                    }}
                />
            )}
        </div>
    );
}
