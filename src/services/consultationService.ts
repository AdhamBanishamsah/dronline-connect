
import { supabase } from "@/integrations/supabase/client";
import { Consultation, ConsultationStatus, UserRole } from "@/types";
import { formatConsultationData } from "@/utils/formatters";

export const consultationService = {
  async createConsultation(userId: string, consultationData: Partial<Consultation>): Promise<Consultation | null> {
    const { data, error } = await supabase
      .from("consultations")
      .insert({
        patient_id: userId,
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
      return formatConsultationData(data);
    }
    
    return null;
  },

  async getConsultationsByUserId(userId: string, role: UserRole): Promise<Consultation[]> {
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
      // We need to use two separate filters joined with OR:
      // 1. Show consultations assigned to this doctor
      // 2. Show pending consultations that don't have a doctor assigned
      query = query.or(`doctor_id.eq.${userId},and(status.eq.pending,doctor_id.is.null)`);
      
      console.log("Doctor query condition:", `doctor_id.eq.${userId},and(status.eq.pending,doctor_id.is.null)`);
    }
    
    const { data, error } = await query.order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching consultations:", error);
      return [];
    }
    
    console.log(`Fetched ${data.length} consultations for user (${role}):`, data);
    
    return data.map(item => formatConsultationData(item));
  },

  async getConsultationById(id: string): Promise<Consultation | null> {
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
    
    const consultation = formatConsultationData(data);
    consultation.comments = commentsWithUserRole;
    
    return consultation;
  },

  async updateConsultationStatus(id: string, status: ConsultationStatus): Promise<void> {
    const { error } = await supabase
      .from("consultations")
      .update({ status })
      .eq("id", id);
    
    if (error) throw error;
  },

  async assignConsultation(consultationId: string, doctorId: string): Promise<void> {
    const { error } = await supabase
      .from("consultations")
      .update({ 
        doctor_id: doctorId,
        status: ConsultationStatus.IN_PROGRESS 
      })
      .eq("id", consultationId);
    
    if (error) throw error;
  },

  async addConsultationComment(consultationId: string, userId: string, content: string): Promise<any> {
    const { data, error } = await supabase
      .from("consultation_comments")
      .insert({
        consultation_id: consultationId,
        user_id: userId,
        content
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  }
};
