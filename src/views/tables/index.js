import Loadable from "react-loadable";
import { Loading } from "../../common/navigation";

const Datatables = Loadable({
  loader: () => import("./components/Datatables"),
  loading: Loading
});

const NormalTables = Loadable({
  loader: () => import("./components/NormalTables"),
  loading: Loading
});

const EasyTables = Loadable({
  loader: () => import("./components/EasyTables"),
  loading: Loading
});

export const routes = [
  {
    path: "/tables/datatables",
    exact: true,
    component: Datatables,
    name: "Datatables"
  },
  {
    path: "/tables/normal-tables",
    exact: true,
    component: NormalTables,
    name: "NormalTables"
  },
  {
    path: "/tables/easy-tables",
    exact: true,
    component: EasyTables,
    name: "EasyTables"
  },

];
