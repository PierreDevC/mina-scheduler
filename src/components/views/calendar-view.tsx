"use client";

import { motion } from "framer-motion";
import { SchedulerProvider } from "@/providers/schedular-provider";
import SchedulerWrapper from "@/components/schedule/_components/view/schedular-view-filteration";
import { useEvents } from "@/providers/events-context";

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

export default function CalendarView() {
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8"
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Calendar
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
          Plan and organize your events
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div className="p-6">
          <SchedulerProvider
            weekStartsOn="monday"
            initialState={events}
            onAddEvent={addEvent}
            onUpdateEvent={updateEvent}
            onDeleteEvent={deleteEvent}
          >
            <SchedulerWrapper
              stopDayEventSummary={true}
              views={{
                views: ["month", "week", "day"],
                mobileViews: ["month", "week", "day"],
              }}
              classNames={{
                tabs: {
                  panel: "p-0",
                },
              }}
            />
          </SchedulerProvider>
        </div>
      </motion.div>
    </motion.div>
  );
} 