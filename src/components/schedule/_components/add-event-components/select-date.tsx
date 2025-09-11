"use client";

import { EventFormData } from "@/types";
import React, { useEffect, useState, useMemo } from "react";
import { UseFormSetValue } from "react-hook-form";
import { format, setHours, setMinutes, isBefore, addHours, isSameDay, addDays } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SelectDate({
  data,
  setValue,
}: {
  data?: { startDate: Date; endDate: Date };
  setValue: UseFormSetValue<EventFormData>;
}) {
  const [startDate, setStartDate] = useState<Date>(() => {
    const date = data?.startDate instanceof Date ? data.startDate : new Date();
    return isNaN(date.getTime()) ? new Date() : date;
  });
  
  const [endDate, setEndDate] = useState<Date>(() => {
    const date = data?.endDate instanceof Date ? data.endDate : new Date();
    return isNaN(date.getTime()) ? new Date() : date;
  });

  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);
  const [openTimeDropdown, setOpenTimeDropdown] = useState<'start' | 'end' | null>(null);
  const [isAllDay, setIsAllDay] = useState(false);
  
  // Only load initial data once, ignore subsequent prop changes to prevent interference with user edits
  const [hasInitialized, setHasInitialized] = useState(false);
  
  useEffect(() => {
    if (!hasInitialized && data?.startDate instanceof Date && !isNaN(data.startDate.getTime())) {
      console.log("📅 SelectDate: Initial load of startDate:", data.startDate);
      setStartDate(data.startDate);
      setHasInitialized(true);
    }
    if (!hasInitialized && data?.endDate instanceof Date && !isNaN(data.endDate.getTime())) {
      console.log("📅 SelectDate: Initial load of endDate:", data.endDate);
      setEndDate(data.endDate);
    }
  }, [data?.startDate, data?.endDate, hasInitialized]);
  
  // Generate 15-minute intervals from 12:00 AM to 11:45 PM
  const timeOptions = useMemo(() => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        const timeString = `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
        options.push({
          value: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
          label: timeString,
          hour,
          minute
        });
      }
    }
    return options;
  }, []);

  // Helper function to get time value from date
  const getTimeValue = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = Math.floor(date.getMinutes() / 15) * 15; // Round to nearest 15min
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  };

  // Check if event spans multiple days
  const spansMultipleDays = useMemo(() => {
    return !isSameDay(startDate, endDate);
  }, [startDate, endDate]);

  // Auto-adjust end date when start time changes
  useEffect(() => {
    // If the event would naturally end the next day (e.g., 8PM to 6AM), adjust end date
    if (startDate.getHours() >= 18 && endDate.getHours() <= 12 && isSameDay(startDate, endDate)) {
      // If start is in evening and end is in morning/early afternoon, move end to next day
      const nextDay = addDays(startDate, 1);
      const newEndDate = new Date(nextDay);
      newEndDate.setHours(endDate.getHours(), endDate.getMinutes(), 0, 0);
      setEndDate(newEndDate);
      setValue("endDate", newEndDate);
    }
  }, [startDate, endDate, setValue]);

  return (
    <div className="space-y-4">
      {/* Start Date - Always visible */}
      <div className="space-y-2">
        <Label>Start Date</Label>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !startDate && "text-muted-foreground"
          )}
          onClick={() => {
            setShowStartCalendar(!showStartCalendar);
            if (!showStartCalendar) {
              setShowEndCalendar(false); // Close end calendar when opening start
            }
          }}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
        </Button>
        <AnimatePresence>
          {showStartCalendar && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={(date) => {
                  console.log("🗓️ Start date clicked:", date);
                  if (date && !isNaN(date.getTime())) {
                    const newDate = new Date(date);
                    newDate.setHours(startDate.getHours(), startDate.getMinutes(), 0, 0);
                    if (!isNaN(newDate.getTime())) {
                      setStartDate(newDate);
                      setShowStartCalendar(false);
                      setTimeout(() => {
                        setValue("startDate", newDate);
                      }, 0);
                    }
                  }
                }}
                className="rounded-md border shadow-sm"
                captionLayout="dropdown"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* All Day Checkbox */}
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="allDay" 
          checked={isAllDay}
          onCheckedChange={(checked) => {
            const allDay = checked === true;
            setIsAllDay(allDay);
            setValue("isAllDay", allDay);
            
            if (allDay) {
              // Set times to all day (00:00 to 23:59)
              const startOfDay = new Date(startDate);
              startOfDay.setHours(0, 0, 0, 0);
              const endOfDay = new Date(startDate);
              endOfDay.setHours(23, 59, 59, 999);
              
              setStartDate(startOfDay);
              setEndDate(endOfDay);
              setValue("startDate", startOfDay);
              setValue("endDate", endOfDay);
            }
          }}
        />
        <Label 
          htmlFor="allDay" 
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          All day
        </Label>
      </div>

      {/* End Date - Only show if event spans multiple days */}
      <AnimatePresence>
        {spansMultipleDays && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-2"
          >
            <Label>End Date</Label>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !endDate && "text-muted-foreground"
              )}
              onClick={() => {
                setShowEndCalendar(!showEndCalendar);
                if (!showEndCalendar) {
                  setShowStartCalendar(false); // Close start calendar when opening end
                }
              }}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
            </Button>
            <AnimatePresence>
              {showEndCalendar && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={(date) => {
                      console.log("🗓️ End date clicked:", date);
                      if (date && !isNaN(date.getTime())) {
                        const newDate = new Date(date);
                        newDate.setHours(endDate.getHours(), endDate.getMinutes(), 0, 0);
                        if (!isNaN(newDate.getTime())) {
                          setEndDate(newDate);
                          setShowEndCalendar(false);
                          setTimeout(() => {
                            setValue("endDate", newDate);
                          }, 0);
                        }
                      }
                    }}
                    className="rounded-md border shadow-sm"
                    captionLayout="dropdown"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Time Selection - Hidden when All Day is checked */}
      <AnimatePresence>
        {!isAllDay && (
          <motion.div 
            initial={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
        {/* Start Time with 15-minute intervals */}
        <div className="space-y-2">
          <Label>Start Time</Label>
          <Select
            value={getTimeValue(startDate)}
            open={openTimeDropdown === 'start'}
            onOpenChange={(open) => {
              setOpenTimeDropdown(open ? 'start' : null);
            }}
            onValueChange={(value) => {
              const [hours, minutes] = value.split(':').map(Number);
              const newDate = new Date(startDate);
              newDate.setHours(hours, minutes, 0, 0);
              if (!isNaN(newDate.getTime())) {
                setStartDate(newDate);
                setValue("startDate", newDate);
              }
              setOpenTimeDropdown(null); // Close dropdown after selection
            }}
          >
            <SelectTrigger className="w-full cursor-pointer">
              <Clock className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent className="h-[300px]">
              {timeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="text-xs text-muted-foreground">
            {format(startDate, "EEEE, MMMM d, yyyy 'at' h:mm a")}
          </div>
        </div>

        {/* End Time with 15-minute intervals */}
        <div className="space-y-2">
          <Label>End Time</Label>
          <Select
            value={getTimeValue(endDate)}
            open={openTimeDropdown === 'end'}
            onOpenChange={(open) => {
              setOpenTimeDropdown(open ? 'end' : null);
            }}
            onValueChange={(value) => {
              const [hours, minutes] = value.split(':').map(Number);
              let newDate = new Date(startDate); // Base on start date initially
              newDate.setHours(hours, minutes, 0, 0);
              
              // If end time is earlier in the day than start time, assume next day
              if (newDate <= startDate) {
                newDate = addDays(newDate, 1);
              }
              
              if (!isNaN(newDate.getTime())) {
                setEndDate(newDate);
                setValue("endDate", newDate);
              }
              setOpenTimeDropdown(null); // Close dropdown after selection
            }}
          >
            <SelectTrigger className="w-full cursor-pointer">
              <Clock className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent className="h-[300px]">
              {timeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="text-xs text-muted-foreground">
            {format(endDate, "EEEE, MMMM d, yyyy 'at' h:mm a")}
          </div>
        </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Duration Display */}
      <div className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
        <div className="flex items-center justify-between">
          <span>Duration:</span>
          <span className={cn(
            "font-semibold",
            !isAllDay && endDate <= startDate && "text-red-500 dark:text-red-400"
          )}>
            {(() => {
              if (isAllDay) {
                if (isSameDay(startDate, endDate)) {
                  return "All day";
                } else {
                  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                  return `All day (${daysDiff} day${daysDiff !== 1 ? 's' : ''})`;
                }
              }

              const diffInMinutes = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60));
              
              // Handle invalid/negative durations
              if (diffInMinutes <= 0) {
                return "Invalid duration - End time must be after start time";
              }
              
              const totalHours = Math.floor(diffInMinutes / 60);
              const remainingMinutes = diffInMinutes % 60;
              
              // Handle different duration formats
              if (totalHours === 0) {
                return `${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
              }
              
              if (remainingMinutes === 0) {
                return `${totalHours} hour${totalHours !== 1 ? 's' : ''}`;
              }
              
              // For multi-day events, show days as well
              if (totalHours >= 24) {
                const days = Math.floor(totalHours / 24);
                const hours = totalHours % 24;
                
                let result = `${days} day${days !== 1 ? 's' : ''}`;
                if (hours > 0) {
                  result += `, ${hours} hour${hours !== 1 ? 's' : ''}`;
                }
                if (remainingMinutes > 0) {
                  result += `, ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
                }
                return result;
              }
              
              return `${totalHours} hour${totalHours !== 1 ? 's' : ''}, ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
            })()}
          </span>
        </div>
        {isAllDay ? (
          <div className="text-xs mt-1 text-green-600 dark:text-green-400">
            🌅 All-day event
          </div>
        ) : (
          <>
            {spansMultipleDays && endDate > startDate && (
              <div className="text-xs mt-1 text-blue-600 dark:text-blue-400">
                ℹ️ This event spans multiple days
              </div>
            )}
            {endDate <= startDate && (
              <div className="text-xs mt-1 text-red-500 dark:text-red-400">
                ⚠️ Please ensure the end time is after the start time
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
