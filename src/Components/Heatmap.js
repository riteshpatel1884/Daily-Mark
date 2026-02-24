"use client";
import { useState, useEffect, useMemo } from "react";

// ─── BTECH DEFAULT COLUMNS ────────────────────────────────────────────────────
const DEFAULT_COLUMNS = [
  { id: "dsa", label: "DSA", doneColor: "#22c55e", undoneColor: "#ef4444" },
  { id: "os", label: "OS", doneColor: "#3b82f6", undoneColor: "#ef4444" },
  { id: "dbms", label: "DBMS", doneColor: "#a855f7", undoneColor: "#ef4444" },
  { id: "maths", label: "Maths", doneColor: "#f59e0b", undoneColor: "#ef4444" },
  { id: "cn", label: "Networks", doneColor: "#14b8a6", undoneColor: "#ef4444" },
  {
    id: "revision",
    label: "Revision",
    doneColor: "#6366f1",
    undoneColor: "#ef4444",
  },
  {
    id: "assignment",
    label: "Assignment",
    doneColor: "#ec4899",
    undoneColor: "#ef4444",
  },
  {
    id: "leetcode",
    label: "LeetCode",
    doneColor: "#f97316",
    undoneColor: "#ef4444",
  },
];

const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function getLast30Days() {
  const dates = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

function fmtDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return `${d.getDate()} ${d.toLocaleString("en", { month: "short" })}`;
}

