import React from "react";
import "./ApprovalForm.css";
import ModalSearch from "components/modal/ModalSearch";
function ApprovalForm({ title, children }) {
    const handleClose = () => {
        window.close();
    };
    return (
        <>
            <div className="newBody">
                <div className="form-button-group">
                    <button className="btn btn-primary">결제선</button>
                    <button className="btn btn-primary">결제요청</button>
                    <button className="btnW btn-primary">임시저장</button>
                    <button className="btnR btn-primary" onClick={handleClose}>
                        취소
                    </button>
                </div>
                <div className="header-row">
                    <div className="form-title">
                        <h1>{title}</h1>
                    </div>
                    <div className="area-container">
                        <div className="department">
                            <h3 className="titleH3"> 발 신 부 서 </h3>
                        </div>
                        <div className="area">
                            <div className="top"> 팀 원 </div>
                            <div className="bottom"> 유지수 </div>
                        </div>
                        <div className="area">
                            <div className="top"> P M </div>
                            <div className="bottom"> 손영훈 </div>
                        </div>
                    </div>
                </div>
                <h6 style={{ textAlign: "right", marginRight: "5%" }}>
                    단위:₩(원)
                </h6>
                <div className="TableBucket">
                    <table className="tableMain" border={1}>
                        <tbody className="tableBody tableBodyTop">
                            <tr className="tableTr">
                                <td className="table2-1">프로젝트명</td>
                                <td className="table2-2 titleSelect">
                                    <ModalSearch />
                                </td>
                            </tr>
                            <tr className="tableTr">
                                <td className="table2-1">작성일</td>
                                <td className="table4-2">2023.07.04</td>
                                <td className="table2-1">프로젝트코드</td>
                                <td className="table4-2"></td>
                            </tr>
                            <tr className="tableTr">
                                <td className="table2-1">작성자</td>
                                <td className="table4-2">유지수 팀원</td>
                                <td className="table2-1">작성부서</td>
                                <td className="table4-2">
                                    <select name="" id="">
                                        <option value="">
                                            -------------------- 선택
                                            --------------------
                                        </option>
                                        <option value="">PS팀</option>
                                        <option value="">PA팀</option>
                                    </select>
                                </td>
                            </tr>
                            <tr className="tableTr">
                                <td className="table2-1">참조자</td>
                                <td className="table4-2">
                                    <select name="" id="">
                                        <option value="">
                                            -------------------- 선택
                                            --------------------
                                        </option>
                                        <option value="">유지수</option>
                                        <option value="">송경석</option>
                                    </select>
                                </td>
                                <td className="table2-1">수신처</td>
                                <td className="table4-2">
                                    <select name="" id="">
                                        <option value="">
                                            -------------------- 선택
                                            --------------------
                                        </option>
                                        <option value="">김유진</option>
                                        <option value="">양회빈</option>
                                    </select>
                                </td>
                            </tr>
                            <tr className="tableTr tableTr2">
                                <td className="table2-1 table2-1-2">
                                    작성가이드
                                </td>
                                <td className="table2-2">
                                    셀렉트 박스에서 선택을 해주세요
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table className="tableMain" border={1}>
                        <tbody className="tableBody tableBodyBot">
                            <tr className="tableTr">
                                <td className="table8-1">수주부서</td>
                                <td className="table8-2">FMCS 그룹</td>
                                <td className="table8-1">매출부서</td>
                                <td className="table8-2">FMCS 그룹</td>
                                <td className="table8-1">영업대표</td>
                                <td className="table8-2">이수형 부장</td>
                                <td className="table8-1">담장자</td>
                                <td className="table8-2">손영훈 부장</td>
                            </tr>
                            <tr className="tableTr">
                                <td className="table8-1">매출부서</td>
                                <td className="table8-2">FMCS 그룹</td>
                                <td className="table8-1">시작일</td>
                                <td className="table8-2">2022/10/04</td>
                                <td className="table8-1">종료일</td>
                                <td className="table8-2">2022/12/30</td>
                                <td className="table8-1">상태</td>
                                <td className="table8-2">
                                    <div>
                                        <button className="working">
                                            작성중
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div id="content">{children}</div>
                </div>
            </div>
        </>
    );
}

export default ApprovalForm;
