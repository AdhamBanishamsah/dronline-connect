
import React, { useState } from "react";
import { ConsultationComment, UserRole } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ConsultationCommentsProps {
  comments: ConsultationComment[];
  onAddComment: (content: string) => Promise<void>;
  isSendingComment: boolean;
}

const ConsultationComments: React.FC<ConsultationCommentsProps> = ({
  comments,
  onAddComment,
  isSendingComment,
}) => {
  const [commentText, setCommentText] = useState("");

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await onAddComment(commentText);
      setCommentText("");
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const renderComments = () => {
    if (!comments || comments.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No comments yet.
        </div>
      );
    }

    return comments.map((comment) => (
      <div
        key={comment.id}
        className={`mb-4 ${comment.userRole === UserRole.ADMIN ? "flex justify-end" : ""}`}
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
            {comment.userRole === UserRole.PATIENT
              ? "Patient"
              : comment.userRole === UserRole.DOCTOR
              ? "Doctor"
              : "Admin"}
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
  );
};

export default ConsultationComments;
