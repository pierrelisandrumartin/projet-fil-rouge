import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const linkBase = "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors";
  const linkInactive = "text-[#9A9AB0] hover:text-white hover:bg-[#252836]";
  const linkActive = "text-white bg-[#7C5CBF]";

  return (
    <nav className="fixed top-0 left-0 h-screen w-60 bg-[#1A1D27] flex flex-col justify-between px-4 py-6">

      {/* Logo */}
      <div>
        <h1 className="text-white text-xl font-bold mb-8">AppName</h1>

        {/* Nav links */}
        <ul className="flex flex-col gap-2">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              <span aria-hidden="true"></span> Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/catalog"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              <span aria-hidden="true"></span> Catalog
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/mylist"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              <span aria-hidden="true"></span> My List
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? linkActive : linkInactive}`
              }
            >
              <span aria-hidden="true"></span> Profile
            </NavLink>
          </li>
        </ul>
      </div>

      {/* User section */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-full bg-[#7C5CBF] flex items-center justify-center text-white text-sm"
          aria-hidden="true"
        >
          K
        </div>
        <div>
          <p className="text-white text-sm font-medium">Username</p>
          <button
            type="button"
            onClick={handleLogout}
            className="text-[#9A9AB0] text-xs hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0"
          >
            Logout
          </button>
        </div>
      </div>

    </nav>
  );
}

export default Navbar;