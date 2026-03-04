"use client";
import { useState, useEffect, useRef } from "react";

// ── Constants ──────────────────────────────────────────────────────────────────
const COMPANIES = {
  Amazon: {
    pkg: "₹26 LPA",
    rate: "4%",
    branches: ["CSE", "IT"],
    rounds: [
      "OA (90 min)",
      "DSA Round 1",
      "DSA Round 2",
      "System Design",
      "Bar Raiser",
    ],
    topics: {
      Arrays: 28,
      Graphs: 22,
      "Dynamic Programming": 19,
      Trees: 15,
      "Sliding Window": 10,
      Strings: 6,
    },
    hotQs: [
      "Two Sum",
      "LRU Cache",
      "Number of Islands",
      "Merge Intervals",
      "Longest Substring Without Repeating",
      "Word Ladder",
      "Trapping Rain Water",
      "Median of Data Stream",
    ],
    color: "#FF9900",
    logo: "A",
  },
  Google: {
    pkg: "₹40 LPA",
    rate: "2%",
    branches: ["CSE", "IT", "ECE"],
    rounds: [
      "Phone Screen",
      "Coding Round 1",
      "Coding Round 2",
      "System Design",
      "Googleyness",
    ],
    topics: {
      "Dynamic Programming": 30,
      Graphs: 25,
      Trees: 20,
      Arrays: 15,
      "Math/Number Theory": 10,
    },
    hotQs: [
      "Longest Increasing Subsequence",
      "Word Break",
      "Alien Dictionary",
      "Course Schedule",
      "Serialize/Deserialize Tree",
      "Minimum Window Substring",
      "Jump Game II",
    ],
    color: "#4285F4",
    logo: "G",
  },
  Microsoft: {
    pkg: "₹22 LPA",
    rate: "5%",
    branches: ["CSE", "IT"],
    rounds: [
      "OA",
      "Technical Round 1",
      "Technical Round 2",
      "Design Round",
      "HR",
    ],
    topics: {
      Trees: 30,
      "Linked Lists": 20,
      Arrays: 18,
      Strings: 16,
      "Dynamic Programming": 10,
      Graphs: 6,
    },
    hotQs: [
      "Reverse Linked List",
      "Level Order Traversal",
      "Clone Graph",
      "Validate BST",
      "Spiral Matrix",
      "Decode Ways",
      "Max Subarray",
    ],
    color: "#00A4EF",
    logo: "M",
  },
  Flipkart: {
    pkg: "₹18 LPA",
    rate: "6%",
    branches: ["CSE", "IT", "ECE", "EEE"],
    rounds: ["Machine Coding", "DSA Round", "System Design", "Hiring Manager"],
    topics: {
      Arrays: 30,
      "Linked Lists": 22,
      Trees: 18,
      Greedy: 15,
      Strings: 10,
      Heaps: 5,
    },
    hotQs: [
      "Smallest Positive Missing",
      "Flatten Linked List",
      "Connect Nodes at Same Level",
      "Min Platforms",
      "Largest Rectangle Histogram",
    ],
    color: "#F7E600",
    logo: "F",
  },
  Uber: {
    pkg: "₹32 LPA",
    rate: "3%",
    branches: ["CSE", "IT"],
    rounds: ["HackerRank OA", "Technical Phone", "Onsite x4"],
    topics: {
      Graphs: 32,
      "Dynamic Programming": 22,
      "Sliding Window": 18,
      Arrays: 14,
      "Bit Manipulation": 8,
      Design: 6,
    },
    hotQs: [
      "Surge Pricing Simulation",
      "Dijkstra Shortest Path",
      "Rate Limiter Design",
      "Longest Consecutive Sequence",
      "K Closest Points",
    ],
    color: "#000000",
    logo: "U",
  },
  Adobe: {
    pkg: "₹20 LPA",
    rate: "7%",
    branches: ["CSE", "IT", "ECE"],
    rounds: ["OA", "DSA Round", "CS Fundamentals", "HR"],
    topics: {
      Arrays: 32,
      Strings: 25,
      Trees: 18,
      Recursion: 12,
      "Dynamic Programming": 8,
      Heaps: 5,
    },
    hotQs: [
      "Stock Buy Sell",
      "Anagram Check",
      "Longest Common Prefix",
      "Power Function",
      "Rotate Image",
      "Next Permutation",
    ],
    color: "#FF0000",
    logo: "Ad",
  },
};

const DSA_TOPICS = [
  "Arrays",
  "Strings",
  "Linked Lists",
  "Trees",
  "Graphs",
  "Dynamic Programming",
  "Recursion",
  "Greedy",
  "Heaps",
  "Sliding Window",
  "Bit Manipulation",
  "Math/Number Theory",
  "Sorting",
  "Hashing",
];

