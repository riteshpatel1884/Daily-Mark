"use client";
import { useState, useEffect, useMemo } from "react";

// ─── DEFAULTS ─────────────────────────────────────────────────────────────────
const DEFAULT_COLUMNS = [
  { id: "dsa", label: "DSA" },
  { id: "os", label: "OS" },
  { id: "dbms", label: "DBMS" },
  { id: "maths", label: "Maths" },
  { id: "cn", label: "Networks" },
  { id: "revision", label: "Revision" },
  { id: "assignment", label: "Assignment" },
  { id: "leetcode", label: "LeetCode" },
];

const DEFAULT_DONE_COLOR = "#22c55e";
const DEFAULT_UNDONE_COLOR = "#ef4444";

const PRESET_PALETTES = [
  { label: "Green / Red", done: "#22c55e", undone: "#ef4444" },
  { label: "Blue / Orange", done: "#3b82f6", undone: "#f97316" },
  { label: "Purple / Red", done: "#a855f7", undone: "#ef4444" },
  { label: "Teal / Pink", done: "#14b8a6", undone: "#ec4899" },
  { label: "Indigo / Amber", done: "#6366f1", undone: "#f59e0b" },
  { label: "Cyan / Rose", done: "#06b6d4", undone: "#f43f5e" },
];

const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function fmtDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return `${d.getDate()} ${d.toLocaleString("en", { month: "short" })}`;
}

