import { Button, Tabs } from "antd";
import React, { useRef, useState, useEffect } from "react";
import CommonCodeManagement1 from "./sysadmin/CommonCodeManagement1";
import ClientManagement from "./sysadmin/ClientManagement";
import CommonCodeManagement2 from "./sysadmin/CommonCodeManagement2";
import MenuManagement from "./sysadmin/MenuManagement";
import UserManagement from "./sysadmin/UserManagement";
import ErrorlogManagement from "./sysadmin/ErrorlogManagement";
import ContentMain from "./pre-cost/ContentMain";

const defaultPanes = new Array(1).fill(null).map((_, index) => {
    const id = String(index + 1);
    return {
        label: "프로젝트 등록",
        children: <ContentMain />,
        key: id,
    };
});

const Testing = (props) => {
    const title = props.title;
    console.log(title, "제대로나오나보자");

    const [activeKey, setActiveKey] = useState(defaultPanes[0].key);
    const [items, setItems] = useState(defaultPanes);
    const newTabIndex = useRef(0);

    const onChange = (key) => {
        setActiveKey(key);
    };

    const addTab = (label, content) => {
        const existingTab = items.find((tab) => tab.label === label);
        if (existingTab) {
            setActiveKey(existingTab.key);
        } else {
            const newActiveKey = `newTab${newTabIndex.current++}`;
            setItems([
                ...items,
                {
                    label: label,
                    children: content,
                    key: newActiveKey,
                },
            ]);
            setActiveKey(newActiveKey);
        }
    };

    useEffect(() => {
        if (title === "공통코드관리1") {
            addTab("공통코드관리1", <CommonCodeManagement1 />);
        } else if (title === "거래처 관리") {
            addTab("거래처 관리", <ClientManagement />);
        } else if (title === "공통코드관리2") {
            addTab("공통코드관리2", <CommonCodeManagement2 />);
        } else if (title === "메뉴 관리") {
            addTab("메뉴 관리", <MenuManagement />);
        } else if (title === "사용자 관리") {
            addTab("사용자 관리", <UserManagement />);
        } else if (title === "에러로그 관리") {
            addTab("에러로그 관리", <ErrorlogManagement />);
        }
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
            if (title === "공통코드관리1") {
                addTab("공통코드관리1", <CommonCodeManagement1 />);
            } else if (title === "거래처 관리") {
                addTab("거래처 관리", <ClientManagement />);
            } else if (title === "공통코드관리2") {
                addTab("공통코드관리2", <CommonCodeManagement2 />);
            } else if (title === "메뉴 관리") {
                addTab("메뉴 관리", <MenuManagement />);
            } else if (title === "사용자 관리") {
                addTab("사용자 관리", <UserManagement />);
            } else if (title === "에러로그 관리") {
                addTab("에러로그 관리", <ErrorlogManagement />);
            }
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

export default Testing;
