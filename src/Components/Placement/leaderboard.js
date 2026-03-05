// pip.Leaderboard.jsx — College leaderboard + shareable prep card

"use client";
import { useState } from "react";
import { COMPANIES } from "./constants";
import { load } from "./store.js";
import { Card, SectionLabel, Tag, Bar, CompanyLogo } from "./ui.js";

const PAGE_SIZE = 10;

const BASE_URL =
  typeof window !== "undefined"
    ? window.location.origin
    : "https://leaderlab.in";

// Seed leaderboard data (other students' simulated entries)
const SEED_LEADERBOARD = [
  {
    id: "lb_1",
    name: "Aditya Kumar",
    username: "aditya_k",
    college: "IIT Bombay",
    company: "Google",
    readiness: 91,
    solved: 134,
  },
  {
    id: "lb_2",
    name: "Priya Sharma",
    username: "priya_s",
    college: "NIT Trichy",
    company: "Amazon",
    readiness: 87,
    solved: 118,
  },
  {
    id: "lb_3",
    name: "Rahul Singh",
    username: "rahul_s",
    college: "BITS Pilani",
    company: "Microsoft",
    readiness: 82,
    solved: 103,
  },
  {
    id: "lb_4",
    name: "Sneha Patel",
    username: "sneha_p",
    college: "IIT Delhi",
    company: "Google",
    readiness: 78,
    solved: 97,
  },
  {
    id: "lb_5",
    name: "Arjun Mehta",
    username: "arjun_m",
    college: "VIT Vellore",
    company: "Amazon",
    readiness: 74,
    solved: 89,
  },
  {
    id: "lb_6",
    name: "Kavya Nair",
    username: "kavya_n",
    college: "IIT Madras",
    company: "Uber",
    readiness: 71,
    solved: 84,
  },
  {
    id: "lb_7",
    name: "Vikram Joshi",
    username: "vikram_j",
    college: "IIIT Hyderabad",
    company: "Flipkart",
    readiness: 68,
    solved: 76,
  },
  {
    id: "lb_8",
    name: "Ankita Das",
    username: "ankita_d",
    college: "DTU Delhi",
    company: "Adobe",
    readiness: 64,
    solved: 71,
  },
  {
    id: "lb_9",
    name: "Rohan Verma",
    username: "rohan_v",
    college: "Thapar University",
    company: "Microsoft",
    readiness: 59,
    solved: 63,
  },
  {
    id: "lb_10",
    name: "Mehul Gupta",
    username: "mehul_g",
    college: "IIT Kharagpur",
    company: "Google",
    readiness: 55,
    solved: 58,
  },
  {
    id: "lb_11",
    name: "Tanisha Rao",
    username: "tanisha_r",
    college: "NIT Surathkal",
    company: "Amazon",
    readiness: 51,
    solved: 52,
  },
  {
    id: "lb_12",
    name: "Dev Kapoor",
    username: "dev_k",
    college: "IIIT Delhi",
    company: "Microsoft",
    readiness: 47,
    solved: 46,
  },
  {
    id: "lb_13",
    name: "Pooja Iyer",
    username: "pooja_i",
    college: "VIT Chennai",
    company: "Flipkart",
    readiness: 43,
    solved: 41,
  },
  {
    id: "lb_14",
    name: "Siddharth Rao",
    username: "siddharth_r",
    college: "IIT Roorkee",
    company: "Adobe",
    readiness: 39,
    solved: 37,
  },
  {
    id: "lb_15",
    name: "Isha Malhotra",
    username: "isha_m",
    college: "Manipal Jaipur",
    company: "Uber",
    readiness: 35,
    solved: 31,
  },
];

function computeMyReadiness(setup) {
  if (!setup?.company) return { readiness: 0, solved: 0 };
  try {
    const co = COMPANIES[setup.company];
    if (!co) return { readiness: 0, solved: 0 };
    const solved = load("pip_solved_" + setup.company, {});
    const readiness = Math.min(
      100,
      Math.round(
        Object.entries(co.topics).reduce((s, [t, w]) => {
          const target = Math.max(1, Math.round(w / 3));
          const pct = Math.min(1, (solved[t] || 0) / target);
          return s + pct * w;
        }, 0),
      ),
    );
    const dsaSolved = Object.entries(solved)
      .filter(([k]) => !k.startsWith("__q_"))
      .reduce((s, [, v]) => s + (v || 0), 0);
    return { readiness, solved: dsaSolved };
  } catch {
    return { readiness: 0, solved: 0 };
  }
}

