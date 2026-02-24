"use client";
import { useApp } from "@/Components/store";

const ITEMS = [
  {
    id: "today",
    label: "Today",
    icon: (
      <svg
        width="14"
        height="14"
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
    id: "timetable",
    label: "Timetable",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    id: "exams",
    label: "Exam Countdown",
    icon: (
      <svg
        width="14"
        height="14"
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
        width="14"
        height="14"
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
    id: "habits",
    label: "Habit Grid",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    id: "notes",
    label: "Notes",
    icon: (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    id: "progress",
    label: "Analytics",
    icon: (
      <svg
        width="14"
        height="14"
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
        width="14"
        height="14"
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
  const {
    view,
    setView,
    progress,
    doneCount,
    tasks,
    upcomingExams,
    sem,
    nextClass,
    nextClassMins,
    carriedCount,
  } = useApp();
  const nextExam = upcomingExams[0];

  let profileName = "",
    profileBranch = "",
    profileYear = "";
  try {
    const p = JSON.parse(localStorage.getItem("gr_profile") || "{}");
    profileName = p.name || "";
    profileBranch = p.branch || "";
    profileYear = p.year || "";
  } catch {}

  const initials =
    profileName
      .trim()
      .split(" ")
      .map((w) => w[0]?.toUpperCase() || "")
      .slice(0, 2)
      .join("") || "?";
  const avatarColors = [
    "#5b8def",
    "#9b72cf",
    "#4caf7d",
    "#e8924a",
    "#d46fa0",
    "#d4b44a",
  ];
  const avatarColor =
    avatarColors[
      profileName.split("").reduce((s, c) => s + c.charCodeAt(0), 0) %
        avatarColors.length
    ];

  function minsLabel(m) {
    return m < 60
      ? `${m}m`
      : `${Math.floor(m / 60)}h${m % 60 > 0 ? " " + (m % 60) + "m" : ""}`;
  }
  function fmt12(t) {
    if (!t) return "";
    const [h, m] = t.split(":").map(Number);
    return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
  }

  return (
    <aside className="sidebar">
      {/* Profile */}
      <div
        style={{
          padding: "2px 11px 16px",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          onClick={() => setView("settings")}
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: profileName ? avatarColor : "var(--bg4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 800,
            color: "#fff",
            flexShrink: 0,
            cursor: "pointer",
            border: "2px solid var(--border)",
          }}
        >
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "var(--txt)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {profileName || "GradeFlow"}
          </div>
          <div style={{ fontSize: 10, color: "var(--txt3)" }}>
            {profileBranch && profileYear
              ? `${profileBranch} · ${profileYear}`
              : sem}
          </div>
        </div>
      </div>

      {/* Next class */}
      {nextClass && (
        <div
          style={{
            background: "var(--blue)18",
            border: "1px solid var(--blue)33",
            borderRadius: 10,
            padding: "9px 11px",
            marginBottom: 10,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: ".07em",
              textTransform: "uppercase",
              color: "var(--blue)",
              marginBottom: 3,
            }}
          >
            Next Class
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--txt)" }}>
            {nextClass.subject}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 2,
            }}
          >
            <div style={{ fontSize: 11, color: "var(--txt2)" }}>
              {fmt12(nextClass.startTime)}
            </div>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 12,
                fontWeight: 700,
                color: "var(--blue)",
              }}
            >
              {minsLabel(nextClassMins)}
            </div>
          </div>
        </div>
      )}

      {/* Backlog */}
      {carriedCount > 0 && (
        <div
          style={{
            background: "var(--orange)18",
            border: "1px solid var(--orange)44",
            borderRadius: 10,
            padding: "9px 11px",
            marginBottom: 10,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: ".07em",
              textTransform: "uppercase",
              color: "var(--orange)",
              marginBottom: 2,
            }}
          >
            Backlog
          </div>
          <div
            style={{ fontSize: 12, color: "var(--orange)", fontWeight: 600 }}
          >
            {carriedCount} task{carriedCount > 1 ? "s" : ""} from yesterday
          </div>
        </div>
      )}

      {/* Today progress */}
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

      {/* Next exam */}
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
