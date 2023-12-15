import React, { useContext, useEffect, useState } from "react";
import ModalSearch from "components/modal/ModalSearch";
import { PageContext } from "components/PageProvider";

/** 영업 폼 */
function ApprovalFormSal() {
    const { isSaveFormTable, setIsSaveFormTable, projectInfo, setIsCancelTable } = useContext(PageContext);
    const [userInfo, serUserInfo] = useState({ id: "", name: "" });

    useEffect(() => {
        const sessionUser = sessionStorage.getItem("loginUser");
        const sessionUserId = JSON.parse(sessionUser)?.id;
        serUserInfo({ id: sessionUserId });
    }, []);

    return (
        <>
            <div className="approval-form mg-b-20">
                <table className="table-styled header-width">
                    <tbody>
                        <tr>
                            <th>프로젝트명</th>
                            <td colSpan={3}>
                                <ModalSearch />
                            </td>
                                <th>기준연도</th>
                            <td colSpan={3}>
                                {projectInfo.poiMonth}
                            </td>
                        </tr>
                    </tbody>
                    <tbody>
                        <tr>
                            <th>사전원가 버전</th>
                            <td colSpan={3}>
                                {/* {versionInfo.version} */}
                            </td>
                                <th>최종 수정일</th>
                            <td colSpan={3}>
                                {/* {versionInfo.version} */}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default ApprovalFormSal;
