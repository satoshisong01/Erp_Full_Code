import React from "react";
import { Link } from "react-router-dom";
import store from "store/configureStore";
import { tabActive } from "components/tabs/TabsActions";
import { default as EgovLeftNav } from "components/leftmenu/EgovLeftNavSales";
import EstimateMgmts from "./EstimateMgmt/EstimateMgmts";

/** 영업관리-견적서관리 */
function Quotation() {
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
                                store.dispatch(tabActive("수주(사업)관리"))
                            }>
                            영업관리
                        </Link>
                    </li>
                    <li>견적서관리</li>
                </ul>
            </div>
            <EstimateMgmts />
        </>
    );
}

export default Quotation;
