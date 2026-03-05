// pip.InterviewCalendar.jsx — Interview timeline + round scheduler

"use client";
import { useState, useEffect } from "react";
import { COMPANIES } from "./constants";
import { load, save } from "./store.js";
import { Card, SectionLabel, Tag, CompanyLogo } from "./ui.js";

const CALENDAR_KEY = "pip_calendar_events";

function fmt(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function daysFromNow(dateStr) {
  const diff = Math.ceil((new Date(dateStr) - Date.now()) / 86400000);
  if (diff < 0) return `${Math.abs(diff)}d ago`;
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return `in ${diff} days`;
}

function urgencyColor(dateStr) {
  const diff = Math.ceil((new Date(dateStr) - Date.now()) / 86400000);
  if (diff < 0) return "#888";
  if (diff <= 3) return "#e05252";
  if (diff <= 7) return "#e8924a";
  return "#4caf7d";
}

const EVENT_TYPES = [
  { id: "oa", label: "Online Assessment", icon: "💻" },
  { id: "round1", label: "DSA Round 1", icon: "🧩" },
  { id: "round2", label: "DSA Round 2", icon: "🧩" },
  { id: "design", label: "System Design", icon: "🏗️" },
  { id: "hr", label: "HR Round", icon: "🤝" },
  { id: "offer", label: "Offer / Result", icon: "🎉" },
  { id: "mock", label: "Mock Interview", icon: "🎙️" },
  { id: "deadline", label: "Application Deadline", icon: "📅" },
];

export default function InterviewCalendar() {
  const [events, setEvents] = useState(() => load(CALENDAR_KEY, []));
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    company: "Amazon",
    type: "oa",
    date: "",
    note: "",
  });

  useEffect(() => {
    save(CALENDAR_KEY, events);
  }, [events]);

  const minDate = new Date().toISOString().slice(0, 10);

  function addEvent() {
    if (!form.date) return;
    setEvents((p) =>
      [...p, { ...form, id: Date.now().toString() }].sort(
        (a, b) => new Date(a.date) - new Date(b.date),
      ),
    );
    setForm({ company: "Amazon", type: "oa", date: "", note: "" });
    setShowAdd(false);
  }

  function removeEvent(id) {
    setEvents((p) => p.filter((e) => e.id !== id));
  }

  const upcoming = events.filter(
    (e) => Math.ceil((new Date(e.date) - Date.now()) / 86400000) >= 0,
  );
  const past = events.filter(
    (e) => Math.ceil((new Date(e.date) - Date.now()) / 86400000) < 0,
  );

  const nextEvent = upcoming[0];

  const inp = {
    width: "100%",
    background: "var(--bg3)",
    border: "1.5px solid var(--border)",
    borderRadius: 10,
    padding: "9px 12px",
    color: "var(--txt)",
    fontSize: 13,
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Next event banner */}
      {nextEvent && (
        <div
          style={{
            background: urgencyColor(nextEvent.date) + "15",
            border: `1.5px solid ${urgencyColor(nextEvent.date)}44`,
            borderRadius: 14,
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{ fontSize: 28 }}>
            {EVENT_TYPES.find((t) => t.id === nextEvent.type)?.icon || "📅"}
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: urgencyColor(nextEvent.date),
                textTransform: "uppercase",
                letterSpacing: ".08em",
                marginBottom: 3,
              }}
            >
              Next Interview Event
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "var(--txt)" }}>
              {nextEvent.company} —{" "}
              {EVENT_TYPES.find((t) => t.id === nextEvent.type)?.label}
            </div>
            <div style={{ fontSize: 12, color: "var(--txt2)", marginTop: 2 }}>
              {fmt(nextEvent.date)}
              {nextEvent.note && ` · ${nextEvent.note}`}
            </div>
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 900,
              color: urgencyColor(nextEvent.date),
              textAlign: "right",
              flexShrink: 0,
            }}
          >
            {daysFromNow(nextEvent.date)}
          </div>
        </div>
      )}

      {/* Add event */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <SectionLabel style={{ marginBottom: 0 }}>
          Interview Calendar
        </SectionLabel>
        <button
          onClick={() => setShowAdd((p) => !p)}
          style={{
            padding: "7px 14px",
            borderRadius: 9,
            border: "1.5px solid #5b8def55",
            background: showAdd ? "#5b8def" : "#5b8def12",
            color: showAdd ? "#fff" : "#5b8def",
            fontSize: 12,
            fontWeight: 800,
            cursor: "pointer",
            transition: "all .15s",
          }}
        >
          {showAdd ? "✕ Cancel" : "+ Add Event"}
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <Card>
          <SectionLabel>Schedule Event</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "var(--txt3)",
                    textTransform: "uppercase",
                    letterSpacing: ".07em",
                    marginBottom: 5,
                  }}
                >
                  Company
                </div>
                <select
                  value={form.company}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, company: e.target.value }))
                  }
                  style={inp}
                >
                  {Object.keys(COMPANIES).map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: "var(--txt3)",
                    textTransform: "uppercase",
                    letterSpacing: ".07em",
                    marginBottom: 5,
                  }}
                >
                  Round Type
                </div>
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, type: e.target.value }))
                  }
                  style={inp}
                >
                  {EVENT_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.icon} {t.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--txt3)",
                  textTransform: "uppercase",
                  letterSpacing: ".07em",
                  marginBottom: 5,
                }}
              >
                Date
              </div>
              <input
                type="date"
                min={minDate}
                value={form.date}
                onChange={(e) =>
                  setForm((p) => ({ ...p, date: e.target.value }))
                }
                style={inp}
              />
            </div>
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--txt3)",
                  textTransform: "uppercase",
                  letterSpacing: ".07em",
                  marginBottom: 5,
                }}
              >
                Note (optional)
              </div>
              <input
                value={form.note}
                onChange={(e) =>
                  setForm((p) => ({ ...p, note: e.target.value }))
                }
                placeholder="e.g. Zoom link, venue, time..."
                style={inp}
              />
            </div>
            <button
              onClick={addEvent}
              disabled={!form.date}
              style={{
                padding: "11px",
                borderRadius: 10,
                border: "none",
                background: form.date ? "#5b8def" : "var(--bg4)",
                color: form.date ? "#fff" : "var(--txt3)",
                fontSize: 13,
                fontWeight: 800,
                cursor: form.date ? "pointer" : "not-allowed",
                fontFamily: "inherit",
              }}
            >
              Add to Calendar
            </button>
          </div>
        </Card>
      )}

      {/* Upcoming events */}
      {upcoming.length === 0 && !showAdd ? (
        <Card>
          <div
            style={{
              textAlign: "center",
              padding: "32px 0",
              color: "var(--txt3)",
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 10 }}>📅</div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "var(--txt)",
                marginBottom: 4,
              }}
            >
              No events scheduled
            </div>
            <div style={{ fontSize: 12 }}>
              Add your OA dates, interview rounds, and deadlines.
            </div>
          </div>
        </Card>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {upcoming.map((ev, i) => {
            const co = COMPANIES[ev.company];
            const evType = EVENT_TYPES.find((t) => t.id === ev.type);
            const color = urgencyColor(ev.date);
            return (
              <div
                key={ev.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  background: "var(--bg2)",
                  border: `1px solid ${i === 0 ? color + "55" : "var(--border)"}`,
                  borderRadius: 12,
                }}
              >
                {/* Timeline dot */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: color,
                    }}
                  />
                  {i < upcoming.length - 1 && (
                    <div
                      style={{
                        width: 1,
                        height: 24,
                        background: "var(--border)",
                        marginTop: 2,
                      }}
                    />
                  )}
                </div>

                {/* Company logo */}
                <CompanyLogo
                  logo={co?.logo || ev.company[0]}
                  color={co?.color || "#888"}
                  size={30}
                />

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--txt)",
                    }}
                  >
                    {ev.company} · {evType?.label}
                  </div>
                  <div
                    style={{ fontSize: 11, color: "var(--txt3)", marginTop: 1 }}
                  >
                    {fmt(ev.date)}
                    {ev.note ? ` · ${ev.note}` : ""}
                  </div>
                </div>

                {/* Days away */}
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 800,
                    color,
                    flexShrink: 0,
                  }}
                >
                  {daysFromNow(ev.date)}
                </div>

                {/* Delete */}
                <button
                  onClick={() => removeEvent(ev.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--txt3)",
                    cursor: "pointer",
                    fontSize: 16,
                    padding: "0 2px",
                    lineHeight: 1,
                    flexShrink: 0,
                  }}
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Past events */}
      {past.length > 0 && (
        <details style={{ marginTop: 4 }}>
          <summary
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--txt3)",
              cursor: "pointer",
              letterSpacing: ".06em",
              textTransform: "uppercase",
            }}
          >
            Past Events ({past.length})
          </summary>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              marginTop: 8,
            }}
          >
            {[...past].reverse().map((ev) => {
              const co = COMPANIES[ev.company];
              const evType = EVENT_TYPES.find((t) => t.id === ev.type);
              return (
                <div
                  key={ev.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 14px",
                    background: "var(--bg3)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    opacity: 0.6,
                  }}
                >
                  <span style={{ fontSize: 16 }}>{evType?.icon || "📅"}</span>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: "var(--txt)",
                      }}
                    >
                      {ev.company} · {evType?.label}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--txt3)" }}>
                      {fmt(ev.date)}
                    </div>
                  </div>
                  <button
                    onClick={() => removeEvent(ev.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--txt3)",
                      cursor: "pointer",
                      fontSize: 15,
                      padding: "0 2px",
                    }}
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </details>
      )}
    </div>
  );
}
