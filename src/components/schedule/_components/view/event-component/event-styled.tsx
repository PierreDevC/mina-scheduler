"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useModal } from "@/providers/modal-context";
import AddEventModal from "@/components/schedule/_modals/add-event-modal";
import { Event, CustomEventModal } from "@/types";
import { CalendarIcon, ClockIcon, Users } from "lucide-react";
import { useScheduler } from "@/providers/schedular-provider";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import CustomModal from "@/components/ui/custom-modal";

// Function to format date
const formatDate = (date: Date) => {
  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

// Function to format time only
const formatTime = (date: Date) => {
  return date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

// Color variants based on event type
const variantColors = {
  primary: {
    bg: "bg-blue-100",
    border: "border-blue-200",
    text: "text-blue-800",
  },
  danger: {
    bg: "bg-red-100",
    border: "border-red-200",
    text: "text-red-800",
  },
  success: {
    bg: "bg-green-100",
    border: "border-green-200",
    text: "text-green-800",
  },
  warning: {
    bg: "bg-yellow-100",
    border: "border-yellow-200",
    text: "text-yellow-800",
  },
};

interface EventStyledProps extends Event {
  minmized?: boolean;
  CustomEventComponent?: React.FC<Event>;
}

export default function EventStyled({
  event,
  onDelete,
  CustomEventModal,
}: {
  event: EventStyledProps;
  CustomEventModal?: CustomEventModal;
  onDelete?: (id: string) => void;
}) {
  const { setOpen } = useModal();
  const { handlers } = useScheduler();


  // Handler function
  function handleEditEvent(event: Event) {
    // Open the modal with the content
    setOpen(
      <CustomModal title="Edit Event">
        <AddEventModal
          CustomAddEventModal={
            CustomEventModal?.CustomAddEventModal?.CustomForm
          }
        />
      </CustomModal>,
      async () => {
        return {
          ...event,
          invitedPeople: event.invitedPeople || [],
        };
      }
    );
  }

  // Get background color class based on variant
  const getBackgroundColor = (variant: string | undefined) => {
    const variantKey = variant as keyof typeof variantColors || "primary";
    const colors = variantColors[variantKey] || variantColors.primary;
    return `${colors.bg} ${colors.text} ${colors.border}`;
  };

  return (
    <div
      key={event?.id}
      className={cn(
        "w-full z-50 relative cursor-pointer border group rounded-lg flex flex-col flex-grow shadow-sm hover:shadow-md transition-shadow duration-200",
        event?.minmized ? "border-transparent" : "border-default-400/60"
      )}
    >

      {event.CustomEventComponent ? (
        <div
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            handleEditEvent({
              id: event?.id,
              title: event?.title,
              startDate: event?.startDate,
              endDate: event?.endDate,
              description: event?.description,
              variant: event?.variant,
              invitedPeople: event?.invitedPeople,
            });
          }}
        >
          <event.CustomEventComponent {...event} />
        </div>
      ) : (
        <div
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            e.stopPropagation();
            handleEditEvent({
              id: event?.id,
              title: event?.title,
              startDate: event?.startDate,
              endDate: event?.endDate,
              description: event?.description,
              variant: event?.variant,
              invitedPeople: event?.invitedPeople,
            });
          }}
          className={cn(
            "w-full p-2 rounded",
            getBackgroundColor(event?.variant),
            event?.minmized ? "flex-grow overflow-hidden" : "min-h-fit"
          )}
        >
          <div className="flex flex-col h-full">
            <div className="font-semibold text-xs truncate mb-1">
              {event?.title || "Untitled Event"}
            </div>
            
            {/* Show time in minimized mode */}
            {event?.minmized && (
              <div className="text-[10px] opacity-80">
                {formatTime(event?.startDate)}
              </div>
            )}
            
            {!event?.minmized && event?.description && (
              <div className="my-2 text-sm">{event?.description}</div>
            )}
            
            {!event?.minmized && (
              <div className="text-xs space-y-1 mt-2">
                <div className="flex items-center">
                  <CalendarIcon className="mr-1 h-3 w-3" />
                  {formatDate(event?.startDate)}
                </div>
                <div className="flex items-center">
                  <ClockIcon className="mr-1 h-3 w-3" />
                  {formatDate(event?.endDate)}
                </div>
                
                {/* Display invited people */}
                {event?.invitedPeople && event.invitedPeople.length > 0 && (
                  <div className="flex items-center mt-2">
                    <Users className="mr-1 h-3 w-3" />
                    <div className="flex items-center space-x-1">
                      {event.invitedPeople.slice(0, 3).map((person) => (
                        <Avatar key={person.id} className="w-5 h-5">
                          <AvatarImage src={person.avatar} alt={person.name} />
                          <AvatarFallback className="text-[8px]">
                            {person.name.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {event.invitedPeople.length > 3 && (
                        <Badge variant="secondary" className="h-5 text-[8px] px-1">
                          +{event.invitedPeople.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Show invited people count in minimized mode */}
            {event?.minmized && event?.invitedPeople && event.invitedPeople.length > 0 && (
              <div className="text-[10px] opacity-80 flex items-center mt-1">
                <Users className="mr-1 h-2 w-2" />
                {event.invitedPeople.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
