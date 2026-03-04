// pip.RoundsTab.jsx — Round structure, company stats, experience feed per company

"use client";
import { Card,SectionLabel,Tag,DifficultyTag,CompanyLogo } from "./ui.js";
import { useExperiences } from "./store.js";


export default function RoundsTab({ co, company }) {
  const { allExps } = useExperiences();
  const experiences = allExps.filter((e) => e.company === company);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Round Structure */}
      <Card>
        <SectionLabel>Interview Round Structure</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {co.rounds.map((r, i) => (
            <div
              key={i}
              style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
            >
              {/* Number + connector */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: co.color,
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {i + 1}
                </div>
                {i < co.rounds.length - 1 && (
                  <div
                    style={{
                      width: 2,
                      height: 24,
                      background: `linear-gradient(${co.color}66, transparent)`,
                      marginTop: 2,
                    }}
                  />
                )}
              </div>

              {/* Content */}
              <div
                style={{
                  flex: 1,
                  paddingBottom: i < co.rounds.length - 1 ? 10 : 0,
                }}
              >
                <div
                  style={{ fontSize: 13, fontWeight: 700, color: "var(--txt)" }}
                >
                  {r}
                </div>
                <div
                  style={{ fontSize: 11, color: "var(--txt3)", marginTop: 2 }}
                >
                  {i === 0
                    ? "Online timed assessment"
                    : i === co.rounds.length - 1
                      ? "Culture & behavioral focus"
                      : i === co.rounds.length - 2 && co.rounds.length > 3
                        ? "System Design or architecture"
                        : "Technical DSA, 45–60 mins"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Company Stats */}
      <Card>
        <SectionLabel>Placement Statistics</SectionLabel>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginBottom: 14,
          }}
        >
          <div
            style={{
              background: "var(--bg3)",
              borderRadius: 12,
              padding: 16,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 900, color: co.color }}>
              {co.pkg}
            </div>
            <div
              style={{
                fontSize: 10,
                color: "var(--txt3)",
                marginTop: 4,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: ".06em",
              }}
            >
              Avg Package
            </div>
          </div>
          <div
            style={{
              background: "var(--bg3)",
              borderRadius: 12,
              padding: 16,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 24, fontWeight: 900, color: "#e05252" }}>
              {co.rate}
            </div>
            <div
              style={{
                fontSize: 10,
                color: "var(--txt3)",
                marginTop: 4,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: ".06em",
              }}
            >
              Selection Rate
            </div>
          </div>
        </div>
        <div>
          <div
            style={{
              fontSize: 11,
              color: "var(--txt3)",
              marginBottom: 6,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: ".07em",
            }}
          >
            Top Hiring Branches
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {co.branches.map((b) => (
              <Tag key={b} color={co.color}>
                {b}
              </Tag>
            ))}
          </div>
        </div>
      </Card>

      {/* Experiences */}
      <div>
        <SectionLabel>
          Community Experiences ({experiences.length})
        </SectionLabel>
        {experiences.length === 0 ? (
          <Card>
            <div
              style={{
                textAlign: "center",
                padding: "24px 0",
                color: "var(--txt3)",
                fontSize: 13,
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 10 }}>💬</div>
              No experiences for {company} yet.
              <br />
              Be the first to share!
            </div>
          </Card>
        ) : (
          experiences.map((e) => (
            <ExperienceCard key={e.id} exp={e} coColor={co.color} />
          ))
        )}
      </div>
    </div>
  );
}

function ExperienceCard({ exp, coColor }) {
  return (
    <div
      style={{
        background: "var(--bg2)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        padding: 16,
        marginBottom: 10,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 10,
        }}
      >
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, color: "var(--txt)" }}>
            {exp.college}
          </div>
          <div style={{ fontSize: 11, color: "var(--txt3)", marginTop: 2 }}>
            {exp.role} · {exp.rounds} rounds ·{" "}
            {new Date(exp.date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </div>
        </div>
        <Tag color={exp.selected ? "#4caf7d" : "#e05252"}>
          {exp.selected ? "✓ Selected" : "✗ Rejected"}
        </Tag>
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
          gap: 6,
        }}
      >
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <DifficultyTag difficulty={exp.difficulty} />
          {exp.isSeed === false && <Tag color="#9b72cf">Community</Tag>}
        </div>

        {/* Author info */}
        {(exp.authorName || exp.socialLink) && (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
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
                  color: coColor,
                  fontWeight: 700,
                  textDecoration: "none",
                  padding: "3px 8px",
                  borderRadius: 6,
                  background: coColor + "18",
                  border: `1px solid ${coColor}33`,
                }}
              >
                Profile ↗
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
