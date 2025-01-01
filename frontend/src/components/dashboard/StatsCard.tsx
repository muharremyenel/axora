import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
}: StatsCardProps) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="mt-2">
        <p className="text-2xl font-bold">{value}</p>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        {trend && (
          <p
            className={cn(
              "mt-1 text-sm",
              trend.isPositive ? "text-green-600" : "text-red-600"
            )}
          >
            {trend.isPositive ? "+" : "-"}
            {trend.value}%
          </p>
        )}
      </div>
    </div>
  )
} 