
export interface User {
  id: string;
  full_name: string;
  role: string;
  is_blocked: boolean;
  email?: string;
  specialty?: string;
  is_approved?: boolean;
}

export type BlockAction = "block" | "unblock" | null;

export interface ConfirmDialogState {
  isOpen: boolean;
  userId: string | null;
  action: BlockAction;
}
