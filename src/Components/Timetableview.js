"use client";
import { useState } from "react";
import { useApp, DAYS, SHORT_DAYS, SUBJECTS } from "@/Components/store";

function AddSlotModal({ day, onClose }) {
  const { addSlot } = useApp();
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [room, setRoom] = useState("");

  function submit(e) {
    e.preventDefault();
    addSlot(day, { subject, startTime, endTime, room });
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
            Add Class — {day}
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
          style={{ display: "flex", flexDirection: "column", gap: 13 }}
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
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            <div>
              <div className="slabel">Start Time</div>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="inp"
              />
            </div>
            <div>
              <div className="slabel">End Time</div>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="inp"
              />
            </div>
          </div>
          <div>
            <div className="slabel">Room / Location (optional)</div>
            <input
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="e.g. Lab 3, Room 204"
              className="inp"
            />
          </div>
          <button
            type="submit"
            style={{
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
            Add Class
          </button>
        </form>
      </div>
    </div>
  );
}

function fmt12(time24) {
  if (!time24) return "";
  const [h, m] = time24.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

export default function TimetableView() {
  const { timetable, deleteSlot, todaySlots, nextClass, nextClassMins } =
    useApp();
  const [activeDay, setActiveDay] = useState(DAYS[new Date().getDay()]);
  const [showModal, setShowModal] = useState(false);

  const todayIdx = new Date().getDay();

  const slots = [...(timetable[activeDay] || [])].sort((a, b) =>
    a.startTime.localeCompare(b.startTime),
  );

  function minsLabel(mins) {
    if (mins < 60) return `${mins} min`;
    return `${Math.floor(mins / 60)}h ${mins % 60 > 0 ? (mins % 60) + "m" : ""}`;
  }

  return (
    <div className="page">
      {/* Header */}
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
          Timetable
        </h1>
        <button
          onClick={() => setShowModal(true)}
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
          Add Class
        </button>
      </div>
      <p style={{ fontSize: 13, color: "var(--txt3)", marginBottom: 16 }}>
        Your weekly class schedule
      </p>

      {/* Next class banner */}
      {nextClass && (
        <div
          style={{
            background: "var(--blue)18",
            border: "1px solid var(--blue)44",
            borderRadius: 14,
            padding: "12px 16px",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{ fontSize: 22 }}>🔔</div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: ".07em",
                textTransform: "uppercase",
                color: "var(--blue)",
                marginBottom: 2,
              }}
            >
              Next Class Today
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "var(--txt)" }}>
              {nextClass.subject}
            </div>
            <div style={{ fontSize: 12, color: "var(--txt2)", marginTop: 1 }}>
              {fmt12(nextClass.startTime)} — {fmt12(nextClass.endTime)}
              {nextClass.room && ` · ${nextClass.room}`}
            </div>
          </div>
          <div style={{ textAlign: "center", flexShrink: 0 }}>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 18,
                fontWeight: 700,
                color: "var(--blue)",
              }}
            >
              {minsLabel(nextClassMins)}
            </div>
            <div
              style={{
                fontSize: 10,
                color: "var(--blue)",
                fontWeight: 600,
                opacity: 0.7,
              }}
            >
              away
            </div>
          </div>
        </div>
      )}

      {/* Day tabs */}
      <div
        style={{
          display: "flex",
          gap: 4,
          marginBottom: 16,
          overflowX: "auto",
          paddingBottom: 2,
        }}
      >
        {DAYS.map((day, i) => (
          <button
            key={day}
            onClick={() => setActiveDay(day)}
            style={{
              padding: "7px 10px",
              borderRadius: 9,
              border: "none",
              flexShrink: 0,
              background:
                activeDay === day
                  ? "var(--txt)"
                  : i === todayIdx
                    ? "var(--blue)20"
                    : "var(--bg3)",
              color:
                activeDay === day
                  ? "var(--bg)"
                  : i === todayIdx
                    ? "var(--blue)"
                    : "var(--txt2)",
              fontFamily: "var(--font)",
              fontSize: 12,
              fontWeight: activeDay === day ? 700 : 500,
              cursor: "pointer",
              border:
                i === todayIdx && activeDay !== day
                  ? "1px solid var(--blue)44"
                  : "1px solid transparent",
              transition: "all .15s",
            }}
          >
            {SHORT_DAYS[i]}
            {(timetable[day] || []).length > 0 && (
              <span style={{ marginLeft: 4, fontSize: 10, opacity: 0.7 }}>
                ·{(timetable[day] || []).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Slots */}
      {slots.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px 20px",
            color: "var(--txt3)",
          }}
        >
          <div style={{ fontSize: 28, marginBottom: 10 }}>📅</div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
            No classes on {activeDay}
          </div>
          <div style={{ fontSize: 13 }}>
            Tap "Add Class" to set up your schedule
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {slots.map((slot) => {
            const now = new Date();
            const nowMins = now.getHours() * 60 + now.getMinutes();
            const [sh, sm] = slot.startTime.split(":").map(Number);
            const [eh, em] = slot.endTime.split(":").map(Number);
            const startMins = sh * 60 + sm,
              endMins = eh * 60 + em;
            const isNow =
              DAYS[now.getDay()] === activeDay &&
              nowMins >= startMins &&
              nowMins < endMins;
            const isPast =
              DAYS[now.getDay()] === activeDay && nowMins >= endMins;

            return (
              <div
                key={slot.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "13px 14px",
                  background: isNow ? "var(--blue)18" : "var(--bg2)",
                  border: `1px solid ${isNow ? "var(--blue)55" : "var(--border)"}`,
                  borderRadius: 13,
                  opacity: isPast ? 0.5 : 1,
                  transition: "all .15s",
                }}
              >
                {/* time */}
                <div
                  style={{ flexShrink: 0, textAlign: "center", minWidth: 54 }}
                >
                  <div
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 13,
                      fontWeight: 600,
                      color: isNow ? "var(--blue)" : "var(--txt)",
                    }}
                  >
                    {fmt12(slot.startTime)}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 11,
                      color: "var(--txt3)",
                      marginTop: 1,
                    }}
                  >
                    {fmt12(slot.endTime)}
                  </div>
                </div>

                {/* divider */}
                <div
                  style={{
                    width: 1.5,
                    alignSelf: "stretch",
                    background: isNow ? "var(--blue)" : "var(--border)",
                    borderRadius: 1,
                    flexShrink: 0,
                  }}
                />

                {/* info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: isNow ? "var(--blue)" : "var(--txt)",
                    }}
                  >
                    {slot.subject}
                  </div>
                  {slot.room && (
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--txt3)",
                        marginTop: 1,
                      }}
                    >
                      {slot.room}
                    </div>
                  )}
                </div>

                {isNow && (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "3px 8px",
                      borderRadius: 6,
                      background: "var(--blue)",
                      color: "#fff",
                      flexShrink: 0,
                    }}
                  >
                    NOW
                  </span>
                )}

                <button
                  onClick={() => deleteSlot(activeDay, slot.id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--txt3)",
                    opacity: 0.5,
                    display: "flex",
                    transition: "opacity .15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.5)}
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
            );
          })}
        </div>
      )}

      {showModal && (
        <AddSlotModal day={activeDay} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
