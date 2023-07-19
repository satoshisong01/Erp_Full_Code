import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import './CustomRModalStyle.css';

//BBS_ID: 1
const parameter = [
	{
		title: '메뉴명',
		name: 'BBS_ID',
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
		option: [{ text: '사용', value: '1' }, { text: '미사용', value: '2' }],
		require: true,
	},
	{
		title: '새창여부',
		name: 'targetAt',
		type: 'select',
		option: [{ text: '사용', value: '1' }, { text: '미사용', value: '2' }],
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

const CustomRModal = ({ isModalOpen, onClose }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [formData, setFormData] = useState({});

	useEffect(() => {
		setIsOpen(isModalOpen);
	}, [isModalOpen]);

	const renderField = (param) => {
		if (param.type === 'input') {
			return (
				<input
					type="text"
					name={param.name}
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

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log("🌠formData: ", formData);
		onClose();
	};

	return (
		<div id="content">
			<Modal isOpen={isOpen} onRequestClose={onClose}>
				<form onSubmit={handleSubmit} className="form-horizontal">
					<div className="row">
						{parameter.map((param) => (
								<div key={param.name} className="form-group">
									<label className="col-md-3 control-label">
										{param.require && <span className="text-danger">*</span>}
										{param.title}
									</label>
									<div className="col-md-9">
										{renderField(param)}
									</div>
								</div>
						))}
					</div>
					<div className="row">
						<button type="submit" className='btn btn-primary btn-block'>Submit</button>
					</div>
				</form>
			</Modal>
		</div>
	);
};

export default CustomRModal;
