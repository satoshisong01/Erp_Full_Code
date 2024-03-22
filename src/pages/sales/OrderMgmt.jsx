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
import ApprovalFormSal2 from "components/form/ApprovalFormSal2";
import SignStateLine from "components/SignStateLine";

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

    const [projectInfo, setProjectInfo] = useState({}); //프로젝트정보

    const [approvalData, setApprovalData] = useState([]); //승인자목록
    const [isMyTurn, setIsMyTurn] = useState(false);

    const [documentName, setDocumentName] = useState("사전원가서");
    const [title, setTitle] = useState("");
    const [openUrl, setOpenUrl] = useState("");
    const [isCancel, setIsCancel] = useState(false);
    const [clickBtn, setClickBtn] = useState(false);

    //재기안으로 받은 데이터
    function getQueryParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
        const results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return "";
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    useEffect(() => {
        // URL에서 "data" 파라미터 읽기
        const dataParameter = getQueryParameterByName("data");
        const data = JSON.parse(dataParameter); //프로젝트정보있음
        setProjectInfo({ ...data });
        if (data) {
            fetchAllData({ poiId: data.poiId, versionId: data.versionId });
            if (data.sgnType === "견적품의서") {
                setTitle("견적서 승인 요청서");
                setDocumentName("견적원가서");
                setOpenUrl(URL.PreCostDoc);
            } else if (data.sgnType === "수주보고서") {
                setTitle("수주/계약 보고서");
                setDocumentName("수주원가서");
                setDocumentName("수주원가서");
                setOpenUrl(URL.PreCostDoc);
            } else if (data.sgnType === "완료보고서") {
                setTitle("완료보고서");
                setDocumentName("사후정산서");
                setOpenUrl(URL.PostCostsDoc);
            }
            getData({ sgnId: data.sgnId });
        }
        const timer = setTimeout(() => {
            setClickBtn(true);
        }, 3800);

        // 컴포넌트가 언마운트될 때 타이머를 정리
        return () => clearTimeout(timer);
    }, []);

    const getData = async (requestData) => {
        const signResultData = await axiosFetch("/api/system/sign/totalListAll.do", requestData || {});
        let signInfo = {};
        if (signResultData) {
            signInfo = {
                sgnId: signResultData[0]?.sgnId,
                sgnSenderNm: signResultData[0]?.sgnSenderNm, //발신자이름
                sgnSenderPosNm: signResultData[0]?.sgnSenderPosNm, //기안자직급
                sgnSenderGroupNm: signResultData[0]?.sgnSenderGroupNm, //기안자부서
                sgnSigndate: signResultData[0]?.sgnSigndate, //기안일
                sgnReceiverId: signResultData[0]?.sgnReceiverId, //수신자
                sgnDesc: signResultData[0]?.sgnDesc, //비고
            };
            setProjectInfo((prev) => ({
                ...prev,
                ...signInfo, //프로젝트 정보에 비고추가
            }));

            if (signInfo.sgnSenderNm === sessionUserName) {
                //요청자와 로그인유저가 같으면
                setIsCancel(true); //회수가능
            }
        }

        const stateResultData = await axiosFetch("/api/system/signState/totalListAll.do", requestData || {});
        if (stateResultData) {
            const arr = stateResultData.map((item) => ({
                sttId: item.sttId, //결재ID
                sttApproverId: item.sttApproverId, //승인자ID
                sttApproverNm: item.sttApproverNm, //승인자명
                sttApproverPosNm: item.sttApproverPosNm, //직급
                sttApproverGroupNm: item.sttApproverGroupNm, //부서
                sttApproverAt: item.sttApproverAt, //승인자상태
                sttResult: item.sttResult, //결재결과
                sttComent: item.sttComent, //코멘트
                sttPaymentDate: item.sttPaymentDate, //결재일 (오타 수정)
            }));

            if (signInfo) {
                const changeSign = [
                    {
                        sttApproverNm: signInfo.sgnSenderNm,
                        sttApproverPosNm: signInfo.sgnSenderPosNm,
                        sttApproverAt: "요청",
                        sttApproverGroupNm: signInfo.sgnSenderGroupNm,
                        sttPaymentDate: signInfo.sgnSigndate,
                        sgnDesc: signInfo.sgnDesc,
                    },
                ];
                const merge = [...changeSign, ...arr];
                setApprovalData(merge);
                const myData = stateResultData.find((item) => item.sttApproverAt === "진행" && item.sttApproverId === uniqId);
                myData ? setIsMyTurn(true) : setIsMyTurn(false);
            }
        }
    };
    //    const signResultData = await axiosFetch("/api/system/sign/totalListAll.do", requestData || {});
    //    let signInfo = {};
    //    if (signResultData) {
    //        signInfo = {
    //            sgnId: signResultData[0]?.sgnId,
    //            sgnSenderNm: signResultData[0]?.sgnSenderNm, //발신자이름
    //            sgnSenderPosNm: signResultData[0]?.sgnSenderPosNm, //기안자직급
    //            sgnSenderGroupNm: signResultData[0]?.sgnSenderGroupNm, //기안자부서
    //            sgnSigndate: signResultData[0]?.sgnSigndate, //기안일
    //            sgnReceiverId: signResultData[0]?.sgnReceiverId, //수신자
    //            sgnDesc: signResultData[0]?.sgnDesc, //비고
    //        };
    //        setProjectInfo((prev) => ({
    //            ...prev,
    //            ...signInfo, //프로젝트 정보에 비고추가
    //        }));
    //    }

    //    const stateResultData = await axiosFetch("/api/system/signState/totalListAll.do", requestData || {});
    //    if (stateResultData) {
    //        const arr = stateResultData.map((item) => ({
    //            sttId: item.sttId, //결재ID
    //            sttApproverId: item.sttApproverId, //승인자ID
    //            sttApproverNm: item.sttApproverNm, //승인자명
    //            sttApproverPosNm: item.sttApproverPosNm, //직급
    //            sttApproverGroupNm: item.sttApproverGroupNm, //부서
    //            sttApproverAt: item.sttApproverAt, //승인자상태
    //            sttResult: item.sttResult, //결재결과
    //            sttComent: item.sttComent, //코멘트
    //            sttPaymentDate: item.sttPaymentDate, //결재일 (오타 수정)
    //        }));

    //        if (signInfo) {
    //            const changeSign = [
    //                {
    //                    sttApproverNm: signInfo.sgnSenderNm,
    //                    sttApproverPosNm: signInfo.sgnSenderPosNm,
    //                    sttApproverAt: "요청",
    //                    sttApproverGroupNm: signInfo.sgnSenderGroupNm,
    //                    sttPaymentDate: signInfo.sgnSigndate,
    //                    sgnDesc: signInfo.sgnDesc,
    //                },
    //            ];
    //            const merge = [...changeSign, ...arr];
    //            setApprovalData(merge);
    //            const myData = stateResultData.find((item) => item.sttApproverAt === "진행" && item.sttApproverId === uniqId);
    //            myData ? setIsMyTurn(true) : setIsMyTurn(false);
    //        }
    //    }
    //};

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
                <PopupButton clickBtn={isProgress} targetUrl={URL.PreCostDoc} data={{ label: "수주원가서", type: "document", ...condition }} />
                <AddButton label="결재선" onClick={() => setIsOpenModalApproval(true)} />
                {/* <AddButton label="저장" onClick={() => setIsSave(true)} disabled={isSave} /> */}
                <AddButton label="결재요청" onClick={() => setIsSubmit(true)} />
            </div>
            <SignStateLine signStateData={approvalData} />
            <ApprovalFormCost sendInfo={approvalLine}>
                <div style={{ marginTop: "-55px", marginBottom: 55 }}>
                    <h2 style={{ zIndex: "1" }}>
                        {projectInfo?.sgnType === "수주보고서"
                            ? "수주/계약 보고서"
                            : projectInfo?.sgnType === "견적품의서"
                            ? "견적서 승인 요청서"
                            : "수주/계약 보고서"}
                    </h2>
                </div>
                {/* <ApprovalFormReport returnData={(value) => returnData(value, "조회")} type="수주보고서"/> */}
                {projectInfo.poiId ? (
                    <ApprovalFormSal2 projectInfo={projectInfo ? projectInfo : ""} returnData={(value) => returnData(value, "조회")} />
                ) : (
                    <ApprovalFormSal returnData={(value) => returnData(value, "조회")} viewPageName={{ name: "수주보고서", id: "OrderMgmt" }} />
                )}

                <QuillEditor isProgress={isProgress} returnData={(value) => returnData(value, "비고")} writing={writing} readContent={projectInfo.sgnDesc} />
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
