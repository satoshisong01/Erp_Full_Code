import React from "react";
import AntTabs from "components/tabs/AntTabs";
import { connect } from "react-redux";
import ExecutionTabPage from "./ExecutionTabPage";
import ReferenceTabPage from "./ReferenceTabPage";
import SalesTabPage from "./SalesTabPage";
import SystemTabPage from "./SystemTabPage";
import EgovLeftNavSales from "components/leftmenu/EgovLeftNavSales";
import EgovLeftNavExecution from "components/leftmenu/EgovLeftNavExecution";
import EgovLeftNavSystem from "components/leftmenu/EgovLeftNavSystem";
import EgovLeftNavReference from "components/leftmenu/EgovLeftNavReference";

function TabContainer(props) {
    const { gnbLabel } = props;
    console.log("⭕ 탭컨테이너: ", gnbLabel);
    return (
        <div className="egov-container T_MAIN">
            <div className="c_wrap">
                <div className="colbox">
                    <div className="left_col">
                        {/* {gnbLabel === "기준정보관리" && <ReferenceTabPage />}
                        {gnbLabel === "영업관리" && <ExecutionTabPage />}
                        {gnbLabel === "실행관리" && <SalesTabPage />}
                        {gnbLabel === "시스템관리" && <SystemTabPage />} */}

                        {(gnbLabel === "" || gnbLabel === "기준정보관리") && <EgovLeftNavReference />}
                        {gnbLabel === "영업관리" && <EgovLeftNavSales />}
                        {gnbLabel === "실행관리" && <EgovLeftNavExecution />}
                        {gnbLabel === "시스템관리" && <EgovLeftNavSystem />}
                    </div>

                    <div className="right_col">
                        <AntTabs />
                    </div>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (data) => data.tabs;
export default connect(mapStateToProps)(TabContainer);
