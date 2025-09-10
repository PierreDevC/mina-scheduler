"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface DateContextType {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  getEventStartDate: (fallbackDate?: Date) => Date;
  getEventEndDate: (fallbackDate?: Date) => Date;
}

const DateContext = createContext<DateContextType | undefined>(undefined);

export function DateContextProvider({ children }: { children: ReactNode }) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const getEventStartDate = (fallbackDate?: Date): Date => {
    const baseDate = selectedDate || fallbackDate || new Date();
    const startDate = new Date(baseDate);
    startDate.setHours(9, 0, 0, 0); // 9:00 AM
    return startDate;
  };

  const getEventEndDate = (fallbackDate?: Date): Date => {
    const baseDate = selectedDate || fallbackDate || new Date();
    const endDate = new Date(baseDate);
    endDate.setHours(10, 0, 0, 0); // 10:00 AM
    return endDate;
  };

  return (
    <DateContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        getEventStartDate,
        getEventEndDate,
      }}
    >
      {children}
    </DateContext.Provider>
  );
}

export function useDateContext() {
  const context = useContext(DateContext);
  if (context === undefined) {
    throw new Error("useDateContext must be used within a DateContextProvider");
  }
  return context;
}

// Utility function to create a date from year, month, and day
export function createDateFromParts(year: number, month: number, day: number, hour: number = 9, minute: number = 0): Date {
  return new Date(year, month, day, hour, minute, 0, 0);
}

// Utility function to create an end date (1 hour after start)
export function createEndDateFromStart(startDate: Date): Date {
  const endDate = new Date(startDate);
  endDate.setHours(startDate.getHours() + 1);
  return endDate;
}