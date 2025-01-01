import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Team } from "@/types/team"
import { teamService } from "@/services/teamService"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DeleteTeamDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  team: Team
}

export default function DeleteTeamDialog({
  open,
  onOpenChange,
  team,
}: DeleteTeamDialogProps) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: () => teamService.deleteTeam(team.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teams"] })
      onOpenChange(false)
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Takımı Sil</DialogTitle>
          <DialogDescription>
            "{team.name}" takımını silmek istediğinizden emin misiniz?
            Bu işlem geri alınamaz.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            İptal
          </Button>
          <Button
            variant="destructive"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Siliniyor..." : "Sil"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 