"use client";
import { useState, useEffect, useMemo } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const DEFAULT_COLUMNS = [
  { id: "dsa", label: "DSA" },
  { id: "webdev", label: "Web Dev" },
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
const DAYS_FULL = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// ─── DATE HELPERS ─────────────────────────────────────────────────────────────
function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function offsetDate(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function isEditable(dateStr) {
  const diffHours = (Date.now() - new Date(dateStr + "T00:00:00")) / 3600000;
  return diffHours >= 0 && diffHours < 48;
}

function fmtDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return `${d.getDate()} ${d.toLocaleString("en", { month: "short" })}`;
}

function fmtDateLong(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function getConsistencyMessage(rate) {
  if (rate >= 90) return { text: `${rate}% consistency 🏆`, tone: "great" };
  if (rate >= 75)
    return { text: `${rate}% consistency — almost elite`, tone: "good" };
  if (rate >= 60)
    return { text: `${rate}% consistency — room to grow`, tone: "mid" };
  if (rate >= 40)
    return { text: `${rate}% consistency — barely showing up`, tone: "bad" };
  if (rate > 0)
    return { text: `${rate}% consistency — are you even trying?`, tone: "bad" };
  return { text: `Nothing logged yet — start today`, tone: "mid" };
}

function autoMarkMissed(records, cols, trackingStartDate) {
  const updated = { ...records };
  let changed = false;
  cols.forEach((col) => {
    for (let i = 1; i <= 60; i++) {
      const ds = offsetDate(-i);
      if (ds < trackingStartDate) break;
      const k = `${ds}:${col.id}`;
      if (!updated[k]) {
        updated[k] = "undone";
        changed = true;
      }
    }
  });
  return { updated, changed };
}

// ─── SHARED ───────────────────────────────────────────────────────────────────
const closeBtn = {
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
};

function Swatch({ color, icon }) {
  return (
    <div
      style={{
        width: 22,
        height: 22,
        borderRadius: 5,
        background: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icon === "check" ? (
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
      ) : (
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
      )}
    </div>
  );
}

// ─── ONBOARDING ───────────────────────────────────────────────────────────────
function OnboardingModal({ onConfirm }) {
  const today = todayStr();
  const [startDate, setStartDate] = useState(today);

  const thisMonday = (() => {
    const d = new Date();
    const day = d.getDay();
    d.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
    return d.toISOString().slice(0, 10);
  })();

  const opts = [
    { label: "Today", value: today },
    { label: "Yesterday", value: offsetDate(-1) },
    { label: "This Monday", value: thisMonday },
  ];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--bg)",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: `linear-gradient(90deg, ${DEFAULT_DONE_COLOR}, #3b82f6, #a855f7)`,
        }}
      />
      <div
        style={{
          maxWidth: 380,
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 16,
            background: `${DEFAULT_DONE_COLOR}20`,
            border: `1.5px solid ${DEFAULT_DONE_COLOR}40`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
            fontSize: 24,
          }}
        >
          📅
        </div>
        <h1
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: "var(--txt)",
            letterSpacing: "-.03em",
            marginBottom: 6,
            lineHeight: 1.15,
          }}
        >
          When do you want
          <br />
          to start tracking?
        </h1>
        <p
          style={{
            fontSize: 14,
            color: "var(--txt3)",
            marginBottom: 28,
            lineHeight: 1.6,
          }}
        >
          Only days{" "}
          <strong style={{ color: "var(--txt2)" }}>
            from this date forward
          </strong>{" "}
          will count.
          <br />
          Nothing before it will be marked missed.
        </p>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {opts.map((o) => (
            <button
              key={o.label}
              onClick={() => setStartDate(o.value)}
              style={{
                flex: 1,
                padding: "10px 8px",
                borderRadius: 10,
                border: `1.5px solid ${startDate === o.value ? DEFAULT_DONE_COLOR : "var(--border)"}`,
                background:
                  startDate === o.value
                    ? `${DEFAULT_DONE_COLOR}18`
                    : "var(--bg2)",
                color:
                  startDate === o.value ? DEFAULT_DONE_COLOR : "var(--txt2)",
                fontFamily: "var(--font)",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all .15s",
              }}
            >
              {o.label}
            </button>
          ))}
        </div>
        <div style={{ marginBottom: 8 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: ".07em",
              textTransform: "uppercase",
              color: "var(--txt3)",
              marginBottom: 8,
            }}
          >
            Custom Date
          </div>
          <input
            type="date"
            value={startDate}
            max={today}
            onChange={(e) => setStartDate(e.target.value)}
            style={{
              width: "100%",
              padding: "11px 14px",
              borderRadius: 11,
              border: "1.5px solid var(--border)",
              background: "var(--bg2)",
              color: "var(--txt)",
              fontFamily: "var(--font)",
              fontSize: 14,
              boxSizing: "border-box",
              outline: "none",
              cursor: "pointer",
            }}
          />
        </div>
        <div
          style={{
            marginBottom: 24,
            padding: "10px 14px",
            borderRadius: 10,
            background: "var(--bg3)",
            border: "1px solid var(--border)",
          }}
        >
          <span style={{ fontSize: 13, color: "var(--txt3)" }}>
            Tracking starts:{" "}
          </span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--txt)" }}>
            {startDate ? fmtDateLong(startDate) : "—"}
          </span>
        </div>
        <button
          onClick={() => onConfirm(startDate)}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: 12,
            border: "none",
            background: `linear-gradient(135deg, ${DEFAULT_DONE_COLOR}, #16a34a)`,
            color: "#fff",
            fontFamily: "var(--font)",
            fontSize: 15,
            fontWeight: 800,
            cursor: "pointer",
            letterSpacing: "-.01em",
            boxShadow: `0 4px 20px ${DEFAULT_DONE_COLOR}40`,
          }}
        >
          Start Tracking →
        </button>
        <p
          style={{
            fontSize: 11,
            color: "var(--txt3)",
            textAlign: "center",
            marginTop: 14,
            lineHeight: 1.5,
          }}
        >
          You can always see this date in settings.
          <br />
          It cannot be changed once set.
        </p>
      </div>
    </div>
  );
}

