import { useState, useEffect } from "react";
import { useNavigate, useParams, useOutletContext } from "react-router-dom";
import { Shield, Eye, EyeOff, ArrowRight, User, Phone, Mail, Building2, Lock } from "lucide-react";
import {
  getCustomerAccounts, saveCustomerAccount,
  setCurrentCustomer,
} from "../../utils/customerAuth";

const DEMO = { name: "Ram Bahadur Shrestha", phone: "+977-9800000001", email: "ram@demo.com", company: "Demo Travels", password: "password" };

function seedDemo(tenant) {
  const accounts = getCustomerAccounts(tenant);
  if (!accounts[DEMO.phone]) {
    saveCustomerAccount(tenant, DEMO);
  }
}

const INPUT = "w-full px-4 py-3 pl-10 text-sm bg-zinc-900/60 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors";

function Field({ label, icon: Icon, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wide">{label}</label>
      <div className="relative">
        {Icon && <Icon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />}
        {children}
      </div>
    </div>
  );
}

export default function CustomerAuthPage() {
  const { tenant } = useParams();
  const navigate = useNavigate();
  const ctx = useOutletContext();
  const tenantData = ctx?.tenantData;
  const setCustomer = ctx?.setCustomer;

  useEffect(() => { seedDemo(tenant); }, [tenant]);

  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", phone: "", email: "", company: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setError(""); };

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));

    if (mode === "login") {
      const accounts = getCustomerAccounts(tenant);
      const acc = accounts[form.phone];
      if (!acc) { setError("No account found with this phone number."); setLoading(false); return; }
      if (acc.password !== form.password) { setError("Incorrect password."); setLoading(false); return; }
      setCurrentCustomer(tenant, form.phone);
      setCustomer?.({ ...acc, phone: form.phone });
      navigate(`/portal/${tenant}/dashboard`);
    } else {
      if (!form.name || !form.phone || !form.password) {
        setError("Name, phone, and password are required.");
        setLoading(false); return;
      }
      if (form.password.length < 6) {
        setError("Password must be at least 6 characters.");
        setLoading(false); return;
      }
      const accounts = getCustomerAccounts(tenant);
      if (accounts[form.phone]) {
        setError("An account already exists with this phone number.");
        setLoading(false); return;
      }
      const acc = { name: form.name, phone: form.phone, email: form.email, company: form.company, password: form.password };
      saveCustomerAccount(tenant, acc);
      setCurrentCustomer(tenant, form.phone);
      setCustomer?.(acc);
      navigate(`/portal/${tenant}/dashboard`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[72vh] flex items-center justify-center py-10">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-900/30">
            <Shield size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-100">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-sm text-zinc-500 mt-1.5">
            {tenantData?.name} · Customer Portal
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-zinc-800 border border-zinc-700 rounded-xl p-1 mb-6">
          {[["login", "Sign In"], ["signup", "Create Account"]].map(([m, label]) => (
            <button key={m} onClick={() => { setMode(m); setError(""); setForm({ name: "", phone: "", email: "", company: "", password: "" }); }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-colors ${mode === m ? "bg-amber-500 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="bg-zinc-800 rounded-2xl border border-zinc-700 p-6 shadow-sm space-y-4">
          {mode === "signup" && (
            <>
              <Field label="Full Name *" icon={User}>
                <input value={form.name} onChange={e => set("name", e.target.value)}
                  placeholder="Your full legal name" className={INPUT} />
              </Field>
              <Field label="Company / Business (optional)" icon={Building2}>
                <input value={form.company} onChange={e => set("company", e.target.value)}
                  placeholder="e.g. Himalayan Travels" className={INPUT} />
              </Field>
            </>
          )}

          <Field label="Phone Number *" icon={Phone}>
            <input value={form.phone} onChange={e => set("phone", e.target.value)}
              placeholder="+977-9XXXXXXXXX" className={INPUT} />
          </Field>

          {mode === "signup" && (
            <Field label="Email Address (optional)" icon={Mail}>
              <input type="email" value={form.email} onChange={e => set("email", e.target.value)}
                placeholder="your@email.com" className={INPUT} />
            </Field>
          )}

          <Field label="Password *" icon={Lock}>
            <input type={showPass ? "text" : "password"} value={form.password}
              onChange={e => set("password", e.target.value)}
              placeholder={mode === "signup" ? "Min. 6 characters" : "Your password"}
              className={INPUT + " pr-10"} />
            <button type="button" onClick={() => setShowPass(p => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </Field>

          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5">{error}</p>
          )}

          <button onClick={handleSubmit} disabled={loading}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors">
            {loading
              ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <>{mode === "login" ? "Sign In" : "Create Account"} <ArrowRight size={16} /></>}
          </button>
        </div>

        <p className="text-center text-sm text-zinc-500 mt-5">
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => { setMode(m => m === "login" ? "signup" : "login"); setError(""); }}
            className="text-amber-400 font-semibold hover:underline">
            {mode === "login" ? "Sign Up" : "Sign In"}
          </button>
        </p>

        {/* Demo hint */}
        <div className="mt-4 bg-zinc-800 border border-amber-500/30 rounded-xl px-4 py-3">
          <p className="text-xs text-amber-400 font-bold mb-3 uppercase tracking-wide">Demo Account</p>
          <div className="space-y-1.5 mb-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">Phone</span>
              <span className="font-mono font-bold text-zinc-100">{DEMO.phone}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">Name</span>
              <span className="text-zinc-300">{DEMO.name}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">Password</span>
              <span className="font-mono font-bold text-zinc-100">password</span>
            </div>
          </div>
          <button
            onClick={() => { setMode("login"); setForm(f => ({ ...f, phone: DEMO.phone, password: "password" })); setError(""); }}
            className="w-full text-xs bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-semibold py-2 rounded-lg transition-colors"
          >
            Use Demo Account
          </button>
        </div>
      </div>
    </div>
  );
}
