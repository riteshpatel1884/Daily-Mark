
// pip.QuestionsTab.jsx — Topic frequency chart + high-frequency questions

"use client";
import { Bar, Card, SectionLabel, Tag } from "./ui.js";

export default function QuestionsTab({ co, solved, setSolved }) {
  const sortedTopics = Object.entries(co.topics).sort(([, a], [, b]) => b - a);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Topic Frequency */}
      <Card>
        <SectionLabel>Topic Frequency in Real Interviews</SectionLabel>
        {sortedTopics.map(([topic, weight]) => (
          <div key={topic} style={{ marginBottom: 12 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 5,
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--txt)" }}>
                {topic}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    fontSize: 11,
                    color: "var(--txt3)",
                    fontFamily: "monospace",
                    fontWeight: 700,
                  }}
                >
                  {weight}%
                </span>
                {weight >= 25 && <Tag color="#e05252">🔥 Hot</Tag>}
                {weight >= 15 && weight < 25 && <Tag color="#e8924a">⚡ High</Tag>}
              </div>
            </div>
            <Bar pct={weight} color={co.color} height={7} />
          </div>
        ))}
      </Card>

      {/* High Frequency Questions */}
      <Card>
        <SectionLabel>High Frequency Questions 🔥</SectionLabel>
        <p style={{ fontSize: 12, color: "var(--txt3)", margin: "0 0 14px", lineHeight: 1.5 }}>
          Most commonly asked questions based on interview experiences. Mark them as done to track progress.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {co.hotQs.map((q, i) => {
            const doneKey = "__q_" + i;
            const done = (solved[doneKey] || 0) > 0;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  background: done ? "#4caf7d12" : "var(--bg3)",
                  border: `1px solid ${done ? "#4caf7d44" : "var(--border)"}`,
                  borderRadius: 10,
                  transition: "all .2s",
                }}
              >
                {/* Rank badge */}
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 7,
                    background: done ? "#4caf7d" : "var(--bg4)",
                    color: done ? "#fff" : "var(--txt3)",
                    fontSize: 10,
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {done ? "✓" : i + 1}
                </div>

                {/* Title + frequency */}
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: done ? "#4caf7d" : "var(--txt)",
                      textDecoration: done ? "line-through" : "none",
                    }}
                  >
                    {q}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--txt3)", marginTop: 2 }}>
                    {i < 2 ? "🔥 Very High" : i < 4 ? "⚡ High" : i < 6 ? "📌 Medium" : "💡 Worth knowing"}{" "}
                    frequency
                  </div>
                </div>

                {/* Toggle button */}
                <button
                  onClick={() =>
                    setSolved((p) => ({ ...p, [doneKey]: done ? 0 : 1 }))
                  }
                  style={{
                    padding: "5px 12px",
                    borderRadius: 8,
                    border: "none",
                    background: done ? "#4caf7d22" : co.color + "22",
                    color: done ? "#4caf7d" : co.color,
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all .15s",
                    flexShrink: 0,
                  }}
                >
                  {done ? "Undo" : "Mark ✓"}
                </button>
              </div>
            );
          })}
        </div>

        {/* Progress summary */}
        <div
          style={{
            marginTop: 14,
            background: "var(--bg3)",
            borderRadius: 10,
            padding: "10px 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 12, color: "var(--txt2)" }}>Hot questions done</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: co.color }}>
            {co.hotQs.filter((_, i) => (solved["__q_" + i] || 0) > 0).length}/{co.hotQs.length}
          </span>
        </div>
      </Card>
    </div>
  );
}