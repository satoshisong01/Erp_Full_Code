import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { tabActive } from 'components/tabs/TabsActions';
import NavLinkTabs from 'components/tabs/NavLinkTabs';
import store from 'store/configureStore';

function EgovLeftNavSales(props) {
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
        { label: '수주(사업)관리' }, { label: '영업비용' }, { label: '견적서관리' }, { label: '전자세금계산서관리' }
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
                                    onClick={(e) => clickHandle(e, menuItem.label)}
                                    activeName={activeName}
                                >
                                    {menuItem.label}
                                </NavLinkTabs>
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