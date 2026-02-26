"use client";
import { useApp } from "@/Components/store";
import { useState, useEffect } from "react";

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

const NAV_ITEMS = [
  {
    id: "timetable",
    label: "Schedule",
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
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
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
    id: "notes",
    label: "Notes",
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
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  // 🔔 Notifications tab
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
    id: "settings",
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

// ── Notification panel shown when "Alerts" tab is active ──
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
    const next = new Set([...readIds, id]);
    setReadIds(next);
    localStorage.setItem(READ_KEY, JSON.stringify([...next]));
  }

  function markAllRead() {
    const ids = notifs.map((n) => n.id);
    localStorage.setItem(READ_KEY, JSON.stringify(ids));
    setReadIds(new Set(ids));
  }

  const unreadCount = notifs.filter((n) => !readIds.has(n.id)).length;

  return (
    <div style={{ padding: "20px 16px", maxWidth: 480, margin: "0 auto" }}>
      {/* Header */}
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
          {unreadCount > 0 && (
            <p
              style={{ margin: "3px 0 0", fontSize: 12, color: "var(--txt3)" }}
            >
              {unreadCount} unread
            </p>
          )}
        </div>
        {unreadCount > 0 && (
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

      {/* List */}
      {notifs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔔</div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "var(--txt)",
              marginBottom: 6,
            }}
          >
            All caught up!
          </div>
          <div style={{ fontSize: 13, color: "var(--txt3)" }}>
            No notifications yet. Check back later.
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
                  padding: "14px 15px",
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  cursor: "pointer",
                  transition: "all .2s",
                }}
              >
                <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>
                  {cfg.icon}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 4,
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
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          background: cfg.color,
                          flexShrink: 0,
                        }}
                      />
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "var(--txt)",
                      marginBottom: 4,
                    }}
                  >
                    {n.title}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--txt2)",
                      lineHeight: 1.5,
                    }}
                  >
                    {n.message}
                  </div>
                  <div
                    style={{ fontSize: 11, color: "var(--txt3)", marginTop: 6 }}
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

// ── Hook to get unread count for badge ──
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

export default function BottomNav() {
  const { view, setView } = useApp();
  const unreadCount = useUnreadCount();

  return (
    <>
      {/* Render notification panel in scroller when active */}
      {view === "notifications" && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 60, // height of bnav
            overflowY: "auto",
            background: "var(--bg)",
            zIndex: 10,
          }}
        >
          <NotificationsPanel />
        </div>
      )}

      <nav className="bnav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`bnav-btn ${view === item.id ? "on" : ""}`}
            onClick={() => setView(item.id)}
            style={{ position: "relative" }}
          >
            <span
              className="bnav-icon"
              style={{ position: "relative", display: "inline-flex" }}
            >
              {item.icon}
              {/* Badge for notifications tab */}
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
                    border: "1.5px solid var(--bg, #fff)",
                  }}
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </span>
            {item.label}
          </button>
        ))}
      </nav>
    </>
  );
}
