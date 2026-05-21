import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Icon } from "./ui/Icon";
import Logo from "./Logo";

interface NavbarProps {
  drawerOpen?: boolean;
  onCloseDrawer?: () => void;
  libraryCount?: number;
}

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType;
  end?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Home", icon: Icon.Home, end: true },
  { to: "/mylist", label: "My list", icon: Icon.Library },
  { to: "/profile", label: "Profile", icon: Icon.User },
];

function Navbar({ drawerOpen = false, onCloseDrawer, libraryCount }: NavbarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const content = (
    <>
      <div className="px-5 pt-6 pb-4">
        <Logo />
      </div>

      <nav className="px-3 mt-2 flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => {
          const IconC = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => onCloseDrawer?.()}
              className="group relative flex items-center gap-3 h-11 px-3 rounded-xl
                         text-[14px] transition-all duration-200
                         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span
                      className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full"
                      style={{
                        background: "var(--accent)",
                        boxShadow: "0 0 8px var(--accent)",
                      }}
                    />
                  )}
                  <span
                    className="text-[18px] flex items-center"
                    style={{ color: isActive ? "white" : "var(--text-dim)" }}
                  >
                    <IconC />
                  </span>
                  <span
                    className="flex-1 text-left"
                    style={{ color: isActive ? "white" : "var(--text-dim)" }}
                  >
                    {item.label}
                  </span>
                  {item.to === "/mylist" && libraryCount !== undefined && libraryCount > 0 && (
                    <span
                      className="text-[10px] font-mono px-1.5 py-0.5 rounded-md tabular-nums"
                      style={{
                        background: isActive ? "rgba(255,255,255,.1)" : "var(--surface-2)",
                        color: isActive ? "white" : "var(--text-mute)",
                      }}
                    >
                      {libraryCount}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div
        className="mt-auto p-3 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className="flex items-center gap-3 p-2 rounded-xl"
          style={{ background: "var(--surface-2)" }}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold"
            style={{
              background: "linear-gradient(135deg, var(--accent), var(--accent-2))",
            }}
            aria-hidden="true"
          >
            P
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] text-white font-medium truncate">
              Pierre
            </div>
            <div
              className="text-[11px] truncate"
              style={{ color: "var(--text-mute)" }}
            >
              Connected
            </div>
          </div>
          <button
            onClick={handleLogout}
            aria-label="Log out"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[15px] transition-colors duration-200"
            style={{ color: "var(--text-mute)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#FCA5A5";
              e.currentTarget.style.background = "rgba(239,68,68,.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text-mute)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            <Icon.Logout />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <aside
        className="hidden md:flex flex-col fixed inset-y-0 left-0 w-[240px] z-30"
        style={{
          background: "var(--surface)",
          borderRight: "1px solid var(--border)",
        }}
      >
        {content}
      </aside>

      <div
        className={`md:hidden fixed inset-0 z-50 ${
          drawerOpen ? "" : "pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 transition-opacity duration-300 ${
            drawerOpen ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background: "rgba(5,6,10,.7)",
            backdropFilter: "blur(8px)",
          }}
          onClick={onCloseDrawer}
        />
        <aside
          className={`absolute inset-y-0 left-0 w-[280px] flex flex-col transition-transform duration-300
                      ${drawerOpen ? "translate-x-0" : "-translate-x-full"}`}
          style={{
            background: "var(--surface)",
            borderRight: "1px solid var(--border)",
          }}
        >
          {content}
        </aside>
      </div>
    </>
  );
}

export default Navbar;