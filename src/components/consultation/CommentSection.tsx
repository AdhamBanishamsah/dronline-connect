
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Video } from "lucide-react";
import { ConsultationComment, ConsultationStatus, UserRole } from "@/types";
import { formatDistanceToNow } from "date-fns";

interface CommentSectionProps {
  comments: ConsultationComment[];
  status: ConsultationStatus;
  userRole: UserRole;
  isSendingComment: boolean;
  onCommentSubmit: (e: React.FormEvent) => Promise<void>;
  commentText: string;
  setCommentText: (text: string) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  status,
  userRole,
  isSendingComment,
  onCommentSubmit,
  commentText,
  setCommentText
}) => {
  const renderComments = () => {
    if (!comments || comments.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No comments yet. Start the conversation.
        </div>
      );
    }

    return comments.map((comment) => (
      <div 
        key={comment.id} 
        className={`mb-4 ${comment.userRole === userRole ? "flex justify-end" : ""}`}
      >
        <div 
          className={`max-w-[80%] p-3 rounded-lg ${
            comment.userRole === userRole 
              ? "bg-medical-primary text-white rounded-tr-none" 
              : "bg-gray-100 text-gray-800 rounded-tl-none"
          }`}
        >
          <div className="text-sm mb-1">
            {comment.userRole === userRole ? "You" : (comment.userRole === UserRole.DOCTOR ? "Doctor" : "Patient")}
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Conversation</h2>
        {status === ConsultationStatus.IN_PROGRESS && (
          <Button className="bg-medical-primary hover:opacity-90">
            <Video size={16} className="mr-2" />
            Request Video Call
          </Button>
        )}
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 h-[400px] overflow-y-auto mb-4">
        {renderComments()}
      </div>
      
      {status === ConsultationStatus.IN_PROGRESS && (
        <form onSubmit={onCommentSubmit} className="flex gap-2">
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
  );
};

export default CommentSection;
