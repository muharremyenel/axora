import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation } from "@tanstack/react-query"
import { useNavigate, useSearchParams } from "react-router-dom"
import { authService } from "@/services/authService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

const resetPasswordSchema = z.object({
  password: z.string().min(6, "En az 6 karakter olmalıdır"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Şifreler eşleşmiyor",
  path: ["confirmPassword"]
})

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema)
  })

  const mutation = useMutation({
    mutationFn: (data: ResetPasswordForm) => 
      authService.resetPassword({ token: token!, password: data.password }),
    onSuccess: () => {
      toast({
        title: "Başarılı",
        description: "Şifreniz başarıyla değiştirildi",
      })
      navigate("/login")
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Hata",
        description: error.response?.data?.message || "Bir hata oluştu",
      })
    }
  })

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Geçersiz Token</h2>
          <p className="mt-2">Şifre sıfırlama linki geçersiz.</p>
          <Button
            className="mt-4"
            onClick={() => navigate("/forgot-password")}
          >
            Yeni Link İste
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            Yeni Şifre Belirle
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit((data) => mutation.mutate(data))}>
          <div className="space-y-4">
            <div>
              <Input
                type="password"
                {...register("password")}
                placeholder="Yeni Şifre"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div>
              <Input
                type="password"
                {...register("confirmPassword")}
                placeholder="Şifre Tekrar"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Şifre Değiştiriliyor..." : "Şifreyi Değiştir"}
          </Button>
        </form>
      </div>
    </div>
  )
} 