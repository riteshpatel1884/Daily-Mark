"use client";
import { useApp } from "@/Components/store";

const ITEMS = [
  {
    id: "today",
    label: "Today",
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="18" height="18" rx="3" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
  {
    id: "exams",
    label: "Exam Countdown",
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  {
    id: "attendance",
    label: "Attendance",
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    id: "progress",
    label: "Analytics",
    icon: (
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
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
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
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
  const { view, setView, progress, doneCount, tasks, upcomingExams, sem } =
    useApp();
  const nextExam = upcomingExams[0];

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div style={{ padding: "2px 11px 18px" }}>
        <div
          style={{
            fontSize: 15,
            fontWeight: 800,
            color: "var(--txt)",
            letterSpacing: "-.02em",
          }}
        >
          Daily MARK
        </div>
        <div style={{ fontSize: 11, color: "var(--txt3)", marginTop: 1 }}>
          {sem}
        </div>
      </div>

      {/* Today quick stats */}
      <div
        style={{
          background: "var(--bg3)",
          borderRadius: 12,
          padding: 12,
          marginBottom: 12,
          border: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 8,
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              color: "var(--txt3)",
            }}
          >
            Today
          </span>
          <span
            style={{
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: "-.03em",
              color: "var(--txt)",
            }}
          >
            {progress}%
          </span>
        </div>
        <div className="ptrack">
          <div
            className="pfill"
            style={{ width: `${progress}%`, background: "var(--txt)" }}
          />
        </div>
        <div style={{ fontSize: 11, color: "var(--txt3)", marginTop: 6 }}>
          {doneCount}/{tasks.length} tasks done
        </div>
      </div>

      {/* Next exam chip */}
      {nextExam && (
        <div
          style={{
            background: nextExam.daysLeft <= 3 ? "var(--red)18" : "var(--bg3)",
            border: `1px solid ${nextExam.daysLeft <= 3 ? "var(--red)44" : "var(--border)"}`,
            borderRadius: 10,
            padding: "9px 11px",
            marginBottom: 12,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: ".07em",
              textTransform: "uppercase",
              color: nextExam.daysLeft <= 3 ? "var(--red)" : "var(--txt3)",
              marginBottom: 3,
            }}
          >
            Next Exam
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--txt)" }}>
            {nextExam.subject}
          </div>
          <div
            style={{
              fontSize: 11,
              color: nextExam.daysLeft <= 3 ? "var(--red)" : "var(--txt2)",
              marginTop: 1,
              fontFamily: "var(--mono)",
            }}
          >
            {nextExam.daysLeft === 0
              ? "TODAY"
              : nextExam.daysLeft === 1
                ? "TOMORROW"
                : `in ${nextExam.daysLeft} days`}
          </div>
        </div>
      )}

      {/* Nav */}
      <div
        style={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}
      >
        {ITEMS.map((item) => (
          <button
            key={item.id}
            className={`snav ${view === item.id ? "on" : ""}`}
            onClick={() => setView(item.id)}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>
    </aside>
  );
}
