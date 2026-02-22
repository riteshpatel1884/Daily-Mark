"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const Ctx = createContext(null);

const SAMPLES = [
  {
    id: "1",
    text: "Review project proposal",
    done: false,
    priority: "high",
    cat: "Work",
    at: Date.now() - 3600000,
  },
  {
    id: "2",
    text: "Morning workout",
    done: true,
    priority: "medium",
    cat: "Health",
    at: Date.now() - 7200000,
  },
  {
    id: "3",
    text: "Read 20 pages",
    done: false,
    priority: "low",
    cat: "Personal",
    at: Date.now() - 1800000,
  },
  {
    id: "4",
    text: "Team standup",
    done: true,
    priority: "high",
    cat: "Work",
    at: Date.now() - 5400000,
  },
  {
    id: "5",
    text: "Grocery shopping",
    done: false,
    priority: "medium",
    cat: "Personal",
    at: Date.now() - 900000,
  },
];

const dayKey = () => new Date().toISOString().slice(0, 10);

export function AppProvider({ children }) {
  const [theme, setThemeState] = useState("dark");
  const [tasks, setTasks] = useState([]);
  const [history, setHistory] = useState({});
  const [view, setView] = useState("today");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("tf_theme") || "dark";
    const tk = localStorage.getItem("tf_tasks_" + dayKey());
    const h = localStorage.getItem("tf_hist");
    setThemeState(t);
    setTasks(tk ? JSON.parse(tk) : SAMPLES);
    setHistory(h ? JSON.parse(h) : {});
    setReady(true);
  }, []);

  const setTheme = (t) => {
    setThemeState(t);
    localStorage.setItem("tf_theme", t);
    document.documentElement.setAttribute("data-theme", t);
  };

  useEffect(() => {
    if (!ready) return;
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme, ready]);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem("tf_tasks_" + dayKey(), JSON.stringify(tasks));
    const done = tasks.filter((t) => t.done).length;
    const total = tasks.length;
    if (total > 0) {
      const rate = Math.round((done / total) * 100);
      const h = { ...history, [dayKey()]: { done, total, rate } };
      setHistory(h);
      localStorage.setItem("tf_hist", JSON.stringify(h));
    }
  }, [tasks, ready]);

  const addTask = useCallback(
    (text, priority, cat) =>
      setTasks((p) => [
        {
          id: Date.now().toString(),
          text,
          done: false,
          priority,
          cat,
          at: Date.now(),
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

  const doneCount = tasks.filter((t) => t.done).length;
  const progress = tasks.length
    ? Math.round((doneCount / tasks.length) * 100)
    : 0;

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
        doneCount,
        progress,
        history,
        view,
        setView,
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
