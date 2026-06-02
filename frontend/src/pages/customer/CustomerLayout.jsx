import { useState } from "react";
import { Outlet, useParams, useNavigate, useLocation } from "react-router-dom";
import { Shield, Phone, MapPin, Globe, Car, FileText, Home, LayoutDashboard, LogOut, User, Menu, X } from "lucide-react";
import { mockTenants } from "../../utils/mockData";
import { getCurrentCustomer, logoutCustomer } from "../../utils/customerAuth";

export default function CustomerLayout() {
  const { tenant } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const tenantData = mockTenants.find(t => t.slug === tenant) || mockTenants[0];
  const [customer, setCustomer] = useState(() => getCurrentCustomer(tenant));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logoutCustomer(tenant);
    setCustomer(null);
    navigate(`/portal/${tenant}`);
    setMobileOpen(false);
  };

  const publicNav = [
    { label: "Home", icon: Home, path: `/portal/${tenant}` },
    { label: "Register", icon: Car, path: `/portal/${tenant}/register` },
  ];
  const authNav = [
    { label: "Home", icon: Home, path: `/portal/${tenant}` },
    { label: "Dashboard", icon: LayoutDashboard, path: `/portal/${tenant}/dashboard` },
    { label: "Register", icon: Car, path: `/portal/${tenant}/register` },
    { label: "My Receipts", icon: FileText, path: `/portal/${tenant}/receipts` },
  ];
  const navItems = customer ? authNav : publicNav;

  const NavLink = ({ item, onClick }) => {
    const active = location.pathname === item.path;
    return (
      <button onClick={() => { navigate(item.path); onClick?.(); }}
        className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
          active ? "bg-amber-500/10 text-amber-400" : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700/50"
        }`}>
        <item.icon size={15} />
        {item.label}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-900">
      {/* Header */}
      <header className="bg-zinc-800 border-b border-zinc-700 sticky top-0 z-20 shadow-sm no-print">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Brand */}
            <button onClick={() => navigate(`/portal/${tenant}`)} className="flex items-center gap-3 shrink-0">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-sm">
                <Shield size={17} className="text-white" />
              </div>
              <div className="text-left">
                <p className="font-bold text-zinc-100 text-sm leading-none">{tenantData.name}</p>
                <p className="text-xs text-zinc-500 mt-0.5 hidden sm:block">{tenant}.bhalaikos.com</p>
              </div>
            </button>

            {/* Desktop nav */}
            <nav className="hidden sm:flex items-center gap-1 flex-1 justify-center">
              {navItems.map(item => <NavLink key={item.path} item={item} />)}
            </nav>

            {/* Right side */}
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              {customer ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 bg-zinc-700/50 rounded-lg px-3 py-1.5">
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center">
                      <User size={12} className="text-amber-400" />
                    </div>
                    <span className="text-sm font-medium text-zinc-300 max-w-[120px] truncate">{customer.name}</span>
                  </div>
                  <button onClick={handleLogout} title="Sign out"
                    className="p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700/50 rounded-lg transition-colors">
                    <LogOut size={15} />
                  </button>
                </div>
              ) : (
                <button onClick={() => navigate(`/portal/${tenant}/auth`)}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors">
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(o => !o)} className="sm:hidden p-2 text-zinc-400 hover:text-zinc-100">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileOpen && (
            <div className="sm:hidden pb-4 border-t border-zinc-700/50 pt-3 space-y-1">
              {navItems.map(item => <NavLink key={item.path} item={item} onClick={() => setMobileOpen(false)} />)}
              {customer ? (
                <div className="pt-2 border-t border-zinc-700/50 mt-2">
                  <p className="text-xs text-zinc-500 px-3.5 mb-2">{customer.name}</p>
                  <button onClick={handleLogout}
                    className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 w-full">
                    <LogOut size={15} /> Sign Out
                  </button>
                </div>
              ) : (
                <button onClick={() => { navigate(`/portal/${tenant}/auth`); setMobileOpen(false); }}
                  className="w-full mt-2 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl">
                  Sign In / Sign Up
                </button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Outlet context={{ tenantData, customer, setCustomer }} />
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-700 bg-zinc-800 mt-16 no-print">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield size={14} className="text-amber-400" />
                <span className="font-bold text-sm text-zinc-100">{tenantData.name}</span>
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-zinc-500">
                <span className="flex items-center gap-1"><Phone size={11} /> {tenantData.phone}</span>
                <span className="flex items-center gap-1"><MapPin size={11} /> {tenantData.address}</span>
              </div>
            </div>
            <div className="text-xs text-zinc-500 text-right">
              <p className="flex items-center gap-1 justify-end"><Globe size={11} /> {tenant}.bhalaikos.com</p>
              <p className="mt-1">Powered by <span className="font-semibold text-amber-400">BhalaiKos</span></p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
