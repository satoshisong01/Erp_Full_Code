import React, { useState } from "react";
import Location from "components/Location/Location";
import DataTable from "components/DataTable/DataTable";

/** 기준정보관리-원가기준관리-급별단가(인건비) */
function GradeWageLaborCost() {
    const [columns, setColumns] = useState([
        {
            header: "급별단가타입",
            col: "groupId",
            cellWidth: "30%",
            enable: false,
            itemType: ["타입을 선택해 주세요[P:인건비,G:경비]", "P", "G"],
            modify: true,
            add: true,
            require: true,
            notView: true,
        },
        { header: "기준명", col: "gupDesc", cellWidth: "30%" },
        { header: "임원", col: "gupPrice", cellWidth: "30%" },
        { header: "특급기술사", col: "gupPrice", cellWidth: "30%" },
        { header: "고급기술사", col: "gupPrice", cellWidth: "30%" },
        { header: "중급기술사", col: "gupPrice", cellWidth: "30%" },
        { header: "초급기술사", col: "gupPrice", cellWidth: "30%" },
        { header: "고급기능사", col: "gupPrice", cellWidth: "30%" },
        { header: "중급기능사", col: "gupPrice", cellWidth: "30%" },
        { header: "부장/차장", col: "gupPrice", cellWidth: "30%" },
        { header: "과장", col: "gupPrice", cellWidth: "30%" },
        { header: "대리", col: "gupPrice", cellWidth: "30%" },
        { header: "주임", col: "gupPrice", cellWidth: "30%" },
        { header: "사원", col: "gupPrice", cellWidth: "30%" },
    ]);

    const updateColumns = (newColumns) => {
        setColumns(newColumns);
    };

    const tableList = [
        {
            title: "원가기준관리",
            middleName: "기준정보 관리",
            detailName: "급별단가(인건비)",
        },
    ];

    const addBtn = [""];

    return (
        <>
            <Location tableList={tableList} />
            <DataTable
                columns={columns}
                updateColumns={updateColumns}
                suffixUrl="/baseInfrm/product"
                currentPage="gradeunitPrice"
                customerList="type/p"
                addBtn={addBtn}
            />
        </>
    );
}

export default GradeWageLaborCost;
