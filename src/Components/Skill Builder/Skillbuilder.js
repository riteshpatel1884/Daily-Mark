// SkillBuilder.jsx — ML Skill Builder Section
// Completely separate from HireLab. No company, no interview date logic.
// Own state, own storage keys (__sb_done_<id>, __sb_setup)
// Two screens: SetupScreen → PlanScreen

"use client";
import { useState, useMemo } from "react";
import {
  ML_TOPICS,
  ML_CATEGORY_COLORS,
  RESOURCE_TYPE_META,
  groupTopicsByCategory,
  getTotalDays,
} from "../../lib/data/Skill Builder/ml";

// ─── colour accent for this section ──────────────────────────────────────────
const SB_ACCENT = "#7c5cbf"; // distinct purple — different from HireLab blues

// ─── shared primitives ────────────────────────────────────────────────────────
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

function Label({ children }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: ".08em",
        color: "var(--txt3)",
        marginBottom: 8,
      }}
    >
      {children}
    </div>
  );
}

function LevelBadge({ level }) {
  const map = {
    beginner: ["#4caf7d", "Beginner"],
    intermediate: ["#d4b44a", "Intermediate"],
    advanced: ["#e05252", "Advanced"],
  };
  const [col, label] = map[level] || ["#888", level];
  return (
    <span
      style={{
        fontSize: 9,
        fontWeight: 800,
        padding: "2px 7px",
        borderRadius: 99,
        background: col + "22",
        color: col,
        letterSpacing: ".04em",
      }}
    >
      {label}
    </span>
  );
}

// ─── Resource chip ────────────────────────────────────────────────────────────
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
        transition: "all .15s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor = meta.color + "88")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderColor = meta.color + "33")
      }
    >
      {/* type badge */}
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
      {/* text */}
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

