import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus, Trash2, CheckCircle2, Car, FileText, CreditCard,
  Check, ChevronRight, AlertCircle, User, Phone, MapPin,
} from "lucide-react";
import { VEHICLE_TYPES } from "../../utils/mockData";
import { formatNPR, genId, genReceiptId } from "../../utils/formatters";
import { getCompanySettings, getTenantSlug } from "../../utils/companySettings";
import DateRangePicker from "../../components/ui/DateRangePicker";

const STEPS = [
  { id: 1, label: "Owner Info", icon: User },
  { id: 2, label: "Add Vehicles", icon: Car },
  { id: 3, label: "Review", icon: FileText },
  { id: 4, label: "Payment", icon: CreditCard },
  { id: 5, label: "Receipt", icon: CheckCircle2 },
];

const VEHICLE_RATES = { Bus: 3000, Car: 1500, Jeep: 1500, Hiace: 1500, Coaster: 2000, Microbus: 2000, Truck: 3500, Van: 1500, Motorcycle: 500 };

function todayStr() { return new Date().toISOString().split("T")[0]; }
function monthsLaterStr(months, from) {
  const d = new Date(from || todayStr());
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split("T")[0];
}
function getDays(start, end) {
  const d = Math.ceil((new Date(end) - new Date(start)) / 86400000);
  return Math.max(0, d);
}
function calcRate(baseMonthlyRate, start, end) {
  const days = getDays(start, end);
  return days > 0 ? Math.ceil((baseMonthlyRate / 30) * days) : 0;
}
function makeVehicle(type = "Bus") {
  const start = todayStr();
  const end = monthsLaterStr(1, start);
  const base = VEHICLE_RATES[type] || 1500;
  return { id: genId(), type, number: "", baseMonthlyRate: base, startDate: start, endDate: end, rate: base, declarationSigned: false };
}

const PAYMENT_OPTS = [
  { id: "eSewa", label: "eSewa", color: "bg-amber-500", desc: "Digital wallet payment", icon: "E" },
  { id: "Khalti", label: "Khalti", color: "bg-teal-500", desc: "Mobile payment", icon: "K" },
  { id: "Mobile Banking", label: "Mobile Banking", color: "bg-blue-500", desc: "Direct bank transfer", icon: "B" },
];
const STAFF_PAYMENT_OPTS = [
  ...PAYMENT_OPTS,
  { id: "Offline", label: "Offline / Cash", color: "bg-zinc-600", desc: "Collect in person", icon: "₨" },
];

