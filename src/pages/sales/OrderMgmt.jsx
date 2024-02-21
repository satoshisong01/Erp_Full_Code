import React, { useContext, useEffect, useState } from "react";
import { PageContext } from "components/PageProvider";
import QuillEditor from "components/QuillEditor";
import { axiosFetch, axiosPost } from "api/axiosFetch";
import AddButton from "components/button/AddButton";
import ApprovalLineModal from "components/modal/ApprovalLineModal";
import ApprovalFormCost from "components/form/ApprovalFormCost";
import ApprovalFormReport from "components/form/ApprovalFormReport";
import confirm from "antd/es/modal/confirm";

/** 영업관리-수주관리 */
function OrderMgmt() {
    const sessionUser = sessionStorage.getItem("loginUser");
    const sessionUserId = JSON.parse(sessionUser)?.id;
    const sessionUserName = JSON.parse(sessionUser)?.name;
    const uniqId = JSON.parse(sessionUser)?.uniqId;
    //posNm도 있어야함.. 직급정보

    const { currentPageName } = useContext(PageContext);
    const [signInfo, setSignInfo] = useState({});
    const [initialization, setInitialization] = useState({});
    const [condition, setCondition] = useState({});
    const [isOpenModalApproval, setIsOpenModalApproval] = useState(false);

    useEffect(() => {
        if (currentPageName.id === "ProjectMgmt") {
        }
    }, [currentPageName]);

    const [approvalLine, setApprovalLine] = useState([]); //결재선
    const [isSubmit, setIsSubmit] = useState(false);
    const [content, setContent] = useState(""); //결재 비고내용
    
    const returnData = (value, type) => {
        if(type === "결재선") {
            console.log("결재선정보:", value);
            const updated = [{empId: sessionUserId, empNm: sessionUserName}, ...value]
            setApprovalLine(updated);
        } else if(type === "비고") {
            setContent(value);
        } else if(type === "조회") {
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
        // console.log("결재선:", line); //아이디만 순차적으로 저장해야됨

    }

    useEffect(() => {
        if(isSubmit) {
            const willApprove = window.confirm("결재 요청 하시겠습니까?");
            if(willApprove) {
                submit();
            }
        }
    }, [isSubmit])

    const submit = async () => {
        const ids = approvalLine.slice(1).map(item => item.empId); //첫번째는 요청자라 제외
        // console.log("결재 ID:", ids);

        if(!condition || !condition.poiId) {
            alert("프로젝트를 선택하세요.");
            // console.log(">>프로젝트를 선택하세요.", condition);
            setIsSubmit(false);
            return;
        }
        if(!condition || !condition.versionId) {
            alert("버전을 선택하세요.");
            // alert(">>버전을 선택하세요.", condition);
            setIsSubmit(false);
            return;
        }
        if(!ids || ids.length === 0) {
            alert("결재선을 선택하세요.");
            // alert(">>결재선을 선택하세요.", ids);
            setIsSubmit(false);
            return;
        }

        const dataTosend = {
            "poiId": condition.poiId,
            "versionId": condition.versionId,
            "sttState": "", // 빈값 또는 "통보"로 사용
            "sgnDesc": content,
            "sttApproverIdList": ids
        }

        console.log("보낼데이터:", dataTosend);
        const resultData = await axiosPost("/api/system/signState/add.do", dataTosend);
        if(resultData) {
            alert("요청 완료되었습니다.")
            setInitialization({});
        }
        setIsSubmit(false);
    }

    // useEffect(() => {
    //     console.log("⭐1.content:", content);
    // }, [content])
    // useEffect(() => {
    //     console.log("💜2.condition:", condition);
    // }, [condition])
    // useEffect(() => {
    //     console.log("💚3.isSubmit:", isSubmit);
    // }, [isSubmit])


    return (
        <>
            <div className="form-buttons mg-b-20" style={{maxWidth: 1400}}>
                <AddButton label="결재선" onClick={() => setIsOpenModalApproval(true)}/>
                {/* <AddButton label="결재요청" onClick={submit}/> */}
                <AddButton label="결재요청" onClick={() => setIsSubmit(true)}/>
            </div>
            <ApprovalFormCost  sendInfo={approvalLine}>
                <ApprovalFormReport isSave={isSubmit} returnData={(value) => returnData(value, "조회")} initial={initialization} />
                {/* <QuillEditor isSave={isSubmit} returnData={(data) => setContent(data)}/> */}
                <QuillEditor isSave={isSubmit} returnData={(value) => returnData(value, "비고")}/>
                <ApprovalLineModal width={670} height={500} title="결재선" isOpen={isOpenModalApproval} onClose={() => setIsOpenModalApproval(false)} returnData={(value) => returnData(value, "결재선")}/>
            </ApprovalFormCost>
        </>
    );
}

export default OrderMgmt;
