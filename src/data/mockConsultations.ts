
import { Consultation, ConsultationStatus } from "@/types";

// Mock consultations data for testing and development
const mockConsultations: Consultation[] = [
  {
    id: "1",
    patientId: "1",
    disease: { id: "1", name_en: "Cold and Flu", name_ar: "البرد والانفلونزا" },
    disease_id: "1",
    description: "I've had a persistent cough and runny nose for the past 3 days.",
    symptoms: "Cough, runny nose, sore throat",
    status: ConsultationStatus.PENDING,
    createdAt: "2023-05-15T09:30:00Z",
    diseaseName: "Cold and Flu"
  },
  {
    id: "2",
    patientId: "1",
    disease: { id: "2", name_en: "Allergies", name_ar: "الحساسية" },
    disease_id: "2",
    description: "Seasonal allergies acting up with sneezing and itchy eyes.",
    symptoms: "Sneezing, itchy eyes, runny nose",
    status: ConsultationStatus.IN_PROGRESS,
    doctorId: "3",
    createdAt: "2023-05-10T14:00:00Z",
    diseaseName: "Allergies"
  },
  {
    id: "3",
    patientId: "1",
    disease: { id: "3", name_en: "Migraine", name_ar: "الصداع النصفي" },
    disease_id: "3",
    description: "Experiencing severe migraines with visual aura and nausea.",
    symptoms: "Headache, visual aura, nausea",
    status: ConsultationStatus.COMPLETED,
    doctorId: "4",
    createdAt: "2023-04-28T11:15:00Z",
    diseaseName: "Migraine"
  },
  {
    id: "4",
    patientId: "2",
    disease: { id: "4", name_en: "Hypertension", name_ar: "ارتفاع ضغط الدم" },
    disease_id: "4",
    description: "Blood pressure readings consistently high over the past week.",
    symptoms: "High blood pressure readings, headache",
    status: ConsultationStatus.PENDING,
    createdAt: "2023-05-16T08:45:00Z",
    diseaseName: "Hypertension"
  },
  {
    id: "5",
    patientId: "2",
    disease: { id: "5", name_en: "Diabetes", name_ar: "مرض السكري" },
    disease_id: "5",
    description: "Need guidance on managing glucose levels after recent diagnosis.",
    symptoms: "High glucose levels, increased thirst",
    status: ConsultationStatus.IN_PROGRESS,
    doctorId: "5",
    createdAt: "2023-05-05T16:30:00Z",
    diseaseName: "Diabetes"
  },
  {
    id: "6",
    patientId: "2",
    disease: { id: "6", name_en: "Arthritis", name_ar: "التهاب المفاصل" },
    disease_id: "6",
    description: "Joint pain in knees and hands, particularly in the morning.",
    symptoms: "Joint pain, stiffness, swelling",
    status: ConsultationStatus.COMPLETED,
    doctorId: "6",
    createdAt: "2023-04-15T13:20:00Z",
    diseaseName: "Arthritis"
  }
];

export default mockConsultations;
