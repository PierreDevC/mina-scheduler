"use client";

import { useState } from "react";
import DeleteEventModal from "@/components/ui/delete-event-modal";
import { toast } from "sonner";

interface EventToDelete {
  id: string;
  title: string;
}

interface UseDeleteEventProps {
  onDelete: (id: string) => void;
  onCancel?: () => void;
  onSuccess?: () => void; // Callback after successful deletion
}

export const useDeleteEvent = ({ onDelete, onCancel, onSuccess }: UseDeleteEventProps) => {
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

      // Show success toast with event name
      toast.success(`Event "${eventToDelete.title}" deleted successfully`, {
        duration: 3000,
      });

      setIsDeleteModalOpen(false);
      setEventToDelete(null);

      // Call success callback to close parent modal
      onSuccess?.();
    }
  };

  const cancelDeleteEvent = () => {
    setIsDeleteModalOpen(false);
    setEventToDelete(null);
    onCancel?.(); // Call the cancel callback if provided
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