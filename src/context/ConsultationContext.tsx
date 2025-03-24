
import React, { createContext, useContext, useState, useEffect } from "react";
import { Consultation, ConsultationStatus, UserRole } from "@/types";
import { useAuth } from "./AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ConsultationContextType {
  consultations: Consultation[];
  isLoading: boolean;
  createConsultation: (consultationData: Partial<Consultation>) => Promise<void>;
  getConsultationsByUserId: (userId: string, role: UserRole) => Promise<Consultation[]>;
  getConsultationById: (id: string) => Promise<Consultation | null>;
  updateConsultationStatus: (id: string, status: ConsultationStatus) => Promise<void>;
  assignConsultation: (consultationId: string, doctorId: string) => Promise<void>;
  addConsultationComment: (consultationId: string, content: string) => Promise<void>;
}

const ConsultationContext = createContext<ConsultationContextType | undefined>(undefined);

export const ConsultationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadConsultations();
    }
  }, [user]);

  const loadConsultations = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const consultations = await getConsultationsByUserId(user.id, user.role);
      setConsultations(consultations);
    } catch (error) {
      console.error("Error loading consultations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const createConsultation = async (consultationData: Partial<Consultation>) => {
    try {
      setIsLoading(true);
      
      if (!user) {
        throw new Error("You must be logged in to create a consultation");
      }
      
      const { data, error } = await supabase
        .from("consultations")
        .insert({
          patient_id: user.id,
          disease: consultationData.disease || "",
          description: consultationData.description || "",
          symptoms: consultationData.symptoms || "",
          status: "pending",
          images: consultationData.images || [],
          voice_memo: consultationData.voiceMemo || null
        })
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        // Format data to match our application's Consultation type
        const newConsultation: Consultation = {
          id: data.id,
          patientId: data.patient_id,
          doctorId: data.doctor_id || undefined,
          disease: data.disease,
          description: data.description,
          symptoms: data.symptoms,
          status: data.status as ConsultationStatus,
          images: data.images || undefined,
          voiceMemo: data.voice_memo || undefined,
          createdAt: data.created_at,
          comments: []
        };
        
        // Update local state
        setConsultations(prev => [newConsultation, ...prev]);
      }
      
      toast({
        title: "Consultation created",
        description: "Your consultation has been submitted successfully.",
      });
    } catch (error) {
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getConsultationsByUserId = async (userId: string, role: UserRole): Promise<Consultation[]> => {
    let query = supabase.from("consultations").select(`
      *,
      consultation_comments (*)
    `);
    
    // For patients, return consultations where they are the patient
    if (role === UserRole.PATIENT) {
      query = query.eq("patient_id", userId);
    }
    
    // For doctors, show either their assigned consultations OR pending consultations without a doctor
    if (role === UserRole.DOCTOR) {
      // This OR condition ensures doctors see both their assigned consultations AND unassigned pending ones
      query = query.or(`doctor_id.eq.${userId},and(status.eq.${ConsultationStatus.PENDING},doctor_id.is.null)`);
    }
    
    const { data, error } = await query.order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching consultations:", error);
      return [];
    }
    
    console.log("Fetched consultations for doctor:", data);
    
    // Format data to match our application's Consultation type
    return data.map(item => ({
      id: item.id,
      patientId: item.patient_id,
      doctorId: item.doctor_id || undefined,
      disease: item.disease,
      description: item.description,
      symptoms: item.symptoms,
      status: item.status as ConsultationStatus,
      images: item.images || undefined,
      voiceMemo: item.voice_memo || undefined,
      createdAt: item.created_at,
      comments: item.consultation_comments?.map(comment => ({
        id: comment.id,
        consultationId: comment.consultation_id,
        userId: comment.user_id,
        userRole: role, // We need to query to get this accurately in a real app
        content: comment.content,
        createdAt: comment.created_at
      })) || []
    }));
  };

  const getConsultationById = async (id: string): Promise<Consultation | null> => {
    const { data, error } = await supabase
      .from("consultations")
      .select(`
        *,
        consultation_comments (*)
      `)
      .eq("id", id)
      .single();
    
    if (error) {
      console.error("Error fetching consultation:", error);
      return null;
    }
    
    // Get comments user details
    const commentsWithUserRole = await Promise.all(
      (data.consultation_comments || []).map(async (comment) => {
        // Get the user role for this comment
        const { data: userData } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", comment.user_id)
          .single();
          
        return {
          id: comment.id,
          consultationId: comment.consultation_id,
          userId: comment.user_id,
          userRole: userData?.role as UserRole,
          content: comment.content,
          createdAt: comment.created_at
        };
      })
    );
    
    // Format data to match our application's Consultation type
    return {
      id: data.id,
      patientId: data.patient_id,
      doctorId: data.doctor_id || undefined,
      disease: data.disease,
      description: data.description,
      symptoms: data.symptoms,
      status: data.status as ConsultationStatus,
      images: data.images || undefined,
      voiceMemo: data.voice_memo || undefined,
      createdAt: data.created_at,
      comments: commentsWithUserRole
    };
  };

  const updateConsultationStatus = async (id: string, status: ConsultationStatus) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from("consultations")
        .update({ status })
        .eq("id", id);
      
      if (error) throw error;
      
      // Update local state
      setConsultations(prev => 
        prev.map(consultation => 
          consultation.id === id 
            ? { ...consultation, status } 
            : consultation
        )
      );
      
      toast({
        title: "Status updated",
        description: `Consultation status has been updated to ${status}.`,
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const assignConsultation = async (consultationId: string, doctorId: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from("consultations")
        .update({ 
          doctor_id: doctorId,
          status: ConsultationStatus.IN_PROGRESS 
        })
        .eq("id", consultationId);
      
      if (error) throw error;
      
      // Update local state
      setConsultations(prev => 
        prev.map(consultation => 
          consultation.id === consultationId 
            ? { 
                ...consultation, 
                doctorId, 
                status: ConsultationStatus.IN_PROGRESS 
              } 
            : consultation
        )
      );
      
      toast({
        title: "Consultation assigned",
        description: "You have been assigned to this consultation.",
      });
    } catch (error) {
      toast({
        title: "Assignment failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const addConsultationComment = async (consultationId: string, content: string) => {
    try {
      setIsLoading(true);
      
      if (!user) {
        throw new Error("You must be logged in to add a comment");
      }
      
      const { data, error } = await supabase
        .from("consultation_comments")
        .insert({
          consultation_id: consultationId,
          user_id: user.id,
          content
        })
        .select()
        .single();
      
      if (error) throw error;
      
      if (data) {
        // Update local state
        const newComment = {
          id: data.id,
          consultationId: data.consultation_id,
          userId: data.user_id,
          userRole: user.role,
          content: data.content,
          createdAt: data.created_at
        };
        
        setConsultations(prev => 
          prev.map(consultation => 
            consultation.id === consultationId 
              ? { 
                  ...consultation, 
                  comments: [...(consultation.comments || []), newComment]
                } 
              : consultation
          )
        );
      }
      
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully.",
      });
    } catch (error) {
      toast({
        title: "Comment failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ConsultationContext.Provider
      value={{
        consultations,
        isLoading,
        createConsultation,
        getConsultationsByUserId,
        getConsultationById,
        updateConsultationStatus,
        assignConsultation,
        addConsultationComment,
      }}
    >
      {children}
    </ConsultationContext.Provider>
  );
};

export const useConsultations = () => {
  const context = useContext(ConsultationContext);
  if (context === undefined) {
    throw new Error("useConsultations must be used within a ConsultationProvider");
  }
  return context;
};