// ─── COLOR PICKER MODAL ───────────────────────────────────────────────────────
function EditColModal({ col, onSave, onClose }) {
  const [label, setLabel] = useState(col.label);
  const [doneColor, setDoneColor] = useState(col.doneColor);
  const [undoneColor, setUndoneColor] = useState(col.undoneColor);

  return (
    <div
      className="overlay fadeIn"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="sheet">
        <div className="drag-handle" />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 18,
          }}
        >
          <h2 style={{ fontSize: 17, fontWeight: 700, color: "var(--txt)" }}>
            Edit Column
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "var(--bg4)",
              border: "none",
              borderRadius: 8,
              width: 28,
              height: 28,
              cursor: "pointer",
              color: "var(--txt2)",
              fontSize: 17,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <div className="slabel">Subject / Task Name</div>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="inp"
              style={{ fontSize: 15, fontWeight: 600 }}
            />
          </div>
          <div
            style={{
              background: "var(--bg3)",
              borderRadius: 12,
              padding: 14,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div className="slabel">Colors</div>
            {[
              ["✓ Done (studied)", doneColor, setDoneColor],
              ["✗ Missed", undoneColor, setUndoneColor],
            ].map(([lbl, val, set]) => (
              <div
                key={lbl}
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                <span
                  style={{
                    flex: 1,
                    fontSize: 13,
                    color: "var(--txt2)",
                    fontWeight: 500,
                  }}
                >
                  {lbl}
                </span>
                <input
                  type="color"
                  value={val}
                  onChange={(e) => set(e.target.value)}
                  style={{
                    width: 36,
                    height: 28,
                    border: "1px solid var(--border)",
                    borderRadius: 7,
                    cursor: "pointer",
                    padding: 2,
                    background: "none",
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: "var(--mono)",
                    color: "var(--txt3)",
                    minWidth: 54,
                  }}
                >
                  {val}
                </span>
              </div>
            ))}
          </div>
          {/* Preview */}
          <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
            <span
              style={{ fontSize: 11, color: "var(--txt3)", marginRight: 4 }}
            >
              Preview:
            </span>
            {["done", "done", "undone", "done", "none", "done", "undone"].map(
              (s, i) => (
                <div
                  key={i}
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 4,
                    background:
                      s === "done"
                        ? doneColor
                        : s === "undone"
                          ? undoneColor
                          : "var(--bg4)",
                    border: "1px solid var(--border)",
                  }}
                />
              ),
            )}
          </div>
          <button
            onClick={() => {
              onSave({ ...col, label, doneColor, undoneColor });
              onClose();
            }}
            style={{
              padding: "12px",
              borderRadius: 11,
              border: "none",
              background: "var(--txt)",
              color: "var(--bg)",
              fontFamily: "var(--font)",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ADD COLUMN MODAL ─────────────────────────────────────────────────────────
function AddColModal({ onAdd, onClose }) {
  const [label, setLabel] = useState("");
  const [doneColor, setDoneColor] = useState("#22c55e");
  const [undoneColor, setUndoneColor] = useState("#ef4444");

  const QUICK = [
    { l: "Maths", dc: "#f59e0b", uc: "#ef4444" },
    { l: "Physics", dc: "#3b82f6", uc: "#ef4444" },
    { l: "Project", dc: "#a855f7", uc: "#ef4444" },
    { l: "Internship", dc: "#14b8a6", uc: "#ef4444" },
    { l: "Gym", dc: "#22c55e", uc: "#94a3b8" },
    { l: "Reading", dc: "#f97316", uc: "#ef4444" },
  ];

  return (
    <div
      className="overlay fadeIn"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="sheet">
        <div className="drag-handle" />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <h2 style={{ fontSize: 17, fontWeight: 700, color: "var(--txt)" }}>
            Add Column
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "var(--bg4)",
              border: "none",
              borderRadius: 8,
              width: 28,
              height: 28,
              cursor: "pointer",
              color: "var(--txt2)",
              fontSize: 17,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Quick picks */}
          <div>
            <div className="slabel" style={{ marginBottom: 8 }}>
              Quick Add
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {QUICK.map((q) => (
                <button
                  key={q.l}
                  type="button"
                  onClick={() => {
                    setLabel(q.l);
                    setDoneColor(q.dc);
                    setUndoneColor(q.uc);
                  }}
                  style={{
                    padding: "5px 12px",
                    borderRadius: 8,
                    border: `1.5px solid ${label === q.l ? "var(--txt)" : "var(--border)"}`,
                    background:
                      label === q.l ? "var(--accent-dim)" : "transparent",
                    color: "var(--txt2)",
                    fontFamily: "var(--font)",
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  {q.l}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="slabel">Custom Name</div>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Web Dev, ML, OOP"
              className="inp"
              style={{ fontSize: 14 }}
              autoFocus
            />
          </div>
          <div
            style={{
              background: "var(--bg3)",
              borderRadius: 12,
              padding: 14,
              display: "flex",
              flexDirection: "column",
              gap: 11,
            }}
          >
            <div className="slabel">Colors</div>
            {[
              ["✓ Done", doneColor, setDoneColor],
              ["✗ Missed", undoneColor, setUndoneColor],
            ].map(([lbl, val, set]) => (
              <div
                key={lbl}
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                <span
                  style={{
                    flex: 1,
                    fontSize: 13,
                    color: "var(--txt2)",
                    fontWeight: 500,
                  }}
                >
                  {lbl}
                </span>
                <input
                  type="color"
                  value={val}
                  onChange={(e) => set(e.target.value)}
                  style={{
                    width: 36,
                    height: 28,
                    border: "1px solid var(--border)",
                    borderRadius: 7,
                    cursor: "pointer",
                    padding: 2,
                    background: "none",
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: "var(--mono)",
                    color: "var(--txt3)",
                    minWidth: 54,
                  }}
                >
                  {val}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              if (!label.trim()) return;
              onAdd({
                id: Date.now().toString(),
                label: label.trim(),
                doneColor,
                undoneColor,
              });
              onClose();
            }}
            style={{
              padding: "12px",
              borderRadius: 11,
              border: "none",
              background: "var(--txt)",
              color: "var(--bg)",
              fontFamily: "var(--font)",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Add Column
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN VIEW ────────────────────────────────────────────────────────────────
export default function HabitView() {
  const KEY = "gr_heatmap";

  const [cols, setCols] = useState(DEFAULT_COLUMNS);
  const [records, setRecords] = useState({}); // { 'dateStr:colId': 'done'|'undone' }
  const [editCol, setEditCol] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [range, setRange] = useState(30); // 7 | 14 | 30

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || "{}");
      if (raw.cols) setCols(raw.cols);
      if (raw.records) setRecords(raw.records);
    } catch {}
  }, []);

  function persist(c, r) {
    localStorage.setItem(KEY, JSON.stringify({ cols: c, records: r }));
  }

  function toggle(dateStr, colId) {
    if (dateStr !== todayStr()) return; // only today is editable
    setRecords((prev) => {
      const k = `${dateStr}:${colId}`;
      const cur = prev[k];
      const next = { ...prev };
      // cycle: empty → done → undone → empty
      if (!cur) next[k] = "done";
      else if (cur === "done") next[k] = "undone";
      else delete next[k];
      persist(cols, next);
      return next;
    });
  }

  function saveCol(updated) {
    setCols((prev) => {
      const next = prev.map((c) => (c.id === updated.id ? updated : c));
      persist(next, records);
      return next;
    });
  }

  function addCol(col) {
    setCols((prev) => {
      const next = [...prev, col];
      persist(next, records);
      return next;
    });
  }

  function removeCol(id) {
    if (!confirm("Delete this subject column and all its data?")) return;
    setCols((prev) => {
      const next = prev.filter((c) => c.id !== id);
      persist(next, records);
      return next;
    });
  }

  function clearRow(dateStr) {
    if (!confirm(`Clear all entries for ${fmtDate(dateStr)}?`)) return;
    setRecords((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((k) => {
        if (k.startsWith(dateStr + ":")) delete next[k];
      });
      persist(cols, next);
      return next;
    });
  }

  const dates = useMemo(() => {
    const today = new Date();
    const arr = [];
    for (let i = range - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      arr.push(d.toISOString().slice(0, 10));
    }
    return arr;
  }, [range]);

  const today = todayStr();

  // Stats per column
  function colStats(colId) {
    const relevant = dates.filter((d) => d <= today);
    const done = relevant.filter(
      (d) => records[`${d}:${colId}`] === "done",
    ).length;
    const missed = relevant.filter(
      (d) => records[`${d}:${colId}`] === "undone",
    ).length;
    const empty = relevant.length - done - missed;
    const rate =
      relevant.length > 0 ? Math.round((done / relevant.length) * 100) : 0;
    // streak
    let streak = 0;
    for (let i = relevant.length - 1; i >= 0; i--) {
      if (records[`${relevant[i]}:${colId}`] === "done") streak++;
      else break;
    }
    return { done, missed, empty, rate, streak, total: relevant.length };
  }

  const totalCells = dates.filter((d) => d <= today).length * cols.length;
  const totalDone = Object.values(records).filter((v) => v === "done").length;
  const totalMissed = Object.values(records).filter(
    (v) => v === "undone",
  ).length;
  const overallRate =
    totalCells > 0
      ? Math.round(((totalDone + totalMissed) / totalCells) * 100)
      : 0;

  // Cell size responsive
  const cellW = range === 7 ? 38 : range === 14 ? 32 : 26;

  return (
    <div className="page">
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 4,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: "-.03em",
              color: "var(--txt)",
            }}
          >
            Study Heatmap
          </h1>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "8px 13px",
            borderRadius: 10,
            border: "1px solid var(--border)",
            background: "var(--bg2)",
            color: "var(--txt2)",
            fontFamily: "var(--font)",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Column
        </button>
      </div>
      <p style={{ fontSize: 13, color: "var(--txt3)", marginBottom: 16 }}>
        Only today's row is editable · past dates are locked 🔒 · tap to cycle:
        studied → missed → clear
      </p>

      {/* Summary cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 8,
          marginBottom: 16,
        }}
      >
        {[
          {
            label: "Logged",
            val: `${totalDone + totalMissed}`,
            sub: "entries",
          },
          { label: "Done", val: totalDone, sub: "sessions", color: "#22c55e" },
          { label: "Missed", val: totalMissed, sub: "days", color: "#ef4444" },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "var(--bg2)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: "11px 10px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: "-.03em",
                color: s.color || "var(--txt)",
              }}
            >
              {s.val}
            </div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: ".05em",
                textTransform: "uppercase",
                color: "var(--txt3)",
                marginTop: 1,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Range pills */}
      <div style={{ display: "flex", gap: 5, marginBottom: 16 }}>
        {[7, 14, 30].map((n) => (
          <button
            key={n}
            onClick={() => setRange(n)}
            style={{
              padding: "5px 14px",
              borderRadius: 99,
              border: `1px solid ${range === n ? "transparent" : "var(--border)"}`,
              background: range === n ? "var(--txt)" : "transparent",
              color: range === n ? "var(--bg)" : "var(--txt2)",
              fontFamily: "var(--font)",
              fontSize: 12,
              fontWeight: 500,
              cursor: "pointer",
              transition: "all .15s",
            }}
          >
            Last {n} days
          </button>
        ))}
      </div>

      {/* ── GRID TABLE ── */}
      <div
        style={{
          overflowX: "auto",
          borderRadius: 14,
          border: "1px solid var(--border)",
          background: "var(--bg2)",
        }}
      >
        <table
          style={{
            borderCollapse: "collapse",
            width: "100%",
            minWidth: cols.length * cellW + 160,
          }}
        >
          {/* Column headers */}
          <thead>
            <tr>
              {/* Date label column */}
              <th
                style={{
                  width: 88,
                  minWidth: 88,
                  padding: "10px 12px",
                  textAlign: "left",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: ".07em",
                  textTransform: "uppercase",
                  color: "var(--txt3)",
                  background: "var(--bg3)",
                  borderBottom: "1px solid var(--border)",
                  borderRight: "1px solid var(--border)",
                  position: "sticky",
                  left: 0,
                  zIndex: 2,
                }}
              >
                Date
              </th>

              {/* Subject columns */}
              {cols.map((col) => {
                const st = colStats(col.id);
                return (
                  <th
                    key={col.id}
                    style={{
                      padding: "8px 4px",
                      textAlign: "center",
                      background: "var(--bg3)",
                      borderBottom: "1px solid var(--border)",
                      borderRight: "1px solid var(--border)",
                      minWidth: cellW,
                      width: cellW,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 3,
                      }}
                    >
                      {/* color dots */}
                      <div style={{ display: "flex", gap: 2 }}>
                        <div
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: 2,
                            background: col.doneColor,
                          }}
                        />
                        <div
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: 2,
                            background: col.undoneColor,
                          }}
                        />
                      </div>
                      {/* name — click to edit */}
                      <button
                        onClick={() => setEditCol(col)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: 0,
                          fontSize: 10,
                          fontWeight: 700,
                          color: "var(--txt)",
                          letterSpacing: ".02em",
                          textAlign: "center",
                          lineHeight: 1.2,
                          maxWidth: cellW - 4,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                        title={`Click to edit colors · ${st.rate}% done`}
                      >
                        {col.label}
                      </button>
                      {/* rate + delete */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 3,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 9,
                            fontFamily: "var(--mono)",
                            color: "var(--txt3)",
                            fontWeight: 600,
                          }}
                        >
                          {st.rate}%
                        </div>
                        <button
                          onClick={() => removeCol(col.id)}
                          title={`Delete ${col.label}`}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: "0 2px",
                            color: "var(--red)",
                            fontSize: 11,
                            lineHeight: 1,
                            opacity: 0.45,
                            display: "flex",
                            alignItems: "center",
                            transition: "opacity .15s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.opacity = 1)
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.opacity = 0.45)
                          }
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Date rows */}
          <tbody>
            {dates.map((dateStr, rowIdx) => {
              const d = new Date(dateStr + "T00:00:00");
              const isToday = dateStr === today;
              const isFuture = dateStr > today;
              const isWeekend = d.getDay() === 0 || d.getDay() === 6;
              const dayName = DAYS_SHORT[d.getDay()];

              return (
                <tr
                  key={dateStr}
                  style={{
                    background: isToday
                      ? "var(--accent-dim)"
                      : rowIdx % 2 === 0
                        ? "var(--bg2)"
                        : "var(--bg3)",
                  }}
                >
                  {/* Date cell */}
                  <td
                    style={{
                      padding: "4px 8px 4px 12px",
                      fontSize: 12,
                      fontWeight: isToday ? 700 : 400,
                      color: isToday
                        ? "var(--txt)"
                        : isWeekend
                          ? "var(--txt2)"
                          : "var(--txt2)",
                      borderRight: "1px solid var(--border)",
                      borderBottom: "1px solid var(--border)",
                      position: "sticky",
                      left: 0,
                      zIndex: 1,
                      background: isToday
                        ? "var(--accent-dim)"
                        : rowIdx % 2 === 0
                          ? "var(--bg2)"
                          : "var(--bg3)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 4,
                      }}
                    >
                      <div>
                        <span
                          style={{ fontFamily: "var(--mono)", fontSize: 11 }}
                        >
                          {fmtDate(dateStr)}
                        </span>
                        <span
                          style={{
                            fontSize: 10,
                            color: isToday ? "var(--txt)" : "var(--txt3)",
                            marginLeft: 5,
                            fontWeight: isToday ? 700 : 400,
                          }}
                        >
                          {isToday ? "Today" : dayName}
                        </span>
                      </div>
                      {/* Delete row — clear all entries for this date */}
                      {!isFuture &&
                        Object.keys(records).some((k) =>
                          k.startsWith(dateStr + ":"),
                        ) && (
                          <button
                            onClick={() => clearRow(dateStr)}
                            title={`Clear all entries for ${fmtDate(dateStr)}`}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              padding: "2px 3px",
                              color: "var(--red)",
                              fontSize: 12,
                              lineHeight: 1,
                              opacity: 0.4,
                              display: "flex",
                              alignItems: "center",
                              flexShrink: 0,
                              transition: "opacity .15s",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.opacity = 1)
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.opacity = 0.4)
                            }
                          >
                            <svg
                              width="11"
                              height="11"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                            >
                              <polyline points="3 6 5 6 21 6" />
                              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                              <path d="M10 11v6M14 11v6" />
                              <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                            </svg>
                          </button>
                        )}
                    </div>
                  </td>

                  {/* Subject cells */}
                  {cols.map((col) => {
                    const k = `${dateStr}:${col.id}`;
                    const status = records[k];
                    const isPast = dateStr < today;
                    const locked = isPast || isFuture;
                    const bg = isFuture
                      ? "transparent"
                      : status === "done"
                        ? col.doneColor
                        : status === "undone"
                          ? col.undoneColor
                          : "var(--bg4)";

                    return (
                      <td
                        key={col.id}
                        style={{
                          padding: 3,
                          textAlign: "center",
                          borderRight: "1px solid var(--border)",
                          borderBottom: "1px solid var(--border)",
                        }}
                      >
                        <div
                          onClick={() => !locked && toggle(dateStr, col.id)}
                          title={
                            isFuture
                              ? "Future — not yet"
                              : isPast
                                ? "🔒 Past dates are locked"
                                : status === "done"
                                  ? `${col.label}: Done — tap to change`
                                  : status === "undone"
                                    ? `${col.label}: Missed — tap to change`
                                    : `Mark ${col.label} for today`
                          }
                          style={{
                            width: cellW - 6,
                            height: cellW - 6,
                            borderRadius: 5,
                            background: bg,
                            border: isToday
                              ? "2px solid var(--txt)"
                              : "1px solid transparent",
                            cursor: locked ? "not-allowed" : "pointer",
                            opacity: isPast ? (status ? 0.55 : 0.28) : 1,
                            margin: "0 auto",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "filter .1s, transform .1s",
                          }}
                          onMouseEnter={(e) => {
                            if (!locked) {
                              e.currentTarget.style.filter = "brightness(1.15)";
                              e.currentTarget.style.transform = "scale(1.12)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.filter = "";
                            e.currentTarget.style.transform = "";
                          }}
                        >
                          {!isFuture && status === "done" && (
                            <svg
                              width="9"
                              height="9"
                              viewBox="0 0 12 12"
                              fill="none"
                              stroke="#fff"
                              strokeWidth="2.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              style={{ opacity: 0.9 }}
                            >
                              <polyline points="2 6 5 9 10 3" />
                            </svg>
                          )}
                          {!isFuture && status === "undone" && (
                            <svg
                              width="8"
                              height="8"
                              viewBox="0 0 12 12"
                              fill="none"
                              stroke="#fff"
                              strokeWidth="2.8"
                              strokeLinecap="round"
                              style={{ opacity: 0.9 }}
                            >
                              <line x1="3" y1="3" x2="9" y2="9" />
                              <line x1="9" y1="3" x2="3" y2="9" />
                            </svg>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>

          {/* Footer — streak row */}
          <tfoot>
            <tr>
              <td
                style={{
                  padding: "8px 12px",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: ".06em",
                  textTransform: "uppercase",
                  color: "var(--txt3)",
                  background: "var(--bg3)",
                  borderTop: "1px solid var(--border)",
                  position: "sticky",
                  left: 0,
                  zIndex: 1,
                }}
              >
                Streak 🔥
              </td>
              {cols.map((col) => {
                const st = colStats(col.id);
                return (
                  <td
                    key={col.id}
                    style={{
                      padding: "6px 2px",
                      textAlign: "center",
                      background: "var(--bg3)",
                      borderTop: "1px solid var(--border)",
                      borderRight: "1px solid var(--border)",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: 11,
                        fontWeight: 700,
                        color: st.streak > 0 ? col.doneColor : "var(--txt3)",
                      }}
                    >
                      {st.streak > 0 ? `${st.streak}d` : "–"}
                    </div>
                  </td>
                );
              })}
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          gap: 14,
          marginTop: 12,
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {[
          { bg: "#22c55e", icon: "✓", label: "Studied / Done" },
          { bg: "#ef4444", icon: "✗", label: "Missed" },
          { bg: "var(--bg4)", icon: "", label: "Not logged" },
        ].map((l) => (
          <div
            key={l.label}
            style={{ display: "flex", alignItems: "center", gap: 5 }}
          >
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: 4,
                background: l.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontSize: 9,
                  color: "#fff",
                  fontWeight: 700,
                  lineHeight: 1,
                }}
              >
                {l.icon}
              </span>
            </div>
            <span style={{ fontSize: 11, color: "var(--txt3)" }}>
              {l.label}
            </span>
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 4,
              border: "2px solid var(--txt)",
              background: "var(--bg4)",
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: 11, color: "var(--txt3)" }}>Today</span>
        </div>
        <div
          style={{
            flex: 1,
            textAlign: "right",
            fontSize: 11,
            color: "var(--txt3)",
          }}
        >
          Tap column name to edit colors
        </div>
      </div>

      {/* Modals */}
      {editCol && (
        <EditColModal
          col={editCol}
          onSave={saveCol}
          onClose={() => setEditCol(null)}
        />
      )}
      {showAdd && (
        <AddColModal onAdd={addCol} onClose={() => setShowAdd(false)} />
      )}
    </div>
  );
}
