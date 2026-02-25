"use client";
import { useState, useCallback } from "react";
import { useApp } from "@/Components/store";

// ── Helpers ──────────────────────────────────────────────────────────────────
function collectAllData() {
  try {
    const todayKey = new Date().toISOString().slice(0, 10);
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
    };
  } catch {
    return {};
  }
}

function ScoreRing({ score, color }) {
  const colorMap = {
    red: "#e05252",
    orange: "#e8924a",
    yellow: "#d4b44a",
    green: "#4caf7d",
  };
  const hex = colorMap[color] || "#5b8def";
  const r = 44,
    c = 2 * Math.PI * r;
  return (
    <div
      style={{ position: "relative", width: 108, height: 108, flexShrink: 0 }}
    >
      <svg
        width="108"
        height="108"
        viewBox="0 0 108 108"
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          cx="54"
          cy="54"
          r={r}
          fill="none"
          stroke="var(--border)"
          strokeWidth="8"
        />
        <circle
          cx="54"
          cy="54"
          r={r}
          fill="none"
          stroke={hex}
          strokeWidth="8"
          strokeDasharray={`${(score / 100) * c} ${c}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: hex,
            letterSpacing: "-.03em",
            lineHeight: 1,
          }}
        >
          {score}
        </div>
        <div
          style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: ".06em",
            textTransform: "uppercase",
            color: "var(--txt3)",
            marginTop: 1,
          }}
        >
          score
        </div>
      </div>
    </div>
  );
}

function InsightCard({ insight }) {
  const bgMap = {
    warning: "var(--orange)15",
    tip: "var(--blue)12",
    success: "var(--green, #4caf7d)15",
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
  };
  const s = map[priority] || map.low;
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

function TodaySession({ session, idx }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        padding: "12px 14px",
        background: "var(--bg2)",
        border: "1px solid var(--border)",
        borderRadius: 13,
        alignItems: "flex-start",
      }}
    >
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
            background: "var(--bg4)",
            border: "1.5px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 800,
            color: "var(--txt3)",
          }}
        >
          {idx + 1}
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
              color: "var(--txt3)",
            }}
          >
            {session.time}
          </span>
          <PriorityBadge priority={session.priority} />
          <span style={{ fontSize: 11, color: "var(--txt3)" }}>
            🍅 ×{session.pomodoros}
          </span>
        </div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "var(--txt)",
            marginBottom: 3,
          }}
        >
          {session.subject}
        </div>
        <div style={{ fontSize: 13, color: "var(--txt2)", marginBottom: 4 }}>
          {session.task}
        </div>
        {session.reason && (
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
  const urgencyColor = {
    critical: "var(--red)",
    high: "var(--orange)",
    medium: "var(--yellow, #d4b44a)",
    low: "var(--txt3)",
  };
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
        ].map((s) => (
          <div
            key={s.label}
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
              {s.val}
            </div>
            <div style={{ fontSize: 10, color: "var(--txt3)", marginTop: 1 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main View ─────────────────────────────────────────────────────────────────
export default function AIPlannerView() {
  const { tasks, exams, timetable, subjects, history, cgpaGoal, sem } =
    useApp();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generatedAt, setGeneratedAt] = useState(null);
  const [activeTab, setActiveTab] = useState("today");

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
      setPlan(json.plan);
      setGeneratedAt(json.generatedAt);
      setActiveTab("today");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

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
  ];

  return (
    <div className="page">
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

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } } .ai-fadein { animation: fadeUp .35s ease forwards; }`}</style>

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

      {/* ── Empty / Loading state ── */}
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
            generate a fully personalized study plan.
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
              "📋 Today's optimised schedule",
              "📅 7-day week plan",
              "📝 Per-exam strategies",
              "💡 Data-driven insights",
              "🎯 Single top priority",
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
              letterSpacing: "-.01em",
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
                opacity: 1 - i * 0.2,
                animation: "pulse 1.5s ease-in-out infinite alternate",
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
            Analysing your tasks, exams, timetable & history...
          </div>
          <style>{`@keyframes pulse { from { opacity: 0.4; } to { opacity: 0.8; } }`}</style>
        </div>
      )}

      {/* ── Plan output ── */}
      {plan && !loading && (
        <div className="ai-fadein">
          {/* Score + Greeting */}
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
            <ScoreRing
              score={plan.overallScore || 0}
              color={plan.scoreColor || "blue"}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 6,
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
          {plan.attendanceAction && (
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
              </button>
            ))}
          </div>

          {/* ── TODAY TAB ── */}
          {activeTab === "today" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {plan.todayPlan?.length > 0 ? (
                plan.todayPlan.map((session, i) => (
                  <TodaySession key={i} session={session} idx={i} />
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
                  No sessions scheduled for today
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

          {/* Regenerate footer */}
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
        </div>
      )}
    </div>
  );
}
