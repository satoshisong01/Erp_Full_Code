import React, { useContext, useEffect, useState } from "react";
import ModalSearch from "components/modal/ModalSearch";
import { PageContext } from "components/PageProvider";

/** 실행 폼 */
function ApprovalFormExe() {
    const { isSaveFormTable, setIsSaveFormTable, projectInfo, setIsCancelTable } = useContext(PageContext);
    const [userInfo, serUserInfo] = useState({ id: "", name: "" });

    useEffect(() => {
        const sessionUser = sessionStorage.getItem("loginUser");
        const sessionUserId = JSON.parse(sessionUser)?.id;
        serUserInfo({ id: sessionUserId });
    }, []);

    return (
        <div className="approval-form">
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
                </tbody>
            </table>
        </div>
    );
}

export default ApprovalFormExe;
