import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { tabActive } from 'components/tabs/TabsActions';
import NavLinkTabs from 'components/tabs/NavLinkTabs';
import store from 'store/configureStore';

function EgovLeftNavSystem(props) {
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
        { label: '권한관리',     subMenus: [] },
        { label: '메뉴관리',     subMenus: [{ label: '메뉴정보관리' }, { label: '프로그램목록관리' }] },
        { label: '게시판관리',   subMenus: [{ label: '게시물관리' }, { label: '게시판마스터관리' }, { label: '게시판열람권한관리' }] },
        { label: '코드관리',     subMenus: [{ label: '분류코드관리' }, { label: '그룹코드관리' }, { label: '상세코드관리' }] },
        { label: '접속이력관리', subMenus: [] },
    ];

    return (
        <div className="layout">
            <div className="nav">
                <div className="inner">
                    <h2>시스템관리</h2>
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
}

const mapStateToProps = (data) => ({
  label: data.tabs.label,
  selectLabel: data.tabs.selectLabel,
});

export default connect(mapStateToProps)(EgovLeftNavSystem);
