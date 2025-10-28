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
  "1": { // Pierre-Sylvestre Cypré - Early bird, prefers mornings
    ...mockUserAvailability,
    id: "pierre-availability",
    userId: "1",
    availabilitySlots: [
      {
        id: "pierre-mon",
        dayOfWeek: 1,
        timeSlots: [
          { startTime: "08:00", endTime: "12:00" },
          { startTime: "13:00", endTime: "15:00" }
        ],
        isRecurring: true
      },
      {
        id: "pierre-tue",
        dayOfWeek: 2,
        timeSlots: [
          { startTime: "08:00", endTime: "12:00" },
          { startTime: "14:00", endTime: "16:00" }
        ],
        isRecurring: true
      },
      {
        id: "pierre-wed",
        dayOfWeek: 3,
        timeSlots: [
          { startTime: "08:00", endTime: "12:00" }
        ],
        isRecurring: true
      },
      {
        id: "pierre-thu",
        dayOfWeek: 4,
        timeSlots: [
          { startTime: "08:00", endTime: "12:00" },
          { startTime: "13:00", endTime: "15:00" }
        ],
        isRecurring: true
      },
      {
        id: "pierre-fri",
        dayOfWeek: 5,
        timeSlots: [
          { startTime: "08:00", endTime: "13:00" }
        ],
        isRecurring: true
      }
    ]
  },
  "2": { // William Descoteaux - Full-time, standard hours
    ...mockUserAvailability,
    id: "william-availability",
    userId: "2",
    availabilitySlots: [
      {
        id: "william-mon",
        dayOfWeek: 1,
        timeSlots: [
          { startTime: "09:00", endTime: "12:00" },
          { startTime: "13:00", endTime: "17:00" }
        ],
        isRecurring: true
      },
      {
        id: "william-tue",
        dayOfWeek: 2,
        timeSlots: [
          { startTime: "09:00", endTime: "12:00" },
          { startTime: "13:00", endTime: "17:00" }
        ],
        isRecurring: true
      },
      {
        id: "william-wed",
        dayOfWeek: 3,
        timeSlots: [
          { startTime: "09:00", endTime: "17:00" } // No lunch break Wednesday
        ],
        isRecurring: true
      },
      {
        id: "william-thu",
        dayOfWeek: 4,
        timeSlots: [
          { startTime: "09:00", endTime: "12:00" },
          { startTime: "13:00", endTime: "17:00" }
        ],
        isRecurring: true
      },
      {
        id: "william-fri",
        dayOfWeek: 5,
        timeSlots: [
          { startTime: "09:00", endTime: "12:00" },
          { startTime: "13:00", endTime: "16:00" }
        ],
        isRecurring: true
      }
    ]
  },
  "3": { // Xavier Giguère - Afternoon person, late starter
    ...mockUserAvailability,
    id: "xavier-availability",
    userId: "3",
    availabilitySlots: [
      {
        id: "xavier-mon",
        dayOfWeek: 1,
        timeSlots: [
          { startTime: "12:00", endTime: "18:00" }
        ],
        isRecurring: true
      },
      {
        id: "xavier-tue",
        dayOfWeek: 2,
        timeSlots: [
          { startTime: "10:00", endTime: "14:00" },
          { startTime: "15:00", endTime: "18:00" }
        ],
        isRecurring: true
      },
      {
        id: "xavier-wed",
        dayOfWeek: 3,
        timeSlots: [
          { startTime: "13:00", endTime: "19:00" }
        ],
        isRecurring: true
      },
      {
        id: "xavier-thu",
        dayOfWeek: 4,
        timeSlots: [
          { startTime: "11:00", endTime: "17:00" }
        ],
        isRecurring: true
      },
      {
        id: "xavier-fri",
        dayOfWeek: 5,
        timeSlots: [
          { startTime: "12:00", endTime: "17:00" }
        ],
        isRecurring: true
      }
    ]
  },
  "4": { // Alexandre Emond - Flexible, but many small gaps
    ...mockUserAvailability,
    id: "alexandre-availability",
    userId: "4",
    availabilitySlots: [
      {
        id: "alexandre-mon",
        dayOfWeek: 1,
        timeSlots: [
          { startTime: "10:00", endTime: "11:30" },
          { startTime: "14:00", endTime: "16:00" }
        ],
        isRecurring: true
      },
      {
        id: "alexandre-tue",
        dayOfWeek: 2,
        timeSlots: [
          { startTime: "09:00", endTime: "11:00" },
          { startTime: "13:00", endTime: "15:00" },
          { startTime: "16:00", endTime: "17:30" }
        ],
        isRecurring: true
      },
      {
        id: "alexandre-wed",
        dayOfWeek: 3,
        timeSlots: [
          { startTime: "10:00", endTime: "12:00" },
          { startTime: "14:00", endTime: "17:00" }
        ],
        isRecurring: true
      },
      {
        id: "alexandre-thu",
        dayOfWeek: 4,
        timeSlots: [
          { startTime: "09:00", endTime: "12:00" },
          { startTime: "15:00", endTime: "18:00" }
        ],
        isRecurring: true
      },
      {
        id: "alexandre-fri",
        dayOfWeek: 5,
        timeSlots: [
          { startTime: "10:00", endTime: "14:00" }
        ],
        isRecurring: true
      }
    ]
  }
};

