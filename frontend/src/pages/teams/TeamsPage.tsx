import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { teamService } from "@/services/teamService"
import { useAuthStore } from "@/store/useAuthStore"
import TeamFormDialog from "@/components/teams/TeamFormDialog"
import DeleteTeamDialog from "@/components/teams/DeleteTeamDialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Plus, Trash2, Users } from "lucide-react"
import { Team } from "@/types/team"
import { formatDate } from "@/lib/utils"

export default function TeamsPage() {
  const { isAdmin } = useAuthStore()
  const [selectedTeam, setSelectedTeam] = useState<Team>()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const { data: teams = [], isLoading } = useQuery({
    queryKey: ["teams"],
    queryFn: () => teamService.getTeams(),
  })

  const handleEdit = (team: Team) => {
    setSelectedTeam(team)
    setIsFormOpen(true)
  }

  const handleDelete = (team: Team) => {
    setSelectedTeam(team)
    setIsDeleteOpen(true)
  }

  const handleCreate = () => {
    setSelectedTeam(undefined)
    setIsFormOpen(true)
  }

  if (isLoading) {
    return <div>Yükleniyor...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Takımlar</h2>
          <p className="text-muted-foreground">
            Takımları ve üyelerini yönetin
          </p>
        </div>
        {isAdmin() && (
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Takım
          </Button>
        )}
      </div>

      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs uppercase bg-muted/50">
            <tr>
              <th scope="col" className="px-6 py-3">Takım</th>
              <th scope="col" className="px-6 py-3">Açıklama</th>
              <th scope="col" className="px-6 py-3">Üyeler</th>
              <th scope="col" className="px-6 py-3">Oluşturulma Tarihi</th>
              <th scope="col" className="px-6 py-3">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team.id} className="border-b">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{team.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  {team.description}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {team.members.map((member) => (
                      <Badge key={member.id} variant="secondary">
                        {member.name}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {formatDate(team.createdAt)}
                </td>
                <td className="px-6 py-4">
                  {isAdmin() && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(team)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(team)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <TeamFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        team={selectedTeam}
      />

      {selectedTeam && (
        <DeleteTeamDialog
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          team={selectedTeam}
        />
      )}
    </div>
  )
} 