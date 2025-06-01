"use client";

import { Button } from "@/components/ui/button";
import { Calendar, Users, BarChart3, Settings } from "lucide-react";
import { SchedulerProvider } from "@/providers/schedular-provider";
import SchedulerWrapper from "@/components/schedule/_components/view/schedular-view-filteration";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard CalendApp
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Gérez votre planning et analysez votre productivité
          </p>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
              {quickActions.map((action, index) => (
                <div
                  key={action.name}
                  className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center lg:flex-col lg:text-center">
                    <div className="flex-shrink-0 lg:mb-2">
                      <action.icon className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
                    </div>
                    <div className="ml-3 lg:ml-0">
                      <p className="text-xs lg:text-sm font-medium text-gray-600 dark:text-gray-400">
                        {action.name}
                      </p>
                      <p className="text-lg lg:text-xl font-semibold text-gray-900 dark:text-white">
                        {action.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Prochains événements */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Prochains événements
              </h3>
              <div className="space-y-3">
                {upcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {event.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {event.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4" variant="outline" size="sm">
                Voir tous les événements
              </Button>
            </div>

            {/* Actions rapides */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Actions rapides
              </h3>
              <div className="space-y-2">
                <Button className="w-full" size="sm">
                  Nouveau événement
                </Button>
                <Button className="w-full" variant="outline" size="sm">
                  Inviter des membres
                </Button>
                <Button className="w-full" variant="outline" size="sm">
                  Exporter calendrier
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Calendrier */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Calendrier Collaboratif
              </h2>
              <div className="w-full">
                <SchedulerProvider weekStartsOn="monday">
                  <SchedulerWrapper
                    stopDayEventSummary={true}
                    views={{
                      views: ["month", "week", "day"],
                      mobileViews: ["month", "day"],
                    }}
                    classNames={{
                      tabs: {
                        panel: "p-0",
                      },
                    }}
                  />
                </SchedulerProvider>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const quickActions = [
  {
    name: "Événements aujourd'hui",
    value: "5",
    icon: Calendar,
  },
  {
    name: "Membres équipe",
    value: "12",
    icon: Users,
  },
  {
    name: "Taux productivité",
    value: "87%",
    icon: BarChart3,
  },
  {
    name: "Paramètres",
    value: "Actif",
    icon: Settings,
  },
];

const upcomingEvents = [
  { title: "Réunion équipe", time: "10:00" },
  { title: "Présentation client", time: "14:30" },
  { title: "Formation", time: "16:00" },
  { title: "Call téléphone", time: "17:15" },
]; 