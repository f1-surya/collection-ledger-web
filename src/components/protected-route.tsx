import { Navigate, Outlet, useLocation } from "react-router";
import useAuth from "@/hooks/auth";

export default function ProtectedRoute() {
  const { isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  } else if (!isAuthenticated) {
    return <Navigate to={"/login"} state={{ from: location }} replace />;
  }

  return <Outlet />;
}
