// pip.SetupView.jsx — Company + Role + Date entry screen

"use client";
import { useState } from "react";
import { COMPANIES,ROLES } from "./constants.js";
import { Card,SectionLabel } from "./ui.js";

export default function SetupView({ onSubmit }) {
  const [company, setCompany] = useState("Amazon");
  const [role, setRole] = useState("SDE-1");
  const [date, setDate] = useState("");

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minStr = minDate.toISOString().slice(0, 10);

  const co = COMPANIES[company];

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 0" }}>
      {/* Hero */}
      <div style={{ marginBottom: 28, textAlign: "center" }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: ".12em",
            textTransform: "uppercase",
            color: "var(--txt3)",
            marginBottom: 8,
          }}
        >
          Placement Intelligence
        </div>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 900,
            color: "var(--txt)",
            margin: 0,
            letterSpacing: "-.03em",
            lineHeight: 1.15,
          }}
        >
          Beat your interview.
          <br />
          <span style={{ color: "#5b8def" }}>Data-first.</span>
        </h1>
        <p style={{ color: "var(--txt3)", fontSize: 13, marginTop: 10 }}>
          Enter your target — get a smart prep plan instantly.
        </p>
      </div>

      <Card>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Company picker */}
          <div>
            <SectionLabel>Target Company</SectionLabel>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 8,
              }}
            >
              {Object.entries(COMPANIES).map(([name, info]) => {
                const sel = company === name;
                return (
                  <button
                    key={name}
                    onClick={() => setCompany(name)}
                    style={{
                      padding: "10px 8px",
                      borderRadius: 12,
                      border: `2px solid ${sel ? info.color : "var(--border)"}`,
                      background: sel ? info.color + "18" : "var(--bg3)",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 5,
                      transition: "all .15s",
                    }}
                  >
                    <span
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: info.color,
                        color: "#fff",
                        fontSize: 11,
                        fontWeight: 900,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {info.logo}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: sel ? info.color : "var(--txt2)",
                      }}
                    >
                      {name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Role picker */}
          <div>
            <SectionLabel>Role</SectionLabel>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {ROLES.map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  style={{
                    padding: "7px 14px",
                    borderRadius: 99,
                    border: `1.5px solid ${role === r ? "#5b8def" : "var(--border)"}`,
                    background: role === r ? "#5b8def18" : "var(--bg3)",
                    color: role === r ? "#5b8def" : "var(--txt2)",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all .15s",
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div>
            <SectionLabel>Interview Date</SectionLabel>
            <input
              type="date"
              min={minStr}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{
                width: "100%",
                background: "var(--bg3)",
                border: "1.5px solid var(--border)",
                borderRadius: 10,
                padding: "10px 14px",
                color: "var(--txt)",
                fontSize: 14,
                outline: "none",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            disabled={!date}
            onClick={() => onSubmit({ company, role, date })}
            style={{
              padding: "14px",
              borderRadius: 12,
              border: "none",
              background: date ? co.color : "var(--bg4)",
              color: date ? "#fff" : "var(--txt3)",
              fontSize: 14,
              fontWeight: 800,
              cursor: date ? "pointer" : "not-allowed",
              fontFamily: "inherit",
              transition: "all .2s",
            }}
          >
            Generate My Prep Plan →
          </button>
        </div>
      </Card>
    </div>
  );
}
