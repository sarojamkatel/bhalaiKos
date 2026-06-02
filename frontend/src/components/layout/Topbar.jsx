import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Menu, Plus, ChevronRight, LogOut, User, Settings } from "lucide-react";
import { getInitials, avatarColor } from "../../utils/formatters";

const notifications = [
  { id: 1, title: "New registration submitted", desc: "VH08-05-2026 by Ram Chandra Tiwari", time: "5 min ago", read: false },
  { id: 2, title: "Payment confirmed", desc: "NPR 12,000 via eSewa — Saroj Jamkatel", time: "18 min ago", read: false },
  { id: 3, title: "Renewal reminder", desc: "VH06-05-2026 expires in 7 days", time: "1 hr ago", read: true },
  { id: 4, title: "Staff login", desc: "Suraj logged in from new device", time: "2 hr ago", read: true },
];

export default function Topbar({ role, title, breadcrumbs = [], showNewReg = false, onMenuToggle, isMobile }) {
  const navigate = useNavigate();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  const userConfig = {
    superadmin: { name: "Super Admin", email: "superadmin@bhalaikos.com" },
    admin: { name: "Bikram Shrestha", email: "admin@nawakantipurinsurance.com" },
    staff: { name: "Anita Maharjan", email: "anita@nawakantipurinsurance.com" },
  }[role] || { name: "User", email: "" };

  return (
    <header className="no-print h-16 bg-zinc-800 border-b border-zinc-700  flex items-center px-4 sm:px-6 gap-2 sm:gap-4 sticky top-0 z-20">
      {/* Hamburger — mobile only */}
      {isMobile && (
        <button
          onClick={onMenuToggle}
          className="mr-1 w-9 h-9 flex items-center justify-center rounded-lg hover:bg-zinc-700/40 text-zinc-500 hover:text-zinc-300 transition-colors shrink-0"
        >
          <Menu size={20} />
        </button>
      )}

      {/* Breadcrumb / Title */}
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {breadcrumbs.length > 0 ? (
          <nav className="flex items-center gap-1.5 text-sm">
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight size={14} className="text-zinc-500" />}
                {i < breadcrumbs.length - 1 ? (
                  <button
                    onClick={() => crumb.path && navigate(crumb.path)}
                    className="text-zinc-500 hover:text-amber-400 font-medium"
                  >
                    {crumb.label}
                  </button>
                ) : (
                  <span className="text-zinc-100  font-semibold">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        ) : (
          <h1 className="text-zinc-100  font-bold text-lg leading-none">{title}</h1>
        )}
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* New Registration shortcut for staff */}
        {showNewReg && (
          <button
            onClick={() => navigate("/staff/register")}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg shadow-sm shadow-amber-900/20 transition-colors"
          >
            <Plus size={16} />
            <span>New Registration</span>
          </button>
        )}

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifs(!showNotifs); setShowUser(false); }}
            className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-zinc-700/50  text-zinc-500 dark:text-zinc-500 hover:text-zinc-300 dark:hover:text-slate-200 transition-colors"
          >
            <Bell size={18} />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-zinc-800" />
            )}
          </button>

          {/* Notifications dropdown */}
          {showNotifs && (
            <div className="absolute right-0 top-11 w-80 bg-zinc-800 rounded-xl shadow-xl border border-zinc-700  z-50 animate-scale-in overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-700/50 ">
                <span className="font-semibold text-sm text-zinc-100 ">Notifications</span>
                {unread > 0 && (
                  <span className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-medium">
                    {unread} new
                  </span>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`px-4 py-3 border-b border-slate-50  hover:bg-zinc-700/30  cursor-pointer transition-colors ${!n.read ? "bg-amber-500/[0.08] dark:bg-amber-500/15/20" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.read ? "bg-slate-300" : "bg-amber-500"}`} />
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-zinc-100 ">{n.title}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-0.5 truncate">{n.desc}</p>
                        <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">{n.time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 text-center">
                <button className="text-xs text-amber-400 hover:text-amber-400 font-medium">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User avatar */}
        <div className="relative">
          <button
            onClick={() => { setShowUser(!showUser); setShowNotifs(false); }}
            className={`w-8 h-8 rounded-full ${avatarColor(userConfig.name)} flex items-center justify-center text-white text-xs font-bold hover:ring-2 hover:ring-amber-300 transition-all`}
          >
            {getInitials(userConfig.name)}
          </button>

          {showUser && (
            <div className="absolute right-0 top-11 w-56 bg-zinc-800 rounded-xl shadow-xl border border-zinc-700  z-50 animate-scale-in overflow-hidden">
              <div className="px-4 py-3 border-b border-zinc-700/50 ">
                <p className="text-sm font-semibold text-zinc-100 ">{userConfig.name}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-0.5 truncate">{userConfig.email}</p>
              </div>
              <div className="py-1">
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300  hover:bg-zinc-700/30  transition-colors">
                  <User size={15} className="text-zinc-500" /> Profile
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300  hover:bg-zinc-700/30  transition-colors">
                  <Settings size={15} className="text-zinc-500" /> Preferences
                </button>
                <div className="border-t border-zinc-700/50  mt-1 pt-1">
                  <button
                    onClick={() => { localStorage.removeItem("bk_role"); navigate("/"); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-600 hover:hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut size={15} /> Sign out
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click-away overlay */}
      {(showNotifs || showUser) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => { setShowNotifs(false); setShowUser(false); }}
        />
      )}
    </header>
  );
}
