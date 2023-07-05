import Loadable from "react-loadable";
import { Loading } from "../../common/navigation";

const ClassificationCode = Loadable({
    loader: () => import("./ClassificationCode"),
    loading: Loading,
});

const CommonCodeManagement1 = Loadable({
    loader: () => import("./CommonCodeManagement1"),
    loading: Loading,
});

const CommonCodeManagement2 = Loadable({
    loader: () => import("./CommonCodeManagement2"),
    loading: Loading,
});

const ErrorlogManagement = Loadable({
    loader: () => import("./ErrorlogManagement"),
    loading: Loading,
});

const MenuUi = Loadable({
    loader: () => import("./MenuUi"),
    loading: Loading,
});

const ProgramManagement = Loadable({
    loader: () => import("./ProgramManagement"),
    loading: Loading,
});

const Test = Loadable({
    loader: () => import("./Test"),
    loading: Loading,
});

const UserManagement = Loadable({
    loader: () => import("./UserManagement"),
    loading: Loading,
});

const UserManagementInfo = Loadable({
    loader: () => import("./UserManagementInfo"),
    loading: Loading,
});

export const routes = [
    {
        path: "/aaa",
        exact: true,
        component: ClassificationCode,
        name: "ClassificationCode",
    },
    {
        path: "/sysadmin/commonCodeManagement1",
        exact: true,
        component: CommonCodeManagement1,
        name: "CommonCodeManagement1",
    },
    {
        path: "/sysadmin/commonCodeManagement2",
        exact: true,
        component: CommonCodeManagement2,
        name: "CommonCodeManagement2",
    },
    {
        path: "/sysadmin/errorlogManagement",
        exact: true,
        component: ErrorlogManagement,
        name: "ErrorlogManagement",
    },
    {
        path: "/sysadmin/menuUi",
        exact: true,
        component: MenuUi,
        name: "MenuUi",
    },
    {
        path: "/sysadmin/programManagement",
        exact: true,
        component: ProgramManagement,
        name: "ProgramManagement",
    },
    {
        path: "/sysadmin/test",
        exact: true,
        component: Test,
        name: "Test",
    },
    {
        path: "/sysadmin/userManagement",
        exact: true,
        component: UserManagement,
        name: "UserManagement",
    },
    {
        path: "/sysadmin/userManagementInfo",
        exact: true,
        component: UserManagementInfo,
        name: "UserManagementInfo",
    },
];
