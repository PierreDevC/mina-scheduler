import { Person } from "@/types/index";
import { mockFriends } from "./mockFriends";

// Define Group interface
export interface Group {
  id: string;
  name: string;
  description: string;
  members: Person[];
  color: string;
  role: string;
  avatar?: string;
  createdDate: string;
  lastActivity: string;
}

// Mock groups data
export const mockGroups: Group[] = [
  {
    id: "1",
    name: "Coffee Only",
    description: "Development team focused on building amazing applications",
    members: mockFriends, // All 4 friends: Pierre, William, Xavier, Alexandre
    color: "bg-amber-500",
    role: "admin",
    avatar: "/api/placeholder/40/40",
    createdDate: "2024-01-01",
    lastActivity: "2024-01-15",
  },
  {
    id: "2",
    name: "Frontend Squad",
    description: "UI/UX specialists and frontend developers",
    members: [mockFriends[0], mockFriends[2]], // Pierre and Xavier
    color: "bg-blue-500",
    role: "member",
    avatar: "/api/placeholder/40/40",
    createdDate: "2024-02-10",
    lastActivity: "2024-02-20",
  },
  {
    id: "3",
    name: "Backend Team",
    description: "Server-side and database experts",
    members: [mockFriends[1], mockFriends[3]], // William and Alexandre
    color: "bg-green-500",
    role: "admin",
    avatar: "/api/placeholder/40/40",
    createdDate: "2024-03-05",
    lastActivity: "2024-03-18",
  },
];

// Helper function to get groups by member
export const getGroupsByMember = (personId: string): Group[] => {
  return mockGroups.filter(group =>
    group.members.some(member => member.id === personId)
  );
};

// Helper function to search groups by name or description
export const searchGroups = (query: string): Group[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockGroups.filter(
    group =>
      group.name.toLowerCase().includes(lowercaseQuery) ||
      group.description.toLowerCase().includes(lowercaseQuery)
  );
};

// Get all unique members from a list of groups
export const getAllMembersFromGroups = (groups: Group[]): Person[] => {
  const memberMap = new Map<string, Person>();

  groups.forEach(group => {
    group.members.forEach(member => {
      if (!memberMap.has(member.id)) {
        memberMap.set(member.id, member);
      }
    });
  });

  return Array.from(memberMap.values());
};
