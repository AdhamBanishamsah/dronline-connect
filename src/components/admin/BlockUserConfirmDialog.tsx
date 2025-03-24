
import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface BlockUserConfirmDialogProps {
  isOpen: boolean;
  action: "block" | "unblock" | null;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const BlockUserConfirmDialog: React.FC<BlockUserConfirmDialogProps> = ({
  isOpen,
  action,
  isLoading,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {action === "block" ? "Block User" : "Unblock User"}
          </DialogTitle>
          <DialogDescription>
            {action === "block"
              ? "Are you sure you want to block this user? They will no longer be able to use the platform."
              : "Are you sure you want to unblock this user? They will be able to use the platform again."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant={action === "block" ? "destructive" : "default"}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {action === "block" ? "Block" : "Unblock"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BlockUserConfirmDialog;
