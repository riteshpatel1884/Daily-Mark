"use client";
import { useApp } from "@/Components/store";

function Ring({ pct, size = 96 }) {
  const r = (size - 10) / 2,
    c = 2 * Math.PI * r;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="ring"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--line)"
        strokeWidth="6"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--txt)"
        strokeWidth="6"
        strokeDasharray={`${(pct / 100) * c} ${c}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.5s ease" }}
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
        gap: 5,
      }}
    >
      <div
        style={{
          fontSize: 10,
          color: "var(--txt-3)",
          fontWeight: 600,
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </div>
      <div
        style={{
          width: "100%",
          maxWidth: 30,
          height: 72,
          background: "var(--bg-3)",
          borderRadius: 6,
          border: isToday ? "1.5px solid var(--txt)" : "1px solid var(--line)",
          overflow: "hidden",
          display: "flex",
          alignItems: "flex-end",
        }}
      >
        <div
          style={{
            width: "100%",
            height: `${value}%`,
            background: isToday ? "var(--txt)" : "var(--txt-2)",
            transition: "height 0.5s ease",
          }}
        />
      </div>
      <div style={{ fontSize: 10, color: "var(--txt-3)" }}>{value}%</div>
    </div>
  );
}

export default function ProgressView() {
  const { tasks, doneCount, progress, history } = useApp();

  const today = new Date();
  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().slice(0, 10);
    const isToday = i === 6;
    const entry = history[key];
    return {
      label: DAYS[d.getDay()],
      value: isToday ? progress : entry?.rate || 0,
      isToday,
    };
  });

  const totalDays = Object.keys(history).length + 1;
  const avgRate =
    totalDays > 0
      ? Math.round(
          (Object.values(history).reduce((s, h) => s + h.rate, 0) + progress) /
            totalDays,
        )
      : progress;

  const streak = (() => {
    let s = 0,
      d = new Date(today);
    while (true) {
      const k = d.toISOString().slice(0, 10);
      const val =
        k === today.toISOString().slice(0, 10) ? progress : history[k]?.rate;
      if (val === undefined || val < 50) break;
      s++;
      d.setDate(d.getDate() - 1);
    }
    return s;
  })();

  // category breakdown — handle both old (category) and new (cat) field names
  const cats = {};
  tasks.forEach((t) => {
    const key = t.cat || t.category || "Other";
    if (!cats[key]) cats[key] = { total: 0, done: 0 };
    cats[key].total++;
    if (t.done || t.completed) cats[key].done++;
  });

  return (
    <div className="page">
      <h1
        style={{
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: "-0.03em",
          color: "var(--txt)",
          marginBottom: 4,
        }}
      >
        Progress
      </h1>
      <p style={{ fontSize: 14, color: "var(--txt-3)", marginBottom: 24 }}>
        Your productivity overview
      </p>

      {/* today ring + stats */}
      <div
        className="card"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
          marginBottom: 14,
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
              fontWeight: 700,
              color: "var(--txt)",
            }}
          >
            {progress}%
          </div>
        </div>
        <div>
          <div className="sec-label">Today</div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "var(--txt)",
            }}
          >
            {doneCount}
            <span
              style={{ fontSize: 16, color: "var(--txt-3)", fontWeight: 400 }}
            >
              /{tasks.length}
            </span>
          </div>
          <div style={{ fontSize: 13, color: "var(--txt-2)", marginTop: 2 }}>
            tasks completed
          </div>
        </div>
      </div>

      {/* 3 stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 10,
          marginBottom: 14,
        }}
      >
        {[
          { label: "Streak", value: `${streak}d` },
          { label: "Avg", value: `${avgRate}%` },
          { label: "Days", value: totalDays },
        ].map((s) => (
          <div
            key={s.label}
            className="card"
            style={{ textAlign: "center", padding: "14px 10px" }}
          >
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: "var(--txt)",
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--txt-3)",
                marginTop: 3,
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* weekly bars */}
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="sec-label">Last 7 Days</div>
        <div
          style={{
            display: "flex",
            gap: 4,
            justifyContent: "space-between",
            paddingTop: 4,
          }}
        >
          {week.map((d, i) => (
            <Bar key={i} {...d} />
          ))}
        </div>
      </div>

      {/* categories */}
      {Object.keys(cats).length > 0 && (
        <div className="card" style={{ marginBottom: 8 }}>
          <div className="sec-label">By Category</div>
          {Object.entries(cats).map(([cat, { total, done }]) => {
            const rate = Math.round((done / total) * 100);
            return (
              <div key={cat} style={{ marginBottom: 14 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: "var(--txt)",
                    }}
                  >
                    {cat}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--txt-3)" }}>
                    {done}/{total}
                  </span>
                </div>
                <div className="prog-track">
                  <div className="prog-fill" style={{ width: `${rate}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
