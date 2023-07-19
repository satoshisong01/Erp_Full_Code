import React from 'react';
import { Link } from 'react-router-dom';

import { default as EgovLeftNav } from 'components/leftmenu/EgovLeftNavReference';

/** 기준정보관리-품목관리-품목상세관리 */
function ItemDetailMgmt() {
	return (
		<>
			<div className="container">
				<div className="c_wrap">
					{/* <!-- Location --> */}
					<div className="location">
						<ul>
							<li><Link to="" className="home">Home</Link></li>
							<li><Link to="/reference">기준정보관리</Link></li>
							<li>품목상세관리</li>
						</ul>
               		 </div>
                	{/* <!--// Location --> */}

					<div className="layout">
						{/* <!-- Navigation --> */}
						<EgovLeftNav></EgovLeftNav>
                    	{/* <!--// Navigation --> */}

						{/* <!-- 본문 --> */}
						<div className="contents" id="contents">
							<div> 품목상세관리 </div>
						</div>
						{/* <!--// 본문 --> */}
					</div>

				</div>
			</div>
		</>
	);
}

export default ItemDetailMgmt;