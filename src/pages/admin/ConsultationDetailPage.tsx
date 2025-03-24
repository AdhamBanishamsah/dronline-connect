
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useConsultations } from "@/context/ConsultationContext";
import { ConsultationStatus, UserRole, Consultation } from "@/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Send, Check, X, Edit, UserPlus } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

interface Doctor {
  id: string;
  full_name: string;
}

const AdminConsultationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getConsultationById, updateConsultationStatus, addConsultationComment } = useConsultations();
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [commentText, setCommentText] = useState("");
  const [isSendingComment, setIsSendingComment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editStatus, setEditStatus] = useState<ConsultationStatus>(ConsultationStatus.PENDING);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch doctors for assignment
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
      
      // First update the status
      await updateConsultationStatus(consultation.id, editStatus);
      
      // Then update the doctor assignment if it changed
      if (selectedDoctorId !== consultation.doctorId) {
        // Update doctor assignment in database
        const { error } = await supabase
          .from("consultations")
          .update({ doctor_id: selectedDoctorId || null })
          .eq("id", consultation.id);
          
        if (error) throw error;
      }
      
      // Refresh consultation after update
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

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim() || !id) return;
    
    try {
      setIsSendingComment(true);
      await addConsultationComment(id, commentText);
      setCommentText("");
      
      // Refresh consultation data
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

  const getStatusBadge = (status: ConsultationStatus) => {
    switch (status) {
      case ConsultationStatus.PENDING:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case ConsultationStatus.IN_PROGRESS:
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case ConsultationStatus.COMPLETED:
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getDoctorName = () => {
    if (!consultation.doctorId) return "Not assigned";
    
    const doctor = doctors.find(d => d.id === consultation.doctorId);
    return doctor ? doctor.full_name : consultation.doctorId;
  };

  const renderComments = () => {
    if (!consultation.comments || consultation.comments.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No comments yet.
        </div>
      );
    }

    return consultation.comments.map((comment) => (
      <div 
        key={comment.id} 
        className={`mb-4 ${comment.userRole === UserRole.PATIENT ? "flex justify-end" : ""}`}
      >
        <div 
          className={`max-w-[80%] p-3 rounded-lg ${
            comment.userRole === UserRole.PATIENT 
              ? "bg-blue-100 text-blue-900 rounded-tr-none" 
              : comment.userRole === UserRole.ADMIN
                ? "bg-purple-100 text-purple-900 rounded-tl-none"
                : "bg-gray-100 text-gray-800 rounded-tl-none"
          }`}
        >
          <div className="text-sm mb-1">
            {comment.userRole === UserRole.PATIENT ? "Patient" : 
             comment.userRole === UserRole.DOCTOR ? "Doctor" : "Admin"}
          </div>
          <div className="break-words">{comment.content}</div>
          <div className="text-xs opacity-70 mt-1 text-right">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </div>
        </div>
      </div>
    ));
  };

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

      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="p-6 border-b">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold">{consultation.disease}</h1>
            <div className="flex items-center space-x-2">
              {consultation.doctorId ? (
                <Badge className="bg-teal-100 text-teal-800">
                  <UserPlus size={14} className="mr-1" />
                  Assigned
                </Badge>
              ) : (
                <Badge className="bg-gray-100 text-gray-800">
                  <UserPlus size={14} className="mr-1" />
                  Unassigned
                </Badge>
              )}
              {getStatusBadge(consultation.status)}
            </div>
          </div>
          
          <div className="text-sm text-gray-500 mb-4">
            Created {formatDistanceToNow(new Date(consultation.createdAt), { addSuffix: true })}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Patient ID</h3>
                <p className="mt-1">{consultation.patientId}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Doctor</h3>
                <p className="mt-1">{getDoctorName()}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Created Date</h3>
                <p className="mt-1">{format(new Date(consultation.createdAt), "PPP p")}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="mt-1">{consultation.description}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Symptoms</h3>
                <p className="mt-1">{consultation.symptoms}</p>
              </div>
            </div>
          </div>
          
          {consultation.images && consultation.images.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Uploaded Images</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {consultation.images.map((image, index) => (
                  <img 
                    key={index} 
                    src={image} 
                    alt={`Medical image ${index + 1}`} 
                    className="rounded-md h-32 w-full object-cover"
                  />
                ))}
              </div>
            </div>
          )}
          
          {consultation.voiceMemo && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Voice Memo</h3>
              <audio controls src={consultation.voiceMemo} className="w-full" />
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Conversation</h2>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 h-[400px] overflow-y-auto mb-4">
            {renderComments()}
          </div>
          
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <Textarea
              placeholder="Add an administrative comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="flex-1"
            />
            <Button 
              type="submit" 
              className="bg-medical-primary hover:opacity-90"
              disabled={isSendingComment || !commentText.trim()}
            >
              <Send size={16} />
            </Button>
          </form>
        </div>
      </div>
      
      {/* Edit Consultation Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Consultation</DialogTitle>
            <DialogDescription>
              Update the status and doctor assignment for this consultation.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">Status</label>
              <Select value={editStatus} onValueChange={(value) => setEditStatus(value as ConsultationStatus)}>
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
                onValueChange={setSelectedDoctorId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a doctor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None (Unassigned)</SelectItem>
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
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              <X size={16} className="mr-2" />
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus} disabled={isLoading}>
              <Check size={16} className="mr-2" />
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminConsultationDetailPage;
