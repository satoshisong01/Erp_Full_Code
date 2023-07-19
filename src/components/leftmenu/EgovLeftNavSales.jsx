import React from 'react';

import { NavLink } from 'react-router-dom';
import URL from 'constants/url';

function EgovLeftNavSales() {
    
    return (
        <div className="layout">
            <div className="nav">
                <div className="inner">
                    <h2>영업관리</h2>
                    <ul className="menu4">
                        <li><NavLink to={URL.OrderMgmt} className={({ isActive }) => (isActive ? "cur" : "")}>수주(사업)관리</NavLink></li>
                        <li><NavLink to={URL.SalesExpenses} className={({ isActive }) => (isActive ? "cur" : "")}>영업비용</NavLink></li>
                        <li><NavLink to={URL.Quotation} className={({ isActive }) => (isActive ? "cur" : "")}>견적서관리</NavLink></li>
                        <li><NavLink to={URL.ElectronicTaxInvoice} className={({ isActive }) => (isActive ? "cur" : "")}>전자세금계산서관리</NavLink></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default EgovLeftNavSales;