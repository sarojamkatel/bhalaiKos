import { useState, useRef } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import {
  Plus, CheckCircle2, ChevronRight, Check,
  Car, CreditCard, FileText, Shield, X, Printer, LogIn,
} from "lucide-react";
import { VEHICLE_TYPES } from "../../utils/mockData";
import { formatNPR, genId, genReceiptId } from "../../utils/formatters";
import { saveCustomerRegistration } from "../../utils/customerAuth";
import DateRangePicker from "../../components/ui/DateRangePicker";
import { getCompanySettings } from "../../utils/companySettings";

const VEHICLE_RATES = { Bus: 3500, Car: 1500, Jeep: 1500, Hiace: 2500, Coaster: 3000, Microbus: 2000, Truck: 3500, Van: 1500, Motorcycle: 500 };
const PAY_OPTS = [
  { id: "eSewa", label: "eSewa", color: "bg-amber-500", icon: "E" },
  { id: "Khalti", label: "Khalti", color: "bg-teal-500", icon: "K" },
  { id: "Mobile Banking", label: "Mobile Banking", color: "bg-blue-500", icon: "B" },
];
const STEPS = [
  { id: 1, label: "Vehicles", icon: Car },
  { id: 2, label: "Review", icon: FileText },
  { id: 3, label: "Payment", icon: CreditCard },
  { id: 4, label: "Done", icon: CheckCircle2 },
];

function todayStr() { return new Date().toISOString().split("T")[0]; }
function monthsLater(n, from) {
  const d = new Date(from || todayStr());
  d.setMonth(d.getMonth() + n);
  return d.toISOString().split("T")[0];
}
function getDays(start, end) {
  if (!start || !end) return 0;
  return Math.max(0, Math.ceil((new Date(end) - new Date(start)) / 86400000));
}
function calcRate(base, start, end) {
  const d = getDays(start, end);
  return d > 0 ? Math.ceil((base / 30) * d) : base;
}
function makeVehicle(type = "Car") {
  const start = todayStr();
  const end = monthsLater(1, start);
  const base = VEHICLE_RATES[type] || 1500;
  return { id: genId(), type, number: "", baseRate: base, startDate: start, endDate: end, rate: base, declarationSigned: false };
}

