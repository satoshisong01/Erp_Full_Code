import React from "react";
import { Link } from "react-router-dom";
import store from "store/configureStore";
import { tabActive } from "components/tabs/TabsActions";
import DataTable from "components/DataTable";

/** 시스템관리-코드관리-분류코드관리 */
function CategoryCode() {
    const columns = [
        { header: "분류코드", col: "clCode" },
        { header: "분류코드명", col: "clCodeNm" },
        { header: "분류코드설명", col: "clCodeDc" },
        { header: "작성자", col: "createIdBy" },
        { header: "작성일", col: "createDate" },
        { header: "수정자", col: "lastModifiedIdBy" },
        { header: "수정일", col: "lastModifyDate" },
    ];

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
            {/*<DataTable
                columns={columns}
                suffixUrl="/system/code"
                currentPage="clCode"
            />*/}
        </>
    );
}

export default CategoryCode;
