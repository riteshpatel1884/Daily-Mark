// pip.PlanTab.jsx — Pattern-wise questions + Today's auto-picked session
// Logic:
//   Tier 1: Company-specific questions (always in pool automatically)
//   Tier 2: High-frequency (freq>=4) questions from other companies (suggested, user accepts/rejects)
//   Tier 3: Remaining questions — user can manually add
//   Today: picks questionsPerDay questions sequentially from active pool, cycling by day

"use client";
import { useState, useMemo } from "react";
import { Bar, Card, SectionLabel } from "./ui.js";
import {
  QUESTIONS,
  getQuestionsForCompany,
  groupByPattern,
  sortByFrequency,
} from "./QuestionDatabase/Questions.js";

// ─── constants ────────────────────────────────────────────────────────────────
const DIFF_COLOR = { Easy: "#4caf7d", Medium: "#d4b44a", Hard: "#e05252" };
const FREQ_STARS = ["", "★", "★★", "★★★", "★★★★", "★★★★★"];

// ─── atoms ────────────────────────────────────────────────────────────────────
function DiffBadge({ diff }) {
  return (
    <span
      style={{
        fontSize: 9,
        fontWeight: 800,
        padding: "2px 6px",
        borderRadius: 99,
        background: DIFF_COLOR[diff] + "22",
        color: DIFF_COLOR[diff],
        letterSpacing: ".04em",
      }}
    >
      {diff}
    </span>
  );
}

function PatternPill({ pattern }) {
  return (
    <span
      style={{
        fontSize: 9,
        fontWeight: 700,
        padding: "2px 7px",
        borderRadius: 99,
        background: "var(--bg3)",
        color: "var(--txt3)",
        border: "1px solid var(--border)",
      }}
    >
      {pattern}
    </span>
  );
}

// ─── QuestionRow ──────────────────────────────────────────────────────────────
function QuestionRow({ q, checked, onCheck, accent, showCompanies = false }) {
  return (
    <div
      onClick={() => onCheck(q.id)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "9px 12px",
        borderRadius: 10,
        cursor: "pointer",
        background: checked ? accent + "10" : "var(--bg3)",
        border: `1px solid ${checked ? accent + "44" : "var(--border)"}`,
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
          transition: "all .15s",
          border: `2px solid ${checked ? accent : "var(--border)"}`,
          background: checked ? accent : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {checked && (
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

      {/* body */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            flexWrap: "wrap",
          }}
        >
          <a
            href={q.url}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: checked ? "var(--txt3)" : "var(--txt)",
              textDecoration: checked ? "line-through" : "none",
              maxWidth: 185,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            #{q.leetcodeId} {q.title}
          </a>
          <DiffBadge diff={q.difficulty} />
          <span style={{ fontSize: 9, color: "#d4b44a" }}>
            {FREQ_STARS[q.frequency]}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            gap: 5,
            marginTop: 4,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <PatternPill pattern={q.pattern} />
          <span
            style={{ fontSize: 9, color: "var(--txt3)", fontStyle: "italic" }}
          >
            {q.topic}
          </span>
          {showCompanies && (
            <span style={{ fontSize: 9, color: "var(--txt3)" }}>
              {q.companies.slice(0, 3).join(" · ")}
            </span>
          )}
        </div>
      </div>

      {/* LC link */}
      <a
        href={q.url}
        target="_blank"
        rel="noreferrer"
        onClick={(e) => e.stopPropagation()}
        style={{
          fontSize: 10,
          color: "var(--txt3)",
          textDecoration: "none",
          flexShrink: 0,
          padding: "3px 7px",
          borderRadius: 6,
          background: "var(--bg2)",
          border: "1px solid var(--border)",
        }}
      >
        LC ↗
      </a>
    </div>
  );
}

// ─── SuggestRow (tier-2) ──────────────────────────────────────────────────────
function SuggestRow({ q, onAccept, onReject, accent }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "9px 12px",
        borderRadius: 10,
        background: "var(--bg3)",
        border: "1px solid var(--border)",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            flexWrap: "wrap",
          }}
        >
          <a
            href={q.url}
            target="_blank"
            rel="noreferrer"
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "var(--txt)",
              textDecoration: "none",
              maxWidth: 165,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            #{q.leetcodeId} {q.title}
          </a>
          <DiffBadge diff={q.difficulty} />
          <span style={{ fontSize: 9, color: "#d4b44a" }}>
            {FREQ_STARS[q.frequency]}
          </span>
        </div>
        <div
          style={{ display: "flex", gap: 5, marginTop: 3, flexWrap: "wrap" }}
        >
          <PatternPill pattern={q.pattern} />
          <span style={{ fontSize: 9, color: "var(--txt3)" }}>
            {q.companies.slice(0, 4).join(" · ")}
          </span>
        </div>
      </div>
      <button
        onClick={() => onReject(q.id)}
        style={{
          flexShrink: 0,
          width: 26,
          height: 26,
          borderRadius: 7,
          border: "1px solid var(--border)",
          background: "var(--bg2)",
          color: "#e05252",
          cursor: "pointer",
          fontWeight: 900,
          fontSize: 13,
        }}
      >
        ✕
      </button>
      <button
        onClick={() => onAccept(q.id)}
        style={{
          flexShrink: 0,
          padding: "5px 10px",
          borderRadius: 7,
          border: "none",
          background: accent,
          color: "#fff",
          cursor: "pointer",
          fontWeight: 800,
          fontSize: 11,
        }}
      >
        + Add
      </button>
    </div>
  );
}

