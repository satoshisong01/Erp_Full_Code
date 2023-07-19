import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import URL from 'constants/url';
import { system } from 'components/tabs/Children';
import store from 'store/configureStore';
import { tabActive } from "components/tabs/TabsActions";

function EgovLeftNavSystem() {
    return (
        <div className="layout">
            <div className="nav">
                <div className="inner">
                    <h2>시스템관리</h2>
                    <ul className="menu4">
                        {/* {system.map((item) => (
                            <li key={item.title}>
                            <Link to={URL.TABS[item.title]} className={({ isActive }) => (isActive ? 'cur' : '')}>{item.label}</Link>
                            </li>
                        ))} */}
                        <li><Link onClick={(e) => store.dispatch(tabActive('권한관리'))} >권한관리</Link></li>
                        <li><Link onClick={(e) => store.dispatch(tabActive('메뉴정보관리'))} >메뉴관리</Link>
                            <ul className="menu7">
                                <li><Link onClick={(e) => store.dispatch(tabActive('메뉴정보관리'))} >메뉴정보관리</Link></li>
                                <li><Link onClick={(e) => store.dispatch(tabActive('프로그램목록관리'))} >프로그램목록관리</Link></li>
                            </ul>
                        </li>
                        <li><Link onClick={(e) => store.dispatch(tabActive('게시물관리'))} >게시판관리</Link>
                            <ul className="menu7">
                                <li><Link onClick={(e) => store.dispatch(tabActive('게시물관리'))} >게시물관리</Link></li>
                                <li><Link onClick={(e) => store.dispatch(tabActive('게시판마스터관리'))} >게시판마스터관리</Link></li>
                                <li><Link onClick={(e) => store.dispatch(tabActive('게시판열람권한관리'))} >게시판열람권한관리</Link></li>
                            </ul>
                        </li>
                        <li><Link onClick={(e) => store.dispatch(tabActive('분류코드관리'))} >코드관리</Link>
                            <ul className="menu7">
                                <li><Link onClick={(e) => store.dispatch(tabActive('분류코드관리'))} >분류코드관리</Link></li>
                                <li><Link onClick={(e) => store.dispatch(tabActive('그룹코드관리'))} >그룹코드관리</Link></li>
                                <li><Link onClick={(e) => store.dispatch(tabActive('상세코드관리'))} >상세코드관리</Link></li>
                            </ul>
                        </li>
                        <li><Link onClick={(e) => store.dispatch(tabActive('접속이력관리'))} >접속이력관리</Link></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default EgovLeftNavSystem;
