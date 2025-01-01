import { toast as sonnerToast } from "sonner"

type ToastProps = {
  title: string
  description: string
}

export const toast = ({ title, description }: ToastProps) => {
  sonnerToast(title, {
    description,
  })
} 