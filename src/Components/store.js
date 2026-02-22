"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
const Ctx = createContext(null);
const dayKey = () => new Date().toISOString().slice(0, 10);

// Task types for BTech
export const TASK_TYPES = {
  assignment: { label: "Assignment", color: "#5b8def", bg: "#5b8def18" },
  exam: { label: "Exam", color: "#e05252", bg: "#e0525218" },
  lab: { label: "Lab", color: "#4caf7d", bg: "#4caf7d18" },
  project: { label: "Project", color: "#9b72cf", bg: "#9b72cf18" },
  study: { label: "Study", color: "#d4b44a", bg: "#d4b44a18" },
  other: { label: "Other", color: "#888", bg: "#88888818" },
};

export const SUBJECTS = [
  "Maths",
  "Physics",
  "Chemistry",
  "DSA",
  "OS",
  "DBMS",
  "CN",
  "OOP",
  "COA",
  "SE",
  "ML",
  "Web Dev",
  "Other",
];

const SAMPLE_TASKS = [
  {
    id: "1",
    text: "Complete DSA Assignment #3",
    done: false,
    priority: "high",
    type: "assignment",
    subject: "DSA",
    deadline: Date.now() + 86400000 * 2,
    pomodoros: 0,
    at: Date.now(),
  },
  {
    id: "2",
    text: "Study OS Chapter 5 - Memory",
    done: false,
    priority: "high",
    type: "study",
    subject: "OS",
    deadline: Date.now() + 86400000 * 1,
    pomodoros: 1,
    at: Date.now(),
  },
  {
    id: "3",
    text: "Submit DBMS Lab Report",
    done: true,
    priority: "medium",
    type: "lab",
    subject: "DBMS",
    deadline: Date.now() - 86400000,
    pomodoros: 2,
    at: Date.now(),
  },
  {
    id: "4",
    text: "CN Mini Project",
    done: false,
    priority: "medium",
    type: "project",
    subject: "CN",
    deadline: Date.now() + 86400000 * 7,
    pomodoros: 0,
    at: Date.now(),
  },
  {
    id: "5",
    text: "Revise Maths Unit 2",
    done: false,
    priority: "low",
    type: "study",
    subject: "Maths",
    deadline: Date.now() + 86400000 * 3,
    pomodoros: 0,
    at: Date.now(),
  },
];

const SAMPLE_EXAMS = [
  {
    id: "e1",
    subject: "DSA",
    date: new Date(Date.now() + 86400000 * 12).toISOString().slice(0, 10),
    type: "Mid Sem",
    syllabus: "Trees, Graphs, DP",
  },
  {
    id: "e2",
    subject: "OS",
    date: new Date(Date.now() + 86400000 * 18).toISOString().slice(0, 10),
    type: "End Sem",
    syllabus: "Memory, Deadlock, Scheduling",
  },
  {
    id: "e3",
    subject: "Maths",
    date: new Date(Date.now() + 86400000 * 5).toISOString().slice(0, 10),
    type: "Quiz",
    syllabus: "Integration, ODE",
  },
];

const SAMPLE_SUBJECTS = [
  { id: "s1", name: "DSA", credits: 4, attendance: 78, total: 50, present: 39 },
  { id: "s2", name: "OS", credits: 4, attendance: 82, total: 48, present: 39 },
  {
    id: "s3",
    name: "DBMS",
    credits: 3,
    attendance: 91,
    total: 45,
    present: 41,
  },
  {
    id: "s4",
    name: "Maths",
    credits: 4,
    attendance: 65,
    total: 52,
    present: 34,
  },
  { id: "s5", name: "CN", credits: 3, attendance: 74, total: 46, present: 34 },
];

