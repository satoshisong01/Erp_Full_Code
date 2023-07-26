import React from "react";
import { Link } from "react-router-dom";
import store from "store/configureStore";
import { tabActive } from "components/tabs/TabsActions";

import { default as EgovLeftNav } from "components/leftmenu/EgovLeftNavReference";
import UnitPricePersons from "./CostPrice/UnitPricePerson/UnitPricePersons";

/** 기준정보관리-원가기준관리-급별단가(인건비) */
function GradeWageLaborCost() {
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
                    <li>급별단가(인건비)</li>
                </ul>
            </div>
            <UnitPricePersons />
        </>
    );
}

export default GradeWageLaborCost;
