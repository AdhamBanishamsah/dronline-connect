
import { Doctor } from "./DoctorTypes";

// Mock doctor data for the admin dashboard
export const MOCK_DOCTORS: Doctor[] = [
  {
    id: "2",
    email: "doctor@example.com",
    fullName: "Dr. John Smith",
    specialty: "General Medicine",
    isApproved: true,
    createdAt: "2023-06-15T10:00:00Z",
  },
  {
    id: "4",
    email: "amira@example.com",
    fullName: "Dr. Amira Hassan",
    specialty: "Pediatrics",
    isApproved: false,
    createdAt: "2023-06-18T09:30:00Z",
  },
  {
    id: "5",
    email: "mohammed@example.com",
    fullName: "Dr. Mohammed Ali",
    specialty: "Cardiology",
    isApproved: false,
    createdAt: "2023-06-20T11:15:00Z",
  },
  {
    id: "6",
    email: "sarah@example.com",
    fullName: "Dr. Sarah Johnson",
    specialty: "Dermatology",
    isApproved: true,
    createdAt: "2023-06-10T14:20:00Z",
  },
];
