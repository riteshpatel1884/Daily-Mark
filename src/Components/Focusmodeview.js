"use client";
import { useApp } from "@/Components/store";
import { useState, useEffect, useRef, useCallback } from "react";

const TASK_COLORS = {
  assignment: "#5b8def",
  exam: "#e05252",
  lab: "#4caf7d",
  project: "#9b72cf",
  study: "#d4b44a",
  other: "#888",
};

// ── Circular SVG timer ring ──
function Ring({ pct, color, size = 220, stroke = 10, children }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * (1 - pct);
  return (
    <div
      style={{ position: "relative", width: size, height: size, flexShrink: 0 }}
    >
      <svg
        width={size}
        height={size}
        style={{ position: "absolute", inset: 0 }}
      >
        {/* track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
        />
        {/* fill */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circ}
          strokeDashoffset={dash}
          strokeLinecap="round"
          style={{
            transform: "rotate(-90deg)",
            transformOrigin: "50% 50%",
            transition: "stroke-dashoffset .5s linear",
          }}
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
        {children}
      </div>
    </div>
  );
}

const MODES = [
  { id: "pomodoro", label: "Pomodoro", defaultMins: 25 },
  { id: "short", label: "Short Break", defaultMins: 5 },
  { id: "long", label: "Long Break", defaultMins: 15 },
  { id: "custom", label: "Custom", defaultMins: 45 },
];

