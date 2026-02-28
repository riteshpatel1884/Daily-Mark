"use client";
import { useApp } from "@/Components/store";
import { useState, useEffect, useRef } from "react";

// ── SHARED avatar color palette ──
const AVATAR_COLORS = [
  "#5b8def",
  "#9b72cf",
  "#4caf7d",
  "#e8924a",
  "#d46fa0",
  "#d4b44a",
];
function getAvatarColor(name) {
  return AVATAR_COLORS[
    name.split("").reduce((s, c) => s + c.charCodeAt(0), 0) %
      AVATAR_COLORS.length
  ];
}

const NOTIF_KEY = "app_notifications";
const READ_KEY = "app_notifications_read";

const TYPE_CONFIG = {
  info: {
    color: "#5b8def",
    bg: "#5b8def12",
    border: "#5b8def35",
    icon: "ℹ️",
    label: "Info",
  },
  success: {
    color: "#4caf7d",
    bg: "#4caf7d12",
    border: "#4caf7d35",
    icon: "✨",
    label: "New Feature",
  },
  warning: {
    color: "#e8924a",
    bg: "#e8924a12",
    border: "#e8924a35",
    icon: "⚠️",
    label: "Important",
  },
  update: {
    color: "#9b72cf",
    bg: "#9b72cf12",
    border: "#9b72cf35",
    icon: "🚀",
    label: "Update",
  },
};

function useNotifications() {
  const [notifs, setNotifs] = useState([]);
  const [readIds, setReadIds] = useState(new Set());

  useEffect(() => {
    function load() {
      try {
        const all = JSON.parse(localStorage.getItem(NOTIF_KEY) || "[]");
        const read = JSON.parse(localStorage.getItem(READ_KEY) || "[]");
        setNotifs(all);
        setReadIds(new Set(read));
      } catch {}
    }
    load();
    const iv = setInterval(load, 30000);
    return () => clearInterval(iv);
  }, []);

  function markRead(id) {
    setReadIds((prev) => {
      const next = new Set([...prev, id]);
      localStorage.setItem(READ_KEY, JSON.stringify([...next]));
      return next;
    });
  }

  function markAllRead() {
    const ids = notifs.map((n) => n.id);
    localStorage.setItem(READ_KEY, JSON.stringify(ids));
    setReadIds(new Set(ids));
  }

  const unreadCount = notifs.filter((n) => !readIds.has(n.id)).length;
  return { notifs, readIds, markRead, markAllRead, unreadCount };
}