// ── Mini profile URL pill ──────────────────────────────────────────────────────
function ProfileUrlPill({ username, color }) {
  const [copied, setCopied] = useState(false);
  if (!username) return null;
  const url = `${BASE_URL}/u/${username}`;

  function handleCopy(e) {
    e.stopPropagation();
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <button
      onClick={handleCopy}
      title={url}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "2px 8px",
        borderRadius: 6,
        border: `1px solid ${color || "#5b8def"}33`,
        background: `${color || "#5b8def"}12`,
        color: color || "#5b8def",
        fontSize: 10,
        fontWeight: 700,
        fontFamily: "var(--mono)",
        cursor: "pointer",
        transition: "all .15s",
        marginTop: 3,
        letterSpacing: ".01em",
      }}
    >
      🔗 {copied ? "Copied!" : `/${username}`}
    </button>
  );
}

// ── Leaderboard row ────────────────────────────────────────────────────────────
function LeaderRow({ entry, isLast, highlight }) {
  const co = COMPANIES[entry.company];
  const color = co?.color || "#5b8def";

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "44px 1fr 70px 80px",
        padding: "13px 16px",
        borderBottom: isLast ? "none" : "1px solid var(--border)",
        background: highlight ? color + "14" : "transparent",
        alignItems: "center",
        transition: "background .2s",
      }}
    >
      {/* Rank */}
      <div
        style={{
          fontSize: entry.rank <= 3 ? 20 : 14,
          fontWeight: 900,
          color: entry.rank <= 3 ? "#d4b44a" : "var(--txt3)",
        }}
      >
        {entry.rank === 1
          ? "🥇"
          : entry.rank === 2
            ? "🥈"
            : entry.rank === 3
              ? "🥉"
              : `#${entry.rank}`}
      </div>

      {/* Student */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              fontSize: 13,
              fontWeight: highlight ? 900 : 700,
              color: highlight ? color : "var(--txt)",
            }}
          >
            {entry.name}
            {entry.isMe && (
              <span
                style={{
                  marginLeft: 5,
                  fontSize: 10,
                  fontWeight: 800,
                  padding: "1px 6px",
                  borderRadius: 5,
                  background: color + "25",
                  color: color,
                }}
              >
                YOU
              </span>
            )}
          </span>
        </div>
        <div style={{ fontSize: 10, color: "var(--txt3)", marginTop: 1 }}>
          {entry.college}
          {entry.company !== "—" && (
            <span style={{ color, marginLeft: 5, fontWeight: 700 }}>
              · {entry.company}
            </span>
          )}
        </div>
        {/* Profile URL pill */}
        <ProfileUrlPill username={entry.username} color={color} />
      </div>

      {/* Solved */}
      <div style={{ fontSize: 14, fontWeight: 800, color: "#9b72cf" }}>
        {entry.solved}
      </div>

      {/* Readiness */}
      <div>
        <div style={{ fontSize: 14, fontWeight: 800, color, marginBottom: 3 }}>
          {entry.readiness}%
        </div>
        <Bar pct={entry.readiness} color={color} height={3} />
      </div>
    </div>
  );
}

