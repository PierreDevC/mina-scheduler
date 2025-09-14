"use client";

import { useState, useContext, useMemo } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, MapPin, Users, Plus, Filter, Search, XCircle, CheckCircle, X, RotateCcw, History, AlertCircle } from "lucide-react";
import { useModal } from "@/providers/modal-context";
import AddEventModal from "@/components/schedule/_modals/add-event-modal";
import CustomModal from "@/components/ui/custom-modal";
import { useRouter } from "next/navigation";
import { useEvents } from "@/providers/events-context";

// Helper function to convert Event to events view format
const convertEventToEventsView = (event: any) => ({
  id: parseInt(event.id),
  title: event.title,
  description: event.description || "",
  date: event.startDate.toISOString().split('T')[0],
  time: event.startDate.toTimeString().slice(0, 5),
  duration: `${Math.round((event.endDate.getTime() - event.startDate.getTime()) / (1000 * 60))}min`,
  location: "Office", // Default location
  attendees: event.invitedPeople?.length || 1,
  type: getEventTypeFromVariant(event.variant),
  priority: getPriorityFromVariant(event.variant),
  organizer: event.invitedPeople?.[0]?.name || "Unknown",
  status: getStatusFromDate(event.startDate),
  isRecurring: false,
  recurringType: "none", // Default for non-recurring events
});

function getEventTypeFromVariant(variant?: string): string {
  switch (variant) {
    case "danger": return "workout";
    case "primary": return "presentation";
    case "warning": return "meeting";
    case "success": return "workshop";
    default: return "review";
  }
}

function getPriorityFromVariant(variant?: string): string {
  switch (variant) {
    case "danger": return "low";
    case "primary": return "medium";
    case "warning": return "high";
    case "success": return "medium";
    default: return "low";
  }
}

function getStatusFromDate(date: Date): string {
  const now = new Date();
  if (date < now) return "past";
  return "confirmed";
}

const upcomingEvents = [
  { title: "Daily Standup", time: "09:00", type: "meeting" },
  { title: "Code Review", time: "11:00", type: "review" },
  { title: "Client Call", time: "16:00", type: "call" },
];

// Filter types
type FilterType = "all" | "upcoming" | "unconfirmed" | "recurring" | "past" | "canceled";

