// pip.PlanTab.jsx
"use client";
import { useState, useMemo } from "react";
import { Bar, Card, SectionLabel } from "./ui.js";
import {
  QUESTIONS,
  getQuestionsForCompany,
  groupByPattern,
  sortByFrequency,
} from "./QuestionDatabase/Questions.js";
import {
  HR_QUESTIONS,
  HR_CATEGORY_COLORS,
  sortHRByFrequency,
} from "./QuestionDatabase/HR.js";

// ─── constants ────────────────────────────────────────────────────────────────
const DIFF_COLOR = { Easy: "#4caf7d", Medium: "#d4b44a", Hard: "#e05252" };
const FREQ_STARS = ["", "★", "★★", "★★★", "★★★★", "★★★★★"];
const HR_CATEGORIES_LIST = Object.keys(HR_CATEGORY_COLORS);

// ─── HR Answer Popup ──────────────────────────────────────────────────────────
function HRPopup({ q, checked, onCheck, onClose }) {
  const col = HR_CATEGORY_COLORS[q.category] || "#9b72cf";
  return (
    <>
      {/* backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1000,
          background: "rgba(0,0,0,0.55)",
        }}
      />
      {/* modal */}
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
            maxHeight: "82vh",
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
                    gap: 7,
                    marginBottom: 6,
                    flexWrap: "wrap",
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
                    {q.category}
                  </span>
                  <span style={{ fontSize: 9, color: "#d4b44a" }}>
                    {FREQ_STARS[q.frequency]}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--txt)",
                    lineHeight: 1.45,
                  }}
                >
                  {q.question}
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

          {/* tip */}
          <div style={{ padding: "14px 18px 0" }}>
            <div
              style={{
                fontSize: 10,
                color: "var(--txt3)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: ".07em",
                marginBottom: 6,
              }}
            >
              💡 Prep Tip
            </div>
            <div
              style={{
                fontSize: 12,
                color: "var(--txt3)",
                lineHeight: 1.55,
                padding: "8px 10px",
                background: "var(--bg3)",
                borderRadius: 8,
                borderLeft: `2px solid ${col}88`,
              }}
            >
              {q.tips}
            </div>
          </div>

          {/* sample answer */}
          <div style={{ padding: "14px 18px" }}>
            <div
              style={{
                fontSize: 10,
                color: "var(--txt3)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: ".07em",
                marginBottom: 8,
              }}
            >
              ✍️ Sample Answer
            </div>
            <div
              style={{
                fontSize: 13,
                color: "var(--txt)",
                lineHeight: 1.7,
                whiteSpace: "pre-line",
                padding: "12px 14px",
                background: col + "0d",
                border: `1px solid ${col}28`,
                borderRadius: 10,
              }}
            >
              {q.answer}
            </div>
          </div>

          {/* mark done — lives only here, not on the row */}
          <div style={{ padding: "0 18px 18px" }}>
            <button
              onClick={() => {
                onCheck(q.id);
                onClose();
              }}
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 10,
                border: checked ? "1.5px solid var(--border)" : "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 800,
                background: checked ? "var(--bg3)" : col,
                color: checked ? "var(--txt3)" : "#fff",
                transition: "all .15s",
              }}
            >
              {checked ? "✓ Marked as Done — Click to Undo" : "Mark as Done"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

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

function CatPill({ category }) {
  const col = HR_CATEGORY_COLORS[category] || "#888";
  return (
    <span
      style={{
        fontSize: 9,
        fontWeight: 700,
        padding: "2px 8px",
        borderRadius: 99,
        background: col + "18",
        color: col,
        border: `1px solid ${col}33`,
        whiteSpace: "nowrap",
      }}
    >
      {category}
    </span>
  );
}

function SectionDivider({ label, count, done, color }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        margin: "16px 0 10px",
      }}
    >
      <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "4px 12px",
          borderRadius: 99,
          border: `1px solid ${color}44`,
          background: color + "12",
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 800,
            color,
            letterSpacing: ".03em",
          }}
        >
          {label}
        </span>
        <span style={{ fontSize: 10, fontWeight: 700, color, opacity: 0.7 }}>
          {done}/{count}
        </span>
      </div>
      <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
    </div>
  );
}

