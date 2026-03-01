"use client";
// ─────────────────────────────────────────────────────────────────────────────
// PlacementPrepView.jsx  —  Pattern-based DSA tracker
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useMemo, useEffect, useCallback } from "react";
import {
  DSA_QUESTIONS,
  DSA_TOPICS,
  CORE_SUBJECTS,
  SKILL_CATEGORIES,
  COMPANY_TIERS,
  APP_STATUS,
  STATUS_COLORS,
  INTERVIEW_ROUNDS,
  DIFF_CONFIG,
  RESUME_CHECKLIST,
  RESUME_TIPS,
  SKILL_LEVELS,
} from "../lib/data/data";

// ── localStorage helpers ──────────────────────────────────────────────────────
function load(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null") ?? fallback;
  } catch {
    return fallback;
  }
}
function save(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {}
}

// ── Question count helpers ────────────────────────────────────────────────────
function getTotalQuestions() {
  return DSA_TOPICS.reduce((s, t) => s + (DSA_QUESTIONS[t.id] || []).length, 0);
}
function getSolvedCount(questionDone) {
  return DSA_TOPICS.reduce(
    (s, t) =>
      s + (DSA_QUESTIONS[t.id] || []).filter((q) => questionDone[q.id]).length,
    0,
  );
}
function calcReadinessScore(questionDone) {
  const total = getTotalQuestions();
  const done = getSolvedCount(questionDone);
  return total > 0 ? Math.round((done / total) * 100) : 0;
}

// ── Activity log ──────────────────────────────────────────────────────────────
function logActivity(count = 1) {
  const today = new Date().toISOString().split("T")[0];
  const log = load("pp_activity_log", {});
  log[today] = (log[today] || 0) + count;
  save("pp_activity_log", log);
}

function getMomentum() {
  const log = load("pp_activity_log", {});
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    return d.toISOString().split("T")[0];
  });
  const week = days.map((d) => log[d] || 0);
  const recent3 = week.slice(0, 3).reduce((a, b) => a + b, 0);
  const prior4 = week.slice(3).reduce((a, b) => a + b, 0);
  const activeDays = week.filter((v) => v > 0).length;
  const total7 = week.reduce((a, b) => a + b, 0);
  if (total7 === 0)
    return {
      label: "No Activity",
      icon: "◦",
      color: "var(--txt3)",
      trend: 0,
      activeDays,
      total7,
    };
  if (recent3 > prior4 * 1.2)
    return {
      label: "Increasing",
      icon: "↑",
      color: "#4caf7d",
      trend: 1,
      activeDays,
      total7,
    };
  if (prior4 > recent3 * 1.2)
    return {
      label: "Dropping",
      icon: "↓",
      color: "#ef4444",
      trend: -1,
      activeDays,
      total7,
    };
  return {
    label: "Stable",
    icon: "→",
    color: "#d4b44a",
    trend: 0,
    activeDays,
    total7,
  };
}

function getWeakTopics(questionDone, topicLastSeen) {
  const now = Date.now();
  const STALE_DAYS = 12;
  return DSA_TOPICS.map((topic) => {
    const qs = DSA_QUESTIONS[topic.id] || [];
    const done = qs.filter((q) => questionDone[q.id]).length;
    const pct = qs.length > 0 ? done / qs.length : 1;
    const lastSeen = topicLastSeen[topic.id] || 0;
    const daysSince = lastSeen ? Math.floor((now - lastSeen) / 86400000) : 999;
    const isStale = daysSince > STALE_DAYS;
    const isWeak = pct < 0.4;
    return {
      ...topic,
      pct,
      done,
      total: qs.length,
      daysSince,
      isStale,
      isWeak,
      alert: isWeak || isStale,
    };
  }).filter((t) => t.alert);
}

// ── Pace Engine ───────────────────────────────────────────────────────────────
function calcPace(targetDate, questionDone) {
  if (!targetDate) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(targetDate);
  const daysLeft = Math.max(1, Math.ceil((target - now) / 86400000));
  const totalQ = getTotalQuestions();
  const doneQ = getSolvedCount(questionDone);
  const remaining = totalQ - doneQ;
  const requiredPerDay = remaining / daysLeft;
  const log = load("pp_activity_log", {});
  const today = new Date().toISOString().split("T")[0];
  const allLoggedDays = Object.keys(log).sort();
  const firstDay = allLoggedDays.length > 0 ? allLoggedDays[0] : today;
  const msPerDay = 86400000;
  const daysSinceStart = Math.max(
    1,
    Math.floor((new Date(today) - new Date(firstDay)) / msPerDay) + 1,
  );
  const totalActivity = Object.values(log).reduce((a, b) => a + b, 0);
  const actualPerDay = totalActivity / daysSinceStart;
  const projectedFinishDays =
    actualPerDay > 0 ? Math.ceil(remaining / actualPerDay) : Infinity;
  const projectedDate = new Date(now);
  projectedDate.setDate(projectedDate.getDate() + projectedFinishDays);
  const lateDays = projectedFinishDays - daysLeft;
  return {
    daysLeft,
    totalQ,
    doneQ,
    remaining,
    requiredPerDay,
    actualPerDay,
    projectedFinishDays,
    lateDays,
    projectedDate,
  };
}

// ── Milestones ────────────────────────────────────────────────────────────────
function getMilestones(questionDone) {
  const milestones = [];
  DSA_TOPICS.forEach((topic) => {
    const qs = DSA_QUESTIONS[topic.id] || [];
    if (!qs.length) return;
    const done = qs.filter((q) => questionDone[q.id]).length;
    const pct = done / qs.length;
    if (pct >= 0.8) milestones.push({ ...topic, status: "mastered", pct });
    else if (pct >= 0.5) milestones.push({ ...topic, status: "halfway", pct });
    else if (pct > 0) milestones.push({ ...topic, status: "started", pct });
  });
  return milestones;
}

// ── Unique pattern tags ───────────────────────────────────────────────────────
const PATTERN_TAGS = [
  "All",
  ...Array.from(new Set(DSA_TOPICS.map((t) => t.tag).filter(Boolean))),
];

