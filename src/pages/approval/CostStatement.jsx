import React, { useEffect, useState } from "react";

/* 사전 원가 계산서, 실행 원가 계산서 */
const CostStatement = () => {
	const [title, setTitle] = useState('')

	useEffect(() => { // URL로 넘어온 파라미터 값 파싱
		const urlParams = new URLSearchParams(window.location.search);
		const dataString = urlParams.get("data");
		const data = JSON.parse(decodeURIComponent(dataString));
		setTitle(data.title)
	}, []);

	return (
		<>
			{title}
		</>
	);
}

export default CostStatement;