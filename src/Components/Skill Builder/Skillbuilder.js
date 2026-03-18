// SkillBuilder.jsx — ML Skill Builder
"use client";
import { useState, useMemo, useEffect, useCallback } from "react";
import {
  ML_TOPICS,
  ML_CATEGORY_COLORS,
  RESOURCE_TYPE_META,
  getTotalDays,
} from "../../lib/data/Skill Builder/ml";

const SB_ACCENT = "#7c5cbf";
const LS_SETUP = "sb_setup_v2";
const LS_DONE = "sb_done_v2";
const LS_NOTES = "sb_notes_v2";
const LS_STREAK = "sb_streak_v2";

// ─── localStorage helpers ─────────────────────────────────────────────────────
function lsGet(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}
function lsSet(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {}
}

// ─── streak helper ────────────────────────────────────────────────────────────
function updateStreak(todayStr) {
  const s = lsGet(LS_STREAK, { count: 0, lastDate: "" });
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr = yesterday.toISOString().split("T")[0];
  if (s.lastDate === todayStr) return s; // already updated today
  const newCount = s.lastDate === yStr ? s.count + 1 : 1;
  const next = { count: newCount, lastDate: todayStr };
  lsSet(LS_STREAK, next);
  return next;
}

// ─── primitives ───────────────────────────────────────────────────────────────
function SBBar({ pct, color = SB_ACCENT, height = 5 }) {
  return (
    <div
      style={{
        background: "var(--bg3)",
        borderRadius: 99,
        height,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: `${Math.min(100, pct)}%`,
          height: "100%",
          background: color,
          borderRadius: 99,
          transition: "width .4s",
        }}
      />
    </div>
  );
}
function SBCard({ children, style = {} }) {
  return (
    <div className="card" style={style}>
      {children}
    </div>
  );
}
function Label({ children, style = {} }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: ".08em",
        color: "var(--txt3)",
        marginBottom: 8,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Resource chip ─────────────────────────────────────────────────────────────
function ResourceChip({ r }) {
  const meta = RESOURCE_TYPE_META[r.type] || {
    label: r.type,
    icon: "→",
    color: "#888",
  };
  return (
    <a
      href={r.url}
      target="_blank"
      rel="noreferrer"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        padding: "9px 12px",
        borderRadius: 10,
        background: "var(--bg3)",
        border: `1px solid ${meta.color}33`,
        textDecoration: "none",
        transition: "border-color .15s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor = meta.color + "88")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderColor = meta.color + "33")
      }
    >
      <span
        style={{
          flexShrink: 0,
          fontSize: 9,
          fontWeight: 800,
          padding: "3px 7px",
          borderRadius: 6,
          background: meta.color + "18",
          color: meta.color,
          border: `1px solid ${meta.color}33`,
          marginTop: 1,
          whiteSpace: "nowrap",
        }}
      >
        {meta.icon} {meta.label}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "var(--txt)",
            lineHeight: 1.35,
            marginBottom: r.note ? 3 : 0,
          }}
        >
          {r.label}
        </div>
        {r.note && (
          <div style={{ fontSize: 11, color: "var(--txt3)", lineHeight: 1.4 }}>
            {r.note}
          </div>
        )}
      </div>
      <span
        style={{
          fontSize: 11,
          color: meta.color,
          flexShrink: 0,
          fontWeight: 700,
          marginTop: 1,
        }}
      >
        ↗
      </span>
    </a>
  );
}