const filterOptions = [
  { id: "all", label: "All Events", icon: Calendar, count: 0 },
  { id: "upcoming", label: "Upcoming", icon: CheckCircle, count: 0 },
  { id: "unconfirmed", label: "Unconfirmed", icon: AlertCircle, count: 0 },
  { id: "recurring", label: "Recurring", icon: RotateCcw, count: 0 },
  { id: "past", label: "Past", icon: History, count: 0 },
  { id: "canceled", label: "Canceled", icon: X, count: 0 },
];

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const getEventTypeColor = (type: string) => {
  switch (type) {
    case "meeting":
      return "bg-blue-500";
    case "presentation":
      return "bg-purple-500";
    case "training":
      return "bg-green-500";
    case "workshop":
      return "bg-orange-500";
    case "workout":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const getEventTypeBadge = (type: string) => {
  switch (type) {
    case "meeting":
      return <Badge className="bg-blue-100 text-blue-800">Meeting</Badge>;
    case "presentation":
      return <Badge className="bg-purple-100 text-purple-800">Presentation</Badge>;
    case "training":
      return <Badge className="bg-green-100 text-green-800">Training</Badge>;
    case "workshop":
      return <Badge className="bg-orange-100 text-orange-800">Workshop</Badge>;
    case "workout":
      return <Badge className="bg-red-100 text-red-800">Workout</Badge>;
    case "review":
      return <Badge className="bg-yellow-100 text-yellow-800">Review</Badge>;
    case "call":
      return <Badge className="bg-teal-100 text-teal-800">Call</Badge>;
    default:
      return <Badge variant="secondary">Other</Badge>;
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "high":
      return <Badge variant="destructive">High</Badge>;
    case "medium":
      return <Badge variant="default">Medium</Badge>;
    case "low":
      return <Badge variant="secondary">Low</Badge>;
    default:
      return <Badge variant="outline">Undefined</Badge>;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case "confirmed":
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Confirmed</Badge>;
    case "unconfirmed":
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Unconfirmed</Badge>;
    case "past":
      return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">Past</Badge>;
    case "canceled":
      return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Canceled</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

export default function EventsView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const { setOpen } = useModal();
  const router = useRouter();
  const { events: contextEvents } = useEvents();

  // Convert context events to events view format
  const events = useMemo(() => {
    return contextEvents.map(convertEventToEventsView);
  }, [contextEvents]);

  // Helper function to check if event is upcoming
  const isEventUpcoming = (event: any) => {
    const eventDate = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate >= today && event.status !== "canceled" && event.status !== "past";
  };

  // Helper function to check if event is past
  const isEventPast = (event: any) => {
    const eventDate = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return eventDate < today || event.status === "past";
  };

  // Calculate filter counts
  const getFilterCounts = () => {
    return {
      all: events.length,
      upcoming: events.filter(isEventUpcoming).length,
      unconfirmed: events.filter(e => e.status === "unconfirmed").length,
      recurring: events.filter(e => e.isRecurring).length,
      past: events.filter(isEventPast).length,
      canceled: events.filter(e => e.status === "canceled").length,
    };
  };

  const filterCounts = getFilterCounts();

  // Filter events based on search query and active filter
  const filteredEvents = events.filter(event => {
    // Apply search filter
    const searchTerm = searchQuery.toLowerCase().trim();
    const matchesSearch = !searchTerm || (
      event.title.toLowerCase().includes(searchTerm) ||
      event.description.toLowerCase().includes(searchTerm) ||
      event.location.toLowerCase().includes(searchTerm) ||
      event.organizer.toLowerCase().includes(searchTerm) ||
      event.type.toLowerCase().includes(searchTerm) ||
      event.priority.toLowerCase().includes(searchTerm)
    );

    // Apply category filter
    let matchesFilter = true;
    switch (activeFilter) {
      case "upcoming":
        matchesFilter = isEventUpcoming(event);
        break;
      case "unconfirmed":
        matchesFilter = event.status === "unconfirmed";
        break;
      case "recurring":
        matchesFilter = event.isRecurring;
        break;
      case "past":
        matchesFilter = isEventPast(event);
        break;
      case "canceled":
        matchesFilter = event.status === "canceled";
        break;
      case "all":
      default:
        matchesFilter = true;
        break;
    }

    return matchesSearch && matchesFilter;
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCreateEvent = () => {
    setOpen(
      <CustomModal title="Add Event">
        <AddEventModal />
      </CustomModal>
    );
  };

  const handleViewCalendar = () => {
    router.push("/dashboard?view=calendar");
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <motion.div variants={itemVariants} className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Events
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
          Organize and track all your events
        </p>
      </motion.div>

      {/* Actions and search */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search events..."
              className="pl-10 pr-10"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <XCircle className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button className="flex items-center gap-2" onClick={handleCreateEvent}>
            <Plus className="h-4 w-4" />
            New Event
          </Button>
        </div>
      </motion.div>

      {/* Filter buttons */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((filter) => {
            const Icon = filter.icon;
            const count = filterCounts[filter.id as FilterType];
            const isActive = activeFilter === filter.id;
            
            return (
              <Button
                key={filter.id}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(filter.id as FilterType)}
                className={`flex items-center gap-2 ${
                  isActive 
                    ? "bg-blue-600 hover:bg-blue-700 text-white" 
                    : "hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <Icon className="h-4 w-4" />
                {filter.label}
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${
                    isActive 
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" 
                      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                  }`}
                >
                  {count}
                </Badge>
              </Button>
            );
          })}
        </div>
      </motion.div>

      {/* Mobile Quick Actions - shown above events list on mobile only */}
      <motion.div variants={itemVariants} className="mb-8 lg:hidden">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button className="w-full justify-start" size="lg" onClick={handleCreateEvent}>
              <Plus className="mr-3 h-4 w-4" />
              Create Event
            </Button>
            <Button className="w-full justify-start" variant="outline" size="lg" onClick={handleViewCalendar}>
              <Calendar className="mr-3 h-4 w-4" />
              View Calendar
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Events list */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            {filterOptions.find(f => f.id === activeFilter)?.label} ({filteredEvents.length})
          </h2>
          <div className="space-y-6">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-12">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <Search className="h-16 w-16 text-gray-300 dark:text-gray-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No events found
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Try adjusting your search terms or{" "}
                      <button 
                        onClick={() => setSearchQuery("")}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                      >
                        clear your search
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                variants={itemVariants}
                whileHover={{ scale: 1.01, y: -2 }}
                className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 ${getEventTypeColor(event.type)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Calendar className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                          {event.title}
                        </h3>
                        {event.isRecurring && (
                          <Badge variant="outline" className="text-xs">
                            <RotateCcw className="h-3 w-3 mr-1" />
                            {event.recurringType}
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                        {event.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {getEventTypeBadge(event.type)}
                    {getPriorityBadge(event.priority)}
                    {getStatusBadge(event.status)}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{event.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{event.time} ({event.duration})</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{event.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">{event.attendees} attendees</span>
                    </div>
                    <div className="flex -space-x-2">
                      {[...Array(Math.min(event.attendees, 3))].map((_, i) => (
                        <Avatar key={i} className="w-6 h-6 border-2 border-white dark:border-slate-800">
                          <AvatarImage src={`/api/placeholder/24/24?${i}`} />
                          <AvatarFallback className="text-xs">U{i + 1}</AvatarFallback>
                        </Avatar>
                      ))}
                      {event.attendees > 3 && (
                        <div className="w-6 h-6 bg-gray-200 dark:bg-gray-600 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">
                          <span className="text-xs text-gray-600 dark:text-gray-300">
                            +{event.attendees - 3}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Organized by {event.organizer}
                    </span>
                    <Button variant="ghost" size="sm">
                      Details
                    </Button>
                  </div>
                </div>
              </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
          {/* Quick actions - Desktop only */}
          <div className="hidden lg:block bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Button className="w-full justify-start" size="lg" onClick={handleCreateEvent}>
                <Plus className="mr-3 h-4 w-4" />
                Create Event
              </Button>
              <Button className="w-full justify-start" variant="outline" size="lg" onClick={handleViewCalendar}>
                <Calendar className="mr-3 h-4 w-4" />
                View Calendar
              </Button>
            </div>
          </div>

          {/* Today's events */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Today
            </h3>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className={`w-3 h-3 ${getEventTypeColor(event.type)} rounded-full`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {event.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {event.time}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            <Button className="w-full mt-6" variant="outline">
              View Full Calendar
            </Button>
          </div>

          {/* Statistics */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Statistics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Events this month</span>
                <span className="font-semibold text-gray-900 dark:text-white">{events.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Total attendees</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {events.reduce((acc, event) => acc + event.attendees, 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">High priority events</span>
                <span className="font-semibold text-red-600">
                  {events.filter(e => e.priority === "high").length}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
} 