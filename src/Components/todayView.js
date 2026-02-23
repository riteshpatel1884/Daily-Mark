"use client";
import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useApp, TASK_TYPES, SUBJECTS } from "@/Components/store";
import AddTaskModal from "@/Components/addtaskmodal";

const P_COLOR = {
  low: "var(--green)",
  medium: "var(--orange)",
  high: "var(--red)",
};
const POMO_MINS = 25;

// ── POMODORO MODAL ───────────────────────────────────
function PomodoroModal({ task, onClose, onComplete }) {
  const WORK = POMO_MINS * 60;
  const BREAK = 5 * 60;
  const [secs, setSecs] = useState(WORK);
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState("work"); // work | break
  const [rounds, setRounds] = useState(0);
  const intRef = useRef(null);

  const tick = useCallback(() => {
    setSecs((s) => {
      if (s <= 1) {
        clearInterval(intRef.current);
        setRunning(false);
        if (phase === "work") {
          setRounds((r) => r + 1);
          onComplete(task.id);
          setPhase("break");
          return BREAK;
        } else {
          setPhase("work");
          return WORK;
        }
      }
      return s - 1;
    });
  }, [phase, task.id, onComplete]);

  useEffect(() => {
    if (running) {
      intRef.current = setInterval(tick, 1000);
    } else clearInterval(intRef.current);
    return () => clearInterval(intRef.current);
  }, [running, tick]);

  const pct =
    phase === "work"
      ? ((WORK - secs) / WORK) * 100
      : ((BREAK - secs) / BREAK) * 100;
  const mins = String(Math.floor(secs / 60)).padStart(2, "0");
  const sec_s = String(secs % 60).padStart(2, "0");
  const size = 180,
    r = (size - 14) / 2,
    circ = 2 * Math.PI * r;
  const typeC = TASK_TYPES[task.type]?.color || "#888";

  return (
    <div
      className="overlay fadeIn"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="sheet" style={{ textAlign: "center" }}>
        <div className="drag-handle" />
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: ".08em",
            textTransform: "uppercase",
            color: "var(--txt3)",
            marginBottom: 4,
          }}
        >
          {phase === "work" ? "Focus Time" : "Break Time"}
        </div>
        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "var(--txt)",
            marginBottom: 20,
            padding: "0 20px",
            lineHeight: 1.4,
          }}
        >
          {task.text}
        </div>

        {/* Ring */}
        <div
          style={{
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 24,
          }}
        >
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="pomo-ring"
          >
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke="var(--border)"
              strokeWidth="7"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={phase === "work" ? typeC : "var(--green)"}
              strokeWidth="7"
              strokeDasharray={`${(pct / 100) * circ} ${circ}`}
              strokeLinecap="round"
              style={{ transition: "stroke-dasharray .5s ease" }}
            />
          </svg>
          {running && (
            <div
              className="pomo-ping"
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                border: `2px solid ${phase === "work" ? typeC : "var(--green)"}`,
                animation: "timerPing 1.5s ease-out infinite",
              }}
            />
          )}
          <div
            style={{
              position: "absolute",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 36,
                fontWeight: 500,
                color: "var(--txt)",
                letterSpacing: ".02em",
                lineHeight: 1,
              }}
            >
              {mins}:{sec_s}
            </div>
            <div style={{ fontSize: 11, color: "var(--txt3)", marginTop: 4 }}>
              Round {rounds + 1}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <button
            onClick={() => setRunning((r) => !r)}
            style={{
              padding: "12px 32px",
              borderRadius: 12,
              border: "none",
              background: running ? "var(--bg4)" : "var(--txt)",
              color: running ? "var(--txt)" : "var(--bg)",
              fontFamily: "var(--font)",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all .15s",
            }}
          >
            {running ? "Pause" : "Start"}
          </button>
          <button
            onClick={() => {
              setSecs(WORK);
              setRunning(false);
              setPhase("work");
            }}
            style={{
              padding: "12px 20px",
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "transparent",
              color: "var(--txt2)",
              fontFamily: "var(--font)",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        </div>

        <div style={{ fontSize: 12, color: "var(--txt3)" }}>
          {(task.pomodoros || 0) + rounds} 🍅 completed for this task
        </div>

        <button
          onClick={onClose}
          style={{
            marginTop: 14,
            background: "none",
            border: "none",
            color: "var(--txt3)",
            fontSize: 13,
            cursor: "pointer",
            fontFamily: "var(--font)",
          }}
        >
          Close timer
        </button>
      </div>
    </div>
  );
}

