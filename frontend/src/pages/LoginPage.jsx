import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff, ArrowRight } from "lucide-react";

// Credential map — email → role + route
const USERS = {
  "superadmin@bhalaikos.com":             { role: "superadmin", path: "/superadmin" },
  "admin@nawakantipurinsurance.com":       { role: "admin",      path: "/admin"      },
  "anita@nawakantipurinsurance.com":       { role: "staff",      path: "/staff"      },
};
const DEMO_PASSWORD = "password";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]   = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const user = USERS[email.trim().toLowerCase()];
    if (!user || password !== DEMO_PASSWORD) {
      setError("Invalid email or password.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    localStorage.setItem("bk_role", user.role);
    navigate(user.path);
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#18181b" }}>
      {/* Left — brand panel */}
      <div
        className="hidden lg:flex flex-col items-center justify-center w-[46%] relative overflow-hidden select-none"
        style={{ background: "linear-gradient(160deg, #0a0a0c 0%, #111113 100%)" }}
      >
        {/* Subtle amber glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 40%, rgba(245,158,11,0.07) 0%, transparent 65%)",
          }}
        />

        <div className="relative z-10 flex flex-col items-center text-center px-12">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mb-7"
            style={{
              background: "linear-gradient(135deg, #f59e0b, #f97316)",
              boxShadow: "0 20px 60px rgba(245,158,11,0.25)",
            }}
          >
            <Shield size={36} className="text-white" strokeWidth={1.5} />
          </div>

          <p className="text-white font-bold text-4xl tracking-tight leading-none">BhalaiKos</p>
          <p className="mt-3 text-zinc-500 text-base font-light tracking-wide">
            Easing vehicle insurance.
          </p>
        </div>

        <p className="absolute bottom-8 text-zinc-700 text-xs">© 2026 BhalaiKos</p>
      </div>

      {/* Right — login form */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Mobile brand */}
        <div className="lg:hidden flex flex-col items-center gap-3 mb-10">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #f59e0b, #f97316)", boxShadow: "0 12px 40px rgba(245,158,11,0.25)" }}
          >
            <Shield size={26} className="text-white" strokeWidth={1.5} />
          </div>
          <p className="text-white font-bold text-2xl tracking-tight">BhalaiKos</p>
          <p className="text-zinc-500 text-sm">Easing vehicle insurance.</p>
        </div>

        <div className="w-full max-w-[360px]">
          <div className="mb-8">
            <h2 className="text-zinc-100 text-2xl font-bold tracking-tight">Sign in</h2>
            <p className="text-zinc-500 text-sm mt-1">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 text-sm rounded-xl text-zinc-100 placeholder-zinc-600 transition-all"
                style={{
                  background: "#27272a",
                  border: "1px solid #3f3f46",
                  outline: "none",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#f59e0b")}
                onBlur={(e) => (e.target.style.borderColor = "#3f3f46")}
                placeholder="you@company.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Password</label>
                <button type="button" className="text-xs text-amber-500 hover:text-amber-400 font-medium">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-11 text-sm rounded-xl text-zinc-100 placeholder-zinc-600 transition-all"
                  style={{
                    background: "#27272a",
                    border: "1px solid #3f3f46",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#f59e0b")}
                  onBlur={(e) => (e.target.style.borderColor = "#3f3f46")}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div
                className="text-xs px-4 py-3 rounded-xl"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#fca5a5" }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-semibold rounded-xl text-white transition-all mt-2"
              style={{
                background: loading ? "#92400e" : "linear-gradient(135deg, #f59e0b, #f97316)",
                opacity: loading ? 0.7 : 1,
                boxShadow: "0 4px 20px rgba(245,158,11,0.25)",
              }}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Signing in...
                </span>
              ) : (
                <>Sign in <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6" style={{ borderTop: "1px solid #27272a" }}>
            <p className="text-xs text-zinc-600 text-center">
              Looking for your company portal?{" "}
              <button
                onClick={() => navigate("/portal/nawakantipurinsurance")}
                className="text-amber-500 hover:text-amber-400 font-semibold"
              >
                Access portal →
              </button>
            </p>
            {/* Demo hint */}
            <div className="mt-4 rounded-xl px-4 py-3" style={{ background: "#27272a", border: "1px solid #3f3f46" }}>
              <p className="text-xs text-zinc-500 font-semibold mb-1.5">Demo credentials (password: <span className="text-zinc-400">password</span>)</p>
              {Object.keys(USERS).map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => { setEmail(em); setPassword(DEMO_PASSWORD); setError(""); }}
                  className="block text-xs text-zinc-500 hover:text-amber-400 transition-colors py-0.5"
                >
                  {em}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
