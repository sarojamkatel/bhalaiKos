import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Building2, Users, FileText, Settings,
  ChevronRight, LogOut, Bell, Shield, Car, PlusCircle,
  BarChart3, Wrench, CreditCard, Receipt, Home, ChevronLeft,
  UserCog, Layers,
} from "lucide-react";
import { getInitials, avatarColor } from "../../utils/formatters";

// Navigation config per role
const NAV_CONFIG = {
  superadmin: {
    label: "Super Admin",
    sections: [
      {
        items: [
          { label: "Dashboard", icon: LayoutDashboard, path: "/superadmin" },
          { label: "Tenants", icon: Building2, path: "/superadmin/tenants" },
          { label: "Analytics", icon: BarChart3, path: "/superadmin/analytics" },
        ],
      },
      {
        title: "System",
        items: [
          { label: "System Settings", icon: Settings, path: "/superadmin/settings" },
        ],
      },
    ],
    user: { name: "Super Admin", email: "superadmin@bhalaikos.com", role: "Super Administrator" },
  },
  admin: {
    label: "Company Admin",
    sections: [
      {
        items: [
          { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
          { label: "Staff", icon: Users, path: "/admin/staff" },
          { label: "Reports", icon: BarChart3, path: "/admin/reports" },
        ],
      },
      {
        title: "Company",
        items: [
          { label: "Settings", icon: Settings, path: "/admin/settings" },
        ],
      },
    ],
    user: { name: "Bikram Shrestha", email: "admin@nawakantipurinsurance.com", role: "Company Admin" },
  },
  staff: {
    label: "Staff Portal",
    sections: [
      {
        items: [
          { label: "Dashboard", icon: LayoutDashboard, path: "/staff" },
          { label: "New Registration", icon: PlusCircle, path: "/staff/register" },
          { label: "Vehicles", icon: Car, path: "/staff/vehicles" },
        ],
      },
      {
        title: "Finance",
        items: [
          { label: "Payments", icon: CreditCard, path: "/staff/payment" },
          { label: "Receipts", icon: Receipt, path: "/staff/receipt" },
        ],
      },
    ],
    user: { name: "Anita Maharjan", email: "anita@nawakantipurinsurance.com", role: "Staff" },
  },
};

export default function Sidebar({ role = "staff", collapsed, isMobile, onToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const config = NAV_CONFIG[role] || NAV_CONFIG.staff;

  const isActive = (path) => {
    if (path === `/${role}`) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("bk_role");
    navigate("/");
  };

  return (
    <aside
      className="no-print sidebar-bg flex flex-col fixed top-0 left-0 h-full z-30 transition-all duration-300 ease-in-out"
      style={{
        width: isMobile ? 256 : (collapsed ? 64 : 256),
        transform: isMobile && collapsed ? "translateX(-100%)" : "translateX(0)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0 shadow-lg shadow-amber-900/30">
            <Shield size={16} className="text-white" />
          </div>
          {(isMobile || !collapsed) && (
            <div className="min-w-0">
              <p className="text-white font-bold text-sm leading-none tracking-tight">BhalaiKos</p>
              <p className="text-zinc-500 text-xs mt-0.5 truncate">Vehicle Insurance</p>
            </div>
          )}
        </div>
        {!isMobile && !collapsed && (
          <button
            onClick={onToggle}
            className="ml-auto text-zinc-500 hover:text-slate-300 p-1 rounded-md hover:bg-zinc-800/5"
          >
            <ChevronLeft size={14} />
          </button>
        )}
        {!isMobile && collapsed && (
          <button
            onClick={onToggle}
            className="absolute -right-3 top-5 w-6 h-6 bg-slate-800 border border-white/10 rounded-full flex items-center justify-center text-zinc-500 hover:text-white hover:bg-slate-700 shadow-lg"
          >
            <ChevronRight size={12} />
          </button>
        )}
      </div>

      {/* Role badge */}
      {(isMobile || !collapsed) && (
        <div className="px-3 pt-3 pb-1">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800/5 border border-white/8">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse-dot shrink-0" />
            <span className="text-xs text-zinc-500 font-medium truncate">{config.label}</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto scrollbar-thin px-2 py-2 space-y-1">
        {config.sections.map((section, si) => (
          <div key={si} className="mb-2">
            {section.title && (isMobile || !collapsed) && (
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-3 py-2">
                {section.title}
              </p>
            )}
            {section.title && !isMobile && collapsed && <div className="my-2 border-t border-white/5" />}
            {section.items.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              const iconOnly = !isMobile && collapsed;
              return (
                <button
                  key={item.path}
                  onClick={() => { navigate(item.path); if (isMobile) onToggle(); }}
                  title={iconOnly ? item.label : undefined}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-all duration-150 group relative
                    ${active
                      ? "bg-amber-500 text-white shadow-lg shadow-amber-900/30"
                      : "text-zinc-500 hover:text-white hover:bg-zinc-800/8"
                    }
                    ${iconOnly ? "justify-center" : ""}
                  `}
                >
                  <Icon size={18} className={`shrink-0 ${active ? "text-white" : "text-zinc-500 group-hover:text-white"}`} />
                  {!iconOnly && <span className="truncate">{item.label}</span>}
                  {!iconOnly && active && (
                    <ChevronRight size={14} className="ml-auto text-amber-300" />
                  )}
                  {iconOnly && (
                    <span className="absolute left-full ml-3 px-2 py-1 bg-slate-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none border border-white/10 shadow-xl z-50 transition-opacity">
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="border-t border-white/5 p-3 shrink-0">
        {(isMobile || !collapsed) ? (
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full ${avatarColor(config.user.name)} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
              {getInitials(config.user.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-white text-xs font-semibold truncate">{config.user.name}</p>
              <p className="text-zinc-500 text-xs truncate">{config.user.role}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="text-zinc-500 hover:text-rose-400 p-1.5 rounded-md hover:bg-zinc-800/5 transition-colors shrink-0"
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogout}
            title="Logout"
            className="w-full flex items-center justify-center text-zinc-500 hover:text-rose-400 p-2 rounded-lg hover:bg-zinc-800/5 transition-colors"
          >
            <LogOut size={18} />
          </button>
        )}
      </div>
    </aside>
  );
}
