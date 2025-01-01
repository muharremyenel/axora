import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Team } from "@/types/team"
import { teamService } from "@/services/teamService"
import { userService } from "@/services/userService"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface TeamFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  team?: Team
}

const teamFormSchema = z.object({
  name: z.string().min(1, "Takım adı gerekli"),
  description: z.string().optional(),
  memberIds: z.array(z.string()).min(1, "En az bir üye seçilmeli"),
})

type TeamFormValues = z.infer<typeof teamFormSchema>

export default function TeamFormDialog({
  open,
  onOpenChange,
  team,
}: TeamFormDialogProps) {
  const queryClient = useQueryClient()
  const isEditing = !!team

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: () => userService.getUsers(),
  })

  const form = useForm<TeamFormValues>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: team ? {
      name: team.name,
      description: team.description,
      memberIds: team.members.map(member => member.id.toString()),
    } : undefined,
  })

  const mutation = useMutation({
    mutationFn: (data: TeamFormValues) => {
      const payload = {
        ...data,
        memberIds: data.memberIds.map(id => parseInt(id)),
      }
      if (isEditing && team) {
        return teamService.updateTeam(team.id, payload)
      }
      return teamService.createTeam(payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] })
      onOpenChange(false)
    },
  })

  const onSubmit = (data: TeamFormValues) => {
    mutation.mutate(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Takımı Düzenle" : "Yeni Takım"}
          </DialogTitle>
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
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      {...field}
                    />
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
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      {...field}
                    />
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
                  <Select
                    onValueChange={(value) => {
                      const currentValues = new Set(field.value || [])
                      if (currentValues.has(value)) {
                        currentValues.delete(value)
                      } else {
                        currentValues.add(value)
                      }
                      field.onChange(Array.from(currentValues))
                    }}
                    value={field.value?.[0]}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Üye seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {field.value?.map((userId) => {
                      const user = users.find(u => u.id.toString() === userId)
                      return user ? (
                        <div
                          key={userId}
                          className="flex items-center gap-1 px-2 py-1 text-sm bg-muted rounded-md"
                        >
                          {user.name}
                          <button
                            type="button"
                            onClick={() => {
                              const newValues = field.value?.filter(id => id !== userId) || []
                              field.onChange(newValues)
                            }}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            ×
                          </button>
                        </div>
                      ) : null
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                İptal
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Kaydediliyor..." : isEditing ? "Güncelle" : "Oluştur"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 