// AICoachTab.jsx — Advanced Version
// Replace the AICoachTab function in PlacementPrepView.jsx with this entire file
// Same prop: contextData

import { useState, useMemo, useEffect, useRef, useCallback } from "react";

// ── Primitives ────────────────────────────────────────────────────────────────

function StatPill({ label, value, color, sub }) {
  return (
    <div
      style={{
        flex: "1 1 0",
        minWidth: 0,
        background: color + "12",
        border: `1px solid ${color}28`,
        borderRadius: 10,
        padding: "10px 11px 8px",
      }}
    >
      <div
        style={{
          fontSize: 9,
          color,
          fontWeight: 800,
          letterSpacing: ".07em",
          textTransform: "uppercase",
          marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 17,
          fontWeight: 900,
          color,
          fontFamily: "var(--mono)",
          lineHeight: 1,
          marginBottom: 2,
        }}
      >
        {value}
      </div>
      {sub && <div style={{ fontSize: 9, color: "var(--txt3)" }}>{sub}</div>}
    </div>
  );
}

function AlertBanner({ type, children }) {
  const cfg = {
    danger: {
      bg: "rgba(239,68,68,0.07)",
      border: "#ef444430",
      color: "#ef4444",
      icon: "⚠",
    },
    warn: {
      bg: "rgba(212,180,74,0.07)",
      border: "#d4b44a30",
      color: "#d4b44a",
      icon: "◉",
    },
    good: {
      bg: "rgba(76,175,125,0.07)",
      border: "#4caf7d30",
      color: "#4caf7d",
      icon: "✦",
    },
    info: {
      bg: "rgba(91,141,239,0.07)",
      border: "#5b8def30",
      color: "#5b8def",
      icon: "→",
    },
  };
  const c = cfg[type] || cfg.info;
  return (
    <div
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: 10,
        padding: "9px 12px",
        display: "flex",
        gap: 8,
        alignItems: "flex-start",
      }}
    >
      <span
        style={{ color: c.color, fontSize: 12, flexShrink: 0, marginTop: 1 }}
      >
        {c.icon}
      </span>
      <span style={{ fontSize: 12, color: "var(--txt2)", lineHeight: 1.5 }}>
        {children}
      </span>
    </div>
  );
}

function ScoreBar({ label, pct, color, weight }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span
        style={{ fontSize: 11, color: "var(--txt3)", width: 72, flexShrink: 0 }}
      >
        {label}
      </span>
      <div
        style={{
          flex: 1,
          height: 5,
          background: "var(--bg3)",
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
            transition: "width .6s ease",
          }}
        />
      </div>
      <span
        style={{
          fontSize: 10,
          color,
          fontWeight: 700,
          fontFamily: "var(--mono)",
          width: 30,
          textAlign: "right",
        }}
      >
        {pct}%
      </span>
      <span
        style={{
          fontSize: 9,
          color: "var(--txt3)",
          width: 38,
          textAlign: "right",
        }}
      >
        x{weight}
      </span>
    </div>
  );
}

// ── Intelligence Panel ────────────────────────────────────────────────────────

