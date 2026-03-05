// pip.InterviewCalendar.jsx — row-per-company horizontal flow tree

"use client";
import { useState, useEffect } from "react";
import { COMPANIES } from "./constants";
import { load, save } from "./store.js";
import { Card, SectionLabel, CompanyLogo } from "./ui.js";

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
  if (diff < 0) return "#555";
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
  { id: "deadline", label: "App. Deadline", icon: "📅" },
];

// ── One horizontal row for a single company ───────────────────────────────────
function CompanyRow({
  company,
  events,
  coData,
  isPast: isPastSection,
  onAddEvent,
}) {
  const color = coData?.color || "#5b8def";
  const isPastEv = (d) => Math.ceil((new Date(d) - Date.now()) / 86400000) < 0;
  const minDate = new Date().toISOString().slice(0, 10);

  // Inline quick-add state per row
  const [showInlineAdd, setShowInlineAdd] = useState(false);
  const [inlineForm, setInlineForm] = useState({
    type: "round1",
    date: "",
    note: "",
  });

  function submitInline() {
    if (!inlineForm.date) return;
    onAddEvent({ company, ...inlineForm });
    setInlineForm({ type: "round1", date: "", note: "" });
    setShowInlineAdd(false);
  }

  const miniInp = {
    background: "var(--bg3)",
    border: `1px solid ${color}44`,
    borderRadius: 7,
    padding: "5px 8px",
    color: "var(--txt)",
    fontSize: 11,
    outline: "none",
    fontFamily: "inherit",
    width: "100%",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        background: "var(--bg2)",
        border: `1px solid ${isPastSection ? "var(--border)" : color + "33"}`,
        borderLeft: `3px solid ${isPastSection ? "#333" : color}`,
        borderRadius: 12,
        padding: "12px 14px",
        opacity: isPastSection ? 0.65 : 1,
      }}
    >
      {/* ── Company label ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 12,
        }}
      >
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: isPastSection ? "#333" : color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            fontWeight: 900,
            color: "#fff",
            flexShrink: 0,
          }}
        >
          {company[0]}
        </div>
        <span
          style={{
            fontSize: 13,
            fontWeight: 800,
            color: isPastSection ? "var(--txt2)" : color,
          }}
        >
          {company}
        </span>
        <span
          style={{
            fontSize: 10,
            color: "var(--txt3)",
            fontWeight: 600,
            padding: "2px 7px",
            borderRadius: 8,
            background: "var(--bg3)",
            border: "1px solid var(--border)",
          }}
        >
          {events.length} round{events.length !== 1 ? "s" : ""}
        </span>
        {isPastSection && (
          <span
            style={{
              fontSize: 9,
              color: "#555",
              fontWeight: 700,
              marginLeft: "auto",
              letterSpacing: ".06em",
            }}
          >
            COMPLETED
          </span>
        )}
      </div>

      {/* ── Horizontal chain ── */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          overflowX: "auto",
          paddingBottom: 4,
          gap: 0,
          scrollbarWidth: "thin",
          scrollbarColor: color + "33 transparent",
        }}
      >
        {events.map((ev, i) => {
          const evType = EVENT_TYPES.find((t) => t.id === ev.type);
          const uColor = isPastEv(ev.date) ? "#555" : urgencyColor(ev.date);
          const past = isPastEv(ev.date);
          const isFirst = i === 0;

          return (
            <div
              key={ev.id}
              style={{ display: "flex", alignItems: "center", flexShrink: 0 }}
            >
              {/* Connecting arrow */}
              {!isFirst && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    width: 36,
                    flexShrink: 0,
                    marginTop: 12,
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      height: 2,
                      background: `linear-gradient(90deg, ${color}88, ${color}44)`,
                      borderRadius: 2,
                    }}
                  />
                  <div
                    style={{
                      width: 0,
                      height: 0,
                      borderTop: "4px solid transparent",
                      borderBottom: "4px solid transparent",
                      borderLeft: `5px solid ${color}66`,
                    }}
                  />
                </div>
              )}

              {/* Node + card */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  flexShrink: 0,
                  width: 110,
                }}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    border: `2.5px solid ${past ? "#3a3a3a" : color}`,
                    background: past ? "#161616" : color + "25",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: past ? "none" : `0 0 10px ${color}44`,
                    marginBottom: 5,
                    zIndex: 1,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: past ? "#444" : color,
                    }}
                  />
                </div>
                <div
                  style={{
                    width: 2,
                    height: 8,
                    background: past ? "#333" : color + "66",
                  }}
                />
                <div
                  style={{
                    width: "100%",
                    background: past ? "var(--bg3)" : "var(--bg)",
                    border: `1.5px solid ${past ? "var(--border)" : isFirst ? color + "77" : color + "33"}`,
                    borderTop: `2px solid ${past ? "#333" : color}`,
                    borderRadius: 10,
                    padding: "8px 9px",
                    position: "relative",
                  }}
                >
                  <button
                    onClick={() => ev._onRemove(ev.id)}
                    style={{
                      position: "absolute",
                      top: 3,
                      right: 4,
                      background: "none",
                      border: "none",
                      color: "var(--txt3)",
                      cursor: "pointer",
                      fontSize: 13,
                      lineHeight: 1,
                      opacity: 0.45,
                      padding: 0,
                    }}
                  >
                    ×
                  </button>
                  <div
                    style={{
                      fontSize: 17,
                      textAlign: "center",
                      marginBottom: 4,
                    }}
                  >
                    {evType?.icon || "📅"}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "var(--txt)",
                      textAlign: "center",
                      marginBottom: 3,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {evType?.label}
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      color: "var(--txt3)",
                      textAlign: "center",
                      marginBottom: 5,
                    }}
                  >
                    {fmt(ev.date)}
                    {ev.note && (
                      <div
                        style={{
                          marginTop: 1,
                          fontStyle: "italic",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {ev.note}
                      </div>
                    )}
                  </div>
                  <div
                    style={{
                      textAlign: "center",
                      fontSize: 10,
                      fontWeight: 800,
                      color: uColor,
                      background: uColor + "18",
                      border: `1px solid ${uColor}33`,
                      borderRadius: 5,
                      padding: "2px 5px",
                    }}
                  >
                    {daysFromNow(ev.date)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* ── Inline quick-add at the end of the chain ── */}
        {!isPastSection && (
          <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
            {/* Arrow to the add node */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                width: 36,
                flexShrink: 0,
                marginTop: showInlineAdd ? 12 : 12,
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: 2,
                  background: showInlineAdd
                    ? `linear-gradient(90deg, ${color}88, ${color}44)`
                    : `repeating-linear-gradient(90deg, ${color}44 0,${color}44 4px,transparent 4px,transparent 8px)`,
                  borderRadius: 2,
                }}
              />
              {showInlineAdd && (
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderTop: "4px solid transparent",
                    borderBottom: "4px solid transparent",
                    borderLeft: `5px solid ${color}66`,
                  }}
                />
              )}
            </div>

            {!showInlineAdd ? (
              /* ── Collapsed: just the + circle ── */
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  flexShrink: 0,
                  marginLeft: 4,
                }}
              >
                {/* Ghost node */}
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    border: `2px dashed ${color}55`,
                    background: "var(--bg3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 5,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: color + "44",
                    }}
                  />
                </div>
                <div
                  style={{ width: 2, height: 8, background: color + "33" }}
                />
                {/* + button card */}
                <button
                  onClick={() => setShowInlineAdd(true)}
                  style={{
                    width: 110,
                    cursor: "pointer",
                    background: color + "0d",
                    border: `1.5px dashed ${color}44`,
                    borderTop: `2px solid ${color}44`,
                    borderRadius: 10,
                    padding: "10px 8px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                    transition: "all .15s",
                    fontFamily: "inherit",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = color + "1a";
                    e.currentTarget.style.borderColor = color + "88";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = color + "0d";
                    e.currentTarget.style.borderColor = color + "44";
                  }}
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: color + "22",
                      border: `1.5px solid ${color}66`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 15,
                      color,
                      fontWeight: 700,
                    }}
                  >
                    +
                  </div>
                  <span
                    style={{
                      fontSize: 9,
                      fontWeight: 700,
                      color: color + "bb",
                      textAlign: "center",
                      lineHeight: 1.3,
                    }}
                  >
                    Add next round
                  </span>
                </button>
              </div>
            ) : (
              /* ── Expanded: inline mini-form ── */
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  flexShrink: 0,
                  marginLeft: 4,
                }}
              >
                {/* Active node */}
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    border: `2.5px solid ${color}`,
                    background: color + "25",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 0 10px ${color}55`,
                    marginBottom: 5,
                  }}
                >
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: color,
                    }}
                  />
                </div>
                <div
                  style={{ width: 2, height: 8, background: color + "88" }}
                />

                {/* Mini form card */}
                <div
                  style={{
                    width: 148,
                    background: "var(--bg)",
                    border: `1.5px solid ${color}66`,
                    borderTop: `2px solid ${color}`,
                    borderRadius: 10,
                    padding: "10px 10px 8px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      fontWeight: 800,
                      color,
                      letterSpacing: ".08em",
                      textTransform: "uppercase",
                      marginBottom: 2,
                    }}
                  >
                    + {company} Round
                  </div>

                  {/* Round type */}
                  <select
                    value={inlineForm.type}
                    onChange={(e) =>
                      setInlineForm((p) => ({ ...p, type: e.target.value }))
                    }
                    style={miniInp}
                  >
                    {EVENT_TYPES.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.icon} {t.label}
                      </option>
                    ))}
                  </select>

                  {/* Date */}
                  <input
                    type="date"
                    min={minDate}
                    value={inlineForm.date}
                    onChange={(e) =>
                      setInlineForm((p) => ({ ...p, date: e.target.value }))
                    }
                    style={miniInp}
                  />

                  {/* Note */}
                  <input
                    value={inlineForm.note}
                    onChange={(e) =>
                      setInlineForm((p) => ({ ...p, note: e.target.value }))
                    }
                    placeholder="Note (optional)"
                    style={miniInp}
                  />

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 5, marginTop: 2 }}>
                    <button
                      onClick={submitInline}
                      disabled={!inlineForm.date}
                      style={{
                        flex: 1,
                        padding: "5px 0",
                        borderRadius: 7,
                        border: "none",
                        background: inlineForm.date ? color : "var(--bg4)",
                        color: inlineForm.date ? "#fff" : "var(--txt3)",
                        fontSize: 11,
                        fontWeight: 800,
                        cursor: inlineForm.date ? "pointer" : "not-allowed",
                        fontFamily: "inherit",
                        transition: "all .15s",
                      }}
                    >
                      Add ✓
                    </button>
                    <button
                      onClick={() => {
                        setShowInlineAdd(false);
                        setInlineForm({ type: "round1", date: "", note: "" });
                      }}
                      style={{
                        padding: "5px 8px",
                        borderRadius: 7,
                        border: "1px solid var(--border)",
                        background: "var(--bg3)",
                        color: "var(--txt3)",
                        fontSize: 11,
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
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

  // Called from both the top-level form AND inline row quick-add
  function addEvent(data) {
    const ev = data || form;
    if (!ev.date) return;
    setEvents((p) =>
      [...p, { ...ev, id: Date.now().toString() }].sort(
        (a, b) => new Date(a.date) - new Date(b.date),
      ),
    );
    if (!data) {
      setForm({ company: "Amazon", type: "oa", date: "", note: "" });
      setShowAdd(false);
    }
  }

  function removeEvent(id) {
    setEvents((p) => p.filter((e) => e.id !== id));
  }

  const withRemove = events.map((e) => ({ ...e, _onRemove: removeEvent }));
  const upcoming = withRemove.filter(
    (e) => Math.ceil((new Date(e.date) - Date.now()) / 86400000) >= 0,
  );
  const past = withRemove.filter(
    (e) => Math.ceil((new Date(e.date) - Date.now()) / 86400000) < 0,
  );
  const nextEvent = upcoming[0];

  function groupByCompany(list) {
    const order = [],
      map = {};
    for (const ev of list) {
      if (!map[ev.company]) {
        map[ev.company] = [];
        order.push(ev.company);
      }
      map[ev.company].push(ev);
    }
    return { order, map };
  }

  const { order: upOrder, map: upMap } = groupByCompany(upcoming);
  const { order: pastOrder, map: pastMap } = groupByCompany(
    [...past].reverse(),
  );

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
      {/* ── Next event banner ── */}
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
              flexShrink: 0,
            }}
          >
            {daysFromNow(nextEvent.date)}
          </div>
        </div>
      )}

      {/* ── Header + Add ── */}
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

      {/* ── Add form ── */}
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
              onClick={() => addEvent()}
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

      {/* ── Upcoming rows ── */}
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
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {upOrder.map((company) => (
            <CompanyRow
              key={company}
              company={company}
              events={upMap[company]}
              coData={COMPANIES[company]}
              isPast={false}
              onAddEvent={addEvent}
            />
          ))}
        </div>
      )}

      {/* ── Past rows ── */}
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
              userSelect: "none",
            }}
          >
            Past Events ({past.length})
          </summary>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginTop: 10,
            }}
          >
            {pastOrder.map((company) => (
              <CompanyRow
                key={company}
                company={company}
                events={pastMap[company]}
                coData={COMPANIES[company]}
                isPast={true}
              />
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
