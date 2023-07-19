//트리..
export const menuTreeData = [ //folder
	{
		title: 'ROOT',
		key: '0',
		children: [
			{
				title: '사전원가', //메뉴명(menuName)
				menuCategory: '', //메뉴카테고리
				upperMenuNo: '', //상위메뉴번호
				menuLv: '', //레벨
				key: '0-0', //메뉴순서(menuOrder)
				menuDc: '', //메뉴설명
				rltImgPath: '', //관계이미지경로
				rltImgNm: '', //관계이미지명
				useAt: '', //사용여부
				targetAt: '', //새창여부
				authorCode: '', //권한정보
				children: [
					{
						title: '프로젝트 등록', //메뉴명
						key: '0-0-0', //메뉴순서, 상위메뉴? 0-0
						isLeaf: true,
					},
					{
						title: '재료비 내역',
						key: '0-0-1',
						isLeaf: true,
				  	},
				],
			  },
			  {
				title: '시스템관리',
				key: '0-1',
				children: [
					{
						title: '거래처 관리',
						key: '0-1-0',
						isLeaf: true,
					},
					{
						title: '메뉴 관리',
						key: '0-1-1',
						isLeaf: true,
					},
				],
			},
		],
	},
];

export const menuCtxData = [ //context menu
	'create', 'delete'
];