"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import { useApp } from "@/Components/store";

// ── Parse a time string like "6:00 PM" or "18:00" into minutes since midnight ─
function parseTimeToMins(timeStr) {
  if (!timeStr) return 0;
  // Handle "6:00 PM – 7:00 PM" — take the start part
  const start = timeStr.split("–")[0].trim();
  const pmMatch = start.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (pmMatch) {
    let h = parseInt(pmMatch[1]);
    const m = parseInt(pmMatch[2]);
    const ampm = pmMatch[3].toUpperCase();
    if (ampm === "PM" && h !== 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;
    return h * 60 + m;
  }
  // Handle "18:00"
  const plainMatch = start.match(/(\d+):(\d+)/);
  if (plainMatch) return parseInt(plainMatch[1]) * 60 + parseInt(plainMatch[2]);
  return 0;
}

// ── Collect everything from localStorage ──────────────────────────────────────
function collectAllData() {
  try {
    const todayKey = new Date().toISOString().slice(0, 10);
    const now = new Date();
    const currentTime = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}`;
    const currentTimeFormatted = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const tasks = JSON.parse(
      localStorage.getItem("gr_tasks_" + todayKey) || "[]",
    );
    const exams = JSON.parse(localStorage.getItem("gr_exams") || "[]");
    const timetable = JSON.parse(localStorage.getItem("gr_timetable") || "{}");
    const subjects = JSON.parse(localStorage.getItem("gr_subjects") || "[]");
    const history = JSON.parse(localStorage.getItem("gr_hist") || "{}");
    const prefs = JSON.parse(localStorage.getItem("gr_prefs") || "{}");
    const profile = JSON.parse(localStorage.getItem("gr_profile") || "{}");
    const cgpaGoal = parseFloat(localStorage.getItem("gr_cgpa") || "8.5");
    const sem = localStorage.getItem("gr_sem") || "Semester 5";
    return {
      tasks,
      exams,
      timetable,
      subjects,
      history,
      prefs,
      profile,
      cgpaGoal,
      sem,
      currentTime,
      currentTimeFormatted,
    };
  } catch {
    return {};
  }
}

// ── Components ────────────────────────────────────────────────────────────────
function InsightCard({ insight }) {
  const bgMap = {
    warning: "var(--orange)15",
    tip: "var(--blue)12",
    success: "#4caf7d15",
    urgent: "var(--red)15",
  };
  const borderMap = {
    warning: "var(--orange)40",
    tip: "var(--blue)35",
    success: "#4caf7d40",
    urgent: "var(--red)40",
  };
  const txtMap = {
    warning: "var(--orange)",
    tip: "var(--blue)",
    success: "#4caf7d",
    urgent: "var(--red)",
  };
  return (
    <div
      style={{
        background: bgMap[insight.type] || "var(--bg3)",
        border: `1px solid ${borderMap[insight.type] || "var(--border)"}`,
        borderRadius: 13,
        padding: "13px 14px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 5,
        }}
      >
        <span style={{ fontSize: 16 }}>{insight.icon}</span>
        <span
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: txtMap[insight.type] || "var(--txt)",
          }}
        >
          {insight.title}
        </span>
      </div>
      <p
        style={{
          fontSize: 13,
          color: "var(--txt2)",
          lineHeight: 1.55,
          margin: 0,
        }}
      >
        {insight.body}
      </p>
    </div>
  );
}

function PriorityBadge({ priority }) {
  const map = {
    high: { bg: "var(--red)18", color: "var(--red)", label: "HIGH" },
    medium: { bg: "var(--orange)18", color: "var(--orange)", label: "MED" },
    low: { bg: "var(--bg4)", color: "var(--txt3)", label: "LOW" },
    none: { bg: "transparent", color: "transparent", label: "" },
  };
  const s = map[priority] || map.low;
  if (priority === "none") return null;

  return (
    <span
      style={{
        fontSize: 9,
        fontWeight: 800,
        letterSpacing: ".08em",
        padding: "2px 7px",
        borderRadius: 5,
        background: s.bg,
        color: s.color,
      }}
    >
      {s.label}
    </span>
  );
}

function TodaySession({ session, idx, isNext }) {
  const isBreak =
    session.subject?.toLowerCase().includes("break") ||
    session.task?.toLowerCase().includes("break");

  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        padding: "12px 14px",
        background: isBreak
          ? "transparent"
          : isNext
            ? "var(--blue)10"
            : "var(--bg2)",
        border: `1px ${isBreak ? "dashed" : "solid"} ${isNext && !isBreak ? "var(--blue)44" : "var(--border)"}`,
        borderRadius: 13,
        alignItems: "flex-start",
        position: "relative",
      }}
    >
      {isNext && !isBreak && (
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 12,
            fontSize: 9,
            fontWeight: 800,
            letterSpacing: ".07em",
            color: "var(--blue)",
            background: "var(--blue)18",
            padding: "2px 7px",
            borderRadius: 5,
          }}
        >
          UP NEXT
        </div>
      )}
      <div
        style={{
          flexShrink: 0,
          minWidth: 32,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 2,
        }}
      >
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: isBreak
              ? "var(--bg3)"
              : isNext
                ? "var(--blue)"
                : "var(--bg4)",
            border: `1.5px solid ${isBreak ? "var(--border)" : isNext ? "var(--blue)" : "var(--border)"}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 800,
            color: isNext && !isBreak ? "#fff" : "var(--txt3)",
          }}
        >
          {isBreak ? "☕" : idx + 1}
        </div>
        <div
          style={{
            width: 1.5,
            flex: 1,
            background: "var(--border)",
            marginTop: 4,
            minHeight: 16,
          }}
        />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            marginBottom: 4,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              fontWeight: 600,
              color: isNext && !isBreak ? "var(--blue)" : "var(--txt3)",
            }}
          >
            {session.time}
          </span>
          {!isBreak && session.priority && (
            <PriorityBadge priority={session.priority} />
          )}
          {!isBreak && session.pomodoros > 0 && (
            <span style={{ fontSize: 11, color: "var(--txt3)" }}>
              🍅 ×{session.pomodoros}
            </span>
          )}
        </div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: isBreak ? "var(--txt2)" : "var(--txt)",
            marginBottom: 3,
          }}
        >
          {session.subject}
        </div>
        <div
          style={{
            fontSize: 13,
            color: isBreak ? "var(--txt3)" : "var(--txt2)",
            marginBottom: 4,
          }}
        >
          {session.task}
        </div>
        {session.reason && !isBreak && (
          <div
            style={{
              fontSize: 11,
              color: "var(--txt3)",
              fontStyle: "italic",
              lineHeight: 1.4,
            }}
          >
            ↳ {session.reason}
          </div>
        )}
      </div>
    </div>
  );
}

