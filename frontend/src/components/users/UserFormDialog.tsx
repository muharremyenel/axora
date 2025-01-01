import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { userService } from "@/services/userService"
import { User, UserRole } from "@/types/auth"

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User
}

const userSchema = z.object({
  name: z.string().min(1, "Ad soyad zorunludur"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  password: z.string().min(6, "Şifre en az 6 karakter olmalıdır").optional(),
  role: z.enum([UserRole.ROLE_USER, UserRole.ROLE_ADMIN]),
  active: z.boolean(),
})

type UserForm = z.infer<typeof userSchema>

export default function UserFormDialog({ open, onOpenChange, user }: UserFormDialogProps) {
  const queryClient = useQueryClient()

  const { register, handleSubmit, formState: { errors } } = useForm<UserForm>({
    resolver: zodResolver(userSchema),
    defaultValues: user ? {
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active,
    } : {
      role: UserRole.ROLE_USER,
      active: true,
    },
  })

  const createMutation = useMutation({
    mutationFn: (data: UserForm) => userService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      onOpenChange(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UserForm }) => 
      userService.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
      onOpenChange(false)
    },
  })

  const onSubmit = (data: UserForm) => {
    if (user) {
      updateMutation.mutate({ id: user.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {user ? "Kullanıcı Düzenle" : "Yeni Kullanıcı"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              {...register("name")}
              placeholder="Ad Soyad"
            />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Input
              {...register("email")}
              type="email"
              placeholder="E-posta"
            />
            {errors.email && (
              <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
            )}
          </div>

          {!user && (
            <div>
              <Input
                {...register("password")}
                type="password"
                placeholder="Şifre"
              />
              {errors.password && (
                <p className="text-sm text-destructive mt-1">{errors.password.message}</p>
              )}
            </div>
          )}

          <div>
            <Select
              {...register("role")}
              defaultValue={user?.role || UserRole.ROLE_USER}
            >
              <SelectTrigger>
                <SelectValue placeholder="Rol seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={UserRole.ROLE_USER}>Kullanıcı</SelectItem>
                <SelectItem value={UserRole.ROLE_ADMIN}>Admin</SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-destructive mt-1">{errors.role.message}</p>
            )}
          </div>

          <div>
            <Select
              {...register("active")}
              defaultValue={user?.active?.toString() || "true"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Durum seçin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Aktif</SelectItem>
                <SelectItem value="false">Pasif</SelectItem>
              </SelectContent>
            </Select>
            {errors.active && (
              <p className="text-sm text-destructive mt-1">{errors.active.message}</p>
            )}
          </div>

          <div className="flex justify-end">
            <Button type="submit">
              {user ? "Güncelle" : "Oluştur"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 