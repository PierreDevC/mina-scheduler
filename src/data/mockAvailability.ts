import { UserAvailability, AvailabilitySlot, TimeSlot } from "@/types/index";

// Mock availability data for demonstration
export const defaultAvailabilitySlots: AvailabilitySlot[] = [
  {
    id: "mon-work",
    dayOfWeek: 1, // Monday
    timeSlots: [
      { startTime: "09:00", endTime: "12:00" },
      { startTime: "13:00", endTime: "17:00" }
    ],
    isRecurring: true
  },
  {
    id: "tue-work", 
    dayOfWeek: 2, // Tuesday
    timeSlots: [
      { startTime: "09:00", endTime: "12:00" },
      { startTime: "13:00", endTime: "17:00" }
    ],
    isRecurring: true
  },
  {
    id: "wed-work",
    dayOfWeek: 3, // Wednesday
    timeSlots: [
      { startTime: "09:00", endTime: "12:00" },
      { startTime: "13:00", endTime: "17:00" }
    ],
    isRecurring: true
  },
  {
    id: "thu-work",
    dayOfWeek: 4, // Thursday
    timeSlots: [
      { startTime: "09:00", endTime: "12:00" },
      { startTime: "13:00", endTime: "17:00" }
    ],
    isRecurring: true
  },
  {
    id: "fri-work",
    dayOfWeek: 5, // Friday
    timeSlots: [
      { startTime: "09:00", endTime: "12:00" },
      { startTime: "13:00", endTime: "16:00" }
    ],
    isRecurring: true
  }
];

export const mockUserAvailability: UserAvailability = {
  id: "user-availability-1",
  userId: "current-user",
  availabilitySlots: defaultAvailabilitySlots,
  timezone: "Europe/Paris",
  lastUpdated: new Date()
};

// Helper functions
export const getDayName = (dayOfWeek: number): string => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[dayOfWeek];
};

export const getShortDayName = (dayOfWeek: number): string => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[dayOfWeek];
};

export const formatTimeSlot = (timeSlot: TimeSlot): string => {
  return `${timeSlot.startTime} - ${timeSlot.endTime}`;
};

export const createEmptyTimeSlot = (): TimeSlot => ({
  startTime: "09:00",
  endTime: "17:00"
});

export const createEmptyAvailabilitySlot = (dayOfWeek: number): AvailabilitySlot => ({
  id: `day-${dayOfWeek}-${Date.now()}`,
  dayOfWeek,
  timeSlots: [createEmptyTimeSlot()],
  isRecurring: true
});

// Preset availability patterns
export const availabilityPresets = {
  fullTime: {
    name: "Full-time (9am-5pm)",
    description: "Monday to Friday, 9am-5pm with lunch break",
    slots: defaultAvailabilitySlots
  },
  partTime: {
    name: "Part-time (9am-1pm)",
    description: "Monday to Friday, mornings only",
    slots: [1, 2, 3, 4, 5].map(day => ({
      id: `part-time-${day}`,
      dayOfWeek: day,
      timeSlots: [{ startTime: "09:00", endTime: "13:00" }],
      isRecurring: true
    }))
  },
  flexible: {
    name: "Flexible hours",
    description: "Variable availability depending on the day",
    slots: [
      {
        id: "flex-mon",
        dayOfWeek: 1,
        timeSlots: [{ startTime: "10:00", endTime: "16:00" }],
        isRecurring: true
      },
      {
        id: "flex-tue",
        dayOfWeek: 2,
        timeSlots: [
          { startTime: "08:00", endTime: "12:00" },
          { startTime: "14:00", endTime: "18:00" }
        ],
        isRecurring: true
      },
      {
        id: "flex-wed",
        dayOfWeek: 3,
        timeSlots: [{ startTime: "09:00", endTime: "15:00" }],
        isRecurring: true
      },
      {
        id: "flex-thu",
        dayOfWeek: 4,
        timeSlots: [{ startTime: "11:00", endTime: "17:00" }],
        isRecurring: true
      },
      {
        id: "flex-fri",
        dayOfWeek: 5,
        timeSlots: [{ startTime: "09:00", endTime: "14:00" }],
        isRecurring: true
      }
    ]
  }
};