const MOCK_EXPERIENCES = [
  {
    id: 1,
    company: "Amazon",
    role: "SDE-1",
    college: "NIT Trichy",
    rounds: 4,
    selected: true,
    date: "2025-02-10",
    story:
      "Round 1 had two pointer + sliding window. Round 2 was pure DP (0/1 knapsack variant). System design was URL shortener. Final bar raiser focused on leadership principles.",
    difficulty: "Hard",
  },
  {
    id: 2,
    company: "Google",
    role: "SDE-1",
    college: "IIT Bombay",
    rounds: 5,
    selected: true,
    date: "2025-01-25",
    story:
      "All rounds were DSA heavy. Got graph traversal in first two rounds. System Design was Google Docs. Googleyness round asked about conflict resolution.",
    difficulty: "Very Hard",
  },
  {
    id: 3,
    company: "Microsoft",
    role: "SDE-1",
    college: "VIT Vellore",
    rounds: 4,
    selected: false,
    date: "2025-02-18",
    story:
      "Focused heavily on trees — BST questions in both technical rounds. Got rejected in design round for not knowing distributed systems basics.",
    difficulty: "Medium",
  },
  {
    id: 4,
    company: "Flipkart",
    role: "SDE-1",
    college: "BITS Pilani",
    rounds: 3,
    selected: true,
    date: "2025-02-05",
    story:
      "Machine coding round had 90 mins to build a parking lot system. DSA was greedy + arrays. System design was cab booking.",
    difficulty: "Medium",
  },
  {
    id: 5,
    company: "Uber",
    role: "SDE-2",
    college: "IIT Delhi",
    rounds: 5,
    selected: true,
    date: "2025-01-15",
    story:
      "Heavy graphs focus — got Dijkstra and modified BFS. Rate limiter design in system design round. Great culture fit round at end.",
    difficulty: "Hard",
  },
];

const STORAGE_KEY = "pip_data";

function load(key, def) {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "null") ?? def;
  } catch {
    return def;
  }
}
function save(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {}
}

// ── Utility ────────────────────────────────────────────────────────────────────
function days(d) {
  return Math.max(0, Math.ceil((new Date(d) - Date.now()) / 86400000));
}

function Bar({ pct, color, height = 8 }) {
  return (
    <div
      style={{
        background: "var(--bg4,#222)",
        borderRadius: 99,
        overflow: "hidden",
        height,
      }}
    >
      <div
        style={{
          width: `${pct}%`,
          height: "100%",
          background: color,
          borderRadius: 99,
          transition: "width .6s cubic-bezier(.4,0,.2,1)",
        }}
      />
    </div>
  );
}

function Tag({ children, color }) {
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: ".07em",
        padding: "3px 9px",
        borderRadius: 99,
        background: color + "20",
        color,
        border: `1px solid ${color}44`,
        display: "inline-flex",
        alignItems: "center",
      }}
    >
      {children}
    </span>
  );
}

function Card({ children, style = {} }) {
  return (
    <div
      style={{
        background: "var(--bg2,#111)",
        border: "1px solid var(--border,#333)",
        borderRadius: 16,
        padding: 18,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: ".1em",
        textTransform: "uppercase",
        color: "var(--txt3,#666)",
        marginBottom: 10,
      }}
    >
      {children}
    </div>
  );
}

