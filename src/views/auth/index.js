import Loadable from "react-loadable";
import { Loading } from "../../common/navigation";

export * from './LoginActions.js';
export * from './loginReducer';

// const Login = Loadable({
//   loader: () => import("./components/Login"),
//   loading: Loading
// });

const Register = Loadable({
  loader: () => import("./components/Register"),
  loading: Loading
});

const Forgot = Loadable({
  loader: () => import("./components/Forgot"),
  loading: Loading
});

export const routes = [
  // {
  //   path: "/login",
  //   exact: true,
  //   component: Login,
  //   name: "Login"
  // },
  {
    path: "/register",
    exact: true,
    component: Register,
    name: "Register"
  },
  {
    path: "/forgot",
    exact: true,
    component: Forgot,
    name: "Forgot"
  }
];
