import React, { useContext, useEffect, useState } from "react";
import Location from "components/Location/Location";
import { locationPath } from "constants/locationPath";
import { PageContext } from "components/PageProvider";
import ApprovalFormSal from "components/form/ApprovalFormSal";
import HideCard from "components/HideCard";
import RefreshButton from "components/button/RefreshButton";
import ReactDataTableURL from "components/DataTable/ReactDataTableURL";
import { columns } from "constants/columns";
import SaveButton from "components/button/SaveButton";
import AddButton from "components/button/AddButton";
import DelButton from "components/button/DelButton";
import ReactDataTable from "components/DataTable/ReactDataTable";
import { axiosDelete, axiosFetch, axiosPost, axiosUpdate } from "api/axiosFetch";
import SearchModal from "components/modal/SearchModal";
import ReactDataTablePdorder from "components/DataTable/ReactDataTablePdorder";
import PopupButton from "components/button/PopupButton";
import URL from "constants/url";
import ApprovalFormReport from "components/form/ApprovalFormReport";
import QuillEditor from "components/QuillEditor";
import ApprovalLineModal from "components/modal/ApprovalLineModal";
import ApprovalFormCost from "components/form/ApprovalFormCost";

/** 영업관리-견적관리 */
function Quotation() {
    const { currentPageName, innerPageName, setPrevInnerPageName, setInnerPageName, setCurrentPageName, setNameOfButton } = useContext(PageContext);
    const [infoList, setInfoList] = useState([
        { name: "인건비", id: "estimateLabor" },
        { name: "구매비", id: "orderBuying" },
        { name: "품의서", id: "proposal" },
    ]);
    const [condition, setCondition] = useState({});
    //const [isLoading, setIsLoading] = useState(true); //로딩화면(true 일때 로딩화면)

    const [isOpenSearch, setIsOpenSearch] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]); //그리드에서 선택된 row 데이터

    const [estimate, setEstimate] = useState([]);
    const [buyIngInfo, setBuyIngInfo] = useState([]);

    const [estimateBool, setestimateBool] = useState(false);
    const [buyIngBool, setBuyIngBool] = useState(false);

    useEffect(() => {
        setInnerPageName({ name: "인건비", id: "estimateLabor" });
        setCurrentPageName({}); //inner와 pageName은 동시에 사용 X
        return () => {};
    }, []);

    useEffect(() => {
        if (currentPageName.id === "Quotation") {
            const activeTab = document.querySelector(".mini_board_3 .tab li a.on"); //마지막으로 활성화 된 탭
            if (activeTab) {
                const activeTabInfo = infoList.find((data) => data.name === activeTab.textContent.trim());
                setInnerPageName({ ...activeTabInfo });
                setCurrentPageName({});
                fetchAllData();
            }
        }
    }, [currentPageName]);

    const changeTabs = (name, id) => {
        setInnerPageName((prev) => {
            setPrevInnerPageName({ ...prev });
            return { name, id };
        });
        setCurrentPageName({});
    };

    const refresh = () => {
        if (condition.poiId && condition.versionId) {
            fetchAllData(condition);
        } else {
            fetchAllData();
        }
    };

    //estMonth(월 숫자를 잘라다가 새롭게 estMm을 만듦)
    const updateEstMmProperty = (data) => {
        data.forEach((item) => {
            const estMonth = item.estMonth;
            if (estMonth) {
                //const paddedMonth = estMonth;
                item[`estMm${estMonth}`] = item.estMm;
            }
        });
        return data;
    };

    const processResultData = (resultData, condition) => {
        const changeDD = updateEstMmProperty(resultData);
        const transformedData = changeDD.reduce((accumulator, item) => {
            const {
                estId,
                estMm,
                estPosition,
                estUnitPrice,
                pgId,
                pgNm,
                pdiId,
                poiNm,
                pdiNm,
                pdiUnit,
                estDesc,
                estMm1,
                estMm2,
                estMm3,
                estMm4,
                estMm5,
                estMm6,
                estMm7,
                estMm8,
                estMm9,
                estMm10,
                estMm11,
                estMm12,
                estMm13,
                estMm14,
                estMm15,
                estMm16,
                estMm17,
                estMm18,
                estMm19,
                estMm20,
                estMm21,
                estMm22,
                estMm23,
                estMm24,
            } = item;

            const key = `${pdiNm}_${estPosition}`;
            if (!accumulator[key]) {
                accumulator[key] = {
                    estMm,
                    estPosition,
                    estUnitPrice,
                    pgId,
                    pdiId,
                    poiNm,
                    pdiNm,
                    pgNm,
                    pdiUnit,
                    estDesc,
                    estMm1,
                    estMm2,
                    estMm3,
                    estMm4,
                    estMm5,
                    estMm6,
                    estMm7,
                    estMm8,
                    estMm9,
                    estMm10,
                    estMm11,
                    estMm12,
                    estMm13,
                    estMm14,
                    estMm15,
                    estMm16,
                    estMm17,
                    estMm18,
                    estMm19,
                    estMm20,
                    estMm21,
                    estMm22,
                    estMm23,
                    estMm24,
                    estId: [],
                };
            }

            accumulator[key].estId.push(estId);
            accumulator[key].estId.sort((a, b) => a - b);

            for (let i = 1; i <= 24; i++) {
                const estMmKey = `estMm${i}`;
                if (item[estMmKey] !== undefined) {
                    accumulator[key][estMmKey] = item[estMmKey];
                }
            }

            return accumulator;
        }, []);
        //여기까지가통합

        // mergedData 에서 다시 tableData에쓸 배열로 재정의
        const mergedData = Object.values(transformedData).map((mergedItem, index) => {
            const newObj = {};
            newObj["estIdList"] = mergedItem.estId;
            newObj["estMm"] = mergedItem.estMm;
            newObj["estPosition"] = mergedItem.estPosition;
            newObj["estUnitPrice"] = mergedItem.estUnitPrice;
            newObj["pgId"] = mergedItem.pgId;
            newObj["pdiId"] = mergedItem.pdiId;
            newObj["pdiNm"] = mergedItem.pdiNm;
            newObj["pjbgDt"] = mergedItem.pjbgBeginDt;
            newObj["pgNm"] = mergedItem.pgNm;
            newObj["pdiUnit"] = mergedItem.pdiUnit;
            newObj["poiNm"] = mergedItem.poiNm;
            newObj["estDesc"] = mergedItem.estDesc;
            newObj["estMm1"] = mergedItem.estMm1;
            newObj["estMm2"] = mergedItem.estMm2;
            newObj["estMm3"] = mergedItem.estMm3;
            newObj["estMm4"] = mergedItem.estMm4;
            newObj["estMm5"] = mergedItem.estMm5;
            newObj["estMm6"] = mergedItem.estMm6;
            newObj["estMm7"] = mergedItem.estMm7;
            newObj["estMm8"] = mergedItem.estMm8;
            newObj["estMm9"] = mergedItem.estMm9;
            newObj["estMm10"] = mergedItem.estMm10;
            newObj["estMm11"] = mergedItem.estMm11;
            newObj["estMm12"] = mergedItem.estMm12;
            newObj["estMm13"] = mergedItem.estMm13;
            newObj["estMm14"] = mergedItem.estMm14;
            newObj["estMm15"] = mergedItem.estMm15;
            newObj["estMm16"] = mergedItem.estMm16;
            newObj["estMm17"] = mergedItem.estMm17;
            newObj["estMm18"] = mergedItem.estMm18;
            newObj["estMm19"] = mergedItem.estMm19;
            newObj["estMm20"] = mergedItem.estMm20;
            newObj["estMm21"] = mergedItem.estMm21;
            newObj["estMm22"] = mergedItem.estMm22;
            newObj["estMm23"] = mergedItem.estMm23;
            newObj["estMm24"] = mergedItem.estMm24;
            newObj["poiId"] = condition.poiId;
            newObj["versionId"] = condition.versionId;
            let total = 0;
            for (let j = 1; j <= 24; j++) {
                const propName = `estMm${j}`;
                if (mergedItem[propName] !== null) {
                    total += mergedItem[propName];
                }
            }

            newObj["total"] = total;
            newObj["price"] = total * mergedItem.estUnitPrice;

            return newObj;
        });
        return mergedData;
    };

    const fetchAllData = async (condition) => {
        //const requestSearch = {
        //    poiId: condition.poiId,
        //    useAt: "Y",
        //};
        if (innerPageName.id === "estimateLabor") {
            //인건비
            const resultData = await axiosFetch("/api/estimate/personnel/estimateCostMM/totalListAll.do", condition || {});
            setEstimate([]);
            setestimateBool(false);
            if (resultData.length !== 0) {
                const result = processResultData(resultData, condition);
                setEstimate(result);
                setestimateBool(true);
            }
        } else if (innerPageName.id === "orderBuying") {
            //구매비
            setBuyIngInfo([]);
            setBuyIngBool(false);
            const resultData = await axiosFetch("/api/estimate/buy/estCostBuy/totalListAll.do", condition || {});
            if (resultData.length !== 0) {
                setBuyIngInfo(resultData);
                setBuyIngBool(true);
            }
        }
        //const resultDa2 = await axiosFetch("/api/estimate/personnel/estimateCostMM/totalListAll.do", requestSearch);
        //const filteredData = filterData(updatedData);
    };

    const returnList = (originTableData, tableData) => {
        if (innerPageName.id === "estimateLabor") {
            //인건비
            compareData(originTableData, tableData);
        } else if (innerPageName.id === "orderBuying") {
            //구매비
            compareData2(originTableData, tableData);
        }
    };

    const compareData = (originData, updatedData) => {
        const filterData = updatedData.filter((data) => data.poiId); //pmpMonth가 없는 데이터 제외
        const originDataLength = originData ? originData.length : 0;
        const updatedDataLength = filterData ? filterData.length : 0;

        if (originDataLength > updatedDataLength) {
            //이전 id값은 유지하면서 나머지 값만 변경해주는 함수
            const updateDataInOrigin = (originData, updatedData) => {
                // 복제하여 새로운 배열 생성
                const updatedArray = [...originData];
                // updatedData의 길이만큼 반복하여 originData 갱신
                for (let i = 0; i < Math.min(updatedData.length, originData.length); i++) {
                    const updatedItem = updatedData[i];
                    updatedArray[i] = { ...updatedItem, estIdList: updatedArray[i].estIdList };
                }
                return updatedArray;
            };

            const firstRowUpdate = updateDataInOrigin(originData, updatedData);
            updateItem(firstRowUpdate); //수정

            const originAValues = originData.map((item) => item.estIdList); //삭제할 id 추출
            const extraOriginData = originAValues.slice(updatedDataLength);

            const flatArray = extraOriginData.flat(); //중첩배열 고르게만듦

            const delList = [];
            const delListTest = [];
            for (let i = updatedDataLength; i < originDataLength; i++) {
                delList.push(originData[i].estIdList);
                delListTest.push(originData[i]);
            }

            deleteItem(flatArray); //삭제
        } else if (originDataLength === updatedDataLength) {
            updateItem(filterData); //수정
        } else if (originDataLength < updatedDataLength) {
            const updateList = [];

            for (let i = 0; i < originDataLength; i++) {
                updateList.push(filterData[i]);
            }
            updateItem(updateList); //수정

            const addLists = [];

            for (let i = originDataLength; i < updatedDataLength; i++) {
                const addList = { ...filterData[i] };
                addList.poiId = condition.poiId;
                addList.versionId = condition.versionId;
                addLists.push(addList);
            }
            addItem(addLists); //추가
        }
    };

    const compareData2 = (originData, updatedData) => {
        const filterData = updatedData.filter((data) => data.pdiId); //필수값 체크

        const originDataLength = originData ? originData.length : 0;
        const updatedDataLength = filterData ? filterData.length : 0;

        if (originDataLength > updatedDataLength) {
            //이전 id값은 유지하면서 나머지 값만 변경해주는 함수
            const updateDataInOrigin = (originData, filterData) => {
                // 복제하여 새로운 배열 생성
                const updatedArray = [...originData];
                // updatedData의 길이만큼 반복하여 originData 갱신
                for (let i = 0; i < Math.min(filterData.length, originData.length); i++) {
                    const updatedItem = filterData[i];
                    updatedArray[i] = { ...updatedItem, estBuyId: updatedArray[i].estBuyId };
                }
                return updatedArray;
            };

            const firstRowUpdate = updateDataInOrigin(originData, filterData);
            updateItem2(firstRowUpdate);

            const originAValues = originData.map((item) => item.estBuyId); //삭제할 id 추출
            const extraOriginData = originAValues.slice(updatedDataLength);

            deleteItem2(extraOriginData);
        } else if (originDataLength === updatedDataLength) {
            updateItem2(filterData);
        } else if (originDataLength < updatedDataLength) {
            const toUpdate = [];
            for (let i = 0; i < originDataLength; i++) {
                const temp = { ...filterData[i] };
                toUpdate.push(temp);
            }
            updateItem2(toUpdate);
            const addLists = [];

            for (let i = originDataLength; i < updatedDataLength; i++) {
                const addList = { ...filterData[i] };
                addList.poiId = condition.poiId;
                addList.versionId = condition.versionId;
                addLists.push(addList);
            }
            addItem2(addLists); //추가
        }
    };

    const addItem2 = async (addData) => {
        const url = `api/estimate/buy/estCostBuy/addList.do`;
        const resultData = await axiosPost(url, addData);
        if (resultData) {
            refresh();
        }
    };

    const updateItem2 = async (toUpdate) => {
        const url = `/api/estimate/buy/estCostBuy/editList.do`;
        const resultData = await axiosUpdate(url, toUpdate);

        if (resultData) {
            refresh();
        }
    };

    const deleteItem2 = async (removeItem) => {
        const url = `/api/estimate/buy/estCostBuy/removeAll.do`;
        const resultData = await axiosDelete(url, removeItem);

        if (resultData) {
            refresh();
        }
    };

    const addItem = async (addData) => {
        const url = `/api/estimate/personnel/estimateCostMM/addArrayList.do`;
        const resultData = await axiosPost(url, addData);
        if (resultData) {
            refresh();
        }
    };

    const updateItem = async (toUpdate) => {
        const url = `/api/estimate/personnel/estimateCostMM/editArrayList.do`;
        const resultData = await axiosUpdate(url, toUpdate);

        if (resultData) {
            refresh();
        }
    };

    const deleteItem = async (removeItem) => {
        const url = `/api/estimate/personnel/estimateCostMM/removeAll.do`;
        const resultData = await axiosDelete(url, removeItem);

        if (resultData) {
            refresh();
        }
    };

    const conditionInfo = (value) => {
        setCondition((prev) => {
            if (prev.poiId !== value.poiId) {
                const newCondition = { ...value };
                fetchAllData(newCondition);
                return newCondition;
            } else {
                fetchAllData({ ...prev });
                return prev;
            }
        });
    };

    /* 품의서 */
    const sessionUser = sessionStorage.getItem("loginUser");
    const sessionUserName = JSON.parse(sessionUser)?.name;
    const uniqId = JSON.parse(sessionUser)?.uniqId;
    const posNm = JSON.parse(sessionUser)?.posNm;

    const [isOpenModalApproval, setIsOpenModalApproval] = useState(false);
    const [approvalLine, setApprovalLine] = useState([]); //결재선
    const [isSave, setIsSave] = useState(false); //저장
    const [isSubmit, setIsSubmit] = useState(false); //결재요청
    const [content, setContent] = useState(""); //결재 비고내용

    const writing = () => {
        if (isSave) {
            setIsSave(false); //내용 변경 중, 저장 버튼 활성화
        }
    };

    /* 견적품의서 프로젝트 정보 */
    const returnData = (value, type) => {
        if (type === "결재선") {
            const updated = [{ uniqId: uniqId, empNm: sessionUserName, posNm }, ...value.approvalLine];
            setApprovalLine(updated);
        } else if (type === "비고") {
            setContent(value);
        } else if (type === "조회") {
            setCondition((prev) => {
                if (prev.poiId !== value.poiId) {
                    const newCondition = { ...value };
                    // fetchAllData(newCondition);
                    return newCondition;
                } else {
                    // fetchAllData({ ...prev });
                    return prev;
                }
            });
        }
    };

    useEffect(() => {
        if (isSubmit) {
            const willApprove = window.confirm("결재 요청 하시겠습니까?");
            if (willApprove) {
                submit();
            }
        }
    }, [isSubmit]);

    const submit = async () => {
        const list = approvalLine.slice(1); //첫번째는 요청자라 제외

        if (!condition || !condition.poiId) {
            alert("프로젝트를 선택하세요.");
            setIsSubmit(false);
            return;
        }
        if (!condition || !condition.versionId) {
            alert("버전을 선택하세요.");
            setIsSubmit(false);
            return;
        }
        if (!list || list.length === 0) {
            alert("결재선을 선택하세요.");
            setIsSubmit(false);
            return;
        }

        const dataTosend = {
            poiId: condition.poiId,
            versionId: condition.versionId,
            sgnDesc: content,
            sgnType: "견적품의서",
            sttApproverList: list,
        };

        const resultData = await axiosPost("/api/system/signState/add.do", dataTosend);
        if (resultData) {
            alert("요청 완료되었습니다.");
            setIsSave(false); //결재요청 버튼 비활성화
            setApprovalLine([]);
        }
        setIsSubmit(false);
    };

    return (
        <>
            <Location pathList={locationPath.Quotation} />
            <div className="common_board_style mini_board_3">
                <ul className="tab">
                    <li onClick={() => changeTabs("인건비", "estimateLabor")}>
                        <a href="#인건비" className="on">인건비</a>
                    </li>
                    <li onClick={() => changeTabs("구매비", "orderBuying")}>
                        <a href="#구매비">구매비</a>
                    </li>
                    <li onClick={() => changeTabs("품의서", "proposal")}>
                        <a href="#품의서">품의서</a>
                    </li>
                </ul>
                <div className="list">
                    <div className="first">
                        <ul>
                            <ApprovalFormSal returnData={conditionInfo} initial={condition} />
                            {/*<HideCard title="합계" color="back-lightyellow" className="mg-b-40"></HideCard>*/}
                            <HideCard title="계획 등록/수정" color="back-lightblue">
                                <div className="table-buttons mg-t-10 mg-b-10">
                                    <PopupButton
                                        clickBtn={estimateBool}
                                        targetUrl={URL.LaborCostDoc}
                                        data={{ label: "견 적 서", poiId: condition.poiId, versionId: condition.versionId, tableData: estimate }}
                                    />
                                    <PopupButton
                                        clickBtn={estimateBool}
                                        targetUrl={URL.LaborSummaryDoc}
                                        data={{ label: "상세내역", poiId: condition.poiId, versionId: condition.versionId, tableData: estimate }}
                                    />
                                    <SaveButton label={"저장"} onClick={() => setNameOfButton("save")} />
                                    <AddButton label={"추가"} onClick={() => setNameOfButton("addRow")} />
                                    <DelButton label={"삭제"} onClick={() => setNameOfButton("deleteRow")} />
                                    <RefreshButton onClick={refresh} />
                                </div>
                                <ReactDataTableURL
                                    editing={true}
                                    columns={columns.orderPlanMgmt.estimateLabor}
                                    returnList={returnList}
                                    customDatas={estimate}
                                    viewPageName={{ name: "인건비", id: "estimateLabor" }}
                                    returnSelectRows={(data) => {
                                        setSelectedRows(data);
                                    }}
                                    customDatasRefresh={refresh}
                                    condition={condition}
                                />
                            </HideCard>
                        </ul>
                    </div>
                    <div className="second">
                        <ul>
                            <ApprovalFormSal returnData={conditionInfo} initial={condition} />
                            {/*<HideCard title="합계" color="back-lightyellow" className="mg-b-40"></HideCard>*/}
                            <HideCard title="계획 등록/수정" color="back-lightblue">
                                <div className="table-buttons mg-t-10 mg-b-10">
                                    <PopupButton
                                        clickBtn={buyIngBool}
                                        targetUrl={URL.OrderBuyDoc}
                                        data={{ label: "견 적 서", poiId: condition.poiId, versionId: condition.versionId, tableData: buyIngInfo }}
                                    />
                                    <PopupButton
                                        clickBtn={buyIngBool}
                                        targetUrl={URL.OrderSummaryDoc}
                                        data={{ label: "상세내역", poiId: condition.poiId, versionId: condition.versionId, tableData: buyIngInfo }}
                                    />
                                    <SaveButton label={"저장"} onClick={() => setNameOfButton("save")} />
                                    <AddButton label={"추가"} onClick={() => setNameOfButton("addRow")} />
                                    <DelButton label={"삭제"} onClick={() => setNameOfButton("deleteRow")} />
                                    <RefreshButton onClick={refresh} />
                                </div>
                                <ReactDataTablePdorder
                                    editing={true}
                                    columns={columns.orderPlanMgmt.estimatePurchase}
                                    customDatas={buyIngInfo}
                                    returnList={returnList}
                                    viewPageName={{ name: "구매비", id: "orderBuying" }}
                                    returnSelectRows={(data) => {
                                        setSelectedRows(data);
                                    }}
                                    customDatasRefresh={refresh}
                                    condition={condition}
                                />
                            </HideCard>
                        </ul>
                    </div>
                    <div className="third">
                        <ul>
                            <div className="form-buttons mg-b-20" style={{ maxWidth: 1400 }}>
                                <AddButton label="결재선" onClick={() => setIsOpenModalApproval(true)} />
                                <AddButton label="저장" onClick={() => setIsSave(true)} disabled={isSave} />
                                <AddButton label="결재요청" onClick={() => setIsSubmit(true)} disabled={!isSave} />
                            </div>
                            <ApprovalFormCost sendInfo={approvalLine}>
                                <div style={{ marginTop: "-55px", marginBottom: 55 }}>
                                    <h2>견적품의서</h2>
                                </div>
                                <ApprovalFormReport returnData={(value) => returnData(value, "조회")} type="견적품의서" />
                                <QuillEditor isSave={isSave} returnData={(value) => returnData(value, "비고")} writing={writing} />
                                <ApprovalLineModal
                                    width={670}
                                    height={500}
                                    title="결재선"
                                    type="견적품의서"
                                    isOpen={isOpenModalApproval}
                                    onClose={() => setIsOpenModalApproval(false)}
                                    returnData={(value) => returnData(value, "결재선")}
                                />
                            </ApprovalFormCost>
                        </ul>
                    </div>
                </div>
            </div>
            <SearchModal returnData={(condition) => fetchAllData(condition)} onClose={() => setIsOpenSearch(false)} isOpen={isOpenSearch} />
            {/*</div>
            )}*/}
        </>
    );
}

export default Quotation;
