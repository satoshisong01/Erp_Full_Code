import React, { useEffect, useState } from "react";
import ApprovalForm from "components/form/ApprovalForm"; //기본 폼

function ApprovalContainer () {
	const [title, setTitle] = useState('')

	useEffect(() => {
		// URL에서 파라미터 값 가져오기
		const urlParams = new URLSearchParams(window.location.search);
		setTitle(urlParams.get("data"))
	}, []);

	return (
		<div className="">
			<ApprovalForm title={title}>
				{/* 자식 컴포넌트 */}
			</ApprovalForm>
		</div>
	);
};

export default ApprovalContainer;