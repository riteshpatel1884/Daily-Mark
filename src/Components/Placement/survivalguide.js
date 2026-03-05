// pip.SurvivalGuide.jsx — Interview Survival Guide: tips, round patterns, must-know topics

"use client";
import { useState } from "react";
import { COMPANIES } from "./constants";
import { Card, SectionLabel, Tag, CompanyLogo, Bar } from "./ui.js";

const SURVIVAL_DATA = {
  Amazon: {
    mustKnow: [
      "LRU Cache (appears in ~60% of rounds)",
      "Graph traversal (BFS + DFS variants)",
      "Sliding Window patterns",
      "Two pointer technique",
      "Leadership Principles (all 16 — non-negotiable)",
    ],
    roundPatterns: [
      {
        round: "OA",
        focus: "Sliding Window + Arrays",
        difficulty: "Medium",
        tip: "90 min, 2 questions. Manage time strictly — don't over-optimize.",
      },
      {
        round: "Round 1",
        focus: "Graphs or Trees",
        difficulty: "Medium-Hard",
        tip: "Explain your thought process loudly. They care about reasoning.",
      },
      {
        round: "Round 2",
        focus: "Dynamic Programming",
        difficulty: "Hard",
        tip: "Start with brute force, then optimize. DP derivation matters.",
      },
      {
        round: "System Design",
        focus: "URL Shortener / Cab Booking",
        difficulty: "Hard",
        tip: "Always cover scalability, caching, DB choice, load balancing.",
      },
      {
        round: "Bar Raiser",
        focus: "Leadership + Behavioral",
        difficulty: "Varies",
        tip: "Use STAR format. Prepare 2 stories per leadership principle.",
      },
    ],
    tips: [
      "Amazon is obsessed with Leadership Principles — prepare concrete stories",
      "They expect you to clarify requirements before coding",
      "Write clean, readable code — they value readability over cleverness",
      "'Customer Obsession' is the most asked principle",
      "For system design, always start with requirements gathering",
    ],
    trendingTopics: ["Graphs ↑", "Sliding Window ↑", "DP steady", "Trees →"],
    avoidMistakes: [
      "Jumping to code without clarifying edge cases",
      "Ignoring time/space complexity discussion",
      "Not knowing all Leadership Principles",
      "Weak system design — skipping capacity estimation",
    ],
  },
  Google: {
    mustKnow: [
      "Graph algorithms (Dijkstra, Floyd-Warshall, Topological Sort)",
      "DP on strings (Edit Distance, LCS, Regex Matching)",
      "Tree traversals + lowest common ancestor",
      "Bit manipulation tricks",
      "Clean code with clear variable names",
    ],
    roundPatterns: [
      {
        round: "Phone Screen",
        focus: "Arrays + Strings",
        difficulty: "Medium",
        tip: "Write syntactically correct code. Interviewer shares screen.",
      },
      {
        round: "Round 1",
        focus: "Graph / Tree",
        difficulty: "Hard",
        tip: "Think aloud. Google loves candidates who reason out loud.",
      },
      {
        round: "Round 2",
        focus: "Dynamic Programming",
        difficulty: "Hard",
        tip: "DP on grids or strings common. Know tabulation & memoization.",
      },
      {
        round: "System Design",
        focus: "Google Docs / Maps",
        difficulty: "Hard",
        tip: "OOP design + distributed systems. Mention consistency models.",
      },
      {
        round: "Googleyness",
        focus: "Behavioral + Culture",
        difficulty: "Medium",
        tip: "Show intellectual humility, comfort with ambiguity, collaboration.",
      },
    ],
    tips: [
      "Google values algorithmic thinking over pattern matching",
      "Always analyze time AND space complexity unprompted",
      "They love clean, idiomatic code — avoid hacks",
      "'Googleyness' is real — show curiosity and intellectual humility",
      "For DP: state the recurrence relation before coding",
    ],
    trendingTopics: ["DP ↑ (30%)", "Graphs ↑ (25%)", "Trees →", "Math ↑"],
    avoidMistakes: [
      "Writing buggy code in phone screen",
      "Not knowing graph algorithms deeply",
      "Arrogance or dismissing interviewer hints",
      "Skipping edge case analysis",
    ],
  },
  Microsoft: {
    mustKnow: [
      "Tree traversals (all 4 types)",
      "Linked list manipulation (reverse, detect cycle)",
      "Basic DP (Fibonacci variants, coin change)",
      "Understand OOP principles",
      "Know OS basics (threads, deadlock, scheduling)",
    ],
    roundPatterns: [
      {
        round: "OA",
        focus: "Arrays + Strings",
        difficulty: "Easy-Medium",
        tip: "Usually on HackerRank. Standard problems — solve all.",
      },
      {
        round: "Technical 1",
        focus: "Trees + Linked Lists",
        difficulty: "Medium",
        tip: "Heavy on BST questions. Know all tree operations cold.",
      },
      {
        round: "Technical 2",
        focus: "DP + Graphs",
        difficulty: "Medium-Hard",
        tip: "May ask design questions. Explain your choices clearly.",
      },
      {
        round: "Design Round",
        focus: "System Design",
        difficulty: "Hard",
        tip: "Know distributed basics. Mention trade-offs at every step.",
      },
      {
        round: "HR",
        focus: "Behavioral",
        difficulty: "Easy",
        tip: "Standard questions. Be honest about strengths and growth areas.",
      },
    ],
    tips: [
      "Microsoft loves tree problems — know BST inside out",
      "They value communication skills very highly",
      "OOP questions are common in technical rounds",
      "CS fundamentals (OS, DBMS) tested in design round",
      "Show enthusiasm for Microsoft products",
    ],
    trendingTopics: [
      "Trees ↑ (30%)",
      "Linked Lists →",
      "Arrays →",
      "Strings ↑",
    ],
    avoidMistakes: [
      "Not knowing tree rotations / balanced BST",
      "Weak on OS and DBMS concepts",
      "Coding without asking clarifying questions",
      "Ignoring edge cases in linked list problems",
    ],
  },
  Flipkart: {
    mustKnow: [
      "Machine coding (build a mini-system in 90 mins)",
      "Array manipulation (sorting, searching variants)",
      "Greedy algorithm patterns",
      "Low-level design (design a parking lot, snake game)",
      "Basic system design (ride booking, food delivery)",
    ],
    roundPatterns: [
      {
        round: "Machine Coding",
        focus: "LLD — Build a system",
        difficulty: "Hard",
        tip: "Write extensible, clean OOP code. Think SOLID principles.",
      },
      {
        round: "DSA Round",
        focus: "Arrays + Greedy",
        difficulty: "Medium",
        tip: "Standard DSA problems. Faster pace than FAANG rounds.",
      },
      {
        round: "System Design",
        focus: "Cab/Food delivery",
        difficulty: "Medium-Hard",
        tip: "Focus on practical decisions over theoretical perfection.",
      },
      {
        round: "Hiring Manager",
        focus: "Culture + Motivation",
        difficulty: "Medium",
        tip: "Show passion for e-commerce and consumer tech problems.",
      },
    ],
    tips: [
      "Machine coding round is UNIQUE to Flipkart — prepare LLD seriously",
      "They want pragmatic engineers, not just algorithm experts",
      "Know design patterns (Factory, Observer, Strategy)",
      "Communication and code quality matter as much as correctness",
      "They love candidates who've used Flipkart and understand the product",
    ],
    trendingTopics: ["Arrays ↑ (30%)", "Linked Lists →", "Greedy ↑", "LLD ↑"],
    avoidMistakes: [
      "Not preparing Low-Level Design",
      "Solving only LeetCode without OOP practice",
      "Over-engineering system design solutions",
      "Not practicing machine coding under time pressure",
    ],
  },
  Uber: {
    mustKnow: [
      "Graph algorithms (Dijkstra, A* for routing)",
      "Sliding Window for rate limiting",
      "Geospatial indexing concepts",
      "System design for real-time matching",
      "DP for optimization problems",
    ],
    roundPatterns: [
      {
        round: "OA",
        focus: "Graphs + Arrays",
        difficulty: "Medium",
        tip: "HackerRank format. Uber loves graph problems related to maps.",
      },
      {
        round: "Technical Phone",
        focus: "Graph / DP",
        difficulty: "Hard",
        tip: "Deep technical dive. Expect follow-up questions on complexity.",
      },
      {
        round: "Onsite x4",
        focus: "DSA + Design + Behavioral",
        difficulty: "Hard",
        tip: "4 back-to-back rounds. Pace yourself and stay sharp.",
      },
    ],
    tips: [
      "Think in terms of Uber's domain — routing, matching, pricing",
      "Rate limiting design is a very common system design question",
      "They value candidates who connect algorithms to real problems",
      "Surge pricing algorithm knowledge impresses interviewers",
      "Strong emphasis on distributed systems and scalability",
    ],
    trendingTopics: ["Graphs ↑ (32%)", "Sliding Window ↑", "DP →", "Design ↑"],
    avoidMistakes: [
      "Not knowing graph algorithms deeply",
      "Ignoring practical constraints in system design",
      "Not connecting solutions to real-world scaling problems",
      "Weak on rate limiting and caching patterns",
    ],
  },
  Adobe: {
    mustKnow: [
      "Array manipulation (stock problems, intervals)",
      "String algorithms (pattern matching, anagrams)",
      "Recursion and backtracking",
      "Basic DP patterns",
      "OS fundamentals (memory, processes, threads)",
    ],
    roundPatterns: [
      {
        round: "OA",
        focus: "Arrays + Strings",
        difficulty: "Easy-Medium",
        tip: "1 hour on HackerRank. Clean, working code beats clever incomplete solutions.",
      },
      {
        round: "DSA Round",
        focus: "Recursion + Backtracking",
        difficulty: "Medium",
        tip: "Think recursively. Derive the recurrence. Test with examples.",
      },
      {
        round: "CS Fundamentals",
        focus: "OS + DBMS + OOP",
        difficulty: "Medium",
        tip: "Brush up on process synchronization, SQL queries, ACID properties.",
      },
      {
        round: "HR",
        focus: "Behavioral",
        difficulty: "Easy",
        tip: "Adobe values creativity and passion. Show you care about design/UX.",
      },
    ],
    tips: [
      "Adobe specifically looks for CS fundamentals knowledge",
      "They care about code readability and clean code",
      "Show enthusiasm for design and creative tools",
      "DBMS and OS are tested — don't skip theory",
      "Adobe values diversity of thinking and creative problem solving",
    ],
    trendingTopics: [
      "Arrays ↑ (32%)",
      "Strings ↑ (25%)",
      "Recursion →",
      "OS ↑",
    ],
    avoidMistakes: [
      "Skipping CS theory (OS + DBMS)",
      "Writing unreadable code",
      "Not practicing recursion deeply",
      "Ignoring the CS Fundamentals round",
    ],
  },
};

