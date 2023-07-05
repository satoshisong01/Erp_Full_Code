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
import DataTable from "./views/sysadmin/DataTable";
import Test11111 from "./DateTest";
import FetchTest from "./FetchTest";
import AxiosTest from "./AxiosTest";
import XlsxTest from "./views/sysadmin/XlsxTest";
import MyDataTable from "./views/sysadmin/MyDataTable";
import YourComponent from "./views/sysadmin/YourComponent";
import InputTest from "./InputTest";
import PrintTest from "./views/tables/PrintTest";
import Modal from "./views/sysadmin/modal";
import EditData from "./common/tableHeader/EditData";
import SearchComponent from "./views/sysadmin/SearchComponent";
import CopyButton from "./views/sysadmin/CopyTest";
import DataTableComponent from "./views/sysadmin/DataTableComponent";
import DataTableComponent2Mook from "./views/sysadmin/DataTableComponent2mook";
import GroupCode from "./views/sysadmin/GroupCode";
import ToggleButton from "./views/utils/ToggleButton";

class App extends Component {
    render() {
        return (
            //<Test11111 />
            //<FetchTest />
            <>
                {/*<AxiosTest />*/}
                {/*<DataTable />*/}
                {/*<XlsxTest />*/}
                {/*<MyDataTable />*/}
                {/*<YourComponent />*/}
                {/*<InputTest />*/}
                {/*<PrintTest />*/}
                {/*<Modal />*/}
                {/*<ModalSearch />*/}
                {/*<EditData />*/}
                {/*<SearchComponent />*/}
                {/*<CopyButton />*/}
                {/*<DataTableComponent />*/}
                {/*<DataTableComponent2Mook />*/}
                {/*<GroupCode />*/}
                {/*<ToggleButton />*/}
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
            </>
            //<ModalSearch />
            //<DataTable />
            //<ResizableTable />
            //<OutsourcingCostDetails />
            //<ErrorlogManagement />
            //<TestTable2 />
            //<ProductList />
            //<MaterialCostDetails />
        );
    }
}

export default App;