// ─── AddRow (tier-3) ──────────────────────────────────────────────────────────
function AddRow({ q, onAdd, accent }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "9px 12px",
        borderRadius: 10,
        background: "var(--bg3)",
        border: "1px solid var(--border)",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            flexWrap: "wrap",
          }}
        >
          <a
            href={q.url}
            target="_blank"
            rel="noreferrer"
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "var(--txt)",
              textDecoration: "none",
              maxWidth: 175,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            #{q.leetcodeId} {q.title}
          </a>
          <DiffBadge diff={q.difficulty} />
          <span style={{ fontSize: 9, color: "#d4b44a" }}>
            {FREQ_STARS[q.frequency]}
          </span>
        </div>
        <div
          style={{ display: "flex", gap: 5, marginTop: 3, flexWrap: "wrap" }}
        >
          <PatternPill pattern={q.pattern} />
          <span style={{ fontSize: 9, color: "var(--txt3)" }}>
            {q.companies.slice(0, 3).join(" · ")}
          </span>
        </div>
      </div>
      <button
        onClick={() => onAdd(q.id)}
        style={{
          flexShrink: 0,
          padding: "5px 12px",
          borderRadius: 8,
          border: "none",
          background: accent,
          color: "#fff",
          fontSize: 11,
          fontWeight: 800,
          cursor: "pointer",
        }}
      >
        + Add
      </button>
    </div>
  );
}