// ── SECTION: Setup / Entry ─────────────────────────────────────────────────────
function SetupView({ onSubmit }) {
  const [company, setCompany] = useState("Amazon");
  const [role, setRole] = useState("SDE-1");
  const [date, setDate] = useState("");

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minStr = minDate.toISOString().slice(0, 10);

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 0" }}>
      <div style={{ marginBottom: 28, textAlign: "center" }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: ".12em",
            textTransform: "uppercase",
            color: "var(--txt3)",
            marginBottom: 8,
          }}
        >
          Placement Intelligence
        </div>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 900,
            color: "var(--txt)",
            margin: 0,
            letterSpacing: "-.03em",
            lineHeight: 1.1,
          }}
        >
          Beat your interview.
          <br />
          <span style={{ color: "#5b8def" }}>Data-first.</span>
        </h1>
        <p style={{ color: "var(--txt3)", fontSize: 13, marginTop: 10 }}>
          Enter your target — get a smart prep plan in seconds.
        </p>
      </div>

      <Card>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <SectionLabel>Target Company</SectionLabel>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 8,
              }}
            >
              {Object.keys(COMPANIES).map((c) => {
                const co = COMPANIES[c];
                const sel = company === c;
                return (
                  <button
                    key={c}
                    onClick={() => setCompany(c)}
                    style={{
                      padding: "10px 8px",
                      borderRadius: 12,
                      border: `2px solid ${sel ? co.color : "var(--border)"}`,
                      background: sel ? co.color + "18" : "var(--bg3)",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 4,
                      transition: "all .15s",
                    }}
                  >
                    <span
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: co.color,
                        color: "#fff",
                        fontSize: 11,
                        fontWeight: 900,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {co.logo}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: sel ? co.color : "var(--txt2)",
                      }}
                    >
                      {c}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <SectionLabel>Role</SectionLabel>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                "SDE-1",
                "SDE-2",
                "Data Analyst",
                "ML Engineer",
                "Product Manager",
              ].map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  style={{
                    padding: "7px 14px",
                    borderRadius: 99,
                    border: `1.5px solid ${role === r ? "#5b8def" : "var(--border)"}`,
                    background: role === r ? "#5b8def18" : "var(--bg3)",
                    color: role === r ? "#5b8def" : "var(--txt2)",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all .15s",
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <SectionLabel>Interview Date</SectionLabel>
            <input
              type="date"
              min={minStr}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{
                width: "100%",
                background: "var(--bg3)",
                border: "1.5px solid var(--border)",
                borderRadius: 10,
                padding: "10px 14px",
                color: "var(--txt)",
                fontSize: 14,
                outline: "none",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            disabled={!date}
            onClick={() => onSubmit({ company, role, date })}
            style={{
              padding: "14px",
              borderRadius: 12,
              border: "none",
              background: date ? COMPANIES[company].color : "var(--bg4)",
              color: date ? "#fff" : "var(--txt3)",
              fontSize: 14,
              fontWeight: 800,
              cursor: date ? "pointer" : "not-allowed",
              fontFamily: "inherit",
              transition: "all .2s",
            }}
          >
            Generate My Prep Plan →
          </button>
        </div>
      </Card>
    </div>
  );
}

// ── SECTION: Dashboard ─────────────────────────────────────────────────────────
function Dashboard({ setup, onReset }) {
  const co = COMPANIES[setup.company];
  const daysLeft = days(setup.date);
  const questionsPerDay = Math.max(
    2,
    Math.min(
      8,
      Math.round(Math.max(30, daysLeft * 3.5) / Math.max(daysLeft, 1)),
    ),
  );
  const totalTarget = questionsPerDay * daysLeft;

  const [solved, setSolved] = useState(() =>
    load("pip_solved_" + setup.company, {}),
  );
  const [activeTab, setActiveTab] = useState("plan");

  useEffect(() => {
    save("pip_solved_" + setup.company, solved);
  }, [solved]);

  const totalSolved = Object.values(solved).reduce((a, b) => a + b, 0);
  const readiness = Math.min(
    100,
    Math.round(
      Object.entries(co.topics).reduce((s, [t, w]) => {
        const pct = Math.min(
          1,
          (solved[t] || 0) / Math.max(1, Math.round(w / 3)),
        );
        return s + pct * w;
      }, 0),
    ),
  );

  const urgency =
    daysLeft <= 7 ? "#e05252" : daysLeft <= 14 ? "#e8924a" : "#4caf7d";

  const tabs = [
    { id: "plan", label: "Plan" },
    { id: "questions", label: "Questions" },
    { id: "rounds", label: "Rounds" },
    { id: "analytics", label: "Analytics" },
  ];

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: co.color,
              color: "#fff",
              fontSize: 16,
              fontWeight: 900,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {co.logo}
          </div>
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: 18,
                fontWeight: 900,
                color: "var(--txt)",
                letterSpacing: "-.02em",
              }}
            >
              {setup.company}
            </h2>
            <div style={{ fontSize: 12, color: "var(--txt3)" }}>
              {setup.role} · {daysLeft} days left
            </div>
          </div>
        </div>
        <button
          onClick={onReset}
          style={{
            background: "var(--bg3)",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "6px 12px",
            fontSize: 11,
            fontWeight: 700,
            color: "var(--txt3)",
            cursor: "pointer",
          }}
        >
          Change
        </button>
      </div>

      {/* Stats Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 10,
          marginBottom: 16,
        }}
      >
        {[
          { label: "Days Left", value: daysLeft, color: urgency },
          { label: "Readiness", value: readiness + "%", color: co.color },
          { label: "Solved", value: totalSolved, color: "#9b72cf" },
        ].map((s) => (
          <Card
            key={s.label}
            style={{ padding: "14px 12px", textAlign: "center" }}
          >
            <div
              style={{
                fontSize: 26,
                fontWeight: 900,
                color: s.color,
                letterSpacing: "-.02em",
                lineHeight: 1,
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontSize: 10,
                color: "var(--txt3)",
                marginTop: 4,
                fontWeight: 700,
                letterSpacing: ".06em",
                textTransform: "uppercase",
              }}
            >
              {s.label}
            </div>
          </Card>
        ))}
      </div>

      {/* Readiness bar */}
      <Card style={{ marginBottom: 16, padding: "14px 16px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--txt)" }}>
            {setup.company} Readiness Score
          </span>
          <span style={{ fontSize: 20, fontWeight: 900, color: co.color }}>
            {readiness}
          </span>
        </div>
        <Bar pct={readiness} color={co.color} height={10} />
        <div
          style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}
        >
          {Object.entries(co.topics).map(([t, w]) => {
            const done = solved[t] || 0;
            const target = Math.round(w / 3);
            const pct = Math.min(100, Math.round((done / target) * 100));
            const isWeak = pct < 40;
            return (
              <Tag
                key={t}
                color={isWeak ? "#e05252" : pct > 70 ? "#4caf7d" : "#d4b44a"}
              >
                {isWeak ? "⚠ " : pct > 70 ? "✓ " : ""}
                {t}
              </Tag>
            );
          })}
        </div>
      </Card>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 6,
          marginBottom: 16,
          background: "var(--bg3)",
          borderRadius: 12,
          padding: 4,
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            style={{
              flex: 1,
              padding: "8px 4px",
              borderRadius: 9,
              border: "none",
              background: activeTab === t.id ? "var(--bg)" : "transparent",
              color: activeTab === t.id ? "var(--txt)" : "var(--txt3)",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all .15s",
              boxShadow:
                activeTab === t.id ? "0 1px 4px rgba(0,0,0,.15)" : "none",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "plan" && (
        <PlanTab
          co={co}
          daysLeft={daysLeft}
          questionsPerDay={questionsPerDay}
          totalTarget={totalTarget}
          solved={solved}
          setSolved={setSolved}
        />
      )}
      {activeTab === "questions" && (
        <QuestionsTab co={co} solved={solved} setSolved={setSolved} />
      )}
      {activeTab === "rounds" && <RoundsTab co={co} company={setup.company} />}
      {activeTab === "analytics" && (
        <AnalyticsTab
          co={co}
          solved={solved}
          daysLeft={daysLeft}
          totalTarget={totalTarget}
        />
      )}
    </div>
  );
}

