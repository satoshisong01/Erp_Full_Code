import React, { useState , onClose } from "react";

const InnerForm = ({treeNode}) => {

	console.log("🌠innerForm treeNode: ", treeNode);

	const values = [
		{
			menuName: "메뉴1",
			menuCategory: "카테코리1",
			upperMenuNo: 100,
			menuNo: 0,
			menuLv: 1,
			menuOrder: 1,
			menuDc: "메뉴설명",
			rltImgPath: "이미지경로",
			rltImgNm: "이미지명",
			useAt: "Y",
			targetAt: "N",
			authorCode: "ROLE_ADMIN"
		},
		{
			menuName: "메뉴2",
			menuCategory: "카테코리2",
			upperMenuNo: 200,
			menuNo: 1,
			menuLv: 2,
			menuOrder: 2,
			menuDc: "테스트메뉴",
			rltImgPath: "src어쩌구",
			rltImgNm: "메뉴이미지",
			useAt: "Y",
			targetAt: "Y",
			authorCode: "ROLE_ADMIN"
		},
	]
	const parameter = [
		{
			title: '메뉴명',
			name: 'menuName',
			type: 'input',
			require: true,
		},
		{
			title: '메뉴카테고리',
			name: 'menuCategory',
			type: 'select',
			option: [
				{ text: '메뉴카테고리1', value: 'menu1' },
			],
			require: true,
		},
		{
			title: '상위메뉴번호',
			name: 'upperMenuNo',
			type: 'input',
			require: true,
		},
		{
			title: '레벨',
			name: 'menuLv',
			type: 'checkbox',
			option: [
				{ text: '체크1', value: 'check1' },
				{ text: '체크2', value: 'check2' },
				{ text: '체크3', value: 'check3' },
			],
			require: true,
		},
		{
			title: '메뉴순서',
			name: 'menuOrder',
			type: 'input',
			require: true,
		},
		{
			title: '메뉴설명',
			name: 'menuDc',
			type: 'input',
			require: true,
		},
		{
			title: '관계이미지경로',
			name: 'rltImgPath',
			type: 'input',
			require: true,
		},
		{
			title: '관계이미지명',
			name: 'rltImgNm',
			type: 'input',
			require: true,
		},
		{
			title: '사용여부',
			name: 'useAt',
			type: 'select',
			option: [{ text: 'Y', value: '1' }, { text: 'N', value: '2' }],
			require: true,
		},
		{
			title: '새창여부',
			name: 'targetAt',
			type: 'select',
			option: [{ text: 'Y', value: '1' }, { text: 'N', value: '2' }],
			require: true,
		},
		{
			title: '권한정보',
			name: 'authorCode',
			type: 'select',
			option: [
				{ text: '관리자',	  value: 'ROLE_ADMIN' },
				{ text: '운영자',	  value: 'ROLE_MANAGER' },
				{ text: '일반사용자', value: 'ROLE_USER' },
				{ text: '익명사용자', value: 'ROLE_ANONYMOUS' },
				{ text: 'test',		 value: 'ROLE_SUPER_MANAGER' },
			],
			require: true,
		},
	];

	const [formData, setFormData] = useState({});

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("🌠formData: ", formData);
		onClose();
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	const renderField = (param) => {
		if (param.type === 'input') {
			const value = param.name === 'menuName' ? values[0].menuName : '';
			return (
				<input
					type="text"
					name={param.name}
					value={value}
					onChange={handleInputChange}
					className="form-control"
				/>
			);
		} else if (param.type === 'select') {
			return (
				<select
					name={param.name}
					onChange={handleInputChange}
					className="form-control"
				>
					<option value=""> 선택없음 </option>
					{param.option.map((op) => (
						<option key={op.value} value={op.value}>
							{op.text}
						</option>
					))}
				</select>
			);
		} else if (param.type === 'checkbox') {
			return param.option.map((op) => (
				<div className="checkbox-container" key={op.value}>
					<label className="checkbox-custom">
						<input
							type="checkbox"
							name={param.name}
							value={op.value}
							onChange={handleInputChange}
							id="checkbox1"
						/>
						<span className='checkbox-label'>
							{op.text}
						</span>
					</label>
				</div>
			  ));
		}
		return null;
	};

	return(
		<>
			<form onSubmit={handleSubmit} className="form-horizontal">
				<div className="row">
					{parameter.map((param) => (
							<div key={param.name} className="form-group">
								<label className="col-md-2 control-label">
									{param.require && <span className="text-danger">*</span>}
									{param.title}
								</label>
								<div className="col-md-10">
									{renderField(param)}
								</div>
							</div>
					))}
				</div>
				<div className="row">
					<button type="submit" className='btn btn-primary btn-block'>Submit</button>
				</div>
			</form>
		</>
	);
}

export default InnerForm;