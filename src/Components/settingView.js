"use client";
import { useState, useEffect } from "react";
import { useApp } from "@/Components/store";

// ── Credit Constants (must match Aiplannerview.js) ────────────────────────────
const TOTAL_CREDITS = 5;
const PLAN_CREDIT_COST = 2;
const CHAT_CREDIT_COST = 1;

// function getCreditsUsed() {
//   try {
//     return parseInt(localStorage.getItem("gr_credits_used") || "0");
//   } catch {
//     return 0;
//   }
// }

// ── SHARED avatar color palette ───────────────────────────────────────────────
const AVATAR_COLORS = [
  "#5b8def",
  "#9b72cf",
  "#4caf7d",
  "#e8924a",
  "#d46fa0",
  "#d4b44a",
];
function getAvatarColor(name) {
  return AVATAR_COLORS[
    name.split("").reduce((s, c) => s + c.charCodeAt(0), 0) %
      AVATAR_COLORS.length
  ];
}

const THEMES = [
  {
    id: "dark",
    label: "Dark",
    bg: "#080808",
    fg: "#f0f0f0",
    sub: "Pure black",
  },
  {
    id: "white",
    label: "Light",
    bg: "#fafafa",
    fg: "#111111",
    sub: "Pure white",
  },
  { id: "gray", label: "Gray", bg: "#181818", fg: "#ebebeb", sub: "Mid gray" },
];
const SEMS = [
  "Semester 1",
  "Semester 2",
  "Semester 3",
  "Semester 4",
  "Semester 5",
  "Semester 6",
  "Semester 7",
  "Semester 8",
];
const BRANCHES = [
  "CSE",
  "IT",
  "ECE",
  "EEE",
  "Mechanical",
  "Civil",
  "Chemical",
  "Aerospace",
  "Biotech",
  "Other",
];
const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

function Avatar({ name, size = 64 }) {
  const initials =
    name
      .trim()
      .split(" ")
      .map((w) => w[0]?.toUpperCase() || "")
      .slice(0, 2)
      .join("") || "?";
  const color = getAvatarColor(name);
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.35,
        fontWeight: 800,
        color: "#fff",
        flexShrink: 0,
        letterSpacing: "-.02em",
      }}
    >
      {initials}
    </div>
  );
}


// function AICreditsSection() {
//   const [creditsUsed, setCreditsUsed] = useState(0);
//   const [showResetConfirm, setShowResetConfirm] = useState(false);

//   useEffect(() => {
//     setCreditsUsed(getCreditsUsed());
//   }, []);

//   const creditsRemaining = Math.max(0, TOTAL_CREDITS - creditsUsed);
//   const pct = (creditsRemaining / TOTAL_CREDITS) * 100;
//   const barColor =
//     pct > 40 ? "#4caf7d" : pct > 20 ? "var(--orange)" : "var(--red)";
//   const isExhausted = creditsRemaining === 0;

//   function handleResetCredits() {
//     localStorage.setItem("gr_credits_used", "0");
//     setCreditsUsed(0);
//     setShowResetConfirm(false);
//   }

//   return (
//     <div style={{ marginBottom: 24 }}>
//       <div className="slabel" style={{ marginBottom: 10 }}>
//         AI Credits
//       </div>

//       {/* Main credit card */}
//       <div
//         style={{
//           background: isExhausted ? "var(--red)10" : "var(--bg2)",
//           border: `1.5px solid ${isExhausted ? "var(--red)44" : "var(--border)"}`,
//           borderRadius: 16,
//           padding: 18,
//         }}
//        >
//         {/* Header row */}
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             marginBottom: 14,
//           }}
//         >
//           <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//             <div
//               style={{
//                 width: 40,
//                 height: 40,
//                 borderRadius: 10,
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 fontSize: 20,
//                 background: isExhausted ? "var(--red)15" : "var(--blue)15",
//               }}
//             >
//               {isExhausted ? "🔒" : "⚡"}
//             </div>
//             <div>
//               <div
//                 style={{ fontSize: 14, fontWeight: 700, color: "var(--txt)" }}
//               >
//                 Free AI Credits
//               </div>
//               <div style={{ fontSize: 11, color: "var(--txt3)" }}>
//                 Shared across Plan & Chat
//               </div>
//             </div>
//           </div>
//           <div style={{ textAlign: "right" }}>
//             <div
//               style={{
//                 fontSize: 28,
//                 fontWeight: 800,
//                 color: isExhausted ? "var(--red)" : barColor,
//                 lineHeight: 1,
//                 fontFamily: "var(--mono)",
//               }}
//             >
//               {creditsRemaining}
//             </div>
//             <div style={{ fontSize: 10, color: "var(--txt3)" }}>
//               of {TOTAL_CREDITS} left
//             </div>
//           </div>
//         </div>