// ─── Topic Row ─────────────────────────────────────────────────────────────────
// Clicking expands to show resources inline
function TopicRow({ topic, done, onToggleDone, dayNum = null }) {
  const [expanded, setExpanded] = useState(false);
  const col = ML_CATEGORY_COLORS[topic.category] || SB_ACCENT;

  return (
    <div
      style={{
        borderRadius: 12,
        border: `1px solid ${done ? col + "44" : "var(--border)"}`,
        background: done ? col + "08" : "var(--bg3)",
        overflow: "hidden",
        transition: "all .15s",
      }}
    >
      {/* header row */}
      <div
        onClick={() => setExpanded((e) => !e)}
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 10,
          padding: "11px 13px",
          cursor: "pointer",
        }}
      >
        {/* done indicator */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onToggleDone(topic.id);
          }}
          style={{
            width: 18,
            height: 18,
            borderRadius: 5,
            flexShrink: 0,
            marginTop: 2,
            border: `2px solid ${done ? col : "var(--border)"}`,
            background: done ? col : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all .15s",
            cursor: "pointer",
          }}
        >
          {done && (
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              flexWrap: "wrap",
              marginBottom: 4,
            }}
          >
            {dayNum && (
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 800,
                  color: SB_ACCENT,
                  background: SB_ACCENT + "18",
                  border: `1px solid ${SB_ACCENT}33`,
                  padding: "1px 7px",
                  borderRadius: 99,
                }}
              >
                Day {dayNum}
              </span>
            )}
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: done ? "var(--txt3)" : "var(--txt)",
                textDecoration: done ? "line-through" : "none",
                lineHeight: 1.3,
              }}
            >
              {topic.title}
            </span>
            <LevelBadge level={topic.level} />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              flexWrap: "wrap",
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
              {topic.category}
            </span>
            <span style={{ fontSize: 10, color: "var(--txt3)" }}>
              ~{topic.estimatedDays} day{topic.estimatedDays !== 1 ? "s" : ""}
            </span>
            <span style={{ fontSize: 10, color: "var(--txt3)" }}>
              {topic.resources.length} resources
            </span>
          </div>

          {!expanded && (
            <div
              style={{
                fontSize: 11,
                color: "var(--txt3)",
                marginTop: 5,
                lineHeight: 1.5,
              }}
            >
              {topic.description}
            </div>
          )}
        </div>

        {/* expand toggle */}
        <div
          style={{
            flexShrink: 0,
            width: 22,
            height: 22,
            borderRadius: 6,
            border: "1px solid var(--border)",
            background: "var(--bg2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--txt3)",
            fontSize: 12,
            fontWeight: 700,
            transition: "transform .2s",
            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          ↓
        </div>
      </div>

      {/* expanded resources */}
      {expanded && (
        <div
          style={{
            borderTop: "1px solid var(--border)",
            padding: "10px 13px 13px",
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: "var(--txt3)",
              marginBottom: 8,
              lineHeight: 1.5,
            }}
          >
            {topic.description}
          </div>
          <Label>Best Resources to Study</Label>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {topic.resources.map((r, i) => (
              <ResourceChip key={i} r={r} />
            ))}
          </div>
          {/* mark done button inside expanded */}
          <button
            onClick={() => onToggleDone(topic.id)}
            style={{
              width: "100%",
              marginTop: 12,
              padding: "10px",
              borderRadius: 9,
              border: "none",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 800,
              background: done ? "var(--bg3)" : col,
              color: done ? "var(--txt3)" : "#fff",
              transition: "all .15s",
            }}
          >
            {done ? "✓ Completed — Click to Undo" : "Mark Topic as Completed"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Setup Screen ─────────────────────────────────────────────────────────────
function SetupScreen({ onSubmit }) {
  const [deadline, setDeadline] = useState("");
  const [selectedCats, setSelectedCats] = useState(
    new Set(Object.keys(ML_CATEGORY_COLORS)),
  );

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minStr = minDate.toISOString().slice(0, 10);

  const daysLeft = deadline
    ? Math.ceil((new Date(deadline) - new Date()) / 86400000)
    : null;

  const allCats = Object.keys(ML_CATEGORY_COLORS);
  const selectedTopics = ML_TOPICS.filter((t) => selectedCats.has(t.category));
  const totalEstDays = getTotalDays(selectedTopics);

  function toggleCat(cat) {
    setSelectedCats((prev) => {
      const n = new Set(prev);
      if (n.has(cat)) {
        if (n.size > 1) n.delete(cat);
      } else n.add(cat);
      return n;
    });
  }

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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
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
            fontSize: "clamp(20px,4vw,30px)",
            fontWeight: 900,
            margin: "0 0 8px",
            letterSpacing: "-.02em",
            color: "var(--txt)",
          }}
        >
          Learn ML from scratch.
          <br />
          <span style={{ color: SB_ACCENT }}>One topic a day.</span>
        </h2>
        <p style={{ fontSize: 13, color: "var(--txt3)", margin: 0 }}>
          Curated resources for every topic — videos, articles, courses, and
          hands-on practice.
        </p>
      </div>

      {/* Categories */}
      <SBCard>
        <Label>Choose Topics to Cover</Label>
        <p style={{ fontSize: 11, color: "var(--txt3)", margin: "0 0 12px" }}>
          Select the areas you want to learn. We'll build your daily plan from
          these.
        </p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {allCats.map((cat) => {
            const col = ML_CATEGORY_COLORS[cat];
            const on = selectedCats.has(cat);
            const count = ML_TOPICS.filter((t) => t.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => toggleCat(cat)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 99,
                  cursor: "pointer",
                  border: `1.5px solid ${on ? col : "var(--border)"}`,
                  background: on ? col + "18" : "var(--bg3)",
                  color: on ? col : "var(--txt3)",
                  fontSize: 11,
                  fontWeight: 700,
                  transition: "all .15s",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                {cat}
                <span style={{ fontSize: 9, opacity: 0.7 }}>{count}</span>
              </button>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 12,
            padding: "8px 12px",
            background: "var(--bg2)",
            borderRadius: 9,
            fontSize: 11,
            color: "var(--txt3)",
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <span>
            <strong style={{ color: "var(--txt)" }}>
              {selectedTopics.length}
            </strong>{" "}
            topics selected
          </span>
          <span>
            <strong style={{ color: "var(--txt)" }}>~{totalEstDays}</strong>{" "}
            total estimated days
          </span>
        </div>
      </SBCard>

      {/* Deadline */}
      <SBCard>
        <Label>Set Your Goal Deadline</Label>
        <p style={{ fontSize: 11, color: "var(--txt3)", margin: "0 0 10px" }}>
          No interview — just a personal deadline to stay consistent. Pick a
          date you want to finish by.
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
            </span>
          </div>
        )}
      </SBCard>

      {/* Submit */}
      <button
        disabled={!deadline}
        onClick={() => onSubmit({ deadline, selectedCats: [...selectedCats] })}
        style={{
          width: "100%",
          padding: 15,
          borderRadius: 12,
          border: "none",
          fontSize: 15,
          fontWeight: 800,
          cursor: deadline ? "pointer" : "not-allowed",
          background: deadline
            ? `linear-gradient(135deg, ${SB_ACCENT}, ${SB_ACCENT}bb)`
            : "var(--bg3)",
          color: deadline ? "#fff" : "var(--txt3)",
          transition: "all .2s",
        }}
      >
        {deadline ? "Build My ML Plan →" : "Set a deadline to continue"}
      </button>
    </div>
  );
}

// ─── Plan Screen ──────────────────────────────────────────────────────────────
function PlanScreen({ setup, done, onToggleDone, onReset }) {
  const { deadline, selectedCats } = setup;

  const selectedTopics = useMemo(
    () => ML_TOPICS.filter((t) => selectedCats.includes(t.category)),
    [selectedCats],
  );

  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(deadline) - new Date()) / 86400000),
  );
  const qpd = Math.max(
    1,
    Math.ceil(
      selectedTopics.length /
        Math.max(
          1,
          Math.ceil(
            (new Date(deadline) - new Date(setup.startDate || deadline)) /
              86400000,
          ),
        ),
    ),
  );
  const dayIndex = Math.floor(Date.now() / 86400000);

  // Today's topics — cycle through selectedTopics by day
  const todayTopics = useMemo(() => {
    if (!selectedTopics.length) return [];
    const start = (dayIndex * qpd) % selectedTopics.length;
    return Array.from(
      { length: qpd },
      (_, i) => selectedTopics[(start + i) % selectedTopics.length],
    );
  }, [selectedTopics, dayIndex, qpd]);

  const totalDone = selectedTopics.filter((t) => done[t.id]).length;
  const totalPct = selectedTopics.length
    ? Math.round((totalDone / selectedTopics.length) * 100)
    : 0;
  const todayDone = todayTopics.filter((t) => done[t.id]).length;
  const todayPct = todayTopics.length
    ? Math.round((todayDone / todayTopics.length) * 100)
    : 0;
  const todayStr = new Date().toISOString().split("T")[0];

  const [view, setView] = useState("today");
  const [catFilter, setCatFilter] = useState("All");

  // Grouped for "All Topics" view
  const grouped = useMemo(
    () =>
      groupTopicsByCategory(
        catFilter === "All"
          ? selectedTopics
          : selectedTopics.filter((t) => t.category === catFilter),
      ),
    [selectedTopics, catFilter],
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Overview */}
      <SBCard>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Label style={{ marginBottom: 0 }}>ML Skill Builder</Label>
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

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 8,
            marginBottom: 12,
          }}
        >
          {[
            { label: "Topics", value: selectedTopics.length },
            { label: "Completed", value: totalDone },
            { label: "Per Day", value: qpd + "t" },
            { label: "Days Left", value: daysLeft },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: "var(--bg3)",
                borderRadius: 10,
                padding: "16px 6px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 900,
                  color: "var(--txt)",
                  lineHeight: 1,
                }}
              >
                {s.value}
              </span>
              <span
                style={{
                  fontSize: 9,
                  color: "var(--txt3)",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: ".05em",
                  textAlign: "center",
                }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
        <SBBar pct={totalPct} color={SB_ACCENT} height={6} />
        <div
          style={{
            fontSize: 10,
            color: "var(--txt3)",
            textAlign: "right",
            marginTop: 4,
          }}
        >
          {totalPct}% complete
        </div>
      </SBCard>

      {/* View tabs */}
      <div style={{ display: "flex", gap: 6 }}>
        {[
          { id: "today", label: "📅 Today" },
          { id: "all", label: "📚 All Topics" },
          { id: "progress", label: "📊 Progress" },
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

      {/* ══ TODAY ══ */}
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
              <Label style={{ marginBottom: 0 }}>Today's Topics</Label>
              <div style={{ fontSize: 11, color: "var(--txt3)", marginTop: 2 }}>
                {todayStr} ·{" "}
                <span style={{ color: SB_ACCENT, fontWeight: 700 }}>
                  {todayDone}/{todayTopics.length} done
                </span>
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
              🎉 All topics studied today — keep the streak going!
            </div>
          )}

          <div
            style={{
              marginTop: 14,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {todayTopics.map((t, i) => (
              <TopicRow
                key={t.id}
                topic={t}
                done={!!done[t.id]}
                onToggleDone={onToggleDone}
                dayNum={null}
              />
            ))}
          </div>

          {/* hint */}
          <div
            style={{
              marginTop: 12,
              padding: "8px 12px",
              background: "var(--bg3)",
              borderRadius: 10,
              fontSize: 11,
              color: "var(--txt3)",
              lineHeight: 1.5,
            }}
          >
            <span style={{ fontWeight: 700, color: "var(--txt2)" }}>Tip: </span>
            Click any topic to expand and see curated study resources. Mark it
            done after you've studied it.
          </div>
        </SBCard>
      )}

      {/* ══ ALL TOPICS ══ */}
      {view === "all" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* category filter */}
          <div
            style={{
              display: "flex",
              gap: 5,
              overflowX: "auto",
              paddingBottom: 4,
              scrollbarWidth: "none",
            }}
          >
            {["All", ...selectedCats].map((c) => {
              const col = ML_CATEGORY_COLORS[c] || SB_ACCENT;
              const qs =
                c === "All"
                  ? selectedTopics
                  : selectedTopics.filter((t) => t.category === c);
              const doneCount = qs.filter((t) => done[t.id]).length;
              const isOn = catFilter === c;
              return (
                <button
                  key={c}
                  onClick={() => setCatFilter(c)}
                  style={{
                    flexShrink: 0,
                    padding: "5px 11px",
                    borderRadius: 99,
                    cursor: "pointer",
                    border: `1.5px solid ${isOn ? col : "var(--border)"}`,
                    background: isOn ? col + "18" : "var(--bg3)",
                    color: isOn ? col : "var(--txt3)",
                    fontSize: 10,
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  {c} {doneCount}/{qs.length}
                </button>
              );
            })}
          </div>

          {Object.entries(grouped).map(([cat, topics]) => {
            const col = ML_CATEGORY_COLORS[cat] || "#888";
            const catDone = topics.filter((t) => done[t.id]).length;
            const pct = topics.length
              ? Math.round((catDone / topics.length) * 100)
              : 0;
            const barCol =
              pct < 40 ? "#e05252" : pct > 70 ? "#4caf7d" : "#d4b44a";
            return (
              <SBCard key={cat} style={{ padding: "12px 14px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: col,
                        display: "inline-block",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 800,
                        color: "var(--txt)",
                      }}
                    >
                      {cat}
                    </span>
                    <span style={{ fontSize: 10, color: "var(--txt3)" }}>
                      {topics.length} topics
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      color: barCol,
                      fontFamily: "monospace",
                    }}
                  >
                    {catDone}/{topics.length}
                  </span>
                </div>
                <SBBar pct={pct} color={col} height={4} />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 7,
                    marginTop: 10,
                  }}
                >
                  {topics.map((t) => (
                    <TopicRow
                      key={t.id}
                      topic={t}
                      done={!!done[t.id]}
                      onToggleDone={onToggleDone}
                    />
                  ))}
                </div>
              </SBCard>
            );
          })}
        </div>
      )}

      {/* ══ PROGRESS ══ */}
      {view === "progress" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* overall */}
          <SBCard>
            <Label>Overall Progress</Label>
            <div
              style={{
                fontSize: 32,
                fontWeight: 900,
                color: SB_ACCENT,
                marginBottom: 6,
              }}
            >
              {totalPct}%
            </div>
            <SBBar pct={totalPct} color={SB_ACCENT} height={8} />
            <div style={{ fontSize: 11, color: "var(--txt3)", marginTop: 6 }}>
              {totalDone} of {selectedTopics.length} topics completed ·{" "}
              {selectedTopics.length - totalDone} remaining
            </div>
          </SBCard>

          {/* level breakdown */}
          <SBCard>
            <Label>By Difficulty Level</Label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 8,
              }}
            >
              {[
                ["beginner", "#4caf7d", "Beginner"],
                ["intermediate", "#d4b44a", "Intermediate"],
                ["advanced", "#e05252", "Advanced"],
              ].map(([lvl, col, label]) => {
                const qs = selectedTopics.filter((t) => t.level === lvl);
                const d = qs.filter((t) => done[t.id]).length;
                const p = qs.length ? Math.round((d / qs.length) * 100) : 0;
                return (
                  <div
                    key={lvl}
                    style={{
                      background: "var(--bg3)",
                      borderRadius: 10,
                      padding: "12px 10px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <span style={{ fontSize: 16, fontWeight: 900, color: col }}>
                      {d}/{qs.length}
                    </span>
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        color: "var(--txt3)",
                        textTransform: "uppercase",
                        letterSpacing: ".05em",
                      }}
                    >
                      {label}
                    </span>
                    <div style={{ width: "100%" }}>
                      <SBBar pct={p} color={col} height={4} />
                    </div>
                  </div>
                );
              })}
            </div>
          </SBCard>

          {/* per category */}
          <SBCard>
            <Label>By Category</Label>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {selectedCats.map((cat) => {
                const col = ML_CATEGORY_COLORS[cat] || "#888";
                const qs = selectedTopics.filter((t) => t.category === cat);
                const d = qs.filter((t) => done[t.id]).length;
                const p = qs.length ? Math.round((d / qs.length) * 100) : 0;
                return (
                  <div key={cat}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 4,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
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
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: "var(--txt2)",
                          }}
                        >
                          {cat}
                        </span>
                      </div>
                      <span
                        style={{ fontSize: 11, fontWeight: 700, color: col }}
                      >
                        {d}/{qs.length}
                      </span>
                    </div>
                    <SBBar pct={p} color={col} height={5} />
                  </div>
                );
              })}
            </div>
          </SBCard>

          {/* deadline info */}
          <SBCard>
            <Label>Deadline</Label>
            <div
              style={{ fontSize: 13, color: "var(--txt2)", marginBottom: 6 }}
            >
              Goal: <strong style={{ color: "var(--txt)" }}>{deadline}</strong>
            </div>
            <div
              style={{ fontSize: 12, color: "var(--txt3)", lineHeight: 1.6 }}
            >
              {daysLeft > 0 ? (
                <>
                  {daysLeft} days remaining · studying{" "}
                  <strong style={{ color: SB_ACCENT }}>
                    {qpd} topic{qpd !== 1 ? "s" : ""}/day
                  </strong>{" "}
                  keeps you on track
                </>
              ) : (
                <span style={{ color: "#e05252" }}>
                  Deadline passed — reset to set a new goal
                </span>
              )}
            </div>
          </SBCard>
        </div>
      )}
    </div>
  );
}

// ─── SkillBuilder root ────────────────────────────────────────────────────────
export default function SkillBuilder() {
  // completely independent state from HireLab
  const [setup, setSetup] = useState(null); // null = show setup screen
  const [done, setDone] = useState({}); // { [topicId]: true }

  function handleSetup(data) {
    setSetup({ ...data, startDate: new Date().toISOString().split("T")[0] });
    setDone({});
  }

  function handleToggleDone(topicId) {
    setDone((prev) => ({ ...prev, [topicId]: !prev[topicId] }));
  }

  function handleReset() {
    setSetup(null);
    setDone({});
  }

  if (!setup) {
    return <SetupScreen onSubmit={handleSetup} />;
  }

  return (
    <PlanScreen
      setup={setup}
      done={done}
      onToggleDone={handleToggleDone}
      onReset={handleReset}
    />
  );
}
