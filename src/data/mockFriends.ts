import { Person } from "@/types/index";

// Mock friends data that matches the Person interface - from the friends view
export const mockFriends: Person[] = [
  {
    id: "1",
    name: "Pierre-Sylvestre Cypré",
    email: "pierre@gmail.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pierre",
    department: "Development"
  },
  {
    id: "2",
    name: "William Descoteaux", 
    email: "william@gmail.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=William",
    department: "Development"
  },
  {
    id: "3",
    name: "Xavier Giguère",
    email: "xavier@gmail.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Xavier",
    department: "Development"
  },
  {
    id: "4",
    name: "Alexandre Emond",
    email: "alexandre@gmail.com", 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alexandre",
    department: "Development"
  }
];

// Helper function to get people by department
export const getFriendsByDepartment = (department: string): Person[] => {
  return mockFriends.filter(person => person.department === department);
};

// Helper function to search friends by name or email
export const searchFriends = (query: string): Person[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockFriends.filter(
    person => 
      person.name.toLowerCase().includes(lowercaseQuery) ||
      person.email.toLowerCase().includes(lowercaseQuery)
  );
};

// Get all unique departments
export const getFriendsDepartments = (): string[] => {
  const departments = mockFriends.map(person => person.department).filter(Boolean) as string[];
  return [...new Set(departments)].sort();
};