import { useState } from "react";
import {
  Search, Plus, Building2, Users, Car, TrendingUp, MoreVertical,
  CheckCircle2, XCircle, AlertCircle, Eye, Trash2, Ban, ExternalLink,
  X, Mail, Phone, MapPin, Globe, Shield,
} from "lucide-react";
import { mockTenants } from "../../utils/mockData";
import { formatNPR, formatDate, statusConfig, avatarColor, getInitials } from "../../utils/formatters";

const PLANS = ["All Plans", "Starter", "Business", "Enterprise"];
const STATUSES = ["All Status", "active", "suspended"];

function TenantModal({ tenant, onClose }) {
  if (!tenant) return null;
  const status = statusConfig[tenant.status];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-800 rounded-2xl shadow-2xl w-full max-w-lg animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl ${avatarColor(tenant.name)} flex items-center justify-center text-white font-bold text-lg`}>
                {getInitials(tenant.name)}
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">{tenant.name}</h3>
                <p className="text-amber-300 text-sm">{tenant.domain}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-zinc-800/10">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Status + Plan */}
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${status.color}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" /> {status.label}
            </span>
            <span className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
              tenant.plan === "Enterprise" ? "bg-amber-500/15 text-amber-400" :
              tenant.plan === "Business" ? "bg-amber-500/15 text-amber-400" :
              "bg-zinc-700/40 text-zinc-400"
            }`}>
              {tenant.plan}
            </span>
          </div>

          {/* Admin info */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Admin Contact</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm text-zinc-300">
                <Users size={14} className="text-zinc-500" /> {tenant.adminName}
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-300">
                <Mail size={14} className="text-zinc-500" />
                <span className="truncate text-xs">{tenant.adminEmail}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-300">
                <Phone size={14} className="text-zinc-500" /> {tenant.phone}
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-300">
                <MapPin size={14} className="text-zinc-500" />
                <span className="truncate text-xs">{tenant.address}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Staff", value: tenant.staffCount, icon: Users, color: "text-amber-400 bg-amber-500/10" },
              { label: "Vehicles", value: tenant.vehicleCount.toLocaleString(), icon: Car, color: "text-amber-400 bg-amber-500/10" },
              { label: "Revenue/mo", value: formatNPR(tenant.monthlyRevenue, true), icon: TrendingUp, color: "text-amber-400 bg-amber-50" },
            ].map((s) => (
              <div key={s.label} className="bg-zinc-900/50 rounded-xl p-3 text-center border border-zinc-700/50">
                <div className={`w-7 h-7 rounded-lg ${s.color} flex items-center justify-center mx-auto mb-1`}>
                  <s.icon size={14} />
                </div>
                <p className="text-sm font-bold text-zinc-100">{s.value}</p>
                <p className="text-xs text-zinc-500">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Globe size={12} />
            <a href={`https://${tenant.domain}`} className="text-amber-400 hover:underline">{tenant.domain}</a>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 px-6 pb-5">
          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl transition-colors">
            <Eye size={15} /> View Portal
          </button>
          {tenant.status === "active" ? (
            <button className="flex items-center gap-2 py-2.5 px-4 bg-amber-50 hover:bg-amber-500/15 text-amber-400 text-sm font-semibold rounded-xl border border-amber-500/30 transition-colors">
              <Ban size={15} /> Suspend
            </button>
          ) : (
            <button className="flex items-center gap-2 py-2.5 px-4 bg-amber-500/10 hover:bg-amber-500/15 text-amber-400 text-sm font-semibold rounded-xl border border-amber-500/30 transition-colors">
              <CheckCircle2 size={15} /> Activate
            </button>
          )}
          <button className="flex items-center gap-2 py-2.5 px-4 bg-red-50 hover:bg-red-100 text-red-700 text-sm font-semibold rounded-xl border border-red-200 transition-colors">
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

function CreateTenantModal({ onClose }) {
  const [form, setForm] = useState({ name: "", adminName: "", adminEmail: "", phone: "", address: "", plan: "Starter" });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-800 rounded-2xl shadow-2xl w-full max-w-md animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-zinc-700/50">
          <div>
            <h3 className="font-bold text-zinc-100">Create New Tenant</h3>
            <p className="text-xs text-zinc-500 mt-0.5">Set up a new company on BhalaiKos</p>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-400 p-1"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          {[
            { label: "Company Name", key: "name", placeholder: "e.g. Nawa Kantipur Insurance" },
            { label: "Admin Full Name", key: "adminName", placeholder: "Company admin name" },
            { label: "Admin Email", key: "adminEmail", placeholder: "admin@company.com", type: "email" },
            { label: "Phone Number", key: "phone", placeholder: "+977-9XXXXXXXXX" },
            { label: "Address", key: "address", placeholder: "City, District" },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">{f.label}</label>
              <input
                type={f.type || "text"}
                value={form[f.key]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                placeholder={f.placeholder}
                className="w-full px-3.5 py-2.5 text-sm bg-zinc-800 border border-slate-300 rounded-xl text-zinc-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Plan</label>
            <select
              value={form.plan}
              onChange={(e) => setForm({ ...form, plan: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-zinc-800 border border-slate-300 rounded-xl text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {["Starter", "Business", "Enterprise"].map((p) => <option key={p}>{p}</option>)}
            </select>
          </div>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose} className="flex-1 py-2.5 text-sm font-semibold text-zinc-300 bg-zinc-700/40 hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
          <button onClick={onClose} className="flex-1 py-2.5 text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-sm transition-colors">Create Tenant</button>
        </div>
      </div>
    </div>
  );
}

export default function TenantsPage() {
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("All Plans");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [selected, setSelected] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const filtered = mockTenants.filter((t) => {
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.adminEmail.toLowerCase().includes(search.toLowerCase());
    const matchPlan = planFilter === "All Plans" || t.plan === planFilter;
    const matchStatus = statusFilter === "All Status" || t.status === statusFilter;
    return matchSearch && matchPlan && matchStatus;
  });

  const statusIcons = { active: CheckCircle2, suspended: Ban, inactive: AlertCircle };

  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-100">Tenant Management</h2>
          <p className="text-sm text-zinc-500 mt-0.5">{mockTenants.length} companies registered on BhalaiKos</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl shadow-sm shadow-amber-900/20 transition-colors self-start sm:self-auto"
        >
          <Plus size={16} /> Create Tenant
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total", value: mockTenants.length, color: "text-zinc-100", bg: "bg-zinc-900/50 border-zinc-700" },
          { label: "Active", value: mockTenants.filter(t=>t.status==="active").length, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
          { label: "Suspended", value: mockTenants.filter(t=>t.status==="suspended").length, color: "text-red-700", bg: "bg-red-50 border-red-100" },
          { label: "Enterprise", value: mockTenants.filter(t=>t.plan==="Enterprise").length, color: "text-amber-400", bg: "bg-amber-500/10 border-teal-200" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.bg}`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-zinc-800 rounded-2xl border border-zinc-700 p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by company name or email…"
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-zinc-900/50 border border-zinc-700 rounded-xl text-zinc-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-zinc-800"
            />
          </div>
          <select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)} className="px-3.5 py-2.5 text-sm bg-zinc-900/50 border border-zinc-700 rounded-xl text-zinc-300 focus:outline-none focus:ring-2 focus:ring-amber-500">
            {PLANS.map((p) => <option key={p}>{p}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3.5 py-2.5 text-sm bg-zinc-900/50 border border-zinc-700 rounded-xl text-zinc-300 focus:outline-none focus:ring-2 focus:ring-amber-500">
            {STATUSES.map((s) => <option key={s} value={s}>{s === "All Status" ? s : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
      </div>

      {/* Tenants grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((tenant) => {
          const status = statusConfig[tenant.status] || statusConfig.inactive;
          return (
            <div key={tenant.id} className="bg-zinc-800 rounded-2xl border border-zinc-700 p-5 shadow-sm card-hover cursor-pointer" onClick={() => setSelected(tenant)}>
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${avatarColor(tenant.name)} flex items-center justify-center text-white font-bold`}>
                    {getInitials(tenant.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-zinc-100 text-sm leading-tight truncate">{tenant.name}</p>
                    <p className="text-xs text-zinc-500 truncate">{tenant.adminEmail}</p>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${status.color}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />{status.label}
                </span>
              </div>

              {/* Domain */}
              <div className="flex items-center gap-1.5 mb-4 text-xs text-zinc-500 bg-zinc-900/50 rounded-lg px-3 py-2">
                <Globe size={12} className="shrink-0" />
                <span className="truncate">{tenant.domain}</span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center">
                  <p className="text-sm font-bold text-zinc-100">{tenant.staffCount}</p>
                  <p className="text-xs text-zinc-500">Staff</p>
                </div>
                <div className="text-center border-x border-zinc-700/50">
                  <p className="text-sm font-bold text-zinc-100">{tenant.vehicleCount}</p>
                  <p className="text-xs text-zinc-500">Vehicles</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-zinc-100">{formatNPR(tenant.monthlyRevenue, true)}</p>
                  <p className="text-xs text-zinc-500">/month</p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-zinc-700/50">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  tenant.plan === "Enterprise" ? "bg-amber-500/15 text-amber-400" :
                  tenant.plan === "Business" ? "bg-amber-500/15 text-amber-400" :
                  "bg-zinc-700/40 text-zinc-400"
                }`}>
                  {tenant.plan}
                </span>
                <span className="text-xs text-zinc-500">Since {formatDate(tenant.createdAt, true)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-zinc-800 rounded-2xl border border-zinc-700">
          <Building2 size={40} className="mx-auto text-slate-300 mb-3" />
          <p className="text-zinc-500 font-medium">No tenants found</p>
          <p className="text-zinc-500 text-sm mt-1">Try adjusting your filters</p>
        </div>
      )}

      {selected && <TenantModal tenant={selected} onClose={() => setSelected(null)} />}
      {showCreate && <CreateTenantModal onClose={() => setShowCreate(false)} />}
    </div>
  );
}
