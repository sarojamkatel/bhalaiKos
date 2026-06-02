import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const FULL_MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];
const WEEK_DAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function toDate(str) {
  if (!str) return null;
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function toStr(date) {
  if (!date) return "";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function sameDay(a, b) {
  return a && b && a.toDateString() === b.toDateString();
}
function isBetween(d, a, b) {
  return d && a && b && d > a && d < b;
}

export default function DateRangePicker({ startDate, endDate, onChange }) {
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState("from");
  const [hover, setHover] = useState(null);
  const [vy, setVy] = useState(() => (toDate(startDate) || new Date()).getFullYear());
  const [vm, setVm] = useState(() => (toDate(startDate) || new Date()).getMonth());
  const ref = useRef(null);

  const from = toDate(startDate);
  const to = toDate(endDate);

  useEffect(() => {
    if (!open) return;
    function onDown(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setPhase("from");
        setHover(null);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  function openAs(p) {
    setPhase(p);
    setOpen(true);
    const anchor = p === "to" ? (to || from) : from;
    if (anchor) { setVy(anchor.getFullYear()); setVm(anchor.getMonth()); }
    else { const n = new Date(); setVy(n.getFullYear()); setVm(n.getMonth()); }
  }

  function prevMonth() {
    if (vm === 0) { setVm(11); setVy(y => y - 1); } else setVm(m => m - 1);
  }
  function nextMonth() {
    if (vm === 11) { setVm(0); setVy(y => y + 1); } else setVm(m => m + 1);
  }

  function clickDay(date) {
    if (phase === "from" || (from && date < from)) {
      onChange({ startDate: toStr(date), endDate: "" });
      setPhase("to");
    } else {
      onChange({ startDate, endDate: toStr(date) });
      setOpen(false);
      setPhase("from");
      setHover(null);
    }
  }

  // The preview "to" while hovering
  const previewTo = phase === "to" && hover && from && hover >= from ? hover : null;
  const effectiveTo = previewTo || to;

  // Build days grid
  const daysInMonth = new Date(vy, vm + 1, 0).getDate();
  const firstDow = new Date(vy, vm, 1).getDay();
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(vy, vm, d));
  // Pad to complete last row
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div ref={ref} className="relative">
      {/* Trigger row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1">
            From <span className="text-amber-400">*</span>
          </label>
          <button
            type="button"
            onClick={() => openAs("from")}
            className={`w-full px-3 py-2.5 text-sm text-left bg-zinc-900/60 border rounded-lg transition-all focus:outline-none ${
              open && phase === "from"
                ? "border-amber-500 ring-2 ring-amber-500/20"
                : "border-zinc-700 hover:border-zinc-600"
            } ${startDate ? "text-zinc-100" : "text-zinc-600"}`}
          >
            {startDate || "Select date"}
          </button>
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-400 mb-1">
            To <span className="text-amber-400">*</span>
          </label>
          <button
            type="button"
            onClick={() => openAs("to")}
            className={`w-full px-3 py-2.5 text-sm text-left bg-zinc-900/60 border rounded-lg transition-all focus:outline-none ${
              open && phase === "to"
                ? "border-amber-500 ring-2 ring-amber-500/20"
                : "border-zinc-700 hover:border-zinc-600"
            } ${endDate ? "text-zinc-100" : "text-zinc-600"}`}
          >
            {endDate || "Select date"}
          </button>
        </div>
      </div>

      {/* Calendar */}
      {open && (
        <div className="mt-2 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-4 select-none">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={prevMonth}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-zinc-700 text-zinc-500 hover:text-zinc-100 transition-colors"
            >
              <ChevronLeft size={15} />
            </button>
            <span className="text-sm font-bold text-zinc-100">
              {FULL_MONTHS[vm]} {vy}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-zinc-700 text-zinc-500 hover:text-zinc-100 transition-colors"
            >
              <ChevronRight size={15} />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-1">
            {WEEK_DAYS.map(d => (
              <div key={d} className="h-7 flex items-center justify-center text-xs font-semibold text-zinc-600">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7">
            {cells.map((date, i) => {
              if (!date) return <div key={`_${i}`} className="h-8" />;

              const isFrom = sameDay(date, from);
              const isTo = sameDay(date, effectiveTo);
              const isMid = isBetween(date, from, effectiveTo);
              const rangeActive = from && effectiveTo && !sameDay(from, effectiveTo);

              return (
                <div
                  key={date.toDateString()}
                  className="relative h-8 flex items-center justify-center cursor-pointer"
                  onMouseEnter={() => setHover(date)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => clickDay(date)}
                >
                  {/* Range stripe: full-width band for in-between days */}
                  {isMid && (
                    <div className="absolute inset-y-1 left-0 right-0 bg-amber-500/20" />
                  )}
                  {/* Right-half stripe on the From date (connects to range) */}
                  {isFrom && rangeActive && (
                    <div className="absolute inset-y-1 left-1/2 right-0 bg-amber-500/20" />
                  )}
                  {/* Left-half stripe on the To date (connects to range) */}
                  {isTo && rangeActive && (
                    <div className="absolute inset-y-1 left-0 right-1/2 bg-amber-500/20" />
                  )}

                  {/* Day number circle */}
                  <div
                    className={`relative z-10 w-7 h-7 flex items-center justify-center rounded-full text-xs font-medium transition-colors
                      ${isFrom || isTo
                        ? "bg-amber-500 text-white font-bold shadow-sm"
                        : isMid
                        ? "text-amber-200 hover:bg-amber-500/30"
                        : "text-zinc-400 hover:bg-zinc-700 hover:text-zinc-100"
                      }`}
                  >
                    {date.getDate()}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Hint */}
          <div className="mt-3 pt-3 border-t border-zinc-800 text-center">
            <p className="text-xs text-zinc-600">
              {phase === "from" ? "Click to set start date" : "Click to set end date"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
