"use client";
import { useState, useEffect } from "react";

const NOTIF_KEY = "app_notifications";
const READ_KEY = "app_notifications_read";

const TYPE_CONFIG = {
  info: { color: "#5b8def", bg: "#5b8def12", border: "#5b8def40", icon: "ℹ️" },
  success: {
    color: "#4caf7d",
    bg: "#4caf7d12",
    border: "#4caf7d40",
    icon: "✨",
  },
  warning: {
    color: "#e8924a",
    bg: "#e8924a12",
    border: "#e8924a40",
    icon: "⚠️",
  },
  update: {
    color: "#9b72cf",
    bg: "#9b72cf12",
    border: "#9b72cf40",
    icon: "🚀",
  },
};

export default function NotificationBanner() {
  const [notifs, setNotifs] = useState([]);
  const [dismissed, setDismissed] = useState(new Set());

  useEffect(() => {
    function load() {
      try {
        const all = JSON.parse(localStorage.getItem(NOTIF_KEY) || "[]");
        const readIds = JSON.parse(localStorage.getItem(READ_KEY) || "[]");
        setDismissed(new Set(readIds));
        setNotifs(all);
      } catch {}
    }
    load();
    // Poll every 30s to pick up new notifications from admin
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  function dismiss(id) {
    const newDismissed = new Set([...dismissed, id]);
    setDismissed(newDismissed);
    localStorage.setItem(READ_KEY, JSON.stringify([...newDismissed]));
  }

  const visible = notifs.filter((n) => !dismissed.has(n.id));
  if (visible.length === 0) return null;

  // Show only the latest unread
  const latest = visible[0];
  const cfg = TYPE_CONFIG[latest.type] || TYPE_CONFIG.info;

  return (
    <div
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        borderRadius: 12,
        padding: "11px 14px",
        marginBottom: 14,
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        animation: "slideIn .3s ease",
        position: "relative",
      }}
    >
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>
        {cfg.icon}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 2,
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: ".07em",
              color: cfg.color,
            }}
          >
            {latest.type === "success"
              ? "New Feature"
              : latest.type === "update"
                ? "Update"
                : latest.type === "warning"
                  ? "Important"
                  : "Info"}
          </span>
          {visible.length > 1 && (
            <span style={{ fontSize: 10, color: "#999", fontWeight: 600 }}>
              +{visible.length - 1} more
            </span>
          )}
        </div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "var(--txt, #111)",
            marginBottom: 2,
          }}
        >
          {latest.title}
        </div>
        <div
          style={{ fontSize: 12, color: "var(--txt2, #555)", lineHeight: 1.5 }}
        >
          {latest.message}
        </div>
        <div style={{ fontSize: 10, color: "#aaa", marginTop: 5 }}>
          {new Date(latest.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </div>
      </div>

      <button
        onClick={() => dismiss(latest.id)}
        style={{
          background: "none",
          border: "none",
          fontSize: 16,
          color: "#bbb",
          cursor: "pointer",
          padding: 0,
          lineHeight: 1,
          flexShrink: 0,
        }}
        title="Dismiss"
      >
        ×
      </button>
    </div>
  );
}