// ─── Resource Popup — shown from Today only, has Mark Done ───────────────────
function ResourcePopup({
  topic,
  done,
  onToggleDone,
  onClose,
  note,
  onNoteChange,
  showMarkDone = true,
}) {
  const col = ML_CATEGORY_COLORS[topic.category] || SB_ACCENT;
  const [localNote, setLocalNote] = useState(note || "");

  function saveNote() {
    onNoteChange(topic.id, localNote);
  }

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1000,
          background: "rgba(0,0,0,0.55)",
        }}
      />
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1001,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            pointerEvents: "all",
            width: "100%",
            maxWidth: 520,
            maxHeight: "88vh",
            overflowY: "auto",
            background: "var(--bg)",
            border: `1.5px solid ${col}44`,
            borderRadius: 16,
          }}
        >
          {/* sticky header */}
          <div
            style={{
              padding: "16px 18px 14px",
              borderBottom: "1px solid var(--border)",
              position: "sticky",
              top: 0,
              background: "var(--bg)",
              zIndex: 1,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 12,
              }}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    flexWrap: "wrap",
                    marginBottom: 5,
                  }}
                >
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      padding: "2px 8px",
                      borderRadius: 99,
                      background: col + "22",
                      color: col,
                      border: `1px solid ${col}44`,
                    }}
                  >
                    {topic.category}
                  </span>
                  <span style={{ fontSize: 10, color: "var(--txt3)" }}>
                    ~{topic.estimatedDays}d · {topic.resources.length} resources
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: "var(--txt)",
                    lineHeight: 1.35,
                  }}
                >
                  {topic.title}
                </div>
              </div>
              <button
                onClick={onClose}
                style={{
                  flexShrink: 0,
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  background: "var(--bg3)",
                  color: "var(--txt3)",
                  cursor: "pointer",
                  fontSize: 15,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* description */}
          <div style={{ padding: "12px 18px 0" }}>
            <div
              style={{
                fontSize: 12,
                color: "var(--txt3)",
                lineHeight: 1.6,
                padding: "8px 10px",
                background: "var(--bg3)",
                borderRadius: 8,
                borderLeft: `2px solid ${col}88`,
              }}
            >
              {topic.description}
            </div>
          </div>

          {/* resources */}
          <div style={{ padding: "14px 18px 0" }}>
            <Label>Best Resources to Study</Label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {topic.resources.map((r, i) => (
                <ResourceChip key={i} r={r} />
              ))}
            </div>
          </div>

          {/* personal notes */}
          <div style={{ padding: "14px 18px 0" }}>
            <Label>My Notes</Label>
            <textarea
              value={localNote}
              onChange={(e) => setLocalNote(e.target.value)}
              onBlur={saveNote}
              placeholder="Jot down key concepts, doubts, or what you learned..."
              rows={3}
              style={{
                width: "100%",
                boxSizing: "border-box",
                background: "var(--bg3)",
                border: "1.5px solid var(--border)",
                borderRadius: 10,
                padding: "10px 12px",
                color: "var(--txt)",
                fontSize: 12,
                resize: "vertical",
                outline: "none",
                lineHeight: 1.5,
              }}
            />
          </div>

          {/* mark done — only shown when opened from Today */}
          {showMarkDone && (
            <div style={{ padding: "12px 18px 18px" }}>
              <button
                onClick={() => {
                  saveNote();
                  onToggleDone(topic.id);
                  onClose();
                }}
                style={{
                  width: "100%",
                  padding: 12,
                  borderRadius: 10,
                  border: done ? "1.5px solid var(--border)" : "none",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 800,
                  background: done ? "var(--bg3)" : col,
                  color: done ? "var(--txt3)" : "#fff",
                  transition: "all .15s",
                }}
              >
                {done ? "✓ Completed — Click to Undo" : "Mark as Completed"}
              </button>
            </div>
          )}

          {/* view-only footer for All Topics */}
          {!showMarkDone && (
            <div style={{ padding: "12px 18px 18px" }}>
              <button
                onClick={() => {
                  saveNote();
                  onClose();
                }}
                style={{
                  width: "100%",
                  padding: 10,
                  borderRadius: 10,
                  border: "1.5px solid var(--border)",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 700,
                  background: "var(--bg3)",
                  color: "var(--txt2)",
                }}
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ─── Category Progress Popup ──────────────────────────────────────────────────
function CategoryPopup({ selectedTopics, done, onClose }) {
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1000,
          background: "rgba(0,0,0,0.55)",
        }}
      />
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1001,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            pointerEvents: "all",
            width: "100%",
            maxWidth: 440,
            maxHeight: "80vh",
            overflowY: "auto",
            background: "var(--bg)",
            border: `1.5px solid ${SB_ACCENT}44`,
            borderRadius: 16,
          }}
        >
          <div
            style={{
              padding: "16px 18px 14px",
              borderBottom: "1px solid var(--border)",
              position: "sticky",
              top: 0,
              background: "var(--bg)",
              zIndex: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{ fontSize: 14, fontWeight: 800, color: "var(--txt)" }}
            >
              Progress by Category
            </span>
            <button
              onClick={onClose}
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--bg3)",
                color: "var(--txt3)",
                cursor: "pointer",
                fontSize: 15,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
              }}
            >
              ✕
            </button>
          </div>
          <div
            style={{
              padding: "14px 18px 18px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {Object.keys(ML_CATEGORY_COLORS).map((cat) => {
              const col = ML_CATEGORY_COLORS[cat];
              const qs = selectedTopics.filter((t) => t.category === cat);
              if (!qs.length) return null;
              const d = qs.filter((t) => done[t.id]).length;
              const p = Math.round((d / qs.length) * 100);
              return (
                <div key={cat}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 5,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 7 }}
                    >
                      <span
                        style={{
                          width: 9,
                          height: 9,
                          borderRadius: "50%",
                          background: col,
                          display: "inline-block",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: "var(--txt2)",
                        }}
                      >
                        {cat}
                      </span>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: col }}>
                      {d}/{qs.length}
                    </span>
                  </div>
                  <SBBar pct={p} color={col} height={5} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Subtopics Popup — shown when user clicks "i" on a category pill ─────────
