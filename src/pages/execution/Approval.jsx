import React from "react";
import { Link } from "react-router-dom";
import store from "store/configureStore";
import { tabActive } from "components/tabs/TabsActions";
import PaymentReceiveds from "./ElectroPayment/PaymentReceived/PaymentReceiveds";

/** 시스템관리-전자결재 */
function Approval() {
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
                    <li>전자결재</li>
                </ul>
            </div>
            <PaymentReceiveds />
        </>
    );
}

export default Approval;
