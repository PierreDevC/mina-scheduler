"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MainNavbar from "@/components/navigation/main-navbar";
import DashboardView from "@/components/views/dashboard-view";
import CalendarView from "@/components/views/calendar-view";
import AvailabilityView from "@/components/views/availability-view";
import GroupsView from "@/components/views/groups-view";
import EventsView from "@/components/views/events-view";
import FriendsView from "@/components/views/friends-view";
import SettingsView from "@/components/views/settings-view";

const pageVariants = {
  initial: { 
    opacity: 0, 
    x: 300,
    scale: 0.95
  },
  in: { 
    opacity: 1, 
    x: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
  out: { 
    opacity: 0, 
    x: -300,
    scale: 0.95,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const containerVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: 0.3
    }
  }
};

export default function AppPage() {
  const [activeTab, setActiveTab] = useState("calendar");
  const [isNavbarAtBottom, setIsNavbarAtBottom] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardView onNavigate={setActiveTab} />;
      case "calendar":
        return <CalendarView />;
      case "availability":
        return <AvailabilityView />;
      case "groups":
        return <GroupsView />;
      case "events":
        return <EventsView />;
      case "friends":
        return <FriendsView />;
      case "settings":
        return <SettingsView />;
      default:
        return <CalendarView />;
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="min-h-screen bg-gray-50 dark:bg-slate-900"
    >
      {/* Navbar */}
      <MainNavbar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onNavbarPositionChange={setIsNavbarAtBottom}
        className="sticky top-0 z-50 bg-gray-50/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800"
      />

      {/* Content Area */}
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={pageVariants}
            initial="initial"
            animate="in"
            exit="out"
            className={`py-8 md:pb-8 ${isNavbarAtBottom ? 'pb-20' : 'pb-8'}`}
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl"></div>
      </div>
    </motion.div>
  );
} 