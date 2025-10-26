import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Edit3, Settings, LogOut, CheckCircle, DollarSign, Clock, Eye, EyeOff, Save, Key
} from "lucide-react";
import { UserContext } from "./usercontext";
import Cookies from "js-cookie";


export default function Profile() {
  const { user, updateUser, fetchUser, logout } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("stats");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();
  const backendUrl = "https://tagline-production.up.railway.app/";

  useEffect(() => {
    if (!user) return;
    setForm({
      username: user.name,
      email: user.email,
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }, [user]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    try {
      const token = Cookies.get("accessToken");
      if (!token) return;

      const res = await fetch(`${backendUrl}api/users/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          oldPassword: form.oldPassword,
          newPassword: form.newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Update failed");
        return;
      }

      // Update user in context immediately
      updateUser({
        name: form.username,
        email: form.email,
        balance: data.balance ? `$${data.balance}` : user.balance,
      });

      alert("Profile updated successfully!");
      setForm({ ...form, oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error(err);
      alert("An error occurred. Try again.");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-28 pb-16 px-4 sm:px-6">
      <div className="w-full max-w-3xl mx-auto bg-black backdrop-blur-md border border-[#bf1c1c]/50 rounded-2xl shadow-lg p-6 sm:p-8 space-y-6 sm:space-y-8">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-4 sm:gap-0">
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#bf1c1c]/20 border-2 border-[#bf1c1c] flex items-center justify-center text-2xl sm:text-3xl font-bold text-[#bf1c1c]">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="truncate">
              <h2 className="text-xl sm:text-2xl font-semibold truncate">{user.name}</h2>
              <p className="text-gray-400 truncate">{user.email}</p>
              <p className="mt-1 sm:mt-2 text-[#bf1c1c] font-semibold">
                Balance: {user.balance}
              </p>
            </div>
          </div>

          <div className="flex space-x-2 sm:space-x-3 mt-4 sm:mt-0 flex-wrap">
            <button
              onClick={() => setActiveTab("stats")}
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-2 text-sm sm:text-base ${
                activeTab === "stats"
                  ? "bg-[#bf1c1c] text-white"
                  : "border border-[#bf1c1c] text-gray-300 hover:bg-[#bf1c1c]/20"
              }`}
            >
              <Edit3 size={18} />
              My Stats
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-3 py-2 rounded-xl transition-all flex items-center gap-2 text-sm sm:text-base ${
                activeTab === "settings"
                  ? "bg-[#bf1c1c] text-white"
                  : "border border-[#bf1c1c] text-gray-300 hover:bg-[#bf1c1c]/20"
              }`}
            >
              <Settings size={18} />
              Settings
            </button>
          </div>
        </div>

        <hr className="border-[#bf1c1c]/30" />

        {activeTab === "stats" ? (
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold mb-4">My Stats</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <StatCard icon={<CheckCircle size={28} />} label="Tasks Completed" value={user.tasksCompleted || 0} />
              <StatCard icon={<DollarSign size={28} />} label="Total Earnings" value={user.balance} />
              <StatCard icon={<Clock size={28} />} label="Avg Task Time" value="3.8 min" />
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-[#bf1c1c]">
              Account Settings
            </h3>
            <form onSubmit={handleSave} className="space-y-4 sm:space-y-5">
              {/* Form fields (same as before) */}
              <div>
                <label className="text-sm text-gray-400">Username</label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className="w-full p-3 sm:p-3.5 bg-black border border-[#bf1c1c]/40 rounded-xl focus:outline-none focus:border-[#bf1c1c] text-sm sm:text-base"
                  placeholder="Enter username"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-400">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full p-3 sm:p-3.5 bg-black border border-[#bf1c1c]/40 rounded-xl focus:outline-none focus:border-[#bf1c1c] text-sm sm:text-base"
                  placeholder="Enter email"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-400">Old Password</label>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="oldPassword"
                    value={form.oldPassword}
                    onChange={handleChange}
                    className="w-full p-3 sm:p-3.5 bg-black border border-[#bf1c1c]/40 rounded-xl focus:outline-none focus:border-[#bf1c1c] text-sm sm:text-base"
                    placeholder="Enter old password"
                  />
                  <Key className="absolute right-3 top-3 sm:top-3.5 text-[#bf1c1c]" size={18} />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400">New Password</label>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    className="w-full p-3 sm:p-3.5 bg-black border border-[#bf1c1c]/40 rounded-xl focus:outline-none focus:border-[#bf1c1c] text-sm sm:text-base"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 sm:top-3.5 text-[#bf1c1c]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400">Confirm New Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-3 sm:p-3.5 bg-black border border-[#bf1c1c]/40 rounded-xl focus:outline-none focus:border-[#bf1c1c] text-sm sm:text-base"
                  placeholder="Re-enter new password"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#bf1c1c] hover:bg-[#a61515] py-3 sm:py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm sm:text-base transition-all"
              >
                <Save size={18} /> Save Changes
              </button>
            </form>
          </div>
        )}

        <div className="flex justify-end mt-4 sm:mt-6">
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="flex items-center gap-2 text-gray-400 hover:text-[#bf1c1c] transition-colors text-sm sm:text-base"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center justify-center border border-[#bf1c1c]/40 bg-black rounded-2xl p-4 sm:p-6 shadow hover:shadow-[#bf1c1c]/20 hover:-translate-y-1 transition-all duration-300">
      <div className="text-[#bf1c1c] mb-2 sm:mb-3">{icon}</div>
      <p className="text-gray-400 text-xs sm:text-sm">{label}</p>
      <p className="text-white text-sm sm:text-lg font-semibold">{value}</p>
    </div>
  );
}
