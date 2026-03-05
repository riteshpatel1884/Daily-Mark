// pip.SmartReminders.jsx — Behind-plan alerts + adaptive pace tracker

"use client";
import { useMemo } from "react";
import { Bar, Card, SectionLabel, Tag } from "./ui.js";

/**
 * Computes pace status based on solved questions vs time elapsed.
 * Returns { status, requiredPerDay, currentPerDay, behindBy, message }
 */
export function usePaceStatus({ setup, solved, co }) {
  return useMemo(() => {
    if (!setup?.date || !co) return null;

    const totalDays = Math.max(
      1,
      Math.ceil(
        (new Date(setup.date) -
          new Date(
            /* approx start 30 days before */ new Date(setup.date).getTime() -
              30 * 86400000,
          )) /
          86400000,
      ),
    );
    const daysLeft = Math.max(
      0,
      Math.ceil((new Date(setup.date) - Date.now()) / 86400000),
    );
    const daysElapsed = Math.max(1, totalDays - daysLeft);

    const totalTopicTarget = Object.values(co.topics).reduce(
      (s, w) => s + Math.max(1, Math.round(w / 3)),
      0,
    );
    const dsaSolved = Object.entries(solved)
      .filter(([k]) => !k.startsWith("__q_"))
      .reduce((s, [, v]) => s + (v || 0), 0);

    const requiredPerDay =
      daysLeft > 0
        ? parseFloat(((totalTopicTarget - dsaSolved) / daysLeft).toFixed(1))
        : 0;

    const currentPerDay = parseFloat((dsaSolved / daysElapsed).toFixed(1));
    const expectedByNow = Math.round(
      (totalTopicTarget / totalDays) * daysElapsed,
    );
    const behindBy = Math.max(0, expectedByNow - dsaSolved);
    const aheadBy = Math.max(0, dsaSolved - expectedByNow);

    let status = "on-track";
    if (behindBy >= 5) status = "critical";
    else if (behindBy >= 2) status = "behind";
    else if (aheadBy >= 3) status = "ahead";

    return {
      status,
      requiredPerDay,
      currentPerDay,
      behindBy,
      aheadBy,
      dsaSolved,
      totalTopicTarget,
      daysLeft,
    };
  }, [setup, solved, co]);
}

export default function SmartReminders({ setup, solved, co }) {
  const pace = usePaceStatus({ setup, solved, co });

  if (!pace) return null;

  const colors = {
    critical: "#e05252",
    behind: "#e8924a",
    "on-track": "#4caf7d",
    ahead: "#5b8def",
  };

  const icons = {
    critical: "🚨",
    behind: "⚠️",
    "on-track": "✅",
    ahead: "🚀",
  };

  const messages = {
    critical: `You're significantly behind your ${setup.company} prep plan. Need to catch up fast.`,
    behind: `Slightly behind plan. A focused session today will bring you back on track.`,
    "on-track": `You're right on schedule. Keep this pace to hit your target before the interview.`,
    ahead: `You're ahead of schedule! Use this buffer to go deeper on weak topics.`,
  };

  const color = colors[pace.status];
  const icon = icons[pace.status];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Main alert banner */}
      <div
        style={{
          background: color + "12",
          border: `1.5px solid ${color}44`,
          borderRadius: 14,
          padding: "14px 16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>{icon}</span>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                color,
                marginBottom: 4,
                textTransform: "capitalize",
              }}
            >
              {pace.status === "on-track"
                ? "✓ On Track"
                : pace.status === "ahead"
                  ? "🚀 Ahead of Plan"
                  : pace.status === "critical"
                    ? "🚨 Critical: Behind Plan"
                    : "⚠ Slightly Behind Plan"}
            </div>
            <div
              style={{ fontSize: 12, color: "var(--txt2)", lineHeight: 1.55 }}
            >
              {messages[pace.status]}
            </div>
          </div>
        </div>
      </div>

      {/* Pace breakdown */}
      <Card style={{ padding: "14px 16px" }}>
        <SectionLabel>Pace Analysis</SectionLabel>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 8,
            marginBottom: 14,
          }}
        >
          {[
            {
              label: "Required/Day",
              value: pace.requiredPerDay,
              color:
                pace.requiredPerDay > 6
                  ? "#e05252"
                  : pace.requiredPerDay > 3
                    ? "#e8924a"
                    : "#4caf7d",
            },
            {
              label: "Current/Day",
              value: pace.currentPerDay,
              color:
                pace.currentPerDay >= pace.requiredPerDay
                  ? "#4caf7d"
                  : "#e05252",
            },
            {
              label: pace.behindBy > 0 ? "Behind By" : "Ahead By",
              value: pace.behindBy > 0 ? pace.behindBy : pace.aheadBy,
              color: pace.behindBy > 0 ? "#e05252" : "#4caf7d",
            },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: "var(--bg3)",
                borderRadius: 10,
                padding: "12px 8px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  color: s.color,
                  lineHeight: 1,
                  letterSpacing: "-.02em",
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

        {/* Progress vs target */}
        <div style={{ marginBottom: 8 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 5,
            }}
          >
            <span
              style={{ fontSize: 12, fontWeight: 700, color: "var(--txt)" }}
            >
              Questions solved
            </span>
            <span
              style={{
                fontSize: 12,
                color: "var(--txt3)",
                fontFamily: "monospace",
              }}
            >
              {pace.dsaSolved} / {pace.totalTopicTarget}
            </span>
          </div>
          <Bar
            pct={Math.min(
              100,
              Math.round(
                (pace.dsaSolved / Math.max(1, pace.totalTopicTarget)) * 100,
              ),
            )}
            color={color}
            height={8}
          />
        </div>

        {/* Action tip */}
        {(pace.status === "behind" || pace.status === "critical") && (
          <div
            style={{
              marginTop: 10,
              background: "var(--bg3)",
              borderRadius: 10,
              padding: "10px 12px",
              display: "flex",
              gap: 8,
              alignItems: "flex-start",
            }}
          >
            <span style={{ fontSize: 16, flexShrink: 0 }}>💡</span>
            <div
              style={{ fontSize: 12, color: "var(--txt2)", lineHeight: 1.55 }}
            >
              <strong style={{ color: "var(--txt)" }}>Action:</strong> You need{" "}
              <strong style={{ color }}>
                {pace.requiredPerDay} questions/day
              </strong>{" "}
              to stay on track. Try solving {Math.ceil(pace.requiredPerDay)}{" "}
              questions in your next session.
            </div>
          </div>
        )}
      </Card>

      {/* Days left countdown */}
      <div
        style={{
          background: "var(--bg2)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontSize: 12, color: "var(--txt2)" }}>
          <strong style={{ color: "var(--txt)" }}>{setup.company}</strong>{" "}
          interview in
        </div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 900,
            color:
              pace.daysLeft <= 7
                ? "#e05252"
                : pace.daysLeft <= 14
                  ? "#e8924a"
                  : "#4caf7d",
            letterSpacing: "-.02em",
          }}
        >
          {pace.daysLeft}
          <span style={{ fontSize: 12, color: "var(--txt3)", fontWeight: 700 }}>
            {" "}
            days
          </span>
        </div>
      </div>
    </div>
  );
}