//         {/* Progress bar */}
//         <div
//           style={{
//             height: 8,
//             background: "var(--bg4)",
//             borderRadius: 6,
//             overflow: "hidden",
//             marginBottom: 10,
//           }}
//         >
//           <div
//             style={{
//               height: "100%",
//               width: `${pct}%`,
//               background: barColor,
//               borderRadius: 6,
//               transition: "width .4s ease",
//             }}
//           />
//         </div>

//         {/* Pip dots */}
//         <div style={{ display: "flex", gap: 5, marginBottom: 14 }}>
//           {Array.from({ length: TOTAL_CREDITS }).map((_, i) => (
//             <div
//               key={i}
//               style={{
//                 flex: 1,
//                 height: 5,
//                 borderRadius: 3,
//                 background: i < creditsUsed ? "var(--red)55" : "#4caf7d88",
//                 transition: "background .3s",
//               }}
//             />
//           ))}
//         </div>

//         {/* Cost breakdown */}
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "1fr 1fr",
//             gap: 8,
//             marginBottom: 14,
//           }}
//         >
//           {[
//             {
//               icon: "🧠",
//               label: "Generate Plan",
//               cost: PLAN_CREDIT_COST,
//               desc: "per generation",
//             },
//             {
//               icon: "💬",
//               label: "Chat Message",
//               cost: CHAT_CREDIT_COST,
//               desc: "per message",
//             },
//           ].map((item) => (
//             <div
//               key={item.label}
//               style={{
//                 background: "var(--bg3)",
//                 border: "1px solid var(--border)",
//                 borderRadius: 10,
//                 padding: "10px 12px",
//               }}
//             >
//               <div style={{ fontSize: 16, marginBottom: 4 }}>{item.icon}</div>
//               <div
//                 style={{
//                   fontSize: 12,
//                   fontWeight: 700,
//                   color: "var(--txt)",
//                   marginBottom: 2,
//                 }}
//               >
//                 {item.label}
//               </div>
//               <div style={{ fontSize: 11, color: "var(--txt3)" }}>
//                 {item.desc}
//               </div>
//               <div
//                 style={{
//                   marginTop: 6,
//                   fontSize: 13,
//                   fontWeight: 800,
//                   color: "var(--txt)",
//                   fontFamily: "var(--mono)",
//                 }}
//               >
//                 {item.cost} credit{item.cost !== 1 ? "s" : ""}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Usage stats */}
//         <div
//           style={{
//             background: "var(--bg3)",
//             borderRadius: 10,
//             padding: "10px 12px",
//             display: "flex",
//             justifyContent: "space-between",
//             marginBottom: 14,
//           }}
//         >
//           <div style={{ textAlign: "center" }}>
//             <div
//               style={{
//                 fontSize: 16,
//                 fontWeight: 800,
//                 color: "var(--txt)",
//                 fontFamily: "var(--mono)",
//               }}
//             >
//               {creditsUsed}
//             </div>
//             <div style={{ fontSize: 10, color: "var(--txt3)" }}>Used</div>
//           </div>
//           <div style={{ width: 1, background: "var(--border)" }} />
//           <div style={{ textAlign: "center" }}>
//             <div
//               style={{
//                 fontSize: 16,
//                 fontWeight: 800,
//                 color: barColor,
//                 fontFamily: "var(--mono)",
//               }}
//             >
//               {creditsRemaining}
//             </div>
//             <div style={{ fontSize: 10, color: "var(--txt3)" }}>Remaining</div>
//           </div>
//           <div style={{ width: 1, background: "var(--border)" }} />
//           <div style={{ textAlign: "center" }}>
//             <div
//               style={{
//                 fontSize: 16,
//                 fontWeight: 800,
//                 color: "var(--txt)",
//                 fontFamily: "var(--mono)",
//               }}
//             >
//               {TOTAL_CREDITS}
//             </div>
//             <div style={{ fontSize: 10, color: "var(--txt3)" }}>Total Free</div>
//           </div>
//         </div>

