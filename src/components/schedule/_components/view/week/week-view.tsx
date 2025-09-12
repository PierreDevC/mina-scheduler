import React, { useRef, useState, useEffect, useCallback } from "react";
import { useScheduler } from "@/providers/schedular-provider";
import { Badge } from "@/components/ui/badge";
import { AnimatePresence, motion } from "framer-motion"; // Import Framer Motion
import { useModal } from "@/providers/modal-context";
import AddEventModal from "@/components/schedule/_modals/add-event-modal";
import EventStyled from "../event-component/event-styled";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Maximize2, ChevronLeft, Maximize } from "lucide-react";
import clsx from "clsx";
import { Event, CustomEventModal } from "@/types";
import CustomModal from "@/components/ui/custom-modal";
import { useEventCreationHandler } from "../../handlers/event-creation-handler";

const hours = Array.from({ length: 24 }, (_, i) => {
  const hour = i % 12 || 12;
  const ampm = i < 12 ? "AM" : "PM";
  return `${hour}:00 ${ampm}`;
});

interface ChipData {
  id: number;
  color: "primary" | "warning" | "danger";
  title: string;
  description: string;
}

const chipData: ChipData[] = [
  {
    id: 1,
    color: "primary",
    title: "Ads Campaign Nr1",
    description: "Day 1 of 5: Google Ads, Target Audience: SMB-Alpha",
  },
  {
    id: 2,
    color: "warning",
    title: "Ads Campaign Nr2",
    description:
      "All Day: Day 2 of 5: AdSense + FB, Target Audience: SMB2-Delta3",
  },
  {
    id: 3,
    color: "danger",
    title: "Critical Campaign Nr3",
    description: "Day 3 of 5: High-Impact Ads, Target: E-Commerce Gamma",
  },
  {
    id: 4,
    color: "primary",
    title: "Ads Campaign Nr4",
    description: "Day 4 of 5: FB Ads, Audience: Retailers-Zeta",
  },
  {
    id: 5,
    color: "warning",
    title: "Campaign Ending Soon",
    description: "Final Day: Monitor closely, Audience: Delta2-Beta",
  },
];

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Stagger children animations
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 5 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.12 } },
};

const pageTransitionVariants = {
  enter: (direction: number) => ({
    opacity: 0,
  }),
  center: {
    opacity: 1,
  },
  exit: (direction: number) => ({
    opacity: 0,
    transition: {
      opacity: { duration: 0.2, ease: "easeInOut" },
    },
  }),
};

