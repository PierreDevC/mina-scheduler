"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Users, BarChart3, Settings, Clock } from "lucide-react";
import { SchedulerProvider } from "@/providers/schedular-provider";
import SchedulerWrapper from "@/components/schedule/_components/view/schedular-view-filteration";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import TestUserForm from "@/components/test-user-form";
import AvailabilityModal from "@/components/availability/availability-modal";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);

  // Show loading while user data is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!user) {
    window.location.href = "/auth/login";
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Dashboard
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Welcome, {user.firstName || user.emailAddresses[0]?.emailAddress}!
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Upcoming Events
              </h3>
              <p className="text-3xl font-bold text-blue-600">12</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Active Groups
              </h3>
              <p className="text-3xl font-bold text-green-600">5</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Friends
              </h3>
              <p className="text-3xl font-bold text-purple-600">28</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Link href="/app">
                <Button className="w-full h-16 text-left justify-start bg-blue-600 hover:bg-blue-700">
                  <div>
                    <div className="font-semibold">Calendar</div>
                    <div className="text-sm opacity-90">View and manage your events</div>
                  </div>
                </Button>
              </Link>
              <Button variant="outline" className="w-full h-16 text-left justify-start">
                <div>
                  <div className="font-semibold">Create Event</div>
                  <div className="text-sm opacity-70">Add a new event</div>
                </div>
              </Button>
              <Button 
                variant="outline" 
                className="w-full h-16 text-left justify-start hover:bg-green-50 hover:border-green-200 dark:hover:bg-green-900/20"
                onClick={() => setIsAvailabilityModalOpen(true)}
              >
                <div>
                  <div className="font-semibold flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Availability
                  </div>
                  <div className="text-sm opacity-70">Set my available time slots</div>
                </div>
              </Button>
              <Button variant="outline" className="w-full h-16 text-left justify-start">
                <div>
                  <div className="font-semibold">Manage Groups</div>
                  <div className="text-sm opacity-70">Organize your teams</div>
                </div>
              </Button>
              <Link href="/user-profile">
                <Button variant="outline" className="w-full h-16 text-left justify-start">
                  <div>
                    <div className="font-semibold">Profile</div>
                    <div className="text-sm opacity-70">Edit your information</div>
                  </div>
                </Button>
              </Link>
            </div>
          </div>

          {/* Test Backend Form */}
          <div className="mb-12">
            <TestUserForm />
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Recent Activity
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Event "Team Meeting" created
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Joined "Development" group
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Yesterday</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    3 new friends added
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Availability Modal */}
      <AvailabilityModal 
        open={isAvailabilityModalOpen}
        onOpenChange={setIsAvailabilityModalOpen}
      />
    </div>
  );
}

const quickActions = [
  {
    name: "Today's Events",
    value: "5",
    icon: Calendar,
  },
  {
    name: "Team Members",
    value: "12",
    icon: Users,
  },
  {
    name: "Productivity Rate",
    value: "87%",
    icon: BarChart3,
  },
  {
    name: "Settings",
    value: "Active",
    icon: Settings,
  },
];

const upcomingEvents = [
  { title: "Team Meeting", time: "10:00" },
  { title: "Client Presentation", time: "14:30" },
  { title: "Training", time: "16:00" },
  { title: "Phone Call", time: "17:15" },
]; 