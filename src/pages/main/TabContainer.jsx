import React from 'react';
import { useLocation } from 'react-router-dom';
import AntTabs from 'components/tabs/AntTabs';
import { connect } from 'react-redux';
import store from 'store/configureStore';

import EgovLeftNavReference from 'components/leftmenu/EgovLeftNavReference';
import EgovLeftNavSales from 'components/leftmenu/EgovLeftNavSales';
import EgovLeftNavExecution from 'components/leftmenu/EgovLeftNavExecution';
import EgovLeftNavSystem from 'components/leftmenu/EgovLeftNavSystem';

function TabContainer(props) {
    const { header } = props;

    return (
        <div className="container T_MAIN">
            <div className="c_wrap">
                    <div className="colbox">
                        <div className="left_col">
                            {header === '기준정보관리' && <EgovLeftNavReference />}
                            {header === '영업관리' && <EgovLeftNavSales />}
                            {header === '실행관리' && <EgovLeftNavExecution />}
                            {header === '시스템관리' && <EgovLeftNavSystem />}
                        </div>

                        <div className="right_col">
                            <AntTabs />
                        </div>
                    </div>
            </div>
        </div>

    );
}

const mapStateToProps = data => data.tabs
export default connect(mapStateToProps)(TabContainer);