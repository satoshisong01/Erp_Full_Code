import React from "react";
import { Link } from "react-router-dom";
import store from "store/configureStore";
import { tabActive } from "components/tabs/TabsActions";
import ProgramLists from "./menuMgmt/ProgramList/ProgramLists";

/** 시스템관리-게시판관리-프로그램목록관리 */
function ProgramList() {
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
                    <li>프로그램목록관리</li>
                </ul>
            </div>
            <ProgramLists />
        </>
    );
}

export default ProgramList;
