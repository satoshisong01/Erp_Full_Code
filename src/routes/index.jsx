import React, { useEffect, useState, useRef } from "react";
import { Navigate, Routes, Route, useLocation } from "react-router-dom";

import URL from "constants/url";
// import CODE from 'constants/code';

//탭
import TabContainer from "pages/main/TabContainer";

//전자결재 폼 팝업
import ApprovalForm from "components/form/ApprovalForm";

//COMMON
import EgovHeader from "components/EgovHeader";
import EgovFooter from "components/EgovFooter";
import EgovError from "components/EgovError";

import EgovMain from "pages/main/EgovMain";
import EgovLogin from "pages/login/EgovLogin";

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
import SalesExpenses from "pages/sales/SalesExpenses";
import Quotation from "pages/sales/Quotation";
//import InvoiceMgmt from "pages/sales/InvoiceMgmt";
//import ElectronicTaxInvoice from "pages/sales/ElectronicTaxInvoice";

//실행관리
import ExecutionCost from "pages/execution/ExecutionCost";
import LaborCostMgmt from "pages/execution/LaborCostMgmt";
import PurchasingMgmt from "pages/execution/PurchasingMgmt";
import ExpenseMgmt from "pages/execution/ExpenseMgmt";
import Approval from "pages/execution/Approval";

//시스템관리
import AccessHistoryMgmt from "pages/system/AccessHistoryMgmt";
import AuthorizationMgmt from "pages/system/AuthorizationMgmt";
import MenuInfo from "pages/system/menuMgmt/MenuInfo";
import ProgramList from "pages/system/ProgramList";
import PostMgmt from "pages/system/PostMgmt";
import BoardMaster from "pages/system/BoardMaster";
import Comment from "pages/system/Comment";
import BoardViewing from "pages/system/BoardViewing";
import CategoryCode from "pages/system/CategoryCode";
import GroupCode from "pages/system/GroupCode";
import DetailCode from "pages/system/DetailCode";

//ADMIN

import initPage from "js/ui";
import ApprovalContainer from "pages/approval/ApprovalContainer";

// 에러 페이지와 같은 상단(EgovHeader) 소스가 제외된 페이지에서 ui.js의 햄버거버튼 작동오류가 발생한다.
// 즉, ui.js가 작동되지 않아서 재 로딩 해야 한다. 그래서, useRef객체를 사용하여 이전 페이지 URL을 구하는 코드 추가(아래)
const usePrevLocation = (location) => {
    const prevLocRef = useRef(location);
    useEffect(() => {
        prevLocRef.current = location;
    }, [location]);
    return prevLocRef.current;
};

const RootRoutes = () => {
    //useLocation객체를 이용하여 에러페이시 이동 전 location 객체를 저장하는 코드 추가(아래 2줄) */}
    const location = useLocation();
    const prevLocation = usePrevLocation(location);

    //시스템관리 메뉴인 /admin/으로 시작하는 URL은 모두 로그인이 필요하도록 코드추가(아래)
    const isMounted = useRef(false); // 아래 로그인 이동 부분이 2번 실행되지 않도록 즉, 마운트 될 때만 실행되도록 변수 생성
    const [mounted, setMounted] = useState(false); // 컴포넌트 최초 마운트 후 리렌더링 전 로그인 페이지로 이동하는 조건으로 사용
    useEffect(() => {
        if (!isMounted.current) {
            // 컴포넌트 최초 마운트 시 페이지 진입 전(렌더링 전) 실행
            isMounted.current = true; // 컴포넌트가 2번 실행되는 것을 방지 하는 변수 사용.
            setMounted(true); // 이 값으로 true 일 때만 페이지를 렌더링이 되는 변수 사용.
            const sessionUser = sessionStorage.getItem("loginUser");
            const sessionUserSe = JSON.parse(sessionUser)?.userSe;
            const regex = /^(\/admin\/)+(.)*$/; //정규표현식 사용: /admin/~ 으로 시작하는 경로 모두 포함
            if (sessionUserSe !== "USR" && regex.test(location.pathname)) {
                setMounted(false); // 이 값으로 사이트관리 페이지를 렌더링 하지 않고 아래 로그인 페이지로 이동한다.
                alert("Login Alert");
                sessionStorage.setItem("loginUser", JSON.stringify({ id: "" }));
                window.location.href = URL.LOGIN;
            }
        }
    }, [location, mounted]); // location 경로와 페이지 마운트상태가 변경 될 때 업데이트 후 리렌더링
    if (mounted) {
        // 인증 없이 시스템관리 URL로 접근할 때 렌더링 되는 것을 방지하는 조건추가.
        return (
            <Routes>
                {" "}
                {/* 에러페지시 호출시 이전 prevUrl객체를 전송하는 코드 추가(아래) */}
                <Route
                    path={URL.ERROR}
                    element={<EgovError prevUrl={prevLocation} />}
                />
                <Route path="*" element={<SecondRoutes />} />

                {/* 새창(팝업) */}
                <Route path={URL.ApprovalContainer} element={<ApprovalContainer />} />
            </Routes>
        );
    }
};

