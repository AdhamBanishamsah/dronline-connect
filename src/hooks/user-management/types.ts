
export interface User {
  id: string;
  full_name: string;
  role: string;
  is_blocked: boolean;
  specialty?: string;
  is_approved?: boolean;
  // Making email optional since it doesn't exist in the profiles table
  email?: string;
}

export type BlockAction = "block" | "unblock" | null;

export interface ConfirmDialogState {
  isOpen: boolean;
  userId: string | null;
  action: BlockAction;
}
