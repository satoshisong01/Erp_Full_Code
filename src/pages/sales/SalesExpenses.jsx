import React, { useContext, useEffect, useRef, useState } from "react";
import Location from "components/Location/Location";
import { locationPath } from "constants/locationPath";
import { axiosDelete, axiosFetch, axiosPost, axiosUpdate } from "api/axiosFetch";
import { PageContext } from "components/PageProvider";
import ReactDataTableURL from "components/DataTable/ReactDataTableURL";
import ApprovalFormExe from "components/form/ApprovalFormExe";
import HideCard from "components/HideCard";
import AddButton from "components/button/AddButton";
import ModButton from "components/button/ModButton";
import DelButton from "components/button/DelButton";
import RefreshButton from "components/button/RefreshButton";
import DeleteModal from "components/modal/DeleteModal";
import AddModModal from "components/modal/AddModModal";

/** 영업관리-영업비(정산) */
function SalesExpenses() {
    const { isSaveFormTable, projectInfo, setProjectInfo } = useContext(PageContext);
    const [isOpenAdd, setIsOpenAdd] = useState(false);
    const [isOpenMod, setIsOpenMod] = useState(false);
    const [isOpenDel, setIsOpenDel] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]); //그리드에서 선택된 row 데이터
    const [deleteNames, setDeleteNames] = useState([]); //삭제할 Name 목록


    useState(() => {
        return(() =>  { //초기화
            // setProjectInfo({});
        })
    }, [])

    useEffect(() => {
        console.log(selectedRows);
        selectedRows && setDeleteNames(selectedRows.map((row) => row.poiNm));
    }, [selectedRows]);

    const [salesCost, setSalesCost] = useState([]);

    const totalColumns = [
        {
            header: "총 영업비",
            col: "totalPrice",
            cellWidth: "100%"
        },
    ];

    const columns = [
        {
            header: "영업비 내역",
            col: "poiDesc",
            cellWidth: "70%",
            updating: true,
            write: true,
            type: "input",
        },
        {
            header: "금액",
            col: "pjbgPrice",
            cellWidth: "30%",
            updating: true,
            write: true,
            type: "input",
        },
    ];

    const [currentTask, setCurrentTask] = useState("영업비용");

    const addBtn = [""];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchAllData("/cost/costPrmnPlan"); // 인건비
                setSalesCost(formatDate(data));
                console.log(data, "불러온 영업비용 값은?");
            } catch (error) {
                console.error("데이터를 가져오는 중에 오류 발생:", error);
            }
        };

        fetchData(); // fetchData 함수를 호출하여 데이터를 가져옵니다.
    }, [projectInfo.poiId]);

    const fetchAllData = async () => {
        try {
            const url = `/api/baseInfrm/product/pjbudget/totalListAll.do`;

            const requestData = {
                useAt: "Y",
                deleteAt: "N",
                searchCondition: "0",
                searchKeyword: "",
                poiId: projectInfo.poiId,
                modeCode: "SLSP",
                pjbgTypeCode: "EXPNS06",
            };
            const resultData = await axiosFetch(url, requestData);
            console.log(resultData, "불러온값💥💥💥💥💥💥");
            if (resultData) {
                return resultData;
            }
        } catch {
        } finally {
        }
    };
    function formatDate(dataArray) {
        if (Array.isArray(dataArray)) {
            return dataArray.map((data) => {
                // 해당 객체의 sgnReceivedate 및 sgnSigndate 값을 변경
                if (data.pjbgBeginDt && data.pjbgBeginDt.length >= 3) {
                    const year = data.pjbgBeginDt[0];
                    const month = data.pjbgBeginDt[1];
                    const day = data.pjbgBeginDt[2];
                    data.pjbgBeginDt = `${year}-${month}-${day}`;
                } else {
                    data.pjbgBeginDt = ""; // 유효하지 않은 데이터 처리
                }

                return data;
            });
        } else {
            return dataArray;
        }
    }

    const refresh = () => {
        fetchAllData();
    };

    const addToServer = async (addData) => {
        console.log("💜 addToServer:", addData);
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
        console.log("💜 modifyToServer:", updatedData);
        if (updatedData.length === 0) {
            alert("수정할 항목을 선택하세요.");
            return;
        }

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

    const deleteToServer = async (value) => {
        if (value === "임시삭제") {
            /* 임시삭제 코드 구현 */
        } else if (value === "영구삭제") {
            const poiNms = selectedRows.map((row) => row.poiId);
            const url = `/api/baseInfrm/product/pjOrdrInfo/removeAll.do`;
            const resultData = await axiosDelete(url, poiNms);
            if (resultData) {
                alert(`선택한 항목들이 삭제되었습니다.`);
                refresh();
            } else {
                alert("삭제 중 에러가 발생했습니다.");
            }
        }
    };

    return (
        <>
            <Location pathList={locationPath.SalesExpenses} />
            <ApprovalFormExe />
            <HideCard title="합계" color="back-lightyellow" className="mg-b-40">
                {/* <ReactDataTableURL columns={totalColumns} flag={isSaveFormTable} customDatas={salesCost} /> */}
                <ReactDataTableURL
                    columns={totalColumns}
                    customDatas={salesCost}
                    viewPageName="영업비(정산)합계"
                    hideCheckBox={true}
                />
            </HideCard>
            <HideCard title="등록/수정" color="back-lightblue">
                <div className="table-buttons mg-b-m-30">
                    {/* <AddButton label={"추가"} onClick={() => setIsOpenAdd(true)} />
                    <ModButton label={"수정"} onClick={() => setIsOpenMod(true)} />
                    <DelButton label={"삭제"} onClick={() => setIsOpenDel(true)} /> */}
                    <RefreshButton onClick={refresh} />
                </div>
                <ReactDataTableURL
                    editing={true}
                    columns={columns}
                    customDatas={salesCost}
                    viewPageName="영업비(정산)"
                    returnSelectRows={(data) => {
                        setSelectedRows(data);
                    }}
                />
            </HideCard>
            {isOpenAdd && (
                <AddModModal
                    width={500}
                    height={420}
                    list={columns.orderMgmt.addMod}
                    sendData={addToServer}
                    onClose={() => setIsOpenAdd(false)}
                    title="프로젝트 추가"
                />
            )}
            {isOpenMod && (
                <AddModModal
                    width={500}
                    height={420}
                    list={columns.orderMgmt.addMod}
                    initialData={selectedRows}
                    resultData={modifyToServer}
                    onClose={() => setIsOpenMod(false)}
                    title="프로젝트 수정"
                />
            )}
            {isOpenDel && <DeleteModal initialData={deleteNames} resultData={deleteToServer} onClose={() => setIsOpenDel(false)} isOpen={isOpenDel} />}
        </>
    );
}

export default SalesExpenses;
