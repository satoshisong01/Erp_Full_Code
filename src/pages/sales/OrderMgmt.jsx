import React, { useContext, useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import SearchList from "components/SearchList";
import ReactDataTable from "components/DataTable/ReactDataTable";
import { PageContext } from "components/PageProvider";
import { locationPath } from "constants/locationPath";
import RefreshButton from "components/button/RefreshButton";
import DelButton from "components/button/DelButton";
import ModButton from "components/button/ModButton";
import AddButton from "components/button/AddButton";
import PopupButton from "components/button/PopupButton";
import URL from "constants/url";
import { axiosDelete, axiosFetch, axiosPost, axiosUpdate } from "api/axiosFetch";
import DeleteModal from "components/modal/DeleteModal";
import { columns } from "constants/columns";
import HideCard from "components/HideCard";
import AddModModal from "components/modal/AddModModal";

/** 영업관리-수주등록관리 */
function OrderMgmt() {
    const { projectInfo } = useContext(PageContext);
    const orderMgmtTable = useRef(null);
    const [isOpenAdd, setIsOpenAdd] = useState(false);
    const [isOpenUpDate, setIsOpenUpDate] = useState(false);
    const [isOpenDel, setIsOpenDel] = useState(false);

    const [sendDataTable, setSendDataTable] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]); //그리드에서 선택된 row 데이터

    //임시 삭제 할 id,명
    const [poiId, setPoiId] = useState([]);
    const [poiNm, setPoiNm] = useState([]);
    const [modData, setModData] = useState({});

    const saveIdNm = (poiId, poiNm) => {
        console.log(poiId, poiNm);
        setPoiId(poiId);
        setPoiNm(poiNm);
    };

    const getSelectedRow = (data) => {
        // sendList가 변경되었을 때만 업데이트
        if (!objectsAreEqual(modData, data)) {
            setModData(data);
            console.log(data);
        }
    };

    function objectsAreEqual(obj1, obj2) {
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        if (keys1.length !== keys2.length) {
            return false;
        }

        for (let key of keys1) {
            if (obj1[key] !== obj2[key]) {
                return false;
            }
        }

        return true;
    }

    const addToServer = async (addData) => {
        console.log(addData);
        const url = `/api/baseInfrm/product/pjOrdrInfo/add.do`;
        const dataToSend = {
            ...addData,
            lockAt: "Y",
            useAt: "Y",
            deleteAt: "N",
            poiId: projectInfo.poiId,
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
        const url = `/api/baseInfrm/product/pjOrdrInfo/edit.do`;
        const updated = { ...updatedData, lockAt: "Y", useAt: "Y" };
        const resultData = await axiosUpdate(url, updated);
        console.log(resultData);
        if (resultData) {
            alert("수정되었습니다");
            refresh();
        } else {
            alert("error!!");
        }
    };
    const deleteToServer = async () => {
        // 확인 대화상자 표시
        const shouldDelete = window.confirm(`🔥${poiNm}🔥 프로젝트를 정말로 삭제하시겠습니까?`);
        if (shouldDelete) {
            // 사용자가 "확인"을 클릭하면 삭제 진행
            const url = `/api/baseInfrm/product/pjOrdrInfo/removeAll.do`;
            const resultData = await axiosDelete(url, poiId);

            // 필요한 경우 결과 처리
            if (resultData) {
                alert(`${poiNm}이(가) 삭제되었습니다.`);
                // 성공적인 삭제 후 추가 작업 수행
                refresh();
            } else {
                alert(`${poiNm} 삭제 중 오류가 발생했습니다.`);
            }
        } else {
            // 사용자가 "취소"를 클릭하면 아무 작업도 수행하지 않음
            alert(`${poiNm} 삭제가 취소되었습니다.`);
        }
    };

    const refresh = () => {
        fetchAllData();
    };

    const fetchAllData = async (value) => {
        console.log(value, "@@@");
        const url = `/api/baseInfrm/product/pjOrdrInfo/totalListAll.do`;
        const requestData = value ? { ...value, useAt: "Y" } : { useAt: "Y" };
        const resultData = await axiosFetch(url, requestData);
        console.log(resultData, "resultData");
        setSendDataTable(resultData);
    };

    const onSearch = (value) => {
        fetchAllData(value);
        console.log("서치데이터: ", value);
    };

    useEffect(() => {
        console.log("💜selectedRows:", selectedRows);
    }, [selectedRows]);

    return (
        <>
            <Location pathList={locationPath.OrderMgmt} />
            <SearchList conditionList={columns.orderMgmt.condition} onSearch={onSearch} />
            <HideCard title="프로젝트 목록" color="back-lightblue" className="mg-b-40">
                <div className="table-buttons mg-b-m-50">
                    {/* <PopupButton targetUrl={URL.LaborPreCostDoc} data={{ label: "사전원가서", projectInfo }} /> */}
                    <AddButton label={"추가"} onClick={() => setIsOpenAdd(true)} />
                    <ModButton label={"수정"} onClick={() => setIsOpenUpDate(true)} />
                    <DelButton label={"삭제"} onClick={deleteToServer} />
                    <RefreshButton onClick={refresh} />
                </div>
                <ReactDataTable
                    columns={columns.orderMgmt.project}
                    customDatas={sendDataTable}
                    suffixUrl="/baseInfrm/product/pjOrdrInfo"
                    tableRef={orderMgmtTable}
                    viewPageName="프로젝트관리"
                    saveIdNm={saveIdNm}
                    sendSelected={(data) => {
                        setSelectedRows(data);
                    }}
                />
            </HideCard>
            {isOpenAdd && (
                <AddModModal
                    width={500}
                    height={400}
                    list={columns.orderMgmt.addMod}
                    sendData={addToServer}
                    onClose={() => setIsOpenAdd(false)}
                    title="프로젝트 추가"
                />
            )}
            {isOpenUpDate && (
                <AddModModal
                    width={500}
                    height={400}
                    list={columns.orderMgmt.addMod}
                    initialData={selectedRows}
                    resultData={modifyToServer}
                    onClose={() => setIsOpenUpDate(false)}
                    title="프로젝트 수정"
                />
            )}
            {/*<DeleteModal viewName={poiNm} onConfirm={deleteToServer} />*/}
        </>
    );
}

export default OrderMgmt;
