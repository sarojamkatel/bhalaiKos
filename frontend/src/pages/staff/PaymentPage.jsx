import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, CheckCircle2, CreditCard, Clock, ArrowRight,
  AlertCircle, Receipt,
} from "lucide-react";
import { mockRegistrations } from "../../utils/mockData";
import { formatNPR, formatDate, statusConfig, paymentColors } from "../../utils/formatters";

export default function PaymentPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [txnId, setTxnId] = useState("");
  const [method, setMethod] = useState("eSewa");
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const pending = mockRegistrations.filter((r) => r.status === "pending");
  const filtered = pending.filter(
    (r) => r.owner.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleConfirm = async () => {
    if (!txnId) return;
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1400));
    setProcessing(false);
    setDone(true);
  };

  return (
    <div className="space-y-5 animate-fade-in-up max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-zinc-100">Pending Payments</h2>
        <p className="text-sm text-zinc-500 mt-0.5">{pending.length} registration{pending.length !== 1 ? "s" : ""} awaiting payment</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: pending list */}
        <div className="space-y-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by owner or ID…"
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-12 bg-zinc-800 rounded-2xl border border-zinc-700">
              <CheckCircle2 size={36} className="mx-auto text-amber-400 mb-3" />
              <p className="text-zinc-300 font-semibold">All caught up!</p>
              <p className="text-zinc-500 text-sm mt-1">No pending payments</p>
            </div>
          ) : (
            filtered.map((reg) => (
              <div
                key={reg.id}
                onClick={() => { setSelected(reg); setDone(false); setTxnId(""); }}
                className={`bg-zinc-800 rounded-2xl border-2 p-4 cursor-pointer card-hover transition-all ${
                  selected?.id === reg.id ? "border-amber-500 shadow-md shadow-none" : "border-zinc-700"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-zinc-100 text-sm">{reg.owner}</p>
                    <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded">{reg.id}</span>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-semibold text-amber-400 bg-amber-50 border border-amber-500/30 px-2.5 py-1 rounded-full">
                    <Clock size={11} /> Pending
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-500">{reg.vehicles.length} vehicles</span>
                  <span className="font-bold text-zinc-100">{formatNPR(reg.totalAmount)}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right: payment form */}
        <div className="bg-zinc-800 rounded-2xl border border-zinc-700 shadow-sm p-5">
          {!selected ? (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <CreditCard size={36} className="text-slate-300 mb-3" />
              <p className="text-zinc-500 font-medium">Select a registration</p>
              <p className="text-zinc-500 text-sm mt-1">Choose a pending payment from the left to process</p>
            </div>
          ) : done ? (
            <div className="flex flex-col items-center justify-center text-center py-8 animate-scale-in">
              <div className="w-16 h-16 bg-amber-500/15 rounded-2xl flex items-center justify-center mb-4">
                <CheckCircle2 size={32} className="text-amber-400" />
              </div>
              <h3 className="font-bold text-zinc-100 text-lg">Payment Confirmed!</h3>
              <p className="text-zinc-500 text-sm mt-1">{formatNPR(selected.totalAmount)} received from {selected.owner}</p>
              <p className="text-xs text-zinc-500 mt-2">Txn ID: {txnId}</p>
              <div className="flex gap-3 mt-6 w-full">
                <button
                  onClick={() => navigate("/staff/receipt")}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-amber-400 bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/30 rounded-xl"
                >
                  <Receipt size={15} /> View Receipt
                </button>
                <button
                  onClick={() => { setSelected(null); setDone(false); setTxnId(""); }}
                  className="flex-1 py-2.5 text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 rounded-xl"
                >
                  Next Payment
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5 animate-fade-in">
              <div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Processing Payment</p>
                <h3 className="font-bold text-zinc-100 mt-1">{selected.owner}</h3>
                <div className="flex items-center justify-between mt-2 bg-amber-500/10 border border-amber-500/30 rounded-xl px-4 py-3">
                  <span className="text-sm text-zinc-400">{selected.vehicles.length} vehicles</span>
                  <span className="text-lg font-bold text-amber-400">{formatNPR(selected.totalAmount)}</span>
                </div>
              </div>

              {/* Method */}
              <div>
                <p className="text-xs font-semibold text-zinc-400 mb-2">Payment Method</p>
                <div className="flex gap-2">
                  {[
                    { id: "eSewa", color: "bg-amber-500", label: "eSewa" },
                    { id: "Khalti", color: "bg-teal-500", label: "Khalti" },
                    { id: "Mobile Banking", color: "bg-blue-500", label: "Mobile Banking" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setMethod(p.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                        method === p.id
                          ? "border-amber-500 bg-amber-500/10 text-amber-400"
                          : "border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-slate-300"
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full ${p.color}`} />
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Txn ID */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Transaction ID / Voucher Number</label>
                <input
                  value={txnId}
                  onChange={(e) => setTxnId(e.target.value)}
                  placeholder="Enter after customer pays"
                  className="w-full px-3.5 py-2.5 text-sm bg-zinc-800 border border-slate-300 rounded-xl text-zinc-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                onClick={handleConfirm}
                disabled={!txnId || processing}
                className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-200 disabled:text-zinc-500 text-white text-sm font-bold rounded-xl transition-colors"
              >
                {processing ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Confirming…
                  </span>
                ) : (
                  <><CheckCircle2 size={16} /> Confirm Payment</>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