function SubtopicsPopup({
  cat,
  topics,
  selected,
  onToggleTopic,
  onSelectAll,
  onClearAll,
  onClose,
}) {
  const col = ML_CATEGORY_COLORS[cat] || SB_ACCENT;
  const allOn = topics.every((t) => selected.has(t.id));
  const someOn = topics.some((t) => selected.has(t.id));
  const doneCount = topics.filter((t) => selected.has(t.id)).length;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1000,
          background: "rgba(0,0,0,0.55)",
        }}
      />
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1001,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            pointerEvents: "all",
            width: "100%",
            maxWidth: 480,
            maxHeight: "82vh",
            overflowY: "auto",
            background: "var(--bg)",
            border: `1.5px solid ${col}55`,
            borderRadius: 16,
          }}
        >
          {/* sticky header */}
          <div
            style={{
              padding: "16px 18px 14px",
              borderBottom: "1px solid var(--border)",
              position: "sticky",
              top: 0,
              background: "var(--bg)",
              zIndex: 1,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: col,
                    flexShrink: 0,
                    display: "inline-block",
                  }}
                />
                <span
                  style={{ fontSize: 15, fontWeight: 800, color: "var(--txt)" }}
                >
                  {cat}
                </span>
                <span style={{ fontSize: 10, color: "var(--txt3)" }}>
                  {doneCount}/{topics.length} selected
                </span>
              </div>
              <button
                onClick={onClose}
                style={{
                  flexShrink: 0,
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  background: "var(--bg3)",
                  color: "var(--txt3)",
                  cursor: "pointer",
                  fontSize: 15,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 700,
                }}
              >
                ✕
              </button>
            </div>

            {/* select all / clear */}
            <div style={{ display: "flex", gap: 7, marginTop: 10 }}>
              <button
                onClick={onSelectAll}
                style={{
                  flex: 1,
                  padding: "7px 10px",
                  borderRadius: 8,
                  border: `1px solid ${col}44`,
                  background: allOn ? col + "18" : "var(--bg3)",
                  color: allOn ? col : "var(--txt3)",
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all .15s",
                }}
              >
                ✓ Select All
              </button>
              <button
                onClick={onClearAll}
                style={{
                  flex: 1,
                  padding: "7px 10px",
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  background: "var(--bg3)",
                  color: "var(--txt3)",
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                ✕ Clear All
              </button>
            </div>
          </div>

          {/* topic list */}
          <div
            style={{
              padding: "12px 18px 18px",
              display: "flex",
              flexDirection: "column",
              gap: 7,
            }}
          >
            {topics.map((t, idx) => {
              const isOn = selected.has(t.id);
              return (
                <div
                  key={t.id}
                  onClick={() => onToggleTopic(t.id)}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    padding: "10px 13px",
                    borderRadius: 10,
                    cursor: "pointer",
                    border: `1.5px solid ${isOn ? col + "55" : "var(--border)"}`,
                    background: isOn ? col + "10" : "var(--bg3)",
                    transition: "all .15s",
                  }}
                >
                  {/* checkbox */}
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 5,
                      flexShrink: 0,
                      marginTop: 1,
                      border: `2px solid ${isOn ? col : "var(--border)"}`,
                      background: isOn ? col : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all .15s",
                    }}
                  >
                    {isOn && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path
                          d="M1 4L3.5 6.5L9 1"
                          stroke="#fff"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* day badge + title */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        flexWrap: "wrap",
                        marginBottom: 3,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 800,
                          color: "var(--txt3)",
                          background: "var(--bg2)",
                          border: "1px solid var(--border)",
                          padding: "1px 6px",
                          borderRadius: 99,
                        }}
                      >
                        Topic {idx + 1}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: isOn ? "var(--txt)" : "var(--txt2)",
                          lineHeight: 1.3,
                        }}
                      >
                        {t.title}
                      </span>
                    </div>
                    {/* description */}
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--txt3)",
                        lineHeight: 1.45,
                      }}
                    >
                      {t.description}
                    </div>
                    {/* meta row */}
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        marginTop: 5,
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontSize: 9, color: "var(--txt3)" }}>
                        ~{t.estimatedDays}d study
                      </span>
                      <span style={{ fontSize: 9, color: "var(--txt3)" }}>
                        {t.resources.length} resources
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* done button */}
          <div style={{ padding: "0 18px 18px" }}>
            <button
              onClick={onClose}
              style={{
                width: "100%",
                padding: 11,
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 800,
                background: col,
                color: "#fff",
              }}
            >
              Done — {doneCount} topic{doneCount !== 1 ? "s" : ""} selected from{" "}
              {cat}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Setup Screen ─────────────────────────────────────────────────────────────
