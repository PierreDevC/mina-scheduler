"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, MapPin, Users, Plus, Filter, Search } from "lucide-react";

const events = [
  {
    id: 1,
    title: "Réunion équipe développement",
    description: "Point hebdomadaire sur l'avancement des projets",
    date: "2024-01-15",
    time: "10:00",
    duration: "1h30",
    location: "Salle de conférence A",
    attendees: 8,
    type: "meeting",
    priority: "high",
    organizer: "Alice Martin",
  },
  {
    id: 2,
    title: "Présentation client",
    description: "Démonstration de la nouvelle fonctionnalité",
    date: "2024-01-15",
    time: "14:30",
    duration: "2h",
    location: "Visioconférence",
    attendees: 5,
    type: "presentation",
    priority: "high",
    organizer: "Bob Dupont",
  },
  {
    id: 3,
    title: "Formation Next.js",
    description: "Session de formation sur les nouvelles fonctionnalités",
    date: "2024-01-16",
    time: "09:00",
    duration: "4h",
    location: "Salle de formation",
    attendees: 12,
    type: "training",
    priority: "medium",
    organizer: "Claire Rousseau",
  },
  {
    id: 4,
    title: "Brainstorming UX",
    description: "Séance créative pour améliorer l'expérience utilisateur",
    date: "2024-01-17",
    time: "15:00",
    duration: "2h",
    location: "Espace créatif",
    attendees: 6,
    type: "workshop",
    priority: "medium",
    organizer: "David Chen",
  },
];

const upcomingEvents = [
  { title: "Daily standup", time: "09:00", type: "meeting" },
  { title: "Code review", time: "11:00", type: "review" },
  { title: "Client call", time: "16:00", type: "call" },
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
    default:
      return "bg-gray-500";
  }
};

const getEventTypeBadge = (type: string) => {
  switch (type) {
    case "meeting":
      return <Badge className="bg-blue-100 text-blue-800">Réunion</Badge>;
    case "presentation":
      return <Badge className="bg-purple-100 text-purple-800">Présentation</Badge>;
    case "training":
      return <Badge className="bg-green-100 text-green-800">Formation</Badge>;
    case "workshop":
      return <Badge className="bg-orange-100 text-orange-800">Atelier</Badge>;
    default:
      return <Badge variant="secondary">Autre</Badge>;
  }
};

const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case "high":
      return <Badge variant="destructive">Haute</Badge>;
    case "medium":
      return <Badge variant="default">Moyenne</Badge>;
    case "low":
      return <Badge variant="secondary">Basse</Badge>;
    default:
      return <Badge variant="outline">Non définie</Badge>;
  }
};

export default function EventsView() {
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
          Événements
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
          Organisez et suivez tous vos événements
        </p>
      </motion.div>

      {/* Actions et filtres */}
      <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-8">
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouvel événement
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filtrer
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          Rechercher
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Liste des événements */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Événements à venir
          </h2>
          <div className="space-y-6">
            {events.map((event, index) => (
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
                      <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                        {event.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {getEventTypeBadge(event.type)}
                    {getPriorityBadge(event.priority)}
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
                      <span className="text-sm">{event.attendees} participants</span>
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
                      Organisé par {event.organizer}
                    </span>
                    <Button variant="ghost" size="sm">
                      Détails
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
          {/* Événements du jour */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Aujourd'hui
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
              Voir l'agenda complet
            </Button>
          </div>

          {/* Statistiques */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Statistiques
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Événements ce mois</span>
                <span className="font-semibold text-gray-900 dark:text-white">{events.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Participants total</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {events.reduce((acc, event) => acc + event.attendees, 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Événements haute priorité</span>
                <span className="font-semibold text-red-600">
                  {events.filter(e => e.priority === "high").length}
                </span>
              </div>
            </div>
          </div>

          {/* Actions rapides */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Actions rapides
            </h3>
            <div className="space-y-3">
              <Button className="w-full justify-start" size="lg">
                <Plus className="mr-3 h-4 w-4" />
                Créer un événement
              </Button>
              <Button className="w-full justify-start" variant="outline" size="lg">
                <Calendar className="mr-3 h-4 w-4" />
                Voir le calendrier
              </Button>
              <Button className="w-full justify-start" variant="outline" size="lg">
                <Users className="mr-3 h-4 w-4" />
                Inviter des participants
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
} 