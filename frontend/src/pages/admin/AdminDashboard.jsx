import { useNavigate } from "react-router-dom";
import {
  Users, Car, TrendingUp, ArrowUpRight, Clock, CheckCircle2,
  AlertCircle, BarChart3, PlusCircle, FileText,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { mockStaff, mockRegistrations, monthlyRevenue, paymentMethodData, adminStats } from "../../utils/mockData";
import { formatNPR, formatDate, statusConfig, avatarColor, getInitials } from "../../utils/formatters";

const StatCard = ({ label, value, sub, icon: Icon, iconBg, trend, trendVal, onClick }) => (
  <div onClick={onClick} className={`bg-zinc-800 rounded-2xl border border-zinc-700 p-5 shadow-sm ${onClick ? "cursor-pointer card-hover" : ""}`}>
    <div className="flex items-start justify-between mb-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg}`}>
        <Icon size={20} className="text-white" />
      </div>
      {trendVal !== undefined && (
        <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${trend === "up" ? "bg-amber-500/10 text-amber-400" : "bg-red-50 text-red-700"}`}>
          <ArrowUpRight size={12} />{trendVal}%
        </span>
      )}
    </div>
    <p className="text-2xl font-bold text-zinc-100">{value}</p>
    <p className="text-sm text-zinc-500 mt-0.5">{label}</p>
    {sub && <p className="text-xs text-zinc-500 mt-1">{sub}</p>}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl p-3">
      <p className="text-xs font-semibold text-zinc-300 mb-1">{label}</p>
      <p className="text-sm font-bold text-amber-400">{formatNPR(payload[0]?.value, true)}</p>
    </div>
  );
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const activeStaff = mockStaff.filter((s) => s.status === "active");
  const recentRegs = mockRegistrations.slice(0, 3);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Company banner */}
      <div className="bg-gradient-to-r from-zinc-800 to-zinc-900 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-zinc-800 rounded-full -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-zinc-800 rounded-full translate-y-1/2" />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-amber-300 text-sm font-medium">Welcome back,</p>
            <h2 className="text-2xl font-bold mt-0.5">Nawa Kantipur Insurance</h2>
            <p className="text-amber-300 text-sm mt-1">nawakantipurinsurance.bhalaikos.com</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/admin/staff")}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800/15 hover:bg-zinc-800/25 text-white text-sm font-semibold rounded-xl border border-white/20 transition-colors"
            >
              <Users size={15} /> Manage Staff
            </button>
            <button
              onClick={() => navigate("/admin/reports")}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-amber-400 text-sm font-semibold rounded-xl transition-colors"
            >
              <BarChart3 size={15} /> View Reports
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <StatCard label="Monthly Revenue" value={formatNPR(adminStats.monthlyRevenue, true)} sub="↑ 8.2% vs last month" icon={TrendingUp} iconBg="bg-gradient-to-br from-amber-500 to-amber-700" trend="up" trendVal={8.2} />
        <StatCard label="Active Staff" value={`${adminStats.activeStaff}/${adminStats.totalStaff}`} sub="1 inactive" icon={Users} iconBg="bg-gradient-to-br from-amber-500 to-orange-600" onClick={() => navigate("/admin/staff")} />
        <StatCard label="Vehicles Managed" value={adminStats.totalVehicles.toLocaleString()} sub="This month" icon={Car} iconBg="bg-gradient-to-br from-amber-500 to-orange-600" trend="up" trendVal={5} />
        <StatCard label="Pending Items" value={adminStats.pendingPayments} sub="Awaiting action" icon={Clock} iconBg="bg-gradient-to-br from-rose-500 to-rose-700" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-zinc-800 rounded-2xl border border-zinc-700 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-zinc-100">Revenue Trend</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Monthly revenue (NPR)</p>
            </div>
            <button onClick={() => navigate("/admin/reports")} className="text-xs text-amber-400 hover:text-amber-400 font-semibold flex items-center gap-1">
              Full report <ArrowUpRight size={13} />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyRevenue.slice(-6)} margin={{ top: 5, right: 5, bottom: 0, left: 5 }}>
              <defs>
                <linearGradient id="adminRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v/1000}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2.5} fill="url(#adminRevGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Payment methods */}
        <div className="bg-zinc-800 rounded-2xl border border-zinc-700 p-5 shadow-sm">
          <h3 className="font-bold text-zinc-100 mb-1">Payment Methods</h3>
          <p className="text-xs text-zinc-500 mb-4">Transaction split</p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={paymentMethodData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                {paymentMethodData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {paymentMethodData.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: d.color }} />
                  <span className="text-zinc-400 font-medium">{d.name}</span>
                </div>
                <span className="font-bold text-zinc-100">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent registrations */}
        <div className="bg-zinc-800 rounded-2xl border border-zinc-700 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-700/50">
            <h3 className="font-bold text-zinc-100">Recent Registrations</h3>
            <button className="text-xs text-amber-400 hover:text-amber-400 font-semibold flex items-center gap-1">
              View all <ArrowUpRight size={13} />
            </button>
          </div>
          <div className="divide-y divide-zinc-700/30">
            {recentRegs.map((reg) => {
              const status = statusConfig[reg.status];
              return (
                <div key={reg.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-zinc-700/30 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
                    <Car size={15} className="text-amber-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-zinc-100 truncate">{reg.owner}</p>
                    <p className="text-xs text-zinc-500">{reg.id} · {reg.vehicles.length} vehicles</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-zinc-100">{formatNPR(reg.totalAmount, true)}</p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${status?.color}`}>{status?.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Staff overview */}
        <div className="bg-zinc-800 rounded-2xl border border-zinc-700 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-700/50">
            <h3 className="font-bold text-zinc-100">Staff Overview</h3>
            <button onClick={() => navigate("/admin/staff")} className="text-xs text-amber-400 hover:text-amber-400 font-semibold flex items-center gap-1">
              Manage <ArrowUpRight size={13} />
            </button>
          </div>
          <div className="divide-y divide-zinc-700/30">
            {mockStaff.slice(0, 4).map((staff) => (
              <div key={staff.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-zinc-700/30 transition-colors">
                <div className={`w-8 h-8 rounded-full ${avatarColor(staff.name)} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                  {getInitials(staff.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-zinc-100 truncate">{staff.name}</p>
                  <p className="text-xs text-zinc-500 truncate">{staff.role}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-semibold text-zinc-300">{staff.vehiclesManaged} vehicles</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${statusConfig[staff.status]?.color}`}>{staff.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
