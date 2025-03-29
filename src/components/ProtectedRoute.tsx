
import { useAuth } from "@/hooks/use-auth";
import { Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";

type ProtectedRouteProps = {
  allowedRoles?: string[];
};

export default function ProtectedRoute({ allowedRoles = [] }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
