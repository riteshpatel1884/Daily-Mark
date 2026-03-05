// pip.ExperienceFeed.jsx — Full experiences feed with search/filter + submit form

"use client";
import { useState } from "react";
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
    story: "",
    authorName: "",
    socialLink: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function set(field, val) {
    setForm((p) => ({ ...p, [field]: val }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  }

  function validate() {
    const e = {};
    if (!form.college.trim()) e.college = "College name is required";
    if (!form.story.trim() || form.story.trim().length < 30)
      e.story = "Please write at least 30 characters about your experience";
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
      selected: form.selected === "true",
      difficulty: form.difficulty,
      story: form.story.trim(),
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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Company + Role */}
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

      {/* College */}
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

      {/* Rounds + Outcome + Difficulty */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}
      >
        <div>
          <SectionLabel>Rounds</SectionLabel>
          <select
            value={form.rounds}
            onChange={(e) => set("rounds", e.target.value)}
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

      {/* Experience Story */}
      <div>
        <SectionLabel>Your Experience *</SectionLabel>
        <textarea
          value={form.story}
          onChange={(e) => set("story", e.target.value)}
          placeholder="Describe each round in detail — what questions were asked, what surprised you, tips for others preparing..."
          rows={5}
          style={{
            ...inp,
            resize: "vertical",
            lineHeight: 1.65,
            borderColor: errors.story ? "#e05252" : "var(--border)",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginTop: 4,
          }}
        >
          <FieldError field="story" />
          <span
            style={{ fontSize: 10, color: "var(--txt3)", marginLeft: "auto" }}
          >
            {form.story.trim().length} chars{" "}
            {form.story.trim().length < 30 ? `(min 30)` : "✓"}
          </span>
        </div>
      </div>

      {/* ── Optional author info ── */}
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

      {/* Submit */}
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

// ── Experience Card ────────────────────────────────────────────────────────────
function ExperienceCard({ exp }) {
  const co = COMPANIES[exp.company];
  return (
    <Card style={{ marginBottom: 12 }}>
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

      {/* Story */}
      <p
        style={{
          fontSize: 12,
          color: "var(--txt2)",
          lineHeight: 1.65,
          margin: "0 0 10px",
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

        {(exp.authorName || exp.socialLink) && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {exp.authorName && (
              <span
                style={{ fontSize: 11, color: "var(--txt3)", fontWeight: 600 }}
              >
                — {exp.authorName}
              </span>
            )}
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
                  fontSize: 10,
                  color: co?.color || "#5b8def",
                  fontWeight: 700,
                  textDecoration: "none",
                  padding: "3px 9px",
                  borderRadius: 6,
                  background: (co?.color || "#5b8def") + "18",
                  border: `1px solid ${co?.color || "#5b8def"}33`,
                }}
              >
                Profile ↗
              </a>
            )}
          </div>
        )}
      </div>
    </Card>
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

  // ── Filter logic ──
  const filtered = allExps.filter((e) => {
    // Company filter
    if (filterCompany !== "All" && e.company !== filterCompany) return false;
    // Outcome filter
    if (filterOutcome === "Selected" && !e.selected) return false;
    if (filterOutcome === "Rejected" && e.selected) return false;
    // Difficulty filter
    if (filterDifficulty !== "All" && e.difficulty !== filterDifficulty)
      return false;
    // Text search — matches company, role, college, story, authorName
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
        {/* Search input */}
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
              transition: "border-color .15s",
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

        {/* Filter pills row */}
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

          {/* Company filter */}
          <select
            value={filterCompany}
            onChange={(e) => setFilterCompany(e.target.value)}
            style={{
              background: filterCompany !== "All" ? "#5b8def18" : "var(--bg3)",
              border: `1.5px solid ${filterCompany !== "All" ? "#5b8def" : "var(--border)"}`,
              borderRadius: 8,
              padding: "5px 10px",
              fontSize: 11,
              fontWeight: 700,
              color: filterCompany !== "All" ? "#5b8def" : "var(--txt2)",
              outline: "none",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <option value="All">All Companies</option>
            {Object.keys(COMPANIES).map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          {/* Outcome filter */}
          <select
            value={filterOutcome}
            onChange={(e) => setFilterOutcome(e.target.value)}
            style={{
              background: filterOutcome !== "All" ? "#9b72cf18" : "var(--bg3)",
              border: `1.5px solid ${filterOutcome !== "All" ? "#9b72cf" : "var(--border)"}`,
              borderRadius: 8,
              padding: "5px 10px",
              fontSize: 11,
              fontWeight: 700,
              color: filterOutcome !== "All" ? "#9b72cf" : "var(--txt2)",
              outline: "none",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <option value="All">All Outcomes</option>
            <option value="Selected">Selected ✓</option>
            <option value="Rejected">Rejected ✗</option>
          </select>

          {/* Difficulty filter */}
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            style={{
              background:
                filterDifficulty !== "All" ? "#e8924a18" : "var(--bg3)",
              border: `1.5px solid ${filterDifficulty !== "All" ? "#e8924a" : "var(--border)"}`,
              borderRadius: 8,
              padding: "5px 10px",
              fontSize: 11,
              fontWeight: 700,
              color: filterDifficulty !== "All" ? "#e8924a" : "var(--txt2)",
              outline: "none",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <option value="All">All Difficulties</option>
            {DIFFICULTIES.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>

          {/* Clear filters */}
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
        filtered.map((e) => <ExperienceCard key={e.id} exp={e} />)
      )}
    </div>
  );
}
