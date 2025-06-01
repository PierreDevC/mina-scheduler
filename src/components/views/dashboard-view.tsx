"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Calendar, Users, BarChart3, Settings } from "lucide-react";

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

export default function DashboardView() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <motion.div variants={itemVariants} className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white">
          Dashboard CalendApp
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-base md:text-lg">
          Gérez votre planning et analysez votre productivité
        </p>
      </motion.div>

      {/* Quick Actions Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.name}
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-white dark:bg-slate-800 p-3 md:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col md:flex-row md:items-center">
              <div className="flex-shrink-0 mb-2 md:mb-0">
                <action.icon className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
              </div>
              <div className="md:ml-4">
                <p className="text-xs md:text-sm font-medium text-gray-600 dark:text-gray-400">
                  {action.name}
                </p>
                <p className="text-lg md:text-2xl font-semibold text-gray-900 dark:text-white">
                  {action.value}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        {/* Prochains événements */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4 md:mb-6">
            Prochains événements
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
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
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
            Voir tous les événements
          </Button>
        </motion.div>

        {/* Actions rapides */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white mb-4 md:mb-6">
            Actions rapides
          </h3>
          <div className="space-y-3">
            <Button className="w-full justify-start" size="lg">
              <Calendar className="mr-3 h-4 w-4" />
              Nouveau événement
            </Button>
            <Button className="w-full justify-start" variant="outline" size="lg">
              <Users className="mr-3 h-4 w-4" />
              Inviter des membres
            </Button>
            <Button className="w-full justify-start" variant="outline" size="lg">
              <BarChart3 className="mr-3 h-4 w-4" />
              Voir les statistiques
            </Button>
            <Button className="w-full justify-start" variant="outline" size="lg">
              <Settings className="mr-3 h-4 w-4" />
              Paramètres
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
} 