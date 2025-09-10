"use client";

import { EventFormData } from "@/types";
import React, { useEffect, useState } from "react";
import { UseFormSetValue } from "react-hook-form";
import { format, setHours, setMinutes, isBefore, addHours } from "date-fns";
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
  }, [data?.startDate, data?.endDate, hasInitialized]); // Only depend on the actual date values, not the entire data object
  
  // Update form values only when dates are actually changed by user interaction
  const updateFormValues = React.useCallback(() => {
    setValue("startDate", startDate);
    setValue("endDate", endDate);
  }, [startDate, endDate, setValue]);

  // Time options for select
  const hours = Array.from({ length: 12 }, (_, i) => i === 0 ? 12 : i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);
  const periods = ["AM", "PM"];

  // Convert 24-hour format to 12-hour format
  const get12HourFormat = (hour: number) => {
    return hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  };

  // Get period (AM/PM) from hour
  const getPeriod = (hour: number) => {
    return hour >= 12 ? "PM" : "AM";
  };

  // Convert 12-hour format to 24-hour format
  const get24HourFormat = (hour: number, period: string) => {
    if (period === "AM") {
      return hour === 12 ? 0 : hour;
    } else {
      return hour === 12 ? 12 : hour + 12;
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Start Date Picker */}
        <div className="space-y-2">
          <Label>Start Date</Label>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !startDate && "text-muted-foreground"
            )}
            onClick={() => setShowStartCalendar(!showStartCalendar)}
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
                    console.log("🗓️ Current startDate before change:", startDate);
                    if (date && !isNaN(date.getTime())) {
                      // Preserve the time when changing the date
                      const newDate = new Date(date);
                      newDate.setHours(
                        startDate.getHours(),
                        startDate.getMinutes(),
                        0,
                        0
                      );
                      console.log("🗓️ New startDate created:", newDate);
                      // Validate the new date before setting
                      if (!isNaN(newDate.getTime())) {
                        setStartDate(newDate);
                        setShowStartCalendar(false);
                        console.log("✅ Start date state updated");
                        // Update form values after state change
                        setTimeout(() => {
                          setValue("startDate", newDate);
                          console.log("✅ Form value updated for startDate");
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

        {/* End Date Picker */}
        <div className="space-y-2">
          <Label>End Date</Label>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !endDate && "text-muted-foreground"
            )}
            onClick={() => setShowEndCalendar(!showEndCalendar)}
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
                    console.log("🗓️ Current endDate before change:", endDate);
                    if (date && !isNaN(date.getTime())) {
                      // Preserve the time when changing the date
                      const newDate = new Date(date);
                      newDate.setHours(
                        endDate.getHours(),
                        endDate.getMinutes(),
                        0,
                        0
                      );
                      console.log("🗓️ New endDate created:", newDate);
                      // Validate the new date before setting
                      if (!isNaN(newDate.getTime())) {
                        setEndDate(newDate);
                        setShowEndCalendar(false);
                        console.log("✅ End date state updated");
                        // Update form values after state change
                        setTimeout(() => {
                          setValue("endDate", newDate);
                          console.log("✅ Form value updated for endDate");
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
      </div>

      <div className="flex flex-col gap-4">
        {/* Start Time */}
        <div className="space-y-2">
          <Label>Start Time</Label>
          <div className="flex space-x-2">
            <Select
              value={get12HourFormat(startDate.getHours()).toString()}
              onValueChange={(value) => {
                const hour = parseInt(value, 10);
                const period = getPeriod(startDate.getHours());
                const newHour = get24HourFormat(hour, period);
                const newDate = setHours(startDate, newHour);
                if (!isNaN(newDate.getTime())) {
                  setStartDate(newDate);
                  setTimeout(() => {
                    setValue("startDate", newDate);
                  }, 0);
                }
              }}
            >
              <SelectTrigger className="w-[100px]">
                <Clock className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Hour" />
              </SelectTrigger>
              <SelectContent className="h-[200px]">
                {hours.map((hour) => (
                  <SelectItem key={hour} value={hour.toString()}>
                    {hour.toString().padStart(2, "0")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={startDate.getMinutes().toString()}
              onValueChange={(value) => {
                const newDate = setMinutes(startDate, parseInt(value, 10));
                if (!isNaN(newDate.getTime())) {
                  setStartDate(newDate);
                  setTimeout(() => {
                    setValue("startDate", newDate);
                  }, 0);
                }
              }}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Minute" />
              </SelectTrigger>
              <SelectContent className="h-[200px]">
                {minutes.map((minute) => (
                  <SelectItem key={minute} value={minute.toString()}>
                    {minute.toString().padStart(2, "0")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={getPeriod(startDate.getHours())}
              onValueChange={(value) => {
                const hour = get12HourFormat(startDate.getHours());
                const newHour = get24HourFormat(hour, value);
                const newDate = setHours(startDate, newHour);
                if (!isNaN(newDate.getTime())) {
                  setStartDate(newDate);
                  setTimeout(() => {
                    setValue("startDate", newDate);
                  }, 0);
                }
              }}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder="AM/PM" />
              </SelectTrigger>
              <SelectContent>
                {periods.map((period) => (
                  <SelectItem key={period} value={period}>
                    {period}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-xs text-muted-foreground">
            Current time: {format(startDate, "hh:mm a")}
          </div>
        </div>

        {/* End Time */}
        <div className="space-y-2">
          <Label>End Time</Label>
          <div className="flex space-x-2">
            <Select
              value={get12HourFormat(endDate.getHours()).toString()}
              onValueChange={(value) => {
                const hour = parseInt(value, 10);
                const period = getPeriod(endDate.getHours());
                const newHour = get24HourFormat(hour, period);
                const newDate = setHours(endDate, newHour);
                if (!isNaN(newDate.getTime())) {
                  setEndDate(newDate);
                  setTimeout(() => {
                    setValue("endDate", newDate);
                  }, 0);
                }
              }}
            >
              <SelectTrigger className="w-[100px]">
                <Clock className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Hour" />
              </SelectTrigger>
              <SelectContent className="h-[200px]">
                {hours.map((hour) => (
                  <SelectItem key={hour} value={hour.toString()}>
                    {hour.toString().padStart(2, "0")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={endDate.getMinutes().toString()}
              onValueChange={(value) => {
                const newDate = setMinutes(endDate, parseInt(value, 10));
                if (!isNaN(newDate.getTime())) {
                  setEndDate(newDate);
                  setTimeout(() => {
                    setValue("endDate", newDate);
                  }, 0);
                }
              }}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Minute" />
              </SelectTrigger>
              <SelectContent className="h-[200px]">
                {minutes.map((minute) => (
                  <SelectItem key={minute} value={minute.toString()}>
                    {minute.toString().padStart(2, "0")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={getPeriod(endDate.getHours())}
              onValueChange={(value) => {
                const hour = get12HourFormat(endDate.getHours());
                const newHour = get24HourFormat(hour, value);
                const newDate = setHours(endDate, newHour);
                if (!isNaN(newDate.getTime())) {
                  setEndDate(newDate);
                  setTimeout(() => {
                    setValue("endDate", newDate);
                  }, 0);
                }
              }}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder="AM/PM" />
              </SelectTrigger>
              <SelectContent>
                {periods.map((period) => (
                  <SelectItem key={period} value={period}>
                    {period}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-xs text-muted-foreground">
            Current time: {format(endDate, "hh:mm a")}
          </div>
        </div>
      </div>
    </div>
  );
}
