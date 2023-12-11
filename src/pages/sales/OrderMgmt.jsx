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
import AddModal from "components/modal/AddModal";
import { axiosDelete, axiosFetch, axiosPost, axiosUpdate } from "api/axiosFetch";
import DeleteModal from "components/modal/DeleteModal";

/** 영업관리-수주등록관리 */
function OrderMgmt() {
    const { projectInfo } = useContext(PageContext);
    const orderMgmtTable = useRef(null);
    const [isOpenAdd, setIsOpenAdd] = useState(false);
    const [isOpenUpDate, setIsOpenUpDate] = useState(false);
    const [isOpenDel, setIsOpenDel] = useState(false);

    const [sendDataTable, setSendDataTable] = useState([]);

    //임시 삭제 할 id,명
    const [poiId, setPoiId] = useState([]);
    const [poiNm, setPoiNm] = useState([]);
    const [sendList, setSendList] = useState({});

    const addColumns = [
        { items: [{ header: "프로젝트이름", col: "poiNm", require: true, type: "input" }] },
        { items: [{ header: "코드(임시)", col: "poiCode", require: true, type: "input" }] },
        {
            items: [
                {
                    header: "수주부서",
                    col: "poiGroupId",
                    placeholder: "부서를 선택하세요.",
                    require: true,
                    type: "itemSelect",
                    itemType: ["부서를 선택해 주세요", "PS", "PA"],
                    itemTypeSymbol: ["", "PS", "PA"],
                },
                {
                    header: "매출부서",
                    col: "poiSalesGroupId",
                    placeholder: "부서를 선택하세요.",
                    require: true,
                    type: "itemSelect",
                    itemType: ["부서를 선택해 주세요", "PS", "PA"],
                    itemTypeSymbol: ["", "PS", "PA"],
                },
            ],
        },
        {
            items: [
                { header: "영업대표", col: "poiSalmanagerId", placeholder: "영업대표를 선택하세요.", require: true, type: "input" },
                { header: "담당자", col: "poiManagerId", placeholder: "담당자를 선택하세요.", require: true, type: "input" },
            ],
        },
        {
            items: [
                { header: "계약일", col: "poiBeginDt", type: "daypicker" },
                { header: "기준이익률", col: "standardMargin", type: "input" },
            ],
        },
        {
            items: [
                { header: "납기시작일", col: "poiDueBeginDt", type: "daypicker" },
                { header: "납기종료일", col: "poiDueEndDt", type: "daypicker" },
            ],
        },
        {
            items: [
                { header: "통화", col: "poiCurrcy", type: "input" },
                {
                    header: "상태",
                    col: "poiStatus",
                    cellWidth: "10%",
                    type: "itemSelect",
                    itemType: ["상태를 선택해 주세요", "인벤토리접수", "원가작성중", "견적완료", "계약완료"],
                    itemTypeSymbol: ["", "인벤토리접수", "원가작성중", "견적완료", "계약완료"],
                    enable: true,
                    modify: true,
                    add: true,
                    require: true,
                },
            ],
        },
        {
            items: [
                { header: "기준연도", col: "poiMonth", require: true, type: "input" },
                { header: "고객사", col: "cltNm", placeholder: "고객사를 선택하세요.", require: true, type: "buttonCompany" },
            ],
        },
    ];

    const columns = [
        { header: "수주 아이디", col: "poiId", cellWidth: "5%", type: "input", enable: true, modify: false, add: false, require: true, notView: true },
        { header: "프로젝트이름", col: "poiNm", cellWidth: "25%", type: "input", enable: true, modify: true, add: true, require: true },
        { header: "고객사", col: "cltNm", cellWidth: "15%", type: "input", enable: true, modify: true, add: false, require: false },
        { header: "수주부서", col: "poiGroupId", cellWidth: "7%", type: "input", enable: true, modify: true, add: true, require: false },
        { header: "매출부서", col: "poiSalesGroupId", cellWidth: "7%", type: "input", enable: true, modify: true, add: true, require: false },
        { header: "영업대표", col: "poiSalmanagerId", cellWidth: "10%", type: "input", enable: true, modify: true, add: true, require: false },
        { header: "PM", col: "poiManagerId", cellWidth: "10%", type: "input", enable: true, modify: true, add: true, require: false },
        { header: "통화", col: "poiCurrcy", cellWidth: "5%", type: "input", enable: true, modify: true, add: true, require: false },
        { header: "계약일", col: "poiBeginDt", cellWidth: "10%", type: "input", enable: true, modify: true, add: true, require: false },
        { header: "납기시작일", col: "poiDueBeginDt", cellWidth: "10%", type: "input", enable: true, modify: true, add: true, require: false },
        { header: "납기종료일", col: "poiDueEndDt", cellWidth: "10%", type: "input", enable: true, modify: true, add: true, require: false },
        { header: "기준이익률", col: "standardMargin", cellWidth: "8%", type: "input", enable: true, modify: true, add: true, require: false },
        { header: "상태", col: "poiStatus", cellWidth: "10%", type: "input", enable: true, modify: true, add: true, require: false },
    ];

    const conditionList = [
        {
            title: "프로젝트명",
            colName: "poiNm",
            type: "input",
            value: "",
        },
        {
            title: "영업대표",
            colName: "poiSalmanagerId",
            type: "input",
            value: "",
        },
        {
            title: "담당자",
            colName: "poiManagerId",
            type: "input",
            value: "",
        },
        {
            title: "상태",
            colName: "poiStatus",
            type: "input",
            value: "",
        },
        {
            title: "계약일",
            colName: "poiBeginDt",
            type: "input",
            value: "",
        },
    ];

    const saveIdNm = (poiId, poiNm) => {
        console.log(poiId, poiNm);
        setPoiId(poiId);
        setPoiNm(poiNm);
    };

    const returnData = (data) => {
        // sendList가 변경되었을 때만 업데이트
        if (!objectsAreEqual(sendList, data)) {
            setSendList(data);
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

    const fetchAllData = async () => {
        const url = `/api/baseInfrm/product/pjOrdrInfo/totalListAll.do`;
        const resultData = await axiosFetch(url, { useAt: "Y" });
        console.log(resultData, "resultData");
        setSendDataTable(resultData);
    };

    return (
        <>
            <Location pathList={locationPath.OrderMgmt} />
            <SearchList conditionList={conditionList} />
            <div className="table-buttons">
                <PopupButton targetUrl={URL.LaborPreCostDoc} data={{ label: "사전원가서", projectInfo }} />
                <AddButton label={"추가"} onClick={() => setIsOpenAdd(true)} />
                <ModButton label={"수정"} onClick={() => setIsOpenUpDate(true)} />
                <DelButton label={"삭제"} onClick={deleteToServer} />
                <RefreshButton onClick={refresh} />
            </div>
            <ReactDataTable
                columns={columns}
                sendData={sendDataTable}
                suffixUrl="/baseInfrm/product/pjOrdrInfo"
                tableRef={orderMgmtTable}
                viewPageName="프로젝트관리"
                saveIdNm={saveIdNm}
                sendSelected={returnData}
            />
            {isOpenAdd && (
                <AddModal width={500} height={400} list={addColumns} sendData={addToServer} onClose={() => setIsOpenAdd(false)} title="프로젝트 추가" />
            )}
            {isOpenUpDate && (
                <AddModal
                    width={500}
                    height={400}
                    list={addColumns}
                    sendList={sendList}
                    sendData={modifyToServer}
                    onClose={() => setIsOpenUpDate(false)}
                    title="프로젝트 수정"
                />
            )}
            {/*<DeleteModal viewName={poiNm} onConfirm={deleteToServer} />*/}
        </>
    );
}

export default OrderMgmt;
