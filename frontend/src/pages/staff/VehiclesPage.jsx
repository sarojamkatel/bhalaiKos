import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, Plus, Car, ChevronDown, ChevronRight, Eye, Trash2,
  CheckCircle2, AlertCircle, Filter, Download, FileText,
} from "lucide-react";
import { mockRegistrations } from "../../utils/mockData";
import { formatNPR, formatDate, statusConfig, paymentColors } from "../../utils/formatters";

export default function VehiclesPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expanded, setExpanded] = useState({});

  const toggle = (id) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const filtered = mockRegistrations.filter((reg) => {
    const matchSearch =
      reg.owner.toLowerCase().includes(search.toLowerCase()) ||
      reg.id.toLowerCase().includes(search.toLowerCase()) ||
      reg.vehicles.some((v) => v.number.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = statusFilter === "all" || reg.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalVehicles = mockRegistrations.reduce((s, r) => s + r.vehicles.length, 0);
  const totalRevenue = mockRegistrations.reduce((s, r) => s + r.totalAmount, 0);

  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-100">Vehicle Registrations</h2>
          <p className="text-sm text-zinc-500 mt-0.5">
            {mockRegistrations.length} registrations · {totalVehicles} vehicles
          </p>
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-zinc-400 bg-zinc-800 hover:bg-zinc-700/30 border border-zinc-700 rounded-xl">
            <Download size={15} /> Export
          </button>
          <button
            onClick={() => navigate("/staff/register")}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl shadow-sm shadow-amber-900/20"
          >
            <Plus size={16} /> New Registration
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Registrations", value: mockRegistrations.length, bg: "bg-amber-500/10 border-amber-500/30", text: "text-amber-400" },
          { label: "Total Vehicles", value: totalVehicles, bg: "bg-amber-50 border-amber-500/20", text: "text-amber-400" },
          { label: "Total Revenue", value: formatNPR(totalRevenue, true), bg: "bg-amber-500/10 border-amber-500/20", text: "text-amber-400" },
          { label: "Pending", value: mockRegistrations.filter(r => r.status === "pending").length, bg: "bg-rose-50 border-rose-100", text: "text-rose-700" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.bg}`}>
            <p className={`text-xl font-bold ${s.text}`}>{s.value}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-zinc-800 rounded-2xl border border-zinc-700 p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search owner, ID, or vehicle number…"
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-zinc-900/50 border border-zinc-700 rounded-xl text-zinc-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-zinc-800"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", "active", "pending", "expired"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl border capitalize transition-colors ${
                statusFilter === s ? "bg-amber-500 text-white border-amber-500/30" : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-amber-500/30"
              }`}
            >
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
      </div>

      {/* Registrations table */}
      <div className="bg-zinc-800 rounded-2xl border border-zinc-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-900/50 border-b border-zinc-700/50">
                <th className="py-3 pl-4 w-8" />
                {["Ref ID", "Owner", "Vehicles", "Amount", "Payment", "Status", "Date", "Actions"].map((h) => (
                  <th key={h} className="text-xs font-semibold text-zinc-500 uppercase tracking-wide py-3 px-3 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((reg) => {
                const status = statusConfig[reg.status];
                const pay = paymentColors[reg.paymentMethod];
                const vehicleMatch = search.trim() !== "" && reg.vehicles.some((v) => v.number.toLowerCase().includes(search.toLowerCase()));
                const isOpen = expanded[reg.id] || vehicleMatch;
                return (
                  <>
                    <tr
                      key={reg.id}
                      className="border-b border-zinc-700/50 hover:bg-zinc-700/30 transition-colors cursor-pointer"
                      onClick={() => toggle(reg.id)}
                    >
                      <td className="py-4 pl-4 w-8">
                        <div className="text-zinc-500">
                          {isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                        </div>
                      </td>
                      <td className="py-4 px-3">
                        <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-md">{reg.id}</span>
                      </td>
                      <td className="py-4 px-3">
                        <p className="text-sm font-semibold text-zinc-100">{reg.owner}</p>
                        <p className="text-xs text-zinc-500">{reg.phone}</p>
                      </td>
                      <td className="py-4 px-3">
                        <span className="text-sm font-semibold text-zinc-300">{reg.vehicles.length}</span>
                        <span className="text-xs text-zinc-500 ml-1">vehicles</span>
                      </td>
                      <td className="py-4 px-3 text-sm font-bold text-zinc-100">{formatNPR(reg.totalAmount)}</td>
                      <td className="py-4 px-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${pay?.bg} ${pay?.text} ${pay?.border}`}>
                          {reg.paymentMethod}
                        </span>
                      </td>
                      <td className="py-4 px-3">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${status?.color}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />{status?.label}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-xs text-zinc-500 whitespace-nowrap">{formatDate(reg.date, true)}</td>
                      <td className="py-4 px-3" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => navigate("/staff/receipt")}
                            title="View Receipt"
                            className="p-1.5 text-zinc-500 hover:text-amber-400 hover:bg-amber-500/10 rounded-lg transition-colors"
                          >
                            <FileText size={15} />
                          </button>
                          <button
                            title="Delete"
                            className="p-1.5 text-zinc-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded vehicles */}
                    {isOpen && reg.vehicles.map((v, vi) => (
                      <tr key={`${reg.id}-${v.id}`} className="bg-amber-500/8 border-b border-amber-500/30/50">
                        <td className="py-2.5 pl-8" />
                        <td className="py-2.5 px-3">
                          <div className="w-5 h-5 rounded-md bg-amber-500/15 flex items-center justify-center">
                            <Car size={11} className="text-amber-400" />
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-xs text-zinc-500 font-medium">#{vi + 1}</td>
                        <td className="py-2.5 px-3 text-xs font-semibold text-zinc-300">{v.type}</td>
                        <td className="py-2.5 px-3">
                          {(() => {
                            const isMatch = vehicleMatch && v.number.toLowerCase().includes(search.toLowerCase());
                            return (
                              <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md border transition-colors ${isMatch ? "text-amber-900 bg-amber-400 border-amber-300" : "text-zinc-300 bg-zinc-800 border-zinc-700"}`}>
                                {v.number}
                              </span>
                            );
                          })()}
                        </td>
                        <td className="py-2.5 px-3 text-xs text-zinc-400">
                          <span className="font-mono">{v.startDate}</span>
                          <span className="text-zinc-600 mx-1">→</span>
                          <span className="font-mono">{v.endDate}</span>
                        </td>
                        <td className="py-2.5 px-3 text-xs font-bold text-zinc-100">{formatNPR(v.rate)}</td>
                        <td colSpan={2} />
                      </tr>
                    ))}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-14">
            <Car size={36} className="mx-auto text-slate-300 mb-3" />
            <p className="text-zinc-500 font-medium">No registrations found</p>
            <button onClick={() => navigate("/staff/register")} className="mt-2 text-sm text-amber-400 font-semibold">
              Create new registration →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
