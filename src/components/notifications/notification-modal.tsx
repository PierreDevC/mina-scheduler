"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  MoreHorizontal
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

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewAll?: () => void;
  className?: string;
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "friend_request",
    title: "New Friend Request",
    message: "John Doe wants to connect with you",
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
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
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
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
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: true,
    actionable: false,
    avatar: "/api/placeholder/40/40",
    sender: "Alex Chen"
  },
  {
    id: "4",
    type: "reminder",
    title: "Upcoming Event",
    message: "Daily Standup starts in 15 minutes",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    read: true,
    actionable: false
  },
  {
    id: "5",
    type: "system",
    title: "System Update",
    message: "New features are now available! Check out the latest updates.",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    read: true,
    actionable: false
  }
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "friend_request":
      return <UserPlus className="h-4 w-4 text-blue-600" />;
    case "event_invite":
      return <Calendar className="h-4 w-4 text-green-600" />;
    case "message":
      return <MessageCircle className="h-4 w-4 text-purple-600" />;
    case "reminder":
      return <Clock className="h-4 w-4 text-orange-600" />;
    case "system":
      return <Settings className="h-4 w-4 text-gray-600" />;
    default:
      return <Bell className="h-4 w-4 text-gray-600" />;
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

export default function NotificationModal({ isOpen, onClose, onViewAll, className }: NotificationModalProps) {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev =>
      prev.filter(notif => notif.id !== notificationId)
    );
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    // Handle specific notification actions here
    console.log("Notification clicked:", notification);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={modalRef}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "absolute top-12 right-0 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50",
            className
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {unreadCount}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  Mark all read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No notifications yet
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={cn(
                      "p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer relative",
                      !notification.read && "bg-blue-50/50 dark:bg-blue-900/10"
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Avatar or Icon */}
                      <div className="flex-shrink-0">
                        {notification.avatar ? (
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={notification.avatar} />
                            <AvatarFallback className="text-xs">
                              {notification.sender?.split(' ').map(n => n[0]).join('') || '?'}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                            {getNotificationIcon(notification.type)}
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className={cn(
                              "text-sm font-medium text-gray-900 dark:text-white",
                              !notification.read && "font-semibold"
                            )}>
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                              {getTimeAgo(notification.timestamp)}
                            </p>
                          </div>

                          {/* Unread indicator */}
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-1 flex-shrink-0"></div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        {notification.actionable && !notification.read && (
                          <div className="flex items-center gap-2 mt-3">
                            {notification.type === "friend_request" && (
                              <>
                                <Button size="sm" className="text-xs px-3">
                                  Accept
                                </Button>
                                <Button size="sm" variant="outline" className="text-xs px-3">
                                  Decline
                                </Button>
                              </>
                            )}
                            {notification.type === "event_invite" && (
                              <>
                                <Button size="sm" className="text-xs px-3">
                                  Accept
                                </Button>
                                <Button size="sm" variant="outline" className="text-xs px-3">
                                  Maybe
                                </Button>
                                <Button size="sm" variant="outline" className="text-xs px-3">
                                  Decline
                                </Button>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Delete Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="ghost"
                className="w-full text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                onClick={() => {
                  onViewAll?.();
                  onClose();
                }}
              >
                View all notifications
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}