// ── Pinned "You" banner ────────────────────────────────────────────────────────
function PinnedMyRank({ entry, totalRanked }) {
  const co = COMPANIES[entry.company];
  const color = co?.color || "#5b8def";

  return (
    <div
      style={{
        background: `linear-gradient(135deg, ${color}18, var(--bg2))`,
        border: `1.5px solid ${color}44`,
        borderRadius: 14,
        padding: "14px 16px",
        display: "grid",
        gridTemplateColumns: "44px 1fr 70px 80px",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 10,
        backdropFilter: "blur(8px)",
      }}
    >
      {/* Rank */}
      <div
        style={{
          fontSize: 14,
          fontWeight: 900,
          color: entry.rank <= 3 ? "#d4b44a" : color,
        }}
      >
        {entry.rank === 1
          ? "🥇"
          : entry.rank === 2
            ? "🥈"
            : entry.rank === 3
              ? "🥉"
              : `#${entry.rank}`}
      </div>

      {/* Info */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 900, color }}>
            {entry.name}
          </span>
          <span
            style={{
              fontSize: 9,
              fontWeight: 800,
              padding: "1px 6px",
              borderRadius: 5,
              background: color + "25",
              color,
              letterSpacing: ".05em",
            }}
          >
            YOU
          </span>
          <span
            style={{
              fontSize: 9,
              fontWeight: 700,
              color: "var(--txt3)",
              marginLeft: 2,
            }}
          >
            📌 Pinned
          </span>
        </div>
        <div style={{ fontSize: 10, color: "var(--txt3)", marginTop: 1 }}>
          {entry.college}
          {entry.company !== "—" && (
            <span style={{ color, marginLeft: 5, fontWeight: 700 }}>
              · {entry.company}
            </span>
          )}
        </div>
        <ProfileUrlPill username={entry.username} color={color} />
      </div>

      {/* Solved */}
      <div style={{ fontSize: 14, fontWeight: 800, color: "#9b72cf" }}>
        {entry.solved}
      </div>

      {/* Readiness */}
      <div>
        <div style={{ fontSize: 14, fontWeight: 800, color, marginBottom: 3 }}>
          {entry.readiness}%
        </div>
        <Bar pct={entry.readiness} color={color} height={3} />
      </div>
    </div>
  );
}

