import { Outlet, createBrowserRouter } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Conversations from "./pages/Conversations";
import Logout from "./pages/Logout";
import Requests from "./pages/Requests";
import Friends from "./pages/Friends";
import Online from "./pages/Online";
import NotFound from "./pages/NotFound";
import Error from "./pages/Error";
import SideNav from "./components/SideNav";
import ProtectedRoutes from "./components/ProtectedRoutes";
import { Toaster } from "sonner";

const routes = [
  {
    path: "/",
    element: (
      <>
        <SideNav />
        <Outlet />
        <Toaster
          toastOptions={{
            style: {
              border: "1px solid var(--font-color)",
              color: "var(--font-color)",
              background: "var(--nav-background-color)",
              fontSize: "1rem",
            },
            closeButton: true,
          }}
          position="top-center"
        />
      </>
    ),
    errorElement: (
      <>
        <SideNav />
        <Error />
      </>
    ),
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
        element: <ProtectedRoutes />,
        children: [
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "conversations/*",
            element: <Conversations />,
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
        ],
      },
      {
        path: "logout",
        element: <Logout />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
