"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Users,
  X,
  UserPlus,
  Calendar,
  Building,
  Mail,
  Trash2,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Person } from "@/types/index";
import { mockFriends } from "@/data/mockFriends";

interface Group {
  id: number;
  name: string;
  description: string;
  members: Person[];
  color: string;
  role: string;
  avatar: string;
  createdDate: string;
  lastActivity: string;
}

interface EditGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: Group | null;
  onUpdateGroup?: (groupData: Group) => void;
  onDeleteGroup?: (groupId: number) => void;
}

interface GroupFormData {
  name: string;
  description: string;
  members: Person[];
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function EditGroupModal({
  isOpen,
  onClose,
  group,
  onUpdateGroup,
  onDeleteGroup,
}: EditGroupModalProps) {
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<Person[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [filteredFriends, setFilteredFriends] = useState<Person[]>(mockFriends);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Initialize form with group data
  useEffect(() => {
    if (group && isOpen) {
      setGroupName(group.name);
      setGroupDescription(group.description);
      setSelectedMembers(group.members || []);
      setSearchValue("");
    }
  }, [group, isOpen]);

  // Filter friends based on search
  useEffect(() => {
    let filtered = mockFriends;

    if (searchValue) {
      const lowercaseSearch = searchValue.toLowerCase();
      filtered = filtered.filter(
        person =>
          person.name.toLowerCase().includes(lowercaseSearch) ||
          person.email.toLowerCase().includes(lowercaseSearch) ||
          person.department.toLowerCase().includes(lowercaseSearch)
      );
    }

    setFilteredFriends(filtered);
  }, [searchValue]);

  const handleMemberSelect = (person: Person) => {
    const isSelected = selectedMembers.some(m => m.id === person.id);

    if (isSelected) {
      setSelectedMembers(selectedMembers.filter(m => m.id !== person.id));
    } else {
      setSelectedMembers([...selectedMembers, person]);
    }
  };

  const handleMemberRemove = (personId: string) => {
    setSelectedMembers(selectedMembers.filter(m => m.id !== personId));
  };

  const isMemberSelected = (personId: string) => {
    return selectedMembers.some(m => m.id === personId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!groupName.trim() || !group) return;

    const updatedGroup: Group = {
      ...group,
      name: groupName.trim(),
      description: groupDescription.trim(),
      members: selectedMembers,
      lastActivity: new Date().toISOString().split('T')[0],
    };

    if (onUpdateGroup) {
      onUpdateGroup(updatedGroup);
    }

    onClose();
  };

  const handleDelete = () => {
    if (group && onDeleteGroup) {
      onDeleteGroup(group.id);
    }
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleClose = () => {
    setShowDeleteConfirm(false);
    onClose();
  };

  if (!group) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6 text-blue-600" />
            Edit Group: {group.name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Group Basic Info */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <div className="grid gap-2">
              <Label htmlFor="groupName">Group Name *</Label>
              <Input
                id="groupName"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter group name"
                className={cn(!groupName.trim() && "border-red-300")}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="groupDescription">Description</Label>
              <Textarea
                id="groupDescription"
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                placeholder="Enter group description (optional)"
                className="resize-none min-h-[80px] max-h-[120px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Creation Date</Label>
                <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {new Date(group.createdDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Last Activity</Label>
                <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {new Date(group.lastActivity).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Selected Members Display */}
          {selectedMembers.length > 0 && (
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3"
            >
              <Label>Group Members ({selectedMembers.length})</Label>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex flex-wrap gap-2">
                  {selectedMembers.map((member) => (
                    <Badge
                      key={member.id}
                      variant="secondary"
                      className="flex items-center gap-2 py-1 px-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600"
                    >
                      <Avatar className="w-5 h-5">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="text-xs">
                          {member.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{member.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-gray-200 dark:hover:bg-gray-600"
                        onClick={() => handleMemberRemove(member.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Search and Add Members */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <Label>Manage Members</Label>

            <div className="relative">
              <Input
                type="text"
                placeholder="Search friends by name, email, or department..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full pl-10"
              />
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>

            {/* Search Results */}
            {searchValue && (
              <div className="max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                {filteredFriends.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    No friends found matching "{searchValue}"
                  </div>
                ) : (
                  <div className="p-2">
                    <div className="text-xs font-medium text-gray-600 dark:text-gray-400 px-2 py-1 mb-2">
                      {filteredFriends.length} friend{filteredFriends.length !== 1 ? 's' : ''} found
                    </div>
                    {filteredFriends.map((person) => {
                      const isSelected = isMemberSelected(person.id);
                      return (
                        <div
                          key={person.id}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                            "hover:bg-gray-50 dark:hover:bg-gray-700",
                            isSelected && "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700"
                          )}
                          onClick={() => handleMemberSelect(person)}
                        >
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={person.avatar} alt={person.name} />
                            <AvatarFallback>
                              {person.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm flex items-center gap-2">
                              {person.name}
                              {isSelected && (
                                <Badge variant="secondary" className="text-xs">
                                  Member
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                              <Mail className="w-3 h-3" />
                              <span className="truncate">{person.email}</span>
                            </div>
                            {person.department && (
                              <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                                <Building className="w-3 h-3" />
                                {person.department}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center">
                            {isSelected ? (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMemberRemove(person.id);
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                <UserPlus className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {!searchValue && (
              <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-6 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                Start typing to search for friends to add or remove from the group
              </div>
            )}
          </motion.div>

          {/* Summary */}
          {selectedMembers.length > 0 && (
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700"
            >
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <Users className="inline w-4 h-4 mr-1" />
                {selectedMembers.length} member{selectedMembers.length !== 1 ? 's' : ''} in "{groupName || group.name}"
              </p>
            </motion.div>
          )}

          {/* Delete Confirmation */}
          {showDeleteConfirm && (
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-700"
            >
              <div className="flex items-center gap-3 mb-3">
                <Trash2 className="h-5 w-5 text-red-600" />
                <span className="font-medium text-red-800 dark:text-red-200">
                  Delete Group Confirmation
                </span>
              </div>
              <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                Are you sure you want to delete "{group.name}"? This action cannot be undone and all group data will be permanently lost.
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                >
                  Yes, Delete Group
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Group
              </Button>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" type="button" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!groupName.trim()}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Update Group
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}