// ─── COLOR SETTINGS MODAL ─────────────────────────────────────────────────────
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
          <button onClick={onClose} style={closeBtn}>
            ×
          </button>
        </div>
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
                  <div style={{ display: "flex", gap: 4 }}>
                    <Swatch color={p.done} icon="check" />
                    <Swatch color={p.undone} icon="x" />
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

// ─── ADD COLUMN MODAL ─────────────────────────────────────────────────────────
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
          <button onClick={onClose} style={closeBtn}>
            ×
          </button>
        </div>
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

// ─── CELL NOTE MODAL ──────────────────────────────────────────────────────────
function CellNoteModal({ dateStr, colLabel, note, onSave, onClose }) {
  const [duration, setDuration] = useState(note?.duration || "");
  const [topic, setTopic] = useState(note?.topic || "");
  const [text, setText] = useState(note?.text || "");
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
            marginBottom: 4,
          }}
        >
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "var(--txt)" }}>
              {colLabel}
            </h2>
            <p style={{ fontSize: 12, color: "var(--txt3)", marginTop: 2 }}>
              {fmtDate(dateStr)} — session details
            </p>
          </div>
          <button onClick={onClose} style={closeBtn}>
            ×
          </button>
        </div>
        <div
          style={{ height: 1, background: "var(--border)", margin: "14px 0" }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <div className="slabel" style={{ marginBottom: 6 }}>
              Duration
            </div>
            <input
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g. 45 min, 1.5 hr"
              className="inp"
              style={{ fontSize: 14 }}
            />
          </div>
          <div>
            <div className="slabel" style={{ marginBottom: 6 }}>
              Topic / Chapter
            </div>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Binary Trees, Chapter 4"
              className="inp"
              style={{ fontSize: 14 }}
            />
          </div>
          <div>
            <div className="slabel" style={{ marginBottom: 6 }}>
              Note{" "}
              <span style={{ fontWeight: 400, color: "var(--txt3)" }}>
                (optional)
              </span>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What did you learn? What was hard?"
              rows={3}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid var(--border)",
                background: "var(--bg3)",
                color: "var(--txt)",
                fontFamily: "var(--font)",
                fontSize: 13,
                resize: "vertical",
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 18 }}>
          <button
            onClick={() => {
              onSave({ duration, topic, text });
              onClose();
            }}
            style={{
              flex: 1,
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
            Save Note
          </button>
          {note && (
            <button
              onClick={() => {
                onSave(null);
                onClose();
              }}
              style={{
                padding: "12px 16px",
                borderRadius: 11,
                border: "1px solid var(--border)",
                background: "transparent",
                color: "var(--red)",
                fontFamily: "var(--font)",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── WEEKLY SUMMARY MODAL ─────────────────────────────────────────────────────
function WeeklySummaryModal({
  cols,
  records,
  doneColor,
  undoneColor,
  trackingStartDate,
  onClose,
}) {
  const today = todayStr();
  const allDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => offsetDate(-(6 - i))),
    [],
  );
  const validDays = allDays.filter((d) => d >= trackingStartDate && d <= today);

  const activeDays = validDays.filter((d) =>
    cols.some((c) => records[`${d}:${c.id}`] === "done"),
  ).length;
  const totalSessions = validDays.reduce(
    (acc, d) =>
      acc + cols.filter((c) => records[`${d}:${c.id}`] === "done").length,
    0,
  );

  const subjectRates = cols
    .map((col) => {
      const done = validDays.filter(
        (d) => records[`${d}:${col.id}`] === "done",
      ).length;
      return {
        ...col,
        rate:
          validDays.length > 0
            ? Math.round((done / validDays.length) * 100)
            : 0,
      };
    })
    .sort((a, b) => b.rate - a.rate);

  const dayScores = allDays
    .map((d) => ({
      d,
      name: DAYS_FULL[new Date(d + "T00:00:00").getDay()],
      score:
        d >= trackingStartDate && d <= today
          ? cols.filter((c) => records[`${d}:${c.id}`] === "done").length
          : null,
      untracked: d < trackingStartDate || d > today,
    }))
    .sort((a, b) => (b.score || 0) - (a.score || 0));

  const bestDay = dayScores.find((x) => x.score > 0);

  return (
    <div
      className="overlay fadeIn"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="sheet">
        <div className="drag-handle" />
        <div style={{ marginBottom: 4 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              color: "var(--txt3)",
            }}
          >
            Weekly Reflection
          </div>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "var(--txt)",
              marginTop: 2,
            }}
          >
            This Week
          </h2>
        </div>
        <div
          style={{ height: 1, background: "var(--border)", margin: "14px 0" }}
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            marginBottom: 16,
          }}
        >
          {[
            {
              label: `Active Days`,
              val: `${activeDays}/${validDays.length}`,
              color:
                activeDays >= Math.ceil(validDays.length * 0.7)
                  ? doneColor
                  : activeDays > 0
                    ? "var(--txt)"
                    : undoneColor,
            },
            {
              label: "Total Sessions",
              val: totalSessions,
              color: "var(--txt)",
            },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: "var(--bg3)",
                borderRadius: 12,
                padding: "14px 12px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>
                {s.val}
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: ".06em",
                  textTransform: "uppercase",
                  color: "var(--txt3)",
                  marginTop: 3,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            marginBottom: 16,
          }}
        >
          {[
            {
              icon: "🏆",
              label: "Strongest subject",
              val: subjectRates.length
                ? `${subjectRates[0].label} (${subjectRates[0].rate}%)`
                : "—",
              color: doneColor,
            },
            {
              icon: "⚠️",
              label: "Weakest subject",
              val: subjectRates.length
                ? `${subjectRates[subjectRates.length - 1].label} (${subjectRates[subjectRates.length - 1].rate}%)`
                : "—",
              color: undoneColor,
            },
            {
              icon: "📅",
              label: "Best day",
              val: bestDay
                ? `${bestDay.name} (${bestDay.score} sessions)`
                : "No sessions yet",
              color: "var(--txt)",
            },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "11px 14px",
                borderRadius: 11,
                background: "var(--bg3)",
                border: "1px solid var(--border)",
              }}
            >
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--txt3)",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: ".04em",
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: item.color,
                    marginTop: 1,
                  }}
                >
                  {item.val}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 16 }}>
          <div className="slabel" style={{ marginBottom: 8 }}>
            Day Breakdown
          </div>
          {dayScores.map(({ d, name, score, untracked }) => {
            const isToday = d === today;
            const pct =
              score !== null && cols.length > 0
                ? Math.round((score / cols.length) * 100)
                : 0;
            return (
              <div
                key={d}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 5,
                  opacity: untracked ? 0.35 : 1,
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: isToday ? 700 : 500,
                    color: isToday ? "var(--txt)" : "var(--txt2)",
                    minWidth: 100,
                  }}
                >
                  {name}
                  {isToday ? " · today" : ""}
                  {d < trackingStartDate ? " · before start" : ""}
                </span>
                <div
                  style={{
                    flex: 1,
                    height: 6,
                    background: "var(--bg4)",
                    borderRadius: 99,
                    overflow: "hidden",
                  }}
                >
                  {!untracked && (
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        background:
                          pct >= 70
                            ? doneColor
                            : pct > 0
                              ? "var(--txt3)"
                              : undoneColor,
                        borderRadius: 99,
                        transition: "width .4s",
                      }}
                    />
                  )}
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: "var(--mono)",
                    color: "var(--txt3)",
                    minWidth: 24,
                    textAlign: "right",
                  }}
                >
                  {untracked ? "–" : score}
                </span>
              </div>
            );
          })}
        </div>
        {totalSessions === 0 && validDays.length > 0 && (
          <div
            style={{
              padding: "12px 14px",
              borderRadius: 10,
              background: `${undoneColor}15`,
              border: `1px solid ${undoneColor}30`,
              marginBottom: 16,
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 700, color: undoneColor }}>
              Zero sessions this week. That's a choice.
            </span>
          </div>
        )}
        <button
          onClick={onClose}
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
          Got it — back to work
        </button>
      </div>
    </div>
  );
}

