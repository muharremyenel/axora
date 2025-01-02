import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { authService } from "@/services/authService"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

const forgotPasswordSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
})

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const mutation = useMutation({
    mutationFn: authService.forgotPassword,
    onSuccess: () => {
      toast({
        title: "Başarılı",
        description: "Şifre sıfırlama bağlantısı e-posta adresinize gönderildi",
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

  const onSubmit = (data: ForgotPasswordForm) => {
    mutation.mutate(data)
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            Şifremi Unuttum
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input
              {...register("email")}
              type="email"
              placeholder="E-posta"
              className="w-full"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => navigate("/login")}
            >
              Geri Dön
            </Button>
            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Gönderiliyor..." : "Gönder"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 