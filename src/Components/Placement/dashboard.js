// pip.Dashboard.jsx — Main prep dashboard after setup

"use client";
import { useState, useEffect } from "react";
import { COMPANIES } from "./constants";
import { load,save } from "./store";
import { Bar,Tag,Card,SectionLabel,CompanyLogo } from "./ui.js";
import PlanTab from "./plantab";
import QuestionsTab from "./questionstab";
import RoundsTab from "./roundstab";
import AnalyticsTab from "./analyticstab";

function days(d) {
  return Math.max(0, Math.ceil((new Date(d) - Date.now()) / 86400000));
}

const TABS = [
  { id: "plan", label: "📋 Plan" },
  { id: "questions", label: "🔥 Questions" },
  { id: "rounds", label: "🎯 Rounds" },
  { id: "analytics", label: "📊 Analytics" },
];

export default function Dashboard({ setup, onReset }) {
  const co = COMPANIES[setup.company];
  const daysLeft = days(setup.date);
  const questionsPerDay = Math.max(
    2,
    Math.min(
      8,
      Math.round(Math.max(30, daysLeft * 3.5) / Math.max(daysLeft, 1)),
    ),
  );
  const totalTarget = questionsPerDay * daysLeft;

  const solvedKey = "pip_solved_" + setup.company;
  const [solved, setSolved] = useState(() => load(solvedKey, {}));
  const [activeTab, setActiveTab] = useState("plan");

  useEffect(() => {
    save(solvedKey, solved);
  }, [solved, solvedKey]);

  const dsaSolved = Object.entries(solved)
    .filter(([k]) => !k.startsWith("__q_"))
    .reduce((s, [, v]) => s + (v || 0), 0);

  const readiness = Math.min(
    100,
    Math.round(
      Object.entries(co.topics).reduce((s, [t, w]) => {
        const target = Math.max(1, Math.round(w / 3));
        const pct = Math.min(1, (solved[t] || 0) / target);
        return s + pct * w;
      }, 0),
    ),
  );

  const urgency =
    daysLeft <= 7 ? "#e05252" : daysLeft <= 14 ? "#e8924a" : "#4caf7d";

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
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
                {daysLeft} days left
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

      {/* Stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 10,
          marginBottom: 16,
        }}
      >
        {[
          { label: "Days Left", value: daysLeft, color: urgency },
          { label: "Readiness", value: readiness + "%", color: co.color },
          { label: "DSA Solved", value: dsaSolved, color: "#9b72cf" },
        ].map((s) => (
          <Card
            key={s.label}
            style={{ padding: "14px 12px", textAlign: "center" }}
          >
            <div
              style={{
                fontSize: 26,
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
                fontSize: 10,
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

      {/* Readiness bar */}
      <Card style={{ marginBottom: 16, padding: "14px 16px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--txt)" }}>
            {setup.company} Readiness Score
          </span>
          <span style={{ fontSize: 22, fontWeight: 900, color: co.color }}>
            {readiness}
            <span style={{ fontSize: 12, color: "var(--txt3)" }}>/100</span>
          </span>
        </div>
        <Bar pct={readiness} color={co.color} height={10} />
        <div
          style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}
        >
          {Object.entries(co.topics).map(([t, w]) => {
            const done = solved[t] || 0;
            const target = Math.round(w / 3);
            const pct = Math.min(100, Math.round((done / target) * 100));
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

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 5,
          marginBottom: 16,
          background: "var(--bg3)",
          borderRadius: 12,
          padding: 4,
        }}
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              flex: 1,
              padding: "8px 4px",
              borderRadius: 9,
              border: "none",
              background: activeTab === t.id ? "var(--bg)" : "transparent",
              color: activeTab === t.id ? "var(--txt)" : "var(--txt3)",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all .15s",
              boxShadow:
                activeTab === t.id ? "0 1px 4px rgba(0,0,0,.15)" : "none",
              whiteSpace: "nowrap",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "plan" && (
        <PlanTab
          co={co}
          daysLeft={daysLeft}
          questionsPerDay={questionsPerDay}
          totalTarget={totalTarget}
          solved={solved}
          setSolved={setSolved}
        />
      )}
      {activeTab === "questions" && (
        <QuestionsTab co={co} solved={solved} setSolved={setSolved} />
      )}
      {activeTab === "rounds" && <RoundsTab co={co} company={setup.company} />}
      {activeTab === "analytics" && (
        <AnalyticsTab
          co={co}
          solved={solved}
          daysLeft={daysLeft}
          totalTarget={totalTarget}
          company={setup.company}
        />
      )}
    </div>
  );
}
