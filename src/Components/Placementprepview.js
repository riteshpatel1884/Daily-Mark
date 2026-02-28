"use client";
// ─────────────────────────────────────────────────────────────────────────────
// PlacementPrepView.jsx  —  Logic + UI only (no raw data here)
// All question banks, constants, and config live in ./placementData.js
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useMemo, useEffect } from "react";
import {
  DSA_QUESTIONS,
  DSA_TOPICS,
  CORE_SUBJECTS,
  SKILL_CATEGORIES,
  SKILL_LEVELS,
  COMPANY_TIERS,
  APP_STATUS,
  STATUS_COLORS,
  INTERVIEW_ROUNDS,
  DIFF_CONFIG,
  RESUME_TIPS,
  RESUME_CHECKLIST,
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

// ── API Fetchers ──────────────────────────────────────────────────────────────
async function fetchLeetCodeStats(username) {
  const urls = [
    `https://leetcode-stats-api.herokuapp.com/${username}`,
    `https://alfa-leetcode-api.0x10.workers.dev/userProfile/${username}`,
  ];
  for (const url of urls) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) continue;
      const data = await res.json();
      if (data.totalSolved !== undefined)
        return {
          totalSolved: data.totalSolved,
          easySolved: data.easySolved,
          mediumSolved: data.mediumSolved,
          hardSolved: data.hardSolved,
          ranking: data.ranking,
          acceptanceRate: data.acceptanceRate ?? null,
          totalQuestions: data.totalQuestions,
        };
    } catch {
      continue;
    }
  }
  throw new Error("Could not fetch LeetCode stats. Check your username.");
}

async function fetchCodeforcesStats(username) {
  const [infoRes, ratingRes] = await Promise.all([
    fetch(`https://codeforces.com/api/user.info?handles=${username}`, {
      signal: AbortSignal.timeout(8000),
    }),
    fetch(`https://codeforces.com/api/user.rating?handle=${username}`, {
      signal: AbortSignal.timeout(8000),
    }),
  ]);
  if (!infoRes.ok) throw new Error("User not found on Codeforces");
  const infoData = await infoRes.json();
  if (infoData.status !== "OK")
    throw new Error(infoData.comment || "CF API error");
  const user = infoData.result[0];
  let contestCount = 0;
  if (ratingRes.ok) {
    const rd = await ratingRes.json();
    if (rd.status === "OK") contestCount = rd.result.length;
  }
  return {
    handle: user.handle,
    rating: user.rating || 0,
    maxRating: user.maxRating || 0,
    rank: user.rank || "unrated",
    maxRank: user.maxRank || "unrated",
    contestCount,
    contribution: user.contribution || 0,
    avatar: user.avatar,
  };
}

function cfRankColor(rank = "") {
  const r = rank.toLowerCase();
  if (r.includes("legendary")) return "#ff0000";
  if (r.includes("international") && r.includes("grandmaster"))
    return "#ff3333";
  if (r.includes("grandmaster")) return "#ff3333";
  if (r.includes("international") && r.includes("master")) return "#ff7777";
  if (r.includes("master")) return "#ffbb55";
  if (r.includes("candidate")) return "#ff8c00";
  if (r.includes("expert")) return "#a0a0ff";
  if (r.includes("specialist")) return "#77ddbb";
  if (r.includes("pupil")) return "#77ff77";
  return "#808080";
}

