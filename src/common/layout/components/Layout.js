import React, { createContext, useCallback, useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { Navigation } from "../../navigation";
import Ribbon from "./Ribbon";
import LayoutSwitcher from "./LayoutSwitcher";

import Header from "./Header";
import Footer from "./Footer";

import TabView from "../../tabs/components/TabView.jsx";
import Testing from "../../../views/Testing";
import { TitleNameProvider } from "../../../context/TitleNameContext";

//const MyContext = createContext();

const Layout = () => {
    const [text, setText] = useState("");
    const parentFn = (x) => {
        setText(x);
        console.log(x, "최상단 1번계층");
    };
    useEffect(() => {
        console.log(text, "최상단 1번계층 이펙트");
    }, [text]);

    console.log(text);

    return (
        <>
            <Header />
            <Navigation parentFn={parentFn} />
            <div id="main" role="main">
                {/* LayoutSwitcher -> Layout Options */}
                <LayoutSwitcher />

                {/* Ribbon -> Home */}
                <Ribbon />

                <Testing text={text} />
                {/*<TabView />*/}

                {/*<Switch>
          {routes.map((route, idx) => {
            return route.component ? (
              <Route
                key={idx}
                path={route.path}
                exact={route.exact}
                name={route.name}
                render={(props) => <route.component {...props} />}
              />
            ) : null;
          })}
          <Redirect from="/" to="/misc/404" />
        </Switch>*/}
            </div>
            <Footer />
        </>
    );
};

export default Layout;