export function AppProvider({ children }) {
  const [theme, setThemeS] = useState("dark");
  const [tasks, setTasks] = useState([]);
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [history, setHistory] = useState({});
  const [view, setView] = useState("today");
  const [cgpaGoal, setCgpaGoal] = useState(8.5);
  const [sem, setSem] = useState("Semester 5");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("gr_theme") || "dark";
    const tk = localStorage.getItem("gr_tasks_" + dayKey());
    const ex = localStorage.getItem("gr_exams");
    const sb = localStorage.getItem("gr_subjects");
    const h = localStorage.getItem("gr_hist");
    const cg = localStorage.getItem("gr_cgpa");
    const sm = localStorage.getItem("gr_sem");
    setThemeS(t);
    setTasks(tk ? JSON.parse(tk) : SAMPLE_TASKS);
    setExams(ex ? JSON.parse(ex) : SAMPLE_EXAMS);
    setSubjects(sb ? JSON.parse(sb) : SAMPLE_SUBJECTS);
    setHistory(h ? JSON.parse(h) : {});
    setCgpaGoal(cg ? parseFloat(cg) : 8.5);
    setSem(sm || "Semester 5");
    setReady(true);
  }, []);

  const setTheme = (t) => {
    setThemeS(t);
    localStorage.setItem("gr_theme", t);
    document.documentElement.setAttribute("data-theme", t);
  };

  useEffect(() => {
    if (ready) document.documentElement.setAttribute("data-theme", theme);
  }, [theme, ready]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem("gr_tasks_" + dayKey(), JSON.stringify(tasks));
    const done = tasks.filter((t) => t.done).length,
      total = tasks.length;
    if (total > 0) {
      const h = {
        ...history,
        [dayKey()]: { done, total, rate: Math.round((done / total) * 100) },
      };
      setHistory(h);
      localStorage.setItem("gr_hist", JSON.stringify(h));
    }
  }, [tasks, ready]);

  useEffect(() => {
    if (ready) localStorage.setItem("gr_exams", JSON.stringify(exams));
  }, [exams, ready]);
  useEffect(() => {
    if (ready) localStorage.setItem("gr_subjects", JSON.stringify(subjects));
  }, [subjects, ready]);

  const addTask = useCallback(
    (data) =>
      setTasks((p) => [
        {
          id: Date.now().toString(),
          done: false,
          pomodoros: 0,
          at: Date.now(),
          ...data,
        },
        ...p,
      ]),
    [],
  );
  const toggleTask = useCallback(
    (id) =>
      setTasks((p) =>
        p.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
      ),
    [],
  );
  const deleteTask = useCallback(
    (id) => setTasks((p) => p.filter((t) => t.id !== id)),
    [],
  );
  const addPomodoro = useCallback(
    (id) =>
      setTasks((p) =>
        p.map((t) =>
          t.id === id ? { ...t, pomodoros: (t.pomodoros || 0) + 1 } : t,
        ),
      ),
    [],
  );

  const addExam = useCallback(
    (data) => setExams((p) => [...p, { id: Date.now().toString(), ...data }]),
    [],
  );
  const deleteExam = useCallback(
    (id) => setExams((p) => p.filter((e) => e.id !== id)),
    [],
  );

  const updateSubject = useCallback(
    (id, updates) =>
      setSubjects((p) =>
        p.map((s) => (s.id === id ? { ...s, ...updates } : s)),
      ),
    [],
  );
  const addSubject = useCallback(
    (data) =>
      setSubjects((p) => [...p, { id: Date.now().toString(), ...data }]),
    [],
  );
  const deleteSubject = useCallback(
    (id) => setSubjects((p) => p.filter((s) => s.id !== id)),
    [],
  );

  const doneCount = tasks.filter((t) => t.done).length;
  const progress = tasks.length
    ? Math.round((doneCount / tasks.length) * 100)
    : 0;

  // upcoming exams sorted
  const upcomingExams = [...exams]
    .map((e) => ({
      ...e,
      daysLeft: Math.ceil((new Date(e.date) - Date.now()) / 86400000),
    }))
    .filter((e) => e.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  if (!ready) return null;

  return (
    <Ctx.Provider
      value={{
        theme,
        setTheme,
        tasks,
        addTask,
        toggleTask,
        deleteTask,
        addPomodoro,
        exams,
        addExam,
        deleteExam,
        upcomingExams,
        subjects,
        updateSubject,
        addSubject,
        deleteSubject,
        history,
        view,
        setView,
        doneCount,
        progress,
        cgpaGoal,
        setCgpaGoal,
        sem,
        setSem,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useApp = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useApp outside AppProvider");
  return c;
};
