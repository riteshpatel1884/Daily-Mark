"use client";
import { useState, useMemo } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const COMPANIES = {
  // Product-Based
  Google: { color: "#4285F4", logo: "G", type: "Product" },
  Microsoft: { color: "#00A4EF", logo: "M", type: "Product" },
  Amazon: { color: "#FF9900", logo: "A", type: "Product" },
  Meta: { color: "#0866FF", logo: "f", type: "Product" },
  Apple: { color: "#555555", logo: "", type: "Product" },
  Netflix: { color: "#E50914", logo: "N", type: "Product" },
  Uber: { color: "#333333", logo: "U", type: "Product" },
  Airbnb: { color: "#FF5A5F", logo: "∞", type: "Product" },
  Stripe: { color: "#6772E5", logo: "S", type: "Product" },
  Salesforce: { color: "#00A1E0", logo: "☁", type: "Product" },
  Adobe: { color: "#FF0000", logo: "Ai", type: "Product" },
  Oracle: { color: "#F80000", logo: "O", type: "Product" },
  LinkedIn: { color: "#0077B5", logo: "in", type: "Product" },
  Spotify: { color: "#1ED760", logo: "♫", type: "Product" },
  Atlassian: { color: "#0052CC", logo: "A", type: "Product" },
  Palantir: { color: "#555555", logo: "P", type: "Product" },
  OpenAI: { color: "#10A37F", logo: "⊕", type: "Product" },
  Anthropic: { color: "#C96442", logo: "◈", type: "Product" },
  DeepMind: { color: "#4A90D9", logo: "D", type: "Product" },
  Flipkart: { color: "#F7A825", logo: "F", type: "Product" },
  // Service-Based
  TCS: { color: "#0033A0", logo: "T", type: "Service" },
  Infosys: { color: "#007CC3", logo: "I", type: "Service" },
  Wipro: { color: "#341675", logo: "W", type: "Service" },
  Accenture: { color: "#A100FF", logo: "A", type: "Service" },
  Cognizant: { color: "#1261AF", logo: "C", type: "Service" },
  Capgemini: { color: "#0070AD", logo: "C", type: "Service" },
  HCL: { color: "#007DB8", logo: "H", type: "Service" },
  IBM: { color: "#1F70C1", logo: "I", type: "Service" },
  Deloitte: { color: "#86BC25", logo: "D", type: "Service" },
  PWC: { color: "#D04A02", logo: "P", type: "Service" },
};

const ROLE_CATEGORIES = {
  "Software Engineering": [
    "SDE-1",
    "SDE-2",
    "SDE-3 / Senior",
    "Staff Engineer",
    "Principal Engineer",
    "EM",
  ],
  // "AI / ML": [
  //   "ML Engineer",
  //   "AI Engineer",
  //   "Research Engineer",
  //   "Data Scientist",
  //   "MLOps Engineer",
  //   "NLP Engineer",
  //   "Computer Vision Engineer",
  //   "AI Product Manager",
  // ],
};

const PREP_GOALS = [
  { id: "dsa", label: "DSA & Coding", icon: "⚡" },
  { id: "system", label: "System Design", icon: "🏗" },
  // { id: "ml",     label: "ML / AI Concepts", icon: "🤖" },
  { id: "sql", label: "SQL / Databases", icon: "🗄" },
];

const EXPERIENCE_LEVELS = [
  "Fresher (0–1 yr)",
  "Junior (1–5 yrs)",
  "Senior (5+ yrs)",
];

// ─── UI primitives — all use CSS vars ────────────────────────────────────────

const Label = ({ children }) => (
  <div className="slabel" style={{ marginBottom: 10 }}>
    {children}
  </div>
);

// Small pill chip — uses CSS vars for border/bg, accent color for active
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

// Card uses existing .card class from globals.css
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
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [goals, setGoals] = useState(["dsa"]);
  const [experience, setExperience] = useState("Junior (1–5 yrs)");
  const [activeRoleTab, setActiveRoleTab] = useState("Software Engineering");

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minStr = minDate.toISOString().slice(0, 10);

  const daysLeft = date
    ? Math.ceil((new Date(date) - new Date()) / 86400000)
    : null;

  const filteredCompanies = useMemo(
    () =>
      Object.entries(COMPANIES).filter(
        ([name, info]) =>
          name.toLowerCase().includes(search.toLowerCase()) &&
          (typeFilter === "All" || info.type === typeFilter),
      ),
    [search, typeFilter],
  );

  const co = COMPANIES[company] ?? { color: "#5b8def" };
  const toggleGoal = (id) =>
    setGoals((p) => (p.includes(id) ? p.filter((g) => g !== id) : [...p, id]));

  const canSubmit = date && goals.length > 0;

  // Timeline urgency
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
          max-height: 256px;
          overflow-y: auto;
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
        .sv-filter-btn {
          padding: 6px 10px;
          border-radius: 7px;
          font-size: 10px;
          font-weight: 700;
          border: 1.5px solid var(--border2);
          background: var(--bg3);
          color: var(--txt2);
          cursor: pointer;
          font-family: var(--font);
          transition: all .15s;
        }
        .sv-filter-btn.on {
          border-color: var(--blue);
          background: color-mix(in srgb, var(--blue) 15%, transparent);
          color: var(--blue);
        }
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
        .sv-search {
          flex: 1 1 110px;
          min-width: 80px;
          background: var(--bg3);
          border: 1.5px solid var(--border);
          border-radius: 8px;
          padding: 7px 10px;
          color: var(--txt);
          font-size: 12px;
          font-family: var(--font);
          outline: none;
          transition: border-color .15s;
        }
        .sv-search:focus { border-color: var(--txt2); }
        .sv-search::placeholder { color: var(--txt3); }
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
          .sv-company-grid { grid-template-columns: repeat(3, 1fr) !important; }
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
          <div
            style={{
              display: "flex",
              gap: 6,
              marginBottom: 10,
              flexWrap: "wrap",
            }}
          >
            <input
              className="sv-search"
              placeholder="Search companies…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <div style={{ display: "flex", gap: 4 }}>
              {["All", "Product", "Service"].map((t) => (
                <button
                  key={t}
                  className={`sv-filter-btn${typeFilter === t ? " on" : ""}`}
                  onClick={() => setTypeFilter(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="sv-company-grid">
            {filteredCompanies.map(([name, info]) => {
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
                      color:
                        info.type === "Product"
                          ? "var(--yellow)"
                          : "var(--green)",
                      background:
                        info.type === "Product"
                          ? "color-mix(in srgb, var(--yellow) 12%, transparent)"
                          : "color-mix(in srgb, var(--green) 12%, transparent)",
                    }}
                  >
                    {info.type}
                  </span>
                </button>
              );
            })}
            {filteredCompanies.length === 0 && (
              <div
                style={{
                  gridColumn: "1/-1",
                  textAlign: "center",
                  color: "var(--txt3)",
                  fontSize: 12,
                  padding: "16px 0",
                }}
              >
                No companies found
              </div>
            )}
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
              return (
                <button
                  key={g.id}
                  className={`sv-goal-btn${active ? " on" : ""}`}
                  onClick={() => toggleGoal(g.id)}
                >
                  <span style={{ fontSize: 15 }}>{g.icon}</span>
                  <span style={{ flex: 1 }}>{g.label}</span>
                  {active && (
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
                  )}
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
