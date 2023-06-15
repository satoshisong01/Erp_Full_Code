import { Tabs } from "antd";
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Children } from "./Children.js";

const item = Children.find((item) => item.activeKey === 0);

const defaultPanes = [
    {
        //초기화
        label: item.label,
        children: item.component,
        key: item.activeKey,
    },
];

//함수 표현식 (호이스팅 불가)
const TabPanes = (props) => {
    //nav 클릭 시 label props로 전달 됨
    const title = props.label ? props.label : defaultPanes[0].label;
    const [activeKey, setActiveKey] = useState(defaultPanes[0].key); // 프로젝트 등록 키 0번(활성화)
    const [items, setItems] = useState(defaultPanes); //화면에 띄워져 있는 Tab배열

    const onChange = (key) => {
        setActiveKey(key); //탭이 바뀔때마다 테이블 키 값을 변경해줌
    };

    const addTab = (item) => {
        const existingTab = items.find((tab) => tab.label === item.label);
        if (existingTab) {
            //선택한 라벨(이름)이 있으면 해당하는 라벨(이름)의 컴포넌트로
            //defaultPanes 사용
            setActiveKey(existingTab.key); //선택한 탭의 키로 저장
        } else {
            //없으면 기존 탭에 + 새로운탭 출력
            //useEffect에서 보내주는 component 사용
            setItems([
                ...items,
                {
                    label: item.label,
                    children: item.component, //children 변수명 변경 시 error
                    key: item.activeKey,
                },
            ]);
            setActiveKey(item.activeKey);
            //키를 해당 키로 변경(활성화)
        }
    };

    /** title이 변경 될 때(navigation 클릭 시) 실행 되는 함수 */
    useEffect(() => {
        const item = Children.find((item) => item.label === title);
        if (!item) return; //Children에 없는 메뉴 클릭 시 리턴
        addTab(item);
    }, [title, props.isActive]);

    const removeTab = (targetKey) => {
        // if(items.length === 1) return; //최소 1개 유지
        console.log(targetKey);
        //const targetIndex = items.length - 1; 아이템 길이 -1 로 대체가능
        const targetIndex = items.findIndex((tab) => tab.key === targetKey); //지우는 탭 인덱스 키
        //console.log(targetIndex);
        console.log(items.length - 1);
        const newPanes = items.filter((tab) => tab.key !== targetKey); //지우는 키 를 제외한 탭들
        if (newPanes.length && targetKey === activeKey) {
            //지운 배열의 길이와 지우는키가 같을때
            //옆 배열의 인덱스 번호의 탭을 활성화
            const { key } = newPanes[ //새로운 탭모음(닫은후 테이블 배열) 배열의 길이를 비교해서 마지막 항목을 활성화
                targetIndex === newPanes.length ? targetIndex - 1 : targetIndex
            ];
            setActiveKey(key); //key값(마지막 인덱스) 를 넣어주어 마지막 탭을 활성화
        }
        setItems(newPanes); //새로운 배열 저장

        if (items.length === 1) {
            //모든 탭 종료시 디폴트
            setItems([...defaultPanes]);
            setActiveKey(defaultPanes.key);
        }
    };

    //const onEdit = (targetKey, action) => {
    //    //console.log(action);
    //    console.log(targetKey);
    //    //action 에는 다양항 값이 들어오는데 탭을 x버튼을 눌러 닫으면 remove값이 들어옴
    //    if (action === "add") {
    //        /** 사용하지 않는 기능 */
    //    } else {
    //        removeTab(targetKey);
    //    }
    //};
    const onEdit = (targetKey) => {
        removeTab(targetKey);
    };

    return (
        <div>
            <Tabs //라이브러리 제공
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

//tabs 전체 불러오기
//const mapStateToProps = data => data.tabs

//개별로 불러오는 코드
const mapStateToProps = (data) => ({
    label: data.tabs.label,
    isActive: data.tabs.isActive,
});

/** store와 props 연결 */
//(mapStateToProps를 TabPanes와 연결해서 TabPanes는 props으로 받아서 사용가능)
export default connect(mapStateToProps)(TabPanes);