// ─── Main PlanTab ─────────────────────────────────────────────────────────────
export default function PlanTab({
  co,
  daysLeft,
  questionsPerDay,
  setup,
  solved,
  setSolved,
}) {
  const accent = co?.color || "#5b8def";
  const company = setup?.company || "";

  // ── read pool membership from solved (special prefix keys) ──
  // __accepted_<id>  → tier-2 question accepted into pool
  // __rejected_<id>  → tier-2 suggestion dismissed
  // __extra_<id>     → tier-3 question manually added
  // __q_<id>         → question marked solved/checked

  const accepted = useMemo(
    () =>
      new Set(
        Object.keys(solved)
          .filter((k) => k.startsWith("__accepted_"))
          .map((k) => k.slice(11)),
      ),
    [solved],
  );
  const rejected = useMemo(
    () =>
      new Set(
        Object.keys(solved)
          .filter((k) => k.startsWith("__rejected_"))
          .map((k) => k.slice(11)),
      ),
    [solved],
  );
  const extras = useMemo(
    () =>
      new Set(
        Object.keys(solved)
          .filter((k) => k.startsWith("__extra_"))
          .map((k) => k.slice(8)),
      ),
    [solved],
  );

  function setKey(key) {
    setSolved((p) => ({ ...p, [key]: true }));
  }
  function delKey(key) {
    setSolved((p) => {
      const n = { ...p };
      delete n[key];
      return n;
    });
  }

  // ── Tier 1: all questions for this company ──
  const tier1 = useMemo(
    () => sortByFrequency(getQuestionsForCompany(company)),
    [company],
  );
  const tier1Ids = useMemo(() => new Set(tier1.map((q) => q.id)), [tier1]);

  // ── Tier 2: high-freq (>=4) from other companies ──
  const tier2All = useMemo(
    () =>
      sortByFrequency(
        QUESTIONS.filter((q) => q.frequency >= 4 && !tier1Ids.has(q.id)),
      ),
    [tier1Ids],
  );
  const tier2Accepted = useMemo(
    () => tier2All.filter((q) => accepted.has(q.id)),
    [tier2All, accepted],
  );
  const tier2Pending = useMemo(
    () => tier2All.filter((q) => !accepted.has(q.id) && !rejected.has(q.id)),
    [tier2All, accepted, rejected],
  );

  // ── Tier 3: everything else (not in tier1, not in tier2All) ──
  const tier2AllIds = useMemo(
    () => new Set(tier2All.map((q) => q.id)),
    [tier2All],
  );
  const tier3Pool = useMemo(
    () =>
      QUESTIONS.filter((q) => !tier1Ids.has(q.id) && !tier2AllIds.has(q.id)),
    [tier1Ids, tier2AllIds],
  );
  const tier3Added = useMemo(
    () => tier3Pool.filter((q) => extras.has(q.id)),
    [tier3Pool, extras],
  );
  const tier3Available = useMemo(
    () => tier3Pool.filter((q) => !extras.has(q.id)),
    [tier3Pool, extras],
  );

  // ── Active pool = tier1 + accepted tier2 + added tier3 (sorted by freq) ──
  const activePool = useMemo(
    () => sortByFrequency([...tier1, ...tier2Accepted, ...tier3Added]),
    [tier1, tier2Accepted, tier3Added],
  );

  // ── Today: pick questionsPerDay from active pool by cycling with day index ──
  const todayStr = new Date().toISOString().split("T")[0];
  const dayIndex = useMemo(() => Math.floor(Date.now() / 86400000), []);

  const todayQs = useMemo(() => {
    if (!activePool.length || !questionsPerDay) return [];
    const start = (dayIndex * questionsPerDay) % activePool.length;
    const result = [];
    for (let i = 0; i < questionsPerDay; i++) {
      result.push(activePool[(start + i) % activePool.length]);
    }
    return result;
  }, [activePool, dayIndex, questionsPerDay]);

  const todayDone = todayQs.filter((q) => solved[`__q_${q.id}`]).length;
  const todayPct = todayQs.length
    ? Math.round((todayDone / todayQs.length) * 100)
    : 0;

  // ── Overall stats ──
  const totalSolved = activePool.filter((q) => solved[`__q_${q.id}`]).length;
  const overallPct = activePool.length
    ? Math.round((totalSolved / activePool.length) * 100)
    : 0;

  function toggleQ(qid) {
    setSolved((p) => ({ ...p, [`__q_${qid}`]: !p[`__q_${qid}`] }));
  }

  // ── UI state ──
  const [view, setView] = useState("today");
  const [patternFilter, setPatternFilter] = useState("All");
  const [showTier2, setShowTier2] = useState(true);
  const [addSearch, setAddSearch] = useState("");
  const [addPatFilter, setAddPatFilter] = useState("All");

  // pattern groups for active pool
  const patternGroups = useMemo(() => groupByPattern(activePool), [activePool]);
  const allPatterns = useMemo(
    () => ["All", ...Object.keys(patternGroups).sort()],
    [patternGroups],
  );
  const filteredGroups =
    patternFilter === "All"
      ? Object.entries(patternGroups)
      : Object.entries(patternGroups).filter(([p]) => p === patternFilter);

  // tier3 filtered for add panel
  const addPatterns = useMemo(
    () => ["All", ...new Set(tier3Available.map((q) => q.pattern))],
    [tier3Available],
  );
  const addFiltered = useMemo(
    () =>
      tier3Available.filter((q) => {
        const matchS =
          !addSearch ||
          q.title.toLowerCase().includes(addSearch.toLowerCase()) ||
          q.pattern.toLowerCase().includes(addSearch.toLowerCase()) ||
          q.topic.toLowerCase().includes(addSearch.toLowerCase());
        const matchP = addPatFilter === "All" || q.pattern === addPatFilter;
        return matchS && matchP;
      }),
    [tier3Available, addSearch, addPatFilter],
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* ── Overview stats ── */}
      <Card>
        <SectionLabel>Prep Overview</SectionLabel>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 8,
            marginBottom: 12,
          }}
        >
          {[
            { label: "In Pool", value: activePool.length, icon: "📚" },
            { label: "Solved", value: totalSolved, icon: "✅" },
            { label: "Per Day", value: questionsPerDay, icon: "📋" },
            { label: "Overall", value: overallPct + "%", icon: "📈" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: "var(--bg3)",
                borderRadius: 10,
                padding: "10px 6px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span style={{ fontSize: 18 }}>{s.icon}</span>
              <span
                style={{
                  fontSize: 17,
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
        <Bar pct={overallPct} color={accent} height={6} />
      </Card>

      {/* ── View tabs ── */}
      <div style={{ display: "flex", gap: 6 }}>
        {[
          { id: "today", label: "📅 Today" },
          { id: "patterns", label: "🧩 Patterns" },
          { id: "add", label: "➕ Add Questions" },
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
              border: `1.5px solid ${view === v.id ? accent : "var(--border)"}`,
              background: view === v.id ? accent + "18" : "var(--bg3)",
              color: view === v.id ? accent : "var(--txt3)",
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {v.label}
          </button>
        ))}
      </div>

      {/* ════════════════ TODAY ════════════════ */}
      {view === "today" && (
        <Card>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <div>
              <SectionLabel style={{ marginBottom: 0 }}>
                Today's Session
              </SectionLabel>
              <div style={{ fontSize: 11, color: "var(--txt3)", marginTop: 2 }}>
                {todayStr} ·{" "}
                <span style={{ color: accent, fontWeight: 700 }}>
                  {todayDone}/{todayQs.length} done
                </span>
              </div>
            </div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 900,
                color: todayPct === 100 ? "#4caf7d" : accent,
              }}
            >
              {todayPct}%
            </div>
          </div>
          <Bar
            pct={todayPct}
            color={todayPct === 100 ? "#4caf7d" : accent}
            height={8}
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
              🎉 All done for today! Great work — consistency is key!
            </div>
          )}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 7,
              marginTop: 12,
            }}
          >
            {todayQs.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  color: "var(--txt3)",
                  fontSize: 13,
                  padding: 24,
                }}
              >
                No questions in your pool yet. Go to ➕ Add Questions to set up
                your plan.
              </div>
            ) : (
              todayQs.map((q) => (
                <QuestionRow
                  key={q.id}
                  q={q}
                  checked={!!solved[`__q_${q.id}`]}
                  onCheck={toggleQ}
                  accent={accent}
                />
              ))
            )}
          </div>

          {todayQs.length > 0 && (
            <div
              style={{
                marginTop: 12,
                padding: "8px 12px",
                background: "var(--bg3)",
                borderRadius: 10,
                fontSize: 11,
                color: "var(--txt3)",
              }}
            >
              <span style={{ fontWeight: 700, color: "var(--txt2)" }}>
                Today's patterns:{" "}
              </span>
              {[...new Set(todayQs.map((q) => q.pattern))].join(" · ")}
            </div>
          )}
        </Card>
      )}

      {/* ════════════════ PATTERNS ════════════════ */}
      {view === "patterns" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* tier summary badges */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: 10,
                padding: "3px 9px",
                borderRadius: 99,
                fontWeight: 700,
                background: accent + "20",
                color: accent,
              }}
            >
              🏢 {tier1.length} {company}
            </span>
            <span
              style={{
                fontSize: 10,
                padding: "3px 9px",
                borderRadius: 99,
                fontWeight: 700,
                background: "#4caf7d20",
                color: "#4caf7d",
              }}
            >
              ⭐ {tier2Accepted.length} high-freq
            </span>
            <span
              style={{
                fontSize: 10,
                padding: "3px 9px",
                borderRadius: 99,
                fontWeight: 700,
                background: "#9b72cf20",
                color: "#9b72cf",
              }}
            >
              ➕ {tier3Added.length} extra
            </span>
          </div>

          {/* pattern filter chips */}
          <div
            style={{
              display: "flex",
              gap: 5,
              overflowX: "auto",
              paddingBottom: 2,
              scrollbarWidth: "none",
            }}
          >
            {allPatterns.map((p) => {
              const qs = p === "All" ? activePool : patternGroups[p] || [];
              const done = qs.filter((q) => solved[`__q_${q.id}`]).length;
              return (
                <button
                  key={p}
                  onClick={() => setPatternFilter(p)}
                  style={{
                    flexShrink: 0,
                    padding: "5px 10px",
                    borderRadius: 99,
                    cursor: "pointer",
                    border: `1.5px solid ${patternFilter === p ? accent : "var(--border)"}`,
                    background:
                      patternFilter === p ? accent + "18" : "var(--bg3)",
                    color: patternFilter === p ? accent : "var(--txt3)",
                    fontSize: 10,
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  {p} {done}/{qs.length}
                </button>
              );
            })}
          </div>

          {activePool.length === 0 && (
            <Card>
              <div
                style={{
                  textAlign: "center",
                  color: "var(--txt3)",
                  fontSize: 13,
                  padding: 20,
                }}
              >
                Your pool is empty. Go to ➕ Add Questions to build your plan.
              </div>
            </Card>
          )}

          {filteredGroups.map(([pattern, qs]) => {
            const done = qs.filter((q) => solved[`__q_${q.id}`]).length;
            const pct = qs.length ? Math.round((done / qs.length) * 100) : 0;
            const col = pct < 40 ? "#e05252" : pct > 70 ? "#4caf7d" : "#d4b44a";
            return (
              <Card key={pattern} style={{ padding: "12px 14px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 7,
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 800,
                        color: "var(--txt)",
                      }}
                    >
                      🧩 {pattern}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        color: "var(--txt3)",
                        marginLeft: 6,
                      }}
                    >
                      {qs.length} questions
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 800,
                      color: col,
                      fontFamily: "monospace",
                    }}
                  >
                    {done}/{qs.length}
                  </span>
                </div>
                <Bar pct={pct} color={col} height={4} />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    marginTop: 10,
                  }}
                >
                  {sortByFrequency(qs).map((q) => (
                    <QuestionRow
                      key={q.id}
                      q={q}
                      checked={!!solved[`__q_${q.id}`]}
                      onCheck={toggleQ}
                      accent={accent}
                      showCompanies
                    />
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ════════════════ ADD QUESTIONS ════════════════ */}
      {view === "add" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* ── Tier 2: High-freq suggestions ── */}
          <Card>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <div>
                <SectionLabel style={{ marginBottom: 0 }}>
                  ⭐ High-Frequency Suggestions
                </SectionLabel>
                <div
                  style={{ fontSize: 10, color: "var(--txt3)", marginTop: 2 }}
                >
                  Freq ★★★★+ questions asked across top companies
                </div>
              </div>
              <button
                onClick={() => setShowTier2((p) => !p)}
                style={{
                  background: "var(--bg3)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: "4px 10px",
                  color: "var(--txt3)",
                  cursor: "pointer",
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                {showTier2 ? "Hide" : `Show (${tier2Pending.length})`}
              </button>
            </div>

            {tier2Accepted.length > 0 && (
              <div
                style={{
                  padding: "7px 10px",
                  background: "#4caf7d12",
                  borderRadius: 9,
                  marginBottom: 8,
                  fontSize: 11,
                  color: "#4caf7d",
                  fontWeight: 700,
                }}
              >
                ✓ {tier2Accepted.length} high-freq question
                {tier2Accepted.length > 1 ? "s" : ""} added to your pool
              </div>
            )}

            {showTier2 &&
              (tier2Pending.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    color: "var(--txt3)",
                    fontSize: 12,
                    padding: "12px 0",
                  }}
                >
                  {tier2Accepted.length > 0
                    ? "All suggestions reviewed ✓"
                    : "No pending suggestions."}
                </div>
              ) : (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 6 }}
                >
                  <button
                    onClick={() =>
                      tier2Pending.forEach((q) => setKey(`__accepted_${q.id}`))
                    }
                    style={{
                      padding: "7px",
                      borderRadius: 9,
                      border: "1.5px solid #4caf7d",
                      background: "#4caf7d18",
                      color: "#4caf7d",
                      fontWeight: 800,
                      fontSize: 11,
                      cursor: "pointer",
                      marginBottom: 2,
                    }}
                  >
                    ✓ Accept All {tier2Pending.length} Suggestions
                  </button>
                  {tier2Pending.map((q) => (
                    <SuggestRow
                      key={q.id}
                      q={q}
                      accent={accent}
                      onAccept={(id) => setKey(`__accepted_${id}`)}
                      onReject={(id) => setKey(`__rejected_${id}`)}
                    />
                  ))}
                </div>
              ))}
          </Card>

          {/* ── Tier 3: Manual add ── */}
          <Card>
            <SectionLabel>➕ Add More Questions</SectionLabel>
            <div
              style={{ fontSize: 10, color: "var(--txt3)", marginBottom: 10 }}
            >
              {tier3Available.length} available · {tier3Added.length} added to
              pool
            </div>

            <input
              value={addSearch}
              onChange={(e) => setAddSearch(e.target.value)}
              placeholder="Search by title, pattern, topic…"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "9px 12px",
                borderRadius: 10,
                border: "1.5px solid var(--border)",
                background: "var(--bg3)",
                color: "var(--txt)",
                fontSize: 12,
                outline: "none",
                marginBottom: 8,
              }}
            />

            <div
              style={{
                display: "flex",
                gap: 5,
                overflowX: "auto",
                paddingBottom: 6,
                scrollbarWidth: "none",
              }}
            >
              {addPatterns.map((p) => (
                <button
                  key={p}
                  onClick={() => setAddPatFilter(p)}
                  style={{
                    flexShrink: 0,
                    padding: "4px 10px",
                    borderRadius: 99,
                    cursor: "pointer",
                    border: `1.5px solid ${addPatFilter === p ? accent : "var(--border)"}`,
                    background:
                      addPatFilter === p ? accent + "18" : "var(--bg3)",
                    color: addPatFilter === p ? accent : "var(--txt3)",
                    fontSize: 10,
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {addFiltered.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    color: "var(--txt3)",
                    fontSize: 12,
                    padding: "14px 0",
                  }}
                >
                  No questions found.
                </div>
              )}
              {addFiltered.map((q) => (
                <AddRow
                  key={q.id}
                  q={q}
                  accent={accent}
                  onAdd={(id) => setKey(`__extra_${id}`)}
                />
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