function IntelligencePanel({ ctx, collapsed }) {
  const { dsa, pace, core, resume, skills } = ctx;
  const overallPct = Math.round(
    (dsa?.score || 0) * 0.35 +
      (core?.pct || 0) * 0.25 +
      (skills?.pct || 0) * 0.2 +
      (resume?.pct || 0) * 0.2,
  );

  const alerts = useMemo(() => {
    const list = [];
    if (pace?.lateDays > 5)
      list.push({
        type: "danger",
        msg: `You're ${Math.round(pace.lateDays)} days behind. Need ${pace.requiredPerDay?.toFixed(1)} q/day but averaging ${pace.actualPerDay?.toFixed(1)}.`,
      });
    else if (pace?.lateDays > 2)
      list.push({
        type: "warn",
        msg: `Barely on pace. ${pace.requiredPerDay?.toFixed(1)} q/day required — one slack week and you slip.`,
      });
    else if (pace?.lateDays < -5)
      list.push({
        type: "good",
        msg: `${Math.abs(Math.round(pace.lateDays))} days ahead of schedule. Use the buffer to reinforce weak patterns.`,
      });

    const stale = dsa?.weakTopics?.filter((t) => t.isStale) || [];
    if (stale.length)
      list.push({
        type: "warn",
        msg: `${stale.length} pattern${stale.length > 1 ? "s" : ""} untouched 12+ days: ${stale
          .slice(0, 2)
          .map((t) => t.label)
          .join(", ")}${stale.length > 2 ? ` +${stale.length - 2} more` : ""}`,
      });

    if ((resume?.pct || 0) < 50)
      list.push({
        type: "danger",
        msg: `Resume at ${resume?.pct}% — fix before applying. It's reviewed before interview invites.`,
      });

    if ((core?.pct || 0) < 30 && (dsa?.score || 0) > 50)
      list.push({
        type: "info",
        msg: `DSA at ${dsa.score}% but Core CS at ${core?.pct}% — interviewers often blend both in the same round.`,
      });

    return list.slice(0, 3);
  }, [ctx]);

  const focusTopics = (dsa?.weakTopics || []).slice(0, 5).map((t) => ({
    label: t.label,
    color: t.isStale ? "#e8924a" : "#ef4444",
    detail: t.isStale
      ? `${t.daysSince}d ago`
      : `${Math.round((t.pct || 0) * 100)}%`,
  }));

  return (
    <div
      style={{
        background: "var(--bg2)",
        borderBottom: "1px solid var(--border)",
        flexShrink: 0,
        overflow: "hidden",
        transition: "max-height .35s cubic-bezier(.4,0,.2,1)",
        maxHeight: collapsed ? 0 : 700,
      }}
    >
      <div
        style={{
          padding: "14px 16px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {/* Stat pills */}
        <div style={{ display: "flex", gap: 7 }}>
          <StatPill
            label="Overall"
            value={`${overallPct}%`}
            sub="readiness"
            color={
              overallPct >= 70
                ? "#4caf7d"
                : overallPct >= 40
                  ? "#d4b44a"
                  : "#ef4444"
            }
          />
          <StatPill
            label="DSA"
            value={`${dsa?.score ?? 0}%`}
            sub={`${dsa?.solved ?? 0}/${dsa?.total ?? 0} q`}
            color={(dsa?.score ?? 0) >= 60 ? "#5b8def" : "#ef4444"}
          />
          <StatPill
            label="Pace"
            value={
              !pace
                ? "–"
                : pace.lateDays > 5
                  ? `${Math.round(pace.lateDays)}d late`
                  : pace.lateDays < -3
                    ? `${Math.abs(Math.round(pace.lateDays))}d early`
                    : "On pace"
            }
            sub={pace ? `${pace.daysLeft}d left` : "no deadline"}
            color={
              !pace
                ? "var(--txt3)"
                : pace.lateDays > 5
                  ? "#ef4444"
                  : pace.lateDays < -3
                    ? "#4caf7d"
                    : "#d4b44a"
            }
          />
        </div>

        {/* Weighted breakdown */}
        <div
          style={{
            background: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: 11,
            padding: "12px 13px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div
            style={{
              fontSize: 9,
              fontWeight: 800,
              color: "var(--txt3)",
              letterSpacing: ".09em",
              textTransform: "uppercase",
              marginBottom: 2,
            }}
          >
            Readiness Breakdown (weighted)
          </div>
          <ScoreBar
            label="DSA"
            pct={dsa?.score || 0}
            color="#5b8def"
            weight="0.35"
          />
          <ScoreBar
            label="Core CS"
            pct={core?.pct || 0}
            color="#9b72cf"
            weight="0.25"
          />
          <ScoreBar
            label="Skills"
            pct={skills?.pct || 0}
            color="#d4b44a"
            weight="0.20"
          />
          <ScoreBar
            label="Resume"
            pct={resume?.pct || 0}
            color="#4caf7d"
            weight="0.20"
          />
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {alerts.map((a, i) => (
              <AlertBanner key={i} type={a.type}>
                {a.msg}
              </AlertBanner>
            ))}
          </div>
        )}

        {/* Priority patterns */}
        {focusTopics.length > 0 && (
          <div>
            <div
              style={{
                fontSize: 9,
                fontWeight: 800,
                color: "var(--txt3)",
                letterSpacing: ".09em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Priority Patterns
            </div>
            <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
              {focusTopics.map((t, i) => (
                <span
                  key={i}
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "3px 9px",
                    borderRadius: 6,
                    background: t.color + "15",
                    color: t.color,
                    border: `1px solid ${t.color}25`,
                  }}
                >
                  {t.label} · {t.detail}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Dynamic suggestions ───────────────────────────────────────────────────────

function buildSuggestions(ctx) {
  const { dsa, pace, core, resume } = ctx;
  const chips = [];

  chips.push({
    label: "📋 Today's Plan",
    prompt: `Give me an exact 3-task plan for today. DSA: ${dsa?.solved}/${dsa?.total} (${dsa?.score}%). Pace: ${pace ? (pace.lateDays > 0 ? pace.lateDays.toFixed(0) + "d late" : "on track") : "unset"}. Weakest patterns: ${
      dsa?.weakTopics
        ?.slice(0, 3)
        .map((t) => t.label)
        .join(", ") || "none"
    }. Number the tasks with time estimates.`,
  });

  if (pace) {
    if (pace.lateDays > 3)
      chips.push({
        label: "🔴 Catch-Up Plan",
        prompt: `I'm ${Math.round(pace.lateDays)} days behind. Need ${pace.requiredPerDay?.toFixed(1)} q/day, averaging ${pace.actualPerDay?.toFixed(1)}. Give a blunt 7-day catch-up plan with daily targets.`,
      });
    else
      chips.push({
        label: "📈 Pace Report",
        prompt: `Pace check: ${pace.daysLeft}d left, ${pace.remaining} q remaining, avg ${pace.actualPerDay?.toFixed(1)} vs ${pace.requiredPerDay?.toFixed(1)} needed. Project my finish date and what to change.`,
      });
  }

  if (dsa?.weakTopics?.length) {
    const w = dsa.weakTopics[0];
    chips.push({
      label: `🎯 Drill: ${w.label}`,
      prompt: `${w.label} is my weakest pattern (${Math.round((w.pct || 0) * 100)}% done${w.isStale ? `, ${w.daysSince}d untouched` : ""}). Give a 20-min targeted drill: key concepts, common interview patterns, and the single most important insight.`,
    });
  }

  chips.push({
    label: "🚨 Risk Report",
    prompt: `Full risk: DSA ${dsa?.score}%, Core ${ctx.core?.pct}%, Resume ${resume?.pct}%, ${pace ? `${Math.round(pace.lateDays)}d ${pace.lateDays > 0 ? "behind" : "ahead"}` : "no deadline"}. Rank top 3 risks by interview impact with one immediate fix each.`,
  });

  chips.push({
    label: "🧩 Mock Question",
    prompt: `Ask me a conceptual interview question on ${dsa?.weakTopics?.[0]?.label || "Arrays"}. After I answer (or say 'show answer'), give the model solution with time and space complexity.`,
  });

  if ((core?.pct || 0) < 60)
    chips.push({
      label: "📚 Core CS Gap",
      prompt: `Core CS at ${ctx.core?.pct}% with ${dsa?.score}% DSA. Which 3 core subjects give highest interview ROI right now? Give specific subtopics per subject.`,
    });

  if ((resume?.pct || 0) < 70)
    chips.push({
      label: "📄 Resume Fix",
      prompt: `Resume at ${resume?.pct}%. What are the top 3 highest-impact fixes before I start applying? Assume a standard SDE resume.`,
    });

  return chips.slice(0, 6);
}

// ── Message renderer ──────────────────────────────────────────────────────────

function renderInlineBold(text) {
  return text.split(/(\*\*.*?\*\*)/g).map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <strong key={i} style={{ color: "var(--txt)", fontWeight: 700 }}>
        {p.slice(2, -2)}
      </strong>
    ) : (
      p
    ),
  );
}

function MessageContent({ text }) {
  if (!text) return null;
  const lines = text
    .replace(/^#{1,4}\s+/gm, "")
    .replace(/^---+$/gm, "")
    .split("\n");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} style={{ height: 6 }} />;

        const colonMatch = line.match(/^\*\*(.+?)\*\*[:]\s*(.+)$/);
        if (colonMatch)
          return (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 6,
                alignItems: "baseline",
                lineHeight: 1.55,
              }}
            >
              <strong
                style={{
                  color: "var(--txt)",
                  fontSize: 12,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {colonMatch[1]}:
              </strong>
              <span style={{ fontSize: 13, color: "var(--txt2)" }}>
                {colonMatch[2]}
              </span>
            </div>
          );

        const bulletMatch = line.match(/^[*\-•·]\s+(.+)$/);
        if (bulletMatch)
          return (
            <div key={i} style={{ display: "flex", gap: 8, lineHeight: 1.55 }}>
              <span
                style={{
                  color: "#6366f1",
                  flexShrink: 0,
                  fontSize: 13,
                  marginTop: 1,
                }}
              >
                ›
              </span>
              <span style={{ fontSize: 13, color: "var(--txt2)" }}>
                {renderInlineBold(bulletMatch[1])}
              </span>
            </div>
          );

        return (
          <div
            key={i}
            style={{ fontSize: 13, lineHeight: 1.6, color: "var(--txt2)" }}
          >
            {renderInlineBold(line)}
          </div>
        );
      })}
    </div>
  );
}

function tagMessage(text) {
  const l = text.toLowerCase();
  if (l.includes("pace") || l.includes("deadline") || l.includes("days left"))
    return { tag: "Pace", color: "#d4b44a" };
  if (l.includes("plan") || l.includes("today") || l.includes("schedule"))
    return { tag: "Plan", color: "#5b8def" };
  if (l.includes("risk") || l.includes("danger") || l.includes("worst"))
    return { tag: "Risk", color: "#ef4444" };
  if (l.includes("resume")) return { tag: "Resume", color: "#4caf7d" };
  if (l.includes("mock") || l.includes("question") || l.includes("interview"))
    return { tag: "Mock", color: "#9b72cf" };
  if (l.includes("weak") || l.includes("pattern") || l.includes("drill"))
    return { tag: "DSA", color: "#e8924a" };
  return null;
}

// ── Main Component ────────────────────────────────────────────────────────────

export function AICoachTab({ contextData }) {
  const ctx = contextData || {};
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);
  const [sessionTags, setSessionTags] = useState([]);
  const scrollRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  // Greeting on mount
  useEffect(() => {
    const { dsa, pace, core, resume } = ctx;
    const overallPct = Math.round(
      (dsa?.score || 0) * 0.35 +
        (core?.pct || 0) * 0.25 +
        (ctx.skills?.pct || 0) * 0.2 +
        (resume?.pct || 0) * 0.2,
    );
    const readiness =
      overallPct >= 70
        ? "solid"
        : overallPct >= 40
          ? "developing"
          : "early-stage";
    const topAlert =
      pace?.lateDays > 5
        ? `You're **${Math.round(pace.lateDays)} days behind** — that's the critical issue right now.`
        : dsa?.weakTopics?.length
          ? `Top risk: **${dsa.weakTopics[0].label}** — ${dsa.weakTopics[0].isStale ? `${dsa.weakTopics[0].daysSince}d untouched` : `${Math.round((dsa.weakTopics[0].pct || 0) * 100)}% done`}.`
          : "No critical alerts — maintain current pace.";
    setMessages([
      {
        role: "assistant",
        content: `Prep snapshot loaded. Overall readiness: **${overallPct}%** (${readiness}).\n\n${topAlert}\n\nUse the chips or ask anything — daily plan, pace projection, pattern drill, mock question, or risk report.`,
        tag: { tag: "Briefing", color: "#6366f1" },
      },
    ]);
  }, []);

  const suggestions = useMemo(() => buildSuggestions(ctx), [ctx]);

  const sendMessage = useCallback(
    async (text) => {
      if (!text.trim() || loading) return;

      const msgTag = tagMessage(text);
      if (msgTag && !sessionTags.find((t) => t.tag === msgTag.tag))
        setSessionTags((prev) => [...prev, msgTag]);

      setMessages((prev) => [...prev, { role: "user", content: text }]);
      setInput("");
      setLoading(true);
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "", tag: msgTag },
      ]);

      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          body: JSON.stringify({
            message: text,
            context: ctx,
            history: messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error("bad");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        setLoading(false);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop();
          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6).trim();
            if (data === "[DONE]") break;
            try {
              const { token } = JSON.parse(data);
              if (token)
                setMessages((prev) => {
                  const u = [...prev];
                  const last = u[u.length - 1];
                  u[u.length - 1] = { ...last, content: last.content + token };
                  return u;
                });
            } catch {}
          }
        }
      } catch {
        setLoading(false);
        setMessages((prev) => {
          const u = [...prev];
          u[u.length - 1] = {
            role: "ai",
            content: "Connection error. Check your network or API key.",
            tag: { tag: "Error", color: "#ef4444" },
          };
          return u;
        });
      }
    },
    [loading, messages, ctx],
  );

  return (
    <div
      style={{
        height: "calc(100vh - 180px)",
        minHeight: 520,
        display: "flex",
        flexDirection: "column",
        background: "var(--bg)",
        border: "1px solid var(--border)",
        borderRadius: 18,
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes pulse-dot   { 0%,100%{transform:scale(.8);opacity:.4} 50%{transform:scale(1.2);opacity:1} }
        @keyframes blink-cursor{ 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes slide-in    { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        .ai-msg { animation:slide-in .22s ease forwards; }
        .coach-chip:hover:not(:disabled){ border-color:#6366f1 !important; color:#6366f1 !important; background:rgba(99,102,241,0.07) !important; }
      `}</style>

      {/* ── Header ── */}
      <div
        style={{
          padding: "12px 14px 10px",
          borderBottom: "1px solid var(--border)",
          flexShrink: 0,
          background:
            "linear-gradient(135deg,rgba(99,102,241,0.06) 0%,var(--bg2) 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 11,
                flexShrink: 0,
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                boxShadow: "0 4px 14px rgba(99,102,241,0.3)",
              }}
            >
              🧠
            </div>
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  color: "var(--txt)",
                  lineHeight: 1.2,
                }}
              >
                Placement Intelligence
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "var(--txt3)",
                  marginTop: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "#4caf7d",
                    display: "inline-block",
                  }}
                />
                Live · {ctx.dsa?.solved ?? 0} q tracked ·{" "}
                {messages.filter((m) => m.role === "user").length} queries this
                session
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {sessionTags.slice(0, 3).map((t) => (
              <span
                key={t.tag}
                style={{
                  fontSize: 9,
                  fontWeight: 800,
                  padding: "2px 7px",
                  borderRadius: 5,
                  background: t.color + "18",
                  color: t.color,
                  border: `1px solid ${t.color}30`,
                }}
              >
                {t.tag}
              </span>
            ))}
            <button
              onClick={() => setPanelOpen((p) => !p)}
              title={panelOpen ? "Collapse insights" : "Show insights"}
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: panelOpen ? "rgba(99,102,241,0.1)" : "var(--bg2)",
                color: panelOpen ? "#6366f1" : "var(--txt3)",
                cursor: "pointer",
                fontSize: 11,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {panelOpen ? "▲" : "▼"}
            </button>
          </div>
        </div>
      </div>

      {/* ── Intelligence Panel ── */}
      <IntelligencePanel ctx={ctx} collapsed={!panelOpen} />

      {/* ── Messages ── */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "14px 14px 8px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          scrollbarWidth: "thin",
          scrollbarColor: "var(--border) transparent",
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className="ai-msg"
            style={{
              display: "flex",
              justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              alignItems: "flex-end",
              gap: 8,
            }}
          >
            {m.role !== "user" && (
              <div
                style={{
                  width: 27,
                  height: 27,
                  borderRadius: 9,
                  flexShrink: 0,
                  marginBottom: m.tag ? 18 : 2,
                  background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                }}
              >
                🧠
              </div>
            )}
            <div
              style={{
                maxWidth: "84%",
                display: "flex",
                flexDirection: "column",
                alignItems: m.role === "user" ? "flex-end" : "flex-start",
                gap: 4,
              }}
            >
              {m.role !== "user" && m.tag && (
                <span
                  style={{
                    fontSize: 9,
                    fontWeight: 800,
                    padding: "2px 8px",
                    borderRadius: 5,
                    background: m.tag.color + "15",
                    color: m.tag.color,
                    letterSpacing: ".06em",
                  }}
                >
                  {m.tag.tag}
                </span>
              )}
              <div
                style={{
                  padding: "11px 14px",
                  borderRadius:
                    m.role === "user"
                      ? "16px 16px 4px 16px"
                      : "4px 16px 16px 16px",
                  background:
                    m.role === "user"
                      ? "linear-gradient(135deg,#5b8def,#6366f1)"
                      : "var(--bg2)",
                  border:
                    m.role === "user" ? "none" : "1px solid var(--border)",
                  boxShadow:
                    m.role === "user"
                      ? "0 3px 14px rgba(91,141,239,0.28)"
                      : "0 1px 4px rgba(0,0,0,0.06)",
                }}
              >
                {m.role === "user" ? (
                  <div
                    style={{ fontSize: 13, color: "#fff", lineHeight: 1.55 }}
                  >
                    {m.content}
                  </div>
                ) : (
                  <MessageContent text={m.content} />
                )}
                {m.role === "ai" &&
                  i === messages.length - 1 &&
                  !loading &&
                  m.content && (
                    <span
                      style={{
                        display: "inline-block",
                        width: 2,
                        height: 13,
                        background: "var(--txt3)",
                        marginLeft: 3,
                        verticalAlign: "middle",
                        animation: "blink-cursor 1s step-end infinite",
                      }}
                    />
                  )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div
            className="ai-msg"
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <div
              style={{
                width: 27,
                height: 27,
                borderRadius: 9,
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
              }}
            >
              🧠
            </div>
            <div
              style={{
                padding: "12px 16px",
                borderRadius: "4px 16px 16px 16px",
                background: "var(--bg2)",
                border: "1px solid var(--border)",
                display: "flex",
                gap: 5,
                alignItems: "center",
              }}
            >
              {[0, 0.18, 0.36].map((delay, idx) => (
                <div
                  key={idx}
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: "#6366f1",
                    opacity: 0.7,
                    animation: `pulse-dot 1.1s ${delay}s ease-in-out infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Suggestion chips ── */}
      <div
        style={{
          padding: "10px 14px 0",
          background: "var(--bg2)",
          borderTop: "1px solid var(--border)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 6,
            overflowX: "auto",
            paddingBottom: 10,
            scrollbarWidth: "none",
          }}
        >
          {suggestions.map((s, i) => (
            <button
              key={i}
              className="coach-chip"
              onClick={() => sendMessage(s.prompt)}
              disabled={loading}
              style={{
                flexShrink: 0,
                padding: "6px 13px",
                borderRadius: 20,
                border: "1px solid var(--border)",
                background: "var(--bg)",
                color: "var(--txt3)",
                fontSize: 11,
                fontWeight: 600,
                cursor: loading ? "default" : "pointer",
                opacity: loading ? 0.5 : 1,
                whiteSpace: "nowrap",
                transition: "all .18s",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Input bar ── */}
      <div
        style={{
          padding: "8px 14px 14px",
          background: "var(--bg2)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            background: "var(--bg)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            padding: "4px 4px 4px 14px",
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && !e.shiftKey && sendMessage(input)
            }
            placeholder="Ask about pace, weak patterns, mock questions, risks…"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              fontSize: 13,
              color: "var(--txt)",
              outline: "none",
              padding: "8px 0",
            }}
          />
          {input.length > 10 && (
            <span style={{ fontSize: 9, color: "var(--txt3)", flexShrink: 0 }}>
              ↵
            </span>
          )}
          <button
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            style={{
              padding: "8px 16px",
              borderRadius: 11,
              border: "none",
              background:
                input.trim() && !loading
                  ? "linear-gradient(135deg,#5b8def,#6366f1)"
                  : "var(--bg3)",
              color: input.trim() && !loading ? "white" : "var(--txt3)",
              cursor: input.trim() && !loading ? "pointer" : "default",
              fontWeight: 800,
              fontSize: 16,
              transition: "all .18s",
              flexShrink: 0,
            }}
          >
            ↑
          </button>
        </div>
        <div
          style={{
            fontSize: 9,
            color: "var(--txt3)",
            marginTop: 6,
            textAlign: "center",
          }}
        >
          Powered by live prep data · {ctx.dsa?.weakTopics?.length ?? 0} weak
          patterns · {ctx.pace?.daysLeft ?? "–"} days remaining
        </div>
      </div>
    </div>
  );
}

export default AICoachTab;
