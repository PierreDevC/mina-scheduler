import { Person, UserAvailability, AvailabilitySlot, TimeSlot } from "@/types/index";
import { mockUserAvailability } from "@/data/mockAvailability";

export interface AvailabilityStatus {
  person: Person;
  status: "available" | "busy" | "partial" | "unknown";
  conflictReason?: string;
  availableTimeSlots?: TimeSlot[];
}

export interface EventTimeSlot {
  startDate: Date;
  endDate: Date;
}

// Mock availability data for different people (in a real app, this would come from the backend)
const mockPeopleAvailability: Record<string, UserAvailability> = {
  "1": { // Alice Dubois
    ...mockUserAvailability,
    id: "alice-availability",
    userId: "1",
    availabilitySlots: [
      {
        id: "alice-mon",
        dayOfWeek: 1,
        timeSlots: [
          { startTime: "09:00", endTime: "12:00" },
          { startTime: "14:00", endTime: "17:00" }
        ],
        isRecurring: true
      },
      {
        id: "alice-tue",
        dayOfWeek: 2,
        timeSlots: [
          { startTime: "10:00", endTime: "16:00" }
        ],
        isRecurring: true
      },
      {
        id: "alice-wed",
        dayOfWeek: 3,
        timeSlots: [
          { startTime: "09:00", endTime: "15:00" }
        ],
        isRecurring: true
      },
      {
        id: "alice-thu",
        dayOfWeek: 4,
        timeSlots: [
          { startTime: "08:00", endTime: "12:00" },
          { startTime: "13:00", endTime: "18:00" }
        ],
        isRecurring: true
      },
      {
        id: "alice-fri",
        dayOfWeek: 5,
        timeSlots: [
          { startTime: "09:00", endTime: "13:00" }
        ],
        isRecurring: true
      }
    ]
  },
  "2": { // Jean Martin
    ...mockUserAvailability,
    id: "jean-availability",
    userId: "2",
    availabilitySlots: [
      {
        id: "jean-mon",
        dayOfWeek: 1,
        timeSlots: [
          { startTime: "08:00", endTime: "17:00" }
        ],
        isRecurring: true
      },
      {
        id: "jean-tue",
        dayOfWeek: 2,
        timeSlots: [
          { startTime: "09:00", endTime: "17:00" }
        ],
        isRecurring: true
      },
      {
        id: "jean-wed",
        dayOfWeek: 3,
        timeSlots: [
          { startTime: "09:00", endTime: "12:00" },
          { startTime: "14:00", endTime: "17:00" }
        ],
        isRecurring: true
      },
      {
        id: "jean-thu",
        dayOfWeek: 4,
        timeSlots: [
          { startTime: "09:00", endTime: "17:00" }
        ],
        isRecurring: true
      },
      {
        id: "jean-fri",
        dayOfWeek: 5,
        timeSlots: [
          { startTime: "09:00", endTime: "15:00" }
        ],
        isRecurring: true
      }
    ]
  },
  "3": { // Sophie Lefebvre
    ...mockUserAvailability,
    id: "sophie-availability",
    userId: "3",
    availabilitySlots: [
      {
        id: "sophie-tue",
        dayOfWeek: 2,
        timeSlots: [
          { startTime: "10:00", endTime: "18:00" }
        ],
        isRecurring: true
      },
      {
        id: "sophie-wed",
        dayOfWeek: 3,
        timeSlots: [
          { startTime: "09:00", endTime: "17:00" }
        ],
        isRecurring: true
      },
      {
        id: "sophie-thu",
        dayOfWeek: 4,
        timeSlots: [
          { startTime: "09:00", endTime: "17:00" }
        ],
        isRecurring: true
      },
      {
        id: "sophie-fri",
        dayOfWeek: 5,
        timeSlots: [
          { startTime: "10:00", endTime: "16:00" }
        ],
        isRecurring: true
      }
    ]
  }
};

// Extend availability for more people with default patterns
for (let i = 4; i <= 12; i++) {
  mockPeopleAvailability[i.toString()] = {
    ...mockUserAvailability,
    id: `user-${i}-availability`,
    userId: i.toString(),
    availabilitySlots: mockUserAvailability.availabilitySlots // Default full-time schedule
  };
}

/**
 * Convert time string (HH:MM) to minutes since midnight
 */
