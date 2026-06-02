import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import { Car, Plus, FileText, AlertTriangle, CheckCircle2, Clock, TrendingUp, ChevronRight, Calendar } from "lucide-react";
import { getCustomerRegistrations } from "../../utils/customerAuth";
import { formatNPR, formatDate } from "../../utils/formatters";

function getDays(start, end) {
  if (!start || !end) return 0;
  return Math.max(0, Math.ceil((new Date(end) - new Date(start)) / 86400000));
}
function daysFromToday(dateStr) {
  if (!dateStr) return 0;
  return Math.ceil((new Date(dateStr) - new Date()) / 86400000);
}

function vehicleStatus(endDate) {
  const d = daysFromToday(endDate);
  if (d < 0) return { label: "Expired", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", bar: "bg-red-500", days: 0 };
  if (d <= 7) return { label: "Expiring Soon", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", bar: "bg-red-500", days: d };
  if (d <= 30) return { label: "Expiring", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", bar: "bg-amber-500", days: d };
  return { label: "Active", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", bar: "bg-emerald-500", days: d };
}

function VehicleCard({ vehicle }) {
  const status = vehicleStatus(vehicle.endDate);
  const totalDays = getDays(vehicle.startDate, vehicle.endDate);
  const pct = totalDays > 0 ? Math.max(0, Math.min(100, (status.days / totalDays) * 100)) : 0;

  return (
    <div className="bg-zinc-800 rounded-2xl border border-zinc-700 p-5 shadow-sm hover:border-zinc-600 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0">
            <Car size={18} className="text-amber-400" />
          </div>
          <div>
            <p className="font-mono font-bold text-zinc-100 text-sm">{vehicle.number}</p>
            <p className="text-xs text-zinc-500">{vehicle.type}</p>
          </div>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${status.bg} ${status.color}`}>
          {status.label}
        </span>
      </div>

      {/* Validity bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span className="flex items-center gap-1"><Calendar size={11} /> {vehicle.startDate}</span>
          <span>{vehicle.endDate}</span>
        </div>
        <div className="h-1.5 bg-zinc-700 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${status.bar}`} style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-zinc-500 text-right">
          {status.days > 0 ? `${status.days} days remaining` : "Expired"}
        </p>
      </div>

      <div className="mt-3 pt-3 border-t border-zinc-700/60 flex items-center justify-between">
        <span className="text-xs text-zinc-500">{formatNPR(vehicle.rate)}</span>
        {status.days <= 30 && (
          <span className={`text-xs font-semibold ${status.color} flex items-center gap-1`}>
            <AlertTriangle size={11} /> Renew now
          </span>
        )}
      </div>
    </div>
  );
}

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const { tenant } = useParams();
  const ctx = useOutletContext();
  const customer = ctx?.customer;

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center">
        <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
          <Car size={24} className="text-zinc-500" />
        </div>
        <div>
          <p className="font-bold text-zinc-300">Sign in to view your dashboard</p>
          <p className="text-sm text-zinc-500 mt-1">Track your vehicles and manage registrations</p>
        </div>
        <button onClick={() => navigate(`/portal/${tenant}/auth`)}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl text-sm">
          Sign In
        </button>
      </div>
    );
  }

  const registrations = getCustomerRegistrations(tenant, customer.phone);
  const allVehicles = registrations.flatMap(r =>
    r.vehicles.map(v => ({ ...v, regId: r.id, regDate: r.date }))
  );

  const active = allVehicles.filter(v => daysFromToday(v.endDate) > 0).length;
  const expiring = allVehicles.filter(v => { const d = daysFromToday(v.endDate); return d > 0 && d <= 30; }).length;
  const expired = allVehicles.filter(v => daysFromToday(v.endDate) <= 0).length;
  const totalPaid = registrations.reduce((s, r) => s + (r.totalAmount || 0), 0);

  const stats = [
    { label: "Active Vehicles", value: active, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
    { label: "Expiring Soon", value: expiring, icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
    { label: "Expired", value: expired, icon: Clock, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
    { label: "Total Paid", value: formatNPR(totalPaid, true), icon: TrendingUp, color: "text-zinc-100", bg: "bg-zinc-700/40 border-zinc-600" },
  ];

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Welcome */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full" />
          <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-white rounded-full" />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-amber-100 text-sm">Welcome back,</p>
            <h2 className="text-xl font-bold mt-0.5">{customer.name}</h2>
            {customer.company && <p className="text-amber-200 text-sm mt-0.5">{customer.company}</p>}
          </div>
          <button onClick={() => navigate(`/portal/${tenant}/register`)}
            className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900/30 hover:bg-zinc-900/50 border border-white/20 text-white text-sm font-bold rounded-xl transition-colors self-start sm:self-auto">
            <Plus size={16} /> New Registration
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className={`rounded-xl border p-4 ${s.bg}`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon size={15} className={s.color} />
                <p className="text-xs text-zinc-500 font-medium">{s.label}</p>
              </div>
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* All Vehicles */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-zinc-100">My Vehicles</h3>
          <button onClick={() => navigate(`/portal/${tenant}/register`)}
            className="flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300">
            Add vehicles <Plus size={13} />
          </button>
        </div>
        {allVehicles.length === 0 ? (
          <div className="bg-zinc-800 rounded-2xl border border-zinc-700 p-12 text-center">
            <Car size={40} className="mx-auto text-zinc-600 mb-3" />
            <p className="font-semibold text-zinc-400">No vehicles registered yet</p>
            <p className="text-sm text-zinc-500 mt-1">Register your first vehicle to start tracking</p>
            <button onClick={() => navigate(`/portal/${tenant}/register`)}
              className="mt-4 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl">
              Register Now
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allVehicles.map((v, i) => <VehicleCard key={i} vehicle={v} />)}
          </div>
        )}
      </div>

      {/* Recent Registrations */}
      {registrations.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-zinc-100">Recent Registrations</h3>
            <button onClick={() => navigate(`/portal/${tenant}/receipts`)}
              className="flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300">
              View all <ChevronRight size={13} />
            </button>
          </div>
          <div className="space-y-2">
            {registrations.slice(0, 3).map(reg => (
              <div key={reg.id} className="bg-zinc-800 rounded-xl border border-zinc-700 px-5 py-4 flex items-center gap-4">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                  <FileText size={16} className="text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-mono font-bold text-amber-400 text-sm">{reg.id}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{reg.vehicles?.length} vehicle{reg.vehicles?.length !== 1 ? "s" : ""} · {formatDate(reg.date, true)}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-zinc-100 text-sm">{formatNPR(reg.totalAmount)}</p>
                  <span className={`text-xs font-semibold ${reg.status === "active" ? "text-emerald-400" : "text-zinc-500"}`}>
                    {reg.status}
                  </span>
                </div>
                <button onClick={() => navigate(`/portal/${tenant}/receipts`)}
                  className="text-zinc-500 hover:text-amber-400 transition-colors p-1">
                  <ChevronRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
