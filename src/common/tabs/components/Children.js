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
import EmployMembers from "../../../views/referenceInfoManage/UserManagement/Employ_Member/EmployMembers";
import ConHistory from "../../../views/systemManagement/ConnectionHistory/ConHistory";
import GeneralMembers from "../../../views/referenceInfoManage/UserManagement/GeneralMember/GeneralMembers";
import EntrprsMembers from "../../../views/referenceInfoManage/UserManagement/EntrprsMember/EntrprsMembers";
import AuthorGroups from "../../../views/referenceInfoManage/UserManagement/AuthorGroup/AuthorGroups";
import OrgNzts from "../../../views/referenceInfoManage/UserManagement/OrgNzt/OrgNzts";

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
        component: <EmployMembers />,
        label: "업무 회원 관리",
        activeKey: 20,
    },
    {
        title: "사용자 관리",
        path: "/4111",
        component: <GeneralMembers />,
        label: "일반 회원 관리",
        activeKey: 21,
    },
    {
        title: "사용자 관리",
        path: "/4111",
        component: <EntrprsMembers />,
        label: "기업 회원 관리",
        activeKey: 22,
    },
    {
        title: "사용자 관리",
        path: "/4111",
        component: <AuthorGroups />,
        label: "권한 그룹 정보 관리",
        activeKey: 23,
    },
    {
        title: "사용자 관리",
        path: "/4111",
        component: <OrgNzts />,
        label: "조직 부서 정보 관리",
        activeKey: 24,
    },

    /** 코드 관리 */
    {
        title: "코드 관리",
        path: "/5111",
        component: <ClCode />,
        label: "분류코드 관리",
        activeKey: 25,
    },
    {
        title: "코드 관리",
        path: "/5222",
        component: <GroupCode />,
        label: "그룹코드 관리",
        activeKey: 26,
    },
    {
        title: "코드 관리",
        path: "/5333",
        component: <DetailCode />,
        label: "상세코드 관리",
        activeKey: 27,
    },

    /** 접속 이력관리 */
    {
        title: "접속이력 관리",
        path: "/6111",
        component: <ConHistory />,
        label: "접속이력 관리",
        activeKey: 28,
    },

    {
        component: <DataTableTest />,
        label: "Easy Tables",
        activeKey: 29,
    },
    {
        component: <DatatablesOrg />,
        label: "Data Tables",
        activeKey: 30,
    },
    {
        component: <NormalTables />,
        label: "Normal Tables",
        activeKey: 31,
    },
];
