// pip.CompanyDatabase.jsx — Browse all companies with stats

"use client";
import { COMPANIES } from "./constants";
import { Card, SectionLabel, Tag, CompanyLogo, Bar } from "./ui";

export default function CompanyDatabase({ onSelectCompany }) {
  return (
    <div>
      <SectionLabel>Company Intelligence Database</SectionLabel>
      <p
        style={{
          fontSize: 12,
          color: "var(--txt3)",
          margin: "0 0 16px",
          lineHeight: 1.5,
        }}
      >
        Click any company to load its prep dashboard.
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {Object.entries(COMPANIES).map(([name, co]) => (
          <Card
            key={name}
            onClick={() => onSelectCompany(name)}
            style={{ padding: "14px 16px", transition: "border-color .15s" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <CompanyLogo logo={co.logo} color={co.color} size={40} />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: 15,
                      fontWeight: 800,
                      color: "var(--txt)",
                    }}
                  >
                    {name}
                  </span>
                  <Tag color={co.color}>{co.pkg}</Tag>
                </div>
                <div
                  style={{ fontSize: 11, color: "var(--txt3)", marginTop: 3 }}
                >
                  {co.rounds.length} rounds · {co.rate} selection ·{" "}
                  {co.branches.join(", ")}
                </div>
              </div>
            </div>

            {/* Topic mini bars */}
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {Object.entries(co.topics)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 3)
                .map(([topic, weight]) => (
                  <div
                    key={topic}
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        color: "var(--txt3)",
                        width: 120,
                        flexShrink: 0,
                        fontWeight: 600,
                      }}
                    >
                      {topic}
                    </span>
                    <div style={{ flex: 1 }}>
                      <Bar pct={weight} color={co.color} height={4} />
                    </div>
                    <span
                      style={{
                        fontSize: 10,
                        color: "var(--txt3)",
                        fontFamily: "monospace",
                        width: 28,
                        textAlign: "right",
                        flexShrink: 0,
                      }}
                    >
                      {weight}%
                    </span>
                  </div>
                ))}
            </div>

            <div
              style={{
                marginTop: 10,
                fontSize: 11,
                color: co.color,
                fontWeight: 700,
                textAlign: "right",
              }}
            >
              Open prep dashboard →
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
