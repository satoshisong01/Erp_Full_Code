import { routes as auth } from "./views/auth";
import { routes as tables } from "./views/tables";
import { routes as misc } from "./views/misc"

export const routes = [
  ...tables,
  ...misc
];

export const authRoutes = [
  ...auth
];
