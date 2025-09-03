"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Clock, 
  Plus, 
  Trash2, 
  Calendar, 
  Save, 
  RotateCcw,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  UserAvailability, 
  AvailabilitySlot, 
  TimeSlot 
} from "@/types/index";
import { 
  mockUserAvailability, 
  getDayName, 
  createEmptyTimeSlot,
  createEmptyAvailabilitySlot,
  availabilityPresets
} from "@/data/mockAvailability";
import { motion, AnimatePresence } from "framer-motion";

interface AvailabilityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AvailabilityModal({ open, onOpenChange }: AvailabilityModalProps) {
  const [availability, setAvailability] = useState<UserAvailability>(mockUserAvailability);
  const [activeTab, setActiveTab] = useState("weekly");
  const [isModified, setIsModified] = useState(false);

  // Reset modification flag when modal opens
  useEffect(() => {
    if (open) {
      setIsModified(false);
    }
  }, [open]);

  const handleSave = () => {
    // In a real app, this would save to backend
    console.log("Saving availability:", availability);
    setIsModified(false);
    onOpenChange(false);
  };

  const handleReset = () => {
    setAvailability(mockUserAvailability);
    setIsModified(false);
  };

  const applyPreset = (presetKey: keyof typeof availabilityPresets) => {
    const preset = availabilityPresets[presetKey];
    setAvailability(prev => ({
      ...prev,
      availabilitySlots: preset.slots as AvailabilitySlot[],
      lastUpdated: new Date()
    }));
    setIsModified(true);
  };

  const updateAvailabilitySlot = (slotId: string, updatedSlot: AvailabilitySlot) => {
    setAvailability(prev => ({
      ...prev,
      availabilitySlots: prev.availabilitySlots.map(slot =>
        slot.id === slotId ? updatedSlot : slot
      ),
      lastUpdated: new Date()
    }));
    setIsModified(true);
  };

  const addTimeSlot = (slotId: string) => {
    setAvailability(prev => ({
      ...prev,
      availabilitySlots: prev.availabilitySlots.map(slot =>
        slot.id === slotId
          ? { ...slot, timeSlots: [...slot.timeSlots, createEmptyTimeSlot()] }
          : slot
      ),
      lastUpdated: new Date()
    }));
    setIsModified(true);
  };

  const removeTimeSlot = (slotId: string, timeSlotIndex: number) => {
    setAvailability(prev => ({
      ...prev,
      availabilitySlots: prev.availabilitySlots.map(slot =>
        slot.id === slotId
          ? {
              ...slot,
              timeSlots: slot.timeSlots.filter((_, index) => index !== timeSlotIndex)
            }
          : slot
      ),
      lastUpdated: new Date()
    }));
    setIsModified(true);
  };

  const updateTimeSlot = (slotId: string, timeSlotIndex: number, field: keyof TimeSlot, value: string) => {
    setAvailability(prev => ({
      ...prev,
      availabilitySlots: prev.availabilitySlots.map(slot =>
        slot.id === slotId
          ? {
              ...slot,
              timeSlots: slot.timeSlots.map((timeSlot, index) =>
                index === timeSlotIndex
                  ? { ...timeSlot, [field]: value }
                  : timeSlot
              )
            }
          : slot
      ),
      lastUpdated: new Date()
    }));
    setIsModified(true);
  };

  const toggleDayAvailability = (dayOfWeek: number) => {
    const existingSlot = availability.availabilitySlots.find(slot => slot.dayOfWeek === dayOfWeek);
    
    if (existingSlot) {
      // Remove the day
      setAvailability(prev => ({
        ...prev,
        availabilitySlots: prev.availabilitySlots.filter(slot => slot.dayOfWeek !== dayOfWeek),
        lastUpdated: new Date()
      }));
    } else {
      // Add the day
      setAvailability(prev => ({
        ...prev,
        availabilitySlots: [...prev.availabilitySlots, createEmptyAvailabilitySlot(dayOfWeek)],
        lastUpdated: new Date()
      }));
    }
    setIsModified(true);
  };

