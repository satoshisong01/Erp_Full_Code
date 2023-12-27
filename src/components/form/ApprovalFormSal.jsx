import React, { useContext, useEffect, useState } from "react";
import { PageContext } from "components/PageProvider";
import ProjectModal from "components/modal/ProjectModal";
import { axiosFetch } from "api/axiosFetch";
import { v4 as uuidv4 } from "uuid";

/** 영업 폼 */
function ApprovalFormSal({ viewPageName, returnData }) {
    const { projectInfo, innerPageName, versionInfo, setVersionInfo } = useContext(PageContext);
    const [isOpenProjectModal, setIsOpenProjectModal] = useState(false);
    const [data, setData] = useState({ poiId: "", poiNm: "", versionId: "", option: [] });

    useEffect(() => {
        if (viewPageName !== innerPageName) return;
        if (projectInfo.poiId !== "" && projectInfo.poiId !== data.poiId) {
            //프로젝트정보 바뀌었을 때
            setData({ poiId: projectInfo.poiId, poiNm: projectInfo.poiNm });
        }
    }, [projectInfo, innerPageName]);

    useEffect(() => {
        if (data.poiId && !data.versionId) {
            //선택된 버전정보가 없다면
            getVersionList({ poiId: data.poiId });
        }
    }, [data.poiId]);

    const getVersionList = async (requestData) => {
        const resultData = await axiosFetch("/api/baseInfrm/product/versionControl/totalListAll.do", requestData || {});
        const emptyArr =
            resultData &&
            resultData.map(({ versionId, versionNum, versionDesc, costAt }) => ({
                versionId,
                versionNum,
                versionDesc,
                costAt,
            }));
        if (emptyArr?.length > 0) {
            setData((prev) => ({
                ...prev,
                versionId: emptyArr.find((info) => info.costAt === "Y")?.versionId || versionInfo?.versionId || emptyArr[0]?.versionId,
                option: emptyArr,
            }));
            setVersionInfo({
                versionId: emptyArr.find((info) => info.costAt === "Y")?.versionId || versionInfo?.versionId || emptyArr[0]?.versionId,
            });
        }
    };

    const onSelectChange = (e) => {
        const { name, value } = e.target;
        if (value !== "default") {
            setData((prev) => ({ ...prev, [name]: value }));
        }
        if (name === "versionId") {
            setVersionInfo({ versionId: value });
        }
    };

    const onClick = () => {
        console.log(data, "데이터 돌아가나");
        returnData({ ...data });
    };

    return (
        <>
            <div className="approval-form mg-b-40">
                <table className="table-styled header-width">
                    <tbody>
                        <tr>
                            <th>
                                <span className="cherry">*</span> 프로젝트명
                            </th>
                            <td colSpan={2}>
                                <input
                                    id={uuidv4()}
                                    className="basic-input"
                                    name="poiNm"
                                    onClick={() => setIsOpenProjectModal(true)}
                                    value={data.poiNm || ""}
                                    placeholder="프로젝트를 선택하세요."
                                    readOnly
                                />
                                {isOpenProjectModal && (
                                    <ProjectModal width={500} height={710} onClose={() => setIsOpenProjectModal(false)} title="프로젝트 목록" />
                                )}
                            </td>
                            <th>
                                <span className="cherry">*</span> 사전원가 버전
                            </th>
                            <td>
                                <select
                                    id={uuidv4()}
                                    className="basic-input select"
                                    name="versionId"
                                    onChange={onSelectChange}
                                    value={data.option?.length > 0 ? data.versionId : "default"}>
                                    {data.option?.map((info, index) => (
                                        <option key={index} value={info.versionId}>
                                            {info.versionNum}
                                        </option>
                                    ))}
                                    {!data.option && <option value="default">버전을 생성하세요.</option>}
                                </select>
                            </td>
                            <th>기준연도</th>
                            <td>{data.poiMonth}</td>
                            <th>최종 수정일</th>
                            <td>{data.lastModifyDate}</td>
                            <td width={80} style={{ textAlign: "center" }}>
                                <button type="button" className="table-btn table-btn-default" onClick={onClick}>
                                    조회
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default ApprovalFormSal;