//         {/* Exhausted message or purchase CTA */}
//         {isExhausted ? (
//           <div
//             style={{
//               background: "var(--red)12",
//               border: "1px solid var(--red)33",
//               borderRadius: 10,
//               padding: "12px 14px",
//               textAlign: "center",
//             }}
//           >
//             <div
//               style={{
//                 fontSize: 13,
//                 fontWeight: 700,
//                 color: "var(--red)",
//                 marginBottom: 4,
//               }}
//             >
//               🔒 You've used all your free credits
//             </div>
//             <div
//               style={{
//                 fontSize: 12,
//                 color: "var(--txt2)",
//                 marginBottom: 10,
//                 lineHeight: 1.5,
//               }}
//             >
//               Purchase more credits to continue using AI features.
//             </div>
//             <div
//               style={{
//                 display: "inline-flex",
//                 alignItems: "center",
//                 gap: 6,
//                 background: "var(--bg3)",
//                 border: "1px solid var(--border)",
//                 borderRadius: 8,
//                 padding: "8px 16px",
//                 fontSize: 12,
//                 fontWeight: 600,
//                 color: "var(--txt3)",
//               }}
//             >
//               🛒 Purchase Credits — Coming Soon
//             </div>
//           </div>
//         ) : (
//           <div
//             style={{
//               background: "var(--blue)10",
//               border: "1px solid var(--blue)25",
//               borderRadius: 10,
//               padding: "10px 14px",
//               display: "flex",
//               alignItems: "center",
//               gap: 10,
//             }}
//           >
//             <span style={{ fontSize: 18 }}>💡</span>
//             <div
//               style={{ fontSize: 12, color: "var(--txt2)", lineHeight: 1.5 }}
//             >
//               You have{" "}
//               <strong style={{ color: barColor }}>
//                 {creditsRemaining} credit{creditsRemaining !== 1 ? "s" : ""}
//               </strong>{" "}
//               remaining.{" "}
//               {creditsRemaining >= PLAN_CREDIT_COST
//                 ? `Can generate ${Math.floor(creditsRemaining / PLAN_CREDIT_COST)} plan${Math.floor(creditsRemaining / PLAN_CREDIT_COST) !== 1 ? "s" : ""} or send ${creditsRemaining} chat message${creditsRemaining !== 1 ? "s" : ""}.`
//                 : `Only enough for ${creditsRemaining} chat message${creditsRemaining !== 1 ? "s" : ""}.`}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Coming soon purchase section */}
//       <div
//         style={{
//           marginTop: 8,
//           background: "var(--bg2)",
//           border: "1px dashed var(--border)",
//           borderRadius: 12,
//           padding: "14px 16px",
//           display: "flex",
//           alignItems: "center",
//           gap: 12,
//         }}
//        >
//         <div style={{ fontSize: 24 }}>🛒</div>
//         <div style={{ flex: 1 }}>
//           <div
//             style={{
//               fontSize: 13,
//               fontWeight: 700,
//               color: "var(--txt)",
//               marginBottom: 2,
//             }}
//           >
//             Buy More Credits
//           </div>
//           <div style={{ fontSize: 12, color: "var(--txt3)" }}>
//             Credit packs coming soon. Stay tuned!
//           </div>
//         </div>
//         <div
//           style={{
//             fontSize: 10,
//             fontWeight: 700,
//             letterSpacing: ".06em",
//             padding: "4px 10px",
//             borderRadius: 6,
//             background: "var(--bg4)",
//             color: "var(--txt3)",
//             border: "1px solid var(--border)",
//           }}
//         >
//           SOON
//         </div>
//       </div>
//     </div>
//   );
// }

