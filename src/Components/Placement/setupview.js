"use client";
import { useState, useMemo } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const COMPANIES = {
  Google: { color: "#4285F4", logo: "G", type: "Product" },
  Microsoft: { color: "#00A4EF", logo: "M", type: "Product" },
};

const ROLE_CATEGORIES = {
  "Software Engineering": [
    "SDE-1",
    "SDE-2",
    "SDE-3 / Senior"
  ],
};

const PREP_GOALS = [
  { id: "dsa", label: "DSA & Coding", icon: "⚡" },
  { id: "system", label: "System Design", icon: "🏗", comingSoon: true },
  { id: "sql", label: "SQL / Databases", icon: "🗄", comingSoon: true },
];

const EXPERIENCE_LEVELS = [
  "Fresher (0–1 yr)",
  "Junior (1–3 yrs)",
  "Senior (3+ yrs)",
];

//  UI primitives — all use CSS vars ────────────────────────────────────────

const Label = ({ children }) => (
  <div className="slabel" style={{ marginBottom: 10 }}>
    {children}
  </div>
);

const Chip = ({ active, color = "#5b8def", onClick, children }) => (
  <button
    onClick={onClick}
    style={{
      padding: "5px 12px",
      borderRadius: 99,
      border: `1.5px solid ${active ? color : "var(--border2)"}`,
      background: active ? color + "22" : "var(--bg3)",
      color: active ? color : "var(--txt2)",
      fontSize: 11,
      fontWeight: 700,
      cursor: "pointer",
      transition: "all .15s",
      fontFamily: "var(--font)",
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </button>
);

const Tag = ({ color, children }) => (
  <span
    style={{
      padding: "3px 8px",
      borderRadius: 6,
      background: color + "18",
      color,
      fontSize: 11,
      fontWeight: 700,
      border: `1px solid ${color}30`,
    }}
  >
    {children}
  </span>
);

const C = ({ children, style = {} }) => (
  <div className="card" style={style}>
    {children}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SetupView({ onSubmit }) {
  const [company, setCompany] = useState("Google");
  const [role, setRole] = useState("SDE-1");
  const [date, setDate] = useState("");
  const [goals, setGoals] = useState(["dsa"]);
  const [experience, setExperience] = useState("Junior (1–5 yrs)");
  const [activeRoleTab, setActiveRoleTab] = useState("Software Engineering");

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minStr = minDate.toISOString().slice(0, 10);

  const daysLeft = date
    ? Math.ceil((new Date(date) - new Date()) / 86400000)
    : null;

  const co = COMPANIES[company] ?? { color: "#5b8def" };
  const toggleGoal = (id) => {
    const goal = PREP_GOALS.find((g) => g.id === id);
    if (goal?.comingSoon) return;
    setGoals((p) => (p.includes(id) ? p.filter((g) => g !== id) : [...p, id]));
  };

  const canSubmit = date && goals.length > 0;

  const urgencyColor = !daysLeft
    ? "var(--txt3)"
    : daysLeft < 7
      ? "var(--red)"
      : daysLeft < 21
        ? "var(--orange)"
        : "var(--green)";
  const urgencyBg = !daysLeft
    ? "transparent"
    : daysLeft < 7
      ? "var(--red)"
      : daysLeft < 21
        ? "var(--orange)"
        : "var(--green)";
  const urgencyLabel = !daysLeft
    ? ""
    : daysLeft < 7
      ? "Intensive mode needed"
      : daysLeft < 21
        ? "Focused prep"
        : "Comfortable timeline";

  return (
    <div style={{ fontFamily: "var(--font)", color: "var(--txt)" }}>
      <style>{`
        .sv-main-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 14px;
        }
        .sv-bottom-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 14px;
        }
        .sv-company-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
        }
        .sv-goal-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 7px;
        }
        .sv-co-btn {
          padding: 8px 4px;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          transition: all .15s;
          background: var(--bg3);
          border: 2px solid var(--border);
        }
        .sv-co-btn:hover { background: var(--bg4); }
        .sv-role-tab {
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 10px;
          font-weight: 700;
          border: 1.5px solid var(--border2);
          background: var(--bg3);
          color: var(--txt2);
          cursor: pointer;
          font-family: var(--font);
          transition: all .15s;
        }
        .sv-role-tab.on {
          border-color: var(--blue);
          background: color-mix(in srgb, var(--blue) 15%, transparent);
          color: var(--blue);
        }
        .sv-goal-btn {
          padding: 9px 10px;
          border-radius: 10px;
          border: 1.5px solid var(--border);
          background: var(--bg3);
          color: var(--txt2);
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          font-family: var(--font);
          display: flex;
          align-items: center;
          gap: 7px;
          transition: all .15s;
          text-align: left;
        }
        .sv-goal-btn.on {
          border-color: var(--blue);
          background: color-mix(in srgb, var(--blue) 12%, transparent);
          color: var(--txt);
        }
        .sv-goal-btn.disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
        .sv-coming-soon {
          font-size: 8px;
          font-weight: 800;
          padding: 2px 5px;
          border-radius: 4px;
          background: color-mix(in srgb, var(--orange) 18%, transparent);
          color: var(--orange);
          border: 1px solid color-mix(in srgb, var(--orange) 30%, transparent);
          white-space: nowrap;
          letter-spacing: .04em;
          text-transform: uppercase;
        }
        .sv-submit-btn {
          width: 100%;
          padding: 15px;
          border-radius: 12px;
          border: none;
          font-size: 15px;
          font-weight: 800;
          font-family: var(--font);
          transition: all .2s;
          letter-spacing: -.01em;
          cursor: pointer;
        }
        .sv-submit-btn:hover:not(:disabled) { filter: brightness(1.1); transform: translateY(-1px); }
        .sv-submit-btn:active:not(:disabled) { transform: translateY(0); }
        .sv-submit-btn:disabled { cursor: not-allowed; }
        .sv-summary {
          background: var(--bg2);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 12px 16px;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          align-items: center;
          margin-bottom: 14px;
        }
        .sv-date {
          width: 100%;
          background: var(--bg3);
          border: 1.5px solid var(--border);
          border-radius: 10px;
          padding: 11px 14px;
          color: var(--txt);
          font-size: 14px;
          font-family: var(--font);
          outline: none;
          transition: border-color .15s;
        }
        .sv-date:focus { border-color: var(--txt2); }
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(0.5); }

        @media (max-width: 600px) {
          .sv-main-grid   { grid-template-columns: 1fr !important; }
          .sv-bottom-grid { grid-template-columns: 1fr !important; }
          .sv-company-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .sv-goal-grid   { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── Header ── */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "var(--bg2)",
            border: "1px solid var(--border)",
            borderRadius: 99,
            padding: "5px 14px",
            marginBottom: 14,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "var(--green)",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              color: "var(--txt3)",
            }}
          >
            Placement Intelligence Platform
          </span>
        </div>
        <h1
          style={{
            fontFamily: "var(--font)",
            fontSize: "clamp(22px, 5vw, 38px)",
            fontWeight: 800,
            margin: "0 0 10px",
            lineHeight: 1.1,
            letterSpacing: "-.03em",
            color: "var(--txt)",
          }}
        >
          Build your interview edge.
          <br />
          <span style={{ color: "var(--blue)" }}>Data-first.</span>
        </h1>
        <p style={{ color: "var(--txt3)", fontSize: 13, margin: 0 }}>
          Personalised prep plans tailored to your target company, role, and
          timeline.
        </p>
      </div>

      {/* ── Top grid: Company | Role + Experience ── */}
      <div className="sv-main-grid">
        {/* Company */}
        <C>
          <Label>Target Company</Label>
          <div className="sv-company-grid">
            {Object.entries(COMPANIES).map(([name, info]) => {
              const sel = company === name;
              return (
                <button
                  key={name}
                  className="sv-co-btn"
                  onClick={() => setCompany(name)}
                  style={
                    sel
                      ? {
                          borderColor: info.color,
                          background: info.color + "18",
                        }
                      : {}
                  }
                >
                  <span
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 7,
                      background: info.color,
                      color: "#fff",
                      fontSize: 9,
                      fontWeight: 900,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {info.logo}
                  </span>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      textAlign: "center",
                      lineHeight: 1.2,
                      wordBreak: "break-word",
                      color: sel ? info.color : "var(--txt2)",
                    }}
                  >
                    {name}
                  </span>
                  <span
                    style={{
                      fontSize: 8,
                      fontWeight: 600,
                      padding: "1px 4px",
                      borderRadius: 4,
                      color: "var(--yellow)",
                      background:
                        "color-mix(in srgb, var(--yellow) 12%, transparent)",
                    }}
                  >
                    {info.type}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Coming Soon row */}
          <div
            style={{
              marginTop: 10,
              padding: "9px 12px",
              borderRadius: 10,
              border: "1.5px dashed var(--border2)",
              background: "var(--bg2)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{ fontSize: 11, color: "var(--txt3)", fontWeight: 600 }}
            >
              More companies
            </span>
            <span className="sv-coming-soon">Coming Soon</span>
            <span
              style={{ fontSize: 10, color: "var(--txt3)", marginLeft: "auto" }}
            >
              Amazon, Meta, Apple &amp; more
            </span>
          </div>
        </C>

        {/* Role + Experience */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <C>
            <Label>Role</Label>
            <div
              style={{
                display: "flex",
                gap: 5,
                flexWrap: "wrap",
                marginBottom: 8,
              }}
            >
              {Object.keys(ROLE_CATEGORIES).map((cat) => (
                <button
                  key={cat}
                  className={`sv-role-tab${activeRoleTab === cat ? " on" : ""}`}
                  onClick={() => setActiveRoleTab(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {ROLE_CATEGORIES[activeRoleTab].map((r) => (
                <Chip key={r} active={role === r} onClick={() => setRole(r)}>
                  {r}
                </Chip>
              ))}
            </div>
          </C>

          <C>
            <Label>Experience Level</Label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {EXPERIENCE_LEVELS.map((lvl) => (
                <Chip
                  key={lvl}
                  active={experience === lvl}
                  onClick={() => setExperience(lvl)}
                >
                  {lvl}
                </Chip>
              ))}
            </div>
          </C>
        </div>
      </div>

      {/* ── Bottom grid: Focus Areas | Date ── */}
      <div className="sv-bottom-grid">
        <C>
          <Label>Preparation Focus Areas</Label>
          <p style={{ fontSize: 11, color: "var(--txt3)", margin: "0 0 10px" }}>
            Select all areas you want covered in your prep plan.
          </p>
          <div className="sv-goal-grid">
            {PREP_GOALS.map((g) => {
              const active = goals.includes(g.id);
              const locked = !!g.comingSoon;
              return (
                <button
                  key={g.id}
                  className={`sv-goal-btn${active ? " on" : ""}${locked ? " disabled" : ""}`}
                  onClick={() => toggleGoal(g.id)}
                >
                  <span style={{ fontSize: 15 }}>{g.icon}</span>
                  <span style={{ flex: 1 }}>{g.label}</span>
                  {locked ? (
                    <span className="sv-coming-soon">Soon</span>
                  ) : active ? (
                    <span
                      style={{
                        width: 15,
                        height: 15,
                        borderRadius: "50%",
                        background: "var(--blue)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 8,
                        color: "#fff",
                        fontWeight: 900,
                        flexShrink: 0,
                      }}
                    >
                      ✓
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </C>

        <C>
          <Label>Interview Date</Label>
          <input
            type="date"
            min={minStr}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="sv-date"
          />
          {daysLeft !== null && (
            <div
              style={{
                marginTop: 10,
                padding: "8px 12px",
                background: `color-mix(in srgb, ${urgencyBg} 12%, transparent)`,
                border: `1px solid color-mix(in srgb, ${urgencyBg} 30%, transparent)`,
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                color: urgencyColor,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>{daysLeft < 7 ? "🔴" : daysLeft < 21 ? "🟡" : "🟢"}</span>
              <span>
                {daysLeft} day{daysLeft !== 1 ? "s" : ""} to prep ·{" "}
                {urgencyLabel}
              </span>
            </div>
          )}
        </C>
      </div>

      {/* ── Summary bar ── */}
      {canSubmit && (
        <div className="sv-summary">
          <span style={{ color: "var(--txt3)", fontWeight: 600, fontSize: 12 }}>
            Your plan:
          </span>
          <Tag color={co.color}>{company}</Tag>
          <Tag color="var(--purple)">{role}</Tag>
          <Tag color="var(--green)">{experience}</Tag>
          <Tag color="var(--orange)">{daysLeft}d prep</Tag>
          {goals.map((g) => (
            <Tag key={g} color="var(--txt2)">
              {PREP_GOALS.find((p) => p.id === g)?.label}
            </Tag>
          ))}
        </div>
      )}

      {/* ── Submit ── */}
      <button
        className="sv-submit-btn"
        disabled={!canSubmit}
        onClick={() => onSubmit({ company, role, date, goals, experience })}
        style={
          canSubmit
            ? {
                background: `linear-gradient(135deg, ${co.color}, ${co.color}bb)`,
                color: "#fff",
              }
            : {
                background: "var(--bg3)",
                color: "var(--txt3)",
              }
        }
      >
        {canSubmit
          ? `Generate ${company} Prep Plan`
          : "Complete the form to continue"}
      </button>
      {!canSubmit && (
        <p
          style={{
            textAlign: "center",
            color: "var(--txt3)",
            fontSize: 11,
            marginTop: 8,
          }}
        >
          {!date
            ? "Select an interview date to continue."
            : "Select at least one focus area."}
        </p>
      )}
    </div>
  );
}
