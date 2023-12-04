import React, { useContext, useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import DataTable from "components/DataTable/DataTable";
import { locationPath } from "constants/locationPath";
import { PageContext } from "components/PageProvider";
import ReactDataTable from "components/DataTable/ReactDataTable";
import AddButton from "components/button/AddButton";
import ModButton from "components/button/ModButton";
import DelButton from "components/button/DelButton";
import RefreshButton from "components/button/RefreshButton";
import { axiosFetch } from "api/axiosFetch";
import ApprovalForm from "components/form/ApprovalForm";

/** 기준정보관리-원가기준관리-사전원가지표 */
function CostIndex() {
    const [tableData, setTableData] = useState([]);
    const costIndexMgmtTable = useRef(null);

    const { setNameOfButton } = useContext(PageContext);
    const columns = [
        { header: "분류", col: "cbName", cellWidth: "30%" },
        { header: "간접원가", cellWidth: "30%" },
        { header: "판매비", cellWidth: "30%" },
        { header: "사내본사비", cellWidth: "30%" },
        { header: "일반관리비", cellWidth: "30%" },
        { header: "영업외수지", cellWidth: "30%" },
    ];

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        const url = `/api/baseInfrm/product/costBase/totalListAll.do`;
        const requestData = { useAt: "Y" };
        const resultData = await axiosFetch(url, requestData);
        setTableData(reorganizeData(resultData));
    };

    const roleMapping = {
        간접원가: 1,
        판매비: 2,
        사내본사비: 3,
        일반관리비: 4,
        영업외수지: 5,
    };

    useEffect(() => {
        console.log(tableData, "tableData");
    }, [tableData]);

    //const uniqueBaseNames = [...new Set(tableData.map((item) => item.cbTypeCode))];
    //console.log(uniqueBaseNames, "uniqueBaseNames");

    //const changeFormatData = (data) => {
    //    const formattedData = {};

    //    data.forEach((item) => {
    //        const { cbTypeCode, cbName, cbPer } = item;

    //        // 해당 분류에 대한 객체가 없으면 생성
    //        if (!formattedData[cbTypeCode]) {
    //            formattedData[cbTypeCode] = {};
    //        }

    //        // 해당 분류, 원가명에 대한 값 설정
    //        formattedData[cbTypeCode][cbName] = cbPer;
    //    });

    //    // 분류와 열 헤더를 포함한 결과 데이터
    //    const resultData = Object.entries(formattedData).map(([cbTypeCode, cbName, cbPer, rowData]) => {
    //        return {
    //            cbTypeCode,
    //            cbName,
    //            cbPer,
    //            ...rowData,
    //        };
    //    });

    //    console.log(resultData); // 포맷된 데이터 확인
    //    return resultData;
    //};

    const reorganizeData = (data) => {
        // reduce 함수를 사용하여 데이터 배열을 순회하면서 재구성된 결과를 구축합니다.
        return data.reduce((acc, item) => {
            // 현재 아이템에서 속성들을 비구조화하여 가져옵니다.
            const { cbName, cbTypeCode, cbId, cbPer } = item;

            // gupBaseDate 배열에서 연도를 추출합니다.
            const name = cbName;

            // 찾은 데이터의 인덱스
            // cbName 기반으로 누적 배열에서 그룹의 인덱스를 찾습니다.
            const foundIndex = acc.findIndex((group) => group && group.cbName === cbName);
            const roleKey = `cbPer${roleMapping[cbTypeCode]}`;

            // 해당하는 그룹이 없을 경우 새로운 그룹 생성
            // 동일한 cbName를 가진 그룹이 존재하는지 확인합니다.
            if (foundIndex === -1) {
                // 그룹이 존재하지 않으면 새로운 그룹을 생성하고 누적 배열에 추가합니다.
                acc.push({ cbName, name, [roleKey]: Number(cbPer), cbId: [cbId] });
            } else {
                // 그룹이 이미 존재하면 데이터를 기존 그룹에 추가합니다.
                acc[foundIndex][`cbPer${roleMapping[cbTypeCode]}`] = Number(cbPer);
                acc[foundIndex].cbId.push(cbId);
            }

            return acc;
        }, []);
    };

    const innerPageName = "사전원가지표";
    return (
        <>
            <ApprovalForm projectNone={true} />
            <Location pathList={locationPath.CostIndex} />
            <ReactDataTable
                columns={columns}
                customDatas={tableData}
                //suffixUrl="/baseInfrm/product/costBase"
                tableRef={costIndexMgmtTable}
                viewPageName="사전원가지표"
                perSent="%"
            />
        </>
    );
}

export default CostIndex;
