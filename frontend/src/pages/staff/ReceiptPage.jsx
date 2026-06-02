import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, Printer, Download, Share2, CheckCircle2, Car, Shield,
  Phone, MapPin, Calendar, CreditCard, Hash,
} from "lucide-react";
import { mockRegistrations } from "../../utils/mockData";
import { formatNPR, formatDate, formatDateTime } from "../../utils/formatters";
import { getCompanySettings, getTenantSlug } from "../../utils/companySettings";

function ReceiptDocument({ reg, settings }) {
  const totalVehicles = reg.vehicles.length;
  return (
    <div className="bg-zinc-800 rounded-2xl border border-zinc-700 shadow-sm overflow-hidden print-area">
      {/* Receipt header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-8 py-6 text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            {settings.logo ? (
              <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0 overflow-hidden">
                <img src={settings.logo} alt="logo" className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
                <span className="text-white font-black text-sm tracking-tight">{settings.initials}</span>
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Shield size={18} className="text-amber-300" />
                <p className="text-amber-300 text-xs font-semibold tracking-widest uppercase">BhalaiKos</p>
              </div>
              <h2 className="text-xl font-bold">{settings.shortName}</h2>
              <p className="text-amber-300 text-sm mt-0.5">{settings.address}</p>
              <p className="text-amber-300 text-xs mt-0.5">{settings.phone}{settings.email ? ` | ${settings.email}` : ""}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-zinc-800/20 border border-white/30 rounded-xl px-4 py-3">
              <p className="text-xs text-amber-300 font-semibold uppercase tracking-wider">Receipt No.</p>
              <p className="text-lg font-bold font-mono mt-0.5">{reg.id}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Receipt body */}
      <div className="px-8 py-6 space-y-6">
        {/* Status banner */}
        <div className={`flex items-center gap-3 rounded-xl px-4 py-3 border ${
          reg.status === "active" ? "bg-amber-500/10 border-amber-500/30" : "bg-amber-50 border-amber-500/30"
        }`}>
          <CheckCircle2 size={20} className={reg.status === "active" ? "text-amber-400" : "text-amber-400"} />
          <div>
            <p className={`text-sm font-bold ${reg.status === "active" ? "text-amber-400" : "text-amber-400"}`}>
              {reg.status === "active" ? "Payment Confirmed & Active" : "Payment Pending"}
            </p>
            {reg.transactionId && (
              <p className="text-xs text-zinc-500 mt-0.5 font-mono">Txn: {reg.transactionId}</p>
            )}
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-zinc-500">{formatDateTime(reg.date)}</p>
          </div>
        </div>

        {/* Customer + Payment info */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Customer Details</p>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded bg-amber-500/10 flex items-center justify-center mt-0.5 shrink-0">
                  <span className="text-amber-400 font-bold text-xs">N</span>
                </div>
                <p className="text-sm font-semibold text-zinc-100">{reg.owner}</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Phone size={13} className="text-zinc-500 shrink-0" /> {reg.phone}
              </div>
              <div className="flex items-start gap-2 text-sm text-zinc-400">
                <MapPin size={13} className="text-zinc-500 shrink-0 mt-0.5" /> {reg.address}
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Payment Details</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Method</span>
                <span className={`font-semibold px-2.5 py-0.5 rounded-full text-xs ${
                  reg.paymentMethod === "eSewa" ? "bg-amber-500/15 text-amber-400" :
                  reg.paymentMethod === "Khalti" ? "bg-amber-500/15 text-amber-400" :
                  "bg-blue-100 text-blue-700"
                }`}>{reg.paymentMethod}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Date</span>
                <span className="font-semibold text-zinc-100">{formatDate(reg.date)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Processed by</span>
                <span className="font-semibold text-zinc-100">{reg.processedBy}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicles table */}
        <div>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Vehicle Details ({totalVehicles})</p>
          <div className="overflow-hidden rounded-xl border border-zinc-700">
            <table className="w-full text-sm">
              <thead className="bg-zinc-900/50 border-b border-zinc-700">
                <tr>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wide">#</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Type</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Vehicle No.</th>
                  <th className="text-left py-2.5 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Valid Period</th>
                  <th className="text-right py-2.5 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wide">Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-700/50">
                {reg.vehicles.map((v, i) => (
                  <tr key={v.id} className="hover:bg-zinc-700/30 transition-colors">
                    <td className="py-3 px-4 text-zinc-500 text-xs">{i + 1}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-amber-500/10 flex items-center justify-center">
                          <Car size={12} className="text-amber-400" />
                        </div>
                        <span className="font-semibold text-zinc-100">{v.type}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-zinc-300">{v.number}</td>
                    <td className="py-3 px-4 text-xs text-zinc-400">
                      <span className="font-mono">{v.startDate}</span>
                      <span className="text-zinc-600 mx-1">→</span>
                      <span className="font-mono">{v.endDate}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-zinc-100">{formatNPR(v.rate)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-amber-500/10 border-t-2 border-amber-500/30">
                <tr>
                  <td colSpan={4} className="py-4 px-4 font-bold text-zinc-300">
                    TOTAL AMOUNT PAID
                    <span className="ml-2 text-xs font-normal text-zinc-500">({totalVehicles} vehicles × 1 month)</span>
                  </td>
                  <td className="py-4 px-4 text-right text-xl font-bold text-amber-400">{formatNPR(reg.totalAmount)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Keep safely */}
        <div className="flex items-start gap-2 bg-zinc-800/60 rounded-xl px-4 py-3 border border-zinc-700">
          <span className="text-base shrink-0">📌</span>
          <p className="text-xs text-zinc-300 font-semibold leading-relaxed">
            {settings.receiptMessage}
          </p>
        </div>

        {/* Accident instructions */}
        <div className="rounded-xl border border-zinc-700 overflow-hidden">
          <div className="bg-zinc-800/60 px-4 py-2.5 border-b border-zinc-700">
            <p className="text-xs font-bold text-zinc-300 uppercase tracking-wider">⚠ In Case of Accident — Follow These Steps</p>
          </div>
          <div className="px-4 py-3 space-y-2.5">
            {settings.accidentInstructions.map((text, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-400 shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-xs text-zinc-400 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* QR + Footer */}
        <div className="flex items-start justify-between pt-4 border-t border-dashed border-zinc-700">
          <div className="space-y-1">
            <p className="text-xs text-zinc-500">This receipt is computer-generated and valid for tax purposes.</p>
            <p className="text-xs text-zinc-500">For queries: {settings.phone}{settings.email ? ` | ${settings.email}` : ""}</p>
            <p className="text-xs font-bold text-amber-400 mt-2">Powered by BhalaiKos · bhalaikos.com</p>
          </div>
          {/* Fake QR */}
          <div className="w-20 h-20 bg-zinc-700/40 rounded-xl border border-zinc-700 flex flex-col items-center justify-center gap-1">
            <div className="w-14 h-14">
              <svg viewBox="0 0 42 42" className="w-full h-full">
                {[[0,0],[0,1],[0,2],[1,0],[2,0],[2,1],[2,2],[0,4],[0,5],[0,6],[1,6],[2,4],[2,5],[2,6],
                  [4,0],[4,1],[4,2],[5,2],[6,0],[6,1],[6,2],[3,3],[4,4],[5,5],[6,6],[3,5],[4,6],[5,3]].map(([r,c],i) => (
                  <rect key={i} x={c*6} y={r*6} width={6} height={6} fill="#0f172a" />
                ))}
              </svg>
            </div>
            <p className="text-xs text-zinc-500 text-center leading-none">Scan to verify</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReceiptPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(mockRegistrations[0]);
  const settings = getCompanySettings(getTenantSlug(localStorage.getItem("bk_role")));

  const filtered = mockRegistrations.filter(
    (r) => r.owner.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* Header */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-100">Receipts</h2>
          <p className="text-sm text-zinc-500 mt-0.5">View and print vehicle registration receipts</p>
        </div>
        {selected && (
          <div className="flex gap-2 self-start sm:self-auto no-print">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-zinc-300 bg-zinc-800 hover:bg-zinc-700/30 border border-zinc-700 rounded-xl transition-colors"
            >
              <Printer size={15} /> Print
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-sm shadow-amber-900/20">
              <Download size={15} /> Download PDF
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Registration selector */}
        <div className="space-y-3 no-print">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search registrations…"
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div className="space-y-2">
            {filtered.map((reg) => (
              <button
                key={reg.id}
                onClick={() => setSelected(reg)}
                className={`w-full text-left bg-zinc-800 rounded-xl border-2 p-4 transition-all ${
                  selected?.id === reg.id ? "border-amber-500 shadow-sm shadow-none" : "border-zinc-700 hover:border-slate-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-bold text-zinc-100">{reg.owner}</p>
                    <p className="text-xs font-mono text-amber-400 mt-0.5">{reg.id}</p>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    reg.status === "active" ? "bg-amber-500/15 text-amber-400" :
                    reg.status === "pending" ? "bg-amber-100 text-amber-400" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {reg.status}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-zinc-500">
                  <span>{reg.vehicles.length} vehicles</span>
                  <span className="font-bold text-zinc-300">{formatNPR(reg.totalAmount)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Receipt preview */}
        <div className="lg:col-span-2">
          {selected ? (
            <ReceiptDocument reg={selected} settings={settings} />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-zinc-800 rounded-2xl border border-zinc-700 text-center">
              <Hash size={36} className="text-slate-300 mb-3" />
              <p className="text-zinc-500 font-medium">Select a registration</p>
              <p className="text-zinc-500 text-sm mt-1">Choose from the left to view receipt</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