export default function WeeklyView({
  prevButton,
  nextButton,
  CustomEventComponent,
  CustomEventModal,
  classNames,
}: {
  prevButton?: React.ReactNode;
  nextButton?: React.ReactNode;
  CustomEventComponent?: React.FC<Event>;
  CustomEventModal?: CustomEventModal;
  classNames?: { prev?: string; next?: string; addEvent?: string };
}) {
  const { getters, handlers } = useScheduler();
  const hoursColumnRef = useRef<HTMLDivElement>(null);
  const [detailedHour, setDetailedHour] = useState<string | null>(null);
  const [timelinePosition, setTimelinePosition] = useState<number>(0);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [colWidth, setColWidth] = useState<number[]>(Array(7).fill(1)); // Equal width columns by default
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [direction, setDirection] = useState<number>(0);
  const { setOpen } = useModal();
  const { handleDateClick, handleTimeClick } = useEventCreationHandler({ 
    customComponents: { CustomEventModal } 
  });

  const daysOfWeek = getters?.getDaysInWeek(
    getters?.getWeekNumber(currentDate),
    currentDate.getFullYear()
  );

  // Reset column widths when the date changes
  useEffect(() => {
    setColWidth(Array(7).fill(1));
  }, [currentDate]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!hoursColumnRef.current) return;
    const rect = hoursColumnRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const hourHeight = rect.height / 24;
    const hour = Math.max(0, Math.min(23, Math.floor(y / hourHeight)));
    const minuteFraction = (y % hourHeight) / hourHeight;
    const minutes = Math.floor(minuteFraction * 60);
    
    // Format in 12-hour format
    const hour12 = hour % 12 || 12;
    const ampm = hour < 12 ? "AM" : "PM";
    setDetailedHour(
      `${hour12}:${minutes.toString().padStart(2, "0")} ${ampm}`
    );
    
    // Ensure timelinePosition is never negative and is within bounds
    // 83px offset accounts for the header height
    const headerOffset = 83;
    const position = Math.max(0, Math.min(rect.height, Math.round(y))) + headerOffset;
    setTimelinePosition(position);
  }, []);

  function handleAddEvent(event?: Event) {
    // Create the modal content with the provided event data or defaults
    const defaultStart = new Date();
    defaultStart.setHours(9, 0, 0, 0); // 9:00 AM
    const defaultEnd = new Date();
    defaultEnd.setHours(10, 0, 0, 0); // 10:00 AM
    
    const startDate = event?.startDate || defaultStart;
    const endDate = event?.endDate || defaultEnd;

    // Open the modal with the content
    setOpen(
      <CustomModal title="Add Event">
        <AddEventModal
          CustomAddEventModal={
            CustomEventModal?.CustomAddEventModal?.CustomForm
          }
        />
      </CustomModal>,
      async () => {
        return {
          default: {
            ...event,
            startDate,
            endDate,
          }
        };
      }
    );
  }

  const handleNextWeek = useCallback(() => {
    setDirection(1);
    const nextWeek = new Date(currentDate);
    nextWeek.setDate(currentDate.getDate() + 7);
    setCurrentDate(nextWeek);
  }, [currentDate]);

  const handlePrevWeek = useCallback(() => {
    setDirection(-1);
    const prevWeek = new Date(currentDate);
    prevWeek.setDate(currentDate.getDate() - 7);
    setCurrentDate(prevWeek);
  }, [currentDate]);

  function handleAddEventWeek(dayIndex: number, detailedHour: string) {
    if (!detailedHour) {
      console.error("Detailed hour not provided.");
      return;
    }

    // Get the actual date for this day from the week array
    const targetDate = daysOfWeek[dayIndex % 7];
    if (!targetDate) {
      console.error("Invalid day index:", dayIndex);
      return;
    }

    console.log("📅 Week view - Day clicked:", targetDate.toDateString());
    console.log("🕐 Week view - Time clicked:", detailedHour);

    // Parse the 12-hour format time
    const [timePart, ampm] = detailedHour.split(" ");
    const [hourStr, minuteStr] = timePart.split(":");
    let hours = parseInt(hourStr);
    const minutes = parseInt(minuteStr);
    
    // Convert to 24-hour format for Date object
    if (ampm === "PM" && hours < 12) {
      hours += 12;
    } else if (ampm === "AM" && hours === 12) {
      hours = 0;
    }

    // Create the precise date and time
    const startDate = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate(),
      hours,
      minutes,
      0,
      0
    );

    console.log("📅 Week view - Created startDate:", startDate);

    // Use the time click handler for precise time selection
    handleTimeClick(startDate);
  }


  // Group events by time period to prevent splitting spaces within same time blocks
  const groupEventsByTimePeriod = (events: Event[] | undefined) => {
    if (!events || events.length === 0) return [];
    
    // Sort events by start time
    const sortedEvents = [...events].sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
    
    // Precise time overlap checking function
    const eventsOverlap = (event1: Event, event2: Event) => {
      const start1 = new Date(event1.startDate).getTime();
      const end1 = new Date(event1.endDate).getTime();
      const start2 = new Date(event2.startDate).getTime();
      const end2 = new Date(event2.endDate).getTime();
      
      // Strict time overlap - one event starts before the other ends
      return (start1 < end2 && start2 < end1);
    };
    
    // First, create a graph where events are vertices and edges represent overlaps
    const graph: Record<string, Set<string>> = {};
    
    // Initialize graph
    for (const event of sortedEvents) {
      graph[event.id] = new Set<string>();
    }
    
    // Build connections - only connect events that truly overlap in time
    for (let i = 0; i < sortedEvents.length; i++) {
      for (let j = i + 1; j < sortedEvents.length; j++) {
        // Only consider events that actually overlap in time
        if (eventsOverlap(sortedEvents[i], sortedEvents[j])) {
          graph[sortedEvents[i].id].add(sortedEvents[j].id);
          graph[sortedEvents[j].id].add(sortedEvents[i].id);
        }
      }
    }
    
    // Use DFS to find connected components (groups of overlapping events)
    const visited = new Set<string>();
    const groups: Event[][] = [];
    
    for (const event of sortedEvents) {
      if (!visited.has(event.id)) {
        // Start a new component/group
        const group: Event[] = [];
        const stack: Event[] = [event];
        visited.add(event.id);
        
        // DFS traversal
        while (stack.length > 0) {
          const current = stack.pop()!;
          group.push(current);
          
          // Visit neighbors (overlapping events)
          for (const neighborId of graph[current.id]) {
            if (!visited.has(neighborId)) {
              const neighbor = sortedEvents.find(e => e.id === neighborId);
              if (neighbor) {
                stack.push(neighbor);
                visited.add(neighborId);
              }
            }
          }
        }
        
        // Sort this group by start time
        group.sort((a, b) => 
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );
        
        groups.push(group);
      }
    }
    
    return groups;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center mb-2">

        <div className="flex ml-auto gap-3">
          {prevButton ? (
            <div onClick={handlePrevWeek}>{prevButton}</div>
          ) : (
            <Button variant="outline" className={classNames?.prev} onClick={handlePrevWeek}>
              <ArrowLeft />
              Prev
            </Button>
          )}
          {nextButton ? (
            <div onClick={handleNextWeek}>{nextButton}</div>
          ) : (
            <Button variant="outline" className={classNames?.next} onClick={handleNextWeek}>
              Next
              <ArrowRight />
            </Button>
          )}
        </div>
      </div>
      
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentDate.toISOString()}
          custom={direction}
          variants={pageTransitionVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            opacity: { duration: 0.2 },
          }}
          className={"grid use-automation-zoom-in grid-cols-1 sm:grid-cols-8 gap-0"}
        >
          {/* Mobile Week View - Vertical Stack */}
          <div className="block sm:hidden">
            <div className="space-y-4">
              {daysOfWeek.map((day, dayIndex) => {
                const dayEvents = getters.getEventsForDay(
                  day.getDate(),
                  currentDate
                );
                const isToday = new Date().getDate() === day.getDate() &&
                  new Date().getMonth() === currentDate.getMonth() &&
                  new Date().getFullYear() === currentDate.getFullYear();

                return (
                  <motion.div
                    key={`mobile-day-${dayIndex}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: dayIndex * 0.1 }}
                    className={`bg-white dark:bg-gray-800 rounded-lg border ${
                      isToday ? 'border-blue-500 shadow-md' : 'border-gray-200 dark:border-gray-700'
                    } overflow-hidden`}
                  >
                    {/* Day Header */}
                    <div className={`p-4 ${isToday ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-gray-50 dark:bg-gray-800'} border-b border-gray-200 dark:border-gray-700`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {getters.getDayName(day.getDay())}
                          </div>
                          <div className={`text-xl font-semibold ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                            {day.getDate()}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {dayEvents?.length || 0} event{dayEvents?.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>

                    {/* Events List */}
                    <div className="p-4 space-y-3">
                      {dayEvents && dayEvents.length > 0 ? (
                        <>
                          {dayEvents.slice(0, 3).map((event, eventIndex) => (
                            <motion.div
                              key={event.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: (dayIndex * 0.1) + (eventIndex * 0.05) }}
                              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border-l-4 border-blue-500"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900 dark:text-white text-sm">
                                    {event.title || 'Untitled Event'}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {event.startDate.toLocaleTimeString('en-US', { 
                                      hour: 'numeric', 
                                      minute: '2-digit',
                                      hour12: true 
                                    })} - {event.endDate.toLocaleTimeString('en-US', { 
                                      hour: 'numeric', 
                                      minute: '2-digit',
                                      hour12: true 
                                    })}
                                  </div>
                                </div>
                                <div className={`w-3 h-3 rounded-full ${
                                  event.variant === 'primary' ? 'bg-blue-500' :
                                  event.variant === 'danger' ? 'bg-red-500' :
                                  event.variant === 'success' ? 'bg-green-500' :
                                  event.variant === 'warning' ? 'bg-yellow-500' :
                                  'bg-gray-500'
                                }`} />
                              </div>
                            </motion.div>
                          ))}
                          
                          {dayEvents.length > 3 && (
                            <div className="text-center">
                              <button 
                                className="text-blue-600 dark:text-blue-400 text-sm font-medium"
                                onClick={() => {
                                  setOpen(
                                    <CustomModal title={`${getters.getDayName(day.getDay())}, ${day.getDate()}`}>
                                      <div className="space-y-3 p-4 max-h-[70vh] overflow-y-auto">
                                        {dayEvents.map((event) => (
                                          <EventStyled
                                            key={event.id}
                                            event={{
                                              ...event,
                                              CustomEventComponent,
                                              minmized: false,
                                            }}
                                            CustomEventModal={CustomEventModal}
                                          />
                                        ))}
                                      </div>
                                    </CustomModal>
                                  );
                                }}
                              >
                                +{dayEvents.length - 3} more events
                              </button>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center py-8">
                          <div className="text-gray-400 dark:text-gray-500 text-sm">No events</div>
                          <button
                            onClick={() => handleAddEventWeek(dayIndex, "9:00 AM")}
                            className="mt-2 text-blue-600 dark:text-blue-400 text-sm font-medium"
                          >
                            Add event
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Desktop Week View */}
          <div className="hidden sm:flex sticky top-0 left-0 z-30 bg-default-100 rounded-tl-lg h-full border-0 items-center justify-center">
            <span className="text-xl tracking-tight font-semibold ">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>

          <div className="hidden sm:flex col-span-1 sm:col-span-7 flex-col relative">
            {/* Day Headers */}
            <div 
              className="grid gap-0 bg-default-100 rounded-t-lg overflow-x-auto" 
              style={{ 
                gridTemplateColumns: typeof window !== 'undefined' && window.innerWidth <= 640 ? 'repeat(7, minmax(120px, 1fr))' : colWidth.map(w => `${w}fr`).join(' '),
                transition: isResizing ? 'none' : 'grid-template-columns 0.3s ease-in-out'
              }}
            >
              {daysOfWeek.map((day, idx) => {
                // Get all-day events for this specific day
                const dayEvents = getters.getEventsForDay(day.getDate(), day);
                const allDayEvents = dayEvents?.filter(event => event.isAllDay) || [];
                const hasMoreAllDayEvents = allDayEvents.length > 1;
                
                return (
                  <div key={idx} className="relative group flex flex-col">
                    <div className="sticky bg-default-100 top-0 z-20 flex-grow flex flex-col items-center justify-center">
                      <div className="text-center p-2 sm:p-4">
                        <div className="text-sm sm:text-lg font-semibold">
                          <span className="hidden sm:inline">{getters.getDayName(day.getDay())}</span>
                          <span className="sm:hidden">{getters.getDayNameShort(day.getDay())}</span>
                        </div>
                        <div
                          className={clsx(
                            "text-sm sm:text-lg font-semibold",
                            new Date().getDate() === day.getDate() &&
                              new Date().getMonth() === currentDate.getMonth() &&
                              new Date().getFullYear() === currentDate.getFullYear()
                              ? "text-secondary-500"
                              : ""
                          )}
                        >
                          {day.getDate()}
                        </div>
                      </div>
                      
                      {/* All-day events directly below day header */}
                      {allDayEvents.length > 0 && (
                        <div className="w-full px-2 pb-2">
                          <div className="flex flex-col items-center space-y-1">
                            <div
                              className={clsx(
                                "text-xs px-2 py-1 rounded text-white font-medium truncate w-full text-center cursor-pointer filter hover:brightness-[0.9] transition",
                                allDayEvents[0].variant === "primary" && "bg-blue-500",
                                allDayEvents[0].variant === "success" && "bg-green-500",
                                allDayEvents[0].variant === "warning" && "bg-yellow-500",
                                allDayEvents[0].variant === "danger" && "bg-red-500",
                                !allDayEvents[0].variant && "bg-blue-500"
                              )}
                              onClick={(e) => {
                                e.stopPropagation();
                                const event = allDayEvents[0];
                                setOpen(
                                  <CustomModal title="Edit Event">
                                    <AddEventModal
                                      CustomAddEventModal={
                                        CustomEventModal?.CustomAddEventModal?.CustomForm
                                      }
                                    />
                                  </CustomModal>,
                                  async () => ({
                                    ...event,
                                    invitedPeople: event.invitedPeople || [],
                                  })
                                );
                              }}
                            >
                              🌅 {allDayEvents[0].title}
                            </div>
                            
                            {/* +X more indicator below the event */}
                            {hasMoreAllDayEvents && (
                              <div
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpen(
                                    <CustomModal title={`All-day Events - ${getters.getDayName(day.getDay())} ${day.getDate()}`}>
                                      <div className="space-y-3 p-4 max-h-[70vh] overflow-y-auto">
                                        {allDayEvents.map((event) => (
                                          <EventStyled
                                            key={event.id}
                                            event={{
                                              ...event,
                                              CustomEventComponent,
                                              minmized: false,
                                            }}
                                            CustomEventModal={CustomEventModal}
                                          />
                                        ))}
                                      </div>
                                    </CustomModal>
                                  );
                                }}
                                className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer transition duration-300"
                              >
                                +{allDayEvents.length - 1} event{allDayEvents.length - 1 !== 1 ? 's' : ''}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>


            {detailedHour && (
              <div
                className="absolute flex z-50 left-0 w-full h-[2px] bg-primary/40 rounded-full pointer-events-none"
                style={{ top: `${timelinePosition}px` }}
              >
                <Badge
                  variant="outline"
                  className="absolute -translate-y-1/2 bg-white z-50 left-[5px] text-xs"
                >
                  {detailedHour}
                </Badge>
              </div>
            )}
          </div>

          <div
            ref={hoursColumnRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setDetailedHour(null)}
            className="hidden sm:grid relative grid-cols-1 sm:grid-cols-8 col-span-1 sm:col-span-8 bg-default-50 rounded-b-lg overflow-hidden"
          >
            <div className="hidden sm:block col-span-1 bg-default-50 hover:bg-default-100 transition duration-400 rounded-bl-lg">
              {hours.map((hour, index) => (
                <motion.div
                  key={`hour-${index}`}
                  variants={itemVariants}
                  className="cursor-pointer border-b border-default-200 p-[16px] h-[64px] text-center text-sm text-muted-foreground border-r"
                >
                  {hour}
                </motion.div>
              ))}
            </div>

            <div 
              className="col-span-1 sm:col-span-7 bg-default-50 grid h-full rounded-br-lg" 
              style={{ 
                gridTemplateColumns: typeof window !== 'undefined' && window.innerWidth <= 640 ? '1fr' : colWidth.map(w => `${w}fr`).join(' '),
                transition: isResizing ? 'none' : 'grid-template-columns 0.3s ease-in-out'
              }}
            >
              {Array.from({ length: 7 }, (_, dayIndex) => {
                const dayEvents = getters.getEventsForDay(
                  daysOfWeek[dayIndex % 7].getDate(),
                  daysOfWeek[dayIndex % 7]
                );

                // Separate all-day and timed events
                const allDayEvents = dayEvents?.filter(event => event.isAllDay) || [];
                const timedEvents = dayEvents?.filter(event => !event.isAllDay) || [];

                // Calculate time groups for timed events only
                const timeGroups = groupEventsByTimePeriod(timedEvents);
                
                // Get the count of timed events to determine if we need to show a "more" button
                const timedEventsCount = timedEvents?.length || 0;
                const maxTimedEventsToShow = 8; // Limit the number of timed events to display
                const hasMoreTimedEvents = timedEventsCount > maxTimedEventsToShow;
                
                // Only show a subset of timed events if there are too many
                const visibleTimedEvents = hasMoreTimedEvents 
                  ? timedEvents?.slice(0, maxTimedEventsToShow - 1) 
                  : timedEvents;

                return (
                  <div
                    key={`day-${dayIndex}`}
                    className="col-span-1 border-default-200 z-20 relative transition duration-300 cursor-pointer border-r border-b text-center text-sm text-muted-foreground overflow-hidden"
                    onClick={() => {
                      handleAddEventWeek(dayIndex, detailedHour as string);
                    }}
                  >
                    <AnimatePresence initial={false}>
                        {visibleTimedEvents?.map((event, eventIndex) => {
                        // For better spacing, consider if this event is part of a time group
                        let eventsInSamePeriod = 1;
                        let periodIndex = 0;
                        
                          // Find which time group this event belongs to
                          for (let i = 0; i < timeGroups.length; i++) {
                            const groupIndex = timeGroups[i].findIndex(e => e.id === event.id);
                            if (groupIndex !== -1) {
                              eventsInSamePeriod = timeGroups[i].length;
                              periodIndex = groupIndex;
                              break;
                            }
                          }
                          
                          // Customize styling parameters for events in the same time period
                          const { height, left, maxWidth, minWidth, top, zIndex } =
                            handlers.handleEventStyling(
                              event, 
                              timedEvents, // Use timedEvents instead of dayEvents
                              {
                                eventsInSamePeriod,
                                periodIndex,
                                adjustForPeriod: true
                              }
                            );

                        return (
                          <motion.div
                            key={event.id}
                            style={{
                              minHeight: height,
                              height,
                              top: top,
                              left: left,
                              maxWidth: maxWidth,
                              minWidth: minWidth,
                              padding: '0 2px',
                              boxSizing: 'border-box',
                            }}
                            className="flex transition-all duration-1000 flex-grow flex-col z-50 absolute"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.2 }}
                          >
                            <EventStyled
                              event={{
                                ...event,
                                CustomEventComponent,
                                minmized: true,
                              }}
                              CustomEventModal={CustomEventModal}
                            />
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                    
                    {/* Show "more timed events" button if there are too many */}
                    {hasMoreTimedEvents && (
                      <motion.div
                        key={`more-events-${dayIndex}`}
                        style={{
                          bottom: '10px',
                          right: '10px',
                          position: 'absolute',
                        }}
                        className="z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Badge 
                          variant="secondary"
                          className="cursor-pointer hover:bg-accent"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Show a modal with all events for this day
                            setOpen(
                              <CustomModal title={`Events for ${daysOfWeek[dayIndex].toDateString()}`}>
                                <div className="space-y-2 p-2 max-h-[80vh] overflow-y-auto">
                                  {/* All-day events section */}
                                  {allDayEvents.length > 0 && (
                                    <div className="mb-4">
                                      <h4 className="font-semibold text-sm mb-2 text-blue-600">All-day Events</h4>
                                      {allDayEvents.map((event) => (
                                        <EventStyled
                                          key={event.id}
                                          event={{
                                            ...event,
                                            CustomEventComponent,
                                            minmized: false,
                                          }}
                                          CustomEventModal={CustomEventModal}
                                        />
                                      ))}
                                    </div>
                                    )}
                                    
                                    {/* Timed events section */}
                                    {timedEvents.length > 0 && (
                                      <div>
                                        <h4 className="font-semibold text-sm mb-2">Timed Events</h4>
                                        {timedEvents.map((event) => (
                                          <EventStyled
                                            key={event.id}
                                            event={{
                                              ...event,
                                              CustomEventComponent,
                                              minmized: false,
                                            }}
                                            CustomEventModal={CustomEventModal}
                                          />
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </CustomModal>
                              );
                            }}
                          >
                            +{timedEventsCount - (maxTimedEventsToShow - 1)} more
                          </Badge>
                        </motion.div>
                      )}
                    
                    
                    {/* Render hour slots */}
                    {Array.from({ length: 24 }, (_, hourIndex) => (
                      <div
                        key={`day-${dayIndex}-hour-${hourIndex}`}
                        className="col-span-1 border-default-200 h-[64px] relative transition duration-300 cursor-pointer border-r border-b text-center text-sm text-muted-foreground"
                      >
                        <div className="absolute bg-accent z-40 flex items-center justify-center text-xs opacity-0 transition duration-250 hover:opacity-100 w-full h-full">
                          Add Event
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
