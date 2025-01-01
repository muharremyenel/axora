import { Users, CheckSquare, FolderKanban, Users2 } from "lucide-react"
import StatsCard from "@/components/dashboard/StatsCard"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Sistem geneli istatistikler ve metrikler
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Toplam Kullanıcı"
          value={150}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Aktif Görevler"
          value={89}
          icon={CheckSquare}
          description="Bu ay oluşturulan"
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Kategoriler"
          value={24}
          icon={FolderKanban}
        />
        <StatsCard
          title="Takımlar"
          value={12}
          icon={Users2}
          description="8 aktif proje"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <div className="rounded-lg border bg-card">
            <div className="flex items-center justify-between p-6">
              <h3 className="text-lg font-medium">Son Eklenen Kullanıcılar</h3>
            </div>
            <div className="p-6 pt-0">
              {/* Kullanıcı listesi buraya gelecek */}
              <div className="text-sm text-muted-foreground">
                Henüz veri yok
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-3">
          <div className="rounded-lg border bg-card">
            <div className="flex items-center justify-between p-6">
              <h3 className="text-lg font-medium">Görev Durumları</h3>
            </div>
            <div className="p-6 pt-0">
              {/* Görev durumları grafiği buraya gelecek */}
              <div className="text-sm text-muted-foreground">
                Henüz veri yok
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 