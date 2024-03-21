import React, { useContext, useEffect, useState } from "react";
import { PageContext } from "components/PageProvider";
import ProjectModal from "components/modal/ProjectModal";
import { axiosFetch } from "api/axiosFetch";
import { v4 as uuidv4 } from "uuid";

/** 영업 폼 */
function ApprovalFormSal({ returnData, viewPageName }) {
    const { innerPageName, setInquiryConditions, inquiryConditions, currentPageName } = useContext(PageContext);
    const [isOpenProjectModal, setIsOpenProjectModal] = useState(false);
    const [data, setData] = useState({ poiId: "", poiNm: "", versionId: "", option: [] });

    useEffect(() => {
        if (currentPageName?.id === viewPageName?.id || innerPageName?.id === viewPageName?.id) {
            //현재페이지일때
            if (inquiryConditions.poiId) {
                //전역정보 바뀔때
                getVersionList({ poiId: inquiryConditions.poiId });
            }
        }
    }, [inquiryConditions, innerPageName, currentPageName, viewPageName]);

    useEffect(() => {
        if (currentPageName?.id === viewPageName?.id || innerPageName?.id === viewPageName?.id) {
            //현재페이지일때
            if (data.poiId && !data.versionId) {
                //버전정보가 없을때
                getVersionList({ poiId: data.poiId });
            }
        }
    }, [data]);

    const getVersionList = async (requestData) => {
        const resultData = await axiosFetch("/api/baseInfrm/product/versionControl/totalListAll.do", requestData || {});
        const emptyArr = resultData && resultData.map(({ versionId, versionNum, versionDesc, costAt }) => ({ versionId, versionNum, versionDesc, costAt }));
        if (emptyArr?.length > 0) {
            setData((prev) => ({
                ...prev,
                ...inquiryConditions,
                versionId: inquiryConditions.versionId
                    ? inquiryConditions.versionId
                    : emptyArr.find((info) => info.costAt === "Y")?.versionId || emptyArr[0]?.versionId,
                versionNum: emptyArr.find((info) => info.costAt === "Y")?.versionNum || emptyArr[0]?.versionNum,
                option: emptyArr,
            }));
        }
        if (!resultData || resultData.length === 0) {
            returnData && returnData({});
            alert("버전 정보가 없습니다.");
        }
    };

    const onSelectChange = (e) => {
        const { name, value, innerText } = e.target;
        const versionNum = innerText.split("\n")[0];
        if (value !== "default") {
            setData((prev) => ({
                ...prev,
                [name]: value,
                versionNum: versionNum,
            }));
        }
    };

    const onChangeProject = (value) => {
        setData({
            poiId: value.poiId,
            poiNm: value.poiNm,
            poiDesc: value.poiDesc,
            poiMonth: value.poiMonth,
            poiBeginDt: value.poiBeginDt,
            poiManagerId: value.poiManagerId,
            poiSalmanagerId: value.poiSalmanagerId,
        });
    };

    const onClick = () => {
        if (!data.versionId) {
            alert("버전을 생성하세요.");
            return;
        }
        returnData && returnData({ ...data });
        setInquiryConditions({ ...data });
    };

    return (
        <>
            <div className="approval-form mg-b-40">
                <table className="table-styled header-width" style={{ border: "solid 1px #ddd" }}>
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
                                    <ProjectModal
                                        width={500}
                                        height={710}
                                        onClose={() => setIsOpenProjectModal(false)}
                                        title="프로젝트 목록"
                                        returnInfo={onChangeProject}
                                    />
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
                                    value={data.versionId ? data.versionId : "default"}>
                                    {data.option?.length > 0 &&
                                        data.option.map((info, index) => (
                                            <option key={index} value={info.versionId}>
                                                {info.versionNum}
                                            </option>
                                        ))}
                                    {data.option?.length === 0 && <option value="default">버전을 생성하세요.</option>}
                                </select>
                            </td>
                            <th>기준연도</th>
                            <td>{data.poiMonth}</td>
                            <th>최종 수정일</th>
                            <td>{data.lastModifyDate}</td>
                            <td width={80} style={{ textAlign: "center" }}>
                                {currentPageName.id === "OrderMgmt" || innerPageName.id === "proposal" ? (
                                    <button type="button" className="table-btn table-btn-default" onClick={onClick}>
                                        내용저장
                                    </button>
                                ) : (
                                    <button type="button" className="table-btn table-btn-default" onClick={onClick}>
                                        조회
                                    </button>
                                )}
                            </td>

                            {/* <td width={80} style={{ textAlign: "center" }}>
                                {currentPageName?.id === "OrderMgmt" || innerPageName?.id === "proposal" && 
                                    <button type="button" className="table-btn table-btn-default" onClick={onClick}>
                                        내용저장
                                    </button>
                                }
                                {currentPageName?.id !== "OrderMgmt" || innerPageName?.id === "proposal" && 
                                    <button type="button" className="table-btn table-btn-default" onClick={onClick}>
                                        조회
                                    </button>
                                }
                            </td> */}
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default ApprovalFormSal;