// ── TASK CARD ──────────────────────────────────────────────────────────────
function TaskCard({ task, onToggle, onDelete, onPomodoro }) {
  const [showPomo, setShowPomo] = useState(false);
  const typeInfo = TASK_TYPES[task.type] || TASK_TYPES.other;
  const daysLeft = task.deadline
    ? Math.ceil((task.deadline - Date.now()) / 86400000)
    : null;
  const isOverdue = daysLeft !== null && daysLeft < 0;
  const isUrgent = daysLeft !== null && daysLeft <= 1 && !task.done;

  return (
    <>
      <div
        className={`task ${task.done ? "done" : ""} ${isUrgent ? "urgent-glow" : ""}`}
      >
        {/* priority strip */}
        <div
          className="pstrip"
          style={{ background: P_COLOR[task.priority] }}
        />

        {/* checkbox */}
        <button
          className={`chk ${task.done ? "on" : ""}`}
          onClick={() => onToggle(task.id)}
        >
          {task.done && (
            <svg
              width="10"
              height="10"
              viewBox="0 0 12 12"
              fill="none"
              stroke="var(--chk-i)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="2 6 5 9 10 3" />
            </svg>
          )}
        </button>

        {/* content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 500,
              lineHeight: 1.45,
              color: task.done ? "var(--txt3)" : "var(--txt)",
              textDecoration: task.done ? "line-through" : "none",
              wordBreak: "break-word",
              marginBottom: 6,
            }}
          >
            {task.text}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              flexWrap: "wrap",
            }}
          >
            {/* type badge */}
            <span
              className="tbadge"
              style={{ color: typeInfo.color, background: typeInfo.bg }}
            >
              {typeInfo.label}
            </span>
            {/* subject */}
            {task.subject && (
              <span
                style={{ fontSize: 11, color: "var(--txt2)", fontWeight: 500 }}
              >
                {task.subject}
              </span>
            )}
            {/* deadline */}
            {daysLeft !== null && (
              <span
                className="countdown"
                style={{
                  background: isOverdue
                    ? "var(--red)20"
                    : daysLeft === 0
                      ? "var(--orange)20"
                      : daysLeft <= 2
                        ? "var(--yellow)20"
                        : "var(--bg4)",
                  color: isOverdue
                    ? "var(--red)"
                    : daysLeft === 0
                      ? "var(--orange)"
                      : daysLeft <= 2
                        ? "var(--yellow)"
                        : "var(--txt3)",
                }}
              >
                {isOverdue
                  ? `${Math.abs(daysLeft)}d overdue`
                  : daysLeft === 0
                    ? "Due today"
                    : daysLeft === 1
                      ? "Due tomorrow"
                      : `${daysLeft}d left`}
              </span>
            )}
            {/* pomodoros */}
            {(task.pomodoros || 0) > 0 && (
              <span style={{ fontSize: 11, color: "var(--txt3)" }}>
                🍅×{task.pomodoros}
              </span>
            )}
          </div>
        </div>

        {/* right actions */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            flexShrink: 0,
          }}
        >
          {!task.done && (
            <button
              onClick={() => setShowPomo(true)}
              title="Start Pomodoro"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontSize: 16,
                lineHeight: 1,
                opacity: 0.5,
                transition: "opacity .15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.5)}
            >
              🍅
            </button>
          )}
          <button
            onClick={() => onDelete(task.id)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--txt3)",
              padding: "2px",
              display: "flex",
              opacity: 0.4,
              transition: "opacity .15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.4)}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      {showPomo && (
        <PomodoroModal
          task={task}
          onClose={() => setShowPomo(false)}
          onComplete={onPomodoro}
        />
      )}
    </>
  );
}

