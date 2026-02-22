"use client";
import { useApp } from "@/Components/store";

const THEMES = [
  {
    id: "dark",
    label: "Dark",
    bg: "#0c0c0c",
    fg: "#efefef",
    sub: "Pure black",
  },
  {
    id: "white",
    label: "Light",
    bg: "#ffffff",
    fg: "#0c0c0c",
    sub: "Pure white",
  },
  { id: "gray", label: "Gray", bg: "#1a1a1a", fg: "#f0f0f0", sub: "Mid gray" },
];

export default function SettingsView() {
  const { theme, setTheme, tasks, doneCount, progress } = useApp();

  function clearDone() {
    if (!confirm("Clear all completed tasks?")) return;
    const key = "tf_tasks_" + new Date().toISOString().slice(0, 10);
    const saved = localStorage.getItem(key);
    if (saved) {
      localStorage.setItem(
        key,
        JSON.stringify(JSON.parse(saved).filter((t) => !t.done)),
      );
      window.location.reload();
    }
  }

  return (
    <div className="page">
      <h1
        style={{
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: "-0.03em",
          color: "var(--txt)",
          marginBottom: 28,
        }}
      >
        Settings
      </h1>

      {/* theme */}
      <div style={{ marginBottom: 28 }}>
        <div className="sec-label">Theme</div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 10,
          }}
        >
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`swatch ${theme === t.id ? "active" : ""}`}
              style={{
                background: t.bg,
                borderColor: theme === t.id ? t.fg : t.bg + "44",
              }}
            >
              {/* dots preview */}
              <div style={{ display: "flex", gap: 4, marginBottom: 2 }}>
                {[1, 0.5, 0.2].map((o, i) => (
                  <div
                    key={i}
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: t.fg,
                      opacity: o,
                    }}
                  />
                ))}
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: t.fg }}>
                {t.label}
              </div>
              <div style={{ fontSize: 10, color: t.fg, opacity: 0.5 }}>
                {t.sub}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* today summary */}
      <div style={{ marginBottom: 28 }}>
        <div className="sec-label">Today</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { label: "Total tasks", value: tasks.length },
            { label: "Completed", value: doneCount },
            { label: "Completion rate", value: `${progress}%` },
          ].map((row) => (
            <div key={row.label} className="set-row">
              <span
                style={{ fontSize: 14, fontWeight: 500, color: "var(--txt)" }}
              >
                {row.label}
              </span>
              <span
                style={{ fontSize: 16, fontWeight: 700, color: "var(--txt)" }}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* data */}
      <div style={{ marginBottom: 40 }}>
        <div className="sec-label">Data</div>
        <div className="set-row">
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: "var(--txt)" }}>
              Clear completed
            </div>
            <div style={{ fontSize: 12, color: "var(--txt-3)", marginTop: 2 }}>
              Remove today's done tasks
            </div>
          </div>
          <button
            onClick={clearDone}
            style={{
              padding: "8px 16px",
              borderRadius: 9,
              border: "none",
              background: "var(--danger)",
              color: "#fff",
              fontFamily: "var(--font)",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Clear
          </button>
        </div>
      </div>

      <div style={{ textAlign: "center", color: "var(--txt-3)", fontSize: 12 }}>
        Daily Mark · v1.0
      </div>
    </div>
  );
}
