// app/[username]/page.jsx  ← place this file here in your Next.js project
// This handles:  localhost:3000/riteshpatel1884
// ─────────────────────────────────────────────────────────────────────────────
// To connect real DB later: swap getUserByUsername() in fakeProfileDB.js only.
// ─────────────────────────────────────────────────────────────────────────────

"use client";
import { useParams } from "next/navigation";

// ── INLINE FAKE DATABASE ───────────────────────────────────────────────────────
// TODO: Replace with: import { getUserByUsername } from "@/lib/fakeProfileDB";

const FAKE_USERS = {
  riteshpatel1884: {
    username: "riteshpatel1884",
    name: "Ritesh Patel",
    college: "Your College",
    branch: "CSE",
    year: "3rd Year",
    bio: "Aspiring SDE · Grinding LeetCode · Open to opportunities 🚀",
    avatarColor: "#5b8def",
    links: {
      github: "github.com/riteshpatel1884",
      linkedin: "linkedin.com/in/riteshpatel1884",
      leetcode: "leetcode.com/riteshpatel1884",
    },
    targetCompany: "Google",
    readiness: 24,
    solved: 7,
    leaderboardRank: 10,
    topicProgress: [
      { topic: "Arrays", solved: 3, total: 10, color: "#5b8def" },
      { topic: "Trees", solved: 2, total: 8, color: "#9b72cf" },
      { topic: "Dynamic Prog.", solved: 1, total: 12, color: "#4caf7d" },
      { topic: "Graphs", solved: 1, total: 10, color: "#e8924a" },
      { topic: "Strings", solved: 0, total: 6, color: "#d46fa0" },
      { topic: "Greedy", solved: 0, total: 5, color: "#d4b44a" },
    ],
    recentActivity: [
      {
        date: "2026-03-05",
        action: "Solved",
        detail: "Two Sum (Easy)",
        company: "Google",
      },
      {
        date: "2026-03-04",
        action: "Solved",
        detail: "Binary Tree Inorder (Easy)",
        company: "Google",
      },
      {
        date: "2026-03-03",
        action: "Solved",
        detail: "Valid Parentheses (Easy)",
        company: "Google",
      },
      {
        date: "2026-03-02",
        action: "Studied",
        detail: "Arrays topic review",
        company: null,
      },
      {
        date: "2026-03-01",
        action: "Solved",
        detail: "Merge Intervals (Medium)",
        company: "Google",
      },
    ],
    badges: [
      { icon: "🔥", label: "3-Day Streak" },
      { icon: "⚡", label: "First Solve" },
      { icon: "🎯", label: "Goal Setter" },
    ],
    cgpaGoal: 8.5,
    currentCGPA: 7.8,
    semester: "Semester 5",
    attendance: 82,
  },
  aditya_k: {
    username: "aditya_k",
    name: "Aditya Kumar",
    college: "IIT Bombay",
    branch: "CSE",
    year: "4th Year",
    bio: "SDE Intern @ Google · CP Enthusiast · CF Expert",
    avatarColor: "#4caf7d",
    links: {
      github: "github.com/adityakumar",
      linkedin: "linkedin.com/in/adityakumar",
      leetcode: "leetcode.com/adityakumar",
    },
    targetCompany: "Google",
    readiness: 91,
    solved: 134,
    leaderboardRank: 1,
    topicProgress: [
      { topic: "Arrays", solved: 18, total: 20, color: "#5b8def" },
      { topic: "Trees", solved: 15, total: 16, color: "#9b72cf" },
      { topic: "Dynamic Prog.", solved: 14, total: 18, color: "#4caf7d" },
      { topic: "Graphs", solved: 12, total: 14, color: "#e8924a" },
      { topic: "Strings", solved: 10, total: 12, color: "#d46fa0" },
      { topic: "Greedy", solved: 8, total: 10, color: "#d4b44a" },
    ],
    recentActivity: [
      {
        date: "2026-03-05",
        action: "Solved",
        detail: "Hard DP Problem (Hard)",
        company: "Google",
      },
      {
        date: "2026-03-04",
        action: "Solved",
        detail: "Graph BFS/DFS (Medium)",
        company: "Google",
      },
    ],
    badges: [
      { icon: "🥇", label: "Rank #1" },
      { icon: "🔥", label: "30-Day Streak" },
      { icon: "💎", label: "130+ Solved" },
      { icon: "⚡", label: "Speed Solver" },
    ],
    cgpaGoal: 9.5,
    currentCGPA: 9.2,
    semester: "Semester 8",
    attendance: 95,
  },
};

