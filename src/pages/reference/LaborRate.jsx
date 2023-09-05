import React from "react";
import Location from "components/Location/Location";
import DataTable from "components/DataTable/DataTable";
import { locationPath } from "constants/locationPath";

/** 기준정보관리-원가기준관리-인건비단가 */
function LaborRate() {
    const columns = [
        {
            header: "인건비단가ID",
            col: "peId",
            cellWidth: "30%",
            modify: true,
            add: true,
            notView: true,
        },
        {
            header: "특2",
            col: "peLv7",
            cellWidth: "30%",
            modify: true,
            add: true,
        },
        {
            header: "특1",
            col: "peLv6",
            cellWidth: "30%",
            modify: true,
            add: true,
        },
        {
            header: "고2",
            col: "peLv5",
            cellWidth: "30%",
            modify: true,
            add: true,
        },
        {
            header: "고1",
            col: "peLv4",
            cellWidth: "30%",
            modify: true,
            add: true,
        },
        {
            header: "중",
            col: "peLv3",
            cellWidth: "30%",
            modify: true,
            add: true,
        },
        {
            header: "초2",
            col: "peLv2",
            cellWidth: "30%",
            modify: true,
            add: true,
        },
        {
            header: "초1",
            col: "peLv1",
            cellWidth: "30%",
            modify: true,
            add: true,
        },
    ];

    const addBtn = [""];

    return (
        <>
            <Location pathList={locationPath.LaborRate} />
            <DataTable
                columns={columns}
                suffixUrl="/baseInfrm/product"
                currentPage="personelXp"
                addBtn={addBtn}
            />
        </>
    );
}
export default LaborRate;
