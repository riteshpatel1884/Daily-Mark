"use client";
import { useState } from "react";
import { useApp } from "@/Components/store";

const PRIORITIES = ["low", "medium", "high"];
const CATS = ["Work", "Health", "Personal", "Learning", "Finance", "Other"];
const P_COLORS = { low: "#3ecf8e", medium: "#f5a524", high: "#e84040" };

export default function AddTaskModal({ onClose }) {
  const { addTask } = useApp();
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("medium");
  const [cat, setCat] = useState("Personal");

  function submit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    addTask(text.trim(), priority, cat);
    onClose();
  }

  return (
    <div
      className="overlay fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="sheet">
        {/* Handle */}
        <div
          style={{
            width: 36,
            height: 4,
            background: "var(--line-2)",
            borderRadius: 99,
            margin: "0 auto 20px",
            display: "block",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              fontWeight: 700,
              color: "var(--txt)",
              letterSpacing: "-0.02em",
            }}
          >
            New Task
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "var(--bg-3)",
              border: "none",
              borderRadius: "8px",
              width: 30,
              height: 30,
              cursor: "pointer",
              color: "var(--txt-2)",
              fontSize: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>
        </div>

        <form
          onSubmit={submit}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          <textarea
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What needs to be done?"
            rows={3}
            className="inp"
            style={{ resize: "none", lineHeight: 1.55 }}
            onKeyDown={(e) => e.key === "Enter" && e.metaKey && submit(e)}
          />

          <div>
            <div className="sec-label">Priority</div>
            <div style={{ display: "flex", gap: 8 }}>
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  style={{
                    flex: 1,
                    padding: "9px 0",
                    borderRadius: 10,
                    border: `1.5px solid ${priority === p ? P_COLORS[p] : "var(--line)"}`,
                    background:
                      priority === p ? P_COLORS[p] + "22" : "transparent",
                    color: priority === p ? P_COLORS[p] : "var(--txt-2)",
                    fontFamily: "var(--font)",
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: "pointer",
                    textTransform: "capitalize",
                    transition: "all 0.15s",
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="sec-label">Category</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {CATS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCat(c)}
                  style={{
                    padding: "7px 14px",
                    borderRadius: 99,
                    border: `1.5px solid ${cat === c ? "var(--txt)" : "var(--line)"}`,
                    background: cat === c ? "var(--txt)" : "transparent",
                    color: cat === c ? "var(--bg)" : "var(--txt-2)",
                    fontFamily: "var(--font)",
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!text.trim()}
            style={{
              marginTop: 4,
              padding: "14px",
              borderRadius: 12,
              border: "none",
              background: text.trim() ? "var(--txt)" : "var(--line)",
              color: text.trim() ? "var(--bg)" : "var(--txt-3)",
              fontFamily: "var(--font)",
              fontSize: 15,
              fontWeight: 600,
              cursor: text.trim() ? "pointer" : "not-allowed",
              transition: "all 0.15s",
            }}
          >
            Add Task
          </button>
        </form>
      </div>
    </div>
  );
}
