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
  Mail
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Person } from "@/types/index";
import { mockFriends } from "@/data/mockFriends";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup?: (groupData: GroupFormData) => void;
}

interface GroupFormData {
  name: string;
  description: string;
  members: Person[];
  createdDate: string;
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function CreateGroupModal({
  isOpen,
  onClose,
  onCreateGroup,
}: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<Person[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [filteredFriends, setFilteredFriends] = useState<Person[]>(mockFriends);

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

    if (!groupName.trim()) return;

    const groupData: GroupFormData = {
      name: groupName.trim(),
      description: groupDescription.trim(),
      members: selectedMembers,
      createdDate: new Date().toISOString().split('T')[0],
    };

    if (onCreateGroup) {
      onCreateGroup(groupData);
    }

    // Reset form
    setGroupName("");
    setGroupDescription("");
    setSelectedMembers([]);
    setSearchValue("");
    onClose();
  };

  const handleClose = () => {
    // Reset form when closing
    setGroupName("");
    setGroupDescription("");
    setSelectedMembers([]);
    setSearchValue("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            Create New Group
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

            <div className="grid gap-2">
              <Label>Creation Date</Label>
              <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
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
              <Label>Selected Members ({selectedMembers.length})</Label>
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
            <Label>Add Members</Label>

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
                                  Added
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
                Start typing to search for friends to add to the group
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
                {selectedMembers.length} member{selectedMembers.length !== 1 ? 's' : ''} will be added to "{groupName || 'this group'}"
              </p>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              * Required fields
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
                <Users className="h-4 w-4" />
                Create Group
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}