// PlacementIntelligencePlatform.jsx — Main entry point
// Wires together all feature modules:
//
//   pip.constants.js        — Company data, seed experiences, keys
//   pip.store.js            — localStorage helpers + useExperiences hook
//   pip.ui.jsx              — Shared primitive components (Bar, Tag, Card…)
//   pip.SetupView.jsx       — Company/role/date entry screen
//   pip.Dashboard.jsx       — Main prep dashboard (tabs: Plan, Questions, Rounds, Analytics)
//   pip.PlanTab.jsx         — Smart daily plan + topic tracker
//   pip.QuestionsTab.jsx    — Topic frequency + hot questions
//   pip.RoundsTab.jsx       — Round structure + company stats + per-company feed
//   pip.AnalyticsTab.jsx    — Performance analytics + prediction engine
//   pip.ExperienceFeed.jsx  — Global filterable feed + submit form
//   pip.CompanyDatabase.jsx — Browse all companies

"use client";
import { useState, useEffect } from "react";
import { COMPANIES,SETUP_KEY } from "./constants";
import { load,save } from "./store";
import SetupView from "./setupview";
import Dashboard from "./dashboard";
import ExperienceFeed from "./experiencefeed";
import CompanyDatabase from "./companydatabase";

const NAV_TABS = [
  { id: "dashboard", label: "📊 Dashboard" },
  { id: "companies", label: "🏢 Companies" },
  { id: "feed", label: "💬 Experiences" },
];

export default function PlacementIntelligencePlatform() {
  const [setup, setSetup] = useState(() => load(SETUP_KEY, null));
  const [tab, setTab] = useState("dashboard");

  useEffect(() => {
    if (setup) save(SETUP_KEY, setup);
  }, [setup]);

  function handleSetup(data) {
    setSetup(data);
    setTab("dashboard");
  }

  function handleReset() {
    setSetup(null);
  }

  function handleSelectCompany(name) {
    // Auto-fill 30 days from today as default date when browsing from Companies tab
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 30);
    setSetup((prev) => ({
      company: name,
      role: prev?.role || "SDE-1",
      date: prev?.date || defaultDate.toISOString().slice(0, 10),
    }));
    setTab("dashboard");
  }

  return (
    <div className="page" style={{ paddingBottom: 32 }}>
      {/* ── Page header ── */}
      <div style={{ marginBottom: 20 }}>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 900,
            color: "var(--txt)",
            margin: 0,
            letterSpacing: "-.03em",
          }}
        >
          Placement Intel <span style={{ color: "#5b8def" }}>⚡</span>
        </h1>
        <div style={{ fontSize: 11, color: "var(--txt3)", marginTop: 3 }}>
          Data-driven interview preparation
        </div>
      </div>

      {/* ── Tab navigation ── */}
      <div
        style={{
          display: "flex",
          gap: 5,
          marginBottom: 20,
          background: "var(--bg3)",
          borderRadius: 12,
          padding: 4,
        }}
      >
        {NAV_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1,
              padding: "9px 4px",
              borderRadius: 9,
              border: "none",
              background: tab === t.id ? "var(--bg)" : "transparent",
              color: tab === t.id ? "var(--txt)" : "var(--txt3)",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all .15s",
              boxShadow: tab === t.id ? "0 1px 4px rgba(0,0,0,.12)" : "none",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab content ── */}

      {tab === "dashboard" &&
        (setup ? (
          <Dashboard setup={setup} onReset={handleReset} />
        ) : (
          <SetupView onSubmit={handleSetup} />
        ))}

      {tab === "companies" && (
        <CompanyDatabase onSelectCompany={handleSelectCompany} />
      )}

      {tab === "feed" && <ExperienceFeed />}
    </div>
  );
}
