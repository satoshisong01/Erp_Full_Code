import React, { useContext, useEffect, useState } from "react";
import QuillEditor from "components/QuillEditor";
import { axiosFetch, axiosPost } from "api/axiosFetch";
import AddButton from "components/button/AddButton";
import ApprovalLineModal from "components/modal/ApprovalLineModal";
import ApprovalFormCost from "components/form/ApprovalFormCost";
import PopupButtonNL from "components/button/PopupButtonReport";
import URL from "constants/url";
import ApprovalFormSal from "components/form/ApprovalFormSal";
import PopupButton from "components/button/PopupButton";
import { ProcessResultDataRun } from "../../components/DataTable/function/ProcessResultData";
import { PageContext } from "components/PageProvider";

/** 영업관리-수주관리-수주보고서 */
function OrderMgmt() {
    const sessionUser = sessionStorage.getItem("loginUser");
    const sessionUserName = JSON.parse(sessionUser)?.name;
    const uniqId = JSON.parse(sessionUser)?.uniqId;
    const posNm = JSON.parse(sessionUser)?.posNm;
    const [condition, setCondition] = useState({});
    const [isOpenModalApproval, setIsOpenModalApproval] = useState(false);

    const [estimate, setEstimate] = useState([]);
    const [buyIngInfo, setBuyIngInfo] = useState([]);

    const [approvalLine, setApprovalLine] = useState([]); //결재선
    const [isProgress, setIsProgress] = useState(true); //저장
    const [isSubmit, setIsSubmit] = useState(false); //결재요청
    const [content, setContent] = useState(""); //결재 비고내용

    const returnData = (value, type) => {
        if (type === "결재선") {
            const updated = [{ uniqId: uniqId, empNm: sessionUserName, posNm }, ...value.approvalLine];
            setApprovalLine(updated);
        } else if (type === "비고") {
            setContent(value);
        } else if (type === "조회") {
            setIsProgress(false); //내용저장(진행) 완료
            setCondition((prev) => {
                if (prev.versionId !== value.versionId) {
                    const newCondition = { ...value };
                    fetchAllData(newCondition); //견적서
                    return newCondition;
                } else {
                    fetchAllData({ ...prev });
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
            sgnType: "수주보고서",
            sttApproverList: list,
        };

        const resultData = await axiosPost("/api/system/signState/add.do", dataTosend);
        if (resultData) {
            alert("요청 완료되었습니다.");
            setIsProgress(true); //결재요청 버튼 비활성화
            setApprovalLine([]);
        }
        setIsSubmit(false);
    };

    /* 견적서 */
    const fetchAllData = async (condition) => {
        const resultData = await axiosFetch("/api/estimate/personnel/estimateCostMM/totalListAll.do", condition || {});
        const resultData2 = await axiosFetch("/api/estimate/buy/estCostBuy/totalListAll.do", condition || {});

        if (resultData.length !== 0) {
            const result = ProcessResultDataRun(resultData, condition);
            setEstimate(result);
        }

        if (resultData2.length !== 0) {
            const updatedData = { ...resultData2[0] }; // 첫 번째 객체만 수정한다고 가정합니다.
            updatedData.estBuyQunty = 1;

            const updatedArray = [...resultData2];
            updatedArray[0] = updatedData;

            setBuyIngInfo(updatedArray);
        }
    };

    const writing = () => {
        if (!isProgress) {
            setIsProgress(true); //내용 변경 중
        }
    };

    return (
        <>
            <div className="form-buttons mg-b-20" style={{ maxWidth: 1400 }}>
                <PopupButton
                    clickBtn={isProgress}
                    targetUrl={URL.TotalDoc}
                    data={{
                        label: "견적서",
                        poiId: condition.poiId,
                        versionId: condition.versionId,
                        tableData: estimate,
                        tableData2: buyIngInfo,
                    }}
                />
                <PopupButton
                    clickBtn={isProgress}
                    targetUrl={URL.PreCostDoc}
                    data={{ label: "수주원가서", type: "document", ...condition }}
                />
                <AddButton label="결재선" onClick={() => setIsOpenModalApproval(true)} />
                {/* <AddButton label="저장" onClick={() => setIsSave(true)} disabled={isSave} /> */}
                <AddButton label="결재요청" onClick={() => setIsSubmit(true)} />
            </div>
            <ApprovalFormCost sendInfo={approvalLine}>
                <div style={{ marginTop: "-55px", marginBottom: 55 }}>
                    <h2 style={{ zIndex: "1" }}>수주/계약 보고서</h2>
                </div>
                {/* <ApprovalFormReport returnData={(value) => returnData(value, "조회")} type="수주보고서"/> */}
                <ApprovalFormSal returnData={(value) => returnData(value, "조회")} viewPageName={{ name: "수주보고서", id: "OrderMgmt" }} />
                <QuillEditor isProgress={isProgress} returnData={(value) => returnData(value, "비고")} writing={writing} />
                <ApprovalLineModal
                    width={670}
                    height={500}
                    title="결재선"
                    type="수주보고서"
                    isOpen={isOpenModalApproval}
                    onClose={() => setIsOpenModalApproval(false)}
                    returnData={(value) => returnData(value, "결재선")}
                />
            </ApprovalFormCost>
        </>
    );
}

export default OrderMgmt;
