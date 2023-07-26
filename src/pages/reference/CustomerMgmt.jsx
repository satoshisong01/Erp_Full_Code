import React from "react";
import { Link } from "react-router-dom";
import store from "store/configureStore";
import { tabActive } from "components/tabs/TabsActions";
import { default as EgovLeftNav } from "components/leftmenu/EgovLeftNavReference";
import ClientCompanys from "./ClientMgmt/ClientCompany/ClientCompanys";

/** 기준정보관리-거래처관리-고객사 */
function CustomerMgmt() {
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
                    <li>고객사</li>
                </ul>
            </div>
            <ClientCompanys />
        </>
    );
}

export default CustomerMgmt;
