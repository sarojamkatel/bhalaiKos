import { useState, useRef } from "react";
import {
  Save, Globe, Bell, Shield, Palette, CreditCard, Building2, Check,
  Sun, Moon, Monitor, Upload, X, Plus, ImageOff, Phone, FileText,
  AlertTriangle,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import {
  getCompanySettings, saveCompanySettings, getTenantSlug,
} from "../../utils/companySettings";

const tenantSlug = getTenantSlug(localStorage.getItem("bk_role"));

const Section = ({ icon: Icon, title, desc, children }) => (
  <div className="bg-zinc-800 rounded-2xl border border-zinc-700 shadow-sm overflow-hidden">
    <div className="flex items-center gap-3 px-6 py-4 border-b border-zinc-700/50">
      <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
        <Icon size={16} className="text-amber-400" />
      </div>
      <div>
        <h3 className="font-bold text-zinc-100 text-sm">{title}</h3>
        {desc && <p className="text-xs text-zinc-500">{desc}</p>}
      </div>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const Field = ({ label, desc, children }) => (
  <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
    <div className="sm:w-48 shrink-0">
      <p className="text-sm font-semibold text-zinc-300">{label}</p>
      {desc && <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>}
    </div>
    <div className="flex-1">{children}</div>
  </div>
);

const Input = ({ value, onChange, placeholder, type = "text" }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="w-full px-3.5 py-2.5 text-sm bg-zinc-900/60 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
  />
);

const THEMES = [
  {
    id: "light", label: "Light", icon: Sun,
    preview: (
      <div className="w-full h-10 rounded-lg bg-zinc-700/40 border border-zinc-700 flex items-center gap-1.5 px-2 overflow-hidden">
        <div className="w-2 h-2 rounded-full bg-slate-300 shrink-0" />
        <div className="flex-1 h-1.5 rounded bg-slate-300" />
        <div className="w-5 h-4 rounded bg-amber-500/15 shrink-0" />
      </div>
    ),
  },
  {
    id: "dark", label: "Dark", icon: Moon,
    preview: (
      <div className="w-full h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center gap-1.5 px-2 overflow-hidden">
        <div className="w-2 h-2 rounded-full bg-slate-600 shrink-0" />
        <div className="flex-1 h-1.5 rounded bg-slate-600" />
        <div className="w-5 h-4 rounded bg-amber-500 shrink-0" />
      </div>
    ),
  },
  {
    id: "system", label: "System", icon: Monitor,
    preview: (
      <div className="w-full h-10 rounded-lg overflow-hidden border border-zinc-700 flex">
        <div className="flex-1 bg-zinc-700/40 flex items-center gap-1 px-1.5">
          <div className="flex-1 h-1.5 rounded bg-slate-300" />
        </div>
        <div className="flex-1 bg-slate-800 flex items-center gap-1 px-1.5">
          <div className="flex-1 h-1.5 rounded bg-slate-600" />
        </div>
      </div>
    ),
  },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState(() => getCompanySettings(tenantSlug));
  const [notifs, setNotifs] = useState({ newReg: true, payment: true, staffLogin: false });
  const [saved, setSaved] = useState(false);
  const { theme, setTheme } = useTheme();
  const logoInputRef = useRef(null);

  const update = (patch) => setSettings((s) => ({ ...s, ...patch }));

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert("Logo must be under 2 MB."); return; }
    const reader = new FileReader();
    reader.onload = (ev) => update({ logo: ev.target.result });
    reader.readAsDataURL(file);
  };

  const updateInstruction = (i, value) => {
    const updated = [...settings.accidentInstructions];
    updated[i] = value;
    update({ accidentInstructions: updated });
  };

  const removeInstruction = (i) => {
    update({ accidentInstructions: settings.accidentInstructions.filter((_, idx) => idx !== i) });
  };

  const addInstruction = () => {
    update({ accidentInstructions: [...settings.accidentInstructions, ""] });
  };

  const handleSave = () => {
    saveCompanySettings(tenantSlug, settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in-up max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-zinc-100">Company Settings</h2>
          <p className="text-sm text-zinc-500 mt-0.5">Manage your company profile, receipt content, and preferences</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl bg-amber-500 hover:bg-amber-600 text-white shadow-sm transition-all"
        >
          {saved ? <><Check size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
        </button>
      </div>

      {/* ── Company Profile ── */}
      <Section icon={Building2} title="Company Profile" desc="Displayed on receipts and the customer portal">
        <div className="space-y-6">

          {/* Logo upload */}
          <Field label="Company Logo" desc="PNG or JPG, max 2 MB">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl border-2 border-zinc-700 flex items-center justify-center overflow-hidden shrink-0 bg-zinc-900/50">
                {settings.logo ? (
                  <img src={settings.logo} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <ImageOff size={18} className="text-zinc-600" />
                    <span className="text-xs text-zinc-600">No logo</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                <button
                  onClick={() => logoInputRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-zinc-300 bg-zinc-700/50 hover:bg-zinc-700 border border-zinc-600 rounded-lg transition-colors"
                >
                  <Upload size={13} /> Upload Logo
                </button>
                {settings.logo && (
                  <button
                    onClick={() => update({ logo: null })}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 rounded-lg transition-colors"
                  >
                    <X size={13} /> Remove
                  </button>
                )}
                <p className="text-xs text-zinc-600">If no logo, initials will be shown</p>
              </div>
            </div>
          </Field>

          <Field label="Company Name" desc="Full legal name">
            <Input value={settings.companyName} onChange={(e) => update({ companyName: e.target.value })} placeholder="e.g. Nawa Kantipur Insurance Pvt. Ltd." />
          </Field>

          <Field label="Short Name" desc="Printed large on receipts">
            <Input value={settings.shortName} onChange={(e) => update({ shortName: e.target.value })} placeholder="e.g. NAWA KANTIPUR INSURANCE" />
          </Field>

          <Field label="Initials" desc="2–3 letters shown when no logo is uploaded">
            <div className="flex items-center gap-3">
              <input
                maxLength={3}
                value={settings.initials}
                onChange={(e) => update({ initials: e.target.value.toUpperCase() })}
                placeholder="NKI"
                className="w-20 px-3.5 py-2.5 text-sm bg-zinc-900/60 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent font-bold text-center uppercase"
              />
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <span className="text-white font-black text-sm">{settings.initials || "?"}</span>
              </div>
            </div>
          </Field>

          <Field label="Address">
            <Input value={settings.address} onChange={(e) => update({ address: e.target.value })} placeholder="Street, City, Nepal" />
          </Field>

          <Field label="Phone">
            <Input value={settings.phone} onChange={(e) => update({ phone: e.target.value })} placeholder="+977-XX-XXXXXXX" />
          </Field>

          <Field label="Email" desc="For customer correspondence">
            <Input type="email" value={settings.email} onChange={(e) => update({ email: e.target.value })} placeholder="contact@company.com" />
          </Field>
        </div>
      </Section>

      {/* ── Post-Accident Contact ── */}
      <Section icon={Phone} title="Post-Accident Contact" desc="Person clients should call immediately after an accident">
        <div className="space-y-5">
          <Field label="Contact Person" desc="Name and role">
            <Input value={settings.contactPerson} onChange={(e) => update({ contactPerson: e.target.value })} placeholder="e.g. Bikram Shrestha (Branch Manager)" />
          </Field>
          <Field label="Contact Phone">
            <Input value={settings.contactPhone} onChange={(e) => update({ contactPhone: e.target.value })} placeholder="+977-98XXXXXXXX" />
          </Field>
        </div>
      </Section>

      {/* ── Receipt Content ── */}
      <Section icon={FileText} title="Receipt Content" desc="Text printed on every issued receipt">
        <div className="space-y-6">
          <Field label="Safety Message" desc="Appears under the payment confirmation">
            <textarea
              value={settings.receiptMessage}
              onChange={(e) => update({ receiptMessage: e.target.value })}
              rows={3}
              className="w-full px-3.5 py-2.5 text-sm bg-zinc-900/60 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none transition-all"
              placeholder="Please keep this receipt safely..."
            />
          </Field>

          <Field label="Accident Instructions" desc="Numbered steps printed on every receipt">
            <div className="space-y-2.5">
              {settings.accidentInstructions.map((instr, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-400 shrink-0 mt-2.5">
                    {i + 1}
                  </span>
                  <textarea
                    value={instr}
                    onChange={(e) => updateInstruction(i, e.target.value)}
                    rows={2}
                    className="flex-1 px-3 py-2 text-sm bg-zinc-900/60 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none transition-all"
                    placeholder={`Instruction ${i + 1}...`}
                  />
                  <button
                    onClick={() => removeInstruction(i)}
                    disabled={settings.accidentInstructions.length <= 1}
                    className="text-zinc-600 hover:text-rose-400 disabled:opacity-20 p-1.5 mt-1.5 rounded-lg hover:bg-rose-500/10 transition-colors shrink-0"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button
                onClick={addInstruction}
                disabled={settings.accidentInstructions.length >= 8}
                className="flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300 px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Plus size={13} /> Add Instruction
              </button>
            </div>
          </Field>
        </div>
      </Section>

      {/* ── Portal Domain ── */}
      <Section icon={Globe} title="Portal Domain" desc="Your customer portal subdomain">
        <Field label="Subdomain" desc="Your customer portal address">
          <div className="flex items-center gap-2">
            <Input value={settings.subdomain} onChange={(e) => update({ subdomain: e.target.value })} placeholder="yourcompany" />
            <span className="text-sm text-zinc-500 whitespace-nowrap">.bhalaikos.com</span>
          </div>
          <p className="text-xs text-zinc-500 mt-1.5">
            Live at: <span className="text-amber-400 font-medium">{settings.subdomain || "yourcompany"}.bhalaikos.com</span>
          </p>
        </Field>
      </Section>

      {/* ── Appearance ── */}
      <Section icon={Palette} title="Appearance" desc="Interface theme preference">
        <div className="grid grid-cols-3 gap-3">
          {THEMES.map(({ id, label, icon: Icon, preview }) => {
            const active = theme === id;
            return (
              <button
                key={id}
                onClick={() => setTheme(id)}
                className={`group relative flex flex-col items-center gap-2.5 p-3 rounded-xl border-2 transition-all ${
                  active ? "border-amber-500 bg-amber-500/10" : "border-zinc-700 hover:border-zinc-600 bg-zinc-900/50"
                }`}
              >
                {active && (
                  <span className="absolute top-2 right-2 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                    <Check size={10} className="text-white" strokeWidth={3} />
                  </span>
                )}
                {preview}
                <div className="flex items-center gap-1.5">
                  <Icon size={13} className={active ? "text-amber-400" : "text-zinc-500"} />
                  <span className={`text-xs font-semibold ${active ? "text-amber-400" : "text-zinc-400"}`}>{label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </Section>

      {/* ── Notifications ── */}
      <Section icon={Bell} title="Notifications" desc="Events that trigger alerts">
        <div className="space-y-4">
          {[
            { key: "newReg",     label: "New Registration",  desc: "Alert when a new registration is submitted" },
            { key: "payment",    label: "Payment Received",  desc: "Alert when a payment is confirmed" },
            { key: "staffLogin", label: "Staff Logins",      desc: "Alert when a staff member logs in from a new device" },
          ].map((n) => (
            <div key={n.key} className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-zinc-300">{n.label}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{n.desc}</p>
              </div>
              <button
                onClick={() => setNotifs({ ...notifs, [n.key]: !notifs[n.key] })}
                className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors ${notifs[n.key] ? "bg-amber-500" : "bg-zinc-700"}`}
              >
                <span className={`inline-block h-5 w-5 rounded-full bg-white shadow-md transform transition-transform ${notifs[n.key] ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Payment Gateways ── */}
      <Section icon={CreditCard} title="Payment Gateways" desc="Accepted payment methods">
        <div className="space-y-3">
          {[
            { name: "eSewa",          color: "bg-amber-500", desc: "Nepal's leading digital wallet",   enabled: true },
            { name: "Khalti",         color: "bg-teal-500",  desc: "Popular mobile payment platform",  enabled: true },
            { name: "Mobile Banking", color: "bg-blue-500",  desc: "Direct bank transfers",            enabled: true },
          ].map((gw) => (
            <div key={gw.name} className="flex items-center justify-between p-4 bg-zinc-900/50 rounded-xl border border-zinc-700/50">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${gw.color} flex items-center justify-center`}>
                  <CreditCard size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-100">{gw.name}</p>
                  <p className="text-xs text-zinc-500">{gw.desc}</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                Enabled
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Danger Zone ── */}
      <div className="bg-red-500/5 rounded-2xl border border-red-500/20 p-5">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle size={16} className="text-red-400" />
          <h3 className="font-bold text-red-400 text-sm">Danger Zone</h3>
        </div>
        <p className="text-xs text-zinc-500 mb-4">These actions are irreversible. Please proceed with caution.</p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="px-4 py-2 text-xs font-semibold text-red-400 bg-transparent hover:bg-red-500/10 border border-red-500/30 rounded-xl transition-colors">
            Delete All Data
          </button>
          <button className="px-4 py-2 text-xs font-semibold text-red-400 bg-transparent hover:bg-red-500/10 border border-red-500/30 rounded-xl transition-colors">
            Deactivate Company
          </button>
        </div>
      </div>
    </div>
  );
}
