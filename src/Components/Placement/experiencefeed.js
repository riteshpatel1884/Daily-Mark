// pip.ExperienceFeed.jsx — Full experiences feed with search/filter + submit form + detail popup

"use client";
import { useState, useEffect } from "react";
import { COMPANIES, ROLES, DIFFICULTIES } from "./constants";
import {
  Card,
  SectionLabel,
  Tag,
  DifficultyTag,
  CompanyLogo,
  INP_STYLE,
} from "./ui.js";
import { useExperiences } from "./store";

// ── Experience Detail Modal ───────────────────────────────────────────────────
function ExperienceModal({ exp, onClose }) {
  const co = COMPANIES[exp.company];
  const color = co?.color || "#5b8def";

  // Close on Escape key
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const roundLabels = {
    1: ["Application Review"],
    2: ["Online Assessment", "HR Round"],
    3: ["Online Assessment", "Technical Round", "HR Round"],
    4: ["Online Assessment", "DSA Round 1", "DSA Round 2", "HR Round"],
    5: [
      "Online Assessment",
      "DSA Round 1",
      "DSA Round 2",
      "System Design",
      "HR Round",
    ],
    6: [
      "Online Assessment",
      "DSA Round 1",
      "DSA Round 2",
      "System Design",
      "Bar Raiser",
      "HR Round",
    ],
  };
  // Use custom round names if saved, else fall back to defaults
  const rounds =
    exp.roundNames && exp.roundNames.length === exp.rounds
      ? exp.roundNames
      : roundLabels[exp.rounds] ||
        Array.from({ length: exp.rounds }, (_, i) => `Round ${i + 1}`);

  const diffColor =
    { Easy: "#4caf7d", Medium: "#e8924a", Hard: "#e05252" }[exp.difficulty] ||
    "#888";

  return (
    /* Backdrop */
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        animation: "fadeIn .18s ease",
      }}
    >
      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { opacity:0; transform:translateY(24px) } to { opacity:1; transform:translateY(0) } }
        .exp-modal-scroll::-webkit-scrollbar { width: 4px; }
        .exp-modal-scroll::-webkit-scrollbar-track { background: transparent; }
        .exp-modal-scroll::-webkit-scrollbar-thumb { background: #333; border-radius: 4px; }
      `}</style>

      {/* Modal panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="exp-modal-scroll"
        style={{
          width: "100%",
          maxWidth: 580,
          maxHeight: "90vh",
          overflowY: "auto",
          background: "var(--bg, #0d0d0d)",
          border: `1.5px solid ${color}44`,
          borderRadius: 20,
          animation: "slideUp .22s ease",
          position: "relative",
        }}
      >
        {/* ── Colored top bar ── */}
        <div
          style={{
            height: 4,
            background: `linear-gradient(90deg, ${color}, ${color}55)`,
            borderRadius: "20px 20px 0 0",
          }}
        />

        {/* ── Header ── */}
        <div
          style={{
            padding: "20px 20px 16px",
            background: `linear-gradient(135deg, ${color}12, transparent)`,
            borderBottom: "1px solid var(--border, #1e1e1e)",
            position: "sticky",
            top: 0,
            zIndex: 2,
            backdropFilter: "blur(12px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            {/* Company avatar */}
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 12,
                flexShrink: 0,
                background: color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                fontWeight: 900,
                color: "#fff",
                boxShadow: `0 0 18px ${color}44`,
              }}
            >
              {co?.logo || exp.company[0]}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontSize: 18,
                    fontWeight: 900,
                    color: "var(--txt, #f0f0f0)",
                    letterSpacing: "-.02em",
                  }}
                >
                  {exp.company}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: color,
                    background: color + "18",
                    border: `1px solid ${color}33`,
                    padding: "2px 8px",
                    borderRadius: 6,
                  }}
                >
                  {exp.role}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: exp.selected ? "#4caf7d" : "#e05252",
                    background: (exp.selected ? "#4caf7d" : "#e05252") + "15",
                    border: `1px solid ${exp.selected ? "#4caf7d" : "#e05252"}33`,
                    padding: "2px 8px",
                    borderRadius: 6,
                  }}
                >
                  {exp.selected ? "✓ Selected" : "✗ Rejected"}
                </span>
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--txt3, #666)",
                  marginTop: 4,
                }}
              >
                {exp.college}
                {exp.authorName && (
                  <span style={{ color: color, marginLeft: 6 }}>
                    · {exp.authorName}
                  </span>
                )}
                <span style={{ marginLeft: 6 }}>
                  ·{" "}
                  {new Date(exp.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "var(--bg3, #1a1a1a)",
                border: "1px solid var(--border, #222)",
                color: "var(--txt3, #666)",
                fontSize: 18,
                lineHeight: 1,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "all .15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#e0525222";
                e.currentTarget.style.color = "#e05252";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--bg3, #1a1a1a)";
                e.currentTarget.style.color = "var(--txt3, #666)";
              }}
            >
              ×
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        <div
          style={{
            padding: "18px 20px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          {/* ── Quick stats row ── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr",
              gap: 10,
            }}
          >
            {[
              { icon: "🏢", label: "Company", value: exp.company, color },
              {
                icon: "⚔️",
                label: "Rounds",
                value: `${exp.rounds} rounds`,
                color: "#9b72cf",
              },
              {
                icon: "🎯",
                label: "Difficulty",
                value: exp.difficulty,
                color: diffColor,
              },
              {
                icon: "📅",
                label: "Date",
                value: new Date(exp.date).toLocaleDateString("en-IN", {
                  month: "short",
                  year: "numeric",
                }),
                color: "#888",
              },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  background: "var(--bg2, #111)",
                  border: "1px solid var(--border, #1e1e1e)",
                  borderRadius: 10,
                  padding: "10px 8px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 800, color: s.color }}>
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: "var(--txt3, #555)",
                    marginTop: 2,
                    textTransform: "uppercase",
                    letterSpacing: ".07em",
                    fontWeight: 700,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* ── Round flow timeline ── */}
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: "var(--txt3, #555)",
                textTransform: "uppercase",
                letterSpacing: ".1em",
                marginBottom: 12,
              }}
            >
              📋 Interview Process
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 0,
              }}
            >
              {rounds.map((r, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: color + "22",
                        border: `2px solid ${color}66`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 11,
                        fontWeight: 900,
                        color,
                      }}
                    >
                      {i + 1}
                    </div>
                    <div
                      style={{
                        fontSize: 9,
                        fontWeight: 700,
                        color: "var(--txt3, #555)",
                        textAlign: "center",
                        maxWidth: 64,
                        lineHeight: 1.3,
                      }}
                    >
                      {r}
                    </div>
                  </div>
                  {i < rounds.length - 1 && (
                    <div
                      style={{
                        width: 24,
                        height: 2,
                        marginBottom: 16,
                        background: `linear-gradient(90deg, ${color}66, ${color}22)`,
                      }}
                    />
                  )}
                  {/* Final outcome arrow */}
                  {i === rounds.length - 1 && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: 16,
                      }}
                    >
                      <div
                        style={{
                          width: 16,
                          height: 2,
                          background:
                            (exp.selected ? "#4caf7d" : "#e05252") + "66",
                        }}
                      />
                      <div
                        style={{
                          padding: "3px 8px",
                          borderRadius: 8,
                          marginLeft: 4,
                          background:
                            (exp.selected ? "#4caf7d" : "#e05252") + "18",
                          border: `1px solid ${exp.selected ? "#4caf7d" : "#e05252"}44`,
                          fontSize: 10,
                          fontWeight: 800,
                          color: exp.selected ? "#4caf7d" : "#e05252",
                        }}
                      >
                        {exp.selected ? "🎉 Offer" : "✗ Rejected"}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── Per-round experience breakdown ── */}
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: "var(--txt3, #555)",
                textTransform: "uppercase",
                letterSpacing: ".1em",
                marginBottom: 12,
              }}
            >
              📝 Round-by-Round Experience
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {rounds.map((roundName, i) => {
                const story = exp.roundStories?.[i] || null;
                const isLast = i === rounds.length - 1;
                return (
                  <div key={i} style={{ display: "flex", gap: 0 }}>
                    {/* Timeline column */}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: 36,
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: "50%",
                          background: story
                            ? color + "22"
                            : "var(--bg3, #1a1a1a)",
                          border: `2px solid ${story ? color : "#333"}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontWeight: 900,
                          color: story ? color : "#555",
                          marginTop: 2,
                          flexShrink: 0,
                          boxShadow: story ? `0 0 8px ${color}33` : "none",
                        }}
                      >
                        {i + 1}
                      </div>
                      {!isLast && (
                        <div
                          style={{
                            width: 2,
                            flex: 1,
                            minHeight: 16,
                            background: `linear-gradient(180deg, ${color}55, ${color}11)`,
                            margin: "4px 0",
                          }}
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div
                      style={{
                        flex: 1,
                        paddingLeft: 12,
                        paddingBottom: isLast ? 0 : 20,
                      }}
                    >
                      {/* Round name badge */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          marginBottom: 8,
                          marginTop: 3,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 800,
                            color,
                            background: color + "18",
                            border: `1px solid ${color}33`,
                            padding: "2px 8px",
                            borderRadius: 6,
                            flexShrink: 0,
                          }}
                        >
                          Round {i + 1}
                        </span>
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "var(--txt, #f0f0f0)",
                          }}
                        >
                          {roundName}
                        </span>
                      </div>

                      {/* Story block */}
                      <div
                        style={{
                          background: story
                            ? "var(--bg2, #111)"
                            : "var(--bg3, #1a1a1a)",
                          border: `1px solid ${story ? color + "22" : "var(--border, #1e1e1e)"}`,
                          borderLeft: `3px solid ${story ? color : "#333"}`,
                          borderRadius: 10,
                          padding: "12px 14px",
                          opacity: story ? 1 : 0.5,
                        }}
                      >
                        {story ? (
                          <p
                            style={{
                              fontSize: 13,
                              color: "var(--txt2, #ccc)",
                              lineHeight: 1.75,
                              margin: 0,
                              whiteSpace: "pre-wrap",
                            }}
                          >
                            {story}
                          </p>
                        ) : (
                          <p
                            style={{
                              fontSize: 12,
                              color: "var(--txt3, #555)",
                              margin: 0,
                              fontStyle: "italic",
                            }}
                          >
                            No details shared for this round.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Tags ── */}
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: diffColor,
                background: diffColor + "18",
                border: `1px solid ${diffColor}33`,
                padding: "4px 10px",
                borderRadius: 7,
              }}
            >
              {exp.difficulty}
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#9b72cf",
                background: "#9b72cf18",
                border: "1px solid #9b72cf33",
                padding: "4px 10px",
                borderRadius: 7,
              }}
            >
              {exp.rounds} Rounds
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: exp.selected ? "#4caf7d" : "#e05252",
                background: (exp.selected ? "#4caf7d" : "#e05252") + "18",
                border: `1px solid ${exp.selected ? "#4caf7d" : "#e05252"}33`,
                padding: "4px 10px",
                borderRadius: 7,
              }}
            >
              {exp.selected ? "✓ Selected" : "✗ Rejected"}
            </span>
            {!exp.isSeed && (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#d4b44a",
                  background: "#d4b44a18",
                  border: "1px solid #d4b44a33",
                  padding: "4px 10px",
                  borderRadius: 7,
                }}
              >
                ✨ Community
              </span>
            )}
          </div>

          {/* ── Author info ── */}
          {(exp.authorName || exp.socialLink) && (
            <div
              style={{
                background: "var(--bg2, #111)",
                border: "1px solid var(--border, #1e1e1e)",
                borderRadius: 12,
                padding: "12px 14px",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              {/* Avatar */}
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  flexShrink: 0,
                  background: color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 900,
                  color: "#fff",
                }}
              >
                {(exp.authorName || "A")[0].toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--txt, #f0f0f0)",
                  }}
                >
                  {exp.authorName || "Anonymous"}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--txt3, #555)",
                    marginTop: 1,
                  }}
                >
                  {exp.college}
                </div>
              </div>
              {exp.socialLink && (
                <a
                  href={
                    exp.socialLink.startsWith("http")
                      ? exp.socialLink
                      : "https://" + exp.socialLink
                  }
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color,
                    textDecoration: "none",
                    padding: "6px 12px",
                    borderRadius: 8,
                    background: color + "18",
                    border: `1px solid ${color}33`,
                    flexShrink: 0,
                    transition: "opacity .15s",
                  }}
                >
                  View Profile ↗
                </a>
              )}
            </div>
          )}

          {/* ── Prep tip ── */}
          <div
            style={{
              background: "#4caf7d0d",
              border: "1px solid #4caf7d22",
              borderRadius: 12,
              padding: "12px 14px",
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
            }}
          >
            <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: "#4caf7d",
                  marginBottom: 3,
                  textTransform: "uppercase",
                  letterSpacing: ".07em",
                }}
              >
                Prep Tip
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--txt3, #666)",
                  lineHeight: 1.55,
                }}
              >
                {exp.selected
                  ? `This candidate was selected at ${exp.company}. Study their approach — focus on ${exp.difficulty === "Hard" ? "advanced DSA and system design" : exp.difficulty === "Medium" ? "core DSA patterns and behavioral answers" : "fundamentals and communication"} to match their preparation level.`
                  : `Even though this candidate wasn't selected, their experience reveals what ${exp.company} tests. Use it to identify gaps in your own prep.`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Round name presets ────────────────────────────────────────────────────────
const ROUND_PRESETS = [
  "Online Assessment",
  "DSA Round 1",
  "DSA Round 2",
  "System Design",
  "HR Round",
  "Bar Raiser",
  "Managerial Round",
  "Technical Interview",
  "Coding Round",
  "App. Deadline",
  "Custom...",
];

// Default round names by count
function defaultRoundNames(n) {
  const defaults = [
    "Online Assessment",
    "DSA Round 1",
    "DSA Round 2",
    "System Design",
    "HR Round",
    "Bar Raiser",
  ];
  return Array.from({ length: n }, (_, i) => defaults[i] || `Round ${i + 1}`);
}

// ── Submit Experience Form ────────────────────────────────────────────────────
function SubmitForm({ onClose, onSubmitted }) {
  const { addExperience } = useExperiences();

  const [form, setForm] = useState({
    company: "Amazon",
    role: "SDE-1",
    college: "",
    rounds: "4",
    selected: "true",
    difficulty: "Medium",
    authorName: "",
    socialLink: "",
  });

  // Per-round names + stories, length always = parseInt(form.rounds)
  const [roundNames, setRoundNames] = useState(() => defaultRoundNames(4));
  const [roundStories, setRoundStories] = useState(() => Array(4).fill(""));
  const [customMode, setCustomMode] = useState({});
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function handleRoundsChange(val) {
    const n = parseInt(val);
    setForm((p) => ({ ...p, rounds: val }));
    setRoundNames((prev) => {
      const defs = defaultRoundNames(n);
      return Array.from({ length: n }, (_, i) => prev[i] ?? defs[i]);
    });
    setRoundStories((prev) =>
      Array.from({ length: n }, (_, i) => prev[i] ?? ""),
    );
  }

  function setRoundName(i, val) {
    setRoundNames((prev) => prev.map((r, idx) => (idx === i ? val : r)));
  }

  function setRoundStory(i, val) {
    setRoundStories((prev) => prev.map((s, idx) => (idx === i ? val : s)));
    if (errors[`rs_${i}`])
      setErrors((p) => {
        const n = { ...p };
        delete n[`rs_${i}`];
        return n;
      });
  }

  function set(field, val) {
    setForm((p) => ({ ...p, [field]: val }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  }

  function validate() {
    const e = {};
    if (!form.college.trim()) e.college = "College name is required";
    // each round must have at least 20 chars
    roundStories.forEach((s, i) => {
      if (!s.trim() || s.trim().length < 20)
        e[`rs_${i}`] = "Write at least 20 characters for this round";
    });
    if (
      form.socialLink.trim() &&
      !/^(https?:\/\/|linkedin|github|twitter|leetcode)/i.test(
        form.socialLink.trim(),
      )
    )
      e.socialLink = "Enter a valid URL or profile link";
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    addExperience({
      company: form.company,
      role: form.role,
      college: form.college.trim(),
      rounds: parseInt(form.rounds),
      roundNames,
      roundStories: roundStories.map((s) => s.trim()),
      // keep legacy `story` as joined text for backward compat with card preview
      story: roundStories
        .map((s, i) => `${roundNames[i]}: ${s.trim()}`)
        .join("\n\n"),
      selected: form.selected === "true",
      difficulty: form.difficulty,
      authorName: form.authorName.trim(),
      socialLink: form.socialLink.trim(),
    });
    setSubmitted(true);
    setTimeout(() => {
      onSubmitted?.();
      onClose?.();
    }, 2200);
  }

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "40px 16px" }}>
        <div style={{ fontSize: 52, marginBottom: 14 }}>🎉</div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 900,
            color: "var(--txt)",
            marginBottom: 6,
          }}
        >
          Experience Shared!
        </div>
        <div style={{ fontSize: 13, color: "var(--txt3)", lineHeight: 1.5 }}>
          Thank you for helping the community. Your experience will appear in
          the feed.
        </div>
      </div>
    );
  }

  const inp = { ...INP_STYLE };
  const sel = { ...INP_STYLE, cursor: "pointer" };

  function FieldError({ field }) {
    return errors[field] ? (
      <div
        style={{
          fontSize: 11,
          color: "#e05252",
          marginTop: 4,
          fontWeight: 600,
        }}
      >
        ⚠ {errors[field]}
      </div>
    ) : null;
  }

  const roundCount = parseInt(form.rounds);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div>
          <SectionLabel>Company *</SectionLabel>
          <select
            value={form.company}
            onChange={(e) => set("company", e.target.value)}
            style={sel}
          >
            {Object.keys(COMPANIES).map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <SectionLabel>Role *</SectionLabel>
          <select
            value={form.role}
            onChange={(e) => set("role", e.target.value)}
            style={sel}
          >
            {ROLES.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <SectionLabel>College / University *</SectionLabel>
        <input
          value={form.college}
          onChange={(e) => set("college", e.target.value)}
          placeholder="e.g. IIT Bombay, NIT Trichy, VIT Vellore"
          style={{
            ...inp,
            borderColor: errors.college ? "#e05252" : "var(--border)",
          }}
        />
        <FieldError field="college" />
      </div>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}
      >
        <div>
          <SectionLabel>Rounds</SectionLabel>
          <select
            value={form.rounds}
            onChange={(e) => handleRoundsChange(e.target.value)}
            style={sel}
          >
            {["2", "3", "4", "5", "6"].map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
        <div>
          <SectionLabel>Outcome</SectionLabel>
          <select
            value={form.selected}
            onChange={(e) => set("selected", e.target.value)}
            style={sel}
          >
            <option value="true">✓ Selected</option>
            <option value="false">✗ Rejected</option>
          </select>
        </div>
        <div>
          <SectionLabel>Difficulty</SectionLabel>
          <select
            value={form.difficulty}
            onChange={(e) => set("difficulty", e.target.value)}
            style={sel}
          >
            {DIFFICULTIES.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>
      {/* ── Dynamic per-round name section ── */}
      <div
        style={{
          background: "var(--bg3)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: "14px",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            color: "var(--txt3)",
            textTransform: "uppercase",
            letterSpacing: ".08em",
            marginBottom: 12,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          🔢 Name Each Round
          <span
            style={{
              fontSize: 10,
              fontWeight: 500,
              color: "var(--txt3)",
              opacity: 0.6,
              textTransform: "none",
              letterSpacing: 0,
            }}
          >
            (select from dropdown or type your own)
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {Array.from({ length: roundCount }, (_, i) => {
            const isCustom = customMode[i];
            const currentVal = roundNames[i] || "";
            const co = COMPANIES[form.company];
            const color = co?.color || "#5b8def";

            return (
              <div
                key={i}
                style={{ display: "flex", alignItems: "center", gap: 8 }}
              >
                {/* Round number badge */}
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: color + "22",
                    border: `2px solid ${color}55`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 900,
                    color,
                  }}
                >
                  {i + 1}
                </div>

                {/* Connector line */}
                <div
                  style={{
                    width: 12,
                    height: 2,
                    background: color + "44",
                    flexShrink: 0,
                  }}
                />

                {/* Dropdown or text input */}
                {isCustom ? (
                  <div style={{ flex: 1, display: "flex", gap: 6 }}>
                    <input
                      autoFocus
                      value={currentVal}
                      onChange={(e) => setRoundName(i, e.target.value)}
                      placeholder={`e.g. DSA Round ${i + 1}`}
                      style={{
                        ...inp,
                        flex: 1,
                        fontSize: 12,
                        padding: "7px 10px",
                      }}
                    />
                    <button
                      onClick={() => {
                        setCustomMode((p) => ({ ...p, [i]: false }));
                        // if blank, reset to default
                        if (!currentVal.trim())
                          setRoundName(i, defaultRoundNames(roundCount)[i]);
                      }}
                      style={{
                        padding: "7px 10px",
                        borderRadius: 8,
                        border: "1px solid var(--border)",
                        background: "var(--bg4)",
                        color: "var(--txt3)",
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        flexShrink: 0,
                      }}
                    >
                      ← Back
                    </button>
                  </div>
                ) : (
                  <select
                    value={currentVal}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === "Custom...") {
                        setCustomMode((p) => ({ ...p, [i]: true }));
                        setRoundName(i, "");
                      } else {
                        setRoundName(i, v);
                      }
                    }}
                    style={{
                      ...sel,
                      flex: 1,
                      fontSize: 12,
                      padding: "7px 10px",
                      borderColor: color + "55",
                      color: "var(--txt)",
                    }}
                  >
                    {ROUND_PRESETS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            );
          })}
        </div>

        {/* Mini flow preview */}
        <div
          style={{
            marginTop: 14,
            paddingTop: 12,
            borderTop: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 0,
          }}
        >
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: "var(--txt3)",
              textTransform: "uppercase",
              letterSpacing: ".08em",
              marginRight: 8,
            }}
          >
            Preview:
          </span>
          {roundNames.slice(0, roundCount).map((r, i) => {
            const co = COMPANIES[form.company];
            const color = co?.color || "#5b8def";
            return (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    padding: "2px 8px",
                    borderRadius: 6,
                    background: color + "18",
                    border: `1px solid ${color}33`,
                    fontSize: 9,
                    fontWeight: 700,
                    color,
                    maxWidth: 90,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {r || `Round ${i + 1}`}
                </div>
                {i < roundCount - 1 && (
                  <div
                    style={{ width: 14, height: 1, background: color + "55" }}
                  />
                )}
                {i === roundCount - 1 && (
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        width: 10,
                        height: 1,
                        background:
                          form.selected === "true" ? "#4caf7d55" : "#e0525255",
                      }}
                    />
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 800,
                        color: form.selected === "true" ? "#4caf7d" : "#e05252",
                        marginLeft: 2,
                      }}
                    >
                      {form.selected === "true" ? "🎉" : "✗"}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* ── Per-round stories card ── */}
      <div
        style={{
          background: "var(--bg3)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: "14px",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            color: "var(--txt3)",
            textTransform: "uppercase",
            letterSpacing: ".08em",
            marginBottom: 14,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          📝 Round-by-Round Experience *
          <span
            style={{
              fontSize: 10,
              fontWeight: 500,
              color: "var(--txt3)",
              opacity: 0.6,
              textTransform: "none",
              letterSpacing: 0,
            }}
          >
            (fill each round separately)
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {Array.from({ length: roundCount }, (_, i) => {
            const co = COMPANIES[form.company];
            const color = co?.color || "#5b8def";
            const name = roundNames[i] || `Round ${i + 1}`;
            const story = roundStories[i] || "";
            const hasErr = !!errors[`rs_${i}`];
            const isLast = i === roundCount - 1;

            return (
              <div key={i} style={{ display: "flex", gap: 0 }}>
                {/* Left timeline column */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: 32,
                    flexShrink: 0,
                  }}
                >
                  {/* Circle node */}
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      flexShrink: 0,
                      background:
                        story.trim().length >= 20 ? color : color + "22",
                      border: `2px solid ${hasErr ? "#e05252" : color}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 10,
                      fontWeight: 900,
                      color: story.trim().length >= 20 ? "#fff" : color,
                      transition: "all .2s",
                      marginTop: 2,
                      boxShadow:
                        story.trim().length >= 20
                          ? `0 0 8px ${color}55`
                          : "none",
                    }}
                  >
                    {story.trim().length >= 20 ? "✓" : i + 1}
                  </div>
                  {/* Connecting line to next */}
                  {!isLast && (
                    <div
                      style={{
                        width: 2,
                        flex: 1,
                        minHeight: 12,
                        background: `linear-gradient(180deg, ${color}66, ${color}22)`,
                        margin: "4px 0",
                      }}
                    />
                  )}
                </div>

                {/* Right: label + textarea */}
                <div
                  style={{
                    flex: 1,
                    paddingLeft: 10,
                    paddingBottom: isLast ? 0 : 16,
                  }}
                >
                  {/* Round label */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 6,
                      marginTop: 2,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 800,
                        color,
                        background: color + "15",
                        border: `1px solid ${color}33`,
                        padding: "2px 8px",
                        borderRadius: 6,
                      }}
                    >
                      Round {i + 1}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "var(--txt2)",
                      }}
                    >
                      {name}
                    </span>
                  </div>

                  <textarea
                    value={story}
                    onChange={(e) => setRoundStory(i, e.target.value)}
                    placeholder={`What happened in ${name}? Questions asked, difficulty, tips...`}
                    rows={3}
                    style={{
                      ...inp,
                      resize: "vertical",
                      lineHeight: 1.65,
                      fontSize: 12,
                      borderColor: hasErr
                        ? "#e05252"
                        : story.trim().length >= 20
                          ? color + "66"
                          : "var(--border)",
                      transition: "border-color .2s",
                    }}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: 3,
                    }}
                  >
                    {hasErr ? (
                      <span
                        style={{
                          fontSize: 10,
                          color: "#e05252",
                          fontWeight: 600,
                        }}
                      >
                        ⚠ {errors[`rs_${i}`]}
                      </span>
                    ) : (
                      <span />
                    )}
                    <span
                      style={{
                        fontSize: 9,
                        color:
                          story.trim().length >= 20 ? color : "var(--txt3)",
                        fontWeight: 600,
                        marginLeft: "auto",
                      }}
                    >
                      {story.trim().length} / 20 min{" "}
                      {story.trim().length >= 20 ? "✓" : ""}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>{" "}
      {/* end per-round stories card */}
      <div
        style={{
          background: "var(--bg3)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: 14,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            color: "var(--txt3)",
            letterSpacing: ".08em",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          👤 Optional — Author Info
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div>
            <SectionLabel>Your Name</SectionLabel>
            <input
              value={form.authorName}
              onChange={(e) => set("authorName", e.target.value)}
              placeholder="e.g. Rahul Sharma  (leave blank to stay anonymous)"
              style={inp}
            />
          </div>
          <div>
            <SectionLabel>Social / Profile Link</SectionLabel>
            <input
              value={form.socialLink}
              onChange={(e) => set("socialLink", e.target.value)}
              placeholder="linkedin.com/in/username  or  github.com/username"
              style={{
                ...inp,
                borderColor: errors.socialLink ? "#e05252" : "var(--border)",
              }}
            />
            <FieldError field="socialLink" />
            <div style={{ fontSize: 10, color: "var(--txt3)", marginTop: 4 }}>
              LinkedIn, GitHub, LeetCode, Twitter — any profile link works
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={handleSubmit}
        style={{
          padding: "13px",
          borderRadius: 12,
          border: "none",
          background: "#5b8def",
          color: "#fff",
          fontSize: 14,
          fontWeight: 800,
          cursor: "pointer",
          fontFamily: "inherit",
          transition: "opacity .15s",
        }}
        onMouseOver={(e) => (e.target.style.opacity = ".85")}
        onMouseOut={(e) => (e.target.style.opacity = "1")}
      >
        Share Experience →
      </button>
    </div>
  );
}

// ── Experience Card (clickable) ───────────────────────────────────────────────
function ExperienceCard({ exp, onClick }) {
  const co = COMPANIES[exp.company];
  const color = co?.color || "#888";

  return (
    <div
      onClick={onClick}
      style={{
        cursor: "pointer",
        transition: "transform .15s, box-shadow .15s, border-color .15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = `0 8px 24px ${color}22`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <Card
        style={{
          marginBottom: 12,
          border: `1px solid var(--border)`,
          transition: "border-color .15s",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            marginBottom: 10,
          }}
        >
          <CompanyLogo
            logo={co?.logo || exp.company[0]}
            color={co?.color || "#888"}
            size={34}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              <div>
                <span
                  style={{ fontSize: 13, fontWeight: 800, color: "var(--txt)" }}
                >
                  {exp.company}
                </span>
                <span
                  style={{ fontSize: 12, color: "var(--txt3)", marginLeft: 6 }}
                >
                  {exp.role}
                </span>
              </div>
              <Tag color={exp.selected ? "#4caf7d" : "#e05252"}>
                {exp.selected ? "✓ Selected" : "✗ Rejected"}
              </Tag>
            </div>
            <div style={{ fontSize: 11, color: "var(--txt3)", marginTop: 2 }}>
              {exp.college} · {exp.rounds} rounds ·{" "}
              {new Date(exp.date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
          </div>
        </div>

        {/* Story preview — clamped to 2 lines */}
        <p
          style={{
            fontSize: 12,
            color: "var(--txt2)",
            lineHeight: 1.65,
            margin: "0 0 10px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {exp.story}
        </p>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <DifficultyTag difficulty={exp.difficulty} />
            {!exp.isSeed && <Tag color="#9b72cf">Community ✨</Tag>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {exp.authorName && (
              <span
                style={{ fontSize: 11, color: "var(--txt3)", fontWeight: 600 }}
              >
                — {exp.authorName}
              </span>
            )}
            {/* "Read more" hint */}
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: color,
                background: color + "15",
                border: `1px solid ${color}33`,
                padding: "3px 9px",
                borderRadius: 6,
              }}
            >
              Read more →
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}

// ── Main Feed ─────────────────────────────────────────────────────────────────
export default function ExperienceFeed() {
  const { allExps } = useExperiences();
  const [showForm, setShowForm] = useState(false);
  const [query, setQuery] = useState("");
  const [filterCompany, setFilterCompany] = useState("All");
  const [filterOutcome, setFilterOutcome] = useState("All");
  const [filterDifficulty, setFilterDifficulty] = useState("All");
  const [selectedExp, setSelectedExp] = useState(null); // ← modal state

  const filtered = allExps.filter((e) => {
    if (filterCompany !== "All" && e.company !== filterCompany) return false;
    if (filterOutcome === "Selected" && !e.selected) return false;
    if (filterOutcome === "Rejected" && e.selected) return false;
    if (filterDifficulty !== "All" && e.difficulty !== filterDifficulty)
      return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      const haystack = [
        e.company,
        e.role,
        e.college,
        e.story,
        e.authorName || "",
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  const activeFilters =
    filterCompany !== "All" ||
    filterOutcome !== "All" ||
    filterDifficulty !== "All" ||
    query.trim();

  return (
    <div>
      {/* ── Modal ── */}
      {selectedExp && (
        <ExperienceModal
          exp={selectedExp}
          onClose={() => setSelectedExp(null)}
        />
      )}

      {/* Share button + heading */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
        }}
      >
        <div>
          <SectionLabel style={{ marginBottom: 2 }}>
            Interview Experiences
          </SectionLabel>
          <div style={{ fontSize: 12, color: "var(--txt3)" }}>
            {filtered.length} experience{filtered.length !== 1 ? "s" : ""}
            {activeFilters ? " matching filters" : " in total"}
            <span
              style={{
                marginLeft: 6,
                fontSize: 10,
                color: "var(--txt3)",
                opacity: 0.6,
              }}
            >
              · Click any card to read full details
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowForm((p) => !p)}
          style={{
            padding: "8px 14px",
            borderRadius: 10,
            border: "1.5px solid #5b8def55",
            background: showForm ? "#5b8def" : "#5b8def12",
            color: showForm ? "#fff" : "#5b8def",
            fontSize: 12,
            fontWeight: 800,
            cursor: "pointer",
            transition: "all .15s",
          }}
        >
          {showForm ? "✕ Close" : "+ Share Yours"}
        </button>
      </div>

      {/* Submit form */}
      {showForm && (
        <Card style={{ marginBottom: 18 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: "var(--txt)",
              marginBottom: 16,
            }}
          >
            Share Your Interview Experience
          </div>
          <SubmitForm
            onClose={() => setShowForm(false)}
            onSubmitted={() => setShowForm(false)}
          />
        </Card>
      )}

      {/* ── Search + Filters ── */}
      <div
        style={{
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          borderRadius: 14,
          padding: 14,
          marginBottom: 16,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <div style={{ position: "relative" }}>
          <span
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 14,
              color: "var(--txt3)",
              pointerEvents: "none",
            }}
          >
            🔍
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by company, college, role, or keyword..."
            style={{
              width: "100%",
              background: "var(--bg3)",
              border: "1.5px solid var(--border)",
              borderRadius: 10,
              padding: "9px 12px 9px 36px",
              color: "var(--txt)",
              fontSize: 13,
              outline: "none",
              fontFamily: "inherit",
              boxSizing: "border-box",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#5b8def")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--txt3)",
                fontSize: 16,
                lineHeight: 1,
                padding: "0 2px",
              }}
            >
              ×
            </button>
          )}
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "var(--txt3)",
              textTransform: "uppercase",
              letterSpacing: ".07em",
            }}
          >
            Filter:
          </span>
          {[
            {
              val: filterCompany,
              set: setFilterCompany,
              opts: ["All Companies", ...Object.keys(COMPANIES)],
              color: "#5b8def",
            },
            {
              val: filterOutcome,
              set: setFilterOutcome,
              opts: ["All Outcomes", "Selected ✓", "Rejected ✗"],
              color: "#9b72cf",
            },
            {
              val: filterDifficulty,
              set: setFilterDifficulty,
              opts: ["All Difficulties", ...DIFFICULTIES],
              color: "#e8924a",
            },
          ].map((f, fi) => (
            <select
              key={fi}
              value={f.val}
              onChange={(e) =>
                f.set(
                  e.target.value === f.opts[0]
                    ? "All"
                    : e.target.value.replace(" ✓", "").replace(" ✗", ""),
                )
              }
              style={{
                background: f.val !== "All" ? f.color + "18" : "var(--bg3)",
                border: `1.5px solid ${f.val !== "All" ? f.color : "var(--border)"}`,
                borderRadius: 8,
                padding: "5px 10px",
                fontSize: 11,
                fontWeight: 700,
                color: f.val !== "All" ? f.color : "var(--txt2)",
                outline: "none",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {f.opts.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          ))}
          {activeFilters && (
            <button
              onClick={() => {
                setQuery("");
                setFilterCompany("All");
                setFilterOutcome("All");
                setFilterDifficulty("All");
              }}
              style={{
                padding: "5px 10px",
                borderRadius: 8,
                border: "1px solid #e0525244",
                background: "#e0525212",
                color: "#e05252",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Clear ×
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "48px 16px",
            color: "var(--txt3)",
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "var(--txt)",
              marginBottom: 6,
            }}
          >
            No experiences found
          </div>
          <div style={{ fontSize: 12 }}>
            Try adjusting your search or filters
          </div>
        </div>
      ) : (
        filtered.map((e) => (
          <ExperienceCard
            key={e.id}
            exp={e}
            onClick={() => setSelectedExp(e)}
          />
        ))
      )}
    </div>
  );
}
