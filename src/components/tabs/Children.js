import React from 'react';
import URL from 'constants/url';

//기준정보관리
import ItemGroupMgmt from 'pages/reference/ItemGroupMgmt';
import ItemDetailMgmt from 'pages/reference/ItemDetailMgmt';
import CustomerMgmt from 'pages/reference/CustomerMgmt';
import PartnerMgmt from 'pages/reference/PartnerMgmt';
import BusinessMgmt from 'pages/reference/BusinessMgmt';
import WorkMemberMgmt from 'pages/reference/WorkMemberMgmt';
import RegularMemberMgmt from 'pages/reference/RegularMemberMgmt';
import EnterpriseMemberMgmt from 'pages/reference/EnterpriseMemberMgmt';
import PermissionGroupMgmt from 'pages/reference/PermissionGroupMgmt';
import OrganizationMgmt from 'pages/reference/OrganizationMgmt';
import LaborRate from 'pages/reference/LaborRate';
import GradeWageLaborCost from 'pages/reference/GradeWageLaborCost';
import GradeWageExpense from 'pages/reference/GradeWageExpense';
import CostIndex from 'pages/reference/CostIndex';
//영업관리
import OrderMgmt from 'pages/sales/OrderMgmt';            
import SalesExpenses from 'pages/sales/SalesExpenses';        
import Quotation from 'pages/sales/Quotation';            
import InvoiceMgmt from 'pages/sales/InvoiceMgmt';          
import ElectronicTaxInvoice from 'pages/sales/ElectronicTaxInvoice'; 
//실행관리
import ExecutionCost from 'pages/execution/ExecutionCost';        
import LaborCostMgmt from 'pages/execution/LaborCostMgmt';        
import PurchasingMgmt from 'pages/execution/PurchasingMgmt';       
import ExpenseMgmt from 'pages/execution/ExpenseMgmt';          
import Approval from 'pages/execution/Approval';   
//시스템관리          
import AuthorizationMgmt from 'pages/system/AuthorizationMgmt/AuthorizationMgmt';    
import MenuInfo from 'pages/system/menuMgmt/MenuInfo';           
import ProgramList from 'pages/system/ProgramList';          
import PostMgmt from 'pages/system/PostMgmt';             
import BoardMaster from 'pages/system/BoardMaster';          
import Comment from 'pages/system/Comment';              
import BoardViewing from 'pages/system/BoardViewing';         
import CategoryCode from 'pages/system/CategoryCode';         
import GroupCode from 'pages/system/GroupCode';            
import DetailCode from 'pages/system/DetailCode';           
import AccessHistoryMgmt from 'pages/system/AccessHistoryMgmt';    

