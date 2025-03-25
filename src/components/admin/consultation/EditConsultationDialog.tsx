import React, { useState, useEffect } from "react";
import { ConsultationStatus } from "@/types";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { consultationService } from "@/services/consultationService";

interface Doctor {
  id: string;
  full_name: string;
}

interface Disease {
  id: string;
  name_en: string;
  name_ar: string;
}

interface EditConsultationDialogProps {
  isOpen: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  diseaseId: string;
  setDiseaseId: (diseaseId: string) => void;
  editStatus: ConsultationStatus;
  setEditStatus: (status: ConsultationStatus) => void;
  selectedDoctorId: string;
  setSelectedDoctorId: (id: string) => void;
  doctors: Doctor[];
  isLoading: boolean;
  onSave: () => Promise<void>;
  consultation?: any;
}

const EditConsultationDialog: React.FC<EditConsultationDialogProps> = ({
  isOpen,
  onOpenChange,
  onClose,
  diseaseId,
  setDiseaseId,
  editStatus,
  setEditStatus,
  selectedDoctorId,
  setSelectedDoctorId,
  doctors,
  isLoading,
  onSave,
  consultation
}) => {
  const [diseases, setDiseases] = useState<Disease[]>([]);
  const [isLoadingDiseases, setIsLoadingDiseases] = useState(false);

  useEffect(() => {
    const fetchDiseases = async () => {
      try {
        setIsLoadingDiseases(true);
        const diseaseData = await consultationService.getAllDiseases();
        setDiseases(diseaseData);
      } catch (error) {
        console.error("Failed to load diseases:", error);
      } finally {
        setIsLoadingDiseases(false);
      }
    };

    if (isOpen) {
      fetchDiseases();
    }
  }, [isOpen]);

  const handleOnOpenChange = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    } else if (!open && onClose) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOnOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Consultation</DialogTitle>
          <DialogDescription>
            Update the consultation details below.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="disease" className="text-sm font-medium">Disease</label>
            <Select
              value={diseaseId}
              onValueChange={(value) => setDiseaseId(value)}
              disabled={isLoadingDiseases}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select disease" />
              </SelectTrigger>
              <SelectContent>
                {diseases.map(disease => (
                  <SelectItem key={disease.id} value={disease.id}>
                    {disease.name_en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">Status</label>
            <Select
              value={editStatus}
              onValueChange={(value) => setEditStatus(value as ConsultationStatus)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ConsultationStatus.PENDING}>Pending</SelectItem>
                <SelectItem value={ConsultationStatus.IN_PROGRESS}>In Progress</SelectItem>
                <SelectItem value={ConsultationStatus.COMPLETED}>Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="doctor" className="text-sm font-medium">Assigned Doctor</label>
            <Select
              value={selectedDoctorId}
              onValueChange={(value) => setSelectedDoctorId(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a doctor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">None (Unassigned)</SelectItem>
                {doctors.map(doctor => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    {doctor.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOnOpenChange(false)}
          >
            <X size={16} className="mr-1" />
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={isLoading}
          >
            <Check size={16} className="mr-1" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditConsultationDialog;
