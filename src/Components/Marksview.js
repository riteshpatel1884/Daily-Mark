"use client";
import { useState } from "react";
import { useApp, SUBJECTS } from "@/Components/store";

function ScoreBar({ scored, total, color = "var(--blue)" }) {
  const pct = total > 0 ? Math.min(100, Math.round((scored / total) * 100)) : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div
        style={{
          flex: 1,
          height: 5,
          background: "var(--border)",
          borderRadius: 99,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: color,
            borderRadius: 99,
            transition: "width .5s ease",
          }}
        />
      </div>
      <span
        style={{
          fontSize: 12,
          fontFamily: "var(--mono)",
          fontWeight: 600,
          color: "var(--txt2)",
          minWidth: 46,
          textAlign: "right",
        }}
      >
        {scored}/{total}
      </span>
    </div>
  );
}

function AddMarksModal({ onClose }) {
  const { addMark } = useApp();
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [internals, setInternals] = useState({ scored: "", total: "30" });
  const [assignment, setAssignment] = useState({ scored: "", total: "10" });
  const [practical, setPractical] = useState({ scored: "", total: "25" });
  const [endSem, setEndSem] = useState({ scored: "", total: "70" });

  function submit(e) {
    e.preventDefault();
    addMark({
      subject,
      internals: {
        scored: Number(internals.scored) || 0,
        total: Number(internals.total) || 30,
      },
      assignment: {
        scored: Number(assignment.scored) || 0,
        total: Number(assignment.total) || 10,
      },
      practical: {
        scored: Number(practical.scored) || 0,
        total: Number(practical.total) || 25,
      },
      endSem: {
        scored: Number(endSem.scored) || 0,
        total: Number(endSem.total) || 70,
        locked: !endSem.scored,
      },
    });
    onClose();
  }

  function ScoreRow({ label, state, setState, placeholder = "0" }) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 0",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <span
          style={{
            flex: 1,
            fontSize: 13,
            fontWeight: 500,
            color: "var(--txt)",
          }}
        >
          {label}
        </span>
        <input
          value={state.scored}
          onChange={(e) => setState((s) => ({ ...s, scored: e.target.value }))}
          placeholder={placeholder}
          type="number"
          min={0}
          style={{
            width: 52,
            background: "var(--bg3)",
            border: "1px solid var(--border)",
            borderRadius: 7,
            padding: "6px 8px",
            fontFamily: "var(--mono)",
            fontSize: 14,
            fontWeight: 700,
            color: "var(--txt)",
            outline: "none",
            textAlign: "center",
          }}
        />
        <span style={{ fontSize: 13, color: "var(--txt3)" }}>/ </span>
        <input
          value={state.total}
          onChange={(e) => setState((s) => ({ ...s, total: e.target.value }))}
          type="number"
          min={0}
          style={{
            width: 52,
            background: "var(--bg3)",
            border: "1px solid var(--border)",
            borderRadius: 7,
            padding: "6px 8px",
            fontFamily: "var(--mono)",
            fontSize: 14,
            color: "var(--txt2)",
            outline: "none",
            textAlign: "center",
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="overlay fadeIn"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="sheet">
        <div className="drag-handle" />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <h2 style={{ fontSize: 17, fontWeight: 700, color: "var(--txt)" }}>
            Add Marks
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "var(--bg4)",
              border: "none",
              borderRadius: 8,
              width: 28,
              height: 28,
              cursor: "pointer",
              color: "var(--txt2)",
              fontSize: 17,
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
          style={{ display: "flex", flexDirection: "column", gap: 0 }}
        >
          <div style={{ marginBottom: 14 }}>
            <div className="slabel">Subject</div>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="inp"
            >
              {SUBJECTS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>

          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: ".07em",
              textTransform: "uppercase",
              color: "var(--txt3)",
              marginBottom: 6,
            }}
          >
            Scored / Out of &nbsp;(leave scored blank if not yet done)
          </div>

          <ScoreRow
            label="Internals"
            state={internals}
            setState={setInternals}
          />
          <ScoreRow
            label="Assignments"
            state={assignment}
            setState={setAssignment}
          />
          <ScoreRow
            label="Practical"
            state={practical}
            setState={setPractical}
          />
          <ScoreRow label="End Sem" state={endSem} setState={setEndSem} />

          <button
            type="submit"
            style={{
              marginTop: 16,
              padding: "13px",
              borderRadius: 11,
              border: "none",
              background: "var(--txt)",
              color: "var(--bg)",
              fontFamily: "var(--font)",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Save Marks
          </button>
        </form>
      </div>
    </div>
  );
}

function EditMarksModal({ mark, onClose }) {
  const { updateMark } = useApp();
  const [internals, setInternals] = useState({
    scored: String(mark.internals?.scored ?? ""),
    total: String(mark.internals?.total ?? 30),
  });
  const [assignment, setAssignment] = useState({
    scored: String(mark.assignment?.scored ?? ""),
    total: String(mark.assignment?.total ?? 10),
  });
  const [practical, setPractical] = useState({
    scored: String(mark.practical?.scored ?? ""),
    total: String(mark.practical?.total ?? 25),
  });
  const [endSem, setEndSem] = useState({
    scored: String(mark.endSem?.scored ?? ""),
    total: String(mark.endSem?.total ?? 70),
  });

  function submit(e) {
    e.preventDefault();
    updateMark(mark.id, {
      internals: {
        scored: Number(internals.scored) || 0,
        total: Number(internals.total) || 30,
      },
      assignment: {
        scored: Number(assignment.scored) || 0,
        total: Number(assignment.total) || 10,
      },
      practical: {
        scored: Number(practical.scored) || 0,
        total: Number(practical.total) || 25,
      },
      endSem: {
        scored: Number(endSem.scored) || 0,
        total: Number(endSem.total) || 70,
      },
    });
    onClose();
  }

  function ScoreRow({ label, state, setState }) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 0",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <span
          style={{
            flex: 1,
            fontSize: 13,
            fontWeight: 500,
            color: "var(--txt)",
          }}
        >
          {label}
        </span>
        <input
          value={state.scored}
          onChange={(e) => setState((s) => ({ ...s, scored: e.target.value }))}
          type="number"
          min={0}
          style={{
            width: 52,
            background: "var(--bg3)",
            border: "1px solid var(--border)",
            borderRadius: 7,
            padding: "6px 8px",
            fontFamily: "var(--mono)",
            fontSize: 14,
            fontWeight: 700,
            color: "var(--txt)",
            outline: "none",
            textAlign: "center",
          }}
        />
        <span style={{ fontSize: 13, color: "var(--txt3)" }}>/</span>
        <input
          value={state.total}
          onChange={(e) => setState((s) => ({ ...s, total: e.target.value }))}
          type="number"
          min={0}
          style={{
            width: 52,
            background: "var(--bg3)",
            border: "1px solid var(--border)",
            borderRadius: 7,
            padding: "6px 8px",
            fontFamily: "var(--mono)",
            fontSize: 14,
            color: "var(--txt2)",
            outline: "none",
            textAlign: "center",
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="overlay fadeIn"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="sheet">
        <div className="drag-handle" />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <h2 style={{ fontSize: 17, fontWeight: 700, color: "var(--txt)" }}>
            Edit — {mark.subject}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "var(--bg4)",
              border: "none",
              borderRadius: 8,
              width: 28,
              height: 28,
              cursor: "pointer",
              color: "var(--txt2)",
              fontSize: 17,
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
          style={{ display: "flex", flexDirection: "column" }}
        >
          <ScoreRow
            label="Internals"
            state={internals}
            setState={setInternals}
          />
          <ScoreRow
            label="Assignments"
            state={assignment}
            setState={setAssignment}
          />
          <ScoreRow
            label="Practical"
            state={practical}
            setState={setPractical}
          />
          <ScoreRow label="End Sem" state={endSem} setState={setEndSem} />
          <button
            type="submit"
            style={{
              marginTop: 16,
              padding: "13px",
              borderRadius: 11,
              border: "none",
              background: "var(--txt)",
              color: "var(--bg)",
              fontFamily: "var(--font)",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
}

export default function MarksView() {
  const { marks, deleteMark } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);

  const COMP_COLORS = {
    internals: "var(--blue)",
    assignment: "var(--purple)",
    practical: "var(--green)",
    endSem: "var(--orange)",
  };
  const COMP_LABELS = {
    internals: "Internals",
    assignment: "Assignment",
    practical: "Practical",
    endSem: "End Sem",
  };

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
          Marks
        </h1>
        <button
          onClick={() => setShowAdd(true)}
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
          Add Subject
        </button>
      </div>
      <p style={{ fontSize: 13, color: "var(--txt3)", marginBottom: 20 }}>
        Track your marks — internals, assignments, practicals & end sem
      </p>

      {marks.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "48px 20px",
            color: "var(--txt3)",
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 10 }}>📊</div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
            No marks tracked yet
          </div>
          <div style={{ fontSize: 13 }}>
            Add your subject scores to see progress
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {marks.map((mark) => {
            const comps = ["internals", "assignment", "practical", "endSem"];
            // total so far (excluding endSem if not entered)
            const internalTotal =
              (mark.internals?.scored || 0) +
              (mark.assignment?.scored || 0) +
              (mark.practical?.scored || 0);
            const internalMax =
              (mark.internals?.total || 0) +
              (mark.assignment?.total || 0) +
              (mark.practical?.total || 0);
            const endSemScored = mark.endSem?.scored || 0;
            const endSemTotal = mark.endSem?.total || 70;
            // need to pass: typically 40% of endSem
            const passMarkEndSem = Math.ceil(endSemTotal * 0.4);
            const needInEndSem = Math.max(0, passMarkEndSem - endSemScored);

            return (
              <div
                key={mark.id}
                style={{
                  background: "var(--bg2)",
                  border: "1px solid var(--border)",
                  borderRadius: 16,
                  padding: 16,
                }}
              >
                {/* Header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 14,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 16,
                        fontWeight: 700,
                        color: "var(--txt)",
                      }}
                    >
                      {mark.subject}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--txt3)",
                        marginTop: 1,
                        fontFamily: "var(--mono)",
                      }}
                    >
                      Internal total: {internalTotal}/{internalMax}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => setEditing(mark)}
                      style={{
                        background: "var(--bg3)",
                        border: "1px solid var(--border)",
                        borderRadius: 8,
                        padding: "5px 10px",
                        cursor: "pointer",
                        color: "var(--txt2)",
                        fontFamily: "var(--font)",
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteMark(mark.id)}
                      style={{
                        background: "var(--red)15",
                        border: "1px solid var(--red)33",
                        borderRadius: 8,
                        padding: "5px 10px",
                        cursor: "pointer",
                        color: "var(--red)",
                        fontFamily: "var(--font)",
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                {/* Component bars */}
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 10 }}
                >
                  {comps.map((c) => {
                    const comp = mark[c] || { scored: 0, total: 0 };
                    if (comp.total === 0) return null;
                    return (
                      <div key={c}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 4,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 600,
                              color: COMP_COLORS[c],
                            }}
                          >
                            {COMP_LABELS[c]}
                          </span>
                          <span
                            style={{
                              fontSize: 11,
                              color: "var(--txt3)",
                              fontFamily: "var(--mono)",
                            }}
                          >
                            {Math.round((comp.scored / comp.total) * 100)}%
                          </span>
                        </div>
                        <ScoreBar
                          scored={comp.scored}
                          total={comp.total}
                          color={COMP_COLORS[c]}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Smart insight */}
                <div
                  style={{
                    marginTop: 12,
                    padding: "9px 12px",
                    borderRadius: 9,
                    background: "var(--bg3)",
                    border: "1px solid var(--border)",
                  }}
                >
                  {endSemScored > 0 ? (
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--txt2)",
                        lineHeight: 1.5,
                      }}
                    >
                      📝 End sem scored{" "}
                      <strong style={{ color: "var(--txt)" }}>
                        {endSemScored}/{endSemTotal}
                      </strong>
                      {endSemScored >= passMarkEndSem ? (
                        <span style={{ color: "var(--green)" }}>
                          {" "}
                          ✅ Passing in end sem
                        </span>
                      ) : (
                        <span style={{ color: "var(--red)" }}>
                          {" "}
                          ⚠️ Need {needInEndSem} more to pass end sem
                        </span>
                      )}
                    </div>
                  ) : (
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--txt2)",
                        lineHeight: 1.5,
                      }}
                    >
                      📝 End sem not yet entered · need at least{" "}
                      <strong style={{ color: "var(--txt)" }}>
                        {passMarkEndSem}/{endSemTotal}
                      </strong>{" "}
                      to pass
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showAdd && <AddMarksModal onClose={() => setShowAdd(false)} />}
      {editing && (
        <EditMarksModal mark={editing} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}
