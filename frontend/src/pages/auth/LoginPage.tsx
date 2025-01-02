import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { authService } from "@/services/authService"
import { useAuthStore } from "@/store/useAuthStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  password: z.string().min(6, "En az 6 karakter olmalıdır"),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const mutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setAuth(data.user, data.token)
      navigate("/")
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Hata",
        description: error.response?.data?.message || "Giriş yapılırken bir hata oluştu"
      })
    }
  })

  const onSubmit = (data: LoginForm) => {
    mutation.mutate(data)
  }

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    if (mutation.isError) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Lütfen önce geçerli bir e-posta adresi girin"
      });
      return;
    }
    navigate("/forgot-password");
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            Giriş Yap
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {mutation.isError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                E-posta veya şifre hatalı
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
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
            <div>
              <Input
                {...register("password")}
                type="password"
                placeholder="Şifre"
                className="w-full"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Button
                type="button"
                variant="link"
                className="text-primary hover:text-primary/90"
                onClick={handleForgotPassword}
              >
                Şifremi Unuttum
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Giriş yapılıyor..." : "Giriş Yap"}
          </Button>
        </form>
      </div>
    </div>
  )
} 