export default function SurvivalGuide({ company }) {
  const co = COMPANIES[company];
  const data = SURVIVAL_DATA[company];
  const [activeSection, setActiveSection] = useState("tips");

  if (!data) return null;

  const sections = [
    { id: "tips", label: "💡 Tips" },
    { id: "rounds", label: "🎯 Rounds" },
    { id: "mustknow", label: "🔥 Must Know" },
    { id: "mistakes", label: "❌ Avoid" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Header */}
      <div
        style={{
          background: co.color + "12",
          border: `1.5px solid ${co.color}33`,
          borderRadius: 14,
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <CompanyLogo logo={co.logo} color={co.color} size={42} />
        <div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 900,
              color: "var(--txt)",
              marginBottom: 2,
            }}
          >
            {company} Survival Guide
          </div>
          <div style={{ fontSize: 12, color: "var(--txt2)" }}>
            Everything you need to know to crack {company}
          </div>
        </div>
      </div>

      {/* Trending topics */}
      <Card style={{ padding: "12px 16px" }}>
        <SectionLabel>Topic Trends (Last 12 Months)</SectionLabel>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {data.trendingTopics.map((t, i) => {
            const up = t.includes("↑");
            const down = t.includes("↓");
            const color = up ? "#4caf7d" : down ? "#e05252" : "#d4b44a";
            return (
              <Tag key={i} color={color}>
                {t}
              </Tag>
            );
          })}
        </div>
      </Card>

      {/* Section tabs */}
      <div
        style={{
          display: "flex",
          gap: 5,
          background: "var(--bg3)",
          borderRadius: 12,
          padding: 4,
        }}
      >
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            style={{
              flex: 1,
              padding: "8px 4px",
              borderRadius: 9,
              border: "none",
              background: activeSection === s.id ? "var(--bg)" : "transparent",
              color: activeSection === s.id ? "var(--txt)" : "var(--txt3)",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all .15s",
              boxShadow:
                activeSection === s.id ? "0 1px 4px rgba(0,0,0,.14)" : "none",
              whiteSpace: "nowrap",
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Tips section */}
      {activeSection === "tips" && (
        <Card>
          <SectionLabel>Insider Tips for {company}</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {data.tips.map((tip, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 10,
                  padding: "10px 12px",
                  background: "var(--bg3)",
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    background: co.color,
                    color: "#fff",
                    fontSize: 10,
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
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--txt)",
                    lineHeight: 1.55,
                    fontWeight: 500,
                  }}
                >
                  {tip}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Round patterns section */}
      {activeSection === "rounds" && (
        <Card>
          <SectionLabel>{company} Round-by-Round Breakdown</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {data.roundPatterns.map((r, i) => {
              const diffColor = r.difficulty.includes("Hard")
                ? "#e05252"
                : r.difficulty.includes("Medium")
                  ? "#d4b44a"
                  : "#4caf7d";
              return (
                <div
                  key={i}
                  style={{
                    background: "var(--bg3)",
                    border: `1px solid var(--border)`,
                    borderLeft: `3px solid ${co.color}`,
                    borderRadius: "0 10px 10px 0",
                    padding: "12px 14px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 4,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 6,
                          background: co.color,
                          color: "#fff",
                          fontSize: 10,
                          fontWeight: 800,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {i + 1}
                      </div>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 800,
                          color: "var(--txt)",
                        }}
                      >
                        {r.round}
                      </span>
                    </div>
                    <Tag color={diffColor}>{r.difficulty}</Tag>
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: co.color,
                      marginBottom: 5,
                    }}
                  >
                    Focus: {r.focus}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--txt2)",
                      lineHeight: 1.55,
                      display: "flex",
                      gap: 6,
                      alignItems: "flex-start",
                    }}
                  >
                    <span style={{ flexShrink: 0 }}>💡</span>
                    {r.tip}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Must know section */}
      {activeSection === "mustknow" && (
        <Card>
          <SectionLabel>🔥 Must-Know for {company}</SectionLabel>
          <p
            style={{
              fontSize: 12,
              color: "var(--txt3)",
              margin: "0 0 12px",
              lineHeight: 1.5,
            }}
          >
            These topics appear so frequently that not knowing them is a red
            flag.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {data.mustKnow.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                  padding: "10px 12px",
                  background: co.color + "10",
                  border: `1px solid ${co.color}33`,
                  borderRadius: 10,
                }}
              >
                <span
                  style={{
                    color: co.color,
                    fontWeight: 800,
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                >
                  🔥
                </span>
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--txt)",
                    lineHeight: 1.5,
                    fontWeight: 500,
                  }}
                >
                  {item}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Avoid mistakes section */}
      {activeSection === "mistakes" && (
        <Card>
          <SectionLabel>❌ Common Mistakes to Avoid</SectionLabel>
          <p
            style={{
              fontSize: 12,
              color: "var(--txt3)",
              margin: "0 0 12px",
              lineHeight: 1.5,
            }}
          >
            Candidates frequently get rejected for these avoidable mistakes.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {data.avoidMistakes.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                  padding: "10px 12px",
                  background: "#e0525210",
                  border: "1px solid #e0525230",
                  borderRadius: 10,
                }}
              >
                <span
                  style={{
                    color: "#e05252",
                    fontWeight: 800,
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                >
                  ✗
                </span>
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--txt)",
                    lineHeight: 1.5,
                    fontWeight: 500,
                  }}
                >
                  {item}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
