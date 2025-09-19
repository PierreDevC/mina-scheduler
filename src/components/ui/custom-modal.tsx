"use client";

import { ReactNode, useState, useEffect, useRef } from "react";
import { useModal } from "@/providers/modal-context";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";

interface CustomModalProps {
  title?: string;
  subheading?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  contentClass?: string;
  id?: string;
  customizedModal?: boolean;
}

export default function CustomModal({
  title,
  subheading,
  children,
  defaultOpen = false,
  contentClass,
  id = "default",
  customizedModal = false,
}: CustomModalProps) {
  const { isOpen, setClose, setOpen, canClose, setCanClose } = useModal();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [localOpen, setLocalOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);

  const contentClassName = clsx("rounded-md bg-card", contentClass);

  // Narrow dependency: only react to isOpen for this specific modal.
  useEffect(() => {
    setLocalOpen(isOpen[id] ?? defaultOpen);
  }, [isOpen[id], id, defaultOpen]);

  // Auto-focus when modal opens.
  useEffect(() => {
    if (localOpen && contentRef.current) {
      contentRef.current.focus();
    }
  }, [localOpen]);

  function handleOpenChange(open: boolean) {
    // Check the specific modal's canClose flag.
    if (!open && canClose[id] === false) {
      setShowConfirmation(true);
    } else {
      setLocalOpen(open);
      if (!open) {
        setTimeout(() => setClose(id), 300);
      } else {
        // IMPORTANT: Ensure you pass a valid modal element when opening.
        setOpen(
          <CustomModal id={id} title={title} subheading={subheading} contentClass={contentClass} customizedModal={customizedModal}>
            {children}
          </CustomModal>,
          undefined,
          id
        );
      }
    }
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      const focusableElements = contentRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as NodeListOf<HTMLElement>;
      if (focusableElements && focusableElements.length > 0) {
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    } else if (event.key === "Escape") {
      handleOpenChange(false);
    }
  }

  // Updated handleConfirmClose to force-close the modal.
  function handleConfirmClose() {
    setShowConfirmation(false);
    // Force the modal to be closable by updating canClose.
    setCanClose(id, true);
    setLocalOpen(false);
    setTimeout(() => setClose(id), 300);
  }

  return (
    <>
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to close?</AlertDialogTitle>
            <AlertDialogDescription>This action will close the current modal. Any unsaved changes may be lost.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirmation(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmClose}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {customizedModal ? (
        <AnimatePresence>
          {localOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-md"
              onClick={() => handleOpenChange(false)}>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={clsx(
                  "relative flex flex-col outline-none rounded-xl shadow-xl",
                  "w-full max-w-[calc(100vw-1rem)] max-h-[calc(100vh-2rem)]",
                  "sm:max-w-2xl md:max-h-[85vh]",
                  contentClassName
                )}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={handleKeyDown}
                ref={contentRef}
                tabIndex={-1}>
                <div className="flex-shrink-0 p-4 sm:p-6 pb-2">
                  <button 
                    className="absolute top-2 right-2 sm:top-4 sm:right-4 p-1 rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 z-10 cursor-pointer" 
                    onClick={() => handleOpenChange(false)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                  {title && <h2 className="text-xl sm:text-2xl tracking-tighter font-semibold mb-2">{title}</h2>}
                  {subheading && <p className="text-muted-foreground text-sm sm:text-base">{subheading}</p>}
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 pb-4 sm:pb-6">
                  {children}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      ) : (
        <Dialog open={localOpen} onOpenChange={handleOpenChange}>
          <DialogContent className={contentClassName}>
            <DialogHeader className="flex-shrink-0">
              <DialogTitle className="text-xl sm:text-2xl font-bold">{title}</DialogTitle>
              {subheading && <DialogDescription className="text-sm sm:text-base">{subheading}</DialogDescription>}
            </DialogHeader>
            <div className="flex-1 min-h-0">{children}</div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
