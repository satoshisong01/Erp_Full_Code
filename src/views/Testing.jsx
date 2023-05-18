import { Button, Tabs } from "antd";
import React, { useRef, useState } from "react";
import CommonCodeManagement1 from "./sysadmin/CommonCodeManagement1";
import ClientManagement from "./sysadmin/ClientManagement";
const defaultPanes = new Array(1).fill(null).map((_, index) => {
    const id = String(index + 1);
    return {
        label: `Tab ${id}`,
        children: `Content of Tab Pane ${index + 1}`,
        key: id,
    };
});
const Testing = () => {
    const [activeKey, setActiveKey] = useState(defaultPanes[0].key);
    const [items, setItems] = useState(defaultPanes);
    const newTabIndex = useRef(0);
    const onChange = (key) => {
        setActiveKey(key);
    };
    const add = () => {
        const existingTab = items.find((tab) => tab.label === "공통코드관리1");
        if (existingTab) {
            setActiveKey(existingTab.key);
        } else {
            const newActiveKey = `newTab${newTabIndex.current++}`;
            setItems([
                ...items,
                {
                    label: "공통코드관리1",
                    children: <CommonCodeManagement1 />,
                    key: newActiveKey,
                },
            ]);
            setActiveKey(newActiveKey);
        }
    };
    const add2 = () => {
        const existingTab = items.find((tab) => tab.label === "거래처 목록");
        if (existingTab) {
            setActiveKey(existingTab.key);
        } else {
            const newActiveKey = `newTab${newTabIndex.current++}`;
            setItems([
                ...items,
                {
                    label: "거래처 목록",
                    children: <ClientManagement />,
                    key: newActiveKey,
                },
            ]);
            setActiveKey(newActiveKey);
        }
    };
    const remove = (targetKey) => {
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
            add();
        } else {
            remove(targetKey);
            if (targetKey === activeKey) {
                setActiveKey(items[items.length - 1].key);
            }
        }
    };
    return (
        <div>
            <div style={{ display: "flex" }}>
                <div
                    style={{
                        marginBottom: 16,
                    }}
                >
                    <Button onClick={add}>공통코드관리1</Button>
                </div>
                <div
                    style={{
                        marginBottom: 16,
                    }}
                >
                    <Button onClick={add2}>거래처 목록</Button>
                </div>
            </div>
            <Tabs
                hideAdd
                onChange={onChange}
                activeKey={activeKey}
                type="editable-card"
                onEdit={onEdit}
                items={items}
            />
        </div>
    );
};
export default Testing;
