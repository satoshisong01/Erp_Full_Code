import React from 'react';
import { useLocation } from 'react-router-dom';

import AntTabs from 'components/tabs/AntTabs';

import EgovLeftNavReference from 'components/leftmenu/EgovLeftNavReference';
import EgovLeftNavSales from 'components/leftmenu/EgovLeftNavSales';
import EgovLeftNavExecution from 'components/leftmenu/EgovLeftNavExecution';
import EgovLeftNavSystem from 'components/leftmenu/EgovLeftNavSystem';

function TabContainer(props) {
    console.group("TabContainer");
    console.log("[Start] TabContainer ------------------------------");
    console.log("TabContainer [props] : ", props);

    const location = useLocation();
    console.log("TabContainer [location] : ", location);

    console.log("------------------------------TabContainer [End]");
    console.groupEnd("TabContainer");

    return (
        <div className="container T_MAIN">
            <div className="c_wrap">
                    <div className="colbox">
                        <div className="left_col">
                            <EgovLeftNavSystem />
                        </div>

                        <div className="right_col">
                            <AntTabs />
                        </div>
                    </div>
            </div>
        </div>

    );
}

export default TabContainer;