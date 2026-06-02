import { useState } from "react";
import {
  Search, Plus, Users, CheckCircle2, XCircle, MoreVertical,
  Mail, Phone, Car, Calendar, X, Eye, Trash2, Ban, UserPlus,
  Shield,
} from "lucide-react";
import { mockStaff } from "../../utils/mockData";
import { formatDate, statusConfig, avatarColor, getInitials } from "../../utils/formatters";

function AddStaffModal({ onClose }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "staff" });
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-800 rounded-2xl shadow-2xl w-full max-w-md animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-zinc-700/50">
          <div>
            <h3 className="font-bold text-zinc-100">Add Staff Member</h3>
            <p className="text-xs text-zinc-500 mt-0.5">They'll receive an invite email</p>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-400 p-1"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-4">
          {[
            { label: "Full Name", key: "name", placeholder: "Staff member's full name" },
            { label: "Email Address", key: "email", placeholder: "staff@company.com", type: "email" },
            { label: "Phone Number", key: "phone", placeholder: "+977-9XXXXXXXXX" },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">{f.label}</label>
              <input
                type={f.type || "text"}
                value={form[f.key]}
                onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                placeholder={f.placeholder}
                className="w-full px-3.5 py-2.5 text-sm bg-zinc-800 border border-slate-300 rounded-xl text-zinc-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-zinc-800 border border-slate-300 rounded-xl text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="staff">Staff</option>
              <option value="manager">Manager</option>
            </select>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-400">
            <strong>Note:</strong> The staff member will receive an email with login instructions and a temporary password.
          </div>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button onClick={onClose} className="flex-1 py-2.5 text-sm font-semibold text-zinc-300 bg-zinc-700/40 hover:bg-slate-200 rounded-xl">Cancel</button>
          <button onClick={onClose} className="flex-1 py-2.5 text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-sm flex items-center justify-center gap-2">
            <UserPlus size={15} /> Send Invite
          </button>
        </div>
      </div>
    </div>
  );
}

function StaffCard({ staff }) {
  const [open, setOpen] = useState(false);
  const status = statusConfig[staff.status] || statusConfig.inactive;
  return (
    <div className="bg-zinc-800 rounded-2xl border border-zinc-700 p-5 shadow-sm card-hover">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl ${avatarColor(staff.name)} flex items-center justify-center text-white font-bold text-sm`}>
            {getInitials(staff.name)}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-zinc-100 text-sm">{staff.name}</p>
            <p className="text-xs text-zinc-500 capitalize">{staff.role}</p>
          </div>
        </div>
        <div className="relative">
          <button onClick={() => setOpen(!open)} className="text-zinc-500 hover:text-zinc-400 p-1 rounded-lg hover:bg-zinc-700/50">
            <MoreVertical size={16} />
          </button>
          {open && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
              <div className="absolute right-0 top-8 w-40 bg-zinc-800 rounded-xl shadow-xl border border-zinc-700 z-40 overflow-hidden">
                <button className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-zinc-300 hover:bg-zinc-700/30">
                  <Eye size={13} /> View Details
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-amber-400 hover:bg-amber-50">
                  <Ban size={13} /> {staff.status === "active" ? "Deactivate" : "Activate"}
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-red-600 hover:bg-red-50">
                  <Trash2 size={13} /> Remove
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Mail size={12} className="shrink-0" />
          <span className="truncate">{staff.email}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Phone size={12} className="shrink-0" />
          <span>{staff.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Calendar size={12} className="shrink-0" />
          <span>Joined {formatDate(staff.joinedAt, true)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-zinc-700/50">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
          <Car size={13} className="text-amber-400" />
          {staff.vehiclesManaged} vehicles
        </div>
        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${status.color}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-current" />
          {status.label}
        </span>
      </div>
    </div>
  );
}

export default function StaffPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);

  const filtered = mockStaff.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || s.status === filter || s.role === filter;
    return matchSearch && matchFilter;
  });

  const active = mockStaff.filter(s => s.status === "active").length;

  return (
    <div className="space-y-5 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-100">Staff Management</h2>
          <p className="text-sm text-zinc-500 mt-0.5">{mockStaff.length} staff members · {active} active</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-xl shadow-sm shadow-amber-900/20 self-start"
        >
          <UserPlus size={16} /> Add Staff
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total", value: mockStaff.length, bg: "bg-zinc-900/50 border-zinc-700", text: "text-zinc-100" },
          { label: "Active", value: active, bg: "bg-amber-500/10 border-amber-500/20", text: "text-amber-400" },
          { label: "Inactive", value: mockStaff.filter(s => s.status === "inactive").length, bg: "bg-red-50 border-red-100", text: "text-red-700" },
          { label: "Managers", value: mockStaff.filter(s => s.role === "manager").length, bg: "bg-amber-500/10 border-amber-500/30", text: "text-amber-400" },
        ].map((s) => (
          <div key={s.label} className={`rounded-xl border p-4 ${s.bg}`}>
            <p className={`text-2xl font-bold ${s.text}`}>{s.value}</p>
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
            placeholder="Search by name or email…"
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-zinc-900/50 border border-zinc-700 rounded-xl text-zinc-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-zinc-800"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "all", label: "All" },
            { key: "active", label: "Active" },
            { key: "inactive", label: "Inactive" },
            { key: "manager", label: "Managers" },
            { key: "staff", label: "Staff" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-xl border transition-colors ${
                filter === f.key
                  ? "bg-amber-500 text-white border-amber-500/30"
                  : "bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-amber-500/30"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Staff grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((staff) => (
          <StaffCard key={staff.id} staff={staff} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-zinc-800 rounded-2xl border border-zinc-700">
          <Users size={40} className="mx-auto text-slate-300 mb-3" />
          <p className="text-zinc-500 font-medium">No staff found</p>
          <button onClick={() => setShowAdd(true)} className="mt-3 text-sm text-amber-400 font-semibold">Add your first staff member →</button>
        </div>
      )}

      {showAdd && <AddStaffModal onClose={() => setShowAdd(false)} />}
    </div>
  );
}