export const  reference = [ //기준정보관리
    {
        title: "ItemGroupMgmt",
        path: URL.ItemGroupMgmt,
        component: <ItemGroupMgmt />,
        label: "품목그룹관리",
        activeKey: 0,
    },
    {
        title: "ItemDetailMgmt",
        path: URL.ItemDetailMgmt,
        component: <ItemDetailMgmt />,
        label: "품목상세관리",
        activeKey: 1,
    },
    {
        title: "CustomerMgmt",
        path: URL.CustomerMgmt,
        component: <CustomerMgmt />,
        label: "고객사",
        activeKey: 2,
    },
    {
        title: "PartnerMgmt",
        path: URL.PartnerMgmt,
        component: <PartnerMgmt />,
        label: "협력사",
        activeKey: 3,
    },
    {
        title: "BusinessMgmt",
        path: URL.BusinessMgmt,
        component: <BusinessMgmt />,
        label: "사업장관리",
        activeKey: 4,
    },
    {
        title: "WorkMemberMgmt",
        path: URL.WorkMemberMgmt,
        component: <WorkMemberMgmt />,
        label: "업무회원관리",
        activeKey: 5,
    },
    {
        title: "RegularMemberMgmt",
        path: URL.RegularMemberMgmt,
        component: <RegularMemberMgmt />,
        label: "일반회원관리",
        activeKey: 6,
    },
    {
        title: "EnterpriseMemberMgmt",
        path: URL.EnterpriseMemberMgmt,
        component: <EnterpriseMemberMgmt />,
        label: "기업회원관리",
        activeKey: 7,
    },
    {
        title: "PermissionGroupMgmt",
        path: URL.PermissionGroupMgmt,
        component: <PermissionGroupMgmt />,
        label: "권한그룹정보관리",
        activeKey: 8,
    },
    {
        title: "OrganizationMgmt",
        path: URL.OrganizationMgmt,
        component: <OrganizationMgmt />,
        label: "조직부서정보관리",
        activeKey: 9,
    },
    {
        title: "LaborRate",
        path: URL.LaborRate,
        component: <LaborRate />,
        label: "인건비요율",
        activeKey: 10,
    },
    {
        title: "GradeWageLaborCost",
        path: URL.GradeWageLaborCost,
        component: <GradeWageLaborCost />,
        label: "급별단가(인건비)",
        activeKey: 11,
    },
    {
        title: "GradeWageExpense",
        path: URL.GradeWageExpense,
        component: <GradeWageExpense />,
        label: "급별단가(경비)",
        activeKey: 12,
    },
    {
        title: "CostIndex",
        path: URL.CostIndex,
        component: <CostIndex />,
        label: "사전원가지표",
        activeKey: 13,
    }
];
export const sales = [ //영업관리
    {
        title: "OrderMgmt",
        path: URL.OrderMgmt,
        component: <OrderMgmt />,
        label: "수주(사업)관리",
        activeKey: 14,
    },
    {
        title: "SalesExpenses",
        path: URL.SalesExpenses,
        component: <SalesExpenses />,
        label: "영업비용",
        activeKey: 15,
    },
    {
        title: "Quotation",
        path: URL.Quotation,
        component: <Quotation />,
        label: "견적서관리",
        activeKey: 16,
    },
    {
        title: "InvoiceMgmt",
        path: URL.InvoiceMgmt,
        component: <InvoiceMgmt />,
        label: "세금계산서발행관리",
        activeKey: 17,
    },
    {
        title: "ElectronicTaxInvoice",
        path: URL.ElectronicTaxInvoice,
        component: <ElectronicTaxInvoice />,
        label: "전자세금계산서관리",
        activeKey: 18,
    }
];
export const execution = [ //실행관리
    {
        title: "ExecutionCost",
        path: URL.ExecutionCost,
        component: <ExecutionCost />,
        label: "실행원가",
        activeKey: 19,
    },
    {
        title: "LaborCostMgmt",
        path: URL.LaborCostMgmt,
        component: <LaborCostMgmt />,
        label: "인건비관리",
        activeKey: 20,
    },
    {
        title: "PurchasingMgmt",
        path: URL.PurchasingMgmt,
        component: <PurchasingMgmt />,
        label: "구매관리",
        activeKey: 21,
    },
    {
        title: "ExpenseMgmt",
        path: URL.ExpenseMgmt,
        component: <ExpenseMgmt />,
        label: "경비관리",
        activeKey: 22,
    },
    {
        title: "Approval",
        path: URL.Approval,
        component: <Approval />,
        label: "전자결재",
        activeKey: 23,
    }
];
export const system = [ //시스템관리
    {
        title: "AuthorizationMgmt",
        path: URL.AuthorizationMgmt,
        component: <AuthorizationMgmt />,
        label: "권한관리",
        activeKey: 24,
    },
    {
        title: "MenuInfo",
        path: URL.MenuInfo,
        component: <MenuInfo />,
        label: "메뉴정보관리",
        activeKey: 25,
    },
    {
        title: "ProgramList",
        path: URL.ProgramList,
        component: <ProgramList />,
        label: "프로그램목록관리",
        activeKey: 26,
    },
    {
        title: "PostMgmt",
        path: URL.PostMgmt,
        component: <PostMgmt />,
        label: "게시물관리",
        activeKey: 27,
    },
    {
        title: "BoardMaster",
        path: URL.BoardMaster,
        component: <BoardMaster />,
        label: "게시판마스터관리",
        activeKey: 28,
    },
    {
        title: "Comment",
        path: URL.Comment,
        component: <Comment />,
        label: "댓글관리",
        activeKey: 29,
    },
    {
        title: "BoardViewing",
        path: URL.BoardViewing,
        component: <BoardViewing />,
        label: "게시판열람권한관리",
        activeKey: 30,
    },
    {
        title: "CategoryCode",
        path: URL.CategoryCode,
        component: <CategoryCode />,
        label: "분류코드관리",
        activeKey: 31,
    },
    {
        title: "GroupCode",
        path: URL.GroupCode,
        component: <GroupCode />,
        label: "그룹코드관리",
        activeKey: 32,
    },
    {
        title: "DetailCode",
        path: URL.DetailCode,
        component: <DetailCode />,
        label: "상세코드관리",
        activeKey: 33,
    },
    {
        title: "AccessHistoryMgmt",
        path: URL.AccessHistoryMgmt,
        component: <AccessHistoryMgmt />,
        label: "접속이력관리",
        activeKey: 34,
    }
];

export const Children = [
    ...reference,
    ...sales,
    ...execution,
    ...system
]