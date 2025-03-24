
import { User, UserRole } from "@/types";

// Define a more specific type for mock users that includes the password field
export type MockUser = User & { password: string };

// Mock user data for development
export const MOCK_USERS: MockUser[] = [
  {
    id: "1",
    email: "patient@example.com",
    password: "password",
    fullName: "Patient User",
    role: UserRole.PATIENT,
    phoneNumber: "97743495",
    dateOfBirth: "1980-08-15",
  },
  {
    id: "2",
    email: "doctor@example.com",
    password: "password",
    fullName: "Doctor User",
    role: UserRole.DOCTOR,
    specialty: "General Medicine",
    isApproved: true,
  },
  {
    id: "3",
    email: "admin@example.com",
    password: "password",
    fullName: "Admin User",
    role: UserRole.ADMIN,
  },
];
