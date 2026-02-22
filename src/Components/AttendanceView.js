"use client";
import { useState } from "react";
import { useApp } from "@/Components/store";

const MIN_ATTEND = 75;

function AttendanceBar({ pct }) {
  const color =
    pct >= 85
      ? "var(--green)"
      : pct >= MIN_ATTEND
        ? "var(--yellow)"
        : "var(--red)";
  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          height: 6,
          background: "var(--border)",
          borderRadius: 99,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${Math.min(pct, 100)}%`,
            background: color,
            borderRadius: 99,
            transition: "width .6s ease",
          }}
        />
      </div>
      {/* 75% marker */}
      <div
        style={{
          position: "absolute",
          top: -2,
          left: `${MIN_ATTEND}%`,
          width: 1.5,
          height: 10,
          background: "var(--txt3)",
          borderRadius: 1,
        }}
      />
    </div>
  );
}

function calcNeeded(present, total, target = 75) {
  // how many more classes to attend to reach target
  // present/total >= target/100 → present*100 >= target*total
  if ((present / total) * 100 >= target) return { type: "safe", val: 0 };
  // present + x / (total + x) = target/100
  // 100(present + x) = target(total + x)
  // x(100 - target) = target*total - 100*present
  const x = Math.ceil((target * total - 100 * present) / (100 - target));
  return { type: "need", val: x };
}

function calcCanBunk(present, total, target = 75) {
  // (present) / (total + x) >= target/100
  // present * 100 >= target * (total + x)
  // x <= (present*100 - target*total) / target
  const x = Math.floor((present * 100 - target * total) / target);
  return Math.max(0, x);
}

export default function AttendanceView() {
  const { subjects, updateSubject, addSubject, deleteSubject } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [credits, setCredits] = useState(4);
  const [editing, setEditing] = useState(null); // subject id being edited

  function handleAdd(e) {
    e.preventDefault();
    if (!name.trim()) return;
    addSubject({
      name: name.trim(),
      credits,
      attendance: 100,
      total: 0,
      present: 0,
    });
    setName("");
    setCredits(4);
    setShowAdd(false);
  }

  function markAttend(id, attended) {
    const subj = subjects.find((s) => s.id === id);
    if (!subj) return;
    updateSubject(id, {
      total: subj.total + 1,
      present: subj.present + (attended ? 1 : 0),
      attendance: Math.round(
        ((subj.present + (attended ? 1 : 0)) / (subj.total + 1)) * 100,
      ),
    });
  }

  const overallAttend = subjects.length
    ? Math.round(
        subjects.reduce((s, sub) => s + (sub.attendance || 0), 0) /
          subjects.length,
      )
    : 0;

  const atRisk = subjects.filter(
    (s) => s.total > 0 && s.attendance < MIN_ATTEND,
  );

  return (
    <div className="page">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 4,
        }}
      >
        <h1
          style={{
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: "-.03em",
            color: "var(--txt)",
          }}
        >
          Attendance
        </h1>
        <button
          onClick={() => setShowAdd((s) => !s)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "7px 13px",
            borderRadius: 10,
            border: "1px solid var(--border)",
            background: "var(--bg2)",
            color: "var(--txt2)",
            fontFamily: "var(--font)",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Subject
        </button>
      </div>
      <p style={{ fontSize: 13, color: "var(--txt3)", marginBottom: 18 }}>
        Track attendance & bunk calculator
      </p>

      {/* Overall + At Risk */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginBottom: 18,
        }}
      >
        <div className="card" style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              color: "var(--txt3)",
              marginBottom: 6,
            }}
          >
            Overall
          </div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: "-.04em",
              color:
                overallAttend >= 75
                  ? "var(--green)"
                  : overallAttend >= 65
                    ? "var(--orange)"
                    : "var(--red)",
            }}
          >
            {overallAttend}%
          </div>
          <div style={{ fontSize: 11, color: "var(--txt3)", marginTop: 2 }}>
            {subjects.length} subjects
          </div>
        </div>
        <div
          className="card"
          style={{
            textAlign: "center",
            background: atRisk.length > 0 ? "var(--red)18" : "var(--bg2)",
            border: `1px solid ${atRisk.length > 0 ? "var(--red)44" : "var(--border)"}`,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              color: atRisk.length > 0 ? "var(--red)" : "var(--txt3)",
              marginBottom: 6,
            }}
          >
            At Risk
          </div>
          <div
            style={{
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: "-.04em",
              color: atRisk.length > 0 ? "var(--red)" : "var(--green)",
            }}
          >
            {atRisk.length}
          </div>
          <div
            style={{
              fontSize: 11,
              color: atRisk.length > 0 ? "var(--red)" : "var(--txt3)",
              marginTop: 2,
            }}
          >
            below 75%
          </div>
        </div>
      </div>

      {/* Add subject form */}
      {showAdd && (
        <form
          onSubmit={handleAdd}
          className="card"
          style={{
            marginBottom: 16,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--txt)" }}>
            New Subject
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 10,
            }}
          >
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Subject name"
              className="inp"
              style={{ fontSize: 14 }}
            />
            <select
              value={credits}
              onChange={(e) => setCredits(+e.target.value)}
              className="inp"
              style={{ width: 90 }}
            >
              {[1, 2, 3, 4, 5].map((c) => (
                <option key={c} value={c}>
                  {c} cr
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: 9,
                border: "none",
                background: "var(--txt)",
                color: "var(--bg)",
                fontFamily: "var(--font)",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              style={{
                padding: "10px 16px",
                borderRadius: 9,
                border: "1px solid var(--border)",
                background: "transparent",
                color: "var(--txt2)",
                fontFamily: "var(--font)",
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Subject cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {subjects.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 20px",
              color: "var(--txt3)",
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 10 }}>🎓</div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>
              Add your subjects to start tracking
            </div>
          </div>
        ) : (
          subjects.map((subj) => {
            const pct =
              subj.total > 0
                ? Math.round((subj.present / subj.total) * 100)
                : 100;
            const needed = calcNeeded(subj.present, subj.total);
            const canBunk = calcCanBunk(subj.present, subj.total);
            const color =
              pct >= 85
                ? "var(--green)"
                : pct >= 75
                  ? "var(--yellow)"
                  : "var(--red)";

            return (
              <div key={subj.id} className="subj">
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: "var(--txt)",
                      }}
                    >
                      {subj.name}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--txt3)",
                        marginTop: 1,
                      }}
                    >
                      {subj.credits} credits · {subj.present}/{subj.total}{" "}
                      classes
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 800,
                        letterSpacing: "-.03em",
                        color,
                        fontFamily: "var(--mono)",
                      }}
                    >
                      {pct}%
                    </div>
                    <button
                      onClick={() => deleteSubject(subj.id)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--txt3)",
                        fontSize: 11,
                        fontFamily: "var(--font)",
                      }}
                    >
                      remove
                    </button>
                  </div>
                </div>

                <AttendanceBar pct={pct} />

                {/* Smart advice */}
                {subj.total > 0 && (
                  <div
                    style={{
                      fontSize: 12,
                      padding: "7px 10px",
                      borderRadius: 8,
                      background:
                        needed.type === "safe"
                          ? "var(--green)15"
                          : "var(--red)15",
                      color:
                        needed.type === "safe" ? "var(--green)" : "var(--red)",
                      fontWeight: 500,
                    }}
                  >
                    {needed.type === "safe"
                      ? canBunk > 0
                        ? `✅ You can bunk ${canBunk} more class${canBunk > 1 ? "es" : ""}`
                        : "✅ Just maintain attendance"
                      : `⚠️ Attend next ${needed.val} consecutive class${needed.val > 1 ? "es" : ""} to reach 75%`}
                  </div>
                )}

                {/* Mark attendance */}
                <div style={{ display: "flex", gap: 7 }}>
                  <button
                    onClick={() => markAttend(subj.id, true)}
                    style={{
                      flex: 1,
                      padding: "8px",
                      borderRadius: 9,
                      border: "1px solid var(--green)44",
                      background: "var(--green)15",
                      color: "var(--green)",
                      fontFamily: "var(--font)",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "background .15s",
                    }}
                  >
                    ✓ Present
                  </button>
                  <button
                    onClick={() => markAttend(subj.id, false)}
                    style={{
                      flex: 1,
                      padding: "8px",
                      borderRadius: 9,
                      border: "1px solid var(--red)44",
                      background: "var(--red)15",
                      color: "var(--red)",
                      fontFamily: "var(--font)",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: "pointer",
                      transition: "background .15s",
                    }}
                  >
                    ✗ Absent
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
