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
import { Check, UserPlus, X, Clock, Users, AlertCircle, CheckCircle, MinusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Person } from "@/types/index";
import { mockFriends } from "@/data/mockFriends";
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
  eventStartDate?: Date;
  eventEndDate?: Date;
  className?: string;
}

export default function PeopleSelectorWithAvailability({
  selectedPeople,
  onPeopleChange,
  eventStartDate,
  eventEndDate,
  className,
}: PeopleSelectorWithAvailabilityProps) {
  const [searchValue, setSearchValue] = useState("");
  const [filteredPeople, setFilteredPeople] = useState<Person[]>(mockFriends);
  const [showAvailabilityDetails, setShowAvailabilityDetails] = useState(false);


  // Calculate availability when event times or selected people change
  const availabilityData = useMemo(() => {
    if (!eventStartDate || !eventEndDate || selectedPeople.length === 0 || 
        !(eventStartDate instanceof Date) || !(eventEndDate instanceof Date) ||
        isNaN(eventStartDate.getTime()) || isNaN(eventEndDate.getTime())) {
      return null;
    }

    const eventTime: EventTimeSlot = {
      startDate: eventStartDate,
      endDate: eventEndDate
    };

    try {
      const statuses = checkMultiplePeopleAvailability(selectedPeople, eventTime);
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
  }, [selectedPeople, eventStartDate, eventEndDate]);

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

  // Time suggestions when selecting people
  const timeSuggestions = useMemo(() => {
    if (!eventStartDate || selectedPeople.length === 0 || 
        !(eventStartDate instanceof Date) || isNaN(eventStartDate.getTime())) {
      return [];
    }
    
    try {
      return suggestBestTimes(selectedPeople, eventStartDate, 60);
    } catch (error) {
      console.warn("Error calculating time suggestions:", error);
      return [];
    }
  }, [selectedPeople, eventStartDate]);

  // Filter people based on search
  useEffect(() => {
    let filtered = mockFriends;

    // Filter by search term
    if (searchValue) {
      const lowercaseSearch = searchValue.toLowerCase();
      filtered = filtered.filter(
        person =>
          person.name.toLowerCase().includes(lowercaseSearch) ||
          person.email.toLowerCase().includes(lowercaseSearch)
      );
    }

    setFilteredPeople(filtered);
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

  const isPersonSelected = (personId: string) => {
    return selectedPeople.some(p => p.id === personId);
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
        <Label>Invite People</Label>
        
        {/* Selected People Display with Availability */}
        {selectedPeople.length > 0 && (
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
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
                {timeSuggestions.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <h5 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      💡 Suggested time slots (more availability)
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {timeSuggestions.slice(0, 4).map((suggestion, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {suggestion.time} ({suggestion.availableCount}/{selectedPeople.length} available)
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

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

        {/* Search Friends */}
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
              {filteredPeople.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  No friends found matching "{searchValue}"
                </div>
              ) : (
                <div className="p-2">
                  <div className="text-xs font-medium text-gray-600 dark:text-gray-400 px-2 py-1 mb-2">
                    {filteredPeople.length} friend{filteredPeople.length !== 1 ? 's' : ''} found
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
          
          {!searchValue && (
            <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              Start typing to search for friends to invite
            </div>
          )}
        </div>

        {/* Summary */}
        {selectedPeople.length > 0 && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {selectedPeople.length} person(s) will be invited to this event
            {availabilityData && (
              <span className="ml-2">
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
