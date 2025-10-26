import { useState, useEffect, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { UserContext } from "./usercontext";

export default function Navbar() {
  const { user } = useContext(UserContext); // ✅ reactive
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isLoggedIn = !!user;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-black/95 border-b border-[#bf1c1c]" : "bg-transparent"}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between text-white">
        <Link to="/" className="text-xl sm:text-2xl font-bold text-[#bf1c1c]">Tagline</Link>

        <div className="hidden md:flex items-center space-x-8 text-base sm:text-lg">
          <NavLink to="/">Home</NavLink>
          {isLoggedIn && <NavLink to="/mytasks">My Tasks</NavLink>}
          {isLoggedIn && <NavLink to="/payments">Payments</NavLink>}
        </div>

        <div className="hidden md:flex items-center space-x-4 sm:space-x-5">
          {isLoggedIn ? (
            <Link to="/profile" className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border-2 border-[#bf1c1c] hover:bg-[#bf1c1c]">
              <User size={20} />
            </Link>
          ) : (
            <Link to="/auth" className="bg-[#bf1c1c] px-4 sm:px-5 py-2 rounded-xl font-semibold hover:bg-[#a61515]">Login</Link>
          )}
        </div>

        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-white p-2 rounded-lg">
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      <div className={`md:hidden overflow-hidden transition-all duration-300 bg-black/95 border-t border-[#bf1c1c] ${menuOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="flex flex-col space-y-4 px-6 py-5 text-base sm:text-lg">
          <NavLink to="/">Home</NavLink>
          {isLoggedIn && <NavLink to="/mytasks">My Tasks</NavLink>}
          {isLoggedIn && <NavLink to="/payments">Payments</NavLink>}

          {isLoggedIn ? (
            <Link to="/profile" className="flex items-center space-x-3 border border-[#bf1c1c] rounded-xl px-4 py-3 hover:bg-[#bf1c1c]/10">
              <User size={20} /><span>Profile</span>
            </Link>
          ) : (
            <Link to="/auth" className="bg-[#bf1c1c] px-4 py-3 rounded-xl font-semibold hover:bg-[#a61515]">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return <Link to={to} className={`transition-all duration-200 block py-1 ${isActive ? "text-[#bf1c1c]" : "hover:text-[#bf1c1c]"}`}>{children}</Link>;
}