// ── Shared UI atoms ───────────────────────────────────────────────────────────
function RadialProgress({ pct, size = 56, stroke = 5, color = "var(--blue)" }) {
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
        stroke="var(--border)"
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
      <RadialProgress pct={pct} size={size} stroke={6} color={color} />
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

function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "7px 14px",
        borderRadius: 9,
        border: "none",
        flexShrink: 0,
        background: active ? "var(--txt)" : "var(--bg3)",
        color: active ? "var(--bg)" : "var(--txt2)",
        fontFamily: "var(--font)",
        fontSize: 12,
        fontWeight: active ? 700 : 500,
        cursor: "pointer",
        transition: "all .15s",
      }}
    >
      {children}
    </button>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h2
        style={{
          fontSize: 18,
          fontWeight: 800,
          color: "var(--txt)",
          letterSpacing: "-.02em",
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p style={{ fontSize: 12, color: "var(--txt3)", marginTop: 3 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ── Checkmark SVG ─────────────────────────────────────────────────────────────
const Check = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="3"
    strokeLinecap="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

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
        ? "var(--blue)"
        : pct >= 30
          ? "var(--orange)"
          : "var(--red)";

  const filtered = questions.filter((q) => {
    const matchDiff = filter === "All" || q.difficulty === filter;
    const matchSearch =
      !search || q.title.toLowerCase().includes(search.toLowerCase());
    return matchDiff && matchSearch;
  });

  const diffCounts = { Easy: 0, Medium: 0, Hard: 0 };
  questions.forEach((q) => diffCounts[q.difficulty]++);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(5px)",
        zIndex: 99999,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: 0,
        animation: "fadeIn .15s ease",
        boxSizing: "border-box",
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
          boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
          animation: "slideDown .22s cubic-bezier(.16,1,.3,1)",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "18px 20px 14px",
            borderBottom: "1px solid var(--border)",
            flexShrink: 0,
            boxSizing: "border-box",
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
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  color: "var(--txt)",
                  wordBreak: "break-word",
                }}
              >
                {topic.label}
              </div>
              <div style={{ fontSize: 11, color: "var(--txt3)", marginTop: 2 }}>
                {doneCount} / {questions.length} solved · Click to mark done
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                border: "1px solid var(--border)",
                background: "var(--bg3)",
                color: "var(--txt2)",
                cursor: "pointer",
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              ✕
            </button>
          </div>

          {/* Progress bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                flex: 1,
                height: 7,
                background: "var(--bg4)",
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
                flexShrink: 0,
              }}
            >
              {pct}%
            </span>
          </div>

          {/* Diff chips */}
          <div
            style={{
              display: "flex",
              gap: 6,
              marginBottom: 12,
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

          {/* Search + filter */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions…"
              style={{
                flex: "1 1 120px",
                minWidth: 0,
                background: "var(--bg3)",
                border: "1px solid var(--border)",
                borderRadius: 9,
                padding: "7px 12px",
                fontSize: 12,
                color: "var(--txt)",
                outline: "none",
                fontFamily: "var(--font)",
                boxSizing: "border-box",
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
                      border: `1px solid ${filter === f ? dc?.color || "var(--txt)" : "var(--border)"}`,
                      background:
                        filter === f ? dc?.bg || "var(--txt)" : "transparent",
                      color:
                        filter === f ? dc?.color || "var(--bg)" : "var(--txt3)",
                      fontSize: 11,
                      fontWeight: filter === f ? 700 : 400,
                      cursor: "pointer",
                      fontFamily: "var(--font)",
                    }}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Question list */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "12px 20px 24px",
            boxSizing: "border-box",
          }}
        >
          {filtered.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "32px 0",
                color: "var(--txt3)",
                fontSize: 13,
              }}
            >
              No questions match your filter
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
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
                      borderRadius: 12,
                      background: done ? "#4caf7d0c" : "var(--bg2)",
                      border: `1px solid ${done ? "#4caf7d30" : "var(--border)"}`,
                      cursor: "pointer",
                      transition: "all .15s",
                      userSelect: "none",
                      boxSizing: "border-box",
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
                        transition: "all .15s",
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
                        color: done ? "#4caf7d" : "var(--txt)",
                        lineHeight: 1.3,
                        minWidth: 0,
                        wordBreak: "break-word",
                      }}
                    >
                      {q.title}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 5,
                        background: dc.bg,
                        color: dc.color,
                        flexShrink: 0,
                      }}
                    >
                      {q.difficulty}
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
                        background: "var(--bg3)",
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

        {/* Footer */}
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
            boxSizing: "border-box",
          }}
        >
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <button
              onClick={() => questions.forEach((q) => onToggle(q.id, true))}
              style={{
                fontSize: 12,
                padding: "7px 14px",
                borderRadius: 9,
                border: "1px solid var(--border)",
                background: "var(--bg3)",
                color: "var(--txt2)",
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
                background: "var(--bg3)",
                color: "var(--txt2)",
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
              fontWeight: 700,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Platform Cards ────────────────────────────────────────────────────────────
function LeetCodeCard({ username, data, loading, error, onRefresh }) {
  if (loading)
    return (
      <div
        style={{
          padding: "14px 16px",
          background: "var(--bg3)",
          borderRadius: 12,
          border: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            border: "2px solid #ffa116",
            borderTopColor: "transparent",
            animation: "spin 1s linear infinite",
          }}
        />
        <span style={{ fontSize: 12, color: "var(--txt3)" }}>
          Fetching LeetCode stats for <b>{username}</b>…
        </span>
      </div>
    );
  if (error)
    return (
      <div
        style={{
          padding: "12px 14px",
          background: "#ff444415",
          borderRadius: 12,
          border: "1px solid #ff444433",
          display: "flex",
          alignItems: "center",
          gap: 10,
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: 12, color: "var(--red)" }}>⚠ {error}</span>
        <button
          onClick={onRefresh}
          style={{
            fontSize: 11,
            padding: "4px 10px",
            borderRadius: 7,
            border: "1px solid var(--border)",
            background: "var(--bg3)",
            color: "var(--txt2)",
            cursor: "pointer",
          }}
        >
          Retry
        </button>
      </div>
    );
  if (!data) return null;
  const bars = [
    { label: "Easy", val: data.easySolved, color: "#4caf7d" },
    { label: "Medium", val: data.mediumSolved, color: "#ffa116" },
    { label: "Hard", val: data.hardSolved, color: "#ef4444" },
  ];
  return (
    <div
      style={{
        padding: "14px 16px",
        background: "linear-gradient(135deg,#ffa11608 0%,#ffa11602 100%)",
        borderRadius: 14,
        border: "1px solid #ffa11633",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 12,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 700, color: "#ffa116" }}>
          LeetCode
        </span>
        <button
          onClick={onRefresh}
          style={{
            background: "none",
            border: "none",
            color: "var(--txt3)",
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          ↺
        </button>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ textAlign: "center", flexShrink: 0 }}>
          <div
            style={{
              fontSize: 28,
              fontWeight: 900,
              color: "var(--txt)",
              fontFamily: "var(--mono)",
              lineHeight: 1,
            }}
          >
            {data.totalSolved}
          </div>
          <div style={{ fontSize: 10, color: "var(--txt3)", marginTop: 2 }}>
            Solved
          </div>
          {data.totalQuestions && (
            <div style={{ fontSize: 10, color: "var(--txt3)" }}>
              / {data.totalQuestions}
            </div>
          )}
        </div>
        <div
          style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}
        >
          {bars.map((d) => (
            <div
              key={d.label}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <span
                style={{
                  fontSize: 10,
                  color: d.color,
                  fontWeight: 700,
                  width: 42,
                  flexShrink: 0,
                }}
              >
                {d.label}
              </span>
              <div
                style={{
                  flex: 1,
                  height: 5,
                  background: "var(--bg4)",
                  borderRadius: 99,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${Math.min(100, (d.val / (data.totalSolved || 1)) * 100)}%`,
                    background: d.color,
                    borderRadius: 99,
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: 11,
                  color: "var(--txt2)",
                  fontFamily: "var(--mono)",
                  width: 24,
                  textAlign: "right",
                  flexShrink: 0,
                }}
              >
                {d.val}
              </span>
            </div>
          ))}
        </div>
      </div>
      {(data.ranking || data.acceptanceRate != null) && (
        <div
          style={{
            marginTop: 12,
            paddingTop: 10,
            borderTop: "1px solid var(--border)",
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          {data.ranking && (
            <div>
              <div style={{ fontSize: 10, color: "var(--txt3)" }}>
                Global Rank
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--txt)",
                  fontFamily: "var(--mono)",
                }}
              >
                #{data.ranking.toLocaleString()}
              </div>
            </div>
          )}
          {data.acceptanceRate != null && (
            <div>
              <div style={{ fontSize: 10, color: "var(--txt3)" }}>
                Acceptance
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--txt)",
                  fontFamily: "var(--mono)",
                }}
              >
                {typeof data.acceptanceRate === "number"
                  ? data.acceptanceRate.toFixed(1)
                  : data.acceptanceRate}
                %
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CodeforcesCard({ username, data, loading, error, onRefresh }) {
  if (loading)
    return (
      <div
        style={{
          padding: "14px 16px",
          background: "var(--bg3)",
          borderRadius: 12,
          border: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            border: "2px solid #5b8def",
            borderTopColor: "transparent",
            animation: "spin 1s linear infinite",
          }}
        />
        <span style={{ fontSize: 12, color: "var(--txt3)" }}>
          Fetching CF stats for <b>{username}</b>…
        </span>
      </div>
    );
  if (error)
    return (
      <div
        style={{
          padding: "12px 14px",
          background: "#ff444415",
          borderRadius: 12,
          border: "1px solid #ff444433",
          display: "flex",
          alignItems: "center",
          gap: 10,
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: 12, color: "var(--red)" }}>⚠ {error}</span>
        <button
          onClick={onRefresh}
          style={{
            fontSize: 11,
            padding: "4px 10px",
            borderRadius: 7,
            border: "1px solid var(--border)",
            background: "var(--bg3)",
            color: "var(--txt2)",
            cursor: "pointer",
          }}
        >
          Retry
        </button>
      </div>
    );
  if (!data) return null;
  const rankColor = cfRankColor(data.rank);
  return (
    <div
      style={{
        padding: "14px 16px",
        background: "linear-gradient(135deg,#5b8def08 0%,#5b8def02 100%)",
        borderRadius: 14,
        border: "1px solid #5b8def33",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 12,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 700, color: "#5b8def" }}>
          Codeforces
        </span>
        <button
          onClick={onRefresh}
          style={{
            background: "none",
            border: "none",
            color: "var(--txt3)",
            cursor: "pointer",
            fontSize: 14,
          }}
        >
          ↺
        </button>
      </div>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 28,
              fontWeight: 900,
              color: rankColor,
              fontFamily: "var(--mono)",
              lineHeight: 1,
            }}
          >
            {data.rating || "—"}
          </div>
          <div style={{ fontSize: 10, color: "var(--txt3)", marginTop: 2 }}>
            Rating
          </div>
        </div>
        <div
          style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}
        >
          {[
            ["Rank", data.rank, rankColor, true],
            ["Max Rating", data.maxRating || "—", "var(--txt)", false],
            ["Contests", data.contestCount, "var(--txt)", false],
            [
              "Contribution",
              (data.contribution >= 0 ? "+" : "") + data.contribution,
              data.contribution >= 0 ? "#4caf7d" : "var(--red)",
              false,
            ],
          ].map(([label, val, color, cap]) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
              }}
            >
              <span style={{ color: "var(--txt3)" }}>{label}</span>
              <span
                style={{
                  fontWeight: 700,
                  color,
                  fontFamily: "var(--mono)",
                  textTransform: cap ? "capitalize" : "none",
                }}
              >
                {val}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── DSA Tab ───────────────────────────────────────────────────────────────────
function DSATab() {
  const [solved, setSolved] = useState(() => load("pp_dsa_solved", {}));
  const [questionDone, setQuestionDone] = useState(() =>
    load("pp_dsa_qdone", {}),
  );
  const [openTopic, setOpenTopic] = useState(null);

  function toggleQuestion(qid, forceValue) {
    setQuestionDone((prev) => {
      const next = { ...prev };
      if (forceValue === true) next[qid] = true;
      else if (forceValue === false) delete next[qid];
      else if (next[qid]) delete next[qid];
      else next[qid] = true;
      save("pp_dsa_qdone", next);
      if (openTopic) {
        const qs = DSA_QUESTIONS[openTopic.id] || [];
        setSolved((sp) => {
          const ns = {
            ...sp,
            [openTopic.id]: qs.filter((q) => next[q.id]).length,
          };
          save("pp_dsa_solved", ns);
          return ns;
        });
      }
      return next;
    });
  }

  const totalSolved = DSA_TOPICS.reduce((s, t) => s + (solved[t.id] || 0), 0);
  const totalProblems = DSA_TOPICS.reduce((s, t) => s + t.total, 0);
  const overallPct = Math.round((totalSolved / totalProblems) * 100);
  const readiness =
    overallPct >= 80
      ? { label: "Interview Ready", color: "#4caf7d" }
      : overallPct >= 50
        ? { label: "Getting There", color: "var(--yellow)" }
        : overallPct >= 25
          ? { label: "Needs Work", color: "var(--orange)" }
          : { label: "Just Starting", color: "var(--red)" };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Overview card */}
      <div
        style={{
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          borderRadius: 16,
          padding: 18,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <ProgressRing pct={overallPct} size={80} color="var(--blue)" />
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 5,
              }}
            >
              <span
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: "var(--txt)",
                  fontFamily: "var(--mono)",
                }}
              >
                {totalSolved}
              </span>
              <span style={{ fontSize: 14, color: "var(--txt3)" }}>
                / {totalProblems} problems
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  padding: "2px 8px",
                  borderRadius: 5,
                  background: readiness.color + "20",
                  color: readiness.color,
                  letterSpacing: ".06em",
                }}
              >
                {readiness.label}
              </span>
            </div>
            <div
              style={{
                height: 6,
                background: "var(--bg4)",
                borderRadius: 99,
                overflow: "hidden",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${overallPct}%`,
                  background: "var(--blue)",
                  borderRadius: 99,
                  transition: "width .5s ease",
                }}
              />
            </div>
            <div style={{ fontSize: 11, color: "var(--txt3)" }}>
              {totalProblems - totalSolved} problems remaining across{" "}
              {DSA_TOPICS.length} topics
            </div>
          </div>
        </div>
      </div>

      {/* Topic rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--txt3)",
              letterSpacing: ".08em",
              textTransform: "uppercase",
            }}
          >
            Topic Progress
          </div>
          <div style={{ fontSize: 11, color: "var(--txt3)" }}>
            Click any topic to see questions →
          </div>
        </div>
        {DSA_TOPICS.map((topic) => {
          const s = solved[topic.id] || 0;
          const pct = Math.round((s / topic.total) * 100);
          const color =
            pct === 100
              ? "#4caf7d"
              : pct >= 60
                ? "var(--blue)"
                : pct >= 30
                  ? "var(--orange)"
                  : "var(--red)";
          const questions = DSA_QUESTIONS[topic.id] || [];
          const qDone = questions.filter((q) => questionDone[q.id]).length;
          const hasBank = questions.length > 0;
          return (
            <div
              key={topic.id}
              onClick={hasBank ? () => setOpenTopic(topic) : undefined}
              onMouseEnter={(e) => {
                if (hasBank)
                  e.currentTarget.style.borderColor = "var(--blue)44";
              }}
              onMouseLeave={(e) => {
                if (hasBank)
                  e.currentTarget.style.borderColor = "var(--border)";
              }}
              style={{
                background: "var(--bg2)",
                border: "1px solid var(--border)",
                borderRadius: 13,
                padding: "12px 14px",
                cursor: hasBank ? "pointer" : "default",
                transition: "border-color .15s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 6,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "var(--txt)",
                        }}
                      >
                        {topic.label}
                      </span>
                      {hasBank && (
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            padding: "1px 6px",
                            borderRadius: 4,
                            background: "var(--blue)15",
                            color: "var(--blue)",
                            letterSpacing: ".05em",
                          }}
                        >
                          {qDone}/{questions.length} done
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
                      {s}/{topic.total}
                    </span>
                  </div>
                  <div
                    style={{
                      height: 5,
                      background: "var(--bg4)",
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
                  hasBank && (
                    <span style={{ fontSize: 12, color: "var(--txt3)" }}>
                      ›
                    </span>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>

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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <SectionHeader
        title="Core CS Subjects"
        subtitle="Mark topics as revised — essential for tech interviews"
      />
      {/* Summary rings */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(72px, 1fr))",
          gap: 8,
          marginBottom: 8,
        }}
      >
        {CORE_SUBJECTS.map((subj) => {
          const done = subj.topics.filter(
            (t) => progress[`${subj.id}_${t}`],
          ).length;
          const pct = Math.round((done / subj.topics.length) * 100);
          const color =
            pct === 100
              ? "#4caf7d"
              : pct >= 50
                ? "var(--blue)"
                : "var(--orange)";
          return (
            <div
              key={subj.id}
              onClick={() => setExpanded(expanded === subj.id ? null : subj.id)}
              style={{
                background: "var(--bg2)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: "12px 10px",
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              <ProgressRing pct={pct} size={44} color={color} />
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--txt)",
                  marginTop: 6,
                  lineHeight: 1.3,
                }}
              >
                {subj.label}
              </div>
            </div>
          );
        })}
      </div>
      {/* Accordions */}
      {CORE_SUBJECTS.map((subj) => {
        const done = subj.topics.filter(
          (t) => progress[`${subj.id}_${t}`],
        ).length;
        const pct = Math.round((done / subj.topics.length) * 100);
        const isOpen = expanded === subj.id;
        const color =
          pct === 100 ? "#4caf7d" : pct >= 50 ? "var(--blue)" : "var(--orange)";
        return (
          <div
            key={subj.id}
            style={{
              background: "var(--bg2)",
              border: `1px solid ${isOpen ? "var(--blue)44" : "var(--border)"}`,
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
              <RadialProgress pct={pct} size={36} stroke={4} color={color} />
              <div style={{ flex: 1 }}>
                <div
                  style={{ fontSize: 14, fontWeight: 700, color: "var(--txt)" }}
                >
                  {subj.label}
                </div>
                <div
                  style={{ fontSize: 11, color: "var(--txt3)", marginTop: 1 }}
                >
                  {done}/{subj.topics.length} topics revised
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
                  gap: 7,
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
                        background: isDone ? "#4caf7d12" : "var(--bg3)",
                        border: `1px solid ${isDone ? "#4caf7d33" : "var(--border)"}`,
                        cursor: "pointer",
                        transition: "all .15s",
                      }}
                    >
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 6,
                          border: `1.5px solid ${isDone ? "#4caf7d" : "var(--border2)"}`,
                          background: isDone ? "#4caf7d" : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          transition: "all .15s",
                        }}
                      >
                        {isDone && <Check />}
                      </div>
                      <span
                        style={{
                          fontSize: 13,
                          color: isDone ? "#4caf7d" : "var(--txt2)",
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
  const allBuiltinSkills = SKILL_CATEGORIES.flatMap((c) => c.items);

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

  const proficientCount = Object.values(skills).filter((v) => v >= 3).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionHeader
        title="Tech Skills"
        subtitle="Rate your proficiency — helps identify gaps before applying"
      />
      {/* Stats */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}
      >
        {[
          { val: Object.keys(skills).length, label: "Tracked" },
          { val: proficientCount, label: "Proficient+" },
          {
            val: Object.values(skills).filter((v) => v === 4).length,
            label: "Advanced",
          },
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
                color: "var(--txt)",
                fontFamily: "var(--mono)",
              }}
            >
              {s.val}
            </div>
            <div
              style={{
                fontSize: 10,
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
      {/* Category cards */}
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
          <div className="slabel" style={{ marginBottom: 12 }}>
            {cat.label}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {cat.items.map((skill) => {
              const level = skills[skill] || 0;
              return (
                <div
                  key={skill}
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      color: "var(--txt)",
                      flex: 1,
                      minWidth: 0,
                    }}
                  >
                    {skill}
                  </span>
                  <div style={{ display: "flex", gap: 4 }}>
                    {SKILL_LEVELS.slice(1).map((l) => (
                      <button
                        key={l.val}
                        onClick={() =>
                          setLevel(skill, level === l.val ? 0 : l.val)
                        }
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 7,
                          border: `1.5px solid ${level >= l.val ? l.color : "var(--border)"}`,
                          background:
                            level >= l.val ? l.color + "22" : "var(--bg3)",
                          cursor: "pointer",
                          transition: "all .15s",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background:
                              level >= l.val ? l.color : "var(--border)",
                            transition: "background .15s",
                          }}
                        />
                      </button>
                    ))}
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      color: SKILL_LEVELS[level]?.color || "var(--txt3)",
                      fontWeight: 600,
                      width: 76,
                      textAlign: "right",
                    }}
                  >
                    {SKILL_LEVELS[level]?.label || "–"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      {/* Custom skills */}
      <div
        style={{
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: "14px 16px",
        }}
      >
        <div className="slabel" style={{ marginBottom: 10 }}>
          Add Custom Skill
        </div>
        <form onSubmit={addCustom} style={{ display: "flex", gap: 8 }}>
          <input
            value={customSkill}
            onChange={(e) => setCustomSkill(e.target.value)}
            placeholder="e.g. Redis, Kafka, OpenCV..."
            style={{
              flex: 1,
              background: "var(--bg3)",
              border: "1px solid var(--border)",
              borderRadius: 9,
              padding: "9px 12px",
              fontSize: 13,
              color: "var(--txt)",
              outline: "none",
              fontFamily: "var(--font)",
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
              fontFamily: "var(--font)",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Add
          </button>
        </form>
        {/* Custom list */}
        {Object.entries(skills).filter(([s]) => !allBuiltinSkills.includes(s))
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
              .filter(([s]) => !allBuiltinSkills.includes(s))
              .map(([skill, level]) => (
                <div
                  key={skill}
                  style={{ display: "flex", alignItems: "center", gap: 10 }}
                >
                  <span style={{ fontSize: 13, color: "var(--txt)", flex: 1 }}>
                    {skill}
                  </span>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[1, 2, 3, 4].map((l) => (
                      <button
                        key={l}
                        onClick={() => setLevel(skill, level === l ? 0 : l)}
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 7,
                          border: `1.5px solid ${level >= l ? "#5b8def" : "var(--border)"}`,
                          background: level >= l ? "#5b8def22" : "var(--bg3)",
                          cursor: "pointer",
                        }}
                      >
                        <div
                          style={{
                            width: 8,
                            height: 8,
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
                      fontSize: 14,
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
    applyDate: "",
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
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <SectionHeader
          title="Company Tracker"
          subtitle="Track applications, rounds, and offers"
        />
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
            color: "var(--txt2)",
            fontFamily: "var(--font)",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            flexShrink: 0,
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
          Add
        </button>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: 8,
        }}
      >
        {[
          { val: companies.length, label: "Applied", color: "var(--blue)" },
          {
            val: companies.filter((c) => c.status === "Interview").length,
            label: "Interviews",
            color: "var(--purple)",
          },
          {
            val: companies.filter((c) => c.status === "Offer").length,
            label: "Offers 🎉",
            color: "#4caf7d",
          },
          {
            val: companies.filter((c) => c.status === "Rejected").length,
            label: "Rejected",
            color: "var(--red)",
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
                fontSize: 10,
                color: "var(--txt3)",
                fontWeight: 600,
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

      {/* Add form */}
      {showAdd && (
        <form
          onSubmit={addCompany}
          style={{
            background: "var(--bg2)",
            border: "1px solid var(--blue)44",
            borderRadius: 14,
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--txt)" }}>
            Add Company
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            <div style={{ gridColumn: "1/-1" }}>
              <div className="slabel">Company Name *</div>
              <input
                value={newCo.name}
                onChange={(e) =>
                  setNewCo((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="e.g. Google, Flipkart..."
                className="inp"
                autoFocus
                required
              />
            </div>
            <div>
              <div className="slabel">Tier</div>
              <select
                value={newCo.tier}
                onChange={(e) =>
                  setNewCo((p) => ({ ...p, tier: e.target.value }))
                }
                className="inp"
              >
                {COMPANY_TIERS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div className="slabel">Status</div>
              <select
                value={newCo.status}
                onChange={(e) =>
                  setNewCo((p) => ({ ...p, status: e.target.value }))
                }
                className="inp"
              >
                {APP_STATUS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <div className="slabel">Role</div>
              <input
                value={newCo.role}
                onChange={(e) =>
                  setNewCo((p) => ({ ...p, role: e.target.value }))
                }
                placeholder="SDE, Data Analyst..."
                className="inp"
              />
            </div>
            <div>
              <div className="slabel">CTC (LPA)</div>
              <input
                value={newCo.ctc}
                onChange={(e) =>
                  setNewCo((p) => ({ ...p, ctc: e.target.value }))
                }
                placeholder="e.g. 12-18 LPA"
                className="inp"
              />
            </div>
            <div style={{ gridColumn: "1/-1" }}>
              <div className="slabel">Notes</div>
              <input
                value={newCo.notes}
                onChange={(e) =>
                  setNewCo((p) => ({ ...p, notes: e.target.value }))
                }
                placeholder="Referral contact, job link, etc."
                className="inp"
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
                fontFamily: "var(--font)",
                fontSize: 13,
                fontWeight: 700,
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
                color: "var(--txt2)",
                fontFamily: "var(--font)",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Tier filter */}
      <div
        style={{ display: "flex", gap: 5, overflowX: "auto", paddingBottom: 2 }}
      >
        <TabBtn
          active={filterTier === "all"}
          onClick={() => setFilterTier("all")}
        >
          All ({companies.length})
        </TabBtn>
        {COMPANY_TIERS.map((t) => {
          const cnt = companies.filter((c) => c.tier === t.id).length;
          return cnt > 0 ? (
            <TabBtn
              key={t.id}
              active={filterTier === t.id}
              onClick={() => setFilterTier(t.id)}
            >
              {t.label} ({cnt})
            </TabBtn>
          ) : null;
        })}
      </div>

      {/* List */}
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
          <div style={{ fontSize: 12, marginTop: 4 }}>
            Add your target companies above
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
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
                          color: "var(--txt2)",
                          marginBottom: 2,
                        }}
                      >
                        {co.role}
                        {co.ctc && ` · ${co.ctc} LPA`}
                      </div>
                    )}
                    {co.notes && (
                      <div
                        style={{
                          fontSize: 11,
                          color: "var(--txt3)",
                          lineHeight: 1.4,
                        }}
                      >
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
                      flexShrink: 0,
                    }}
                  >
                    ×
                  </button>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 5,
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
                          border: `1px solid ${isActive ? sc.color + "66" : "var(--border)"}`,
                          background: isActive ? sc.bg : "transparent",
                          color: isActive ? sc.color : "var(--txt3)",
                          fontSize: 11,
                          fontWeight: isActive ? 700 : 400,
                          cursor: "pointer",
                          fontFamily: "var(--font)",
                          transition: "all .15s",
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
                        fontSize: 10,
                        fontWeight: 700,
                        color: "var(--txt3)",
                        letterSpacing: ".08em",
                        textTransform: "uppercase",
                        marginBottom: 6,
                      }}
                    >
                      Rounds Cleared
                    </div>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                      {INTERVIEW_ROUNDS.map((r) => {
                        const done = co.rounds?.includes(r);
                        return (
                          <button
                            key={r}
                            onClick={() => toggleRound(co.id, r)}
                            style={{
                              padding: "4px 10px",
                              borderRadius: 7,
                              border: `1px solid ${done ? "#4caf7d55" : "var(--border)"}`,
                              background: done ? "#4caf7d18" : "var(--bg3)",
                              color: done ? "#4caf7d" : "var(--txt3)",
                              fontSize: 11,
                              fontWeight: done ? 600 : 400,
                              cursor: "pointer",
                              fontFamily: "var(--font)",
                              transition: "all .15s",
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
    pct === 100 ? "#4caf7d" : pct >= 70 ? "var(--blue)" : "var(--orange)";
  const scoreLabel =
    pct === 100
      ? "Perfect! 🎉"
      : pct >= 70
        ? "Good"
        : pct >= 40
          ? "Needs Work"
          : "Incomplete";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <SectionHeader
        title="Resume Builder"
        subtitle="Checklist + version tracker for your resume"
      />

      {/* Score ring */}
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
              marginBottom: 4,
            }}
          >
            Resume Score:{" "}
            <span style={{ color: scoreColor }}>{scoreLabel}</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--txt3)" }}>
            {doneCount}/{RESUME_CHECKLIST.length} items checked
          </div>
          <div
            style={{
              height: 5,
              background: "var(--bg4)",
              borderRadius: 99,
              overflow: "hidden",
              marginTop: 8,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${pct}%`,
                background: pct === 100 ? "#4caf7d" : "var(--blue)",
                borderRadius: 99,
                transition: "width .5s",
              }}
            />
          </div>
        </div>
      </div>

      {/* Checklist */}
      <div
        style={{
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: 16,
        }}
      >
        <div className="slabel" style={{ marginBottom: 12 }}>
          Resume Checklist
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
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
                  background: done ? "#4caf7d10" : "var(--bg3)",
                  border: `1px solid ${done ? "#4caf7d33" : "var(--border)"}`,
                  cursor: "pointer",
                  transition: "all .15s",
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    border: `1.5px solid ${done ? "#4caf7d" : "var(--border2)"}`,
                    background: done ? "#4caf7d" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 1,
                    transition: "all .15s",
                  }}
                >
                  {done && <Check />}
                </div>
                <span
                  style={{
                    fontSize: 13,
                    color: done ? "#4caf7d" : "var(--txt2)",
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

      {/* Tips */}
      <div
        style={{
          background: "var(--blue)10",
          border: "1px solid var(--blue)25",
          borderRadius: 14,
          padding: 16,
        }}
      >
        <div
          className="slabel"
          style={{ marginBottom: 10, color: "var(--blue)" }}
        >
          💡 Pro Tips
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {RESUME_TIPS.map((tip, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 8,
                fontSize: 12,
                color: "var(--txt2)",
                lineHeight: 1.5,
              }}
            >
              <span
                style={{ color: "var(--blue)", flexShrink: 0, fontWeight: 700 }}
              >
                →
              </span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Versions */}
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
          <div className="slabel" style={{ margin: 0 }}>
            Resume Versions
          </div>
          <button
            onClick={() => setShowAdd((s) => !s)}
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: "5px 11px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--bg3)",
              color: "var(--txt2)",
              cursor: "pointer",
            }}
          >
            + Add Version
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
              background: "var(--bg3)",
              borderRadius: 10,
            }}
          >
            {[
              {
                val: newV.label,
                key: "label",
                ph: "Version label (e.g. SDE Intern v2)",
                req: true,
              },
              {
                val: newV.link,
                key: "link",
                ph: "Google Drive / link (optional)",
              },
              { val: newV.notes, key: "notes", ph: "What changed? (optional)" },
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
                  fontFamily: "var(--font)",
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
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "var(--font)",
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
                  color: "var(--txt2)",
                  fontSize: 13,
                  cursor: "pointer",
                  fontFamily: "var(--font)",
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
            No versions saved yet — add your first one!
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {versions.map((v, i) => (
              <div
                key={v.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  background: "var(--bg3)",
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    background: i === 0 ? "var(--blue)" : "var(--bg4)",
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
                      color: "var(--txt)",
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
                      color: "var(--blue)",
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

  const dsaSolved = useMemo(() => load("pp_dsa_solved", {}), []);
  const dsaTotal = DSA_TOPICS.reduce((s, t) => s + t.total, 0);
  const dsaDone = DSA_TOPICS.reduce((s, t) => s + (dsaSolved[t.id] || 0), 0);
  const dsaPct = Math.round((dsaDone / dsaTotal) * 100);

  const coreProgress = useMemo(() => load("pp_core_progress", {}), []);
  const coreTotal = CORE_SUBJECTS.flatMap((s) => s.topics).length;
  const coreDone = Object.values(coreProgress).filter(Boolean).length;
  const corePct = Math.round((coreDone / coreTotal) * 100);

  const skills = useMemo(() => load("pp_skills", {}), []);
  const skillPct = Math.min(
    100,
    Math.round((Object.values(skills).filter((v) => v >= 3).length / 8) * 100),
  );

  const resumeCheck = useMemo(() => load("pp_resume_check", {}), []);
  const resumePct = Math.round(
    (Object.values(resumeCheck).filter(Boolean).length /
      RESUME_CHECKLIST.length) *
      100,
  );

  const companies = useMemo(() => load("pp_companies", []), []);
  const overallPct = Math.round(
    dsaPct * 0.35 + corePct * 0.25 + skillPct * 0.2 + resumePct * 0.2,
  );

  const readiness =
    overallPct >= 80
      ? { label: "Interview Ready 🚀", color: "#4caf7d" }
      : overallPct >= 60
        ? { label: "Almost There 💪", color: "var(--blue)" }
        : overallPct >= 35
          ? { label: "Getting Warmed Up 🔥", color: "var(--yellow)" }
          : { label: "Just Getting Started ⚡", color: "var(--orange)" };

  const TABS = [
    { id: "dsa", label: "DSA", emoji: "💻" },
    { id: "core", label: "Core CS", emoji: "📚" },
    { id: "skills", label: "Skills", emoji: "⚙️" },
    { id: "companies", label: "Companies", emoji: "🏢" },
    { id: "resume", label: "Resume", emoji: "📄" },
  ];

  return (
    <div
      className="page"
      style={{ width: "100%", maxWidth: "100%", boxSizing: "border-box" }}
    >
      <style>{`
        @keyframes fadeUp   { 0% { opacity:0; transform:translateY(12px); } 100% { opacity:1; transform:none; } }
        @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
        @keyframes slideDown{ 0% { opacity:0; transform:translateY(-16px); } 100% { opacity:1; transform:none; } }
        @keyframes spin     { to { transform:rotate(360deg); } }
        .pp-fadein { animation: fadeUp .3s ease forwards; }
      `}</style>

      {/* ── Header ── */}
      <div style={{ marginBottom: 16 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 14,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 800,
                letterSpacing: "-.03em",
                color: "var(--txt)",
                marginBottom: 2,
              }}
            >
              Placement Prep
            </h1>
            <p style={{ fontSize: 13, color: "var(--txt3)" }}>
              Track DSA, core CS, skills, companies & resume
            </p>
          </div>
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <ProgressRing pct={overallPct} size={64} color={readiness.color} />
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: "var(--txt3)",
                marginTop: 4,
                letterSpacing: ".05em",
                textTransform: "uppercase",
              }}
            >
              Readiness
            </div>
          </div>
        </div>

        {/* Readiness breakdown */}
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
              style={{ fontSize: 13, fontWeight: 700, color: readiness.color }}
            >
              {readiness.label}
            </span>
            <span
              style={{
                fontSize: 11,
                color: "var(--txt3)",
                fontFamily: "var(--mono)",
              }}
            >
              {overallPct}% overall
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2,1fr)",
              gap: 8,
            }}
          >
            {[
              { label: "DSA", pct: dsaPct, color: "var(--blue)" },
              { label: "Core CS", pct: corePct, color: "var(--purple)" },
              { label: "Skills", pct: skillPct, color: "var(--orange)" },
              { label: "Resume", pct: resumePct, color: "#4caf7d" },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--txt3)",
                    marginBottom: 5,
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    height: 4,
                    background: "var(--bg4)",
                    borderRadius: 99,
                    overflow: "hidden",
                    marginBottom: 4,
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
                    fontWeight: 700,
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

        {/* Company summary bar */}
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
            <span style={{ fontSize: 12, color: "var(--txt3)" }}>
              📊 Tracking
            </span>
            <span
              style={{ fontSize: 12, fontWeight: 600, color: "var(--txt)" }}
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
                  offer
                  {companies.filter((c) => c.status === "Offer").length > 1
                    ? "s"
                    : ""}
                  !
                </span>
              </>
            )}
            {companies.filter((c) => c.status === "Interview").length > 0 && (
              <>
                <span style={{ color: "var(--border)" }}>·</span>
                <span style={{ fontSize: 12, color: "var(--purple)" }}>
                  {companies.filter((c) => c.status === "Interview").length} in
                  interview
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── Tab bar ── */}
      <div
        style={{
          display: "flex",
          gap: 4,
          marginBottom: 18,
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
              background: activeTab === t.id ? "var(--txt)" : "var(--bg3)",
              color: activeTab === t.id ? "var(--bg)" : "var(--txt2)",
              fontFamily: "var(--font)",
              fontSize: 12,
              fontWeight: activeTab === t.id ? 700 : 500,
              cursor: "pointer",
              transition: "all .15s",
            }}
          >
            <span>{t.emoji}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── Tab content ── */}
      <div className="pp-fadein" key={activeTab}>
        {activeTab === "dsa" && <DSATab />}
        {activeTab === "core" && <CoreCSTab />}
        {activeTab === "skills" && <SkillsTab />}
        {activeTab === "companies" && <CompaniesTab />}
        {activeTab === "resume" && <ResumeTab />}
      </div>

      <div style={{ height: 32 }} />
    </div>
  );
}
