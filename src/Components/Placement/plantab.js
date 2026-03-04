// pip.PlanTab.jsx — Smart daily plan + topic progress tracker tab

"use client";
import { Bar, Card, SectionLabel, Tag } from "./ui";

export default function PlanTab({
  co,
  daysLeft,
  questionsPerDay,
  totalTarget,
  solved,
  setSolved,
}) {
  const topicOrder = Object.entries(co.topics).sort(([, a], [, b]) => b - a);

  const phases =
    daysLeft <= 14
      ? [
          {
            label: "Intense DSA Sprint",
            days: Math.floor(daysLeft * 0.5),
            color: "#e05252",
          },
          {
            label: "Mock Interviews",
            days: Math.floor(daysLeft * 0.3),
            color: "#5b8def",
          },
          {
            label: "Revision",
            days: Math.ceil(daysLeft * 0.2),
            color: "#4caf7d",
          },
        ]
      : [
          {
            label: "Foundation & Core DSA",
            days: Math.floor(daysLeft * 0.4),
            color: "#5b8def",
          },
          {
            label: "Topic Mastery",
            days: Math.floor(daysLeft * 0.35),
            color: "#9b72cf",
          },
          {
            label: "Mocks & Revision",
            days: Math.ceil(daysLeft * 0.25),
            color: "#4caf7d",
          },
        ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Daily Plan Overview */}
      <Card>
        <SectionLabel>Smart Daily Plan</SectionLabel>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginBottom: 14,
          }}
        >
          {[
            { label: "Questions/Day", value: questionsPerDay, icon: "📋" },
            { label: "Total Target", value: totalTarget, icon: "🎯" },
            {
              label: "Mock Interviews",
              value: Math.max(1, Math.floor(daysLeft / 10)),
              icon: "🎙️",
            },
            {
              label: "Revision Days",
              value: Math.max(1, Math.floor(daysLeft / 7)),
              icon: "🔄",
            },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: "var(--bg3)",
                borderRadius: 12,
                padding: "12px 14px",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ fontSize: 22 }}>{s.icon}</span>
              <div>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 900,
                    color: "var(--txt)",
                    letterSpacing: "-.02em",
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "var(--txt3)",
                    fontWeight: 700,
                    marginTop: 2,
                  }}
                >
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        <SectionLabel>Phase Breakdown</SectionLabel>
        {phases.map((p, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: p.color,
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "var(--txt)",
                  marginBottom: 4,
                }}
              >
                {p.label}
              </div>
              <Bar
                pct={Math.round((p.days / Math.max(1, daysLeft)) * 100)}
                color={p.color}
                height={5}
              />
            </div>
            <Tag color={p.color}>{p.days}d</Tag>
          </div>
        ))}
      </Card>

      {/* Topic Progress Tracker */}
      <Card>
        <SectionLabel>Topic Progress Tracker</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {topicOrder.map(([topic, weight]) => {
            const target = Math.max(1, Math.round(weight / 3));
            const done = solved[topic] || 0;
            const pct = Math.min(100, Math.round((done / target) * 100));
            const color =
              pct < 40 ? "#e05252" : pct > 70 ? "#4caf7d" : "#d4b44a";

            return (
              <div key={topic}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 5,
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "var(--txt)",
                      }}
                    >
                      {topic}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        color: "var(--txt3)",
                        marginLeft: 6,
                      }}
                    >
                      {weight}% weight
                    </span>
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color,
                        fontFamily: "monospace",
                        minWidth: 36,
                        textAlign: "right",
                      }}
                    >
                      {done}/{target}
                    </span>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button
                        onClick={() =>
                          setSolved((p) => ({
                            ...p,
                            [topic]: Math.max(0, (p[topic] || 0) - 1),
                          }))
                        }
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 6,
                          border: "1px solid var(--border)",
                          background: "var(--bg3)",
                          color: "var(--txt2)",
                          cursor: "pointer",
                          fontSize: 15,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        −
                      </button>
                      <button
                        onClick={() =>
                          setSolved((p) => ({
                            ...p,
                            [topic]: (p[topic] || 0) + 1,
                          }))
                        }
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: 6,
                          border: "none",
                          background: color,
                          color: "#fff",
                          cursor: "pointer",
                          fontSize: 15,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <Bar pct={pct} color={color} height={6} />
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
