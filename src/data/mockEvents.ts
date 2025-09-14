import { Event } from "@/types/index";

// Helper function to get dates relative to today
const getDateFromToday = (daysOffset: number, hour: number, minute: number = 0) => {
  const today = new Date();
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + daysOffset);
  targetDate.setHours(hour, minute, 0, 0);
  return targetDate;
};

// Convert the events view format to the Event interface format
export const mockEvents: Event[] = [
  {
    id: "1",
    title: "Gym Session with friends",
    description: "Weekly workout session with the team",
    startDate: getDateFromToday(1, 18, 0), // Tomorrow at 6 PM
    endDate: getDateFromToday(1, 19, 30), // Tomorrow at 7:30 PM
    variant: "danger",
    invitedPeople: [
      {
        id: "1",
        name: "Pierre-Sylvestre Cypré",
        email: "pierre@example.com",
        avatar: "",
        department: "Development"
      }
    ],
    isAllDay: false,
  },
  {
    id: "2",
    title: "Flutter presentation",
    description: "Presentation on Flutter development best practices",
    startDate: getDateFromToday(2, 14, 0), // Day after tomorrow at 2 PM
    endDate: getDateFromToday(2, 15, 0), // Day after tomorrow at 3 PM
    variant: "primary",
    invitedPeople: [
      {
        id: "2",
        name: "Xavier Giguère",
        email: "xavier@example.com",
        avatar: "",
        department: "Development"
      }
    ],
    isAllDay: false,
  },
  {
    id: "3",
    title: "Meeting with devs",
    description: "Development team sync and planning session",
    startDate: getDateFromToday(3, 10, 0), // 3 days from now at 10 AM
    endDate: getDateFromToday(3, 12, 0), // 3 days from now at 12 PM
    variant: "warning",
    invitedPeople: [
      {
        id: "3",
        name: "William Descoteaux",
        email: "william@example.com",
        avatar: "",
        department: "Development"
      }
    ],
    isAllDay: false,
  },
  {
    id: "4",
    title: "Project Review",
    description: "Monthly project review meeting",
    startDate: getDateFromToday(-30, 15, 0), // 30 days ago (past event)
    endDate: getDateFromToday(-30, 16, 30), // 30 days ago
    variant: "success",
    invitedPeople: [
      {
        id: "4",
        name: "Alexandre Emond",
        email: "alexandre@example.com",
        avatar: "",
        department: "Management"
      }
    ],
    isAllDay: false,
  },
  {
    id: "5",
    title: "Team Building Event",
    description: "Quarterly team building activity",
    startDate: getDateFromToday(7, 9, 0), // Next week at 9 AM
    endDate: getDateFromToday(7, 13, 0), // Next week at 1 PM
    variant: "success",
    invitedPeople: [
      {
        id: "5",
        name: "Sophie Lefebvre",
        email: "sophie@example.com",
        avatar: "",
        department: "HR"
      }
    ],
    isAllDay: false,
  },
  {
    id: "6",
    title: "Client Meeting",
    description: "Important client presentation",
    startDate: getDateFromToday(0, 11, 0), // Today at 11 AM
    endDate: getDateFromToday(0, 13, 0), // Today at 1 PM
    variant: "warning",
    invitedPeople: [
      {
        id: "6",
        name: "Lara Moreau",
        email: "lara@example.com",
        avatar: "",
        department: "Sales"
      }
    ],
    isAllDay: false,
  },
  {
    id: "7",
    title: "Code Review Session",
    description: "Weekly code review with the team",
    startDate: getDateFromToday(4, 16, 0), // 4 days from now at 4 PM
    endDate: getDateFromToday(4, 17, 0), // 4 days from now at 5 PM
    variant: "default",
    invitedPeople: [
      {
        id: "7",
        name: "Thomas Richard",
        email: "thomas@example.com",
        avatar: "",
        department: "Development"
      }
    ],
    isAllDay: false,
  },
];

// Helper functions to convert between formats for backward compatibility
export const getEventsForEventsView = () => {
  return mockEvents.map(event => ({
    id: parseInt(event.id),
    title: event.title,
    description: event.description || "",
    date: event.startDate.toISOString().split('T')[0],
    time: event.startDate.toTimeString().slice(0, 5),
    duration: `${Math.round((event.endDate.getTime() - event.startDate.getTime()) / (1000 * 60))}min`,
    location: "Office", // Default location
    attendees: event.invitedPeople?.length || 1,
    type: getEventTypeFromVariant(event.variant),
    priority: getPriorityFromVariant(event.variant),
    organizer: event.invitedPeople?.[0]?.name || "Unknown",
    status: getStatusFromDate(event.startDate),
    isRecurring: false,
  }));
};

function getEventTypeFromVariant(variant?: string): string {
  switch (variant) {
    case "danger": return "workout";
    case "primary": return "presentation";
    case "warning": return "meeting";
    case "success": return "workshop";
    default: return "review";
  }
}

function getPriorityFromVariant(variant?: string): string {
  switch (variant) {
    case "danger": return "low";
    case "primary": return "medium";
    case "warning": return "high";
    case "success": return "medium";
    default: return "low";
  }
}

function getStatusFromDate(date: Date): string {
  const now = new Date();
  if (date < now) return "past";
  return "confirmed";
}