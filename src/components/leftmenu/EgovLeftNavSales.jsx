import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { selectSnb } from 'components/tabs/TabsActions';
import NavLinkTabs from 'components/tabs/NavLinkTabs';
import store from 'store/configureStore';

function EgovLeftNavSales(props) {
    const {lnbLabel, snbLabel} = props;
    const [activeSub, setActiveSub] = useState('');
    const [activeLabel, setActiveLabel] = useState('');

    /* header 또는 tabs에서 선택된 라벨을 저장  */
    useEffect(() => {
        const propsLabel = lnbLabel || snbLabel;
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
        setActiveSub(lnbLabel || snbLabel);
        if(activeLabel !== parentLabel) setActiveLabel(parentLabel);
    }, [lnbLabel, snbLabel]);

    const clickHandle = (label, sub) => {
        setActiveSub(sub)
        setActiveLabel(label)
        store.dispatch(selectSnb(sub));
    };

    const menuItems = [
        { label: '수주(사업)관리', subMenus: [{ label: '수주등록관리' }, { label: '수주계획관리' }] }, { label: '영업비용', subMenus: [] },
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
                                                    onClick={(e) => clickHandle(menuItem.label, subMenu.label)}
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

const mapStateToProps = data => data.tabs
export default connect(mapStateToProps)(EgovLeftNavSales);