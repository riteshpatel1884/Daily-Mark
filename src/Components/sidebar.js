"use client";
import { useApp } from "@/Components/store";

const ITEMS = [
  {
    id: "today",
    label: "Today",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="18" height="18" rx="3" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
  {
    id: "progress",
    label: "Progress",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    id: "settings",
    label: "Settings",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const { view, setView, progress, doneCount, tasks } = useApp();
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div style={{ padding: "4px 12px 20px" }}>
        <div
          style={{
            fontSize: "17px",
            fontWeight: 700,
            color: "var(--txt)",
            letterSpacing: "-0.02em",
          }}
        >
          TaskFlow
        </div>
        <div
          style={{ fontSize: "12px", color: "var(--txt-3)", marginTop: "2px" }}
        >
          Daily tracker
        </div>
      </div>

      {/* Mini progress */}
      <div
        style={{
          padding: "14px",
          background: "var(--bg-3)",
          borderRadius: "12px",
          marginBottom: "14px",
          border: "1px solid var(--line)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: "10px",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.07em",
              textTransform: "uppercase",
              color: "var(--txt-3)",
            }}
          >
            Today
          </span>
          <span
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "var(--txt)",
              letterSpacing: "-0.03em",
            }}
          >
            {progress}%
          </span>
        </div>
        <div className="prog-track">
          <div className="prog-fill" style={{ width: `${progress}%` }} />
        </div>
        <div
          style={{ fontSize: "12px", color: "var(--txt-3)", marginTop: "8px" }}
        >
          {doneCount} of {tasks.length} done
        </div>
      </div>

      {/* Nav */}
      {ITEMS.map((item) => (
        <button
          key={item.id}
          className={`side-item ${view === item.id ? "active" : ""}`}
          onClick={() => setView(item.id)}
        >
          {item.icon}
          {item.label}
        </button>
      ))}
    </aside>
  );
}
