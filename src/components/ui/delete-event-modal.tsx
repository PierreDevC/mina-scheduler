"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";

interface DeleteEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  eventTitle?: string;
}

export default function DeleteEventModal({
  isOpen,
  onClose,
  onConfirm,
  eventTitle,
}: DeleteEventModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-500" />
            Delete Event
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              "{eventTitle}"
            </span>
            ?
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            This action cannot be undone.
          </p>
        </div>
        <DialogFooter className="flex space-x-1">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Event
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}