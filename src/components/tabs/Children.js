import React from "react";
import URL from "constants/url";

//기준정보관리
import ItemGroupMgmt from "pages/reference/ItemGroupMgmt";
import ItemDetailMgmt from "pages/reference/ItemDetailMgmt";
import CustomerMgmt from "pages/reference/CustomerMgmt";
import PartnerMgmt from "pages/reference/PartnerMgmt";
import BusinessMgmt from "pages/reference/BusinessMgmt";
import WorkMemberMgmt from "pages/reference/WorkMemberMgmt";
import RegularMemberMgmt from "pages/reference/RegularMemberMgmt";
import EnterpriseMemberMgmt from "pages/reference/EnterpriseMemberMgmt";
import PermissionGroupMgmt from "pages/reference/PermissionGroupMgmt";
import OrganizationMgmt from "pages/reference/OrganizationMgmt";
import LaborRate from "pages/reference/LaborRate";
import GradeWageLaborCost from "pages/reference/GradeWageLaborCost";
import GradeWageExpense from "pages/reference/GradeWageExpense";
import CostIndex from "pages/reference/CostIndex";
//영업관리
import OrderMgmt from "pages/sales/OrderMgmt";
import OrderPlanMgmt from "pages/sales/OrderPlanMgmt";
import SalesExpenses from "pages/sales/SalesExpenses";
import Quotation from "pages/sales/Quotation";
//import InvoiceMgmt from 'pages/sales/InvoiceMgmt';
//import ElectronicTaxInvoice from 'pages/sales/ElectronicTaxInvoice';
//실행관리
import ExecutionCost from "pages/execution/ExecutionCost";
import LaborCostMgmt from "pages/execution/LaborCostMgmt";
import PurchasingMgmt from "pages/execution/PurchasingMgmt";
import ExpenseMgmt from "pages/execution/ExpenseMgmt";
import Approval from "pages/execution/Approval";
//시스템관리
import MenuInfo from "pages/system/menuMgmt/MenuInfo";
import ProgramList from "pages/system/ProgramList";
import PostMgmt from "pages/system/PostMgmt";
import BoardMaster from "pages/system/BoardMaster";
import Comment from "pages/system/Comment";
import BoardViewing from "pages/system/BoardViewing";
import CategoryCode from "pages/system/CategoryCode";
import GroupCode from "pages/system/GroupCode";
import DetailCode from "pages/system/DetailCode";
import AccessHistoryMgmt from "pages/system/AccessHistoryMgmt";
import AuthorizationMgmt from "pages/system/AuthorizationMgmt";
import ClCode from "pages/system/CodeManage/ClassificationCode/ClCode";
import DraftQuotation from "pages/execution/DraftQuotation";

