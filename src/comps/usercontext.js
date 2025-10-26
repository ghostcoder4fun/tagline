import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true); // ✅ loading state

  const backendUrl = "https://tagline-production.up.railway.app";

  // Fetch user from server
  const fetchUser = async () => {
    setLoadingUser(true);
    try {
      const res = await fetch(`${backendUrl}/api/users/me`, {
        credentials: "include", // send cookies
      });
      if (!res.ok) {
        setUser(null);
        return;
      }
      const data = await res.json();
      setUser({
        name: data.username || data.email.split("@")[0],
        email: data.email,
        balance: `$${data.balance || 0}`,
        tasksCompleted: data.tasksCompleted.length || 0,
      });
    } catch (err) {
      console.error("Fetch user error:", err);
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  };

  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  const logout = async () => {
    try {
      await fetch(`${backendUrl}/api/users/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    }
    setUser(null);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, loadingUser, setUser, fetchUser, updateUser, logout }}
    >
      {children}
    </UserContext.Provider>
  );
}
