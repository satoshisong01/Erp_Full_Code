import React, { useContext, useEffect, useState } from "react";
import ModalSearch from "components/modal/ModalSearch";
import { PageContext } from "components/PageProvider";
import BasicSelect from "components/input/BasicSelect";
import ProjectModal from "components/modal/ProjectModal";
import BasicInput from "components/input/BasicInput";
import { axiosFetch } from "api/axiosFetch";
import { v4 as uuidv4 } from "uuid";

/** 영업 폼 */
function ApprovalFormSal({ returnInfo }) {
    const { projectInfo } = useContext(PageContext);
    const [userInfo, setUserInfo] = useState({ id: "", name: "" });
    const [data, setData] = useState({ version: "VER.1" }); //초기값
    const [versionInfoList, setVersionInfoList] = useState([]);
    const [isOpenProjectModal, setIsOpenProjectModal] = useState(false);

    useEffect(() => {
        const sessionUser = sessionStorage.getItem("loginUser");
        const sessionUserId = JSON.parse(sessionUser)?.id;
        setUserInfo({ id: sessionUserId });
    }, []);

    useEffect(() => {
        if (projectInfo.poiId !== data.poiId) {
            setData({ ...projectInfo });
            getVersionList();
        }
    }, [projectInfo]);

    const getVersionList = async (requestData) => {
        // console.log("버전찾기 :)");
        // const resultData = await axiosFetch("/api/baseInfrm/product/pjOrdrInfo/totalListAll.do", requestData || {});
        // resultData.forEach((data) => {
        //     if(data.isSelected) {
        //         setData((prev) => ({
        //             ...prev,
        //             ['version']: data.value,
        //         }));
        //     }
        // })
        setVersionInfoList([
            { name: "ver1", placeholder: "버전을 선택하세요.", value: "VER.1" },
            { name: "ver2", placeholder: "버전을 선택하세요.", value: "VER.2" },
        ]);
    };

    const onChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value,
        }));

        returnInfo(data);
    };

    return (
        <>
            <div className="approval-form mg-b-20">
                <table className="table-styled header-width">
                    <tbody>
                        <tr>
                            <th>프로젝트명</th>
                            <td colSpan={2}>
                                <input
                                    id={uuidv4()}
                                    className="basic-input"
                                    name="poiNm"
                                    onClick={() => setIsOpenProjectModal(true)}
                                    value={data.poiNm}
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
                            <th>사전원가 버전</th>
                            <td>
                                <select
                                    id={uuidv4()}
                                    className="basic-input"
                                    name="version"
                                    onChange={onChange}
                                    value={data.version}
                                >
                                    {versionInfoList &&
                                        versionInfoList.map((info, index) => (
                                            <option key={index} value={info.value}>
                                                {info.value}
                                            </option>
                                        ))}
                                </select>
                            </td>
                            <th>기준연도</th>
                            <td>{data.poiMonth}</td>
                            <th>최종 수정일</th>
                            <td>{data.lastModifyDate}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default ApprovalFormSal;