// ─── DSA QuestionRow ──────────────────────────────────────────────────────────
function QuestionRow({
  q,
  checked,
  onCheck,
  accent,
  showCompanies = false,
  readOnly = false,
}) {
  return (
    <div
      onClick={readOnly ? undefined : () => onCheck(q.id)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "9px 12px",
        borderRadius: 10,
        cursor: readOnly ? "default" : "pointer",
        background: checked ? accent + "10" : "var(--bg3)",
        border: `1px solid ${checked ? accent + "44" : "var(--border)"}`,
        transition: "all .15s",
        opacity: readOnly && checked ? 0.55 : 1,
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: 5,
          flexShrink: 0,
          transition: "all .15s",
          border: `2px solid ${checked ? accent : "var(--border)"}`,
          background: checked
            ? readOnly
              ? accent + "22"
              : accent
            : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke={readOnly ? accent : "#fff"}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={readOnly ? 0.7 : 1}
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
        {readOnly && checked && (
          <div
            style={{
              fontSize: 9,
              color: accent,
              marginTop: 3,
              fontWeight: 700,
              opacity: 0.7,
            }}
          >
            ✓ marked done in Today
          </div>
        )}
      </div>
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

// ─── HR QuestionRow — clicking opens popup, NO inline mark button ─────────────
function HRQuestionRow({ q, checked, onOpen }) {
  const col = HR_CATEGORY_COLORS[q.category] || "#888";
  return (
    <div
      onClick={() => onOpen(q)}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        padding: "10px 12px",
        borderRadius: 10,
        cursor: "pointer",
        background: checked ? col + "10" : "var(--bg3)",
        border: `1px solid ${checked ? col + "44" : "var(--border)"}`,
        transition: "all .15s",
      }}
    >
      {/* done indicator — visual only */}
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: 5,
          flexShrink: 0,
          marginTop: 1,
          border: `2px solid ${checked ? col : "var(--border)"}`,
          background: checked ? col + "22" : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
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
            fontSize: 12,
            fontWeight: 600,
            lineHeight: 1.45,
            color: checked ? "var(--txt3)" : "var(--txt)",
            textDecoration: checked ? "line-through" : "none",
          }}
        >
          {q.question}
        </div>
        <div
          style={{
            display: "flex",
            gap: 5,
            marginTop: 5,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <CatPill category={q.category} />
          <span style={{ fontSize: 9, color: "#d4b44a" }}>
            {FREQ_STARS[q.frequency]}
          </span>
        </div>
      </div>
      {/* view answer hint */}
      <span
        style={{
          fontSize: 10,
          color: col,
          fontWeight: 700,
          flexShrink: 0,
          padding: "3px 8px",
          borderRadius: 6,
          background: col + "15",
          border: `1px solid ${col}33`,
          whiteSpace: "nowrap",
        }}
      >
        View ↗
      </span>
    </div>
  );
}

// ─── SuggestRow ───────────────────────────────────────────────────────────────
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

// ─── AddRow ───────────────────────────────────────────────────────────────────
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
export default function PlanTab({ co, daysLeft, setup, solved, setSolved }) {
  const accent = co?.color || "#5b8def";
  const company = setup?.company || "";
  const hasHR = setup?.goals?.includes("hr");

  // ── popup ─────────────────────────────────────────────────────────────────
  const [popupQ, setPopupQ] = useState(null);

  // ── DSA pool keys ─────────────────────────────────────────────────────────
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

  // ── DSA tiers ─────────────────────────────────────────────────────────────
  const tier1 = useMemo(
    () => sortByFrequency(getQuestionsForCompany(company)),
    [company],
  );
  const tier1Ids = useMemo(() => new Set(tier1.map((q) => q.id)), [tier1]);
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
  const dsaPool = useMemo(
    () => sortByFrequency([...tier1, ...tier2Accepted, ...tier3Added]),
    [tier1, tier2Accepted, tier3Added],
  );

  // ── HR pool ───────────────────────────────────────────────────────────────
  const hrPool = useMemo(() => sortHRByFrequency(HR_QUESTIONS), []);

  // ── questions per day ─────────────────────────────────────────────────────
  const dsaQPD = useMemo(() => {
    if (!daysLeft || daysLeft <= 0 || !dsaPool.length)
      return Math.min(dsaPool.length, 5);
    return Math.max(2, Math.min(10, Math.ceil(dsaPool.length / daysLeft)));
  }, [dsaPool.length, daysLeft]);

  const hrQPD = useMemo(() => {
    if (!hasHR || !daysLeft || daysLeft <= 0) return 0;
    return Math.max(1, Math.min(8, Math.ceil(hrPool.length / daysLeft)));
  }, [hasHR, hrPool.length, daysLeft]);

  // ── today's questions ─────────────────────────────────────────────────────
  const dayIndex = useMemo(() => Math.floor(Date.now() / 86400000), []);

  const todayDsaQs = useMemo(() => {
    if (!dsaPool.length) return [];
    const qpd = Math.max(1, dsaQPD);
    const start = (dayIndex * qpd) % dsaPool.length;
    return Array.from(
      { length: qpd },
      (_, i) => dsaPool[(start + i) % dsaPool.length],
    );
  }, [dsaPool, dayIndex, dsaQPD]);

  const todayHrQs = useMemo(() => {
    if (!hasHR || !hrPool.length) return [];
    const qpd = Math.max(1, hrQPD);
    const start = (dayIndex * qpd) % hrPool.length;
    return Array.from(
      { length: qpd },
      (_, i) => hrPool[(start + i) % hrPool.length],
    );
  }, [hasHR, hrPool, dayIndex, hrQPD]);

  // ── toggle helpers ────────────────────────────────────────────────────────
  function toggleDSA(qid) {
    setSolved((p) => ({ ...p, [`__q_${qid}`]: !p[`__q_${qid}`] }));
  }
  function toggleHR(qid) {
    setSolved((p) => ({ ...p, [`__hr_${qid}`]: !p[`__hr_${qid}`] }));
  }

  // ── stats ─────────────────────────────────────────────────────────────────
  const todayDsaDone = todayDsaQs.filter((q) => solved[`__q_${q.id}`]).length;
  const todayHrDone = todayHrQs.filter((q) => solved[`__hr_${q.id}`]).length;
  const todayTotal = todayDsaQs.length + todayHrQs.length;
  const todayDone = todayDsaDone + todayHrDone;
  const todayPct = todayTotal ? Math.round((todayDone / todayTotal) * 100) : 0;
  const todayStr = new Date().toISOString().split("T")[0];

  const dsaSolved = dsaPool.filter((q) => solved[`__q_${q.id}`]).length;
  const hrSolved = HR_QUESTIONS.filter((q) => solved[`__hr_${q.id}`]).length;
  const totalInPool = dsaPool.length + (hasHR ? HR_QUESTIONS.length : 0);
  const totalSolved = dsaSolved + (hasHR ? hrSolved : 0);
  const overallPct = totalInPool
    ? Math.round((totalSolved / totalInPool) * 100)
    : 0;

  // ── UI state ──────────────────────────────────────────────────────────────
  const [view, setView] = useState("today");
  const [patternFilter, setPatternFilter] = useState("All");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [showTier2, setShowTier2] = useState(true);
  const [addSearch, setAddSearch] = useState("");
  const [addPatFilter, setAddPatFilter] = useState("All");
  const [hrCatFilter, setHrCatFilter] = useState("All");

  // ── DSA pattern groups ────────────────────────────────────────────────────
  const patternViewPool = useMemo(() => {
    if (companyFilter === "company")
      return dsaPool.filter((q) => tier1Ids.has(q.id));
    if (companyFilter === "others")
      return dsaPool.filter((q) => !tier1Ids.has(q.id));
    return dsaPool;
  }, [dsaPool, companyFilter, tier1Ids]);

  const patternGroups = useMemo(
    () => groupByPattern(patternViewPool),
    [patternViewPool],
  );
  const allPatterns = useMemo(
    () => ["All", ...Object.keys(patternGroups).sort()],
    [patternGroups],
  );
  const filteredGroups =
    patternFilter === "All"
      ? Object.entries(patternGroups)
      : Object.entries(patternGroups).filter(([p]) => p === patternFilter);

  // ── HR category groups ────────────────────────────────────────────────────
  const hrPatternQs = useMemo(
    () =>
      hrCatFilter === "All"
        ? HR_QUESTIONS
        : HR_QUESTIONS.filter((q) => q.category === hrCatFilter),
    [hrCatFilter],
  );
  const hrGrouped = useMemo(
    () =>
      hrPatternQs.reduce((acc, q) => {
        if (!acc[q.category]) acc[q.category] = [];
        acc[q.category].push(q);
        return acc;
      }, {}),
    [hrPatternQs],
  );

  // ── add panel ─────────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* HR answer popup */}
      {popupQ && (
        <HRPopup
          q={popupQ}
          checked={!!solved[`__hr_${popupQ.id}`]}
          onCheck={toggleHR}
          onClose={() => setPopupQ(null)}
        />
      )}

      {/* ── Overview ── */}
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
            { label: "In Pool", value: totalInPool },
            { label: "Solved", value: totalSolved },
            { label: "DSA/Day", value: dsaQPD + " Qs" },
            { label: "Days Left", value: daysLeft },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: "var(--bg3)",
                borderRadius: 10,
                padding: "20px 6px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span
                style={{
                  fontSize: 22,
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
        {hasHR && (
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <div
              style={{
                flex: 1,
                background: "var(--bg3)",
                borderRadius: 8,
                padding: "6px 10px",
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: "var(--txt3)",
                  textTransform: "uppercase",
                  letterSpacing: ".05em",
                  marginBottom: 3,
                }}
              >
                ⚡ DSA
              </div>
              <Bar
                pct={
                  dsaPool.length
                    ? Math.round((dsaSolved / dsaPool.length) * 100)
                    : 0
                }
                color={accent}
                height={4}
              />
              <div style={{ fontSize: 9, color: "var(--txt3)", marginTop: 3 }}>
                {dsaSolved}/{dsaPool.length}
              </div>
            </div>
            <div
              style={{
                flex: 1,
                background: "var(--bg3)",
                borderRadius: 8,
                padding: "6px 10px",
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: "var(--txt3)",
                  textTransform: "uppercase",
                  letterSpacing: ".05em",
                  marginBottom: 3,
                }}
              >
                🎯 HR
              </div>
              <Bar
                pct={Math.round((hrSolved / HR_QUESTIONS.length) * 100)}
                color="#9b72cf"
                height={4}
              />
              <div style={{ fontSize: 9, color: "var(--txt3)", marginTop: 3 }}>
                {hrSolved}/{HR_QUESTIONS.length} · {hrQPD}q/day
              </div>
            </div>
          </div>
        )}
      </Card>

     
      <div style={{ display: "flex", gap: 6 }}>
        {[
          { id: "today", label: "Today" },
          // { id: "patterns", label: "Patterns" },
          { id: "add", label: "Add Questions" },
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

      {/* ════ TODAY ════ */}
      {view === "today" && (
        <Card>
          {/* header */}
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
                  {todayDone}/{todayTotal} done
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

          {/* DSA section */}
          <SectionDivider
            label="⚡ DSA & Coding"
            count={todayDsaQs.length}
            done={todayDsaDone}
            color={accent}
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {todayDsaQs.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  color: "var(--txt3)",
                  fontSize: 13,
                  padding: 16,
                }}
              >
                No DSA questions in your pool yet. Go to ➕ Add Questions.
              </div>
            ) : (
              todayDsaQs.map((q) => (
                <div
                  key={q.id}
                  style={{ display: "flex", flexDirection: "column", gap: 5 }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      flexWrap: "wrap",
                      paddingLeft: 2,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 800,
                        padding: "2px 8px",
                        borderRadius: 99,
                        background: accent + "22",
                        color: accent,
                        border: `1px solid ${accent}44`,
                      }}
                    >
                      {q.pattern}
                    </span>
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 600,
                        color: "var(--txt3)",
                        fontStyle: "italic",
                      }}
                    >
                      {q.topic}
                    </span>
                    {q.companies?.length > 0 && (
                      <span style={{ fontSize: 9, color: "var(--txt3)" }}>
                        {q.companies.slice(0, 4).join(" · ")}
                      </span>
                    )}
                  </div>
                  <QuestionRow
                    q={q}
                    checked={!!solved[`__q_${q.id}`]}
                    onCheck={toggleDSA}
                    accent={accent}
                  />
                </div>
              ))
            )}
          </div>
          {todayDsaQs.length > 0 && (
            <div
              style={{
                marginTop: 8,
                padding: "7px 12px",
                background: "var(--bg3)",
                borderRadius: 10,
                fontSize: 11,
                color: "var(--txt3)",
              }}
            >
              <span style={{ fontWeight: 700, color: "var(--txt2)" }}>
                Today's patterns:{" "}
              </span>
              {[...new Set(todayDsaQs.map((q) => q.pattern))].join(" · ")}
            </div>
          )}

          {/* HR section */}
          {hasHR && (
            <>
              <SectionDivider
                label="🎯 HR Interview"
                count={todayHrQs.length}
                done={todayHrDone}
                color="#9b72cf"
              />
              <div
                style={{
                  fontSize: 11,
                  color: "var(--txt3)",
                  marginBottom: 8,
                  padding: "0 2px",
                }}
              >
                Tap any question to read a sample answer and mark it done.
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {todayHrQs.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      color: "var(--txt3)",
                      fontSize: 13,
                      padding: 16,
                    }}
                  >
                    No HR questions available.
                  </div>
                ) : (
                  todayHrQs.map((q) => (
                    <HRQuestionRow
                      key={q.id}
                      q={q}
                      checked={!!solved[`__hr_${q.id}`]}
                      onOpen={setPopupQ}
                    />
                  ))
                )}
              </div>
              {todayHrQs.length > 0 && (
                <div
                  style={{
                    marginTop: 8,
                    padding: "7px 12px",
                    background: "var(--bg3)",
                    borderRadius: 10,
                    fontSize: 11,
                    color: "var(--txt3)",
                  }}
                >
                  <span style={{ fontWeight: 700, color: "var(--txt2)" }}>
                    Today's HR categories:{" "}
                  </span>
                  {[...new Set(todayHrQs.map((q) => q.category))].join(" · ")}
                </div>
              )}
            </>
          )}
        </Card>
      )}

     
      {view === "patterns" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
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

          <div
            style={{
              display: "flex",
              gap: 5,
              background: "var(--bg3)",
              borderRadius: 12,
              padding: 4,
              border: "1px solid var(--border)",
            }}
          >
            {[
              { id: "all", label: "All Questions" },
              { id: "company", label: `🏢 ${company || "Company"} Only` },
              { id: "others", label: "🌐 Other Companies" },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => {
                  setCompanyFilter(opt.id);
                  setPatternFilter("All");
                }}
                style={{
                  flex: 1,
                  padding: "6px 4px",
                  borderRadius: 9,
                  cursor: "pointer",
                  border: "none",
                  background: companyFilter === opt.id ? accent : "transparent",
                  color: companyFilter === opt.id ? "#fff" : "var(--txt3)",
                  fontSize: 10,
                  fontWeight: 700,
                  transition: "all .15s",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

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
              const qs = p === "All" ? patternViewPool : patternGroups[p] || [];
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

          {patternViewPool.length > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 11px",
                background: "var(--bg3)",
                borderRadius: 9,
                border: "1px solid var(--border)",
                fontSize: 10,
                color: "var(--txt3)",
              }}
            >
              <span style={{ fontSize: 13 }}>💡</span>
              <span>
                Mark questions done in{" "}
                <span
                  style={{ color: accent, fontWeight: 700, cursor: "pointer" }}
                  onClick={() => setView("today")}
                >
                  Today's Session
                </span>
                . Progress reflects here automatically.
              </span>
            </div>
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
                      onCheck={toggleDSA}
                      accent={accent}
                      showCompanies
                      readOnly
                    />
                  ))}
                </div>
              </Card>
            );
          })}

          {/* HR patterns section */}
          {hasHR && (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  margin: "6px 0",
                }}
              >
                <div
                  style={{ flex: 1, height: 1, background: "var(--border)" }}
                />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: "#9b72cf",
                    padding: "4px 14px",
                    borderRadius: 99,
                    background: "#9b72cf18",
                    border: "1px solid #9b72cf33",
                  }}
                >
                  🎯 HR Interview Questions
                </span>
                <div
                  style={{ flex: 1, height: 1, background: "var(--border)" }}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 5,
                  overflowX: "auto",
                  paddingBottom: 2,
                  scrollbarWidth: "none",
                }}
              >
                {["All", ...HR_CATEGORIES_LIST].map((c) => {
                  const col = HR_CATEGORY_COLORS[c] || "#9b72cf";
                  const qs =
                    c === "All"
                      ? HR_QUESTIONS
                      : HR_QUESTIONS.filter((q) => q.category === c);
                  const done = qs.filter((q) => solved[`__hr_${q.id}`]).length;
                  const isOn = hrCatFilter === c;
                  return (
                    <button
                      key={c}
                      onClick={() => setHrCatFilter(c)}
                      style={{
                        flexShrink: 0,
                        padding: "5px 10px",
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
                      {c} {done}/{qs.length}
                    </button>
                  );
                })}
              </div>

              {Object.entries(hrGrouped).map(([cat, qs]) => {
                const col = HR_CATEGORY_COLORS[cat] || "#888";
                const done = qs.filter((q) => solved[`__hr_${q.id}`]).length;
                const pct = qs.length
                  ? Math.round((done / qs.length) * 100)
                  : 0;
                const barCol =
                  pct < 40 ? "#e05252" : pct > 70 ? "#4caf7d" : "#d4b44a";
                return (
                  <Card key={cat} style={{ padding: "12px 14px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 7,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 7,
                        }}
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
                          {qs.length} questions
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
                      {sortHRByFrequency(qs).map((q) => (
                        <HRQuestionRow
                          key={q.id}
                          q={q}
                          checked={!!solved[`__hr_${q.id}`]}
                          onOpen={setPopupQ}
                        />
                      ))}
                    </div>
                  </Card>
                );
              })}
            </>
          )}
        </div>
      )}

      {/* ════ ADD QUESTIONS ════ */}
      {view === "add" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
