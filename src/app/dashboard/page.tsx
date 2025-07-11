"use client";

import { Button } from "@/components/ui/button";
import { Calendar, Users, BarChart3, Settings } from "lucide-react";
import { SchedulerProvider } from "@/providers/schedular-provider";
import SchedulerWrapper from "@/components/schedule/_components/view/schedular-view-filteration";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Tableau de Bord
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Bienvenue, {user.firstName || user.emailAddresses[0]?.emailAddress} !
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Événements à venir
              </h3>
              <p className="text-3xl font-bold text-blue-600">12</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Groupes actifs
              </h3>
              <p className="text-3xl font-bold text-green-600">5</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Contacts
              </h3>
              <p className="text-3xl font-bold text-purple-600">28</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Actions rapides
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/app">
                <Button className="w-full h-16 text-left justify-start bg-blue-600 hover:bg-blue-700">
                  <div>
                    <div className="font-semibold">Calendrier</div>
                    <div className="text-sm opacity-90">Voir et gérer vos événements</div>
                  </div>
                </Button>
              </Link>
              <Button variant="outline" className="w-full h-16 text-left justify-start">
                <div>
                  <div className="font-semibold">Créer un événement</div>
                  <div className="text-sm opacity-70">Ajouter un nouvel événement</div>
                </div>
              </Button>
              <Button variant="outline" className="w-full h-16 text-left justify-start">
                <div>
                  <div className="font-semibold">Gérer les groupes</div>
                  <div className="text-sm opacity-70">Organiser vos équipes</div>
                </div>
              </Button>
              <Link href="/user-profile">
                <Button variant="outline" className="w-full h-16 text-left justify-start">
                  <div>
                    <div className="font-semibold">Profil</div>
                    <div className="text-sm opacity-70">Modifier vos informations</div>
                  </div>
                </Button>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Activité récente
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Événement "Réunion équipe" créé
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Il y a 2 heures</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Groupe "Développement" rejoint
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Hier</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    3 nouveaux contacts ajoutés
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Il y a 3 jours</p>
                </div>
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