import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AppContext } from "../context.jsx";

const ProtectedRoutes = () => {
  const { hasToken } = useContext(AppContext);

  return hasToken ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
