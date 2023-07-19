import React from 'react';
import { Link } from 'react-router-dom';

import { default as EgovLeftNav } from 'components/leftmenu/EgovLeftNavExecution';

/** 실행관리-실행원가 */
function ExecutionCost() {
	return (
		<>
			<div className="container">
				<div className="c_wrap">
					{/* <!-- Location --> */}
					<div className="location">
						<ul>
							<li><Link to="" className="home">Home</Link></li>
							<li><Link to="/execution">실행관리</Link></li>
							<li>실행원가</li>
						</ul>
               		 </div>
                	{/* <!--// Location --> */}

					<div className="layout">
						{/* <!-- Navigation --> */}
						<EgovLeftNav></EgovLeftNav>
                    	{/* <!--// Navigation --> */}

						{/* <!-- 본문 --> */}
						<div className="contents" id="contents">
							<div> 실행원가 </div>
						</div>
						{/* <!--// 본문 --> */}
					</div>

				</div>
			</div>
		</>
	);
}

export default ExecutionCost;