import React from "react";

import CommonCodeManagement1 from "../../../views/sysadmin/CommonCodeManagement1";
import CommonCodeManagement2 from "../../../views/sysadmin/CommonCodeManagement2";
import ClientManagement from "../../../views/sysadmin/ClientManagement";
import ErrorlogManagement from "../../../views/sysadmin/ErrorlogManagement";
import MenuUi from "../../../views/sysadmin/MenuUi";
import UserManagementInfo from "../../../views/sysadmin/UserManagementInfo";
import UserManagement from "../../../views/sysadmin/UserManagement";
import DataTableTest from "../../../views/tables/DataTable";
import DatatablesOrg from "../../../views/tables/components/Datatables";
import NormalTables from "../../../views/tables/components/NormalTables";
import EasyTables from "../../../views/tables/components/EasyTables";

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
        path: "/",
        component: <ClientManagement />,
        label: "거래처 관리",
        activeKey: 8,
    },
    {
        title: "시스템 관리",
        path: "/sysadmin/commonCodeManagement1",
        component: <CommonCodeManagement1 />,
        label: "공통코드관리1",
        activeKey: 9,
    },
    {
        title: "시스템 관리",
        path: "/sysadmin/commonCodeManagement2",
        component: <CommonCodeManagement2 />,
        label: "공통코드관리2",
        activeKey: 10,
    },
    {
        title: "시스템 관리",
        path: "/sysadmin/Test",
        component: <MenuUi />,
        label: "메뉴 관리",
        activeKey: 11,
    },
    {
        title: "시스템 관리",
        path: "/sysadmin/userManagement",
        component: <UserManagement />,
        label: "사용자 관리",
        activeKey: 12,
    },
    {
        title: "시스템 관리",
        path: "/sysadmin/errorlogManagement",
        component: <ErrorlogManagement />,
        label: "에러로그 관리",
        activeKey: 13,
    },
    {
        title: "시스템 관리",
        path: "/sysadmin/Test",
        component: <UserManagementInfo />,
        label: "급별 단가(경비/인건비) 내역",
        activeKey: 14,
    },

    {
        component: <DataTableTest />,
        label: "Easy Tables",
        activeKey: 15,
    },
    {
        component: <DatatablesOrg />,
        label: "Data Tables",
        activeKey: 16,
    },
    {
        component: <NormalTables />,
        label: "Normal Tables",
        activeKey: 17,
    },
];
