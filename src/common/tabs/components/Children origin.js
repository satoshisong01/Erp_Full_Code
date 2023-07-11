import React from "react";

import CommonCodeManagement1 from "../../../views/sysadmin/CommonCodeManagement1";
import CommonCodeManagement2 from "../../../views/sysadmin/CommonCodeManagement2";
import ErrorlogManagement from "../../../views/sysadmin/ErrorlogManagement";
import MenuUi from "../../../views/sysadmin/MenuUi";
import UserManagementInfo from "../../../views/sysadmin/UserManagementInfo";
import UserManagement from "../../../views/sysadmin/UserManagement";
import DataTableTest from "../../../views/tables/DataTable";
import DatatablesOrg from "../../../views/tables/components/Datatables";
import NormalTables from "../../../views/tables/components/NormalTables";
import EasyTables from "../../../views/tables/components/EasyTables";

import AuthorManage from "../../../views/systemManagement/AuthorManage/AuthorManage";
import ClCode from "../../../views/systemManagement/CodeManage/ClassificationCode/ClCode";
import GroupCode from "../../../views/systemManagement/CodeManage/GroupCode/GroupCode";
import DetailCode from "../../../views/systemManagement/CodeManage/DetailCode/DetailCode";
import UserManage from '../../../views/systemManagement/UserManage/UserManage';
import ConHistory from '../../../views/systemManagement/ConnectionHistory/ConHistory';

export const Children = [
    /** 사전 원가 */
    {
        title: "사전원가",
        path: "/",
        component: <CommonCodeManagement1 />,
        label: "프로젝트 등록",
        activeKey: 0,
    },
    {
        title: "사전원가",
        path: "/",
        component: <CommonCodeManagement2 />,
        label: "재료비 내역",
        activeKey: 1,
    },
    {
        title: "사전원가",
        path: "/",
        component: <CommonCodeManagement2 />,
        label: "개별 외주비 내역",
        activeKey: 2,
    },
    {
        title: "사전원가",
        path: "/",
        component: <CommonCodeManagement2 />,
        label: "월별 인건비 계획",
        activeKey: 3,
    },
    {
        title: "사전원가",
        path: "/",
        component: <CommonCodeManagement2 />,
        label: "경비 내역(관리자)",
        activeKey: 4,
    },
    {
        title: "사전원가",
        path: "/",
        component: <CommonCodeManagement2 />,
        label: "경비 내역(사용자)",
        activeKey: 5,
    },
    {
        title: "사전원가",
        path: "/",
        component: <CommonCodeManagement2 />,
        label: "급별 단가(경비/인건비) 내역",
        activeKey: 6,
    },
    {
        title: "사전원가",
        path: "/",
        component: <CommonCodeManagement2 />,
        label: "사전원가지표",
        activeKey: 7,
    },

    /** 시스템 관리 */

    {
        title: "시스템 관리",
        path: "/sysadmin/commonCodeManagement1",
        component: <CommonCodeManagement1 />,
        label: "공통코드관리1",
        activeKey: 8,
    },
    {
        title: "시스템 관리",
        path: "/sysadmin/commonCodeManagement2",
        component: <CommonCodeManagement2 />,
        label: "공통코드관리2",
        activeKey: 9,
    },
    {
        title: "시스템 관리",
        path: "/sysadmin/Test",
        component: <MenuUi />,
        label: "메뉴 관리",
        activeKey: 10,
    },
    {
        title: "시스템 관리",
        path: "/sysadmin/userManagement",
        component: <UserManagement />,
        label: "사용자 관리",
        activeKey: 11,
    },
    {
        title: "시스템 관리",
        path: "/sysadmin/errorlogManagement",
        component: <ErrorlogManagement />,
        label: "에러로그 관리",
        activeKey: 12,
    },
    {
        title: "시스템 관리",
        path: "/sysadmin/Test",
        component: <UserManagementInfo />,
        label: "급별 단가(경비/인건비) 내역",
        activeKey: 13,
    },

    /** 메뉴관리 */
    {
        title: "메뉴 관리",
        path: "/1111",
        component: <AuthorManage />,
        label: "메뉴 관리",
        activeKey: 14,
    },

    /** 게시판관리 */
    {
        title: "게시판 관리",
        path: "/2111",
        component: <AuthorManage />,
        label: "게시물 관리",
        activeKey: 15,
    },
    {
        title: "게시판 관리",
        path: "/2222",
        component: <ClCode />,
        label: "게시판 마스터 관리",
        activeKey: 16,
    },
    {
        title: "게시판 관리",
        path: "/2333",
        component: <ClCode />,
        label: "댓글 관리",
        activeKey: 17,
    },
    {
        title: "게시판 관리",
        path: "/2444",
        component: <ClCode />,
        label: "열람 권한 관리",
        activeKey: 18,
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
        component: <UserManage/>,
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
        activeKey: 22,
    },
    {
        title: "코드 관리",
        path: "/5333",
        component: <DetailCode />,
        label: "상세코드 관리",
        activeKey: 23,
    },

    /** 접속 이력관리 */
    {
        title: "접속이력 관리",
        path: "/6111",
        component: <ConHistory />,
        label: "접속이력 관리",
        activeKey: 24,
    },

    {
        component: <DataTableTest />,
        label: "Easy Tables",
        activeKey: 18,
    },
    {
        component: <DatatablesOrg />,
        label: "Data Tables",
        activeKey: 19,
    },
    {
        component: <NormalTables />,
        label: "Normal Tables",
        activeKey: 20,
    },
];
