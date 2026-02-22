"use client";
import { useState, useMemo } from "react";
import { useApp } from "@/Components/store";
import AddTaskModal from "@/Components/addtaskmodal";

const P_COLOR = { low: "#3ecf8e", medium: "#f5a524", high: "#e84040" };

function TaskCard({ task, onToggle, onDelete }) {
  const [touchX, setTouchX] = useState(0);
  const [startX, setStartX] = useState(null);
  const [sliding, setSliding] = useState(false);

  function ts(e) {
    setStartX(e.touches[0].clientX);
  }
  function tm(e) {
    if (startX === null) return;
    const dx = e.touches[0].clientX - startX;
    if (dx < 0) {
      setSliding(true);
      setTouchX(Math.max(dx, -72));
    }
  }
  function te() {
    if (touchX < -55) onDelete(task.id);
    else {
      setTouchX(0);
      setSliding(false);
    }
    setStartX(null);
  }

  return (
    <div
      style={{ position: "relative", borderRadius: 14, overflow: "hidden" }}
      onTouchStart={ts}
      onTouchMove={tm}
      onTouchEnd={te}
    >
      {/* swipe delete bg */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 72,
          background: "var(--danger)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 14,
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
        >
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6M10 11v6M14 11v6M9 6V4h6v2" />
        </svg>
      </div>

      <div
        className={`task-card ${task.done ? "done" : ""}`}
        style={{
          transform: `translateX(${touchX}px)`,
          transition: sliding ? "none" : "transform 0.2s ease",
        }}
      >
        {/* priority bar */}
        <div className="p-bar" style={{ background: P_COLOR[task.priority] }} />

        {/* checkbox */}
        <button
          className={`chk ${task.done ? "checked" : ""}`}
          onClick={() => onToggle(task.id)}
        >
          {task.done && (
            <svg
              width="11"
              height="11"
              viewBox="0 0 12 12"
              fill="none"
              stroke="var(--chk-mark)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="2 6 5 9 10 3" />
            </svg>
          )}
        </button>

        {/* text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 500,
              lineHeight: 1.45,
              color: task.done ? "var(--txt-3)" : "var(--txt)",
              textDecoration: task.done ? "line-through" : "none",
              wordBreak: "break-word",
            }}
          >
            {task.text}
          </div>
          <div
            style={{
              marginTop: 5,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span className="tag">
              {task.cat || task.category || "Personal"}
            </span>
            <span
              style={{
                fontSize: 11,
                color: "var(--txt-3)",
                textTransform: "capitalize",
              }}
            >
              {task.priority}
            </span>
          </div>
        </div>

        {/* desktop delete */}
        <button
          onClick={() => onDelete(task.id)}
          className="del-icon"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--txt-3)",
            padding: "2px 4px",
            borderRadius: 6,
            flexShrink: 0,
            opacity: 0,
            transition: "opacity 0.15s",
            display: "flex",
          }}
        >
          <svg
            width="14"
            height="14"
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
  );
}

export default function TodayView() {
  const { tasks, toggleTask, deleteTask, doneCount, progress } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("all");

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const activeCount = tasks.filter((t) => !t.done).length;

  const filtered = useMemo(() => {
    if (filter === "active") return tasks.filter((t) => !t.done);
    if (filter === "done") return tasks.filter((t) => t.done);
    return tasks;
  }, [tasks, filter]);

  return (
    <div className="page">
      {/* ── HEADER ── */}
      <div style={{ marginBottom: 28 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--txt-3)",
            marginBottom: 4,
          }}
        >
          {today}
        </div>
        <h1
          style={{
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "var(--txt)",
            lineHeight: 1.1,
            marginBottom: 18,
          }}
        >
          My Tasks
        </h1>

        {/* progress */}
        <div
          style={{
            background: "var(--bg-2)",
            border: "1px solid var(--line)",
            borderRadius: 16,
            padding: "16px 18px",
          }}
        >
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
                  fontSize: 26,
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: "var(--txt)",
                }}
              >
                {progress}%
              </span>
              <span
                style={{ fontSize: 13, color: "var(--txt-3)", marginLeft: 6 }}
              >
                complete
              </span>
            </div>
            <span style={{ fontSize: 13, color: "var(--txt-2)" }}>
              {doneCount}/{tasks.length} tasks
            </span>
          </div>
          <div className="prog-track">
            <div className="prog-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* ── FILTERS ── */}
      <div className="filter-wrap" style={{ marginBottom: 18 }}>
        {[
          ["all", "All"],
          ["active", `Active ${activeCount > 0 ? activeCount : ""}`],
          ["done", "Done"],
        ].map(([id, label]) => (
          <button
            key={id}
            className={`filter-btn ${filter === id ? "active" : ""}`}
            onClick={() => setFilter(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── TASK LIST ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "52px 20px",
              color: "var(--txt-3)",
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 10 }}>
              {filter === "done" ? "📭" : "✓"}
            </div>
            <div style={{ fontSize: 15, fontWeight: 500 }}>
              {filter === "done"
                ? "Nothing done yet"
                : "All clear — add a task!"}
            </div>
          </div>
        ) : (
          filtered.map((task, i) => (
            <div
              key={task.id}
              className="fade-up"
              style={{ animationDelay: `${i * 35}ms` }}
            >
              <TaskCard
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
              />
            </div>
          ))
        )}
      </div>

      {/* ── ADD ROW (desktop) ── */}
      <div style={{ marginTop: 14, marginBottom: 8 }}>
        <button className="add-row" onClick={() => setShowModal(true)}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add a task
        </button>
      </div>

      {/* ── FAB (mobile) ── */}
      <button className="fab" onClick={() => setShowModal(true)}>
        +
      </button>

      {showModal && <AddTaskModal onClose={() => setShowModal(false)} />}

      <style>{`.task-card:hover .del-icon { opacity: 1 !important; }`}</style>
    </div>
  );
}
