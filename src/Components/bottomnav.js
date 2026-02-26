"use client";
import { useApp } from "@/Components/store";
import { useState, useEffect, useRef } from "react";

const NOTIF_KEY = "app_notifications";
const READ_KEY = "app_notifications_read";

function useUnreadCount() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    function load() {
      try {
        const all = JSON.parse(localStorage.getItem(NOTIF_KEY) || "[]");
        const read = new Set(
          JSON.parse(localStorage.getItem(READ_KEY) || "[]"),
        );
        setCount(all.filter((n) => !read.has(n.id)).length);
      } catch {}
    }
    load();
    const iv = setInterval(load, 30000);
    return () => clearInterval(iv);
  }, []);
  return count;
}

const PRIMARY = [
  {
    id: "heatmap",
    label: "Heatmap",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
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
    id: "placement",
    label: "Placement",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
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
  {
    id: "focus",
    label: "Focus",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="4" />
        <line x1="12" y1="2" x2="12" y2="4" />
        <line x1="12" y1="20" x2="12" y2="22" />
        <line x1="2" y1="12" x2="4" y2="12" />
        <line x1="20" y1="12" x2="22" y2="12" />
      </svg>
    ),
  },
  {
    id: "notifications",
    label: "Alerts",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 01-3.46 0" />
      </svg>
    ),
  },
  {
    id: "__more__",
    label: "More",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
        <circle cx="5" cy="12" r="1" />
      </svg>
    ),
  },
];

