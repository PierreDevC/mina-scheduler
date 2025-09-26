"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { UserButton, SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Calendar className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              CalendApp
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Accueil
            </Link>
            <SignedIn>
              <Link
                href="/dashboard"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Calendrier
              </Link>
            </SignedIn>
            <Link
              href="/features"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Fonctionnalités
            </Link>
            <Link
              href="/pricing"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Tarifs
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost">Se connecter</Button>
              </SignInButton>
              <Link href="/auth/register">
                <Button>Commencer</Button>
              </Link>
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
                      avatarBox: "w-8 h-8",
                    }
                  }}
                />
              </div>
            </SignedIn>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800"
          >
            <div className="px-4 py-6 space-y-4">
              <Link
                href="/"
                className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Accueil
              </Link>
              
              <SignedIn>
                <Link
                  href="/dashboard"
                  className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Calendrier
                </Link>
              </SignedIn>
              
              <Link
                href="/features"
                className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Fonctionnalités
              </Link>
              <Link
                href="/pricing"
                className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Tarifs
              </Link>
              <Link
                href="/contact"
                className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
              
              <div className="pt-4 space-y-2">
                <SignedOut>
                  <SignInButton mode="redirect">
                    <Button variant="ghost" className="w-full justify-start">
                      Se connecter
                    </Button>
                  </SignInButton>
                  <Link href="/auth/register">
                    <Button className="w-full">Commencer</Button>
                  </Link>
                </SignedOut>
                
                <SignedIn>
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      {user && (
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.firstName || user.emailAddresses[0]?.emailAddress}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400">Connecté</p>
                    </div>
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
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
} 