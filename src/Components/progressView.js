"use client";
import { useApp, TASK_TYPES } from "@/Components/store";

function Ring({ pct, size = 100, color = "var(--txt)" }) {
  const r = (size - 10) / 2,
    c = 2 * Math.PI * r;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ transform: "rotate(-90deg)" }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--border)"
        strokeWidth="6"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="6"
        strokeDasharray={`${(pct / 100) * c} ${c}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray .5s ease" }}
      />
    </svg>
  );
}

function Bar({ label, value, isToday }) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
      }}
    >
      <div
        style={{
          fontSize: 9,
          color: "var(--txt3)",
          fontWeight: 700,
          letterSpacing: ".04em",
        }}
      >
        {label}
      </div>
      <div
        style={{
          width: "100%",
          maxWidth: 28,
          height: 68,
          background: "var(--bg3)",
          borderRadius: 6,
          border: `1.5px solid ${isToday ? "var(--txt)" : "var(--border)"}`,
          overflow: "hidden",
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        <div
          style={{
            width: "100%",
            height: `${value}%`,
            background: isToday ? "var(--txt)" : "var(--txt2)",
            transition: "height .5s ease",
          }}
        />
      </div>
      <div
        style={{ fontSize: 9, color: "var(--txt3)", fontFamily: "var(--mono)" }}
      >
        {value}%
      </div>
    </div>
  );
}

export default function ProgressView() {
  const { tasks, doneCount, progress, history, subjects } = useApp();

  const today = new Date();
  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().slice(0, 10);
    return {
      label: DAYS[d.getDay()],
      value: i === 6 ? progress : history[key]?.rate || 0,
      isToday: i === 6,
    };
  });

  const totalDays = Object.keys(history).length + 1;
  const allRates = [...Object.values(history).map((h) => h.rate), progress];
  const avgRate = Math.round(
    allRates.reduce((s, v) => s + v, 0) / allRates.length,
  );

  const streak = (() => {
    let s = 0,
      d = new Date(today);
    while (true) {
      const k = d.toISOString().slice(0, 10);
      const v =
        k === today.toISOString().slice(0, 10) ? progress : history[k]?.rate;
      if (v === undefined || v < 50) break;
      s++;
      d.setDate(d.getDate() - 1);
    }
    return s;
  })();

  const totalPomos = tasks.reduce((s, t) => s + (t.pomodoros || 0), 0);
  const focusMins = totalPomos * 25;

  // by type
  const byType = {};
  tasks.forEach((t) => {
    const tp = t.type || "other";
    if (!byType[tp]) byType[tp] = { total: 0, done: 0 };
    byType[tp].total++;
    if (t.done) byType[tp].done++;
  });

  // avg attendance
  const avgAttend = subjects.length
    ? Math.round(
        subjects.reduce((s, sub) => s + (sub.attendance || 0), 0) /
          subjects.length,
      )
    : null;

  return (
    <div className="page">
      <h1
        style={{
          fontSize: 26,
          fontWeight: 800,
          letterSpacing: "-.03em",
          color: "var(--txt)",
          marginBottom: 4,
        }}
      >
        Analytics
      </h1>
      <p style={{ fontSize: 13, color: "var(--txt3)", marginBottom: 20 }}>
        Your study performance at a glance
      </p>

      {/* Today ring */}
      <div
        className="card"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 18,
          marginBottom: 12,
        }}
      >
        <div style={{ position: "relative", flexShrink: 0 }}>
          <Ring pct={progress} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 15,
              fontWeight: 800,
              color: "var(--txt)",
            }}
          >
            {progress}%
          </div>
        </div>
        <div>
          <div className="slabel">Today's Progress</div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: "-.04em",
              color: "var(--txt)",
            }}
          >
            {doneCount}
            <span
              style={{ fontSize: 15, color: "var(--txt3)", fontWeight: 400 }}
            >
              /{tasks.length}
            </span>
          </div>
          <div style={{ fontSize: 12, color: "var(--txt2)", marginTop: 2 }}>
            tasks completed
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginBottom: 12,
        }}
      >
        {[
          { label: "Streak", value: `${streak}d`, sub: "consecutive days" },
          { label: "Avg Rate", value: `${avgRate}%`, sub: "completion avg" },
          {
            label: "Focus",
            value: `${focusMins}m`,
            sub: `${totalPomos} pomodoros`,
          },
          {
            label: "Attend",
            value: avgAttend != null ? `${avgAttend}%` : "—",
            sub: "avg attendance",
          },
        ].map((s) => (
          <div key={s.label} className="card" style={{ padding: "14px" }}>
            <div className="slabel">{s.label}</div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 800,
                letterSpacing: "-.04em",
                color: "var(--txt)",
                marginBottom: 2,
              }}
            >
              {s.value}
            </div>
            <div style={{ fontSize: 11, color: "var(--txt3)" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Weekly chart */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="slabel">Last 7 Days</div>
        <div
          style={{
            display: "flex",
            gap: 4,
            justifyContent: "space-between",
            paddingTop: 6,
          }}
        >
          {week.map((d, i) => (
            <Bar key={i} {...d} />
          ))}
        </div>
      </div>

      {/* By task type */}
      {Object.keys(byType).length > 0 && (
        <div className="card" style={{ marginBottom: 12 }}>
          <div className="slabel">By Task Type</div>
          {Object.entries(byType).map(([tp, { total, done }]) => {
            const info = TASK_TYPES[tp] || TASK_TYPES.other;
            const rate = Math.round((done / total) * 100);
            return (
              <div key={tp} style={{ marginBottom: 12 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 5,
                  }}
                >
                  <span
                    style={{ fontSize: 13, fontWeight: 600, color: info.color }}
                  >
                    {info.label}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      color: "var(--txt3)",
                      fontFamily: "var(--mono)",
                    }}
                  >
                    {done}/{total}
                  </span>
                </div>
                <div className="ptrack">
                  <div
                    className="pfill"
                    style={{ width: `${rate}%`, background: info.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Productivity tip */}
      <div
        style={{
          background: "var(--blue)15",
          border: "1px solid var(--blue)33",
          borderRadius: 14,
          padding: 14,
          marginBottom: 8,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: ".07em",
            textTransform: "uppercase",
            color: "var(--blue)",
            marginBottom: 5,
          }}
        >
          💡 Study Tip
        </div>
        <div style={{ fontSize: 13, color: "var(--txt2)", lineHeight: 1.5 }}>
          {streak >= 7
            ? "Amazing 7+ day streak! You're in peak momentum. Keep it going!"
            : streak >= 3
              ? `Great ${streak}-day streak! Consistency is key to academic success.`
              : avgRate >= 80
                ? "High completion rate! Try using Pomodoro sessions to maintain focus."
                : "Try the 🍅 Pomodoro technique: 25 min focus + 5 min break. It's proven for studying."}
        </div>
      </div>
    </div>
  );
}
