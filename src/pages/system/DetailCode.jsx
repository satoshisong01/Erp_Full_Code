import React from 'react';
import { Link } from 'react-router-dom';
import store from 'store/configureStore';
import { tabActive } from "components/tabs/TabsActions";

/** 시스템관리-코드관리-상세코드관리 */
function DetailCode() {
	return (
		<>
			<div className="location">
				<ul>
					<li><Link to="/" className="home">Home</Link></li>
					<li><Link to="" onClick={(e) => store.dispatch(tabActive('권한관리'))}>시스템관리</Link></li>
					<li>상세코드관리</li>
				</ul>
			</div>
		</>
	);
}

export default DetailCode;