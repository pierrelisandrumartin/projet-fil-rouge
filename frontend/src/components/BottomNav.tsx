import { NavLink } from "react-router-dom";
import { Icon } from "./ui/Icon";

interface BottomNavProps {
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

function BottomNav({ libraryCount }: BottomNavProps) {
  return (
    <nav
      className="md:hidden fixed inset-x-0 bottom-0 z-30 px-2 pb-2 pt-1.5"
      style={{
        background: "color-mix(in oklch, var(--bg) 85%, transparent)",
        backdropFilter: "blur(20px) saturate(160%)",
        borderTop: "1px solid var(--border)",
        paddingBottom: "max(8px, env(safe-area-inset-bottom))",
      }}
    >
      <div className="flex items-center justify-around">
        {NAV_ITEMS.map((item) => {
          const IconC = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              aria-label={item.label}
              className="relative flex flex-col items-center gap-1 py-1.5 px-2 min-w-[60px] min-h-[44px] rounded-lg
                         transition-all duration-200"
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full"
                      style={{
                        background: "var(--accent)",
                        boxShadow: "0 0 8px var(--accent)",
                      }}
                    />
                  )}
                  <span
                    className="text-[20px] relative"
                    style={{ color: isActive ? "white" : "var(--text-mute)" }}
                  >
                    <IconC />
                    {item.to === "/mylist" &&
                      libraryCount !== undefined &&
                      libraryCount > 0 && (
                        <span
                          className="absolute -top-1.5 -right-2 text-[9px] font-mono tabular-nums
                                     min-w-[16px] h-4 px-1 rounded-full flex items-center justify-center"
                          style={{
                            background: "var(--accent)",
                            color: "white",
                          }}
                        >
                          {libraryCount}
                        </span>
                      )}
                  </span>
                  <span
                    className="text-[10px] font-medium"
                    style={{ color: isActive ? "white" : "var(--text-mute)" }}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;