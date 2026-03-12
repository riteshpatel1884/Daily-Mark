// src/app/page.js — updated with NotificationBanner
"use client";
import { AppProvider, useApp } from "@/lib/data/store";
import Sidebar from "@/Components/Navigations/sidebar";
import BottomNav from "@/Components/Navigations/bottomnav";
import SettingsView from "@/Components/Setting/settingView";
import NotificationBanner from "@/Components/Notification/Notificationbanner";
import PlacementIntelligencePlatform from "@/Components/Placement/Placementintelligence";
function App() {
  const { view } = useApp();
  return (
    <div className="shell">
      <Sidebar />
      <div className="scroller">
        <NotificationBanner />
       
        {view === "settings" && <SettingsView />}
        {view === "hireLab" && <PlacementIntelligencePlatform />}
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
