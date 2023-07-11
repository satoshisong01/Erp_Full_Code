import Loadable from "react-loadable";
import { Loading } from "../../common/navigation";

const ClCode = Loadable({
    loader: () =>
        import("../systemManagement/CodeManage/ClassificationCode/ClCode"),
    loading: Loading,
});

const GroupCode = Loadable({
    loader: () => import("../systemManagement/CodeManage/GroupCode/GroupCode"),
    loading: Loading,
});

const DetailCode = Loadable({
    loader: () =>
        import("../systemManagement/CodeManage/DetailCode/DetailCode"),
    loading: Loading,
});

const AuthorManage = Loadable({
    loader: () => import("../systemManagement/AuthorManage/AuthorManage"),
    loading: Loading,
});

const ConHistory = Loadable({
  loader: () => import("../systemManagement/ConnectionHistory/ConHistory"),
  loading: Loading,
});

const UserManage = Loadable({
  loader: () => import("../systemManagement/UserManage/UserManage"),
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
           component: ClCode,
           name: "ClCode",
         },
         {
           path: "/aaa11",
           exact: true,
           component: GroupCode,
           name: "GroupCode",
         },
         {
           path: "/aaa22",
           exact: true,
           component: DetailCode,
           name: "DetailCode",
         },
         {
           path: "/bbb",
           exact: true,
           component: AuthorManage,
           name: "AuthorManage",
         },
         {
           path: "/ccc",
           exact: true,
           component: ConHistory,
           name: "ConHistory",
         },
         {
           path: "/ddd",
           exact: true,
           component: UserManage,
           name: "UserManage",
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
