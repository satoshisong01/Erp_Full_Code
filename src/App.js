import React, { Component } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";

import store from "./store/configureStore";
import { authRoutes } from "./routes";
import { Layout } from "./common/layout";
import ModalTest from "./views/sysadmin/modal";
import ClientManagement from "./views/sysadmin/ClientManagement";
import TreeView, { TreeViewItem } from "./common/ui/components/TreeView";

import { newid } from "../src/common/utils/functions";
import classnames from "classnames";
import HtmlRender from "../src/common/utils/components/HtmlRender";
import { findDOMNode } from "react-dom";
import $ from "jquery";
import MenuManagement from "./views/sysadmin/MenuManagement";
import Test from "./views/sysadmin/Test";

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <HashRouter>
                    <Switch>
                        {authRoutes.map((route, idx) => {
                            return route.component ? (
                                <Route
                                    key={idx}
                                    path={route.path}
                                    exact={route.exact}
                                    name={route.name}
                                    render={(props) => (
                                        <route.component {...props} />
                                    )}
                                />
                            ) : null;
                        })}

                        <Route path="/" name="Home" component={Layout} />
                    </Switch>
                </HashRouter>
            </Provider>
        );
    }
}

export default App;
