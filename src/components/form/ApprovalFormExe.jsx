import React, { useContext, useEffect, useState } from "react";
import { PageContext } from "components/PageProvider";
import ProjectModal from "components/modal/ProjectModal";
import { axiosFetch } from "api/axiosFetch";
import { v4 as uuidv4 } from "uuid";

/** 실행 폼 */
function ApprovalFormExe({ viewPageName }) {
    const { projectInfo } = useContext(PageContext);
    const [isOpenProjectModal, setIsOpenProjectModal] = useState(false);

    return (
        <>
            <div className="approval-form mg-b-40">
                <table className="table-styled header-width">
                    <tbody>
                        <tr>
                            <th> <span className="cherry">*</span> 프로젝트명</th>
                            <td colSpan={2}>
                                <input
                                    id={uuidv4()}
                                    className="basic-input"
                                    name="poiNm"
                                    onClick={() => setIsOpenProjectModal(true)}
                                    value={projectInfo.poiNm}
                                    placeholder="프로젝트를 선택하세요."
                                    readOnly
                                />
                                {isOpenProjectModal && (
                                    <ProjectModal
                                        width={500}
                                        height={710}
                                        onClose={() => setIsOpenProjectModal(false)}
                                        title="프로젝트 목록"
                                    />
                                )}
                            </td>
                            <th>기준연도</th>
                            <td>{projectInfo.poiMonth}</td>
                            <th>최종 수정일</th>
                            <td>{projectInfo.lastModifyDate}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default ApprovalFormExe;
