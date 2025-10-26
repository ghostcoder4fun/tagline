import { useState, useContext } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { UserContext } from "./usercontext"; // ✅ import context

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { fetchUser } = useContext(UserContext); // ✅ get fetchUser

  const backendUrl = "https://tagline-production.up.railway.app/";

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLogin && form.password !== form.confirmPassword)
      return alert("Passwords do not match!");

    setLoading(true);
    try {
      const endpoint = isLogin ? "api/users/login" : "api/users/register";
      const bodyData = isLogin
        ? { email: form.email, password: form.password } // login
        : { username: form.username, email: form.email, password: form.password }; // register

      const response = await fetch(`${backendUrl}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();
      if (!response.ok) return alert(data.message || "Something went wrong");

      if (isLogin) {
        // ✅ Save tokens
        Cookies.set("accessToken", data.accessToken, { expires: 7, sameSite: "Lax" });
        Cookies.set("refreshToken", data.refreshToken, { expires: 7, sameSite: "Lax" });

        // ✅ Immediately update user context so Navbar reacts
        await fetchUser();

        // ✅ Redirect to home after login
        navigate("/");
      } else {
        // ✅ Registration success → redirect to login page
        alert("Registration successful! Please login to continue.");
        setIsLogin(true);
      }

      setForm({ username: "", email: "", password: "", confirmPassword: "" });
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 sm:px-6 py-16">
      <div className="w-full max-w-md bg-black backdrop-blur-md border border-[#bf1c1c]/50 rounded-2xl shadow-lg p-6 sm:p-8 space-y-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-[#bf1c1c]">
          {isLogin ? "Login" : "Register"}
        </h2>
        <p className="text-center text-gray-400 text-sm sm:text-base">
          {isLogin
            ? "Welcome back! Please login to your account."
            : "Create a new account to get started."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {!isLogin && (
            <div>
              <label className="text-sm text-gray-400">Username</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
                className="w-full p-3 sm:p-3.5 bg-black border border-[#bf1c1c]/40 rounded-xl text-sm sm:text-base focus:outline-none focus:border-[#bf1c1c]"
              />
            </div>
          )}

          <div>
            <label className="text-sm text-gray-400">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="w-full p-3 sm:p-3.5 bg-black border border-[#bf1c1c]/40 rounded-xl text-sm sm:text-base focus:outline-none focus:border-[#bf1c1c]"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Password</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="w-full p-3 sm:p-3.5 bg-black border border-[#bf1c1c]/40 rounded-xl text-sm sm:text-base focus:outline-none focus:border-[#bf1c1c]"
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

          {!isLogin && (
            <div>
              <label className="text-sm text-gray-400">Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                required
                className="w-full p-3 sm:p-3.5 bg-black border border-[#bf1c1c]/40 rounded-xl text-sm sm:text-base focus:outline-none focus:border-[#bf1c1c]"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#bf1c1c] hover:bg-[#a61515] py-3 sm:py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm sm:text-base transition-all ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading
              ? isLogin
                ? "Logging in..."
                : "Registering..."
              : isLogin
              ? "Login"
              : "Register"}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm sm:text-base">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[#bf1c1c] font-semibold hover:opacity-80 transition"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
