import React, { useContext, useEffect, useState } from "react";
import { PageContext } from "components/PageProvider";
import ProjectModal from "components/modal/ProjectModal";
import { axiosFetch } from "api/axiosFetch";
import { v4 as uuidv4 } from "uuid";

/** 영업 폼 */
function ApprovalFormSal({ viewPageName }) {
    const { projectInfo, innerPageName, versionInfo, setVersionInfo } = useContext(PageContext);
    // const [userInfo, setUserInfo] = useState({ id: "", name: "" });
    const [isOpenProjectModal, setIsOpenProjectModal] = useState(false);

    // useEffect(() => {
    //     const sessionUser = sessionStorage.getItem("loginUser");
    //     const sessionUserId = JSON.parse(sessionUser)?.id;
    //     setUserInfo({ id: sessionUserId });
    // }, []);

    useEffect(() => { 
        if(viewPageName !== innerPageName) return;
        if (projectInfo.poiId && !versionInfo.versionId) {
            getVersionList({ poiId: projectInfo.poiId });
        }
    }, [projectInfo, innerPageName]);


    const getVersionList = async (requestData) => {
        const resultData = await axiosFetch("/api/baseInfrm/product/versionControl/totalListAll.do", requestData || {});
        const emptyArr = resultData && resultData.map(({ versionId, versionNum, versionDesc, costAt }) => ({
            versionId,
            versionNum,
            versionDesc,
            costAt
        }));
        if(emptyArr) {
            setVersionInfo({
                versionId: emptyArr.find(info => info.costAt === "Y")?.versionId || emptyArr[0]?.versionId,
                option: emptyArr
            });
        }
    };

    const onSelectChange = (e) => {
        const { name, value } = e.target;
        if (value !== "default") {
            setVersionInfo((prev) => ({ ...prev, [name]: value }));
        }
    };

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
                            <th> <span className="cherry">*</span> 사전원가 버전</th>
                            <td>
                                <select
                                    id={uuidv4()}
                                    className="basic-input select"
                                    name="versionId"
                                    onChange={onSelectChange}
                                    value={versionInfo.option?.length > 0 ? versionInfo.versionId : "default"}
                                >
                                    {versionInfo.option?.length > 0 ? (
                                        versionInfo.option.map((info, index) => (
                                            <option key={index} value={info.versionId}>
                                                {info.versionNum}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="default">버전을 생성하세요.</option>
                                    )}
                                </select>
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

export default ApprovalFormSal;
