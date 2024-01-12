import React, { useContext, useRef, useState } from "react";
import Location from "components/Location/Location";
import DataTable from "components/DataTable/DataTable";
import { locationPath } from "constants/locationPath";
import { PageContext } from "components/PageProvider";
import AddButton from "components/button/AddButton";
import ModButton from "components/button/ModButton";
import DelButton from "components/button/DelButton";
import RefreshButton from "components/button/RefreshButton";
import ReactDataTable from "components/DataTable/ReactDataTable";

/** 기준정보관리-원가기준관리-인건비단가 */
function LaborRate() {
    const { setNameOfButton } = useContext(PageContext);
    const LaborRateTable = useRef(null);

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

    const [length, setLength] = useState(0);
    const setLengthSelectRow = (length) => {
        setLength(length);
    };

    return (
        <>
            <Location pathList={locationPath.LaborRate} />
            <div className="table-buttons">
                <AddButton label={"추가"} onClick={() => setNameOfButton("add")} />
                <ModButton label={"수정"} length={length} onClick={() => setNameOfButton("modify")} />
                <DelButton label={"삭제"} length={length} onClick={() => setNameOfButton("delete")} />
                <RefreshButton onClick={() => setNameOfButton("refresh")} />
            </div>
            <ReactDataTable
                setLengthSelectRow={setLengthSelectRow}
                columns={columns}
                suffixUrl="/baseInfrm/product/personelXp"
                tableRef={LaborRateTable}
                viewPageName={{ name: "인건비단가", id: "LaborRate" }}
            />
        </>
    );
}
export default LaborRate;
