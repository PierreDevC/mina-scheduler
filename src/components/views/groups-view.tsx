"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Users, Plus, Settings, UserPlus, Crown, Shield, Eye, EyeIcon } from "lucide-react";
import { mockFriends } from "@/data/mockFriends";
import { Person } from "@/types/index";

// Single Coffee Only group
const coffeeOnlyGroup = {
  id: 1,
  name: "Coffee Only",
  description: "Development team focused on building amazing applications",
  members: mockFriends.length,
  color: "bg-amber-500",
  role: "admin",
  avatar: "/api/placeholder/40/40",
  createdDate: "2024-01-01",
  lastActivity: "2024-01-15",
};

// Add online status and roles to friends data for group members
const groupMembers: (Person & { online: boolean; role: string; joinDate: string })[] = mockFriends.map((friend, index) => ({
  ...friend,
  online: index % 3 !== 0, // Simulate some members being online
  role: index === 0 ? "Team Lead" : index === 1 ? "Senior Developer" : "Developer",
  joinDate: `2024-01-${String(index + 1).padStart(2, '0')}`,
}));

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
  const [selectedGroup, setSelectedGroup] = useState(coffeeOnlyGroup);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  const handleViewDetails = () => {
    setIsGroupModalOpen(true);
  };

  const handleViewAllMembers = () => {
    setIsGroupModalOpen(true);
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
          Groups & Teams
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
          Manage your teams and collaborate effectively
        </p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-8">
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Group
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Invite Members
        </Button>
        <Button variant="outline" className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Group Settings
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Group Details */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            My Groups
          </h2>
          <div className="grid grid-cols-1 gap-6">
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -2 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedGroup(coffeeOnlyGroup)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 ${coffeeOnlyGroup.color} rounded-lg flex items-center justify-center`}>
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {coffeeOnlyGroup.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {coffeeOnlyGroup.members} members
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getRoleIcon(coffeeOnlyGroup.role)}
                  {getRoleBadge(coffeeOnlyGroup.role)}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                {coffeeOnlyGroup.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {groupMembers.slice(0, 4).map((member, i) => (
                    <Avatar key={member.id} className="w-8 h-8 border-2 border-white dark:border-slate-800">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="text-xs">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {coffeeOnlyGroup.members > 4 && (
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">
                      <span className="text-xs text-gray-600 dark:text-gray-300">
                        +{coffeeOnlyGroup.members - 4}
                      </span>
                    </div>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={handleViewDetails}>
                  <Eye className="h-4 w-4 mr-2" />
                  View details
                </Button>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Sidebar - Active Members */}
        <motion.div variants={itemVariants} className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Active Members - {selectedGroup.name}
            </h3>
            <div className="space-y-4">
              {groupMembers.map((member, index) => (
                <motion.div
                  key={member.id}
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
            <Button className="w-full mt-6" variant="outline" onClick={handleViewAllMembers}>
              <EyeIcon className="h-4 w-4 mr-2" />
              View all members
            </Button>
          </div>

          {/* Statistics */}
          <motion.div
            variants={itemVariants}
            className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mt-6"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Statistics
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Total groups</span>
                <span className="font-semibold text-gray-900 dark:text-white">1</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Total members</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {groupMembers.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Active members</span>
                <span className="font-semibold text-green-600">
                  {groupMembers.filter(m => m.online).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">Team leads</span>
                <span className="font-semibold text-blue-600">
                  {groupMembers.filter(m => m.role === "Team Lead").length}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Group Details Modal */}
      <Dialog open={isGroupModalOpen} onOpenChange={setIsGroupModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {selectedGroup.name} - Group Details
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Group Info */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl">
              <div className="flex items-center space-x-4 mb-4">
                <div className={`w-16 h-16 ${selectedGroup.color} rounded-lg flex items-center justify-center`}>
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selectedGroup.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {selectedGroup.description}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Members:</span>
                  <p className="font-semibold">{selectedGroup.members}</p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Created:</span>
                  <p className="font-semibold">{selectedGroup.createdDate}</p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Last Activity:</span>
                  <p className="font-semibold">{selectedGroup.lastActivity}</p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Your Role:</span>
                  <p className="font-semibold capitalize">{selectedGroup.role}</p>
                </div>
              </div>
            </div>

            {/* Members List */}
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                All Members ({groupMembers.length})
              </h4>
              <div className="space-y-3">
                {groupMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      {member.online && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900 dark:text-white">
                        {member.name}
                      </h5>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {member.email}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {member.role} • Joined {member.joinDate}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={member.online ? "default" : "secondary"}>
                        {member.online ? "Online" : "Offline"}
                      </Badge>
                      <Badge variant="outline">
                        {member.department}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
} 