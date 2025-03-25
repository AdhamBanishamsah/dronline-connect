
import { supabase } from "@/integrations/supabase/client";
import { Consultation, ConsultationStatus, UserRole } from "@/types";
import { formatConsultationData } from "@/utils/formatters";

export const consultationService = {
  async createConsultation(userId: string, consultationData: Partial<Consultation>): Promise<Consultation | null> {
    const { data, error } = await supabase
      .from("consultations")
      .insert({
        patient_id: userId,
        disease_id: consultationData.diseaseId,
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
      diseases (id, name_en, name_ar),
      consultation_comments (*)
    `);
    
    // For patients, return consultations where they are the patient
    if (role === UserRole.PATIENT) {
      query = query.eq("patient_id", userId);
    }
    
    // For doctors, show either their assigned consultations OR pending consultations without a doctor
    if (role === UserRole.DOCTOR) {
      // We need to use two separate queries and merge results
      // 1. Get consultations assigned to this doctor
      const { data: assignedData, error: assignedError } = await query
        .eq("doctor_id", userId)
        .order("created_at", { ascending: false });
      
      if (assignedError) {
        console.error("Error fetching assigned consultations:", assignedError);
        return [];
      }
      
      // 2. Get pending consultations with no doctor assigned
      const { data: pendingData, error: pendingError } = await supabase
        .from("consultations")
        .select(`
          *,
          diseases (id, name_en, name_ar),
          consultation_comments (*)
        `)
        .eq("status", "pending")
        .is("doctor_id", null)
        .order("created_at", { ascending: false });
      
      if (pendingError) {
        console.error("Error fetching pending consultations:", pendingError);
        return [];
      }
      
      // Combine both result sets
      const allData = [...(assignedData || []), ...(pendingData || [])];
      console.log(`Fetched ${allData.length} consultations for doctor (${userId}):`, allData);
      
      return allData.map(item => formatConsultationData(item));
    }
    
    // For admins or any other role, just return all consultations
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
        diseases (id, name_en, name_ar),
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
  },

  async updateConsultation(consultationId: string, data: Partial<Consultation>): Promise<void> {
    const updateData: any = {};
    
    if (data.images !== undefined) {
      updateData.images = data.images;
    }
    
    if (data.voiceMemo !== undefined) {
      updateData.voice_memo = data.voiceMemo;
    }
    
    if (Object.keys(updateData).length === 0) {
      return; // Nothing to update
    }
    
    const { error } = await supabase
      .from("consultations")
      .update(updateData)
      .eq("id", consultationId);
    
    if (error) throw error;
  },

  // New method to fetch all diseases
  async getAllDiseases(): Promise<any[]> {
    const { data, error } = await supabase
      .from("diseases")
      .select("*")
      .order("name_en");
    
    if (error) throw error;
    
    return data || [];
  }
};