// ─── MAIN VIEW ────────────────────────────────────────────────────────────────
const KEY = "gr_heatmap_v3";

export default function HabitView() {
  const [loaded, setLoaded] = useState(false);
  const [trackingStartDate, setTSD] = useState(null);
  const [cols, setCols] = useState(DEFAULT_COLUMNS);
  const [records, setRecords] = useState({});
  const [notes, setNotes] = useState({});
  const [doneColor, setDoneColor] = useState(DEFAULT_DONE_COLOR);
  const [undoneColor, setUndoneColor] = useState(DEFAULT_UNDONE_COLOR);
  const [longestStreaks, setLS] = useState({});
  const [lastAutoMarkDate, setLAMD] = useState("");
  const [showColor, setShowColor] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showWeekly, setShowWeekly] = useState(false);
  const [noteCell, setNoteCell] = useState(null);
  const [range, setRange] = useState(30);

  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(KEY) || "{}");
      if (raw.trackingStartDate) setTSD(raw.trackingStartDate);
      if (raw.cols) setCols(raw.cols);
      if (raw.records) setRecords(raw.records);
      if (raw.notes) setNotes(raw.notes);
      if (raw.doneColor) setDoneColor(raw.doneColor);
      if (raw.undoneColor) setUndoneColor(raw.undoneColor);
      if (raw.longestStreaks) setLS(raw.longestStreaks);
      if (raw.lastAutoMarkDate) setLAMD(raw.lastAutoMarkDate);
    } catch {}
    setLoaded(true);
  }, []);

  // Auto-mark missed — only from trackingStartDate onward
  useEffect(() => {
    if (!trackingStartDate) return;
    const today = todayStr();
    if (lastAutoMarkDate === today || cols.length === 0) return;
    setRecords((prev) => {
      const { updated, changed } = autoMarkMissed(
        prev,
        cols,
        trackingStartDate,
      );
      if (changed) {
        setLAMD(today);
        patchPersist({ records: updated, lastAutoMarkDate: today });
        return updated;
      }
      return prev;
    });
  }, [trackingStartDate, cols, lastAutoMarkDate]);

  // Weekly summary on Sundays
  useEffect(() => {
    if (!trackingStartDate) return;
    if (new Date().getDay() !== 0) return;
    const raw = JSON.parse(localStorage.getItem(KEY) || "{}");
    if (raw.lastWeeklySummary !== todayStr()) setShowWeekly(true);
  }, [trackingStartDate]);

  function patchPersist(patch) {
    const cur = JSON.parse(localStorage.getItem(KEY) || "{}");
    localStorage.setItem(KEY, JSON.stringify({ ...cur, ...patch }));
  }

  function confirmStart(date) {
    setTSD(date);
    patchPersist({ trackingStartDate: date });
  }

  function computeStreak(recs, colId) {
    let s = 0;
    for (let i = 0; i < 365; i++) {
      const ds = offsetDate(-i);
      if (trackingStartDate && ds < trackingStartDate) break;
      if (recs[`${ds}:${colId}`] === "done") s++;
      else break;
    }
    return s;
  }

  function toggle(dateStr, colId) {
    if (!isEditable(dateStr)) return;
    setRecords((prev) => {
      const k = `${dateStr}:${colId}`;
      const next = { ...prev };
      if (next[k] === "done") delete next[k];
      else next[k] = "done";
      const streak = computeStreak(next, colId);
      setLS((prevLS) => {
        const updLS = {
          ...prevLS,
          [colId]: Math.max(prevLS[colId] || 0, streak),
        };
        patchPersist({ records: next, longestStreaks: updLS });
        return updLS;
      });
      return next;
    });
  }

  function saveColors(dc, uc) {
    setDoneColor(dc);
    setUndoneColor(uc);
    patchPersist({ doneColor: dc, undoneColor: uc });
  }
  function addCol(col) {
    setCols((prev) => {
      const n = [...prev, col];
      patchPersist({ cols: n });
      return n;
    });
  }
  function removeCol(id) {
    if (!confirm("Delete this subject and all its data?")) return;
    setCols((prev) => {
      const n = prev.filter((c) => c.id !== id);
      patchPersist({ cols: n });
      return n;
    });
  }
  function saveNote(dateStr, colId, nd) {
    setNotes((prev) => {
      const k = `${dateStr}:${colId}`,
        n = { ...prev };
      if (nd) n[k] = nd;
      else delete n[k];
      patchPersist({ notes: n });
      return n;
    });
  }
  function dismissWeekly() {
    setShowWeekly(false);
    patchPersist({ lastWeeklySummary: todayStr() });
  }

  const dates = useMemo(
    () => Array.from({ length: range }, (_, i) => offsetDate(-(range - 1 - i))),
    [range],
  );
  const today = todayStr();

  function colStats(colId, dateRange) {
    const relevant = (dateRange || dates).filter(
      (d) => d <= today && (!trackingStartDate || d >= trackingStartDate),
    );
    const done = relevant.filter(
      (d) => records[`${d}:${colId}`] === "done",
    ).length;
    const missed = relevant.filter(
      (d) => records[`${d}:${colId}`] === "undone",
    ).length;
    const rate =
      relevant.length > 0 ? Math.round((done / relevant.length) * 100) : 0;
    let streak = 0;
    for (let i = 0; i < relevant.length; i++) {
      const ds = relevant[relevant.length - 1 - i];
      if (records[`${ds}:${colId}`] === "done") streak++;
      else break;
    }
    return { done, missed, rate, streak, total: relevant.length };
  }

  function lastStudied(colId) {
    for (let i = 0; i < 60; i++) {
      const ds = offsetDate(-i);
      if (trackingStartDate && ds < trackingStartDate) return null;
      if (records[`${ds}:${colId}`] === "done") {
        return i === 0 ? "today" : i === 1 ? "yesterday" : `${i}d ago`;
      }
    }
    return null;
  }

  function consecutiveMissed(colId) {
    let count = 0;
    for (let i = 1; i <= 30; i++) {
      const ds = offsetDate(-i);
      if (trackingStartDate && ds < trackingStartDate) break;
      const v = records[`${ds}:${colId}`];
      if (v === "undone" || !v) count++;
      else break;
    }
    return count;
  }

  function recoveryInfo(colId) {
    const best = longestStreaks[colId] || 0;
    const st = colStats(colId);
    if (best === 0) return null;
    if (st.streak > 0 && st.streak < best)
      return { mode: "progress", current: st.streak, best };
    if (st.streak >= best && st.streak > 0)
      return { mode: "new_record", streak: st.streak };
    if (st.streak === 0 && best > 0) return { mode: "recovery", best };
    return null;
  }

  const trackedEntries = Object.entries(records).filter(([k]) => {
    const ds = k.split(":")[0];
    return !trackingStartDate || ds >= trackingStartDate;
  });
  const totalDone = trackedEntries.filter(([, v]) => v === "done").length;
  const totalMissed = trackedEntries.filter(([, v]) => v === "undone").length;
  const overallRate =
    totalDone + totalMissed > 0
      ? Math.round((totalDone / (totalDone + totalMissed)) * 100)
      : 0;
  const consistency = getConsistencyMessage(overallRate);
  const penaltySubjects = cols.filter((col) => consecutiveMissed(col.id) >= 3);
  const cellW = range === 7 ? 40 : range === 14 ? 34 : 28;
  const activePreset = PRESET_PALETTES.find(
    (p) => p.done === doneColor && p.undone === undoneColor,
  );

  if (!loaded) return null;
  if (!trackingStartDate) return <OnboardingModal onConfirm={confirmStart} />;

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
          <button
            onClick={() => setShowWeekly(true)}
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
            📊 Week
          </button>
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

      {/* Tracking-since badge */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "4px 10px",
          borderRadius: 99,
          background: "var(--bg3)",
          border: "1px solid var(--border)",
          marginBottom: 10,
        }}
      >
        <span style={{ fontSize: 11, color: "var(--txt3)" }}>
          Tracking since
        </span>
        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--txt)" }}>
          {fmtDateLong(trackingStartDate)}
        </span>
      </div>

      {/* Consistency banner */}
      <div
        style={{
          marginBottom: penaltySubjects.length ? 8 : 14,
          padding: "11px 14px",
          borderRadius: 11,
          background:
            consistency.tone === "great"
              ? `${doneColor}18`
              : consistency.tone === "good"
                ? `${doneColor}10`
                : consistency.tone === "bad"
                  ? `${undoneColor}15`
                  : "var(--bg3)",
          border: `1px solid ${consistency.tone === "great" || consistency.tone === "good" ? `${doneColor}40` : consistency.tone === "bad" ? `${undoneColor}35` : "var(--border)"}`,
        }}
      >
        <span
          style={{
            fontSize: 15,
            fontWeight: 700,
            color:
              consistency.tone === "great" || consistency.tone === "good"
                ? doneColor
                : consistency.tone === "bad"
                  ? undoneColor
                  : "var(--txt)",
          }}
        >
          {consistency.text}
        </span>
      </div>

      {/* Miss penalties */}
      {penaltySubjects.length > 0 && (
        <div
          style={{
            marginBottom: 14,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {penaltySubjects.map((col) => {
            const days = consecutiveMissed(col.id);
            return (
              <div
                key={col.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 13px",
                  borderRadius: 10,
                  background: `${undoneColor}12`,
                  border: `1px solid ${undoneColor}35`,
                }}
              >
                <span style={{ fontSize: 14 }}>⚠️</span>
                <span
                  style={{ fontSize: 13, fontWeight: 600, color: undoneColor }}
                >
                  You've ignored <strong>{col.label}</strong> for {days} day
                  {days > 1 ? "s" : ""}. No entry = missed.
                </span>
              </div>
            );
          })}
        </div>
      )}

      <p style={{ fontSize: 13, color: "var(--txt3)", marginBottom: 16 }}>
        Tap <span style={{ fontWeight: 600, color: doneColor }}>✓ done</span> ·
        tap again to clear · absence auto-marks missed ·{" "}
        <span style={{ fontWeight: 600, color: "var(--txt)" }}>
          📝 tap dot on done cells for notes
        </span>
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
                const st = colStats(col.id),
                  ls = lastStudied(col.id),
                  rv = recoveryInfo(col.id);
                const best = longestStreaks[col.id] || 0,
                  penalty = consecutiveMissed(col.id) >= 3;
                return (
                  <th
                    key={col.id}
                    style={{
                      padding: "8px 2px 6px",
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
                        gap: 2,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: penalty ? undoneColor : "var(--txt)",
                          letterSpacing: ".02em",
                          maxWidth: cellW - 4,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
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
                      <div
                        style={{
                          fontSize: 8,
                          color:
                            ls === "today" || ls === "yesterday"
                              ? doneColor
                              : "var(--txt3)",
                          fontWeight: 600,
                          lineHeight: 1.1,
                        }}
                      >
                        {ls || (st.total > 0 ? "not yet" : "—")}
                      </div>
                      {rv?.mode === "new_record" ? (
                        <div
                          style={{
                            fontSize: 9,
                            fontWeight: 800,
                            color: doneColor,
                            lineHeight: 1,
                          }}
                        >
                          🌟{rv.streak}d!
                        </div>
                      ) : rv?.mode === "progress" ? (
                        <div
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            color: doneColor,
                            lineHeight: 1,
                          }}
                        >
                          🔥{rv.current}/{rv.best}d
                        </div>
                      ) : rv?.mode === "recovery" ? (
                        <div
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            color: "var(--txt3)",
                            lineHeight: 1,
                          }}
                        >
                          🎯beat {rv.best}d
                        </div>
                      ) : st.streak > 0 ? (
                        <div
                          style={{
                            fontSize: 9,
                            fontWeight: 800,
                            color: doneColor,
                            lineHeight: 1,
                          }}
                        >
                          🔥{st.streak}d
                        </div>
                      ) : (
                        <div
                          style={{
                            fontSize: 9,
                            color: "var(--txt3)",
                            lineHeight: 1,
                          }}
                        >
                          –
                        </div>
                      )}
                      {best > 0 && (
                        <div
                          style={{
                            fontSize: 8,
                            color: "var(--txt3)",
                            lineHeight: 1,
                          }}
                        >
                          best {best}d
                        </div>
                      )}
                      <button
                        onClick={() => removeCol(col.id)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          padding: "1px 3px",
                          color: "var(--red)",
                          fontSize: 11,
                          opacity: 0.3,
                          lineHeight: 1,
                          transition: "opacity .15s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.opacity = 1)
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.opacity = 0.3)
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

          <tbody>
            {dates.map((dateStr, rowIdx) => {
              const d = new Date(dateStr + "T00:00:00");
              const isToday = dateStr === today;
              const isFuture = dateStr > today;
              const editable = isEditable(dateStr);
              const isPast = dateStr < today;
              const isYesterday = !isToday && editable;
              const isWeekend = d.getDay() === 0 || d.getDay() === 6;
              const dayName = DAYS_SHORT[d.getDay()];
              const beforeStart =
                trackingStartDate && dateStr < trackingStartDate;
              const rowBg = isToday
                ? `${doneColor}10`
                : isYesterday
                  ? `${doneColor}06`
                  : rowIdx % 2 === 0
                    ? "var(--bg2)"
                    : "var(--bg3)";

              return (
                <tr
                  key={dateStr}
                  style={{
                    background: beforeStart ? "var(--bg)" : rowBg,
                    opacity: beforeStart ? 0.38 : 1,
                  }}
                >
                  <td
                    style={{
                      padding: "4px 8px 4px 12px",
                      borderRight: "1px solid var(--border)",
                      borderBottom: "1px solid var(--border)",
                      position: "sticky",
                      left: 0,
                      zIndex: 1,
                      whiteSpace: "nowrap",
                      background: beforeStart ? "var(--bg)" : rowBg,
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
                          marginLeft: 5,
                          fontWeight: isToday ? 700 : isYesterday ? 600 : 400,
                          color: beforeStart
                            ? "var(--txt3)"
                            : isToday
                              ? doneColor
                              : isYesterday
                                ? `${doneColor}90`
                                : isWeekend
                                  ? "var(--txt2)"
                                  : "var(--txt3)",
                        }}
                      >
                        {beforeStart
                          ? "before start"
                          : isToday
                            ? "Today"
                            : isYesterday
                              ? "Yesterday ✏️"
                              : dayName}
                      </span>
                    </div>
                  </td>
                  {cols.map((col) => {
                    const k = `${dateStr}:${col.id}`,
                      status = records[k],
                      locked = !editable || isFuture || beforeStart,
                      hasNote = !!notes[k];
                    const bg =
                      beforeStart || isFuture
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
                          position: "relative",
                        }}
                      >
                        {beforeStart ? (
                          <div
                            style={{
                              width: cellW - 6,
                              height: cellW - 6,
                              borderRadius: 5,
                              background: "transparent",
                              border: "1px solid var(--border)",
                              margin: "0 auto",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <span style={{ fontSize: 8, color: "var(--txt3)" }}>
                              –
                            </span>
                          </div>
                        ) : (
                          <div
                            style={{
                              position: "relative",
                              display: "inline-block",
                            }}
                          >
                            <div
                              onClick={() => !locked && toggle(dateStr, col.id)}
                              title={
                                isFuture
                                  ? "Future — not yet"
                                  : !editable
                                    ? "🔒 Locked (>48h old)"
                                    : status === "done"
                                      ? "Studied ✓ — tap to clear"
                                      : "Tap to mark as studied"
                              }
                              style={{
                                width: cellW - 6,
                                height: cellW - 6,
                                borderRadius: 5,
                                background: bg,
                                border: isToday
                                  ? "2px solid var(--txt)"
                                  : isYesterday
                                    ? `1.5px dashed ${doneColor}`
                                    : "1px solid transparent",
                                cursor: locked ? "not-allowed" : "pointer",
                                opacity:
                                  isPast && !isYesterday
                                    ? status
                                      ? 0.65
                                      : 0.2
                                    : 1,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                transition: "filter .1s, transform .1s",
                              }}
                              onMouseEnter={(e) => {
                                if (!locked) {
                                  e.currentTarget.style.filter =
                                    "brightness(1.15)";
                                  e.currentTarget.style.transform =
                                    "scale(1.1)";
                                }
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.filter = "";
                                e.currentTarget.style.transform = "";
                              }}
                            >
                              {status === "done" && (
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
                              {status === "undone" && (
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
                            {status === "done" && (
                              <div
                                onClick={() =>
                                  setNoteCell({
                                    dateStr,
                                    colId: col.id,
                                    colLabel: col.label,
                                  })
                                }
                                title={
                                  hasNote
                                    ? "View/edit note"
                                    : "Add session note"
                                }
                                style={{
                                  position: "absolute",
                                  top: -3,
                                  right: -3,
                                  width: 10,
                                  height: 10,
                                  borderRadius: "50%",
                                  background: hasNote
                                    ? "#f59e0b"
                                    : "var(--bg4)",
                                  border: `1.5px solid var(--bg2)`,
                                  cursor: "pointer",
                                  zIndex: 1,
                                  transition: "transform .1s",
                                }}
                                onMouseEnter={(e) =>
                                  (e.currentTarget.style.transform =
                                    "scale(1.3)")
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.transform = "scale(1)")
                                }
                              />
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>

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
                🔥 Streak
              </td>
              {cols.map((col) => {
                const st = colStats(col.id),
                  best = longestStreaks[col.id] || 0;
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
                        fontSize: 12,
                        fontWeight: 700,
                        color: st.streak > 0 ? doneColor : "var(--txt3)",
                      }}
                    >
                      {st.streak > 0 ? `${st.streak}d` : "–"}
                    </div>
                    {best > 0 && (
                      <div
                        style={{
                          fontSize: 9,
                          color: "var(--txt3)",
                          marginTop: 1,
                        }}
                      >
                        /{best}d
                      </div>
                    )}
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
          { bg: undoneColor, icon: "✗", label: "Missed (auto)" },
          { bg: "var(--bg4)", icon: "", label: "Not yet" },
          { bg: "#f59e0b", icon: "", label: "Has note", round: true },
        ].map((l) => (
          <div
            key={l.label}
            style={{ display: "flex", alignItems: "center", gap: 5 }}
          >
            <div
              style={{
                width: l.round ? 10 : 16,
                height: l.round ? 10 : 16,
                borderRadius: l.round ? "50%" : 4,
                background: l.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {!l.round && (
                <span style={{ fontSize: 9, color: "#fff", fontWeight: 700 }}>
                  {l.icon}
                </span>
              )}
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
          Today + yesterday editable
        </div>
      </div>

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
      {showWeekly && (
        <WeeklySummaryModal
          cols={cols}
          records={records}
          doneColor={doneColor}
          undoneColor={undoneColor}
          trackingStartDate={trackingStartDate}
          onClose={dismissWeekly}
        />
      )}
      {noteCell && (
        <CellNoteModal
          dateStr={noteCell.dateStr}
          colLabel={noteCell.colLabel}
          note={notes[`${noteCell.dateStr}:${noteCell.colId}`]}
          onSave={(d) => saveNote(noteCell.dateStr, noteCell.colId, d)}
          onClose={() => setNoteCell(null)}
        />
      )}
    </div>
  );
}
