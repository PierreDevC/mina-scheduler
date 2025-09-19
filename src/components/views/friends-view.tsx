"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Video,
  X,
  Calendar,
  Clock,
  XCircle
} from "lucide-react";

const friends = [
  {
    id: 1,
    name: "Pierre-Sylvestre Cypré",
    role: "Full Stack Developer",
    company: "Coffee Only",
    email: "pierre@gmail.com",
    phone: "514-123-4567",
    location: "Montréal, QC",
    avatar: "/api/placeholder/40/40",
    status: "online",
    favorite: true,
    department: "Development",
  },
  {
    id: 2,
    name: "William Descoteaux",
    role: "Senior Backend Developer",
    company: "Coffee Only",
    email: "william@gmail.com",
    phone: "514-123-4567",
    location: "Montreal, QC",
    avatar: "/api/placeholder/40/40",
    status: "online",
    favorite: true,
    department: "Development",
  },
  {
    id: 3,
    name: "Xavier Giguère",
    role: "Senior Backend Developer",
    company: "Coffee Only",
    email: "xavier@gmail.com",
    phone: "514-123-4567",
    location: "Montreal, QC",
    avatar: "/api/placeholder/40/40",
    status: "away",
    favorite: true,
    department: "Development",
  },
  {
    id: 4,
    name: "Alexandre Emond",
    role: "Full-Stack Developer",
    company: "Coffee Only",
    email: "alexandre@gmail.com",
    phone: "514-123-4567",
    location: "Montreal, QC",
    avatar: "/api/placeholder/40/40",
    status: "online",
    favorite: true,
    department: "Development",
  },
];

const departments = [
  { name: "Development", count: 4, color: "bg-blue-500" },
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
      return "Online";
    case "away":
      return "Away";
    case "offline":
      return "Offline";
    default:
      return "Unknown";
  }
};

// Profile Modal Component
const ProfileModal = ({ friend, isOpen, onClose }: { friend: any, isOpen: boolean, onClose: () => void }) => {
  if (!friend) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-7">
        <DialogHeader className="mb-4">
          <DialogTitle className="sr-only">Friend Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header with Avatar and Basic Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 rounded-xl">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={friend.avatar} />
                <AvatarFallback className="text-2xl font-semibold">
                  {friend.name.split(' ').map((n: string) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className={`absolute -bottom-2 -right-2 w-6 h-6 ${getStatusColor(friend.status)} rounded-full border-3 border-white dark:border-slate-800`}></div>
            </div>
            
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {friend.name}
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-1">
                {friend.role}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                {getStatusText(friend.status)}
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {friend.department}
                </Badge>
                {friend.favorite && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    Favorite
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Building className="w-5 h-5 mr-2" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Building className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Company</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{friend.company}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Email</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300 break-all">{friend.email}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Phone</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{friend.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Location</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{friend.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button variant="outline" size="sm" className="flex items-center justify-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Message
              </Button>
              <Button variant="outline" size="sm" className="flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Button>
              <Button variant="outline" size="sm" className="flex items-center justify-center gap-2">
                <Video className="w-4 h-4" />
                Call
              </Button>
              <Button variant="outline" size="sm" className="flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" />
                Schedule
              </Button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Currently {getStatusText(friend.status).toLowerCase()}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Last updated 5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Joined the Development team
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">2 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default function FriendsView() {
  const [selectedFriend, setSelectedFriend] = useState<any>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleViewProfile = (friend: any) => {
    setSelectedFriend(friend);
    setIsProfileModalOpen(true);
  };

  const closeProfileModal = () => {
    setIsProfileModalOpen(false);
    setSelectedFriend(null);
  };

  // Filter friends based on search query
  const filteredFriends = friends.filter(friend => {
    const searchTerm = searchQuery.toLowerCase().trim();
    if (!searchTerm) return true;
    
    return (
      friend.name.toLowerCase().includes(searchTerm) ||
      friend.role.toLowerCase().includes(searchTerm) ||
      friend.company.toLowerCase().includes(searchTerm) ||
      friend.email.toLowerCase().includes(searchTerm) ||
      friend.location.toLowerCase().includes(searchTerm) ||
      friend.department.toLowerCase().includes(searchTerm)
    );
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
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
          Friends
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
          Manage your professional network and collaborators
        </p>
      </motion.div>

      {/* Actions and search */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search for a friend..."
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
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </motion.div>

      {/* Mobile Quick Actions - shown above friends list on mobile only */}
      <motion.div variants={itemVariants} className="mb-8 lg:hidden">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button className="w-full justify-start" size="lg">
              <Plus className="mr-3 h-4 w-4" />
              Add Friend
            </Button>
            <Button className="w-full justify-start" variant="outline" size="lg">
              <Users className="mr-3 h-4 w-4" />
              Import Friends
            </Button>
            <Button className="w-full justify-start" variant="outline" size="lg">
              <Mail className="mr-3 h-4 w-4" />
              Send Invitation
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Liste des friends */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              All friends ({filteredFriends.length})
            </h2>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Star className="h-4 w-4 mr-2" />
                Favorites ({filteredFriends.filter(c => c.favorite).length})
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredFriends.length === 0 ? (
              <div className="col-span-1 md:col-span-2 text-center py-12">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <Search className="h-16 w-16 text-gray-300 dark:text-gray-600" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      No friends found
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
              filteredFriends.map((friend, index) => (
              <motion.div
                key={friend.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={friend.avatar} />
                        <AvatarFallback>
                          {friend.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(friend.status)} rounded-full border-2 border-white dark:border-slate-800`}></div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {friend.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {friend.role}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {getStatusText(friend.status)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {friend.favorite && (
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    )}
                    <Badge variant="outline" className="text-xs">
                      {friend.department}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <Building className="h-4 w-4" />
                    <span className="text-sm">{friend.company}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm truncate">{friend.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">{friend.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{friend.location}</span>
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
                  <Button variant="outline" size="sm" onClick={() => handleViewProfile(friend)}>
                    View Profile
                  </Button>
                </div>
              </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
          {/* Quick Actions - Desktop only */}
          <div className="hidden lg:block bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Button className="w-full justify-start" size="lg">
                <Plus className="mr-3 h-4 w-4" />
                Add Friend
              </Button>
              <Button className="w-full justify-start" variant="outline" size="lg">
                <Users className="mr-3 h-4 w-4" />
                Import Friends
              </Button>
              <Button className="w-full justify-start" variant="outline" size="lg">
                <Mail className="mr-3 h-4 w-4" />
                Send Invitation
              </Button>
            </div>
          </div>

          {/* Favorites */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Favorites
            </h3>
            <div className="space-y-4">
              {friends.filter(c => c.favorite).map((friend, index) => (
                <motion.div
                  key={friend.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <div className="relative">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={friend.avatar} />
                      <AvatarFallback className="text-xs">
                        {friend.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(friend.status)} rounded-full border-2 border-white dark:border-slate-800`}></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {friend.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {friend.role}
                    </p>
                  </div>
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                </motion.div>
              ))}
            </div>
          </div>

        </motion.div>
      </div>

      {/* Profile Modal */}
      <ProfileModal 
        friend={selectedFriend}
        isOpen={isProfileModalOpen}
        onClose={closeProfileModal}
      />
    </motion.div>
  );
} 