// ── Shared primitives ─────────────────────────────────────────────────────────
function Check({ size = 11 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function Ring({ pct, size = 56, stroke = 5, color = "#5b8def" }) {
  const r = (size - stroke) / 2,
    c = 2 * Math.PI * r;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ transform: "rotate(-90deg)", flexShrink: 0 }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--bg3)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={`${(pct / 100) * c} ${c}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray .6s ease" }}
      />
    </svg>
  );
}

function ProgressRing({ pct, size, color, label }) {
  return (
    <div
      style={{ position: "relative", width: size, height: size, flexShrink: 0 }}
    >
      <Ring pct={pct} size={size} stroke={6} color={color} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: size * 0.22,
            fontWeight: 800,
            color: "var(--txt)",
            fontFamily: "var(--mono)",
            lineHeight: 1,
          }}
        >
          {pct}%
        </div>
        {label && (
          <div
            style={{
              fontSize: size * 0.13,
              color: "var(--txt3)",
              marginTop: 2,
            }}
          >
            {label}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Pace Banner ───────────────────────────────────────────────────────────────
function PaceBanner({ pace }) {
  if (!pace) return null;
  const {
    daysLeft,
    remaining,
    requiredPerDay,
    actualPerDay,
    lateDays,
    projectedDate,
  } = pace;
  const isLate = lateDays > 3;
  const isAhead = lateDays < -3;
  const accent = isLate ? "#ef4444" : isAhead ? "#4caf7d" : "#d4b44a";
  const bg = isLate
    ? "rgba(239,68,68,0.06)"
    : isAhead
      ? "rgba(76,175,125,0.06)"
      : "rgba(212,180,74,0.06)";
  const border = isLate ? "#ef444430" : isAhead ? "#4caf7d30" : "#d4b44a30";
  const reqStr = requiredPerDay.toFixed(1);
  const actStr = actualPerDay.toFixed(1);
  const projStr = projectedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const absDiff = Math.abs(Math.round(lateDays));

  return (
    <div
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 14,
        padding: "14px 16px",
        marginBottom: 14,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: ".1em",
            textTransform: "uppercase",
            color: accent,
          }}
        >
          ⚡ Pace Tracker
        </span>
        <span
          style={{
            fontSize: 11,
            color: "var(--txt3)",
            fontFamily: "var(--mono)",
          }}
        >
          {daysLeft}d left · {remaining} questions to go
        </span>
      </div>
      {isLate && lateDays !== Infinity && (
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#ef4444",
            marginBottom: 10,
            lineHeight: 1.4,
          }}
        >
          At current pace you'll finish <strong>{absDiff} days late</strong> —{" "}
          {projStr}
        </div>
      )}
      {isAhead && (
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#4caf7d",
            marginBottom: 10,
            lineHeight: 1.4,
          }}
        >
          On track — projected to finish <strong>{absDiff} days early</strong>.
          Keep going.
        </div>
      )}
      {!isLate && !isAhead && (
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#d4b44a",
            marginBottom: 10,
            lineHeight: 1.4,
          }}
        >
          Barely on pace — one slack week and you slip behind.
        </div>
      )}
      <div style={{ display: "flex", gap: 6 }}>
        {[
          {
            label: "Need / day",
            value: `${reqStr} q/day`,
            color: accent,
            sub: "to finish on time",
          },
          {
            label: "Your avg (7d)",
            value: actualPerDay > 0 ? `${actStr} q/day` : "—",
            color: actualPerDay >= requiredPerDay ? "#4caf7d" : "#ef4444",
            sub: "last 7 days",
          },
          {
            label: "Projected finish",
            value: lateDays === Infinity ? "Unknown" : projStr,
            color: "var(--txt2)",
            sub: isLate
              ? `${absDiff}d late`
              : isAhead
                ? `${absDiff}d early`
                : "on time",
          },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              flex: 1,
              background: "var(--bg3)",
              borderRadius: 10,
              padding: "10px 10px 8px",
            }}
          >
            <div
              style={{
                fontSize: 9,
                color: "var(--txt3)",
                fontWeight: 700,
                letterSpacing: ".06em",
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              {s.label}
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 800,
                color: s.color,
                fontFamily: "var(--mono)",
                lineHeight: 1,
                marginBottom: 2,
              }}
            >
              {s.value}
            </div>
            <div style={{ fontSize: 9, color: "var(--txt3)" }}>{s.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Momentum Card ─────────────────────────────────────────────────────────────
function MomentumCard({ momentum }) {
  const { label, icon, color, activeDays, total7 } = momentum;
  const log = load("pp_activity_log", {});
  const bars = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().split("T")[0];
    return {
      val: log[key] || 0,
      day: d.toLocaleDateString("en", { weekday: "short" }),
    };
  });
  const max = Math.max(...bars.map((b) => b.val), 1);
  return (
    <div
      style={{
        background: "var(--bg2)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        padding: "14px 16px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              color: "var(--txt3)",
              marginBottom: 2,
            }}
          >
            Momentum
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color }}>
            {icon} {label}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: "var(--txt3)" }}>Last 7 days</div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: "var(--txt)",
              fontFamily: "var(--mono)",
            }}
          >
            {total7} q
          </div>
          <div style={{ fontSize: 10, color: "var(--txt3)" }}>
            {activeDays}/7 active days
          </div>
        </div>
      </div>
      <div
        style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 36 }}
      >
        {bars.map((b, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <div
              style={{
                width: "100%",
                borderRadius: 3,
                height:
                  b.val > 0 ? `${Math.max(6, (b.val / max) * 32)}px` : "3px",
                background: b.val > 0 ? color : "var(--border)",
                transition: "height .4s ease",
              }}
            />
            <div style={{ fontSize: 8, color: "var(--txt3)" }}>{b.day}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Weak Topics Alert ─────────────────────────────────────────────────────────
function WeakTopicsAlert({ weakTopics }) {
  if (!weakTopics.length) return null;
  return (
    <div
      style={{
        background: "rgba(239,68,68,0.05)",
        border: "1px solid rgba(239,68,68,0.15)",
        borderRadius: 14,
        padding: "14px 16px",
        marginBottom: 14,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: ".1em",
          textTransform: "uppercase",
          color: "#ef4444",
          marginBottom: 10,
        }}
      >
        ⚠ Patterns Needing Attention
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {weakTopics.slice(0, 4).map((t) => (
          <div
            key={t.id}
            style={{ display: "flex", alignItems: "center", gap: 10 }}
          >
            <span style={{ fontSize: 13, marginRight: 2 }}>{t.icon}</span>
            <div style={{ flex: 1, fontSize: 12, color: "var(--txt2)" }}>
              {t.label}
            </div>
            {t.isStale && t.daysSince < 999 && (
              <span
                style={{
                  fontSize: 10,
                  color: "#e8924a",
                  fontWeight: 700,
                  background: "rgba(232,146,74,0.1)",
                  padding: "2px 7px",
                  borderRadius: 5,
                }}
              >
                {t.daysSince}d untouched
              </span>
            )}
            {t.isWeak && (
              <span
                style={{
                  fontSize: 10,
                  color: "#ef4444",
                  fontWeight: 700,
                  background: "rgba(239,68,68,0.08)",
                  padding: "2px 7px",
                  borderRadius: 5,
                }}
              >
                {Math.round(t.pct * 100)}% done
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Milestone Grid ────────────────────────────────────────────────────────────
function MilestoneGrid({ questionDone }) {
  const milestones = getMilestones(questionDone);
  const mastered = milestones.filter((m) => m.status === "mastered");
  const halfway = milestones.filter((m) => m.status === "halfway");
  const started = milestones.filter((m) => m.status === "started");
  const untouched = DSA_TOPICS.length - milestones.length;
  return (
    <div
      style={{
        background: "var(--bg2)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        padding: "14px 16px",
        marginBottom: 14,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: ".1em",
          textTransform: "uppercase",
          color: "var(--txt3)",
          marginBottom: 10,
        }}
      >
        Pattern Milestones
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 8,
        }}
      >
        {[
          {
            val: mastered.length,
            label: "Mastered",
            color: "#4caf7d",
            icon: "★",
          },
          {
            val: halfway.length,
            label: "Halfway",
            color: "#5b8def",
            icon: "◑",
          },
          {
            val: started.length,
            label: "Started",
            color: "#e8924a",
            icon: "◔",
          },
          {
            val: untouched,
            label: "Untouched",
            color: "var(--txt3)",
            icon: "○",
          },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              textAlign: "center",
              padding: "10px 8px",
              background: "var(--bg)",
              borderRadius: 10,
              border: "1px solid var(--border)",
            }}
          >
            <div style={{ fontSize: 18, marginBottom: 2 }}>{s.icon}</div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: s.color,
                fontFamily: "var(--mono)",
              }}
            >
              {s.val}
            </div>
            <div
              style={{
                fontSize: 9,
                color: "var(--txt3)",
                fontWeight: 600,
                letterSpacing: ".05em",
                textTransform: "uppercase",
                marginTop: 2,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
      {mastered.length > 0 && (
        <div
          style={{ marginTop: 10, display: "flex", gap: 5, flexWrap: "wrap" }}
        >
          {mastered.map((m) => (
            <span
              key={m.id}
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: "3px 8px",
                borderRadius: 6,
                background: "rgba(76,175,125,0.1)",
                color: "#4caf7d",
              }}
            >
              {m.icon} {m.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Question Modal ────────────────────────────────────────────────────────────
function QuestionModal({ topic, doneMap, onToggle, onClose }) {
  const questions = DSA_QUESTIONS[topic.id] || [];
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const doneCount = questions.filter((q) => doneMap[q.id]).length;
  const pct = Math.round((doneCount / questions.length) * 100);
  const topicColor =
    pct === 100
      ? "#4caf7d"
      : pct >= 60
        ? "#5b8def"
        : pct >= 30
          ? "#e8924a"
          : "#ef4444";
  const filtered = questions.filter(
    (q) =>
      (filter === "All" || q.difficulty === filter) &&
      (!search || q.title.toLowerCase().includes(search.toLowerCase())),
  );
  const diffCounts = { Easy: 0, Medium: 0, Hard: 0 };
  questions.forEach((q) => diffCounts[q.difficulty]++);

  useEffect(() => {
    const fn = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        backdropFilter: "blur(8px)",
        zIndex: 99999,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "var(--bg)",
          border: "1px solid var(--border)",
          borderRadius: "0 0 20px 20px",
          width: "100%",
          maxWidth: 600,
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "18px 20px 14px",
            borderBottom: "1px solid var(--border)",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 4,
                }}
              >
                <span style={{ fontSize: 20 }}>{topic.icon}</span>
                <div
                  style={{ fontSize: 16, fontWeight: 800, color: "var(--txt)" }}
                >
                  {topic.label}
                </div>
                {topic.tag && (
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      padding: "2px 8px",
                      borderRadius: 5,
                      background: "rgba(91,141,239,0.12)",
                      color: "#5b8def",
                      letterSpacing: ".06em",
                    }}
                  >
                    {topic.tag}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 11, color: "var(--txt3)" }}>
                {doneCount}/{questions.length} solved
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 9,
                border: "1px solid var(--border)",
                background: "var(--bg2)",
                color: "var(--txt3)",
                cursor: "pointer",
                fontSize: 16,
              }}
            >
              ✕
            </button>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                flex: 1,
                height: 6,
                background: "var(--bg3)",
                borderRadius: 99,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${pct}%`,
                  background: topicColor,
                  borderRadius: 99,
                  transition: "width .4s",
                }}
              />
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: topicColor,
                fontFamily: "var(--mono)",
              }}
            >
              {pct}%
            </span>
          </div>
          <div
            style={{
              display: "flex",
              gap: 6,
              marginBottom: 10,
              flexWrap: "wrap",
            }}
          >
            {Object.entries(diffCounts).map(([d, cnt]) => {
              const dc = DIFF_CONFIG[d];
              const doneCnt = questions.filter(
                (q) => q.difficulty === d && doneMap[q.id],
              ).length;
              return (
                <div
                  key={d}
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: 6,
                    background: dc.bg,
                    color: dc.color,
                    border: `1px solid ${dc.color}33`,
                  }}
                >
                  {d}: {doneCnt}/{cnt}
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              style={{
                flex: "1 1 120px",
                background: "var(--bg2)",
                border: "1px solid var(--border)",
                borderRadius: 9,
                padding: "7px 12px",
                fontSize: 12,
                color: "var(--txt)",
                outline: "none",
                fontFamily: "var(--mono)",
              }}
            />
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {["All", "Easy", "Medium", "Hard"].map((f) => {
                const dc = f === "All" ? null : DIFF_CONFIG[f];
                return (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 8,
                      fontSize: 11,
                      fontWeight: filter === f ? 700 : 400,
                      cursor: "pointer",
                      border: `1px solid ${filter === f ? dc?.color || "var(--txt)" : "var(--border)"}`,
                      background:
                        filter === f ? dc?.bg || "var(--txt)" : "transparent",
                      color:
                        filter === f ? dc?.color || "var(--bg)" : "var(--txt3)",
                    }}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        {/* List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 20px 24px" }}>
          {filtered.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "32px 0",
                color: "var(--txt3)",
                fontSize: 13,
              }}
            >
              No matches
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {filtered.map((q, i) => {
                const done = !!doneMap[q.id];
                const dc = DIFF_CONFIG[q.difficulty];
                return (
                  <div
                    key={q.id}
                    onClick={() => onToggle(q.id)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "11px 14px",
                      borderRadius: 10,
                      background: done ? "#4caf7d0a" : "var(--bg2)",
                      border: `1px solid ${done ? "#4caf7d25" : "var(--border)"}`,
                      cursor: "pointer",
                      transition: "all .15s",
                      userSelect: "none",
                    }}
                  >
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 7,
                        border: `1.5px solid ${done ? "#4caf7d" : "var(--border2)"}`,
                        background: done ? "#4caf7d" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {done && <Check />}
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        color: "var(--txt3)",
                        fontFamily: "var(--mono)",
                        width: 20,
                        flexShrink: 0,
                        textAlign: "right",
                      }}
                    >
                      {i + 1}.
                    </span>
                    <span
                      style={{
                        flex: 1,
                        fontSize: 13,
                        fontWeight: done ? 600 : 400,
                        color: done ? "#4caf7d" : "var(--txt2)",
                        wordBreak: "break-word",
                        minWidth: 0,
                      }}
                    >
                      {q.title}
                    </span>
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 800,
                        padding: "2px 7px",
                        borderRadius: 5,
                        background: dc.bg,
                        color: dc.color,
                        flexShrink: 0,
                      }}
                    >
                      {q.difficulty[0]}
                    </span>
                    <a
                      href={q.leetcode}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        fontSize: 11,
                        color: "var(--txt3)",
                        textDecoration: "none",
                        flexShrink: 0,
                        padding: "3px 7px",
                        borderRadius: 6,
                        border: "1px solid var(--border)",
                        background: "var(--bg)",
                      }}
                    >
                      ↗
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div
          style={{
            padding: "12px 20px",
            borderTop: "1px solid var(--border)",
            flexShrink: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() => questions.forEach((q) => onToggle(q.id, true))}
              style={{
                fontSize: 12,
                padding: "7px 14px",
                borderRadius: 9,
                border: "1px solid var(--border)",
                background: "var(--bg2)",
                color: "var(--txt3)",
                cursor: "pointer",
              }}
            >
              Mark All
            </button>
            <button
              onClick={() => questions.forEach((q) => onToggle(q.id, false))}
              style={{
                fontSize: 12,
                padding: "7px 14px",
                borderRadius: 9,
                border: "1px solid var(--border)",
                background: "var(--bg2)",
                color: "var(--txt3)",
                cursor: "pointer",
              }}
            >
              Reset
            </button>
          </div>
          <button
            onClick={onClose}
            style={{
              fontSize: 13,
              padding: "8px 20px",
              borderRadius: 9,
              border: "none",
              background: "var(--txt)",
              color: "var(--bg)",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// ── DSA Tab ───────────────────────────────────────────────────────────────────
function DSATab({ onSolve }) {
  const [questionDone, setQuestionDone] = useState(() =>
    load("pp_dsa_qdone", {}),
  );
  const [topicLastSeen, setTopicLastSeen] = useState(() =>
    load("pp_topic_last_seen", {}),
  );
  const [openTopic, setOpenTopic] = useState(null);
  const [targetDate, setTargetDate] = useState(() =>
    load("pp_target_date", ""),
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateInput, setDateInput] = useState(targetDate);
  const [activeTag, setActiveTag] = useState("All");

  const dsaScore = useMemo(
    () => calcReadinessScore(questionDone),
    [questionDone],
  );
  const pace = useMemo(
    () => calcPace(targetDate, questionDone),
    [targetDate, questionDone],
  );
  const momentum = useMemo(() => getMomentum(), []);
  const weakTopics = useMemo(
    () => getWeakTopics(questionDone, topicLastSeen),
    [questionDone, topicLastSeen],
  );

  const totalSolved = getSolvedCount(questionDone);
  const totalProblems = getTotalQuestions();

  const filteredTopics = useMemo(
    () =>
      activeTag === "All"
        ? DSA_TOPICS
        : DSA_TOPICS.filter((t) => t.tag === activeTag),
    [activeTag],
  );

  function applyDate() {
    setTargetDate(dateInput);
    save("pp_target_date", dateInput);
    setShowDatePicker(false);
  }

 function toggleQuestion(qid, forceValue) {
   setQuestionDone((prev) => {
     const next = { ...prev };
     let solved = false;

     if (forceValue === true) {
       next[qid] = true;
     } else if (forceValue === false) {
       delete next[qid];
     } else if (next[qid]) {
       delete next[qid];
     } else {
       next[qid] = true;
       solved = true;
     }

     save("pp_dsa_qdone", next);

     // Fix: Defer the parent update to avoid "Cannot update component while rendering" error
     if (solved) {
       setTimeout(() => {
         logActivity(1);
         onSolve && onSolve();
       }, 0);
     }

     return next;
   });
 }

  function openTopicModal(topic) {
    setTopicLastSeen((prev) => {
      const next = { ...prev, [topic.id]: Date.now() };
      save("pp_topic_last_seen", next);
      return next;
    });
    setOpenTopic(topic);
  }

  const readiness =
    dsaScore >= 80
      ? { label: "Interview Ready 🚀", color: "#4caf7d" }
      : dsaScore >= 55
        ? { label: "Getting There 💪", color: "#5b8def" }
        : dsaScore >= 30
          ? { label: "Needs Work 🔥", color: "#e8924a" }
          : { label: "Just Starting ⚡", color: "#ef4444" };

  // Tag color map
  const tagColors = {
    Array: "#5b8def",
    "Array/String": "#5b8def",
    LinkedList: "#9b72cf",
    Stack: "#e8924a",
    Tree: "#4caf7d",
    "Tree/Graph": "#4caf7d",
    Graph: "#ef7b4d",
    Recursion: "#d4b44a",
    DP: "#c672cf",
    Greedy: "#4cb87d",
    Heap: "#ef4444",
    "Advanced DS": "#5b9def",
    Math: "#8b8def",
    Search: "#7bcfaf",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Hero card */}
      <div
        style={{
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: 18,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <ProgressRing pct={dsaScore} size={82} color={readiness.color} />
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: readiness.color,
                marginBottom: 4,
              }}
            >
              {readiness.label}
            </div>
            <div
              style={{ fontSize: 11, color: "var(--txt3)", marginBottom: 8 }}
            >
              {totalSolved}/{totalProblems} questions solved across{" "}
              {DSA_TOPICS.length} patterns
            </div>
            <div
              style={{
                height: 5,
                background: "var(--bg3)",
                borderRadius: 99,
                overflow: "hidden",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${dsaScore}%`,
                  background: readiness.color,
                  borderRadius: 99,
                  transition: "width .5s ease",
                }}
              />
            </div>
            {targetDate && !showDatePicker ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, color: "var(--txt3)" }}>
                  📅 Target:{" "}
                  <strong style={{ color: "var(--txt2)" }}>
                    {new Date(targetDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </strong>
                </span>
                <button
                  onClick={() => {
                    setDateInput(targetDate);
                    setShowDatePicker(true);
                  }}
                  style={{
                    fontSize: 10,
                    color: "var(--txt3)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  ✎ change
                </button>
              </div>
            ) : !showDatePicker ? (
              <button
                onClick={() => setShowDatePicker(true)}
                style={{
                  fontSize: 11,
                  color: "#5b8def",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 700,
                  padding: 0,
                  textAlign: "left",
                }}
              >
                + Set your placement deadline
              </button>
            ) : null}
          </div>
        </div>
        {showDatePicker && (
          <div
            style={{
              marginTop: 12,
              padding: "12px 14px",
              background: "var(--bg3)",
              borderRadius: 12,
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: "var(--txt3)",
                fontWeight: 700,
                marginBottom: 8,
              }}
            >
              I want to finish all patterns by:
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                type="date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                style={{
                  flex: 1,
                  background: "var(--bg2)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: "8px 10px",
                  fontSize: 13,
                  color: "var(--txt)",
                  outline: "none",
                }}
              />
              <button
                onClick={applyDate}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: "none",
                  background: "#5b8def",
                  color: "white",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Set
              </button>
              <button
                onClick={() => setShowDatePicker(false)}
                style={{
                  padding: "8px 10px",
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  background: "transparent",
                  color: "var(--txt3)",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>

      <PaceBanner pace={pace} />
      <MomentumCard momentum={momentum} />
      <WeakTopicsAlert weakTopics={weakTopics} />
      <MilestoneGrid questionDone={questionDone} />

      {/* Pattern filter tabs */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: "var(--txt3)",
              letterSpacing: ".1em",
              textTransform: "uppercase",
            }}
          >
            Algorithmic Patterns
          </div>
          <div style={{ fontSize: 10, color: "var(--txt3)" }}>
            Click to see questions →
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 5,
            overflowX: "auto",
            paddingBottom: 8,
            marginBottom: 4,
          }}
        >
          {PATTERN_TAGS.map((tag) => {
            const color = tagColors[tag] || "#5b8def";
            const isActive = activeTag === tag;
            const count =
              tag === "All"
                ? DSA_TOPICS.length
                : DSA_TOPICS.filter((t) => t.tag === tag).length;
            return (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: isActive ? 700 : 500,
                  cursor: "pointer",
                  flexShrink: 0,
                  border: `1px solid ${isActive ? color + "60" : "var(--border)"}`,
                  background: isActive ? color + "18" : "var(--bg2)",
                  color: isActive ? color : "var(--txt3)",
                  transition: "all .15s",
                }}
              >
                {tag} {count > 0 && tag !== "All" ? `(${count})` : ""}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pattern rows */}
      {filteredTopics.map((topic) => {
        const qs = DSA_QUESTIONS[topic.id] || [];
        const qDone = qs.filter((q) => questionDone[q.id]).length;
        const pct = qs.length > 0 ? Math.round((qDone / qs.length) * 100) : 0;
        const color =
          pct === 100
            ? "#4caf7d"
            : pct >= 60
              ? "#5b8def"
              : pct >= 30
                ? "#e8924a"
                : "#ef4444";
        const lastSeen = topicLastSeen[topic.id];
        const daysSince = lastSeen
          ? Math.floor((Date.now() - lastSeen) / 86400000)
          : null;
        const isWeak = weakTopics.find((t) => t.id === topic.id);
        const tagColor = tagColors[topic.tag] || "#5b8def";

        return (
          <div
            key={topic.id}
            onClick={() => openTopicModal(topic)}
            style={{
              background: "var(--bg2)",
              border: `1px solid ${isWeak ? "#ef444422" : "var(--border)"}`,
              borderRadius: 13,
              padding: "12px 14px",
              cursor: "pointer",
              transition: "border-color .15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = "#5b8def33")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.borderColor = isWeak
                ? "#ef444422"
                : "var(--border)")
            }
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {/* Icon */}
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 9,
                  background: tagColor + "15",
                  border: `1px solid ${tagColor}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: 14,
                }}
              >
                {topic.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 5,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--txt2)",
                      }}
                    >
                      {topic.label}
                    </span>
                    {/* tag pill */}
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        padding: "1px 6px",
                        borderRadius: 4,
                        background: tagColor + "15",
                        color: tagColor,
                        letterSpacing: ".04em",
                      }}
                    >
                      {topic.tag}
                    </span>
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        padding: "1px 6px",
                        borderRadius: 4,
                        background: "rgba(91,141,239,0.1)",
                        color: "#5b8def",
                      }}
                    >
                      {qDone}/{qs.length}
                    </span>
                    {daysSince !== null && daysSince > 0 && (
                      <span
                        style={{
                          fontSize: 9,
                          color: daysSince > 12 ? "#ef4444" : "var(--txt3)",
                        }}
                      >
                        {daysSince}d ago
                      </span>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--txt3)",
                      fontFamily: "var(--mono)",
                    }}
                  >
                    {pct}%
                  </span>
                </div>
                <div
                  style={{
                    height: 4,
                    background: "var(--bg3)",
                    borderRadius: 99,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${pct}%`,
                      background: color,
                      borderRadius: 99,
                      transition: "width .4s ease",
                    }}
                  />
                </div>
              </div>
              {pct === 100 ? (
                <span style={{ fontSize: 14 }}>✅</span>
              ) : (
                <span style={{ fontSize: 12, color: "var(--txt3)" }}>›</span>
              )}
            </div>
          </div>
        );
      })}

      {openTopic && (
        <QuestionModal
          topic={openTopic}
          doneMap={questionDone}
          onToggle={toggleQuestion}
          onClose={() => setOpenTopic(null)}
        />
      )}
    </div>
  );
}

// ── Core CS Tab ───────────────────────────────────────────────────────────────
function CoreCSTab() {
  const [progress, setProgress] = useState(() => load("pp_core_progress", {}));
  const [expanded, setExpanded] = useState(null);

  function toggleTopic(subjId, topic) {
    setProgress((prev) => {
      const key = `${subjId}_${topic}`;
      const next = { ...prev, [key]: !prev[key] };
      save("pp_core_progress", next);
      return next;
    });
  }

  const totalTopics = CORE_SUBJECTS.flatMap((s) => s.topics).length;
  const totalDone = CORE_SUBJECTS.flatMap((s) => s.topics).filter((t) => {
    const subj = CORE_SUBJECTS.find((s) => s.topics.includes(t));
    return progress[`${subj.id}_${t}`];
  }).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div
        style={{
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: 16,
          marginBottom: 4,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <ProgressRing
            pct={Math.round((totalDone / totalTopics) * 100)}
            size={64}
            color="#9b72cf"
          />
          <div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "var(--txt)" }}>
              Core CS Subjects
            </div>
            <div style={{ fontSize: 12, color: "var(--txt3)", marginTop: 3 }}>
              {totalDone}/{totalTopics} topics revised
            </div>
          </div>
        </div>
      </div>
      {CORE_SUBJECTS.map((subj) => {
        const done = subj.topics.filter(
          (t) => progress[`${subj.id}_${t}`],
        ).length;
        const pct = Math.round((done / subj.topics.length) * 100);
        const isOpen = expanded === subj.id;
        const color =
          pct === 100 ? "#4caf7d" : pct >= 50 ? "#9b72cf" : "#e8924a";
        return (
          <div
            key={subj.id}
            style={{
              background: "var(--bg2)",
              border: `1px solid ${isOpen ? "#9b72cf33" : "var(--border)"}`,
              borderRadius: 14,
              overflow: "hidden",
              transition: "border-color .2s",
            }}
          >
            <div
              onClick={() => setExpanded(isOpen ? null : subj.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 16px",
                cursor: "pointer",
              }}
            >
              <Ring pct={pct} size={36} stroke={4} color={color} />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--txt2)",
                  }}
                >
                  {subj.label}
                </div>
                <div
                  style={{ fontSize: 11, color: "var(--txt3)", marginTop: 1 }}
                >
                  {done}/{subj.topics.length} revised
                </div>
              </div>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--txt3)"
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{
                  transform: isOpen ? "rotate(180deg)" : "none",
                  transition: "transform .2s",
                  flexShrink: 0,
                }}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
            {isOpen && (
              <div
                style={{
                  padding: "0 16px 16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                {subj.topics.map((topic) => {
                  const isDone = !!progress[`${subj.id}_${topic}`];
                  return (
                    <div
                      key={topic}
                      onClick={() => toggleTopic(subj.id, topic)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 12px",
                        borderRadius: 10,
                        background: isDone ? "#4caf7d0a" : "var(--bg)",
                        border: `1px solid ${isDone ? "#4caf7d22" : "var(--border)"}`,
                        cursor: "pointer",
                        transition: "all .15s",
                      }}
                    >
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 6,
                          border: `1.5px solid ${isDone ? "#4caf7d" : "var(--border)"}`,
                          background: isDone ? "#4caf7d" : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {isDone && <Check />}
                      </div>
                      <span
                        style={{
                          fontSize: 13,
                          color: isDone ? "#4caf7d" : "var(--txt3)",
                          fontWeight: isDone ? 600 : 400,
                        }}
                      >
                        {topic}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Skills Tab ────────────────────────────────────────────────────────────────
function SkillsTab() {
  const [skills, setSkills] = useState(() => load("pp_skills", {}));
  const [customSkill, setCustomSkill] = useState("");
  const allBuiltin = SKILL_CATEGORIES.flatMap((c) => c.items);

  function setLevel(skill, level) {
    setSkills((prev) => {
      const next = { ...prev, [skill]: level };
      save("pp_skills", next);
      return next;
    });
  }
  function addCustom(e) {
    e.preventDefault();
    if (!customSkill.trim()) return;
    setLevel(customSkill.trim(), 1);
    setCustomSkill("");
  }

  const proficient = Object.values(skills).filter((v) => v >= 3).length;
  const advanced = Object.values(skills).filter((v) => v === 4).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 8,
          marginBottom: 4,
        }}
      >
        {[
          {
            val: Object.keys(skills).length,
            label: "Tracked",
            color: "#5b8def",
          },
          { val: proficient, label: "Proficient+", color: "#d4b44a" },
          { val: advanced, label: "Advanced", color: "#4caf7d" },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "var(--bg2)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: 12,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: s.color,
                fontFamily: "var(--mono)",
              }}
            >
              {s.val}
            </div>
            <div
              style={{
                fontSize: 9,
                color: "var(--txt3)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: ".07em",
                marginTop: 2,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
      {SKILL_CATEGORIES.map((cat) => (
        <div
          key={cat.id}
          style={{
            background: "var(--bg2)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            padding: "14px 16px",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              color: "var(--txt3)",
              marginBottom: 12,
            }}
          >
            {cat.label}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {cat.items.map((skill) => {
              const level = skills[skill] || 0;
              const lvl = SKILL_LEVELS[level];
              return (
                <div
                  key={skill}
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <span style={{ fontSize: 13, color: "var(--txt2)", flex: 1 }}>
                    {skill}
                  </span>
                  <div style={{ display: "flex", gap: 3 }}>
                    {SKILL_LEVELS.slice(1).map((l) => (
                      <button
                        key={l.val}
                        onClick={() =>
                          setLevel(skill, level === l.val ? 0 : l.val)
                        }
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 7,
                          border: `1.5px solid ${level >= l.val ? l.color : "var(--border)"}`,
                          background:
                            level >= l.val ? l.color + "22" : "var(--bg)",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background:
                              level >= l.val ? l.color : "var(--border)",
                          }}
                        />
                      </button>
                    ))}
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      color: lvl?.color || "var(--txt3)",
                      fontWeight: 600,
                      width: 72,
                      textAlign: "right",
                    }}
                  >
                    {lvl?.label || "–"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <div
        style={{
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: "14px 16px",
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: ".1em",
            textTransform: "uppercase",
            color: "var(--txt3)",
            marginBottom: 10,
          }}
        >
          Add Custom Skill
        </div>
        <form onSubmit={addCustom} style={{ display: "flex", gap: 8 }}>
          <input
            value={customSkill}
            onChange={(e) => setCustomSkill(e.target.value)}
            placeholder="Redis, Kafka, OpenCV…"
            style={{
              flex: 1,
              background: "var(--bg)",
              border: "1px solid var(--border)",
              borderRadius: 9,
              padding: "9px 12px",
              fontSize: 13,
              color: "var(--txt)",
              outline: "none",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "9px 16px",
              borderRadius: 9,
              border: "none",
              background: "var(--txt)",
              color: "var(--bg)",
              fontSize: 13,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Add
          </button>
        </form>
        {Object.entries(skills).filter(([s]) => !allBuiltin.includes(s))
          .length > 0 && (
          <div
            style={{
              marginTop: 10,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            {Object.entries(skills)
              .filter(([s]) => !allBuiltin.includes(s))
              .map(([skill, level]) => (
                <div
                  key={skill}
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <span style={{ fontSize: 13, color: "var(--txt2)", flex: 1 }}>
                    {skill}
                  </span>
                  <div style={{ display: "flex", gap: 3 }}>
                    {[1, 2, 3, 4].map((l) => (
                      <button
                        key={l}
                        onClick={() => setLevel(skill, level === l ? 0 : l)}
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 7,
                          border: `1.5px solid ${level >= l ? "#5b8def" : "var(--border)"}`,
                          background: level >= l ? "#5b8def22" : "var(--bg)",
                          cursor: "pointer",
                        }}
                      >
                        <div
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background:
                              level >= l ? "#5b8def" : "var(--border)",
                            margin: "auto",
                          }}
                        />
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      const n = { ...skills };
                      delete n[skill];
                      setSkills(n);
                      save("pp_skills", n);
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--txt3)",
                      cursor: "pointer",
                      fontSize: 16,
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Companies Tab ─────────────────────────────────────────────────────────────
function CompaniesTab() {
  const [companies, setCompanies] = useState(() => load("pp_companies", []));
  const [showAdd, setShowAdd] = useState(false);
  const [filterTier, setFilterTier] = useState("all");
  const emptyForm = {
    name: "",
    tier: "dream",
    role: "",
    ctc: "",
    status: "Shortlisted",
    notes: "",
    rounds: [],
  };
  const [newCo, setNewCo] = useState(emptyForm);

  function addCompany(e) {
    e.preventDefault();
    if (!newCo.name.trim()) return;
    const updated = [
      { ...newCo, id: Date.now(), name: newCo.name.trim() },
      ...companies,
    ];
    setCompanies(updated);
    save("pp_companies", updated);
    setNewCo(emptyForm);
    setShowAdd(false);
  }
  function updateStatus(id, status) {
    const u = companies.map((c) => (c.id === id ? { ...c, status } : c));
    setCompanies(u);
    save("pp_companies", u);
  }
  function toggleRound(id, round) {
    const u = companies.map((c) =>
      c.id === id
        ? {
            ...c,
            rounds: c.rounds?.includes(round)
              ? c.rounds.filter((r) => r !== round)
              : [...(c.rounds || []), round],
          }
        : c,
    );
    setCompanies(u);
    save("pp_companies", u);
  }
  function deleteCompany(id) {
    const u = companies.filter((c) => c.id !== id);
    setCompanies(u);
    save("pp_companies", u);
  }

  const filtered =
    filterTier === "all"
      ? companies
      : companies.filter((c) => c.tier === filterTier);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: "var(--txt)",
              letterSpacing: "-.02em",
            }}
          >
            Company Tracker
          </div>
          <div style={{ fontSize: 12, color: "var(--txt3)", marginTop: 2 }}>
            Applications, rounds, offers
          </div>
        </div>
        <button
          onClick={() => setShowAdd((s) => !s)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "8px 14px",
            borderRadius: 10,
            border: "1px solid var(--border)",
            background: "var(--bg2)",
            color: "var(--txt3)",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          + Add
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: 8,
        }}
      >
        {[
          { val: companies.length, label: "Applied", color: "#5b8def" },
          {
            val: companies.filter((c) => c.status === "Interview").length,
            label: "Interviews",
            color: "#9b72cf",
          },
          {
            val: companies.filter((c) => c.status === "Offer").length,
            label: "Offers 🎉",
            color: "#4caf7d",
          },
          {
            val: companies.filter((c) => c.status === "Rejected").length,
            label: "Rejected",
            color: "#ef4444",
          },
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
                fontSize: 20,
                fontWeight: 800,
                color: s.color,
                fontFamily: "var(--mono)",
              }}
            >
              {s.val}
            </div>
            <div
              style={{
                fontSize: 9,
                color: "var(--txt3)",
                fontWeight: 700,
                letterSpacing: ".06em",
                textTransform: "uppercase",
                marginTop: 2,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
      {showAdd && (
        <form
          onSubmit={addCompany}
          style={{
            background: "var(--bg2)",
            border: "1px solid #5b8def33",
            borderRadius: 14,
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 800, color: "var(--txt)" }}>
            Add Company
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
          >
            <div style={{ gridColumn: "1/-1" }}>
              <div
                style={{
                  fontSize: 10,
                  color: "var(--txt3)",
                  marginBottom: 4,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: ".08em",
                }}
              >
                Company Name *
              </div>
              <input
                value={newCo.name}
                onChange={(e) =>
                  setNewCo((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Google, Flipkart…"
                required
                autoFocus
                style={{
                  width: "100%",
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: "9px 12px",
                  fontSize: 13,
                  color: "var(--txt)",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
            {[
              {
                key: "tier",
                label: "Tier",
                type: "select",
                opts: COMPANY_TIERS.map((t) => ({ v: t.id, l: t.label })),
              },
              {
                key: "status",
                label: "Status",
                type: "select",
                opts: APP_STATUS.map((s) => ({ v: s, l: s })),
              },
              {
                key: "role",
                label: "Role",
                type: "text",
                ph: "SDE, Data Analyst…",
              },
              { key: "ctc", label: "CTC (LPA)", type: "text", ph: "12-18 LPA" },
            ].map((f) => (
              <div key={f.key}>
                <div
                  style={{
                    fontSize: 10,
                    color: "var(--txt3)",
                    marginBottom: 4,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: ".08em",
                  }}
                >
                  {f.label}
                </div>
                {f.type === "select" ? (
                  <select
                    value={newCo[f.key]}
                    onChange={(e) =>
                      setNewCo((p) => ({ ...p, [f.key]: e.target.value }))
                    }
                    style={{
                      width: "100%",
                      background: "var(--bg)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      padding: "9px 12px",
                      fontSize: 13,
                      color: "var(--txt)",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  >
                    {f.opts.map((o) => (
                      <option key={o.v} value={o.v}>
                        {o.l}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    value={newCo[f.key]}
                    onChange={(e) =>
                      setNewCo((p) => ({ ...p, [f.key]: e.target.value }))
                    }
                    placeholder={f.ph}
                    style={{
                      width: "100%",
                      background: "var(--bg)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      padding: "9px 12px",
                      fontSize: 13,
                      color: "var(--txt)",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                )}
              </div>
            ))}
            <div style={{ gridColumn: "1/-1" }}>
              <div
                style={{
                  fontSize: 10,
                  color: "var(--txt3)",
                  marginBottom: 4,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: ".08em",
                }}
              >
                Notes
              </div>
              <input
                value={newCo.notes}
                onChange={(e) =>
                  setNewCo((p) => ({ ...p, notes: e.target.value }))
                }
                placeholder="Referral, link…"
                style={{
                  width: "100%",
                  background: "var(--bg)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: "9px 12px",
                  fontSize: 13,
                  color: "var(--txt)",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: 10,
                borderRadius: 9,
                border: "none",
                background: "var(--txt)",
                color: "var(--bg)",
                fontSize: 13,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Add Company
            </button>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              style={{
                padding: "10px 16px",
                borderRadius: 9,
                border: "1px solid var(--border)",
                background: "transparent",
                color: "var(--txt3)",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      <div
        style={{ display: "flex", gap: 5, overflowX: "auto", paddingBottom: 2 }}
      >
        {[
          { id: "all", label: `All (${companies.length})` },
          ...COMPANY_TIERS.filter((t) =>
            companies.some((c) => c.tier === t.id),
          ).map((t) => ({
            ...t,
            label: `${t.label} (${companies.filter((c) => c.tier === t.id).length})`,
          })),
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setFilterTier(t.id)}
            style={{
              padding: "7px 14px",
              borderRadius: 9,
              border: "none",
              flexShrink: 0,
              background: filterTier === t.id ? "var(--txt)" : "var(--bg2)",
              color: filterTier === t.id ? "var(--bg)" : "var(--txt3)",
              fontSize: 11,
              fontWeight: filterTier === t.id ? 800 : 500,
              cursor: "pointer",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "36px 0",
            color: "var(--txt3)",
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 8 }}>🏢</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>
            No companies tracked yet
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map((co) => {
            const tier =
              COMPANY_TIERS.find((t) => t.id === co.tier) || COMPANY_TIERS[0];
            return (
              <div
                key={co.id}
                style={{
                  background: "var(--bg2)",
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  padding: "14px 16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 10,
                    marginBottom: 10,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 4,
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: "var(--txt)",
                        }}
                      >
                        {co.name}
                      </span>
                      <span
                        style={{
                          fontSize: 9,
                          fontWeight: 800,
                          padding: "2px 8px",
                          borderRadius: 5,
                          background: tier.bg,
                          color: tier.color,
                          letterSpacing: ".06em",
                        }}
                      >
                        {tier.label.toUpperCase()}
                      </span>
                    </div>
                    {co.role && (
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--txt3)",
                          marginBottom: 2,
                        }}
                      >
                        {co.role}
                        {co.ctc && ` · ${co.ctc} LPA`}
                      </div>
                    )}
                    {co.notes && (
                      <div style={{ fontSize: 11, color: "var(--txt3)" }}>
                        {co.notes}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => deleteCompany(co.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--txt3)",
                      cursor: "pointer",
                      fontSize: 16,
                    }}
                  >
                    ×
                  </button>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 4,
                    flexWrap: "wrap",
                    marginBottom: 10,
                  }}
                >
                  {APP_STATUS.map((s) => {
                    const sc = STATUS_COLORS[s];
                    const isActive = co.status === s;
                    return (
                      <button
                        key={s}
                        onClick={() => updateStatus(co.id, s)}
                        style={{
                          padding: "4px 10px",
                          borderRadius: 7,
                          border: `1px solid ${isActive ? sc.color + "55" : "var(--border)"}`,
                          background: isActive ? sc.bg : "transparent",
                          color: isActive ? sc.color : "var(--txt3)",
                          fontSize: 11,
                          fontWeight: isActive ? 700 : 400,
                          cursor: "pointer",
                        }}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
                {(co.status === "Interview" ||
                  (co.rounds && co.rounds.length > 0)) && (
                  <div>
                    <div
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        color: "var(--txt3)",
                        letterSpacing: ".1em",
                        textTransform: "uppercase",
                        marginBottom: 6,
                      }}
                    >
                      Rounds Cleared
                    </div>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {INTERVIEW_ROUNDS.map((r) => {
                        const done = co.rounds?.includes(r);
                        return (
                          <button
                            key={r}
                            onClick={() => toggleRound(co.id, r)}
                            style={{
                              padding: "4px 10px",
                              borderRadius: 7,
                              border: `1px solid ${done ? "#4caf7d44" : "var(--border)"}`,
                              background: done ? "#4caf7d15" : "var(--bg)",
                              color: done ? "#4caf7d" : "var(--txt3)",
                              fontSize: 11,
                              fontWeight: done ? 600 : 400,
                              cursor: "pointer",
                            }}
                          >
                            {done ? "✓ " : ""}
                            {r}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Resume Tab ────────────────────────────────────────────────────────────────
function ResumeTab() {
  const [checklist, setChecklist] = useState(() => load("pp_resume_check", {}));
  const [versions, setVersions] = useState(() =>
    load("pp_resume_versions", []),
  );
  const [showAdd, setShowAdd] = useState(false);
  const [newV, setNewV] = useState({ label: "", link: "", notes: "" });

  function toggleCheck(id) {
    setChecklist((p) => {
      const n = { ...p, [id]: !p[id] };
      save("pp_resume_check", n);
      return n;
    });
  }
  function addVersion(e) {
    e.preventDefault();
    if (!newV.label.trim()) return;
    const u = [
      {
        ...newV,
        id: Date.now(),
        date: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
        }),
      },
      ...versions,
    ];
    setVersions(u);
    save("pp_resume_versions", u);
    setNewV({ label: "", link: "", notes: "" });
    setShowAdd(false);
  }

  const doneCount = RESUME_CHECKLIST.filter((i) => checklist[i.id]).length;
  const pct = Math.round((doneCount / RESUME_CHECKLIST.length) * 100);
  const scoreColor =
    pct === 100 ? "#4caf7d" : pct >= 70 ? "#5b8def" : "#e8924a";
  const scoreLabel =
    pct === 100
      ? "Perfect! 🎉"
      : pct >= 70
        ? "Good"
        : pct >= 40
          ? "Needs Work"
          : "Incomplete";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div
        style={{
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: 18,
          display: "flex",
          alignItems: "center",
          gap: 18,
        }}
      >
        <ProgressRing pct={pct} size={72} color={scoreColor} />
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "var(--txt)",
              marginBottom: 3,
            }}
          >
            Resume: <span style={{ color: scoreColor }}>{scoreLabel}</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--txt3)" }}>
            {doneCount}/{RESUME_CHECKLIST.length} items checked
          </div>
          <div
            style={{
              height: 5,
              background: "var(--bg3)",
              borderRadius: 99,
              overflow: "hidden",
              marginTop: 8,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${pct}%`,
                background: scoreColor,
                borderRadius: 99,
                transition: "width .5s",
              }}
            />
          </div>
        </div>
      </div>
      <div
        style={{
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: 16,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: ".1em",
            textTransform: "uppercase",
            color: "var(--txt3)",
            marginBottom: 12,
          }}
        >
          Resume Checklist
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {RESUME_CHECKLIST.map((item) => {
            const done = !!checklist[item.id];
            return (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 10,
                  background: done ? "#4caf7d0a" : "var(--bg)",
                  border: `1px solid ${done ? "#4caf7d22" : "var(--border)"}`,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    border: `1.5px solid ${done ? "#4caf7d" : "var(--border)"}`,
                    background: done ? "#4caf7d" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  {done && <Check />}
                </div>
                <span
                  style={{
                    fontSize: 13,
                    color: done ? "#4caf7d" : "var(--txt3)",
                    lineHeight: 1.4,
                    textDecoration: done ? "line-through" : "none",
                    opacity: done ? 0.7 : 1,
                  }}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div
        style={{
          background: "var(--bg2)",
          border: "1px solid rgba(91,141,239,0.15)",
          borderRadius: 14,
          padding: 16,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: ".1em",
            textTransform: "uppercase",
            color: "#5b8def",
            marginBottom: 10,
          }}
        >
          💡 Pro Tips
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {RESUME_TIPS.map((tip, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 8,
                fontSize: 12,
                color: "var(--txt3)",
                lineHeight: 1.5,
              }}
            >
              <span
                style={{ color: "#5b8def", flexShrink: 0, fontWeight: 700 }}
              >
                →
              </span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: 16,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              color: "var(--txt3)",
            }}
          >
            Resume Versions
          </div>
          <button
            onClick={() => setShowAdd((s) => !s)}
            style={{
              fontSize: 11,
              fontWeight: 700,
              padding: "5px 11px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--bg)",
              color: "var(--txt3)",
              cursor: "pointer",
            }}
          >
            + Add
          </button>
        </div>
        {showAdd && (
          <form
            onSubmit={addVersion}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginBottom: 12,
              padding: 12,
              background: "var(--bg)",
              borderRadius: 10,
            }}
          >
            {[
              { val: newV.label, key: "label", ph: "SDE Intern v2", req: true },
              { val: newV.link, key: "link", ph: "Google Drive link" },
              { val: newV.notes, key: "notes", ph: "What changed?" },
            ].map((f) => (
              <input
                key={f.key}
                value={f.val}
                onChange={(e) =>
                  setNewV((p) => ({ ...p, [f.key]: e.target.value }))
                }
                placeholder={f.ph}
                required={f.req}
                style={{
                  background: "var(--bg2)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: "8px 11px",
                  fontSize: 13,
                  color: "var(--txt)",
                  outline: "none",
                }}
              />
            ))}
            <div style={{ display: "flex", gap: 7 }}>
              <button
                type="submit"
                style={{
                  flex: 1,
                  padding: 8,
                  borderRadius: 8,
                  border: "none",
                  background: "var(--txt)",
                  color: "var(--bg)",
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: "pointer",
                }}
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                style={{
                  padding: "8px 14px",
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  background: "transparent",
                  color: "var(--txt3)",
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
        {versions.length === 0 ? (
          <div
            style={{
              fontSize: 12,
              color: "var(--txt3)",
              textAlign: "center",
              padding: "16px 0",
            }}
          >
            No versions saved yet
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {versions.map((v, i) => (
              <div
                key={v.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  background: "var(--bg)",
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    background: i === 0 ? "#5b8def" : "var(--bg3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 800,
                    color: i === 0 ? "#fff" : "var(--txt3)",
                    flexShrink: 0,
                  }}
                >
                  v{versions.length - i}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--txt2)",
                    }}
                  >
                    {v.label}
                  </div>
                  {v.notes && (
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--txt3)",
                        marginTop: 1,
                      }}
                    >
                      {v.notes}
                    </div>
                  )}
                </div>
                <span
                  style={{ fontSize: 10, color: "var(--txt3)", flexShrink: 0 }}
                >
                  {v.date}
                </span>
                {v.link && (
                  <a
                    href={
                      v.link.startsWith("http") ? v.link : "https://" + v.link
                    }
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      fontSize: 11,
                      color: "#5b8def",
                      textDecoration: "none",
                      flexShrink: 0,
                    }}
                  >
                    ↗
                  </a>
                )}
                <button
                  onClick={() => {
                    const u = versions.filter((x) => x.id !== v.id);
                    setVersions(u);
                    save("pp_resume_versions", u);
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--txt3)",
                    cursor: "pointer",
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Root View ─────────────────────────────────────────────────────────────────
export default function PlacementPrepView() {
  const [activeTab, setActiveTab] = useState("dsa");
  const [dsaScore, setDsaScore] = useState(() =>
    calcReadinessScore(load("pp_dsa_qdone", {})),
  );

  const coreProgress = useMemo(() => load("pp_core_progress", {}), []);
  const skills = useMemo(() => load("pp_skills", {}), []);
  const resumeCheck = useMemo(() => load("pp_resume_check", {}), []);
  const companies = useMemo(() => load("pp_companies", []), []);

  const onSolve = useCallback(() => {
    setDsaScore(calcReadinessScore(load("pp_dsa_qdone", {})));
  }, []);
  const coreTotal = CORE_SUBJECTS.flatMap((s) => s.topics).length;
  const coreDone = Object.values(coreProgress).filter(Boolean).length;
  const corePct = Math.round((coreDone / coreTotal) * 100);
  const skillPct = Math.min(
    100,
    Math.round((Object.values(skills).filter((v) => v >= 3).length / 8) * 100),
  );
  const resumePct = Math.round(
    (Object.values(resumeCheck).filter(Boolean).length /
      RESUME_CHECKLIST.length) *
      100,
  );
  const overallPct = Math.round(
    dsaScore * 0.35 + corePct * 0.25 + skillPct * 0.2 + resumePct * 0.2,
  );
  const momentum = useMemo(() => getMomentum(), [dsaScore]);

  const readiness =
    overallPct >= 80
      ? { label: "Interview Ready 🚀", color: "#4caf7d" }
      : overallPct >= 60
        ? { label: "Almost There 💪", color: "#5b8def" }
        : overallPct >= 35
          ? { label: "Getting Warmed Up 🔥", color: "#d4b44a" }
          : { label: "Just Getting Started ⚡", color: "#e8924a" };

  const TABS = [
    { id: "dsa", label: "DSA", emoji: "💻" },
    { id: "core", label: "Core CS", emoji: "📚" },
    { id: "skills", label: "Skills", emoji: "⚙️" },
    { id: "companies", label: "Companies", emoji: "🏢" },
    { id: "resume", label: "Resume", emoji: "📄" },
  ];

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        background: "var(--bg)",
        minHeight: "100vh",
        fontFamily: "-apple-system, 'Helvetica Neue', sans-serif",
      }}
    >
      <style>{`
        @keyframes fadeUp { 0% { opacity:0; transform:translateY(10px); } 100% { opacity:1; transform:none; } }
        .pp-tab { animation: fadeUp .25s ease forwards; }
        * { box-sizing: border-box; }
        input, select, button { font-family: inherit; }
      `}</style>

      <div style={{ padding: "20px 16px 0" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 900,
                letterSpacing: "-.04em",
                color: "var(--txt)",
                marginBottom: 2,
                lineHeight: 1,
              }}
            >
              Placement Prep
            </h1>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: 6,
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: momentum.color,
                  letterSpacing: ".05em",
                }}
              >
                {momentum.icon} Momentum: {momentum.label}
              </span>
              <span style={{ fontSize: 10, color: "var(--txt3)" }}>
                · {momentum.activeDays}/7 active days
              </span>
            </div>
          </div>
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <ProgressRing pct={overallPct} size={64} color={readiness.color} />
            <div
              style={{
                fontSize: 8,
                fontWeight: 800,
                color: "var(--txt3)",
                marginTop: 4,
                letterSpacing: ".08em",
                textTransform: "uppercase",
              }}
            >
              Readiness
            </div>
          </div>
        </div>

        <div
          style={{
            background: "var(--bg2)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            padding: "13px 16px",
            marginBottom: 14,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
            }}
          >
            <span
              style={{ fontSize: 13, fontWeight: 800, color: readiness.color }}
            >
              {readiness.label}
            </span>
            <span
              style={{
                fontSize: 10,
                color: "var(--txt3)",
                fontFamily: "var(--mono)",
              }}
            >
              DSA {dsaScore}% · {DSA_TOPICS.length} patterns
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 8,
            }}
          >
            {[
              { label: "DSA", pct: dsaScore, color: "#5b8def" },
              { label: "Core CS", pct: corePct, color: "#9b72cf" },
              { label: "Skills", pct: skillPct, color: "#d4b44a" },
              { label: "Resume", pct: resumePct, color: "#4caf7d" },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: 10,
                    color: "var(--txt3)",
                    marginBottom: 4,
                    fontWeight: 600,
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    height: 3,
                    background: "var(--bg3)",
                    borderRadius: 99,
                    overflow: "hidden",
                    marginBottom: 3,
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${s.pct}%`,
                      background: s.color,
                      borderRadius: 99,
                      transition: "width .5s",
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: s.color,
                    fontFamily: "var(--mono)",
                  }}
                >
                  {s.pct}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {companies.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: 8,
              padding: "10px 14px",
              background: "var(--bg2)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              marginBottom: 14,
              flexWrap: "wrap",
            }}
          >
            <span style={{ fontSize: 12, color: "var(--txt3)" }}>Tracking</span>
            <span
              style={{ fontSize: 12, fontWeight: 600, color: "var(--txt2)" }}
            >
              {companies.length} companies
            </span>
            {companies.filter((c) => c.status === "Offer").length > 0 && (
              <>
                <span style={{ color: "var(--border)" }}>·</span>
                <span
                  style={{ fontSize: 12, fontWeight: 700, color: "#4caf7d" }}
                >
                  🎉 {companies.filter((c) => c.status === "Offer").length}{" "}
                  offer!
                </span>
              </>
            )}
            {companies.filter((c) => c.status === "Interview").length > 0 && (
              <>
                <span style={{ color: "var(--border)" }}>·</span>
                <span style={{ fontSize: 12, color: "#9b72cf" }}>
                  {companies.filter((c) => c.status === "Interview").length}{" "}
                  interviewing
                </span>
              </>
            )}
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: 4,
            marginBottom: 16,
            overflowX: "auto",
            paddingBottom: 2,
          }}
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "8px 14px",
                borderRadius: 10,
                border: "none",
                flexShrink: 0,
                background: activeTab === t.id ? "var(--txt)" : "var(--bg2)",
                color: activeTab === t.id ? "var(--bg)" : "var(--txt3)",
                fontSize: 12,
                fontWeight: activeTab === t.id ? 800 : 500,
                cursor: "pointer",
                transition: "all .15s",
              }}
            >
              <span>{t.emoji}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div
        className="pp-tab"
        key={activeTab}
        style={{ padding: "0 16px 40px" }}
      >
        {activeTab === "dsa" && <DSATab onSolve={onSolve} />}
        {activeTab === "core" && <CoreCSTab />}
        {activeTab === "skills" && <SkillsTab />}
        {activeTab === "companies" && <CompaniesTab />}
        {activeTab === "resume" && <ResumeTab />}
      </div>
    </div>
  );
}
