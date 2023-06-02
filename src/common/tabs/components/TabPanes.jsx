import { Tabs } from "antd";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Children } from "./Children.js";

const item = Children.find( item => item.activeKey === 0);

const defaultPanes = [{ //초기화
		label: item.label,
		children: item.component,
		key: item.activeKey
}];

const TabPanes = (props) => { //nav 클릭 시 label props로 전달 됨
    const title = props.label ? props.label : defaultPanes[0].label;

    const [activeKey, setActiveKey] = useState(defaultPanes[0].key); //0
    const [items, setItems] = useState(defaultPanes);

    const onChange = (key) => {
        setActiveKey(key);
    };

    const addTab = (item) => {
        const existingTab = items.find( tab => tab.label === item.label );
        if (existingTab) { //defaultPanes 사용
            setActiveKey(existingTab.key);
        }
		else { //useEffect에서 보내주는 component 사용
            setItems([
                ...items,
                {
                    label: item.label,
                    children: item.component, //children 변수명 변경 시 error
                    key: item.activeKey
                },
            ]);
            setActiveKey(item.activeKey);
        }
    };

	/** title이 변경 될 때(navigation 클릭 시) 실행 되는 함수 */
    useEffect(() => {
		const item = Children.find( item => item.label === title);
        if(!item) return; //Children에 없는 메뉴 클릭 시 리턴
		addTab(item);
    }, [title]);

    const removeTab = (targetKey) => {
        // if(items.length === 1) return; //최소 1개 유지
        const targetIndex = items.findIndex(tab => tab.key === targetKey);
        const newPanes = items.filter(tab => tab.key !== targetKey);
        if (newPanes.length && targetKey === activeKey) {
            const { key } = newPanes[
                targetIndex === newPanes.length ? targetIndex - 1 : targetIndex
            ];
            setActiveKey(key);
        }
        setItems(newPanes);

        if(items.length === 1) { //모든 탭 종료시 디폴트
            setItems([...defaultPanes]); setActiveKey(defaultPanes.key);
        };

    };

    const onEdit = (targetKey, action) => {
        if (action === "add") {
           /** 사용하지 않는 기능 */
        } else {
            removeTab(targetKey);
        }
    };

    return (
        <div>
            <Tabs
                hideAdd={true}
                onChange={onChange}
                activeKey={activeKey}
                type="editable-card"
                onEdit={onEdit}
                items={items}
            />
        </div>
    );
};


/** const mapStateToProps = state => state.tabs로도 사용 가능 */
const mapStateToProps = state => ({ label: state.tabs.label });

/** store와 props 연결 */
export default connect(mapStateToProps)(TabPanes);