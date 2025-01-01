import { CheckSquare, Clock, AlertCircle, CheckCircle2 } from "lucide-react"
import StatsCard from "@/components/dashboard/StatsCard"

export default function UserDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Görevleriniz ve performans metrikleriniz
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Aktif Görevler"
          value={5}
          icon={CheckSquare}
          description="Devam eden"
        />
        <StatsCard
          title="Yaklaşan Teslim"
          value={2}
          icon={Clock}
          description="Bu hafta"
          trend={{ value: 2, isPositive: false }}
        />
        <StatsCard
          title="Geciken"
          value={1}
          icon={AlertCircle}
          trend={{ value: 1, isPositive: false }}
        />
        <StatsCard
          title="Tamamlanan"
          value={8}
          icon={CheckCircle2}
          description="Bu ay"
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <div className="rounded-lg border bg-card">
            <div className="flex items-center justify-between p-6">
              <h3 className="text-lg font-medium">Aktif Görevlerim</h3>
            </div>
            <div className="p-6 pt-0">
              {/* Görev listesi buraya gelecek */}
              <div className="text-sm text-muted-foreground">
                Henüz veri yok
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-3">
          <div className="rounded-lg border bg-card">
            <div className="flex items-center justify-between p-6">
              <h3 className="text-lg font-medium">Takım Aktiviteleri</h3>
            </div>
            <div className="p-6 pt-0">
              {/* Takım aktiviteleri buraya gelecek */}
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