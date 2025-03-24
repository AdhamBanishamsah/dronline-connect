import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useConsultations } from "@/context/ConsultationContext";
import { ConsultationStatus, Consultation } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import EditConsultationDialog from "@/components/admin/consultation/EditConsultationDialog";
import ConsultationInfo from "@/components/admin/consultation/ConsultationInfo";
import ConsultationComments from "@/components/admin/consultation/ConsultationComments";

interface Doctor {
  id: string;
  full_name: string;
}

const AdminConsultationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getConsultationById, updateConsultationStatus, addConsultationComment } = useConsultations();
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [isSendingComment, setIsSendingComment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editStatus, setEditStatus] = useState<ConsultationStatus>(ConsultationStatus.PENDING);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("id, full_name")
          .eq("role", "doctor")
          .eq("is_approved", true);
          
        if (error) throw error;
        
        setDoctors(data || []);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
    
    fetchDoctors();
  }, []);

  useEffect(() => {
    const loadConsultation = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const data = await getConsultationById(id);
        setConsultation(data);
        if (data) {
          setEditStatus(data.status);
          setSelectedDoctorId(data.doctorId || "");
        }
      } catch (error) {
        console.error("Error loading consultation:", error);
        toast({
          title: "Error",
          description: "Failed to load consultation details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadConsultation();
  }, [id, getConsultationById, toast]);

  const handleUpdateStatus = async () => {
    if (!consultation) return;
    
    try {
      setIsLoading(true);
      
      await updateConsultationStatus(consultation.id, editStatus);
      
      if (selectedDoctorId !== consultation.doctorId) {
        const { error } = await supabase
          .from("consultations")
          .update({ doctor_id: selectedDoctorId || null })
          .eq("id", consultation.id);
          
        if (error) throw error;
      }
      
      const updatedConsultation = await getConsultationById(id!);
      setConsultation(updatedConsultation);
      
      toast({
        title: "Consultation updated",
        description: "Status and doctor assignment updated successfully",
      });
      
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating consultation:", error);
      toast({
        title: "Error",
        description: "Failed to update consultation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async (content: string) => {
    if (!id) return;
    
    try {
      setIsSendingComment(true);
      await addConsultationComment(id, content);
      
      const updatedConsultation = await getConsultationById(id);
      setConsultation(updatedConsultation);
      
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully",
      });
    } catch (error) {
      console.error("Failed to add comment:", error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    } finally {
      setIsSendingComment(false);
    }
  };

  if (isLoading && !consultation) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading consultation details...</p>
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-medium mb-2">Consultation not found</h2>
        <p className="text-gray-600 mb-6">The consultation you're looking for doesn't exist or you don't have access to it.</p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex justify-between items-center">
        <Link to="/admin/dashboard" className="inline-flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft size={16} className="mr-2" />
          Back to Dashboard
        </Link>
        <Button
          variant="outline"
          onClick={() => setIsEditDialogOpen(true)}
          className="border-medical-primary text-medical-primary hover:bg-blue-50"
        >
          <Edit size={16} className="mr-2" />
          Edit Consultation
        </Button>
      </div>

      <ConsultationInfo consultation={consultation} doctors={doctors} />
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <ConsultationComments 
          comments={consultation.comments || []}
          onAddComment={handleAddComment}
          isSendingComment={isSendingComment}
        />
      </div>
      
      <EditConsultationDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        editStatus={editStatus}
        setEditStatus={setEditStatus}
        selectedDoctorId={selectedDoctorId}
        setSelectedDoctorId={setSelectedDoctorId}
        doctors={doctors}
        isLoading={isLoading}
        onSave={handleUpdateStatus}
        disease={consultation.disease}
        setDisease={(value: string) => {
          console.log("Disease updated:", value);
        }}
      />
    </div>
  );
};

export default AdminConsultationDetailPage;
