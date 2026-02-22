"use client";
import { useState } from "react";
import { useApp } from "@/Components/store";

const THEMES = [
  {
    id: "dark",
    label: "Dark",
    bg: "#080808",
    fg: "#f0f0f0",
    sub: "Pure black",
  },
  {
    id: "white",
    label: "Light",
    bg: "#fafafa",
    fg: "#111111",
    sub: "Pure white",
  },
  { id: "gray", label: "Gray", bg: "#181818", fg: "#ebebeb", sub: "Mid gray" },
];

const SEMS = [
  "Semester 1",
  "Semester 2",
  "Semester 3",
  "Semester 4",
  "Semester 5",
  "Semester 6",
  "Semester 7",
  "Semester 8",
];

export default function SettingsView() {
  const {
    theme,
    setTheme,
    tasks,
    doneCount,
    progress,
    cgpaGoal,
    setCgpaGoal,
    sem,
    setSem,
  } = useApp();
  const totalPomos = tasks.reduce((s, t) => s + (t.pomodoros || 0), 0);

  function clearDone() {
    if (!confirm("Clear all completed tasks?")) return;
    const key = "gr_tasks_" + new Date().toISOString().slice(0, 10);
    const saved = localStorage.getItem(key);
    if (saved) {
      localStorage.setItem(
        key,
        JSON.stringify(JSON.parse(saved).filter((t) => !t.done)),
      );
      window.location.reload();
    }
  }

  function clearAll() {
    if (!confirm("Reset ALL data? This cannot be undone.")) return;
    Object.keys(localStorage)
      .filter((k) => k.startsWith("gr_"))
      .forEach((k) => localStorage.removeItem(k));
    window.location.reload();
  }

  return (
    <div className="page">
      <h1
        style={{
          fontSize: 26,
          fontWeight: 800,
          letterSpacing: "-.03em",
          color: "var(--txt)",
          marginBottom: 24,
        }}
      >
        Settings
      </h1>

      {/* Theme */}
      <div style={{ marginBottom: 24 }}>
        <div className="slabel" style={{ marginBottom: 10 }}>
          Theme
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 9,
          }}
        >
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`swatch ${theme === t.id ? "on" : ""}`}
              style={{
                background: t.bg,
                borderColor: theme === t.id ? t.fg : t.bg + "22",
              }}
            >
              <div style={{ display: "flex", gap: 3 }}>
                {[1, 0.5, 0.2].map((o, i) => (
                  <div
                    key={i}
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: t.fg,
                      opacity: o,
                    }}
                  />
                ))}
              </div>
              <div style={{ color: t.fg, fontSize: 12, fontWeight: 700 }}>
                {t.label}
              </div>
              <div style={{ color: t.fg, fontSize: 10, opacity: 0.45 }}>
                {t.sub}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Academic */}
      <div style={{ marginBottom: 24 }}>
        <div className="slabel" style={{ marginBottom: 10 }}>
          Academic Profile
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div className="setrow">
            <div>
              <div
                style={{ fontSize: 14, fontWeight: 500, color: "var(--txt)" }}
              >
                Semester
              </div>
              <div style={{ fontSize: 12, color: "var(--txt3)", marginTop: 1 }}>
                Current semester
              </div>
            </div>
            <select
              value={sem}
              onChange={(e) => {
                setSem(e.target.value);
                localStorage.setItem("gr_sem", e.target.value);
              }}
              style={{
                background: "var(--bg3)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "6px 10px",
                fontFamily: "var(--font)",
                fontSize: 12,
                color: "var(--txt)",
                outline: "none",
                cursor: "pointer",
              }}
            >
              {SEMS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="setrow">
            <div>
              <div
                style={{ fontSize: 14, fontWeight: 500, color: "var(--txt)" }}
              >
                CGPA Goal
              </div>
              <div style={{ fontSize: 12, color: "var(--txt3)", marginTop: 1 }}>
                Your target grade
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="number"
                min={1}
                max={10}
                step={0.1}
                value={cgpaGoal}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  setCgpaGoal(v);
                  localStorage.setItem("gr_cgpa", v);
                }}
                style={{
                  width: 64,
                  background: "var(--bg3)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  padding: "6px 10px",
                  fontFamily: "var(--mono)",
                  fontSize: 13,
                  color: "var(--txt)",
                  outline: "none",
                  textAlign: "center",
                }}
              />
              <span style={{ fontSize: 12, color: "var(--txt3)" }}>/10</span>
            </div>
          </div>
        </div>
      </div>

      {/* Today stats */}
      <div style={{ marginBottom: 24 }}>
        <div className="slabel" style={{ marginBottom: 10 }}>
          Today
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { label: "Tasks done", val: `${doneCount}/${tasks.length}` },
            { label: "Completion", val: `${progress}%` },
            {
              label: "Pomodoros done",
              val: `🍅 ${totalPomos} (${totalPomos * 25}min focus)`,
            },
          ].map((r) => (
            <div key={r.label} className="setrow">
              <span
                style={{ fontSize: 14, fontWeight: 500, color: "var(--txt)" }}
              >
                {r.label}
              </span>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--txt)",
                  fontFamily: "var(--mono)",
                }}
              >
                {r.val}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Data */}
      <div style={{ marginBottom: 36 }}>
        <div className="slabel" style={{ marginBottom: 10 }}>
          Data
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div className="setrow">
            <div>
              <div
                style={{ fontSize: 14, fontWeight: 500, color: "var(--txt)" }}
              >
                Clear completed tasks
              </div>
              <div style={{ fontSize: 12, color: "var(--txt3)", marginTop: 1 }}>
                Remove done items from today
              </div>
            </div>
            <button
              onClick={clearDone}
              style={{
                padding: "7px 14px",
                borderRadius: 9,
                border: "none",
                background: "var(--orange)22",
                color: "var(--orange)",
                fontFamily: "var(--font)",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Clear
            </button>
          </div>
          <div className="setrow">
            <div>
              <div
                style={{ fontSize: 14, fontWeight: 500, color: "var(--red)" }}
              >
                Reset all data
              </div>
              <div style={{ fontSize: 12, color: "var(--txt3)", marginTop: 1 }}>
                Wipe everything and start fresh
              </div>
            </div>
            <button
              onClick={clearAll}
              style={{
                padding: "7px 14px",
                borderRadius: 9,
                border: "none",
                background: "var(--red)22",
                color: "var(--red)",
                fontFamily: "var(--font)",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontSize: 13,
            color: "var(--txt3)",
            fontWeight: 700,
            letterSpacing: ".04em",
          }}
        >
          Daily Mark
        </div>
        <div
          style={{
            fontSize: 11,
            color: "var(--txt3)",
            marginTop: 3,
            opacity: 0.6,
          }}
        >
          Built for BTech students · v2.0
        </div>
      </div>
    </div>
  );
}
