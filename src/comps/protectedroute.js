import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./usercontext";

export default function ProtectedRoute({ children }) {
  const { user, loadingUser } = useContext(UserContext);

  // Optional: handle loading state while fetching user
  if (loadingUser)
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        Loading...
      </div>
    );

  // If user is not logged in, redirect to auth
  if (!user) return <Navigate to="/auth" replace />;

  // Otherwise, render the page
  return children;
}
