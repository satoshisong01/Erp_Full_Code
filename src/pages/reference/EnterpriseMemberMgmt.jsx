import React from "react";
import { Link } from "react-router-dom";
import store from "store/configureStore";
import { tabActive } from "components/tabs/TabsActions";
import { default as EgovLeftNav } from "components/leftmenu/EgovLeftNavReference";
import EntrprsMembers from "./UserManagement/EntrprsMember/EntrprsMembers";

/** 기준정보관리-원가기준관리-기업회원관리 */
function EnterpriseMemberMgmt() {
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
                    <li>기업회원관리</li>
                </ul>
            </div>
            <EntrprsMembers />
        </>
    );
}

export default EnterpriseMemberMgmt;
