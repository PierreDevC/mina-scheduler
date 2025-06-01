"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  MapPin, 
  Building,
  Star,
  MessageCircle,
  Video
} from "lucide-react";

const contacts = [
  {
    id: 1,
    name: "Alice Martin",
    role: "Développeuse Senior",
    company: "TechCorp",
    email: "alice.martin@techcorp.com",
    phone: "+33 1 23 45 67 89",
    location: "Paris, France",
    avatar: "/api/placeholder/40/40",
    status: "online",
    favorite: true,
    department: "Développement",
  },
  {
    id: 2,
    name: "Bob Dupont",
    role: "Designer UI/UX",
    company: "DesignStudio",
    email: "bob.dupont@designstudio.com",
    phone: "+33 1 98 76 54 32",
    location: "Lyon, France",
    avatar: "/api/placeholder/40/40",
    status: "away",
    favorite: false,
    department: "Design",
  },
  {
    id: 3,
    name: "Claire Rousseau",
    role: "Chef de Projet",
    company: "ProjectCo",
    email: "claire.rousseau@projectco.com",
    phone: "+33 1 11 22 33 44",
    location: "Marseille, France",
    avatar: "/api/placeholder/40/40",
    status: "online",
    favorite: true,
    department: "Gestion",
  },
  {
    id: 4,
    name: "David Chen",
    role: "Développeur Full-Stack",
    company: "WebSolutions",
    email: "david.chen@websolutions.com",
    phone: "+33 1 55 66 77 88",
    location: "Toulouse, France",
    avatar: "/api/placeholder/40/40",
    status: "offline",
    favorite: false,
    department: "Développement",
  },
  {
    id: 5,
    name: "Emma Wilson",
    role: "Marketing Manager",
    company: "MarketingPro",
    email: "emma.wilson@marketingpro.com",
    phone: "+33 1 99 88 77 66",
    location: "Nice, France",
    avatar: "/api/placeholder/40/40",
    status: "online",
    favorite: true,
    department: "Marketing",
  },
  {
    id: 6,
    name: "François Dubois",
    role: "Analyste Business",
    company: "BusinessAnalytics",
    email: "francois.dubois@businessanalytics.com",
    phone: "+33 1 44 55 66 77",
    location: "Bordeaux, France",
    avatar: "/api/placeholder/40/40",
    status: "away",
    favorite: false,
    department: "Analyse",
  },
];

const departments = [
  { name: "Développement", count: 2, color: "bg-blue-500" },
  { name: "Design", count: 1, color: "bg-purple-500" },
  { name: "Gestion", count: 1, color: "bg-green-500" },
  { name: "Marketing", count: 1, color: "bg-orange-500" },
  { name: "Analyse", count: 1, color: "bg-red-500" },
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

const getStatusColor = (status: string) => {
  switch (status) {
    case "online":
      return "bg-green-500";
    case "away":
      return "bg-yellow-500";
    case "offline":
      return "bg-gray-400";
    default:
      return "bg-gray-400";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "online":
      return "En ligne";
    case "away":
      return "Absent";
    case "offline":
      return "Hors ligne";
    default:
      return "Inconnu";
  }
};

export default function ContactsView() {
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
          Contacts
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
          Gérez votre réseau professionnel et vos collaborateurs
        </p>
      </motion.div>

      {/* Actions et recherche */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher un contact..."
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Ajouter contact
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtrer
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Liste des contacts */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Tous les contacts ({contacts.length})
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Star className="h-4 w-4 mr-2" />
                Favoris ({contacts.filter(c => c.favorite).length})
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contacts.map((contact, index) => (
              <motion.div
                key={contact.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={contact.avatar} />
                        <AvatarFallback>
                          {contact.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(contact.status)} rounded-full border-2 border-white dark:border-slate-800`}></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {contact.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {contact.role}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {getStatusText(contact.status)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {contact.favorite && (
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    )}
                    <Badge variant="outline" className="text-xs">
                      {contact.department}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <Building className="h-4 w-4" />
                    <span className="text-sm">{contact.company}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm truncate">{contact.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">{contact.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{contact.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm">
                      <MessageCircle className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="outline" size="sm">
                    Voir profil
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
          {/* Départements */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Départements
            </h3>
            <div className="space-y-4">
              {departments.map((dept, index) => (
                <motion.div
                  key={dept.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 ${dept.color} rounded-full`}></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {dept.name}
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {dept.count}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contacts favoris */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Favoris
            </h3>
            <div className="space-y-4">
              {contacts.filter(c => c.favorite).map((contact, index) => (
                <motion.div
                  key={contact.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <div className="relative">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={contact.avatar} />
                      <AvatarFallback className="text-xs">
                        {contact.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(contact.status)} rounded-full border-2 border-white dark:border-slate-800`}></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {contact.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {contact.role}
                    </p>
                  </div>
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Statistiques */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Statistiques
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Total contacts</span>
                <span className="font-semibold text-gray-900 dark:text-white">{contacts.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">En ligne</span>
                <span className="font-semibold text-green-600">
                  {contacts.filter(c => c.status === "online").length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Favoris</span>
                <span className="font-semibold text-yellow-600">
                  {contacts.filter(c => c.favorite).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Départements</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {departments.length}
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
                Ajouter contact
              </Button>
              <Button className="w-full justify-start" variant="outline" size="lg">
                <Users className="mr-3 h-4 w-4" />
                Importer contacts
              </Button>
              <Button className="w-full justify-start" variant="outline" size="lg">
                <Mail className="mr-3 h-4 w-4" />
                Envoyer invitation
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
} 