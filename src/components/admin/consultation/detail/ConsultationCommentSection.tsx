
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth"; 
import { useConsultations } from "@/context/ConsultationContext";
import { Consultation, UserRole } from "@/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

interface ConsultationCommentSectionProps {
  consultation: Consultation;
}

const ConsultationCommentSection: React.FC<ConsultationCommentSectionProps> = ({ consultation }) => {
  const { user } = useAuth();
  const { addConsultationComment } = useConsultations();
  const [commentText, setCommentText] = useState("");
  const [isSendingComment, setIsSendingComment] = useState(false);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !commentText.trim()) return;
    
    try {
      setIsSendingComment(true);
      await addConsultationComment(consultation.id, commentText, user.id);
      setCommentText("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSendingComment(false);
    }
  };

  const getRoleBadgeStyle = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return "bg-purple-100 text-purple-800 font-medium";
      case UserRole.DOCTOR:
        return "bg-green-100 text-green-800 font-medium";
      case UserRole.PATIENT:
        return "bg-blue-100 text-blue-800 font-medium";
      default:
        return "bg-gray-100 text-gray-800 font-medium";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-6">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold mb-4">Discussion</h2>
        
        <div className="space-y-4 mb-6">
          {consultation.comments && consultation.comments.length > 0 ? (
            consultation.comments.map((comment) => (
              <div key={comment.id} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between mb-2">
                  <div className="flex items-center">
                    <span className={`text-xs px-2 py-1 rounded ${getRoleBadgeStyle(comment.userRole)}`}>
                      {comment.userRole.charAt(0).toUpperCase() + comment.userRole.slice(1)}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {format(new Date(comment.createdAt), "MMM d, yyyy 'at' h:mm a")}
                  </span>
                </div>
                <p className="text-gray-800">{comment.content}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              No comments yet
            </div>
          )}
        </div>
        
        {user && (
          <form onSubmit={handleSubmitComment} className="space-y-3">
            <Textarea
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isSendingComment || !commentText.trim()}
                className="bg-medical-primary"
              >
                {isSendingComment ? "Posting..." : "Post Comment"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ConsultationCommentSection;
