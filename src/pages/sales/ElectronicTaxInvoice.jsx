import React from 'react';
import { Link } from 'react-router-dom';

import { default as EgovLeftNav } from 'components/leftmenu/EgovLeftNavSales';

/** 영업관리-전자세금계산서관리-전자세금계산서 */
function ElectronicTaxInvoice() {
	return (
		<>
			<div className="container">
				<div className="c_wrap">
					{/* <!-- Location --> */}
					<div className="location">
						<ul>
							<li><Link to="" className="home">Home</Link></li>
							<li><Link to="/sales">영업관리</Link></li>
							<li>전자세금계산서관리</li>
						</ul>
               		 </div>
                	{/* <!--// Location --> */}

					<div className="layout">
						{/* <!-- Navigation --> */}
						<EgovLeftNav></EgovLeftNav>
                    	{/* <!--// Navigation --> */}

						{/* <!-- 본문 --> */}
						<div className="contents" id="contents">
							<div> 전자세금계산서관리 </div>
						</div>
						{/* <!--// 본문 --> */}
					</div>

				</div>
			</div>
		</>
	);
}

export default ElectronicTaxInvoice;