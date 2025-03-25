import Register from "../pages/Register";
import Login from "../pages/Login";
import Profile from "../pages/Profile";
import SideNav from "./components/SideNav";
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
    errorElement: <h1>Error</h1>,
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
    ],
  },
  {
    path: "*",
    element: <h1>Error</h1>,
  },
];

export default routes;
