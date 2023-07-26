import React from "react";
import { Link } from "react-router-dom";
import store from "store/configureStore";
import { tabActive } from "components/tabs/TabsActions";
import { default as EgovLeftNav } from "components/leftmenu/EgovLeftNavExecution";
import ExcutionCosts from "./excutionCost/ExcutionCosts";

/** 실행관리-실행원가 */
function ExecutionCost() {
    return (
        <>
            <div className="location">
                <ul>
                    <li>
                        <Link to="" className="home">
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            to=""
                            onClick={(e) =>
                                store.dispatch(tabActive("실행원가"))
                            }>
                            실행관리
                        </Link>
                    </li>
                    <li>실행원가</li>
                </ul>
            </div>
            <ExcutionCosts />
        </>
    );
}

export default ExecutionCost;
