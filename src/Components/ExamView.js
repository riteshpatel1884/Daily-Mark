"use client";
import { useState } from "react";
import { useApp, SUBJECTS } from "@/Components/store";

function AddExamModal({ onClose }) {
  const { addExam } = useApp();
  const [subject, setSubject] = useState("DSA");
  const [date, setDate] = useState("");
  const [type, setType] = useState("Mid Sem");
  const [syllabus, setSyllabus] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!date) return;
    addExam({ subject, date, type, syllabus });
    onClose();
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
            marginBottom: 18,
          }}
        >
          <h2 style={{ fontSize: 17, fontWeight: 700, color: "var(--txt)" }}>
            Add Exam
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
          style={{ display: "flex", flexDirection: "column", gap: 14 }}
        >
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            <div>
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
            <div>
              <div className="slabel">Type</div>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="inp"
              >
                {[
                  "Quiz",
                  "Mid Sem",
                  "End Sem",
                  "Viva",
                  "Practical",
                  "Assignment Due",
                ].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <div className="slabel">Date</div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="inp"
              min={new Date().toISOString().slice(0, 10)}
              required
            />
          </div>
          <div>
            <div className="slabel">Syllabus / Topics (optional)</div>
            <textarea
              value={syllabus}
              onChange={(e) => setSyllabus(e.target.value)}
              placeholder="e.g. Trees, Graphs, Dynamic Programming"
              rows={2}
              className="inp"
              style={{ resize: "none" }}
            />
          </div>
          <button
            type="submit"
            disabled={!date}
            style={{
              padding: "13px",
              borderRadius: 11,
              border: "none",
              background: date ? "var(--txt)" : "var(--border)",
              color: date ? "var(--bg)" : "var(--txt3)",
              fontFamily: "var(--font)",
              fontSize: 14,
              fontWeight: 700,
              cursor: date ? "pointer" : "not-allowed",
            }}
          >
            Add Exam
          </button>
        </form>
      </div>
    </div>
  );
}

function urgencyColor(days) {
  if (days <= 2)
    return {
      bg: "var(--red)18",
      border: "var(--red)44",
      txt: "var(--red)",
      label: "URGENT",
    };
  if (days <= 5)
    return {
      bg: "var(--orange)18",
      border: "var(--orange)44",
      txt: "var(--orange)",
      label: "SOON",
    };
  if (days <= 10)
    return {
      bg: "var(--yellow)18",
      border: "var(--yellow)44",
      txt: "var(--yellow)",
      label: "UPCOMING",
    };
  return {
    bg: "var(--bg3)",
    border: "var(--border)",
    txt: "var(--txt2)",
    label: "PLANNED",
  };
}

