"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Calendar,
  Users,
  CalendarDays,
  Contact,
  Clock,
  Settings,
  Bell
} from "lucide-react";
import { UserButton, SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import NotificationModal from "@/components/notifications/notification-modal";
import FullNotificationsModal from "@/components/notifications/full-notifications-modal";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  shortLabel: string;
}

interface MainNavbarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
  onNavbarPositionChange?: (isAtBottom: boolean) => void;
}

const navItems: NavItem[] = [
  { 
    id: "calendar", 
    label: "Calendar", 
    shortLabel: "Cal",
    icon: <Calendar className="h-4 w-4" />
  },
  { 
    id: "availability", 
    label: "Availability", 
    shortLabel: "Avail",
    icon: <Clock className="h-4 w-4" />
  },
  { 
    id: "events", 
    label: "Events", 
    shortLabel: "Events",
    icon: <CalendarDays className="h-4 w-4" />
  },
  { 
    id: "groups", 
    label: "Groups", 
    shortLabel: "Groups",
    icon: <Users className="h-4 w-4" />
  },
  { 
    id: "friends", 
    label: "Friends", 
    shortLabel: "Friends",
    icon: <Contact className="h-4 w-4" />
  },
  { 
    id: "settings", 
    label: "Settings", 
    shortLabel: "Settings",
    icon: <Settings className="h-4 w-4" />
  },
];

export default function MainNavbar({ activeTab, onTabChange, className, onNavbarPositionChange }: MainNavbarProps) {
  const [isNavbarAtBottom, setIsNavbarAtBottom] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isFullNotificationModalOpen, setIsFullNotificationModalOpen] = useState(false);
  const { scrollY } = useScroll();
  const { user } = useUser();

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      // Transition vers le bas après 100px de scroll
      if (latest > 100 && !isNavbarAtBottom) {
        setIsNavbarAtBottom(true);
        onNavbarPositionChange?.(true);
      } else if (latest <= 50 && isNavbarAtBottom) {
        setIsNavbarAtBottom(false);
        onNavbarPositionChange?.(false);
      }
    });

    return () => unsubscribe();
  }, [scrollY, isNavbarAtBottom, onNavbarPositionChange]);

  return (
    <>
      {/* Desktop Navbar */}
      <div className={cn("w-full justify-between items-center py-6 hidden md:flex px-6", className)}>
        {/* Logo/Titre */}
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            CalendApp
          </h1>
        </div>

        {/* Navigation centrale */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white dark:bg-gray-800 rounded-full p-3 shadow-xl border border-gray-200 dark:border-gray-600"
        >
          <div className="flex items-center space-x-1">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={cn(
                  "relative px-6 py-3 rounded-full text-sm font-medium transition-colors duration-200",
                  activeTab === item.id
                    ? "text-white hover:text-white"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {activeTab === item.id && (
                  <motion.div
                    layoutId="activeTabDesktop"
                    className="absolute inset-0 bg-black rounded-full"
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                  />
                )}
                <div className="relative z-10 flex items-center space-x-2">
                  {item.icon}
                  <span className="hidden lg:inline">{item.label}</span>
                  <span className="lg:hidden">{item.shortLabel}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Section utilisateur */}
        <div className="flex items-center space-x-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationModalOpen(!isNotificationModalOpen)}
                  className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Bell className="h-5 w-5" />
                  {/* Notification badge */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-medium">3</span>
                  </div>
                </button>

                <NotificationModal
                  isOpen={isNotificationModalOpen}
                  onClose={() => setIsNotificationModalOpen(false)}
                  onViewAll={() => setIsFullNotificationModalOpen(true)}
                />
              </div>

              {user && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Hello, {user.firstName || user.emailAddresses[0]?.emailAddress}
                </span>
              )}
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                  }
                }}
              />
            </div>
          </SignedIn>
        </div>
      </div>

      {/* Mobile Header - Minimal Top Bar */}
      <div className="sticky top-0 z-40 md:hidden bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-600">
        <motion.div
          className="flex items-center justify-between px-4 py-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">
            CalendApp
          </h1>

          <div className="flex items-center space-x-2">
            <SignedIn>
              {/* Mobile Notifications */}
              <div className="relative">
                <button
                  onClick={() => setIsNotificationModalOpen(!isNotificationModalOpen)}
                  className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Bell className="h-5 w-5" />
                  {/* Notification badge */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-medium">3</span>
                  </div>
                </button>

                <NotificationModal
                  isOpen={isNotificationModalOpen}
                  onClose={() => setIsNotificationModalOpen(false)}
                  onViewAll={() => setIsFullNotificationModalOpen(true)}
                />
              </div>

              <UserButton afterSignOutUrl="/" />
            </SignedIn>

            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-sm bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 px-4 rounded-lg transition-colors">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </motion.div>
      </div>

      {/* Mobile Bottom Navigation Bar - Fixed at Bottom */}
      <div className="md:hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-[100] mobile-safe-area"
        >
          <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-600 shadow-2xl">
            <div className="flex items-center justify-around px-2 py-2 max-w-lg mx-auto">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={cn(
                    "relative flex flex-col items-center justify-center px-3 py-2 rounded-xl transition-colors duration-200 min-w-[60px]",
                    activeTab === item.id
                      ? "text-white"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  )}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {activeTab === item.id && (
                    <motion.div
                      layoutId="activeTabMobile"
                      className="absolute inset-0 bg-black dark:bg-white/10 rounded-xl"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  )}
                  <div className="relative z-10 flex flex-col items-center space-y-1">
                    <motion.div
                      animate={{
                        scale: activeTab === item.id ? 1.1 : 1,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.icon}
                    </motion.div>
                    <span className="text-[10px] font-medium leading-none">
                      {item.shortLabel}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Full Notifications Modal */}
      <FullNotificationsModal
        isOpen={isFullNotificationModalOpen}
        onClose={() => setIsFullNotificationModalOpen(false)}
        notifications={[]}
        onMarkAsRead={(id) => console.log("Mark as read:", id)}
        onMarkAllAsRead={() => console.log("Mark all as read")}
        onDeleteNotification={(id) => console.log("Delete notification:", id)}
      />
    </>
  );
} 