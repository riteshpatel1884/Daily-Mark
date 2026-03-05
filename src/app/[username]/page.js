// app/u/[username]/page.jsx  (Next.js App Router)
// Place this file at:  src/app/u/[username]/page.jsx
// ─────────────────────────────────────────────────────────────────────────────
// To connect real DB later: swap `getUserByUsername` in fakeProfileDB.js only.
// This file never needs to change.
// ─────────────────────────────────────────────────────────────────────────────

"use client";
import { useParams } from "next/navigation";
import { getUserByUsername } from "@/Components/Placement/Fakeprofiledb";
// TODO: change the import above to your real DB helper when ready

// ── Helpers ───────────────────────────────────────────────────────────────────
function getAvatarColor(name = "") {
  const COLORS = [
    "#5b8def",
    "#9b72cf",
    "#4caf7d",
    "#e8924a",
    "#d46fa0",
    "#d4b44a",
  ];
  return COLORS[
    name.split("").reduce((s, c) => s + c.charCodeAt(0), 0) % COLORS.length
  ];
}

function Avatar({ name = "?", color, size = 72 }) {
  const initials =
    name
      .trim()
      .split(" ")
      .map((w) => w[0]?.toUpperCase() || "")
      .slice(0, 2)
      .join("") || "?";
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: color || getAvatarColor(name),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.35,
        fontWeight: 900,
        color: "#fff",
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}

