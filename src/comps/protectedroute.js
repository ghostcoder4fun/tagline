import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./usercontext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useContext(UserContext);

  // Optional: handle loading state while fetching user
  if (loading) return <div>Loading...</div>;

  // If user is not logged in, redirect to auth
  if (!user) return <Navigate to="/auth" replace />;

  // Otherwise, render the page
  return children;
}
