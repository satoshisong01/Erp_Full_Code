import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Children } from "./Children.js";
import { Tabs } from "antd";

const item = Children.find((item) => item.activeKey === 0);
const defaultPanes = [
    {
        label: item.label,
        children: item.component,
        key: item.activeKey,
    },
];

function TabTest(props) {
    const title = props.label ? props.label : defaultPanes[0].label;
    const [activeKey, setActiveKey] = useState(defaultPanes[0].key);
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

    useEffect(() => {
        const item = Children.find((item) => item.label === title);
        if (!item) return;
        addTab(item);
    }, [title, props.isActive]);

    const removeTab = (targetKey) => {
        const targetIndex = items.length - 1;
        const newPanes = items.filter((tab) => tab.key !== targetKey);

        if (newPanes.length && targetKey === activeKey) {
            const { key } = newPanes[
                targetIndex === newPanes.length ? targetIndex - 1 : targetIndex
            ];
            setActiveKey(key);
        }
        setItems(newPanes);

        if (items.length === 1) {
            setItems([...defaultPanes]);
            setActiveKey(defaultPanes.keys);
        }
    };

    const onEdit = (targetKey) => {
        removeTab(targetKey);
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
}
const mapStateToProps = (data) => data.tabs;
export default connect(mapStateToProps)(TabTest);

//요약된 코드
