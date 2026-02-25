// "use client";
// import { useState } from "react";
// import { useApp, TASK_TYPES, SUBJECTS } from "@/Components/store";

// const P_COLORS = {
//   low: "var(--green)",
//   medium: "var(--orange)",
//   high: "var(--red)",
// };

// export default function AddTaskModal({ onClose }) {
//   const { addTask } = useApp();
//   const [text, setText] = useState("");
//   const [type, setType] = useState("assignment");
//   const [subject, setSubject] = useState("DSA");
//   const [priority, setPriority] = useState("medium");
//   const [deadline, setDeadline] = useState("");

//   function submit(e) {
//     e.preventDefault();
//     if (!text.trim()) return;
//     addTask({
//       text: text.trim(),
//       type,
//       subject,
//       priority,
//       deadline: deadline ? new Date(deadline).getTime() : null,
//     });
//     onClose();
//   }

//   return (
//     <div
//       className="overlay fadeIn"
//       onClick={(e) => e.target === e.currentTarget && onClose()}
//     >
//       <div className="sheet">
//         <div className="drag-handle" />
//         <div
//           style={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             marginBottom: 18,
//           }}
//         >
//           <h2
//             style={{
//               fontSize: 17,
//               fontWeight: 700,
//               color: "var(--txt)",
//               letterSpacing: "-.02em",
//             }}
//           >
//             Add Task
//           </h2>
//           <button
//             onClick={onClose}
//             style={{
//               background: "var(--bg4)",
//               border: "none",
//               borderRadius: 8,
//               width: 28,
//               height: 28,
//               cursor: "pointer",
//               color: "var(--txt2)",
//               fontSize: 17,
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             ×
//           </button>
//         </div>

//         <form
//           onSubmit={submit}
//           style={{ display: "flex", flexDirection: "column", gap: 14 }}
//         >
//           <textarea
//             autoFocus
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//             placeholder="What needs to be done?"
//             rows={2}
//             className="inp"
//             style={{ resize: "none", lineHeight: 1.5 }}
//             onKeyDown={(e) => e.key === "Enter" && e.metaKey && submit(e)}
//           />

//           {/* Type */}
//           <div>
//             <div className="slabel">Task Type</div>
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "repeat(3,1fr)",
//                 gap: 6,
//               }}
//             >
//               {Object.entries(TASK_TYPES).map(([key, info]) => (
//                 <button
//                   key={key}
//                   type="button"
//                   onClick={() => setType(key)}
//                   style={{
//                     padding: "8px 4px",
//                     borderRadius: 9,
//                     border: `1.5px solid ${type === key ? info.color : "var(--border)"}`,
//                     background: type === key ? info.bg : "transparent",
//                     color: type === key ? info.color : "var(--txt2)",
//                     fontFamily: "var(--font)",
//                     fontSize: 12,
//                     fontWeight: 600,
//                     cursor: "pointer",
//                     transition: "all .15s",
//                     textTransform: "capitalize",
//                   }}
//                 >
//                   {info.label}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Subject */}
//           <div>
//             <div className="slabel">Subject</div>
//             <select
//               value={subject}
//               onChange={(e) => setSubject(e.target.value)}
//               className="inp"
//             >
//               {SUBJECTS.map((s) => (
//                 <option key={s}>{s}</option>
//               ))}
//             </select>
//           </div>

//           {/* Priority + Deadline row */}
//           <div
//             style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
//           >
//             <div>
//               <div className="slabel">Priority</div>
//               <div style={{ display: "flex", gap: 5 }}>
//                 {["low", "medium", "high"].map((p) => (
//                   <button
//                     key={p}
//                     type="button"
//                     onClick={() => setPriority(p)}
//                     style={{
//                       flex: 1,
//                       padding: "8px 0",
//                       borderRadius: 8,
//                       border: `1.5px solid ${priority === p ? P_COLORS[p] : "var(--border)"}`,
//                       background:
//                         priority === p ? P_COLORS[p] + "22" : "transparent",
//                       color: priority === p ? P_COLORS[p] : "var(--txt2)",
//                       fontFamily: "var(--font)",
//                       fontSize: 11,
//                       fontWeight: 600,
//                       cursor: "pointer",
//                       transition: "all .15s",
//                       textTransform: "capitalize",
//                     }}
//                   >
//                     {p}
//                   </button>
//                 ))}
//               </div>
//             </div>
//             <div>
//               <div className="slabel">Deadline</div>
//               <input
//                 type="date"
//                 value={deadline}
//                 onChange={(e) => setDeadline(e.target.value)}
//                 className="inp"
//                 style={{ fontSize: 13 }}
//                 min={new Date().toISOString().slice(0, 10)}
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             disabled={!text.trim()}
//             style={{
//               marginTop: 4,
//               padding: "13px",
//               borderRadius: 11,
//               border: "none",
//               background: text.trim() ? "var(--txt)" : "var(--border)",
//               color: text.trim() ? "var(--bg)" : "var(--txt3)",
//               fontFamily: "var(--font)",
//               fontSize: 14,
//               fontWeight: 700,
//               cursor: text.trim() ? "pointer" : "not-allowed",
//               transition: "all .15s",
//             }}
//           >
//             Add Task
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
