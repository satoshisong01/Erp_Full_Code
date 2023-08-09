import React from "react";
import { Link } from "react-router-dom";
import store from "store/configureStore";
import { tabActive } from "components/tabs/TabsActions";

export default function Location({ tableList }) {
    console.log(tableList, "ㅣㅣㅣㅣㅣㅣ");

    return (
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
                            store.dispatch(tabActive(tableList[0].title))
                        }>
                        {tableList[0].middleName}
                    </Link>
                </li>
                <li>{tableList[0].detailName}</li>
            </ul>
        </div>
    );
}
