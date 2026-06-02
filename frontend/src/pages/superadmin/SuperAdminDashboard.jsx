import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2, Users, TrendingUp, Car, ArrowUpRight, ArrowDownRight,
  Plus, Eye, MoreHorizontal, CheckCircle, XCircle, AlertCircle,
  DollarSign, Activity,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar,
} from "recharts";
import { mockTenants, monthlyRevenue, superAdminStats, recentActivity } from "../../utils/mockData";
import { formatNPR, formatDate, statusConfig, avatarColor, getInitials } from "../../utils/formatters";

const StatCard = ({ label, value, sub, icon: Icon, iconBg, trend, trendVal }) => (
  <div className="bg-zinc-800 rounded-2xl border border-zinc-700 p-5 shadow-sm card-hover">
    <div className="flex items-start justify-between mb-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
        <Icon size={20} className="text-white" />
      </div>
      {trendVal !== undefined && (
        <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${trend === "up" ? "bg-amber-500/10 text-amber-400" : "bg-red-50 text-red-700"}`}>
          {trend === "up" ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trendVal}%
        </span>
      )}
    </div>
    <p className="text-2xl font-bold text-zinc-100">{value}</p>
    <p className="text-sm text-zinc-500 mt-0.5">{label}</p>
    {sub && <p className="text-xs text-zinc-500 mt-1">{sub}</p>}
  </div>
);

const TenantRow = ({ tenant, onView }) => {
  const status = statusConfig[tenant.status] || statusConfig.inactive;
  return (
    <tr className="border-b border-zinc-700/50 hover:bg-zinc-700/30 transition-colors group">
      <td className="py-3.5 pl-4 pr-2">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-xl ${avatarColor(tenant.name)} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
            {getInitials(tenant.name)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-zinc-100 truncate">{tenant.name}</p>
            <p className="text-xs text-zinc-500 truncate">{tenant.domain}</p>
          </div>
        </div>
      </td>
      <td className="py-3.5 px-2">
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${status.color}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {status.label}
        </span>
      </td>
      <td className="py-3.5 px-2">
        <span className="text-sm font-medium text-zinc-300">{tenant.staffCount}</span>
        <span className="text-xs text-zinc-500 ml-1">staff</span>
      </td>
      <td className="py-3.5 px-2">
        <span className="text-sm font-medium text-zinc-300">{tenant.vehicleCount.toLocaleString()}</span>
      </td>
      <td className="py-3.5 px-2">
        <span className="text-sm font-semibold text-zinc-100">{formatNPR(tenant.monthlyRevenue, true)}</span>
        <span className="text-xs text-zinc-500 block">/month</span>
      </td>
      <td className="py-3.5 px-2">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
          tenant.plan === "Enterprise" ? "bg-amber-500/15 text-amber-400" :
          tenant.plan === "Business" ? "bg-amber-500/15 text-amber-400" :
          "bg-zinc-700/40 text-zinc-400"
        }`}>
          {tenant.plan}
        </span>
      </td>
      <td className="py-3.5 pl-2 pr-4">
        <button
          onClick={() => onView(tenant)}
          className="opacity-0 group-hover:opacity-100 text-xs text-amber-400 hover:text-amber-400 font-semibold flex items-center gap-1 transition-all"
        >
          <Eye size={13} /> View
        </button>
      </td>
    </tr>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl p-3">
      <p className="text-xs font-semibold text-zinc-300 mb-1">{label}</p>
      <p className="text-sm font-bold text-amber-400">{formatNPR(payload[0]?.value, true)}</p>
      {payload[1] && <p className="text-xs text-zinc-500">{payload[1]?.value} registrations</p>}
    </div>
  );
};

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const totalRevenue = mockTenants.reduce((sum, t) => sum + t.totalRevenue, 0);
  const totalVehicles = mockTenants.reduce((sum, t) => sum + t.vehicleCount, 0);
  const totalStaff = mockTenants.reduce((sum, t) => sum + t.staffCount, 0);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-100">System Overview</h2>
          <p className="text-sm text-zinc-500 mt-0.5">All tenants, revenue, and activity at a glance</p>
        </div>
        <button
          onClick={() => navigate("/superadmin/tenants")}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl shadow-sm shadow-amber-900/20 transition-colors"
        >
          <Plus size={16} /> New Tenant
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <StatCard label="Total Tenants" value={mockTenants.length} sub={`${mockTenants.filter(t=>t.status==="active").length} active`} icon={Building2} iconBg="bg-gradient-to-br from-amber-500 to-orange-600" trend="up" trendVal={20} />
        <StatCard label="Total Revenue" value={formatNPR(totalRevenue, true)} sub="All time" icon={TrendingUp} iconBg="bg-gradient-to-br from-amber-500 to-amber-700" trend="up" trendVal={12} />
        <StatCard label="Vehicles Managed" value={totalVehicles.toLocaleString()} sub="Across all tenants" icon={Car} iconBg="bg-gradient-to-br from-amber-500 to-orange-600" trend="up" trendVal={8} />
        <StatCard label="Total Staff" value={totalStaff} sub="All companies" icon={Users} iconBg="bg-gradient-to-br from-orange-500 to-orange-600" trend="up" trendVal={15} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-zinc-800 rounded-2xl border border-zinc-700 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-zinc-100">Platform Revenue</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Monthly system-wide revenue (NPR)</p>
            </div>
            <span className="text-xs bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full font-semibold border border-amber-500/20">
              ↑ 12.4% YoY
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyRevenue} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v/1000}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2.5} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Tenant breakdown */}
        <div className="bg-zinc-800 rounded-2xl border border-zinc-700 p-5 shadow-sm">
          <h3 className="font-bold text-zinc-100 mb-1">Tenant Revenue</h3>
          <p className="text-xs text-zinc-500 mb-5">Monthly breakdown</p>
          <div className="space-y-4">
            {mockTenants.filter(t => t.status === "active").sort((a,b) => b.monthlyRevenue - a.monthlyRevenue).slice(0,4).map((tenant) => {
              const max = Math.max(...mockTenants.map(t => t.monthlyRevenue));
              const pct = Math.round((tenant.monthlyRevenue / max) * 100);
              return (
                <div key={tenant.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-zinc-300 truncate pr-2">{tenant.name.split(" ")[0]}</span>
                    <span className="text-xs font-bold text-zinc-100 shrink-0">{formatNPR(tenant.monthlyRevenue, true)}</span>
                  </div>
                  <div className="h-2 bg-zinc-700/40 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tenants table */}
      <div className="bg-zinc-800 rounded-2xl border border-zinc-700 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-700/50">
          <h3 className="font-bold text-zinc-100">All Tenants</h3>
          <button
            onClick={() => navigate("/superadmin/tenants")}
            className="text-xs text-amber-400 hover:text-amber-400 font-semibold flex items-center gap-1"
          >
            Manage all <ArrowUpRight size={13} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-900/50 border-b border-zinc-700/50">
                {["Company", "Status", "Staff", "Vehicles", "Monthly Rev.", "Plan", ""].map((h) => (
                  <th key={h} className={`text-xs font-semibold text-zinc-500 uppercase tracking-wide py-3 ${h === "Company" ? "pl-4 pr-2" : h === "" ? "pl-2 pr-4" : "px-2"}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockTenants.map((t) => (
                <TenantRow key={t.id} tenant={t} onView={() => navigate("/superadmin/tenants")} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-zinc-800 rounded-2xl border border-zinc-700 p-5 shadow-sm">
        <h3 className="font-bold text-zinc-100 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivity.map((act) => (
            <div key={act.id} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                <Activity size={14} className="text-amber-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-zinc-300">{act.message}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{act.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
