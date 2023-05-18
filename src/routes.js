import { routes as auth } from "./views/auth";
import { routes as tables } from "./views/tables";
import { routes as misc } from "./views/misc"
import { routes as sysadmin } from "./views/sysadmin"

export const routes = [
  ...tables,
  ...misc,
  ...sysadmin
];

export const authRoutes = [
  ...auth
];
