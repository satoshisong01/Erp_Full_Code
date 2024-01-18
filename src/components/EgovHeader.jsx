import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import URL from "constants/url";
import store from "store/configureStore";
import { selectLnb } from "./tabs/TabsActions";
import { connect } from "react-redux";
import { execution, reference, sales, mail, system } from "./tabs/Children";
import NavLinkTabs from "./tabs/NavLinkTabs";
import { axiosGet } from "../api/axiosFetch";
import { PageContext } from "./PageProvider";
import { v4 as uuidv4 } from "uuid";

/** 대,중,소 카데고리 Link가 걸려 있는 헤더 */
function EgovHeader({ loginUser, onChangeLogin, lnbLabel, snbLabel, lnbId, snbId }) {
    // console.group("EgovHeader");
    // console.log("[Start] EgovHeader ------------------------------");
    // console.log("EgovHeader >>> onChangeLogin :", onChangeLogin);

    const sessionUser = sessionStorage.getItem("loginUser");
    const sessionUserId = JSON.parse(sessionUser)?.id;
    const sessionUserName = JSON.parse(sessionUser)?.name;
    const sessionUserSe = JSON.parse(sessionUser)?.userSe;
    const authorCode = JSON.parse(sessionUser)?.authorCode;

    // console.log("🎄로그인🎄", authorCode);

    const { gnbLabel, setGnbLabel } = useContext(PageContext);
    const [activeGnb, setActiveGnb] = useState("");
    const [activeLnb, setActiveLnb] = useState("");
    const accessRoleSystem = ["ROLE_MANAGER", "ROLE_ADMIN"];
    const accessRoleMail = ["ROLE_USER", "ROLE_TEAM_MANAGER", "ROLE_MANAGER", "ROLE_ADMIN"];
    const accessRoleExecution = ["ROLE_USER", "ROLE_TEAM_MANAGER", "ROLE_MANAGER", "ROLE_ADMIN"];
    const accessRoleSales = ["ROLE_TEAM_MANAGER", "ROLE_MANAGER", "ROLE_ADMIN"];
    const accessRoleReference = ["ROLE_TEAM_MANAGER", "ROLE_MANAGER", "ROLE_ADMIN"];

    /** 라벨 선택 시 CSS 활성화 */
    useEffect(() => {
        const tabs = { 기준정보관리: reference, 영업관리: sales, 실행관리: execution, 전자결재: mail, 시스템관리: system }; //tabLabel: tabItems

        const activeLabel = Object.entries(tabs).find(
            ([tabLabel, tabItems]) => tabItems.some((item) => item.id === (lnbId || snbId)) //네비게이션에서 선택한 id
        );

        if (activeLabel) {
            const [tabLabel] = activeLabel;
            setActiveGnb(tabLabel);
        }
    }, [lnbId, snbId]);

    useEffect(() => {
        setActiveGnb(gnbLabel); //헤더 4중류 active
    }, [gnbLabel]);

    const navigate = useNavigate();

    const logInHandler = () => {
        // 로그인 정보 없을 시
        navigate(URL.LOGIN);
        // PC와 Mobile 열린메뉴 닫기: 2023.04.13(목) 김일국 추가
        document.querySelector(".all_menu.WEB").classList.add("closed");
        // document.querySelector(".btnAllMenu").classList.remove("active");
        // document.querySelector(".btnAllMenu").title = "전체메뉴 닫힘";
        // document.querySelector(".all_menu.Mobile").classList.add("closed");
    };
    const logOutHandler = async () => {
        // 로그인 정보 존재할 때
        const logOutUrl = "/uat/uia/actionLogoutAPI.do?scopeSession=1";
        const resultData = await axiosGet(logOutUrl);
        if (resultData) {
            onChangeLogin({ loginVO: {} });
            sessionStorage.setItem("loginUser", JSON.stringify({ id: "" }));
            window.alert("로그아웃되었습니다!");
            navigate(URL.MAIN);
            // PC와 Mobile 열린메뉴 닫기: 2023.04.13(목) 김일국 추가
            document.querySelector(".all_menu.WEB").classList.add("closed");
            // document.querySelector(".btnAllMenu").classList.remove("active");
            // document.querySelector(".btnAllMenu").title = "전체메뉴 닫힘";
            // document.querySelector(".all_menu.Mobile").classList.add("closed");
        }
    };

    const lnbClick = (gnbLabel, lnbLabel, id) => {
        store.dispatch(selectLnb(lnbLabel, id)); //액션
        setGnbLabel(gnbLabel); //프로바이더
        setActiveLnb(lnbLabel);
        setActiveGnb(gnbLabel);
    };
    const gnbClick = (e) => {
        const gnbLabel = e.target.innerText;
        setGnbLabel(gnbLabel);
        setActiveGnb(gnbLabel);
    };

    const mainClick = (e) => {
        setGnbLabel("");
        setActiveGnb("");
        setActiveLnb("");
    };

    // console.log("------------------------------EgovHeader [End]");
    // console.groupEnd("EgovHeader");

    return (
        // <!-- header -->
        <div className="header">
            <div className="inner">
                <h1 className="logo">
                    <Link to={URL.MAIN} className="w" onClick={mainClick}>
                        <img src="/assets/images/mecca_logo.png" alt="원가관리시스템" />
                    </Link>
                </h1>

                <div className="gnb">
                    <h2 className="blind">주메뉴</h2>
                    <ul>
                        {accessRoleReference.includes(authorCode) && (
                            <li key={uuidv4()}>
                                <NavLinkTabs to={URL.Tabs} onClick={gnbClick} activeName={activeGnb} header="기준정보관리">
                                    기준정보관리
                                </NavLinkTabs>
                            </li>
                        )}
                        {accessRoleSales.includes(authorCode) && (
                            <li key={uuidv4()}>
                                <NavLinkTabs to={URL.Tabs} onClick={gnbClick} activeName={activeGnb} header="영업관리">
                                    영업관리
                                </NavLinkTabs>
                            </li>
                        )}
                        {accessRoleExecution.includes(authorCode) && (
                            <li key={uuidv4()}>
                                <NavLinkTabs to={URL.Tabs} onClick={gnbClick} activeName={activeGnb} header="실행관리">
                                    실행관리
                                </NavLinkTabs>
                            </li>
                        )}
                        {accessRoleMail.includes(authorCode) && (
                            <li>
                                <NavLinkTabs to={URL.Tabs} onClick={gnbClick} activeName={activeGnb} header="전자결재">
                                    전자결재
                                </NavLinkTabs>
                            </li>
                        )}
                        {accessRoleSystem.includes(authorCode) && (
                            <li>
                                <NavLinkTabs to={URL.Tabs} onClick={gnbClick} activeName={activeGnb} header="시스템관리">
                                    시스템관리
                                </NavLinkTabs>
                            </li>
                        )}
                    </ul>
                </div>

                {/* <!-- PC web에서 보여지는 영역 --> */}
                <div className="user_info">
                    {/* 로그아웃 : 로그인 정보 있을때 */}
                    {sessionUserId && (
                        <>
                            <span className="person">{sessionUserName} </span>님이, 로그인하셨습니다.
                            <button onClick={logOutHandler} className="btn" style={{ position: "relative", width: "100px" }}>
                                로그아웃
                            </button>
                            <button className="btn" style={{ position: "relative", width: "100px", height: "32px" }}>
                                <Link id="MyInfoBtn" to={URL.MyInfo}>
                                    나의 회원정보
                                </Link>
                            </button>
                        </>
                    )}
                    {/* 로그인 : 로그인 정보 없을 때 */}
                    {!sessionUserId && (
                        <div style={{ display: "flex" }}>
                            <button onClick={logInHandler} className="btn login">
                                로그인
                            </button>
                        </div>
                    )}
                </div>
                {/* <!--// PC web에서 보여지는 영역 --> */}

                {/* <!-- right area --> */}
                {/* <div className="right_a">
                    <button type="button" className="btn btnAllMenu" title="전체메뉴 닫힘">
                        전체메뉴
                    </button>
                    <button type="button" className="btn mobile btnAllMenuM" title="전체메뉴 닫힘">
                        전체메뉴
                    </button>
                </div> */}
            </div>

            {/* <!-- All menu : web --> */}
            <div className="all_menu WEB closed">
                <h2 className="blind">전체메뉴</h2>
                <div className="inner">
                    <div className="col">
                        <h3>기준정보관리</h3>
                        <ul>
                            {reference.map((item) => (
                                <li key={uuidv4()}>
                                    <NavLinkTabs to={URL.Tabs} onClick={(e) => lnbClick("기준정보관리", item.label, item.id)} activeName={activeLnb}>
                                        {item.label}
                                    </NavLinkTabs>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="col">
                        <h3>영업관리</h3>
                        <ul>
                            {sales.map((item) => (
                                <li key={uuidv4()}>
                                    <NavLinkTabs to={URL.Tabs} onClick={(e) => lnbClick("영업관리", item.label, item.id)} activeName={activeLnb}>
                                        {item.label}
                                    </NavLinkTabs>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="col">
                        <h3>실행관리</h3>
                        <ul>
                            {execution.map((item) => (
                                <li key={uuidv4()}>
                                    <NavLinkTabs to={URL.Tabs} onClick={(e) => lnbClick("실행관리", item.label, item.id)} activeName={activeLnb}>
                                        {item.etc}
                                    </NavLinkTabs>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* {sessionUserSe ==='USR' && */}
                    <div className="col">
                        <h3>시스템관리</h3>
                        <ul>
                            {system.map((item) => (
                                <li key={uuidv4()}>
                                    <NavLinkTabs to={URL.Tabs} onClick={(e) => lnbClick("시스템관리", item.label, item.id)} activeName={activeLnb}>
                                        {item.label}
                                    </NavLinkTabs>
                                </li>
                            ))}
                        </ul>
                    </div>
                    {/* } */}
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (data) => data.tabs;
export default connect(mapStateToProps)(EgovHeader);
