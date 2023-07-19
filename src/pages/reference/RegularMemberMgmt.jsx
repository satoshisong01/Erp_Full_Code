import React from 'react';
import { Link } from 'react-router-dom';

import { default as EgovLeftNav } from 'components/leftmenu/EgovLeftNavReference';

/** 기준정보관리-원가기준관리-일반회원관리 */
function RegularMemberMgmt() {
	return (
		<>
			<div className="container">
				<div className="c_wrap">
					{/* <!-- Location --> */}
					<div className="location">
						<ul>
							<li><Link to="" className="home">Home</Link></li>
							<li><Link to="/reference">기준정보관리</Link></li>
							<li>일반회원관리</li>
						</ul>
               		 </div>
                	{/* <!--// Location --> */}

					<div className="layout">
						{/* <!-- Navigation --> */}
						<EgovLeftNav></EgovLeftNav>
                    	{/* <!--// Navigation --> */}

						{/* <!-- 본문 --> */}
						<div className="contents" id="contents">
							<div> 일반회원관리 </div>
						</div>
						{/* <!--// 본문 --> */}
					</div>

				</div>
			</div>
		</>
	);
}

export default RegularMemberMgmt;