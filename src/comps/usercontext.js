import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  // Fetch user from server
  const fetchUser = async () => {
    try {
      const res = await fetch("https://tagline-production.up.railway.app/api/users/me", {
        credentials: "include", // ✅ send cookies
      });
      if (!res.ok) {
        setUser(null);
        return;
      }
      const data = await res.json();
      setUser({
        username: data.username || data.email.split("@")[0],
        email: data.email,
        balance: `$${data.balance || 0}`,
        tasksCompleted: data.tasksCompleted.length || 0,
      });
    } catch {
      setUser(null);
    }
  };

  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
  };

  const logout = async () => {
    try {
      await fetch("https://tagline-production.up.railway.app/api/users/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch {}
    setUser(null);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUser, updateUser, logout }}>
      {children}
    </UserContext.Provider>
  );
}
