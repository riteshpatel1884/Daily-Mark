// pip.PrepTimeline.jsx — Adaptive 30-day prep timeline with day-by-day plan

"use client";
import { useState } from "react";
import { COMPANIES } from "./constants.js";
import { Card, SectionLabel, Tag, Bar } from "./ui.js";

const TOPIC_QUESTIONS = {
  Arrays: ["Two Sum", "Maximum Subarray", "Rotate Array", "Find Duplicate"],
  Strings: [
    "Longest Palindrome",
    "Anagram Groups",
    "Implement strStr",
    "Count and Say",
  ],
  "Linked Lists": [
    "Reverse Linked List",
    "Detect Cycle",
    "Merge Two Lists",
    "Find Middle",
  ],
  Trees: [
    "Max Depth",
    "Level Order BFS",
    "Validate BST",
    "Lowest Common Ancestor",
  ],
  Graphs: [
    "Number of Islands",
    "Clone Graph",
    "Course Schedule",
    "Word Ladder",
  ],
  "Dynamic Programming": [
    "Climbing Stairs",
    "0/1 Knapsack",
    "Longest Common Subsequence",
    "Edit Distance",
  ],
  Recursion: ["Subsets", "Permutations", "N-Queens", "Letter Combinations"],
  Greedy: ["Jump Game", "Meeting Rooms", "Task Scheduler", "Minimum Platforms"],
  Heaps: ["Kth Largest", "Merge K Lists", "Top K Frequent", "Find Median"],
  "Sliding Window": [
    "Max Window",
    "Longest Substring Without Repeating",
    "Minimum Window Substring",
    "Fruit Into Baskets",
  ],
  "Bit Manipulation": [
    "Single Number",
    "Missing Number",
    "Power of Two",
    "Counting Bits",
  ],
};

function buildTimeline(co, daysLeft) {
  const topics = Object.entries(co.topics).sort(([, a], [, b]) => b - a);
  const totalDays = Math.min(daysLeft, 30);

  if (totalDays <= 0) return [];

  // Phase proportions
  const phases =
    totalDays <= 14
      ? [
          { name: "Intense DSA", emoji: "⚡", ratio: 0.5, color: "#e05252" },
          {
            name: "Mock Interviews",
            emoji: "🎙️",
            ratio: 0.3,
            color: "#5b8def",
          },
          { name: "Final Revision", emoji: "🔄", ratio: 0.2, color: "#4caf7d" },
        ]
      : [
          {
            name: "Foundation DSA",
            emoji: "📚",
            ratio: 0.35,
            color: "#5b8def",
          },
          { name: "Topic Mastery", emoji: "🧩", ratio: 0.35, color: "#9b72cf" },
          { name: "Hard Problems", emoji: "🔥", ratio: 0.15, color: "#e8924a" },
          {
            name: "Mocks & Revision",
            emoji: "🎯",
            ratio: 0.15,
            color: "#4caf7d",
          },
        ];

  const days = [];
  let topicIdx = 0;
  let dayNum = 1;

  for (const phase of phases) {
    const phaseDays = Math.max(1, Math.round(totalDays * phase.ratio));
    for (let d = 0; d < phaseDays && dayNum <= totalDays; d++, dayNum++) {
      const topic = topics[topicIdx % topics.length];
      const qs = TOPIC_QUESTIONS[topic[0]] || [
        "Problem Set A",
        "Problem Set B",
        "Problem Set C",
        "Problem Set D",
      ];
      const dailyTarget = phase.name.includes("Mock") ? 0 : 3;

      days.push({
        day: dayNum,
        phase: phase.name,
        phaseEmoji: phase.emoji,
        phaseColor: phase.color,
        topic: topic[0],
        topicWeight: topic[1],
        questions: qs.slice(0, dailyTarget),
        isMock: phase.name.includes("Mock"),
        isRevision: phase.name.includes("Revision"),
        special:
          dayNum % 7 === 0
            ? "revision"
            : phase.name.includes("Mock") && d % 3 === 0
              ? "mock"
              : null,
      });

      if (d > 0 && d % 3 === 0) topicIdx++;
    }
    topicIdx++;
  }

  return days;
}