// Extend availability for more people with default patterns
for (let i = 5; i <= 12; i++) {
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
 * Suggest best times based on people availability with multi-day search
 */
export function suggestBestTimes(
  people: Person[],
  targetDate: Date,
  durationMinutes: number = 60
): Array<{
  time: string;
  date: Date;
  availableCount: number;
  details: AvailabilityStatus[];
  score: number;
  daysFromTarget: number;
  dayName: string;
}> {
  const suggestions: Array<{
    time: string;
    date: Date;
    availableCount: number;
    details: AvailabilityStatus[];
    score: number;
    daysFromTarget: number;
    dayName: string;
  }> = [];

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Search across 7 days starting from target date
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const currentDate = new Date(targetDate);
    currentDate.setDate(currentDate.getDate() + dayOffset);
    currentDate.setHours(0, 0, 0, 0);

    // Check availability every 30 minutes from 8:00 to 18:00
    for (let hour = 8; hour <= 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const startTime = new Date(currentDate);
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

        // Only include slots where at least one person is available
        if (availableCount > 0) {
          // Calculate score based on:
          // 1. Number of available people (weight: 50)
          // 2. Proximity to target date (weight: 30)
          // 3. Proximity to target time (weight: 20)

          const availabilityScore = (availableCount / people.length) * 50;

          // Penalty for being further from target date (max 30 points)
          const dateProximityScore = Math.max(0, 30 - (dayOffset * 5));

          // Bonus for being close to target time (max 20 points)
          const targetHour = targetDate.getHours();
          const targetMinute = targetDate.getMinutes();
          const timeDiffMinutes = Math.abs((hour * 60 + minute) - (targetHour * 60 + targetMinute));
          const timeProximityScore = Math.max(0, 20 - (timeDiffMinutes / 30));

          const totalScore = availabilityScore + dateProximityScore + timeProximityScore;

          suggestions.push({
            time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
            date: new Date(startTime),
            availableCount,
            details: availabilityStatuses,
            score: totalScore,
            daysFromTarget: dayOffset,
            dayName: dayNames[currentDate.getDay()]
          });
        }
      }
    }
  }

  // Sort by score (highest first), then by available count, then by days from target
  return suggestions
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.availableCount !== a.availableCount) return b.availableCount - a.availableCount;
      return a.daysFromTarget - b.daysFromTarget;
    })
    .slice(0, 4); // Return top 4 suggestions
}
