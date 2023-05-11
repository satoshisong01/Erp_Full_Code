import React from "react";

import FullScreen from "./FullScreen";
import ToggleMenu from "./ToggleMenu";

import RecentProjects from "./RecentProjects";
import { Msg } from "../../i18n";

export default class Header extends React.Component {
  render() {
    return (
      <header id="header">
        <div id="logo-group">
          <span id="logo">
            <a href="/">
              <img
                src="assets/img/logo.png" // place your logo here
                alt="SmartAdmin"
              />
            </a>
          </span>
        </div>

        <RecentProjects title="사전원가"/>
        <RecentProjects title="시스템 관리"/>

        <div className="pull-right" /*pulled right: nav area*/>

          {/* 사용자 정보 */}
          <Msg phrase="시스템 관리자님 로그인"/>

          <ToggleMenu
            className="btn-header pull-right" /* collapse menu button */
          />

          {/* logout button */}
          <div id="logout" className="btn-header transparent pull-right">
            <span>
              <a
                href="#/login"
                title="Sign Out"
                data-logout-msg="You can improve your security further after logging out by closing this opened browser"
              >
                <i className="fa fa-sign-out" />
              </a>
            </span>
          </div>

          <FullScreen className="btn-header transparent pull-right" />

        </div>
        {/* end pulled right: nav area */}
      </header>
    );
  }
}
