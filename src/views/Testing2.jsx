import { Tabs } from "antd";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Children } from "./Children.js";

const item = Children.find((item) => item.activeKey === 0);

const defaultPanes = [
    {
        label: item.label,
        children: item.component,
        key: String(item.activeKey),
    },
];

const Testing2 = (props) => {
    const title = props.label ? props.label : defaultPanes[0].label;

    const [activeKey, setActiveKey] = useState(defaultPanes[0].key); //'0'
    const [items, setItems] = useState(defaultPanes);

    const onChange = (key) => {
        setActiveKey(key);
    };

    const addTab = (item) => {
        const existingTab = items.find((tab) => tab.label === item.label);
        if (existingTab) {
            //defaultPanes 아니면
            setActiveKey(existingTab.key);
        } else {
            //useEffect에서 보내주는 component를 띄운다
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

    useEffect(() => {
        const item = Children.find((item) => item.label === title);
        addTab(item);
    }, [title]);

    const removeTab = (targetKey) => {
        const targetIndex = items.findIndex((pane) => pane.key === targetKey);
        const newPanes = items.filter((pane) => pane.key !== targetKey);
        if (newPanes.length && targetKey === activeKey) {
            const { key } = newPanes[
                targetIndex === newPanes.length ? targetIndex - 1 : targetIndex
            ];
            setActiveKey(key);
        }
        setItems(newPanes);
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
const mapStateToProps = (state) => ({ label: state.tabs.label });

/** store와 props 연결 */
export default connect(mapStateToProps)(Testing2);