function WeekDayCard({ day }) {
  const isToday = day.date === new Date().toISOString().slice(0, 10);
  return (
    <div
      style={{
        background: isToday ? "var(--blue)12" : "var(--bg2)",
        border: `1.5px solid ${isToday ? "var(--blue)44" : "var(--border)"}`,
        borderRadius: 12,
        padding: "11px 13px",
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 5,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: isToday ? "var(--blue)" : "var(--txt3)",
            letterSpacing: ".04em",
          }}
        >
          {day.day.slice(0, 3).toUpperCase()}
        </div>
        {day.examAlert && (
          <span
            style={{
              fontSize: 9,
              fontWeight: 800,
              padding: "2px 6px",
              borderRadius: 5,
              background: "var(--red)20",
              color: "var(--red)",
            }}
          >
            EXAM
          </span>
        )}
      </div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: "var(--txt)",
          marginBottom: 3,
          lineHeight: 1.2,
        }}
      >
        {day.focus}
      </div>
      <div
        style={{
          fontSize: 11,
          color: "var(--txt2)",
          lineHeight: 1.3,
          marginBottom: 5,
        }}
      >
        {day.keyTask}
      </div>
      <div
        style={{
          fontSize: 10,
          color: "var(--txt3)",
          fontFamily: "var(--mono)",
        }}
      >
        {day.sessions} session{day.sessions !== 1 ? "s" : ""}
      </div>
    </div>
  );
}

