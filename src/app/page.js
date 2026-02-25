"use client";
import { AppProvider, useApp } from "@/Components/store";
import Sidebar from "@/Components/sidebar";
import BottomNav from "@/Components/bottomnav";
import ExamView from "@/Components/ExamView";
import AttendanceView from "@/Components/AttendanceView";
import TimetableView from "@/Components/Timetableview";
import NotesView from "@/Components/Notesview";
import AIPlannerView from "@/Components/Aiplannerview";
import SettingsView from "@/Components/settingView";
import HabitView from "@/Components/Heatmap";

function App() {
  const { view } = useApp();
  return (
    <div className="shell">
      <Sidebar />
      <div className="scroller">
        {view === "exams" && <ExamView />}
        {view === "attendance" && <AttendanceView />}
        {view === "timetable" && <TimetableView />}
        {view === "heatmap" && <HabitView />}
        {view === "notes" && <NotesView />}
        {view === "progress" && <AIPlannerView />}
        {view === "settings" && <SettingsView />}
      </div>
      <BottomNav />
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <App />
    </AppProvider>
  );
}