const SecondRoutes = () => {
    const [loginVO, setLoginVO] = useState({});

    useEffect(() => {
        initPage();
    });

    return (
        <>
            <EgovHeader
                loginUser={loginVO}
                onChangeLogin={(user) => setLoginVO(user)}
            />
            <Routes>
                {/* MAIN */}
                <Route path={URL.MAIN} element={<EgovMain />} />

                {/* 탭 화면 */}
                <Route path={URL.TABS} element={<TabContainer />} />

                {/* LOGIN - URL : /login */}
                <Route
                    path={URL.LOGIN}
                    element={
                        <EgovLogin onChangeLogin={(user) => setLoginVO(user)} />
                    }
                />

                {/* ERROR */}
                <Route path={URL.ERROR} element={<EgovError />} />

                {/* 전자결재 폼 */}
                <Route path={URL.ApprovalForm} element={<ApprovalForm />} />

                {/* 기준정보관리 */}
                <Route
                    path={URL.Reference}
                    element={<Navigate to={URL.ItemGroupMgmt} />}
                />
                <Route path={URL.ItemGroupMgmt} element={<ItemGroupMgmt />} />
                <Route path={URL.ItemDetailMgmt} element={<ItemDetailMgmt />} />

                <Route path={URL.CustomerMgmt} element={<CustomerMgmt />} />
                <Route path={URL.PartnerMgmt} element={<PartnerMgmt />} />

                <Route path={URL.BusinessMgmt} element={<BusinessMgmt />} />

                <Route path={URL.WorkMemberMgmt} element={<WorkMemberMgmt />} />
                <Route
                    path={URL.RegularMemberMgmt}
                    element={<RegularMemberMgmt />}
                />
                <Route
                    path={URL.EnterpriseMemberMgmt}
                    element={<EnterpriseMemberMgmt />}
                />
                <Route
                    path={URL.PermissionGroupMgmt}
                    element={<PermissionGroupMgmt />}
                />
                <Route
                    path={URL.OrganizationMgmt}
                    element={<OrganizationMgmt />}
                />

                <Route path={URL.LaborRate} element={<LaborRate />} />
                <Route
                    path={URL.GradeWageLaborCost}
                    element={<GradeWageLaborCost />}
                />
                <Route
                    path={URL.GradeWageExpense}
                    element={<GradeWageExpense />}
                />
                <Route path={URL.CostIndex} element={<CostIndex />} />

                {/* 영업관리 */}
                <Route
                    path={URL.Sales}
                    element={<Navigate to={URL.OrderMgmt} />}
                />
                <Route path={URL.OrderMgmt} element={<OrderMgmt />} />
                <Route path={URL.SalesExpenses} element={<SalesExpenses />} />
                <Route path={URL.Quotation} element={<Quotation />} />
                {/*<Route path={URL.InvoiceMgmt} element={<InvoiceMgmt />} />*/}
                {/*<Route path={URL.ElectronicTaxInvoice} element={<ElectronicTaxInvoice />} />*/}

                {/* 실행관리 */}
                <Route
                    path={URL.Execution}
                    element={<Navigate to={URL.ExecutionCost} />}
                />
                <Route path={URL.ExecutionCost} element={<ExecutionCost />} />
                <Route path={URL.LaborCostMgmt} element={<LaborCostMgmt />} />
                <Route path={URL.PurchasingMgmt} element={<PurchasingMgmt />} />
                <Route path={URL.ExpenseMgmt} element={<ExpenseMgmt />} />
                <Route path={URL.Approval} element={<Approval />} />

                {/* 시스템관리 */}
                <Route
                    path={URL.System}
                    element={<Navigate to={URL.AuthorizationMgmt} />}
                />
                <Route
                    path={URL.AuthorizationMgmt}
                    element={<AuthorizationMgmt />}
                />
                <Route path={URL.MenuInfo} element={<MenuInfo />} />
                <Route path={URL.ProgramList} element={<ProgramList />} />
                <Route path={URL.PostMgmt} element={<PostMgmt />} />
                <Route path={URL.BoardMaster} element={<BoardMaster />} />
                <Route path={URL.Comment} element={<Comment />} />
                <Route path={URL.BoardViewing} element={<BoardViewing />} />
                <Route path={URL.CategoryCode} element={<CategoryCode />} />
                <Route path={URL.GroupCode} element={<GroupCode />} />
                <Route path={URL.DetailCode} element={<DetailCode />} />
                <Route
                    path={URL.AccessHistoryMgmt}
                    element={<AccessHistoryMgmt />}
                />

                {/* ADMIN */}
                <Route path={URL.ADMIN} element={<div>관리자페이지</div>} />
            </Routes>
            <EgovFooter />
        </>
    );
};

export default RootRoutes;
