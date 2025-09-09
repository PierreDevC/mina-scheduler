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
import { EventFormData, eventSchema, Variant, Event, Person } from "@/types/index";
import { useScheduler } from "@/providers/schedular-provider";
import { v4 as uuidv4 } from "uuid"; // Use UUID to generate event IDs

export default function AddEventModal({
  CustomAddEventModal,
}: {
  CustomAddEventModal?: React.FC<{ register: any; errors: any }>;
}) {
  const { setClose, data } = useModal();

  const [selectedColor, setSelectedColor] = useState<string>(
    getEventColor(data?.variant || "primary")
  );
  const [selectedPeople, setSelectedPeople] = useState<Person[]>([]);
  const [currentStartDate, setCurrentStartDate] = useState<Date>(() => 
    data?.default?.startDate || new Date()
  );
  const [currentEndDate, setCurrentEndDate] = useState<Date>(() => 
    data?.default?.endDate || new Date()
  );

  const typedData = data as { default: Event };

  const { handlers } = useScheduler();

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
      startDate: new Date(),
      endDate: new Date(),
      variant: data?.variant || "primary",
      color: data?.color || "blue",
      invitedPeople: [],
    },
  });

  // For presentation: Use demo dates to show availability
  useEffect(() => {
    // Set demo times for availability checking (10 AM to 11 AM today)
    const demoStart = new Date();
    demoStart.setHours(10, 0, 0, 0);
    const demoEnd = new Date();
    demoEnd.setHours(11, 0, 0, 0);
    
    setCurrentStartDate(demoStart);
    setCurrentEndDate(demoEnd);
  }, []);  // Run only once on mount

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

  // Reset the form on initialization
  useEffect(() => {
    if (data?.default) {
      const eventData = data?.default;
      console.log("eventData", eventData);
      reset({
        title: eventData.title,
        description: eventData.description || "",
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        variant: eventData.variant || "primary",
        color: eventData.color || "blue",
        invitedPeople: eventData.invitedPeople || [],
      });
      setSelectedPeople(eventData.invitedPeople || []);
      setCurrentStartDate(eventData.startDate);
      setCurrentEndDate(eventData.endDate);
    }
  }, [data, reset]);

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
    };

    if (!typedData?.default?.id) handlers.handleAddEvent(newEvent);
    else handlers.handleUpdateEvent(newEvent, typedData.default.id);
    setClose(); // Close the modal after submission
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      {CustomAddEventModal ? (
        <CustomAddEventModal register={register} errors={errors} />
      ) : (
        <>
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
            />
          </div>

          <SelectDate
            data={{
              startDate: currentStartDate,
              endDate: currentEndDate,
            }}
            setValue={setValue}
          />

          <PeopleSelectorWithAvailability
            selectedPeople={selectedPeople}
            onPeopleChange={(people) => {
              setSelectedPeople(people);
              setValue("invitedPeople", people);
            }}
            eventStartDate={currentStartDate}
            eventEndDate={currentEndDate}
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

          <div className="flex justify-end space-x-2 mt-4 pt-2 border-t">
            <Button variant="outline" type="button" onClick={() => setClose()}>
              Cancel
            </Button>
            <Button type="submit">Save Event</Button>
          </div>
        </>
      )}
    </form>
  );
}
