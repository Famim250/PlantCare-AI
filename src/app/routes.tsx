import { createBrowserRouter } from "react-router";
import { Splash } from "./screens/Splash";
import { Home } from "./screens/Home";
import { ImageConfirmation } from "./screens/ImageConfirmation";
import { Analyzing } from "./screens/Analyzing";
import { Result } from "./screens/Result";
import { History } from "./screens/History";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Splash,
  },
  {
    path: "/home",
    Component: Home,
  },
  {
    path: "/confirm",
    Component: ImageConfirmation,
  },
  {
    path: "/analyzing",
    Component: Analyzing,
  },
  {
    path: "/result",
    Component: Result,
  },
  {
    path: "/history",
    Component: History,
  },
]);
