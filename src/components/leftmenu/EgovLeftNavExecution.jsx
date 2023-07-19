import React from 'react';

import { NavLink } from 'react-router-dom';
import URL from 'constants/url';

function EgovLeftNavExecution() {
    
    return (
        <div className="layout">
            <div className="nav">
                <div className="inner">
                    <h2>실행관리</h2>
                    <ul className="menu4">
                        <li><NavLink to={URL.ExecutionCost} className={({ isActive }) => (isActive ? "cur" : "")}>실행원가</NavLink></li>
                        <li><NavLink to={URL.LaborCostMgmt} className={({ isActive }) => (isActive ? "cur" : "")}>인건비관리</NavLink></li>
                        <li><NavLink to={URL.ExpenseMgmt} className={({ isActive }) => (isActive ? "cur" : "")}>경비관리</NavLink></li>
                        <li><NavLink to={URL.PurchasingMgmt} className={({ isActive }) => (isActive ? "cur" : "")}>구매관리</NavLink></li>
                        <li><NavLink to={URL.Approval} className={({ isActive }) => (isActive ? "cur" : "")}>전자결재</NavLink></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default EgovLeftNavExecution;