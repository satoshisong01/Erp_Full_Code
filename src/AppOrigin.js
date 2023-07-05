import React, { Component } from "react";
import { HashRouter, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";

import store from "./store/configureStore";
import { authRoutes } from "./routes";
import { Layout } from "./common/layout";
import ModalTest from "./views/sysadmin/modal";
import ClassificationCode from "./views/sysadmin/ClassificationCode";
import TreeView, { TreeViewItem } from "./common/ui/components/TreeView";

import { newid } from "../src/common/utils/functions";
import classnames from "classnames";
import HtmlRender from "../src/common/utils/components/HtmlRender";
import { findDOMNode } from "react-dom";
import MenuManagement from "./views/sysadmin/MenuManagement";
import Test from "./views/sysadmin/Test";
import ModalPage from "./common/tableHeader/ModalPage";
import ModalSearch from "./common/tableHeader/ModalSearch";
import MaterialCostDetails from "./views/pre-cost/MaterialCostDetails";
//import OutsourcingCostDetails from "./views/pre-cost/OutsourcingCostDetails";
//import ProductList from "./views/tables/ProductList";
//import TestTable from "./views/pre-cost/testtable";
//import TestTable2 from "./views/pre-cost/TestTable2";
import ErrorlogManagement from "./views/sysadmin/ErrorlogManagement";
import ResizableTable from "./views/tables/ResizableTable";

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
            //<ResizableTable />
            //<OutsourcingCostDetails />
            //<ErrorlogManagement />
            //<TestTable2 />
            //<ProductList />
            //<ModalSearch />
            //<MaterialCostDetails />
        );
    }
}

export default App;
