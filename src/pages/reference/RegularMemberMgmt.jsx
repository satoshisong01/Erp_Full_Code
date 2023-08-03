import React from "react";
import { Link } from "react-router-dom";
import store from "store/configureStore";
import { tabActive } from "components/tabs/TabsActions";
import GeneralMembers from "./UserManagement/GeneralMember/GeneralMembers";

/** 기준정보관리-원가기준관리-일반회원관리 */
function RegularMemberMgmt() {
    const columns = [
        { header: "ID", col: "mbId", cellWidth: "20%" },
        { header: "이름", col: "mbNm", cellWidth: "20%" },
        { header: "비밀번호", col: "password", cellWidth: "20%" },
        { header: "주소", col: "address", cellWidth: "20%" },
        { header: "전화번호", col: "mbTelNm", cellWidth: "20%" },
        { header: "이메일", col: "mbEmAdr", cellWidth: "20%" },
        { header: "가입일", col: "sbsDt", cellWidth: "20%" },
        { header: "작성자", col: "createIdBy", cellWidth: "20%" },
        { header: "작성일", col: "createDate", cellWidth: "20%" },
        { header: "수정자", col: "lastModifiedIdBy", cellWidth: "20%" },
        { header: "수정일", col: "lastModifyDate", cellWidth: "20%" },
    ];

    return (
        <>
            <div className="location">
                <ul>
                    <li>
                        <Link to="/" className="home">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            to=""
                            onClick={(e) =>
                                store.dispatch(tabActive("품목그룹관리"))
                            }>
                            기준정보관리
                        </Link>
                    </li>
                    <li>일반회원관리</li>
                </ul>
            </div>
            <GeneralMembers
                columns={columns}
                suffixUrl="/baseInfrm/member"
                currentPage="generalMember"
            />
        </>
    );
}

export default RegularMemberMgmt;
