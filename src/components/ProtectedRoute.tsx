
import { useAuth } from "@/hooks/use-auth";
import { Navigate, Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";

type ProtectedRouteProps = {
  allowedRoles?: string[];
};

export default function ProtectedRoute({ allowedRoles = [] }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  console.log("ProtectedRoute", { user, loading, allowedRoles });

  // Show loading state while authentication is being checked
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect to login if user is not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to unauthorized page if user doesn't have required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and has required role, render the protected route
  return <Outlet />;
}