function SetupScreen({ onSubmit, savedSetup }) {
  // Track individual topic IDs selected (not just categories)
  const [selectedIds, setSelectedIds] = useState(() => {
    if (savedSetup?.selectedIds) return new Set(savedSetup.selectedIds);
    // backward-compat: if old setup had selectedCats, pre-fill
    if (savedSetup?.selectedCats) {
      return new Set(
        ML_TOPICS.filter((t) =>
          savedSetup.selectedCats.includes(t.category),
        ).map((t) => t.id),
      );
    }
    return new Set();
  });
  const [deadline, setDeadline] = useState(savedSetup?.deadline || "");
  const [popupCat, setPopupCat] = useState(null); // which category popup is open

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minStr = minDate.toISOString().slice(0, 10);

  const selectedTopics = ML_TOPICS.filter((t) => selectedIds.has(t.id));
  const daysLeft = deadline
    ? Math.max(1, Math.ceil((new Date(deadline) - new Date()) / 86400000))
    : null;
  const qpd =
    daysLeft && selectedTopics.length
      ? Math.max(1, Math.ceil(selectedTopics.length / daysLeft))
      : null;
  const urgencyCol = !daysLeft
    ? "var(--txt3)"
    : daysLeft < 14
      ? "#e05252"
      : daysLeft < 45
        ? "#d4b44a"
        : "#4caf7d";
  const canSubmit = deadline && selectedIds.size > 0;

  // Category-level helpers
  function toggleCat(cat) {
    const catTopics = ML_TOPICS.filter((t) => t.category === cat);
    const allOn = catTopics.every((t) => selectedIds.has(t.id));
    setSelectedIds((prev) => {
      const n = new Set(prev);
      catTopics.forEach((t) => (allOn ? n.delete(t.id) : n.add(t.id)));
      return n;
    });
  }

  function selectAll() {
    setSelectedIds(new Set(ML_TOPICS.map((t) => t.id)));
  }
  function clearAll() {
    setSelectedIds(new Set());
  }

  // Per-topic toggle (used inside popup)
  function toggleTopic(id) {
    setSelectedIds((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  // Select / clear all topics inside a category (used inside popup)
  function selectCatAll(cat) {
    const ids = ML_TOPICS.filter((t) => t.category === cat).map((t) => t.id);
    setSelectedIds((prev) => {
      const n = new Set(prev);
      ids.forEach((id) => n.add(id));
      return n;
    });
  }
  function clearCatAll(cat) {
    const ids = ML_TOPICS.filter((t) => t.category === cat).map((t) => t.id);
    setSelectedIds((prev) => {
      const n = new Set(prev);
      ids.forEach((id) => n.delete(id));
      return n;
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* subtopics popup */}
      {popupCat && (
        <SubtopicsPopup
          cat={popupCat}
          topics={ML_TOPICS.filter((t) => t.category === popupCat)}
          selected={selectedIds}
          onToggleTopic={toggleTopic}
          onSelectAll={() => selectCatAll(popupCat)}
          onClearAll={() => clearCatAll(popupCat)}
          onClose={() => setPopupCat(null)}
        />
      )}

      {/* Hero */}
      <div style={{ textAlign: "center", padding: "20px 0 8px" }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "var(--bg2)",
            border: `1px solid ${SB_ACCENT}33`,
            borderRadius: 99,
            padding: "5px 14px",
            marginBottom: 14,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: SB_ACCENT,
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              color: "var(--txt3)",
            }}
          >
            Skill Builder
          </span>
        </div>
        <h2
          style={{
            fontSize: "clamp(20px,4vw,28px)",
            fontWeight: 900,
            margin: "0 0 8px",
            letterSpacing: "-.02em",
            color: "var(--txt)",
          }}
        >
          Learn ML — topic by topic.
          <br />
          <span style={{ color: SB_ACCENT }}>
            Deadline keeps you consistent.
          </span>
        </h2>
        <p style={{ fontSize: 13, color: "var(--txt3)", margin: 0 }}>
          Choose what you want to learn. We'll assign one topic per day with
          curated resources.
        </p>
      </div>

      {/* Category picker */}
      <SBCard>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Label style={{ marginBottom: 0 }}>Choose Topics to Cover</Label>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={selectAll}
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: SB_ACCENT,
                background: SB_ACCENT + "15",
                border: `1px solid ${SB_ACCENT}33`,
                borderRadius: 6,
                padding: "3px 9px",
                cursor: "pointer",
              }}
            >
              All
            </button>
            <button
              onClick={clearAll}
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "var(--txt3)",
                background: "var(--bg3)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                padding: "3px 9px",
                cursor: "pointer",
              }}
            >
              None
            </button>
          </div>
        </div>
        <p style={{ fontSize: 11, color: "var(--txt3)", margin: "0 0 12px" }}>
          Click a category to toggle all its topics. Tap{" "}
          <strong style={{ color: "var(--txt2)" }}>↗</strong> to see and pick
          individual subtopics.
        </p>

        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          {Object.keys(ML_CATEGORY_COLORS).map((cat) => {
            const col = ML_CATEGORY_COLORS[cat];
            const catTopics = ML_TOPICS.filter((t) => t.category === cat);
            const selCount = catTopics.filter((t) =>
              selectedIds.has(t.id),
            ).length;
            const allOn = selCount === catTopics.length;
            const someOn = selCount > 0 && !allOn;

            return (
              <div
                key={cat}
                style={{
                  display: "flex",
                  alignItems: "center",
                  borderRadius: 99,
                  border: `1.5px solid ${selCount > 0 ? col : "var(--border)"}`,
                  background: allOn
                    ? col + "18"
                    : someOn
                      ? col + "0e"
                      : "var(--bg3)",
                  overflow: "hidden",
                  transition: "all .15s",
                }}
              >
                {/* main pill — toggles whole category */}
                <button
                  onClick={() => toggleCat(cat)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "6px 10px 6px 13px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: selCount > 0 ? col : "var(--txt3)",
                    fontSize: 11,
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  {cat}
                  {/* count badge */}
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      padding: "1px 5px",
                      borderRadius: 99,
                      background: selCount > 0 ? col + "28" : "var(--bg2)",
                      color: selCount > 0 ? col : "var(--txt3)",
                      border: `1px solid ${selCount > 0 ? col + "44" : "var(--border)"}`,
                    }}
                  >
                    {selCount}/{catTopics.length}
                  </span>
                </button>
                {/* info button — opens subtopics popup */}
                <button
                  onClick={() => setPopupCat(cat)}
                  style={{
                    padding: "6px 10px 6px 4px",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: selCount > 0 ? col : "var(--txt3)",
                    fontSize: 11,
                    fontWeight: 800,
                    opacity: 0.75,
                    transition: "opacity .15s",
                  }}
                  title={`See subtopics in ${cat}`}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.75")}
                >
                  ↗
                </button>
              </div>
            );
          })}
        </div>

        {selectedTopics.length > 0 && (
          <div
            style={{
              marginTop: 12,
              padding: "8px 12px",
              background: SB_ACCENT + "10",
              borderRadius: 9,
              fontSize: 11,
              color: SB_ACCENT,
              fontWeight: 700,
              border: `1px solid ${SB_ACCENT}28`,
              display: "flex",
              gap: 14,
              flexWrap: "wrap",
            }}
          >
            <span>{selectedTopics.length} topics selected</span>
            <span>~{getTotalDays(selectedTopics)} estimated days total</span>
          </div>
        )}
      </SBCard>

      {/* Deadline */}
      <SBCard>
        <Label>Set Your Goal Deadline</Label>
        <p style={{ fontSize: 11, color: "var(--txt3)", margin: "0 0 10px" }}>
          No interview pressure — just a personal target to stay on track.
        </p>
        <input
          type="date"
          min={minStr}
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          style={{
            width: "100%",
            boxSizing: "border-box",
            background: "var(--bg3)",
            border: "1.5px solid var(--border)",
            borderRadius: 10,
            padding: "11px 14px",
            color: "var(--txt)",
            fontSize: 14,
            outline: "none",
          }}
        />
        {daysLeft !== null && (
          <div
            style={{
              marginTop: 10,
              padding: "9px 12px",
              borderRadius: 9,
              background: urgencyCol + "12",
              border: `1px solid ${urgencyCol}33`,
              fontSize: 12,
              fontWeight: 600,
              color: urgencyCol,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>{daysLeft < 14 ? "🔴" : daysLeft < 45 ? "🟡" : "🟢"}</span>
            <span>
              {daysLeft} days until goal
              {qpd && (
                <>
                  {" "}
                  ·{" "}
                  <strong>
                    {qpd} topic{qpd !== 1 ? "s" : ""}/day
                  </strong>{" "}
                  to finish on time
                </>
              )}
              {selectedTopics.length === 0 && " · select topics first"}
            </span>
          </div>
        )}
      </SBCard>

      {/* Submit */}
      <button
        disabled={!canSubmit}
        onClick={() =>
          onSubmit({
            deadline,
            selectedCats: [...new Set(selectedTopics.map((t) => t.category))],
            selectedIds: [...selectedIds],
          })
        }
        style={{
          width: "100%",
          padding: 15,
          borderRadius: 12,
          border: "none",
          fontSize: 15,
          fontWeight: 800,
          cursor: canSubmit ? "pointer" : "not-allowed",
          background: canSubmit
            ? `linear-gradient(135deg, ${SB_ACCENT}, ${SB_ACCENT}bb)`
            : "var(--bg3)",
          color: canSubmit ? "#fff" : "var(--txt3)",
          transition: "all .2s",
        }}
      >
        {canSubmit
          ? "Build My ML Plan →"
          : !deadline
            ? "Set a deadline to continue"
            : "Select at least one topic"}
      </button>
    </div>
  );
}

