
import React from "react";
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

interface Doctor {
  id: string;
  full_name: string;
}

interface EditConsultationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editStatus: ConsultationStatus;
  setEditStatus: (status: ConsultationStatus) => void;
  selectedDoctorId: string;
  setSelectedDoctorId: (id: string) => void;
  doctors: Doctor[];
  isLoading: boolean;
  onUpdate: () => Promise<void>;
}

const EditConsultationDialog: React.FC<EditConsultationDialogProps> = ({
  isOpen,
  onOpenChange,
  editStatus,
  setEditStatus,
  selectedDoctorId,
  setSelectedDoctorId,
  doctors,
  isLoading,
  onUpdate,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Consultation</DialogTitle>
          <DialogDescription>
            Update the status and doctor assignment for this consultation.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">
              Status
            </label>
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
            <label htmlFor="doctor" className="text-sm font-medium">
              Assigned Doctor
            </label>
            <Select value={selectedDoctorId} onValueChange={setSelectedDoctorId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a doctor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None (Unassigned)</SelectItem>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    {doctor.full_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X size={16} className="mr-2" />
            Cancel
          </Button>
          <Button onClick={onUpdate} disabled={isLoading}>
            <Check size={16} className="mr-2" />
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditConsultationDialog;