function PlanTab({
  co,
  daysLeft,
  questionsPerDay,
  totalTarget,
  solved,
  setSolved,
}) {
  const topicOrder = Object.entries(co.topics).sort(([, a], [, b]) => b - a);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Daily Plan */}
      <Card>
        <SectionLabel>Smart Daily Plan</SectionLabel>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginBottom: 14,
          }}
        >
          {[
            { label: "Questions/Day", value: questionsPerDay, icon: "📋" },
            { label: "Total Target", value: totalTarget, icon: "🎯" },
            {
              label: "Mock Interviews",
              value: Math.max(1, Math.floor(daysLeft / 10)),
              icon: "🎙️",
            },
            {
              label: "Revision Days",
              value: Math.floor(daysLeft / 7),
              icon: "🔄",
            },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: "var(--bg3)",
                borderRadius: 12,
                padding: "12px 14px",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ fontSize: 20 }}>{s.icon}</span>
              <div>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 900,
                    color: "var(--txt)",
                    letterSpacing: "-.02em",
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "var(--txt3)",
                    fontWeight: 700,
                  }}
                >
                  {s.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Phase roadmap */}
        <SectionLabel>Phase Breakdown</SectionLabel>
        {(() => {
          const phases =
            daysLeft <= 14
              ? [
                  {
                    label: "Intense DSA Sprint",
                    days: Math.floor(daysLeft * 0.5),
                    color: "#e05252",
                  },
                  {
                    label: "Mock Interviews",
                    days: Math.floor(daysLeft * 0.3),
                    color: "#5b8def",
                  },
                  {
                    label: "Revision",
                    days: Math.ceil(daysLeft * 0.2),
                    color: "#4caf7d",
                  },
                ]
              : [
                  {
                    label: "Foundation & Core DSA",
                    days: Math.floor(daysLeft * 0.4),
                    color: "#5b8def",
                  },
                  {
                    label: "Topic Mastery",
                    days: Math.floor(daysLeft * 0.35),
                    color: "#9b72cf",
                  },
                  {
                    label: "Mocks & Revision",
                    days: Math.ceil(daysLeft * 0.25),
                    color: "#4caf7d",
                  },
                ];
          return phases.map((p, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: p.color,
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "var(--txt)",
                    marginBottom: 3,
                  }}
                >
                  {p.label}
                </div>
                <Bar
                  pct={Math.round((p.days / daysLeft) * 100)}
                  color={p.color}
                  height={5}
                />
              </div>
              <Tag color={p.color}>{p.days}d</Tag>
            </div>
          ));
        })()}
      </Card>

      {/* Topic Tracker */}
      <Card>
        <SectionLabel>Topic Progress Tracker</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {topicOrder.map(([topic, weight]) => {
            const target = Math.round(weight / 3);
            const done = solved[topic] || 0;
            const pct = Math.min(100, Math.round((done / target) * 100));
            const color =
              pct < 40 ? "#e05252" : pct > 70 ? "#4caf7d" : "#d4b44a";
            return (
              <div key={topic}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 5,
                  }}
                >
                  <div>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "var(--txt)",
                      }}
                    >
                      {topic}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        color: "var(--txt3)",
                        marginLeft: 6,
                      }}
                    >
                      {weight}% of questions
                    </span>
                  </div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color,
                        fontFamily: "monospace",
                      }}
                    >
                      {done}/{target}
                    </span>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button
                        onClick={() =>
                          setSolved((p) => ({
                            ...p,
                            [topic]: Math.max(0, (p[topic] || 0) - 1),
                          }))
                        }
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 6,
                          border: "1px solid var(--border)",
                          background: "var(--bg3)",
                          color: "var(--txt2)",
                          cursor: "pointer",
                          fontSize: 14,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        −
                      </button>
                      <button
                        onClick={() =>
                          setSolved((p) => ({
                            ...p,
                            [topic]: Math.min(target, (p[topic] || 0) + 1),
                          }))
                        }
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 6,
                          border: "none",
                          background: color,
                          color: "#fff",
                          cursor: "pointer",
                          fontSize: 14,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <Bar pct={pct} color={color} height={6} />
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function QuestionsTab({ co, solved, setSolved }) {
  const [filter, setFilter] = useState("All");
  const filters = ["All", ...Object.keys(co.topics)];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Frequency viz */}
      <Card>
        <SectionLabel>Topic Frequency in Interviews</SectionLabel>
        {Object.entries(co.topics)
          .sort(([, a], [, b]) => b - a)
          .map(([t, w]) => (
            <div key={t} style={{ marginBottom: 10 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 4,
                }}
              >
                <span
                  style={{ fontSize: 12, fontWeight: 700, color: "var(--txt)" }}
                >
                  {t}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: "var(--txt3)",
                    fontFamily: "monospace",
                  }}
                >
                  {w}%
                </span>
              </div>
              <Bar pct={w} color={co.color} height={7} />
            </div>
          ))}
      </Card>

      {/* Hot Questions */}
      <Card>
        <SectionLabel>High Frequency Questions 🔥</SectionLabel>
        <p
          style={{
            fontSize: 12,
            color: "var(--txt3)",
            marginTop: 0,
            marginBottom: 14,
          }}
        >
          Most asked questions in recent{" "}
          {Object.keys(COMPANIES).find((k) => COMPANIES[k] === co)} interviews
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {co.hotQs.map((q, i) => {
            const done = (solved["__q_" + i] || 0) > 0;
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 12px",
                  background: done ? "#4caf7d12" : "var(--bg3)",
                  border: `1px solid ${done ? "#4caf7d44" : "var(--border)"}`,
                  borderRadius: 10,
                  transition: "all .15s",
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    background: done ? "#4caf7d" : "var(--bg4)",
                    color: done ? "#fff" : "var(--txt3)",
                    fontSize: 10,
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {done ? "✓" : i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: done ? "#4caf7d" : "var(--txt)",
                    }}
                  >
                    {q}
                  </div>
                  <div
                    style={{ fontSize: 10, color: "var(--txt3)", marginTop: 1 }}
                  >
                    {i < 2 ? "🔥 Very High" : i < 4 ? "⚡ High" : "📌 Medium"}{" "}
                    frequency
                  </div>
                </div>
                <button
                  onClick={() =>
                    setSolved((p) => ({ ...p, ["__q_" + i]: done ? 0 : 1 }))
                  }
                  style={{
                    padding: "5px 10px",
                    borderRadius: 8,
                    border: "none",
                    background: done ? "#4caf7d22" : co.color + "22",
                    color: done ? "#4caf7d" : co.color,
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {done ? "Done" : "Mark"}
                </button>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

function RoundsTab({ co, company }) {
  const experiences = MOCK_EXPERIENCES.filter((e) => e.company === company);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Round Structure */}
      <Card>
        <SectionLabel>Interview Round Structure</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {co.rounds.map((r, i) => (
            <div
              key={i}
              style={{ display: "flex", gap: 12, alignItems: "flex-start" }}
            >
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 8,
                  background: co.color,
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                {i + 1}
              </div>
              {i < co.rounds.length - 1 && (
                <div
                  style={{
                    position: "absolute",
                    width: 1,
                    height: 8,
                    background: "var(--border)",
                    marginLeft: 11,
                    marginTop: 25,
                  }}
                />
              )}
              <div
                style={{
                  flex: 1,
                  paddingBottom: i < co.rounds.length - 1 ? 8 : 0,
                  borderBottom:
                    i < co.rounds.length - 1
                      ? "1px solid var(--border)"
                      : "none",
                }}
              >
                <div
                  style={{ fontSize: 13, fontWeight: 700, color: "var(--txt)" }}
                >
                  {r}
                </div>
                <div
                  style={{ fontSize: 11, color: "var(--txt3)", marginTop: 2 }}
                >
                  {i === 0
                    ? "Usually online, timed"
                    : i === co.rounds.length - 1
                      ? "Culture & behavioral focus"
                      : "Technical, 45–60 mins"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Company Stats */}
      <Card>
        <SectionLabel>Placement Statistics</SectionLabel>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              background: "var(--bg3)",
              borderRadius: 12,
              padding: 14,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 900, color: co.color }}>
              {co.pkg}
            </div>
            <div
              style={{
                fontSize: 10,
                color: "var(--txt3)",
                marginTop: 3,
                fontWeight: 700,
              }}
            >
              Average Package
            </div>
          </div>
          <div
            style={{
              background: "var(--bg3)",
              borderRadius: 12,
              padding: 14,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 900, color: "#e05252" }}>
              {co.rate}
            </div>
            <div
              style={{
                fontSize: 10,
                color: "var(--txt3)",
                marginTop: 3,
                fontWeight: 700,
              }}
            >
              Selection Rate
            </div>
          </div>
        </div>
        <div>
          <div
            style={{
              fontSize: 11,
              color: "var(--txt3)",
              marginBottom: 6,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: ".07em",
            }}
          >
            Top Hiring Branches
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {co.branches.map((b) => (
              <Tag key={b} color={co.color}>
                {b}
              </Tag>
            ))}
          </div>
        </div>
      </Card>

      {/* Experiences */}
      <div>
        <SectionLabel>Interview Experiences Feed</SectionLabel>
        {experiences.length === 0 ? (
          <Card>
            <div
              style={{
                textAlign: "center",
                color: "var(--txt3)",
                fontSize: 13,
              }}
            >
              No experiences yet. Be the first to submit!
            </div>
          </Card>
        ) : (
          experiences.map((e) => (
            <Card key={e.id} style={{ marginBottom: 10 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 10,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: "var(--txt)",
                    }}
                  >
                    {e.college}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--txt3)" }}>
                    {e.role} · {e.rounds} rounds ·{" "}
                    {new Date(e.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <Tag color={e.selected ? "#4caf7d" : "#e05252"}>
                  {e.selected ? "✓ Selected" : "✗ Rejected"}
                </Tag>
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--txt2)",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {e.story}
              </p>
              <div style={{ marginTop: 8 }}>
                <Tag
                  color={
                    e.difficulty === "Very Hard"
                      ? "#e05252"
                      : e.difficulty === "Hard"
                        ? "#e8924a"
                        : "#4caf7d"
                  }
                >
                  {e.difficulty}
                </Tag>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function AnalyticsTab({ co, solved, daysLeft, totalTarget }) {
  const totalSolved = Object.values(solved)
    .filter((v, i, a) => true)
    .reduce((s, v) => s + (typeof v === "number" && v > 0 ? v : 0), 0);
  const dsaSolved = Object.entries(solved)
    .filter(([k]) => !k.startsWith("__q_"))
    .reduce((s, [, v]) => s + (v || 0), 0);
  const qsSolved = Object.entries(solved).filter(([k]) =>
    k.startsWith("__q_"),
  ).length;

  const weakTopics = Object.entries(co.topics)
    .filter(([t, w]) => (solved[t] || 0) < Math.round(w / 4))
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([t]) => t);

  const strongTopics = Object.entries(co.topics)
    .filter(([t, w]) => (solved[t] || 0) >= Math.round(w / 3))
    .map(([t]) => t);

  // Prediction engine
  const topicPredictions = Object.entries(co.topics)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([t, w]) => ({ topic: t, prob: w }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Performance */}
      <Card>
        <SectionLabel>Preparation Analytics</SectionLabel>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 8,
            marginBottom: 14,
          }}
        >
          {[
            { label: "DSA Solved", value: dsaSolved, color: "#5b8def" },
            { label: "Hot Qs Done", value: qsSolved, color: "#9b72cf" },
            {
              label: "Days to Go",
              value: daysLeft,
              color: daysLeft <= 7 ? "#e05252" : "#4caf7d",
            },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: "var(--bg3)",
                borderRadius: 10,
                padding: "12px 10px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>
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

        <div style={{ marginBottom: 12 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 5,
            }}
          >
            <span
              style={{ fontSize: 12, fontWeight: 700, color: "var(--txt)" }}
            >
              Overall Progress
            </span>
            <span
              style={{
                fontSize: 12,
                color: "var(--txt3)",
                fontFamily: "monospace",
              }}
            >
              {dsaSolved}/
              {Math.max(
                1,
                Object.values(co.topics).reduce(
                  (s, w) => s + Math.round(w / 3),
                  0,
                ),
              )}
            </span>
          </div>
          <Bar
            pct={Math.min(
              100,
              Math.round(
                (dsaSolved /
                  Math.max(
                    1,
                    Object.values(co.topics).reduce(
                      (s, w) => s + Math.round(w / 3),
                      0,
                    ),
                  )) *
                  100,
              ),
            )}
            color={co.color}
            height={10}
          />
        </div>
      </Card>

      {/* Strengths / Weaknesses */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <Card style={{ padding: 14 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: "#4caf7d",
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: ".08em",
            }}
          >
            💪 Strengths
          </div>
          {strongTopics.length === 0 ? (
            <div style={{ fontSize: 12, color: "var(--txt3)" }}>
              Start solving!
            </div>
          ) : (
            strongTopics.map((t) => (
              <div
                key={t}
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--txt)",
                  marginBottom: 5,
                }}
              >
                ✓ {t}
              </div>
            ))
          )}
        </Card>
        <Card style={{ padding: 14 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: "#e05252",
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: ".08em",
            }}
          >
            ⚠ Weak Areas
          </div>
          {weakTopics.length === 0 ? (
            <div style={{ fontSize: 12, color: "#4caf7d" }}>
              Looking great! 🎉
            </div>
          ) : (
            weakTopics.map((t) => (
              <div
                key={t}
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#e05252",
                  marginBottom: 5,
                }}
              >
                ✗ {t}
              </div>
            ))
          )}
        </Card>
      </div>

      {/* Prediction Engine */}
      <Card>
        <SectionLabel>🔮 Interview Prediction Engine</SectionLabel>
        <p style={{ fontSize: 12, color: "var(--txt3)", margin: "0 0 12px" }}>
          Based on recent interview patterns, these topics are most likely to
          appear.
        </p>
        {topicPredictions.map(({ topic, prob }) => (
          <div key={topic} style={{ marginBottom: 10 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <span
                style={{ fontSize: 12, fontWeight: 700, color: "var(--txt)" }}
              >
                {topic}
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, color: co.color }}>
                {prob}% likely
              </span>
            </div>
            <Bar pct={prob} color={co.color} height={6} />
          </div>
        ))}
        <div
          style={{
            marginTop: 12,
            background: co.color + "12",
            border: `1px solid ${co.color}33`,
            borderRadius: 10,
            padding: "10px 12px",
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: co.color,
              marginBottom: 3,
            }}
          >
            AI Recommendation
          </div>
          <div style={{ fontSize: 12, color: "var(--txt2)", lineHeight: 1.5 }}>
            Focus on {topicPredictions[0]?.topic} and{" "}
            {topicPredictions[1]?.topic} — these cover over{" "}
            {(topicPredictions[0]?.prob || 0) +
              (topicPredictions[1]?.prob || 0)}
            % of expected questions.
            {weakTopics[0]
              ? ` Prioritize improving your ${weakTopics[0]} fundamentals.`
              : " Keep up the great work!"}
          </div>
        </div>
      </Card>
    </div>
  );
}

// ── SECTION: Submit Experience ─────────────────────────────────────────────────
function SubmitExperience({ onClose }) {
  const [form, setForm] = useState({
    company: "Amazon",
    role: "SDE-1",
    college: "",
    rounds: "4",
    selected: "true",
    difficulty: "Medium",
    story: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function submit() {
    if (!form.college || !form.story) return;
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  }

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
        <div style={{ fontSize: 16, fontWeight: 800, color: "var(--txt)" }}>
          Experience Submitted!
        </div>
        <div style={{ fontSize: 13, color: "var(--txt3)", marginTop: 6 }}>
          Thank you for helping the community.
        </div>
      </div>
    );
  }

  const inp = {
    width: "100%",
    background: "var(--bg3)",
    border: "1.5px solid var(--border)",
    borderRadius: 10,
    padding: "10px 12px",
    color: "var(--txt)",
    fontSize: 13,
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div>
          <SectionLabel>Company</SectionLabel>
          <select
            value={form.company}
            onChange={(e) =>
              setForm((p) => ({ ...p, company: e.target.value }))
            }
            style={inp}
          >
            {Object.keys(COMPANIES).map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <SectionLabel>Role</SectionLabel>
          <select
            value={form.role}
            onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
            style={inp}
          >
            {["SDE-1", "SDE-2", "Data Analyst", "ML Engineer"].map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <SectionLabel>College</SectionLabel>
        <input
          placeholder="e.g. IIT Bombay, NIT Trichy"
          value={form.college}
          onChange={(e) => setForm((p) => ({ ...p, college: e.target.value }))}
          style={inp}
        />
      </div>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}
      >
        <div>
          <SectionLabel>Rounds</SectionLabel>
          <select
            value={form.rounds}
            onChange={(e) => setForm((p) => ({ ...p, rounds: e.target.value }))}
            style={inp}
          >
            {["2", "3", "4", "5", "6"].map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
        <div>
          <SectionLabel>Outcome</SectionLabel>
          <select
            value={form.selected}
            onChange={(e) =>
              setForm((p) => ({ ...p, selected: e.target.value }))
            }
            style={inp}
          >
            <option value="true">Selected ✓</option>
            <option value="false">Rejected ✗</option>
          </select>
        </div>
        <div>
          <SectionLabel>Difficulty</SectionLabel>
          <select
            value={form.difficulty}
            onChange={(e) =>
              setForm((p) => ({ ...p, difficulty: e.target.value }))
            }
            style={inp}
          >
            {["Easy", "Medium", "Hard", "Very Hard"].map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <SectionLabel>Your Experience</SectionLabel>
        <textarea
          value={form.story}
          onChange={(e) => setForm((p) => ({ ...p, story: e.target.value }))}
          placeholder="Describe each round, questions asked, what surprised you..."
          rows={5}
          style={{ ...inp, resize: "vertical", lineHeight: 1.6 }}
        />
      </div>
      <button
        onClick={submit}
        disabled={!form.college || !form.story}
        style={{
          padding: "13px",
          borderRadius: 12,
          border: "none",
          background: form.college && form.story ? "#5b8def" : "var(--bg4)",
          color: form.college && form.story ? "#fff" : "var(--txt3)",
          fontSize: 14,
          fontWeight: 800,
          cursor: form.college && form.story ? "pointer" : "not-allowed",
          fontFamily: "inherit",
        }}
      >
        Submit Experience →
      </button>
    </div>
  );
}

// ── SECTION: Company Database ──────────────────────────────────────────────────
function CompanyDatabase({ onSelect }) {
  return (
    <div>
      <SectionLabel>Company Intelligence Database</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {Object.entries(COMPANIES).map(([name, co]) => (
          <Card
            key={name}
            style={{
              cursor: "pointer",
              transition: "all .15s",
              padding: "14px 16px",
            }}
            onClick={() => onSelect(name)}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: co.color,
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 900,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {co.logo}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 800,
                      color: "var(--txt)",
                    }}
                  >
                    {name}
                  </span>
                  <Tag color={co.color}>{co.pkg}</Tag>
                </div>
                <div
                  style={{ fontSize: 11, color: "var(--txt3)", marginTop: 3 }}
                >
                  {co.rounds.length} rounds · {co.rate} selection ·{" "}
                  {co.branches.join(", ")}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ── MAIN EXPORT ────────────────────────────────────────────────────────────────
export default function PlacementIntelligencePlatform() {
  const [screen, setScreen] = useState(() => load("pip_screen", "home"));
  const [setup, setSetup] = useState(() => load("pip_setup", null));
  const [tab, setTab] = useState("dashboard");
  const [showSubmit, setShowSubmit] = useState(false);

  useEffect(() => {
    save("pip_screen", screen);
  }, [screen]);
  useEffect(() => {
    if (setup) save("pip_setup", setup);
  }, [setup]);

  function handleSetup(data) {
    setSetup(data);
    setScreen("dashboard");
  }

  const navTabs = [
    { id: "dashboard", label: "📊 Dashboard" },
    { id: "companies", label: "🏢 Companies" },
    { id: "feed", label: "💬 Experiences" },
  ];

  return (
    <div className="page" style={{ paddingBottom: 32 }}>
      {/* Top nav */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 900,
              color: "var(--txt)",
              margin: 0,
              letterSpacing: "-.03em",
            }}
          >
            Placement Intel <span style={{ color: "#5b8def" }}>⚡</span>
          </h1>
          <div style={{ fontSize: 11, color: "var(--txt3)", marginTop: 2 }}>
            Data-driven interview prep
          </div>
        </div>
        <button
          onClick={() => setShowSubmit((p) => !p)}
          style={{
            padding: "8px 14px",
            borderRadius: 10,
            border: "1.5px solid #5b8def55",
            background: "#5b8def12",
            color: "#5b8def",
            fontSize: 12,
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          {showSubmit ? "✕ Close" : "+ Share"}
        </button>
      </div>

      {/* Submit modal */}
      {showSubmit && (
        <Card style={{ marginBottom: 20 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: "var(--txt)",
              marginBottom: 14,
            }}
          >
            Share Your Interview Experience
          </div>
          <SubmitExperience onClose={() => setShowSubmit(false)} />
        </Card>
      )}

      {/* Tab nav */}
      <div
        style={{
          display: "flex",
          gap: 6,
          marginBottom: 20,
          background: "var(--bg3)",
          borderRadius: 12,
          padding: 4,
        }}
      >
        {navTabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1,
              padding: "8px 4px",
              borderRadius: 9,
              border: "none",
              background: tab === t.id ? "var(--bg)" : "transparent",
              color: tab === t.id ? "var(--txt)" : "var(--txt3)",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all .15s",
              boxShadow: tab === t.id ? "0 1px 4px rgba(0,0,0,.12)" : "none",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === "dashboard" &&
        (screen === "home" || !setup ? (
          <SetupView onSubmit={handleSetup} />
        ) : (
          <Dashboard
            setup={setup}
            onReset={() => {
              setScreen("home");
              setSetup(null);
            }}
          />
        ))}

      {tab === "companies" && (
        <CompanyDatabase
          onSelect={(name) => {
            setSetup((s) => ({
              ...(s || {}),
              company: name,
              role: s?.role || "SDE-1",
              date:
                s?.date ||
                new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
            }));
            setTab("dashboard");
            setScreen("dashboard");
          }}
        />
      )}

      {tab === "feed" && (
        <div>
          <SectionLabel>Recent Interview Experiences</SectionLabel>
          {MOCK_EXPERIENCES.map((e) => {
            const co = COMPANIES[e.company];
            return (
              <Card key={e.id} style={{ marginBottom: 12 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      background: co?.color || "#888",
                      color: "#fff",
                      fontSize: 12,
                      fontWeight: 900,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {co?.logo}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 800,
                          color: "var(--txt)",
                        }}
                      >
                        {e.company} · {e.role}
                      </span>
                      <Tag color={e.selected ? "#4caf7d" : "#e05252"}>
                        {e.selected ? "Selected" : "Rejected"}
                      </Tag>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--txt3)" }}>
                      {e.college} ·{" "}
                      {new Date(e.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </div>
                  </div>
                </div>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--txt2)",
                    lineHeight: 1.6,
                    margin: "0 0 8px",
                  }}
                >
                  {e.story}
                </p>
                <div style={{ display: "flex", gap: 6 }}>
                  <Tag color="#5b8def">{e.rounds} Rounds</Tag>
                  <Tag
                    color={
                      e.difficulty === "Very Hard"
                        ? "#e05252"
                        : e.difficulty === "Hard"
                          ? "#e8924a"
                          : "#4caf7d"
                    }
                  >
                    {e.difficulty}
                  </Tag>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
