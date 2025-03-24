
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useConsultations } from "@/context/ConsultationContext";
import { ConsultationStatus, UserRole, Consultation } from "@/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Send, Video } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const ConsultationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { getConsultationById, addConsultationComment, isLoading } = useConsultations();
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [commentText, setCommentText] = useState("");
  const [isSendingComment, setIsSendingComment] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);

  useEffect(() => {
    const loadConsultation = async () => {
      if (!id) return;
      
      try {
        setFetchLoading(true);
        const data = await getConsultationById(id);
        setConsultation(data);
      } catch (error) {
        console.error("Error loading consultation:", error);
      } finally {
        setFetchLoading(false);
      }
    };
    
    loadConsultation();
  }, [id, getConsultationById]);

  if (!id || !user) return null;
  
  if (fetchLoading || isLoading) {
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
        <Link to="/consultations">
          <Button variant="outline">Back to Consultations</Button>
        </Link>
      </div>
    );
  }

  const getStatusBadge = (status: ConsultationStatus) => {
    switch (status) {
      case ConsultationStatus.PENDING:
        return <span className="badge-pending">Pending</span>;
      case ConsultationStatus.IN_PROGRESS:
        return <span className="badge-in-progress">In Progress</span>;
      case ConsultationStatus.COMPLETED:
        return <span className="badge-completed">Completed</span>;
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim()) return;
    
    try {
      setIsSendingComment(true);
      await addConsultationComment(id, commentText);
      setCommentText("");
      
      // Refresh consultation data
      const updatedConsultation = await getConsultationById(id);
      setConsultation(updatedConsultation);
    } catch (error) {
      console.error("Failed to add comment:", error);
    } finally {
      setIsSendingComment(false);
    }
  };

  const renderComments = () => {
    if (!consultation.comments || consultation.comments.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No comments yet. Start the conversation with the doctor.
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
              ? "bg-medical-primary text-white rounded-tr-none" 
              : "bg-gray-100 text-gray-800 rounded-tl-none"
          }`}
        >
          <div className="text-sm mb-1">
            {comment.userRole === UserRole.PATIENT ? "You" : "Doctor"}
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
      <div className="mb-6">
        <Link to="/consultations" className="inline-flex items-center text-gray-600 hover:text-gray-900">
          <ArrowLeft size={16} className="mr-2" />
          Back to Consultations
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="p-6 border-b">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold">{consultation.disease}</h1>
            <div>{getStatusBadge(consultation.status)}</div>
          </div>
          
          <div className="text-sm text-gray-500 mb-4">
            Created {formatDistanceToNow(new Date(consultation.createdAt), { addSuffix: true })}
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
            
            {consultation.images && consultation.images.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Uploaded Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Voice Memo</h3>
                <audio controls src={consultation.voiceMemo} className="w-full" />
              </div>
            )}
          </div>
        </div>
        
        {consultation.status !== ConsultationStatus.PENDING && (
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Conversation</h2>
              {consultation.status === ConsultationStatus.IN_PROGRESS && (
                <Button className="bg-medical-primary hover:opacity-90">
                  <Video size={16} className="mr-2" />
                  Request Video Call
                </Button>
              )}
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 h-[400px] overflow-y-auto mb-4">
              {renderComments()}
            </div>
            
            {consultation.status === ConsultationStatus.IN_PROGRESS && (
              <form onSubmit={handleCommentSubmit} className="flex gap-2">
                <Textarea
                  placeholder="Type your message here..."
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
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultationDetailPage;
