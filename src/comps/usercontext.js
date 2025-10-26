import { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    const token = Cookies.get("accessToken");
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch user");
      const data = await res.json();
      setUser({
        name: data.username || data.email.split("@")[0],
        email: data.email,
        balance: `$${data.balance || 0}`,
        tasksCompleted: data.tasksCompleted.length || 0,
      });
    } catch {
      setUser(null);
    }
  };

  const updateUser = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData })); // ✅ replaces reference
  };

  const logout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    setUser(null); // ✅ triggers re-render everywhere
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
