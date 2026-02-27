"use client";
import { useState, useEffect } from "react";

const ADMIN_PASSWORD = process.env.ADMIN_ACCESS_PASSWORD;
const NOTIF_KEY = "app_notifications";

function getNotifs() {
  try {
    return JSON.parse(localStorage.getItem(NOTIF_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveNotifs(arr) {
  localStorage.setItem(NOTIF_KEY, JSON.stringify(arr));
}

const TYPE_CONFIG = {
  info: {
    label: "Info",
    color: "#5b8def",
    bg: "#5b8def18",
    border: "#5b8def44",
  },
  success: {
    label: "New Feature",
    color: "#4caf7d",
    bg: "#4caf7d18",
    border: "#4caf7d44",
  },
  warning: {
    label: "Important",
    color: "#e8924a",
    bg: "#e8924a18",
    border: "#e8924a44",
  },
  update: {
    label: "Update",
    color: "#9b72cf",
    bg: "#9b72cf18",
    border: "#9b72cf44",
  },
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (authed) setNotifs(getNotifs());
  }, [authed]);

  function login() {
    if (pw === ADMIN_PASSWORD) {
      setAuthed(true);
      setPwError(false);
    } else {
      setPwError(true);
      setPw("");
    }
  }

  function sendNotification() {
    if (!title.trim() || !message.trim()) return;
    setSending(true);
    const newNotif = {
      id: Date.now().toString(),
      title: title.trim(),
      message: message.trim(),
      type,
      createdAt: new Date().toISOString(),
      read: false,
    };
    const updated = [newNotif, ...getNotifs()];
    saveNotifs(updated);
    setNotifs(updated);
    setTitle("");
    setMessage("");
    setType("info");
    setSending(false);
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  }

  function deleteNotif(id) {
    const updated = notifs.filter((n) => n.id !== id);
    saveNotifs(updated);
    setNotifs(updated);
  }

  function clearAll() {
    saveNotifs([]);
    setNotifs([]);
  }

  if (!authed) {
    return (
      <div style={styles.loginWrap}>
        <div style={styles.loginCard}>
          <div style={styles.loginIcon}>🔐</div>
          <h1 style={styles.loginTitle}>Admin Panel</h1>
          <p style={styles.loginSub}>LeaderLab · Notification Center</p>
          <input
            type="password"
            placeholder="Enter admin password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            style={{ ...styles.input, ...(pwError ? styles.inputError : {}) }}
            autoFocus
          />
          {pwError && <p style={styles.errText}>Incorrect password</p>}
          <button onClick={login} style={styles.loginBtn}>
            Authenticate →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrap}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.headerTitle}>📢 Notification Center</h1>
          <p style={styles.headerSub}>
            Broadcast messages to all LeaderLab users
          </p>
        </div>
        <button onClick={() => setAuthed(false)} style={styles.logoutBtn}>
          Logout
        </button>
      </div>

      <div style={styles.grid}>
        {/* Compose */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Compose Notification</h2>

          {/* Type selector */}
          <div style={styles.typeRow}>
            {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => setType(key)}
                style={{
                  ...styles.typeBtn,
                  background: type === key ? cfg.bg : "var(--bg3, #f5f5f5)",
                  border: `1.5px solid ${type === key ? cfg.color : "transparent"}`,
                  color: type === key ? cfg.color : "#888",
                }}
              >
                {cfg.label}
              </button>
            ))}
          </div>

          {/* Title */}
          <label style={styles.label}>Title</label>
          <input
            placeholder="e.g. New Feature: AI Planner"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
            maxLength={80}
          />
          <div style={styles.charCount}>{title.length}/80</div>

          {/* Message */}
          <label style={styles.label}>Message</label>
          <textarea
            placeholder="Write your announcement here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={styles.textarea}
            maxLength={400}
            rows={4}
          />
          <div style={styles.charCount}>{message.length}/400</div>

          {/* Preview */}
          {(title || message) && (
            <div
              style={{
                background: TYPE_CONFIG[type].bg,
                border: `1px solid ${TYPE_CONFIG[type].border}`,
                borderRadius: 10,
                padding: "12px 14px",
                marginTop: 4,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: ".08em",
                  color: TYPE_CONFIG[type].color,
                  marginBottom: 4,
                }}
              >
                Preview · {TYPE_CONFIG[type].label}
              </div>
              {title && (
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#1a1a1a",
                    marginBottom: 3,
                  }}
                >
                  {title}
                </div>
              )}
              {message && (
                <div style={{ fontSize: 13, color: "#444", lineHeight: 1.5 }}>
                  {message}
                </div>
              )}
            </div>
          )}

          <button
            onClick={sendNotification}
            disabled={!title.trim() || !message.trim() || sending}
            style={{
              ...styles.sendBtn,
              background: sent ? "#4caf7d" : TYPE_CONFIG[type].color,
              opacity: !title.trim() || !message.trim() ? 0.5 : 1,
              cursor:
                !title.trim() || !message.trim() ? "not-allowed" : "pointer",
            }}
          >
            {sent ? "✓ Sent!" : sending ? "Sending..." : "Send to All Users →"}
          </button>
        </div>

        {/* History */}
        <div style={styles.card}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <h2 style={styles.cardTitle}>
              Sent Notifications{" "}
              <span style={{ fontSize: 12, fontWeight: 500, color: "#888" }}>
                ({notifs.length})
              </span>
            </h2>
            {notifs.length > 0 && (
              <button onClick={clearAll} style={styles.clearBtn}>
                Clear All
              </button>
            )}
          </div>

          {notifs.length === 0 ? (
            <div style={styles.empty}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
              <div style={{ color: "#888", fontSize: 13 }}>
                No notifications sent yet
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                maxHeight: 480,
                overflowY: "auto",
              }}
            >
              {notifs.map((n) => {
                const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.info;
                return (
                  <div
                    key={n.id}
                    style={{
                      background: cfg.bg,
                      border: `1px solid ${cfg.border}`,
                      borderRadius: 10,
                      padding: "11px 13px",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "flex",
                            gap: 6,
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
                          <span style={{ fontSize: 10, color: "#999" }}>
                            {new Date(n.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            color: "#1a1a1a",
                            marginBottom: 2,
                          }}
                        >
                          {n.title}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "#555",
                            lineHeight: 1.5,
                          }}
                        >
                          {n.message}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteNotif(n.id)}
                        style={styles.deleteBtn}
                        title="Delete"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  loginWrap: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f7f7f8",
    fontFamily: "'Segoe UI', sans-serif",
  },
  loginCard: {
    background: "#fff",
    borderRadius: 18,
    padding: "40px 36px",
    width: 360,
    boxShadow: "0 4px 40px rgba(0,0,0,.08)",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  loginIcon: { fontSize: 36, textAlign: "center" },
  loginTitle: {
    margin: 0,
    fontSize: 22,
    fontWeight: 800,
    textAlign: "center",
    color: "#111",
  },
  loginSub: { margin: 0, fontSize: 13, color: "#888", textAlign: "center" },
  input: {
    width: "100%",
    padding: "10px 13px",
    borderRadius: 9,
    border: "1.5px solid #e0e0e0",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    transition: "border .2s",
    fontFamily: "inherit",
  },
  inputError: { border: "1.5px solid #e05252" },
  errText: { margin: 0, color: "#e05252", fontSize: 12, textAlign: "center" },
  loginBtn: {
    padding: "11px 0",
    background: "#5b8def",
    color: "#fff",
    border: "none",
    borderRadius: 9,
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
  },
  wrap: {
    minHeight: "100vh",
    background: "#f7f7f8",
    padding: "28px 24px",
    fontFamily: "'Segoe UI', sans-serif",
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  headerTitle: { margin: 0, fontSize: 24, fontWeight: 800, color: "#111" },
  headerSub: { margin: "4px 0 0", fontSize: 13, color: "#888" },
  logoutBtn: {
    padding: "8px 16px",
    background: "#f0f0f0",
    border: "none",
    borderRadius: 8,
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    color: "#555",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
  },
  card: {
    background: "#fff",
    borderRadius: 16,
    padding: "24px 22px",
    boxShadow: "0 2px 20px rgba(0,0,0,.05)",
  },
  cardTitle: {
    margin: "0 0 16px",
    fontSize: 16,
    fontWeight: 700,
    color: "#111",
  },
  typeRow: { display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" },
  typeBtn: {
    padding: "6px 13px",
    borderRadius: 7,
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all .15s",
  },
  label: {
    display: "block",
    fontSize: 12,
    fontWeight: 600,
    color: "#666",
    marginBottom: 6,
  },
  textarea: {
    width: "100%",
    padding: "10px 13px",
    borderRadius: 9,
    border: "1.5px solid #e0e0e0",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    resize: "vertical",
    lineHeight: 1.5,
  },
  charCount: {
    fontSize: 11,
    color: "#bbb",
    textAlign: "right",
    marginBottom: 12,
    marginTop: 3,
  },
  sendBtn: {
    width: "100%",
    padding: "12px 0",
    color: "#fff",
    border: "none",
    borderRadius: 9,
    fontWeight: 700,
    fontSize: 15,
    transition: "all .2s",
  },
  clearBtn: {
    padding: "5px 11px",
    background: "#fee",
    color: "#e05252",
    border: "none",
    borderRadius: 7,
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
  },
  deleteBtn: {
    background: "none",
    border: "none",
    fontSize: 18,
    color: "#bbb",
    cursor: "pointer",
    lineHeight: 1,
    padding: "0 0 0 8px",
    flexShrink: 0,
  },
  empty: { textAlign: "center", padding: "40px 0" },
};
