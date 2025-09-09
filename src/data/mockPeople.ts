import { Person } from "@/types/index";

// Mock data for demonstration purposes - people available to invite to events
export const mockPeople: Person[] = [
  {
    id: "1",
    name: "Alice Dubois",
    email: "alice.dubois@company.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice",
    department: "Development"
  },
  {
    id: "2", 
    name: "Jean Martin",
    email: "jean.martin@company.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jean",
    department: "Marketing"
  },
  {
    id: "3",
    name: "Sophie Lefebvre", 
    email: "sophie.lefebvre@company.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
    department: "Design"
  },
  {
    id: "4",
    name: "Lara Moreau",
    email: "lara.moreau@company.com", 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lara",
    department: "Development"
  },
  {
    id: "5",
    name: "Marie Bernard",
    email: "marie.bernard@company.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marie",
    department: "Project Management"
  },
  {
    id: "6",
    name: "Lucas Petit",
    email: "lucas.petit@company.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas",
    department: "Development"
  },
  {
    id: "7",
    name: "Emma Robert",
    email: "emma.robert@company.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    department: "Design"
  },
  {
    id: "8",
    name: "Thomas Richard",
    email: "thomas.richard@company.com", 
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas",
    department: "Marketing"
  },
  {
    id: "9",
    name: "Camille Simon",
    email: "camille.simon@company.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Camille",
    department: "Human Resources"
  },
  {
    id: "10",
    name: "Antoine Laurent",
    email: "antoine.laurent@company.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Antoine",
    department: "Project Management"
  },
  {
    id: "11",
    name: "Julie Michel",
    email: "julie.michel@company.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Julie",
    department: "Finance"
  },
  {
    id: "12",
    name: "Nicolas Garcia",
    email: "nicolas.garcia@company.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nicolas",
    department: "Development"
  }
];

// Helper function to get people by department
export const getPeopleByDepartment = (department: string): Person[] => {
  return mockPeople.filter(person => person.department === department);
};

// Helper function to search people by name or email
export const searchPeople = (query: string): Person[] => {
  const lowercaseQuery = query.toLowerCase();
  return mockPeople.filter(
    person => 
      person.name.toLowerCase().includes(lowercaseQuery) ||
      person.email.toLowerCase().includes(lowercaseQuery)
  );
};

// Get all unique departments
export const getDepartments = (): string[] => {
  const departments = mockPeople.map(person => person.department).filter(Boolean) as string[];
  return [...new Set(departments)].sort();
};
