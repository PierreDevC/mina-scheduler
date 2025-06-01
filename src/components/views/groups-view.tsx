"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Settings, UserPlus, Crown, Shield } from "lucide-react";

const groups = [
  {
    id: 1,
    name: "Équipe Développement",
    description: "Équipe principale de développement",
    members: 8,
    color: "bg-blue-500",
    role: "admin",
    avatar: "/api/placeholder/40/40",
  },
  {
    id: 2,
    name: "Marketing",
    description: "Équipe marketing et communication",
    members: 5,
    color: "bg-green-500",
    role: "member",
    avatar: "/api/placeholder/40/40",
  },
  {
    id: 3,
    name: "Design UI/UX",
    description: "Équipe design et expérience utilisateur",
    members: 3,
    color: "bg-purple-500",
    role: "moderator",
    avatar: "/api/placeholder/40/40",
  },
  {
    id: 4,
    name: "Gestion Projet",
    description: "Coordination et gestion des projets",
    members: 4,
    color: "bg-orange-500",
    role: "member",
    avatar: "/api/placeholder/40/40",
  },
];

const recentMembers = [
  { name: "Alice Martin", role: "Développeuse", avatar: "/api/placeholder/32/32", online: true },
  { name: "Bob Dupont", role: "Designer", avatar: "/api/placeholder/32/32", online: false },
  { name: "Claire Rousseau", role: "Chef de projet", avatar: "/api/placeholder/32/32", online: true },
  { name: "David Chen", role: "Développeur", avatar: "/api/placeholder/32/32", online: true },
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

const getRoleIcon = (role: string) => {
  switch (role) {
    case "admin":
      return <Crown className="h-4 w-4 text-yellow-500" />;
    case "moderator":
      return <Shield className="h-4 w-4 text-blue-500" />;
    default:
      return <Users className="h-4 w-4 text-gray-500" />;
  }
};

const getRoleBadge = (role: string) => {
  switch (role) {
    case "admin":
      return <Badge variant="default" className="bg-yellow-500">Admin</Badge>;
    case "moderator":
      return <Badge variant="secondary">Modérateur</Badge>;
    default:
      return <Badge variant="outline">Membre</Badge>;
  }
};

export default function GroupsView() {
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
          Groupes & Équipes
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
          Gérez vos équipes et collaborez efficacement
        </p>
      </motion.div>

      {/* Actions rapides */}
      <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-8">
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Créer un groupe
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Inviter des membres
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Paramètres des groupes
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Liste des groupes */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Mes Groupes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {groups.map((group, index) => (
              <motion.div
                key={group.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 ${group.color} rounded-lg flex items-center justify-center`}>
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {group.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {group.members} membres
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getRoleIcon(group.role)}
                    {getRoleBadge(group.role)}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  {group.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {[...Array(Math.min(group.members, 4))].map((_, i) => (
                      <Avatar key={i} className="w-8 h-8 border-2 border-white dark:border-slate-800">
                        <AvatarImage src={`/api/placeholder/32/32?${i}`} />
                        <AvatarFallback className="text-xs">U{i + 1}</AvatarFallback>
                      </Avatar>
                    ))}
                    {group.members > 4 && (
                      <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">
                        <span className="text-xs text-gray-600 dark:text-gray-300">
                          +{group.members - 4}
                        </span>
                      </div>
                    )}
                  </div>
                  <Button variant="ghost" size="sm">
                    Voir détails
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Sidebar - Membres récents */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Membres Actifs
            </h3>
            <div className="space-y-4">
              {recentMembers.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    {member.online && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {member.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {member.role}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            <Button className="w-full mt-6" variant="outline">
              Voir tous les membres
            </Button>
          </div>

          {/* Statistiques */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mt-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Statistiques
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Total groupes</span>
                <span className="font-semibold text-gray-900 dark:text-white">{groups.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Total membres</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {groups.reduce((acc, group) => acc + group.members, 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Membres actifs</span>
                <span className="font-semibold text-green-600">
                  {recentMembers.filter(m => m.online).length}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
} 