// 🔌 SWAP THIS with real DB call later
function getUserByUsername(username) {
  return FAKE_USERS[username] ?? null;
}

// ── UI helpers ────────────────────────────────────────────────────────────────
function getAvatarColor(name = "") {
  const C = ["#5b8def", "#9b72cf", "#4caf7d", "#e8924a", "#d46fa0", "#d4b44a"];
  return C[name.split("").reduce((s, c) => s + c.charCodeAt(0), 0) % C.length];
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
        background: "#1e1e1e",
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
          transition: "width .6s ease",
        }}
      />
    </div>
  );
}
function Card({ children, style }) {
  return (
    <div
      style={{
        background: "#111",
        border: "1px solid #1f1f1f",
        borderRadius: 14,
        padding: "14px 16px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
function SectionTitle({ children }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: ".12em",
        textTransform: "uppercase",
        color: "#555",
        marginBottom: 10,
      }}
    >
      {children}
    </div>
  );
}
const LINK_META = {
  github: { label: "GitHub", color: "#aaa", icon: "🐙" },
  linkedin: { label: "LinkedIn", color: "#0077b5", icon: "💼" },
  leetcode: { label: "LeetCode", color: "#ffa116", icon: "⚡" },
};

// ── 404 ───────────────────────────────────────────────────────────────────────
function NotFound({ username }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080808",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <div style={{ textAlign: "center", padding: 32 }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🕵️</div>
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
        <div style={{ fontSize: 14, color: "#555" }}>
          No user with username{" "}
          <span style={{ color: "#5b8def", fontFamily: "monospace" }}>
            @{username}
          </span>{" "}
          exists yet.
        </div>
        <div style={{ fontSize: 12, color: "#444", marginTop: 8 }}>
          Ask them to set their username in Settings → Profile.
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function UserProfilePage() {
  const params = useParams();
  const username = params?.username;

  const user = getUserByUsername(username);
  if (!user) return <NotFound username={username} />;

  const accent = user.avatarColor || getAvatarColor(user.name);
  const readinessPct = user.readiness || 0;
  const readinessColor =
    readinessPct >= 70 ? "#4caf7d" : readinessPct >= 40 ? "#e8924a" : "#d46fa0";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#080808",
        color: "#f0f0f0",
        fontFamily: "'Inter', system-ui, sans-serif",
        paddingBottom: 60,
      }}
    >
      {/* Accent strip */}
      <div
        style={{
          height: 4,
          background: `linear-gradient(90deg, ${accent}, #9b72cf)`,
        }}
      />

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 16px" }}>
        {/* ── Hero ── */}
        <div
          style={{
            background: `linear-gradient(135deg, ${accent}1a, #111)`,
            border: `1.5px solid ${accent}33`,
            borderRadius: "0 0 20px 20px",
            padding: "28px 20px 24px",
            marginBottom: 22,
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
            <Avatar name={user.name} color={accent} size={72} />
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
                  fontSize: 12,
                  color: accent,
                  fontWeight: 700,
                  marginTop: 2,
                }}
              >
                @{user.username}
              </div>
              <div style={{ fontSize: 12, color: "#666", marginTop: 3 }}>
                {user.branch} · {user.year} · {user.college}
              </div>
              {user.bio && (
                <div
                  style={{
                    fontSize: 12,
                    color: "#999",
                    marginTop: 6,
                    lineHeight: 1.6,
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
                marginBottom: 16,
              }}
            >
              {user.badges.map((b, i) => (
                <span
                  key={i}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "4px 11px",
                    borderRadius: 20,
                    background: accent + "1a",
                    border: `1px solid ${accent}33`,
                    fontSize: 11,
                    fontWeight: 700,
                    color: accent,
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
                    padding: "6px 13px",
                    borderRadius: 8,
                    background: meta.color + "18",
                    border: `1px solid ${meta.color}33`,
                    color: meta.color,
                    fontSize: 11,
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  {meta.icon} {meta.label}
                </a>
              );
            })}
          </div>
        </div>

        {/* ── Prep Stats ── */}
        <div style={{ marginBottom: 22 }}>
          <SectionTitle>📊 Placement Prep</SectionTitle>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 10,
              marginBottom: 12,
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
                color: user.leaderboardRank <= 3 ? "#d4b44a" : accent,
              },
            ].map((s) => (
              <Card
                key={s.label}
                style={{ textAlign: "center", padding: "14px 8px" }}
              >
                <div
                  style={{
                    fontSize: 26,
                    fontWeight: 900,
                    color: s.color,
                    lineHeight: 1,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: "#555",
                    marginTop: 5,
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
          <Card>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#ddd" }}>
                  🎯 Target: {user.targetCompany}
                </div>
                <div style={{ fontSize: 10, color: "#555", marginTop: 1 }}>
                  Overall Readiness
                </div>
              </div>
              <div
                style={{ fontSize: 20, fontWeight: 900, color: readinessColor }}
              >
                {readinessPct}%
              </div>
            </div>
            <Bar pct={readinessPct} color={readinessColor} height={8} />
          </Card>
        </div>

        {/* ── Topic Breakdown ── */}
        {user.topicProgress?.length > 0 && (
          <div style={{ marginBottom: 22 }}>
            <SectionTitle>📚 Topic Breakdown</SectionTitle>
            <Card>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 13 }}
              >
                {user.topicProgress.map((t, i) => {
                  const pct = Math.round((t.solved / t.total) * 100);
                  return (
                    <div key={i}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 5,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: "#ccc",
                          }}
                        >
                          {t.topic}
                        </span>
                        <span style={{ fontSize: 11, color: "#555" }}>
                          {t.solved}/{t.total}
                          <span
                            style={{
                              marginLeft: 8,
                              color: t.color,
                              fontWeight: 700,
                            }}
                          >
                            {pct}%
                          </span>
                        </span>
                      </div>
                      <Bar pct={pct} color={t.color} height={5} />
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        )}

        {/* ── Recent Activity ── */}
        {user.recentActivity?.length > 0 && (
          <div style={{ marginBottom: 22 }}>
            <SectionTitle>🕐 Recent Activity</SectionTitle>
            <Card style={{ padding: 0, overflow: "hidden" }}>
              {user.recentActivity.map((a, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 16px",
                    borderBottom:
                      i < user.recentActivity.length - 1
                        ? "1px solid #181818"
                        : "none",
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 9,
                      flexShrink: 0,
                      background:
                        a.action === "Solved" ? "#4caf7d18" : "#5b8def18",
                      border: `1px solid ${a.action === "Solved" ? "#4caf7d33" : "#5b8def33"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 15,
                    }}
                  >
                    {a.action === "Solved" ? "✅" : "📖"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#ccc",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {a.detail}
                    </div>
                    <div style={{ fontSize: 10, color: "#555", marginTop: 1 }}>
                      {a.action}
                      {a.company && (
                        <span
                          style={{
                            color: accent,
                            marginLeft: 5,
                            fontWeight: 700,
                          }}
                        >
                          · {a.company}
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    style={{ fontSize: 10, color: "#3a3a3a", flexShrink: 0 }}
                  >
                    {a.date}
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* ── Academic ── */}
        <div style={{ marginBottom: 22 }}>
          <SectionTitle>🎓 Academic</SectionTitle>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            {[
              {
                label: "Current CGPA",
                value: user.currentCGPA,
                sub: `Goal: ${user.cgpaGoal}`,
                color: "#4caf7d",
              },
              {
                label: "Attendance",
                value: user.attendance + "%",
                sub: "This semester",
                color: user.attendance >= 75 ? "#4caf7d" : "#e8924a",
              },
              {
                label: "Semester",
                value: user.semester,
                sub: user.branch,
                color: "#9b72cf",
              },
              {
                label: "Year",
                value: user.year,
                sub: user.college,
                color: "#d46fa0",
              },
            ].map((s) => (
              <Card key={s.label}>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 900,
                    color: s.color,
                    marginBottom: 3,
                  }}
                >
                  {s.value}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#aaa" }}>
                  {s.label}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "#444",
                    marginTop: 2,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {s.sub}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* ── Footer ── */}
        <div
          style={{
            textAlign: "center",
            paddingTop: 10,
            borderTop: "1px solid #181818",
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: "#333",
              fontWeight: 700,
              letterSpacing: ".05em",
            }}
          >
            LeaderLab · Built for BTech students
          </div>
          <div style={{ fontSize: 10, color: "#2a2a2a", marginTop: 3 }}>
            leaderlab.app/{user.username}
          </div>
        </div>
      </div>
    </div>
  );
}
