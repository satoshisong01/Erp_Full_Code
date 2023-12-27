import React, { useContext, useEffect, useState } from "react";
import ProjectModal from "components/modal/ProjectModal";
import { v4 as uuidv4 } from "uuid";
import { PageContext } from "components/PageProvider";

/** 실행 폼 */
function ApprovalFormExe({ viewPageName, returnData }) {
    // const {currentPageName } = useContext(PageContext);
    const [isOpenProjectModal, setIsOpenProjectModal] = useState(false);
    const [data, setData] = useState({ poiId: "", poiNm: "", versionId: "", option: [] });

    // useEffect(() => {
    //     console.log("data:", data);
    // }, [data])

    const onChange = (value) => {
        // console.log("ㅋㅋ", viewPageName , "2", currentPageName);
        // if(viewPageName === currentPageName) {
            setData({...value});
        // }
    }

    const onClick = () => {
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
                                    <ProjectModal width={500} height={710} onClose={() => setIsOpenProjectModal(false)} title="프로젝트 목록" returnInfo={onChange}/>
                                )}
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

export default ApprovalFormExe;
