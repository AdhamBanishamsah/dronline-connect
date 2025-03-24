
import { Consultation, ConsultationStatus } from "@/types";

// Mock consultations for development
export const MOCK_CONSULTATIONS: Consultation[] = [
  {
    id: "1",
    patientId: "1",
    disease: "Arthritis",
    description: "Jjjwww",
    symptoms: "Joint pain, stiffness",
    status: ConsultationStatus.PENDING,
    createdAt: "2023-02-28T13:15:00Z",
  },
  {
    id: "2",
    patientId: "1",
    disease: "Depression",
    description: "depression",
    symptoms: "Sadness, fatigue",
    status: ConsultationStatus.PENDING,
    createdAt: "2023-02-27T10:30:00Z",
  },
  {
    id: "3",
    patientId: "1",
    disease: "Eczema",
    description: "Description",
    symptoms: "Itchy skin",
    status: ConsultationStatus.PENDING,
    createdAt: "2023-02-27T08:51:00Z",
  },
  {
    id: "4",
    patientId: "1",
    disease: "Diabetes",
    description: "666666",
    symptoms: "Increased thirst",
    status: ConsultationStatus.PENDING,
    createdAt: "2023-02-26T19:28:00Z",
  },
  {
    id: "5",
    patientId: "1",
    disease: "Diabetes",
    description: "55555",
    symptoms: "Increased thirst",
    status: ConsultationStatus.PENDING,
    createdAt: "2023-02-26T19:23:00Z",
  },
  {
    id: "6",
    patientId: "1",
    disease: "Depression",
    description: "tetete",
    symptoms: "Sadness",
    status: ConsultationStatus.PENDING,
    createdAt: "2023-02-26T18:45:00Z",
  },
];
