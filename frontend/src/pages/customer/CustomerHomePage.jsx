import { useOutletContext, useNavigate, useParams } from "react-router-dom";
import {
  Car, Shield, Clock, CheckCircle2, ArrowRight, FileText,
  Phone, Mail, MapPin, Zap, Lock, ChevronRight, Star,
} from "lucide-react";

const FEATURES = [
  { icon: Zap, title: "Instant Registration", desc: "Complete vehicle registration in under 5 minutes from anywhere.", color: "from-amber-500 to-orange-500" },
  { icon: Lock, title: "Secure Payments", desc: "Pay via eSewa, Khalti, or Mobile Banking — fully encrypted.", color: "from-teal-500 to-emerald-500" },
  { icon: FileText, title: "Digital Receipts", desc: "Download and print your official receipt anytime.", color: "from-blue-500 to-indigo-500" },
  { icon: Clock, title: "Track Validity", desc: "Always know when your vehicles are due for renewal.", color: "from-violet-500 to-purple-500" },
];

const STEPS = [
  { n: "01", title: "Create Account", desc: "Sign up with your phone number in seconds." },
  { n: "02", title: "Add Your Vehicles", desc: "Enter vehicle type, plate number, and coverage period." },
  { n: "03", title: "Pay & Get Receipt", desc: "Pay digitally and receive your receipt instantly." },
];

export default function CustomerHomePage() {
  const navigate = useNavigate();
  const { tenant } = useParams();
  const ctx = useOutletContext();
  const tenantData = ctx?.tenantData;
  const customer = ctx?.customer;

  return (
    <div className="space-y-20">
      {/* ── Hero ── */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-zinc-800 via-zinc-900 to-zinc-900 border border-zinc-700/60 shadow-xl">
        {/* Decorative blobs */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-orange-500/8 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 px-8 sm:px-14 py-16 sm:py-20">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold px-3 py-1.5 rounded-full mb-6 uppercase tracking-wider">
            <Shield size={12} /> Verified Insurance Portal
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-zinc-100 leading-tight max-w-xl">
            Vehicle Insurance<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
              Made Simple.
            </span>
          </h1>
          <p className="mt-5 text-zinc-400 text-lg leading-relaxed max-w-lg">
            {tenantData?.name} brings you a fast, paperless way to register your vehicles and stay protected — all online.
          </p>

          <div className="flex flex-wrap gap-3 mt-8">
            {customer ? (
              <button onClick={() => navigate(`/portal/${tenant}/dashboard`)}
                className="flex items-center gap-2 px-7 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-lg shadow-amber-900/30 transition-all">
                <Car size={18} /> Go to Dashboard <ChevronRight size={16} />
              </button>
            ) : (
              <>
                <button onClick={() => navigate(`/portal/${tenant}/register`)}
                  className="flex items-center gap-2 px-7 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-lg shadow-amber-900/30 transition-all">
                  <Car size={18} /> Register My Vehicles
                </button>
                <button onClick={() => navigate(`/portal/${tenant}/auth`)}
                  className="flex items-center gap-2 px-6 py-3.5 bg-zinc-700/60 hover:bg-zinc-700 text-zinc-200 font-semibold rounded-xl border border-zinc-600 transition-colors">
                  Sign In / Sign Up <ArrowRight size={16} />
                </button>
              </>
            )}
          </div>

          {/* Mini trust bar */}
          <div className="flex flex-wrap gap-5 mt-10 pt-8 border-t border-zinc-700/60">
            {["5-minute registration", "Instant digital receipt", "100% secure payments"].map(t => (
              <span key={t} className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium">
                <CheckCircle2 size={13} className="text-amber-400" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section>
        <div className="text-center mb-10">
          <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">Simple Process</p>
          <h2 className="text-2xl font-bold text-zinc-100">How it works</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {STEPS.map((s, i) => (
            <div key={s.n} className="relative bg-zinc-800 rounded-2xl border border-zinc-700 p-6 shadow-sm">
              <div className="text-4xl font-black text-amber-500/20 mb-4 leading-none">{s.n}</div>
              <h3 className="text-base font-bold text-zinc-100 mb-1.5">{s.title}</h3>
              <p className="text-sm text-zinc-500 leading-relaxed">{s.desc}</p>
              {i < STEPS.length - 1 && (
                <div className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-zinc-700 border border-zinc-600 items-center justify-center">
                  <ChevronRight size={13} className="text-amber-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section>
        <div className="text-center mb-10">
          <p className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">Why choose us</p>
          <h2 className="text-2xl font-bold text-zinc-100">Everything you need</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="bg-zinc-800 rounded-2xl border border-zinc-700 p-5 shadow-sm hover:border-zinc-600 transition-colors">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-sm`}>
                <f.icon size={18} className="text-white" />
              </div>
              <p className="font-bold text-zinc-100 text-sm">{f.title}</p>
              <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      {!customer && (
        <section className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-10 text-center shadow-xl shadow-amber-900/20">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-white text-white" />)}
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Ready to get started?</h2>
          <p className="text-amber-100 mb-6">Create your free account and register your vehicles in minutes.</p>
          <button onClick={() => navigate(`/portal/${tenant}/auth`)}
            className="px-8 py-3.5 bg-zinc-900 text-amber-400 font-bold rounded-xl hover:bg-zinc-800 transition-colors shadow-md">
            Get Started Free <ArrowRight size={16} className="inline ml-1" />
          </button>
        </section>
      )}

      {/* ── Contact ── */}
      <section className="bg-zinc-800 rounded-2xl border border-zinc-700 p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <h3 className="font-bold text-zinc-100 text-lg mb-1">Need help?</h3>
            <p className="text-sm text-zinc-500">Our team is available during office hours.</p>
          </div>
          <div className="flex flex-wrap gap-4">
            {[
              { icon: Phone, label: tenantData?.phone || "+977-9841234567" },
              { icon: Mail, label: tenantData?.adminEmail || "contact@insurance.com" },
              { icon: MapPin, label: tenantData?.address || "Kathmandu, Nepal" },
            ].map(c => (
              <div key={c.label} className="flex items-center gap-2 text-sm text-zinc-400">
                <c.icon size={14} className="text-amber-400 shrink-0" /> {c.label}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
