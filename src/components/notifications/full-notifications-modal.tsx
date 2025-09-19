"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Bell,
  X,
  Check,
  UserPlus,
  Calendar,
  MessageCircle,
  Settings,
  Clock,
  Trash2,
  CheckCheck,
  Filter
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "friend_request" | "event_invite" | "message" | "system" | "reminder";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionable?: boolean;
  avatar?: string;
  sender?: string;
}

interface FullNotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteNotification: (notificationId: string) => void;
}

type TabType = "all" | "unread" | "read";

// Extended mock notifications for the full modal
const extendedMockNotifications: Notification[] = [
  {
    id: "1",
    type: "friend_request",
    title: "New Friend Request",
    message: "John Doe wants to connect with you",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    read: false,
    actionable: true,
    avatar: "/api/placeholder/40/40",
    sender: "John Doe"
  },
  {
    id: "2",
    type: "event_invite",
    title: "Event Invitation",
    message: "You're invited to 'Team Meeting' on Jan 25, 2024",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: false,
    actionable: true,
    avatar: "/api/placeholder/40/40",
    sender: "Sarah Wilson"
  },
  {
    id: "3",
    type: "message",
    title: "New Message",
    message: "Hey! Are you available for a quick call?",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: true,
    actionable: false,
    avatar: "/api/placeholder/40/40",
    sender: "Alex Chen"
  },
  {
    id: "4",
    type: "friend_request",
    title: "New Friend Request",
    message: "Maria Garcia wants to connect with you",
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    read: false,
    actionable: true,
    avatar: "/api/placeholder/40/40",
    sender: "Maria Garcia"
  },
  {
    id: "5",
    type: "reminder",
    title: "Upcoming Event",
    message: "Daily Standup starts in 15 minutes",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    read: true,
    actionable: false
  },
  {
    id: "6",
    type: "system",
    title: "System Update",
    message: "New features are now available! Check out the latest updates.",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    read: true,
    actionable: false
  },
  {
    id: "7",
    type: "event_invite",
    title: "Event Invitation",
    message: "You're invited to 'Product Review' on Jan 28, 2024",
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    read: false,
    actionable: true,
    avatar: "/api/placeholder/40/40",
    sender: "Mike Johnson"
  },
  {
    id: "8",
    type: "message",
    title: "New Message",
    message: "Thanks for the quick response! Let's schedule that meeting.",
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
    read: true,
    actionable: false,
    avatar: "/api/placeholder/40/40",
    sender: "Emma Davis"
  },
  {
    id: "9",
    type: "reminder",
    title: "Event Reminder",
    message: "Don't forget about tomorrow's client presentation at 2 PM",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
    actionable: false
  },
  {
    id: "10",
    type: "friend_request",
    title: "New Friend Request",
    message: "David Wilson wants to connect with you",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    read: true,
    actionable: false,
    avatar: "/api/placeholder/40/40",
    sender: "David Wilson"
  }
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "friend_request":
      return <UserPlus className="h-5 w-5 text-blue-600" />;
    case "event_invite":
      return <Calendar className="h-5 w-5 text-green-600" />;
    case "message":
      return <MessageCircle className="h-5 w-5 text-purple-600" />;
    case "reminder":
      return <Clock className="h-5 w-5 text-orange-600" />;
    case "system":
      return <Settings className="h-5 w-5 text-gray-600" />;
    default:
      return <Bell className="h-5 w-5 text-gray-600" />;
  }
};

const getTimeAgo = (timestamp: Date) => {
  const now = new Date();
  const diffInMs = now.getTime() - timestamp.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return `${diffInDays}d ago`;
};

const tabs = [
  { id: "unread" as TabType, label: "Unread", icon: Filter },
  { id: "read" as TabType, label: "Read", icon: CheckCheck },
  { id: "all" as TabType, label: "All", icon: Bell },
  
];

