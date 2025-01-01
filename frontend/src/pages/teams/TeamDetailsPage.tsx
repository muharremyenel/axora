import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { teamService } from "@/services/teamService"
import { Mail, Calendar, Pencil, Trash2 } from "lucide-react"
import { useAuthStore } from "@/store/useAuthStore"
import TeamFormDialog from "@/components/teams/TeamFormDialog"
import DeleteDialog from "@/components/common/DeleteDialog"

export default function TeamDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAdmin } = useAuthStore()
  const queryClient = useQueryClient()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const { data: team, isLoading } = useQuery({
    queryKey: ["teams", id],
    queryFn: () => teamService.getTeamById(Number(id)),
    enabled: !!id,
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => teamService.deleteTeam(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] })
      navigate("/teams")
    },
  })

  if (isLoading) {
    return <div>Yükleniyor...</div>
  }

  if (!team) {
    return <div>Takım bulunamadı</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{team.name}</h2>
          <p className="text-muted-foreground">{team.description}</p>
        </div>
        {isAdmin() && (
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setIsFormOpen(true)}>
              <Pencil className="h-4 w-4 mr-2" />
              Düzenle
            </Button>
            <Button variant="destructive" onClick={() => setIsDeleteOpen(true)}>
              <Trash2 className="h-4 w-4 mr-2" />
              Sil
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card">
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Takım Bilgileri</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant={team.active ? "default" : "secondary"}>
                  {team.active ? "Aktif" : "Pasif"}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Oluşturulma: {new Date(team.createdAt).toLocaleDateString()}</span>
              </div>
              {team.updatedAt && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Güncellenme: {new Date(team.updatedAt).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card">
          <div className="p-6">
            <h3 className="text-lg font-medium mb-4">Takım Üyeleri</h3>
            <div className="space-y-4">
              {team.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {member.email}
                      </div>
                    </div>
                  </div>
                  <Badge variant={member.role === "ROLE_ADMIN" ? "default" : "secondary"}>
                    {member.role === "ROLE_ADMIN" ? "Admin" : "Kullanıcı"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isAdmin() && (
        <>
          <TeamFormDialog
            open={isFormOpen}
            onOpenChange={setIsFormOpen}
            team={team}
          />
          <DeleteDialog
            open={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
            onConfirm={() => deleteMutation.mutate(team.id)}
            title="Takımı Sil"
            description="Bu takımı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
            loading={deleteMutation.isPending}
          />
        </>
      )}
    </div>
  )
} 