"use client";
import { AppProvider, useApp } from "@/Components/store";
import Sidebar from "@/Components/sidebar";
import BottomNav from "@/Components/bottomnav";
import TodayView from "@/Components/todayView";
import ExamView from "@/Components/ExamView";
import AttendanceView from "@/Components/AttendanceView";
import ProgressView from "@/Components/progressView";
import SettingsView from "@/Components/settingView";

function App() {
  const { view } = useApp();
  return (
    <div className="shell">
      <Sidebar />
      <div className="scroller">
        {view === "today" && <TodayView />}
        {view === "exams" && <ExamView />}
        {view === "attendance" && <AttendanceView />}
        {view === "progress" && <ProgressView />}
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