function timeToMinutes(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * Check if two time ranges overlap
 */
function timeRangesOverlap(
  start1: number, end1: number,
  start2: number, end2: number
): boolean {
  return start1 < end2 && end1 > start2;
}

/**
 * Get availability for a specific person on a given day
 */
function getPersonAvailabilityForDay(userId: string, dayOfWeek: number): TimeSlot[] {
  const userAvailability = mockPeopleAvailability[userId];
  if (!userAvailability) return [];

  const daySlots = userAvailability.availabilitySlots.filter(
    slot => slot.dayOfWeek === dayOfWeek && slot.isRecurring
  );

  return daySlots.flatMap(slot => slot.timeSlots);
}

/**
 * Check if a person is available for a specific event time
 */
export function checkPersonAvailability(
  person: Person,
  eventTime: EventTimeSlot
): AvailabilityStatus {
  const startTime = new Date(eventTime.startDate);
  const endTime = new Date(eventTime.endDate);
  
  // Check if it's the same day
  if (startTime.toDateString() !== endTime.toDateString()) {
    return {
      person,
      status: "unknown",
      conflictReason: "Multi-day events are not supported currently"
    };
  }

  const dayOfWeek = startTime.getDay();
  const availableSlots = getPersonAvailabilityForDay(person.id, dayOfWeek);

  if (availableSlots.length === 0) {
    return {
      person,
      status: "busy",
      conflictReason: "Not available that day"
    };
  }

  // Convert event time to minutes
  const eventStartMinutes = startTime.getHours() * 60 + startTime.getMinutes();
  const eventEndMinutes = endTime.getHours() * 60 + endTime.getMinutes();

  // Check for overlaps with available time slots
  let hasFullOverlap = false;
  let hasPartialOverlap = false;
  const overlappingSlots: TimeSlot[] = [];

  for (const slot of availableSlots) {
    const slotStartMinutes = timeToMinutes(slot.startTime);
    const slotEndMinutes = timeToMinutes(slot.endTime);

    if (timeRangesOverlap(eventStartMinutes, eventEndMinutes, slotStartMinutes, slotEndMinutes)) {
      hasPartialOverlap = true;
      overlappingSlots.push(slot);

      // Check if the event is fully contained within this slot
      if (eventStartMinutes >= slotStartMinutes && eventEndMinutes <= slotEndMinutes) {
        hasFullOverlap = true;
      }
    }
  }

  if (hasFullOverlap) {
    return {
      person,
      status: "available",
      availableTimeSlots: overlappingSlots
    };
  } else if (hasPartialOverlap) {
    return {
      person,
      status: "partial",
      conflictReason: "Partially available during this slot",
      availableTimeSlots: overlappingSlots
    };
  } else {
    return {
      person,
      status: "busy",
      conflictReason: "Not available at this time"
    };
  }
}

/**
 * Check availability for multiple people
 */
export function checkMultiplePeopleAvailability(
  people: Person[],
  eventTime: EventTimeSlot
): AvailabilityStatus[] {
  return people.map(person => checkPersonAvailability(person, eventTime));
}

/**
 * Get summary statistics for availability
 */
export function getAvailabilitySummary(availabilityStatuses: AvailabilityStatus[]) {
  const summary = {
    total: availabilityStatuses.length,
    available: 0,
    busy: 0,
    partial: 0,
    unknown: 0
  };

  availabilityStatuses.forEach(status => {
    summary[status.status]++;
  });

  return summary;
}

/**
 * Suggest best times based on people availability
 */
export function suggestBestTimes(
  people: Person[],
  targetDate: Date,
  durationMinutes: number = 60
): Array<{ time: string; availableCount: number; details: AvailabilityStatus[] }> {
  const dayOfWeek = targetDate.getDay();
  const suggestions: Array<{ time: string; availableCount: number; details: AvailabilityStatus[] }> = [];

  // Check availability every 30 minutes from 8:00 to 18:00
  for (let hour = 8; hour <= 17; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const startTime = new Date(targetDate);
      startTime.setHours(hour, minute, 0, 0);
      
      const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);
      
      // Skip if end time goes to next day
      if (endTime.getDate() !== startTime.getDate()) continue;

      const eventTime: EventTimeSlot = {
        startDate: startTime,
        endDate: endTime
      };

      const availabilityStatuses = checkMultiplePeopleAvailability(people, eventTime);
      const availableCount = availabilityStatuses.filter(s => s.status === "available").length;

      if (availableCount > 0) {
        suggestions.push({
          time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
          availableCount,
          details: availabilityStatuses
        });
      }
    }
  }

  return suggestions.sort((a, b) => b.availableCount - a.availableCount);
}
