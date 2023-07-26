import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { tabActive } from 'components/tabs/TabsActions';
import NavLinkTabs from 'components/tabs/NavLinkTabs';
import store from 'store/configureStore';

function EgovLeftNavSales(props) {
    const { label, selectLabel } = props;
    const [activeSub, setActiveSub] = useState('');
    const [activeLabel, setActiveLabel] = useState('');

    /* header 또는 tabs에서 선택된 라벨을 저장  */
    useEffect(() => {
        const propsLabel = selectLabel || label;
        let parentLabel = '';

        for (const item of menuItems) {
            if (item.label === propsLabel) {
                parentLabel = item.label;
                break;
            }
        
            for (const subMenu of item.subMenus) {
                if (subMenu.label === propsLabel) {
                    parentLabel = item.label;
                    break;
                }
            }
        }
        setActiveSub(selectLabel || label);
        if(activeLabel !== parentLabel) setActiveLabel(parentLabel);
    }, [label, selectLabel]);

    const clickHandle = (label, sub) => {
        setActiveSub(sub)
        setActiveLabel(label)
        store.dispatch(tabActive(sub));
    };

    const menuItems = [
        { label: '수주(사업)관리', subMenus: [] }, { label: '영업비용', subMenus: [] }, { label: '견적서관리', subMenus: [] }
    ];

    return (
        <div className="layout">
            <div className="nav">
                <div className="inner">
                    <h2>영업관리</h2>
                    <ul className="menu4">
                        {menuItems.map((menuItem) => (
                            <li key={menuItem.label}>
                                <NavLinkTabs
                                    to="#"
                                    onClick={(e) => clickHandle(menuItem.label, menuItem.subMenus.length > 0 ? menuItem.subMenus[0].label : menuItem.label)}
                                    activeName={activeLabel === menuItem.label ? menuItem.label : null}
                                >
                                    {menuItem.label}
                                </NavLinkTabs>

                                {menuItem.subMenus.length > 0 && (
                                    <ul className="menu7">
                                        {menuItem.subMenus.map((subMenu) => (
                                            <li key={subMenu.label}>
                                                <NavLinkTabs
                                                    to="#"
                                                    onClick={(e) => clickHandle(subMenu.label, subMenu.label)}
                                                    activeName={activeSub}
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

export default connect(mapStateToProps)(EgovLeftNavSales);