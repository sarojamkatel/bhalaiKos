import { useState } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import {
  FileText, Printer, Car, Shield, CheckCircle2,
  Phone, MapPin, Calendar, Search, ChevronRight,
} from "lucide-react";
import { getCustomerRegistrations } from "../../utils/customerAuth";
import { formatNPR, formatDate, formatDateTime } from "../../utils/formatters";
import { getCompanySettings } from "../../utils/companySettings";

function ReceiptDoc({ reg, settings }) {
  return (
    <div className="print-area bg-zinc-800 rounded-2xl border border-zinc-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-7 py-5 text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            {settings?.logo ? (
              <div className="w-11 h-11 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0 overflow-hidden">
                <img src={settings.logo} alt="" className="w-full h-full object-contain" />
              </div>
            ) : (
              <div className="w-11 h-11 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0">
                <span className="text-white font-black text-xs">{settings?.initials}</span>
              </div>
            )}
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <Shield size={13} className="text-amber-200" />
                <p className="text-amber-200 text-xs font-semibold tracking-widest uppercase">BhalaiKos</p>
              </div>
              <p className="font-bold text-base">{settings?.shortName}</p>
              <p className="text-amber-200 text-xs mt-0.5">{settings?.address}</p>
              <p className="text-amber-200 text-xs">{settings?.phone}{settings?.email ? ` · ${settings.email}` : ""}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-black/20 border border-white/20 rounded-xl px-4 py-2.5">
              <p className="text-amber-200 text-xs font-semibold uppercase tracking-wider">Receipt No.</p>
              <p className="font-bold font-mono text-lg mt-0.5">{reg.id}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-7 py-6 space-y-6">
        {/* Status */}
        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-emerald-400">Payment Confirmed & Active</p>
            {reg.txnId && <p className="text-xs text-zinc-500 mt-0.5 font-mono">Txn: {reg.txnId}</p>}
          </div>
          <p className="text-xs text-zinc-500">{formatDateTime(reg.date)}</p>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-5">
          <div>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Customer Details</p>
            <div className="space-y-2">
              <p className="text-sm font-semibold text-zinc-100">{reg.owner?.name}</p>
              {reg.owner?.company && <p className="text-xs text-zinc-400">{reg.owner.company}</p>}
              <p className="flex items-center gap-1.5 text-sm text-zinc-400"><Phone size={12} className="text-zinc-500" /> {reg.owner?.phone}</p>
              {reg.owner?.address && <p className="flex items-start gap-1.5 text-sm text-zinc-400"><MapPin size={12} className="text-zinc-500 mt-0.5 shrink-0" /> {reg.owner.address}</p>}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Payment Details</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-zinc-500">Method</span><span className="font-semibold text-zinc-100">{reg.payMethod}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Date</span><span className="font-semibold text-zinc-100">{formatDate(reg.date)}</span></div>
            </div>
          </div>
        </div>

        {/* Vehicles table */}
        <div>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Vehicle Details ({reg.vehicles?.length})</p>
          <div className="rounded-xl overflow-hidden border border-zinc-700">
            <table className="w-full text-sm">
              <thead className="bg-zinc-900/50 border-b border-zinc-700">
                <tr>
                  {["#", "Type", "Vehicle No.", "Valid Period", "Rate"].map(h => (
                    <th key={h} className="text-left py-2.5 px-4 text-xs font-semibold text-zinc-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-700/50">
                {reg.vehicles?.map((v, i) => (
                  <tr key={v.id || i} className="hover:bg-zinc-700/20">
                    <td className="py-3 px-4 text-zinc-500 text-xs">{i + 1}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-amber-500/10 flex items-center justify-center">
                          <Car size={11} className="text-amber-400" />
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
                    <td className="py-3 px-4 font-bold text-zinc-100">{formatNPR(v.rate)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-amber-500/10 border-t-2 border-amber-500/30">
                <tr>
                  <td colSpan={4} className="py-4 px-4 font-bold text-zinc-300">TOTAL AMOUNT PAID</td>
                  <td className="py-4 px-4 text-right text-xl font-bold text-amber-400">{formatNPR(reg.totalAmount)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Footer */}
        {settings?.receiptMessage && (
          <div className="flex items-start gap-2 bg-zinc-800/60 rounded-xl px-4 py-3 border border-zinc-700">
            <span className="text-base shrink-0">📌</span>
            <p className="text-xs text-zinc-300 font-semibold leading-relaxed">{settings.receiptMessage}</p>
          </div>
        )}
        <div className="pt-4 border-t border-dashed border-zinc-700 text-xs text-zinc-500 space-y-1">
          <p>This receipt is computer-generated and valid for tax purposes.</p>
          <p className="font-bold text-amber-400">Powered by BhalaiKos · bhalaikos.com</p>
        </div>
      </div>
    </div>
  );
}

export default function CustomerReceiptsPage() {
  const navigate = useNavigate();
  const { tenant } = useParams();
  const ctx = useOutletContext();
  const customer = ctx?.customer;
  const settings = getCompanySettings(tenant);

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center">
        <FileText size={36} className="text-zinc-600" />
        <div>
          <p className="font-bold text-zinc-300">Sign in to view your receipts</p>
          <p className="text-sm text-zinc-500 mt-1">Access all your registration receipts anytime</p>
        </div>
        <button onClick={() => navigate(`/portal/${tenant}/auth`)}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl text-sm">
          Sign In
        </button>
      </div>
    );
  }

  const registrations = getCustomerRegistrations(tenant, customer.phone);
  const filtered = registrations.filter(r =>
    r.id?.toLowerCase().includes(search.toLowerCase()) ||
    r.vehicles?.some(v => v.number?.toLowerCase().includes(search.toLowerCase()))
  );
  const active = selected || filtered[0] || null;

  return (
    <div className="space-y-5 animate-fade-in-up">
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-100">My Receipts</h2>
          <p className="text-sm text-zinc-500 mt-0.5">{registrations.length} registration{registrations.length !== 1 ? "s" : ""}</p>
        </div>
        {active && (
          <button onClick={() => window.print()}
            className="no-print flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl self-start sm:self-auto">
            <Printer size={15} /> Print / Download
          </button>
        )}
      </div>

      {registrations.length === 0 ? (
        <div className="bg-zinc-800 rounded-2xl border border-zinc-700 p-14 text-center">
          <FileText size={40} className="mx-auto text-zinc-600 mb-3" />
          <p className="font-semibold text-zinc-400">No receipts yet</p>
          <p className="text-sm text-zinc-500 mt-1">Complete a registration to see your receipt here</p>
          <button onClick={() => navigate(`/portal/${tenant}/register`)}
            className="mt-4 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl">
            Register Vehicles
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Sidebar list */}
          <div className="space-y-3 no-print">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by ID or plate…"
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <div className="space-y-2">
              {filtered.map(reg => (
                <button key={reg.id} onClick={() => setSelected(reg)}
                  className={`w-full text-left bg-zinc-800 rounded-xl border-2 p-4 transition-all ${
                    (selected?.id || filtered[0]?.id) === reg.id ? "border-amber-500" : "border-zinc-700 hover:border-zinc-600"
                  }`}>
                  <div className="flex items-center justify-between">
                    <p className="font-mono font-bold text-amber-400 text-sm">{reg.id}</p>
                    <span className="text-xs font-bold text-emerald-400">Active</span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1.5 flex items-center gap-1">
                    <Calendar size={11} /> {formatDate(reg.date, true)} · {reg.vehicles?.length} vehicles
                  </p>
                  <p className="text-sm font-bold text-zinc-300 mt-1">{formatNPR(reg.totalAmount)}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Receipt */}
          <div className="lg:col-span-2">
            {active ? (
              <ReceiptDoc reg={active} settings={settings} />
            ) : (
              <div className="flex flex-col items-center justify-center h-64 bg-zinc-800 rounded-2xl border border-zinc-700">
                <FileText size={32} className="text-zinc-600 mb-3" />
                <p className="text-zinc-500 font-medium">Select a registration</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
