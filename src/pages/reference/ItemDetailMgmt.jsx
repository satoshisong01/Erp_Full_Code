import React, { useContext, useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import { locationPath } from "constants/locationPath";
import AddButton from "components/button/AddButton";
import ModButton from "components/button/ModButton";
import DelButton from "components/button/DelButton";
import RefreshButton from "components/button/RefreshButton";
import ReactDataTable from "components/DataTable/ReactDataTable";
import { PageContext } from "components/PageProvider";
import { axiosDelete, axiosFetch, axiosPost, axiosUpdate } from "api/axiosFetch";
import { columns } from "constants/columns";
import AddModModal from "components/modal/AddModModal";
import DeleteModal from "components/modal/DeleteModal";

/** 기준정보관리-품목관리-품목상세관리 */
function ItemDetailMgmt() {
    const { setNameOfButton } = useContext(PageContext);
    const [selectedRows, setSelectedRows] = useState([]); //그리드에서 선택된 row 데이터
    const itemGroupMgmtTable = useRef(null);
    const [isOpenAdd, setIsOpenAdd] = useState(false);
    const [isOpenMod, setIsOpenMod] = useState(false);
    const [isOpenDel, setIsOpenDel] = useState(false);
    const [deleteNames, setDeleteNames] = useState([]); //삭제할 Name 목록
    const [tableData, setTableData] = useState([]);

    const itemDetailMgmtTable = useRef(null);

    useEffect(() => {
        // console.log(selectedRows);
        selectedRows && setDeleteNames(selectedRows.map((row) => row.pgNm));
    }, [selectedRows]);

    useEffect(() => {
        fetchAllData();
    }, []);

    const refresh = () => {
        fetchAllData();
    };

    const addToServer = async (addData) => {
        console.log("💜 addToServer:", addData);
        const url = `/api/baseInfrm/product/productInfo/add.do`;
        const dataToSend = {
            ...addData,
            lockAt: "Y",
            useAt: "Y",
            deleteAt: "N",
        };
        const resultData = await axiosPost(url, dataToSend);
        console.log(resultData);
        if (resultData) {
            alert("추가되었습니다");
            refresh();
        } else {
            alert("error!");
        }
    };

    const modifyToServer = async (updatedData) => {
        console.log("💜 modifyToServer:", updatedData);
        if (updatedData.length === 0) {
            alert("수정할 항목을 선택하세요.");
            return;
        }

        const url = `/api/baseInfrm/product/productInfo/edit.do`;
        const updated = { ...updatedData, lockAt: "Y", useAt: "Y" };
        console.log(updated, "수정");
        const resultData = await axiosUpdate(url, updated);
        console.log(resultData);
        if (resultData) {
            alert("수정되었습니다");
            refresh();
        } else {
            alert("error!!수정");
        }
    };

    const deleteToServer = async (value) => {
        if (value === "임시삭제") {
            /* 임시삭제 코드 구현 */
        } else if (value === "영구삭제") {
            const poiNms = selectedRows.map((row) => row.pgId);
            const url = `/api/baseInfrm/product/productInfo/removeAll.do`;
            const resultData = await axiosDelete(url, poiNms);
            if (resultData) {
                alert(`선택한 항목들이 삭제되었습니다.`);
                refresh();
            } else {
                alert("삭제 중 에러가 발생했습니다.");
            }
        }
    };

    const fetchAllData = async () => {
        const url = `/api/baseInfrm/product/productInfo/totalListAll.do`;
        const resultData = await axiosFetch(url, {});
        setTableData(resultData);
    };

    const conditionList = [
        {
            title: "품목그룹명",
            colName: "pgNm",
            type: "input",
            value: "",
            searchLevel: "1",
        },
        {
            title: "품목명",
            colName: "pdiNm", //컬럼명
            type: "input",
            value: "",
            searchLevel: "2",
        },
        {
            title: "제조사",
            colName: "pdiMenufut", //컬럼명
            type: "input",
            value: "",
            searchLevel: "3",
        },
        {
            title: "판매사",
            colName: "pdiSeller", //컬럼명
            type: "input",
            value: "",
            searchLevel: "3",
        },
    ];

    const [length, setLength] = useState(0);
    const setLengthSelectRow = (length) => {
        setLength(length);
    };
    return (
        <>
            <Location pathList={locationPath.ItemDetailMgmt} />
            <SearchList conditionList={conditionList} />
            <div className="table-buttons">
                <AddButton label={"추가"} onClick={() => setIsOpenAdd(true)} />
                <ModButton label={"수정"} onClick={() => setIsOpenMod(true)} />
                <DelButton label={"삭제"} onClick={() => setIsOpenDel(true)} />
                <RefreshButton onClick={() => setNameOfButton("refresh")} />
            </div>
            <ReactDataTable
                //beforeItem={pdIdArray}
                columns={columns.reference.itemDetailMgmt}
                customDatas={tableData}
                tableRef={itemDetailMgmtTable}
                //setLengthSelectRow={setLengthSelectRow}
                returnSelectRows={(data) => {
                    setSelectedRows(data);
                }}
                viewPageName={{ name: "품목상세관리", id: "ItemDetailMgmt" }}
            />
            {isOpenAdd && (
                <AddModModal
                    width={500}
                    height={380}
                    list={columns.reference.groupDetailAddMod}
                    resultData={addToServer}
                    onClose={() => setIsOpenAdd(false)}
                    title="품목상세 추가"
                />
            )}
            {isOpenMod && (
                <AddModModal
                    width={500}
                    height={120}
                    list={columns.reference.groupDetailModifyMod}
                    initialData={selectedRows}
                    resultData={modifyToServer}
                    onClose={() => setIsOpenMod(false)}
                    title="품목상세 수정"
                />
            )}
            {isOpenDel && <DeleteModal initialData={deleteNames} resultData={deleteToServer} onClose={() => setIsOpenDel(false)} isOpen={isOpenDel} />}
        </>
    );
}

export default ItemDetailMgmt;
