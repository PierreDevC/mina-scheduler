"use client";

import React from "react";
import { useModal } from "@/providers/modal-context";
import AddEventModal from "../../_modals/add-event-modal";
import CustomModal from "@/components/ui/custom-modal";
import { CustomComponents } from "@/types/index";
import { createDateFromParts, createEndDateFromStart } from "../context/date-context-handler";

interface EventCreationHandlerProps {
  customComponents?: CustomComponents;
}

export function useEventCreationHandler({ customComponents }: EventCreationHandlerProps = {}) {
  const { setOpen } = useModal();

  // Handle Add Event button click (uses today's date)
  const handleAddEventButton = () => {
    const today = new Date();
    const startDate = createDateFromParts(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      9, // 9:00 AM
      0
    );
    const endDate = createEndDateFromStart(startDate);

    openEventModal(startDate, endDate);
  };

  // Handle specific date click from calendar
  const handleDateClick = (year: number, month: number, day: number) => {
    const startDate = createDateFromParts(year, month, day, 9, 0); // 9:00 AM
    const endDate = createEndDateFromStart(startDate);

    console.log("🗓️ Date clicked:", { year, month, day });
    console.log("📅 Created startDate:", startDate);
    console.log("📅 Created endDate:", endDate);

    openEventModal(startDate, endDate);
  };

  // Handle time-specific click (like from week or day view)
  const handleTimeClick = (date: Date) => {
    const endDate = createEndDateFromStart(date);
    openEventModal(date, endDate);
  };

  // Private method to open the modal with proper data
  const openEventModal = (startDate: Date, endDate: Date) => {
    const modalData = {
      startDate,
      endDate,
      title: "",
      id: "",
      variant: "primary" as const,
    };
    
    console.log("🚀 Opening modal with data:", modalData);
    
    setOpen(
      <CustomModal title="Add Event" customizedModal={true}>
        <AddEventModal
          CustomAddEventModal={
            customComponents?.CustomEventModal?.CustomAddEventModal?.CustomForm
          }
        />
      </CustomModal>,
      async () => {
        return modalData;
      }
    );
  };

  return {
    handleAddEventButton,
    handleDateClick,
    handleTimeClick,
  };
}