"use client";
import { AppProvider, useApp } from "@/Components/store";
import Sidebar from "@/Components/sidebar";
import BottomNav from "@/Components/bottomnav";
import TodayView from "@/Components/todayView";
import ProgressView from "@/Components/progressView";
import SettingsView from "@/Components/settingView";

function App() {
  const { view } = useApp();
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-scroll">
        {view === "today" && <TodayView />}
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
