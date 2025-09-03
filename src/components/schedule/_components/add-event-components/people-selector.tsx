"use client";

import React, { useState, useEffect } from "react";
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
import { Check, UserPlus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Person } from "@/types/index";
import { mockPeople, getDepartments } from "@/data/mockPeople";

interface PeopleSelectorProps {
  selectedPeople: Person[];
  onPeopleChange: (people: Person[]) => void;
  className?: string;
}

export default function PeopleSelector({
  selectedPeople,
  onPeopleChange,
  className,
}: PeopleSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filteredPeople, setFilteredPeople] = useState<Person[]>(mockPeople);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");

  const departments = getDepartments();

  // Filter people based on search and department
  useEffect(() => {
    let filtered = mockPeople;

    // Filter by department
    if (selectedDepartment !== "all") {
      filtered = filtered.filter(person => person.department === selectedDepartment);
    }

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
  }, [searchValue, selectedDepartment]);

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

  return (
    <div className={cn("grid gap-3", className)}>
      <Label>Inviter des personnes</Label>
      
      {/* Selected People Display */}
      {selectedPeople.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          {selectedPeople.map((person) => (
            <Badge
              key={person.id}
              variant="secondary"
              className="flex items-center gap-2 py-1 px-2"
            >
              <Avatar className="w-5 h-5">
                <AvatarImage src={person.avatar} alt={person.name} />
                <AvatarFallback className="text-xs">
                  {person.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm">{person.name}</span>
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
          ))}
        </div>
      )}

      {/* Add People Button */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            {selectedPeople.length === 0
              ? "Ajouter des personnes..."
              : `${selectedPeople.length} personne(s) invitée(s)`}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Rechercher des personnes..."
              value={searchValue}
              onValueChange={setSearchValue}
            />
            
            {/* Department Filter */}
            <div className="p-2 border-b">
              <div className="flex flex-wrap gap-1">
                <Button
                  type="button"
                  variant={selectedDepartment === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDepartment("all")}
                >
                  Tous
                </Button>
                {departments.map((dept) => (
                  <Button
                    key={dept}
                    type="button"
                    variant={selectedDepartment === dept ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDepartment(dept)}
                  >
                    {dept}
                  </Button>
                ))}
              </div>
            </div>

            <CommandList>
              <CommandEmpty>Aucune personne trouvée.</CommandEmpty>
              <CommandGroup>
                {filteredPeople.map((person) => (
                  <CommandItem
                    key={person.id}
                    onSelect={() => handlePersonSelect(person)}
                    className="flex items-center gap-3 p-2"
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={person.avatar} alt={person.name} />
                      <AvatarFallback>
                        {person.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{person.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {person.email}
                      </div>
                      {person.department && (
                        <div className="text-xs text-blue-600 dark:text-blue-400">
                          {person.department}
                        </div>
                      )}
                    </div>
                    <Check
                      className={cn(
                        "h-4 w-4",
                        isPersonSelected(person.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Summary */}
      {selectedPeople.length > 0 && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {selectedPeople.length} personne(s) seront invitées à cet événement
        </p>
      )}
    </div>
  );
}