export default function FullNotificationsModal({
  isOpen,
  onClose,
  notifications = extendedMockNotifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification,
}: FullNotificationsModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("unread");
  const [localNotifications, setLocalNotifications] = useState<Notification[]>(notifications);

  // Update local notifications when props change
  useEffect(() => {
    setLocalNotifications(notifications);
  }, [notifications]);

  const handleMarkAsRead = (notificationId: string) => {
    setLocalNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    onMarkAsRead?.(notificationId);
  };

  const handleMarkAllAsRead = () => {
    setLocalNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
    onMarkAllAsRead?.();
  };

  const handleDeleteNotification = (notificationId: string) => {
    setLocalNotifications(prev =>
      prev.filter(notif => notif.id !== notificationId)
    );
    onDeleteNotification?.(notificationId);
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
    console.log("Notification clicked:", notification);
  };

  // Filter notifications based on active tab
  const filteredNotifications = localNotifications.filter(notification => {
    switch (activeTab) {
      case "unread":
        return !notification.read;
      case "read":
        return notification.read;
      case "all":
      default:
        return true;
    }
  });

  const unreadCount = localNotifications.filter(n => !n.read).length;
  const readCount = localNotifications.filter(n => n.read).length;

  const getTabCount = (tabId: TabType) => {
    switch (tabId) {
      case "all":
        return localNotifications.length;
      case "unread":
        return unreadCount;
      case "read":
        return readCount;
      default:
        return 0;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold flex items-center gap-3">
              <Bell className="h-6 w-6 text-blue-600" />
              All Notifications
            </DialogTitle>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Mark all as read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Tabs */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const count = getTabCount(tab.id);
              const isActive = activeTab === tab.id;

              return (
                <Button
                  key={tab.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 relative",
                    isActive
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs",
                      isActive
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                    )}
                  >
                    {count}
                  </Badge>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Notifications Content */}
        <div className="flex-1 overflow-hidden">
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center">
              <div className="flex flex-col items-center justify-center space-y-4">
                <Bell className="h-16 w-16 text-gray-300 dark:text-gray-600" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No {activeTab === "all" ? "" : activeTab} notifications
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {activeTab === "unread" && "All caught up! No unread notifications."}
                    {activeTab === "read" && "No read notifications to show."}
                    {activeTab === "all" && "You're all caught up! No notifications yet."}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-h-[60vh] overflow-y-auto">
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {filteredNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className={cn(
                      "p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer relative group",
                      !notification.read && "bg-blue-50/50 dark:bg-blue-900/10"
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar or Icon */}
                      <div className="flex-shrink-0">
                        {notification.avatar ? (
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={notification.avatar} />
                            <AvatarFallback className="text-sm">
                              {notification.sender?.split(' ').map(n => n[0]).join('') || '?'}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                            {getNotificationIcon(notification.type)}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className={cn(
                                "text-base font-medium text-gray-900 dark:text-white",
                                !notification.read && "font-semibold"
                              )}>
                                {notification.title}
                              </p>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              {getTimeAgo(notification.timestamp)}
                            </p>
                          </div>

                          {/* Delete Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNotification(notification.id);
                            }}
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Action Buttons */}
                        {notification.actionable && !notification.read && (
                          <div className="flex items-center gap-2 mt-4">
                            {notification.type === "friend_request" && (
                              <>
                                <Button size="sm" className="text-sm px-4">
                                  Accept
                                </Button>
                                <Button size="sm" variant="outline" className="text-sm px-4">
                                  Decline
                                </Button>
                              </>
                            )}
                            {notification.type === "event_invite" && (
                              <>
                                <Button size="sm" className="text-sm px-4">
                                  Accept
                                </Button>
                                <Button size="sm" variant="outline" className="text-sm px-4">
                                  Maybe
                                </Button>
                                <Button size="sm" variant="outline" className="text-sm px-4">
                                  Decline
                                </Button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}