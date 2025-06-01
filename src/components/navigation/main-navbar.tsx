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
  X,
  LogOut,
  User
} from "lucide-react";
import { UserButton, SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";

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
  const { user } = useUser();

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
                Se connecter
              </button>
            </SignInButton>
          </SignedOut>
          
          <SignedIn>
            <div className="flex items-center space-x-3">
              {user && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Bonjour, {user.firstName || user.emailAddresses[0]?.emailAddress}
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
          >
            <AnimatePresence mode="wait">
              {!isNavbarAtBottom ? (
                <motion.div 
                  key="header"
                  className="flex items-center justify-between w-full"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    CalendApp
                  </h1>
                  
                  <div className="flex items-center space-x-2">
                    <SignedIn>
                      <UserButton afterSignOutUrl="/" />
                    </SignedIn>
                    
                    <button
                      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                      className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-600"
                    >
                      {isMobileMenuOpen ? (
                        <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      ) : (
                        <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      )}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="bottom-nav"
                  className="flex items-center justify-around w-full max-w-md mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  {navItems.map((item) => (
                    <motion.button
                      key={item.id}
                      onClick={() => onTabChange(item.id)}
                      className={cn(
                        "relative flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors duration-200",
                        activeTab === item.id
                          ? "text-black dark:text-white"
                          : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                      )}
                    >
                      {activeTab === item.id && (
                        <motion.div
                          layoutId="activeTabBottomAnimated"
                          className="absolute inset-0 bg-gray-100 dark:bg-gray-700 rounded-lg"
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
          </motion.div>
        </motion.div>

        {/* Menu mobile */}
        <AnimatePresence>
          {isMobileMenuOpen && !isNavbarAtBottom && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
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
                        ? "bg-black text-white"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                    )}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                ))}
                
                {/* Section auth dans le menu mobile */}
                <div className="border-t border-gray-200 dark:border-gray-600 mt-2 pt-2">
                  <SignedOut>
                    <SignInButton mode="redirect">
                      <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20">
                        <User className="h-4 w-4" />
                        <span className="font-medium">Se connecter</span>
                      </button>
                    </SignInButton>
                  </SignedOut>
                  
                  <SignedIn>
                    {user && (
                      <div className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
                        Connecté en tant que {user.firstName || user.emailAddresses[0]?.emailAddress}
                      </div>
                    )}
                  </SignedIn>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
} 