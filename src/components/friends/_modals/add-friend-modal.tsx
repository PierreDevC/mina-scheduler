"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  UserPlus,
  Search,
  Mail,
  Check,
  AlertCircle,
  Loader2,
  Send,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AddFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendInvite?: (email: string) => void;
}

interface SearchResult {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  status: "found" | "not_found" | "already_friend" | "pending";
  department?: string;
}

// Mock search function - in real app this would call your API
const mockSearchUser = async (email: string): Promise<SearchResult | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  // Mock different scenarios based on email
  if (email === "john.doe@coffee.com") {
    return {
      id: "1",
      email: email,
      name: "John Doe",
      avatar: "/api/placeholder/40/40",
      status: "found",
      department: "Marketing"
    };
  } else if (email === "existing@coffee.com") {
    return {
      id: "2",
      email: email,
      name: "Existing Friend",
      avatar: "/api/placeholder/40/40",
      status: "already_friend",
      department: "Development"
    };
  } else if (email === "pending@coffee.com") {
    return {
      id: "3",
      email: email,
      name: "Pending User",
      avatar: "/api/placeholder/40/40",
      status: "pending",
      department: "Design"
    };
  } else if (email.includes("@") && email.includes(".")) {
    // Valid email format but user not found
    return {
      id: "",
      email: email,
      status: "not_found"
    };
  }

  return null;
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function AddFriendModal({
  isOpen,
  onClose,
  onSendInvite,
}: AddFriendModalProps) {
  const [email, setEmail] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setEmail("");
      setSearchResult(null);
      setHasSearched(false);
      setInviteSent(false);
      setIsSearching(false);
    }
  }, [isOpen]);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSearch = async () => {
    if (!isValidEmail(email)) return;

    setIsSearching(true);
    setHasSearched(false);
    setSearchResult(null);
    setInviteSent(false);

    try {
      const result = await mockSearchUser(email.toLowerCase().trim());
      setSearchResult(result);
      setHasSearched(true);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResult(null);
      setHasSearched(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSendInvite = async () => {
    if (!searchResult) return;

    // Simulate sending invite
    setIsSearching(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (onSendInvite) {
        onSendInvite(searchResult.email);
      }

      setInviteSent(true);
      console.log("Invite sent to:", searchResult.email);
    } catch (error) {
      console.error("Error sending invite:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isSearching && isValidEmail(email)) {
      handleSearch();
    }
  };

  const handleClose = () => {
    setEmail("");
    setSearchResult(null);
    setHasSearched(false);
    setInviteSent(false);
    setIsSearching(false);
    onClose();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "found":
        return <UserPlus className="h-5 w-5 text-green-600" />;
      case "already_friend":
        return <Check className="h-5 w-5 text-blue-600" />;
      case "pending":
        return <Loader2 className="h-5 w-5 text-orange-600" />;
      case "not_found":
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
      default:
        return null;
    }
  };

  const getStatusMessage = (status: string, name?: string) => {
    switch (status) {
      case "found":
        return `${name || "User"} found! You can send them a friend request.`;
      case "already_friend":
        return `${name || "This user"} is already in your friends list.`;
      case "pending":
        return `Friend request to ${name || "this user"} is already pending.`;
      case "not_found":
        return "User not found. You can send them an invitation to join the platform.";
      default:
        return "";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "found":
        return "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700";
      case "already_friend":
        return "bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700";
      case "pending":
        return "bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-700";
      case "not_found":
        return "bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-600";
      default:
        return "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <UserPlus className="h-6 w-6 text-blue-600" />
            Add Friend
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Email Search */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10"
                  disabled={isSearching}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Search by email to find existing users or send an invitation
              </p>
            </div>

            <Button
              onClick={handleSearch}
              disabled={!isValidEmail(email) || isSearching}
              className="w-full flex items-center gap-2"
            >
              {isSearching ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              {isSearching ? "Searching..." : "Search User"}
            </Button>
          </motion.div>

          {/* Search Results */}
          {hasSearched && searchResult && (
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className={cn(
                "p-4 rounded-lg border",
                getStatusColor(searchResult.status)
              )}
            >
              <div className="flex items-start gap-3">
                {getStatusIcon(searchResult.status)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {searchResult.name && searchResult.avatar && (
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={searchResult.avatar} />
                        <AvatarFallback className="text-xs">
                          {searchResult.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      {searchResult.name && (
                        <p className="font-medium text-gray-900 dark:text-white">
                          {searchResult.name}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {searchResult.email}
                      </p>
                      {searchResult.department && (
                        <Badge variant="outline" className="text-xs mt-1">
                          {searchResult.department}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {getStatusMessage(searchResult.status, searchResult.name)}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              {searchResult.status === "found" && !inviteSent && (
                <div className="mt-4">
                  <Button
                    onClick={handleSendInvite}
                    disabled={isSearching}
                    className="w-full flex items-center gap-2"
                  >
                    {isSearching ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <UserPlus className="h-4 w-4" />
                    )}
                    {isSearching ? "Sending..." : "Send Friend Request"}
                  </Button>
                </div>
              )}

              {searchResult.status === "not_found" && !inviteSent && (
                <div className="mt-4">
                  <Button
                    onClick={handleSendInvite}
                    disabled={isSearching}
                    variant="outline"
                    className="w-full flex items-center gap-2"
                  >
                    {isSearching ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    {isSearching ? "Sending..." : "Send Platform Invitation"}
                  </Button>
                </div>
              )}

              {inviteSent && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-800 dark:text-green-200">
                      {searchResult.status === "found" ? "Friend request sent!" : "Invitation sent!"}
                    </span>
                  </div>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                    {searchResult.status === "found"
                      ? "They will receive a notification about your friend request."
                      : "They will receive an email invitation to join the platform."
                    }
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}

          {hasSearched && !searchResult && (
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="p-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-700"
            >
              <div className="flex items-center gap-2">
                <X className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-800 dark:text-red-200">
                  Invalid email address
                </span>
              </div>
              <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                Please enter a valid email address and try again.
              </p>
            </motion.div>
          )}

          {/* Tips */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
              💡 Tips for adding friends:
            </h4>
            <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Search for colleagues by their work email</li>
              <li>• If they're not on the platform, send them an invitation</li>
              <li>• Check your pending requests in the friends list</li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}