import React from "react";
import { Link } from "react-router-dom";
import store from "store/configureStore";
import { tabActive } from "components/tabs/TabsActions";
import { default as EgovLeftNav } from "components/leftmenu/EgovLeftNavReference";
import GeneralMembers from "./UserManagement/GeneralMember/GeneralMembers";

/** 기준정보관리-원가기준관리-일반회원관리 */
function RegularMemberMgmt() {
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
            <GeneralMembers />
        </>
    );
}

export default RegularMemberMgmt;
