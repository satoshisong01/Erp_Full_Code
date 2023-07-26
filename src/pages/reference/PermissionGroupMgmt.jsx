import React from "react";
import { Link } from "react-router-dom";
import store from "store/configureStore";
import { tabActive } from "components/tabs/TabsActions";
import { default as EgovLeftNav } from "components/leftmenu/EgovLeftNavReference";
import AuthorGroups from "./UserManagement/AuthorGroup/AuthorGroups";

/** 기준정보관리-원가기준관리-권한그룹정보관리 */
function PermissionGroupMgmt() {
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
                    <li>권한그룹정보관리</li>
                </ul>
            </div>
            <AuthorGroups />
        </>
    );
}

export default PermissionGroupMgmt;
