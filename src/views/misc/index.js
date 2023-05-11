import Loadable from "react-loadable";
import { Loading } from "../../common/navigation";

export const Page404 = Loadable({
  loader: () => import("./components/Page404"),
  loading: Loading
});

const Page500 = Loadable({
  loader: () => import("./components/Page500"),
  loading: Loading
});

export const routes = [
  {
    path: "/misc/404",
    exact: true,
    component: Page404,
    name: "Page 404"
  },
  {
    path: "/misc/500",
    exact: true,
    component: Page500,
    name: "Page 500"
  }
];
