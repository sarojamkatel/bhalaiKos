import { useNavigate } from "react-router-dom";
import {
  PlusCircle, Car, TrendingUp, Clock, ArrowUpRight, CheckCircle2,
  AlertCircle, FileText, CreditCard,
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { mockRegistrations, staffStats, monthlyRevenue } from "../../utils/mockData";
import { formatNPR, formatDate, statusConfig, paymentColors } from "../../utils/formatters";

const weekData = [
  { day: "Sun", rev: 12000 }, { day: "Mon", rev: 18500 }, { day: "Tue", rev: 9000 },
  { day: "Wed", rev: 23500 }, { day: "Thu", rev: 15000 }, { day: "Fri", rev: 21000 }, { day: "Sat", rev: 8000 },
];

export default function StaffDashboard() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Quick actions banner */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-zinc-800 rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-zinc-800 rounded-full" />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-amber-300 text-sm">Good morning,</p>
            <h2 className="text-xl font-bold mt-0.5">Anita Maharjan 👋</h2>
            <p className="text-amber-300 text-sm mt-1">You have <strong className="text-white">{staffStats.pendingRenewals} renewals</strong> coming up this week</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/staff/register")}
              className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 text-amber-400 text-sm font-bold rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <PlusCircle size={16} /> New Registration
            </button>
            <button
              onClick={() => navigate("/staff/vehicles")}
              className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800/20 hover:bg-zinc-800/30 text-white text-sm font-semibold rounded-xl border border-white/30 transition-colors"
            >
              <Car size={16} /> View Vehicles
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {[
          { label: "Today's Revenue", value: formatNPR(staffStats.todayRevenue, true), sub: "4 registrations", icon: TrendingUp, iconBg: "from-amber-500 to-amber-700" },
          { label: "This Week", value: formatNPR(staffStats.weekRevenue, true), sub: `${staffStats.weekRegistrations} registrations`, icon: BarChart, iconBg: "from-amber-500 to-orange-600" },
          { label: "My Vehicles", value: staffStats.totalVehicles, sub: "Total managed", icon: Car, iconBg: "from-amber-500 to-orange-600" },
          { label: "Renewals Due", value: staffStats.pendingRenewals, sub: "This week", icon: AlertCircle, iconBg: "from-rose-500 to-rose-700" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-zinc-800 rounded-2xl border border-zinc-700 p-5 shadow-sm card-hover">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.iconBg} flex items-center justify-center mb-4`}>
                <Icon size={20} className="text-white" />
              </div>
              <p className="text-2xl font-bold text-zinc-100">{s.value}</p>
              <p className="text-sm text-zinc-500 mt-0.5">{s.label}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{s.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly chart */}
        <div className="lg:col-span-2 bg-zinc-800 rounded-2xl border border-zinc-700 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-zinc-100">This Week's Revenue</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Daily revenue (NPR)</p>
            </div>
            <span className="text-xs bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full font-semibold border border-amber-500/20">
              ↑ Today up 23%
            </span>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={weekData} margin={{ top: 5, right: 5, bottom: 0, left: 5 }}>
              <defs>
                <linearGradient id="staffGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v/1000}K`} />
              <Tooltip formatter={(v) => [formatNPR(v), "Revenue"]} />
              <Area type="monotone" dataKey="rev" stroke="#f59e0b" strokeWidth={2.5} fill="url(#staffGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Quick actions */}
        <div className="bg-zinc-800 rounded-2xl border border-zinc-700 p-5 shadow-sm">
          <h3 className="font-bold text-zinc-100 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { label: "New Registration", icon: PlusCircle, color: "bg-amber-500/10 text-amber-400 hover:bg-amber-500/15", path: "/staff/register" },
              { label: "View All Vehicles", icon: Car, color: "bg-amber-50 text-amber-400 hover:bg-amber-500/15", path: "/staff/vehicles" },
              { label: "Process Payment", icon: CreditCard, color: "bg-amber-500/10 text-amber-400 hover:bg-amber-500/15", path: "/staff/payment" },
              { label: "Generate Receipt", icon: FileText, color: "bg-amber-500/10 text-amber-400 hover:bg-amber-500/15", path: "/staff/receipt" },
            ].map((a) => (
              <button
                key={a.label}
                onClick={() => navigate(a.path)}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl text-sm font-semibold transition-colors ${a.color}`}
              >
                <a.icon size={18} />
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent registrations */}
      <div className="bg-zinc-800 rounded-2xl border border-zinc-700 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-700/50">
          <h3 className="font-bold text-zinc-100">Recent Registrations</h3>
          <button
            onClick={() => navigate("/staff/vehicles")}
            className="text-xs text-amber-400 hover:text-amber-400 font-semibold flex items-center gap-1"
          >
            View all <ArrowUpRight size={13} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-900/50 border-b border-zinc-700/50">
                {["Ref ID", "Owner", "Vehicles", "Amount", "Payment", "Status", "Date"].map((h) => (
                  <th key={h} className={`text-xs font-semibold text-zinc-500 uppercase tracking-wide py-3 ${h === "Ref ID" ? "pl-5 pr-3" : h === "Date" ? "pl-3 pr-5" : "px-3"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockRegistrations.map((reg) => {
                const status = statusConfig[reg.status];
                const pay = paymentColors[reg.paymentMethod];
                return (
                  <tr key={reg.id} className="border-b border-slate-50 hover:bg-zinc-700/30 transition-colors">
                    <td className="py-3.5 pl-5 pr-3">
                      <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">{reg.id}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <p className="text-sm font-semibold text-zinc-100">{reg.owner}</p>
                      <p className="text-xs text-zinc-500">{reg.phone}</p>
                    </td>
                    <td className="py-3.5 px-3 text-sm text-zinc-300">{reg.vehicles.length} vehicles</td>
                    <td className="py-3.5 px-3 text-sm font-bold text-zinc-100">{formatNPR(reg.totalAmount)}</td>
                    <td className="py-3.5 px-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${pay?.bg} ${pay?.text} ${pay?.border}`}>
                        {reg.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${status?.color}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />{status?.label}
                      </span>
                    </td>
                    <td className="py-3.5 pl-3 pr-5 text-xs text-zinc-500">{formatDate(reg.date, true)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Temp icon fill
function BarChart({ size, className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  );
}
