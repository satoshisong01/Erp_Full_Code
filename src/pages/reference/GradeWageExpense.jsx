import React, { useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import DataTable from "components/DataTable/DataTable";
import DataTableRow from "components/DataTable/DataTableRow";
import { locationPath } from "constants/locationPath";
import { axiosFetch } from "api/axiosFetch";
import ApprovalForm from "components/form/ApprovalForm";
import ReactDataTable from "components/DataTable/ReactDataTable";

/** 기준정보관리-원가기준관리-급별단가(경비) */
function GradeWageExpense() {
    const [tableData, setTableData] = useState([]);
    const gradeWageExpenseTable = useRef(null);

    const columns = [
        { header: "단가ID", col: "gupId", cellWidth: "50%", type: "input", notView: true },
        { header: "기준명", col: "gupDesc", cellWidth: "60%", type: "input" },
        { header: "임원", col: "gupPrice1", cellWidth: "50%", type: "input" },
        { header: "특급기술사", col: "gupPrice2", cellWidth: "50%", type: "input" },
        { header: "고급기술사", col: "gupPrice3", cellWidth: "50%", type: "input" },
        { header: "중급기술사", col: "gupPrice4", cellWidth: "50%", type: "input" },
        { header: "초급기술사", col: "gupPrice5", cellWidth: "50%", type: "input" },
        { header: "고급기능사", col: "gupPrice6", cellWidth: "50%", type: "input" },
        { header: "중급기능사", col: "gupPrice7", cellWidth: "50%", type: "input" },
        { header: "초급기능사", col: "gupPrice8", cellWidth: "50%", type: "input" },
        { header: "부장", col: "gupPrice9", cellWidth: "50%", type: "input" },
        { header: "차장", col: "gupPrice10", cellWidth: "50%", type: "input" },
        { header: "과장", col: "gupPrice11", cellWidth: "50%", type: "input" },
        { header: "대리", col: "gupPrice12", cellWidth: "50%", type: "input" },
        { header: "주임", col: "gupPrice13", cellWidth: "50%", type: "input" },
        { header: "사원", col: "gupPrice14", cellWidth: "50%", type: "input" },
    ];

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        const url = `/api/baseInfrm/product/gradeunitPrice/type/g/listAll.do`;
        const requestData = { useAt: "Y" };
        const resultData = await axiosFetch(url, requestData);
        console.log(resultData, "resultData");
        setTableData(reorganizeData(resultData));
    };

    const roleMapping = {
        임원: 1,
        특급기술사: 2,
        고급기술사: 3,
        중급기술사: 4,
        초급기술사: 5,
        고급기능사: 6,
        중급기능사: 7,
        초급기능사: 8,
        부장: 9,
        차장: 10,
        과장: 11,
        대리: 12,
        주임: 13,
        사원: 14,
    };

    useEffect(() => {
        console.log(tableData, "tableData");
    }, [tableData]);

    //급별단가 데이터 배열 재구성함수
    const reorganizeData = (data) => {
        // reduce 함수를 사용하여 데이터 배열을 순회하면서 재구성된 결과를 구축합니다.
        return data.reduce((acc, item) => {
            // 현재 아이템에서 속성들을 비구조화하여 가져옵니다.
            const { gupDesc, guppName, gupId, gupType, gupBaseDate, gupPrice } = item;

            // gupBaseDate 배열에서 연도를 추출합니다.
            const year = gupBaseDate[0];

            // 찾은 데이터의 인덱스
            // gupDesc를 기반으로 누적 배열에서 그룹의 인덱스를 찾습니다.
            const foundIndex = acc.findIndex((group) => group && group.gupDesc === gupDesc);
            const roleKey = `gupPrice${roleMapping[guppName]}`;

            // 해당하는 그룹이 없을 경우 새로운 그룹 생성
            // 동일한 gupDesc를 가진 그룹이 존재하는지 확인합니다.
            if (foundIndex === -1) {
                // 그룹이 존재하지 않으면 새로운 그룹을 생성하고 누적 배열에 추가합니다.
                acc.push({ gupDesc, gupType, year, [roleKey]: Number(gupPrice), gupId: [gupId] });
            } else {
                // 그룹이 이미 존재하면 데이터를 기존 그룹에 추가합니다.
                acc[foundIndex][`gupPrice${roleMapping[guppName]}`] = Number(gupPrice);
                //항상 배열로 쓰이고 낮은순서로 저장됨
                acc[foundIndex].gupId = [...acc[foundIndex].gupId, ...(Array.isArray(gupId) ? gupId : [gupId])].sort((a, b) => a - b);
            }

            return acc;
        }, []);
    };

    return (
        <>
            <ApprovalForm projectNone={true} />
            <Location pathList={locationPath.GradeWageExpense} />
            <ReactDataTable
                columns={columns}
                customDatas={tableData}
                //suffixUrl="/api/baseInfrm/product/gradeunitPrice/type/g"
                tableRef={gradeWageExpenseTable}
                //setLengthSelectRow={setLengthSelectRow}
                viewPageName="급별단가(경비)"
            />
        </>
    );
}

export default GradeWageExpense;