// ── TODAY VIEW ─────────────────────────────────────────────────────────────
export default function TodayView() {
  const {
    tasks,
    toggleTask,
    deleteTask,
    addPomodoro,
    doneCount,
    progress,
    upcomingExams,
    sem,
  } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("deadline"); // deadline | priority | type

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const nextExam = upcomingExams[0];

  const sorted = useMemo(() => {
    let list =
      filter === "active"
        ? tasks.filter((t) => !t.done)
        : filter === "done"
          ? tasks.filter((t) => t.done)
          : [...tasks];
    if (sortBy === "deadline")
      list.sort((a, b) => (a.deadline || Infinity) - (b.deadline || Infinity));
    else if (sortBy === "priority") {
      const o = { high: 0, medium: 1, low: 2 };
      list.sort((a, b) => o[a.priority] - o[b.priority]);
    } else list.sort((a, b) => (a.type || "").localeCompare(b.type || ""));
    return list;
  }, [tasks, filter, sortBy]);

  const urgentCount = tasks.filter(
    (t) =>
      !t.done &&
      t.deadline &&
      Math.ceil((t.deadline - Date.now()) / 86400000) <= 1,
  ).length;
  const totalPomos = tasks.reduce((s, t) => s + (t.pomodoros || 0), 0);

  return (
    <>
      <div className="page">
        {/* ── HEADER ── */}
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 2,
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: ".08em",
                textTransform: "uppercase",
                color: "var(--txt3)",
              }}
            >
              {today}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--txt3)",
                fontFamily: "var(--mono)",
              }}
            >
              {sem}
            </div>
          </div>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: "-.03em",
              color: "var(--txt)",
              marginBottom: 16,
            }}
          >
            My Tasks
          </h1>

          {/* Progress card */}
          <div className="card" style={{ marginBottom: 10 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    letterSpacing: "-.04em",
                    color: "var(--txt)",
                  }}
                >
                  {progress}%
                </span>
                <span
                  style={{ fontSize: 13, color: "var(--txt3)", marginLeft: 6 }}
                >
                  done today
                </span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{ fontSize: 14, fontWeight: 700, color: "var(--txt)" }}
                >
                  {doneCount}
                  <span style={{ color: "var(--txt3)", fontWeight: 400 }}>
                    /{tasks.length}
                  </span>
                </div>
                {totalPomos > 0 && (
                  <div style={{ fontSize: 11, color: "var(--txt3)" }}>
                    🍅 {totalPomos} pomodoros
                  </div>
                )}
              </div>
            </div>
            <div className="ptrack">
              <div
                className="pfill"
                style={{ width: `${progress}%`, background: "var(--txt)" }}
              />
            </div>
          </div>

          {/* Alerts row */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {urgentCount > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 12px",
                  background: "var(--red)18",
                  border: "1px solid var(--red)44",
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--red)",
                }}
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                {urgentCount} task{urgentCount > 1 ? "s" : ""} due soon
              </div>
            )}
            {nextExam && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "7px 12px",
                  background:
                    nextExam.daysLeft <= 5 ? "var(--orange)18" : "var(--bg3)",
                  border: `1px solid ${nextExam.daysLeft <= 5 ? "var(--orange)44" : "var(--border)"}`,
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 600,
                  color:
                    nextExam.daysLeft <= 5 ? "var(--orange)" : "var(--txt2)",
                }}
              >
                📝 {nextExam.subject} exam in{" "}
                {nextExam.daysLeft === 0 ? "<1" : nextExam.daysLeft}d
              </div>
            )}
          </div>
        </div>

        {/* ── FILTERS + SORT ── */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", gap: 5 }}>
            {[
              ["all", "All"],
              ["active", "Active"],
              ["done", "Done"],
            ].map(([id, lbl]) => (
              <button
                key={id}
                className={`pill ${filter === id ? "on" : ""}`}
                onClick={() => setFilter(id)}
              >
                {lbl}
              </button>
            ))}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              background: "var(--bg3)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "5px 10px",
              fontFamily: "var(--font)",
              fontSize: 12,
              color: "var(--txt2)",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option value="deadline">Sort: Deadline</option>
            <option value="priority">Sort: Priority</option>
            <option value="type">Sort: Type</option>
          </select>
        </div>

        {/* ── TASKS ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {sorted.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "48px 20px",
                color: "var(--txt3)",
              }}
            >
              <div style={{ fontSize: 30, marginBottom: 10 }}>📚</div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
                No tasks here
              </div>
              <div style={{ fontSize: 13 }}>Add your first task below</div>
            </div>
          ) : (
            sorted.map((task, i) => (
              <div
                key={task.id}
                className="fadeUp"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <TaskCard
                  task={task}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                  onPomodoro={addPomodoro}
                />
              </div>
            ))
          )}
        </div>

        {/* ── ADD ROW ── */}
        <div style={{ margin: "14px 0 8px" }}>
          <button
            onClick={() => setShowModal(true)}
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: 12,
              border: "1.5px dashed var(--border)",
              background: "transparent",
              color: "var(--txt3)",
              cursor: "pointer",
              fontFamily: "var(--font)",
              fontSize: 13,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              transition: "all .15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--txt2)";
              e.currentTarget.style.color = "var(--txt2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.color = "var(--txt3)";
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add task
          </button>
        </div>

        <button className="fab" onClick={() => setShowModal(true)}>
          +
        </button>
        {showModal && <AddTaskModal onClose={() => setShowModal(false)} />}
      </div>
    </>
  );
}