  const weeklySlots = availability.availabilitySlots
    .filter(slot => slot.isRecurring)
    .sort((a, b) => a.dayOfWeek - b.dayOfWeek);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[900px] max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Clock className="h-6 w-6 text-blue-600" />
            Gérer mes disponibilités
          </DialogTitle>
          <DialogDescription>
            Définissez vos créneaux de disponibilité pour que vos collègues puissent planifier des réunions avec vous.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Presets Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5" />
              Modèles prédéfinis
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {Object.entries(availabilityPresets).map(([key, preset]) => (
                <Button
                  key={key}
                  variant="outline"
                  size="lg"
                  onClick={() => applyPreset(key as keyof typeof availabilityPresets)}
                  className="h-auto p-4 text-left justify-start bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  <div className="w-full">
                    <div className="font-semibold text-base mb-2">{preset.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {preset.description}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="weekly">Disponibilités hebdomadaires</TabsTrigger>
              <TabsTrigger value="specific">Dates spécifiques</TabsTrigger>
            </TabsList>

            <TabsContent value="weekly" className="space-y-6 mt-6">
              {/* Day Selection */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Sélectionnez vos jours de disponibilité
                </h4>
                <div className="grid grid-cols-7 gap-3">
                  {[0, 1, 2, 3, 4, 5, 6].map(dayOfWeek => {
                    const isSelected = availability.availabilitySlots.some(slot => slot.dayOfWeek === dayOfWeek);
                    return (
                      <Button
                        key={dayOfWeek}
                        variant={isSelected ? "default" : "outline"}
                        size="lg"
                        onClick={() => toggleDayAvailability(dayOfWeek)}
                        className="h-16 flex flex-col items-center justify-center"
                      >
                        <span className="text-sm font-medium">{getDayName(dayOfWeek).slice(0, 3)}</span>
                        {isSelected && <span className="text-xs opacity-75">Actif</span>}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots for Each Day */}
              {weeklySlots.length > 0 && (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-6 text-lg">
                    Configuration des créneaux horaires
                  </h4>
                  
                  <div className="grid gap-6">
                    <AnimatePresence>
                      {weeklySlots.map((slot) => (
                        <motion.div
                          key={slot.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h5 className="font-medium text-gray-900 dark:text-white text-lg">
                              {getDayName(slot.dayOfWeek)}
                            </h5>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => addTimeSlot(slot.id)}
                              className="bg-white dark:bg-gray-800"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Ajouter un créneau
                            </Button>
                          </div>

                          <div className="grid gap-3">
                            {slot.timeSlots.map((timeSlot, index) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-600"
                              >
                                <div className="flex items-center gap-3 flex-1">
                                  <div className="flex items-center gap-2">
                                    <Label className="text-sm font-medium min-w-[24px]">De</Label>
                                    <Input
                                      type="time"
                                      value={timeSlot.startTime}
                                      onChange={(e) => updateTimeSlot(slot.id, index, "startTime", e.target.value)}
                                      className="w-32"
                                    />
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Label className="text-sm font-medium min-w-[16px]">à</Label>
                                    <Input
                                      type="time"
                                      value={timeSlot.endTime}
                                      onChange={(e) => updateTimeSlot(slot.id, index, "endTime", e.target.value)}
                                      className="w-32"
                                    />
                                  </div>
                                  <div className="text-sm text-gray-600 dark:text-gray-400 ml-4">
                                    Durée: {(() => {
                                      const start = new Date(`2000-01-01T${timeSlot.startTime}`);
                                      const end = new Date(`2000-01-01T${timeSlot.endTime}`);
                                      const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                                      return diff > 0 ? `${diff}h` : "Invalide";
                                    })()}
                                  </div>
                                </div>
                                
                                {slot.timeSlots.length > 1 && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => removeTimeSlot(slot.id, index)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {weeklySlots.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Sélectionnez les jours de la semaine où vous êtes disponible</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="specific" className="space-y-4 mt-6">
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Fonctionnalité pour dates spécifiques</p>
                <p className="text-sm">À venir dans une prochaine version</p>
              </div>
            </TabsContent>
          </Tabs>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              {isModified && (
                <Badge variant="secondary" className="text-xs">
                  Modifications non sauvegardées
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleReset}
                disabled={!isModified}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Réinitialiser
              </Button>
              <Button onClick={() => onOpenChange(false)} variant="outline">
                Annuler
              </Button>
              <Button 
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Enregistrer
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
