"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface PreferencesContextType {
  animationsEnabled: boolean;
  setAnimationsEnabled: (enabled: boolean) => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [animationsEnabled, setAnimationsEnabledState] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("preferences-animations");
    if (stored !== null) {
      setAnimationsEnabledState(JSON.parse(stored));
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when changed
  const setAnimationsEnabled = (enabled: boolean) => {
    setAnimationsEnabledState(enabled);
    localStorage.setItem("preferences-animations", JSON.stringify(enabled));
  };

  // Don't render children until preferences are loaded to avoid flash
  if (!isLoaded) {
    return null;
  }

  return (
    <PreferencesContext.Provider value={{ animationsEnabled, setAnimationsEnabled }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
}
