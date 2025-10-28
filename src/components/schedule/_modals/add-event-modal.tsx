"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

import { useModal } from "@/providers/modal-context";
import SelectDate from "@/components/schedule/_components/add-event-components/select-date";
import PeopleSelectorWithAvailability from "@/components/schedule/_components/add-event-components/people-selector-with-availability";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventFormData, eventSchema, Variant, Event, Person, Group } from "@/types/index";
import { useScheduler } from "@/providers/schedular-provider";
import { v4 as uuidv4 } from "uuid"; // Use UUID to generate event IDs
import { Trash2 } from "lucide-react";
import { useDeleteEvent } from "@/hooks/useDeleteEvent";

export default function AddEventModal({
  CustomAddEventModal,
  onDeleteEvent,
  onAddEvent,
  onUpdateEvent,
}: {
  CustomAddEventModal?: React.FC<{ register: any; errors: any }>;
  onDeleteEvent?: (id: string) => void;
  onAddEvent?: (event: Event) => void;
  onUpdateEvent?: (event: Event) => void;
}) {
  const { setClose, data } = useModal();

  // Get the actual modal data (stored under "default" key)
  const modalData = data?.default;
  
  console.log("🎯 Modal received data:", data);
  console.log("🎯 Modal data.default:", modalData);
  console.log("🎯 Full modal data keys:", Object.keys(data || {}));
  console.log("🎯 StartDate from modalData:", modalData?.startDate);
  console.log("🎯 EndDate from modalData:", modalData?.endDate);

  const [selectedColor, setSelectedColor] = useState<string>(
    getEventColor(modalData?.variant || "primary")
  );
  const [selectedPeople, setSelectedPeople] = useState<Person[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<Group[]>([]);
  const [currentStartDate, setCurrentStartDate] = useState<Date>(() =>
    modalData?.startDate || new Date()
  );
  const [currentEndDate, setCurrentEndDate] = useState<Date>(() =>
    modalData?.endDate || new Date()
  );

  const typedData = modalData as Event;

  const { handlers } = useScheduler();

  // Determine which delete function to use
  const deleteFunc = onDeleteEvent || handlers.handleDeleteEvent;
  const { handleDeleteEvent: handleDelete, DeleteModal } = useDeleteEvent({
    onDelete: deleteFunc,
    onSuccess: () => setClose() // Close the main modal after successful deletion
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: modalData?.startDate || new Date(),
      endDate: modalData?.endDate || new Date(),
      variant: "primary",
      color: "blue",
      invitedPeople: [],
      invitedGroups: [],
      isAllDay: false,
    },
  });

  // Initialize dates from passed data or use current time
  useEffect(() => {
    if (modalData?.startDate && modalData?.endDate) {
      // Use data from calendar view
      console.log("📅 Setting dates from modalData:", modalData.startDate, modalData.endDate);
      setCurrentStartDate(modalData.startDate);
      setCurrentEndDate(modalData.endDate);
    } else {
      // Use current time as default
      console.log("📅 Using current time as fallback");
      const now = new Date();
      setCurrentStartDate(now);
      setCurrentEndDate(new Date(now.getTime() + 60 * 60 * 1000)); // 1 hour later
    }
  }, [modalData]);

  // Watch for date changes in the form
  const watchedStartDate = watch("startDate");
  const watchedEndDate = watch("endDate");

  // Update current dates when form dates change (with stable reference check)
  useEffect(() => {
    if (watchedStartDate && watchedStartDate instanceof Date) {
      const timeChanged = currentStartDate.getTime() !== watchedStartDate.getTime();
      if (timeChanged) {
        setCurrentStartDate(watchedStartDate);
      }
    }
    if (watchedEndDate && watchedEndDate instanceof Date) {
      const timeChanged = currentEndDate.getTime() !== watchedEndDate.getTime();
      if (timeChanged) {
        setCurrentEndDate(watchedEndDate);
      }
    }
  }, [watchedStartDate, watchedEndDate, currentStartDate, currentEndDate]);

  // Reset form when data becomes available
  useEffect(() => {
    if (modalData) {
      console.log("🔄 Resetting form with modalData:", modalData);
      reset({
        title: modalData.title || "",
        description: modalData.description || "",
        startDate: modalData.startDate || new Date(),
        endDate: modalData.endDate || new Date(),
        variant: modalData.variant || "primary",
        color: modalData.color || "blue",
        invitedPeople: modalData.invitedPeople || [],
        invitedGroups: modalData.invitedGroups || [],
        isAllDay: modalData.isAllDay || false,
      });
      setSelectedPeople(modalData.invitedPeople || []);
      setSelectedGroups(modalData.invitedGroups || []);
    }
  }, [modalData, reset]);

  const colorOptions = [
    { key: "blue", name: "Blue" },
    { key: "red", name: "Red" },
    { key: "green", name: "Green" },
    { key: "yellow", name: "Yellow" },
  ];

  function getEventColor(variant: Variant) {
    switch (variant) {
      case "primary":
        return "blue";
      case "danger":
        return "red";
      case "success":
        return "green";
      case "warning":
        return "yellow";
      default:
        return "blue";
    }
  }

  function getEventStatus(color: string) {
    switch (color) {
      case "blue":
        return "primary";
      case "red":
        return "danger";
      case "green":
        return "success";
      case "yellow":
        return "warning";
      default:
        return "default";
    }
  }

  const getButtonVariant = (color: string) => {
    switch (color) {
      case "blue":
        return "default";
      case "red":
        return "destructive";
      case "green":
        return "success";
      case "yellow":
        return "warning";
      default:
        return "default";
    }
  };

  const onSubmit: SubmitHandler<EventFormData> = (formData) => {
    const newEvent: Event = {
      id: uuidv4(), // Generate a unique ID
      title: formData.title,
      startDate: formData.startDate,
      endDate: formData.endDate,
      variant: formData.variant,
      description: formData.description,
      invitedPeople: selectedPeople,
      invitedGroups: selectedGroups,
      isAllDay: formData.isAllDay,
    };

    if (!typedData?.id) {
      // Adding new event
      handlers.handleAddEvent(newEvent);
      // Also call events context if available
      if (onAddEvent) {
        onAddEvent(newEvent);
      }
    } else {
      // Updating existing event
      const updatedEvent = { ...newEvent, id: typedData.id };
      handlers.handleUpdateEvent(updatedEvent, typedData.id);
      // Also call events context if available
      if (onUpdateEvent) {
        onUpdateEvent(updatedEvent);
      }
    }
    setClose(); // Close the modal after submission
  };

  const handleDeleteEventClick = () => {
    if (typedData?.id && typedData?.title) {
      handleDelete(typedData.id, typedData.title);
      // Don't close the modal here - let the delete confirmation handle it
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      {CustomAddEventModal ? (
        <CustomAddEventModal register={register} errors={errors} />
      ) : (
        <>
          {/* Desktop 2-column layout, mobile single column */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Basic Event Info */}
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Event Name</Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="Enter event name"
                  className={cn(errors.title && "border-red-500")}
                />
                {errors.title && (
                  <p className="text-sm text-red-500">
                    {errors.title.message as string}
                  </p>
                )}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="Enter event description"
                  className="resize-none"
                  style={{
                    minHeight: '80px',
                    maxHeight: '200px',
                    overflow: 'auto'
                  }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = Math.min(target.scrollHeight, 200) + 'px';
                  }}
                />
              </div>

              <SelectDate
                data={{
                  startDate: currentStartDate,
                  endDate: currentEndDate,
                }}
                setValue={setValue}
              />

              <div className="grid gap-2">
                <Label>Color</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={getButtonVariant(selectedColor)}
                      className="w-fit my-2"
                    >
                      {
                        colorOptions.find((color) => color.key === selectedColor)
                          ?.name
                      }
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {colorOptions.map((color) => (
                      <DropdownMenuItem
                        key={color.key}
                        onClick={() => {
                          setSelectedColor(color.key);
                          setValue("variant", getEventStatus(color.key));
                        }}
                      >
                        <div className="flex items-center">
                          <div
                            style={{
                              backgroundColor: `var(--${color.key})`,
                            }}
                            className={`w-4 h-4 rounded-full mr-2`}
                          />
                          {color.name}
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Right Column - Invites & Availability */}
            <div className="space-y-4">
              <PeopleSelectorWithAvailability
                selectedPeople={selectedPeople}
                onPeopleChange={(people) => {
                  setSelectedPeople(people);
                  setValue("invitedPeople", people);
                }}
                selectedGroups={selectedGroups}
                onGroupsChange={(groups) => {
                  setSelectedGroups(groups);
                  setValue("invitedGroups", groups);
                }}
                eventStartDate={currentStartDate}
                eventEndDate={currentEndDate}
                onDateChange={(startDate, endDate) => {
                  setCurrentStartDate(startDate);
                  setCurrentEndDate(endDate);
                  setValue("startDate", startDate);
                  setValue("endDate", endDate);
                }}
              />

              {/* Show selected attendees */}
              {selectedPeople.length > 0 && (
                <div className="grid gap-2">
                  <Label>Event Attendees ({selectedPeople.length})</Label>
                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                    <div className="flex flex-wrap gap-2">
                      {selectedPeople.map((person) => (
                        <div key={person.id} className="flex items-center gap-2 bg-white dark:bg-gray-700 px-3 py-1 rounded-full border">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                            {person.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <span className="text-sm font-medium">{person.name}</span>
                          <span className="text-xs text-gray-500">({person.email})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 pt-2 border-t">
            <div>
              {typedData?.id && (
                <Button
                  variant="destructive"
                  type="button"
                  onClick={handleDeleteEventClick}
                  className="flex items-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Event</span>
                </Button>
              )}
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" type="button" onClick={() => setClose()}>
                Cancel
              </Button>
              <Button type="submit">
                {typedData?.id ? "Update Event" : "Save Event"}
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteModal />
    </form>
  );
}
