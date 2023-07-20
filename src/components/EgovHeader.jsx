import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as EgovNet from 'api/egovFetch';
import URL from 'constants/url';
import CODE from 'constants/code';
import store from 'store/configureStore';
import { tabActive, headerSelect } from './tabs/TabsActions';
import { connect } from 'react-redux';
import { system, execution, reference, sales } from './tabs/Children';
import NavLinkTabs from './tabs/NavLinkTabs';

/** 대,중,소 카데고리 Link가 걸려 있는 헤더 */
function EgovHeader({ loginUser, onChangeLogin, label, selectLabel }) {
    console.group("EgovHeader");
    console.log("[Start] EgovHeader ------------------------------");
    console.log("EgovHeader >>> onChangeLogin :", onChangeLogin);

    const sessionUser = sessionStorage.getItem('loginUser');
    const sessionUserId = JSON.parse(sessionUser)?.id;
    const sessionUserName = JSON.parse(sessionUser)?.name;
    const sessionUserSe = JSON.parse(sessionUser)?.userSe;

    const [activeLabel, setActiveLabel] = useState('');

    /** 라벨 선택 시 CSS 활성화 */
    useEffect(() => {
        const tabs = { 시스템관리: system, 실행관리: execution, 기준정보관리: reference, 영업관리: sales }; //tabLabel: tabItems
      
        const activeTab = Object.entries(tabs).find(([tabLabel, tabItems]) =>
            tabItems.some((item) => item.label === (selectLabel || label))
        );

        if (activeTab) {
          const [tabLabel] = activeTab;
          setActiveLabel(tabLabel);
          store.dispatch(headerSelect(tabLabel)); //header
        }
    }, [label, selectLabel]);

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

    const menuClick = (e, header) => {
        const selectedMenu = e.target.innerText;
        store.dispatch(tabActive(selectedMenu)); //label
        setActiveLabel(selectedMenu);
        store.dispatch(headerSelect(header)); //header
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
                        <li><NavLinkTabs to={URL.TABS} onClick={menuClick} activeName={activeLabel} header="기준정보관리">
                            기준정보관리
                        </NavLinkTabs></li>
                        <li><NavLinkTabs to={URL.TABS} onClick={menuClick} activeName={activeLabel} header="영업관리">영업관리</NavLinkTabs></li>
                        <li><NavLinkTabs to={URL.TABS} onClick={menuClick} activeName={activeLabel} header="실행관리">실행관리</NavLinkTabs></li>
                        <li><NavLinkTabs to={URL.TABS} onClick={menuClick} activeName={activeLabel} header="시스템관리">시스템관리</NavLinkTabs></li>
                        {sessionUserSe === 'USR' && (
                            <li><NavLinkTabs to={URL.TABS} onClick={menuClick} activeName={activeLabel}  header="관리자페이지">관리자페이지</NavLinkTabs></li>
                        )}
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
                            {reference.map((item) => (
                                <li key={item.title}><NavLinkTabs to={URL.TABS} onClick={menuClick} activeName={activeLabel}>{item.label}</NavLinkTabs></li>
                            ))}
                        </ul> 
                    </div> 
                    <div className="col"> 
                        <h3>영업관리</h3> 
                        <ul> 
                            {sales.map((item) => (
                                <li key={item.title}><NavLinkTabs to={URL.TABS} onClick={menuClick} activeName={activeLabel}>{item.label}</NavLinkTabs></li>
                            ))}
                        </ul> 
                    </div> 
                    <div className="col"> 
                        <h3>실행관리</h3> 
                        <ul> 
                            {execution.map((item) => (
                                <li key={item.title}><NavLinkTabs to={URL.TABS} onClick={menuClick} activeName={activeLabel}>{item.label}</NavLinkTabs></li>
                            ))}
                        </ul> 
                    </div> 
                    <div className="col"> 
                        <h3>시스템관리</h3> 
                        <ul> 
                            {system.map((item) => (
                                <li key={item.title}><NavLinkTabs to={URL.TABS} onClick={menuClick} activeName={activeLabel}>{item.label}</NavLinkTabs></li>
                            ))}
                        </ul>
                    </div>
                    {sessionUserSe ==='USR' &&
                        <div className="col">
                            <h3>관리자페이지</h3>
                        </div>
                    }
                </div>
            </div>

            {/* <!-- All menu : mobile --> */}
            <div className="all_menu Mobile closed">
                <div className="user_info_m">
                    {/* 로그아웃 : 로그인 정보 있을때 */}
                    {sessionUserId &&
                        <>
                            <span className="person">{sessionUserName} </span>이 로그인하셨습니다.
                            <button onClick={logOutHandler} className="btn logout">로그아웃</button>
                        </>
                    }

                    {/* 로그인 : 로그인 정보 없을 때 */}
                    {!sessionUserId &&
                        <button onClick={logInHandler} className="btn login">로그인</button>
                    }
                    <button className="btn noscript close" type="button">전체메뉴 닫기</button>
                </div>
                <div className="menu">
                    <h3><Link to={URL.TABS}>기준정보관리</Link></h3>
                    <div className="submenu closed">
                        <ul>
                            {reference.map((item) => (
                                <li key={item.title}><NavLinkTabs to={URL.TABS} onClick={menuClick} activeName={activeLabel}>{item.label}</NavLinkTabs></li>
                            ))}
                        </ul> 
                    </div>
                    <h3><Link to={URL.TABS}>영업관리</Link></h3>
                    <div className="submenu closed">
                        <ul>
                            {sales.map((item) => (
                                <li key={item.title}><NavLinkTabs to={URL.TABS} onClick={menuClick} activeName={activeLabel}>{item.label}</NavLinkTabs></li>
                            ))}
                        </ul> 
                    </div>
                    <h3><Link to={URL.TABS}>실행관리</Link></h3>
                    <div className="submenu closed">
                        <ul>
                            {execution.map((item) => (
                                <li key={item.title}><NavLinkTabs to={URL.TABS} onClick={menuClick} activeName={activeLabel}>{item.label}</NavLinkTabs></li>
                            ))}
                        </ul> 
                    </div>
                    <h3><Link to={URL.TABS}>시스템관리</Link></h3>
                    <div className="submenu closed">
                        <ul>
                            {system.map((item) => (
                                <li key={item.title}><NavLinkTabs to={URL.TABS} onClick={menuClick} activeName={activeLabel}>{item.label}</NavLinkTabs></li>
                            ))}
                        </ul> 
                    </div>
                    {sessionUserSe ==='USR' &&
                        <>
                            <h3><Link to={URL.TABS}>관리자페이지</Link></h3>
                        </>
                    }
                </div>
            </div>
            {/* <!--// All menu --> */}
        </div>
        // <!--// header -->
    );
}


const mapStateToProps = (data) => ({
    label: data.tabs.label,
    selectLabel: data.tabs.selectLabel
});


export default connect(mapStateToProps)(EgovHeader);