export default function ExamView() {
  const { upcomingExams, deleteExam, exams } = useApp();
  const [showModal, setShowModal] = useState(false);

  const pastExams = exams
    .map((e) => ({
      ...e,
      daysLeft: Math.ceil((new Date(e.date) - Date.now()) / 86400000),
    }))
    .filter((e) => e.daysLeft < 0)
    .sort((a, b) => b.daysLeft - a.daysLeft);

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
          Exams
        </h1>
        <button
          onClick={() => setShowModal(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            borderRadius: 10,
            border: "1px solid var(--border)",
            background: "var(--bg2)",
            color: "var(--txt2)",
            fontFamily: "var(--font)",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            transition: "all .15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--bg3)";
            e.currentTarget.style.color = "var(--txt)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--bg2)";
            e.currentTarget.style.color = "var(--txt2)";
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Exam
        </button>
      </div>
      <p style={{ fontSize: 13, color: "var(--txt3)", marginBottom: 22 }}>
        Track upcoming exams and never miss a deadline
      </p>

      {/* Upcoming */}
      {upcomingExams.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "48px 20px",
            color: "var(--txt3)",
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 10 }}>📅</div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
            No upcoming exams
          </div>
          <div style={{ fontSize: 13 }}>
            Add your exam schedule to track countdowns
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginBottom: 28,
          }}
        >
          {upcomingExams.map((exam, i) => {
            const u = urgencyColor(exam.daysLeft);
            return (
              <div
                key={exam.id}
                className="fadeUp"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div
                  style={{
                    background: u.bg,
                    border: `1px solid ${u.border}`,
                    borderRadius: 14,
                    padding: 16,
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 10,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      {/* urgency + type */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 7,
                          marginBottom: 6,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 9,
                            fontWeight: 700,
                            letterSpacing: ".1em",
                            textTransform: "uppercase",
                            color: u.txt,
                            background: u.border,
                            padding: "2px 7px",
                            borderRadius: 5,
                          }}
                        >
                          {u.label}
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            color: "var(--txt3)",
                            fontWeight: 500,
                          }}
                        >
                          {exam.type}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: 16,
                          fontWeight: 700,
                          color: "var(--txt)",
                          marginBottom: 4,
                        }}
                      >
                        {exam.subject}
                      </div>
                      {exam.syllabus && (
                        <div
                          style={{
                            fontSize: 12,
                            color: "var(--txt2)",
                            lineHeight: 1.4,
                            marginBottom: 8,
                          }}
                        >
                          {exam.syllabus}
                        </div>
                      )}
                      <div style={{ fontSize: 12, color: "var(--txt3)" }}>
                        {new Date(exam.date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                    </div>

                    {/* Big countdown */}
                    <div style={{ textAlign: "center", flexShrink: 0 }}>
                      <div
                        style={{
                          fontFamily: "var(--mono)",
                          fontSize: exam.daysLeft === 0 ? 28 : 32,
                          fontWeight: 700,
                          color: u.txt,
                          lineHeight: 1,
                        }}
                      >
                        {exam.daysLeft === 0
                          ? "TODAY"
                          : exam.daysLeft === 1
                            ? "1"
                            : exam.daysLeft}
                      </div>
                      {exam.daysLeft > 1 && (
                        <div
                          style={{
                            fontSize: 10,
                            color: u.txt,
                            fontWeight: 600,
                            letterSpacing: ".05em",
                          }}
                        >
                          DAYS LEFT
                        </div>
                      )}
                      <button
                        onClick={() => deleteExam(exam.id)}
                        style={{
                          marginTop: 8,
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

                  {/* study progress bar suggestion */}
                  {exam.daysLeft > 0 && (
                    <div style={{ marginTop: 10 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 4,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 10,
                            color: "var(--txt3)",
                            fontWeight: 600,
                            letterSpacing: ".06em",
                            textTransform: "uppercase",
                          }}
                        >
                          Prep time remaining
                        </span>
                        <span
                          style={{
                            fontSize: 10,
                            color: u.txt,
                            fontFamily: "var(--mono)",
                            fontWeight: 600,
                          }}
                        >
                          {exam.daysLeft}d × study sessions
                        </span>
                      </div>
                      <div className="ptrack">
                        <div
                          className="pfill"
                          style={{
                            width: `${Math.min(100, Math.max(5, 100 - (exam.daysLeft / 30) * 100))}%`,
                            background: u.txt,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Past exams */}
      {pastExams.length > 0 && (
        <div>
          <div className="slabel" style={{ marginBottom: 10 }}>
            Past Exams
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {pastExams.slice(0, 5).map((exam) => (
              <div
                key={exam.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  background: "var(--bg2)",
                  border: "1px solid var(--border)",
                  borderRadius: 11,
                  opacity: 0.6,
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--txt)",
                    }}
                  >
                    {exam.subject}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      color: "var(--txt3)",
                      marginLeft: 8,
                    }}
                  >
                    {exam.type}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--txt3)",
                      fontFamily: "var(--mono)",
                    }}
                  >
                    {new Date(exam.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <button
                    onClick={() => deleteExam(exam.id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "var(--txt3)",
                      fontSize: 12,
                    }}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showModal && <AddExamModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
