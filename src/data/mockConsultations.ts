
import { Consultation, ConsultationStatus } from "@/types";

// Mock consultations data for testing and development
const mockConsultations: Consultation[] = [
  {
    id: "1",
    patient: { id: "1", full_name: "John Doe", email: "john@example.com" },
    disease: { id: "1", name_en: "Cold and Flu", name_ar: "البرد والانفلونزا" },
    disease_id: "1",
    description: "I've had a persistent cough and runny nose for the past 3 days.",
    status: ConsultationStatus.PENDING,
    createdAt: "2023-05-15T09:30:00Z",
    diseaseName: "Cold and Flu"
  },
  {
    id: "2",
    patient: { id: "1", full_name: "John Doe", email: "john@example.com" },
    disease: { id: "2", name_en: "Allergies", name_ar: "الحساسية" },
    disease_id: "2",
    description: "Seasonal allergies acting up with sneezing and itchy eyes.",
    status: ConsultationStatus.IN_PROGRESS,
    doctor: { id: "3", full_name: "Dr. Sarah Johnson", specialty: "Immunology" },
    createdAt: "2023-05-10T14:00:00Z",
    diseaseName: "Allergies"
  },
  {
    id: "3",
    patient: { id: "1", full_name: "John Doe", email: "john@example.com" },
    disease: { id: "3", name_en: "Migraine", name_ar: "الصداع النصفي" },
    disease_id: "3",
    description: "Experiencing severe migraines with visual aura and nausea.",
    status: ConsultationStatus.COMPLETED,
    doctor: { id: "4", full_name: "Dr. Michael Brown", specialty: "Neurology" },
    createdAt: "2023-04-28T11:15:00Z",
    diseaseName: "Migraine"
  },
  {
    id: "4",
    patient: { id: "2", full_name: "Jane Smith", email: "jane@example.com" },
    disease: { id: "4", name_en: "Hypertension", name_ar: "ارتفاع ضغط الدم" },
    disease_id: "4",
    description: "Blood pressure readings consistently high over the past week.",
    status: ConsultationStatus.PENDING,
    createdAt: "2023-05-16T08:45:00Z",
    diseaseName: "Hypertension"
  },
  {
    id: "5",
    patient: { id: "2", full_name: "Jane Smith", email: "jane@example.com" },
    disease: { id: "5", name_en: "Diabetes", name_ar: "مرض السكري" },
    disease_id: "5",
    description: "Need guidance on managing glucose levels after recent diagnosis.",
    status: ConsultationStatus.IN_PROGRESS,
    doctor: { id: "5", full_name: "Dr. Emily Chen", specialty: "Endocrinology" },
    createdAt: "2023-05-05T16:30:00Z",
    diseaseName: "Diabetes"
  },
  {
    id: "6",
    patient: { id: "2", full_name: "Jane Smith", email: "jane@example.com" },
    disease: { id: "6", name_en: "Arthritis", name_ar: "التهاب المفاصل" },
    disease_id: "6",
    description: "Joint pain in knees and hands, particularly in the morning.",
    status: ConsultationStatus.COMPLETED,
    doctor: { id: "6", full_name: "Dr. Robert Wilson", specialty: "Rheumatology" },
    createdAt: "2023-04-15T13:20:00Z",
    diseaseName: "Arthritis"
  }
];

export default mockConsultations;
