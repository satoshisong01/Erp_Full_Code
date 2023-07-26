import React from "react";
import { Link } from "react-router-dom";
import store from "store/configureStore";
import { tabActive } from "components/tabs/TabsActions";
import ProductGroups from "./Products/ProductGroup/ProductGroups";

/** 기준정보관리-품목관리-품목그룹관리 */
function ItemGroupMgmt() {
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
                    <li>품목그룹관리</li>
                </ul>
            </div>
            <ProductGroups />
        </>
    );
}

export default ItemGroupMgmt;
