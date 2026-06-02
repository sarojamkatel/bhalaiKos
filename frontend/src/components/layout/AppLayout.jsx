import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const getPageMeta = (role, pathname) => {
  const routes = {
    superadmin: {
      "/superadmin": { title: "Dashboard", breadcrumbs: [{ label: "Dashboard" }], showNewReg: false },
      "/superadmin/tenants": { title: "Tenants", breadcrumbs: [{ label: "Dashboard", path: "/superadmin" }, { label: "Tenants" }], showNewReg: false },
      "/superadmin/analytics": { title: "Analytics", breadcrumbs: [{ label: "Dashboard", path: "/superadmin" }, { label: "Analytics" }], showNewReg: false },
      "/superadmin/settings": { title: "System Settings", breadcrumbs: [{ label: "Dashboard", path: "/superadmin" }, { label: "Settings" }], showNewReg: false },
    },
    admin: {
      "/admin": { title: "Dashboard", breadcrumbs: [{ label: "Dashboard" }], showNewReg: false },
      "/admin/staff": { title: "Staff Management", breadcrumbs: [{ label: "Dashboard", path: "/admin" }, { label: "Staff" }], showNewReg: false },
      "/admin/reports": { title: "Reports", breadcrumbs: [{ label: "Dashboard", path: "/admin" }, { label: "Reports" }], showNewReg: false },
      "/admin/settings": { title: "Settings", breadcrumbs: [{ label: "Dashboard", path: "/admin" }, { label: "Settings" }], showNewReg: false },
    },
    staff: {
      "/staff": { title: "Dashboard", breadcrumbs: [{ label: "Dashboard" }], showNewReg: true },
      "/staff/register": { title: "New Registration", breadcrumbs: [{ label: "Dashboard", path: "/staff" }, { label: "New Registration" }], showNewReg: false },
      "/staff/vehicles": { title: "Vehicles", breadcrumbs: [{ label: "Dashboard", path: "/staff" }, { label: "Vehicles" }], showNewReg: true },
      "/staff/payment": { title: "Payment", breadcrumbs: [{ label: "Dashboard", path: "/staff" }, { label: "Payment" }], showNewReg: false },
      "/staff/receipt": { title: "Receipt", breadcrumbs: [{ label: "Dashboard", path: "/staff" }, { label: "Receipt" }], showNewReg: false },
    },
  };
  return routes[role]?.[pathname] || { title: "BhalaiKos", breadcrumbs: [], showNewReg: false };
};

export default function AppLayout({ role }) {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const meta = getPageMeta(role, location.pathname);

  useEffect(() => {
    const handle = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setCollapsed(true);
    };
    handle();
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  // On mobile: sidebar is a full overlay (no margin shift)
  // On desktop: sidebar shifts content
  const mainMarginLeft = isMobile ? 0 : (collapsed ? 64 : 260);

  return (
    <div className="min-h-screen bg-zinc-900  flex">
      <Sidebar
        role={role}
        collapsed={collapsed}
        isMobile={isMobile}
        onToggle={() => setCollapsed(!collapsed)}
      />

      <div
        className="flex flex-col flex-1 min-w-0 transition-all duration-300"
        style={{ marginLeft: mainMarginLeft }}
      >
        <Topbar
          role={role}
          title={meta.title}
          breadcrumbs={meta.breadcrumbs}
          showNewReg={meta.showNewReg}
          onMenuToggle={() => setCollapsed(!collapsed)}
          isMobile={isMobile}
        />
        <main className="flex-1 p-4 sm:p-6 animate-fade-in-up">
          <Outlet />
        </main>
      </div>

      {/* Mobile overlay — tap to close sidebar */}
      {isMobile && !collapsed && (
        <div
          className="no-print fixed inset-0 bg-black/50 z-20"
          onClick={() => setCollapsed(true)}
        />
      )}
    </div>
  );
}
