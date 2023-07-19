import React, { useState } from 'react';
import { Tree } from 'antd';
import './AntTreeStyle.css';

const { DirectoryTree } = Tree;

const AntTree = ({ treeData, selectData }) => {
	const [dataList, setDataList] = useState(treeData) //props로 초기화한 tree 구성 데이터

	const selectHandle = (e, treeNode) => {
		const nodeMap = {
			title: treeNode.node.title,
			isParent: treeNode.node.children ? true : false,
			key: treeNode.node.key,
		};
		selectData(nodeMap)
		console.log("🌠selectHandle() nodeMap: ", nodeMap);
	}

	return (
		<>
			<DirectoryTree
				multiple
				defaultExpandAll
				treeData={dataList}
				onSelect={selectHandle}
			/>
		</>
	);
};

export default AntTree;