export default function Leaderboard({ setup }) {
  const profile = (() => {
    try {
      return JSON.parse(localStorage.getItem("gr_profile") || "{}");
    } catch {
      return {};
    }
  })();

  const myStats = computeMyReadiness(setup);
  const myName = profile.name || "You";
  const myUsername = profile.username || "";
  const myCollege = profile.college || "Your College";

  // Build full leaderboard including the user
  const myEntry = setup
    ? {
        id: "me",
        name: myName,
        username: myUsername,
        college: myCollege,
        company: setup.company || "—",
        readiness: myStats.readiness || 0,
        solved: myStats.solved || 0,
        isMe: true,
      }
    : null;

  const allEntries = myEntry
    ? [...SEED_LEADERBOARD, myEntry].sort((a, b) => b.readiness - a.readiness)
    : SEED_LEADERBOARD;

  // Re-rank
  const ranked = allEntries.map((e, i) => ({ ...e, rank: i + 1 }));
  const myRanked = ranked.find((e) => e.isMe);

  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [copied, setCopied] = useState(false);

  const companies = ["All", ...Object.keys(COMPANIES)];

  const filtered =
    filter === "All" ? ranked : ranked.filter((e) => e.company === filter);

  // Pagination
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageEntries = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset page on filter change
  function handleFilterChange(val) {
    setFilter(val);
    setPage(1);
  }

  function copyCard() {
    if (!myEntry) return;
    const urlPart = myUsername ? `\n🔗 ${BASE_URL}/u/${myUsername}` : "";
    const text = `🎯 ${myName}'s ${setup.company} Prep\n\nReadiness: ${myStats.readiness}%\nSolved: ${myStats.solved} questions\nLeaderboard Rank: #${myRanked?.rank || "—"}${urlPart}\n\n#PlacementPrep #${setup.company} #SDE`;
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* ── My shareable prep card ── */}
      {myEntry && myStats.readiness > 0 && (
        <div
          style={{
            background: `linear-gradient(135deg, ${COMPANIES[setup.company]?.color || "#5b8def"}22, var(--bg2))`,
            border: `2px solid ${COMPANIES[setup.company]?.color || "#5b8def"}55`,
            borderRadius: 16,
            padding: "18px 20px",
          }}
        >
          
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: COMPANIES[setup.company]?.color || "#5b8def",
                color: "#fff",
                fontSize: 18,
                fontWeight: 900,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {myName
                .split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("")
                .toUpperCase() || "?"}
            </div>
            <div>
              <div
                style={{ fontSize: 16, fontWeight: 900, color: "var(--txt)" }}
              >
                {myName}
              </div>
              <div style={{ fontSize: 12, color: "var(--txt3)" }}>
                {myCollege} · {setup.company} Prep
              </div>
              {/* Profile URL in prep card */}
              {myUsername && (
                <div
                  style={{
                    fontSize: 11,
                    color: COMPANIES[setup.company]?.color || "#5b8def",
                    fontFamily: "var(--mono)",
                    marginTop: 2,
                  }}
                >
                  🔗 {BASE_URL}/u/{myUsername}
                </div>
              )}
            </div>
          </div>
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
                value: myStats.readiness + "%",
                color: COMPANIES[setup.company]?.color || "#5b8def",
              },
              { label: "Solved", value: myStats.solved, color: "#9b72cf" },
              {
                label: "Rank",
                value: "#" + (myRanked?.rank || "—"),
                color: myRanked?.rank <= 3 ? "#d4b44a" : "#4caf7d",
              },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  background: "var(--bg3)",
                  borderRadius: 10,
                  padding: "10px 8px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: "var(--txt3)",
                    marginTop: 2,
                    fontWeight: 700,
                    textTransform: "uppercase",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={copyCard}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: 10,
              border: "none",
              background: COMPANIES[setup.company]?.color || "#5b8def",
              color: "#fff",
              fontSize: 13,
              fontWeight: 800,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "opacity .15s",
            }}
          >
            {copied ? "✓ Copied to clipboard!" : "📤 Share Prep Card"}
          </button>
        </div>
      )}

      {/* ── Pinned "You" row (always visible at top of leaderboard) ── */}
      {myRanked && (
        <div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: "var(--txt3)",
              textTransform: "uppercase",
              letterSpacing: ".1em",
              marginBottom: 6,
            }}
          >
            📌 Your Position
          </div>
          <PinnedMyRank entry={myRanked} totalRanked={ranked.length} />
        </div>
      )}

      {/* ── Leaderboard header + filter ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <SectionLabel style={{ marginBottom: 0 }}>🏆 Leaderboard</SectionLabel>
        <select
          value={filter}
          onChange={(e) => handleFilterChange(e.target.value)}
          style={{
            background: "var(--bg3)",
            border: "1.5px solid var(--border)",
            borderRadius: 8,
            padding: "5px 10px",
            fontSize: 11,
            fontWeight: 700,
            color: "var(--txt2)",
            outline: "none",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          {companies.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        {/* Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "44px 1fr 70px 80px",
            padding: "10px 16px",
            background: "var(--bg3)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          {["Rank", "Student", "Solved", "Ready"].map((h) => (
            <div
              key={h}
              style={{
                fontSize: 10,
                fontWeight: 800,
                color: "var(--txt3)",
                textTransform: "uppercase",
                letterSpacing: ".07em",
              }}
            >
              {h}
            </div>
          ))}
        </div>

        {/* Rows — current page only */}
        {pageEntries.map((entry, i) => (
          <LeaderRow
            key={entry.id}
            entry={entry}
            isLast={i === pageEntries.length - 1}
            highlight={entry.isMe}
          />
        ))}

        {/* Empty state */}
        {pageEntries.length === 0 && (
          <div
            style={{
              padding: "32px 16px",
              textAlign: "center",
              color: "var(--txt3)",
              fontSize: 13,
            }}
          >
            No entries for this filter.
          </div>
        )}
      </Card>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--bg2)",
              color: page === 1 ? "var(--txt3)" : "var(--txt)",
              fontSize: 12,
              fontWeight: 700,
              cursor: page === 1 ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              opacity: page === 1 ? 0.4 : 1,
            }}
          >
            ← Prev
          </button>

          {/* Page number pills */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border:
                  page === p
                    ? "1.5px solid var(--txt)"
                    : "1px solid var(--border)",
                background: page === p ? "var(--txt)" : "var(--bg2)",
                color: page === p ? "var(--bg)" : "var(--txt2)",
                fontSize: 12,
                fontWeight: 800,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all .15s",
              }}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--bg2)",
              color: page === totalPages ? "var(--txt3)" : "var(--txt)",
              fontSize: 12,
              fontWeight: 700,
              cursor: page === totalPages ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              opacity: page === totalPages ? 0.4 : 1,
            }}
          >
            Next →
          </button>
        </div>
      )}

      {/* Page info */}
      <div style={{ fontSize: 11, color: "var(--txt3)", textAlign: "center" }}>
        Showing {(page - 1) * PAGE_SIZE + 1}–
        {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}{" "}
        students
        {totalPages > 1 && ` · Page ${page} of ${totalPages}`} · Rankings update
        as you solve more questions. Start solving to climb! 🚀
      </div>
    </div>
  );
}
