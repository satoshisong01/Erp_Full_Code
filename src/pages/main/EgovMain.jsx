import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';

import * as EgovNet from 'api/egovFetch';
import URL from 'constants/url';

function EgovMain(props) {
    console.group("EgovMain");
    console.log("[Start] EgovMain ------------------------------");
    console.log("EgovMain [props] : ", props);

    const location = useLocation();
    console.log("EgovMain [location] : ", location);

    console.log("------------------------------EgovMain [End]");
    console.groupEnd("EgovMain");

    return (
        <div className="container P_MAIN">
            <div className="c_wrap">
                    <div className="mini_board">
                        <div className="col" style={{height: 150}} >
                            <div >메인으로 보여줄 것</div>
                        </div>

                        <div className="col">
                            <ul className="tab">
                                <li><a href="#공지사항" className="on">공지사항</a></li>
                                <li><a href="#갤러리">갤러리</a></li>
                            </ul>
                            <div className="list">
                                <div className="notice">
                                    <h2 className="blind">공지사항</h2>
                                    <ul> 공지사항 </ul>
                                    <Link to={URL.INFORM_NOTICE} className="more">더보기</Link>
                                </div>

                                <div className="gallary">
                                    <h2 className="blind">갤러리</h2>
                                    <ul> 갤러리 </ul>
                                    <Link to={URL.INFORM_GALLERY} className="more">더보기</Link>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </div>

    );
}

export default EgovMain;