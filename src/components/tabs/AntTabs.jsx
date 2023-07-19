import { Tabs } from "antd";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Children } from "./Children.js";

const item = Children.find((item) => item.activeKey === 0);

const defaultPanes = [
    {
        label: item.label,
        children: item.component,
        key: item.activeKey,
    },
];

/** nav 클릭 시 해당하는 화면(컴포넌트) children 으로 보여줌 */
const AntTabs = (props) => {
    //nav 클릭 시 label props로 전달 됨
    const title = props.label ? props.label : defaultPanes[0].label;
    const [activeKey, setActiveKey] = useState(defaultPanes[0].key); // 프로젝트 등록 키 0번(활성화)
    const [items, setItems] = useState(defaultPanes);

    const onChange = (key) => {
        setActiveKey(key);
    };

    const addTab = (item) => {
        const existingTab = items.find((tab) => tab.label === item.label);
        if (existingTab) {
            setActiveKey(existingTab.key);
        } else {
            setItems([
                ...items,
                {
                    label: item.label,
                    children: item.component,
                    key: item.activeKey,
                },
            ]);
            setActiveKey(item.activeKey);
        }
    };

    /** title이 변경 될 때(navigation 클릭 시) 실행 되는 함수 */
    useEffect(() => {
        const item = Children.find((item) => item.label === title);
        if (!item) return; 
        addTab(item);
    }, [title, props.isActive]);

    const removeTab = (targetKey) => {
        console.log(targetKey);
        const targetIndex = items.findIndex((tab) => tab.key === targetKey);
        console.log(items.length - 1);
        const newPanes = items.filter((tab) => tab.key !== targetKey);
        if (newPanes.length && targetKey === activeKey) {
            const { key } = newPanes[
                targetIndex === newPanes.length ? targetIndex - 1 : targetIndex
            ];
            setActiveKey(key);
        }
        setItems(newPanes);

        if (items.length === 1) { //모든 탭 종료시 디폴트
            setItems([...defaultPanes]);
            setActiveKey(defaultPanes.key);
        }
    };

    const onEdit = (targetKey, action) => {
        removeTab(targetKey);
    };

    return (
        <Tabs
            hideAdd={true}
            onChange={onChange}
            activeKey={activeKey}
            type="editable-card"
            onEdit={onEdit}
            items={items}
        />
    );
};

//const mapStateToProps = data => data.tabs //tabs 전체 불러오기
const mapStateToProps = (data) => ({
    label: data.tabs.label,
    isActive: data.tabs.isActive,
});

/** store와 props 연결 */
export default connect(mapStateToProps)(AntTabs);
