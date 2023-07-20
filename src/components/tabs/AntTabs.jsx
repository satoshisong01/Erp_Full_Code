import { Tabs } from "antd";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Children } from "./Children.js";

import store from 'store/configureStore';
import { tabSelect } from "components/tabs/TabsActions";

const tab = Children.find((tab) => tab.activeKey === 0);

const defaultPanes = [
    {
        label: tab.label,
        children: tab.component,
        key: tab.activeKey,
    },
];

/** nav, header 클릭 시  label props로 전달 & 해당하는 화면(컴포넌트) children 으로 보여줌 */
const AntTabs = (props) => {
    
    const [activeKey, setActiveKey] = useState(defaultPanes[0].key); // 프로젝트 등록 키 0번(활성화)
    const [items, setItems] = useState(defaultPanes);

    /** title이 변경 될 때(navigation 클릭 시) 실행 되는 함수 */
    useEffect(() => {
        const tab = Children.find((item) => item.label === props.label);
        if (!tab) return; 
        addTab(tab);
    }, [props.label]);

    const onChange = (key) => {
        setActiveKey(key);
        const selectedTab = items.find((item) => item.key === key);
        if (selectedTab) {
            store.dispatch(tabSelect(selectedTab.label));
        }
    };

    const addTab = (addTab) => {
        const existingTab = items.find((item) => item.label === addTab.label);
        if (existingTab) { //선택한 라벨(이름)이 있으면 해당하는 라벨(이름)의 컴포넌트로
            setActiveKey(existingTab.key);
        } else { //없으면 기존 탭에 + 새로운탭 출력
            setItems([
                ...items,
                {
                    label: addTab.label,
                    children: addTab.component,
                    key: addTab.activeKey,
                },
            ]);
            setActiveKey(addTab.activeKey);
        }
    };



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
            setItems([]);
            // setItems([...defaultPanes]);
            // setActiveKey(defaultPanes.key);
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
    label: data.tabs.label
});

/** store와 props 연결 */
export default connect(mapStateToProps)(AntTabs);
