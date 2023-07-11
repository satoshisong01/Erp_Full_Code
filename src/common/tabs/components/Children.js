import React from "react";

// import CommonCodeManagement1 from "../../../views/sysadmin/CommonCodeManagement1";
// import CommonCodeManagement2 from "../../../views/sysadmin/CommonCodeManagement2";
// import ErrorlogManagement from "../../../views/sysadmin/ErrorlogManagement";
// import MenuUi from "../../../views/sysadmin/MenuUi";
// import UserManagementInfo from "../../../views/sysadmin/UserManagementInfo";
// import UserManagement from "../../../views/sysadmin/UserManagement";
import DataTableTest from "../../../views/tables/DataTable";
import DatatablesOrg from "../../../views/tables/components/Datatables";
import NormalTables from "../../../views/tables/components/NormalTables";
// import EasyTables from "../../../views/tables/components/EasyTables";

import AuthorManage from "../../../views/systemManagement/AuthorManage/AuthorManage";
import ClCode from "../../../views/systemManagement/CodeManage/ClassificationCode/ClCode";
import GroupCode from "../../../views/systemManagement/CodeManage/GroupCode/GroupCode";
import DetailCode from "../../../views/systemManagement/CodeManage/DetailCode/DetailCode";
import UserManage from "../../../views/systemManagement/UserManage/UserManage";
import ConHistory from "../../../views/systemManagement/ConnectionHistory/ConHistory";

export const Children = [
    /** 사전 원가 */

    /** 메뉴관리 */
    {
        title: "메뉴 관리",
        path: "/",
        component: <AuthorManage />,
        label: "메뉴 관리",
        activeKey: 0,
    },

    /** 게시판관리 */
    {
        title: "게시판 관리",
        path: "/1",
        component: <AuthorManage />,
        label: "게시물 관리",
        activeKey: 1,
    },
    {
        title: "게시판 관리",
        path: "/2222",
        component: <ClCode />,
        label: "게시판 마스터 관리",
        activeKey: 2,
    },
    {
        title: "게시판 관리",
        path: "/2333",
        component: <ClCode />,
        label: "댓글 관리",
        activeKey: 3,
    },
    {
        title: "게시판 관리",
        path: "/2444",
        component: <ClCode />,
        label: "열람 권한 관리",
        activeKey: 4,
    },

    /** 권한 관리 */
    {
        title: "권한 관리",
        path: "/3111",
        component: <AuthorManage />,
        label: "권한 관리",
        activeKey: 19,
    },

    /** 사용자관리 */
    {
        title: "사용자 관리",
        path: "/4111",
        component: <UserManage />,
        label: "사용자 관리",
        activeKey: 20,
    },

    /** 코드 관리 */
    {
        title: "코드 관리",
        path: "/5111",
        component: <ClCode />,
        label: "분류코드 관리",
        activeKey: 21,
    },
    {
        title: "코드 관리",
        path: "/5222",
        component: <GroupCode />,
        label: "그룹코드 관리",
        activeKey: 5,
    },
    {
        title: "코드 관리",
        path: "/5333",
        component: <DetailCode />,
        label: "상세코드 관리",
        activeKey: 6,
    },

    /** 접속 이력관리 */
    {
        title: "접속이력 관리",
        path: "/6111",
        component: <ConHistory />,
        label: "접속이력 관리",
        activeKey: 7,
    },

    {
        component: <DataTableTest />,
        label: "Easy Tables",
        activeKey: 8,
    },
    {
        component: <DatatablesOrg />,
        label: "Data Tables",
        activeKey: 9,
    },
    {
        component: <NormalTables />,
        label: "Normal Tables",
        activeKey: 10,
    },
];
