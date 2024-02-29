import React, { useContext, useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import { locationPath } from "constants/locationPath";
import { axiosDelete, axiosFetch, axiosPost, axiosUpdate } from "api/axiosFetch";
import ReactDataTable from "components/DataTable/ReactDataTable";
import { PageContext } from "components/PageProvider";
import { ReorganizeManCost } from "components/DataTable/function/ReorganizeData";

/** 기준정보관리-원가기준관리-급별단가(인건비) */
function GradeWageLaborCost() {
    const [tableData, setTableData] = useState([]);
    const gradeWageExpenseTable = useRef(null);
    const [isLoading, setIsLoading] = useState(true); //로딩화면(true 일때 로딩화면)

    const { innerPageName, setInnerPageName } = useContext(PageContext);
    useEffect(() => {
        fetchData();
        fetchAllData();
        setInnerPageName("급별단가(인건비)");
    }, []);

    const columns = [
        { header: "단가ID", col: "gupId", cellWidth: "0", type: "input", notView: true },
        { header: "기준연도", col: "year", cellWidth: "104", type: "input" },
        // { header: "단위", col: "gupUnit", cellWidth: "100", type: "input" },
        // { header: "기준명", col: "gupDesc", cellWidth: "100", type: "input" },
        { header: "임원", col: "gupPrice1", cellWidth: "100", type: "input" },
        { header: "부장", col: "gupPrice9", cellWidth: "100", type: "input" },
        { header: "차장", col: "gupPrice10", cellWidth: "100", type: "input" },
        { header: "과장", col: "gupPrice11", cellWidth: "100", type: "input" },
        { header: "대리", col: "gupPrice12", cellWidth: "100", type: "input" },
        { header: "주임", col: "gupPrice13", cellWidth: "100", type: "input" },
        { header: "사원", col: "gupPrice14", cellWidth: "100", type: "input" },
        { header: "특급기술사", col: "gupPrice2", cellWidth: "82", type: "input" },
        { header: "고급기술사", col: "gupPrice3", cellWidth: "82", type: "input" },
        { header: "중급기술사", col: "gupPrice4", cellWidth: "82", type: "input" },
        { header: "초급기술사", col: "gupPrice5", cellWidth: "82", type: "input" },
        { header: "고급기능사", col: "gupPrice6", cellWidth: "82", type: "input" },
        { header: "중급기능사", col: "gupPrice7", cellWidth: "82", type: "input" },
        { header: "초급기능사", col: "gupPrice8", cellWidth: "82", type: "input" },
    ];

    const fetchAllData = async () => {
        setIsLoading(true);
        const url = `/api/baseInfrm/product/gradeunitPrice/type/p/listAll.do`;
        const requestData = { useAt: "Y" };
        const resultData = await axiosFetch(url, requestData);
        console.log(resultData, "resultData");
        setTableData(ReorganizeManCost(resultData));
        setIsLoading(false);
    };

    useEffect(() => {
        console.log(tableData, "tableData");
    }, [tableData]);

    const [gradeCost, setGradeCost] = useState([]); //급별단가(인건비)

    console.log(gradeCost, "gradeCost");
    const fetchData = async () => {
        try {
            if (innerPageName === "급별단가(인건비)") {
                const datas = await fetchAllData("/api/baseInfrm/product/gradeunitPrice/totalListAll.do", innerPageName); // 인건비 조회관리
                setGradeCost(datas);
            }
        } catch (error) {
            console.error("데이터를 가져오는 중에 오류 발생:", error);
        }
    };

    const compareData = (originData, updatedData) => {
        const filterData = updatedData.filter((data) => data.gupDesc); //gupDesc 없는 데이터 제외
        const originDataLength = originData ? originData.length : 0;
        const updatedDataLength = filterData ? filterData.length : 0;

        if (originDataLength > updatedDataLength) {
            const updateDataInOrigin = (originData, updatedData) => {
                // 복제하여 새로운 배열 생성
                const updatedArray = [...originData];
                // updatedData의 길이만큼 반복하여 originData 갱신
                for (let i = 0; i < Math.min(updatedData.length, originData.length); i++) {
                    const updatedItem = updatedData[i];
                    updatedArray[i] = { ...updatedItem, gupId: updatedArray[i].gupId };
                }
                return updatedArray;
            };

            const firstRowUpdate = updateDataInOrigin(originData, updatedData);
            updateItemArray(firstRowUpdate);

            const toDelete = [];
            for (let i = updatedDataLength; i < originDataLength; i++) {
                toDelete.push(originData[i].gupId);
            }
            deleteItem(toDelete);
        } else if (originDataLength === updatedDataLength) {
            updateItemArray(filterData);
        } else if (originDataLength < updatedDataLength) {
            const toAdds = [];
            const addUpdate = [];
            for (let i = 0; i < originDataLength; i++) {
                addUpdate.push(filterData[i]);
            }
            updateItemArray(addUpdate);

            for (let i = originDataLength; i < updatedDataLength; i++) {
                const toAdd = { ...filterData[i] };
                toAdd.useAt = "Y";
                toAdd.deleteAt = "N";
                toAdd.gupType = "P";

                for (let j = 1; j <= 14; j++) {
                    if (toAdd[`gupPrice${j}`] === null) {
                        toAdd[`gupPrice${j}`] = 0;
                    }
                }

                toAdds.push(toAdd);
            }
            addItemArray(toAdds);
        }
    };

    const addItemArray = async (addData) => {
        console.log(addData, "추가들어오려는값");
        const url = `/api/baseInfrm/product/gradeunitPrice/addList.do`;
        const resultData = await axiosPost(url, addData);
        console.log(resultData, "더해진 배열 맞음?");
        if (resultData) {
            refresh();
        }
    };

    const updateItemArray = async (toUpdate) => {
        console.log(toUpdate);
        const dataArray = generateUpdateObjects(toUpdate);
        console.log(dataArray, "dataArray🔥🔥🔥");
        const url = `/api/baseInfrm/product/gradeunitPrice/editList.do`;
        console.log(toUpdate, "변경되는 값?");
        const resultData = await axiosUpdate(url, dataArray);
        console.log(resultData, "변경된거 맞음?");

        if (resultData) {
            refresh();
        }
    };

    const deleteItem = async (removeItem) => {
        console.log(removeItem);
        const url = `/api/baseInfrm/product/gradeunitPrice/removeAll.do`;
        const resultData = await axiosDelete(url, removeItem);
        console.log(resultData, "지워진거맞음?");

        if (resultData) {
            refresh();
        }
    };

    const refresh = () => {
        fetchData();
    };

    const generateUpdateObjects = (updatedData) => {
        let updates = [];

        updatedData.forEach((upItem) => {
            const { gupId } = upItem; // id 배열
            const colNames = Object.keys(upItem).filter((key) => key.startsWith("gupPrice")); // 경비종류 배열
            console.log(gupId, colNames);
            if (gupId && colNames && gupId.length > 0 && colNames.length > 0 && gupId.length === colNames.length) {
                colNames.forEach((name, index) => {
                    const dataSet = {
                        gupDesc: upItem.gupDesc,
                        gupId: gupId[index],
                        gupPrice: upItem[name],
                        gupType: upItem.gupType,
                    };

                    updates.push(dataSet);
                });
            }
        });
        console.log(updates, "변경되고난후 값 배열안 객체여야함");
        return updates;
    };

    return (
        <>
            {isLoading ? (
                // 로딩 화면을 보여줄 JSX
                <div className="Loading">
                    <div className="spinner"></div>
                    <div> Loading... </div>
                </div>
            ) : (
                <div>
                    <Location pathList={locationPath.GradeWageLaborCost} />
                    <ReactDataTable
                        columns={columns}
                        customDatas={tableData}
                        sendToParentGrade={compareData}
                        //suffixUrl="/api/baseInfrm/product/gradeunitPrice/type/p"
                        tableRef={gradeWageExpenseTable}
                        //setLengthSelectRow={setLengthSelectRow}
                        viewPageName={{ name: "급별단가(인건비)", id: "GradeWageLaborCost" }}
                    />
                </div>
            )}
        </>
    );
}

export default GradeWageLaborCost;