export const reference = [
    //기준정보관리
    {
        title: "ItemGroupMgmt",
        path: URL.ItemGroupMgmt,
        component: <ItemGroupMgmt />,
        label: "품목그룹관리",
        pLabel: "기준정보관리",
        activeKey: 100,
    },
    {
        title: "ItemDetailMgmt",
        path: URL.ItemDetailMgmt,
        component: <ItemDetailMgmt />,
        label: "품목상세관리",
        pLabel: "기준정보관리",
        activeKey: 101,
    },
    {
        title: "CustomerMgmt",
        path: URL.CustomerMgmt,
        component: <CustomerMgmt />,
        label: "고객사",
        pLabel: "기준정보관리",
        activeKey: 102,
    },
    {
        title: "PartnerMgmt",
        path: URL.PartnerMgmt,
        component: <PartnerMgmt />,
        label: "협력사",
        pLabel: "기준정보관리",
        activeKey: 103,
    },
    {
        title: "BusinessMgmt",
        path: URL.BusinessMgmt,
        component: <BusinessMgmt />,
        label: "사업장관리",
        pLabel: "기준정보관리",
        activeKey: 104,
    },
    {
        title: "WorkMemberMgmt",
        path: URL.WorkMemberMgmt,
        component: <WorkMemberMgmt />,
        label: "업무회원관리",
        pLabel: "기준정보관리",
        activeKey: 105,
    },
    {
        title: "RegularMemberMgmt",
        path: URL.RegularMemberMgmt,
        component: <RegularMemberMgmt />,
        label: "일반회원관리",
        pLabel: "기준정보관리",
        activeKey: 106,
    },
    {
        title: "EnterpriseMemberMgmt",
        path: URL.EnterpriseMemberMgmt,
        component: <EnterpriseMemberMgmt />,
        label: "기업회원관리",
        pLabel: "기준정보관리",
        activeKey: 107,
    },
    {
        title: "PermissionGroupMgmt",
        path: URL.PermissionGroupMgmt,
        component: <PermissionGroupMgmt />,
        label: "권한그룹정보관리",
        pLabel: "기준정보관리",
        activeKey: 108,
    },
    {
        title: "OrganizationMgmt",
        path: URL.OrganizationMgmt,
        component: <OrganizationMgmt />,
        label: "조직부서정보관리",
        pLabel: "기준정보관리",
        activeKey: 109,
    },
    {
        title: "LaborRate",
        path: URL.LaborRate,
        component: <LaborRate />,
        label: "인건비단가",
        pLabel: "기준정보관리",
        activeKey: 110,
    },
    {
        title: "GradeWageLaborCost",
        path: URL.GradeWageLaborCost,
        component: <GradeWageLaborCost />,
        label: "급별단가(인건비)",
        pLabel: "기준정보관리",
        activeKey: 111,
    },
    {
        title: "GradeWageExpense",
        path: URL.GradeWageExpense,
        component: <GradeWageExpense />,
        label: "급별단가(경비)",
        pLabel: "기준정보관리",
        activeKey: 112,
    },
    {
        title: "CostIndex",
        path: URL.CostIndex,
        component: <CostIndex />,
        label: "사전원가지표",
        pLabel: "기준정보관리",
        activeKey: 113,
    },
];
export const sales = [
    //영업관리
    {
        title: "OrderMgmt",
        path: URL.OrderMgmt,
        component: <OrderMgmt />,
        label: "수주등록관리",
        pLabel: "영업관리",
        activeKey: 200,
    },
    {
        title: "OrderPlanMgmt",
        path: URL.OrderPlanMgmt,
        component: <OrderPlanMgmt />,
        label: "수주계획관리",
        pLabel: "영업관리",
        activeKey: 201,
    },
    {
        title: "SalesExpenses",
        path: URL.SalesExpenses,
        component: <SalesExpenses />,
        label: "영업비용",
        pLabel: "영업관리",
        activeKey: 202,
    },
    // {
    //     title: "Quotation",
    //     path: URL.Quotation,
    //     component: <Quotation />,
    //     label: "견적서관리",
    //     activeKey: 203,
    // },
    //{
    //    title: "InvoiceMgmt",
    //    path: URL.InvoiceMgmt,
    //    component: <InvoiceMgmt />,
    //    label: "세금계산서발행관리",
    //    activeKey: 204,
    //},
    //{
    //    title: "ElectronicTaxInvoice",
    //    path: URL.ElectronicTaxInvoice,
    //    component: <ElectronicTaxInvoice />,
    //    label: "전자세금계산서관리",
    //    activeKey: 205,
    //}
];
export const execution = [
    //실행관리
    {
        title: "DraftQuotation",
        path: URL.DraftQuotation,
        component: <DraftQuotation />,
        label: "사전원가(초안)관리",
        pLabel: "실행관리",
        activeKey: 300,
    },
    {
        title: "ExecutionCost",
        path: URL.ExecutionCost,
        component: <ExecutionCost />,
        label: "실행원가관리",
        pLabel: "실행관리",
        activeKey: 301,
    },
    {
        title: "LaborCostMgmt",
        path: URL.LaborCostMgmt,
        component: <LaborCostMgmt />,
        label: "인건비관리",
        pLabel: "실행관리",
        activeKey: 302,
    },
    {
        title: "PurchasingMgmt",
        path: URL.PurchasingMgmt,
        component: <PurchasingMgmt />,
        label: "구매관리",
        pLabel: "실행관리",
        activeKey: 303,
    },
    {
        title: "ExpenseMgmt",
        path: URL.ExpenseMgmt,
        component: <ExpenseMgmt />,
        label: "경비관리",
        pLabel: "실행관리",
        activeKey: 304,
    },
    //{
    //    title: "Approval",
    //    path: URL.Approval,
    //    component: <Approval />,
    //    label: "전자결재",
    //    pLabel: "실행관리",
    //    activeKey: 305,
    //},
];
export const system = [
    //시스템관리
    {
        title: "MenuInfo",
        path: URL.MenuInfo,
        component: <MenuInfo />,
        label: "메뉴정보관리",
        pLabel: "시스템관리",
        activeKey: 400,
    },
    {
        title: "ProgramList",
        path: URL.ProgramList,
        component: <ProgramList />,
        label: "프로그램목록관리",
        pLabel: "시스템관리",
        activeKey: 401,
    },
    {
        title: "AuthorizationMgmt",
        path: URL.AuthorizationMgmt,
        component: <AuthorizationMgmt />,
        label: "권한관리",
        pLabel: "시스템관리",
        activeKey: 402,
    },
    {
        title: "CategoryCode",
        path: URL.CategoryCode,
        component: <CategoryCode />,
        label: "분류코드관리",
        pLabel: "시스템관리",
        activeKey: 403,
    },
    {
        title: "GroupCode",
        path: URL.GroupCode,
        component: <GroupCode />,
        label: "그룹코드관리",
        pLabel: "시스템관리",
        activeKey: 404,
    },
    {
        title: "DetailCode",
        path: URL.DetailCode,
        component: <DetailCode />,
        label: "상세코드관리",
        pLabel: "시스템관리",
        activeKey: 405,
    },
    // {
    //     title: "AccessHistoryMgmt",
    //     path: URL.AccessHistoryMgmt,
    //     component: <AccessHistoryMgmt />,
    //     label: "접속이력관리",
    //     activeKey: 410,
    // },

    // {
    //     title: "PostMgmt",
    //     path: URL.PostMgmt,
    //     component: <PostMgmt />,
    //     label: "게시물관리",
    //     activeKey: 403,
    // },
    // {
    //     title: "BoardMaster",
    //     path: URL.BoardMaster,
    //     component: <BoardMaster />,
    //     label: "게시판마스터관리",
    //     activeKey: 404,
    // },
    // {
    //     title: "Comment",
    //     path: URL.Comment,
    //     component: <Comment />,
    //     label: "댓글관리",
    //     activeKey: 405,
    // },
    // {
    //     title: "BoardViewing",
    //     path: URL.BoardViewing,
    //     component: <BoardViewing />,
    //     label: "게시판열람권한관리",
    //     activeKey: 406,
    // },
];

export const Children = [...reference, ...sales, ...execution, ...system];
