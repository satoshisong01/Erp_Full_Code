import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { tabActive } from 'components/tabs/TabsActions';
import NavLinkTabs from 'components/tabs/NavLinkTabs';
import store from 'store/configureStore';

function EgovLeftNavReference(props) {
    const { label, selectLabel } = props;
    const [activeName, setActiveName] = useState('');

    useEffect(() => {
        setActiveName(selectLabel || label);
    }, [label, selectLabel]);

    const clickHandle = (e, label) => {
        const tabLabel = label || e.target.innerText;
        store.dispatch(tabActive(tabLabel));
    };

    const menuItems = [
        { label: '품목관리',     subMenus: [{ label: '품목그룹관리' }, { label: '품목상세관리' }] },
        { label: '거래처관리',   subMenus: [{ label: '고객사' }, { label: '협력사' }] },
        { label: '사업장관리',   subMenus: [] },
        { label: '사용자관리',   subMenus: [{ label: '업무회원관리' }, { label: '일반회원관리' }, { label: '기업회원관리' }, { label: '권한그룹정보관리' }, { label: '조직부서정보관리' },] },
        { label: '원가기준관리', subMenus: [{ label: '인건비요율' }, { label: '급별단가(인건비)' }, { label: '급별단가(경비)' }, { label: '사전원가지표' }] },
    ];

    return (
        <div className="layout">
            <div className="nav">
                <div className="inner">
                    <h2>기준정보관리</h2>
                    <ul className="menu4">
                        {menuItems.map((menuItem) => (
                            <li key={menuItem.label}>
                                <NavLinkTabs
                                    to="#"
                                    onClick={(e) => clickHandle(e, menuItem.subMenus[0].label || menuItem.label)}
                                    activeName={activeName}
                                >
                                    {menuItem.label}
                                </NavLinkTabs>

                                {menuItem.subMenus.length > 0 && (
                                    <ul className="menu7">
                                        {menuItem.subMenus.map((subMenu) => (
                                            <li key={subMenu.label}>
                                                <NavLinkTabs
                                                    to="#"
                                                    onClick={(e) => clickHandle(e, subMenu.label)}
                                                    activeName={activeName}
                                                >
                                                    {subMenu.label}
                                                </NavLinkTabs>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
    // return (
    //     <div className="layout">
    //         <div className="nav">
    //             <div className="inner">
    //                 <h2>기준정보관리</h2>
    //                 <ul className="menu4">
    //                     <li>
    //                         <NavLink to={URL.ItemGroupMgmt} className={({ isActive }) => (isActive ? "cur" : "")}>품목관리</NavLink>
    //                         <ul>
    //                             <li><NavLink to={URL.ItemGroupMgmt} className={({ isActive }) => (isActive ? "cur" : "")}>품목그룹관리</NavLink></li>
    //                             <li><NavLink to={URL.ItemDetailMgmt} className={({ isActive }) => (isActive ? "cur" : "")}>품목상세관리</NavLink></li>
    //                         </ul>
    //                     </li>
    //                     <li>
    //                         <NavLink to={URL.CustomerMgmt} className={({ isActive }) => (isActive ? "cur" : "")}>거래처관리</NavLink>
    //                         <ul>
    //                             <li><NavLink to={URL.CustomerMgmt} className={({ isActive }) => (isActive ? "cur" : "")}>고객사</NavLink></li>
    //                             <li><NavLink to={URL.PartnerMgmt} className={({ isActive }) => (isActive ? "cur" : "")}>협력사</NavLink></li>
    //                         </ul>
    //                     </li>
    //                     <li>
    //                         <NavLink to={URL.BusinessMgmt} className={({ isActive }) => (isActive ? "cur" : "")}>사업장관리</NavLink>
    //                     </li>
    //                     <li>
    //                         <NavLink to={URL.WorkMemberMgmt} className={({ isActive }) => (isActive ? "cur" : "")}>사용자관리</NavLink>
    //                         <ul>
    //                             <li><NavLink to={URL.WorkMemberMgmt} className={({ isActive }) => (isActive ? "cur" : "")}>업무회원관리</NavLink></li>
    //                             <li><NavLink to={URL.RegularMemberMgmt} className={({ isActive }) => (isActive ? "cur" : "")}>일반회원관리</NavLink></li>
    //                             <li><NavLink to={URL.EnterpriseMemberMgmt} className={({ isActive }) => (isActive ? "cur" : "")}>기업회원관리</NavLink></li>
    //                             <li><NavLink to={URL.PermissionGroupMgmt} className={({ isActive }) => (isActive ? "cur" : "")}>권한그룹정보관리</NavLink></li>
    //                             <li><NavLink to={URL.OrganizationMgmt} className={({ isActive }) => (isActive ? "cur" : "")}>조직부서정보관리</NavLink></li>
    //                         </ul>
    //                     </li>
    //                     <li>
    //                         <NavLink to={URL.LaborRate} className={({ isActive }) => (isActive ? "cur" : "")}>원가기준관리</NavLink>
    //                         <ul>
    //                             <li><NavLink to={URL.LaborRate} className={({ isActive }) => (isActive ? "cur" : "")}>인건비요율</NavLink></li>
    //                             <li><NavLink to={URL.GradeWageLaborCost} className={({ isActive }) => (isActive ? "cur" : "")}>급별단가(인건비)</NavLink></li>
    //                             <li><NavLink to={URL.GradeWageExpense} className={({ isActive }) => (isActive ? "cur" : "")}>급별단가(경비)</NavLink></li>
    //                             <li><NavLink to={URL.CostIndex} className={({ isActive }) => (isActive ? "cur" : "")}>사전원가지표</NavLink></li>
    //                         </ul>
    //                     </li>
    //                 </ul>
    //             </div>
    //         </div>
    //     </div>
    // );
}

const mapStateToProps = (data) => ({
    label: data.tabs.label,
    selectLabel: data.tabs.selectLabel,
});
  
export default connect(mapStateToProps)(EgovLeftNavReference);