function StepIndicator({ current }) {
  return (
    <div className="flex items-center justify-between mb-8">
      {STEPS.map((step, i) => {
        const Icon = step.icon;
        const done = step.id < current;
        const active = step.id === current;
        return (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                done ? "bg-amber-500 shadow-sm shadow-amber-900/20" :
                active ? "bg-amber-500 shadow-md shadow-none" :
                "bg-zinc-700/40"
              }`}>
                {done ? <Check size={16} className="text-white" /> : <Icon size={16} className={active ? "text-white" : "text-zinc-500"} />}
              </div>
              <span className={`text-xs font-semibold hidden sm:block ${active ? "text-amber-400" : done ? "text-amber-400" : "text-zinc-500"}`}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`step-line mx-2 mb-5 ${done ? "done" : ""}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function NewRegistrationPage() {
  const navigate = useNavigate();
  const role = localStorage.getItem("bk_role");
  const [settings] = useState(() => getCompanySettings(getTenantSlug(role)));
  const isStaff = role === "staff" || role === "admin";
  const [step, setStep] = useState(1);
  const [owner, setOwner] = useState({ name: "", phone: "", address: "", email: "" });
  const [vehicles, setVehicles] = useState(() => [makeVehicle("Bus")]);
  const [paymentMethod, setPaymentMethod] = useState("eSewa");
  const [transactionId, setTransactionId] = useState("");
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const total = vehicles.reduce((sum, v) => sum + (v.rate || 0), 0);
  const [receiptId] = useState(() => genReceiptId());

  const addVehicle = () => setVehicles([...vehicles, makeVehicle("Car")]);

  const removeVehicle = (id) => {
    if (vehicles.length > 1) setVehicles(vehicles.filter((v) => v.id !== id));
  };

  const updateVehicle = (id, field, value) => {
    setVehicles(vehicles.map((v) => {
      if (v.id !== id) return v;
      const updated = { ...v, [field]: value };
      if (field === "type") updated.baseMonthlyRate = VEHICLE_RATES[value] || 1500;
      updated.rate = calcRate(updated.baseMonthlyRate, updated.startDate, updated.endDate);
      return updated;
    }));
  };

  const setPresetPeriod = (id, months) => {
    setVehicles(vehicles.map((v) => {
      if (v.id !== id) return v;
      const end = monthsLaterStr(months, v.startDate);
      return { ...v, endDate: end, rate: calcRate(v.baseMonthlyRate, v.startDate, end) };
    }));
  };

  const updateVehicleDates = (id, startDate, endDate) => {
    setVehicles(vehicles.map((v) => {
      if (v.id !== id) return v;
      return { ...v, startDate, endDate, rate: endDate ? calcRate(v.baseMonthlyRate, startDate, endDate) : 0 };
    }));
  };

  const handleConfirmPayment = async () => {
    await new Promise((r) => setTimeout(r, 1200));
    setPaymentConfirmed(true);
    setTimeout(() => setStep(5), 500);
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-in-up">
      <div className="bg-zinc-800 rounded-2xl border border-zinc-700 shadow-sm p-6 print:border-0 print:shadow-none print:p-0 print:bg-transparent">
        <div className="no-print"><StepIndicator current={step} /></div>

        {/* Step 1: Owner Info */}
        {step === 1 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h3 className="text-lg font-bold text-zinc-100">Owner Information</h3>
              <p className="text-sm text-zinc-500 mt-0.5">
                Enter the vehicle owner's details
                <span className="ml-2 text-zinc-600">·</span>
                <span className="ml-2 text-xs text-zinc-500"><span className="text-amber-400 font-bold">*</span> Required fields</span>
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Full Name", key: "name", placeholder: "Owner's full name", required: true },
                { label: "Phone Number", key: "phone", placeholder: "+977-9XXXXXXXXX", required: true },
                { label: "Email Address", key: "email", placeholder: "owner@email.com", type: "email", required: false },
                { label: "Address", key: "address", placeholder: "City/District", required: false },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5">
                    {f.label}
                    {f.required && <span className="text-amber-400 ml-0.5">*</span>}
                  </label>
                  <input
                    type={f.type || "text"}
                    value={owner[f.key]}
                    onChange={(e) => setOwner({ ...owner, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    className="w-full px-3.5 py-2.5 text-sm bg-zinc-900/60 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => { if (owner.name && owner.phone) setStep(2); }}
                disabled={!owner.name || !owner.phone}
                className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all"
              >
                Continue <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Add Vehicles */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-zinc-100">Vehicle Details</h3>
                <p className="text-sm text-zinc-500 mt-0.5">Add all vehicles for <strong className="text-zinc-300">{owner.name}</strong></p>
              </div>
              <button
                onClick={addVehicle}
                className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 hover:bg-amber-500/15 text-amber-400 text-sm font-semibold rounded-xl border border-amber-500/30 transition-colors"
              >
                <Plus size={15} /> Add Vehicle
              </button>
            </div>

            <div className="space-y-3">
              {vehicles.map((v, i) => (
                <div key={v.id} className="bg-zinc-900/50 rounded-xl border border-zinc-700 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-zinc-500 bg-zinc-700/60 px-2.5 py-0.5 rounded-full">
                      Vehicle #{i + 1}
                    </span>
                    <button
                      onClick={() => removeVehicle(v.id)}
                      disabled={vehicles.length === 1}
                      className="text-zinc-600 hover:text-red-400 disabled:opacity-20 p-1 rounded-lg hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1">
                        Type <span className="text-amber-400">*</span>
                      </label>
                      <select
                        value={v.type}
                        onChange={(e) => updateVehicle(v.id, "type", e.target.value)}
                        className="w-full px-3 py-2.5 text-sm bg-zinc-900/60 border border-zinc-700 rounded-lg text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                      >
                        {VEHICLE_TYPES.map((t) => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-zinc-400 mb-1">
                        Vehicle Number <span className="text-amber-400">*</span>
                      </label>
                      <input
                        value={v.number}
                        onChange={(e) => updateVehicle(v.id, "number", e.target.value.toUpperCase())}
                        placeholder="BA 2 KHA 1234"
                        className="w-full px-3 py-2.5 text-sm bg-zinc-900/60 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono transition-all"
                      />
                    </div>
                  </div>

                  {/* Coverage period */}
                  <div className="mt-3 pt-3 border-t border-zinc-700/60">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-zinc-400">
                        Coverage Period <span className="text-amber-400">*</span>
                      </span>
                      <div className="flex gap-1">
                        {[{ l: "1M", m: 1 }, { l: "3M", m: 3 }, { l: "6M", m: 6 }, { l: "1Y", m: 12 }].map((p) => (
                          <button
                            key={p.l}
                            type="button"
                            onClick={() => setPresetPeriod(v.id, p.m)}
                            className="text-xs px-2 py-0.5 rounded-md bg-zinc-700/60 text-zinc-400 hover:bg-amber-500/15 hover:text-amber-400 transition-colors font-semibold"
                          >
                            {p.l}
                          </button>
                        ))}
                      </div>
                    </div>
                    <DateRangePicker
                      startDate={v.startDate}
                      endDate={v.endDate}
                      onChange={({ startDate, endDate }) => updateVehicleDates(v.id, startDate, endDate)}
                    />
                    {getDays(v.startDate, v.endDate) > 0 && (
                      <div className="mt-2 flex items-center justify-between bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
                        <span className="text-xs text-zinc-500">
                          {getDays(v.startDate, v.endDate)} days · NPR {Math.round(v.baseMonthlyRate / 30)}/day
                        </span>
                        <span className="text-sm font-bold text-amber-400">{formatNPR(v.rate)}</span>
                      </div>
                    )}
                  </div>

                  {/* Declaration */}
                  <div className="mt-3 pt-3 border-t border-zinc-700/60">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative mt-0.5 shrink-0">
                        <input
                          type="checkbox"
                          checked={v.declarationSigned}
                          onChange={(e) => updateVehicle(v.id, "declarationSigned", e.target.checked)}
                          className="sr-only"
                        />
                        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                          v.declarationSigned
                            ? "bg-amber-500 border-amber-500"
                            : "border-zinc-600 group-hover:border-zinc-400"
                        }`}>
                          {v.declarationSigned && <Check size={10} className="text-white" strokeWidth={3} />}
                        </div>
                      </div>
                      <span className={`text-xs leading-relaxed transition-colors ${v.declarationSigned ? "text-zinc-300" : "text-zinc-500 group-hover:text-zinc-400"}`}>
                        I hereby declare that this vehicle has a valid and renewed{" "}
                        <span className="text-zinc-200 font-medium">Bluebook</span> and{" "}
                        <span className="text-zinc-200 font-medium">Insurance</span>, and I agree to provide the original documents to{" "}
                        <span className="text-zinc-200 font-medium">{settings.shortName}</span> upon request.
                      </span>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/30 rounded-xl px-5 py-3.5">
              <span className="text-sm font-semibold text-zinc-300">Total ({vehicles.length} vehicle{vehicles.length !== 1 ? "s" : ""})</span>
              <span className="text-lg font-bold text-amber-400">{formatNPR(total)}</span>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button onClick={() => setStep(1)} className="text-sm text-zinc-500 hover:text-zinc-300 font-medium px-4 py-2.5">
                ← Back
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={vehicles.some((v) => !v.number || getDays(v.startDate, v.endDate) <= 0 || !v.declarationSigned)}
                className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-all"
              >
                Review Summary <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h3 className="text-lg font-bold text-zinc-100">Review Summary</h3>
              <p className="text-sm text-zinc-500 mt-0.5">Confirm all details before payment</p>
            </div>

            {/* Owner */}
            <div className="bg-zinc-900/50 rounded-xl border border-zinc-700 p-4">
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3">Owner Details</p>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                <div><span className="text-xs text-zinc-500">Name</span><p className="text-sm font-semibold text-zinc-100">{owner.name}</p></div>
                <div><span className="text-xs text-zinc-500">Phone</span><p className="text-sm font-semibold text-zinc-100">{owner.phone}</p></div>
                {owner.email && <div><span className="text-xs text-zinc-500">Email</span><p className="text-sm font-semibold text-zinc-100">{owner.email}</p></div>}
                {owner.address && <div><span className="text-xs text-zinc-500">Address</span><p className="text-sm font-semibold text-zinc-100">{owner.address}</p></div>}
              </div>
            </div>

            {/* Vehicles table */}
            <div className="overflow-hidden rounded-xl border border-zinc-700">
              <table className="w-full text-left">
                <thead className="bg-zinc-900/50 border-b border-zinc-700">
                  <tr>
                    {["#", "Type", "Vehicle No.", "Period", "Amount"].map((h) => (
                      <th key={h} className="text-xs font-semibold text-zinc-500 uppercase tracking-wide py-2.5 px-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-700/50">
                  {vehicles.map((v, i) => (
                    <tr key={v.id} className="bg-zinc-800">
                      <td className="py-3 px-3 text-sm text-zinc-500">{i + 1}</td>
                      <td className="py-3 px-3 text-sm font-semibold text-zinc-100">{v.type}</td>
                      <td className="py-3 px-3 text-sm font-mono text-zinc-300">{v.number || "—"}</td>
                      <td className="py-3 px-3 text-xs text-zinc-400">
                        <p className="font-mono">{v.startDate} →</p>
                        <p className="font-mono">{v.endDate}</p>
                        <p className="text-zinc-600 mt-0.5">{getDays(v.startDate, v.endDate)}d</p>
                      </td>
                      <td className="py-3 px-3 text-sm font-bold text-zinc-100">{formatNPR(v.rate)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-amber-500/10 border-t border-amber-500/30">
                  <tr>
                    <td colSpan={4} className="py-3 px-3 text-sm font-bold text-zinc-300">Total Payable</td>
                    <td className="py-3 px-3 text-base font-bold text-amber-400">{formatNPR(total)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

<div className="flex justify-between pt-2">
              <button onClick={() => setStep(2)} className="text-sm text-zinc-500 hover:text-zinc-300 font-medium px-4 py-2.5">← Back</button>
              <button onClick={() => setStep(4)} className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl">
                Proceed to Payment <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Payment */}
        {step === 4 && (
          <div className="space-y-5 animate-fade-in">
            <div>
              <h3 className="text-lg font-bold text-zinc-100">Payment</h3>
              <p className="text-sm text-zinc-500 mt-0.5">Total payable: <strong className="text-amber-400">{formatNPR(total)}</strong></p>
            </div>

            {/* Payment method */}
            <div>
              <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">Select Payment Method</p>
              <div className="grid grid-cols-3 gap-3">
                {(isStaff ? STAFF_PAYMENT_OPTS : PAYMENT_OPTS).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPaymentMethod(p.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === p.id
                        ? "border-amber-500 bg-amber-500/10 shadow-md shadow-none"
                        : "border-zinc-700 bg-zinc-800 hover:border-zinc-600"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl ${p.color} flex items-center justify-center text-white font-bold text-lg shadow-sm`}>
                      {p.icon}
                    </div>
                    <span className={`text-xs font-bold ${paymentMethod === p.id ? "text-amber-400" : "text-zinc-400"}`}>
                      {p.label}
                    </span>
                    <span className="text-xs text-zinc-500 text-center leading-tight">{p.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* QR / Bank details */}
            <div className="bg-zinc-900/50 rounded-xl border border-zinc-700 p-5">
              {paymentMethod === "Offline" ? (
                <div className="flex flex-col items-center gap-3 py-2 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-700 flex items-center justify-center text-2xl font-bold text-zinc-300">₨</div>
                  <p className="text-sm font-bold text-zinc-300">Collect Cash / Cheque in Person</p>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    Collect <strong className="text-zinc-200">{formatNPR(total)}</strong> from the customer directly.<br />
                    A reference number is optional but recommended.
                  </p>
                </div>
              ) : paymentMethod === "Mobile Banking" ? (
                <div className="space-y-3">
                  <p className="text-sm font-bold text-zinc-300">Bank Transfer Details</p>
                  {[
                    { label: "Bank", value: "Nepal Investment Mega Bank" },
                    { label: "Account Name", value: "Nawa Kantipur Insurance Pvt. Ltd." },
                    { label: "Account Number", value: "00101234567890" },
                    { label: "Amount", value: formatNPR(total) },
                    { label: "Reference", value: owner.phone || "Your phone number" },
                  ].map((d) => (
                    <div key={d.label} className="flex justify-between text-sm border-b border-zinc-700 pb-2 last:border-0 last:pb-0">
                      <span className="text-zinc-500 font-medium">{d.label}</span>
                      <span className="font-bold text-zinc-100">{d.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <p className="text-sm font-bold text-zinc-300">Scan to Pay via {paymentMethod}</p>
                  {/* Simulated QR code */}
                  <div className="w-40 h-40 bg-zinc-800 border-4 border-zinc-700 rounded-2xl p-3 flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      {/* QR pattern simulation */}
                      {[0,1,2,3,4,5,6].map(row => [0,1,2,3,4,5,6].map(col => {
                        const pattern = [
                          [1,1,1,1,1,1,1],[1,0,0,0,0,0,1],[1,0,1,1,1,0,1],[1,0,1,0,1,0,1],
                          [1,0,1,1,1,0,1],[1,0,0,0,0,0,1],[1,1,1,1,1,1,1]
                        ];
                        const fill = pattern[row]?.[col] ? "#0f172a" : "white";
                        return <rect key={`${row}-${col}`} x={col*14} y={row*14} width={14} height={14} fill={fill} />;
                      }))}
                      {/* Data area */}
                      {Array.from({length: 6}, (_, r) => Array.from({length: 4}, (_, c) => (
                        <rect key={`d${r}-${c}`} x={c*14} y={(r+1)*14} width={14} height={14}
                          fill={Math.random() > 0.5 ? "#0f172a" : "white"} />
                      )))}
                    </svg>
                  </div>
                  <p className="text-xs text-zinc-500 text-center">Amount: <strong className="text-zinc-100">{formatNPR(total)}</strong></p>
                  <p className="text-xs text-zinc-500">Open {paymentMethod} app → Scan QR → Confirm payment</p>
                </div>
              )}
            </div>

            {/* Transaction ID */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                {paymentMethod === "Offline" ? "Reference No. (optional)" : "Transaction / Voucher ID"}
              </label>
              <input
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder={paymentMethod === "Offline" ? "e.g. receipt no., cheque no." : "Enter transaction ID after payment"}
                className="w-full px-3.5 py-2.5 text-sm bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex justify-between pt-2">
              <button onClick={() => setStep(3)} className="text-sm text-zinc-500 hover:text-zinc-300 font-medium px-4 py-2.5">← Back</button>
              <button
                onClick={handleConfirmPayment}
                disabled={(paymentMethod !== "Offline" && !transactionId) || paymentConfirmed}
                className="flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors"
              >
                {paymentConfirmed ? <><CheckCircle2 size={16} /> Confirmed!</> : (paymentMethod === "Offline" ? "Mark as Paid" : "Confirm Payment")}
              </button>
            </div>
          </div>
        )}

        {/* Step 5: Receipt */}
        {step === 5 && (
          <div className="animate-scale-in">
            {/* Success banner — screen only */}
            <div className="no-print text-center mb-5">
              <div className="w-14 h-14 bg-amber-500/15 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 size={28} className="text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-zinc-100">Registration Complete!</h3>
              <p className="text-zinc-500 text-sm mt-1">{owner.name}'s vehicles registered successfully</p>
            </div>

            {/* Receipt card */}
            <div id="receipt-print-area" className="bg-zinc-900/60 border border-zinc-700 rounded-2xl overflow-hidden text-sm">

              {/* Company header */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0 overflow-hidden">
                      {settings.logo
                        ? <img src={settings.logo} alt="logo" className="w-full h-full object-contain" />
                        : <span className="text-white font-black text-sm tracking-tight">{settings.initials}</span>
                      }
                    </div>
                    <div>
                      <p className="text-white font-black text-base leading-tight">{settings.shortName}</p>
                      <p className="text-amber-100 text-xs mt-0.5">{settings.address}</p>
                      <p className="text-amber-100 text-xs">{settings.phone}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-amber-100 text-xs font-semibold uppercase tracking-wider">Receipt No.</p>
                    <p className="text-white font-bold font-mono text-base">{receiptId}</p>
                    <p className="text-amber-100 text-xs mt-0.5">
                      {new Date().toLocaleDateString("en-NP", { year: "numeric", month: "short", day: "numeric" })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* Owner + payment details */}
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
                  <div><p className="text-zinc-500">Owner Name</p><p className="font-bold text-zinc-100 mt-0.5">{owner.name}</p></div>
                  <div><p className="text-zinc-500">Phone</p><p className="font-bold text-zinc-100 mt-0.5">{owner.phone}</p></div>
                  {owner.address && <div><p className="text-zinc-500">Address</p><p className="font-bold text-zinc-100 mt-0.5">{owner.address}</p></div>}
                  <div><p className="text-zinc-500">Payment Method</p><p className="font-bold text-zinc-100 mt-0.5">{paymentMethod}</p></div>
                </div>

                {/* Vehicles table */}
                <div className="rounded-xl overflow-hidden border border-zinc-700">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-zinc-700/40">
                        <th className="text-left py-2 px-3 font-semibold text-zinc-400">#</th>
                        <th className="text-left py-2 px-3 font-semibold text-zinc-400">Type</th>
                        <th className="text-left py-2 px-3 font-semibold text-zinc-400">Vehicle No.</th>
                        <th className="text-left py-2 px-3 font-semibold text-zinc-400">Period</th>
                        <th className="text-right py-2 px-3 font-semibold text-zinc-400">Amount</th>
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
                            <span className="ml-1 text-zinc-600">({getDays(v.startDate, v.endDate)}d)</span>
                          </td>
                          <td className="py-2 px-3 text-right font-bold text-zinc-100">{formatNPR(v.rate)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-amber-500/10 border-t border-amber-500/20">
                        <td colSpan={4} className="py-2.5 px-3 font-bold text-zinc-300">TOTAL PAID</td>
                        <td className="py-2.5 px-3 text-right font-black text-amber-400 text-base">{formatNPR(total)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Payment confirmation */}
                <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
                  <CheckCircle2 size={13} className="shrink-0" />
                  Payment confirmed · Transaction ID: <span className="font-mono font-bold">{transactionId}</span>
                </div>

                {/* Keep safely note */}
                <div className="border-t border-dashed border-zinc-700 pt-4">
                  <div className="flex items-start gap-2 bg-zinc-800/60 rounded-xl px-4 py-3 border border-zinc-700">
                    <span className="text-base shrink-0">📌</span>
                    <p className="text-xs text-zinc-300 font-semibold leading-relaxed">
                      {settings.receiptMessage}
                    </p>
                  </div>
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

                {/* Footer */}
                <p className="text-center text-xs text-zinc-600">
                  This is a computer-generated receipt. For queries, contact {settings.phone} or {settings.email}
                </p>
              </div>
            </div>

            <div className="no-print flex gap-3 mt-4">
              <button
                onClick={() => window.print()}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-amber-400 bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/30 rounded-xl transition-colors"
              >
                🖨️ Print Receipt
              </button>
              <button
                onClick={() => navigate("/staff")}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 rounded-xl transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
