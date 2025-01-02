import { toast as sonnerToast } from "sonner"

export interface ToastProps {
  variant?: "default" | "destructive";
  title?: string;
  description?: string;
}

export const toast = ({ title, description }: ToastProps) => {
  sonnerToast(title, {
    description,
  })
} 