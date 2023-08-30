import React from "react";
import { Link } from "react-router-dom";
import store from "store/configureStore";
import { selectLnb } from "components/tabs/TabsActions";

export default function Location({ tableList }) {
    return (
        <div className="location mg-b-20">
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
                            store.dispatch(selectLnb(tableList[0].title))
                        }>
                        {tableList[0].middleName}
                    </Link>
                </li>
                <li>{tableList[0].detailName}</li>
            </ul>
        </div>
    );
}
