import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MultiSelect } from "@/components/ui/multi-select"
import { Team } from "@/types/team"
import { teamService } from "@/services/teamService"
import { userService } from "@/services/userService"

const formSchema = z.object({
  name: z.string().min(1, "Takım adı gereklidir"),
  description: z.string().optional(),
  memberIds: z.array(z.number()).min(1, "En az bir üye seçmelisiniz"),
})

type FormValues = z.infer<typeof formSchema>

interface TeamFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  team?: Team
}

export default function TeamFormDialog({
  open,
  onOpenChange,
  team,
}: TeamFormDialogProps) {
  const queryClient = useQueryClient()

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => userService.getUsers(),
  })

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      memberIds: [],
    },
  })

  const createMutation = useMutation({
    mutationFn: (data: FormValues) => teamService.createTeam(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] })
      onOpenChange(false)
      form.reset()
    },
  })

  const updateMutation = useMutation({
    mutationFn: (data: FormValues) => teamService.updateTeam(team!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] })
      onOpenChange(false)
      form.reset()
    },
  })

  useEffect(() => {
    if (team) {
      form.reset({
        name: team.name,
        description: team.description || "",
        memberIds: team.members.map((member) => member.id),
      })
    } else {
      form.reset({
        name: "",
        description: "",
        memberIds: [],
      })
    }
  }, [team, form])

  const onSubmit = (data: FormValues) => {
    if (team) {
      updateMutation.mutate(data)
    } else {
      createMutation.mutate(data)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{team ? "Takımı Düzenle" : "Yeni Takım"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Takım Adı</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Açıklama</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="memberIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Üyeler</FormLabel>
                  <FormControl>
                    <MultiSelect
                      value={field.value}
                      onChange={field.onChange}
                      options={users.map((user) => ({
                        label: user.name,
                        value: user.id,
                      }))}
                      placeholder="Üye seçin"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                İptal
              </Button>
              <Button
                type="submit"
                disabled={
                  createMutation.isPending ||
                  updateMutation.isPending ||
                  !form.formState.isDirty
                }
              >
                {createMutation.isPending || updateMutation.isPending
                  ? "Kaydediliyor..."
                  : team
                  ? "Güncelle"
                  : "Oluştur"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 