"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MainNavbar from "@/components/navigation/main-navbar";
import CalendarView from "@/components/views/calendar-view";
import AvailabilityView from "@/components/views/availability-view";
import GroupsView from "@/components/views/groups-view";
import EventsView from "@/components/views/events-view";
import FriendsView from "@/components/views/friends-view";
import SettingsView from "@/components/views/settings-view";
import { EventsProvider } from "@/providers/events-context";
import { usePreferences } from "@/contexts/preferences-context";

// Define tab order for directional animations
const TAB_ORDER: { [key: string]: number } = {
  calendar: 0,
  availability: 1,
  events: 2,
  groups: 3,
  friends: 4,
  settings: 5,
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
  const { animationsEnabled } = usePreferences();
  const previousTabRef = useRef("calendar");

  // Determine animation direction based on tab position
  const getPageVariants = () => {
    const currentIndex = TAB_ORDER[activeTab] || 0;
    const previousIndex = TAB_ORDER[previousTabRef.current] || 0;
    const direction = currentIndex > previousIndex ? 1 : -1; // 1 = moving forward, -1 = moving backward

    return {
      initial: {
        opacity: 0,
        x: direction * 300, // Enter from right if forward, from left if backward
        scale: 0.95
      },
      in: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: {
          duration: 0.5,
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      },
      out: {
        opacity: 0,
        x: direction * -300, // Exit to left if forward, to right if backward
        scale: 0.95,
        transition: {
          duration: 0.5, // Match enter duration for synchronized movement
          ease: [0.25, 0.46, 0.45, 0.94]
        }
      }
    };
  };

  // Handle tab change with tracking
  const handleTabChange = (newTab: string) => {
    previousTabRef.current = activeTab;
    setActiveTab(newTab);
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case "calendar":
        return <CalendarView />;
      case "availability":
        return <AvailabilityView />;
      case "groups":
        return <GroupsView />;
      case "events":
        return <EventsView onNavigateToCalendar={() => handleTabChange("calendar")} />;
      case "friends":
        return <FriendsView />;
      case "settings":
        return <SettingsView />;
      default:
        return <CalendarView />;
    }
  };

  // Reduced animation variants for performance mode
  const reducedPageVariants = {
    initial: { opacity: 1, x: 0, scale: 1 },
    in: { opacity: 1, x: 0, scale: 1 },
    out: { opacity: 1, x: 0, scale: 1 },
  };

  const reducedContainerVariants = {
    initial: { opacity: 1 },
    animate: { opacity: 1 },
  };

  return (
    <EventsProvider>
      <motion.div
        variants={animationsEnabled ? containerVariants : reducedContainerVariants}
        initial="initial"
        animate="animate"
        className="min-h-screen bg-gray-50 dark:bg-slate-900"
      >
        {/* Navbar */}
        <MainNavbar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onNavbarPositionChange={setIsNavbarAtBottom}
          className="sticky top-0 z-50 bg-gray-50/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800"
        />

        {/* Content Area */}
        <div className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={animationsEnabled ? getPageVariants() : reducedPageVariants}
              initial="initial"
              animate="in"
              exit="out"
              transition={animationsEnabled ? undefined : { duration: 0 }}
              className="py-8 pb-24 md:pb-8"
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
    </EventsProvider>
  );
} 