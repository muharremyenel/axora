import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus, Trash2, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { teamService } from "@/services/teamService"
import { useAuthStore } from "@/store/useAuthStore"
import { Team } from "@/types/team"
import TeamFormDialog from "@/components/teams/TeamFormDialog"
import DeleteDialog from "@/components/common/DeleteDialog"
import { Navigate } from "react-router-dom"

export default function TeamsPage() {
  const { isAdmin, isAuthenticated } = useAuthStore()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<Team>()
  const queryClient = useQueryClient()

  const { data: teams = [], isLoading, isError, error } = useQuery({
    queryKey: ["teams"],
    queryFn: () => teamService.getTeams(),
    enabled: isAuthenticated(),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => teamService.deleteTeam(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] })
      setIsDeleteOpen(false)
      setSelectedTeam(undefined)
    },
  })

  const handleCreate = () => {
    setSelectedTeam(undefined)
    setIsFormOpen(true)
  }

  const handleEdit = (team: Team) => {
    setSelectedTeam(team)
    setIsFormOpen(true)
  }

  const handleDelete = (team: Team) => {
    setSelectedTeam(team)
    setIsDeleteOpen(true)
  }

  if (isLoading) {
    return <div>Yükleniyor...</div>
  }

  if (isError) {
    return <div>Hata: {(error as Error).message}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Takımlar</h2>
          <p className="text-muted-foreground">
            {isAdmin() ? "Takımları ve üyelerini yönetin" : "Takımları görüntüleyin"}
          </p>
        </div>
        {isAdmin() && (
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Takım
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <div key={team.id} className="rounded-lg border bg-card">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{team.name}</h3>
                <Badge variant={team.active ? "default" : "secondary"}>
                  {team.active ? "Aktif" : "Pasif"}
                </Badge>
              </div>
              {team.description && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {team.description}
                </p>
              )}
              <div className="mt-4">
                <div className="text-sm font-medium">Üyeler</div>
                <div className="mt-2 space-y-2">
                  {team.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        {member.name.charAt(0)}
                      </div>
                      <span>{member.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              {isAdmin() && (
                <div className="mt-4 flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(team)} className="flex-1">
                    Düzenle
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDelete(team)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {isAdmin() && (
        <>
          <TeamFormDialog
            open={isFormOpen}
            onOpenChange={setIsFormOpen}
            team={selectedTeam}
          />
          <DeleteDialog
            open={isDeleteOpen}
            onOpenChange={setIsDeleteOpen}
            onConfirm={() => selectedTeam && deleteMutation.mutate(selectedTeam.id)}
            title="Takımı Sil"
            description="Bu takımı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
            loading={deleteMutation.isPending}
          />
        </>
      )}
    </div>
  )
} 