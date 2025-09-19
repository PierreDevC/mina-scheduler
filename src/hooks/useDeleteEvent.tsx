"use client";

import { useState } from "react";
import DeleteEventModal from "@/components/ui/delete-event-modal";

interface EventToDelete {
  id: string;
  title: string;
}

interface UseDeleteEventProps {
  onDelete: (id: string) => void;
}

export const useDeleteEvent = ({ onDelete }: UseDeleteEventProps) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<EventToDelete | null>(null);

  const handleDeleteEvent = (eventId: string, eventTitle: string) => {
    console.log("handleDeleteEvent called with:", { eventId, type: typeof eventId, eventTitle });
    setEventToDelete({ id: eventId, title: eventTitle });
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteEvent = () => {
    if (eventToDelete) {
      console.log("Deleting event with ID:", eventToDelete.id, "Type:", typeof eventToDelete.id, "Title:", eventToDelete.title);

      // Convert to string to ensure type consistency
      const idToDelete = String(eventToDelete.id);
      console.log("Converting ID to string:", idToDelete);

      onDelete(idToDelete);
      setIsDeleteModalOpen(false);
      setEventToDelete(null);
    }
  };

  const cancelDeleteEvent = () => {
    setIsDeleteModalOpen(false);
    setEventToDelete(null);
  };

  const DeleteModal = () => (
    <DeleteEventModal
      isOpen={isDeleteModalOpen}
      onClose={cancelDeleteEvent}
      onConfirm={confirmDeleteEvent}
      eventTitle={eventToDelete?.title}
    />
  );

  return {
    handleDeleteEvent,
    DeleteModal,
  };
};