const ITEMS = [
  // {
  //   id: "attendance",
  //   label: "Attendance",
  //   icon: (
  //     <svg
  //       width="14"
  //       height="14"
  //       viewBox="0 0 24 24"
  //       fill="none"
  //       stroke="currentColor"
  //       strokeWidth="2"
  //       strokeLinecap="round"
  //       strokeLinejoin="round"
  //     >
  //       <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
  //       <circle cx="9" cy="7" r="4" />
  //       <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
  //     </svg>
  //   ),
  // },
  {
    id: "heatmap",
    label: "HeatMap",
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
    id: "placement",
    label: "Placement Prep",
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
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="16" />
        <line x1="10" y1="14" x2="14" y2="14" />
      </svg>
    ),
  },

  // {
  //   id: "progress",
  //   label: "Analytics",
  //   icon: (
  //     <svg
  //       width="14"
  //       height="14"
  //       viewBox="0 0 24 24"
  //       fill="none"
  //       stroke="currentColor"
  //       strokeWidth="2"
  //       strokeLinecap="round"
  //       strokeLinejoin="round"
  //     >
  //       <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  //     </svg>
  //   ),
  // },
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

  const { notifs, readIds, markRead, markAllRead, unreadCount } =
    useNotifications();
  const [panelOpen, setPanelOpen] = useState(false);
  const panelRef = useRef(null);
  const bellRef = useRef(null);

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
  const avatarColor = profileName ? getAvatarColor(profileName) : "var(--bg4)";

  // Close panel on outside click
  useEffect(() => {
    function handler(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setPanelOpen(false);
      }
    }
    if (panelOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [panelOpen]);

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

  let placementPct = 0;
  try {
    const dsaSolved = JSON.parse(localStorage.getItem("pp_dsa_solved") || "{}");
    const dsaTopicTotals = {
      arrays: 30,
      linkedlist: 20,
      stacks: 15,
      trees: 25,
      graphs: 25,
      dp: 30,
      recursion: 20,
      sorting: 15,
      greedy: 15,
      hashing: 12,
      heap: 12,
      trie: 10,
      bitmanip: 10,
      math: 10,
    };
    const dsaTotal = Object.values(dsaTopicTotals).reduce((a, b) => a + b, 0);
    const dsaDone = Object.entries(dsaSolved).reduce(
      (s, [k, v]) =>
        s + (dsaTopicTotals[k] ? Math.min(v, dsaTopicTotals[k]) : 0),
      0,
    );
    const dsaPct = Math.round((dsaDone / dsaTotal) * 100);
    const coreProgress = JSON.parse(
      localStorage.getItem("pp_core_progress") || "{}",
    );
    const corePct = Math.min(
      100,
      Math.round(
        (Object.values(coreProgress).filter(Boolean).length / 29) * 100,
      ),
    );
    const skills = JSON.parse(localStorage.getItem("pp_skills") || "{}");
    const skillPct = Math.min(
      100,
      Math.round(
        (Object.values(skills).filter((v) => v >= 3).length / 8) * 100,
      ),
    );
    const resumeCheck = JSON.parse(
      localStorage.getItem("pp_resume_check") || "{}",
    );
    const resumePct = Math.round(
      (Object.values(resumeCheck).filter(Boolean).length / 12) * 100,
    );
    placementPct = Math.round(
      dsaPct * 0.35 + corePct * 0.25 + skillPct * 0.2 + resumePct * 0.2,
    );
  } catch {}

  return (
    <aside className="sidebar">
      {/* ── Profile row + bell ── */}
      <div
        style={{
          padding: "2px 11px 16px",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {/* Avatar */}
        <div
          onClick={() => setView("settings")}
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: avatarColor,
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

        {/* Name / branch */}
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
            {profileName || "LeaderLab"}
          </div>
          <div style={{ fontSize: 10, color: "var(--txt3)" }}>
            {profileBranch && profileYear
              ? `${profileBranch} · ${profileYear}`
              : sem}
          </div>
        </div>

        {/* 🔔 Bell button */}
        <div ref={panelRef} style={{ position: "relative", flexShrink: 0 }}>
          <button
            ref={bellRef}
            onClick={() => {
              setPanelOpen((o) => !o);
            }}
            style={{
              background: panelOpen ? "var(--bg3)" : "none",
              border: "1.5px solid var(--border)",
              borderRadius: 8,
              width: 30,
              height: 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              position: "relative",
              transition: "background .15s",
            }}
            title="Notifications"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--txt2)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 01-3.46 0" />
            </svg>
            {unreadCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -4,
                  right: -4,
                  background: "#e05252",
                  color: "#fff",
                  fontSize: 9,
                  fontWeight: 800,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1.5px solid var(--bg, #fff)",
                }}
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* ── Notification Dropdown Panel ── */}
          {panelOpen && (
            <div
              style={{
                position: "fixed",
                top: (() => {
                  try {
                    return bellRef.current.getBoundingClientRect().bottom + 8;
                  } catch {
                    return 60;
                  }
                })(),
                left: (() => {
                  try {
                    return bellRef.current.getBoundingClientRect().right + 8;
                  } catch {
                    return 220;
                  }
                })(),
                width: 280,
                maxHeight: 380,
                background: "var(--bg, #fff)",
                border: "1.5px solid var(--border)",
                borderRadius: 14,
                boxShadow: "0 8px 32px rgba(0,0,0,.14)",
                zIndex: 999,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                animation: "notifSlide .18s ease",
              }}
            >
              <style>{`
                @keyframes notifSlide {
                  from { opacity: 0; transform: translateY(-6px) scale(.97); }
                  to   { opacity: 1; transform: translateY(0) scale(1); }
                }
              `}</style>

              {/* Panel header */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 14px 10px",
                  borderBottom: "1px solid var(--border)",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{ fontSize: 13, fontWeight: 700, color: "var(--txt)" }}
                >
                  Notifications{" "}
                  {unreadCount > 0 && (
                    <span style={{ color: "#e05252", fontWeight: 800 }}>
                      ({unreadCount})
                    </span>
                  )}
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: 11,
                      color: "#5b8def",
                      cursor: "pointer",
                      fontWeight: 600,
                      padding: 0,
                    }}
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notification list */}
              <div style={{ overflowY: "auto", flex: 1 }}>
                {notifs.length === 0 ? (
                  <div style={{ padding: "32px 0", textAlign: "center" }}>
                    <div style={{ fontSize: 26, marginBottom: 6 }}>🔔</div>
                    <div style={{ fontSize: 12, color: "var(--txt3)" }}>
                      No notifications yet
                    </div>
                  </div>
                ) : (
                  notifs.map((n) => {
                    const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.info;
                    const isUnread = !readIds.has(n.id);
                    return (
                      <div
                        key={n.id}
                        onClick={() => markRead(n.id)}
                        style={{
                          padding: "11px 14px",
                          borderBottom: "1px solid var(--border)",
                          cursor: "pointer",
                          background: isUnread ? cfg.bg : "transparent",
                          transition: "background .15s",
                          display: "flex",
                          gap: 10,
                          alignItems: "flex-start",
                        }}
                      >
                        <span
                          style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}
                        >
                          {cfg.icon}
                        </span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              gap: 4,
                              marginBottom: 2,
                            }}
                          >
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: ".06em",
                                color: cfg.color,
                              }}
                            >
                              {cfg.label}
                            </span>
                            {isUnread && (
                              <span
                                style={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: "50%",
                                  background: cfg.color,
                                  flexShrink: 0,
                                }}
                              />
                            )}
                          </div>
                          <div
                            style={{
                              fontSize: 12,
                              fontWeight: 700,
                              color: "var(--txt)",
                              marginBottom: 2,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {n.title}
                          </div>
                          <div
                            style={{
                              fontSize: 11,
                              color: "var(--txt2)",
                              lineHeight: 1.45,
                            }}
                          >
                            {n.message}
                          </div>
                          <div
                            style={{
                              fontSize: 10,
                              color: "var(--txt3)",
                              marginTop: 4,
                            }}
                          >
                            {new Date(n.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
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

      {/* Placement readiness */}
      {placementPct > 0 && (
        <div
          onClick={() => setView("placement")}
          style={{
            background: "var(--purple)12",
            border: "1px solid var(--purple)33",
            borderRadius: 10,
            padding: "9px 11px",
            marginBottom: 12,
            cursor: "pointer",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: ".07em",
              textTransform: "uppercase",
              color: "var(--purple)",
              marginBottom: 5,
            }}
          >
            Placement Prep
          </div>
          <div
            style={{
              height: 4,
              background: "var(--bg4)",
              borderRadius: 99,
              overflow: "hidden",
              marginBottom: 5,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${placementPct}%`,
                background: "var(--purple)",
                borderRadius: 99,
                transition: "width .5s",
              }}
            />
          </div>
          <div
            style={{
              fontSize: 11,
              color: "var(--txt2)",
              fontFamily: "var(--mono)",
              fontWeight: 600,
            }}
          >
            {placementPct}% ready
          </div>
        </div>
      )}

      {/* Nav items */}
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
