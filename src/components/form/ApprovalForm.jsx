import React, { useContext, useEffect, useState } from "react";
import ModalSearch from "components/modal/ModalSearch";
import { PageContext } from "components/PageProvider";
import ModalPagePdOrder from "components/modal/ModalPagePdOrder";

function ApprovalForm({ title, children }) {
    const { isSaveFormTable, setIsSaveFormTable, projectInfo, setIsCancelTable, innerPageName } = useContext(PageContext);
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

    const handleClose = () => {
        //window.close();
    };

    const onClick = () => {
        if(projectInfo.poiId) {
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
                    {/* <button className="btn app-btn app-btn-tertiary">결재선</button>
                    <button className="btn app-btn app-btn-tertiary">결재요청</button> */}
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
                {/* <div className="approval-row mg-b-20">
                    <span className="approval-title">{title} 계획 등록</span>
                    <div className="approval-box">
                            <div className="department">
                                <span className="box-title">발 신 부 서</span>
                            </div>
                            <div className="area">
                                <div className="top">팀 원</div>
                                <div className="bottom">유지수</div>
                            </div>
                    </div>
                </div> */}
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
                                <td>{projectInfo.version}</td>
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
                                                value={projectInfo.poNm || ""}
                                                readOnly
                                            />
                                            {isOpenModal && (
                                                <ModalPagePdOrder
                                                    onClose={() => setIsOpenModal(false)}
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
                            {/* <tr>
                                <th>작성부서</th>
                                <td>
                                    <select>
                                        <option value="1">PS팀</option>
                                        <option value="2">PA팀</option>
                                    </select>
                                </td>
                                <th>수신처</th>
                                <td>
                                    <select>
                                        <option>김유진</option>
                                        <option>양회빈</option>
                                    </select>
                                </td>
                            </tr> */}
                        </tbody>
                    </table>
                    {/* <table className="table-styled">
                        <tbody>
                            <tr>
                                <th>수주부서</th>
                                <td>FMCS 그룹</td>
                                <th>매출부서</th>
                                <td>FMCS 그룹</td>
                                <th>영업대표</th>
                                <td>이수형 부장</td>
                                <th>담장자</th>
                                <td>손영훈 부장</td>
                            </tr>
                            <tr>
                                <th>매출부서</th>
                                <td>FMCS 그룹</td>
                                <th>시작일</th>
                                <td>2022/10/04</td>
                                <th>종료일</th>
                                <td>2022/12/30</td>
                                <th>상태</th>
                                <td>
                                    <button>작성중</button>
                                </td>
                            </tr>
                        </tbody>
                    </table> */}

                    <div className="mg-t-20">{children}</div>
                </div>
            </div>
        </>
    );
}

export default ApprovalForm;
