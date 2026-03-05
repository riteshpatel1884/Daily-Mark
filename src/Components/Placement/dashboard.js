// pip.Dashboard.jsx — Main prep dashboard

"use client";
import { useState, useEffect } from "react";
import { COMPANIES } from "./constants";
import { load, save } from "./store.js";
import { Bar, Tag, Card, SectionLabel, CompanyLogo } from "./ui.js";
import PlanTab from "./plantab";
import RoundsTab from "./roundstab";
import AnalyticsTab from "./analyticstab";
import SmartReminders from "./smartreminders";
import SurvivalGuide from "./survivalguide";
import PrepTimeline from "./preptimeline";

function daysLeft(date) {
  return Math.max(0, Math.ceil((new Date(date) - Date.now()) / 86400000));
}

const TABS = [
  { id: "plan", label: "📋 Plan" },
  { id: "rounds", label: "🎯 Rounds" },
  { id: "analytics", label: "📊 Stats" },
  { id: "timeline", label: "🗓 Timeline" },
  { id: "guide", label: "🧭 Guide" },
  { id: "reminders", label: "⚠ Pace" },
];

export default function Dashboard({ setup, onReset }) {
  const co = COMPANIES[setup.company];
  const dl = daysLeft(setup.date);

  // questionsPerDay is now computed inside PlanTab based on actual pool size.
  // We keep a simple estimate here only for the legacy Analytics/Reminders tabs.
  const legacyQpd = Math.max(
    2,
    Math.min(8, Math.round(Math.max(30, dl * 3.5) / Math.max(dl, 1))),
  );
  const totalTarget = legacyQpd * dl;

  const solvedKey = "pip_solved_" + setup.company;
  const [solved, setSolved] = useState(() => load(solvedKey, {}));
  const [activeTab, setActiveTab] = useState("plan");

  useEffect(() => {
    save(solvedKey, solved);
  }, [solved, solvedKey]);

  // Count only __q_ prefixed keys as "solved questions" for readiness score
  const dsaSolved = Object.entries(solved).filter(
    ([k]) => k.startsWith("__q_") && solved[k],
  ).length;

  const readiness = Math.min(
    100,
    Math.round(
      Object.entries(co.topics).reduce((s, [t, w]) => {
        const target = Math.max(1, Math.round(w / 3));
        return s + Math.min(1, (solved[t] || 0) / target) * w;
      }, 0),
    ),
  );

  // Readiness from actual questions solved (used for OA chance)
  const qSolvedCount = Object.keys(solved).filter(
    (k) => k.startsWith("__q_") && solved[k],
  ).length;
  const urgency = dl <= 7 ? "#e05252" : dl <= 14 ? "#e8924a" : "#4caf7d";
  const oaPct = Math.min(
    95,
    Math.round(
      Math.min(qSolvedCount * 2, 60) +
        Math.min(dl > 0 ? (30 - dl) * 0.5 : 15, 35),
    ),
  );

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <CompanyLogo logo={co.logo} color={co.color} size={44} />
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 900,
                color: "var(--txt)",
                letterSpacing: "-.02em",
              }}
            >
              {setup.company}
            </h2>
            <div style={{ fontSize: 12, color: "var(--txt3)" }}>
              {setup.role} ·{" "}
              <span style={{ color: urgency, fontWeight: 700 }}>
                {dl} days left
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onReset}
          style={{
            background: "var(--bg3)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "6px 12px",
            fontSize: 11,
            fontWeight: 700,
            color: "var(--txt3)",
            cursor: "pointer",
          }}
        >
          ← Change
        </button>
      </div>

      {/* ── 4-stat row ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 8,
          marginBottom: 14,
        }}
      >
        {[
          { label: "Days Left", value: dl, color: urgency },
          { label: "Readiness", value: readiness + "%", color: co.color },
          { label: "DSA Solved", value: qSolvedCount, color: "#9b72cf" },
          {
            label: "OA Chance",
            value: `~${oaPct}%`,
            color: oaPct > 65 ? "#4caf7d" : oaPct > 40 ? "#d4b44a" : "#e05252",
          },
        ].map((s) => (
          <Card
            key={s.label}
            style={{ padding: "12px 6px", textAlign: "center" }}
          >
            <div
              style={{
                fontSize: 19,
                fontWeight: 900,
                color: s.color,
                letterSpacing: "-.02em",
                lineHeight: 1,
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontSize: 9,
                color: "var(--txt3)",
                marginTop: 4,
                fontWeight: 700,
                letterSpacing: ".06em",
                textTransform: "uppercase",
              }}
            >
              {s.label}
            </div>
          </Card>
        ))}
      </div>

      {/* ── Readiness bar ── */}
      <Card style={{ marginBottom: 14, padding: "12px 16px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 7,
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--txt)" }}>
            {setup.company} Readiness Score
          </span>
          <span style={{ fontSize: 20, fontWeight: 900, color: co.color }}>
            {readiness}
            <span style={{ fontSize: 12, color: "var(--txt3)" }}>/100</span>
          </span>
        </div>
        <Bar pct={readiness} color={co.color} height={10} />
        <div
          style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}
        >
          {Object.entries(co.topics).map(([t, w]) => {
            const pct = Math.min(
              100,
              Math.round(
                ((solved[t] || 0) / Math.max(1, Math.round(w / 3))) * 100,
              ),
            );
            const color =
              pct < 40 ? "#e05252" : pct > 70 ? "#4caf7d" : "#d4b44a";
            return (
              <Tag key={t} color={color}>
                {pct < 40 ? "⚠ " : pct > 70 ? "✓ " : ""}
                {t}
              </Tag>
            );
          })}
        </div>
      </Card>

      {/* ── Tab bar ── */}
      <div
        style={{
          display: "flex",
          gap: 5,
          marginBottom: 16,
          overflowX: "auto",
          paddingBottom: 2,
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
        }}
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              flexShrink: 0,
              padding: "8px 12px",
              borderRadius: 99,
              border: `1.5px solid ${activeTab === t.id ? co.color : "var(--border)"}`,
              background: activeTab === t.id ? co.color + "18" : "var(--bg3)",
              color: activeTab === t.id ? co.color : "var(--txt3)",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all .15s",
              whiteSpace: "nowrap",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab content ── */}
      {activeTab === "plan" && (
        <PlanTab
          co={co}
          daysLeft={dl}
          setup={setup}
          solved={solved}
          setSolved={setSolved}
        />
      )}
      {activeTab === "rounds" && <RoundsTab co={co} company={setup.company} />}
      {activeTab === "analytics" && (
        <AnalyticsTab
          co={co}
          solved={solved}
          daysLeft={dl}
          totalTarget={totalTarget}
          company={setup.company}
        />
      )}
      {activeTab === "timeline" && <PrepTimeline setup={setup} co={co} />}
      {activeTab === "guide" && <SurvivalGuide company={setup.company} />}
      {activeTab === "reminders" && (
        <SmartReminders setup={setup} solved={solved} co={co} />
      )}
    </div>
  );
}
