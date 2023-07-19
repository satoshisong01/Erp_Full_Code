import React from 'react';
import { NavLink } from 'react-router-dom';
import URL from 'constants/url';

function EgovLeftNavReference() {
    return (
        <div className="layout">
            <div className="nav">
                <div className="inner">
                    <h2>기준정보관리</h2>
                    <ul className="menu4">
                        <li>
                            <NavLink to={URL.ItemGroupMgmt} className={({ isActive }) => (isActive ? "cur" : "")}>품목관리</NavLink>
                            <ul>
                                <li><NavLink to={URL.ItemGroupMgmt} className={({ isActive }) => (isActive ? "cur" : "")}>품목그룹관리</NavLink></li>
                                <li><NavLink to={URL.ItemDetailMgmt} className={({ isActive }) => (isActive ? "cur" : "")}>품목상세관리</NavLink></li>
                            </ul>
                        </li>
                        <li>
                            <NavLink to={URL.CustomerMgmt} className={({ isActive }) => (isActive ? "cur" : "")}>거래처관리</NavLink>
                            <ul>
                                <li><NavLink to={URL.CustomerMgmt} className={({ isActive }) => (isActive ? "cur" : "")}>고객사</NavLink></li>
                                <li><NavLink to={URL.PartnerMgmt} className={({ isActive }) => (isActive ? "cur" : "")}>협력사</NavLink></li>
                            </ul>
                        </li>
                        <li>
                            <NavLink to={URL.BusinessMgmt} className={({ isActive }) => (isActive ? "cur" : "")}>사업장관리</NavLink>
                        </li>
                        <li>
                            <NavLink to={URL.WorkMemberMgmt} className={({ isActive }) => (isActive ? "cur" : "")}>사용자관리</NavLink>
                            <ul>
                                <li><NavLink to={URL.WorkMemberMgmt} className={({ isActive }) => (isActive ? "cur" : "")}>업무회원관리</NavLink></li>
                                <li><NavLink to={URL.RegularMemberMgmt} className={({ isActive }) => (isActive ? "cur" : "")}>일반회원관리</NavLink></li>
                                <li><NavLink to={URL.EnterpriseMemberMgmt} className={({ isActive }) => (isActive ? "cur" : "")}>기업회원관리</NavLink></li>
                                <li><NavLink to={URL.PermissionGroupMgmt} className={({ isActive }) => (isActive ? "cur" : "")}>권한그룹정보관리</NavLink></li>
                                <li><NavLink to={URL.OrganizationMgmt} className={({ isActive }) => (isActive ? "cur" : "")}>조직부서정보관리</NavLink></li>
                            </ul>
                        </li>
                        <li>
                            <NavLink to={URL.LaborRate} className={({ isActive }) => (isActive ? "cur" : "")}>원가기준관리</NavLink>
                            <ul>
                                <li><NavLink to={URL.LaborRate} className={({ isActive }) => (isActive ? "cur" : "")}>인건비요율</NavLink></li>
                                <li><NavLink to={URL.GradeWageLaborCost} className={({ isActive }) => (isActive ? "cur" : "")}>급별단가(인건비)</NavLink></li>
                                <li><NavLink to={URL.GradeWageExpense} className={({ isActive }) => (isActive ? "cur" : "")}>급별단가(경비)</NavLink></li>
                                <li><NavLink to={URL.CostIndex} className={({ isActive }) => (isActive ? "cur" : "")}>사전원가지표</NavLink></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default EgovLeftNavReference;