// ─── Plan Screen ──────────────────────────────────────────────────────────────
function PlanScreen({
  setup,
  done,
  onToggleDone,
  onReset,
  notes,
  onNoteChange,
}) {
  const { deadline, selectedCats = [], startDate } = setup;

  const selectedTopics = useMemo(
    () =>
      ML_TOPICS.filter((t) =>
        setup.selectedIds
          ? setup.selectedIds.includes(t.id)
          : setup.selectedCats.includes(t.category),
      ),
    [setup],
  );

  // Build day plan — 1 topic per day sequentially
  const dayPlan = useMemo(() => {
    const plan = [];
    const start = new Date(startDate);
    selectedTopics.forEach((topic, idx) => {
      const date = new Date(start);
      date.setDate(date.getDate() + idx);
      plan.push({
        dayNum: idx + 1,
        date: date.toISOString().split("T")[0],
        topic,
      });
    });
    return plan;
  }, [selectedTopics, startDate]);

  const totalDaysSpan = useMemo(
    () =>
      Math.max(
        1,
        Math.ceil((new Date(deadline) - new Date(startDate)) / 86400000),
      ),
    [deadline, startDate],
  );

  const todayStr = new Date().toISOString().split("T")[0];
  const todayEntry = dayPlan.find((d) => d.date === todayStr);
  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(deadline) - new Date()) / 86400000),
  );
  const totalDone = selectedTopics.filter((t) => done[t.id]).length;
  const totalPct = selectedTopics.length
    ? Math.round((totalDone / selectedTopics.length) * 100)
    : 0;

  const todayTopics = todayEntry ? [todayEntry.topic] : [];
  const todayDone = todayTopics.filter((t) => done[t.id]).length;
  const todayPct = todayTopics.length
    ? Math.round((todayDone / todayTopics.length) * 100)
    : 0;

  // streak
  const streak = lsGet(LS_STREAK, { count: 0, lastDate: "" });

  const [view, setView] = useState("today");
  const [popupTopic, setPopupTopic] = useState(null);
  const [popupIsToday, setPopupIsToday] = useState(false);
  const [showCatPopup, setShowCatPopup] = useState(false);

  function openPopup(topic, isToday) {
    setPopupTopic(topic);
    setPopupIsToday(isToday);
  }

  const urgCol =
    daysLeft === 0
      ? "#e05252"
      : daysLeft < 14
        ? "#e05252"
        : daysLeft < 45
          ? "#d4b44a"
          : "#4caf7d";

  // % of plan elapsed (for "you are here" indicator)
  const startDayIdx = useMemo(() => {
    const idx = dayPlan.findIndex((d) => d.date === todayStr);
    return idx === -1 ? 0 : idx;
  }, [dayPlan, todayStr]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Popups */}
      {popupTopic && (
        <ResourcePopup
          topic={popupTopic}
          done={!!done[popupTopic.id]}
          onToggleDone={onToggleDone}
          onClose={() => setPopupTopic(null)}
          note={notes[popupTopic.id] || ""}
          onNoteChange={onNoteChange}
          showMarkDone={popupIsToday}
        />
      )}
      {showCatPopup && (
        <CategoryPopup
          selectedTopics={selectedTopics}
          done={done}
          onClose={() => setShowCatPopup(false)}
        />
      )}

      {/* ── Top stats card ── */}
      <SBCard style={{ padding: "14px 16px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 800, color: "var(--txt)" }}>
            ML Skill Builder
          </span>
          <div style={{ display: "flex", gap: 6 }}>
            {/* streak badge */}
            {streak.count > 0 && (
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  padding: "3px 9px",
                  borderRadius: 99,
                  background: "#e8924a18",
                  color: "#e8924a",
                  border: "1px solid #e8924a33",
                }}
              >
                🔥 {streak.count}d streak
              </span>
            )}
            <button
              onClick={onReset}
              style={{
                fontSize: 10,
                color: "var(--txt3)",
                background: "var(--bg3)",
                border: "1px solid var(--border)",
                borderRadius: 7,
                padding: "3px 9px",
                cursor: "pointer",
              }}
            >
              ↺ Reset
            </button>
          </div>
        </div>

        {/* overall progress */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 5,
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: ".08em",
              color: "var(--txt3)",
            }}
          >
            Overall Progress
          </span>
          <span
            style={{
              fontSize: 24,
              fontWeight: 900,
              color: SB_ACCENT,
              lineHeight: 1,
            }}
          >
            {totalPct}%
          </span>
        </div>
        <SBBar pct={totalPct} color={SB_ACCENT} height={7} />
        <div
          style={{
            fontSize: 11,
            color: "var(--txt3)",
            marginTop: 5,
            marginBottom: 12,
          }}
        >
          {totalDone} of {selectedTopics.length} topics completed ·{" "}
          {selectedTopics.length - totalDone} remaining
        </div>

        {/* stat pills */}
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 11px",
              borderRadius: 99,
              background: urgCol + "12",
              border: `1px solid ${urgCol}33`,
            }}
          >
            <span
              style={{
                fontSize: 9,
                fontWeight: 800,
                color: urgCol,
                textTransform: "uppercase",
                letterSpacing: ".05em",
              }}
            >
              Deadline
            </span>
            <span style={{ fontSize: 11, fontWeight: 800, color: urgCol }}>
              {deadline}
            </span>
            <span style={{ fontSize: 10, color: urgCol, opacity: 0.8 }}>
              · {daysLeft}d left
            </span>
          </div>

          <button
            onClick={() => setShowCatPopup(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 11px",
              borderRadius: 99,
              background: SB_ACCENT + "12",
              border: `1px solid ${SB_ACCENT}33`,
              cursor: "pointer",
              fontSize: 10,
              fontWeight: 800,
              color: SB_ACCENT,
            }}
          >
            By Category ↗
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 11px",
              borderRadius: 99,
              background: "var(--bg3)",
              border: "1px solid var(--border)",
            }}
          >
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: "var(--txt3)",
                textTransform: "uppercase",
                letterSpacing: ".05em",
              }}
            >
              Pace
            </span>
            <span
              style={{ fontSize: 11, fontWeight: 800, color: "var(--txt)" }}
            >
              1 topic/day
            </span>
          </div>

          {/* jump to today button */}
          {view === "all" && (
            <button
              onClick={() => setView("today")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "5px 11px",
                borderRadius: 99,
                background: "#4caf7d12",
                border: "1px solid #4caf7d33",
                cursor: "pointer",
                fontSize: 10,
                fontWeight: 800,
                color: "#4caf7d",
              }}
            >
              Jump to Today ↓
            </button>
          )}
        </div>
      </SBCard>

      {/* ── Tabs ── */}
      <div style={{ display: "flex", gap: 6 }}>
        {[
          { id: "today", label: "📅 Today" },
          { id: "all", label: "📚 All Topics" },
        ].map((v) => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            style={{
              flex: 1,
              padding: "8px 4px",
              borderRadius: 10,
              cursor: "pointer",
              transition: "all .15s",
              border: `1.5px solid ${view === v.id ? SB_ACCENT : "var(--border)"}`,
              background: view === v.id ? SB_ACCENT + "18" : "var(--bg3)",
              color: view === v.id ? SB_ACCENT : "var(--txt3)",
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* ════ TODAY ════ */}
      {view === "today" && (
        <SBCard>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <div>
              <Label style={{ marginBottom: 2 }}>
                {todayEntry
                  ? `Day ${todayEntry.dayNum} — ${todayStr}`
                  : todayStr}
              </Label>
              <div style={{ fontSize: 11, color: "var(--txt3)" }}>
                {todayTopics.length > 0 ? (
                  <>
                    <span style={{ color: SB_ACCENT, fontWeight: 700 }}>
                      {todayDone}/{todayTopics.length} done
                    </span>
                  </>
                ) : (
                  <span>No topic scheduled today — check All Topics</span>
                )}
              </div>
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 900,
                color: todayPct === 100 ? "#4caf7d" : SB_ACCENT,
              }}
            >
              {todayPct}%
            </div>
          </div>
          <SBBar
            pct={todayPct}
            color={todayPct === 100 ? "#4caf7d" : SB_ACCENT}
            height={7}
          />

          {todayPct === 100 && (
            <div
              style={{
                marginTop: 10,
                padding: "9px 12px",
                background: "#4caf7d18",
                borderRadius: 10,
                fontSize: 12,
                fontWeight: 700,
                color: "#4caf7d",
                textAlign: "center",
              }}
            >
              🎉 Today's topic done — keep the streak going!
            </div>
          )}

          {/* today topics */}
          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {todayTopics.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  color: "var(--txt3)",
                  fontSize: 13,
                  padding: 24,
                }}
              >
                No topic scheduled for today.
                <br />
                <span style={{ fontSize: 11, marginTop: 4, display: "block" }}>
                  Your plan starts on {dayPlan[0]?.date || "—"}
                </span>
              </div>
            ) : (
              todayTopics.map((t) => {
                const col = ML_CATEGORY_COLORS[t.category] || SB_ACCENT;
                const isDone = !!done[t.id];
                const hasNote = !!notes[t.id]?.trim();
                return (
                  <div
                    key={t.id}
                    onClick={() => openPopup(t, true)}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      padding: "12px 13px",
                      borderRadius: 12,
                      cursor: "pointer",
                      background: isDone ? col + "10" : "var(--bg3)",
                      border: `1px solid ${isDone ? col + "44" : "var(--border)"}`,
                      transition: "all .15s",
                    }}
                  >
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 5,
                        flexShrink: 0,
                        marginTop: 2,
                        border: `2px solid ${isDone ? col : "var(--border)"}`,
                        background: isDone ? col + "22" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {isDone && (
                        <svg
                          width="10"
                          height="8"
                          viewBox="0 0 10 8"
                          fill="none"
                        >
                          <path
                            d="M1 4L3.5 6.5L9 1"
                            stroke={col}
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            opacity="0.8"
                          />
                        </svg>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: isDone ? "var(--txt3)" : "var(--txt)",
                          textDecoration: isDone ? "line-through" : "none",
                          lineHeight: 1.35,
                          marginBottom: 4,
                        }}
                      >
                        {t.title}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: 5,
                          flexWrap: "wrap",
                          alignItems: "center",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            padding: "2px 7px",
                            borderRadius: 99,
                            background: col + "18",
                            color: col,
                            border: `1px solid ${col}33`,
                          }}
                        >
                          {t.category}
                        </span>
                        <span style={{ fontSize: 10, color: "var(--txt3)" }}>
                          ~{t.estimatedDays}d · {t.resources.length} resources
                        </span>
                        {hasNote && (
                          <span
                            style={{
                              fontSize: 9,
                              color: "#d4b44a",
                              fontWeight: 700,
                            }}
                          >
                            📝 note
                          </span>
                        )}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: 10,
                        color: SB_ACCENT,
                        fontWeight: 700,
                        flexShrink: 0,
                        padding: "3px 8px",
                        borderRadius: 6,
                        background: SB_ACCENT + "15",
                        border: `1px solid ${SB_ACCENT}33`,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Study ↗
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* upcoming preview */}
          {dayPlan.length > 0 && (
            <div style={{ marginTop: 14 }}>
              <Label>Coming Up Next</Label>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {dayPlan
                  .filter((d) => d.date > todayStr)
                  .slice(0, 3)
                  .map((d) => {
                    const col =
                      ML_CATEGORY_COLORS[d.topic.category] || SB_ACCENT;
                    return (
                      <div
                        key={d.dayNum}
                        onClick={() => openPopup(d.topic, false)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          padding: "8px 11px",
                          borderRadius: 10,
                          background: "var(--bg3)",
                          border: "1px solid var(--border)",
                          cursor: "pointer",
                          opacity: 0.75,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 800,
                            color: SB_ACCENT,
                            background: SB_ACCENT + "15",
                            border: `1px solid ${SB_ACCENT}28`,
                            padding: "2px 7px",
                            borderRadius: 99,
                            flexShrink: 0,
                          }}
                        >
                          Day {d.dayNum}
                        </span>
                        <span
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: col,
                            flexShrink: 0,
                          }}
                        />
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: "var(--txt2)",
                            flex: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {d.topic.title}
                        </span>
                        <span
                          style={{
                            fontSize: 10,
                            color: "var(--txt3)",
                            flexShrink: 0,
                          }}
                        >
                          {d.date}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          <div
            style={{
              marginTop: 10,
              padding: "8px 12px",
              background: "var(--bg3)",
              borderRadius: 10,
              fontSize: 11,
              color: "var(--txt3)",
            }}
          >
            <span style={{ fontWeight: 700, color: "var(--txt2)" }}>Tip: </span>
            Tap the topic to open resources, write notes, and mark it done.
          </div>
        </SBCard>
      )}

      {/* ════ ALL TOPICS — day-wise, no mark done ════ */}
      {view === "all" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {/* legend */}
          <div
            style={{
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              padding: "4px 2px",
            }}
          >
            {[
              [SB_ACCENT, "Today"],
              ["#4caf7d", "Completed"],
              ["#d4b44a", "Past · Missed"],
              ["var(--txt3)", "Upcoming"],
            ].map(([col, label]) => (
              <div
                key={label}
                style={{ display: "flex", alignItems: "center", gap: 4 }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: col,
                    display: "inline-block",
                  }}
                />
                <span style={{ fontSize: 10, color: "var(--txt3)" }}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          {dayPlan.map((day) => {
            const isToday = day.date === todayStr;
            const isPast = day.date < todayStr;
            const isFuture = day.date > todayStr;
            const isDone = !!done[day.topic.id];
            const hasNote = !!notes[day.topic.id]?.trim();
            const col = ML_CATEGORY_COLORS[day.topic.category] || SB_ACCENT;

            // day card border & tint
            const cardBorder = isToday
              ? `1.5px solid ${SB_ACCENT}55`
              : isDone
                ? `1px solid #4caf7d33`
                : isPast
                  ? `1px solid #d4b44a22`
                  : "1px solid var(--border)";
            const cardBg = isToday
              ? SB_ACCENT + "06"
              : isDone
                ? "#4caf7d06"
                : "var(--bg3)";

            // day num pill colour
            const pillCol = isToday
              ? SB_ACCENT
              : isDone
                ? "#4caf7d"
                : isPast
                  ? "#d4b44a"
                  : "var(--txt3)";
            const pillBg = isToday
              ? SB_ACCENT + "18"
              : isDone
                ? "#4caf7d12"
                : isPast
                  ? "#d4b44a0e"
                  : "var(--bg2)";

            return (
              <div
                key={day.dayNum}
                onClick={() => openPopup(day.topic, isToday)}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 11,
                  padding: "11px 13px",
                  borderRadius: 12,
                  cursor: "pointer",
                  background: cardBg,
                  border: cardBorder,
                  opacity: isFuture ? 0.78 : 1,
                  transition: "all .15s",
                }}
              >
                {/* day num pill (left) */}
                <div
                  style={{
                    flexShrink: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                    minWidth: 44,
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 900,
                      padding: "3px 8px",
                      borderRadius: 99,
                      background: pillBg,
                      color: pillCol,
                      border: `1px solid ${pillCol}33`,
                      whiteSpace: "nowrap",
                    }}
                  >
                    Day {day.dayNum}
                  </span>
                  <span
                    style={{
                      fontSize: 9,
                      color: "var(--txt3)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {day.date}
                  </span>
                  {isToday && (
                    <span
                      style={{
                        fontSize: 8,
                        fontWeight: 800,
                        color: SB_ACCENT,
                        textTransform: "uppercase",
                        letterSpacing: ".06em",
                      }}
                    >
                      Today
                    </span>
                  )}
                </div>

                {/* topic info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: isDone ? "var(--txt3)" : "var(--txt)",
                      textDecoration: isDone ? "line-through" : "none",
                      lineHeight: 1.35,
                      marginBottom: 4,
                    }}
                  >
                    {day.topic.title}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 5,
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        padding: "2px 6px",
                        borderRadius: 99,
                        background: col + "18",
                        color: col,
                        border: `1px solid ${col}33`,
                      }}
                    >
                      {day.topic.category}
                    </span>
                    <span style={{ fontSize: 9, color: "var(--txt3)" }}>
                      {day.topic.resources.length} resources
                    </span>
                    {hasNote && (
                      <span
                        style={{
                          fontSize: 9,
                          color: "#d4b44a",
                          fontWeight: 700,
                        }}
                      >
                        📝
                      </span>
                    )}
                  </div>
                </div>

                {/* right side indicator */}
                <div
                  style={{
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {isDone ? (
                    <span
                      style={{
                        fontSize: 11,
                        color: "#4caf7d",
                        fontWeight: 800,
                      }}
                    >
                      ✓
                    </span>
                  ) : (
                    <span
                      style={{
                        fontSize: 9,
                        color: "var(--txt3)",
                        padding: "2px 7px",
                        borderRadius: 6,
                        background: "var(--bg2)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      View ↗
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Root — handles localStorage persistence ──────────────────────────────────
export default function SkillBuilder() {
  const [setup, setSetup] = useState(() => lsGet(LS_SETUP, null));
  const [done, setDone] = useState(() => lsGet(LS_DONE, {}));
  const [notes, setNotes] = useState(() => lsGet(LS_NOTES, {}));

  // persist setup
  useEffect(() => {
    lsSet(LS_SETUP, setup);
  }, [setup]);
  // persist done
  useEffect(() => {
    lsSet(LS_DONE, done);
  }, [done]);
  // persist notes
  useEffect(() => {
    lsSet(LS_NOTES, notes);
  }, [notes]);

  function handleSetup(data) {
    const s = { ...data, startDate: new Date().toISOString().split("T")[0] };
    setSetup(s);
    // don't wipe done/notes on re-setup so progress isn't lost on minor changes
  }

  function handleToggleDone(topicId) {
    setDone((prev) => {
      const next = { ...prev, [topicId]: !prev[topicId] };
      // update streak whenever a topic is marked done
      if (next[topicId]) updateStreak(new Date().toISOString().split("T")[0]);
      return next;
    });
  }

  function handleNoteChange(topicId, text) {
    setNotes((prev) => {
      const next = { ...prev, [topicId]: text };
      lsSet(LS_NOTES, next);
      return next;
    });
  }

  function handleReset() {
    setSetup(null);
    setDone({});
    setNotes({});
    lsSet(LS_SETUP, null);
    lsSet(LS_DONE, {});
    lsSet(LS_NOTES, {});
    lsSet(LS_STREAK, { count: 0, lastDate: "" });
  }

  if (!setup)
    return (
      <SetupScreen onSubmit={handleSetup} savedSetup={lsGet(LS_SETUP, null)} />
    );

  return (
    <PlanScreen
      setup={setup}
      done={done}
      onToggleDone={handleToggleDone}
      onReset={handleReset}
      notes={notes}
      onNoteChange={handleNoteChange}
    />
  );
}
