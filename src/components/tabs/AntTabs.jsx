import { Tabs } from "antd";
import React, { useState, useEffect, useContext } from "react";
import { connect } from "react-redux";
import { Children } from "./Children.js";
import store from "store/configureStore";
import { selectSnb, selectLnb, selectGnb } from "components/tabs/TabsActions";
import { PageContext } from "components/PageProvider.js";

/* nav, header 클릭 시  label props로 전달 & 해당하는 화면(컴포넌트) children 으로 보여줌 */
const AntTabs = (props) => {
    const { lnbLabel, snbLabel, gnbLabel } = props;
    const  { setCurrentPageName, setPrevPageName } = useContext(PageContext);
    const [activeKey, setActiveKey] = useState(""); // 프로젝트 등록 키 0번(활성화)
    const [items, setItems] = useState([]);

    /* navi 클릭시 탭 생성 */
    useEffect(() => {
        const tab = Children.find(
            (item) => item.label === lnbLabel || item.label === snbLabel
        );
        if (!tab) return;
        addTab(tab);

        setCurrentPageName((pre) => {
            setPrevPageName(pre);
            return lnbLabel || snbLabel
        })
    }, [lnbLabel, snbLabel]);

    const onChange = (key) => {
        const selectedTab = items.find((item) => item.key === key);
        if (selectedTab) {
            store.dispatch(selectSnb(selectedTab.label));
        }
    };

    const addTab = (addTab) => {
        const existingTab = items.find((item) => item.label === addTab.label);
        if (existingTab) {
            //선택한 라벨(이름)이 있으면 해당하는 라벨(이름)의 컴포넌트로
            setActiveKey(existingTab.key);
        } else {
            //없으면 기존 탭에 + 새로운탭 출력
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
        store.dispatch(selectGnb(addTab.pLabel)); //left nav를 띄우기 위함
    };

    const removeTab = (targetKey) => {
        const targetIndex = items.findIndex((tab) => tab.key === targetKey);
        const newPanes = items.filter((tab) => tab.key !== targetKey);
        if (newPanes.length && targetKey === activeKey) {
            const { key, label } =
                newPanes[
                    targetIndex === newPanes.length
                        ? targetIndex - 1
                        : targetIndex
                ];
            setActiveKey(key);
            store.dispatch(selectSnb(label));
        }
        setItems(newPanes);

        if (items.length === 1) {
            //모든 탭 종료시 디폴트
            setItems([]);
            store.dispatch(selectSnb(""));
            store.dispatch(selectLnb(""));
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

const mapStateToProps = (data) => data.tabs; //tabs 전체 불러오기

/** store와 props 연결 */
export default connect(mapStateToProps)(AntTabs);
