import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import URL from "constants/url";
import store from "store/configureStore";
import { selectLnb } from "./tabs/TabsActions";
import { connect } from "react-redux";
import { execution, reference, sales, mail, system } from "./tabs/Children";
import NavLinkTabs from "./tabs/NavLinkTabs";
import { axiosFetch, axiosGet } from "../api/axiosFetch";
import { PageContext } from "./PageProvider";
import { v4 as uuidv4 } from "uuid";
import PopupButton from "./button/PopupButton";
import BasicButton from "./button/BasicButton";
import AddButton from "./button/AddButton";
import ReferenceInfo from "./DataTable/function/ReferenceInfo";

/** 대,중,소 카데고리 Link가 걸려 있는 헤더 */
function EgovHeader({ loginUser, onChangeLogin, lnbLabel, snbLabel, lnbId, snbId }) {
    const sessionUser = sessionStorage.getItem("loginUser");
    const sessionUserId = JSON.parse(sessionUser)?.id;
    const sessionUserName = JSON.parse(sessionUser)?.name;
    const sessionUserSe = JSON.parse(sessionUser)?.userSe;
    const authorCode = JSON.parse(sessionUser)?.authorCode;

    const { gnbLabel, setGnbLabel } = useContext(PageContext);
    const [activeGnb, setActiveGnb] = useState("");
    const [activeLnb, setActiveLnb] = useState("");
    const accessRoleSystem = ["ROLE_MANAGER", "ROLE_ADMIN"];
    const accessRoleMail = ["ROLE_USER", "ROLE_TEAM_MANAGER", "ROLE_MANAGER", "ROLE_ADMIN"];
    const accessRoleExecution = ["ROLE_USER", "ROLE_TEAM_MANAGER", "ROLE_MANAGER", "ROLE_ADMIN"];
    const accessRoleSales = ["ROLE_TEAM_MANAGER", "ROLE_MANAGER", "ROLE_ADMIN"];
    const accessRoleReference = ["ROLE_TEAM_MANAGER", "ROLE_MANAGER", "ROLE_ADMIN"];
    const [signNumber, setSignNumber] = useState("0");

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
        if (loginUser && loginUser.uniqId) {
            fetchData(loginUser);
        }
        // const intervalId = setInterval(fetchData, 3600000); // 1시간
        // const intervalId = setInterval(fetchData, 10000); // 10ch
        const intervalId = setInterval(fetchData, 10 * 60 * 1000); // 10분

        // 컴포넌트가 언마운트될 때 interval을 정리합니다.
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (loginUser && loginUser.uniqId) {
            fetchData(loginUser);
        }
    }, [loginUser]);

    function handleAxiosError(error) {
        if (!error.response) {
            alert("서버와의 연결에 실패했습니다.");
            console.log(error);
        } else if (error.response.status >= 400 && error.response.status < 500) {
            alert("서버통신 에러: 클라이언트 오류가 발생했습니다.");
        } else if (error.response.status >= 500) {
            alert("서버통신 에러: 서버 내부 오류가 발생했습니다.");
        } else {
            alert("알 수 없는 오류가 발생했습니다.");
        }
    }

    const fetchData = async (loginUser) => {
        try {
            // axios를 사용하여 서버에 GET 요청을 보냅니다.
            const response = await axiosFetch("/api/system/signState/totalListAll.do", { sttApproverId: loginUser.uniqId, sttApproverAt: "진행" } || {});
            if (response && response.length > 0) {
                console.log(`📢결재개수 ${response.length}`);
                setSignNumber(response.length);
                console.log(`📢${loginUser.uniqId}, ${sessionUserName}의 결재정보 10분 간격으로 요청중...`);
            } else {
                console.log(`${loginUser.uniqId}, ${sessionUserName}의 결재정보를 불러오지 못함.`);
            }
        } catch (error) {
            //handleAxiosError(error);
            console.error("Error fetching data:", error);
        }
    };

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

    return (
        // <!-- header -->
        <div className="header">
            <div className="inner">
                <h1 className="logo">
                    <Link to={URL.MAIN} className="w" onClick={mainClick}>
                        <img src="/assets/images/mecca_erp_logo.svg" alt="원가관리시스템" />
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
                        <div className="table-buttons">
                            <span className="person">
                                {sessionUserName}({" " + signNumber + " "})
                            </span>
                            님이, 로그인하셨습니다.
                            <AddButton label="로그아웃" onClick={logOutHandler} />
                            <PopupButton
                                targetUrl={URL.MyInfo}
                                data={{ label: "나의정보", data: JSON.parse(sessionUser) }}
                                size={{ width: 700, height: 500 }}
                            />
                            <ReferenceInfo />
                            {/* <button onClick={logOutHandler} className="btn" style={{ position: "relative", width: "100px" }}>
                                로그아웃
                            </button> */}
                            {/* <button className="btn" style={{ position: "relative", width: "100px", height: "32px" }}>
                                <Link id="MyInfoBtn" to={URL.MyInfo}>
                                    나의 정보
                                </Link>
                            </button> */}
                        </div>
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