// ─── GLOBAL COLOR SETTINGS MODAL ─────────────────────────────────────────────
function ColorSettingsModal({ doneColor, undoneColor, onSave, onClose }) {
  const [done, setDone] = useState(doneColor);
  const [undone, setUndone] = useState(undoneColor);

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
            marginBottom: 20,
          }}
        >
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "var(--txt)" }}>
              Cell Colors
            </h2>
            <p style={{ fontSize: 12, color: "var(--txt3)", marginTop: 2 }}>
              Applied to every subject in the grid
            </p>
          </div>
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

        {/* Preset palettes */}
        <div style={{ marginBottom: 20 }}>
          <div className="slabel" style={{ marginBottom: 10 }}>
            Presets
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {PRESET_PALETTES.map((p) => {
              const active = done === p.done && undone === p.undone;
              return (
                <button
                  key={p.label}
                  onClick={() => {
                    setDone(p.done);
                    setUndone(p.undone);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 14px",
                    borderRadius: 11,
                    border: `1.5px solid ${active ? "var(--txt)" : "var(--border)"}`,
                    background: active ? "var(--bg3)" : "transparent",
                    cursor: "pointer",
                    transition: "all .15s",
                  }}
                >
                  {/* color swatches */}
                  <div style={{ display: "flex", gap: 4 }}>
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 5,
                        background: p.done,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="2.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="2 6 5 9 10 3" />
                      </svg>
                    </div>
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 5,
                        background: p.undone,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <svg
                        width="9"
                        height="9"
                        viewBox="0 0 12 12"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="2.8"
                        strokeLinecap="round"
                      >
                        <line x1="3" y1="3" x2="9" y2="9" />
                        <line x1="9" y1="3" x2="3" y2="9" />
                      </svg>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: active ? 600 : 400,
                      color: "var(--txt)",
                    }}
                  >
                    {p.label}
                  </span>
                  {active && (
                    <span
                      style={{
                        marginLeft: "auto",
                        fontSize: 11,
                        color: "var(--txt3)",
                      }}
                    >
                      ✓ active
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom */}
        <div
          style={{
            background: "var(--bg3)",
            borderRadius: 12,
            padding: 14,
            marginBottom: 20,
          }}
        >
          <div className="slabel" style={{ marginBottom: 12 }}>
            Custom Colors
          </div>
          {[
            ["✓ Studied / Done", done, setDone],
            ["✗ Missed / Skipped", undone, setUndone],
          ].map(([lbl, val, set]) => (
            <div
              key={lbl}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 5,
                  background: val,
                  flexShrink: 0,
                }}
              />
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
                  width: 38,
                  height: 30,
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
                  minWidth: 52,
                }}
              >
                {val}
              </span>
            </div>
          ))}
        </div>

        {/* Preview row */}
        <div style={{ marginBottom: 20 }}>
          <div className="slabel" style={{ marginBottom: 8 }}>
            Preview
          </div>
          <div
            style={{
              display: "flex",
              gap: 4,
              alignItems: "center",
              background: "var(--bg3)",
              borderRadius: 10,
              padding: "10px 12px",
            }}
          >
            {[
              "done",
              "done",
              "undone",
              "done",
              "none",
              "undone",
              "done",
              "done",
              "none",
              "done",
            ].map((s, i) => (
              <div
                key={i}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 5,
                  flexShrink: 0,
                  background:
                    s === "done"
                      ? done
                      : s === "undone"
                        ? undone
                        : "var(--bg4)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {s === "done" && (
                  <svg
                    width="9"
                    height="9"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="2 6 5 9 10 3" />
                  </svg>
                )}
                {s === "undone" && (
                  <svg
                    width="8"
                    height="8"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                  >
                    <line x1="3" y1="3" x2="9" y2="9" />
                    <line x1="9" y1="3" x2="3" y2="9" />
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            onSave(done, undone);
            onClose();
          }}
          style={{
            width: "100%",
            padding: "13px",
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
          Apply to All Subjects
        </button>
      </div>
    </div>
  );
}

// ─── ADD COLUMN MODAL (name only) ─────────────────────────────────────────────
function AddColModal({ onAdd, onClose }) {
  const [label, setLabel] = useState("");

  const QUICK = [
    "Maths",
    "Physics",
    "Chemistry",
    "Project",
    "Internship",
    "Gym",
    "Reading",
    "OOP",
    "COA",
    "SE",
    "ML",
    "Web Dev",
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
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "var(--txt)" }}>
              Add Subject
            </h2>
            <p style={{ fontSize: 12, color: "var(--txt3)", marginTop: 2 }}>
              Colors are set globally for all subjects
            </p>
          </div>
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

        {/* Quick picks */}
        <div style={{ marginBottom: 14 }}>
          <div className="slabel" style={{ marginBottom: 8 }}>
            Quick Add
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {QUICK.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setLabel(q)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 8,
                  border: `1.5px solid ${label === q ? "var(--txt)" : "var(--border)"}`,
                  background: label === q ? "var(--bg3)" : "transparent",
                  color: label === q ? "var(--txt)" : "var(--txt2)",
                  fontFamily: "var(--font)",
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all .15s",
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div className="slabel">Custom Name</div>
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. COA, SE, ML..."
            className="inp"
            style={{ fontSize: 14 }}
            autoFocus
          />
        </div>

        <button
          onClick={() => {
            if (!label.trim()) return;
            onAdd({ id: Date.now().toString(), label: label.trim() });
            onClose();
          }}
          disabled={!label.trim()}
          style={{
            width: "100%",
            padding: "13px",
            borderRadius: 11,
            border: "none",
            background: label.trim() ? "var(--txt)" : "var(--border)",
            color: label.trim() ? "var(--bg)" : "var(--txt3)",
            fontFamily: "var(--font)",
            fontSize: 14,
            fontWeight: 700,
            cursor: label.trim() ? "pointer" : "not-allowed",
          }}
        >
          Add Subject
        </button>
      </div>
    </div>
  );
}

