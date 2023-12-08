import React, { useContext, useRef, useState } from "react";
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

    const addColumns = [
        { header: "프로젝트이름", col: "poiNm", cellWidth: "25%", type: "input", enable: true, modify: true, add: true, require: true },
        { header: "PJ코드(임시필수)", col: "poiCode", cellWidth: "25%", type: "input", enable: true, modify: true, add: true, require: true },
        //{ header: "고객사", col: "cltNm", cellWidth: "15%", type: "buttonCompany", enable: true, modify: true, add: true, require: true },
        { header: "수주부서", col: "poiGroupId", cellWidth: "7%", type: "input", enable: true, modify: true, add: true, require: true },
        { header: "매출부서", col: "poiSalesGroupId", cellWidth: "7%", type: "input", enable: true, modify: true, add: true, require: true },
        { header: "영업대표", col: "poiSalmanagerId", cellWidth: "10%", type: "input", enable: true, modify: true, add: true, require: true },
        { header: "PM", col: "poiManagerId", cellWidth: "10%", type: "input", enable: true, modify: true, add: true, require: true },
        { header: "통화", col: "poiCurrcy", cellWidth: "5%", type: "input", enable: true, modify: true, add: true, require: false },
        { header: "계약일", col: "poiBeginDt", cellWidth: "10%", type: "datepicker", enable: true, modify: true, add: true, require: false },
        { header: "납기시작일", col: "poiDueBeginDt", cellWidth: "10%", type: "datepicker", enable: true, modify: true, add: true, require: false },
        { header: "납기종료일", col: "poiDueEndDt", cellWidth: "10%", type: "datepicker", enable: true, modify: true, add: true, require: false },
        { header: "기준이익률", col: "standardMargin", cellWidth: "8%", type: "input", enable: true, modify: true, add: true, require: false },
        {
            header: "상태",
            col: "poiStatus",
            cellWidth: "10%",
            type: "input",
            itemType: ["상태를 선택해 주세요", "인벤토리접수", "원가작성중", "견적완료", "계약완료"],
            itemTypeSymbol: ["", "인벤토리접수", "원가작성중", "견적완료", "계약완료"],
            enable: true,
            modify: true,
            add: true,
            require: true,
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
                viewPageName="수주등록관리"
                saveIdNm={saveIdNm}
            />
            {isOpenAdd && <AddModal width="300" height="500" columns={addColumns} sendData={addToServer} onClose={() => setIsOpenAdd(false)} />}
            {isOpenAdd && <AddModal width="300" height="500" columns={addColumns} sendData={modifyToServer} onClose={() => setIsOpenUpDate(false)} />}
            {/*<DeleteModal viewName={poiNm} onConfirm={deleteToServer} />*/}
        </>
    );
}

export default OrderMgmt;
