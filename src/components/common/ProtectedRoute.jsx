import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = ({
  isAllowed,
  redirectTo = "/",
  errorRedirectTo = "*", // Nueva prop para redireccionar en caso de error
  children,
}) => {
  if (!isAllowed) {
    return <Navigate to={errorRedirectTo} replace />;
  }
  return children ? children : <Outlet />;
};