// ─── MAIN VIEW ────────────────────────────────────────────────────────────────
export default function HabitView() {
  const KEY = "gr_heatmap";

  const [cols, setCols] = useState(DEFAULT_COLUMNS);
  const [records, setRecords] = useState({});
  const [doneColor, setDoneColor] = useState(DEFAULT_DONE_COLOR);
  const [undoneColor, setUndoneColor] = useState(DEFAULT_UNDONE_COLOR);
  const [showColor, setShowColor] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [range, setRange] = useState(30);

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || "{}");
      if (raw.cols) setCols(raw.cols);
      if (raw.records) setRecords(raw.records);
      if (raw.doneColor) setDoneColor(raw.doneColor);
      if (raw.undoneColor) setUndoneColor(raw.undoneColor);
    } catch {}
  }, []);

  function persist(c, r, dc, uc) {
    localStorage.setItem(
      KEY,
      JSON.stringify({ cols: c, records: r, doneColor: dc, undoneColor: uc }),
    );
  }

  function toggle(dateStr, colId) {
    if (dateStr !== todayStr()) return;
    setRecords((prev) => {
      const k = `${dateStr}:${colId}`;
      const cur = prev[k];
      const next = { ...prev };
      if (!cur) next[k] = "done";
      else if (cur === "done") next[k] = "undone";
      else delete next[k];
      persist(cols, next, doneColor, undoneColor);
      return next;
    });
  }

  function saveColors(dc, uc) {
    setDoneColor(dc);
    setUndoneColor(uc);
    persist(cols, records, dc, uc);
  }

  function addCol(col) {
    setCols((prev) => {
      const next = [...prev, col];
      persist(next, records, doneColor, undoneColor);
      return next;
    });
  }

  function removeCol(id) {
    if (!confirm("Delete this subject column and all its data?")) return;
    setCols((prev) => {
      const next = prev.filter((c) => c.id !== id);
      persist(next, records, doneColor, undoneColor);
      return next;
    });
  }

  const dates = useMemo(() => {
    const today = new Date();
    return Array.from({ length: range }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (range - 1 - i));
      return d.toISOString().slice(0, 10);
    });
  }, [range]);

  const today = todayStr();

  function colStats(colId) {
    const relevant = dates.filter((d) => d <= today);
    const done = relevant.filter(
      (d) => records[`${d}:${colId}`] === "done",
    ).length;
    const missed = relevant.filter(
      (d) => records[`${d}:${colId}`] === "undone",
    ).length;
    const rate =
      relevant.length > 0 ? Math.round((done / relevant.length) * 100) : 0;
    let streak = 0;
    for (let i = relevant.length - 1; i >= 0; i--) {
      if (records[`${relevant[i]}:${colId}`] === "done") streak++;
      else break;
    }
    return { done, missed, rate, streak, total: relevant.length };
  }

  const totalDone = Object.values(records).filter((v) => v === "done").length;
  const totalMissed = Object.values(records).filter(
    (v) => v === "undone",
  ).length;
  const cellW = range === 7 ? 40 : range === 14 ? 34 : 28;

  // active preset label
  const activePreset = PRESET_PALETTES.find(
    (p) => p.done === doneColor && p.undone === undoneColor,
  );

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
        <div style={{ display: "flex", gap: 7 }}>
          {/* Color picker button */}
          <button
            onClick={() => setShowColor(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "7px 12px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--bg2)",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", gap: 3 }}>
              <div
                style={{
                  width: 13,
                  height: 13,
                  borderRadius: 3,
                  background: doneColor,
                }}
              />
              <div
                style={{
                  width: 13,
                  height: 13,
                  borderRadius: 3,
                  background: undoneColor,
                }}
              />
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "var(--txt2)",
                fontFamily: "var(--font)",
              }}
            >
              {activePreset ? activePreset.label : "Colors"}
            </span>
          </button>
          {/* Add subject */}
          <button
            onClick={() => setShowAdd(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "7px 12px",
              borderRadius: 10,
              border: "1px solid var(--border)",
              background: "var(--bg2)",
              color: "var(--txt2)",
              fontFamily: "var(--font)",
              fontSize: 12,
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
            Subject
          </button>
        </div>
      </div>
      <p style={{ fontSize: 13, color: "var(--txt3)", marginBottom: 16 }}>
        Only{" "}
        <span style={{ fontWeight: 600, color: "var(--txt)" }}>
          today's row
        </span>{" "}
        is editable · past dates are locked 🔒 · tap: studied → missed → clear
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
          { label: "Subjects", val: cols.length, color: "var(--txt)" },
          { label: "Done", val: totalDone, color: doneColor },
          { label: "Missed", val: totalMissed, color: undoneColor },
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
                color: s.color,
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

      {/* ── GRID ── */}
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
            minWidth: cols.length * cellW + 180,
          }}
        >
          {/* Column headers */}
          <thead>
            <tr>
              <th
                style={{
                  width: 96,
                  minWidth: 96,
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

              {cols.map((col) => {
                const st = colStats(col.id);
                return (
                  <th
                    key={col.id}
                    style={{
                      padding: "8px 2px",
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
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: "var(--txt)",
                          letterSpacing: ".02em",
                          maxWidth: cellW - 4,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          textAlign: "center",
                          lineHeight: 1.2,
                        }}
                      >
                        {col.label}
                      </div>
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
                      {/* delete button */}
                      <button
                        onClick={() => removeCol(col.id)}
                        title={`Delete ${col.label}`}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: "1px 3px",
                          color: "var(--red)",
                          fontSize: 11,
                          opacity: 0.35,
                          lineHeight: 1,
                          transition: "opacity .15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.opacity = 1)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.opacity = 0.35)
                        }
                      >
                        ×
                      </button>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* Rows */}
          <tbody>
            {dates.map((dateStr, rowIdx) => {
              const d = new Date(dateStr + "T00:00:00");
              const isToday = dateStr === today;
              const isFuture = dateStr > today;
              const isPastDay = dateStr < today;
              const isWeekend = d.getDay() === 0 || d.getDay() === 6;
              const dayName = DAYS_SHORT[d.getDay()];

              return (
                <tr
                  key={dateStr}
                  style={{
                    background: isToday
                      ? `${doneColor}10`
                      : rowIdx % 2 === 0
                        ? "var(--bg2)"
                        : "var(--bg3)",
                  }}
                >
                  {/* Date label */}
                  <td
                    style={{
                      padding: "4px 8px 4px 12px",
                      borderRight: "1px solid var(--border)",
                      borderBottom: "1px solid var(--border)",
                      position: "sticky",
                      left: 0,
                      zIndex: 1,
                      whiteSpace: "nowrap",
                      background: isToday
                        ? `${doneColor}10`
                        : rowIdx % 2 === 0
                          ? "var(--bg2)"
                          : "var(--bg3)",
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
                          style={{
                            fontFamily: "var(--mono)",
                            fontSize: 11,
                            fontWeight: isToday ? 700 : 400,
                            color: isToday ? "var(--txt)" : "var(--txt2)",
                          }}
                        >
                          {fmtDate(dateStr)}
                        </span>
                        <span
                          style={{
                            fontSize: 10,
                            color: isToday
                              ? doneColor
                              : isWeekend
                                ? "var(--txt2)"
                                : "var(--txt3)",
                            marginLeft: 5,
                            fontWeight: isToday ? 700 : 400,
                          }}
                        >
                          {isToday ? "Today" : dayName}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Subject cells */}
                  {cols.map((col) => {
                    const k = `${dateStr}:${col.id}`;
                    const status = records[k];
                    const locked = isPastDay || isFuture;
                    const bg = isFuture
                      ? "transparent"
                      : status === "done"
                        ? doneColor
                        : status === "undone"
                          ? undoneColor
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
                              : isPastDay
                                ? "🔒 Past dates are locked"
                                : status === "done"
                                  ? "Studied ✓ — tap to change"
                                  : status === "undone"
                                    ? "Missed ✗ — tap to change"
                                    : "Tap to mark today"
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
                            opacity: isPastDay ? (status ? 0.6 : 0.25) : 1,
                            margin: "0 auto",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "filter .1s, transform .1s",
                          }}
                          onMouseEnter={(e) => {
                            if (!locked) {
                              e.currentTarget.style.filter = "brightness(1.15)";
                              e.currentTarget.style.transform = "scale(1.1)";
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

          {/* Streak footer */}
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
                        color: st.streak > 0 ? doneColor : "var(--txt3)",
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
          { bg: doneColor, icon: "✓", label: "Studied" },
          { bg: undoneColor, icon: "✗", label: "Missed" },
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
              <span style={{ fontSize: 9, color: "#fff", fontWeight: 700 }}>
                {l.icon}
              </span>
            </div>
            <span style={{ fontSize: 11, color: "var(--txt3)" }}>
              {l.label}
            </span>
          </div>
        ))}
        <div
          style={{
            flex: 1,
            textAlign: "right",
            fontSize: 11,
            color: "var(--txt3)",
          }}
        >
          Tap color button to change theme
        </div>
      </div>

      {/* Modals */}
      {showColor && (
        <ColorSettingsModal
          doneColor={doneColor}
          undoneColor={undoneColor}
          onSave={saveColors}
          onClose={() => setShowColor(false)}
        />
      )}
      {showAdd && (
        <AddColModal onAdd={addCol} onClose={() => setShowAdd(false)} />
      )}
    </div>
  );
}
