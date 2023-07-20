import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { tabActive } from 'components/tabs/TabsActions';
import NavLinkTabs from 'components/tabs/NavLinkTabs';
import store from 'store/configureStore';

function EgovLeftNavExecution(props) {
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
        { label: '실행원가' }, { label: '인건비관리' }, { label: '경비관리' }, { label: '구매관리' }, { label: '전자결재' },
    ];
    
    return (
        <div className="layout">
            <div className="nav">
                <div className="inner">
                    <h2>실행관리</h2>
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

const mapStateToProps = data => data.tabs

export default connect(mapStateToProps)(EgovLeftNavExecution);