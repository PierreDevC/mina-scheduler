"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, UserPlus, X, Clock, Users, AlertCircle, CheckCircle, MinusCircle, UsersRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { Person, Group } from "@/types/index";
import { mockFriends } from "@/data/mockFriends";
import { mockGroups, getAllMembersFromGroups } from "@/data/mockGroups";
import { 
  checkMultiplePeopleAvailability, 
  getAvailabilitySummary,
  suggestBestTimes,
  AvailabilityStatus,
  EventTimeSlot
} from "@/utils/availabilityChecker";

interface PeopleSelectorWithAvailabilityProps {
  selectedPeople: Person[];
  onPeopleChange: (people: Person[]) => void;
  selectedGroups?: Group[];
  onGroupsChange?: (groups: Group[]) => void;
  eventStartDate?: Date;
  eventEndDate?: Date;
  onDateChange?: (startDate: Date, endDate: Date) => void;
  className?: string;
}

export default function PeopleSelectorWithAvailability({
  selectedPeople,
  onPeopleChange,
  selectedGroups = [],
  onGroupsChange,
  eventStartDate,
  eventEndDate,
  onDateChange,
  className,
}: PeopleSelectorWithAvailabilityProps) {
  const [searchValue, setSearchValue] = useState("");
  const [filteredPeople, setFilteredPeople] = useState<Person[]>(mockFriends);
  const [filteredGroups, setFilteredGroups] = useState<Group[]>(mockGroups);
  const [showAvailabilityDetails, setShowAvailabilityDetails] = useState(false);
  const [isCalculatingSuggestions, setIsCalculatingSuggestions] = useState(false);


  // Get all people including those from groups (de-duplicated)
  const allPeople = useMemo(() => {
    const peopleMap = new Map<string, Person>();

    // Add individually selected people
    selectedPeople.forEach(person => {
      peopleMap.set(person.id, person);
    });

    // Add people from selected groups
    const groupMembers = getAllMembersFromGroups(selectedGroups);
    groupMembers.forEach(person => {
      peopleMap.set(person.id, person);
    });

    return Array.from(peopleMap.values());
  }, [selectedPeople, selectedGroups]);

  // Calculate availability when event times or selected people change
  const availabilityData = useMemo(() => {
    if (!eventStartDate || !eventEndDate || allPeople.length === 0 ||
        !(eventStartDate instanceof Date) || !(eventEndDate instanceof Date) ||
        isNaN(eventStartDate.getTime()) || isNaN(eventEndDate.getTime())) {
      return null;
    }

    const eventTime: EventTimeSlot = {
      startDate: eventStartDate,
      endDate: eventEndDate
    };

    try {
      const statuses = checkMultiplePeopleAvailability(allPeople, eventTime);
      const summary = getAvailabilitySummary(statuses);

      return {
        statuses,
        summary,
        eventTime
      };
    } catch (error) {
      console.warn("Error calculating availability:", error);
      return null;
    }
  }, [allPeople, eventStartDate, eventEndDate]);

  // Calculate availability for all people when browsing
  const allPeopleAvailability = useMemo(() => {
    if (!eventStartDate || !eventEndDate || 
        !(eventStartDate instanceof Date) || !(eventEndDate instanceof Date) ||
        isNaN(eventStartDate.getTime()) || isNaN(eventEndDate.getTime())) {
      return new Map<string, AvailabilityStatus>();
    }

    const eventTime: EventTimeSlot = {
      startDate: eventStartDate,
      endDate: eventEndDate
    };

    const availabilityMap = new Map<string, AvailabilityStatus>();
    
    try {
      filteredPeople.forEach(person => {
        const statuses = checkMultiplePeopleAvailability([person], eventTime);
        if (statuses.length > 0) {
          availabilityMap.set(person.id, statuses[0]);
        }
      });
    } catch (error) {
      console.warn("Error calculating people availability:", error);
    }

    return availabilityMap;
  }, [filteredPeople, eventStartDate, eventEndDate]);

  // Time suggestions with debouncing and loading state
  const timeSuggestions = useMemo(() => {
    if (!eventStartDate || allPeople.length === 0 ||
        !(eventStartDate instanceof Date) || isNaN(eventStartDate.getTime())) {
      setIsCalculatingSuggestions(false);
      return [];
    }

    setIsCalculatingSuggestions(true);

    // Simulate calculation time (small delay for UX feedback)
    const timer = setTimeout(() => {
      setIsCalculatingSuggestions(false);
    }, 300);

    try {
      const suggestions = suggestBestTimes(allPeople, eventStartDate, 60);
      return suggestions;
    } catch (error) {
      console.warn("Error calculating time suggestions:", error);
      setIsCalculatingSuggestions(false);
      return [];
    } finally {
      // The timer cleanup happens in useEffect
    }
  }, [allPeople, eventStartDate]);

  // Clean up calculation state
  useEffect(() => {
    return () => {
      setIsCalculatingSuggestions(false);
    };
  }, []);

  // Filter people and groups based on search
  useEffect(() => {
    let filteredP = mockFriends;
    let filteredG = mockGroups;

    // Filter by search term
    if (searchValue) {
      const lowercaseSearch = searchValue.toLowerCase();
      filteredP = filteredP.filter(
        person =>
          person.name.toLowerCase().includes(lowercaseSearch) ||
          person.email.toLowerCase().includes(lowercaseSearch)
      );
      filteredG = filteredG.filter(
        group =>
          group.name.toLowerCase().includes(lowercaseSearch) ||
          group.description.toLowerCase().includes(lowercaseSearch)
      );
    }

    setFilteredPeople(filteredP);
    setFilteredGroups(filteredG);
  }, [searchValue]);

  const handlePersonSelect = (person: Person) => {
    const isSelected = selectedPeople.some(p => p.id === person.id);
    
    if (isSelected) {
      // Remove person
      onPeopleChange(selectedPeople.filter(p => p.id !== person.id));
    } else {
      // Add person
      onPeopleChange([...selectedPeople, person]);
    }
  };

  const handlePersonRemove = (personId: string) => {
    onPeopleChange(selectedPeople.filter(p => p.id !== personId));
  };

  const handleGroupSelect = (group: Group) => {
    if (!onGroupsChange) return;

    const isSelected = selectedGroups.some(g => g.id === group.id);

    if (isSelected) {
      // Remove group
      onGroupsChange(selectedGroups.filter(g => g.id !== group.id));
    } else {
      // Add group
      onGroupsChange([...selectedGroups, group]);
    }
  };

  const handleGroupRemove = (groupId: string) => {
    if (!onGroupsChange) return;
    onGroupsChange(selectedGroups.filter(g => g.id !== groupId));
  };

  const isPersonSelected = (personId: string) => {
    return selectedPeople.some(p => p.id === personId);
  };

  const isGroupSelected = (groupId: string) => {
    return selectedGroups.some(g => g.id === groupId);
  };

  const getAvailabilityIcon = (status: string) => {
    switch (status) {
      case "available":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "partial":
        return <MinusCircle className="h-4 w-4 text-yellow-600" />;
      case "busy":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case "available":
        return "text-green-600 bg-green-50 border-green-200";
      case "partial":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "busy":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  return (
    <TooltipProvider>
      <div className={cn("grid gap-4", className)}>
        <Label>Invite People and/or Groups</Label>

        {/* Search Friends - Always at top */}
        <div className="space-y-3">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search friends by name or email..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full pl-10"
            />
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          

          {/* Search Results */}
          {searchValue && (
            <div className="max-h-64 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
              {filteredPeople.length === 0 && filteredGroups.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No friends or groups found matching "{searchValue}"
                </div>
              ) : (
                <div className="p-2">
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-400 px-2 py-1 mb-2">
                    {filteredPeople.length} friend{filteredPeople.length !== 1 ? 's' : ''} and {filteredGroups.length} group{filteredGroups.length !== 1 ? 's' : ''} found
                  </div>

                  {/* Groups Results */}
                  {filteredGroups.length > 0 && (
                    <div className="mb-3">
                      <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 px-2 py-1 mb-1">
                        Groups
                      </div>
                      {filteredGroups.map((group) => {
                        const isSelected = isGroupSelected(group.id);
                        return (
                          <div
                            key={group.id}
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                              "hover:bg-gray-50 dark:hover:bg-gray-800",
                              isSelected && "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700"
                            )}
                            onClick={() => handleGroupSelect(group)}
                          >
                            <div className={`w-10 h-10 ${group.color} rounded-lg flex items-center justify-center`}>
                              <UsersRound className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-sm flex items-center gap-2">
                                {group.name}
                                {isSelected && (
                                  <Badge variant="secondary" className="text-xs">
                                    Added
                                  </Badge>
                                )}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {group.members.length} member{group.members.length !== 1 ? 's' : ''}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {group.description}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {isSelected ? (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleGroupRemove(group.id);
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

                  {/* People Results */}
                  {filteredPeople.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold text-green-600 dark:text-green-400 px-2 py-1 mb-1">
                        Friends
                      </div>
                  {filteredPeople.map((person) => {
                    const availability = allPeopleAvailability.get(person.id);
                    const isSelected = isPersonSelected(person.id);
                    return (
                      <div
                        key={person.id}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                          "hover:bg-gray-50 dark:hover:bg-gray-800",
                          isSelected && "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700"
                        )}
                        onClick={() => handlePersonSelect(person)}
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
                            {availability && getAvailabilityIcon(availability.status)}
                            {isSelected && (
                              <Badge variant="secondary" className="text-xs">
                                Added
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {person.email}
                          </div>
                          {person.department && (
                            <div className="text-xs text-blue-600 dark:text-blue-400">
                              {person.department}
                            </div>
                          )}
                          {availability && availability.conflictReason && (
                            <div className="text-xs text-yellow-600 mt-1">
                              ⚠️ {availability.conflictReason}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {isSelected ? (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePersonRemove(person.id);
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
            </div>
          )}
          
          {!searchValue && (
            <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              Start typing to search for friends or groups to invite
            </div>
          )}
        </div>

        {/* Selected People and Groups Display with Availability */}
        {(selectedPeople.length > 0 || selectedGroups.length > 0) && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              {/* Selected Groups */}
              {selectedGroups.map((group) => (
                <Badge
                  key={group.id}
                  variant="secondary"
                  className="flex items-center gap-2 py-1 px-2 bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700"
                >
                  <UsersRound className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium">{group.name}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    ({group.members.length})
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-gray-200 dark:hover:bg-gray-600"
                    onClick={() => handleGroupRemove(group.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}

              {/* Selected People */}
              {selectedPeople.map((person) => {
                const availability = availabilityData?.statuses.find(s => s.person.id === person.id);
                return (
                  <Tooltip key={person.id}>
                    <TooltipTrigger asChild>
                      <Badge
                        variant="secondary"
                        className={cn(
                          "flex items-center gap-2 py-1 px-2",
                          availability && getAvailabilityColor(availability.status)
                        )}
                      >
                        <Avatar className="w-5 h-5">
                          <AvatarImage src={person.avatar} alt={person.name} />
                          <AvatarFallback className="text-xs">
                            {person.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{person.name}</span>
                        {availability && getAvailabilityIcon(availability.status)}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-gray-200 dark:hover:bg-gray-600"
                          onClick={() => handlePersonRemove(person.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      {availability ? (
                        <div>
                          <p className="font-medium">{person.name}</p>
                          <p className="text-sm">
                            {availability.status === "available" && "✅ Available"}
                            {availability.status === "partial" && "⚠️ Partially available"}
                            {availability.status === "busy" && "❌ Busy"}
                            {availability.status === "unknown" && "❓ Availability unknown"}
                          </p>
                          {availability.conflictReason && (
                            <p className="text-xs text-gray-600">{availability.conflictReason}</p>
                          )}
                        </div>
                      ) : (
                        <p>Select a time to see availability</p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>

            {/* Availability Summary */}
            {availabilityData && (
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Availability Summary
                  </h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAvailabilityDetails(!showAvailabilityDetails)}
                  >
                    {showAvailabilityDetails ? "Hide" : "Show details"}
                  </Button>
                </div>

                <div className="grid grid-cols-4 gap-4 text-center">
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-green-600">
                      {availabilityData.summary.available}
                    </span>
                    <span className="text-xs text-gray-600">Available</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-yellow-600">
                      {availabilityData.summary.partial}
                    </span>
                    <span className="text-xs text-gray-600">Partial</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-red-600">
                      {availabilityData.summary.busy}
                    </span>
                    <span className="text-xs text-gray-600">Busy</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-gray-600">
                      {availabilityData.summary.total}
                    </span>
                    <span className="text-xs text-gray-600">Total</span>
                  </div>
                </div>

                {/* Time Suggestions */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  ✨ Suggested time slots
                  </h5>

                  {isCalculatingSuggestions ? (
                    <div className="flex items-center justify-center py-6">
                      <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          Finding optimal times...
                        </span>
                      </div>
                    </div>
                  ) : timeSuggestions.length > 0 ? (
                    <div className="space-y-2">
                      {timeSuggestions.map((suggestion, index) => {
                        // Calculate current event duration in milliseconds
                        const currentDuration = eventEndDate && eventStartDate
                          ? eventEndDate.getTime() - eventStartDate.getTime()
                          : 60 * 60 * 1000; // Default to 1 hour if not set

                        return (
                        <div
                          key={index}
                          onClick={() => {
                            if (onDateChange) {
                              const endDate = new Date(suggestion.date.getTime() + currentDuration);
                              onDateChange(suggestion.date, endDate);
                            }
                          }}
                          className={cn(
                            "p-3 rounded-lg border cursor-pointer transition-all",
                            "hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20",
                            "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm text-gray-900 dark:text-white">
                                  {suggestion.dayName}, {suggestion.date.toLocaleDateString()} at {suggestion.time}
                                </span>
                                {suggestion.daysFromTarget === 0 && (
                                  <Badge variant="default" className="text-xs bg-blue-600">
                                    Today
                                  </Badge>
                                )}
                                {suggestion.daysFromTarget === 1 && (
                                  <Badge variant="secondary" className="text-xs">
                                    Tomorrow
                                  </Badge>
                                )}
                                {suggestion.daysFromTarget > 1 && (
                                  <Badge variant="outline" className="text-xs">
                                    {suggestion.daysFromTarget} days away
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                                <span className="flex items-center gap-1">
                                  <CheckCircle className="h-3 w-3 text-green-600" />
                                  {suggestion.availableCount}/{allPeople.length} available
                                </span>
                                {suggestion.availableCount === allPeople.length && (
                                  <span className="text-green-600 font-medium">✨ Perfect match!</span>
                                )}
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                            >
                              Select
                            </Button>
                          </div>
                        </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-xs text-gray-500 dark:text-gray-400 py-4 text-center">
                      No alternative time slots found in the next 7 days
                    </div>
                  )}
                </div>

                {/* Detailed availability */}
                {showAvailabilityDetails && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 space-y-2">
                    {availabilityData.statuses.map((status) => (
                      <div key={status.person.id} className="flex items-center justify-between text-sm">
                        <span>{status.person.name}</span>
                        <div className="flex items-center gap-2">
                          {getAvailabilityIcon(status.status)}
                          <span className={cn("text-xs", getAvailabilityColor(status.status).split(" ")[0])}>
                            {status.status === "available" && "Available"}
                            {status.status === "partial" && "Partial"}
                            {status.status === "busy" && "Busy"}
                            {status.status === "unknown" && "Unknown"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Summary */}
        {(selectedPeople.length > 0 || selectedGroups.length > 0) && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {selectedPeople.length > 0 && `${selectedPeople.length} person(s)`}
            {selectedPeople.length > 0 && selectedGroups.length > 0 && " and "}
            {selectedGroups.length > 0 && `${selectedGroups.length} group(s)`}
            {" "}will be invited to this event
            {availabilityData && (
              <span className="ml-2">
                • {availabilityData.summary.total} total attendee{availabilityData.summary.total !== 1 ? 's' : ''}
                • {availabilityData.summary.available} available
                {availabilityData.summary.busy > 0 && (
                  <span className="text-red-600"> • {availabilityData.summary.busy} busy</span>
                )}
              </span>
            )}
          </p>
        )}
      </div>
    </TooltipProvider>
  );
}
