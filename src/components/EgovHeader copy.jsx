import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

import * as EgovNet from 'api/egovFetch';

import URL from 'constants/url';
import CODE from 'constants/code';

/** 대,중,소 카데고리 Link가 걸려 있는 헤더 */
function EgovHeader({ loginUser, onChangeLogin }) {
    console.group("EgovHeader");
    console.log("[Start] EgovHeader ------------------------------");
    console.log("EgovHeader >>> onChangeLogin :", onChangeLogin);

    const sessionUser = sessionStorage.getItem('loginUser');
    const sessionUserId =    JSON.parse(sessionUser)?.id;
    const sessionUserName = JSON.parse(sessionUser)?.name;
    const sessionUserSe =    JSON.parse(sessionUser)?.userSe;

    const navigate = useNavigate();

    const logInHandler = () => { // 로그인 정보 없을 시
        navigate(URL.LOGIN);
		// PC와 Mobile 열린메뉴 닫기: 2023.04.13(목) 김일국 추가
		document.querySelector('.all_menu.WEB').classList.add('closed');
        document.querySelector('.btnAllMenu').classList.remove('active');
        document.querySelector('.btnAllMenu').title = '전체메뉴 닫힘';
		document.querySelector('.all_menu.Mobile').classList.add('closed');
    }
    const logOutHandler = () => {// 로그인 정보 존재할 때
        const logOutUrl = '/uat/uia/actionLogoutAPI.do';
        const requestOptions = {
            credentials: 'include',
        }
        EgovNet.requestFetch(logOutUrl, requestOptions,
            function (resp) {
                console.log("===>>> logout resp= ", resp);
                if (parseInt(resp.resultCode) === parseInt(CODE.RCV_SUCCESS)) {
                    onChangeLogin({ loginVO: {} });
                    sessionStorage.setItem('loginUser', JSON.stringify({"id":""}));
                    window.alert("로그아웃되었습니다!");
                    navigate(URL.MAIN);
					// PC와 Mobile 열린메뉴 닫기: 2023.04.13(목) 김일국 추가
					document.querySelector('.all_menu.WEB').classList.add('closed');
	                document.querySelector('.btnAllMenu').classList.remove('active');
	                document.querySelector('.btnAllMenu').title = '전체메뉴 닫힘';
					document.querySelector('.all_menu.Mobile').classList.add('closed');
                }
            }
        );
    }

    console.log("------------------------------EgovHeader [End]");
    console.groupEnd("EgovHeader");

    return (
        // <!-- header -->
        <div className="header">
            <div className="inner">
                <h1 className="logo">
                    <Link to={URL.MAIN} className="w"><img src="/assets/images/mecca_logo.png" alt="원가관리시스템" /></Link>
                </h1>

                <div className="gnb">
                    <h2 className="blind">주메뉴</h2>
                    <ul>
                        <li><NavLink to={URL.TABS} className={({ isActive }) => (isActive ? "cur" : "")}>기준정보관리</NavLink></li>
                        <li><NavLink to={URL.TABS}     className={({ isActive }) => (isActive ? "cur" : "")}>영업관리</NavLink></li>
                        <li><NavLink to={URL.TABS} className={({ isActive }) => (isActive ? "cur" : "")}>실행관리</NavLink></li>
                        <li><NavLink to={URL.TABS}    className={({ isActive }) => (isActive ? "cur" : "")}>시스템관리</NavLink></li>
                        {sessionUserSe ==='USR' &&
                            <li><NavLink to={URL.TABS} className={({ isActive }) => (isActive ? "cur" : "")}>관리자페이지</NavLink></li>
                        }
                    </ul>
                </div>

                {/* <!-- PC web에서 보여지는 영역 --> */}
                <div className="user_info">
                    {/* 로그아웃 : 로그인 정보 있을때 */}
                    {sessionUserId &&
                        <>
                            <span className="person">{sessionUserName} </span> 님이, 관리자로 로그인하셨습니다.
                            <button onClick={logOutHandler} className="btn">로그아웃</button>
                        </>
                    }
                    {/* 로그인 : 로그인 정보 없을 때 */}
                    {!sessionUserId &&
                        <button onClick={logInHandler} className="btn login">로그인</button>
                    }
                </div>
                {/* <!--// PC web에서 보여지는 영역 --> */}

                {/* <!-- right area --> */}
                <div className="right_a">
                    <button type="button" className="btn btnAllMenu" title="전체메뉴 닫힘">전체메뉴</button>
                    <button type="button" className="btn mobile btnAllMenuM" title="전체메뉴 닫힘">전체메뉴</button>
                </div>
            </div>

            {/* <!-- All menu : web --> */}
            <div className="all_menu WEB closed">
                <h2 className="blind">전체메뉴</h2>
                <div className="inner">
                    <div className="col">
                        <h3>기준정보관리</h3>
                        <ul>
                            <li><NavLink to={URL.ItemMgmt}      className={({ isActive }) => (isActive ? "cur" : "")}>품목관리</NavLink></li>
                            <li><NavLink to={URL.VendorMgmt}    className={({ isActive }) => (isActive ? "cur" : "")}>거래처관리</NavLink></li>
                            <li><NavLink to={URL.BusinessMgmt}  className={({ isActive }) => (isActive ? "cur" : "")}>사업장관리</NavLink></li>
                            <li><NavLink to={URL.UserMgmt}      className={({ isActive }) => (isActive ? "cur" : "")}>사용자관리</NavLink></li>
                            <li><NavLink to={URL.CostMgmt}      className={({ isActive }) => (isActive ? "cur" : "")}>원가기준관리</NavLink></li>
                        </ul>
                    </div>
                    <div className="col">
                        <h3>영업관리</h3>
                        <ul>
                            <li><NavLink to={URL.OrderMgmt}     className={({ isActive }) => (isActive ? "cur" : "")}>수주관리</NavLink></li>
                            <li><NavLink to={URL.SalesExpenses} className={({ isActive }) => (isActive ? "cur" : "")}>영업비용</NavLink></li>
                            <li><NavLink to={URL.Quotation}     className={({ isActive }) => (isActive ? "cur" : "")}>견적서관리</NavLink></li>
                            <li><NavLink to={URL.ElectronicTaxInvoice} className={({ isActive }) => (isActive ? "cur" : "")}>전자세금계산서관리</NavLink></li>
                        </ul>
                    </div>
                    <div className="col">
                        <h3>실행관리</h3>
                        <ul>
                            <li><NavLink to={URL.ExecutionCost}  className={({ isActive }) => (isActive ? "cur" : "")}>실행원가</NavLink></li>
                            <li><NavLink to={URL.LaborCostMgmt}  className={({ isActive }) => (isActive ? "cur" : "")}>인건비관리</NavLink></li>
                            <li><NavLink to={URL.PurchasingMgmt} className={({ isActive }) => (isActive ? "cur" : "")}>경비관리</NavLink></li>
                            <li><NavLink to={URL.ExpenseMgmt}    className={({ isActive }) => (isActive ? "cur" : "")}>구매관리</NavLink></li>
                            <li><NavLink to={URL.Approval}       className={({ isActive }) => (isActive ? "cur" : "")}>전자결재</NavLink></li>
                        </ul>
                    </div>
                    <div className="col">
                        <h3>시스템관리</h3>
                        <ul>
                            <li><NavLink to={URL.AuthorizationMgmt} className={({ isActive }) => (isActive ? "cur" : "")}>권한관리</NavLink></li>
                            <li><NavLink to={URL.MenuMgmt}          className={({ isActive }) => (isActive ? "cur" : "")}>메뉴관리</NavLink></li>
                            <li><NavLink to={URL.BoardMgmt}         className={({ isActive }) => (isActive ? "cur" : "")}>게시판관리</NavLink></li>
                            <li><NavLink to={URL.CodeMgmt}          className={({ isActive }) => (isActive ? "cur" : "")}>코드관리</NavLink></li>
                            <li><NavLink to={URL.AccessHistoryMgmt} className={({ isActive }) => (isActive ? "cur" : "")}>접속이력관리</NavLink></li>
                        </ul>
                    </div>
                    {sessionUserSe ==='USR' &&
                        <div className="col">
                            <h3>시스템관리</h3>
                        </div>
                    }
                </div>
            </div>
        </div>
        // <!--// header -->
    );
}

export default EgovHeader;