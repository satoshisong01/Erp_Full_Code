import React from 'react';
import { Link } from 'react-router-dom';

function EgovFooter() {
    return (
        <div className="footer">
            <div className="inner">
                <div className="info" style={{textAlign: 'center'}}>
                    <p>
                        대표문의메일 : egovframeexample@gmail.com  <span className="m_hide">|</span><br className="m_show" />  대표전화 : 0000-0000 (000-0000-0000)<br />
                        호환성확인 : 000-0000-0000  |  교육문의 : 0000-0000-0000
                    </p>
                    <p className="copy">Copyright © 2021 Ministry Of The Interior And Safety. All Rights Reserved.</p>
                </div>
            </div>
        </div>
    );
}

export default EgovFooter;