function ExamStrategyCard({ exam }) {
  const urgencyStyles = {
    critical: {
      bg: "var(--red)15",
      border: "var(--red)44",
      color: "var(--red)",
      label: "CRITICAL",
    },
    high: {
      bg: "var(--orange)15",
      border: "var(--orange)44",
      color: "var(--orange)",
      label: "HIGH",
    },
    medium: {
      bg: "var(--bg3)",
      border: "var(--border)",
      color: "var(--txt2)",
      label: "MEDIUM",
    },
    low: {
      bg: "var(--bg2)",
      border: "var(--border)",
      color: "var(--txt3)",
      label: "LOW",
    },
  };
  const s = urgencyStyles[exam.urgency] || urgencyStyles.medium;
  return (
    <div
      style={{
        background: s.bg,
        border: `1px solid ${s.border}`,
        borderRadius: 13,
        padding: "14px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 10,
          marginBottom: 8,
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              marginBottom: 3,
            }}
          >
            <span
              style={{
                fontSize: 9,
                fontWeight: 800,
                letterSpacing: ".08em",
                padding: "2px 7px",
                borderRadius: 5,
                background: s.color + "22",
                color: s.color,
              }}
            >
              {s.label}
            </span>
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "var(--txt)" }}>
            {exam.subject}
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 22,
              fontWeight: 800,
              color: s.color,
              lineHeight: 1,
            }}
          >
            {exam.daysLeft}
          </div>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: s.color,
              opacity: 0.8,
            }}
          >
            days left
          </div>
        </div>
      </div>
      <p
        style={{
          fontSize: 13,
          color: "var(--txt2)",
          lineHeight: 1.55,
          margin: "0 0 10px",
        }}
      >
        {exam.strategy}
      </p>
      <div style={{ display: "flex", gap: 8 }}>
        {[
          { label: "Total needed", val: `${exam.hoursNeeded}h` },
          { label: "Daily target", val: `${exam.dailyHours}h/day` },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              flex: 1,
              background: "var(--bg3)",
              borderRadius: 8,
              padding: "7px 10px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 800,
                color: "var(--txt)",
                fontFamily: "var(--mono)",
              }}
            >
              {item.val}
            </div>
            <div style={{ fontSize: 10, color: "var(--txt3)", marginTop: 1 }}>
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main View ─────────────────────────────────────────────────────────────────
export default function AIPlannerView() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedAt, setGeneratedAt] = useState(null);
  const [activeTab, setActiveTab] = useState("today");

  // Chat State
  const [chatMessages, setChatMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm your AI study coach. Feel free to ask me anything about your schedule, how to study for an exam, or if you just need a motivational push!",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatting, setIsChatting] = useState(false);
  const chatEndRef = useRef(null);

  // Load saved plan and chat history on component mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("gr_ai_state");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.plan) setPlan(parsed.plan);
        if (parsed.generatedAt) setGeneratedAt(parsed.generatedAt);
        if (parsed.chatMessages) setChatMessages(parsed.chatMessages);
      }
    } catch (e) {
      console.error("Failed to load AI state from local storage", e);
    }
  }, []);

  const generate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = collectAllData();
      const res = await fetch("/api/ai-planner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.success)
        throw new Error(json.error || "Failed to generate plan");

      const initialChat = [
        {
          role: "assistant",
          content:
            "Hi! I've generated a fresh plan for you based on your current data. You can ask me to add, change, or remove subjects right here!",
        },
      ];

      setPlan(json.plan);
      setGeneratedAt(json.generatedAt);
      setChatMessages(initialChat);
      setActiveTab("today");

      // Save to local storage
      try {
        localStorage.setItem(
          "gr_ai_state",
          JSON.stringify({
            plan: json.plan,
            generatedAt: json.generatedAt,
            chatMessages: initialChat,
          }),
        );
      } catch (e) {}
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Send message to AI Chat
  const sendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatting) return;

    const userMsg = { role: "user", content: chatInput };
    const newMsgs = [...chatMessages, userMsg];
    setChatMessages(newMsgs);
    setChatInput("");
    setIsChatting(true);

    // Save immediately so user message persists if page refreshes
    try {
      const saved = JSON.parse(localStorage.getItem("gr_ai_state") || "{}");
      localStorage.setItem(
        "gr_ai_state",
        JSON.stringify({ ...saved, chatMessages: newMsgs }),
      );
    } catch (e) {}

    try {
      const data = collectAllData();
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMsgs, contextData: data, plan }),
      });
      const json = await res.json();

      if (json.reply) {
        let replyText = json.reply;

        // INTERCEPT PLAN UPDATES WITH BULLETPROOF REGEX
        const match = replyText.match(
          /<UPDATE_PLAN>([\s\S]*?)<\/UPDATE_PLAN>/i,
        );
        if (match) {
          try {
            // Remove markdown code blocks just in case the AI generated them
            let cleanJson = match[1]
              .replace(/```json/gi, "")
              .replace(/```/gi, "")
              .trim();

            // Find the literal array bounds in case AI included extra text inside the tags
            const firstBracket = cleanJson.indexOf("[");
            const lastBracket = cleanJson.lastIndexOf("]");
            if (firstBracket !== -1 && lastBracket !== -1) {
              cleanJson = cleanJson.substring(firstBracket, lastBracket + 1);
            }

            const updatedTodayPlan = JSON.parse(cleanJson);

            setPlan((prev) => {
              const newPlan = { ...prev, todayPlan: updatedTodayPlan };
              // Save updated plan to local storage
              const saved = JSON.parse(
                localStorage.getItem("gr_ai_state") || "{}",
              );
              localStorage.setItem(
                "gr_ai_state",
                JSON.stringify({ ...saved, plan: newPlan }),
              );
              return newPlan;
            });

            // Strip the JSON block and tags from the readable reply
            replyText = replyText.replace(match[0], "").trim();
            if (!replyText)
              replyText = "I've successfully updated your Today's Plan!";
          } catch (err) {
            console.error("Failed to parse the updated plan JSON from AI", err);
          }
        }

        const finalMsgs = [
          ...newMsgs,
          { role: "assistant", content: replyText },
        ];
        setChatMessages(finalMsgs);

        // Save assistant reply
        try {
          const saved = JSON.parse(localStorage.getItem("gr_ai_state") || "{}");
          localStorage.setItem(
            "gr_ai_state",
            JSON.stringify({ ...saved, chatMessages: finalMsgs }),
          );
        } catch (e) {}
      }
    } catch (err) {
      const errMsgs = [
        ...newMsgs,
        {
          role: "assistant",
          content:
            "Oops, something went wrong. Check your connection and try again!",
        },
      ];
      setChatMessages(errMsgs);
      try {
        const saved = JSON.parse(localStorage.getItem("gr_ai_state") || "{}");
        localStorage.setItem(
          "gr_ai_state",
          JSON.stringify({ ...saved, chatMessages: errMsgs }),
        );
      } catch (e) {}
    } finally {
      setIsChatting(false);
    }
  };

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (activeTab === "chat") {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, activeTab, isChatting]);

  // ── Filter out past sessions client-side as a safety net ──────────────────
  const nowMins = (() => {
    const n = new Date();
    return n.getHours() * 60 + n.getMinutes();
  })();

  const futureSessions =
    plan?.todayPlan?.filter((s) => {
      const sessionMins = parseTimeToMins(s.time);
      return sessionMins >= nowMins - 15;
    }) ?? [];

  const colorMap = {
    red: "#e05252",
    orange: "#e8924a",
    yellow: "#d4b44a",
    green: "#4caf7d",
  };

  const tabs = [
    { id: "today", label: "Today's Plan" },
    { id: "week", label: "Week View" },
    { id: "exams", label: "Exam Strategy" },
    { id: "insights", label: "Insights" },
    { id: "chat", label: "Coach Chat" },
  ];

  return (
    <div
      className="page"
      style={{
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { from { opacity: 0.4; } to { opacity: 0.8; } }
        .ai-fadein { animation: fadeUp .35s ease forwards; }
      `}</style>

      {/* ── Header ── */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 4,
          gap: 12,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: "-.03em",
              color: "var(--txt)",
              marginBottom: 2,
            }}
          >
            AI Study Planner
          </h1>
          <p style={{ fontSize: 13, color: "var(--txt3)", margin: 0 }}>
            Personalized plan based on your real data
          </p>
        </div>
        <button
          onClick={generate}
          disabled={loading}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "10px 18px",
            borderRadius: 11,
            border: "none",
            background: loading ? "var(--bg3)" : "var(--txt)",
            color: loading ? "var(--txt3)" : "var(--bg)",
            fontFamily: "var(--font)",
            fontSize: 13,
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
            flexShrink: 0,
            transition: "all .2s",
          }}
        >
          {loading ? (
            <>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{ animation: "spin 1s linear infinite" }}
              >
                <path d="M21 12a9 9 0 11-6.219-8.56" />
              </svg>
              Thinking...
            </>
          ) : (
            <>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              {plan ? "Regenerate" : "Generate Plan"}
            </>
          )}
        </button>
      </div>

      {/* ── Error ── */}
      {error && (
        <div
          style={{
            background: "var(--red)15",
            border: "1px solid var(--red)40",
            borderRadius: 12,
            padding: "12px 14px",
            marginBottom: 16,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--red)" }}>
            ⚠ {error}
          </div>
          <div style={{ fontSize: 12, color: "var(--txt3)", marginTop: 3 }}>
            Check your GROQ_API_KEY in .env.local
          </div>
        </div>
      )}

      {/* ── Empty state ── */}
      {!plan && !loading && !error && (
        <div style={{ textAlign: "center", padding: "52px 20px" }}>
          <div style={{ fontSize: 48, marginBottom: 14 }}>🧠</div>
          <div
            style={{
              fontSize: 17,
              fontWeight: 700,
              color: "var(--txt)",
              marginBottom: 6,
            }}
          >
            Your AI Study Coach
          </div>
          <div
            style={{
              fontSize: 14,
              color: "var(--txt3)",
              lineHeight: 1.6,
              maxWidth: 320,
              margin: "0 auto 24px",
            }}
          >
            Analyses your tasks, exams, timetable, attendance, and history to
            build a plan from right now.
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              maxWidth: 300,
              margin: "0 auto 28px",
              textAlign: "left",
            }}
          >
            {[
              "📋 Schedule from current time",
              "📅 7-day week plan",
              "📝 Per-exam strategies",
              "💡 Data-driven insights",
              "💬 1-on-1 AI Chat (Add/Edit Plan dynamically)",
            ].map((f) => (
              <div
                key={f}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  color: "var(--txt2)",
                  background: "var(--bg2)",
                  border: "1px solid var(--border)",
                  borderRadius: 9,
                  padding: "8px 12px",
                }}
              >
                {f}
              </div>
            ))}
          </div>
          <button
            onClick={generate}
            style={{
              padding: "13px 32px",
              borderRadius: 12,
              border: "none",
              background: "var(--txt)",
              color: "var(--bg)",
              fontFamily: "var(--font)",
              fontSize: 15,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Generate My Plan →
          </button>
        </div>
      )}

      {/* ── Loading skeleton ── */}
      {loading && (
        <div style={{ padding: "32px 0" }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                height: 80,
                background: "var(--bg3)",
                borderRadius: 13,
                marginBottom: 10,
                animation: "pulse 1.5s ease-in-out infinite alternate",
                opacity: 1 - i * 0.2,
              }}
            />
          ))}
          <div
            style={{
              textAlign: "center",
              marginTop: 20,
              fontSize: 13,
              color: "var(--txt3)",
            }}
          >
            Building your schedule from{" "}
            {new Date().toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })}
            ...
          </div>
        </div>
      )}

      {/* ── Plan output ── */}
      {plan && !loading && (
        <div className="ai-fadein">
          {/* Greeting card */}
          <div
            style={{
              display: "flex",
              gap: 16,
              alignItems: "center",
              background: "var(--bg2)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              padding: 16,
              marginBottom: 14,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 6,
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 800,
                    letterSpacing: ".07em",
                    padding: "3px 9px",
                    borderRadius: 6,
                    background: (colorMap[plan.scoreColor] || "#5b8def") + "20",
                    color: colorMap[plan.scoreColor] || "#5b8def",
                  }}
                >
                  {plan.scoreLabel}
                </span>
                {generatedAt && (
                  <span style={{ fontSize: 10, color: "var(--txt3)" }}>
                    {new Date(generatedAt).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                )}
              </div>
              <p
                style={{
                  fontSize: 14,
                  color: "var(--txt)",
                  lineHeight: 1.5,
                  margin: "0 0 10px",
                  fontWeight: 500,
                }}
              >
                {plan.greeting}
              </p>
              {plan.topPriority && (
                <div
                  style={{
                    background: "var(--bg3)",
                    border: "1px solid var(--border)",
                    borderRadius: 9,
                    padding: "8px 11px",
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: ".06em",
                      color: "var(--txt3)",
                      textTransform: "uppercase",
                      marginBottom: 2,
                    }}
                  >
                    Top Priority Now
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--txt)",
                    }}
                  >
                    {plan.topPriority}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Attendance Alert */}
          {plan.attendanceAction && plan.attendanceAction !== "null" && (
            <div
              style={{
                background: "var(--red)15",
                border: "1px solid var(--red)40",
                borderRadius: 12,
                padding: "11px 14px",
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: "var(--red)",
                  letterSpacing: ".06em",
                  textTransform: "uppercase",
                  marginBottom: 3,
                }}
              >
                ⚠️ Attendance Alert
              </div>
              <div
                style={{ fontSize: 13, color: "var(--txt2)", lineHeight: 1.5 }}
              >
                {plan.attendanceAction}
              </div>
            </div>
          )}

          {/* Tabs */}
          <div
            style={{
              display: "flex",
              gap: 4,
              marginBottom: 14,
              overflowX: "auto",
              paddingBottom: 2,
            }}
          >
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  padding: "7px 13px",
                  borderRadius: 9,
                  border: "none",
                  flexShrink: 0,
                  background: activeTab === t.id ? "var(--txt)" : "var(--bg3)",
                  color: activeTab === t.id ? "var(--bg)" : "var(--txt2)",
                  fontFamily: "var(--font)",
                  fontSize: 12,
                  fontWeight: activeTab === t.id ? 700 : 500,
                  cursor: "pointer",
                  transition: "all .15s",
                }}
              >
                {t.label}
                {t.id === "today" && futureSessions.length > 0 && (
                  <span
                    style={{
                      marginLeft: 5,
                      fontSize: 9,
                      fontWeight: 800,
                      background: "var(--blue)",
                      color: "#fff",
                      padding: "1px 5px",
                      borderRadius: 4,
                    }}
                  >
                    {futureSessions.length}
                  </span>
                )}
                {t.id === "chat" && <span style={{ marginLeft: 5 }}>💬</span>}
              </button>
            ))}
          </div>

          {/* ── TODAY TAB ── */}
          {activeTab === "today" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 12px",
                  background: "var(--bg3)",
                  borderRadius: 9,
                  marginBottom: 4,
                }}
              >
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#4caf7d",
                    boxShadow: "0 0 0 3px #4caf7d30",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 12,
                    color: "var(--txt3)",
                    fontFamily: "var(--mono)",
                  }}
                >
                  Now:{" "}
                  {new Date().toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span style={{ fontSize: 12, color: "var(--txt3)" }}>·</span>
                <span style={{ fontSize: 12, color: "var(--txt2)" }}>
                  {futureSessions.length > 0
                    ? `${futureSessions.length} session${futureSessions.length > 1 ? "s" : ""} remaining today`
                    : "No more sessions for today"}
                </span>
              </div>

              {futureSessions.length > 0 ? (
                futureSessions.map((session, i) => (
                  <TodaySession
                    key={i}
                    session={session}
                    idx={i}
                    isNext={i === 0}
                  />
                ))
              ) : (
                <div style={{ textAlign: "center", padding: "32px 0" }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>✅</div>
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "var(--txt)",
                      marginBottom: 4,
                    }}
                  >
                    You're done for today!
                  </div>
                  <div style={{ fontSize: 13, color: "var(--txt3)" }}>
                    No more study sessions scheduled. Rest up or regenerate for
                    tomorrow.
                  </div>
                </div>
              )}

              {plan.motivationalNote && (
                <div
                  style={{
                    marginTop: 4,
                    padding: "13px 14px",
                    background: "var(--blue)12",
                    border: "1px solid var(--blue)33",
                    borderRadius: 12,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "var(--blue)",
                      textTransform: "uppercase",
                      letterSpacing: ".06em",
                      marginBottom: 4,
                    }}
                  >
                    💬 Coach Note
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--txt2)",
                      lineHeight: 1.6,
                    }}
                  >
                    {plan.motivationalNote}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── WEEK TAB ── */}
          {activeTab === "week" && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2,1fr)",
                gap: 8,
              }}
            >
              {plan.weekPlan?.map((day, i) => (
                <WeekDayCard key={i} day={day} />
              ))}
            </div>
          )}

          {/* ── EXAMS TAB ── */}
          {activeTab === "exams" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {plan.examStrategy?.length > 0 ? (
                plan.examStrategy.map((exam, i) => (
                  <ExamStrategyCard key={i} exam={exam} />
                ))
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "28px 0",
                    color: "var(--txt3)",
                    fontSize: 13,
                  }}
                >
                  No upcoming exams — add them in Exam Countdown
                </div>
              )}
            </div>
          )}

          {/* ── INSIGHTS TAB ── */}
          {activeTab === "insights" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {plan.insights?.map((ins, i) => (
                <InsightCard key={i} insight={ins} />
              ))}
            </div>
          )}

          {/* ── CHAT TAB ── */}
          {activeTab === "chat" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: 450,
                background: "var(--bg2)",
                borderRadius: 14,
                border: "1px solid var(--border)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  flex: 1,
                  overflowY: "auto",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    style={{
                      alignSelf:
                        msg.role === "user" ? "flex-end" : "flex-start",
                      maxWidth: "85%",
                      background:
                        msg.role === "user" ? "var(--txt)" : "var(--bg3)",
                      color: msg.role === "user" ? "var(--bg)" : "var(--txt)",
                      padding: "10px 14px",
                      borderRadius: 14,
                      borderBottomRightRadius: msg.role === "user" ? 4 : 14,
                      borderBottomLeftRadius: msg.role === "assistant" ? 4 : 14,
                      fontSize: 13,
                      lineHeight: 1.5,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {msg.content}
                  </div>
                ))}
                {isChatting && (
                  <div
                    style={{
                      alignSelf: "flex-start",
                      background: "var(--bg3)",
                      color: "var(--txt2)",
                      padding: "10px 14px",
                      borderRadius: 14,
                      borderBottomLeftRadius: 4,
                      fontSize: 13,
                    }}
                  >
                    Thinking...
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Quick Actions Array */}
              <div
                style={{
                  padding: "8px 12px",
                  borderTop: "1px solid var(--border)",
                  display: "flex",
                  gap: 8,
                  overflowX: "auto",
                  background: "var(--bg3)",
                }}
              >
                <button
                  onClick={() =>
                    setChatInput(
                      "I want to add a new subject to my plan today: ",
                    )
                  }
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "6px 12px",
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    background: "var(--bg)",
                    color: "var(--txt)",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  ➕ Add Subject
                </button>
                <button
                  onClick={() =>
                    setChatInput("I want to edit/change a subject in my plan: ")
                  }
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "6px 12px",
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    background: "var(--bg)",
                    color: "var(--txt)",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  ✏️ Edit Subject
                </button>
                <button
                  onClick={() =>
                    setChatInput(
                      "Please remove this subject from my plan today: ",
                    )
                  }
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: "6px 12px",
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    background: "var(--bg)",
                    color: "var(--txt)",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  🗑️ Remove Subject
                </button>
              </div>

              <form
                onSubmit={sendChatMessage}
                style={{
                  display: "flex",
                  gap: 8,
                  padding: "10px",
                  background: "var(--bg)",
                  borderTop: "1px solid var(--border)",
                }}
              >
                <input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask your AI coach..."
                  style={{
                    flex: 1,
                    background: "var(--bg3)",
                    border: "1px solid var(--border)",
                    borderRadius: 9,
                    padding: "10px 14px",
                    color: "var(--txt)",
                    fontSize: 13,
                    outline: "none",
                  }}
                />
                <button
                  type="submit"
                  disabled={isChatting || !chatInput.trim()}
                  style={{
                    background: "var(--txt)",
                    color: "var(--bg)",
                    border: "none",
                    borderRadius: 9,
                    padding: "0 18px",
                    fontWeight: 700,
                    cursor:
                      !chatInput.trim() || isChatting
                        ? "not-allowed"
                        : "pointer",
                    opacity: !chatInput.trim() || isChatting ? 0.5 : 1,
                    transition: "opacity .2s",
                  }}
                >
                  Send
                </button>
              </form>
            </div>
          )}

          {/* Footer */}
          {activeTab !== "chat" && (
            <div
              style={{
                textAlign: "center",
                marginTop: 20,
                paddingTop: 16,
                borderTop: "1px solid var(--border)",
              }}
            >
              <button
                onClick={generate}
                style={{
                  padding: "8px 20px",
                  borderRadius: 9,
                  border: "1px solid var(--border)",
                  background: "transparent",
                  color: "var(--txt2)",
                  fontFamily: "var(--font)",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                ↺ Regenerate Plan
              </button>
              <div style={{ fontSize: 11, color: "var(--txt3)", marginTop: 6 }}>
                Powered by Groq · llama-3.3-70b
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
