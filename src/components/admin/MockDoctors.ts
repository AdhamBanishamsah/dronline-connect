
import { Doctor } from "./DoctorTypes";

// Mock doctors for development
export const MOCK_DOCTORS: Doctor[] = [
  {
    id: "1",
    fullName: "Dr. John Smith",
    specialty: "Cardiology",
    isApproved: false,
    createdAt: "2023-06-01T10:00:00Z"
  },
  {
    id: "2",
    fullName: "Dr. Sarah Johnson",
    specialty: "Neurology",
    isApproved: true,
    createdAt: "2023-05-28T09:30:00Z"
  },
  {
    id: "3",
    fullName: "Dr. Michael Chen",
    specialty: "Orthopedics",
    isApproved: false,
    createdAt: "2023-06-02T14:15:00Z"
  },
  {
    id: "4",
    fullName: "Dr. Emily Rodriguez",
    specialty: "Pediatrics",
    isApproved: true,
    createdAt: "2023-05-20T11:45:00Z"
  }
];
