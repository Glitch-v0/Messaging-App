import Register from "../pages/Register";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import SideNav from "./components/SideNav";
import Conversations from "../pages/Conversations";
import Logout from "../pages/Logout";
import Requests from "../pages/Requests";
import Friends from "../pages/Friends";
import Online from "../pages/Online";
import NotFound from "../pages/NotFound";
import Error from "../pages/Error";
import { Outlet } from "react-router-dom";

const routes = [
  {
    path: "/",
    element: (
      <>
        <SideNav />
        <Outlet />
      </>
    ),
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "conversations/*",
        element: <Conversations />,
      },
      {
        path: "logout",
        element: <Logout />,
      },
      {
        path: "requests",
        element: <Requests />,
      },
      {
        path: "friends",
        element: <Friends />,
      },
      {
        path: "online",
        element: <Online />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];

export default routes;
