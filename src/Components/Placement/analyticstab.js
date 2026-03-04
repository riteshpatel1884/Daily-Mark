// pip.AnalyticsTab.jsx — Performance analytics + Interview Prediction Engine

"use client";
import { Bar,Card,SectionLabel,tag } from "./ui.js";

export default function AnalyticsTab({
  co,
  solved,
  daysLeft,
  totalTarget,
  company,
}) {
  const topicEntries = Object.entries(co.topics);

  const dsaSolved = Object.entries(solved)
    .filter(([k]) => !k.startsWith("__q_"))
    .reduce((s, [, v]) => s + (v || 0), 0);

  const hotQsDone = co.hotQs.filter(
    (_, i) => (solved["__q_" + i] || 0) > 0,
  ).length;

  const totalTopicTarget = topicEntries.reduce(
    (s, [, w]) => s + Math.round(w / 3),
    0,
  );
  const overallPct = Math.min(
    100,
    Math.round((dsaSolved / Math.max(1, totalTopicTarget)) * 100),
  );

  const weakTopics = topicEntries
    .filter(([t, w]) => (solved[t] || 0) < Math.round(w / 4))
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([t]) => t);

  const strongTopics = topicEntries
    .filter(([t, w]) => (solved[t] || 0) >= Math.round(w / 3))
    .map(([t]) => t);

  const topPredictions = topicEntries.sort(([, a], [, b]) => b - a).slice(0, 5);

  const paceNeeded =
    daysLeft > 0 ? Math.ceil((totalTopicTarget - dsaSolved) / daysLeft) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Stats */}
      <Card>
        <SectionLabel>Preparation Analytics</SectionLabel>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 8,
            marginBottom: 14,
          }}
        >
          {[
            { label: "DSA Solved", value: dsaSolved, color: "#5b8def" },
            {
              label: "Hot Qs Done",
              value: `${hotQsDone}/${co.hotQs.length}`,
              color: "#9b72cf",
            },
            {
              label: "Pace Needed",
              value: paceNeeded + "/day",
              color:
                paceNeeded > 6
                  ? "#e05252"
                  : paceNeeded > 3
                    ? "#e8924a"
                    : "#4caf7d",
            },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: "var(--bg3)",
                borderRadius: 10,
                padding: "12px 10px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 900,
                  color: s.color,
                  lineHeight: 1,
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: "var(--txt3)",
                  marginTop: 3,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: ".06em",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Overall bar */}
        <div style={{ marginBottom: 4 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 6,
            }}
          >
            <span
              style={{ fontSize: 12, fontWeight: 700, color: "var(--txt)" }}
            >
              Overall Completion
            </span>
            <span
              style={{
                fontSize: 12,
                color: "var(--txt3)",
                fontFamily: "monospace",
              }}
            >
              {dsaSolved}/{totalTopicTarget}
            </span>
          </div>
          <Bar pct={overallPct} color={co.color} height={10} />
        </div>
      </Card>

      {/* Per-topic breakdown */}
      <Card>
        <SectionLabel>Topic-wise Breakdown</SectionLabel>
        {topicEntries
          .sort(([, a], [, b]) => b - a)
          .map(([topic, weight]) => {
            const target = Math.max(1, Math.round(weight / 3));
            const done = solved[topic] || 0;
            const pct = Math.min(100, Math.round((done / target) * 100));
            const color =
              pct < 40 ? "#e05252" : pct > 70 ? "#4caf7d" : "#d4b44a";
            return (
              <div key={topic} style={{ marginBottom: 10 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "var(--txt)",
                    }}
                  >
                    {topic}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color,
                      fontFamily: "monospace",
                    }}
                  >
                    {pct}%
                  </span>
                </div>
                <Bar pct={pct} color={color} height={6} />
              </div>
            );
          })}
      </Card>

      {/* Strengths & Weaknesses */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Card style={{ padding: 14 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: "#4caf7d",
              marginBottom: 10,
              textTransform: "uppercase",
              letterSpacing: ".08em",
            }}
          >
            💪 Strengths
          </div>
          {strongTopics.length === 0 ? (
            <div
              style={{ fontSize: 12, color: "var(--txt3)", lineHeight: 1.5 }}
            >
              Complete topic targets to build strengths!
            </div>
          ) : (
            strongTopics.map((t) => (
              <div
                key={t}
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#4caf7d",
                  marginBottom: 6,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <span>✓</span> {t}
              </div>
            ))
          )}
        </Card>
        <Card style={{ padding: 14 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: "#e05252",
              marginBottom: 10,
              textTransform: "uppercase",
              letterSpacing: ".08em",
            }}
          >
            ⚠ Weak Areas
          </div>
          {weakTopics.length === 0 ? (
            <div style={{ fontSize: 12, color: "#4caf7d", fontWeight: 700 }}>
              Looking great! 🎉
            </div>
          ) : (
            weakTopics.map((t) => (
              <div
                key={t}
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#e05252",
                  marginBottom: 6,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <span>✗</span> {t}
              </div>
            ))
          )}
        </Card>
      </div>

      {/* Prediction Engine */}
      <Card>
        <SectionLabel>🔮 Interview Prediction Engine</SectionLabel>
        <p
          style={{
            fontSize: 12,
            color: "var(--txt3)",
            margin: "0 0 14px",
            lineHeight: 1.5,
          }}
        >
          Based on recent {company} interview patterns, probability of each
          topic appearing:
        </p>
        {topPredictions.map(([topic, prob]) => (
          <div key={topic} style={{ marginBottom: 10 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <span
                style={{ fontSize: 12, fontWeight: 700, color: "var(--txt)" }}
              >
                {topic}
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, color: co.color }}>
                {prob}% likely
              </span>
            </div>
            <Bar pct={prob} color={co.color} height={6} />
          </div>
        ))}

        {/* AI Recommendation box */}
        <div
          style={{
            marginTop: 14,
            background: co.color + "12",
            border: `1px solid ${co.color}33`,
            borderRadius: 10,
            padding: "12px 14px",
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              color: co.color,
              marginBottom: 5,
            }}
          >
            🤖 AI Recommendation
          </div>
          <div
            style={{
              fontSize: 12,
              color: "var(--txt2)",
              lineHeight: 1.6,
            }}
          >
            Focus on{" "}
            <strong style={{ color: co.color }}>
              {topPredictions[0]?.[0]}
            </strong>{" "}
            and{" "}
            <strong style={{ color: co.color }}>
              {topPredictions[1]?.[0]}
            </strong>{" "}
            — these cover{" "}
            {(topPredictions[0]?.[1] || 0) + (topPredictions[1]?.[1] || 0)}% of
            expected questions.
            {weakTopics[0]
              ? ` Prioritize improving your ${weakTopics[0]} fundamentals next.`
              : " You're on track — keep the consistency!"}
          </div>
        </div>
      </Card>
    </div>
  );
}
