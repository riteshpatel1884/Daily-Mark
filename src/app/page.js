// src/app/page.js — updated with NotificationBanner
"use client";
import { AppProvider, useApp } from "@/Components/store";
import Sidebar from "@/Components/sidebar";
import BottomNav from "@/Components/bottomnav";
import ExamView from "@/Components/ExamView";
// import AttendanceView from "@/Components/AttendanceView";
// import AIPlannerView from "@/Components/Aiplannerview";
import SettingsView from "@/Components/settingView";
import HabitView from "@/Components/Heatmap";
import PlacementPrepView from "@/Components/Placementprepview";
import NotificationBanner from "@/Components/Notificationbanner";

function App() {
  const { view } = useApp();
  return (
    <div className="shell">
      <Sidebar />
      <div className="scroller">
        <NotificationBanner />

        {view === "exams" && <ExamView />}
        {/* {view === "attendance" && <AttendanceView />} */}

        {view === "heatmap" && <HabitView />}

        {/* {view === "progress" && <AIPlannerView />} */}
        {view === "settings" && <SettingsView />}
        {view === "placement" && <PlacementPrepView />}
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
