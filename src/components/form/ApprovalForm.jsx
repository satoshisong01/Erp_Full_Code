import React, { useContext, useEffect, useState } from "react";
import ModalSearch from "components/modal/ModalSearch";
import { PageContext } from "components/PageProvider";
import PdOrderListModal from "components/modal/PdOrderListModal";

function ApprovalForm({ title, children }) {
    const { isSaveFormTable, setIsSaveFormTable, projectInfo, setProjectInfo, setIsCancelTable, innerPageName, setIsModalTable, setModalPageName } = useContext(PageContext);
    const [userInfo, serUserInfo] = useState({ id: "", name: "" });
    const [isOpenModal, setIsOpenModal] = useState(false)

    useEffect(() => {
        const sessionUser = sessionStorage.getItem("loginUser");
        const sessionUserId = JSON.parse(sessionUser)?.id;
        serUserInfo({ id: sessionUserId });
    }, []);

    const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    };
    const currentTime = new Date().toLocaleString("ko-KR", options);

    const onClick = () => { //구매클릭
        if(projectInfo.poiId) {
            setProjectInfo((preValue) => ({...preValue, poId: ""}))
            setIsOpenModal(true);
        } else if(!projectInfo.poiId){
            alert('프로젝트를 선택해 주세요.')
        }
    }

    return (
        <>
            <div className="flex-between">
                <span></span>
                {/* <span className="approval-title">{title}</span> */}
                <span style={{ fontSize: "15px" }}>{title}</span>
                <div className="app-buttons mg-b-20">
                    {isSaveFormTable ? (
                        <button className="btn app-btn app-btn-primary" onClick={() => setIsSaveFormTable(false)}>
                            저장
                        </button>
                    ) : (
                        <button className="btn app-btn app-btn-primary" onClick={() => setIsSaveFormTable(true)}>
                            수정
                        </button>
                    )}
                    <button className="btn app-btn app-btn-secondary" onClick={() => setIsCancelTable(true)}>
                        취소
                    </button>
                </div>
            </div>

            <div className="approval-form">
                <div className="gap">
                    <table className="table-styled header-width">
                        <tbody>
                            <tr>
                                <th >프로젝트 이름</th>
                                <td colSpan={3}>
                                    <ModalSearch />
                                </td>
                                <th>프로젝트 아이디</th>
                                <td>{projectInfo.poiId}</td>
                                <th>프로젝트 버전</th>
                                <td>{projectInfo.poiVersion}</td>
                            </tr>
                            <tr>
                                <th>작성일</th>
                                <td colSpan={3}>{currentTime}</td>
                                <th>작성자</th>
                                <td colSpan={3}>{userInfo.id}</td>

                            </tr>
                            {
                                innerPageName === "구매(재료비)" ? (
                                    <tr>
                                        <th>구매 종류</th>
                                        <td colSpan={3}>
                                            <input
                                                onClick={onClick}
                                                type="text"
                                                placeholder="구매 종류를 선택해 주세요."
                                                value={projectInfo.poDesc || ""}
                                                readOnly
                                            />
                                            {isOpenModal && (
                                                <PdOrderListModal
                                                    onClose={() => {
                                                        setIsOpenModal(false);
                                                        setIsModalTable(false);
                                                        setModalPageName("")
                                                    }}
                                                />
                                            )}
                                        </td>
                                        <th>거래처</th>
                                        <td >{}</td>
                                        <th>발주일</th>
                                        <td >{}</td>
                                    </tr>
                                ) : null
                            }
                        </tbody>
                    </table>

                    <div className="mg-t-20">{children}</div>
                </div>
            </div>
        </>
    );
}

export default ApprovalForm;