function Bar({ pct = 0, color = "#5b8def", height = 6 }) {
  return (
    <div
      style={{
        height,
        borderRadius: height,
        background: "var(--bg4,#222)",
        overflow: "hidden",
        width: "100%",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${Math.min(100, pct)}%`,
          background: color,
          borderRadius: height,
          transition: "width .5s ease",
        }}
      />
    </div>
  );
}

const LINK_META = {
  github: { label: "GitHub", color: "#aaa", icon: "🐙" },
  linkedin: { label: "LinkedIn", color: "#0077b5", icon: "💼" },
  leetcode: { label: "LeetCode", color: "#ffa116", icon: "⚡" },
};

function Section({ title, children, style }) {
  return (
    <div style={{ marginBottom: 22, ...style }}>
      <div
        style={{
          fontSize: 10,
          fontWeight: 800,
          letterSpacing: ".1em",
          textTransform: "uppercase",
          color: "#666",
          marginBottom: 10,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

function Card({ children, style }) {
  return (
    <div
      style={{
        background: "#111",
        border: "1px solid #222",
        borderRadius: 14,
        padding: "14px 16px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── 404 / Not Found state ─────────────────────────────────────────────────────
function NotFound({ username }) {
  return (
    <div style={PAGE_STYLE}>
      <div style={{ textAlign: "center", padding: "80px 24px" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🕵️</div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#fff",
            marginBottom: 8,
          }}
        >
          Profile not found
        </div>
        <div style={{ fontSize: 14, color: "#666" }}>
          No user with username{" "}
          <code style={{ color: "#5b8def" }}>@{username}</code> exists yet.
        </div>
        <div style={{ marginTop: 12, fontSize: 12, color: "#555" }}>
          Ask them to set their username in Settings → Profile.
        </div>
      </div>
    </div>
  );
}

// ── Page styles ───────────────────────────────────────────────────────────────
const PAGE_STYLE = {
  minHeight: "100vh",
  background: "#080808",
  color: "#f0f0f0",
  fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif",
  padding: "0 0 60px",
};

// ── Main Profile Page ─────────────────────────────────────────────────────────
export default function UserProfilePage() {
  const params = useParams();
  const username = params?.username;

  // 🔌 DATA FETCH — swap `getUserByUsername` with real API/DB call here
  const user = getUserByUsername(username);

  if (!user) return <NotFound username={username} />;

  const accentColor = user.avatarColor || getAvatarColor(user.name);
  const readinessPct = user.readiness || 0;
  const readinessColor =
    readinessPct >= 70 ? "#4caf7d" : readinessPct >= 40 ? "#e8924a" : "#d46fa0";

  return (
    <div style={PAGE_STYLE}>
      {/* ── Top accent bar ── */}

      <div style={{ maxWidth: 640, margin: " auto", padding: "10px}>
        {/* ── Hero card ── */}
        <div
          style={{
            background: `linear-gradient(135deg, ${accentColor}22, #111)`,
            border: `1.5px solid ${accentColor}44`,
            borderRadius: "0 0 20px 20px",
            padding: "28px 20px 24px",
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 16,
            }}
          >
            <Avatar name={user.name} color={accentColor} size={72} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 900,
                  color: "#fff",
                  letterSpacing: "-.02em",
                }}
              >
                {user.name}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: accentColor,
                  fontWeight: 700,
                  marginTop: 1,
                }}
              >
                @{user.username}
              </div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 3 }}>
                {user.branch} · {user.year} · {user.college}
              </div>
              {user.bio && (
                <div
                  style={{
                    fontSize: 12,
                    color: "#aaa",
                    marginTop: 5,
                    lineHeight: 1.5,
                  }}
                >
                  {user.bio}
                </div>
              )}
            </div>
          </div>

          {/* Badges */}
          {user.badges?.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                marginBottom: 14,
              }}
            >
              {user.badges.map((b, i) => (
                <span
                  key={i}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    padding: "4px 10px",
                    borderRadius: 20,
                    background: accentColor + "20",
                    border: `1px solid ${accentColor}40`,
                    fontSize: 11,
                    fontWeight: 700,
                    color: accentColor,
                  }}
                >
                  {b.icon} {b.label}
                </span>
              ))}
            </div>
          )}

          {/* Social links */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {Object.entries(user.links || {}).map(([key, val]) => {
              if (!val) return null;
              const meta = LINK_META[key] || {
                label: key,
                color: "#888",
                icon: "🔗",
              };
              const href = val.startsWith("http") ? val : "https://" + val;
              return (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "6px 12px",
                    borderRadius: 8,
                    background: meta.color + "18",
                    border: `1px solid ${meta.color}44`,
                    color: meta.color,
                    fontSize: 11,
                    fontWeight: 700,
                    textDecoration: "none",
                    transition: "opacity .15s",
                  }}
                >
                  {meta.icon} {meta.label}
                </a>
              );
            })}
          </div>
        </div>

        {/* ── Stats row ── */}
        <Section title="📊 Placement Prep Stats">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 10,
              marginBottom: 14,
            }}
          >
            {[
              {
                label: "Readiness",
                value: readinessPct + "%",
                color: readinessColor,
              },
              { label: "Solved", value: user.solved, color: "#9b72cf" },
              {
                label: "Rank",
                value: "#" + user.leaderboardRank,
                color: user.leaderboardRank <= 3 ? "#d4b44a" : accentColor,
              },
            ].map((s) => (
              <Card
                key={s.label}
                style={{ textAlign: "center", padding: "12px 8px" }}
              >
                <div style={{ fontSize: 24, fontWeight: 900, color: s.color }}>
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: "#666",
                    marginTop: 3,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: ".07em",
                  }}
                >
                  {s.label}
                </div>
              </Card>
            ))}
          </div>

          {/* Target company + readiness bar */}
          <Card>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>
                  🎯 Target: {user.targetCompany}
                </div>
                <div style={{ fontSize: 10, color: "#666", marginTop: 1 }}>
                  Placement Readiness
                </div>
              </div>
              <div
                style={{ fontSize: 18, fontWeight: 900, color: readinessColor }}
              >
                {readinessPct}%
              </div>
            </div>
            <Bar pct={readinessPct} color={readinessColor} height={8} />
          </Card>
        </Section>

        {/* ── Footer ── */}
        <div style={{ textAlign: "center", paddingTop: 12 }}>
          <div
            style={{
              fontSize: 12,
              color: "#444",
              fontWeight: 700,
              letterSpacing: ".05em",
            }}
          >
            LeaderLab · Built for BTech students
          </div>
          <div style={{ fontSize: 10, color: "#333", marginTop: 3 }}>
            Share your profile · leaderlab.app/u/{user.username}
          </div>
        </div>
      </div>
    </div>
  );
}
