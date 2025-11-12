"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Clock, 
  Plus, 
  Trash2, 
  Calendar as CalendarIcon, 
  Save, 
  RotateCcw,
  Sparkles,
  Copy,
  CalendarDays,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  UserAvailability, 
  AvailabilitySlot, 
  TimeSlot 
} from "@/types/index";
import { 
  mockUserAvailability, 
  getDayName, 
  createEmptyTimeSlot,
  createEmptyAvailabilitySlot,
  availabilityPresets
} from "@/data/mockAvailability";
import { toast } from "sonner";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 },
  },
};

export default function AvailabilityView() {
  const [availability, setAvailability] = useState<UserAvailability>(mockUserAvailability);
  const [activeTab, setActiveTab] = useState("weekly");
  const [isModified, setIsModified] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{x: number, y: number, width: number} | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<{[key: string]: HTMLDivElement | null}>({});

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Generate time options for dropdowns
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const displayTime = new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        times.push({ value: timeString, label: displayTime });
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  // Time conversion functions
  const convertTo12Hour = (time24: string): string => {
    if (!time24 || !time24.includes(':')) return '';
    const [hours, minutes] = time24.split(':');
    const hour24 = parseInt(hours, 10);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  };

  const convertTo24Hour = (time12: string): string => {
    if (!time12) return '';
    const parts = time12.trim().split(' ');
    if (parts.length !== 2) return time12; // Return as-is if not in AM/PM format

    const [time, ampm] = parts;
    const [hours, minutes] = time.split(':');
    let hour24 = parseInt(hours, 10);

    if (ampm.toUpperCase() === 'PM' && hour24 !== 12) {
      hour24 += 12;
    } else if (ampm.toUpperCase() === 'AM' && hour24 === 12) {
      hour24 = 0;
    }

    return `${hour24.toString().padStart(2, '0')}:${minutes}`;
  };

  // Dropdown Portal Component
  const DropdownPortal = ({ children, isOpen }: { children: React.ReactNode, isOpen: boolean }) => {
    if (!isOpen || !dropdownPosition) return null;

    return createPortal(
      <div
        style={{
          position: 'fixed',
          left: dropdownPosition.x,
          top: dropdownPosition.y,
          width: dropdownPosition.width,
          zIndex: 9999
        }}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg max-h-32 overflow-y-auto"
      >
        {children}
      </div>,
      document.body
    );
  };

  // Handle dropdown state
  const toggleDropdown = (dropdownId: string) => {
    if (openDropdown === dropdownId) {
      setOpenDropdown(null);
      setDropdownPosition(null);
    } else {
      const triggerElement = triggerRefs.current[dropdownId];
      if (triggerElement) {
        const rect = triggerElement.getBoundingClientRect();
        setDropdownPosition({
          x: rect.left,
          y: rect.bottom,
          width: rect.width
        });
      }
      setOpenDropdown(dropdownId);
    }
  };

  const closeDropdown = () => {
    setOpenDropdown(null);
    setDropdownPosition(null);
  };

  // Handle keyboard input for time selection
  const handleTimeChange = (value: string, slotId: string, index: number, field: 'startTime' | 'endTime') => {
    // Convert 12-hour format input to 24-hour for storage
    const time24 = convertTo24Hour(value);
    updateTimeSlot(slotId, index, field, time24);
  };

  const handleTimeKeyDown = (e: React.KeyboardEvent, slotId: string, index: number, field: 'startTime' | 'endTime') => {
    // Allow navigation keys, backspace, delete, space, and alphanumeric for AM/PM
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', ' '];
    const isNumberOrColon = /[0-9:]/.test(e.key);
    const isAMPM = /[apmAMP]/.test(e.key);

    if (!isNumberOrColon && !isAMPM && !allowedKeys.includes(e.key)) {
      e.preventDefault();
      return;
    }
  };

  const handleSave = () => {
    // In a real app, this would save to backend
    console.log("Saving availability:", availability);
    setIsModified(false);
    toast.success("Availability saved successfully", {
      duration: 3000,
    });
  };

  const handleReset = () => {
    setAvailability(mockUserAvailability);
    setIsModified(false);
  };

  const applyPreset = (presetKey: keyof typeof availabilityPresets) => {
    const preset = availabilityPresets[presetKey];
    setAvailability(prev => ({
      ...prev,
      availabilitySlots: preset.slots as AvailabilitySlot[],
      lastUpdated: new Date()
    }));
    setIsModified(true);
  };

  const updateAvailabilitySlot = (slotId: string, updatedSlot: AvailabilitySlot) => {
    setAvailability(prev => ({
      ...prev,
      availabilitySlots: prev.availabilitySlots.map(slot =>
        slot.id === slotId ? updatedSlot : slot
      ),
      lastUpdated: new Date()
    }));
    setIsModified(true);
  };

  const addTimeSlot = (slotId: string) => {
    setAvailability(prev => ({
      ...prev,
      availabilitySlots: prev.availabilitySlots.map(slot =>
        slot.id === slotId
          ? { ...slot, timeSlots: [...slot.timeSlots, createEmptyTimeSlot()] }
          : slot
      ),
      lastUpdated: new Date()
    }));
    setIsModified(true);
  };

  const duplicateTimeSlot = (slotId: string, timeSlotIndex: number) => {
    setAvailability(prev => ({
      ...prev,
      availabilitySlots: prev.availabilitySlots.map(slot =>
        slot.id === slotId
          ? {
              ...slot,
              timeSlots: [
                ...slot.timeSlots.slice(0, timeSlotIndex + 1),
                { ...slot.timeSlots[timeSlotIndex] },
                ...slot.timeSlots.slice(timeSlotIndex + 1)
              ]
            }
          : slot
      ),
      lastUpdated: new Date()
    }));
    setIsModified(true);
  };

  const removeTimeSlot = (slotId: string, timeSlotIndex: number) => {
    setAvailability(prev => ({
      ...prev,
      availabilitySlots: prev.availabilitySlots.map(slot =>
        slot.id === slotId
          ? {
              ...slot,
              timeSlots: slot.timeSlots.filter((_, index) => index !== timeSlotIndex)
            }
          : slot
      ),
      lastUpdated: new Date()
    }));
    setIsModified(true);
  };

  const updateTimeSlot = (slotId: string, timeSlotIndex: number, field: keyof TimeSlot, value: string) => {
    setAvailability(prev => ({
      ...prev,
      availabilitySlots: prev.availabilitySlots.map(slot =>
        slot.id === slotId
          ? {
              ...slot,
              timeSlots: slot.timeSlots.map((timeSlot, index) =>
                index === timeSlotIndex
                  ? { ...timeSlot, [field]: value }
                  : timeSlot
              )
            }
          : slot
      ),
      lastUpdated: new Date()
    }));
    setIsModified(true);
  };

  const toggleDayAvailability = (dayOfWeek: number) => {
    const existingSlot = availability.availabilitySlots.find(slot => slot.dayOfWeek === dayOfWeek);
    
    if (existingSlot) {
      // Remove the day
      setAvailability(prev => ({
        ...prev,
        availabilitySlots: prev.availabilitySlots.filter(slot => slot.dayOfWeek !== dayOfWeek),
        lastUpdated: new Date()
      }));
    } else {
      // Add the day
      setAvailability(prev => ({
        ...prev,
        availabilitySlots: [...prev.availabilitySlots, createEmptyAvailabilitySlot(dayOfWeek)],
        lastUpdated: new Date()
      }));
    }
    setIsModified(true);
  };

  const addSpecificDateAvailability = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    const existingSlot = availability.availabilitySlots.find(slot => 
      slot.specificDate && slot.specificDate.toISOString().split('T')[0] === dateString
    );
    
    if (!existingSlot) {
      const newSlot: AvailabilitySlot = {
        id: `specific-${dateString}-${Date.now()}`,
        dayOfWeek: date.getDay(),
        timeSlots: [createEmptyTimeSlot()],
        isRecurring: false,
        specificDate: date
      };
      
      setAvailability(prev => ({
        ...prev,
        availabilitySlots: [...prev.availabilitySlots, newSlot],
        lastUpdated: new Date()
      }));
      setIsModified(true);
    }
    setSelectedDate(undefined);
    setIsDatePickerOpen(false);
  };

  const removeSpecificDateAvailability = (slotId: string) => {
    setAvailability(prev => ({
      ...prev,
      availabilitySlots: prev.availabilitySlots.filter(slot => slot.id !== slotId),
      lastUpdated: new Date()
    }));
    setIsModified(true);
  };

  const formatSpecificDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const weeklySlots = availability.availabilitySlots
    .filter(slot => slot.isRecurring)
    .sort((a, b) => a.dayOfWeek - b.dayOfWeek);

  const specificDateSlots = availability.availabilitySlots
    .filter(slot => !slot.isRecurring && slot.specificDate)
    .sort((a, b) => {
      if (!a.specificDate || !b.specificDate) return 0;
      return a.specificDate.getTime() - b.specificDate.getTime();
    });

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              Manage Availability
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
              Set your availability slots so colleagues can schedule meetings with you.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {isModified && (
              <Badge variant="secondary" className="text-sm">
                Unsaved changes
              </Badge>
            )}
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={!isModified}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="space-y-8">
        {/* Presets Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6"
        >
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5" />
            Preset Templates
          </h3>
          <p className="text-sm text-gray-500 mb-4">Select a preset template to apply to your availability</p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {Object.entries(availabilityPresets).map(([key, preset]) => (
              <Button
                key={key}
                variant="outline"
                size="lg"
                onClick={() => applyPreset(key as keyof typeof availabilityPresets)}
                className="h-auto p-4 text-left justify-start bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                <div className="w-full">
                  <div className="font-semibold text-base mb-2">{preset.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {preset.description}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="weekly">Weekly Availability</TabsTrigger>
                <TabsTrigger value="specific">Specific Dates</TabsTrigger>
              </TabsList>

              <TabsContent value="weekly" className="space-y-6 mt-6">
                {/* Inline Day Configuration */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-6 text-lg">
                    Configure your weekly availability
                  </h4>
                  
                  <div className="space-y-4">
                    {[0, 1, 2, 3, 4, 5, 6].map(dayOfWeek => {
                      const daySlot = availability.availabilitySlots.find(slot => slot.dayOfWeek === dayOfWeek);
                      const isEnabled = !!daySlot;
                      
                      return (
                        <motion.div
                          key={dayOfWeek}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-visible"
                        >
                          {/* Toggle Switch */}
                          <Switch
                            checked={isEnabled}
                            onCheckedChange={() => toggleDayAvailability(dayOfWeek)}
                            className="data-[state=checked]:bg-blue-600 cursor-pointer hover:opacity-80 transition-opacity"
                          />
                          
                          {/* Day Name */}
                          <div className="min-w-[100px] flex-shrink-0">
                            <Label className={cn(
                              "text-base font-medium",
                              isEnabled 
                                ? "text-gray-900 dark:text-white" 
                                : "text-gray-500 dark:text-gray-400"
                            )}>
                              {getDayName(dayOfWeek)}
                            </Label>
                          </div>
                          
                          {/* Time Configuration - Only show if enabled */}
                          {isEnabled && daySlot && (
                            <div className="flex-1 w-full min-w-0">
                              <div className="space-y-3">
                                {daySlot.timeSlots.map((timeSlot, index) => (
                                  <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 overflow-visible"
                                  >
                                    {/* Time Inputs with Dropdowns */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                      {/* Start Time Input with Dropdown */}
                                      <div className="relative">
                                        <div
                                          className="flex"
                                          ref={(el) => triggerRefs.current[`${daySlot.id}-start-${index}`] = el}
                                        >
                                          <Input
                                            type="text"
                                            value={convertTo12Hour(timeSlot.startTime)}
                                            onChange={(e) => handleTimeChange(e.target.value, daySlot.id, index, "startTime")}
                                            onKeyDown={(e) => handleTimeKeyDown(e, daySlot.id, index, "startTime")}
                                            placeholder="9:00 AM"
                                            className="w-24 h-7 text-xs text-center rounded-r-none border-r-0"
                                            maxLength={8}
                                          />
                                          <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => toggleDropdown(`${daySlot.id}-start-${index}`)}
                                            className="h-7 w-6 px-1 rounded-l-none border-l-0"
                                          >
                                            <ChevronDown className="h-3 w-3" />
                                          </Button>
                                        </div>
                                        <DropdownPortal isOpen={openDropdown === `${daySlot.id}-start-${index}`}>
                                          <div ref={dropdownRef}>
                                            {timeOptions.map((option) => (
                                              <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => {
                                                  updateTimeSlot(daySlot.id, index, "startTime", option.value);
                                                  closeDropdown();
                                                }}
                                                className="w-full px-2 py-1 text-xs text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                                              >
                                                {option.label}
                                              </button>
                                            ))}
                                          </div>
                                        </DropdownPortal>
                                      </div>
                                      
                                      <span className="text-gray-500 dark:text-gray-400 text-xs">-</span>
                                      
                                      {/* End Time Input with Dropdown */}
                                      <div className="relative">
                                        <div
                                          className="flex"
                                          ref={(el) => triggerRefs.current[`${daySlot.id}-end-${index}`] = el}
                                        >
                                          <Input
                                            type="text"
                                            value={convertTo12Hour(timeSlot.endTime)}
                                            onChange={(e) => handleTimeChange(e.target.value, daySlot.id, index, "endTime")}
                                            onKeyDown={(e) => handleTimeKeyDown(e, daySlot.id, index, "endTime")}
                                            placeholder="5:00 PM"
                                            className="w-24 h-7 text-xs text-center rounded-r-none border-r-0"
                                            maxLength={8}
                                          />
                                          <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => toggleDropdown(`${daySlot.id}-end-${index}`)}
                                            className="h-7 w-6 px-1 rounded-l-none border-l-0"
                                          >
                                            <ChevronDown className="h-3 w-3" />
                                          </Button>
                                        </div>
                                        <DropdownPortal isOpen={openDropdown === `${daySlot.id}-end-${index}`}>
                                          <div ref={dropdownRef}>
                                            {timeOptions.map((option) => (
                                              <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => {
                                                  updateTimeSlot(daySlot.id, index, "endTime", option.value);
                                                  closeDropdown();
                                                }}
                                                className="w-full px-2 py-1 text-xs text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                                              >
                                                {option.label}
                                              </button>
                                            ))}
                                          </div>
                                        </DropdownPortal>
                                      </div>
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                      {/* Add Time Slot Button */}
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => addTimeSlot(daySlot.id)}
                                        className="h-8 w-8 p-0 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                        title="Add time slot"
                                      >
                                        <Plus className="h-4 w-4" />
                                      </Button>
                                      
                                      {/* Remove Time Slot Button */}
                                      {daySlot.timeSlots.length > 1 && (
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => removeTimeSlot(daySlot.id, index)}
                                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                          title="Remove time slot"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {weeklySlots.length === 0 && (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <p>Toggle the days of the week when you are available</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="specific" className="space-y-6 mt-6">
                {/* Add Specific Date Section */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-6 text-lg">
                    Add specific date availability
                  </h4>
                  
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full sm:w-[280px] justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {selectedDate ? formatSpecificDate(selectedDate) : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            setSelectedDate(date);
                            if (date) {
                              addSpecificDateAvailability(date);
                            }
                          }}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Select a date to add availability for that specific day
                    </div>
                  </div>
                </div>

                {/* Specific Date Slots */}
                {specificDateSlots.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-6 text-lg">
                      Specific date availability
                    </h4>
                    
                    <div className="space-y-4">
                      <AnimatePresence>
                        {specificDateSlots.map((slot) => (
                        <motion.div
                          key={slot.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-visible"
                        >
                            {/* Date Display */}
                            <div className="min-w-[200px] flex-shrink-0">
                              <div className="flex items-center gap-2">
                                <CalendarDays className="h-4 w-4 text-blue-600" />
                                <Label className="text-base font-medium text-gray-900 dark:text-white">
                                  {slot.specificDate ? formatSpecificDate(slot.specificDate) : ''}
                                </Label>
                              </div>
                            </div>
                            
                            {/* Time Configuration */}
                            <div className="flex-1 w-full min-w-0">
                              <div className="space-y-3">
                                {slot.timeSlots.map((timeSlot, index) => (
                                  <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 overflow-visible"
                                  >
                                    {/* Time Inputs with Dropdowns */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                      {/* Start Time Input with Dropdown */}
                                      <div className="relative">
                                        <div
                                          className="flex"
                                          ref={(el) => triggerRefs.current[`${slot.id}-start-${index}`] = el}
                                        >
                                          <Input
                                            type="text"
                                            value={convertTo12Hour(timeSlot.startTime)}
                                            onChange={(e) => handleTimeChange(e.target.value, slot.id, index, "startTime")}
                                            onKeyDown={(e) => handleTimeKeyDown(e, slot.id, index, "startTime")}
                                            placeholder="9:00 AM"
                                            className="w-24 h-7 text-xs text-center rounded-r-none border-r-0"
                                            maxLength={8}
                                          />
                                          <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => toggleDropdown(`${slot.id}-start-${index}`)}
                                            className="h-7 w-6 px-1 rounded-l-none border-l-0"
                                          >
                                            <ChevronDown className="h-3 w-3" />
                                          </Button>
                                        </div>
                                        <DropdownPortal isOpen={openDropdown === `${slot.id}-start-${index}`}>
                                          <div ref={dropdownRef}>
                                            {timeOptions.map((option) => (
                                              <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => {
                                                  updateTimeSlot(slot.id, index, "startTime", option.value);
                                                  closeDropdown();
                                                }}
                                                className="w-full px-2 py-1 text-xs text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                                              >
                                                {option.label}
                                              </button>
                                            ))}
                                          </div>
                                        </DropdownPortal>
                                      </div>
                                      
                                      <span className="text-gray-500 dark:text-gray-400 text-xs">-</span>
                                      
                                      {/* End Time Input with Dropdown */}
                                      <div className="relative">
                                        <div
                                          className="flex"
                                          ref={(el) => triggerRefs.current[`${slot.id}-end-${index}`] = el}
                                        >
                                          <Input
                                            type="text"
                                            value={convertTo12Hour(timeSlot.endTime)}
                                            onChange={(e) => handleTimeChange(e.target.value, slot.id, index, "endTime")}
                                            onKeyDown={(e) => handleTimeKeyDown(e, slot.id, index, "endTime")}
                                            placeholder="5:00 PM"
                                            className="w-24 h-7 text-xs text-center rounded-r-none border-r-0"
                                            maxLength={8}
                                          />
                                          <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => toggleDropdown(`${slot.id}-end-${index}`)}
                                            className="h-7 w-6 px-1 rounded-l-none border-l-0"
                                          >
                                            <ChevronDown className="h-3 w-3" />
                                          </Button>
                                        </div>
                                        <DropdownPortal isOpen={openDropdown === `${slot.id}-end-${index}`}>
                                          <div ref={dropdownRef}>
                                            {timeOptions.map((option) => (
                                              <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => {
                                                  updateTimeSlot(slot.id, index, "endTime", option.value);
                                                  closeDropdown();
                                                }}
                                                className="w-full px-2 py-1 text-xs text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                                              >
                                                {option.label}
                                              </button>
                                            ))}
                                          </div>
                                        </DropdownPortal>
                                      </div>
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                      {/* Add Time Slot Button */}
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => addTimeSlot(slot.id)}
                                        className="h-8 w-8 p-0 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                        title="Add time slot"
                                      >
                                        <Plus className="h-4 w-4" />
                                      </Button>
                                      
                                      {/* Remove Time Slot Button */}
                                      {slot.timeSlots.length > 1 && (
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => removeTimeSlot(slot.id, index)}
                                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                          title="Remove time slot"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </div>
                            
                            {/* Remove Date Button */}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeSpecificDateAvailability(slot.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 flex-shrink-0"
                              title="Remove this date"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )}

                {specificDateSlots.length === 0 && (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No specific dates configured</p>
                    <p className="text-sm">Use the date picker above to add availability for specific dates</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