const MORE_ITEMS = [
  {
    id: "timetable",
    label: "Timetable",
    desc: "Class schedule",
    color: "#5b8def",
    bg: "#5b8def15",
    icon: (
      <svg
        width="17"
        height="17"
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
    desc: "Track upcoming exams",
    color: "#e05252",
    bg: "#e0525215",
    icon: (
      <svg
        width="17"
        height="17"
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
    desc: "Bunk calc & tracker",
    color: "#4caf7d",
    bg: "#4caf7d15",
    icon: (
      <svg
        width="17"
        height="17"
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
    id: "notes",
    label: "Notes",
    desc: "Subject notes",
    color: "#d4b44a",
    bg: "#d4b44a15",
    icon: (
      <svg
        width="17"
        height="17"
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
    desc: "Progress & insights",
    color: "#9b72cf",
    bg: "#9b72cf15",
    icon: (
      <svg
        width="17"
        height="17"
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
];

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

function NotificationsPanel() {
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
    const n = new Set([...readIds, id]);
    setReadIds(n);
    localStorage.setItem(READ_KEY, JSON.stringify([...n]));
  }
  function markAllRead() {
    const ids = notifs.map((n) => n.id);
    localStorage.setItem(READ_KEY, JSON.stringify(ids));
    setReadIds(new Set(ids));
  }
  const unread = notifs.filter((n) => !readIds.has(n.id)).length;
  return (
    <div style={{ padding: "20px 16px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 800,
              color: "var(--txt)",
            }}
          >
            Notifications
          </h2>
          {unread > 0 && (
            <p
              style={{ margin: "3px 0 0", fontSize: 12, color: "var(--txt3)" }}
            >
              {unread} unread
            </p>
          )}
        </div>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            style={{
              background: "#5b8def18",
              border: "1px solid #5b8def44",
              borderRadius: 8,
              padding: "6px 12px",
              fontSize: 12,
              fontWeight: 600,
              color: "#5b8def",
              cursor: "pointer",
            }}
          >
            Mark all read
          </button>
        )}
      </div>
      {notifs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🔔</div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "var(--txt)",
              marginBottom: 4,
            }}
          >
            All caught up!
          </div>
          <div style={{ fontSize: 12, color: "var(--txt3)" }}>
            No notifications yet.
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {notifs.map((n) => {
            const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.info;
            const isUnread = !readIds.has(n.id);
            return (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                style={{
                  background: isUnread ? cfg.bg : "var(--bg3)",
                  border: `1px solid ${isUnread ? cfg.border : "var(--border)"}`,
                  borderRadius: 14,
                  padding: "13px 14px",
                  display: "flex",
                  gap: 11,
                  cursor: "pointer",
                }}
              >
                <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>
                  {cfg.icon}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: 3,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: ".07em",
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
                          marginTop: 3,
                        }}
                      />
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--txt)",
                      marginBottom: 3,
                    }}
                  >
                    {n.title}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--txt2)",
                      lineHeight: 1.45,
                    }}
                  >
                    {n.message}
                  </div>
                  <div
                    style={{ fontSize: 10, color: "var(--txt3)", marginTop: 5 }}
                  >
                    {new Date(n.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function BottomNav() {
  const { view, setView } = useApp();
  const unreadCount = useUnreadCount();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef(null);

  useEffect(() => {
    function handler(e) {
      if (drawerRef.current && !drawerRef.current.contains(e.target))
        setDrawerOpen(false);
    }
    if (drawerOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [drawerOpen]);

  function goTo(id) {
    setView(id);
    setDrawerOpen(false);
  }

  const MORE_IDS = new Set([...MORE_ITEMS.map((i) => i.id), "settings"]);
  const moreActive = MORE_IDS.has(view);

  return (
    <>
      {/* Notification panel full screen */}
      {view === "notifications" && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 60,
            overflowY: "auto",
            background: "var(--bg)",
            zIndex: 10,
          }}
        >
          <NotificationsPanel />
        </div>
      )}

      {/* More drawer */}
      {drawerOpen && (
        <>
          <div
            onClick={() => setDrawerOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,.45)",
              zIndex: 55,
              backdropFilter: "blur(4px)",
            }}
          />
          <div
            ref={drawerRef}
            style={{
              position: "fixed",
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 56,
              background: "var(--bg2)",
              borderRadius: "22px 22px 0 0",
              maxHeight: "82dvh",
              display: "flex",
              flexDirection: "column",
              animation: "sheetUp .26s cubic-bezier(.32,1,.5,1) both",
              boxShadow: "0 -8px 40px rgba(0,0,0,.18)",
            }}
          >
            {/* Handle + header — fixed, never scrolls */}
            <div style={{ flexShrink: 0 }}>
              <div
                style={{
                  width: 36,
                  height: 4,
                  background: "var(--border2)",
                  borderRadius: 99,
                  margin: "12px auto 4px",
                }}
              />
              <div
                style={{
                  padding: "8px 20px 10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: ".1em",
                    color: "var(--txt3)",
                  }}
                >
                  More
                </span>
                <button
                  onClick={() => setDrawerOpen(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--txt3)",
                    fontSize: 20,
                    cursor: "pointer",
                    lineHeight: 1,
                    padding: 0,
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Scrollable content */}
            <div
              style={{
                overflowY: "auto",
                flex: 1,
                paddingBottom: "calc(16px + env(safe-area-inset-bottom))",
              }}
            >
              {/* 2-col grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10,
                  padding: "0 16px 4px",
                }}
              >
                {MORE_ITEMS.map((item) => {
                  const isActive = view === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => goTo(item.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 11,
                        padding: "13px 13px",
                        borderRadius: 14,
                        border: `1.5px solid ${isActive ? item.color : "var(--border)"}`,
                        background: isActive ? item.bg : "var(--bg3)",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all .15s",
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          background: item.bg,
                          border: `1px solid ${item.color}33`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          color: item.color,
                        }}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: isActive ? item.color : "var(--txt)",
                            marginBottom: 2,
                          }}
                        >
                          {item.label}
                        </div>
                        <div
                          style={{
                            fontSize: 10,
                            color: "var(--txt3)",
                            lineHeight: 1.3,
                          }}
                        >
                          {item.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Divider */}
              <div
                style={{
                  height: 1,
                  background: "var(--border)",
                  margin: "10px 16px 8px",
                }}
              />

              {/* Notifications */}
              <div style={{ padding: "0 16px 6px" }}>
                <button
                  onClick={() => goTo("notifications")}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "11px 13px",
                    borderRadius: 14,
                    border: `1.5px solid ${view === "notifications" ? "#d4b44a" : "var(--border)"}`,
                    background:
                      view === "notifications" ? "#d4b44a15" : "var(--bg3)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all .15s",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: "#d4b44a15",
                      border: "1px solid #d4b44a33",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      color: "#d4b44a",
                      position: "relative",
                    }}
                  >
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
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
                          fontSize: 8,
                          fontWeight: 800,
                          minWidth: 14,
                          height: 14,
                          borderRadius: 99,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "0 3px",
                        }}
                      >
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "var(--txt)",
                        marginBottom: 2,
                      }}
                    >
                      Notifications
                    </div>
                    <div style={{ fontSize: 10, color: "var(--txt3)" }}>
                      Alerts & announcements
                    </div>
                  </div>
                  {unreadCount > 0 && (
                    <span
                      style={{
                        background: "#e05252",
                        color: "#fff",
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "2px 8px",
                        borderRadius: 99,
                      }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Settings — always last */}
              <div style={{ padding: "0 16px 0" }}>
                <button
                  onClick={() => goTo("settings")}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "11px 13px",
                    borderRadius: 14,
                    border: `1.5px solid ${view === "settings" ? "var(--txt)" : "var(--border)"}`,
                    background:
                      view === "settings" ? "var(--accent-dim)" : "var(--bg3)",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all .15s",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: "var(--bg4)",
                      border: "1px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      color: "var(--txt2)",
                    }}
                  >
                    <svg
                      width="17"
                      height="17"
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
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "var(--txt)",
                        marginBottom: 2,
                      }}
                    >
                      Settings
                    </div>
                    <div style={{ fontSize: 10, color: "var(--txt3)" }}>
                      Theme, profile & preferences
                    </div>
                  </div>
                </button>
              </div>
            </div>
            {/* end scrollable */}
          </div>
          {/* end drawer */}
        </>
      )}

      {/* Bottom bar */}
      <nav className="bnav">
        {PRIMARY.map((item) => {
          const isMore = item.id === "__more__";
          const isActive = isMore ? moreActive || drawerOpen : view === item.id;
          return (
            <button
              key={item.id}
              className={`bnav-btn ${isActive ? "on" : ""}`}
              onClick={() => {
                if (isMore) {
                  setDrawerOpen((o) => !o);
                } else {
                  setDrawerOpen(false);
                  setView(item.id);
                }
              }}
              style={{ position: "relative" }}
            >
              <span
                className="bnav-icon"
                style={{ position: "relative", display: "inline-flex" }}
              >
                {item.icon}
                {/* Badge on More button if unread */}
                {isMore && unreadCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: -4,
                      right: -6,
                      background: "#e05252",
                      color: "#fff",
                      fontSize: 8,
                      fontWeight: 800,
                      minWidth: 14,
                      height: 14,
                      borderRadius: 99,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0 3px",
                      border: "1.5px solid var(--bg)",
                    }}
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
                {/* Badge on Alerts tab */}
                {item.id === "notifications" && unreadCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: -4,
                      right: -6,
                      background: "#e05252",
                      color: "#fff",
                      fontSize: 8,
                      fontWeight: 800,
                      minWidth: 14,
                      height: 14,
                      borderRadius: 99,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0 3px",
                      border: "1.5px solid var(--bg)",
                    }}
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </span>
              {item.label}
            </button>
          );
        })}
      </nav>
    </>
  );
}
