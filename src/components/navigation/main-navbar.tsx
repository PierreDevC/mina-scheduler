"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  CalendarDays, 
  Contact,
  Menu,
  X
} from "lucide-react";

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
    id: "dashboard", 
    label: "Dashboard", 
    shortLabel: "Dash",
    icon: <LayoutDashboard className="h-4 w-4" />
  },
  { 
    id: "calendar", 
    label: "Calendar", 
    shortLabel: "Cal",
    icon: <Calendar className="h-4 w-4" />
  },
  { 
    id: "groups", 
    label: "Groups", 
    shortLabel: "Groups",
    icon: <Users className="h-4 w-4" />
  },
  { 
    id: "events", 
    label: "Events", 
    shortLabel: "Events",
    icon: <CalendarDays className="h-4 w-4" />
  },
  { 
    id: "contacts", 
    label: "Contacts", 
    shortLabel: "Contacts",
    icon: <Contact className="h-4 w-4" />
  },
];

export default function MainNavbar({ activeTab, onTabChange, className, onNavbarPositionChange }: MainNavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNavbarAtBottom, setIsNavbarAtBottom] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      // Transition vers le bas après 100px de scroll
      if (latest > 100 && !isNavbarAtBottom) {
        setIsNavbarAtBottom(true);
        setIsMobileMenuOpen(false); // Fermer le menu si ouvert
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
      <div className={cn("w-full justify-center py-6 hidden md:flex", className)}>
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
                {/* Active background */}
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
                
                {/* Icon and Text */}
                <div className="relative z-10 flex items-center space-x-2">
                  {item.icon}
                  <span className="hidden lg:inline">{item.label}</span>
                  <span className="lg:hidden">{item.shortLabel}</span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Mobile Navbar */}
      <div className={cn("w-full md:hidden", className)}>
        {/* Mobile Header - Animé */}
        <motion.div 
          className="relative z-50 navbar-container"
          animate={{
            position: isNavbarAtBottom ? "fixed" : "relative",
            top: isNavbarAtBottom ? "auto" : 0,
            bottom: isNavbarAtBottom ? 0 : "auto",
            left: isNavbarAtBottom ? 0 : "auto",
            right: isNavbarAtBottom ? 0 : "auto",
            width: isNavbarAtBottom ? "100%" : "auto",
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
            duration: 0.6
          }}
        >
          <motion.div 
            className={cn(
              "flex items-center justify-between px-4 py-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600",
              isNavbarAtBottom ? "border-t shadow-lg" : "border-b"
            )}
            layout
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
          >
            <AnimatePresence mode="wait">
              {!isNavbarAtBottom ? (
                <motion.h1 
                  key="title"
                  className="text-xl font-bold text-gray-900 dark:text-white"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  CalendApp
                </motion.h1>
              ) : (
                <motion.div
                  key="bottom-nav"
                  className="flex items-center justify-around w-full max-w-md mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  {navItems.map((item) => (
                    <motion.button
                      key={item.id}
                      onClick={() => onTabChange(item.id)}
                      className={cn(
                        "relative flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors duration-200",
                        activeTab === item.id
                          ? "text-black dark:text-white hover:text-black dark:hover:text-white"
                          : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                      )}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Active background */}
                      {activeTab === item.id && (
                        <motion.div
                          layoutId="activeTabBottomAnimated"
                          className="absolute inset-0 bg-gray-100 dark:bg-gray-700 rounded-lg"
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                        />
                      )}
                      
                      <div className="relative z-10 flex flex-col items-center space-y-1">
                        {item.icon}
                        <span className="text-xs font-medium">{item.shortLabel}</span>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
            
            {!isNavbarAtBottom && (
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{ opacity: isNavbarAtBottom ? 0 : 1 }}
                transition={{ duration: 0.3 }}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                )}
              </motion.button>
            )}
          </motion.div>
        </motion.div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && !isNavbarAtBottom && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden bg-white dark:bg-gray-800 mx-4 rounded-xl shadow-xl border border-gray-200 dark:border-gray-600"
            >
              <div className="p-2">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    onClick={() => {
                      onTabChange(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={cn(
                      "relative w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors duration-200",
                      activeTab === item.id
                        ? "bg-black text-white hover:text-white"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                    )}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                    
                    {/* Active indicator */}
                    {activeTab === item.id && (
                      <motion.div
                        layoutId="activeTabMobile"
                        className="absolute right-3 w-2 h-2 bg-white rounded-full"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>


      </div>
    </>
  );
} 