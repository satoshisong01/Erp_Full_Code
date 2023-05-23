import { Button, Tabs } from "antd";
import React, { createContext, useContext, useState } from "react";
import { Msg } from "../../i18n";

import SmartMenuList from "./NavMenuList";
import { TitleNameContext } from "../../../context/TitleNameContext";

import store from "../../../store/configureStore";
import { onTabAdd } from "../../tabs/TabsActions.js";

const MyContext = createContext;

const SmartMenuItem = ({ item, parentFn, value }) => {
    const [text, setText] = useState("");

    const handleClick = (e) => {
        const data = e.target.innerText;
        setText("55555555");

        if (typeof parentFn === "function") {
            parentFn(e.target.innerText);
            console.log("성공?");
        } else {
            console.log("함수가 아니였다");
        }

        if (!parentFn) {
            console.log("가즈아");
        } else {
            parentFn(e.target.innerText);
            console.log("가즈아2");
        }

        //store.dispatch(onTabAdd(e.target.innerText));
    };

    const title = !item.parent ? (
        <div>
            <span className="menu-item-parent">
                <Msg phrase={item.title} />
            </span>
        </div>
    ) : (
        <Msg phrase={item.title} />
    );

    const badge = item.badge ? (
        <span className={item.badge.class}>{item.badge.label || ""}</span>
    ) : null;
    const childItems = item.items ? (
        <SmartMenuList items={item.items} parentFn={parentFn} />
    ) : null;

    const icon = item.icon ? (
        item.counter ? (
            <i className={item.icon}>
                <em>{item.counter}</em>
            </i>
        ) : (
            <i className={item.icon} />
        )
    ) : null;

    const liClassName = "active";

    return (
        <li className={liClassName}>
            <a title={item.title} onClick={handleClick}>
                {icon} {title} {badge}
            </a>
            {childItems}
        </li>
    );
};

export default SmartMenuItem;
