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
import { Navigate, Link } from "react-router-dom"

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
          <p className="text-muted-foreground">Takımları görüntüle ve yönet</p>
        </div>
        {isAdmin() && (
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Yeni Takım
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {teams?.map((team) => (
          <Link
            key={team.id}
            to={`/teams/${team.id}`}
            className="rounded-lg border bg-card p-6 hover:bg-accent transition-colors"
          >
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">{team.name}</h3>
                <p className="text-sm text-muted-foreground">{team.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={team.active ? "default" : "secondary"}>
                  {team.active ? "Aktif" : "Pasif"}
                </Badge>
                <Badge variant="outline">{team.members.length} Üye</Badge>
              </div>
            </div>
          </Link>
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