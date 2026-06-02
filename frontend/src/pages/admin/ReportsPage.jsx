import {
  TrendingUp, Car, Users, CreditCard, ArrowUpRight, Download,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { monthlyRevenue, paymentMethodData, vehicleTypeData, adminStats } from "../../utils/mockData";
import { formatNPR } from "../../utils/formatters";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl p-3">
      <p className="text-xs font-semibold text-zinc-300 mb-1">{label}</p>
      <p className="text-sm font-bold text-amber-400">{formatNPR(payload[0]?.value, true)}</p>
    </div>
  );
};

export default function ReportsPage() {
  const totalRevenue = monthlyRevenue.reduce((s, m) => s + m.revenue, 0);
  const totalRegs = monthlyRevenue.reduce((s, m) => s + m.registrations, 0);
  const avgMonthly = Math.round(totalRevenue / monthlyRevenue.length);

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-100">Reports & Analytics</h2>
          <p className="text-sm text-zinc-500 mt-0.5">FY 2081-82 — Nawa Kantipur Insurance</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl shadow-sm shadow-amber-900/20">
          <Download size={15} /> Export Report
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 stagger-children">
        {[
          { label: "Annual Revenue", value: formatNPR(totalRevenue, true), sub: "FY 2081-82", color: "from-amber-500 to-orange-600" },
          { label: "Avg Monthly Rev.", value: formatNPR(avgMonthly, true), sub: "12-month avg", color: "from-amber-500 to-amber-700" },
          { label: "Total Registrations", value: totalRegs, sub: "This year", color: "from-amber-500 to-orange-600" },
          { label: "Total Vehicles", value: adminStats.totalVehicles.toLocaleString(), sub: "Active", color: "from-orange-500 to-orange-600" },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-zinc-800 rounded-2xl border border-zinc-700 p-5 shadow-sm">
            <div className={`w-8 h-1 rounded-full bg-gradient-to-r ${kpi.color} mb-3`} />
            <p className="text-2xl font-bold text-zinc-100">{kpi.value}</p>
            <p className="text-sm text-zinc-500 mt-0.5">{kpi.label}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue trend */}
        <div className="lg:col-span-2 bg-zinc-800 rounded-2xl border border-zinc-700 p-5 shadow-sm">
          <h3 className="font-bold text-zinc-100 mb-1">Annual Revenue Trend</h3>
          <p className="text-xs text-zinc-500 mb-5">Monthly revenue in NPR</p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={monthlyRevenue} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <defs>
                <linearGradient id="repRevGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} tickFormatter={(v) => `${v/1000}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2.5} fill="url(#repRevGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Payment split */}
        <div className="bg-zinc-800 rounded-2xl border border-zinc-700 p-5 shadow-sm">
          <h3 className="font-bold text-zinc-100 mb-1">Payment Channels</h3>
          <p className="text-xs text-zinc-500 mb-4">Transaction distribution</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={paymentMethodData} cx="50%" cy="50%" outerRadius={70} paddingAngle={4} dataKey="value">
                {paymentMethodData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {paymentMethodData.map((d) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-zinc-400">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                  {d.name}
                </div>
                <span className="text-xs font-bold text-zinc-100">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Registrations chart */}
        <div className="bg-zinc-800 rounded-2xl border border-zinc-700 p-5 shadow-sm">
          <h3 className="font-bold text-zinc-100 mb-1">Monthly Registrations</h3>
          <p className="text-xs text-zinc-500 mb-5">Number of vehicle registrations</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyRevenue} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="registrations" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Vehicle types */}
        <div className="bg-zinc-800 rounded-2xl border border-zinc-700 p-5 shadow-sm">
          <h3 className="font-bold text-zinc-100 mb-1">Vehicle Types</h3>
          <p className="text-xs text-zinc-500 mb-5">Registered vehicle breakdown</p>
          <div className="space-y-3">
            {vehicleTypeData.map((v) => {
              const max = Math.max(...vehicleTypeData.map(x => x.count));
              const pct = Math.round((v.count / max) * 100);
              return (
                <div key={v.type}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-zinc-300">{v.type}</span>
                    <span className="text-xs font-bold text-zinc-100">{v.count}</span>
                  </div>
                  <div className="h-2 bg-zinc-700/40 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
