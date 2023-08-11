import React from "react";
import Location from "components/Location/Location";
import DataTable from "components/DataTable/DataTable";

/** 기준정보관리-원가기준관리-인건비요율 */
function LaborRate() {
    const columns = [
        { header: "특2", col: "peLv7", cellWidth: "30%" },
        { header: "특1", col: "peLv6", cellWidth: "30%" },
        { header: "고2", col: "peLv5", cellWidth: "30%" },
        { header: "고1", col: "peLv4", cellWidth: "30%" },
        { header: "중", col: "peLv3", cellWidth: "30%" },
        { header: "초2", col: "peLv2", cellWidth: "30%" },
        { header: "초1", col: "peLv1", cellWidth: "30%" },
    ];

    const tableList = [
        {
            title: "원가기준관리",
            middleName: "기준정보 관리",
            detailName: "인건비요율",
        },
    ];

    const addBtn = [""];

    return (
        <>
            <Location tableList={tableList} />
            <DataTable
                columns={columns}
                suffixUrl="/baseInfrm/product"
                currentPage="ddd"
                addBtn={addBtn}
            />
        </>
    );
}

export default LaborRate;
