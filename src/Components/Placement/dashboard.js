// pip.Dashboard.jsx — Main prep dashboard

"use client";
import { useState, useEffect } from "react";
import { COMPANIES } from "./constants";
import { load, save } from "./store.js";
import { Bar, Tag, Card, SectionLabel, CompanyLogo } from "./ui.js";
import PlanTab from "./plantab";
import RoundsTab from "./roundstab";
import SurvivalGuide from "./survivalguide";

function daysLeft(date) {
  return Math.max(0, Math.ceil((new Date(date) - Date.now()) / 86400000));
}

const TABS = [
  { id: "plan", label: "📋 Plan" },
  { id: "rounds", label: "🎯 Rounds" },
  { id: "guide", label: "🧭 Guide" },
];

export default function Dashboard({ setup, onReset }) {
  // Guard: co may not exist in COMPANIES (e.g. company added in SetupView not in constants)
  const co = (COMPANIES && COMPANIES[setup.company]) || {
    color: "#5b8def",
    logo: setup.company?.[0] || "?",
    topics: {},
  };

  const dl = daysLeft(setup.date);

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

  const dsaSolved = Object.entries(solved).filter(
    ([k]) => k.startsWith("__q_") && solved[k],
  ).length;

  // Guard against co.topics being undefined
  const readiness = Math.min(
    100,
    Math.round(
      co.topics && Object.keys(co.topics).length > 0
        ? Object.entries(co.topics).reduce((s, [t, w]) => {
            const target = Math.max(1, Math.round(w / 3));
            return s + Math.min(1, (solved[t] || 0) / target) * w;
          }, 0)
        : 0,
    ),
  );

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
      {activeTab === "guide" && <SurvivalGuide company={setup.company} />}
    </div>
  );
}