export default function FocusModeView() {
  const { tasks, toggleTask, addPomodoro } = useApp();
  const pendingTasks = tasks.filter((t) => !t.done);
  const doneTasks = tasks.filter((t) => t.done);

  // ── Timer state ──
  const [modeId, setModeId] = useState("pomodoro");
  const [customMins, setCustomMins] = useState(45);
  const [secsLeft, setSecsLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [focusTask, setFocusTask] = useState(null); // id of active task
  const intervalRef = useRef(null);
  const totalSecs = useRef(25 * 60);

  // ── Quote pool ──
  const quotes = [
    "Focus is the art of knowing what to ignore.",
    "One task. One session. Full attention.",
    "Deep work is the superpower of the 21st century.",
    "You don't need more time, you need more focus.",
    "Small steps every day beat big leaps once in a while.",
  ];
  const [quote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);

  function getModeSeconds(id) {
    if (id === "custom") return customMins * 60;
    return (MODES.find((m) => m.id === id)?.defaultMins ?? 25) * 60;
  }

  function applyMode(id) {
    clearInterval(intervalRef.current);
    setRunning(false);
    setFinished(false);
    setModeId(id);
    const s = getModeSeconds(id);
    totalSecs.current = s;
    setSecsLeft(s);
  }

  function applyCustom(mins) {
    const m = Math.max(1, Math.min(180, mins));
    setCustomMins(m);
    if (modeId === "custom") {
      clearInterval(intervalRef.current);
      setRunning(false);
      setFinished(false);
      const s = m * 60;
      totalSecs.current = s;
      setSecsLeft(s);
    }
  }

  const tick = useCallback(() => {
    setSecsLeft((prev) => {
      if (prev <= 1) {
        clearInterval(intervalRef.current);
        setRunning(false);
        setFinished(true);
        // Auto-log pomodoro if pomodoro mode and a task selected
        if (modeId === "pomodoro") {
          setCycles((c) => c + 1);
          if (focusTask) addPomodoro(focusTask);
        }
        // Browser notification
        try {
          if (Notification.permission === "granted") {
            new Notification("⏰ Session complete!", {
              body: "Time for a break.",
            });
          }
        } catch {}
        return 0;
      }
      return prev - 1;
    });
  }, [modeId, focusTask, addPomodoro]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(tick, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, tick]);

  // Request notification permission once
  useEffect(() => {
    try {
      if (Notification.permission === "default")
        Notification.requestPermission();
    } catch {}
  }, []);

  function toggleTimer() {
    if (finished) {
      applyMode(modeId);
      return;
    }
    setRunning((r) => !r);
  }

  function resetTimer() {
    clearInterval(intervalRef.current);
    setRunning(false);
    setFinished(false);
    const s = getModeSeconds(modeId);
    totalSecs.current = s;
    setSecsLeft(s);
  }

  const mins = String(Math.floor(secsLeft / 60)).padStart(2, "0");
  const secs = String(secsLeft % 60).padStart(2, "0");
  const pct = totalSecs.current > 0 ? secsLeft / totalSecs.current : 1;

  const modeColor =
    modeId === "pomodoro"
      ? "var(--red)"
      : modeId === "short"
        ? "var(--green)"
        : modeId === "long"
          ? "var(--blue)"
          : "var(--purple)";

  return (
    <div className="page fadeUp" style={{ paddingTop: 28, paddingBottom: 40 }}>
      {/* ── Header ── */}
      <div style={{ marginBottom: 28 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 4,
          }}
        >
          <span style={{ fontSize: 22 }}>🎯</span>
          <h1
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 800,
              color: "var(--txt)",
            }}
          >
            Focus Mode
          </h1>
        </div>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: "var(--txt3)",
            fontStyle: "italic",
          }}
        >
          "{quote}"
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          alignItems: "start",
        }}
      >
        {/* ── LEFT: Timer ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Mode tabs */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {MODES.map((m) => (
              <button
                key={m.id}
                onClick={() => applyMode(m.id)}
                style={{
                  padding: "6px 13px",
                  borderRadius: 99,
                  border: "1.5px solid",
                  borderColor: modeId === m.id ? modeColor : "var(--border)",
                  background:
                    modeId === m.id ? modeColor + "18" : "transparent",
                  color: modeId === m.id ? modeColor : "var(--txt2)",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "var(--font)",
                  transition: "all .15s",
                }}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Custom duration input */}
          {modeId === "custom" && (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{ fontSize: 13, color: "var(--txt2)", fontWeight: 500 }}
              >
                Duration:
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <button
                  onClick={() => applyCustom(customMins - 5)}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: "var(--bg3)",
                    color: "var(--txt)",
                    fontSize: 16,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  −
                </button>
                <span
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 18,
                    fontWeight: 700,
                    color: "var(--txt)",
                    minWidth: 44,
                    textAlign: "center",
                  }}
                >
                  {customMins}m
                </span>
                <button
                  onClick={() => applyCustom(customMins + 5)}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: "var(--bg3)",
                    color: "var(--txt)",
                    fontSize: 16,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Ring timer */}
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Ring
              pct={pct}
              color={finished ? "var(--green)" : modeColor}
              size={200}
              stroke={8}
            >
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 42,
                  fontWeight: 800,
                  color: "var(--txt)",
                  letterSpacing: "-2px",
                  lineHeight: 1,
                }}
              >
                {mins}:{secs}
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "var(--txt3)",
                  marginTop: 4,
                  textTransform: "uppercase",
                  letterSpacing: ".08em",
                }}
              >
                {finished ? "✓ Done!" : running ? "focusing..." : "paused"}
              </div>
              {cycles > 0 && (
                <div
                  style={{
                    fontSize: 11,
                    color: modeColor,
                    fontWeight: 700,
                    marginTop: 3,
                  }}
                >
                  🍅 {cycles} {cycles === 1 ? "cycle" : "cycles"}
                </div>
              )}
            </Ring>
          </div>

          {/* Controls */}
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button
              onClick={resetTimer}
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                border: "1.5px solid var(--border)",
                background: "var(--bg3)",
                color: "var(--txt2)",
                fontSize: 18,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ↺
            </button>
            <button
              onClick={toggleTimer}
              style={{
                height: 44,
                padding: "0 32px",
                borderRadius: 12,
                border: "none",
                background: finished
                  ? "var(--green)"
                  : running
                    ? "var(--bg4)"
                    : modeColor,
                color: finished || running ? "var(--txt)" : "#fff",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "var(--font)",
                transition: "all .2s",
                boxShadow: running ? "none" : `0 4px 16px ${modeColor}44`,
              }}
            >
              {finished ? "Start Again" : running ? "⏸ Pause" : "▶ Start"}
            </button>
          </div>

          {/* Active task badge */}
          {focusTask && (
            <div
              style={{
                background: modeColor + "14",
                border: `1px solid ${modeColor}33`,
                borderRadius: 10,
                padding: "9px 13px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 9,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: ".08em",
                    color: modeColor,
                    marginBottom: 2,
                  }}
                >
                  Focusing on
                </div>
                <div
                  style={{ fontSize: 13, fontWeight: 600, color: "var(--txt)" }}
                >
                  {tasks.find((t) => t.id === focusTask)?.title || "—"}
                </div>
              </div>
              <button
                onClick={() => setFocusTask(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--txt3)",
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>
          )}
        </div>

        {/* ── RIGHT: Tasks ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Stats strip */}
          <div style={{ display: "flex", gap: 10 }}>
            {[
              {
                label: "Pending",
                val: pendingTasks.length,
                color: "var(--orange)",
              },
              { label: "Done", val: doneTasks.length, color: "var(--green)" },
              { label: "Cycles", val: cycles, color: "var(--red)" },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  flex: 1,
                  background: "var(--bg3)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: "10px 12px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 800,
                    color: s.color,
                    letterSpacing: "-.03em",
                  }}
                >
                  {s.val}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: "var(--txt3)",
                    textTransform: "uppercase",
                    letterSpacing: ".07em",
                    marginTop: 2,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Task list */}
          <div
            style={{
              background: "var(--bg2)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "11px 14px 8px",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: ".08em",
                  color: "var(--txt3)",
                }}
              >
                Today's Tasks
              </span>
              <span style={{ fontSize: 11, color: "var(--txt3)" }}>
                {doneTasks.length}/{tasks.length}
              </span>
            </div>

            <div style={{ maxHeight: 340, overflowY: "auto" }}>
              {tasks.length === 0 ? (
                <div style={{ padding: "28px 0", textAlign: "center" }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>✅</div>
                  <div style={{ fontSize: 13, color: "var(--txt3)" }}>
                    No tasks for today
                  </div>
                </div>
              ) : (
                [...pendingTasks, ...doneTasks].map((task) => {
                  const color = TASK_COLORS[task.type] || "#888";
                  const isFocus = focusTask === task.id;
                  return (
                    <div
                      key={task.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "10px 14px",
                        borderBottom: "1px solid var(--border)",
                        background: isFocus ? color + "10" : "transparent",
                        opacity: task.done ? 0.45 : 1,
                        transition: "all .15s",
                      }}
                    >
                      {/* Checkbox */}
                      <div
                        onClick={() => toggleTask(task.id)}
                        className={`chk ${task.done ? "on" : ""}`}
                        style={{ flexShrink: 0 }}
                      >
                        {task.done && (
                          <svg
                            width="11"
                            height="11"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="var(--chk-i)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>

                      {/* Color strip */}
                      <div
                        style={{
                          width: 3,
                          alignSelf: "stretch",
                          borderRadius: 99,
                          background: color,
                          flexShrink: 0,
                          minHeight: 18,
                        }}
                      />

                      {/* Title */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "var(--txt)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            textDecoration: task.done ? "line-through" : "none",
                          }}
                        >
                          {task.title}
                        </div>
                        {task.subject && (
                          <div
                            style={{
                              fontSize: 10,
                              color: "var(--txt3)",
                              marginTop: 1,
                            }}
                          >
                            {task.subject}
                          </div>
                        )}
                      </div>

                      {/* Pomodoro count */}
                      {task.pomodoros > 0 && (
                        <span
                          style={{
                            fontSize: 10,
                            color: "var(--red)",
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          🍅{task.pomodoros}
                        </span>
                      )}

                      {/* Focus button */}
                      {!task.done && (
                        <button
                          onClick={() => setFocusTask(isFocus ? null : task.id)}
                          title={isFocus ? "Remove focus" : "Focus on this"}
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: 7,
                            flexShrink: 0,
                            border: `1.5px solid ${isFocus ? color : "var(--border)"}`,
                            background: isFocus ? color + "20" : "transparent",
                            color: isFocus ? color : "var(--txt3)",
                            cursor: "pointer",
                            fontSize: 13,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          🎯
                        </button>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Tip */}
          <div
            style={{
              background: "var(--bg3)",
              border: "1px solid var(--border)",
              borderRadius: 10,
              padding: "10px 13px",
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: ".08em",
                color: "var(--txt3)",
                marginBottom: 4,
              }}
            >
              💡 Tip
            </div>
            <div
              style={{ fontSize: 12, color: "var(--txt2)", lineHeight: 1.5 }}
            >
              Click 🎯 on a task to link it with the timer. Completing a
              Pomodoro cycle automatically logs it to that task.
            </div>
          </div>
        </div>
      </div>

      {/* Mobile layout override */}
      <style>{`
        @media (max-width: 640px) {
          .focus-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