export default function PrepTimeline({ setup, co }) {
  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(setup.date) - Date.now()) / 86400000),
  );
  const timeline = buildTimeline(co, daysLeft);
  const [expanded, setExpanded] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const phases = [...new Set(timeline.map((d) => d.phase))];
  const [activePhase, setActivePhase] = useState("All");

  const filtered =
    activePhase === "All"
      ? timeline
      : timeline.filter((d) => d.phase === activePhase);

  const displayed = showAll ? filtered : filtered.slice(0, 14);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Header */}
      <Card style={{ padding: "14px 16px" }}>
        <SectionLabel>{daysLeft}-Day Adaptive Prep Timeline</SectionLabel>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(phases.length, 4)}, 1fr)`,
            gap: 8,
          }}
        >
          {phases.map((p) => {
            const sample = timeline.find((d) => d.phase === p);
            const phaseDays = timeline.filter((d) => d.phase === p).length;
            return (
              <div
                key={p}
                style={{
                  background: sample.phaseColor + "15",
                  border: `1px solid ${sample.phaseColor}44`,
                  borderRadius: 10,
                  padding: "10px 10px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 18, marginBottom: 3 }}>
                  {sample.phaseEmoji}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    color: sample.phaseColor,
                  }}
                >
                  {p}
                </div>
                <div
                  style={{ fontSize: 10, color: "var(--txt3)", marginTop: 2 }}
                >
                  {phaseDays} days
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Phase filter */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {["All", ...phases].map((p) => (
          <button
            key={p}
            onClick={() => setActivePhase(p)}
            style={{
              padding: "6px 12px",
              borderRadius: 99,
              border: `1.5px solid ${activePhase === p ? co.color : "var(--border)"}`,
              background: activePhase === p ? co.color + "18" : "var(--bg3)",
              color: activePhase === p ? co.color : "var(--txt2)",
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all .15s",
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Timeline rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {displayed.map((day) => {
          const isOpen = expanded === day.day;
          return (
            <div key={day.day}>
              <div
                onClick={() => setExpanded(isOpen ? null : day.day)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "11px 14px",
                  background:
                    day.special === "revision"
                      ? "#4caf7d12"
                      : day.special === "mock"
                        ? "#5b8def12"
                        : "var(--bg2)",
                  border: `1px solid ${
                    day.special === "revision"
                      ? "#4caf7d33"
                      : day.special === "mock"
                        ? "#5b8def33"
                        : "var(--border)"
                  }`,
                  borderRadius: 12,
                  cursor: "pointer",
                  transition: "all .15s",
                }}
              >
                {/* Day number */}
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: day.phaseColor,
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 900,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {day.day}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 6 }}
                  >
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "var(--txt)",
                      }}
                    >
                      {day.special === "revision"
                        ? "📚 Weekly Revision Day"
                        : day.special === "mock"
                          ? "🎙️ Mock Interview"
                          : day.isMock
                            ? "🎙️ Mock Practice"
                            : day.topic}
                    </span>
                    <Tag color={day.phaseColor}>
                      {day.phaseEmoji} {day.phase}
                    </Tag>
                  </div>
                  <div
                    style={{ fontSize: 10, color: "var(--txt3)", marginTop: 2 }}
                  >
                    {day.special === "revision"
                      ? "Review all topics covered this week"
                      : day.special === "mock"
                        ? "Simulate full interview round"
                        : day.questions.length > 0
                          ? `${day.questions.length} problems · ${day.topic} focus`
                          : "Mock session"}
                  </div>
                </div>

                {/* Expand arrow */}
                <span
                  style={{
                    color: "var(--txt3)",
                    fontSize: 12,
                    transform: isOpen ? "rotate(180deg)" : "none",
                    transition: "transform .2s",
                    flexShrink: 0,
                  }}
                >
                  ▾
                </span>
              </div>

              {/* Expanded questions */}
              {isOpen && day.questions.length > 0 && (
                <div
                  style={{
                    padding: "10px 14px 10px 58px",
                    background: "var(--bg3)",
                    border: "1px solid var(--border)",
                    borderTop: "none",
                    borderRadius: "0 0 12px 12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  {day.questions.map((q, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 12,
                        color: "var(--txt)",
                      }}
                    >
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: 5,
                          background: day.phaseColor + "33",
                          color: day.phaseColor,
                          fontSize: 9,
                          fontWeight: 800,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {i + 1}
                      </div>
                      {q}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Show more */}
      {filtered.length > 14 && (
        <button
          onClick={() => setShowAll((p) => !p)}
          style={{
            padding: "10px",
            borderRadius: 10,
            border: "1.5px solid var(--border)",
            background: "var(--bg3)",
            color: "var(--txt2)",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          {showAll ? "Show Less ▲" : `Show All ${filtered.length} Days ▼`}
        </button>
      )}
    </div>
  );
}
