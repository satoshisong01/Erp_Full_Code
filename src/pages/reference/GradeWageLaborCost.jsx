import React, { useState } from "react";
import Location from "components/Location/Location";
import DataTable from "components/DataTable/DataTable";
import { locationPath } from "constants/locationPath";
import DataTableRow from "components/DataTable/DataTableRow";

/** 기준정보관리-원가기준관리-급별단가(인건비) */
function GradeWageLaborCost() {
    const columns = [
        //{
        //    uId: "gupId",
        //    price: "gupPrice",
        //    itemType: "gupType",
        //    content: "gupDesc",
        //    nameId: "guppId",
        //    classId: "guppName",
        //    classCode: "guppCode",
        //},
        "기준명",
        "특급기술사",
        "고급기술사",
        "중급기술사",
        "초급기술사",
        "고급기능사",
        "중급기능사",
        "초급기능사",
        "부장",
        "차장",
        "과장",
        "대리",
        "주임",
        "사원",
    ];

    const addBtn = [""];

    return (
        <>
            <Location pathList={locationPath.GradeWageLaborCost} />

            <DataTableRow
                columns={columns}
                //updateColumns={updateColumns}
                suffixUrl="/baseInfrm/product"
                currentPage="gradeunitPrice"
                customerList="type/p"
                addBtn={addBtn}
            />
        </>
    );
}

export default GradeWageLaborCost;

//{
//    header: "단가ID",
//    col: "gupId",
//    cellWidth: "30%",
//    enable: false,
//    modify: true,
//    add: true,
//    require: true,
//    notView: true,
//},
//{
//    header: "급별단가타입",
//    col: "gupType",
//    cellWidth: "30%",
//    enable: false,
//    itemType: ["타입을 선택해 주세요[P:인건비,G:경비]", "P", "G"],
//    modify: true,
//    add: true,
//    require: true,
//    notView: true,
//},
//{ header: "기준명", col: "gupDesc", cellWidth: "30%", modify: true },
//{ header: "임원", col: "gupPrice", cellWidth: "30%", modify: true },
//{
//    header: "특급기술사",
//    col: "gupPrice",
//    cellWidth: "30%",
//    modify: true,
//},
//{
//    header: "고급기술사",
//    col: "gupPrice",
//    cellWidth: "30%",
//    modify: true,
//},
//{
//    header: "중급기술사",
//    col: "gupPrice",
//    cellWidth: "30%",
//    modify: true,
//},
//{
//    header: "초급기술사",
//    col: "gupPrice",
//    cellWidth: "30%",
//    modify: true,
//},
//{
//    header: "고급기능사",
//    col: "gupPrice",
//    cellWidth: "30%",
//    modify: true,
//},
//{
//    header: "중급기능사",
//    col: "gupPrice",
//    cellWidth: "30%",
//    modify: true,
//},
//{
//    header: "초급기능사",
//    col: "gupPrice",
//    cellWidth: "30%",
//    modify: true,
//},
//{
//    header: "부장",
//    col: "gupPrice",
//    cellWidth: "30%",
//    modify: true,
//},
//{
//    header: "차장",
//    col: "gupPrice",
//    cellWidth: "30%",
//    modify: true,
//},
//{ header: "과장", col: "gupPrice", cellWidth: "30%", modify: true },
//{ header: "대리", col: "gupPrice", cellWidth: "30%", modify: true },
//{ header: "주임", col: "gupPrice", cellWidth: "30%", modify: true },
//{ header: "사원", col: "gupPrice", cellWidth: "30%", modify: true },
//{ header: "직급ID", col: "guppId", cellWidth: "30%", modify: true },
