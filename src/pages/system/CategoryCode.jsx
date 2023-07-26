import React from "react";
import { Link } from "react-router-dom";
import store from "store/configureStore";
import { tabActive } from "components/tabs/TabsActions";
import ClCode from "./CodeManage/ClassificationCode/ClCode";

/** 시스템관리-코드관리-분류코드관리 */
function CategoryCode() {
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
                                store.dispatch(tabActive("권한관리"))
                            }>
                            시스템관리
                        </Link>
                    </li>
                    <li>분류코드관리</li>
                </ul>
            </div>
            <ClCode />
        </>
    );
}

export default CategoryCode;