export default function SettingsView() {
  const { theme, setTheme, cgpaGoal, setCgpaGoal, sem, setSem } = useApp();

  const [name, setName] = useState("");
  const [college, setCollege] = useState("");
  const [branch, setBranch] = useState("CSE");
  const [year, setYear] = useState("2nd Year");
  const [profileLinks, setProfileLinks] = useState({
    github: "",
    linkedin: "",
    leetcode: "",
  });
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [attendanceThreshold, setAttendanceThreshold] = useState(75);
  const [studyMode, setStudyMode] = useState("Balanced");
  const [pomoDuration, setPomoDuration] = useState(25);
  const [shortBreak, setShortBreak] = useState(5);
  const [longBreak, setLongBreak] = useState(15);
  const [notifications, setNotifications] = useState("All");
  const [weekStart, setWeekStart] = useState("Monday");

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem("gr_profile") || "{}");
      setName(p.name || "");
      setCollege(p.college || "");
      setBranch(p.branch || "CSE");
      setYear(p.year || "2nd Year");
      setProfileLinks(p.links || { github: "", linkedin: "", leetcode: "" });
      if (!p.name) setEditingProfile(true);
      const prefs = JSON.parse(localStorage.getItem("gr_prefs") || "{}");
      setStudyMode(prefs.studyMode || "Balanced");
      setPomoDuration(prefs.pomoDuration || 25);
      setShortBreak(prefs.shortBreak || 5);
      setLongBreak(prefs.longBreak || 15);
      setNotifications(prefs.notifications || "All");
      setWeekStart(prefs.weekStart || "Monday");
      setAttendanceThreshold(prefs.attendanceThreshold || 75);
    } catch {}
  }, []);

  function saveProfile() {
    const p = { name, college, branch, year, links: profileLinks };
    localStorage.setItem("gr_profile", JSON.stringify(p));
    setEditingProfile(false);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  }

  function savePrefs(patch) {
    try {
      const prefs = JSON.parse(localStorage.getItem("gr_prefs") || "{}");
      localStorage.setItem("gr_prefs", JSON.stringify({ ...prefs, ...patch }));
    } catch {}
  }

  function clearDone() {
    if (!confirm("Clear all completed tasks?")) return;
    const key = "gr_tasks_" + new Date().toISOString().slice(0, 10);
    const saved = localStorage.getItem(key);
    if (saved) {
      localStorage.setItem(
        key,
        JSON.stringify(JSON.parse(saved).filter((t) => !t.done)),
      );
      window.location.reload();
    }
  }

  function clearAll() {
    if (!confirm("Reset ALL data? This cannot be undone.")) return;
    Object.keys(localStorage)
      .filter((k) => k.startsWith("gr_"))
      .forEach((k) => localStorage.removeItem(k));
    window.location.reload();
  }

  const LINK_ICONS = {
    github: {
      label: "GitHub",
      placeholder: "github.com/username",
      color: "#888",
      icon: (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
        </svg>
      ),
    },
    linkedin: {
      label: "LinkedIn",
      placeholder: "linkedin.com/in/username",
      color: "#0077b5",
      icon: (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      ),
    },
    leetcode: {
      label: "LeetCode",
      placeholder: "leetcode.com/username",
      color: "#ffa116",
      icon: (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M8 6l6-6 6 6" />
          <path d="M20 12H4" />
          <path d="M8 18l6 6 6-6" />
        </svg>
      ),
    },
  };

  function openLink(url) {
    if (!url) return;
    window.open(url.startsWith("http") ? url : "https://" + url, "_blank");
  }

  const setrow = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "var(--bg2)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: "13px 16px",
  };
  const numInput = {
    width: 64,
    background: "var(--bg3)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    padding: "6px 10px",
    fontFamily: "var(--mono)",
    fontSize: 13,
    color: "var(--txt)",
    outline: "none",
    textAlign: "center",
  };
  const selectStyle = {
    background: "var(--bg3)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    padding: "6px 10px",
    fontFamily: "var(--font)",
    fontSize: 12,
    color: "var(--txt)",
    outline: "none",
    cursor: "pointer",
  };

  return (
    <div className="page">
      <h1
        style={{
          fontSize: 26,
          fontWeight: 800,
          letterSpacing: "-.03em",
          color: "var(--txt)",
          marginBottom: 20,
        }}
      >
        Settings
      </h1>

      {/* ── PROFILE CARD ── */}
      <div style={{ marginBottom: 24 }}>
        <div className="slabel" style={{ marginBottom: 10 }}>
          Profile
        </div>
        {!editingProfile ? (
          <div
            style={{
              background: "var(--bg2)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              padding: 18,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 14,
              }}
            >
              <Avatar name={name || "?"} size={58} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 17,
                    fontWeight: 700,
                    color: "var(--txt)",
                    marginBottom: 2,
                  }}
                >
                  {name || "Your Name"}
                </div>
                <div style={{ fontSize: 12, color: "var(--txt2)" }}>
                  {branch} · {year}
                </div>
                {college && (
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--txt3)",
                      marginTop: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {college}
                  </div>
                )}
              </div>
              <button
                onClick={() => setEditingProfile(true)}
                style={{
                  background: "var(--bg3)",
                  border: "1px solid var(--border)",
                  borderRadius: 9,
                  padding: "7px 13px",
                  color: "var(--txt2)",
                  fontFamily: "var(--font)",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                Edit
              </button>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {Object.entries(LINK_ICONS).map(([key, info]) => {
                const val = profileLinks[key];
                return (
                  <button
                    key={key}
                    onClick={() => openLink(val)}
                    disabled={!val}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 12px",
                      borderRadius: 9,
                      border: `1px solid ${val ? info.color + "44" : "var(--border)"}`,
                      background: val ? info.color + "15" : "var(--bg3)",
                      color: val ? info.color : "var(--txt3)",
                      fontFamily: "var(--font)",
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: val ? "pointer" : "not-allowed",
                      transition: "all .15s",
                      opacity: val ? 1 : 0.5,
                    }}
                  >
                    {info.icon}
                    {info.label}
                    {val && (
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      >
                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div
            style={{
              background: "var(--bg2)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              padding: 18,
              display: "flex",
              flexDirection: "column",
              gap: 13,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 4,
              }}
            >
              <Avatar name={name || "?"} size={44} />
              <div
                style={{ fontSize: 13, color: "var(--txt2)", fontWeight: 500 }}
              >
                {name ? `Hi, ${name.split(" ")[0]}! 👋` : "Set up your profile"}
              </div>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              <div style={{ gridColumn: "1/-1" }}>
                <div className="slabel">Full Name</div>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="inp"
                  style={{ fontSize: 14 }}
                />
              </div>
              <div style={{ gridColumn: "1/-1" }}>
                <div className="slabel">College / University</div>
                <input
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. IIT Delhi, VIT Vellore"
                  className="inp"
                  style={{ fontSize: 14 }}
                />
              </div>
              <div>
                <div className="slabel">Branch</div>
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="inp"
                >
                  {BRANCHES.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </div>
              <div>
                <div className="slabel">Year</div>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="inp"
                >
                  {YEARS.map((y) => (
                    <option key={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <div className="slabel" style={{ marginBottom: 8 }}>
                Profile Links
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {Object.entries(LINK_ICONS).map(([key, info]) => (
                  <div key={key} style={{ position: "relative" }}>
                    <div
                      style={{
                        position: "absolute",
                        left: 11,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: info.color,
                      }}
                    >
                      {info.icon}
                    </div>
                    <input
                      value={profileLinks[key]}
                      onChange={(e) =>
                        setProfileLinks((p) => ({
                          ...p,
                          [key]: e.target.value,
                        }))
                      }
                      placeholder={info.placeholder}
                      className="inp"
                      style={{ paddingLeft: 34, fontSize: 13 }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <button
                onClick={saveProfile}
                style={{
                  flex: 1,
                  padding: "11px",
                  borderRadius: 10,
                  border: "none",
                  background: "var(--txt)",
                  color: "var(--bg)",
                  fontFamily: "var(--font)",
                  fontSize: 14,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {profileSaved ? "✓ Saved!" : "Save Profile"}
              </button>
              {name && (
                <button
                  onClick={() => setEditingProfile(false)}
                  style={{
                    padding: "11px 16px",
                    borderRadius: 10,
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
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── THEME ── */}
      <div style={{ marginBottom: 24 }}>
        <div className="slabel" style={{ marginBottom: 10 }}>
          Theme
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 9,
          }}
        >
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`swatch ${theme === t.id ? "on" : ""}`}
              style={{
                background: t.bg,
                borderColor: theme === t.id ? t.fg : t.bg + "22",
              }}
            >
              <div style={{ display: "flex", gap: 3 }}>
                {[1, 0.5, 0.2].map((o, i) => (
                  <div
                    key={i}
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: t.fg,
                      opacity: o,
                    }}
                  />
                ))}
              </div>
              <div style={{ color: t.fg, fontSize: 12, fontWeight: 700 }}>
                {t.label}
              </div>
              <div style={{ color: t.fg, fontSize: 10, opacity: 0.45 }}>
                {t.sub}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── AI CREDITS ── */}
      {/* <AICreditsSection /> */}

      {/* ── ACADEMIC ── */}
      <div style={{ marginBottom: 24 }}>
        <div className="slabel" style={{ marginBottom: 10 }}>
          Academic
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={setrow}>
            <div>
              <div
                style={{ fontSize: 14, fontWeight: 500, color: "var(--txt)" }}
              >
                Semester
              </div>
              <div style={{ fontSize: 12, color: "var(--txt3)", marginTop: 1 }}>
                Current semester
              </div>
            </div>
            <select
              value={sem}
              onChange={(e) => {
                setSem(e.target.value);
                localStorage.setItem("gr_sem", e.target.value);
              }}
              style={selectStyle}
            >
              {SEMS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div style={setrow}>
            <div>
              <div
                style={{ fontSize: 14, fontWeight: 500, color: "var(--txt)" }}
              >
                CGPA Goal
              </div>
              <div style={{ fontSize: 12, color: "var(--txt3)", marginTop: 1 }}>
                Your target grade
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="number"
                min={1}
                max={10}
                step={0.1}
                value={cgpaGoal}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  setCgpaGoal(v);
                  localStorage.setItem("gr_cgpa", v);
                }}
                style={numInput}
              />
              <span style={{ fontSize: 12, color: "var(--txt3)" }}>/10</span>
            </div>
          </div>
          <div style={setrow}>
            <div>
              <div
                style={{ fontSize: 14, fontWeight: 500, color: "var(--txt)" }}
              >
                Attendance Threshold
              </div>
              <div style={{ fontSize: 12, color: "var(--txt3)", marginTop: 1 }}>
                Minimum % to maintain
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="number"
                min={50}
                max={100}
                step={1}
                value={attendanceThreshold}
                onChange={(e) => {
                  const v = parseInt(e.target.value);
                  setAttendanceThreshold(v);
                  savePrefs({ attendanceThreshold: v });
                }}
                style={numInput}
              />
              <span style={{ fontSize: 12, color: "var(--txt3)" }}>%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── DATA ── */}
      <div style={{ marginBottom: 36 }}>
        <div className="slabel" style={{ marginBottom: 10 }}>
          Data
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={setrow}>
            <div>
              <div
                style={{ fontSize: 14, fontWeight: 500, color: "var(--txt)" }}
              >
                Clear completed tasks
              </div>
              <div style={{ fontSize: 12, color: "var(--txt3)", marginTop: 1 }}>
                Remove done items from today
              </div>
            </div>
            <button
              onClick={clearDone}
              style={{
                padding: "7px 14px",
                borderRadius: 9,
                border: "none",
                background: "var(--orange)22",
                color: "var(--orange)",
                fontFamily: "var(--font)",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Clear
            </button>
          </div>
          <div style={setrow}>
            <div>
              <div
                style={{ fontSize: 14, fontWeight: 500, color: "var(--red)" }}
              >
                Reset all data
              </div>
              <div style={{ fontSize: 12, color: "var(--txt3)", marginTop: 1 }}>
                Wipe everything and start fresh
              </div>
            </div>
            <button
              onClick={clearAll}
              style={{
                padding: "7px 14px",
                borderRadius: 9,
                border: "none",
                background: "var(--red)22",
                color: "var(--red)",
                fontFamily: "var(--font)",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div style={{ textAlign: "center", paddingBottom: 8 }}>
        <div
          style={{
            fontSize: 13,
            color: "var(--txt3)",
            fontWeight: 700,
            letterSpacing: ".04em",
          }}
        >
          LeaderLab
        </div>
        <div
          style={{
            fontSize: 11,
            color: "var(--txt3)",
            marginTop: 3,
            opacity: 0.6,
          }}
        >
          Built for BTech students · v2.0
        </div>
      </div>
    </div>
  );
}
