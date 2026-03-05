"use client";
import { useState, useEffect } from "react";
import { SETUP_KEY } from "./constants";
import { load, save } from "./store.js";
import SetupView from "./setupview";
import Dashboard from "./dashboard";
import ExperienceFeed from "./experiencefeed";
import InterviewCalendar from "./interviewcalendar";
import Leaderboard from "./leaderboard";
const NAV_TABS = [
  { id: "dashboard", label: "Prep" },
  { id: "calendar", label: "Calendar" },
  { id: "leaderboard", label: "Ranks" },
  { id: "feed", label: "Experiences" },
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
    <div className="page" style={{ paddingBottom: 40 }}>
      {/* ── Header ── */}
      <div style={{ marginBottom: 18 }}>
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
          Your placement operating system
        </div>
      </div>

      {/* ── Top-level nav ── */}
      <div
        style={{
          display: "flex",
          gap: 5,
          marginBottom: 20,
          overflowX: "auto",
          paddingBottom: 2,
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none",
        }}
      >
        {NAV_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flexShrink: 0,
              padding: "9px 14px",
              borderRadius: 99,
              border: `1.5px solid ${tab === t.id ? "#5b8def" : "var(--border)"}`,
              background: tab === t.id ? "#5b8def18" : "var(--bg3)",
              color: tab === t.id ? "#5b8def" : "var(--txt3)",
              fontSize: 12,
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

      {/* ── Content ── */}
      {tab === "dashboard" &&
        (setup ? (
          <Dashboard setup={setup} onReset={handleReset} />
        ) : (
          <SetupView onSubmit={handleSetup} />
        ))}

      {tab === "companies" && (
        <CompanyDatabase onSelectCompany={handleSelectCompany} />
      )}

      {tab === "calendar" && <InterviewCalendar />}

      {tab === "leaderboard" && <Leaderboard setup={setup} />}

      {tab === "feed" && <ExperienceFeed />}
    </div>
  );
}