function StepBar({ current }) {
  return (
    <div className="flex items-center mb-8">
      {STEPS.map((s, i) => {
        const Icon = s.icon;
        const done = s.id < current;
        const active = s.id === current;
        return (
          <div key={s.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${done ? "bg-amber-500" : active ? "bg-amber-500 shadow-md" : "bg-zinc-700/50"}`}>
                {done ? <Check size={16} className="text-white" /> : <Icon size={15} className={active ? "text-white" : "text-zinc-500"} />}
              </div>
              <span className={`text-xs font-semibold hidden sm:block ${active || done ? "text-amber-400" : "text-zinc-500"}`}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && <div className={`step-line mx-2 mb-5 ${done ? "done" : ""}`} />}
          </div>
        );
      })}
    </div>
  );
}

export default function CustomerRegisterPage() {
  const navigate = useNavigate();
  const { tenant } = useParams();
  const ctx = useOutletContext();
  const tenantData = ctx?.tenantData;
  const customer = ctx?.customer;
  const settings = getCompanySettings(tenant);

  const [step, setStep] = useState(1);
  const [vehicles, setVehicles] = useState([makeVehicle("Car")]);
  const [payMethod, setPayMethod] = useState("eSewa");
  const [txnId, setTxnId] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [receiptId] = useState(() => genReceiptId());
  const receiptRef = useRef(null);

  const handlePrint = () => {
    const el = receiptRef.current;
    if (!el) return;
    const styles = Array.from(document.querySelectorAll("style")).map(s => s.outerHTML).join("");
    const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(l => `<link rel="stylesheet" href="${l.href}">`).join("");
    const win = window.open("", "_blank");
    win.document.write(
      `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Receipt</title>${links}${styles}` +
      `<style>body{background:#18181b;margin:0;padding:24px}` +
      `@page{size:A4 portrait;margin:1.2cm 1cm}` +
      `*{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}</style></head>` +
      `<body>${el.outerHTML}</body>` +
      `<script>window.onload=function(){window.print();setTimeout(function(){window.close()},500)}<\/script></html>`
    );
    win.document.close();
  };

  const owner = {
    name: customer?.name || "",
    phone: customer?.phone || "",
    email: customer?.email || "",
    company: customer?.company || "",
  };

  const total = vehicles.reduce((s, v) => s + (v.rate || 0), 0);

  const addVehicle = () => setVehicles(vs => [...vs, makeVehicle("Car")]);
  const removeVehicle = id => { if (vehicles.length > 1) setVehicles(vs => vs.filter(v => v.id !== id)); };
  const updateVehicle = (id, field, value) => setVehicles(vs => vs.map(v => {
    if (v.id !== id) return v;
    const u = { ...v, [field]: value };
    if (field === "type") { u.baseRate = VEHICLE_RATES[value] || 1500; u.rate = calcRate(u.baseRate, u.startDate, u.endDate); }
    if (field === "startDate" || field === "endDate") u.rate = calcRate(u.baseRate, u.startDate, u.endDate);
    return u;
  }));

  const handleDateChange = (id, { startDate, endDate }) => {
    setVehicles(vs => vs.map(v => {
      if (v.id !== id) return v;
      const s = startDate ?? v.startDate;
      const e = endDate ?? v.endDate;
      return { ...v, startDate: s, endDate: e, rate: calcRate(v.baseRate, s, e) };
    }));
  };

  const handlePay = async () => {
    if (!txnId) return;
    await new Promise(r => setTimeout(r, 1200));
    const reg = {
      id: receiptId,
      date: todayStr(),
      status: "active",
      totalAmount: total,
      payMethod,
      txnId,
      owner,
      vehicles: vehicles.map(v => ({ id: v.id, type: v.type, number: v.number, rate: v.rate, startDate: v.startDate, endDate: v.endDate })),
    };
    if (customer?.phone) saveCustomerRegistration(tenant, customer.phone, reg);
    setConfirmed(true);
    setTimeout(() => setStep(4), 400);
  };

  const canGoStep2 = vehicles.every(v => v.number && getDays(v.startDate, v.endDate) > 0 && v.declarationSigned);

  if (!customer) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-zinc-800 rounded-3xl border border-zinc-700 shadow-sm p-10 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto">
            <LogIn size={24} className="text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-100">Sign in to register vehicles</h3>
            <p className="text-sm text-zinc-500 mt-1.5">Create an account or sign in — your info will be pre-filled automatically.</p>
          </div>
          <button onClick={() => navigate(`/portal/${tenant}/auth`)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-sm">
            Sign In / Create Account <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-zinc-800 rounded-3xl border border-zinc-700 shadow-sm p-6 sm:p-8">
        {/* Branding */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-sm">
            <Shield size={18} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-zinc-100">{tenantData?.name || "Vehicle Registration"}</p>
            <p className="text-xs text-zinc-500">Self-service portal</p>
          </div>
        </div>

        <StepBar current={step} />

        {/* Step 1: Vehicles */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-zinc-100">Add Your Vehicles</h3>
                <p className="text-sm text-zinc-500 mt-0.5">Add all vehicles you want to register</p>
              </div>
              <button onClick={addVehicle}
                className="flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-2 rounded-xl hover:bg-amber-500/15">
                <Plus size={14} /> Add Vehicle
              </button>
            </div>

            {vehicles.map((v, i) => (
              <div key={v.id} className="bg-zinc-900/50 rounded-2xl border border-zinc-700 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center">
                      <Car size={14} className="text-amber-400" />
                    </div>
                    <span className="text-sm font-bold text-zinc-300">Vehicle #{i + 1}</span>
                  </div>
                  <button onClick={() => removeVehicle(v.id)} disabled={vehicles.length === 1}
                    className="text-zinc-500 hover:text-red-400 disabled:opacity-30 p-1"><X size={16} /></button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Vehicle Type</label>
                    <select value={v.type} onChange={e => updateVehicle(v.id, "type", e.target.value)}
                      className="w-full px-3 py-2.5 text-sm bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500">
                      {VEHICLE_TYPES.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-1.5">Number Plate</label>
                    <input value={v.number} onChange={e => updateVehicle(v.id, "number", e.target.value.toUpperCase())}
                      placeholder="BA 2 KHA 1234"
                      className="w-full px-3 py-2.5 text-sm bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500" />
                  </div>
                </div>

                <DateRangePicker
                  startDate={v.startDate}
                  endDate={v.endDate}
                  onChange={({ startDate, endDate }) => handleDateChange(v.id, { startDate, endDate })}
                />

                {v.startDate && v.endDate && getDays(v.startDate, v.endDate) > 0 && (
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span>{getDays(v.startDate, v.endDate)} days coverage</span>
                    <span className="font-bold text-amber-400 text-sm">{formatNPR(v.rate)}</span>
                  </div>
                )}

                {/* Declaration */}
                <div className="pt-3 border-t border-zinc-700/60">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative mt-0.5 shrink-0">
                      <input type="checkbox" checked={v.declarationSigned}
                        onChange={e => updateVehicle(v.id, "declarationSigned", e.target.checked)}
                        className="sr-only" />
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${v.declarationSigned ? "bg-amber-500 border-amber-500" : "border-zinc-600 group-hover:border-zinc-400"}`}>
                        {v.declarationSigned && <Check size={10} className="text-white" strokeWidth={3} />}
                      </div>
                    </div>
                    <span className={`text-xs leading-relaxed transition-colors ${v.declarationSigned ? "text-zinc-300" : "text-zinc-500 group-hover:text-zinc-400"}`}>
                      I declare this vehicle has a valid{" "}
                      <span className="text-zinc-200 font-medium">Bluebook</span> and{" "}
                      <span className="text-zinc-200 font-medium">Insurance</span>, and I agree to present the original documents to{" "}
                      <span className="text-zinc-200 font-medium">{settings?.shortName || tenantData?.name}</span> upon request.
                    </span>
                  </label>
                </div>
              </div>
            ))}

            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl px-5 py-3.5 flex justify-between">
              <span className="text-sm font-semibold text-zinc-300">Total ({vehicles.length} vehicle{vehicles.length !== 1 ? "s" : ""})</span>
              <span className="font-bold text-amber-400">{formatNPR(total)}</span>
            </div>

            <button onClick={() => setStep(2)} disabled={!canGoStep2}
              className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl">
              Review Order <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Step 2: Review */}
        {step === 2 && (
          <div className="space-y-5 animate-fade-in">
            <h3 className="text-lg font-bold text-zinc-100">Review & Confirm</h3>

            {/* Owner summary */}
            <div className="bg-zinc-900/50 rounded-xl border border-zinc-700 p-4 grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-xs text-zinc-500">Name</p><p className="font-semibold text-zinc-100">{owner.name}</p></div>
              <div><p className="text-xs text-zinc-500">Phone</p><p className="font-semibold text-zinc-100">{owner.phone}</p></div>
              {owner.email && <div><p className="text-xs text-zinc-500">Email</p><p className="font-semibold text-zinc-100">{owner.email}</p></div>}
              {owner.company && <div><p className="text-xs text-zinc-500">Company</p><p className="font-semibold text-zinc-100">{owner.company}</p></div>}
            </div>

            <div className="overflow-hidden rounded-xl border border-zinc-700">
              <table className="w-full text-sm">
                <thead className="bg-zinc-900/50 border-b border-zinc-700">
                  <tr>
                    {["Type", "Number", "Valid Period", "Amount"].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-zinc-500 py-2.5 px-4 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-700/50">
                  {vehicles.map((v, i) => (
                    <tr key={i} className="hover:bg-zinc-700/20">
                      <td className="py-3 px-4 font-semibold text-zinc-100">{v.type}</td>
                      <td className="py-3 px-4 font-mono text-zinc-300">{v.number}</td>
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
                    <td colSpan={3} className="py-3 px-4 font-bold text-zinc-300">TOTAL</td>
                    <td className="py-3 px-4 font-bold text-amber-400 text-base">{formatNPR(total)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="px-5 py-3 text-sm font-semibold text-zinc-400 bg-zinc-700/40 hover:bg-zinc-700/60 rounded-xl">← Back</button>
              <button onClick={() => setStep(3)}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl">
                Pay {formatNPR(total)} <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h3 className="text-lg font-bold text-zinc-100">Complete Payment</h3>
              <p className="text-sm text-zinc-500 mt-0.5">Total: <strong className="text-amber-400">{formatNPR(total)}</strong></p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {PAY_OPTS.map(p => (
                <button key={p.id} onClick={() => setPayMethod(p.id)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${payMethod === p.id ? "border-amber-500 bg-amber-500/10" : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"}`}>
                  <div className={`w-10 h-10 rounded-xl ${p.color} flex items-center justify-center text-white font-bold text-lg`}>{p.icon}</div>
                  <span className={`text-xs font-bold ${payMethod === p.id ? "text-amber-400" : "text-zinc-400"}`}>{p.label}</span>
                </button>
              ))}
            </div>

            <div className="bg-zinc-900/50 rounded-2xl border border-zinc-700 p-5">
              {payMethod === "Mobile Banking" ? (
                <div className="space-y-2 text-sm">
                  {[["Bank", "Nepal Investment Mega Bank"], ["Account", settings?.shortName || tenantData?.name], ["Acc. No.", "00101234567890"], ["Amount", formatNPR(total)], ["Ref.", owner.phone || "Your phone"]].map(([l, v]) => (
                    <div key={l} className="flex justify-between border-b border-zinc-700 pb-2 last:border-0 last:pb-0">
                      <span className="text-zinc-500">{l}</span>
                      <span className="font-bold text-zinc-100">{v}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 py-2 text-center">
                  <p className="text-sm font-bold text-zinc-300">Scan to Pay via {payMethod}</p>
                  <div className="w-36 h-36 bg-zinc-800 border-4 border-zinc-700 rounded-2xl p-3 flex items-center justify-center">
                    <svg viewBox="0 0 60 60" className="w-full h-full">
                      {[[0,0],[0,1],[0,2],[1,0],[2,0],[2,1],[2,2],[0,4],[0,5],[0,6],[1,6],[2,4],[2,5],[2,6],[4,0],[4,1],[4,2],[5,2],[6,0],[6,1],[6,2]].map(([r,c],i) => (
                        <rect key={i} x={c*9} y={r*9} width={9} height={9} fill="#0f172a" />
                      ))}
                      {Array.from({length:20},(_,i)=><rect key={`d${i}`} x={(i%7)*9} y={(Math.floor(i/7)+3)*9} width={9} height={9} fill={i%3!==0?"#0f172a":"white"}/>)}
                    </svg>
                  </div>
                  <p className="text-xs text-zinc-500">Amount: <strong className="text-zinc-100">{formatNPR(total)}</strong></p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wide">Transaction / Voucher ID *</label>
              <input value={txnId} onChange={e => setTxnId(e.target.value)} placeholder="Enter after completing payment"
                className="w-full px-4 py-3 text-sm bg-zinc-900/50 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="px-5 py-3 text-sm font-semibold text-zinc-400 bg-zinc-700/40 hover:bg-zinc-700/60 rounded-xl">← Back</button>
              <button onClick={handlePay} disabled={!txnId || confirmed}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl">
                <CheckCircle2 size={18} /> Confirm Payment
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Done */}
        {step === 4 && (
          <div className="animate-scale-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-emerald-500/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} className="text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold text-zinc-100">You're all set!</h3>
              <p className="text-zinc-500 text-sm mt-1">Your vehicles are registered successfully.</p>
            </div>

            {/* Mini receipt */}
            <div ref={receiptRef} className="bg-zinc-900/60 border border-zinc-700 rounded-2xl overflow-hidden text-sm">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-4 flex items-start justify-between">
                <div>
                  <p className="text-white font-black text-base">{settings?.shortName || tenantData?.name}</p>
                  <p className="text-amber-100 text-xs mt-0.5">{settings?.address || tenantData?.address}</p>
                </div>
                <div className="text-right">
                  <p className="text-amber-100 text-xs font-semibold uppercase tracking-wider">Receipt No.</p>
                  <p className="text-white font-bold font-mono">{receiptId}</p>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
                  <div><p className="text-zinc-500">Name</p><p className="font-bold text-zinc-100 mt-0.5">{owner.name}</p></div>
                  <div><p className="text-zinc-500">Phone</p><p className="font-bold text-zinc-100 mt-0.5">{owner.phone}</p></div>
                  {owner.company && <div className="col-span-2"><p className="text-zinc-500">Company</p><p className="font-bold text-zinc-100 mt-0.5">{owner.company}</p></div>}
                  <div><p className="text-zinc-500">Payment</p><p className="font-bold text-zinc-100 mt-0.5">{payMethod}</p></div>
                  <div><p className="text-zinc-500">Txn ID</p><p className="font-mono font-bold text-zinc-100 mt-0.5 truncate">{txnId}</p></div>
                </div>

                <div className="rounded-xl overflow-hidden border border-zinc-700">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-zinc-700/40">
                        <th className="text-left py-2 px-3 font-semibold text-zinc-400">#</th>
                        <th className="text-left py-2 px-3 font-semibold text-zinc-400">Type</th>
                        <th className="text-left py-2 px-3 font-semibold text-zinc-400">Number</th>
                        <th className="text-left py-2 px-3 font-semibold text-zinc-400">Valid Period</th>
                        <th className="text-right py-2 px-3 font-semibold text-zinc-400">Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-700/40">
                      {vehicles.map((v, i) => (
                        <tr key={i}>
                          <td className="py-2 px-3 text-zinc-500">{i + 1}</td>
                          <td className="py-2 px-3 text-zinc-200">{v.type}</td>
                          <td className="py-2 px-3 font-mono text-zinc-200">{v.number}</td>
                          <td className="py-2 px-3 text-zinc-400">
                            <span className="font-mono">{v.startDate}</span>
                            <span className="text-zinc-600 mx-1">→</span>
                            <span className="font-mono">{v.endDate}</span>
                          </td>
                          <td className="py-2 px-3 text-right font-bold text-zinc-100">{formatNPR(v.rate)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-amber-500/10 border-t border-amber-500/20">
                        <td colSpan={4} className="py-2.5 px-3 font-bold text-zinc-300">TOTAL PAID</td>
                        <td className="py-2.5 px-3 text-right font-black text-amber-400 text-sm">{formatNPR(total)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {settings?.receiptMessage && (
                  <div className="flex items-start gap-2 bg-zinc-800/60 rounded-xl px-3 py-2.5 border border-zinc-700">
                    <span className="shrink-0">📌</span>
                    <p className="text-xs text-zinc-300 leading-relaxed">{settings.receiptMessage}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={handlePrint}
                className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-xl hover:bg-amber-500/15">
                <Printer size={15} /> Print Receipt
              </button>
              <button onClick={() => navigate(`/portal/${tenant}/dashboard`)}
                className="flex-1 py-3 text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl">
                Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
