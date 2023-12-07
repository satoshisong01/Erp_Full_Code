import React, { useContext, useEffect, useState } from "react";
import ModalSearch from "components/modal/ModalSearch";
import { PageContext } from "components/PageProvider";
import PdOrderListModal from "components/modal/PdOrderListModal";
import { v4 as uuidv4 } from "uuid";

/** 영업-계획관리 폼 */
function ApprovalForm({ title, children }) {
    const { isSaveFormTable, setIsSaveFormTable, projectInfo, setIsCancelTable } = useContext(PageContext);
    const [userInfo, serUserInfo] = useState({ id: "", name: "" });

    useEffect(() => {
        const sessionUser = sessionStorage.getItem("loginUser");
        const sessionUserId = JSON.parse(sessionUser)?.id;
        serUserInfo({ id: sessionUserId });
    }, []);

    return (
        <>
            <div className="flex-between">
                <span></span>
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
                                <th>프로젝트명</th>
                                <td colSpan={3}>
                                    <ModalSearch />
                                </td>
                                 <th>기준연도</th>
                                <td colSpan={3}>{projectInfo.poiMonth}</td>
                            </tr>
                            <tr>
                                <th>사전원가 버전</th>
                                <td colSpan={3}>{}</td>
                                <th>최종 수정일</th>
                                <td colSpan={3}>{}</td>
                            </tr>
                        </tbody>
                    </table>
                    {/* <div className="mg-t-20">{children}</div> */}
                </div>
            </div>
        </>
    );
}

export default ApprovalForm;
